import { spawnSync } from "node:child_process";
import { appendFileSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const TAG_PATTERN =
  /^v(\d+\.\d+\.\d+(?:-[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?)$/;

/**
 * @param {{
 *   tag: string,
 *   rootVersion: string,
 *   cliVersion: string,
 *   repository: string,
 *   repositoryUrl: string,
 *   tagInMain: boolean,
 * }} input
 * @returns {{ errors: string[], prerelease: boolean }}
 */
export function checkReleaseVersions(input) {
  const match = TAG_PATTERN.exec(input.tag);
  if (!match) {
    return {
      errors: [
        `태그 형식 불일치: 기대값 vX.Y.Z 또는 프리릴리스, 실제값 ${input.tag}`,
      ],
      prerelease: false,
    };
  }

  const tagVersion = /** @type {string} */ (match[1]);
  const expectedRepositoryUrl = `git+https://github.com/${input.repository}.git`;
  const errors = [];
  if (input.rootVersion !== tagVersion) {
    errors.push(
      `루트 package.json version 불일치: 기대값 ${tagVersion}, 실제값 ${input.rootVersion}`,
    );
  }
  if (input.cliVersion !== tagVersion) {
    errors.push(
      `CLI package.json version 불일치: 기대값 ${tagVersion}, 실제값 ${input.cliVersion}`,
    );
  }
  if (input.repositoryUrl !== expectedRepositoryUrl) {
    errors.push(
      `CLI package.json repository.url 불일치: 기대값 ${expectedRepositoryUrl}, 실제값 ${input.repositoryUrl}`,
    );
  }
  if (!input.tagInMain) {
    errors.push(
      "태그 커밋 불일치: 기대값 origin/main 이력에 포함, 실제값 포함되지 않음",
    );
  }

  return {
    errors,
    prerelease: tagVersion.split("+", 1)[0].includes("-"),
  };
}

/**
 * @param {string} tag
 * @param {(command: string, args: string[]) => {
 *   status: number | null,
 *   stderr?: string | Buffer,
 * }} [runGit]
 * @returns {boolean}
 */
export function isTagInMain(
  tag,
  runGit = (command, args) =>
    spawnSync(command, args, { encoding: "utf8", stdio: "pipe" }),
) {
  const result = runGit("git", [
    "merge-base",
    "--is-ancestor",
    tag,
    "origin/main",
  ]);
  if (result.status === 0) return true;
  if (result.status === 1) return false;

  const stderr = String(result.stderr ?? "").trim();
  throw new Error(stderr || `git 종료 코드 ${String(result.status)}`);
}

/**
 * @param {string} path
 * @param {string} field
 * @returns {string}
 */
function readPackageField(path, field) {
  const value = /** @type {Record<string, unknown>} */ (
    JSON.parse(readFileSync(path, "utf8"))
  )[field];
  if (typeof value !== "string") {
    throw new Error(`${path}의 ${field} 값이 문자열이 아닙니다.`);
  }
  return value;
}

/**
 * @param {string} path
 * @returns {string}
 */
function readRepositoryUrl(path) {
  const repository = /** @type {{ repository?: { url?: unknown } }} */ (
    JSON.parse(readFileSync(path, "utf8"))
  ).repository;
  if (typeof repository?.url !== "string") {
    throw new Error(`${path}의 repository.url 값이 문자열이 아닙니다.`);
  }
  return repository.url;
}

/** @returns {void} */
function main() {
  const tag = process.argv[2];
  // GitHub Actions가 저장소 이름을 주입한다.
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  const repository = process.argv[3] ?? process.env.GITHUB_REPOSITORY;
  if (!tag || !repository) {
    process.stderr.write(
      "사용법: node scripts/checkReleaseVersions.mjs <태그> [소유자/저장소]\n",
    );
    process.exitCode = 1;
    return;
  }

  try {
    const scriptDirectory = dirname(fileURLToPath(import.meta.url));
    const cliPackagePath = resolve(scriptDirectory, "..", "package.json");
    const rootPackagePath = resolve(scriptDirectory, "../../..", "package.json");
    const result = checkReleaseVersions({
      tag,
      repository,
      rootVersion: readPackageField(rootPackagePath, "version"),
      cliVersion: readPackageField(cliPackagePath, "version"),
      repositoryUrl: readRepositoryUrl(cliPackagePath),
      tagInMain: isTagInMain(tag),
    });

    if (result.errors.length > 0) {
      process.stderr.write(`${result.errors.join("\n")}\n`);
      process.exitCode = 1;
      return;
    }

    const output = `prerelease=${String(result.prerelease)}\n`;
    // GitHub Actions가 step 출력을 기록할 파일을 주입한다.
    // eslint-disable-next-line turbo/no-undeclared-env-vars
    const githubOutput = process.env.GITHUB_OUTPUT;
    if (githubOutput) {
      appendFileSync(githubOutput, output);
    } else {
      process.stdout.write(output);
    }
  } catch (error) {
    process.stderr.write(
      `릴리스 버전 검사 실패: ${error instanceof Error ? error.message : String(error)}\n`,
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
