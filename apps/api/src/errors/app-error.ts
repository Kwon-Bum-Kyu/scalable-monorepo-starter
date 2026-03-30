import type { ApiError } from "@repo/shared-types";

export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly code: string,
  ) {
    super(message);
    this.name = "AppError";
  }

  toApiError(): ApiError {
    return {
      message: this.message,
      code: this.code,
    };
  }
}
