import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import {
  assertFontFamilyToken,
  getCssVar,
  getThemeBlockSource,
  tokenExists,
} from "./helpers";

const GLOBALS_CSS_PATH = resolve(
  __dirname,
  "../../src/styles/globals.css",
);

function readGlobalsRaw(): string {
  return readFileSync(GLOBALS_CSS_PATH, "utf-8");
}

const SANS_EXPECTED = '"Open Sans", ui-sans-serif, system-ui, sans-serif';

const MONO_FALLBACK_FAMILIES: ReadonlyArray<string> = [
  "ui-monospace",
  "SFMono-Regular",
  "monospace",
];

// T-FF-G0-1-R: --font-family-mono 토큰 정의 + 첫 번째 패밀리 = "Roboto Mono"
describe("--font-family-mono 토큰 (FR-FF-1)", () => {
  it("globals.css @theme 블록에 정의된다", () => {
    expect(
      tokenExists("--font-family-mono"),
      "--font-family-mono 토큰이 globals.css에 정의되어 있어야 합니다",
    ).toBe(true);
  });

  it("첫 번째 패밀리가 Roboto Mono다", () => {
    assertFontFamilyToken("--font-family-mono", "Roboto Mono");
  });

  it("fallback chain에 ui-monospace, SFMono-Regular, monospace를 포함한다", () => {
    const value = getCssVar("--font-family-mono");
    for (const family of MONO_FALLBACK_FAMILIES) {
      expect(
        value.includes(family),
        `--font-family-mono fallback chain에 ${family}가 포함되어야 합니다 (실제: ${value})`,
      ).toBe(true);
    }
  });
});

// T-FF-G0-2-R: --font-family-sans 비파괴 (FR-FF-6)
describe("--font-family-sans 비파괴 (FR-FF-6)", () => {
  it("기존 값이 변경되지 않는다", () => {
    const value = getCssVar("--font-family-sans");
    expect(
      value,
      `--font-family-sans 값은 ${SANS_EXPECTED}으로 유지되어야 합니다`,
    ).toBe(SANS_EXPECTED);
  });
});

// T-FF-G0-3-R: Open Sans 12 face @font-face 블록 (FR-FF-2)
describe("Open Sans 12 face @font-face (FR-FF-2)", () => {
  it("globals.css에 정확히 12개 @font-face 블록이 등록된다", () => {
    const source = readGlobalsRaw();
    const matches = source.match(
      /@font-face\s*\{[^}]*font-family:\s*["']Open Sans["'][^}]*\}/g,
    );
    const count = matches ? matches.length : 0;
    expect(
      count,
      `Open Sans @font-face 블록이 정확히 12개여야 하지만 ${count}개입니다`,
    ).toBe(12);
  });

  it("모든 src url이 절대경로 /fonts/...로 시작한다", () => {
    const source = readGlobalsRaw();
    const matches =
      source.match(
        /@font-face\s*\{[^}]*font-family:\s*["']Open Sans["'][^}]*\}/g,
      ) ?? [];
    expect(
      matches.length,
      "Open Sans @font-face 블록이 존재해야 합니다",
    ).toBeGreaterThan(0);
    for (const block of matches) {
      const srcMatch = /src:\s*url\(\s*["']([^"']+)["']/.exec(block);
      expect(
        srcMatch,
        `@font-face 블록에 src: url(...) 선언이 있어야 합니다: ${block}`,
      ).not.toBeNull();
      const url = srcMatch![1];
      expect(
        url.startsWith("/fonts/"),
        `src url은 /fonts/로 시작해야 합니다 (실제: ${url})`,
      ).toBe(true);
      expect(
        url.endsWith(".ttf"),
        `src url은 .ttf로 끝나야 합니다 (실제: ${url})`,
      ).toBe(true);
    }
  });

  it("모든 face가 font-display: swap을 명시한다", () => {
    const source = readGlobalsRaw();
    const matches =
      source.match(
        /@font-face\s*\{[^}]*font-family:\s*["']Open Sans["'][^}]*\}/g,
      ) ?? [];
    expect(
      matches.length,
      "Open Sans @font-face 블록이 존재해야 합니다",
    ).toBeGreaterThan(0);
    for (const block of matches) {
      expect(
        /font-display:\s*swap/.test(block),
        `Open Sans @font-face 블록에 font-display: swap이 명시되어야 합니다: ${block}`,
      ).toBe(true);
    }
  });
});

// T-FF-G0-4-R: Roboto Mono CDN @import (FR-FF-3)
describe("Roboto Mono CDN @import (FR-FF-3)", () => {
  it("Roboto Mono weight 400/500/700 + display=swap @import이 존재한다", () => {
    const source = readGlobalsRaw();
    const importMatches = source.match(/@import\s+url\([^)]+\)\s*;?/g) ?? [];
    const robotoMonoImport = importMatches.find((line) =>
      line.includes("Roboto+Mono"),
    );
    expect(
      robotoMonoImport,
      "Roboto Mono를 로드하는 @import url(...) 라인이 존재해야 합니다",
    ).toBeDefined();
    const importLine = robotoMonoImport!;
    expect(
      importLine.includes("family=Roboto+Mono"),
      `@import 라인에 family=Roboto+Mono가 포함되어야 합니다 (실제: ${importLine})`,
    ).toBe(true);
    for (const weight of ["400", "500", "700"]) {
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

  it("PT Sans는 @import에 포함되지 않는다 (D-FF-3 보류)", () => {
    const source = readGlobalsRaw();
    const importMatches = source.match(/@import\s+url\([^)]+\)\s*;?/g) ?? [];
    const ptSansImport = importMatches.find((line) =>
      line.includes("PT+Sans"),
    );
    expect(
      ptSansImport,
      "PT Sans는 D-FF-3 결정에 따라 @import 대상이 아닙니다 (실제: 발견됨)",
    ).toBeUndefined();
  });
});

// T-FF-G0-5-R: Tailwind v4 namespace 룰 회귀 방어
describe("--font-family-mono Tailwind v4 namespace 회귀 방어", () => {
  it("--font-family-mono가 @theme 블록 내부에 정의되어 orphan 토큰이 아니다", () => {
    const themeBody = getThemeBlockSource();
    expect(
      /^\s*--font-family-mono\s*:/m.test(themeBody),
      "--font-family-mono는 @theme 블록 안에 선언되어야 utility(font-mono)가 자동 생성됩니다",
    ).toBe(true);
  });
});
