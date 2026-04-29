import { afterAll, describe, expect, it } from "vitest";

import {
  assertPxValue,
  assertRemValue,
  clearGlobalsCache,
  getCssVar,
  tokenExists,
} from "./helpers";

describe("radius 토큰 (FR-7)", () => {
  afterAll(() => {
    clearGlobalsCache();
  });

  describe("기본 --radius 값", () => {
    it("--radius 가 0.75rem (=12px) 일 때 디자인 명세와 정렬된다", () => {
      const value = getCssVar("--radius");
      assertRemValue(value, 0.75);
    });
  });

  describe("@theme inline radius 매핑", () => {
    it("--radius-none 토큰이 0 으로 정의된다", () => {
      expect(tokenExists("--radius-none"), "--radius-none 토큰이 정의되지 않았다").toBe(true);
      const value = getCssVar("--radius-none");
      expect(value).toBe("0");
    });

    it("--radius-sm 은 calc(var(--radius) - 4px) 패턴을 유지한다", () => {
      const value = getCssVar("--radius-sm");
      expect(value).toBe("calc(var(--radius) - 4px)");
    });

    it("--radius-md 는 calc(var(--radius) - 2px) 패턴이고 --radius=0.75rem 기준 결과 10px 이다", () => {
      const value = getCssVar("--radius-md");
      expect(value).toBe("calc(var(--radius) - 2px)");
      // 0.75rem = 12px, calc(12px - 2px) = 10px
    });

    it("--radius-lg 는 var(--radius) 별칭으로 12px 에 매핑된다", () => {
      const value = getCssVar("--radius-lg");
      expect(value).toBe("var(--radius)");
    });

    it("--radius-xl 은 calc(var(--radius) + 4px) 패턴이고 결과 16px 이다", () => {
      const value = getCssVar("--radius-xl");
      expect(value).toBe("calc(var(--radius) + 4px)");
    });

    it("--radius-2xl 토큰이 24px 로 신규 정의된다", () => {
      expect(tokenExists("--radius-2xl"), "--radius-2xl 토큰이 정의되지 않았다").toBe(true);
      const value = getCssVar("--radius-2xl");
      assertPxValue(value, 24);
    });
  });

  describe("calc 패턴 결과 검증 (--radius=0.75rem 기준)", () => {
    it.each([
      { token: "--radius-md", expectedPx: 10, formula: "12 - 2" },
      { token: "--radius-lg", expectedPx: 12, formula: "12" },
      { token: "--radius-xl", expectedPx: 16, formula: "12 + 4" },
    ])(
      "$token 은 0.75rem 기준 $expectedPx px ($formula) 로 평가된다",
      ({ token, expectedPx }) => {
        const raw = getCssVar(token);
        const baseRem = 0.75;
        const baseRemPx = baseRem * 16;

        if (raw === "var(--radius)") {
          expect(baseRemPx).toBe(expectedPx);
          return;
        }

        const calcMatch = /^calc\(var\(--radius\)\s*([+-])\s*(\d+)px\)$/.exec(
          raw,
        );
        expect(calcMatch, `${token} 의 calc 패턴 파싱 실패: ${raw}`).not.toBeNull();
        const op = calcMatch![1];
        const offset = Number(calcMatch![2]);
        const result = op === "+" ? baseRemPx + offset : baseRemPx - offset;
        expect(result).toBe(expectedPx);
      },
    );
  });
});
