import type { SystemInfo } from "@repo/shared-types";

import { appConfig } from "../../config/app";

export function createSystemSnapshot(): SystemInfo {
  return {
    name: appConfig.name,
    version: appConfig.version,
    environment: appConfig.environment,
    timestamp: new Date().toISOString(),
  };
}
