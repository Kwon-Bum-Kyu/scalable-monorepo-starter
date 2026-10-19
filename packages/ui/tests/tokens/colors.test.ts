import { describe, expect, it } from "vitest";

import { assertHexColor, getCssVar } from "./helpers";

const BLUE_RAMP: ReadonlyArray<readonly [string, string]> = [
  ["--color-blue-50", "#e1e9ef"],
  ["--color-blue-100", "#b5c8d6"],
  ["--color-blue-200", "#84a3bb"],
  ["--color-blue-300", "#527ea0"],
  ["--color-blue-400", "#2d638b"],
  ["--color-blue-500", "#084777"],
  ["--color-blue-600", "#07406f"],
  ["--color-blue-700", "#063764"],
  ["--color-blue-800", "#042f5a"],
  ["--color-blue-900", "#022047"],
];

const GRAY_RAMP: ReadonlyArray<readonly [string, string]> = [
  ["--color-gray-50", "#e7e7e6"],
  ["--color-gray-100", "#c2c2c1"],
  ["--color-gray-200", "#9a9a98"],
  ["--color-gray-300", "#72726f"],
  ["--color-gray-400", "#535350"],
  ["--color-gray-500", "#353531"],
  ["--color-gray-600", "#30302c"],
  ["--color-gray-700", "#282825"],
  ["--color-gray-800", "#22221f"],
  ["--color-gray-900", "#161613"],
];

function assertColorRamp(
  name: string,
  ramp: ReadonlyArray<readonly [string, string]>,
): void {
  for (const [token, expected] of ramp) {
    assertHexColor(getCssVar(token), expected);
  }
  // 단조성 확인: 50→900 갈수록 밝기(L) 감소 (간단 검증: hex 평균 채널 감소)
  const lightness = ramp.map(([, hex]) => {
    const value = hex.replace("#", "");
    const r = Number.parseInt(value.slice(0, 2), 16);
    const g = Number.parseInt(value.slice(2, 4), 16);
    const b = Number.parseInt(value.slice(4, 6), 16);
    return (r + g + b) / 3;
  });
  for (let i = 1; i < lightness.length; i += 1) {
    expect(
      lightness[i] <= lightness[i - 1],
      `${name} ramp가 ${ramp[i - 1][0]} → ${ramp[i][0]} 구간에서 밝기 단조 감소를 위반합니다`,
    ).toBe(true);
  }
}

describe("colors / blue ramp (FR-1)", () => {
  it("blue 200 토큰이 #84a3bb로 정의된다", () => {
    assertHexColor(getCssVar("--color-blue-200"), "#84a3bb");
  });

  it("blue ramp 10단계가 50→900으로 갈수록 단조 감소한다", () => {
    assertColorRamp("blue", BLUE_RAMP);
  });
});

describe("colors / gray ramp", () => {
  it("gray ramp 10단계가 50→900으로 갈수록 단조 감소한다", () => {
    assertColorRamp("gray", GRAY_RAMP);
  });
});
