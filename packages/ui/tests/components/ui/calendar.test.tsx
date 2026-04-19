import { Calendar } from "@repo/ui/components/calendar";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("Calendar", () => {
  it("기본 달력이 렌더된다", () => {
    render(<Calendar mode="single" />);
    expect(screen.getByRole("grid")).toBeInTheDocument();
  });

  it("월 선택 버튼이 표시된다", () => {
    render(<Calendar mode="single" />);
    expect(
      screen.getByRole("button", { name: /previous/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /next/i })
    ).toBeInTheDocument();
  });
});
