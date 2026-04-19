# apps/api/src/services

비즈니스 로직 전담 계층. 하나의 유스케이스를 하나의 함수로 표현.

## 역할

- 입력(검증된 DTO)을 받아 Repository 호출·도메인 규칙 적용·반환 데이터 조립
- 여러 Repository를 조합하거나 외부 API 호출 조율

## 규칙

- **함수 스타일**: `export function <verb><Noun>()` 형태의 순수 함수/비동기 함수. 클래스 지양.
- **의존**: Repository만 호출. Controller·Request·Response 객체 의존 금지.
- **SQL 금지**: SQL 문자열, `prisma.*` 직접 호출 금지 — 모두 Repository 경유.
- **에러**: 도메인 위반 시 `AppError` throw (`import { AppError } from "../../errors/app-error"`).
- **반환 타입**: `@repo/shared-types`의 타입 또는 유스케이스별 타입.

## 파일·함수 네이밍

- 파일: `<verb>-<noun>.ts` (예: `get-system-info.ts`, `create-user.ts`)
- 디렉터리: `services/<domain>/`로 그룹핑
- 함수: 파일명과 동일한 camelCase (예: `getSystemInfo`)

## 예시

```typescript
// GOOD
import type { SystemInfo } from "@repo/shared-types";
import { createSystemSnapshot } from "../../repositories/system/system.repository";

export function getSystemInfo(
  format: "summary" | "full",
): SystemInfo | SystemInfoSummary {
  const snapshot = createSystemSnapshot();
  if (format === "summary")
    return { name: snapshot.name, version: snapshot.version };
  return snapshot;
}

// BAD: Prisma 직접 호출
export async function getUser(id: string) {
  return prisma.user.findUnique({ where: { id } }); // Repository로 이동
}
```

## 테스트

- 단위: Prisma Mock으로 Repository 경계에서 격리. `test/unit/services/*.test.ts`.
- Mock 최대 2개. 초과 시 책임 분리 리팩토링.
- 한국어 BDD: `"~하면 ~을 반환한다"`, `"~할 때 ~에 실패한다"`.
