import { describe, it } from "vitest";

import { assertPxValue, getCssVar } from "./helpers";

describe("breakpoint tokens (FR-4)", () => {
  it("breakpoint-mobile = 640px", () => {
    assertPxValue(getCssVar("--breakpoint-mobile"), 640);
  });

  it("breakpoint-tablet = 768px", () => {
    assertPxValue(getCssVar("--breakpoint-tablet"), 768);
  });

  it("breakpoint-desktop = 1280px (container-app 폭과 정합, FR-4)", () => {
    assertPxValue(getCssVar("--breakpoint-desktop"), 1280);
  });

  it("breakpoint-wide = 1920px", () => {
    assertPxValue(getCssVar("--breakpoint-wide"), 1920);
  });

  it("container-app = 1280px (desktop 브레이크포인트와 정합)", () => {
    assertPxValue(getCssVar("--container-app"), 1280);
  });
});
