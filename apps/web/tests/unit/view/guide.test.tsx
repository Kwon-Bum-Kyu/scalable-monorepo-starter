import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Guide from "@/view/guide";

describe("Guide 페이지", () => {
  it("Typography 제목들이 모두 렌더링된다", () => {
    render(<Guide />);
    expect(screen.getByText("H1 Title")).toBeInTheDocument();
    expect(screen.getByText("H2 Title")).toBeInTheDocument();
  });

  it("ButtonGroup의 'Button 1' 버튼이 노출되어 있다", () => {
    render(<Guide />);
    expect(screen.getByRole("button", { name: "Button 1" })).toBeVisible();
  });

  it("Empty 컴포넌트 3종이 동시에 렌더링된다", () => {
    const { container } = render(<Guide />);
    const empties = container.querySelectorAll(".bg-gray-100");
    expect(empties.length).toBeGreaterThanOrEqual(3);
  });
});
