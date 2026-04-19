import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Label } from "@repo/ui/components/label";

describe("Label", () => {
  it("기본 라벨 텍스트가 렌더된다", () => {
    render(<Label htmlFor="email">이메일</Label>);
    expect(screen.getByText("이메일")).toBeInTheDocument();
  });

  it("htmlFor로 form 요소에 연결된다", () => {
    render(<Label htmlFor="email">이메일</Label>);
    expect(screen.getByText("이메일")).toHaveAttribute("for", "email");
  });
});
