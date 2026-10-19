import type { HealthLiveResponse } from "@repo/shared-types";

/**
 * Liveness probe.
 *
 * 프로세스가 살아 있는지만 즉시 보고. 외부 의존성(DB, 캐시 등) 호출 금지.
 */
export function checkLiveness(): HealthLiveResponse {
  return {
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  };
}
