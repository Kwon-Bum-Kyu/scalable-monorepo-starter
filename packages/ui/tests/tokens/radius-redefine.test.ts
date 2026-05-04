import { describe, expect, it } from "vitest";

import { getCssVar } from "./helpers";

describe("--radius 토큰 재정의 정본 SSOT (Ralph R3a — Claude Design 옵션 B 결정)", () => {
  it("--radius 값이 0.5rem이다 — 0.75rem에서 변경", () => {
    const value = getCssVar("--radius");
    expect(
      value,
      `--radius는 정본 옵션 B 결정에 따라 0.5rem이어야 합니다 (실제: ${value})`,
    ).toBe("0.5rem");
  });

  it("--radius-sm은 calc(--radius - 4px) = 4px로 평가되는 형태다", () => {
    const value = getCssVar("--radius-sm");
    expect(
      /calc\(var\(--radius\)\s*-\s*4px\)/.test(value),
      `--radius-sm은 calc(var(--radius) - 4px) 형태여야 합니다 (실제: ${value})`,
    ).toBe(true);
  });

  it("--radius-md는 calc(--radius - 2px) = 6px로 평가되는 형태다", () => {
    const value = getCssVar("--radius-md");
    expect(
      /calc\(var\(--radius\)\s*-\s*2px\)/.test(value),
      `--radius-md은 calc(var(--radius) - 2px) 형태여야 합니다 (실제: ${value})`,
    ).toBe(true);
  });

  it("--radius-lg는 var(--radius) = 8px로 평가되는 형태다", () => {
    const value = getCssVar("--radius-lg");
    expect(
      /var\(--radius\)/.test(value),
      `--radius-lg는 var(--radius) 형태여야 합니다 (실제: ${value})`,
    ).toBe(true);
  });
});
