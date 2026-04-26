import type { HealthReadyResponse } from "@repo/shared-types";

import { env } from "../../config/env";
import { AppError } from "../../errors/app-error";
import { ERROR_CODES } from "../../errors/error-codes";
import { pingDatabase } from "../../repositories/health/ping-database";

/**
 * Readiness probe.
 *
 * DB 등 의존 자원이 트래픽을 받을 준비가 되었는지 확인.
 * 어느 하나라도 실패하면 SERVICE_UNAVAILABLE(503)으로 거부.
 */
export async function checkReadiness(): Promise<HealthReadyResponse> {
  const dbOutcome = await pingDatabase(env.HEALTH_DB_TIMEOUT_MS);

  if (dbOutcome !== "ok") {
    throw new AppError(
      "서비스가 트래픽을 받을 준비가 되지 않았습니다.",
      503,
      ERROR_CODES.SERVICE_UNAVAILABLE,
      { db: dbOutcome },
    );
  }

  return {
    status: "ok",
    checks: { db: "ok" },
    timestamp: new Date().toISOString(),
  };
}
