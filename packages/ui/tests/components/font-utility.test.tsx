// @vitest-environment node

import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";

import { compile } from "tailwindcss";
import { beforeAll, describe, expect, it } from "vitest";

import { readTheme } from "../tokens/designMdParser";

const THEME_PATH = resolve(__dirname, "../../src/styles/globals.css");
const requireFromTest = createRequire(__filename);
const CANDIDATES = [
  "font-sans",
  "font-mono",
  "font-display",
  "font-body-alt",
  "text-3xl",
  "font-bold",
];

async function loadStylesheet(
  id: string,
  base: string,
): Promise<{ path: string; base: string; content: string }> {
  const path =
    id === "tailwindcss"
      ? requireFromTest.resolve("tailwindcss/index.css")
      : resolve(base, id);
  return {
    path,
    base: dirname(path),
    content: readFileSync(path, "utf-8"),
  };
}

async function compileThemeUtilities(): Promise<string> {
  const { theme } = readTheme(readFileSync(THEME_PATH, "utf-8"));
  const declarations = [...theme]
    .map(([token, value]) => `  ${token}: ${value};`)
    .join("\n");
  const compiler = await compile(
    `@import "tailwindcss";\n@theme {\n${declarations}\n}\n`,
    { base: dirname(THEME_PATH), loadStylesheet },
  );
  return compiler.build(CANDIDATES);
}

function utilityRule(compiledCss: string, className: string): string {
  const escaped = className.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
  return (
    new RegExp(`\\.${escaped}\\s*\\{([^}]*)\\}`).exec(compiledCss)?.[1] ?? ""
  );
}

function themeValue(compiledCss: string, token: string): string {
  const escaped = token.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
  return (
    new RegExp(`(?<![\\w-])${escaped}\\s*:\\s*([^;]+);`)
      .exec(compiledCss)?.[1]
      .trim() ?? ""
  );
}

function firstFamily(value: string): string {
  return value
    .split(",")[0]
    .trim()
    .replace(/^["']|["']$/g, "");
}

let css = "";
beforeAll(async () => {
  css = await compileThemeUtilities();
});

describe("font-mono utility (FR-FF-7)", () => {
  it("font-mono utility가 적용될 때 computed font-family 첫 번째 패밀리가 Roboto Mono다", () => {
    expect(utilityRule(css, "font-mono")).toContain(
      "font-family: var(--font-mono)",
    );
    expect(firstFamily(themeValue(css, "--font-mono"))).toBe("Roboto Mono");
  });

  it("font-mono utility의 computed font-family에 ui-monospace fallback이 포함된다", () => {
    expect(themeValue(css, "--font-mono")).toContain("ui-monospace");
  });
});

describe("font-sans utility 비파괴 (FR-FF-6)", () => {
  it("font-sans utility가 적용될 때 computed font-family 첫 번째 패밀리가 Open Sans다", () => {
    expect(utilityRule(css, "font-sans")).toContain(
      "font-family: var(--font-sans)",
    );
    expect(firstFamily(themeValue(css, "--font-sans"))).toBe("Open Sans");
  });
});

describe("display·body-alt 글꼴 utility", () => {
  it("font-display와 font-body-alt utility가 굵기가 아닌 글꼴 선언으로 생성된다", () => {
    const display = utilityRule(css, "font-display");
    const bodyAlt = utilityRule(css, "font-body-alt");
    expect(display).toContain("font-family: var(--font-display)");
    expect(display).not.toContain("font-weight");
    expect(firstFamily(themeValue(css, "--font-display"))).toBe("Roboto Mono");
    expect(bodyAlt).toContain("font-family: var(--font-body-alt)");
    expect(bodyAlt).not.toContain("font-weight");
    expect(firstFamily(themeValue(css, "--font-body-alt"))).toBe("PT Sans");
  });
});

describe("type scale utility", () => {
  it("text-3xl utility가 DESIGN.md 짝값인 크기 32px와 행간 48px를 함께 적용한다", () => {
    const rule = utilityRule(css, "text-3xl");
    expect(rule).toContain("var(--text-3xl)");
    expect(rule).toContain("var(--text-3xl--line-height)");
    expect(themeValue(css, "--text-3xl")).toBe("32px");
    expect(themeValue(css, "--text-3xl--line-height")).toBe("48px");
  });
});

describe("font-weight utility", () => {
  it("font-bold utility가 --font-weight-bold 700으로 굵기를 적용한다", () => {
    expect(utilityRule(css, "font-bold")).toContain(
      "font-weight: var(--font-weight-bold)",
    );
    expect(themeValue(css, "--font-weight-bold")).toBe("700");
  });

  it("Tailwind v3식 토큰 이름은 컴파일 결과에 나타나지 않는다", () => {
    expect(css).not.toMatch(/--(?:font-family|font-size|line-height)-/);
  });
});
