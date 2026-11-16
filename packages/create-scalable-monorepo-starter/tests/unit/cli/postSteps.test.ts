import { describe, expect, it } from "vitest";

import {
  extractNpmErrorLines,
  GIT_WARNING,
  runCommand,
  runPostSteps,
} from "../../../src/cli/postSteps.mjs";

type Call = { command: string; args: string[]; cwd: string };
type Result = { code: number | null; output: string };

function fakeRunner(results: Record<string, Result> = {}) {
  const calls: Call[] = [];
  const run = async (command: string, args: string[], cwd: string): Promise<Result> => {
    calls.push({ command, args, cwd });
    return results[[command, ...args].join(" ")] ?? { code: 0, output: "" };
  };
  return { calls, run };
}

const NPM_FAIL = [
  "npm error code E404",
  "npm warn deprecated x@1.0.0: old",
  "npm error 404 Not Found - GET https://registry.npmjs.org/zz",
  "A complete log of this run can be found in: /tmp/log",
].join("\n");

describe("extractNpmErrorLines", () => {
  it("npm 출력에서 npm error 접두어가 붙은 줄만 돌려준다", () => {
    expect(extractNpmErrorLines(NPM_FAIL)).toEqual([
      "npm error code E404",
      "npm error 404 Not Found - GET https://registry.npmjs.org/zz",
    ]);
  });

  it("npm error 줄이 없을 때 빈 배열을 돌려준다", () => {
    expect(extractNpmErrorLines("something else\n")).toEqual([]);
  });
});

describe("runPostSteps", () => {
  it("기본 설정일 때 npm install과 git 세 명령을 대상 폴더에서 순서대로 실행한다", async () => {
    const { calls, run } = fakeRunner();
    const result = await runPostSteps({ cwd: "/t/app", install: true, git: true, run });
    expect(result).toEqual({ warnings: [] });
    expect(calls.map((c) => [c.command, ...c.args])).toEqual([
      ["npm", "install"],
      ["git", "init"],
      ["git", "add", "-A"],
      ["git", "commit", "-m", "chore: 프로젝트 초기화"],
    ]);
    expect(calls.every((c) => c.cwd === "/t/app")).toBe(true);
  });

  it("설치가 실패할 때 npm error 줄을 담은 오류를 던지고 git을 실행하지 않는다", async () => {
    const { calls, run } = fakeRunner({ "npm install": { code: 1, output: NPM_FAIL } });
    await expect(
      runPostSteps({ cwd: "/t/app", install: true, git: true, run }),
    ).rejects.toMatchObject({
      name: "InstallError",
      npmErrorLines: [
        "npm error code E404",
        "npm error 404 Not Found - GET https://registry.npmjs.org/zz",
      ],
    });
    expect(calls.map((c) => c.command)).toEqual(["npm"]);
  });

  it("--no-install일 때 설치를 실행하지 않는다", async () => {
    const { calls, run } = fakeRunner();
    await runPostSteps({ cwd: "/t/app", install: false, git: true, run });
    expect(calls.some((c) => c.command === "npm")).toBe(false);
    expect(calls.some((c) => c.command === "git")).toBe(true);
  });

  it("--no-git일 때 git을 실행하지 않는다", async () => {
    const { calls, run } = fakeRunner();
    await runPostSteps({ cwd: "/t/app", install: true, git: false, run });
    expect(calls.map((c) => c.command)).toEqual(["npm"]);
  });

  it("git이 없을 때 경고만 돌려주고 성공으로 끝난다", async () => {
    const { calls, run } = fakeRunner({ "git init": { code: null, output: "" } });
    const result = await runPostSteps({ cwd: "/t/app", install: false, git: true, run });
    expect(result).toEqual({ warnings: [GIT_WARNING] });
    expect(calls).toHaveLength(1);
  });

  it("git commit이 실패할 때 경고만 돌려준다", async () => {
    const { run } = fakeRunner({
      "git commit -m chore: 프로젝트 초기화": { code: 128, output: "no identity" },
    });
    const result = await runPostSteps({ cwd: "/t/app", install: false, git: true, run });
    expect(result.warnings).toEqual([GIT_WARNING]);
  });

  it("GIT_WARNING이 PRD 문장과 같다", () => {
    expect(GIT_WARNING).toBe(
      "git 저장소를 만들지 못했습니다. 필요하면 직접 git init 을 실행해 주세요.",
    );
  });
});

describe("runCommand", () => {
  it("명령이 0으로 끝날 때 종료 코드와 stdout, stderr를 합친 출력을 돌려준다", async () => {
    const result = await runCommand(
      process.execPath,
      ["-e", "process.stdout.write('a');process.stderr.write('b')"],
      process.cwd(),
    );
    expect(result.code).toBe(0);
    expect(result.output).toContain("a");
    expect(result.output).toContain("b");
  });

  it("명령이 0이 아닌 코드로 끝날 때 그 코드를 돌려준다", async () => {
    const result = await runCommand(process.execPath, ["-e", "process.exit(3)"], process.cwd());
    expect(result.code).toBe(3);
  });

  it("명령이 없을 때 종료 코드 null을 돌려준다", async () => {
    const result = await runCommand("zz-no-such-command-93817", [], process.cwd());
    expect(result.code).toBeNull();
  });
});
