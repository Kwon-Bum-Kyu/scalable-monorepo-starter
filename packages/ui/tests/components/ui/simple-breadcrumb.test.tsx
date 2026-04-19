import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { SimpleBreadcrumb } from "@repo/ui/components/simple-breadcrumb";

function renderWithRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe("SimpleBreadcrumb", () => {
  it("items 배열 중 마지막을 제외한 모두는 링크로 렌더된다", () => {
    renderWithRouter(
      <SimpleBreadcrumb
        items={[
          { label: "홈", href: "/" },
          { label: "문서", href: "/docs" },
          { label: "가이드" },
        ]}
      />
    );
    expect(screen.getByRole("link", { name: "홈" })).toHaveAttribute(
      "href",
      "/"
    );
    expect(screen.getByRole("link", { name: "문서" })).toHaveAttribute(
      "href",
      "/docs"
    );
  });

  it("마지막 항목은 현재 페이지로 표시된다 (aria-current=page)", () => {
    renderWithRouter(
      <SimpleBreadcrumb
        items={[
          { label: "홈", href: "/" },
          { label: "가이드" },
        ]}
      />
    );
    const current = screen.getByText("가이드");
    expect(current).toHaveAttribute("aria-current", "page");
    expect(current).toHaveAttribute("aria-disabled", "true");
    expect(current).not.toHaveAttribute("href");
  });

  it("breadcrumb nav 랜드마크가 표시된다", () => {
    renderWithRouter(
      <SimpleBreadcrumb items={[{ label: "홈", href: "/" }, { label: "현재" }]} />
    );
    expect(screen.getByRole("navigation", { name: /breadcrumb/i })).toBeInTheDocument();
  });
});
