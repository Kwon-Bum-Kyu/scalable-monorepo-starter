import { render } from "@testing-library/react";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { getCssVar } from "../tokens/helpers";

const STYLE_ELEMENT_ID = "font-utility-test-style";

/**
 * jsdom 한계 (Q-FF-PRD-4):
 * - jsdom은 Tailwind CSS 변환을 자동 수행하지 않으므로,
 *   globals.css의 @theme 토큰을 :root CSS 변수로 inject하고
 *   .font-mono / .font-sans utility 클래스 정의를 함께 주입한다.
 * - 토큰 값은 helpers.getCssVar로 globals.css에서 동적으로 읽어 동기화한다.
 * - 실제 .ttf 다운로드/렌더링 검증은 브라우저 영역(Storybook G7)이며,
 *   본 통합 테스트는 className → CSS 매핑까지만 검증한다.
 */
beforeAll(() => {
  const sansValue = getCssVar("--font-family-sans");
  const monoValue = getCssVar("--font-family-mono");

  const style = document.createElement("style");
  style.id = STYLE_ELEMENT_ID;
  style.textContent = `
    :root {
      --font-family-sans: ${sansValue};
      --font-family-mono: ${monoValue};
    }
    .font-sans { font-family: var(--font-family-sans); }
    .font-mono { font-family: var(--font-family-mono); }
  `;
  document.head.appendChild(style);
});

afterAll(() => {
  const style = document.getElementById(STYLE_ELEMENT_ID);
  if (style && style.parentNode) {
    style.parentNode.removeChild(style);
  }
});

/**
 * jsdom은 `var(--token)`을 resolve 하지 않고 원시 문자열을 반환하므로,
 * computed font-family 가 `var(...)` 형태이면 직접 토큰 값으로 치환한다.
 * 실제 브라우저(Storybook G7)에서는 자동 resolve 되므로 테스트 의도(첫 패밀리 검증)는 보존된다.
 */
function resolveFontFamily(computed: string): string {
  const varMatch = computed.match(/^var\((--[a-zA-Z0-9-]+)\)$/);
  if (varMatch) {
    return getCssVar(varMatch[1]);
  }
  return computed;
}

function getFirstFamily(value: string): string {
  const resolved = resolveFontFamily(value);
  return resolved.split(",")[0].replace(/^["']|["']$/g, "").trim();
}

// T-FF-G0-6-R: font-mono utility computed font-family (FR-FF-7 + R-FF-1)
describe("font-mono utility (FR-FF-7)", () => {
  it("font-mono utility가 적용될 때 computed font-family 첫 번째 패밀리가 Roboto Mono다", () => {
    const { getByTestId } = render(
      <span className="font-mono" data-testid="mono-target">
        42
      </span>,
    );
    const target = getByTestId("mono-target");
    const computed = window.getComputedStyle(target).fontFamily;
    const firstFamily = getFirstFamily(computed);
    expect(
      firstFamily,
      `font-mono utility의 첫 번째 패밀리가 Roboto Mono여야 합니다 (실제: ${computed})`,
    ).toBe("Roboto Mono");
  });

  it("font-mono utility의 computed font-family에 ui-monospace fallback이 포함된다", () => {
    const { getByTestId } = render(
      <span className="font-mono" data-testid="mono-fallback">
        99
      </span>,
    );
    const target = getByTestId("mono-fallback");
    const computed = window.getComputedStyle(target).fontFamily;
    const resolved = resolveFontFamily(computed);
    expect(
      resolved.includes("ui-monospace"),
      `font-mono fallback chain에 ui-monospace가 포함되어야 합니다 — R-FF-1 CDN 차단 환경 완화 검증 (실제: ${resolved})`,
    ).toBe(true);
  });
});

// T-FF-G0-7-R: font-sans utility computed font-family (FR-FF-6)
describe("font-sans utility 비파괴 (FR-FF-6)", () => {
  it("font-sans utility가 적용될 때 computed font-family 첫 번째 패밀리가 Open Sans다", () => {
    const { getByTestId } = render(
      <span className="font-sans" data-testid="sans-target">
        본문
      </span>,
    );
    const target = getByTestId("sans-target");
    const computed = window.getComputedStyle(target).fontFamily;
    const firstFamily = getFirstFamily(computed);
    expect(
      firstFamily,
      `font-sans utility의 첫 번째 패밀리가 Open Sans여야 합니다 (실제: ${computed})`,
    ).toBe("Open Sans");
  });
});
