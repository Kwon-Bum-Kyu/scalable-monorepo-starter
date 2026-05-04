import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import Guide from "@/view/guide";

const renderGuide = () =>
  render(
    <MemoryRouter>
      <Guide />
    </MemoryRouter>,
  );

describe("Guide 페이지 — Claude Design system guide", () => {
  describe("페이지 헤더", () => {
    it("페이지 타이틀이 노출된다", () => {
      renderGuide();
      expect(
        screen.getByRole("heading", {
          name: "디자인 시스템 한눈에 보기",
          level: 1,
        }),
      ).toBeInTheDocument();
    });
  });

  describe("사이드바 navigation", () => {
    it("Design System Guide aria-label로 네비게이션이 노출된다", () => {
      renderGuide();
      expect(
        screen.getByRole("navigation", { name: "Design System Guide" }),
      ).toBeInTheDocument();
    });

    it("9개 섹션 anchor 링크가 모두 노출된다", () => {
      renderGuide();
      const nav = screen.getByRole("navigation", {
        name: "Design System Guide",
      });
      const expected = [
        "개요",
        "원칙",
        "컬러",
        "타이포그래피",
        "스페이싱 · 라운딩 · 그림자",
        "브레이크포인트",
        "기본 컴포넌트",
        "로고 · 아이콘",
        "웹 UI Kit",
      ];
      for (const label of expected) {
        expect(within(nav).getByRole("link", { name: label })).toHaveAttribute(
          "href",
          expect.stringMatching(/^#/),
        );
      }
    });
  });

  describe("9개 섹션 헤딩", () => {
    it.each([
      ["디자인 시스템 한눈에 보기", 1],
      ["5가지 원칙", 2],
      ["컬러", 2],
      ["타이포그래피", 2],
      ["스페이싱 · 라운딩 · 그림자", 2],
      ["브레이크포인트", 2],
      ["기본 컴포넌트", 2],
      ["로고 · 아이콘", 2],
      ["웹 UI Kit (TypeScript)", 2],
    ] as const)("'%s' 헤딩이 level %i로 렌더링된다", (name, level) => {
      renderGuide();
      expect(screen.getByRole("heading", { name, level })).toBeInTheDocument();
    });
  });

  describe("Principles 섹션", () => {
    it("6개 원칙 카드가 모두 노출된다", () => {
      renderGuide();
      const expected = [
        "Tokens first",
        "shadcn 호환",
        "Mobile-first",
        "Type-safe",
        "Accessibility",
        "적게, 명확하게",
      ];
      for (const text of expected) {
        expect(screen.getByText(text)).toBeInTheDocument();
      }
    });
  });

  describe("Colors 섹션", () => {
    it("blue palette 10단계 토큰 swatch가 모두 노출된다", () => {
      renderGuide();
      for (const scale of [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]) {
        expect(screen.getByText(`--color-blue-${scale}`)).toBeInTheDocument();
      }
    });

    it("system color 5종이 노출된다", () => {
      renderGuide();
      expect(screen.getByText("--color-system-red")).toBeInTheDocument();
      expect(screen.getByText("--color-system-green")).toBeInTheDocument();
      expect(screen.getByText("--color-system-warning")).toBeInTheDocument();
      expect(screen.getByText("--color-system-info")).toBeInTheDocument();
      expect(screen.getByText("--color-system-white")).toBeInTheDocument();
    });
  });

  describe("Typography 섹션", () => {
    it("font-family 토큰 2종이 노출된다", () => {
      renderGuide();
      expect(screen.getByText("--font-family-sans")).toBeInTheDocument();
      expect(screen.getByText("--font-family-mono")).toBeInTheDocument();
    });
  });

  describe("Spacing · Radius · Elevation 섹션", () => {
    it("radius 토큰 5종이 노출된다", () => {
      renderGuide();
      for (const name of [
        "--radius-none",
        "--radius-sm",
        "--radius-md",
        "--radius-lg",
        "--radius-xl",
        "--radius-2xl",
      ]) {
        expect(screen.getByText(name)).toBeInTheDocument();
      }
    });

    it("elevation 4단계 shadow 토큰이 노출된다", () => {
      renderGuide();
      expect(screen.getByText("--shadow-1-subtle")).toBeInTheDocument();
      expect(screen.getByText("--shadow-2-default")).toBeInTheDocument();
      expect(screen.getByText("--shadow-3-raised")).toBeInTheDocument();
      expect(screen.getByText("--shadow-4-overlay")).toBeInTheDocument();
    });
  });

  describe("Breakpoints 섹션", () => {
    it("Mobile / Tablet / Desktop 3단계 행이 노출된다", () => {
      renderGuide();
      const table = screen.getByRole("table", { name: /breakpoint/i });
      expect(within(table).getByText("Mobile")).toBeInTheDocument();
      expect(within(table).getByText("Tablet")).toBeInTheDocument();
      expect(within(table).getByText("Desktop")).toBeInTheDocument();
    });
  });

  describe("Components 섹션", () => {
    it("Button variants 데모가 노출된다", () => {
      renderGuide();
      expect(
        screen.getByRole("button", { name: "Primary" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Secondary" }),
      ).toBeInTheDocument();
    });

    it("Input · FormSelect · Slider · Tabs · Pagination 데모가 노출된다", () => {
      renderGuide();
      expect(screen.getAllByPlaceholderText("Text input").length).toBe(3);
      expect(screen.getAllByRole("combobox").length).toBeGreaterThan(0);
      expect(screen.getAllByRole("slider").length).toBeGreaterThan(0);
      expect(screen.getByRole("tablist")).toBeInTheDocument();
    });
  });

  describe("Brand 섹션", () => {
    it("System icons 카드 타이틀과 hint(`--system-icon` 토큰)가 노출된다", () => {
      renderGuide();
      const brandSection = document.getElementById("brand");
      expect(brandSection).not.toBeNull();
      expect(within(brandSection!).getByText("System icons")).toBeInTheDocument();
      expect(
        within(brandSection!).getByText(/--system-icon/),
      ).toBeInTheDocument();
    });
  });

  describe("UI Kit 섹션", () => {
    it("후속 슬러그(Slug E) 안내 헤딩이 노출된다", () => {
      renderGuide();
      expect(
        screen.getByRole("heading", {
          name: /후속 슬러그\(Slug E\)에서 통합 스토리 작성 예정/,
        }),
      ).toBeInTheDocument();
    });
  });
});
