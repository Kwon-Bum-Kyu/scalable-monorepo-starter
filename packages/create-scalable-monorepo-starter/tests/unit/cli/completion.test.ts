import { describe, expect, it } from "vitest";

import { buildCompletionLines } from "../../../src/cli/completion.mjs";
import { displayWidth } from "../../../src/cli/displayWidth.mjs";
import { readManifest } from "../../../src/setup/manifest.mjs";

const manifestApps = readManifest().apps;
const base = { manifestApps, targetName: "my-app", install: true, removeExamples: false };
const lines = (overrides: Record<string, unknown>) =>
  buildCompletionLines({ ...base, selectedIds: ["api", "web"], ...overrides });

describe("buildCompletionLines", () => {
  it("api와 web을 선택했을 때 PRD 4.1절 화면과 같은 줄을 만든다", () => {
    expect(lines({})).toEqual([
      "",
      "다음 단계",
      "  cd my-app",
      "  npm run dev:api         http://localhost:4000   Docker가 실행 중이어야 합니다",
      "  npm run dev:web         http://localhost:3000",
      "  npm run dev             선택한 앱을 모두 띄웁니다",
      "",
      "문서는 README.md 를 참고해 주세요.",
    ]);
  });

  it("앱을 하나만 선택했을 때 npm run dev 줄이 없다", () => {
    expect(lines({ selectedIds: ["desktop"] })).toEqual([
      "",
      "다음 단계",
      "  cd my-app",
      "  npm run dev:desktop     Electron 창으로 열립니다",
      "",
      "문서는 README.md 를 참고해 주세요.",
    ]);
  });

  it("앱을 둘 이상 선택했을 때 npm run dev 줄이 기동 줄 마지막에 나온다", () => {
    const out = lines({});
    expect(out.indexOf("  npm run dev             선택한 앱을 모두 띄웁니다")).toBe(5);
  });

  it("주소가 없는 앱의 줄에 note가 주소 자리에 나온다", () => {
    const out = lines({ selectedIds: ["web", "desktop"] });
    expect(out).toContain("  npm run dev:desktop     Electron 창으로 열립니다");
  });

  it("--no-install일 때 cd 줄 다음에 npm install 줄이 있다", () => {
    const out = lines({ install: false });
    expect(out.slice(2, 4)).toEqual(["  cd my-app", "  npm install"]);
  });

  it("examples를 제거하고 api가 있을 때 기동 명령 다음에 빈 줄과 마이그레이션 두 줄이 나온다", () => {
    expect(lines({ removeExamples: true }).slice(5)).toEqual([
      "  npm run dev             선택한 앱을 모두 띄웁니다",
      "",
      "예제 테이블을 지우는 마이그레이션이 필요합니다. 다음 명령을 실행해 주세요.",
      "  cd apps/api && npm run migrate -- --name drop_examples_table",
      "",
      "문서는 README.md 를 참고해 주세요.",
    ]);
  });

  it("examples를 제거해도 api가 없을 때 마이그레이션 안내가 없다", () => {
    expect(lines({ selectedIds: ["web"], removeExamples: true }).join("\n")).not.toContain("마이그레이션");
  });

  it("어떤 앱을 선택해도 명령 열이 24칸으로 같다", () => {
    for (const selectedIds of [["api"], ["web", "storybook"], ["api", "web", "desktop", "storybook"]]) {
      const rows = lines({ selectedIds }).filter((l) => l.startsWith("  npm run dev"));
      for (const row of rows) {
        const rest = row.slice(2 + 24);
        expect(rest.startsWith(" ")).toBe(false);
        expect(row.slice(2, 2 + 24).trimEnd().length).toBeLessThanOrEqual(21);
      }
    }
  });

  it("모든 앱을 선택하고 examples를 제거해도 모든 줄이 80열 이하다", () => {
    const out = lines({
      selectedIds: manifestApps.map((app) => app.id),
      removeExamples: true,
      install: false,
      targetName: "my-app",
    });
    for (const line of out) expect(displayWidth(line)).toBeLessThanOrEqual(80);
  });
});
