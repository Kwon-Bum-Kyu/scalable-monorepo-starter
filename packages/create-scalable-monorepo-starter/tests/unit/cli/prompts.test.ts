import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { displayWidth } from "../../../src/cli/displayWidth.mjs";
import {
  askApps,
  askProjectName,
  askRemoveExamples,
} from "../../../src/cli/prompts.mjs";
import { buildSelectOptions } from "../../../src/cli/selectOptions.mjs";
import { readManifest } from "../../../src/setup/manifest.mjs";

const CANCEL = Symbol("cancel");
const manifest = readManifest();

/** 가짜 응답 함수. 질문마다 큐의 다음 답을 돌려주고 호출 인자를 기록한다. */
function fakePrompts(answers: {
  text?: unknown[];
  select?: unknown[];
  multiselect?: unknown[];
}) {
  const queues = {
    text: [...(answers.text ?? [])],
    select: [...(answers.select ?? [])],
    multiselect: [...(answers.multiselect ?? [])],
  };
  const calls = {
    text: [] as Record<string, unknown>[],
    select: [] as Record<string, unknown>[],
    multiselect: [] as Record<string, unknown>[],
  };
  const lines: string[] = [];
  const ask =
    (kind: keyof typeof queues) => async (opts: Record<string, unknown>) => {
      calls[kind].push(opts);
      return queues[kind].shift();
    };
  return {
    prompts: {
      text: ask("text"),
      select: ask("select"),
      multiselect: ask("multiselect"),
      isCancel: (value: unknown) => value === CANCEL,
      log: {
        error: (message: string) => lines.push(`error:${message}`),
        info: (message: string) => lines.push(`info:${message}`),
      },
    },
    calls,
    lines,
  };
}

let cwd: string;

beforeEach(() => {
  cwd = fs.mkdtempSync(path.join(os.tmpdir(), "prompts-test-"));
});

afterEach(() => {
  fs.rmSync(cwd, { recursive: true, force: true });
});

describe("askProjectName", () => {
  it("올바른 이름을 입력했을 때 표시 이름과 npm 이름을 돌려준다", async () => {
    const { prompts, lines } = fakePrompts({ text: ["my-app"] });
    const result = await askProjectName({ prompts, cwd });
    expect(result).toEqual({
      cancelled: false,
      displayName: "my-app",
      npmName: "my-app",
    });
    expect(lines).toEqual([]);
  });

  it("이름 입력에 자리표시 my-app만 두고 기본값은 두지 않는다", async () => {
    const { prompts, calls } = fakePrompts({ text: ["my-app"] });
    await askProjectName({ prompts, cwd });
    expect(calls.text[0].placeholder).toBe("my-app");
    expect(calls.text[0]).not.toHaveProperty("defaultValue");
  });

  it("빈 입력일 때 프로젝트 이름이 비어 있다는 오류 문구를 보이고 다시 묻는다", async () => {
    const { prompts, lines, calls } = fakePrompts({ text: ["  ", "my-app"] });
    const result = await askProjectName({ prompts, cwd });
    expect(lines).toEqual([
      "error:프로젝트 이름이 비어 있습니다. 이름을 입력해 주세요.",
    ]);
    expect(calls.text).toHaveLength(2);
    expect(result).toMatchObject({ cancelled: false, npmName: "my-app" });
  });

  it("변환 결과가 비었을 때 규칙 위반 오류 문구를 보이고 다시 묻는다", async () => {
    const { prompts, lines } = fakePrompts({ text: ["한글이름", "ok"] });
    await askProjectName({ prompts, cwd });
    expect(lines).toEqual([
      "error:영문 소문자, 숫자, 하이픈으로 바꿀 수 있는 이름을 입력해 주세요. 예: my-app",
    ]);
  });

  it("스코프를 입력했을 때 스코프 미지원 오류 문구를 보이고 다시 묻는다", async () => {
    const { prompts, lines } = fakePrompts({ text: ["@org/name", "name"] });
    await askProjectName({ prompts, cwd });
    expect(lines).toEqual([
      "error:스코프(@org/)는 지원하지 않습니다. 이름만 입력해 주세요.",
    ]);
  });

  it("폴더가 이미 있을 때 다른 이름을 입력해 달라는 끝맺음으로 다시 묻는다", async () => {
    fs.mkdirSync(path.join(cwd, "my-app"));
    fs.writeFileSync(path.join(cwd, "my-app", "a.txt"), "x");
    const { prompts, lines } = fakePrompts({ text: ["my-app", "other"] });
    const result = await askProjectName({ prompts, cwd });
    expect(lines).toEqual([
      'error:"my-app" 폴더가 이미 있고 비어 있지 않습니다. 다른 이름을 입력해 주세요.',
    ]);
    expect(result).toMatchObject({ npmName: "other" });
  });

  it("입력값이 변환으로 달라질 때 만들어질 이름을 한 번 알려 준다", async () => {
    const { prompts, lines } = fakePrompts({ text: ["My Shop"] });
    const result = await askProjectName({ prompts, cwd });
    expect(lines).toEqual([
      'info:폴더와 패키지 이름은 "my-shop"으로 만듭니다.',
    ]);
    expect(result).toEqual({
      cancelled: false,
      displayName: "My Shop",
      npmName: "my-shop",
    });
  });

  it("질문 화면에서 취소했을 때 취소 신호를 돌려준다", async () => {
    const { prompts, lines } = fakePrompts({ text: [CANCEL] });
    expect(await askProjectName({ prompts, cwd })).toEqual({ cancelled: true });
    expect(lines).toEqual([]);
  });
});

