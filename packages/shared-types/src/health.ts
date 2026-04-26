/**
 * Health Check 관련 타입 정의
 *
 * /health/live, /health/ready 엔드포인트의 응답 shape.
 * 런타임 코드 금지 — 순수 타입만.
 */

export type HealthCheckOutcome = "ok" | "down" | "timeout";

export type HealthCheckMap = Record<string, HealthCheckOutcome>;

export interface HealthLiveResponse {
  status: "ok";
  uptime: number;
  timestamp: string;
}

export interface HealthReadyResponse {
  status: "ok" | "degraded";
  checks: HealthCheckMap;
  timestamp: string;
}
