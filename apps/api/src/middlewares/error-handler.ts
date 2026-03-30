import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

import { AppError } from "../errors/app-error";
import { sendError } from "../lib/http-response";

const DEFAULT_ERROR_CODE = "INTERNAL_SERVER_ERROR";

export const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  if (error instanceof AppError) {
    return sendError(response, error.toApiError(), error.statusCode);
  }

  if (error instanceof ZodError) {
    return sendError(
      response,
      {
        code: "VALIDATION_ERROR",
        message: error.issues[0]?.message ?? "요청 형식이 올바르지 않습니다.",
      },
      400,
    );
  }

  return sendError(
    response,
    {
      code: DEFAULT_ERROR_CODE,
      message: "예상하지 못한 오류가 발생했습니다.",
    },
    500,
  );
};
