import lockupHorizontalSrc from "@repo/ui/assets/brand/logo/lockup-horizontal.svg";
import { Logo } from "@repo/ui/components/logo";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

describe("Logo", () => {
  it("Logo가 기본 렌더될 때 가로 조합 자산과 브랜드 이름을 표시한다", () => {
    render(
      <MemoryRouter>
        <Logo />
      </MemoryRouter>,
    );
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/");
    expect(link.className).toContain("rounded-sm");
    expect(link.className).toContain("focus-visible:ring-2");
    const img = screen.getByAltText("scalable-monorepo-starter");
    expect(img).toHaveAttribute("src", lockupHorizontalSrc);
    expect(img.getAttribute("src")).toContain("lockup-horizontal");
    expect(img.className).toContain("h-auto");
    expect(img.className).toContain("w-62.5");
    expect(img.className).toContain("flex-none");
  });

  it("Logo가 to·src·alt props를 받을 때 기본값을 대체한다", () => {
    render(
      <MemoryRouter>
        <Logo to="/home" src="/brand.png" alt="Brand" />
      </MemoryRouter>,
    );
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/home");
    const img = screen.getByAltText("Brand");
    expect(img).toHaveAttribute("src", "/brand.png");
  });
});
