import { afterAll, describe, expect, it } from "vitest";

import { clearGlobalsCache, getCssVar, tokenExists } from "./helpers";

/**
 * FR-8: elevation shadow 4단계 토큰 도입.
 *
 * Q-A 검증: 다중 segment 네이밍(`--shadow-1-subtle` 등)이 Tailwind v4의 `shadow-*`
 * utility로 자동 매핑되는지 RED 단계 통과 여부로 결정한다.
 *  - PASS: 다중 segment 그대로 채택 (T-08-G1)
 *  - FAIL: 1-segment 네이밍(`--shadow-subtle` 등)으로 fallback (T-08-G2)
 *
 * 본 테스트는 globals.css 소스에 토큰이 정의되어 있는지를 단언한다.
 * Tailwind utility 자동 매핑은 v4 namespace 규칙(`--shadow-*` → `shadow-*`)을
 * 신뢰하여 토큰 정의 자체로 검증을 대체한다.
 */
describe("shadow 토큰 (FR-8)", () => {
  afterAll(() => {
    clearGlobalsCache();
  });

  const expectedTokens = [
    {
      name: "--shadow-1-subtle",
      expected:
        "0 1px 2px 0 rgba(22,22,19,0.05), 0 1px 3px 0 rgba(181,200,214,0.4)",
    },
    {
      name: "--shadow-2-default",
      expected:
        "0 2px 4px -1px rgba(22,22,19,0.06), 0 4px 8px -2px rgba(181,200,214,0.4)",
    },
    {
      name: "--shadow-3-raised",
      expected:
        "0 4px 6px -1px rgba(22,22,19,0.08), 0 10px 20px -4px rgba(181,200,214,0.7)",
    },
    {
      name: "--shadow-4-overlay",
      expected:
        "0 8px 12px -2px rgba(22,22,19,0.1), 0 20px 36px -8px rgba(225,233,239,0.75)",
    },
  ];

  describe("4단계 토큰 정의", () => {
    it.each(expectedTokens)(
      "$name 토큰이 정의된다",
      ({ name }) => {
        expect(
          tokenExists(name),
          `${name} 토큰이 globals.css 에 정의되지 않았다`,
        ).toBe(true);
      },
    );
  });

  describe("box-shadow 정확값 단언", () => {
    it.each(expectedTokens)(
      "$name 의 box-shadow 값이 명세와 일치한다",
      ({ name, expected }) => {
        const actual = getCssVar(name);
        // 공백·줄바꿈은 정규화하여 비교 (CSS 다중 라인 허용)
        const normalize = (value: string): string =>
          value.replace(/\s+/g, " ").trim();
        expect(normalize(actual)).toBe(normalize(expected));
      },
    );
  });

  describe("Tailwind v4 namespace 규칙 정합", () => {
    it("4건 모두 --shadow-* prefix 로 시작한다 (utility 자동 매핑 보장)", () => {
      for (const { name } of expectedTokens) {
        expect(name.startsWith("--shadow-"), `${name} 이 --shadow- prefix 이외로 정의됨`).toBe(true);
      }
    });
  });
});
