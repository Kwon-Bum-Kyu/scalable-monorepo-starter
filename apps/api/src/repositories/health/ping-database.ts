import type { HealthCheckOutcome } from "@repo/shared-types";

import { prisma } from "../../lib/prisma";

/**
 * PostgreSQL 연결 상태 점검.
 *
 * `SELECT 1` tagged template으로 실행 (rule 4: 파라미터화 쿼리).
 * 지정된 timeout 내 응답이 없으면 "timeout"을 반환한다.
 */
export async function pingDatabase(
  timeoutMs: number,
): Promise<HealthCheckOutcome> {
  let timeoutHandle: ReturnType<typeof setTimeout> | undefined;

  const timeoutPromise = new Promise<HealthCheckOutcome>((resolve) => {
    timeoutHandle = setTimeout(() => resolve("timeout"), timeoutMs);
  });

  const queryPromise: Promise<HealthCheckOutcome> = prisma
    .$queryRaw`SELECT 1`.then(
    (): HealthCheckOutcome => "ok",
    (): HealthCheckOutcome => "down",
  );

  try {
    return await Promise.race([queryPromise, timeoutPromise]);
  } finally {
    if (timeoutHandle !== undefined) {
      clearTimeout(timeoutHandle);
    }
  }
}
