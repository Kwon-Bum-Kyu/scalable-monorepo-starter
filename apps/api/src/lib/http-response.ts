import type { ApiError, ApiResponse } from "@repo/shared-types";
import type { Response } from "express";

export function sendSuccess<T>(response: Response, data: T, statusCode = 200) {
  const body: ApiResponse<T> = {
    success: true,
    data,
  };

  return response.status(statusCode).json(body);
}

export function sendError(response: Response, error: ApiError, statusCode: number) {
  const body: ApiResponse<never> = {
    success: false,
    error,
  };

  return response.status(statusCode).json(body);
}
