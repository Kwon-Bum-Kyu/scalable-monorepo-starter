import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import { BLUE_PALETTE, GRAY_PALETTE, SEMANTIC_ALIASES } from "@/view/guide/colorData";
import { BREAKPOINT_BARS, FONT_FAMILIES, FONT_WEIGHTS, RADIUS_SCALE, SHADOW_SCALE, SPACING_TOKENS, TYPE_SCALE } from "@/view/guide/scaleData";
import scaleDataSource from "@/view/guide/scaleData.ts?raw";

const css = readFileSync(resolve(__dirname, "../../../../../../packages/ui/src/styles/globals.css"), "utf8");
const cssValue = (token: string) => css.match(new RegExp(`--${token}:\\s*([^;]+);`))?.[1]?.trim();

describe("가이드 토큰 데이터", () => {
  it("컬러 데이터가 CSS 토큰과 일치할 때 완성된 클래스 리터럴을 제공한다", () => {
    const palettes = [...BLUE_PALETTE, ...GRAY_PALETTE];
    expect(palettes).toHaveLength(20);
    palettes.forEach((swatch) => {
      expect(swatch.value).toBe(cssValue(`color-${swatch.name}`));
      expect(swatch.className).toBe(`bg-${swatch.name}`);
    });
    expect(SEMANTIC_ALIASES).toHaveLength(8);
    SEMANTIC_ALIASES.forEach((alias) => {
      expect(cssValue(`color-${alias.name}`)).toBe(`var(--color-${alias.target})`);
      expect(alias.className).toBe(`bg-${alias.target}`);
    });
  });

  it("타이포그래피 데이터가 CSS 토큰과 일치할 때 모든 단계를 제공한다", () => {
    expect(FONT_FAMILIES).toHaveLength(4);
    expect(FONT_WEIGHTS).toHaveLength(4);
    expect(TYPE_SCALE).toHaveLength(10);
    FONT_FAMILIES.forEach((font) => expect(cssValue(font.token)?.split(",")[0]?.replace(/"/g, "")).toBe(font.family));
    FONT_WEIGHTS.forEach((weight) => expect(cssValue(weight.token)).toBe(weight.value));
    TYPE_SCALE.forEach((type) => {
      expect(type.className).toBe(type.token);
      expect(cssValue(type.token)).toBe(`${type.size}px`);
      expect(cssValue(`${type.token}--line-height`)).toBe(`${type.lineHeight}px`);
    });
  });

  it("scaleData 소스가 클래스를 템플릿으로 조립하지 않을 때 Tailwind가 모든 견본 클래스를 생성한다", () => {
    const source = scaleDataSource;
    expect(source).not.toMatch(/\$\{/);
    expect(source).toContain('className: "text-5xl"');
    expect(source).toContain('className: "text-6xl"');
  });

  it("크기 데이터가 CSS 토큰과 일치할 때 지정된 개수를 제공한다", () => {
    expect(SPACING_TOKENS).toHaveLength(5);
    expect(RADIUS_SCALE).toHaveLength(7);
    expect(SHADOW_SCALE).toHaveLength(5);
    expect(BREAKPOINT_BARS).toHaveLength(4);
    const REM = 16;
    const resolveRadius = (raw: string | undefined): string => {
      if (raw === "0") return "0";
      const calc = raw?.match(/^calc\(var\(--radius\) ([+-]) (\d+)px\)$/);
      if (calc) return `${REM / 2 + (calc[1] === "+" ? 1 : -1) * Number(calc[2])}px`;
      if (raw === "var(--radius)") return `${REM / 2}px`;
      return raw ?? "";
    };
    expect(cssValue("radius")).toBe("0.5rem");
    RADIUS_SCALE.forEach((r) => expect(resolveRadius(cssValue(r.token))).toBe(r.value));
    SPACING_TOKENS.forEach((s) => expect(cssValue(s.token)).toBe(s.value));
    const cssShadows = [...css.matchAll(/--(shadow-[\w-]+):/g)].map((m) => m[1]);
    expect(SHADOW_SCALE.map((s) => s.token).sort()).toEqual([...new Set(cssShadows)].sort());
    BREAKPOINT_BARS.forEach((bp) => expect(cssValue(`breakpoint-${bp.name}`)).toBe(bp.value));
  });
});
