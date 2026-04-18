# apps/api/src/repositories

모든 SQL·DB·외부 데이터 접근이 격리되는 유일한 계층.

## 역할

- Prisma Client 호출 또는 순수 데이터 스냅샷 생성
- 데이터 형태를 도메인 타입(`@repo/shared-types`)으로 변환하여 반환

## 규칙

- **Prisma 사용**: `import { prisma } from "../../lib/prisma"` 싱글턴 사용. 신규 `PrismaClient()` 생성 금지.
- **Raw SQL**: `$queryRawUnsafe` 금지. 필요시 `$queryRaw` 템플릿 리터럴(자동 파라미터화).
- **포함 금지**: HTTP 상태 코드, 비즈니스 검증, Service 호출, Controller 의존.
- **반환 타입**: 원시 Prisma 결과 대신 `@repo/shared-types`의 도메인 타입 반환 (필요시 매핑).

## 파일·함수 네이밍

- 파일: `<domain>.repository.ts` (예: `system.repository.ts`, `user.repository.ts`)
- 디렉터리: `repositories/<domain>/` 로 도메인별 그룹핑
- 함수: `findById`, `findMany`, `create`, `update`, `softDelete`, `create<Entity>Snapshot` 등 동사 시작

## 예시

```typescript
// GOOD
import { prisma } from "../../lib/prisma";

export async function findUserById(id: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { id } });
}

// BAD: 비즈니스 로직 포함
export async function getActiveAdmins() {
  const users = await prisma.user.findMany();
  return users.filter((u) => u.role === "admin" && u.status === "active"); // Service로 이동
}
```

## 테스트

- 단위: Prisma Client를 Mock. `test/unit/repositories/*.test.ts`.
- 통합: 실제 테스트 DB 사용. `test/integration/repositories/*.test.ts`. `beforeEach`에서 truncation.
