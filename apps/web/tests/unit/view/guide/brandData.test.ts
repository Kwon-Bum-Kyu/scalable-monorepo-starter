import { SYSTEM_ICON_NAMES as ALL_SYSTEM_ICON_NAMES } from "@repo/ui";
import { describe, expect, it } from "vitest";

import { BRAND_FILES, LOGO_VARIANTS, MISUSE_EXAMPLES, SYSTEM_ICON_NAMES, SYSTEM_ICON_SAMPLES } from "@/view/guide/brandData";

describe("브랜드 데이터", () => {
  it("로고 데이터가 네 변형의 밝고 어두운 대체 텍스트를 제공한다", () => {
    expect(LOGO_VARIANTS).toHaveLength(4);
    LOGO_VARIANTS.forEach((logo) => {
      expect(logo.lightAlt).not.toBe("");
      expect(logo.darkAlt).not.toBe("");
    });
  });

  it("잘못된 사용 예가 지정된 자산과 특수 렌더 계약을 제공한다", () => {
    expect(MISUSE_EXAMPLES).toHaveLength(6);
    const misuseSvgs = [1, 2, 4].map((i) => MISUSE_EXAMPLES[i]?.src);
    expect(new Set(misuseSvgs).size).toBe(3);
    expect(misuseSvgs).not.toContain(LOGO_VARIANTS[0]?.lightSrc);
    expect(MISUSE_EXAMPLES.filter(({ src }) => src !== null)).toHaveLength(5);
    expect(MISUSE_EXAMPLES.find(({ title }) => title === "워드마크 다시 입력하기")?.src).toBeNull();
  });

  it("아이콘 데이터가 SystemIconName 전체를 중복 없이 나눈다", () => {
    expect(SYSTEM_ICON_SAMPLES).toHaveLength(3);
    expect(new Set(SYSTEM_ICON_NAMES).size).toBe(SYSTEM_ICON_NAMES.length);
    expect(SYSTEM_ICON_NAMES.filter((name) => SYSTEM_ICON_SAMPLES.includes(name))).toHaveLength(0);
    expect(new Set([...SYSTEM_ICON_SAMPLES, ...SYSTEM_ICON_NAMES])).toEqual(
      new Set(ALL_SYSTEM_ICON_NAMES),
    );
  });

  it("브랜드 파일 데이터가 레포의 실제 경로만 제공한다", () => {
    expect(BRAND_FILES.map(({ file }) => file)).toEqual([
      "packages/ui/src/assets/brand/logo/symbol.svg · symbol-dark.svg",
      "packages/ui/src/assets/brand/logo/wordmark.svg · wordmark-dark.svg",
      "packages/ui/src/assets/brand/logo/lockup-horizontal.svg · lockup-horizontal-dark.svg",
      "packages/ui/src/assets/brand/logo/lockup-stacked.svg · lockup-stacked-dark.svg",
      "apps/web/public/favicon.svg",
      "apps/desktop/assets/app-icon-ink.svg",
      "docs/assets/readme-header.svg",
      "docs/assets/og-image.svg",
      "apps/web/public/fonts/",
    ]);
  });
});
