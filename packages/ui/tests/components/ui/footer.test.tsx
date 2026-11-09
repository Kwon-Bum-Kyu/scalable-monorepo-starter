import { Footer } from "@repo/ui/components/footer";
import { render, screen, within } from "@testing-library/react";
import * as React from "react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

function renderWithRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe("Footer", () => {
  it("Footer가 columns를 받을 때 섹션 제목과 링크를 렌더한다", () => {
    renderWithRouter(
      <Footer
        columns={[
          {
            title: "제품",
            links: [
              { label: "홈", href: "/" },
              { label: "가이드", href: "/guide" },
            ],
          },
          {
            title: "회사",
            links: [{ label: "소개", href: "/about" }],
          },
        ]}
      />,
    );
    expect(screen.getByText("제품")).toBeInTheDocument();
    expect(screen.getByText("회사")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "가이드" })).toHaveAttribute(
      "href",
      "/guide",
    );
  });

  it("Footer가 external 링크를 받을 때 새 탭 anchor로 렌더한다", () => {
    renderWithRouter(
      <Footer
        columns={[
          {
            title: "외부",
            links: [
              { label: "깃허브", href: "https://github.com", external: true },
            ],
          },
        ]}
      />,
    );
    const link = screen.getByRole("link", { name: "깃허브" });
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("Footer가 bottom 슬롯을 받을 때 하단 내용을 렌더한다", () => {
    renderWithRouter(
      <Footer
        columns={[]}
        bottom={<span data-testid="copyright">© 2026</span>}
      />,
    );
    expect(screen.getByTestId("copyright")).toBeInTheDocument();
  });

  it("Footer가 기본 렌더될 때 contentinfo 랜드마크를 표시한다", () => {
    renderWithRouter(<Footer columns={[]} />);
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("Footer가 columns를 렌더할 때 contentinfo 안에 표시한다", () => {
    renderWithRouter(
      <Footer
        columns={[{ title: "링크", links: [{ label: "홈", href: "/" }] }]}
      />,
    );
    const footer = screen.getByRole("contentinfo");
    expect(within(footer).getByText("링크")).toBeInTheDocument();
  });

  it("Footer가 반응형 레이아웃을 렌더할 때 여백과 열 수를 적용한다", () => {
    renderWithRouter(
      <Footer
        columns={[{ title: "링크", links: [{ label: "홈", href: "/" }] }]}
      />,
    );

    const container = screen.getByRole("contentinfo").firstElementChild;
    const columns = screen.getByText("링크").parentElement?.parentElement;
    expect(container?.className).toContain("px-4");
    expect(container?.className).toContain("tablet:px-8");
    expect(container?.className).toContain("desktop:px-page-x");
    expect(container?.className).toContain("py-10");
    expect(columns?.className).toContain("grid-cols-1");
    expect(columns?.className).toContain("tablet:grid-cols-2");
    expect(columns?.className).toContain("desktop:grid-cols-4");
    expect(columns?.className).not.toContain("md:");
  });

  it("Footer가 링크별 className을 받을 때 기본 링크 클래스 뒤에 합성한다", () => {
    renderWithRouter(
      <Footer
        columns={[
          {
            title: "링크",
            links: [{ label: "워크스페이스", href: "/apps", className: "font-mono" }],
          },
        ]}
      />,
    );

    const link = screen.getByRole("link", { name: "워크스페이스" });
    expect(link.className).toContain("rounded-sm");
    expect(link.className).toContain("transition-colors");
    expect(link.className).toContain("focus-visible:ring-2");
    expect(link.className).toMatch(/focus-visible:ring-offset-2.*font-mono$/);
  });
});
