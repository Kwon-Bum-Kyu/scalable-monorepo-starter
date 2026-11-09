import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import DataTable from "@/components/DataTable";
import { GuideSectionSelect, GuideSidebar } from "@/view/guide/GuideNav";
import { GuideSection } from "@/view/guide/primitives";

describe("GuideSidebar", () => {
  it("4그룹 12항목을 가이드 섹션 내비로 렌더한다", () => {
    render(<GuideSidebar activeId="color" onSelect={vi.fn()} />);
    const nav = screen.getByRole("navigation", { name: "가이드 섹션" });
    expect(within(nav).getAllByRole("button")).toHaveLength(12);
    ["시작", "토큰", "컴포넌트", "브랜드"].forEach((title) => expect(within(nav).getByText(title)).toBeInTheDocument());
  });

  it("현재 항목만 aria-current와 굵은 글씨 스타일을 가진다", () => {
    render(<GuideSidebar activeId="color" onSelect={vi.fn()} />);
    const current = screen.getByRole("button", { name: "컬러" });
    expect(current).toHaveAttribute("aria-current", "true");
    expect(current).toHaveClass("font-semibold", "border-foreground");
    expect(screen.getByRole("button", { name: "원칙" })).not.toHaveAttribute("aria-current");
  });

  it("항목의 포커스 링이 안쪽에 그려질 때 사이드바 overflow에 잘리지 않는다", () => {
    render(<GuideSidebar activeId="color" onSelect={vi.fn()} />);
    screen.getAllByRole("button").forEach((button) => expect(button).toHaveClass("focus-visible:ring-inset", "focus-visible:ring-offset-0"));
  });

  it("항목을 클릭할 때 해당 id로 onSelect를 호출한다", async () => {
    const onSelect = vi.fn();
    render(<GuideSidebar activeId="principles" onSelect={onSelect} />);
    await userEvent.click(screen.getByRole("button", { name: "브레이크포인트" }));
    expect(onSelect).toHaveBeenCalledWith("bp");
  });
});

describe("GuideSectionSelect", () => {
  it("가이드 섹션 라벨과 44px 트리거를 렌더한다", () => {
    render(<GuideSectionSelect activeId="color" onSelect={vi.fn()} />);
    const trigger = screen.getByRole("combobox", { name: "가이드 섹션" });
    expect(trigger).toHaveClass("h-11");
    expect(trigger).toHaveTextContent("컬러");
  });

  it("목록을 열 때 모든 항목이 44px 최소 높이를 가진다", async () => {
    render(<GuideSectionSelect activeId="color" onSelect={vi.fn()} />);
    await userEvent.click(screen.getByRole("combobox", { name: "가이드 섹션" }));
    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(12);
    options.forEach((option) => expect(option).toHaveClass("min-h-11"));
  });

  it("값을 바꿀 때 선택한 id로 onSelect를 호출하고 그룹 4개를 보여 준다", async () => {
    const onSelect = vi.fn();
    render(<GuideSectionSelect activeId="color" onSelect={onSelect} />);
    await userEvent.click(screen.getByRole("combobox", { name: "가이드 섹션" }));
    expect(screen.getAllByRole("group")).toHaveLength(4);
    await userEvent.click(screen.getByRole("option", { name: "시스템 아이콘" }));
    expect(onSelect).toHaveBeenCalledWith("icons");
  });
});

describe("DataTable", () => {
  it("className을 줄 때 표 요소에 적용하고 표 영역은 가로로 스크롤한다", () => {
    const { container } = render(
      <DataTable head={["a"]} className="min-w-150">
        <tr><td>1</td></tr>
      </DataTable>,
    );
    expect(screen.getByRole("table")).toHaveClass("w-full", "min-w-150");
    expect(container.firstElementChild).toHaveClass("overflow-x-auto");
  });
});

describe("GuideSection", () => {
  it("id와 제목 id를 aria-labelledby로 연결한다", () => {
    render(
      <GuideSection id="color" eyebrow="토큰" title="컬러">
        <p>본문</p>
      </GuideSection>,
    );
    const section = screen.getByRole("region", { name: "컬러" });
    expect(section).toHaveAttribute("id", "color");
    expect(screen.getByRole("heading", { level: 2, name: "컬러" })).toHaveAttribute("id", "color-title");
    expect(screen.getByRole("heading", { level: 2, name: "컬러" })).toHaveAttribute("tabindex", "-1");
    expect(screen.getByRole("heading", { level: 2, name: "컬러" })).toHaveClass("focus:outline-none");
    expect(screen.getByText("토큰")).toBeInTheDocument();
  });
});
