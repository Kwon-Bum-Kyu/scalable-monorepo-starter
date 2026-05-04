import { describe, expect, it } from "vitest";

import { getCssVar, tokenExists } from "./helpers";

describe("--radius-full 토큰 (claude-design-page-alignment Ralph R1)", () => {
  it("globals.css @theme 또는 @theme inline 블록에 정의된다", () => {
    expect(
      tokenExists("--radius-full"),
      "--radius-full 토큰이 globals.css에 정의되어야 합니다 (정본 SSOT — pill·badge·toggle radius)",
    ).toBe(true);
  });

  it("값이 9999px다", () => {
    const value = getCssVar("--radius-full");
    expect(
      value,
      `--radius-full 값은 9999px이어야 하지만 ${value}였습니다`,
    ).toBe("9999px");
  });
});
