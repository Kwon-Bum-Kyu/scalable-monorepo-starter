import type { SystemIconName } from "@repo/ui";
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
    const all: ReadonlyArray<SystemIconName> = [...SYSTEM_ICON_SAMPLES, ...SYSTEM_ICON_NAMES];
    expect(SYSTEM_ICON_SAMPLES).toHaveLength(3);
    expect(SYSTEM_ICON_NAMES).toHaveLength(33);
    expect(new Set(SYSTEM_ICON_NAMES).size).toBe(33);
    expect(SYSTEM_ICON_NAMES.filter((name) => SYSTEM_ICON_SAMPLES.includes(name))).toHaveLength(0);
    expect(new Set(all).size).toBe(36);
  });

  it("브랜드 파일 데이터가 아홉 행을 제공한다", () => {
    expect(BRAND_FILES).toHaveLength(9);
  });
});
