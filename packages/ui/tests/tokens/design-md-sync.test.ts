import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import { diffTokens, formatTokenDiff, readDesign, readTheme } from "./designMdParser";

const DESIGN_PATH = resolve(__dirname, "../../../../DESIGN.md");
const THEME_PATH = resolve(__dirname, "../../src/styles/globals.css");

function readSources() {
  const designSource = readFileSync(DESIGN_PATH, "utf-8");
  const { theme, scope } = readTheme(readFileSync(THEME_PATH, "utf-8"));
  const design = readDesign(designSource, theme);
  return { design, theme, scope };
}

describe("DESIGN.md ↔ @theme 동기화 가드", () => {
  it("DESIGN.md frontmatter와 토큰 표의 모든 토큰이 같은 값의 @theme 토큰으로 구현되어 있다", () => {
    const { design, theme, scope } = readSources();
    const diff = diffTokens(design.tokens, theme, scope);
    const message = [formatTokenDiff(diff), ...design.typographyErrors, ...design.tableErrors].filter(Boolean).join("\n");
    expect(diff.missingInTheme, message).toEqual([]);
    expect(diff.valueMismatches, message).toEqual([]);
  });

  it("@theme에 선언된 모든 토큰이 DESIGN.md frontmatter 또는 토큰 표에 존재한다", () => {
    const { design, theme, scope } = readSources();
    const diff = diffTokens(design.tokens, theme, scope);
    const message = formatTokenDiff(diff);
    expect(diff.missingInDesign, message).toEqual([]);
  });

  it("DESIGN.md typography 역할의 글꼴·크기·행간·굵기·자간 값이 모두 @theme 토큰 값 중 하나다", () => {
    const { design } = readSources();
    expect(design.typographyErrors, design.typographyErrors.join("\n")).toEqual([]);
  });

  it("DESIGN.md 토큰 표의 모든 행이 정규 형식을 따르고 같은 토큰을 두 번 정의하지 않는다", () => {
    const { design } = readSources();
    expect(design.tableErrors, design.tableErrors.join("\n")).toEqual([]);
  });

  it("@theme에만 있는 토큰이 있으면 DESIGN.md 선반영 안내 메시지와 함께 대조에 실패한다", () => {
    const diff = diffTokens(new Map([["--color-a", "#000000"]]), new Map([["--color-a", "#000000"], ["--tracking-x", "1em"]]), new Map());
    expect(formatTokenDiff(diff)).toContain("--tracking-x");
    expect(formatTokenDiff(diff)).toContain("DESIGN.md에 먼저 추가하고 @theme에 구현하라");
  });

  it("DESIGN.md에만 있는 토큰이 있으면 @theme 누락으로 대조에 실패한다", () => {
    const diff = diffTokens(new Map([["--shadow-x", "0 1px"]]), new Map(), new Map());
    expect(formatTokenDiff(diff)).toContain("@theme에 없는 DESIGN.md 토큰");
    expect(formatTokenDiff(diff)).toContain("--shadow-x");
  });

  it("rounded 값이 calc 해석 결과와 다르면 값 불일치로 대조에 실패한다", () => {
    const design = new Map([["--radius-sm", "5px"]]);
    const theme = new Map([["--radius-sm", "calc(var(--radius) - 4px)"]]);
    const scope = new Map([["--radius", "0.5rem"], ...theme]);
    expect(diffTokens(design, theme, scope).valueMismatches).toHaveLength(1);
    expect(diffTokens(new Map([["--radius-sm", "4px"]]), theme, scope).valueMismatches).toEqual([]);
  });
});
