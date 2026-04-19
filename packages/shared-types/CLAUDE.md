# packages/shared-types

FE/BE가 공유하는 TypeScript 타입 정의 전용 패키지.

## 절대 규칙: 런타임 코드 금지

이 패키지에는 **순수 TypeScript 타입만** 포함한다.

**금지 목록:**

- Zod 스키마, 검증 함수
- 클래스, 메서드
- 함수 (순수 함수도 금지)
- 상수 값 (`export const DEFAULT = ...`)
- Enum (대신 string literal union 사용)

**이유:** FE·BE 양쪽에서 import하므로 런타임 코드가 섞이면 번들 크기 증가·의존성 꼬임 발생.

## 허용되는 것

```typescript
// GOOD
export interface User {
  id: string;
  email: string;
}

export type UserRole = "admin" | "member";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}
```

## 검증이 필요한 경우

Zod 스키마는 **사용처**에서 정의:

- `apps/api`: `src/schemas/`에서 Zod 스키마 작성 → `z.infer`로 타입 추출 → 해당 타입을 `shared-types`의 인터페이스와 호환되게 유지
- `apps/web`: 필요 시 `src/types/` 또는 폼 라이브러리 활용

## 파일 구성

- `src/api.ts`: API 공통 타입 (`ApiResponse`, `ApiError`, `PaginationParams`)
- `src/<domain>.ts`: 도메인별 타입 파일 추가 시 이 규칙을 따름
- `src/index.ts`: 배럴 export
