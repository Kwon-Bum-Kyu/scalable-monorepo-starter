import { fireEvent,render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import Tabs from "../../../src/components/Tabs";

describe("Tabs 컴포넌트", () => {
  const mockTabs = ["Tab 1", "Tab 2", "Tab 3"];

  it("모든 탭이 렌더링되어야 한다.", () => {
    render(
      <Tabs tabs={mockTabs} activeTab="Tab 1" onChange={() => {}} />
    );
    expect(screen.getByText("Tab 1")).toBeInTheDocument();
    expect(screen.getByText("Tab 2")).toBeInTheDocument();
    expect(screen.getByText("Tab 3")).toBeInTheDocument();
  });

  it("탭 클릭 시 onChange가 호출된다.", () => {
    const handleChange = vi.fn();
    render(
      <Tabs tabs={mockTabs} activeTab="Tab 1" onChange={handleChange} />
    );
    fireEvent.click(screen.getByText("Tab 2"));
    expect(handleChange).toHaveBeenCalledWith("Tab 2");
  });

  it("underline variant가 적용된다.", () => {
    render(
      <Tabs
        tabs={mockTabs}
        activeTab="Tab 1"
        onChange={() => {}}
        variant="underline"
      />
    );
    expect(screen.getByText("Tab 1")).toBeInTheDocument();
  });

  it("pill variant가 적용된다.", () => {
    render(
      <Tabs
        tabs={mockTabs}
        activeTab="Tab 1"
        onChange={() => {}}
        variant="pill"
      />
    );
    expect(screen.getByText("Tab 1")).toBeInTheDocument();
  });
});
