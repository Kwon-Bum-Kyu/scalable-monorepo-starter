import { Checkbox } from "@repo/ui/components/checkbox";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("Checkbox 정본 SSOT 양보값 (Ralph R3b — 16×16/border gray-200/blue-500)", () => {
  it("h-4 w-4 (16×16) + rounded-sm (4px) + border-gray-200을 가진다", () => {
    const { container } = render(<Checkbox aria-label="cb" />);
    const cb = container.querySelector("button[role='checkbox']")!;
    expect(/\bh-4\b/.test(cb.className)).toBe(true);
    expect(/\bw-4\b/.test(cb.className)).toBe(true);
    expect(/\brounded-sm\b/.test(cb.className)).toBe(true);
    expect(
      /\bborder-gray-200\b/.test(cb.className),
      `Checkbox border는 gray-200이어야 합니다 (실제: ${cb.className})`,
    ).toBe(true);
    expect(
      /\bborder-primary\b/.test(cb.className),
      `Checkbox는 border-primary를 사용하지 않아야 합니다 (실제: ${cb.className})`,
    ).toBe(false);
  });

  it("checked 상태에서 bg-blue-500을 사용한다 (정본 SSOT)", () => {
    const { container } = render(<Checkbox aria-label="cb" />);
    const cb = container.querySelector("button[role='checkbox']")!;
    expect(
      /data-\[state=checked\]:bg-blue-500/.test(cb.className),
      `Checkbox checked bg는 blue-500이어야 합니다 (실제: ${cb.className})`,
    ).toBe(true);
  });
});
