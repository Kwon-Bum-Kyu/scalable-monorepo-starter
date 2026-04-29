import { describe, it } from "vitest";

import { assertPxValue, getCssVar } from "./helpers";

const FULL_RAMP: ReadonlyArray<readonly [string, number]> = [
  ["--line-height-16", 16],
  ["--line-height-20", 20],
  ["--line-height-24", 24],
  ["--line-height-28", 28],
  ["--line-height-32", 32],
  ["--line-height-40", 40],
  ["--line-height-48", 48],
  ["--line-height-56", 56],
  ["--line-height-64", 64],
  ["--line-height-72", 72],
];

describe("line-height tokens (FR-6)", () => {
  it.each(FULL_RAMP)("%s = %ipx", (token, expected) => {
    assertPxValue(getCssVar(token), expected);
  });
});
