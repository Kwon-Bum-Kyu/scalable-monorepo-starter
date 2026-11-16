import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { displayWidth } from "../../../src/cli/displayWidth.mjs";
import { parseFailureLines, preflight } from "../../../src/cli/preflight.mjs";

const APPS = [{ id: "api" }, { id: "web" }, { id: "desktop" }, { id: "storybook" }];

let base: string;

beforeEach(() => {
  base = fs.mkdtempSync(path.join(os.tmpdir(), "preflight-test-"));
});

afterEach(() => {
  fs.rmSync(base, { recursive: true, force: true });
});

function run(overrides: Record<string, unknown> = {}, argOverrides: Record<string, unknown> = {}) {
  return preflight({
    args: { name: "my-app", apps: ["api"], yes: false, ...argOverrides },
    apps: APPS,
    isTTY: true,
    nodeVersion: "v22.13.0",
    userAgent: "npm/10.9.7 node/v22.13.0 darwin arm64",
    cwd: base,
    ...overrides,
  } as Parameters<typeof preflight>[0]);
}

function failure(result: ReturnType<typeof preflight>) {
  if (result.ok) throw new Error("실패여야 합니다.");
  return result;
}

describe("preflight", () => {
  it("모든 조건을 만족할 때 첫 줄을 출력해도 된다고 돌려준다", () => {
    expect(run()).toEqual({ ok: true });
  });

  it("Node가 22.13 미만일 때 현재 버전을 담은 오류와 종료 코드 1을 돌려준다", () => {
    expect(failure(run({ nodeVersion: "v20.11.0" }))).toEqual({
      ok: false,
      lines: ["Node.js 22.13 이상이 필요합니다. 현재 버전: v20.11.0"],
      exitCode: 1,
    });
  });

  it("Node가 22.12일 때 실패하고 22.13과 23 이상은 통과한다", () => {
    expect(run({ nodeVersion: "v22.12.9" }).ok).toBe(false);
    expect(run({ nodeVersion: "v23.0.0" }).ok).toBe(true);
  });

  it("터미널이 아닌데 이름이 없을 때 두 줄 오류와 종료 코드 1을 돌려준다", () => {
    expect(failure(run({ isTTY: false }, { name: undefined }))).toEqual({
      ok: false,
      lines: [
        "대화형으로 실행할 수 없는 환경입니다.",
        "프로젝트 이름을 지정하고, --apps 를 지정하거나 --yes 를 붙여 주세요.",
      ],
      exitCode: 1,
    });
  });

  it("터미널이 아니고 --apps와 --yes가 모두 없을 때 두 줄 오류와 종료 코드 1을 돌려준다", () => {
    const result = failure(run({ isTTY: false }, { apps: undefined }));
    expect(result.lines[0]).toBe("대화형으로 실행할 수 없는 환경입니다.");
    expect(result.exitCode).toBe(1);
  });

  it("터미널이 아니고 --yes만 있고 이름이 없을 때 종료 코드 1이다", () => {
    const result = failure(run({ isTTY: false }, { name: undefined, apps: undefined, yes: true }));
    expect(result.exitCode).toBe(1);
  });

  it("터미널이 아니고 이름과 --yes가 있을 때 통과한다", () => {
    expect(run({ isTTY: false }, { apps: undefined, yes: true }).ok).toBe(true);
  });

  it("터미널에서 --yes만 주고 이름이 없을 때 오류 없이 통과한다", () => {
    expect(run({}, { name: undefined, apps: undefined, yes: true }).ok).toBe(true);
  });

  it("알 수 없는 앱 id를 줄 때 선택할 수 있는 앱 목록을 담은 오류와 종료 코드 1을 돌려준다", () => {
    expect(failure(run({}, { apps: ["api", "mobile"] }))).toEqual({
      ok: false,
      lines: ["알 수 없는 앱입니다: mobile. 선택할 수 있는 앱: api, web, desktop, storybook"],
      exitCode: 1,
    });
  });

  it("명령에 붙인 이름의 폴더가 비어 있지 않을 때 다시 실행해 달라는 끝맺음의 오류와 종료 코드 1을 돌려준다", () => {
    fs.mkdirSync(path.join(base, "my-app"));
    fs.writeFileSync(path.join(base, "my-app", "a.txt"), "x");
    expect(failure(run())).toEqual({
      ok: false,
      lines: ['"my-app" 폴더가 이미 있고 비어 있지 않습니다. 다른 이름으로 다시 실행해 주세요.'],
      exitCode: 1,
    });
  });

  it("명령에 붙인 이름의 폴더가 비어 있을 때 통과한다", () => {
    fs.mkdirSync(path.join(base, "my-app"));
    expect(run().ok).toBe(true);
  });

  it("명령에 붙인 이름이 규칙에 맞지 않을 때 다시 실행해 달라는 두 줄과 종료 코드 1을 돌려준다", () => {
    expect(failure(run({}, { name: "!!!" }))).toEqual({
      ok: false,
      lines: [
        "영문 소문자, 숫자, 하이픈으로 바꿀 수 있는 이름으로 다시 실행해 주세요.",
        "예: npm create scalable-monorepo-starter@latest my-app",
      ],
      exitCode: 1,
    });
  });

  it("명령에 붙인 이름이 빈 값일 때 규칙 위반의 두 줄과 종료 코드 1을 돌려준다", () => {
    const result = failure(run({}, { name: "" }));
    expect(result.lines[0]).toBe("영문 소문자, 숫자, 하이픈으로 바꿀 수 있는 이름으로 다시 실행해 주세요.");
    expect(result.lines).toHaveLength(2);
    expect(result.exitCode).toBe(1);
  });

  it("명령에 붙인 이름이 예약어일 때 규칙 위반의 두 줄을 돌려준다", () => {
    expect(failure(run({}, { name: "node_modules" })).lines).toHaveLength(2);
  });

  it("명령에 붙인 이름이 스코프일 때 이름만 넣어 다시 실행해 달라는 문장과 종료 코드 1을 돌려준다", () => {
    expect(failure(run({}, { name: "@org/app" }))).toEqual({
      ok: false,
      lines: ["스코프(@org/)는 지원하지 않습니다. 이름만 넣어 다시 실행해 주세요."],
      exitCode: 1,
    });
  });

  it("npm 버전이 10 미만일 때 안내를 돌려준다", () => {
    const result = failure(run({ userAgent: "npm/8.19.4 node/v22.13.0 darwin arm64" }));
    expect(result.lines).toEqual(["npm 10 이상이 필요합니다. 현재 버전: 8.19.4"]);
    expect(result.exitCode).toBe(1);
  });

  it("npm 버전을 알 수 없을 때 검사를 건너뛴다", () => {
    expect(run({ userAgent: undefined }).ok).toBe(true);
    expect(run({ userAgent: "pnpm/9.0.0" }).ok).toBe(true);
  });

  it("모든 오류 줄이 80열 이하이다", () => {
    const results = [
      run({ nodeVersion: "v20.11.0" }),
      run({ isTTY: false }, { name: undefined }),
      run({}, { apps: ["mobile"] }),
      run({}, { name: "" }),
      run({}, { name: "@org/app" }),
      run({ userAgent: "npm/8.19.4" }),
    ];
    for (const result of results) {
      for (const line of failure(result).lines) {
        expect(displayWidth(line)).toBeLessThanOrEqual(80);
      }
    }
  });
});

