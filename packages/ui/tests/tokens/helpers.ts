import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { expect } from "vitest";

const GLOBALS_CSS_PATH = resolve(
  __dirname,
  "../../src/styles/globals.css",
);

let cachedSource: string | null = null;

function readGlobalsSource(): string {
  if (cachedSource === null) {
    cachedSource = readFileSync(GLOBALS_CSS_PATH, "utf-8");
  }
  return cachedSource;
}

/**
 * `globals.css`의 `@theme` 블록 내부에서 토큰 선언을 직접 파싱한다.
 *
 * JSDOM은 `@theme` 디렉티브를 네이티브로 해석하지 않으므로 (Tailwind 빌드 산출물이 아닌
 * 소스 CSS를 읽는 경우) 정규식으로 토큰 값을 직접 추출한다.
 */
export function getCssVar(name: string): string {
  const source = readGlobalsSource();
  const escaped = name.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
  const pattern = new RegExp(
    `${escaped}\\s*:\\s*([^;]+);`,
    "m",
  );
  const match = pattern.exec(source);
  if (!match) {
    throw new Error(`Token ${name} not found in globals.css`);
  }
  return match[1].trim();
}

export function tokenExists(name: string): boolean {
  try {
    getCssVar(name);
    return true;
  } catch {
    return false;
  }
}

export function assertHexColor(actual: string, expected: string): void {
  const normalize = (value: string): string => value.toLowerCase().trim();
  expect(normalize(actual), `expected hex color ${expected} but got ${actual}`)
    .toBe(normalize(expected));
}

export function assertPxValue(actual: string, expectedPx: number): void {
  const match = /^(-?\d+(?:\.\d+)?)px$/.exec(actual.trim());
  expect(match, `expected px value but got ${actual}`).not.toBeNull();
  const value = Number(match![1]);
  expect(value, `expected ${expectedPx}px but got ${value}px`).toBe(
    expectedPx,
  );
}

export function assertRemValue(actual: string, expectedRem: number): void {
  const match = /^(-?\d+(?:\.\d+)?)rem$/.exec(actual.trim());
  expect(match, `expected rem value but got ${actual}`).not.toBeNull();
  const value = Number(match![1]);
  expect(value, `expected ${expectedRem}rem but got ${value}rem`).toBe(
    expectedRem,
  );
}

export function assertNumberValue(actual: string, expected: number): void {
  const value = Number(actual.trim());
  expect(value, `expected number ${expected} but got ${actual}`).toBe(expected);
}

/**
 * 비표준 namespace prefix(`--size-*`, `--design-*`)가 globals.css에 존재하지 않음을 단언.
 */
export function assertNoPrefix(prefix: string): void {
  const source = readGlobalsSource();
  const themeMatch = /@theme\s*\{([\s\S]*?)\n\}/m.exec(source);
  expect(themeMatch, "globals.css에 @theme 블록이 없습니다").not.toBeNull();
  const themeBody = themeMatch![1];
  const escaped = prefix.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
  const pattern = new RegExp(`^\\s*${escaped}[\\w-]+\\s*:`, "m");
  expect(
    pattern.exec(themeBody),
    `@theme 블록에 ${prefix} prefix 토큰이 잔존합니다`,
  ).toBeNull();
}

export function getThemeBlockSource(): string {
  const source = readGlobalsSource();
  const themeMatch = /@theme\s*\{([\s\S]*?)\n\}/m.exec(source);
  if (!themeMatch) {
    throw new Error("globals.css에 @theme 블록이 없습니다");
  }
  return themeMatch[1];
}

export function clearGlobalsCache(): void {
  cachedSource = null;
}
