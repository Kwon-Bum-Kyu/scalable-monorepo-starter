export interface ApiResponse<T = unknown> {
  data: T;
  message: string;
  success: boolean;
  timestamp: string;
}

export interface ApiError {
  message: string;
  code: string;
  details?: Record<string, unknown>;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
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

export interface ResponseInterceptor {
  onResponse?: <T>(
    response: ApiResponse<T>,
  ) => ApiResponse<T> | Promise<ApiResponse<T>>;
  onError?: (error: ApiError) => ApiError | Promise<ApiError>;
}
