import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect,it } from "vitest";

import Header from "@/components/Header";

describe("Header 컴포넌트", () => {
  const renderHeader = (props: { isLoggedIn: boolean; username?: string }) => {
    return render(
      <MemoryRouter>
        <Header {...props} />
      </MemoryRouter>
    );
  };

  describe("로그인 상태 Header", () => {
    it("로그인 상태에서 사용자 이름이 표시된다.", () => {
      renderHeader({ isLoggedIn: true, username: "KBK" });
      const userButton = screen.getByRole("button", { name: /KBK/i });
      expect(userButton).toBeInTheDocument();
    });

    it("로그인 상태에서 네비게이션 링크가 표시된다.", () => {
      renderHeader({ isLoggedIn: true, username: "KBK" });
      const navs = screen.getAllByRole("navigation");
      expect(navs.length).toBeGreaterThan(0);
    });
  });

  describe("로그아웃 상태 Header", () => {
    it("로그아웃 상태에서 로그인/회원가입 버튼이 표시된다.", () => {
      renderHeader({ isLoggedIn: false });
      const navs = screen.getAllByRole("navigation");
      expect(navs).toHaveLength(2);
      const desktopNav = navs[0];
      expect(within(desktopNav).getByText("Log in")).toBeInTheDocument();
      expect(within(desktopNav).getByText("Register")).toBeInTheDocument();
    });

    it("로그아웃 상태에서 사용자 이름이 표시되지 않는다.", () => {
      renderHeader({ isLoggedIn: false });
      expect(
        screen.queryByRole("button", { name: /KBK/i })
      ).not.toBeInTheDocument();
    });
  });
});
