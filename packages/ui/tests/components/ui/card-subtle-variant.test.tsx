import { Card } from "@repo/ui/components/card";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("Card subtle variant (Ralph R3a — 정본 가이드 카드 외곽)", () => {
  it("variant='subtle' 사용 시 border-border + shadow-0-subtle 클래스를 가진다", () => {
    const { container } = render(
      <Card variant="subtle" data-testid="c">
        <div>x</div>
      </Card>,
    );
    const card = container.querySelector("[data-testid='c']")!;
    expect(
      /border-border/.test(card.className),
      `Card subtle variant는 border-border를 가져야 합니다 (실제: ${card.className})`,
    ).toBe(true);
    expect(
      /shadow-0-subtle/.test(card.className),
      `Card subtle variant는 shadow-0-subtle을 가져야 합니다 (실제: ${card.className})`,
    ).toBe(true);
  });

  it("variant='subtle'은 shadow-2-default를 가지지 않는다 (정본 외곽 정합)", () => {
    const { container } = render(
      <Card variant="subtle" data-testid="c">
        <div>x</div>
      </Card>,
    );
    const card = container.querySelector("[data-testid='c']")!;
    expect(
      /shadow-2-default/.test(card.className),
      `Card subtle variant는 shadow-2-default를 가지지 않아야 합니다 (실제: ${card.className})`,
    ).toBe(false);
  });
});
