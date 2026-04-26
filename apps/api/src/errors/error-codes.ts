/**
 * 표준 에러 코드 카탈로그.
 *
 * `AppError`의 `code` 필드에 사용. 상세 설명은 docs/recipes/* 또는 PRD 참조.
 *
 * - AUTH_NOT_CONFIGURED: 인증 슬롯이 비어있음 (501)
 * - UNAUTHORIZED: 인증되지 않음 (401)
 * - FORBIDDEN: 권한 부족 (403)
 * - SESSION_EXPIRED: 세션 만료 (401)
 * - RATE_LIMIT_EXCEEDED: 요청 한도 초과 (429)
 * - CORS_ORIGIN_DENIED: 허용되지 않은 origin (403)
 * - SERVICE_UNAVAILABLE: 의존 자원 비가용 (503)
 *
 * shared-types `AuthErrorCode` union(UNAUTHORIZED|FORBIDDEN|SESSION_EXPIRED|AUTH_NOT_CONFIGURED)
 * 의 4종을 모두 포함한다.
 */
export const ERROR_CODES = {
  AUTH_NOT_CONFIGURED: "AUTH_NOT_CONFIGURED",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  SESSION_EXPIRED: "SESSION_EXPIRED",
  RATE_LIMIT_EXCEEDED: "RATE_LIMIT_EXCEEDED",
  CORS_ORIGIN_DENIED: "CORS_ORIGIN_DENIED",
  SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE",
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];
