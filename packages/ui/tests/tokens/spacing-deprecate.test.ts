import { afterAll, describe, expect, it } from "vitest";

import {
  clearGlobalsCache,
  getThemeBlockSource,
  tokenExists,
} from "./helpers";

/**
 * FR-10: `--spacing-80` 토큰 deprecate.
 *
 * 정책: Tailwind v4 의 4px-base 자동 utility 가 `p-1=4px`, `p-2=8px`, ..., `p-20=80px`,
 * `p-32=128px` 등을 모두 자동 생성하므로 풀세트 토큰화는 불필요.
 * 본 모노레포는 *의미적 별칭*(`--spacing-page-x`, `--spacing-header`,
 * `--spacing-logo-h`, `--spacing-16=64px`)만 유지한다.
 */
describe("spacing 정책 (FR-10)", () => {
  afterAll(() => {
    clearGlobalsCache();
  });

  describe("--spacing-80 deprecate", () => {
    it("globals.css 에 --spacing-80 토큰이 더 이상 정의되지 않는다", () => {
      expect(
        tokenExists("--spacing-80"),
        "--spacing-80 토큰이 globals.css 에 잔존한다 (FR-10 deprecate 정책 위반)",
      ).toBe(false);
    });
  });

  describe("의미적 spacing 별칭만 유지", () => {
    it("--spacing-header / --spacing-page-x / --spacing-logo-h 는 유지된다", () => {
      expect(tokenExists("--spacing-header")).toBe(true);
      expect(tokenExists("--spacing-page-x")).toBe(true);
      expect(tokenExists("--spacing-logo-h")).toBe(true);
    });

    it("--spacing-16(64px) header content alias 는 유지된다", () => {
      expect(tokenExists("--spacing-16")).toBe(true);
    });
  });

  describe("@theme 블록 내 spacing 토큰 인벤토리", () => {
    it("@theme 블록에 정의된 --spacing-* 토큰 목록이 의미적 별칭 4개로만 구성된다", () => {
      const themeBody = getThemeBlockSource();
      const spacingTokens = [
        ...themeBody.matchAll(/^\s*(--spacing-[\w-]+)\s*:/gm),
      ].map((m) => m[1]);

      const allowedTokens = new Set([
        "--spacing-16",
        "--spacing-logo-h",
        "--spacing-header",
        "--spacing-page-x",
      ]);

      for (const token of spacingTokens) {
        expect(
          allowedTokens.has(token),
          `허용되지 않은 spacing 토큰이 정의됨: ${token}. ` +
            `의미적 별칭만 유지하고 4px-base 풀세트는 Tailwind 표준에 의존한다.`,
        ).toBe(true);
      }
      expect(spacingTokens.length).toBeGreaterThan(0);
    });
  });
});
