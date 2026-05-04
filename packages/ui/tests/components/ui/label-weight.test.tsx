import { Label } from "@repo/ui/components/label";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("Label weight 정본 SSOT (Ralph R3a — claude-design-page-alignment)", () => {
  it("Label은 font-semibold(600) 클래스를 사용한다 — 정본 fw:600 정합", () => {
    render(<Label htmlFor="x">이름</Label>);
    const label = screen.getByText("이름");
    expect(
      label.className.includes("font-semibold"),
      `Label은 정본 SSOT(fw:600)에 따라 font-semibold를 가져야 합니다 (실제: ${label.className})`,
    ).toBe(true);
    expect(
      label.className.includes("font-medium"),
      `Label은 shadcn 기본 font-medium(500)을 사용하지 않아야 합니다 (실제: ${label.className})`,
    ).toBe(false);
  });
});
