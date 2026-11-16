import { describe, expect, it } from "vitest";

import { displayWidth } from "../../../src/cli/displayWidth.mjs";

describe("displayWidth", () => {
  it("한글 한 글자의 열 수가 2로 계산된다", () => {
    expect(displayWidth("가")).toBe(2);
    expect(displayWidth("설치")).toBe(4);
  });

  it("영문과 숫자와 기호의 열 수가 1로 계산된다", () => {
    expect(displayWidth("npm run dev:api")).toBe(15);
  });

  it("전각 문자의 열 수가 2로 계산된다", () => {
    expect(displayWidth("Ａ")).toBe(2);
    expect(displayWidth("。")).toBe(2);
  });

  it("한글과 영문이 섞였을 때 각각 더해서 계산한다", () => {
    expect(displayWidth("api 필요")).toBe(8);
  });

  it("빈 문자열의 열 수가 0이다", () => {
    expect(displayWidth("")).toBe(0);
  });
});
