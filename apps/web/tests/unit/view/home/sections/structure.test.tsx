import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { StructureSection } from "@/view/home/sections/structure";

describe("StructureSection", () => {
  it("구조 섹션이 렌더될 때 제목과 tinted 배경을 가진다", () => {
    const { container } = render(<StructureSection />);
    expect(screen.getByRole("heading", { level: 2, name: "공유 루트" })).toHaveAttribute(
      "id",
      "structure-title",
    );
    expect(container.querySelector("section#structure")).toHaveClass("bg-secondary");
  });

  it("기둥 다섯 개 중 다음 앱 기둥만 primary 배경으로 마지막에 두 칸을 차지한다", () => {
    render(<StructureSection />);
    const figure = screen.getByRole("figure");
    const pillars = figure.querySelectorAll("div.grid > div");
    expect(pillars).toHaveLength(5);
    const primaries = [...pillars].filter((p) => p.classList.contains("bg-primary"));
    expect(primaries).toEqual([pillars[4]]);
    expect(pillars[4]).toHaveClass("col-span-2");
    expect(pillars[4]).toHaveTextContent("다음 앱");
  });

  it("기둥 격자가 Tablet까지 2열이고 Desktop에서 5열로 바뀐다", () => {
    render(<StructureSection />);
    const grid = screen.getByRole("figure").querySelector("div.grid");
    expect(grid).toHaveClass("grid-cols-2", "desktop:grid-cols-5");
    expect(grid).not.toHaveClass("tablet:grid-cols-5");
  });

  it("범례 항목이 용어와 설명 사이에 gap-1 간격을 둔다", () => {
    render(<StructureSection />);
    expect(screen.getByText("보").parentElement).toHaveClass("grid", "gap-1");
  });

  it("보가 위쪽 모서리만 둥글고 공유 패키지 다섯 개를 태그로 나열한다", () => {
    const { container } = render(<StructureSection />);
    expect(container.querySelector(".rounded-t-lg")).toHaveTextContent("packages/*");
    expect(screen.getByText("typescript-config")).toBeInTheDocument();
    expect(screen.getByText(":3100")).toBeInTheDocument();
    expect(screen.getByText("apps/*")).toBeInTheDocument();
  });

  it("범례가 보·기둥·틈 세 항목을 설명한다", () => {
    render(<StructureSection />);
    for (const term of ["보", "기둥", "틈"]) {
      expect(screen.getByText(term)).toHaveClass("font-bold");
    }
  });
});
