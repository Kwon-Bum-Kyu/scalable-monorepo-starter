import { createHealthSnapshot } from "../../repositories/health/health.repository";

export function getHealthStatus() {
  return createHealthSnapshot();
}
