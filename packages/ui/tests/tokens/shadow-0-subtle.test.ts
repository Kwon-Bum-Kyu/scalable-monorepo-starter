import { describe, expect, it } from "vitest";

import { getCssVar, tokenExists } from "./helpers";

describe("--shadow-0-subtle 토큰 (Ralph R3a — claude-design-page-alignment)", () => {
  it("globals.css @theme 블록에 정의된다", () => {
    expect(
      tokenExists("--shadow-0-subtle"),
      "--shadow-0-subtle 토큰이 globals.css에 정의되어야 합니다 (정본 SSOT — 카드 외곽 미세 그림자)",
    ).toBe(true);
  });

  it("값이 정본 카드 외곽 그림자(0 1px 2px 0 rgba(22,22,19,0.04))와 일치한다", () => {
    const value = getCssVar("--shadow-0-subtle");
    expect(
      /0\s+1px\s+2px\s+0\s+rgba\(22,\s*22,\s*19,\s*0\.04\)/.test(value),
      `--shadow-0-subtle 값은 0 1px 2px 0 rgba(22,22,19,0.04)이어야 합니다 (실제: ${value})`,
    ).toBe(true);
  });
});
