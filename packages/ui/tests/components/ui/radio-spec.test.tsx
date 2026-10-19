import { RadioGroup, RadioGroupItem } from "@repo/ui/components/radio-group";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("RadioGroupItem 정본 SSOT 양보값 (Ralph R3b — 16×16/border gray-200/dot 8×8 blue-500)", () => {
  it("h-4 w-4 (16×16) + border-gray-200을 가진다", () => {
    const { container } = render(
      <RadioGroup>
        <RadioGroupItem value="a" aria-label="r" />
      </RadioGroup>,
    );
    const r = container.querySelector("button[role='radio']")!;
    expect(/\bh-4\b/.test(r.className)).toBe(true);
    expect(/\bw-4\b/.test(r.className)).toBe(true);
    expect(
      /\bborder-gray-200\b/.test(r.className),
      `Radio border는 gray-200이어야 합니다 (실제: ${r.className})`,
    ).toBe(true);
    expect(
      /\bborder-primary\b/.test(r.className),
      `Radio는 border-primary를 사용하지 않아야 합니다 (실제: ${r.className})`,
    ).toBe(false);
  });
});
