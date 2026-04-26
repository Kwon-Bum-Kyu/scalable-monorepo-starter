/**
 * API Request/Response 공통 타입 정의
 */

// Common API Types
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta?: PaginationMeta;
}

export interface ApiFailureResponse {
  success: false;
  error: ApiError;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiFailureResponse;

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  pageSize: number;
}

export interface ApiError {
  message: string;
  code: string;
  details?: unknown;
}

export type RequestId = string;

export type Environment = "development" | "test" | "production";

export interface HealthStatus {
  status: "ok";
  environment: Environment;
  timestamp: string;
}

export interface SystemInfoSummary {
  name: string;
  version: string;
}

export interface SystemInfo extends SystemInfoSummary {
  environment: Environment;
  timestamp: string;
}
