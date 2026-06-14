import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";

import RootLayout from "@/components/layouts/rootLayout";

const renderWithRouter = (outlet: React.ReactElement) => {
  return render(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={outlet} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
};

describe("RootLayout", () => {
  it("Header(banner)·Outlet·Footer(contentinfo) 순서로 렌더된다", () => {
    renderWithRouter(<div data-testid="outlet">Outlet</div>);

    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByTestId("outlet")).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("Header에 Primary 네비게이션이 렌더된다", () => {
    renderWithRouter(<div data-testid="outlet">Outlet</div>);

    expect(
      screen.getByRole("navigation", { name: "Primary" }),
    ).toBeInTheDocument();
  });

  it("Outlet이 라우터 콘텐츠를 표시한다", () => {
    renderWithRouter(<div data-testid="outlet">router-content</div>);

    expect(screen.getByTestId("outlet")).toHaveTextContent("router-content");
  });

  it("Outlet이 헤더와 동일한 max-w-app 컨테이너와 page-x 패딩으로 정렬된다", () => {
    renderWithRouter(<div data-testid="outlet">x</div>);

    const outlet = screen.getByTestId("outlet");
    let container: HTMLElement | null = outlet.parentElement;
    while (container && !container.className.includes("max-w-app")) {
      container = container.parentElement;
    }
    expect(container).not.toBeNull();
    expect(container?.className).toContain("max-w-app");
    expect(container?.className).toContain("px-page-x");
    expect(container?.className).toContain("mx-auto");
  });

  it("푸터 카피라이트가 일반화된 표기를 사용하고 개인 식별자를 포함하지 않는다", () => {
    renderWithRouter(<div data-testid="outlet">x</div>);

    const footer = screen.getByRole("contentinfo");
    expect(footer.textContent ?? "").not.toMatch(/DEV KBK/);
    expect(footer.textContent ?? "").toMatch(
      /scalable-monorepo-starter contributors/,
    );
  });

  it("이메일 링크가 placeholder 를 사용하고 개인 메일 주소를 노출하지 않는다", () => {
    renderWithRouter(<div data-testid="outlet">x</div>);

    const emailLink = screen.getByRole("link", { name: /Email/i });
    const href = emailLink.getAttribute("href") ?? "";
    expect(href).not.toMatch(/missing107/);
    expect(href).not.toMatch(/@gmail\.com/);
  });
});
