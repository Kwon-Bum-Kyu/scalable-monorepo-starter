/**
 * 인증/세션 관련 타입 정의
 *
 * 런타임 코드 금지 — 순수 타입/interface/string literal union만.
 * enum 사용 금지 (rule 2: shared-types 런타임 코드 금지).
 */

export interface AuthUser {
  id: string;
  email?: string;
  roles?: string[];
}

export interface AuthSession {
  id: string;
  userId: string;
  /** ISO 8601 timestamp */
  expiresAt: string;
}

export interface AuthContext {
  user: AuthUser;
  session: AuthSession;
}

export type AuthErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "SESSION_EXPIRED"
  | "AUTH_NOT_CONFIGURED";
