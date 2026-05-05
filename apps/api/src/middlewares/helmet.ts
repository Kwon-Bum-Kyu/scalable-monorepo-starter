import type { RequestHandler } from "express";
import type { HelmetOptions } from "helmet";
import * as helmetModule from "helmet";

import { env } from "../config/env";
import { interopDefault } from "../lib/interop-default";

const helmet = interopDefault<(options?: HelmetOptions) => RequestHandler>(helmetModule);

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
