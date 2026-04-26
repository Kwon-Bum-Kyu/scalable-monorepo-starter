import type { CorsOptions } from "cors";

import { AppError } from "../errors/app-error";
import { env } from "./env";

export function parseAllowedOrigins(raw: string): string[] {
  return raw
    .split(",")
    .map((value) => value.trim())
    .filter((value) => value.length > 0);
}

export function isOriginAllowed(
  origin: string,
  allowed: readonly string[],
): boolean {
  return allowed.includes(origin);
}

const allowedOrigins = parseAllowedOrigins(env.CORS_ALLOWED_ORIGINS);

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      callback(null, true);
      return;
    }

    if (isOriginAllowed(origin, allowedOrigins)) {
      callback(null, true);
      return;
    }

    callback(
      new AppError(
        `허용되지 않은 origin입니다: ${origin}`,
        403,
        "CORS_ORIGIN_DENIED",
        { origin },
      ),
    );
  },
};
