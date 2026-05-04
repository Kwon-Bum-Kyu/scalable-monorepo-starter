import { Input } from "@repo/ui/components/input";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("Input radius 정본 SSOT (Ralph R3a — claude-design-page-alignment)", () => {
  it("Input은 rounded-lg(8px) 클래스를 사용한다 — Claude Design 옵션 B 결정 정합", () => {
    const { container } = render(<Input placeholder="t" />);
    const input = container.querySelector("input");
    expect(input).not.toBeNull();
    expect(
      input!.className.includes("rounded-lg"),
      `Input은 정본 SSOT(Buttons & Inputs use rounded-lg 8px)에 따라 rounded-lg를 가져야 합니다 (실제: ${input!.className})`,
    ).toBe(true);
    expect(
      input!.className.includes("rounded-md"),
      `Input은 shadcn 기본 rounded-md를 사용하지 않아야 합니다 (실제: ${input!.className})`,
    ).toBe(false);
  });

  it("Input height는 h-10이다 (정본 40px)", () => {
    const { container } = render(<Input placeholder="t" />);
    const input = container.querySelector("input")!;
    expect(/\bh-10\b/.test(input.className)).toBe(true);
  });
});
