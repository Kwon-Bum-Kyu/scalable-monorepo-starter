import {
  ApiClientConfig,
  ApiError,
  ApiResponse,
  HttpMethod,
  RequestConfig,
  RequestInterceptor,
  ResponseInterceptor,
} from "@/types/api";

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
    response: ApiResponse<T>,
  ): Promise<ApiResponse<T>> {
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

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get("content-type");
    const requestId = response.headers.get("X-Request-Id") ?? undefined;
    let data: unknown;

    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const errorData = data as Record<string, unknown>;
      const error: ApiError = {
        message: (errorData?.message as string) || "Request failed",
        code: (errorData?.code as string) || response.status.toString(),
        details: errorData?.details as Record<string, unknown>,
        timestamp: new Date().toISOString(),
        requestId,
      };
      throw error;
    }

    const responseData = data as Record<string, unknown>;
    const apiResponse: ApiResponse<T> = {
      data: (responseData?.data as T) || (data as T),
      message: (responseData?.message as string) || "Success",
      success: true,
      timestamp: new Date().toISOString(),
      requestId,
    };

    return this.applyResponseInterceptors(apiResponse);
  }

  async request<T>(
    method: HttpMethod,
    endpoint: string,
    data?: unknown,
    config?: RequestConfig,
  ): Promise<ApiResponse<T>> {
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
        return this.handleResponse<T>(response);
      },
      config?.retries,
      config?.retryDelay,
    );
  }

  async get<T>(
    endpoint: string,
    config?: RequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.request<T>("GET", endpoint, undefined, config);
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.request<T>("POST", endpoint, data, config);
  }

  async put<T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.request<T>("PUT", endpoint, data, config);
  }

  async patch<T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.request<T>("PATCH", endpoint, data, config);
  }

  async delete<T>(
    endpoint: string,
    config?: RequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.request<T>("DELETE", endpoint, undefined, config);
  }
}
