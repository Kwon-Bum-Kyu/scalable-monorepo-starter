import { Footer } from "@repo/ui/components/footer";
import { render, screen, within } from "@testing-library/react";
import * as React from "react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

function renderWithRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe("Footer", () => {
  it("columns 배열에 따라 섹션 title과 링크가 렌더된다", () => {
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
      />
    );
    expect(screen.getByText("제품")).toBeInTheDocument();
    expect(screen.getByText("회사")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "가이드" })).toHaveAttribute(
      "href",
      "/guide"
    );
  });

  it("external=true 링크는 anchor 태그로 렌더되고 target이 _blank이다", () => {
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
      />
    );
    const link = screen.getByRole("link", { name: "깃허브" });
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("bottom 슬롯이 렌더된다", () => {
    renderWithRouter(
      <Footer
        columns={[]}
        bottom={<span data-testid="copyright">© 2026</span>}
      />
    );
    expect(screen.getByTestId("copyright")).toBeInTheDocument();
  });

  it("footer 랜드마크가 표시된다", () => {
    renderWithRouter(<Footer columns={[]} />);
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("contentinfo 안에서 columns가 렌더된다", () => {
    renderWithRouter(
      <Footer
        columns={[{ title: "링크", links: [{ label: "홈", href: "/" }] }]}
      />
    );
    const footer = screen.getByRole("contentinfo");
    expect(within(footer).getByText("링크")).toBeInTheDocument();
  });
});
