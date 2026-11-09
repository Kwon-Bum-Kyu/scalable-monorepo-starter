import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { BLUE_PALETTE, GRAY_PALETTE, SEMANTIC_ALIASES } from "@/view/guide/colorData";
import { PRINCIPLES } from "@/view/guide/navData";
import { BREAKPOINT_BARS, FONT_FAMILIES, FONT_WEIGHTS, RADIUS_SCALE, SHADOW_SCALE, SPACING_TOKENS, TYPE_SCALE } from "@/view/guide/scaleData";
import { GuideHead, PrinciplesSection } from "@/view/guide/sections/intro";
import { BreakpointSection, ColorSection, SpacingSection, TypographySection } from "@/view/guide/sections/tokens";

describe("가이드 intro", () => {
  it("머리말이 h1과 InlineCode lead를 렌더한다", () => {
    const { container } = render(<GuideHead />);
    expect(screen.getByRole("heading", { level: 1, name: "디자인 시스템 가이드" })).toBeInTheDocument();
    expect(container.querySelectorAll("code")).toHaveLength(2);
  });

  it("원칙 섹션이 원칙 6개를 렌더한다", () => {
    render(<PrinciplesSection />);
    expect(screen.getByRole("region", { name: "원칙" })).toHaveAttribute("id", "principles");
    PRINCIPLES.forEach((p) => expect(screen.getByRole("heading", { level: 3, name: p.title })).toBeInTheDocument());
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(6);
  });
});

describe("컬러 섹션", () => {
  it("팔레트 견본 20개와 의미 별칭 8개를 완성된 클래스로 칠한다", () => {
    const { container } = render(<ColorSection />);
    [...BLUE_PALETTE, ...GRAY_PALETTE].forEach((s) => {
      expect(screen.getByText(s.name)).toBeInTheDocument();
      expect(screen.getByText(s.value)).toBeInTheDocument();
    });
    SEMANTIC_ALIASES.forEach((a) => {
      expect(screen.getByText(a.name)).toBeInTheDocument();
      expect(screen.getAllByText(`→ ${a.target}`).length).toBeGreaterThan(0);
    });
    const chips = container.querySelectorAll("[data-swatch-chip]");
    expect(chips).toHaveLength(28);
    expect(container.querySelector(".bg-system-red[data-swatch-chip]")).not.toBeNull();
    expect(chips[20]).toHaveClass("bg-gray-900");
  });

  it("인라인 style 속성을 쓰지 않는다", () => {
    const { container } = render(<ColorSection />);
    expect(container.querySelector("[style]")).toBeNull();
  });
});

describe("타이포그래피 섹션", () => {
  it("서체 4, 굵기 4, 크기 10행을 데이터와 같은 개수로 렌더한다", () => {
    render(<TypographySection />);
    const tables = screen.getAllByRole("table");
    expect(tables).toHaveLength(3);
    expect(within(tables[0]!).getAllByRole("row")).toHaveLength(FONT_FAMILIES.length + 1);
    expect(within(tables[1]!).getAllByRole("row")).toHaveLength(FONT_WEIGHTS.length + 1);
    expect(within(tables[2]!).getAllByRole("row")).toHaveLength(TYPE_SCALE.length + 1);
    expect(tables[2]).toHaveClass("min-w-150");
    expect(screen.getByText("12 / 16")).toBeInTheDocument();
    expect(screen.getByText("56 / 72")).toBeInTheDocument();
  });
});

describe("스페이싱 섹션", () => {
  it("스페이싱 6줄, 반경 7칸, 그림자 5칸을 렌더하고 인라인 style이 없다", () => {
    const { container } = render(<SpacingSection />);
    expect(screen.getAllByRole("listitem")).toHaveLength(1 + SPACING_TOKENS.length + RADIUS_SCALE.length + SHADOW_SCALE.length);
    expect(screen.getByText("외곽선 수준")).toBeInTheDocument();
    expect(screen.getByText("radius-full")).toBeInTheDocument();
    expect(container.querySelector("[style]")).toBeNull();
  });
});

describe("브레이크포인트 섹션", () => {
  it("막대 4개를 지정된 폭 클래스로 렌더한다", () => {
    const { container } = render(<BreakpointSection />);
    BREAKPOINT_BARS.forEach((bp) => {
      expect(screen.getByText(bp.name)).toBeInTheDocument();
      expect(screen.getByText(`≥ ${bp.value}`)).toBeInTheDocument();
    });
    expect(container.querySelectorAll(".w-1\\/3, .w-2\\/5, .w-2\\/3, .w-full")).toHaveLength(4);
  });
});
