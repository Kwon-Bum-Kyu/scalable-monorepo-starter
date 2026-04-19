import { Logo } from "@repo/ui/components/logo";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

describe("Logo", () => {
  it("기본 렌더 시 to=/ 로 링크되며 alt=Logo 이미지가 표시된다", () => {
    render(
      <MemoryRouter>
        <Logo />
      </MemoryRouter>
    );
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/");
    const img = screen.getByAltText("Logo");
    expect(img).toBeInTheDocument();
  });

  it("to·src·alt props를 오버라이드할 수 있다", () => {
    render(
      <MemoryRouter>
        <Logo to="/home" src="/brand.png" alt="Brand" />
      </MemoryRouter>
    );
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/home");
    const img = screen.getByAltText("Brand");
    expect(img).toHaveAttribute("src", "/brand.png");
  });
});
