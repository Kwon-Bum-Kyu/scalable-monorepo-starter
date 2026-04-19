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
});
