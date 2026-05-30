import { ApiError } from "@/types/api";

const REQUEST_ID_FALLBACK = "-";
const REQUEST_ID_PREFIX_LENGTH = 8;

const buildRequestIdSuffix = (requestId?: string): string => {
  const prefix = requestId
    ? requestId.slice(0, REQUEST_ID_PREFIX_LENGTH)
    : REQUEST_ID_FALLBACK;
  return `(req: ${prefix})`;
};

export class ErrorHandler {
  static getErrorMessage(error: ApiError | Error): string {
    if ("message" in error) {
      return error.message;
    }
    return "An unexpected error occurred";
  }

  static getErrorCode(error: ApiError): string {
    return error.code || "UNKNOWN_ERROR";
  }

  static isNetworkError(error: unknown): boolean {
    return error instanceof TypeError && error.message === "Failed to fetch";
  }

  static isTimeoutError(error: unknown): boolean {
    return (
      (error as Error)?.name === "AbortError" ||
      (error as Error)?.message?.includes("timeout")
    );
  }

  static isValidationError(error: ApiError): boolean {
    return error.code === "400" || error.code === "VALIDATION_ERROR";
  }

  static isAuthenticationError(error: ApiError): boolean {
    return error.code === "401" || error.code === "UNAUTHORIZED";
  }

  static isAuthorizationError(error: ApiError): boolean {
    return error.code === "403" || error.code === "FORBIDDEN";
  }

  static isNotFoundError(error: ApiError): boolean {
    return error.code === "404" || error.code === "NOT_FOUND";
  }

  static isServerError(error: ApiError): boolean {
    const code = parseInt(error.code);
    return code >= 500 && code < 600;
  }

  static formatErrorForUser(error: ApiError | Error): string {
    if (this.isNetworkError(error)) {
      return "네트워크 연결을 확인해주세요.";
    }

    if (this.isTimeoutError(error)) {
      return "요청 시간이 초과되었습니다. 다시 시도해주세요.";
    }

    if ("code" in error) {
      if (this.isValidationError(error)) {
        return error.message || "입력한 정보를 확인해주세요.";
      }

      if (this.isAuthenticationError(error)) {
        return "로그인이 필요합니다.";
      }

      if (this.isAuthorizationError(error)) {
        return "접근 권한이 없습니다.";
      }

      if (this.isNotFoundError(error)) {
        return "요청한 정보를 찾을 수 없습니다.";
      }

      if (this.isServerError(error)) {
        return "서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.";
      }
    }

    return this.getErrorMessage(error);
  }

  static formatToastMessage(error: ApiError | Error): string {
    const baseMessage = this.formatErrorForUser(error);
    const requestId = "requestId" in error ? error.requestId : undefined;
    const suffix = buildRequestIdSuffix(requestId);
    return `${baseMessage} ${suffix}`;
  }

  static logError(error: ApiError | Error, context?: string): void {
    const timestamp = new Date().toISOString();
    const errorInfo = {
      timestamp,
      context,
      message: this.getErrorMessage(error),
      ...("code" in error && { code: error.code }),
      ...("details" in error && { details: error.details }),
      stack: error instanceof Error ? error.stack : undefined,
    };

    console.error("Error: ", errorInfo);

    // 프로덕션 환경에서는 로그 서비스에 전송
    if (import.meta.env.PROD) {
      // 예: Sentry, LogRocket 등으로 전송
      // this.sendToLoggingService(errorInfo);
    }
  }

  // private static sendToLoggingService(errorInfo: any): void {
  //   // 로그 서비스 구현
  // }
}
