import { describe, expect, it } from "vitest";

import { isApiResponseEnvelope } from "@/utils/apiResponseGuards";

describe("isApiResponseEnvelope", () => {
  it("success: true 객체일 때 envelope으로 인식한다", () => {
    const value: unknown = { success: true, data: { id: "1" } };
    expect(isApiResponseEnvelope(value)).toBe(true);
  });

  it("success: false 객체일 때 envelope으로 인식한다", () => {
    const value: unknown = {
      success: false,
      error: { code: "ERR", message: "오류" },
    };
    expect(isApiResponseEnvelope(value)).toBe(true);
  });

  it("success 필드가 없는 객체일 때 envelope으로 인식하지 않는다", () => {
    const value: unknown = { data: { id: "1" } };
    expect(isApiResponseEnvelope(value)).toBe(false);
  });

  it("null/undefined일 때 envelope으로 인식하지 않는다", () => {
    expect(isApiResponseEnvelope(null)).toBe(false);
    expect(isApiResponseEnvelope(undefined)).toBe(false);
  });
});
