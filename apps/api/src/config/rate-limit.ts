import type { Options } from "express-rate-limit";

import { AppError } from "../errors/app-error";
import { env } from "./env";

const MS_PER_SECOND = 1000;

function toRetryAfterSeconds(windowMs: number): number {
  return Math.ceil(windowMs / MS_PER_SECOND);
}

export const rateLimitOptions: Partial<Options> = {
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  handler: (_request, _response, next, options) => {
    next(
      new AppError(
        "요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.",
        429,
        "RATE_LIMIT_EXCEEDED",
        { retryAfter: toRetryAfterSeconds(options.windowMs) },
      ),
    );
  },
};
