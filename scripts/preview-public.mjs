#!/usr/bin/env node
/**
 * preview-public.mjs — prod 배포본 미리보기.
 *
 * 외부 사용자가 `npx degit` 으로 받는 것과 동일한 트리(= git 추적 스냅샷)를
 * 임시 디렉터리에 풀어 실물로 확인한다. `.gitignore` 된 `*.local` 메인테이너
 * 자산(하네스 룰·에이전트·스킬·설정)은 추적되지 않으므로 이 트리에 포함되지 않는다.
 *
 * dev 버전(현재 working tree)과 prod 버전(배포본)의 경계를 눈으로 보기 위한 도구.
 * 파일 단위 분리만 확인한다. 본문(파일 내용) 누수까지 검증하려면:
 *   npm run check:public-release
 *
 * 사용법:
 *   npm run preview:public                       # HEAD 기준
 *   node scripts/preview-public.mjs origin/main  # 실제 배포 ref(기본 브랜치) 기준
 *
 * 산출: .preview-public/  (gitignore 됨, 매 실행 시 새로 생성)
 */

import { execFileSync, execSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const outDir = path.join(repoRoot, ".preview-public");

const ref = process.argv.slice(2).find((arg) => !arg.startsWith("-")) ?? "HEAD";

/**
 * @param {string[]} args
 * @returns {string}
 */
function git(args) {
  return execFileSync("git", args, { cwd: repoRoot, encoding: "utf8" });
}

/** prod(배포본)에 나가는 파일 목록에서 디렉터리별 개수를 세는 헬퍼. */
function countTracked(files, pattern) {
  return files.filter((file) => pattern.test(file)).length;
}

/** dev(working tree)의 디렉터리 항목 수를 세는 헬퍼. */
function countDisk(rel, predicate) {
  const abs = path.join(repoRoot, rel);
  if (!existsSync(abs)) return 0;
  return readdirSync(abs, { withFileTypes: true }).filter(predicate).length;
}

// 1) ref 검증
try {
  git(["rev-parse", "--verify", "--quiet", ref]);
} catch {
  console.error(`[preview-public] 알 수 없는 ref: ${ref}`);
  process.exit(1);
}

// 2) 이전 산출 정리 후 재생성
rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

// 3) git archive 로 추적 스냅샷을 풀기 (= degit 이 가져가는 것과 동일)
console.log(`[preview-public] ref=${ref} 의 prod 트리를 .preview-public/ 에 추출`);
execSync(`git archive ${ref} | tar -x -C "${outDir}"`, {
  cwd: repoRoot,
  stdio: "inherit",
});

// 4) prod 파일 목록 분석
const prodFiles = git(["ls-tree", "-r", "--name-only", ref]).split("\n").filter(Boolean);
const localLeak = prodFiles.filter((file) => /\.local(\.|\/|$)/.test(file));

const prodSkills = new Set();
for (const file of prodFiles) {
  const matched = file.match(/^\.claude\/skills\/([^/]+)\//);
  if (matched) prodSkills.add(matched[1]);
}

const rows = [
  {
    area: ".claude/agents",
    dev: countDisk(".claude/agents", (entry) => entry.isFile() && entry.name.endsWith(".md")),
    prod: countTracked(prodFiles, /^\.claude\/agents\/[^/]+\.md$/),
  },
  {
    area: ".claude/skills",
    dev: countDisk(".claude/skills", (entry) => entry.isDirectory()),
    prod: prodSkills.size,
  },
  {
    area: ".claude/rules",
    dev: countDisk(".claude/rules", (entry) => entry.isFile() && entry.name.endsWith(".md")),
    prod: countTracked(prodFiles, /^\.claude\/rules\/[^/]+\.md$/),
  },
  {
    area: "CLAUDE.local.md",
    dev: existsSync(path.join(repoRoot, "CLAUDE.local.md")) ? "포함" : "제외",
    prod: prodFiles.includes("CLAUDE.local.md") ? "포함" : "제외",
  },
  {
    area: ".mcp.json",
    dev: existsSync(path.join(repoRoot, ".mcp.json")) ? "포함" : "제외",
    prod: prodFiles.includes(".mcp.json") ? "포함" : "제외",
  },
];

// 5) 비교 표 출력
console.log("");
console.log(`${"영역".padEnd(20)}${"dev(로컬)".padEnd(14)}prod(배포본)`);
console.log("-".repeat(46));
for (const row of rows) {
  console.log(`${row.area.padEnd(22)}${String(row.dev).padEnd(14)}${row.prod}`);
}
console.log("");

// 6) 파일 단위 누수 판정
if (localLeak.length === 0) {
  console.log(`[OK] prod 트리에 .local 파일 0개 — 파일 단위 분리 정상 (총 ${prodFiles.length}개 추적 파일)`);
} else {
  console.log(`[경고] prod 트리에 .local 누수 ${localLeak.length}건:`);
  for (const file of localLeak) console.log(`  - ${file}`);
}

console.log("");
console.log(`산출 위치: ${path.relative(repoRoot, outDir)}/  (여기를 열면 외부인이 degit 으로 받는 그대로)`);
console.log("본문(내용) 누수 검증은 별도: npm run check:public-release");
