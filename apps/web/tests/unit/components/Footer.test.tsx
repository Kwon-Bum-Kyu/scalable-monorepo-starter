import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect,it } from "vitest";

import Footer from "@/components/Footer";

describe("Footer 컴포넌트", () => {
  const renderFooter = () => {
    return render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );
  };

  describe("기본 Footer", () => {
    it("Footer가 렌더링되면 필요한 요소들이 표시된다.", () => {
      renderFooter();
      expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    });

    it("Footer가 레이아웃에 올바르게 표시된다.", () => {
      renderFooter();
      const footer = screen.getByRole("contentinfo");
      expect(footer).toBeInTheDocument();
      expect(footer).toBeVisible();
    });

    it("저작권 정보가 표시된다.", () => {
      renderFooter();
      expect(screen.getByText(/DEV KBK 2025/)).toBeInTheDocument();
    });
  });
});
