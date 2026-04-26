import type { NextFunction, Request, Response } from "express";
import { describe, expect, it, vi } from "vitest";

import { env } from "../../../src/config/env";
import { rateLimitOptions } from "../../../src/config/rate-limit";
import { AppError } from "../../../src/errors/app-error";

describe("rateLimitOptions", () => {
  it("windowMs와 max가 env에서 주입된다", () => {
    expect(rateLimitOptions.windowMs).toBe(env.RATE_LIMIT_WINDOW_MS);
    expect(rateLimitOptions.max).toBe(env.RATE_LIMIT_MAX);
  });

  it("standardHeaders가 \"draft-7\"로 설정되고 legacyHeaders는 false다", () => {
    expect(rateLimitOptions.standardHeaders).toBe("draft-7");
    expect(rateLimitOptions.legacyHeaders).toBe(false);
  });

  it("한도 초과 시 핸들러가 AppError(\"RATE_LIMIT_EXCEEDED\", 429, details:{retryAfter})를 next에 전달한다", () => {
    const next = vi.fn() as unknown as NextFunction;
    const windowMs = 60000;
    const handler = rateLimitOptions.handler;
    expect(typeof handler).toBe("function");

    handler!(
      {} as Request,
      {} as Response,
      next,
      // express-rate-limit의 optionsUsed 객체 일부만 사용
      { windowMs } as never,
    );

    expect(next).toHaveBeenCalledTimes(1);
    const err = (next as unknown as ReturnType<typeof vi.fn>).mock.calls[0]?.[0] as unknown;
    expect(err).toBeInstanceOf(AppError);
    const appError = err as AppError;
    expect(appError.statusCode).toBe(429);
    expect(appError.code).toBe("RATE_LIMIT_EXCEEDED");
    expect(appError.details).toEqual({
      retryAfter: Math.ceil(windowMs / 1000),
    });
  });

  it("retryAfter는 windowMs 1500ms일 때 올림되어 2초가 된다", () => {
    const next = vi.fn() as unknown as NextFunction;
    rateLimitOptions.handler!(
      {} as Request,
      {} as Response,
      next,
      { windowMs: 1500 } as never,
    );

    const err = (next as unknown as ReturnType<typeof vi.fn>).mock.calls[0]?.[0] as AppError;
    expect(err.details).toEqual({ retryAfter: 2 });
  });
});
