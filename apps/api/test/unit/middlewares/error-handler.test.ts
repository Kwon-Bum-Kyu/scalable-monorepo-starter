import type { Response } from "express";
import { describe, expect, it, vi } from "vitest";
import { z, ZodError } from "zod";

import { AppError } from "../../../src/errors/app-error";
import { errorHandler } from "../../../src/middlewares/error-handler";

const makeResponse = () => {
  const json = vi.fn();
  const status = vi.fn(() => ({ json }));
  return { status, json } as unknown as Response & {
    status: ReturnType<typeof vi.fn>;
    json: ReturnType<typeof vi.fn>;
  };
};

describe("errorHandler", () => {
  it("AppError가 오면 statusCode와 toApiError() 본문을 사용한다", () => {
    const response = makeResponse();
    const error = new AppError("유저 없음", 404, "USER_NOT_FOUND");

    errorHandler(error, {} as never, response, vi.fn());

    expect(response.status).toHaveBeenCalledWith(404);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: expect.objectContaining({
          code: "USER_NOT_FOUND",
          message: "유저 없음",
        }),
      }),
    );
  });

  it("ZodError가 오면 400과 VALIDATION_ERROR로 응답한다", () => {
    const response = makeResponse();
    const schema = z.object({ name: z.string() });
    let zErr: ZodError | undefined;
    try {
      schema.parse({});
    } catch (error) {
      zErr = error as ZodError;
    }

    errorHandler(zErr!, {} as never, response, vi.fn());

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: expect.objectContaining({ code: "VALIDATION_ERROR" }),
      }),
    );
  });

  it("ZodError에 issues가 없으면 기본 메시지를 사용한다", () => {
    const response = makeResponse();
    const empty = new ZodError([]);

    errorHandler(empty, {} as never, response, vi.fn());

    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.objectContaining({
          message: "요청 형식이 올바르지 않습니다.",
        }),
      }),
    );
  });

  it("알 수 없는 에러는 500 INTERNAL_SERVER_ERROR로 응답한다", () => {
    const response = makeResponse();

    errorHandler(new Error("boom"), {} as never, response, vi.fn());

    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: expect.objectContaining({ code: "INTERNAL_SERVER_ERROR" }),
      }),
    );
  });

  it("AppError에 details가 포함되면 응답 error.details로 직렬화된다", () => {
    const response = makeResponse();
    const details = { field: "email", reason: "이미 사용 중" };
    const error = new AppError(
      "검증 실패",
      422,
      "VALIDATION_FAILED",
      details,
    );

    errorHandler(error, {} as never, response, vi.fn());

    expect(response.status).toHaveBeenCalledWith(422);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: expect.objectContaining({
          code: "VALIDATION_FAILED",
          message: "검증 실패",
          details,
        }),
      }),
    );
  });

  it("AppError에 details가 없으면 응답 envelope에 details 키가 포함되지 않는다", () => {
    const response = makeResponse();
    const error = new AppError("유저 없음", 404, "USER_NOT_FOUND");

    errorHandler(error, {} as never, response, vi.fn());

    const body = response.json.mock.calls[0]?.[0] as {
      error: Record<string, unknown>;
    };
    expect(body.error).not.toHaveProperty("details");
  });
});
