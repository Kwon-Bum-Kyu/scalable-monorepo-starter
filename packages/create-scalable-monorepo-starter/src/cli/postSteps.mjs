import { spawn } from "node:child_process";

export const GIT_WARNING =
  "git 저장소를 만들지 못했습니다. 필요하면 직접 git init 을 실행해 주세요.";

const NPM_ERROR_PREFIX = "npm error";
const COMMIT_MESSAGE = "chore: 프로젝트 초기화";
const GIT_COMMANDS = [
  ["init"],
  ["add", "-A"],
  ["commit", "-m", COMMIT_MESSAGE],
];

/**
 * @typedef {{ code: number | null, output: string }} CommandResult
 * @typedef {(command: string, args: string[], cwd: string, signal?: AbortSignal) => Promise<CommandResult>} CommandRunner
 */

export class InstallError extends Error {
  /** @param {string[]} npmErrorLines */
  constructor(npmErrorLines) {
    super("npm install failed");
    this.name = "InstallError";
    this.npmErrorLines = npmErrorLines;
  }
}

/**
 * npm 10은 설치 실패 원인을 stderr에 `npm error` 접두어로 출력한다.
 * @param {string} output
 * @returns {string[]}
 */
export function extractNpmErrorLines(output) {
  return output.split(/\r?\n/u).filter((line) => line.startsWith(NPM_ERROR_PREFIX));
}

/**
 * 자식 프로세스를 실행해 종료 코드와 출력을 모은다. 실행 파일이 없거나 signal로 중단되면 code가 null이다.
 * @type {CommandRunner}
 */
export function runCommand(command, args, cwd, signal) {
  return new Promise((resolve) => {
    const child = spawn(command, args, { cwd, stdio: ["ignore", "pipe", "pipe"], signal });
    let output = "";
    let failed = false;
    /** @param {Buffer} chunk */
    const collect = (chunk) => {
      output += chunk.toString();
    };
    child.stdout.on("data", collect);
    child.stderr.on("data", collect);
    child.on("error", () => {
      failed = true;
    });
    child.on("close", (code) => resolve({ code: failed ? null : code, output }));
  });
}

/**
 * 설치 실패는 InstallError로 던지고, git 실패는 경고로 돌려준다.
 * @param {{ cwd: string, install: boolean, git: boolean, run?: CommandRunner, signal?: AbortSignal }} options
 * @returns {Promise<{ warnings: string[] }>}
 */
export async function runPostSteps({ cwd, install, git, run = runCommand, signal }) {
  if (install) {
    const result = await run("npm", ["install"], cwd, signal);
    if (result.code !== 0) {
      throw new InstallError(extractNpmErrorLines(result.output));
    }
  }
  if (git) {
    for (const args of GIT_COMMANDS) {
      const result = await run("git", args, cwd, signal);
      if (result.code !== 0) {
        return { warnings: [GIT_WARNING] };
      }
    }
  }
  return { warnings: [] };
}
