import { Link } from "@repo/ui/components/link";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

describe("Link", () => {
  it("to prop이 href로 전달된다", () => {
    render(
      <MemoryRouter>
        <Link to="/dashboard">대시보드</Link>
      </MemoryRouter>,
    );
    const link = screen.getByRole("link", { name: "대시보드" });
    expect(link).toHaveAttribute("href", "/dashboard");
  });

  it("external=true이면 anchor 태그로 렌더되고 target·rel이 적용된다", () => {
    render(
      <Link to="https://anthropic.com" external>
        외부
      </Link>,
    );
    const link = screen.getByRole("link", { name: "외부" });
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "https://anthropic.com");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));
  });

  it("className이 anchor에 적용된다", () => {
    render(
      <MemoryRouter>
        <Link to="/" className="text-primary">
          홈
        </Link>
      </MemoryRouter>,
    );
    expect(screen.getByRole("link", { name: "홈" })).toHaveClass(
      "text-primary",
    );
  });
});