describe("askApps", () => {
  it("선택지를 buildSelectOptions의 결과 그대로 넘기고 영어 안내 줄을 끈다", async () => {
    const { prompts, calls } = fakePrompts({ multiselect: [["api"]] });
    await askApps({ prompts, manifest });
    expect(calls.multiselect[0].options).toEqual(
      buildSelectOptions(manifest.apps),
    );
    expect(calls.multiselect[0].showInstructions).toBe(false);
    expect(calls.multiselect[0].required).toBe(false);
    expect(calls.multiselect[0].message).toBe(
      "설치할 앱을 선택해 주세요. (스페이스: 선택, 엔터: 확정)",
    );
  });

  it("매니페스트의 기본 앱이 처음부터 선택되어 있다", async () => {
    const { prompts, calls } = fakePrompts({ multiselect: [["api"]] });
    await askApps({ prompts, manifest });
    expect(calls.multiselect[0].initialValues).toEqual(["api", "web"]);
  });

  it("고른 앱을 확정했을 때 앱 목록을 돌려준다", async () => {
    const { prompts, lines } = fakePrompts({ multiselect: [["api", "web"]] });
    const result = await askApps({ prompts, manifest });
    expect(result).toEqual({
      cancelled: false,
      apps: ["api", "web"],
      autoAdded: [],
    });
    expect(lines).toEqual([]);
  });

  it("아무것도 고르지 않고 확정했을 때 오류 문구를 보이고 같은 질문을 다시 한다", async () => {
    const { prompts, lines, calls } = fakePrompts({
      multiselect: [[], ["web"]],
    });
    const result = await askApps({ prompts, manifest });
    expect(lines).toEqual(["error:앱을 하나 이상 선택해야 합니다."]);
    expect(calls.multiselect).toHaveLength(2);
    expect(result).toMatchObject({ apps: ["web"] });
  });

  it("storybook만 확정했을 때 확정한 직후에 web 자동 포함 안내가 한 번 나온다", async () => {
    const { prompts, lines } = fakePrompts({ multiselect: [["storybook"]] });
    const result = await askApps({ prompts, manifest });
    expect(lines).toEqual([
      "info:storybook은 web이 필요해서 web을 함께 설치합니다.",
    ]);
    expect(result).toEqual({
      cancelled: false,
      apps: ["web", "storybook"],
      autoAdded: ["web"],
    });
  });

  it("고르는 도중에는 선택지의 web 체크 상태를 바꾸지 않는다", async () => {
    const { prompts, calls } = fakePrompts({ multiselect: [["storybook"]] });
    await askApps({ prompts, manifest });
    expect(calls.multiselect).toHaveLength(1);
    expect(calls.multiselect[0].initialValues).toEqual(["api", "web"]);
  });

  it("질문 화면에서 취소했을 때 취소 신호를 돌려준다", async () => {
    const { prompts } = fakePrompts({ multiselect: [CANCEL] });
    expect(await askApps({ prompts, manifest })).toEqual({ cancelled: true });
  });

  it("안내 문장이 80열을 넘지 않는다", async () => {
    const { prompts, lines } = fakePrompts({
      multiselect: [[], ["storybook"]],
    });
    await askApps({ prompts, manifest });
    for (const line of lines)
      expect(displayWidth(line)).toBeLessThanOrEqual(80);
  });
});

describe("askRemoveExamples", () => {
  it("api를 선택했을 때 examples를 남길지 묻고 영어 안내 줄을 끈다", async () => {
    const { prompts, calls } = fakePrompts({ select: ["keep"] });
    const result = await askRemoveExamples({ prompts, apps: ["api", "web"] });
    expect(result).toEqual({ cancelled: false, removeExamples: false });
    expect(calls.select[0].showInstructions).toBe(false);
    expect(calls.select[0].message).toBe(
      "예제 코드(Examples CRUD)를 남겨 둘까요?",
    );
    expect(calls.select[0].initialValue).toBe("keep");
  });

  it("제거한다를 골랐을 때 제거하기로 돌려준다", async () => {
    const { prompts } = fakePrompts({ select: ["remove"] });
    const result = await askRemoveExamples({ prompts, apps: ["api"] });
    expect(result).toEqual({ cancelled: false, removeExamples: true });
  });

  it("api를 선택하지 않았을 때 묻지 않고 제거 안내를 보인다", async () => {
    const { prompts, calls, lines } = fakePrompts({});
    const result = await askRemoveExamples({ prompts, apps: ["web"] });
    expect(calls.select).toHaveLength(0);
    expect(lines).toEqual([
      "info:api를 설치하지 않으므로 api를 호출하는 예제 화면은 제거합니다.",
    ]);
    expect(result).toEqual({ cancelled: false, removeExamples: true });
  });

  it("질문 화면에서 취소했을 때 취소 신호를 돌려준다", async () => {
    const { prompts } = fakePrompts({ select: [CANCEL] });
    expect(await askRemoveExamples({ prompts, apps: ["api"] })).toEqual({
      cancelled: true,
    });
  });
});
