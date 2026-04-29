import { describe, expect, it } from "vitest";

import { getCssVar } from "./helpers";

function assertAlias(token: string, target: string): void {
  const value = getCssVar(token);
  expect(
    value.includes(target),
    `${token} should alias ${target} but got "${value}"`,
  ).toBe(true);
}

describe("semantic alias tokens (FR-12)", () => {
  it("color-text-inverse → color-system-white", () => {
    assertAlias("--color-text-inverse", "--color-system-white");
  });

  it("color-bg-accent → color-blue-50", () => {
    assertAlias("--color-bg-accent", "--color-blue-50");
  });

  it("color-border-strong → color-gray-300", () => {
    assertAlias("--color-border-strong", "--color-gray-300");
  });

  it("color-focus-ring → color-blue-500", () => {
    assertAlias("--color-focus-ring", "--color-blue-500");
  });

  it(":root --ring이 --color-focus-ring을 체이닝한다 (FR-12, AC-FR-Q3)", () => {
    assertAlias("--ring", "--color-focus-ring");
  });
});
