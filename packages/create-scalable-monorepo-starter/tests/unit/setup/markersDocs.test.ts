import { readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { stripMarkers } from "../../../src/setup/stripMarkers.mjs";

const root = path.resolve(import.meta.dirname, "../../../../..");
const appIds = ["api", "web", "desktop", "storybook"];

function read(relativePath: string): string {
  return readFileSync(path.join(root, relativePath), "utf8");
}

describe("문서와 Playwright APP 마커", () => {
  it("루트 문서가 api를 선택하지 않았을 때 워크스페이스 표에서 api 행을 지운다", () => {
    const result = stripMarkers(read("CLAUDE.md"), ["web"], appIds);

    expect(result).not.toContain(
      "| `apps/api` | Express + Prisma + PostgreSQL backend |",
    );
    expect(result).toContain("| `apps/web` | React 19 + Vite 8 frontend |");
  });

  it("루트 문서가 앱을 선택하지 않았을 때 그 앱의 문서 링크를 지운다", () => {
    const result = stripMarkers(read("CLAUDE.md"), ["web"], appIds);

    expect(result).not.toContain("[apps/api/CLAUDE.md]");
    expect(result).not.toContain("[apps/desktop/CLAUDE.md]");
    expect(result).toContain("[apps/web/CLAUDE.md]");
  });

  it("루트 문서가 생성물로 처리될 때 템플릿 전용 기여 안내를 지운다", () => {
    const result = stripMarkers(read("CLAUDE.md"), appIds, appIds);

    expect(result).not.toContain("기여 가이드");
    expect(result).not.toContain("CONTRIBUTING.md");
  });

  it("Playwright 설정이 api를 선택하지 않았을 때 api 서버 기동 항목을 지운다", () => {
    const result = stripMarkers(
      read("apps/web/playwright.config.ts"),
      ["web"],
      appIds,
    );

    expect(result).not.toContain("npm run dev:server --workspace=api");
    expect(result).toContain("npm run dev --workspace=web");
  });

  it("desktop 문서가 web을 선택하지 않았을 때 web 사본 동기화 문단을 지운다", () => {
    const result = stripMarkers(
      read("apps/desktop/CLAUDE.md"),
      ["desktop"],
      appIds,
    );

    expect(result).not.toContain("web 사본 동기화");
    expect(result).not.toContain("npm run check:parity");
  });

  it("마커를 처리한 문서와 설정이 어떤 조합에서도 APP 마커를 남기지 않는다", () => {
    for (const relativePath of [
      "CLAUDE.md",
      "apps/web/playwright.config.ts",
      "apps/desktop/CLAUDE.md",
    ]) {
      expect(stripMarkers(read(relativePath), appIds, appIds)).not.toContain(
        "APP:",
      );
    }
  });
});
