import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import Guide from "@/view/guide";

const renderGuide = () =>
  render(
    <MemoryRouter>
      <Guide />
    </MemoryRouter>,
  );

describe("Guide 카드 표현식 정본화 (Ralph R2 — claude-design-page-alignment)", () => {
  describe("TokenCard 정본 footer-meta 패턴 — 가이드 전체 22 카드 일괄", () => {
    it("모든 TokenCard가 data-testid='card-frame'(콘텐츠)과 'card-meta'(메타 푸터) 두 자식을 가진다", () => {
      const { container } = renderGuide();
      const frames = container.querySelectorAll("[data-testid='card-frame']");
      const metas = container.querySelectorAll("[data-testid='card-meta']");
      expect(
        frames.length,
        `정본 카드 표현식 — card-frame은 최소 11개 이상 (컴포넌트 11 + 컬러/타이포/스페이싱/브랜드 ~11) 존재해야 합니다 (실제: ${frames.length})`,
      ).toBeGreaterThanOrEqual(20);
      expect(
        metas.length,
        `정본 카드 표현식 — card-meta는 frame과 동일한 개수여야 합니다 (frames=${frames.length}, metas=${metas.length})`,
      ).toBe(frames.length);
    });

    it("card-meta 푸터는 컨테이너 하단(border-top)에 배치된다", () => {
      const { container } = renderGuide();
      const metas = Array.from(
        container.querySelectorAll<HTMLElement>("[data-testid='card-meta']"),
      );
      expect(metas.length).toBeGreaterThan(0);
      for (const meta of metas) {
        expect(
          meta.className,
          `card-meta는 정본대로 border-t를 가져야 합니다 (실제: ${meta.className})`,
        ).toMatch(/border-t/);
      }
    });

    it("card-meta 안에 title <b 또는 strong> 또는 CardTitle 역할 요소와 hint mono 라벨이 둘 다 존재한다", () => {
      const { container } = renderGuide();
      const metas = Array.from(
        container.querySelectorAll<HTMLElement>("[data-testid='card-meta']"),
      );
      let metaWithBoth = 0;
      for (const meta of metas) {
        const title = meta.querySelector("[data-testid='card-meta-title']");
        const hint = meta.querySelector("[data-testid='card-meta-hint']");
        if (title && hint) metaWithBoth += 1;
      }
      expect(
        metaWithBoth,
        `최소 11개 이상의 card-meta가 title과 hint를 모두 가져야 합니다 (실제: ${metaWithBoth})`,
      ).toBeGreaterThanOrEqual(11);
    });

    it("card-meta-hint는 font-mono 12px 토큰을 사용한다 (정본 11px → 디자인 시스템 토큰 12px 정정)", () => {
      const { container } = renderGuide();
      const hints = Array.from(
        container.querySelectorAll<HTMLElement>(
          "[data-testid='card-meta-hint']",
        ),
      );
      expect(hints.length, "card-meta-hint가 최소 1개 존재해야 합니다").toBeGreaterThan(
        0,
      );
      for (const hint of hints) {
        expect(
          hint.className,
          `hint는 font-mono utility를 사용해야 합니다 (실제: ${hint.className})`,
        ).toMatch(/font-mono/);
        expect(
          hint.className,
          `hint는 text-xs(=12px) 토큰을 사용해야 합니다 (정본 11px 하드코딩 거부, KBK 디자인 시스템 정정 권고 정합) (실제: ${hint.className})`,
        ).toMatch(/text-xs/);
      }
    });

    it("card-frame은 정본대로 bg-gray-50 배경(또는 미설정)이며, 명시 시 정본 토큰만 사용", () => {
      const { container } = renderGuide();
      const frames = Array.from(
        container.querySelectorAll<HTMLElement>("[data-testid='card-frame']"),
      );
      expect(frames.length).toBeGreaterThan(0);
      for (const frame of frames) {
        const bg = frame.className.match(/bg-([\w-]+)/);
        if (bg) {
          expect(
            ["gray-50", "white", "transparent", "card"].includes(bg[1]),
            `card-frame 배경은 정본 토큰(gray-50/white/transparent/card)만 허용 (실제: bg-${bg[1]})`,
          ).toBe(true);
        }
      }
    });
  });

  describe("가로 overflow 0 보장 (β+γ — 가로 잘림 없이 가로 스크롤 0)", () => {
    it("어떤 카드 컨테이너도 overflow-x: scroll/auto 클래스를 사용하지 않는다", () => {
      const { container } = renderGuide();
      const cards = Array.from(
        container.querySelectorAll<HTMLElement>("[data-testid='card-frame']"),
      );
      for (const card of cards) {
        const parent = card.parentElement;
        const cls =
          (parent?.className ?? "") + " " + (card?.className ?? "");
        expect(
          /overflow-x-(scroll|auto)/.test(cls),
          `카드는 overflow-x: scroll/auto를 사용하지 않아야 합니다 (β+γ 정합) (실제: ${cls})`,
        ).toBe(false);
      }
    });

    it("어떤 카드도 가로 스크롤을 강제하는 width 하드코딩(min-w-[숫자px])을 사용하지 않는다", () => {
      const { container } = renderGuide();
      const all = container.querySelectorAll<HTMLElement>(
        "[data-testid='card-frame'], [data-testid='card-meta']",
      );
      for (const el of all) {
        expect(
          /min-w-\[\d+px\]/.test(el.className),
          `카드 자식에 min-w-[숫자px] 하드코딩 금지 (실제: ${el.className})`,
        ).toBe(false);
      }
    });
  });
});
