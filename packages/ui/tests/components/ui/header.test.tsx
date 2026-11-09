import { Header } from "@repo/ui/components/header";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

describe("Header", () => {
  it("Header가 슬롯을 받을 때 logo·nav·actions를 렌더한다", () => {
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

  it("Header가 기본 렌더될 때 banner 랜드마크를 표시한다", () => {
    render(<Header logo={<span>L</span>} />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  it("Header가 반응형 컨테이너를 렌더할 때 모바일·태블릿·데스크톱 여백을 적용한다", () => {
    render(<Header logo={<span>L</span>} />);
    const banner = screen.getByRole("banner");
    const inner = banner.firstElementChild as HTMLElement;
    expect(inner.className).toContain("min-h-header");
    expect(inner.className).toContain("px-4");
    expect(inner.className).toContain("tablet:px-8");
    expect(inner.className).toContain("desktop:px-page-x");
    expect(inner.className).toContain("max-w-app");
    expect(inner.className).toContain("gap-6");
  });

  it("Header가 nav를 받을 때 주 메뉴 이름과 tablet 배치를 적용한다", () => {
    render(<Header nav={<span>내비게이션</span>} />);

    const nav = screen.getByRole("navigation", { name: "주 메뉴" });
    expect(nav.className).toContain("self-stretch");
    expect(nav.className).toContain("tablet:flex");
    expect(nav.className).not.toContain("md:");
  });

  it("Header가 mobileMenu를 받을 때 44px 메뉴 버튼으로 펼친 메뉴를 표시한다", async () => {
    const user = userEvent.setup();
    render(
      <Header
        logo={<span>L</span>}
        mobileMenu={<div data-testid="mobile-menu">메뉴</div>}
      />,
    );
    const toggle = screen.getByRole("button", { name: /메뉴 열기/ });
    expect(toggle.className).toContain("h-11");
    expect(toggle.className).toContain("w-11");
    expect(toggle.className).toContain("shrink-0");
    expect(toggle.className).toContain("tablet:hidden");
    expect(toggle.className).not.toContain("md:");
    await user.click(toggle);
    const menu = screen.getByTestId("mobile-menu");
    expect(menu.parentElement?.className).toContain("border-t");
    expect(menu.parentElement?.className).toContain("tablet:hidden");
    expect(menu.parentElement?.className).not.toContain("md:");
  });

  it("Header가 펼친 메뉴의 링크를 클릭할 때 메뉴를 닫는다", async () => {
    const user = userEvent.setup();
    render(<Header mobileMenu={<a href="#guide">가이드</a>} />);
    const toggle = screen.getByRole("button", { name: "메뉴 열기" });

    await user.click(toggle);
    await user.click(screen.getByRole("link", { name: "가이드" }));

    expect(screen.queryByRole("link", { name: "가이드" })).not.toBeInTheDocument();
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  it("Header가 펼친 메뉴의 버튼을 클릭할 때 메뉴를 닫는다", async () => {
    const user = userEvent.setup();
    render(<Header mobileMenu={<button type="button">이동</button>} />);
    const toggle = screen.getByRole("button", { name: "메뉴 열기" });

    await user.click(toggle);
    await user.click(screen.getByRole("button", { name: "이동" }));

    expect(screen.queryByRole("button", { name: "이동" })).not.toBeInTheDocument();
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  it("Header가 펼친 메뉴의 일반 텍스트를 클릭할 때 메뉴를 열어 둔다", async () => {
    const user = userEvent.setup();
    render(<Header mobileMenu={<span>메뉴 설명</span>} />);
    const toggle = screen.getByRole("button", { name: "메뉴 열기" });

    await user.click(toggle);
    await user.click(screen.getByText("메뉴 설명"));

    expect(screen.getByText("메뉴 설명")).toBeInTheDocument();
    expect(toggle).toHaveAttribute("aria-expanded", "true");
  });
});
