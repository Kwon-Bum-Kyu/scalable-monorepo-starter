import { describe, expect, it } from "vitest";

import {
  assertHexColor,
  assertNoPrefix,
  assertPxValue,
  assertRemValue,
  getCssVar,
  tokenExists,
} from "./helpers";

describe("tokens/helpers", () => {
  it("기존 정의된 토큰을 정상 조회한다", () => {
    const value = getCssVar("--color-blue-500");
    expect(value).toBe("#084777");
  });

  it("존재하지 않는 토큰을 조회하면 명확한 에러를 던진다", () => {
    expect(() => getCssVar("--color-not-exists-999")).toThrow(
      /not found in globals.css/,
    );
  });

  it("tokenExists는 존재 여부에 따라 boolean을 반환한다", () => {
    expect(tokenExists("--color-blue-500")).toBe(true);
    expect(tokenExists("--color-not-exists-999")).toBe(false);
  });

  it("assertHexColor는 대소문자 무관하게 hex를 비교한다", () => {
    expect(() => assertHexColor("#FFFFFF", "#ffffff")).not.toThrow();
    expect(() => assertHexColor("#abcdef", "#012345")).toThrow();
  });

  it("assertPxValue는 px 숫자값을 비교한다", () => {
    expect(() => assertPxValue("64px", 64)).not.toThrow();
    expect(() => assertPxValue("64px", 88)).toThrow();
    expect(() => assertPxValue("4rem", 64)).toThrow();
  });

  it("assertRemValue는 rem 숫자값을 비교한다", () => {
    expect(() => assertRemValue("0.75rem", 0.75)).not.toThrow();
    expect(() => assertRemValue("0.5rem", 0.75)).toThrow();
  });

  it("assertNoPrefix는 비표준 prefix가 없으면 통과한다", () => {
    expect(() => assertNoPrefix("--size-")).not.toThrow();
    expect(() => assertNoPrefix("--design-")).not.toThrow();
  });
});
