import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect,it } from "vitest";

import Logo from "../../../src/components/Logo";

describe("Logo 컴포넌트", () => {
  const renderLogo = () => {
    return render(
      <MemoryRouter>
        <Logo />
      </MemoryRouter>
    );
  };

  it("로고 이미지가 렌더링되어야 한다.", () => {
    renderLogo();
    const logo = screen.getByRole("img", { name: /logo/i });
    expect(logo).toBeInTheDocument();
  });

  it("로고가 홈 링크를 포함한다.", () => {
    renderLogo();
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/");
  });
});
