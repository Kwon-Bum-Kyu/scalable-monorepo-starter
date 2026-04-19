import { describe, expect, it } from "vitest";

import { ApiError } from "@/types/api";
import { ErrorHandler } from "@/utils/errorHandler";

const makeApiError = (overrides: Partial<ApiError> = {}): ApiError => ({
  message: "오류 발생",
  code: "UNKNOWN_ERROR",
  timestamp: new Date().toISOString(),
  ...overrides,
});

describe("ErrorHandler", () => {
  describe("getErrorMessage", () => {
    it("ApiError에 message가 있으면 해당 메시지를 반환한다", () => {
      const error = makeApiError({ message: "사용자 찾을 수 없음" });
      expect(ErrorHandler.getErrorMessage(error)).toBe("사용자 찾을 수 없음");
    });

    it("Error 인스턴스의 message를 반환한다", () => {
      const error = new Error("타임아웃");
      expect(ErrorHandler.getErrorMessage(error)).toBe("타임아웃");
    });
  });

  describe("getErrorCode", () => {
    it("code가 있으면 그 값을 반환한다", () => {
      expect(ErrorHandler.getErrorCode(makeApiError({ code: "401" }))).toBe(
        "401",
      );
    });

    it("code가 비어 있을 때 UNKNOWN_ERROR를 반환한다", () => {
      expect(ErrorHandler.getErrorCode(makeApiError({ code: "" }))).toBe(
        "UNKNOWN_ERROR",
      );
    });
  });

  describe("네트워크/타임아웃 판별", () => {
    it("TypeError(Failed to fetch)이면 네트워크 에러로 판정한다", () => {
      const error = new TypeError("Failed to fetch");
      expect(ErrorHandler.isNetworkError(error)).toBe(true);
    });

    it("일반 Error는 네트워크 에러가 아니다", () => {
      expect(ErrorHandler.isNetworkError(new Error("x"))).toBe(false);
    });

    it("AbortError이면 타임아웃으로 판정한다", () => {
      const error = new Error("aborted");
      error.name = "AbortError";
      expect(ErrorHandler.isTimeoutError(error)).toBe(true);
    });

    it("timeout 문자열을 포함하면 타임아웃으로 판정한다", () => {
      expect(ErrorHandler.isTimeoutError(new Error("request timeout"))).toBe(
        true,
      );
    });
  });

  describe("상태 코드 기반 분류", () => {
    it("code가 400 또는 VALIDATION_ERROR이면 유효성 오류로 판정한다", () => {
      expect(
        ErrorHandler.isValidationError(makeApiError({ code: "400" })),
      ).toBe(true);
      expect(
        ErrorHandler.isValidationError(
          makeApiError({ code: "VALIDATION_ERROR" }),
        ),
      ).toBe(true);
    });

    it("code가 401 또는 UNAUTHORIZED이면 인증 오류로 판정한다", () => {
      expect(
        ErrorHandler.isAuthenticationError(makeApiError({ code: "401" })),
      ).toBe(true);
      expect(
        ErrorHandler.isAuthenticationError(
          makeApiError({ code: "UNAUTHORIZED" }),
        ),
      ).toBe(true);
    });

    it("code가 403 또는 FORBIDDEN이면 권한 오류로 판정한다", () => {
      expect(
        ErrorHandler.isAuthorizationError(makeApiError({ code: "403" })),
      ).toBe(true);
      expect(
        ErrorHandler.isAuthorizationError(makeApiError({ code: "FORBIDDEN" })),
      ).toBe(true);
    });

    it("code가 404 또는 NOT_FOUND이면 미발견 오류로 판정한다", () => {
      expect(ErrorHandler.isNotFoundError(makeApiError({ code: "404" }))).toBe(
        true,
      );
      expect(
        ErrorHandler.isNotFoundError(makeApiError({ code: "NOT_FOUND" })),
      ).toBe(true);
    });

    it("code가 500번대이면 서버 오류로 판정한다", () => {
      expect(ErrorHandler.isServerError(makeApiError({ code: "500" }))).toBe(
        true,
      );
      expect(ErrorHandler.isServerError(makeApiError({ code: "503" }))).toBe(
        true,
      );
      expect(ErrorHandler.isServerError(makeApiError({ code: "400" }))).toBe(
        false,
      );
    });
  });

  describe("formatErrorForUser", () => {
    it("네트워크 에러일 때 한국어 안내를 반환한다", () => {
      const error = new TypeError("Failed to fetch");
      expect(ErrorHandler.formatErrorForUser(error)).toBe(
        "네트워크 연결을 확인해주세요.",
      );
    });

    it("타임아웃일 때 재시도 안내를 반환한다", () => {
      const error = new Error("request timeout");
      expect(ErrorHandler.formatErrorForUser(error)).toBe(
        "요청 시간이 초과되었습니다. 다시 시도해주세요.",
      );
    });

    it("유효성 오류일 때 입력 확인 메시지를 반환한다", () => {
      expect(
        ErrorHandler.formatErrorForUser(
          makeApiError({ code: "400", message: "" }),
        ),
      ).toBe("입력한 정보를 확인해주세요.");
    });

    it("인증 오류일 때 로그인 안내를 반환한다", () => {
      expect(
        ErrorHandler.formatErrorForUser(makeApiError({ code: "401" })),
      ).toBe("로그인이 필요합니다.");
    });

    it("권한 오류일 때 접근 권한 메시지를 반환한다", () => {
      expect(
        ErrorHandler.formatErrorForUser(makeApiError({ code: "403" })),
      ).toBe("접근 권한이 없습니다.");
    });

    it("미발견 오류일 때 찾을 수 없다는 메시지를 반환한다", () => {
      expect(
        ErrorHandler.formatErrorForUser(makeApiError({ code: "404" })),
      ).toBe("요청한 정보를 찾을 수 없습니다.");
    });

    it("서버 오류일 때 서버 문제 안내를 반환한다", () => {
      expect(
        ErrorHandler.formatErrorForUser(makeApiError({ code: "500" })),
      ).toBe("서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.");
    });

    it("알 수 없는 code일 때 원본 message로 대체한다", () => {
      const error = makeApiError({ code: "TEAPOT", message: "I'm a teapot" });
      expect(ErrorHandler.formatErrorForUser(error)).toBe("I'm a teapot");
    });
  });

  describe("logError", () => {
    it("context와 함께 호출해도 예외를 던지지 않는다", () => {
      const error = makeApiError({ code: "500", message: "boom" });
      expect(() => ErrorHandler.logError(error, "api/call")).not.toThrow();
    });

    it("Error 인스턴스에서도 stack을 읽고 예외 없이 처리한다", () => {
      expect(() => ErrorHandler.logError(new Error("fail"))).not.toThrow();
    });
  });
});
