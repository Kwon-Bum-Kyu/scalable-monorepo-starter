import type { SystemInfo, SystemInfoSummary } from "@repo/shared-types";

import { createSystemSnapshot } from "../../repositories/system/system.repository";

export type SystemInfoFormat = "summary" | "full";

export function getSystemInfo(format: SystemInfoFormat): SystemInfo | SystemInfoSummary {
  const systemSnapshot = createSystemSnapshot();

  if (format === "summary") {
    return {
      name: systemSnapshot.name,
      version: systemSnapshot.version,
    };
  }

  return systemSnapshot;
}
