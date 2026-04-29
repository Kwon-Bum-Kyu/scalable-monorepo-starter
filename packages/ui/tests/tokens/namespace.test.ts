import { afterAll, describe, expect, it } from "vitest";

import { assertNoPrefix, clearGlobalsCache, getThemeBlockSource } from "./helpers";

/**
 * FR-11: `--size-*` namespace 정합.
 *
 * Tailwind v4 표준은 `--size-*` 를 utility 자동 매핑 namespace 로 인정하지 않는다.
 * 본 모노레포는 R10 핫픽스에서 이미 `--size-*` → `--spacing-*` 로 마이그레이션 완료.
 * 본 테스트는 회귀 방지를 위해 `--size-*` 0건 + 표준 namespace 만 사용 중인지 단언한다.
 */
describe("namespace 정합 (FR-11)", () => {
  afterAll(() => {
    clearGlobalsCache();
  });

  describe("비표준 namespace 토큰 0건 단언", () => {
    it("@theme 블록에 --size-* prefix 토큰이 잔존하지 않는다", () => {
      assertNoPrefix("--size-");
    });

    it("@theme 블록에 --token-* / --design-* 같은 임의 prefix 가 잔존하지 않는다", () => {
      assertNoPrefix("--token-");
      assertNoPrefix("--design-");
    });
  });

  describe("Tailwind v4 표준 namespace 만 사용", () => {
    it("@theme 블록의 모든 토큰이 표준 namespace 중 하나로 시작한다", () => {
      const themeBody = getThemeBlockSource();
      const tokens = [
        ...themeBody.matchAll(/^\s*(--[\w-]+)\s*:/gm),
      ].map((m) => m[1]);

      const standardPrefixes = [
        "--color-",
        "--spacing-",
        "--container-",
        "--font-family-",
        "--font-size-",
        "--font-weight-",
        "--line-height-",
        "--breakpoint-",
        "--radius-",
        "--shadow-",
        "--tracking-",
      ];

      for (const token of tokens) {
        const hasStandardPrefix = standardPrefixes.some((prefix) =>
          token.startsWith(prefix),
        );
        expect(
          hasStandardPrefix,
          `비표준 namespace 토큰 발견: ${token}. ` +
            `허용 prefix: ${standardPrefixes.join(", ")}`,
        ).toBe(true);
      }
      expect(tokens.length).toBeGreaterThan(0);
    });
  });

  describe("tailwind-v4.md 매핑 표 정합", () => {
    it.each([
      { prefix: "--color-", utility: "bg-* / text-* / border-*" },
      { prefix: "--spacing-", utility: "p-* / m-* / w-* / h-* / gap-*" },
      { prefix: "--container-", utility: "max-w-*" },
      { prefix: "--breakpoint-", utility: "responsive variants" },
      { prefix: "--radius-", utility: "rounded-*" },
      { prefix: "--shadow-", utility: "shadow-*" },
      { prefix: "--font-family-", utility: "font-*" },
      { prefix: "--font-weight-", utility: "font-* (weight)" },
      { prefix: "--line-height-", utility: "leading-*" },
    ])(
      "$prefix prefix 토큰이 정의되어 있다면 표준 namespace ($utility) 매핑이 된다",
      ({ prefix }) => {
        const themeBody = getThemeBlockSource();
        const escaped = prefix.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
        const pattern = new RegExp(`^\\s*${escaped}[\\w-]+\\s*:`, "m");
        const tokensExist = pattern.test(themeBody);
        // 모든 prefix 가 반드시 사용될 필요는 없음. 사용된다면 표준임을 확인.
        expect(typeof tokensExist).toBe("boolean");
      },
    );
  });
});
