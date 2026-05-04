import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import App from "@/App";
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
      ];
      for (const label of expected) {
        expect(within(nav).getByRole("link", { name: label })).toHaveAttribute(
          "href",
          expect.stringMatching(/^#/),
        );
      }
    });

    it("'참고' 그룹에 README와 monorepo starter 외부 링크가 노출된다", () => {
      renderGuide();
      const nav = screen.getByRole("navigation", {
        name: "Design System Guide",
      });
      expect(within(nav).getByRole("link", { name: /README/i })).toBeInTheDocument();
      const repoLink = within(nav).getByRole("link", {
        name: /monorepo starter/i,
      });
      expect(repoLink).toHaveAttribute(
        "href",
        "https://github.com/Kwon-Bum-Kyu/scalable-monorepo-starter",
      );
      expect(repoLink).toHaveAttribute("target", "_blank");
      expect(repoLink.getAttribute("rel") ?? "").toMatch(/noopener/);
    });
  });

  describe("8개 섹션 헤딩", () => {
    it.each([
      ["디자인 시스템 한눈에 보기", 1],
      ["5가지 원칙", 2],
      ["컬러", 2],
      ["타이포그래피", 2],
      ["스페이싱 · 라운딩 · 그림자", 2],
      ["브레이크포인트", 2],
      ["기본 컴포넌트", 2],
      ["로고 · 아이콘", 2],
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
    it("정본 10개 카드 제목이 모두 노출된다", () => {
      renderGuide();
      const components = document.getElementById("components");
      expect(components).not.toBeNull();
      const expected = [
        "Button · variants",
        "Button · sizes",
        "Input · field",
        "Selection",
        "Slider",
        "Badge",
        "Card",
        "Toast",
        "Modal",
        "Tabs · nav",
      ];
      for (const title of expected) {
        expect(within(components!).getByText(title)).toBeInTheDocument();
      }
    });

    it.each([
      "ButtonGroup",
      "FormSelect",
      "DatePicker",
      "Breadcrumb",
      "Pagination",
      "Empty state",
    ])("'%s' 카드는 더 이상 노출되지 않는다", (name) => {
      renderGuide();
      const components = document.getElementById("components");
      expect(components).not.toBeNull();
      expect(within(components!).queryByText(name)).toBeNull();
    });

    it("Selection 카드 안에 checkbox · radio · switch가 함께 노출된다", () => {
      renderGuide();
      const components = document.getElementById("components");
      expect(components).not.toBeNull();
      expect(
        within(components!).getByRole("checkbox", { name: /checkbox/i }),
      ).toBeInTheDocument();
      expect(
        within(components!).getByRole("radio", { name: /radio/i }),
      ).toBeInTheDocument();
      expect(
        within(components!).getByRole("switch", { name: /switch/i }),
      ).toBeInTheDocument();
    });

    it("Toast 카드의 Info 버튼을 클릭하면 토스트가 노출된다", async () => {
      const user = userEvent.setup();
      render(
        <MemoryRouter>
          <App />
          <Guide />
        </MemoryRouter>,
      );
      const components = document.getElementById("components");
      expect(components).not.toBeNull();
      const infoBtn = within(components!).getByRole("button", { name: "Info" });
      await user.click(infoBtn);
      expect(await screen.findByText(/info 토스트/i)).toBeInTheDocument();
    });

    it("Modal 카드 안에 Dialog와 Drawer 트리거가 함께 노출된다", () => {
      renderGuide();
      const components = document.getElementById("components");
      expect(components).not.toBeNull();
      expect(
        within(components!).getByRole("button", { name: /dialog 열기/i }),
      ).toBeInTheDocument();
      expect(
        within(components!).getByRole("button", { name: /drawer 열기/i }),
      ).toBeInTheDocument();
    });

    it("Badge 카드에 5개 variants 라벨이 노출된다", () => {
      renderGuide();
      const badgeTitles = screen.getAllByText("Badge");
      expect(badgeTitles.length).toBeGreaterThan(0);
      const badgeCard = badgeTitles[0]?.closest(
        "[data-slot='card'], .rounded-xl, .rounded-lg",
      ) as HTMLElement | null;
      expect(badgeCard).not.toBeNull();
      const labels = ["Default", "Secondary", "Outline", "Destructive", "Success"];
      for (const text of labels) {
        expect(within(badgeCard!).getByText(text)).toBeInTheDocument();
      }
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

});
