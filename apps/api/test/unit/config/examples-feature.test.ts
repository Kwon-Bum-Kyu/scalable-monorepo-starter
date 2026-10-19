import { describe, expect, it } from "vitest";

import { isExamplesEnabled } from "../../../src/config/examples-feature";

describe("isExamplesEnabled", () => {
  it("NODE_ENV가 production이면 isExamplesEnabled가 false다", () => {
    expect(
      isExamplesEnabled({ NODE_ENV: "production", ENABLE_EXAMPLES: true }),
    ).toBe(false);
  });

  it("ENABLE_EXAMPLES가 false면 isExamplesEnabled가 false다", () => {
    expect(
      isExamplesEnabled({ NODE_ENV: "development", ENABLE_EXAMPLES: false }),
    ).toBe(false);
  });

  it("NODE_ENV가 development이고 ENABLE_EXAMPLES가 true면 isExamplesEnabled가 true다", () => {
    expect(
      isExamplesEnabled({ NODE_ENV: "development", ENABLE_EXAMPLES: true }),
    ).toBe(true);
  });

  it("NODE_ENV가 test이고 ENABLE_EXAMPLES가 true면 isExamplesEnabled가 true다", () => {
    expect(
      isExamplesEnabled({ NODE_ENV: "test", ENABLE_EXAMPLES: true }),
    ).toBe(true);
  });
});
