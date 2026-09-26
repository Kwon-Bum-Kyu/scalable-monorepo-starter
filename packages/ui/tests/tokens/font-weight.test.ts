import { describe, it } from "vitest";

import { assertNumberValue, getCssVar } from "./helpers";

describe("font-weight tokens (FR-9)", () => {
  it("font-weight-regular = 400", () => {
    assertNumberValue(getCssVar("--font-weight-regular"), 400);
  });

  it("font-weight-medium 토큰이 500으로 정의된다", () => {
    assertNumberValue(getCssVar("--font-weight-medium"), 500);
  });

  it("font-weight-semibold = 600", () => {
    assertNumberValue(getCssVar("--font-weight-semibold"), 600);
  });

  it("font-weight-bold = 700", () => {
    assertNumberValue(getCssVar("--font-weight-bold"), 700);
  });
});
