import { describe, expect, it } from "vitest";

import { displayWidth } from "../../../src/cli/displayWidth.mjs";
import { buildHelpLines } from "../../../src/cli/help.mjs";
import { readManifest } from "../../../src/setup/manifest.mjs";

const manifestApps = readManifest().apps;
const text = buildHelpLines(manifestApps).join("\n");

describe("buildHelpLines", () => {
  it("사용법 두 줄로 시작한다", () => {
    expect(buildHelpLines(manifestApps).slice(0, 3)).toEqual([
      "사용법",
      "  npm create scalable-monorepo-starter@latest [이름] -- [플래그]",
      "  npx create-scalable-monorepo-starter@latest [이름] [플래그]",
    ]);
  });

  it("표의 열이 PRD 4.1절 화면과 같다", () => {
    expect(buildHelpLines(manifestApps).slice(4, 14)).toEqual([
      "인자와 플래그            의미                        기본값",
      "  [이름]                 프로젝트 이름               없음. 비대화형에서는 필수",
      "  --apps <id,...>        설치할 앱 id 목록           api,web",
      "  --remove-examples      examples 처리               남겨 둔다",
      "  --keep-examples",
      "  --yes                  묻지 않고 기본값으로 진행   꺼짐",
      "  --no-install           npm install 생략            설치한다",
      "  --no-git               git init 생략               만든다",
      "  --dry-run              변경 계획만 출력            꺼짐",
      "  --help, --version      도움말, 버전",
    ]);
  });

  it("--apps 기본값이 매니페스트에서 default가 true인 앱이다", () => {
    const apps = manifestApps.map((app) => ({ ...app, default: app.id === "storybook" || app.id === "web" }));
    expect(buildHelpLines(apps).join("\n")).toContain("--apps <id,...>        설치할 앱 id 목록           web,storybook");
  });

  it("앱 목록이 매니페스트 순서다", () => {
    expect(buildHelpLines(manifestApps).at(-1)).toBe(
      "선택할 수 있는 앱: api, web, desktop, storybook",
    );
  });

  it("개발용 환경 변수를 싣지 않는다", () => {
    expect(text).not.toContain("STARTER_");
  });

  it("모든 줄이 80열 이하다", () => {
    for (const line of buildHelpLines(manifestApps)) expect(displayWidth(line)).toBeLessThanOrEqual(80);
  });
});
