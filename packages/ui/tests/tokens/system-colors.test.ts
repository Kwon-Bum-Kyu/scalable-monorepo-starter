import { describe, it } from "vitest";

import { assertHexColor, getCssVar } from "./helpers";

describe("system colors (FR-5)", () => {
  it("system-red/green/white 기존 토큰이 유지된다", () => {
    assertHexColor(getCssVar("--color-system-red"), "#c2050b");
    assertHexColor(getCssVar("--color-system-green"), "#07b46f");
    assertHexColor(getCssVar("--color-system-white"), "#ffffff");
  });

  it("system-warning 토큰이 #f9a80a로 정의된다 (FR-5)", () => {
    assertHexColor(getCssVar("--color-system-warning"), "#f9a80a");
  });

  it("system-info 토큰이 #2196f3로 정의된다 (FR-5)", () => {
    assertHexColor(getCssVar("--color-system-info"), "#2196f3");
  });
});

describe("state alias colors (FR-5)", () => {
  it("state-warning이 system-warning을 참조한다", () => {
    const value = getCssVar("--color-state-warning");
    if (!value.includes("--color-system-warning")) {
      throw new Error(
        `expected state-warning to alias system-warning but got "${value}"`,
      );
    }
  });

  it("state-info가 system-info를 참조한다", () => {
    const value = getCssVar("--color-state-info");
    if (!value.includes("--color-system-info")) {
      throw new Error(
        `expected state-info to alias system-info but got "${value}"`,
      );
    }
  });
});
