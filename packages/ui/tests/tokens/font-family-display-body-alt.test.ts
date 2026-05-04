import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import {
  assertFontFamilyToken,
  getCssVar,
  tokenExists,
} from "./helpers";

const GLOBALS_CSS_PATH = resolve(
  __dirname,
  "../../src/styles/globals.css",
);

function readGlobalsRaw(): string {
  return readFileSync(GLOBALS_CSS_PATH, "utf-8");
}

const DISPLAY_FALLBACK_FAMILIES: ReadonlyArray<string> = [
  "ui-monospace",
  "monospace",
];

const BODY_ALT_FALLBACK_FAMILIES: ReadonlyArray<string> = [
  "Open Sans",
  "sans-serif",
];

describe("--font-family-display 토큰 (claude-design-page-alignment Ralph R1)", () => {
  it("globals.css @theme 블록에 정의된다", () => {
    expect(
      tokenExists("--font-family-display"),
      "--font-family-display 토큰이 globals.css @theme에 정의되어야 합니다 (정본 SSOT 갱신 — D-FF-1 뒤집힘)",
    ).toBe(true);
  });

  it("첫 번째 패밀리가 Roboto Mono다", () => {
    assertFontFamilyToken("--font-family-display", "Roboto Mono");
  });

  it("fallback chain에 ui-monospace, monospace를 포함한다", () => {
    const value = getCssVar("--font-family-display");
    for (const family of DISPLAY_FALLBACK_FAMILIES) {
      expect(
        value.includes(family),
        `--font-family-display fallback chain에 ${family}가 포함되어야 합니다 (실제: ${value})`,
      ).toBe(true);
    }
  });
});

describe("--font-family-body-alt 토큰 (claude-design-page-alignment Ralph R1)", () => {
  it("globals.css @theme 블록에 정의된다", () => {
    expect(
      tokenExists("--font-family-body-alt"),
      "--font-family-body-alt 토큰이 globals.css @theme에 정의되어야 합니다 (정본 SSOT 갱신 — D-FF-3 뒤집힘)",
    ).toBe(true);
  });

  it("첫 번째 패밀리가 PT Sans다", () => {
    assertFontFamilyToken("--font-family-body-alt", "PT Sans");
  });

  it("fallback chain에 Open Sans와 sans-serif를 포함한다", () => {
    const value = getCssVar("--font-family-body-alt");
    for (const family of BODY_ALT_FALLBACK_FAMILIES) {
      expect(
        value.includes(family),
        `--font-family-body-alt fallback chain에 ${family}가 포함되어야 합니다 (실제: ${value})`,
      ).toBe(true);
    }
  });
});

describe("PT Sans Google Fonts CDN @import (D-FF-3 뒤집힘 — 2026-05-05)", () => {
  it("PT Sans weight 400/700 + display=swap @import이 globals.css에 존재한다", () => {
    const source = readGlobalsRaw();
    const importMatches = source.match(/@import\s+url\([^)]+\)\s*;?/g) ?? [];
    const ptSansImport = importMatches.find((line) =>
      line.includes("PT+Sans"),
    );
    expect(
      ptSansImport,
      "PT Sans를 로드하는 @import url(...) 라인이 존재해야 합니다 (D-FF-3 뒤집힘)",
    ).toBeDefined();
    const importLine = ptSansImport!;
    expect(
      importLine.includes("family=PT+Sans"),
      `@import 라인에 family=PT+Sans가 포함되어야 합니다 (실제: ${importLine})`,
    ).toBe(true);
    for (const weight of ["400", "700"]) {
      expect(
        importLine.includes(weight),
        `@import 라인에 weight ${weight}이 포함되어야 합니다 (실제: ${importLine})`,
      ).toBe(true);
    }
    expect(
      importLine.includes("display=swap"),
      `@import 라인에 display=swap이 포함되어야 합니다 (실제: ${importLine})`,
    ).toBe(true);
  });
});
