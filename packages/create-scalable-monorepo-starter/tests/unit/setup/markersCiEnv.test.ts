import { readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { stripMarkers } from "../../../src/setup/stripMarkers.mjs";

const root = path.resolve(import.meta.dirname, "../../../../..");
const appIds = ["api", "web", "desktop", "storybook"];

function read(relativePath: string): string {
  return readFileSync(path.join(root, relativePath), "utf8");
}

function removeMarkerComments(source: string): string {
  return source
    .split("\n")
    .filter((line) => !/[<>]{3} APP:/u.test(line))
    .map((line) => line.replace(/\s+(?:#|\/\/) APP:[a-z0-9+-]+\s*$/u, ""))
    .map((line) => line.replace(/\s*<!-- APP:[a-z0-9+-]+ -->\s*$/u, ""))
    .join("\n");
}

describe("CI와 환경 변수 APP 마커", () => {
  it("CI가 web만 선택됐을 때 Postgres와 DATABASE_URL과 Prisma 단계를 지운다", () => {
    const result = stripMarkers(
      read(".github/workflows/ci.yml"),
      ["web"],
      appIds,
    );

    expect(result).not.toContain("postgres:");
    expect(result).not.toContain("DATABASE_URL:");
    expect(result).not.toContain("Prisma");
  });

  it("CI가 web만 선택됐을 때 Renderer parity 단계를 지운다", () => {
    const result = stripMarkers(
      read(".github/workflows/ci.yml"),
      ["web"],
      appIds,
    );

    expect(result).not.toContain("Renderer parity");
  });

  it("CI가 web과 desktop을 선택했을 때 Renderer parity 단계를 남긴다", () => {
    const result = stripMarkers(
      read(".github/workflows/ci.yml"),
      ["web", "desktop"],
      appIds,
    );

    expect(result).toContain("Renderer parity");
  });

  it("환경 변수가 web만 선택됐을 때 Frontend만 남기고 Backend와 Storybook을 지운다", () => {
    const result = stripMarkers(read(".env.example"), ["web"], appIds);

    expect(result).toContain("VITE_API_BASE_URL");
    expect(result).not.toContain("DATABASE_URL=");
    expect(result).not.toContain("VITE_STORYBOOK_MODE");
  });

  it("PR 템플릿이 web만 선택됐을 때 parity와 선택하지 않은 앱 항목을 지운다", () => {
    const result = stripMarkers(
      read(".github/PULL_REQUEST_TEMPLATE.md"),
      ["web"],
      appIds,
    );

    expect(result).not.toContain("check:parity");
    expect(result).toContain("FE (`apps/web`)");
    expect(result).not.toContain("Desktop (`apps/desktop`)");
    expect(result).not.toContain("BE (`apps/api`)");
    expect(result).not.toContain("마이그레이션 (`apps/api");
  });

  it("마커 파일들이 모든 앱을 선택했을 때 원본에서 마커 주석만 빠진 결과를 만든다", () => {
    for (const relativePath of [
      ".github/workflows/ci.yml",
      ".env.example",
      ".github/PULL_REQUEST_TEMPLATE.md",
    ]) {
      const source = read(relativePath);

      expect(stripMarkers(source, appIds, appIds)).toBe(
        removeMarkerComments(source),
      );
    }
  });
});
