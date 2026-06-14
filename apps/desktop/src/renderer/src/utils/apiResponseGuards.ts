import type { ApiResponse } from "@repo/shared-types";

/**
 * BE 표준 envelope `{ success: true, data, meta? } | { success: false, error }` 형태인지 검사한다.
 * shared-types `ApiResponse` union의 type predicate으로 좁히기 위한 가드.
 *
 * 본 가드는 `apps/web/src/utils/`에 위치한다.
 * 이유: shared-types는 런타임 코드 금지(불변 규칙 #2)이므로, 가드 함수는 사용처(FE)에 둔다.
 */
export const isApiResponseEnvelope = (
  value: unknown,
): value is ApiResponse<unknown> => {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const candidate = value as { success?: unknown };
  return candidate.success === true || candidate.success === false;
};
