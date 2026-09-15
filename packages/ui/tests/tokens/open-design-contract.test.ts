import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import { assertHexColor, getCssVar } from "./helpers";

const CONTRACT_CSS_PATH = resolve(__dirname, "../../src/styles/open-design-contract.css");

/** D-OD-4 (G1.5 확정값). 선택지 (A) 브랜드 = --color-blue-500 */
const ACCENT_THEME_TOKEN = "--color-blue-500";

const A1_IDENTITY_MAP: ReadonlyArray<{ slot: string; themeToken: string }> = [
  { slot: "--bg", themeToken: "--color-system-white" },
  { slot: "--surface", themeToken: "--color-system-white" },
  { slot: "--fg", themeToken: "--color-gray-900" },
  { slot: "--muted", themeToken: "--color-gray-400" },
  { slot: "--border", themeToken: "--color-gray-100" },
  { slot: "--accent", themeToken: ACCENT_THEME_TOKEN },
];

const STATUS_SLOT_MAP: ReadonlyArray<{ slot: string; themeToken: string }> = [
  { slot: "--success", themeToken: "--color-system-green" },
  { slot: "--warn", themeToken: "--color-system-warning" },
  { slot: "--danger", themeToken: "--color-system-red" },
];

function readContractSource(): string {
  return readFileSync(CONTRACT_CSS_PATH, "utf-8");
}

function getContractVar(name: string): string {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = new RegExp(`${escaped}\\s*:\\s*([^;]+);`).exec(readContractSource());
  if (!match) {
    throw new Error(`Token ${name} not found in open-design-contract.css`);
  }
  return match[1].trim();
}

describe("open-design-contract 브리지 CSS", () => {
  it("A1-identity 6슬롯이 모두 선언된다", () => {
    for (const { slot } of A1_IDENTITY_MAP) {
      expect(() => getContractVar(slot)).not.toThrow();
    }
  });

  it.each(A1_IDENTITY_MAP)("$slot 슬롯 값이 대응 @theme 토큰 리터럴과 일치한다", ({ slot, themeToken }) => {
    assertHexColor(getContractVar(slot), getCssVar(themeToken));
  });

  it("상태색 3슬롯이 모두 선언된다", () => {
    for (const { slot } of STATUS_SLOT_MAP) {
      expect(() => getContractVar(slot)).not.toThrow();
    }
  });

  it.each(STATUS_SLOT_MAP)("$slot 슬롯 값이 대응 @theme 토큰 리터럴과 일치한다", ({ slot, themeToken }) => {
    assertHexColor(getContractVar(slot), getCssVar(themeToken));
  });

  it("브리지 선언에 var() 참조가 없다", () => {
    const match = /\[data-open-design-contract\]\s*\{([^}]*)\}/.exec(readContractSource());
    expect(match).not.toBeNull();
    expect(match![1]).not.toMatch(/var\(/);
  });

  it("헤더 주석에 SSOT 선언과 값 수정 금지 규칙이 포함된다", () => {
    const source = readContractSource();
    expect(source).toContain("단일 출처");
    expect(source).toContain("@theme");
    expect(source).toContain("값 수정 금지");
  });

  it("globals.css가 브리지 파일을 @import하지 않는다", () => {
    const source = readFileSync(resolve(__dirname, "../../src/styles/globals.css"), "utf-8");
    expect(source).not.toContain("open-design-contract");
  });

  it("packages/ui 공개 exports에 브리지 파일이 없다", () => {
    const pkg = JSON.parse(readFileSync(resolve(__dirname, "../../package.json"), "utf-8"));
    expect(JSON.stringify(pkg.exports)).not.toContain("open-design-contract");
  });
});