describe("parseFailureLines", () => {
  it("알 수 없는 옵션일 때 옵션 이름을 넣은 두 줄을 만든다", () => {
    const message =
      "Unknown option '--foo'. To specify a positional argument starting with a '-', place it at the end of the command after '--', as in '-- \"--foo\"";

    expect(parseFailureLines({ ok: false, reason: "invalid-option", message })).toEqual([
      "알 수 없는 옵션입니다: --foo",
      "사용할 수 있는 옵션은 --help 로 확인해 주세요.",
    ]);
  });

  it("값이 빠진 옵션일 때 값 표시를 뺀 옵션 이름을 넣은 두 줄을 만든다", () => {
    const message = "Option '--apps <value>' argument missing";

    expect(parseFailureLines({ ok: false, reason: "invalid-option", message })[0]).toBe(
      "알 수 없는 옵션입니다: --apps",
    );
  });

  it("위치 인자가 둘 이상일 때 한 줄을 만든다", () => {
    expect(parseFailureLines({ ok: false, reason: "too-many-positionals" })).toEqual([
      "프로젝트 이름은 하나만 지정해 주세요.",
    ]);
  });

  it("examples 플래그가 충돌할 때 한 줄을 만든다", () => {
    expect(parseFailureLines({ ok: false, reason: "conflicting-examples" })).toEqual([
      "--remove-examples 와 --keep-examples 는 함께 쓸 수 없습니다.",
    ]);
  });
});
