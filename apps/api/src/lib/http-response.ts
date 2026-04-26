import type {
  ApiError,
  ApiResponse,
  ApiSuccessResponse,
  PaginationMeta,
} from "@repo/shared-types";
import type { Response } from "express";

export function sendSuccess<T>(
  response: Response,
  data: T,
  statusCode = 200,
  meta?: PaginationMeta,
) {
  const body: ApiSuccessResponse<T> = {
    success: true,
    data,
  };
  if (meta !== undefined) {
    body.meta = meta;
  }

  return response.status(statusCode).json(body);
}

export function sendError(
  response: Response,
  error: ApiError,
  statusCode: number,
) {
  const body: ApiResponse<never> = {
    success: false,
    error,
  };

  return response.status(statusCode).json(body);
}
