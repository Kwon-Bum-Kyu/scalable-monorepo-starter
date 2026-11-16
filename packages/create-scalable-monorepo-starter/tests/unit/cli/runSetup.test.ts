import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { runSetup } from "../../../src/cli/runSetup.mjs";

let workDir = "";

/** 임시 폴더에 가짜 run.mjs를 두고 인자를 JSON으로 되돌려 받는다. */
function writeFakeSetup(body: string) {
  const dir = path.join(
    workDir,
    "packages/create-scalable-monorepo-starter/src/setup",
  );
  mkdirSync(dir, { recursive: true });
  writeFileSync(path.join(dir, "run.mjs"), body);
}

const baseInput = () => ({
  workDir,
  npmName: "my-app",
  displayName: "My App",
  apps: ["api", "web"],
  removedApps: ["desktop", "storybook"],
  removeExamples: false,
  dryRun: false,
});

beforeEach(() => {
  workDir = mkdtempSync(path.join(tmpdir(), "run-setup-"));
});

afterEach(() => {
  rmSync(workDir, { recursive: true, force: true });
});

describe("runSetup", () => {
  it("setup이 종료 코드 0으로 끝날 때 출력을 버리고 진행 줄 목록을 돌려준다", async () => {
    writeFakeSetup(`process.stdout.write("처리 결과: 지운 경로 3개\\n");`);

    const result = await runSetup(baseInput());

    expect(result).toEqual({
      ok: true,
      output: "",
      lines: [
        "선택하지 않은 앱을 정리했습니다 (desktop, storybook)",
        "프로젝트 이름을 반영했습니다 (my-app)",
        ".env 파일을 만들었습니다",
      ],
    });
  });

  it("setup이 0이 아닌 코드로 끝날 때 받아 둔 출력을 그대로 돌려준다", async () => {
    writeFakeSetup(
      `process.stdout.write("out\\n"); process.stderr.write("err\\n"); process.exit(1);`,
    );

    const result = await runSetup(baseInput());

    expect(result.ok).toBe(false);
    expect(result.output).toBe("out\nerr\n");
    expect(result.lines).toEqual([]);
  });

  it("dry-run일 때 setup 출력을 그대로 돌려준다", async () => {
    writeFakeSetup(
      `process.stdout.write(process.argv.includes("--dry-run") ? "[dry-run] 지울 경로: 2개\\n" : "no");`,
    );

    const result = await runSetup({ ...baseInput(), dryRun: true });

    expect(result).toEqual({
      ok: true,
      output: "[dry-run] 지울 경로: 2개\n",
      lines: [],
    });
  });

  it("setup에 이름, 표시 이름, 앱 목록, examples 제거 플래그를 넘긴다", async () => {
    writeFakeSetup(
      `process.stderr.write(JSON.stringify(process.argv.slice(2))); process.exit(1);`,
    );

    const result = await runSetup({ ...baseInput(), removeExamples: true });

    expect(JSON.parse(result.output)).toEqual([
      "--name",
      "my-app",
      "--display-name",
      "My App",
      "--apps",
      "api,web",
      "--remove-examples",
    ]);
  });

  it("examples를 제거하지 않을 때 진행 줄에 예제 코드 제거 줄이 없다", async () => {
    writeFakeSetup("");

    const { lines } = await runSetup(baseInput());

    expect(lines).not.toContain("예제 코드를 제거했습니다");
  });

  it("examples를 제거할 때 이름 반영 줄 다음에 예제 코드 제거 줄이 나온다", async () => {
    writeFakeSetup("");

    const { lines } = await runSetup({ ...baseInput(), removeExamples: true });

    expect(lines.slice(1)).toEqual([
      "프로젝트 이름을 반영했습니다 (my-app)",
      "예제 코드를 제거했습니다",
      ".env 파일을 만들었습니다",
    ]);
  });

  it("모든 앱을 선택했을 때 앱 정리 줄이 없다", async () => {
    writeFakeSetup("");

    const { lines } = await runSetup({ ...baseInput(), removedApps: [] });

    expect(lines[0]).toBe("프로젝트 이름을 반영했습니다 (my-app)");
  });
});
