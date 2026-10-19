import type { Request, Response } from "express";
import { describe, expect, it, vi } from "vitest";
import { z } from "zod";

import { validateRequest } from "../../../src/middlewares/validate-request";

const runMiddleware = (
  schemas: Parameters<typeof validateRequest>[0],
  request: Partial<Request>,
) => {
  const response = { locals: {} } as Response;
  const next = vi.fn();
  const middleware = validateRequest(schemas);
  middleware(request as Request, response, next);
  return { response, next };
};

describe("validateRequest", () => {
  it("body가 유효하면 locals.validated.body에 파싱된 값을 담는다", () => {
    const { response, next } = runMiddleware(
      { body: z.object({ name: z.string() }) },
      { body: { name: "김" } },
    );

    expect(next).toHaveBeenCalledWith();
    expect(response.locals.validated.body).toEqual({ name: "김" });
  });

  it("params가 유효하면 locals.validated.params에 담는다", () => {
    const { response, next } = runMiddleware(
      { params: z.object({ id: z.string() }) },
      { params: { id: "42" } },
    );

    expect(next).toHaveBeenCalledWith();
    expect(response.locals.validated.params).toEqual({ id: "42" });
  });

  it("query가 유효하면 locals.validated.query에 담는다", () => {
    const { response, next } = runMiddleware(
      { query: z.object({ q: z.string() }) },
      { query: { q: "hello" } },
    );

    expect(next).toHaveBeenCalledWith();
    expect(response.locals.validated.query).toEqual({ q: "hello" });
  });

  it("검증 실패 시 next(error)로 ZodError를 전달한다", () => {
    const { next } = runMiddleware(
      { body: z.object({ age: z.number() }) },
      { body: { age: "old" } },
    );

    expect(next).toHaveBeenCalledTimes(1);
    const calledWith = next.mock.calls[0][0];
    expect(calledWith).toBeDefined();
    expect(calledWith.name).toBe("ZodError");
  });
});
