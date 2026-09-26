import { describe, expect, it } from "vitest";

import { assertPxValue, getCssVar, tokenExists } from "./helpers";

describe("spacing tokens (FR-2)", () => {
  it("spacing-16 토큰이 64px(Tailwind 4px-base 표준)로 정의된다", () => {
    assertPxValue(getCssVar("--spacing-16"), 64);
  });

  it("의미적 spacing 별칭(logo-h/header/page-x)이 px 값으로 정의된다", () => {
    expect(tokenExists("--spacing-logo-h")).toBe(true);
    expect(tokenExists("--spacing-header")).toBe(true);
    expect(tokenExists("--spacing-page-x")).toBe(true);
  });

  it("spacing-header 토큰이 64px(Claude Design 명세 정렬, FR-3)로 정의된다", () => {
    assertPxValue(getCssVar("--spacing-header"), 64);
  });

  it("spacing-page-x 토큰이 72px로 유지된다", () => {
    assertPxValue(getCssVar("--spacing-page-x"), 72);
  });

  it("spacing-logo-h 토큰이 40px로 유지된다", () => {
    assertPxValue(getCssVar("--spacing-logo-h"), 40);
  });

  it("spacing-sidebar-h 토큰이 calc(100vh - 2rem)으로 정의된다", () => {
    expect(getCssVar("--spacing-sidebar-h")).toBe("calc(100vh - 2rem)");
  });
});
