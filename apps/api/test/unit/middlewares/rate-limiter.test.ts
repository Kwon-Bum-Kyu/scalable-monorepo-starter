import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const rateLimitMock = vi.fn();

vi.mock("express-rate-limit", () => ({
  default: (options: unknown) => {
    rateLimitMock(options);
    return (
      _req: unknown,
      _res: unknown,
      next: (err?: unknown) => void,
    ) => next();
  },
  rateLimit: (options: unknown) => {
    rateLimitMock(options);
    return (
      _req: unknown,
      _res: unknown,
      next: (err?: unknown) => void,
    ) => next();
  },
}));

describe("rateLimiter", () => {
  beforeEach(() => {
    rateLimitMock.mockClear();
    vi.resetModules();
  });

  afterEach(() => {
    rateLimitMock.mockClear();
  });

  it("rateLimitOptions가 express-rate-limit에 그대로 위임된다", async () => {
    const { rateLimitOptions } = await import(
      "../../../src/config/rate-limit"
    );
    await import("../../../src/middlewares/rate-limiter");

    expect(rateLimitMock).toHaveBeenCalledTimes(1);
    expect(rateLimitMock).toHaveBeenCalledWith(rateLimitOptions);
  });

  it("위임된 옵션의 handler가 임계 초과 시 호출되도록 노출된다", async () => {
    const { rateLimitOptions } = await import(
      "../../../src/config/rate-limit"
    );
    await import("../../../src/middlewares/rate-limiter");

    const passedOptions = rateLimitMock.mock.calls[0]?.[0] as typeof rateLimitOptions;
    expect(passedOptions.handler).toBe(rateLimitOptions.handler);
    expect(typeof passedOptions.handler).toBe("function");
  });
});
