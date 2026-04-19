import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect,it } from "vitest";

import Breadcrumb from "../../../src/components/Breadcrumb";

const mockItems = [
  { label: "Home", href: "/" },
  { label: "Docs", href: "/docs" },
  { label: "Components", href: "/docs/components" },
  { label: "Breadcrumb" },
];

describe("Breadcrumb 컴포넌트", () => {
  const renderBreadcrumb = () => {
    return render(
      <MemoryRouter>
        <Breadcrumb items={mockItems} />
      </MemoryRouter>
    );
  };

  it("모든 Breadcrumb 항목이 렌더링되어야 한다.", () => {
    renderBreadcrumb();
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Docs")).toBeInTheDocument();
    expect(screen.getByText("Components")).toBeInTheDocument();
    expect(screen.getByText("Breadcrumb")).toBeInTheDocument();
  });

  it("링크가 있는 항목은 클릭 가능하다.", () => {
    renderBreadcrumb();
    const homeLink = screen.getByText("Home");
    expect(homeLink.closest("a")).toHaveAttribute("href", "/");
  });
});
