import { describe, it } from "vitest";

import { assertPxValue, getCssVar } from "./helpers";

/** DESIGN.md Paired Scale Rule: [키, 크기 px, 짝 행간 px] */
const PAIRED_SCALE: ReadonlyArray<readonly [string, number, number]> = [
  ["xs", 12, 16],
  ["sm", 14, 20],
  ["base", 16, 24],
  ["lg", 18, 28],
  ["xl", 20, 32],
  ["2xl", 24, 40],
  ["3xl", 32, 48],
  ["4xl", 40, 56],
  ["5xl", 48, 64],
  ["6xl", 56, 72],
];

describe("text-<k> 크기·짝 행간 토큰 (DESIGN.md Paired Scale Rule)", () => {
  it.each(PAIRED_SCALE)(
    "text-%s 토큰이 크기 %ipx와 짝 행간 %ipx를 함께 정의한다",
    (key, size, lineHeight) => {
      assertPxValue(getCssVar(`--text-${key}`), size);
      assertPxValue(getCssVar(`--text-${key}--line-height`), lineHeight);
    },
  );
});
