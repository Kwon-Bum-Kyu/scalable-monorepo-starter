import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { DesignSystemEntrySection } from "@/view/home/sections/entry";

const renderEntry = () =>
  render(
    <MemoryRouter>
      <DesignSystemEntrySection />
    </MemoryRouter>,
  );

describe("DesignSystemEntrySection", () => {
  it("진입 섹션이 렌더될 때 제목과 대표 항목 Badge 다섯 개를 표시한다", () => {
    renderEntry();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "토큰과 컴포넌트, 브랜드 규칙은 가이드에서 확인합니다.",
      }),
    ).toHaveAttribute("id", "design-system-title");
    const list = screen.getByRole("list", { name: "가이드 대표 항목" });
    expect(list.querySelectorAll("li")).toHaveLength(5);
    expect(screen.getByText("타이포그래피")).toBeInTheDocument();
  });

  it("진입 머리가 Tablet 이상에서도 아래 여백이 없다", () => {
    renderEntry();
    const head = screen.getByRole("heading", { level: 2 }).parentElement;
    expect(head).toHaveClass("mb-0", "tablet:mb-0");
  });

  it("가이드 보기 링크가 lg 크기이고 Tablet부터 40px로 줄어든다", () => {
    renderEntry();
    expect(
      screen.getByRole("link", { name: "디자인 시스템 가이드 보기" }),
    ).toHaveClass("h-11", "tablet:h-10", "tablet:px-4", "tablet:text-sm");
  });

  it("가이드 보기 링크가 /guide로 이동한다", () => {
    renderEntry();
    expect(
      screen.getByRole("link", { name: "디자인 시스템 가이드 보기" }),
    ).toHaveAttribute("href", "/guide");
  });
});
