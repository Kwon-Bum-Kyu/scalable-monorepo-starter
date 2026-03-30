import type { HealthStatus } from "@repo/shared-types";

import { appConfig } from "../../config/app";

export function createHealthSnapshot(): HealthStatus {
  return {
    status: "ok",
    environment: appConfig.environment,
    timestamp: new Date().toISOString(),
  };
}
