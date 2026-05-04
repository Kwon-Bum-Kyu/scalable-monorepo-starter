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

describe("Guide TokenCard 정본 외곽 정합 (Ralph R3a — R2 결정)", () => {
  it("모든 TokenCard가 정본 카드 외곽 — border + shadow-0-subtle + rounded-xl(12px)", () => {
    const { container } = renderGuide();
    const cardFrames = Array.from(
      container.querySelectorAll<HTMLElement>("[data-testid='card-frame']"),
    );
    expect(cardFrames.length).toBeGreaterThan(0);
    for (const frame of cardFrames) {
      const card = frame.parentElement!;
      expect(
        /shadow-0-subtle/.test(card.className),
        `TokenCard 컨테이너는 shadow-0-subtle을 가져야 합니다 (정본 SSOT) (실제: ${card.className})`,
      ).toBe(true);
      expect(
        /shadow-2-default/.test(card.className),
        `TokenCard 컨테이너는 shadow-2-default를 가지지 않아야 합니다 (실제: ${card.className})`,
      ).toBe(false);
      expect(
        /rounded-xl/.test(card.className),
        `TokenCard 컨테이너는 rounded-xl(12px)을 가져야 합니다 (정본 카드 SSOT) (실제: ${card.className})`,
      ).toBe(true);
    }
  });
});
