import type {
  ApiError as SharedApiError,
  RequestId,
} from "@repo/shared-types";

/**
 * FE 측 ApiError 보강.
 * shared-types `ApiError`(message/code/details)에 클라이언트 메타데이터(timestamp/requestId)를 추가한다.
 * envelope 단일 출처는 `@repo/shared-types`의 `ApiResponse` union이며, 본 파일은 더 이상 자체 envelope 타입을 정의하지 않는다.
 */
export interface ApiError extends SharedApiError {
  timestamp: string;
  requestId?: RequestId;
}

export interface RequestConfig {
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export interface ApiClientConfig {
  baseURL: string;
  timeout: number;
  retryCount: number;
  retryDelay: number;
  defaultHeaders?: Record<string, string>;
}

export interface RequestInterceptor {
  onRequest?: (config: RequestInit) => RequestInit | Promise<RequestInit>;
  onError?: (error: Error) => Error | Promise<Error>;
}

/**
 * 응답 인터셉터.
 * 주의: 본 시그니처는 T-03-G에서 `UnwrappedResponse<T>` 기반으로 갱신된다.
 * 현재 파일 단독으로는 envelope 의존이 남지 않도록 제네릭을 `unknown` 기반 wrapper로 표현한다.
 */
export interface ResponseInterceptor {
  onResponse?: <T>(response: T) => T | Promise<T>;
  onError?: (error: ApiError) => ApiError | Promise<ApiError>;
}
