import { describe, expect, it } from "vitest";

import type { ErrorCode } from "../../../src/errors/error-codes";
import { ERROR_CODES } from "../../../src/errors/error-codes";

describe("ERROR_CODES 카탈로그", () => {
  it("7종 표준 에러 코드를 모두 export한다", () => {
    expect(ERROR_CODES.AUTH_NOT_CONFIGURED).toBe("AUTH_NOT_CONFIGURED");
    expect(ERROR_CODES.UNAUTHORIZED).toBe("UNAUTHORIZED");
    expect(ERROR_CODES.FORBIDDEN).toBe("FORBIDDEN");
    expect(ERROR_CODES.SESSION_EXPIRED).toBe("SESSION_EXPIRED");
    expect(ERROR_CODES.RATE_LIMIT_EXCEEDED).toBe("RATE_LIMIT_EXCEEDED");
    expect(ERROR_CODES.CORS_ORIGIN_DENIED).toBe("CORS_ORIGIN_DENIED");
    expect(ERROR_CODES.SERVICE_UNAVAILABLE).toBe("SERVICE_UNAVAILABLE");
  });

  it("shared-types AuthErrorCode union의 4종 모두 카탈로그에 포함된다", () => {
    const authCodes: ErrorCode[] = [
      ERROR_CODES.UNAUTHORIZED,
      ERROR_CODES.FORBIDDEN,
      ERROR_CODES.SESSION_EXPIRED,
      ERROR_CODES.AUTH_NOT_CONFIGURED,
    ];

    for (const code of authCodes) {
      expect(typeof code).toBe("string");
      expect(code.length).toBeGreaterThan(0);
    }
  });
});
