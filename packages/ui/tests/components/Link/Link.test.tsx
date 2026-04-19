import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect,it } from "vitest";

import Link from "../../../src/components/Link";

describe("Link 컴포넌트", () => {
  const renderLink = (props: { to: string; children: React.ReactNode; disabled?: boolean }) => {
    return render(
      <MemoryRouter>
        <Link {...props} />
      </MemoryRouter>
    );
  };

  it("링크 텍스트와 올바른 href 속성이 렌더링되어야 한다.", () => {
    renderLink({ to: "/", children: "Go to Home" });
    const link = screen.getByText("Go to Home");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/");
  });

  it("비활성화된 링크가 올바르게 렌더링된다.", () => {
    renderLink({ to: "/disabled", children: "Disabled Link", disabled: true });
    const link = screen.getByText("Disabled Link");
    expect(link).toBeInTheDocument();
  });
});
