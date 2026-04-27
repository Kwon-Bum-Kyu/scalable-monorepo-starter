import { Header } from "@repo/ui/components/header";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

describe("Header", () => {
  it("logo·nav·actions 슬롯이 각각 렌더된다", () => {
    render(
      <Header
        logo={<span data-testid="logo">L</span>}
        nav={<span data-testid="nav">N</span>}
        actions={<span data-testid="actions">A</span>}
      />,
    );
    expect(screen.getByTestId("logo")).toBeInTheDocument();
    expect(screen.getByTestId("nav")).toBeInTheDocument();
    expect(screen.getByTestId("actions")).toBeInTheDocument();
  });

  it("기본 렌더 시 header 랜드마크가 표시된다", () => {
    render(<Header logo={<span>L</span>} />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  it("inner container에 헤더 높이·페이지 좌우 패딩·앱 컨테이너 토큰이 적용된다", () => {
    render(<Header logo={<span>L</span>} />);
    const banner = screen.getByRole("banner");
    const inner = banner.firstElementChild as HTMLElement;
    expect(inner.className).toContain("min-h-header");
    expect(inner.className).toContain("px-page-x");
    expect(inner.className).toContain("max-w-app");
    expect(inner.className).not.toContain("h-16");
    expect(inner.className).not.toContain("px-6");
  });

  it("mobileMenu 슬롯이 주어지면 햄버거 토글 버튼이 표시된다", async () => {
    const user = userEvent.setup();
    render(
      <Header
        logo={<span>L</span>}
        mobileMenu={<div data-testid="mobile-menu">메뉴</div>}
      />,
    );
    const toggle = screen.getByRole("button", { name: /메뉴 열기/ });
    await user.click(toggle);
    expect(screen.getByTestId("mobile-menu")).toBeInTheDocument();
  });
});
