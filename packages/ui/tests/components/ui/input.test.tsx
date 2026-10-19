import { Input } from "@repo/ui/components/input";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("Input", () => {
  it("기본 텍스트 input이 렌더된다", () => {
    render(<Input placeholder="이메일" />);
    const input = screen.getByPlaceholderText("이메일");
    expect(input).toBeInTheDocument();
    expect(input.tagName).toBe("INPUT");
  });

  it("border 토큰 클래스가 적용된다", () => {
    render(<Input data-testid="in" />);
    const input = screen.getByTestId("in");
    expect(input.className).toContain("border-input");
  });
});
