import type { RequestHandler } from "express";
import type { HelmetOptions } from "helmet";
import * as helmetModule from "helmet";

import { env } from "../config/env";

// helmet@8.x 는 package.json `exports` 에 `types` 조건이 누락되어, Vercel @vercel/node 의
// TS 6 자동 컴파일이 default export 를 callable 로 인식하지 못한다. 런타임에서는
// CJS 빌드(`module.exports = exports.default; module.exports.default = module.exports`)
// 로 default 와 module 객체가 동일하므로, 타입 시스템과 무관하게 어느 쪽을 골라도 호출 가능하다.
type HelmetFactory = (options?: HelmetOptions) => RequestHandler;
const helmetCandidate = (helmetModule as { default?: unknown }).default ?? helmetModule;
const helmet = helmetCandidate as HelmetFactory;

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
