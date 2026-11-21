import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const REQUIRED_FILES = [
  "package.json",
  "README.md",
  "LICENSE",
  "starter.manifest.json",
];

/**
 * @param {string[]} files
 * @returns {string[]}
 */
export function checkPackFiles(files) {
  const errors = files
    .filter(
      (file) => !REQUIRED_FILES.includes(file) && !file.startsWith("src/"),
    )
    .map((file) => `허용되지 않은 파일: ${file}`);

  for (const requiredFile of REQUIRED_FILES) {
    if (!files.includes(requiredFile)) {
      errors.push(`필수 파일 누락: ${requiredFile}`);
    }
  }
  return errors;
}

/**
 * @param {string} input
 * @returns {string[]}
 */
export function parsePackFiles(input) {
  const result = /** @type {unknown} */ (JSON.parse(input));
  if (!Array.isArray(result) || result.length !== 1) {
    throw new Error("npm pack JSON은 패키지 하나를 포함해야 합니다.");
  }

  const files = /** @type {{ files?: unknown }} */ (result[0]).files;
  if (!Array.isArray(files)) {
    throw new Error("npm pack JSON에 files 배열이 없습니다.");
  }

  return files.map((file) => {
    const path = /** @type {{ path?: unknown }} */ (file).path;
    if (typeof path !== "string") {
      throw new Error("npm pack JSON의 파일 path가 문자열이 아닙니다.");
    }
    return path;
  });
}

/** @returns {void} */
function main() {
  try {
    const inputPath = process.argv[2];
    const input = readFileSync(inputPath ? resolve(inputPath) : 0, "utf8");
    const errors = checkPackFiles(parsePackFiles(input));
    if (errors.length > 0) {
      process.stderr.write(`${errors.join("\n")}\n`);
      process.exitCode = 1;
    }
  } catch (error) {
    process.stderr.write(
      `패키지 파일 검사 실패: ${error instanceof Error ? error.message : String(error)}\n`,
    );
    process.exitCode = 1;
  }
}

if (
  process.argv[1] &&
  pathToFileURL(resolve(process.argv[1])).href === import.meta.url
) {
  main();
}
