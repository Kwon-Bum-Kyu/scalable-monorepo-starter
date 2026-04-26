import helmet, { type HelmetOptions } from "helmet";

import { env } from "../config/env";

const HSTS_MAX_AGE_SECONDS = 31_536_000; // 365일

function buildHelmetOptions(): HelmetOptions {
  const isProduction = env.NODE_ENV === "production";

  return {
    contentSecurityPolicy: false,
    strictTransportSecurity: isProduction
      ? {
          maxAge: HSTS_MAX_AGE_SECONDS,
          includeSubDomains: true,
          preload: true,
        }
      : false,
  };
}

export function createHelmetMiddleware() {
  return helmet(buildHelmetOptions());
}
