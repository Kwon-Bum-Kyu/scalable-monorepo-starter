import type { RequestHandler } from "express";

import { AppError } from "../errors/app-error";

export const notFoundHandler: RequestHandler = (request, _response, next) => {
  next(
    new AppError(
      `${request.method} ${request.originalUrl} 경로를 찾을 수 없습니다.`,
      404,
      "NOT_FOUND",
    ),
  );
};
