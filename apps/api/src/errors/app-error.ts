import type { ApiError } from "@repo/shared-types";

export class AppError extends Error {
  public readonly details?: unknown;

  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly code: string,
    details?: unknown,
  ) {
    super(message);
    this.name = "AppError";
    if (details !== undefined) {
      this.details = details;
    }
  }

  toApiError(): ApiError {
    const apiError: ApiError = {
      message: this.message,
      code: this.code,
    };
    if (this.details !== undefined) {
      apiError.details = this.details;
    }
    return apiError;
  }
}
