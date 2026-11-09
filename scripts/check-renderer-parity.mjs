#!/usr/bin/env node
/**
 * web 화면 코드와 desktop renderer 사본이 같은지 검사한다.
 *
 * 사용법: npm run check:parity (CI와 같은 명령)
 * 통과하면 종료 코드 0, 차이가 있으면 위반 목록을 stderr에 출력하고 종료 코드 1.
 */

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

const PAIRS = [
  {
    web: "apps/web/src",
    desktop: "apps/desktop/src/renderer/src",
    // 양쪽에 있으나 내용이 의도적으로 다른 파일
    differs: [
      "routes/router.ts", // web: createBrowserRouter / desktop: createHashRouter
      "index.css", // @source 상대 경로 깊이가 다르다
    ],
    desktopOnly: ["types/desktop.d.ts"], // preload가 노출하는 window.desktop 타입
    webOnly: [],
  },
  {
    web: "apps/web/tests/unit",
    desktop: "apps/desktop/tests/unit",
    differs: [],
    desktopOnly: ["main/", "preload/", "shared/"], // Electron main/preload/IPC 전용 테스트
    webOnly: [],
  },
];
const IGNORED_FILE_NAMES = [".DS_Store"];

function listFiles(dir, base = dir) {
  return readdirSync(dir).flatMap((name) => {
    const abs = path.join(dir, name);
    if (statSync(abs).isDirectory()) return listFiles(abs, base);
    if (IGNORED_FILE_NAMES.includes(name)) return [];
    return [path.relative(base, abs).split(path.sep).join("/")];
  });
}

const matches = (list, rel) =>
  list.some((e) => (e.endsWith("/") ? rel.startsWith(e) : rel === e));

const violations = [];
let compared = 0;

for (const pair of PAIRS) {
  const webDir = path.join(repoRoot, pair.web);
  const desktopDir = path.join(repoRoot, pair.desktop);
  const label = (rel) => `${pair.web}/${rel} ↔ ${pair.desktop}/${rel}`;

  if (!existsSync(webDir) || !existsSync(desktopDir)) {
    violations.push(`  - 디렉터리 없음: ${pair.web} ↔ ${pair.desktop}`);
    continue;
  }

  const webFiles = new Set(listFiles(webDir));
  const desktopFiles = new Set(listFiles(desktopDir));

  for (const rel of [...new Set([...webFiles, ...desktopFiles])].sort()) {
    const inWeb = webFiles.has(rel);
    const inDesktop = desktopFiles.has(rel);
    if (pair.differs.includes(rel)) {
      if (!(inWeb && inDesktop)) {
        violations.push(`  - 한쪽에만 있음(differs): ${label(rel)}`);
      }
    } else if (inWeb && inDesktop) {
      compared += 1;
      const same = readFileSync(path.join(webDir, rel)).equals(
        readFileSync(path.join(desktopDir, rel)),
      );
      if (!same) violations.push(`  - 내용 다름: ${label(rel)}`);
    } else if (inWeb && !matches(pair.webOnly, rel)) {
      violations.push(`  - web에만 있음: ${label(rel)}`);
    } else if (inDesktop && !matches(pair.desktopOnly, rel)) {
      violations.push(`  - desktop에만 있음: ${label(rel)}`);
    }
  }
}

if (violations.length > 0) {
  process.stderr.write(
    `renderer 패리티 위반 ${violations.length}건:\n${violations.join("\n")}\n` +
      "web을 고쳤다면 같은 변경을 desktop 사본에 복사한다. 의도된 차이는 이 파일의 PAIRS 예외 목록에 사유 주석과 함께 추가한다.\n",
  );
  process.exit(1);
}

process.stdout.write(
  `renderer 패리티 확인: 차이 없음 (비교한 파일 ${compared}개)\n`,
);
