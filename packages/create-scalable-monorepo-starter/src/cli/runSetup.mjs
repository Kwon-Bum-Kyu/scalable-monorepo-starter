import { execFile } from "node:child_process";
import path from "node:path";

export const SETUP_PROGRESS = {
  appsCleaned: (/** @type {string[]} */ removedApps) =>
    `선택하지 않은 앱을 정리했습니다 (${removedApps.join(", ")})`,
  nameApplied: (/** @type {string} */ npmName) =>
    `프로젝트 이름을 반영했습니다 (${npmName})`,
  examplesRemoved: "예제 코드를 제거했습니다",
  envCreated: ".env 파일을 만들었습니다",
};

const SETUP_ENTRY =
  "packages/create-scalable-monorepo-starter/src/setup/run.mjs";

/**
 * 내려받은 사본의 setup을 자식 프로세스로 실행한다(4.4절 CLI 단계 8).
 * 성공하면 setup 출력을 버리고 진행 줄을 만든다. dry-run과 실패는 출력을 그대로 돌려준다.
 * @param {{
 *   workDir: string, npmName: string, displayName: string, apps: string[],
 *   removedApps: string[], removeExamples: boolean, dryRun: boolean,
 *   signal?: AbortSignal,
 * }} input
 * @returns {Promise<{ ok: boolean, output: string, lines: string[] }>}
 */
export function runSetup(input) {
  const args = [
    path.join(input.workDir, SETUP_ENTRY),
    "--name",
    input.npmName,
    "--display-name",
    input.displayName,
    "--apps",
    input.apps.join(","),
    ...(input.removeExamples ? ["--remove-examples"] : []),
    ...(input.dryRun ? ["--dry-run"] : []),
  ];
  return new Promise((resolve) => {
    let closed = false;
    /** @type {{ ok: boolean, output: string, lines: string[] } | undefined} */
    let result;
    const finish = () => {
      if (closed && result) resolve(result);
    };
    const child = execFile(
      process.execPath,
      args,
      { cwd: input.workDir, encoding: "utf8", signal: input.signal },
      (error, stdout, stderr) => {
        const output = `${stdout}${stderr}`;
        if (error) {
          result = { ok: false, output, lines: [] };
        } else if (input.dryRun) {
          result = { ok: true, output, lines: [] };
        } else {
          result = { ok: true, output: "", lines: progressLines(input) };
        }
        finish();
      },
    );
    child.on("close", () => {
      closed = true;
      finish();
    });
  });
}

/** @param {{ npmName: string, removedApps: string[], removeExamples: boolean }} input */
function progressLines(input) {
  return [
    ...(input.removedApps.length > 0
      ? [SETUP_PROGRESS.appsCleaned(input.removedApps)]
      : []),
    SETUP_PROGRESS.nameApplied(input.npmName),
    ...(input.removeExamples ? [SETUP_PROGRESS.examplesRemoved] : []),
    SETUP_PROGRESS.envCreated,
  ];
}
