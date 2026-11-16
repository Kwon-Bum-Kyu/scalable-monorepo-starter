import { describe, expect, it } from "vitest";

import { buildCompletionLines } from "../../src/cli/completion.mjs";
import { displayWidth } from "../../src/cli/displayWidth.mjs";
import {
  FETCH_PROGRESS,
  fetchFailureLines,
  FetchTemplateError,
} from "../../src/cli/fetchTemplate.mjs";
import { buildHelpLines } from "../../src/cli/help.mjs";
import { parseCliArgs } from "../../src/cli/parseCliArgs.mjs";
import { GIT_WARNING } from "../../src/cli/postSteps.mjs";
import { parseFailureLines, preflight } from "../../src/cli/preflight.mjs";
import { askApps, askRemoveExamples } from "../../src/cli/prompts.mjs";
import { SETUP_PROGRESS } from "../../src/cli/runSetup.mjs";
import { buildSelectOptions } from "../../src/cli/selectOptions.mjs";
import { readManifest } from "../../src/setup/manifest.mjs";

type Manifest = ReturnType<typeof readManifest>;
type App = Manifest["apps"][number];

const MAX_COLUMNS = 80;
// 선택 화면의 줄 앞 기호("│  ◻ ")가 차지하는 열 수. 설명(hint)은 64열 이하여야 한다.
const SELECT_PREFIX = "│  ◻ ";
// 길이를 알 수 없는 값(오류 원인, 경로)은 NFR-09가 따로 한 줄에 두도록 하므로 검사하지 않는다.
// 알 수 없는 앱 오류의 앱이 늘 때 생기는 84열 문제(mobile 추가 시, PRD 4.9절)는 이 기획의 범위가
// 아니라 mobile 추가 기획이 정한다. 그래서 이 검사는 그 문장을 화면 목록에 싣지 않는다.

function tooWide(lines: string[]): string[] {
  return lines.filter((line) => displayWidth(line) > MAX_COLUMNS);
}

function selectScreen(apps: App[]): string[] {
  return buildSelectOptions(apps).map(({ label }) => SELECT_PREFIX + label);
}

async function promptMessages(manifest: Manifest): Promise<string[]> {
  const messages: string[] = [];
  const logs: string[] = [];
  const prompts = {
    text: async () => "",
    select: async (opts: { message: string }) => {
      messages.push(opts.message);
      return "keep";
    },
    multiselect: async (opts: { message: string }) => {
      messages.push(opts.message);
      return ["web", "storybook"];
    },
    isCancel: () => false,
    log: {
      error: (m: string) => logs.push(m),
      info: (m: string) => logs.push(m),
    },
  };
  await askApps({ prompts, manifest });
  await askRemoveExamples({ prompts, apps: ["web"] });
  await askRemoveExamples({ prompts, apps: ["api"] });
  return [...messages, ...logs];
}

function otherScreens(manifest: Manifest): Record<string, string[]> {
  const ids = manifest.apps.map((app) => app.id);
  const completion = (selectedIds: string[], removeExamples: boolean) =>
    buildCompletionLines({
      manifestApps: manifest.apps,
      selectedIds,
      targetName: "my-app",
      install: false,
      removeExamples,
    });
  const preflightLines = (
    args: Parameters<typeof preflight>[0]["args"],
    isTTY: boolean,
  ) => {
    const result = preflight({
      args,
      apps: manifest.apps,
      isTTY,
      nodeVersion: "v22.13.0",
      cwd: "/",
    });
    return result.ok ? [] : result.lines;
  };
  const parseFailures = [
    ["--bogus"],
    ["a", "b"],
    ["--remove-examples", "--keep-examples"],
  ].flatMap((argv) => {
    const result = parseCliArgs(argv);
    return result.ok ? [] : parseFailureLines(result);
  });
  return {
    "완료 안내(전체 선택)": completion(ids, true),
    "완료 안내(api만)": completion(["api"], true),
    "완료 안내(api 없이)": completion(["web", "desktop"], false),
    "--help": buildHelpLines(manifest.apps),
    "터미널이 아닌 환경의 오류": preflightLines({ yes: false }, false),
    "스코프 이름 오류": preflightLines({ name: "@org/app", yes: true }, true),
    "형식이 틀린 이름 오류": preflightLines({ name: "!!!", yes: true }, true),
    "옵션 오류": parseFailures,
    "내려받기 실패": [
      ...fetchFailureLines(new FetchTemplateError("tag-missing", "v1.2.0", "")),
      fetchFailureLines(
        new FetchTemplateError("network", "v1.2.0", ""),
      )[0] as string,
    ],
    "진행 줄": [
      FETCH_PROGRESS.running("1.2.0"),
      FETCH_PROGRESS.done("1.2.0"),
      SETUP_PROGRESS.appsCleaned(["desktop", "storybook"]),
      SETUP_PROGRESS.nameApplied("my-app"),
      SETUP_PROGRESS.examplesRemoved,
      SETUP_PROGRESS.envCreated,
      GIT_WARNING,
    ],
  };
}

describe("화면 줄의 열 수 검사", () => {
  const manifest = readManifest();

  it("선택 화면의 어떤 줄도 80열을 넘지 않는다", () => {
    expect(tooWide(selectScreen(manifest.apps))).toEqual([]);
  });

  it("완료 안내의 어떤 줄도 80열을 넘지 않는다", () => {
    const completion = otherScreens(manifest);
    const lines = Object.entries(completion)
      .filter(([name]) => name.startsWith("완료 안내"))
      .flatMap(([, screen]) => screen);
    expect(lines.length).toBeGreaterThan(0);
    expect(tooWide(lines)).toEqual([]);
  });

  it("그 밖의 화면(--help, 오류, 진행 줄, 질문 문장)의 어떤 줄도 80열을 넘지 않는다", async () => {
    const screens = {
      ...otherScreens(manifest),
      질문: await promptMessages(manifest),
    };
    for (const [name, lines] of Object.entries(screens)) {
      expect(tooWide(lines), name).toEqual([]);
    }
  });

  it("앱의 hint가 64열을 넘을 때 검사에 실패한다", () => {
    const longHint = "가".repeat(33);
    const apps = manifest.apps.map((app) =>
      app.id === "api" ? { ...app, hint: longHint } : app,
    );
    expect(displayWidth(longHint)).toBe(66);
    expect(tooWide(selectScreen(apps))).toHaveLength(1);
  });

  it("앱의 hint가 정확히 64열일 때 검사를 통과한다", () => {
    const apps = manifest.apps.map((app) =>
      app.id === "api" ? { ...app, hint: "가".repeat(32) } : app,
    );
    expect(tooWide(selectScreen(apps))).toEqual([]);
  });

  it("완료 안내의 dev.prerequisite가 길 때 검사에 실패한다", () => {
    const apps = manifest.apps.map((app) =>
      app.id === "api"
        ? { ...app, dev: { ...app.dev, prerequisite: "가".repeat(20) } }
        : app,
    );
    const lines = buildCompletionLines({
      manifestApps: apps,
      selectedIds: ["api"],
      targetName: "my-app",
      install: true,
      removeExamples: false,
    });
    expect(tooWide(lines)).toHaveLength(1);
  });

  it("81열짜리 줄을 넣었을 때 검사가 그 줄을 위반으로 보고한다", () => {
    const line = "a".repeat(81);
    expect(tooWide(["a".repeat(80), line])).toEqual([line]);
  });
});
