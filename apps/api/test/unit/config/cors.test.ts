import { describe, expect, it, vi } from "vitest";

import {
  corsOptions,
  isOriginAllowed,
  parseAllowedOrigins,
} from "../../../src/config/cors";
import { AppError } from "../../../src/errors/app-error";

describe("parseAllowedOrigins", () => {
  it("CORS_ALLOWED_ORIGINS가 콤마 구분 문자열일 때 배열로 파싱된다", () => {
    const result = parseAllowedOrigins(
      "http://localhost:3000, https://example.com ,https://app.example.com",
    );
    expect(result).toEqual([
      "http://localhost:3000",
      "https://example.com",
      "https://app.example.com",
    ]);
  });

  it("빈 문자열이거나 공백뿐인 항목은 결과 배열에서 제거된다", () => {
    const result = parseAllowedOrigins("http://localhost:3000,, ,https://a.com");
    expect(result).toEqual(["http://localhost:3000", "https://a.com"]);
  });
});

describe("isOriginAllowed", () => {
  it("허용 origin이면 true를 반환한다", () => {
    expect(
      isOriginAllowed("https://example.com", [
        "https://example.com",
        "http://localhost:3000",
      ]),
    ).toBe(true);
  });

  it("허용되지 않은 origin이면 false를 반환한다", () => {
    expect(
      isOriginAllowed("https://evil.com", ["https://example.com"]),
    ).toBe(false);
  });
});

describe("corsOptions.origin", () => {
  it("허용 origin이면 origin callback이 (null, true)로 호출된다", () => {
    const callback = vi.fn();
    const originFn = corsOptions.origin as (
      origin: string | undefined,
      cb: (err: Error | null, allow?: boolean) => void,
    ) => void;

    originFn("http://localhost:3000", callback);

    expect(callback).toHaveBeenCalledWith(null, true);
  });

  it("origin이 비어있는 요청(curl 등)은 통과한다", () => {
    const callback = vi.fn();
    const originFn = corsOptions.origin as (
      origin: string | undefined,
      cb: (err: Error | null, allow?: boolean) => void,
    ) => void;

    originFn(undefined, callback);

    expect(callback).toHaveBeenCalledWith(null, true);
  });

  it("허용되지 않은 origin이면 AppError(\"CORS_ORIGIN_DENIED\", 403)이 콜백에 전달된다", () => {
    const callback = vi.fn();
    const originFn = corsOptions.origin as (
      origin: string | undefined,
      cb: (err: Error | null, allow?: boolean) => void,
    ) => void;

    originFn("https://evil.example.com", callback);

    expect(callback).toHaveBeenCalledTimes(1);
    const passedError = callback.mock.calls[0]?.[0] as unknown;
    expect(passedError).toBeInstanceOf(AppError);
    const appError = passedError as AppError;
    expect(appError.statusCode).toBe(403);
    expect(appError.code).toBe("CORS_ORIGIN_DENIED");
  });
});
