import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { SimpleTabs } from "@repo/ui/components/simple-tabs";

const items = [
  { value: "a", label: "첫째", content: <div>첫째 컨텐츠</div> },
  { value: "b", label: "둘째", content: <div>둘째 컨텐츠</div> },
];

describe("SimpleTabs", () => {
  it("items 배열 길이만큼 TabsTrigger가 렌더된다", () => {
    render(<SimpleTabs items={items} defaultValue="a" />);
    expect(screen.getAllByRole("tab")).toHaveLength(2);
  });

  it("defaultValue에 해당하는 탭 컨텐츠가 활성화된다", () => {
    render(<SimpleTabs items={items} defaultValue="a" />);
    expect(screen.getByText("첫째 컨텐츠")).toBeInTheDocument();
  });

  it("다른 탭 클릭 시 해당 컨텐츠로 전환된다", async () => {
    const user = userEvent.setup();
    render(<SimpleTabs items={items} defaultValue="a" />);
    await user.click(screen.getByRole("tab", { name: "둘째" }));
    expect(screen.getByText("둘째 컨텐츠")).toBeInTheDocument();
  });
});
