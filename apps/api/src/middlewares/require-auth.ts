// 인증 슬롯 (빈 구현). 실제 인증을 도입하려면 docs/recipes/auth-*.md 중 하나를 따라
// 본 파일을 교체한다 (better-auth, lucia, clerk 등). 외부 라이브러리 의존성 추가 없음.
import type { RequestHandler } from "express";

import { AppError } from "../errors/app-error";
import { ERROR_CODES } from "../errors/error-codes";

const RECIPES = ["auth-better-auth", "auth-lucia", "auth-clerk"] as const;

/**
 * 빈 슬롯 인증 미들웨어.
 *
 * 호출 시 항상 `AUTH_NOT_CONFIGURED` 501을 throw 한다.
 * 도입 시 본 파일을 레시피에 따라 교체.
 */
export const requireAuth: RequestHandler = (_request, _response, _next) => {
  throw new AppError(
    "인증이 구성되지 않았습니다. docs/recipes/auth-*.md 를 참고해 슬롯을 채우세요.",
    501,
    ERROR_CODES.AUTH_NOT_CONFIGURED,
    { recipes: [...RECIPES] },
  );
};
