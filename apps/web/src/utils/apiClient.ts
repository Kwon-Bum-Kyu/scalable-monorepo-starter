import type { ApiResponse, PaginationMeta } from "@repo/shared-types";

import {
  type ApiClientConfig,
  type ApiError,
  type HttpMethod,
  type RequestConfig,
  type RequestInterceptor,
  type ResponseInterceptor,
} from "@/types/api";
import { isApiResponseEnvelope } from "@/utils/apiResponseGuards";

/**
 * apiClient가 호출자에게 반환하는 언래핑 결과 형태.
 * BE의 envelope `{ success: true, data, meta? }`에서 `data`/`meta`만 분리해 노출한다.
 */
export interface UnwrappedResponse<T> {
  data: T;
  meta?: PaginationMeta;
}

/**
 * envelope 자체를 제네릭에 넘기는 호출 패턴(`api.get<ApiResponse<...>>`)을 컴파일 시점에 차단하는 negative constraint.
 * `T extends ApiResponse<unknown>` 일 경우 `never`로 분기되어 호출자가 envelope 자체 타입을 제네릭으로 사용할 수 없다.
 */
export type UnwrappedPayload<T> = T extends ApiResponse<unknown> ? never : T;

export class ApiClient {
  private config: ApiClientConfig;
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];

  constructor(config: ApiClientConfig) {
    this.config = config;
  }

  addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor);
  }

  addResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.responseInterceptors.push(interceptor);
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async executeWithRetry<T>(
    operation: () => Promise<T>,
    retries: number = this.config.retryCount,
    delay: number = this.config.retryDelay,
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (retries > 0 && this.shouldRetry(error)) {
        await this.sleep(delay);
        return this.executeWithRetry(operation, retries - 1, delay * 2);
      }
      throw error;
    }
  }

  private shouldRetry(error: unknown): boolean {
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      return true;
    }

    if (typeof error === "object" && error !== null && "status" in error) {
      const status = (error as { status: number }).status;
      if (status >= 500) {
        return true;
      }
    }

    return false;
  }

  private async applyRequestInterceptors(
    config: RequestInit,
  ): Promise<RequestInit> {
    let processedConfig = config;

    for (const interceptor of this.requestInterceptors) {
      if (interceptor.onRequest) {
        try {
          processedConfig = await interceptor.onRequest(processedConfig);
        } catch (error) {
          if (interceptor.onError) {
            throw await interceptor.onError(error as Error);
          }
          throw error;
        }
      }
    }

    return processedConfig;
  }

  private async applyResponseInterceptors<T>(
    response: UnwrappedResponse<T>,
  ): Promise<UnwrappedResponse<T>> {
    let processedResponse = response;

    for (const interceptor of this.responseInterceptors) {
      if (interceptor.onResponse) {
        try {
          processedResponse = await interceptor.onResponse(processedResponse);
        } catch (error) {
          if (interceptor.onError) {
            throw await interceptor.onError(error as ApiError);
          }
          throw error;
        }
      }
    }

    return processedResponse;
  }

  private buildUrl(endpoint: string): string {
    const baseUrl = this.config.baseURL.replace(/\/$/, "");
    const cleanEndpoint = endpoint.replace(/^\//, "");
    return `${baseUrl}/${cleanEndpoint}`;
  }

  private buildHeaders(
    customHeaders?: Record<string, string>,
  ): Record<string, string> {
    const defaultHeaders = {
      "Content-Type": "application/json",
      ...this.config.defaultHeaders,
    };

    return {
      ...defaultHeaders,
      ...customHeaders,
    };
  }

  private async parseBody(response: Response): Promise<unknown> {
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      try {
        return await response.json();
      } catch {
        return undefined;
      }
    }
    return response.text();
  }

  private toApiError(
    source: { code?: unknown; message?: unknown; details?: unknown },
    requestId: string | undefined,
  ): ApiError {
    return {
      code: typeof source.code === "string" ? source.code : "UNKNOWN_ERROR",
      message:
        typeof source.message === "string"
          ? source.message
          : "Request failed",
      details:
        typeof source.details === "object" && source.details !== null
          ? (source.details as Record<string, unknown>)
          : undefined,
      timestamp: new Date().toISOString(),
      requestId,
    };
  }

  private async handleResponse<T>(
    response: Response,
  ): Promise<UnwrappedResponse<T>> {
    const requestId = response.headers.get("X-Request-Id") ?? undefined;
    const body = await this.parseBody(response);

    if (!isApiResponseEnvelope(body)) {
      throw this.toApiError(
        {
          code: "INVALID_ENVELOPE",
          message: "Response is not a valid API envelope",
        },
        requestId,
      );
    }

    if (body.success === false) {
      throw this.toApiError(
        {
          code: body.error.code,
          message: body.error.message,
          details: body.error.details,
        },
        requestId,
      );
    }

    const unwrapped: UnwrappedResponse<T> = {
      data: body.data as T,
      meta: body.meta,
    };

    return this.applyResponseInterceptors(unwrapped);
  }

  async request<T>(
    method: HttpMethod,
    endpoint: string,
    data?: unknown,
    config?: RequestConfig,
  ): Promise<UnwrappedResponse<UnwrappedPayload<T>>> {
    const url = this.buildUrl(endpoint);
    const headers = this.buildHeaders(config?.headers);
    const timeout = config?.timeout || this.config.timeout;

    let requestConfig: RequestInit = {
      method,
      headers,
      signal: AbortSignal.timeout(timeout),
    };

    if (data && method !== "GET") {
      if (data instanceof FormData) {
        delete headers["Content-Type"];
        requestConfig.body = data;
      } else {
        requestConfig.body = JSON.stringify(data);
      }
    }

    requestConfig = await this.applyRequestInterceptors(requestConfig);

    return this.executeWithRetry(
      async () => {
        const response = await fetch(url, requestConfig);
        return this.handleResponse<UnwrappedPayload<T>>(response);
      },
      config?.retries,
      config?.retryDelay,
    );
  }

  async get<T>(
    endpoint: string,
    config?: RequestConfig,
  ): Promise<UnwrappedResponse<UnwrappedPayload<T>>> {
    return this.request<T>("GET", endpoint, undefined, config);
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig,
  ): Promise<UnwrappedResponse<UnwrappedPayload<T>>> {
    return this.request<T>("POST", endpoint, data, config);
  }

  async put<T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig,
  ): Promise<UnwrappedResponse<UnwrappedPayload<T>>> {
    return this.request<T>("PUT", endpoint, data, config);
  }

  async patch<T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig,
  ): Promise<UnwrappedResponse<UnwrappedPayload<T>>> {
    return this.request<T>("PATCH", endpoint, data, config);
  }

  async delete<T>(
    endpoint: string,
    config?: RequestConfig,
  ): Promise<UnwrappedResponse<UnwrappedPayload<T>>> {
    return this.request<T>("DELETE", endpoint, undefined, config);
  }
}
