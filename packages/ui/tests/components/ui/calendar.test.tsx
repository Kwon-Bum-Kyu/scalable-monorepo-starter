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
      screen.getByRole("button", { name: /previous/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument();
  });

  it("month/year dropdown 컨테이너는 elevation 1단계(subtle) 토큰을 적용한다", () => {
    render(<Calendar mode="single" captionLayout="dropdown" />);
    const dropdownRoot = document.querySelector(".rdp-dropdown_root");
    expect(dropdownRoot).not.toBeNull();
    expect(dropdownRoot?.className).toContain("shadow-1-subtle");
    expect(dropdownRoot?.className).not.toContain("shadow-xs");
  });
});
