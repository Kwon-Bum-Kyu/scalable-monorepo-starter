import { execFile } from "node:child_process";
import { existsSync } from "node:fs";
import { cp, lstat, mkdir, readFile } from "node:fs/promises";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

import { downloadTemplate } from "giget";

const execFileAsync = promisify(execFile);

const TEMPLATE_REPO = "Kwon-Bum-Kyu/scalable-monorepo-starter";
const EXCLUDED_NAMES = new Set(["node_modules", "dist", "dist-ssr", ".turbo", "coverage"]);

/**
 * `reason`: "tag-missing" | "network". 문구 선택은 호출자가 한다.
 */
export class FetchTemplateError extends Error {
  /**
   * @param {"tag-missing" | "network"} reason
   * @param {string} ref
   * @param {string} detail
   */
  constructor(reason, ref, detail) {
    super(detail);
    this.name = "FetchTemplateError";
    this.reason = reason;
    this.ref = ref;
    this.detail = detail;
  }
}

/** giget 3.3.1의 오류는 code가 없어 message와 cause로 가른다(T3-2). */
/**
 * @param {unknown} error
 * @returns {{ reason: "tag-missing" | "network", detail: string }}
 */
function classify(error) {
  const message = error instanceof Error ? error.message : String(error);
  const hasCause = error instanceof Error && "cause" in error && error.cause !== undefined;
  const missing = !hasCause && message.startsWith("Failed to download") && message.includes("404");
  return { reason: missing ? "tag-missing" : "network", detail: message };
}

async function readOwnVersion() {
  const path = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "package.json");
  return JSON.parse(await readFile(path, "utf8")).version;
}

/**
 * @param {string} srcDir
 * @param {string} destDir
 */
async function copyTracked(srcDir, destDir) {
  const { stdout } = await execFileAsync("git", ["ls-files", "-z"], {
    cwd: srcDir,
    maxBuffer: 64 * 1024 * 1024,
  });
  for (const file of stdout.split("\0").filter(Boolean)) {
    const from = join(srcDir, file);
    const exists = await lstat(from).then(() => true, () => false);
    if (!exists) continue; // 추적 중이지만 작업 트리에서 지워진 파일
    const to = join(destDir, file);
    await mkdir(dirname(to), { recursive: true });
    await cp(from, to, { verbatimSymlinks: true });
  }
}

/**
 * @param {string} srcDir
 * @param {string} destDir
 */
async function copyAll(srcDir, destDir) {
  await cp(srcDir, destDir, {
    recursive: true,
    verbatimSymlinks: true,
    filter: (source) => !EXCLUDED_NAMES.has(basename(source)),
  });
}

/**
 * @param {{ destDir: string, env?: NodeJS.ProcessEnv, download?: typeof downloadTemplate }} options
 * @returns {Promise<{ ref: string, devLine: string | null }>}
 */
export async function fetchTemplate({ destDir, env = process.env, download = downloadTemplate }) {
  const localDir = env.STARTER_TEMPLATE_DIR;
  if (localDir) {
    await (existsSync(join(localDir, ".git")) ? copyTracked : copyAll)(localDir, destDir);
    return { ref: localDir, devLine: `개발용 템플릿을 사용합니다: ${localDir}` };
  }

  const devRef = env.STARTER_TEMPLATE_REF;
  const ref = devRef || `v${await readOwnVersion()}`;
  try {
    await download(`github:${TEMPLATE_REPO}#${ref}`, { dir: destDir, silent: true });
  } catch (error) {
    const { reason, detail } = classify(error);
    throw new FetchTemplateError(reason, ref, detail);
  }
  return { ref, devLine: devRef ? `개발용 템플릿을 사용합니다: ${devRef}` : null };
}
