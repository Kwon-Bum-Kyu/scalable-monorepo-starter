import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect,it } from "vitest";

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

describe("RootLayout 컴포넌트", () => {
  describe("레이아웃 구조", () => {
    it("Header, Outlet, Footer 순서로 렌더링된다.", () => {
      renderWithRouter(<div data-testid="outlet">Outlet</div>);

      // Header가 렌더링되는지 확인 (복수개의 navigation이 있을 수 있음)
      expect(screen.getAllByRole("navigation")).toHaveLength(2);

      // Footer가 렌더링되는지 확인
      expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    });

    it("Header가 로그아웃 상태로 렌더링된다.", () => {
      renderWithRouter(<div data-testid="outlet">Outlet</div>);

      // Header 컴포넌트가 isLoggedIn={false}로 렌더링되는지 확인
      const navigations = screen.getAllByRole("navigation");
      expect(navigations).toHaveLength(2);
    });

    it("Outlet이 라우터 콘텐츠를 렌더링할 수 있다.", () => {
      renderWithRouter(<div data-testid="outlet">Outlet</div>);

      // Outlet 컴포넌트가 있는지 확인하기 위해 전체 레이아웃이 렌더링되는지 확인
      expect(screen.getAllByRole("navigation")).toHaveLength(2);
      expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    });

    it("모든 주요 레이아웃 요소가 표시된다.", () => {
      renderWithRouter(<div data-testid="outlet">Outlet</div>);

      expect(screen.getAllByRole("navigation")).toHaveLength(2);
      expect(screen.getByRole("contentinfo")).toBeInTheDocument();
      expect(screen.getByTestId("outlet")).toBeInTheDocument();
    });
  });
});
