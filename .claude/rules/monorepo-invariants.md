# 모노레포 변경 불가 규칙

> scalable-monorepo-starter 프로젝트에서 반드시 지켜야 하는 9가지 불변 규칙. 위반 시 리뷰 반려.

## 1. 앱 간 직접 import 금지

`apps/*` 하위 워크스페이스는 서로를 직접 import할 수 없다. 공유 코드는 반드시 `packages/*` 경유.

```typescript
// BAD
import { something } from "../../api/src/utils";

// GOOD
import type { User } from "@repo/shared-types";
import { Button } from "@repo/ui";
```

**이유:** 앱 독립성 확보, 빌드 의존성 순환 방지.

### 예외 — 정적 자산 dev 서버 매핑

도구 설정 파일에서의 정적 자산 디렉터리 매핑은 ts/tsx `import` 문이 아니며, 빌드 의존성 그래프와 무관하게 SSOT(`apps/web/public/` 등)를 유지한 채 동일 자산을 dev 서버에 노출하는 패턴이다. 본 규칙의 "앱 간 직접 import 금지"와 분리 해석한다.

허용 패턴 예시:

- Storybook `apps/storybook/.storybook/main.ts` 의 `staticDirs: ["../../web/public"]`
- Vite `apps/*/vite.config.ts` 의 `publicDir`
- Next.js `next.config.js` 의 `assetPrefix` / `publicDir`

조건:
- SSOT(원본 정적 자산 디렉터리)가 명확히 한 곳에 존재 (`apps/web/public/` 등)
- ts/tsx `import` 문이 아닌 도구 설정 파일에서만 참조
- 빌드 의존성 그래프(`turbo run build` dependsOn)에 영향 없음

본 예외는 `.claude/skills/architecture-guard/SKILL.md` §스캔 체크리스트 #1 의 화이트리스트 패턴과 동기화된 상태로 유지되어야 한다 (양쪽 단일 출처 — 룰: 인간 가독, 스킬: 자동 스캔).

## 2. shared-types 런타임 코드 금지

`packages/shared-types`에는 순수 TypeScript 타입만 포함한다. Zod 스키마·클래스·함수·상수 모두 금지.

```typescript
// BAD (packages/shared-types/src/user.ts)
export const UserSchema = z.object({ ... });
export class User { ... }
export const DEFAULT_USER = { ... };

// GOOD
export interface User { id: string; name: string; }
export type UserRole = "admin" | "member";
```

**이유:** FE/BE 양쪽에서 import할 때 번들 증가·런타임 의존 방지.

## 3. SQL 격리 규칙

Controllers·Services에 SQL 문자열 포함 금지. 모든 SQL은 Repository 계층에만 위치.

```
Route → Controller → Service → Repository → Prisma Client
                                    ↑
                         모든 DB 쿼리는 여기에만
```

**이유:** 비즈니스 로직과 데이터 접근 분리, 테스트 용이성.

## 4. 파라미터화 쿼리 필수

DB 쿼리는 Prisma Client를 통해 작성한다. Raw SQL 문자열 연결(`${}`) 금지.

```typescript
// BAD
prisma.$queryRawUnsafe(`SELECT * FROM users WHERE id = '${id}'`);

// GOOD
prisma.user.findUnique({ where: { id } });
prisma.$queryRaw`SELECT * FROM users WHERE id = ${id}`;
```

**이유:** SQL Injection 방어.

## 5. 마이그레이션 파일 불변

`apps/api/prisma/migrations/` 내 기존 마이그레이션 파일은 수정하지 않는다. 변경이 필요하면 새 마이그레이션을 생성.

```bash
# BAD: 기존 파일 수정
# vim prisma/migrations/20250101_add_user/migration.sql

# GOOD: 새 마이그레이션 생성
npm run migrate -- --name add_user_email_index
```

**이유:** 팀원·배포 환경 간 DB 상태 일관성 보장.

## 6. imports 경로 규칙

`apps/web`에서 내부 모듈 import 시 `@/` 경로 별칭 사용 필수. 상대 경로(`../`) 금지.

```typescript
// BAD
import { Button } from "../../components/Button";
import { useApi } from "../hooks/useApi";

// GOOD
import { Button } from "@/components/Button";
import { useApi } from "@/hooks/useApi";
```

**예외:** 같은 디렉터리 내부(`./`)는 허용.

**이유:** 파일 이동 시 import 경로 깨짐 방지, 가독성.

## 7. TDD 필수

모든 기능 구현은 테스트 코드를 먼저 작성한 후 구현 코드를 작성한다. Red → Green → Refactor 사이클.

상세: [tdd-korean-bdd.md](./tdd-korean-bdd.md)

## 8. Tailwind CSS 테마 변수

색상·폰트·간격 등 디자인 토큰은 반드시 `packages/ui/src/styles/globals.css`의 `@theme` 변수를 사용. 하드코딩 금지.

```tsx
// BAD
<div className="bg-[#3b82f6] text-[#111827]">

// GOOD
<div className="bg-blue-500 text-gray-900">  // @theme에 정의된 토큰
```

상세: [tailwind-v4.md](./tailwind-v4.md)

## 9. 파일명 컨벤션

파일명은 **각 기술 생태계의 관례**를 따른다. React 컴포넌트는 PascalCase, React 훅·유틸은 camelCase, API 레이어와 shadcn 생성물은 kebab-case, 프레임워크 강제 파일은 해당 관례 그대로.

| 성격 | 케이스 | 예시 |
| ---- | ------ | ---- |
| React 컴포넌트 (`.tsx`) | PascalCase | `Button.tsx`, `RootLayout.tsx` |
| React 훅 / 일반 유틸 (`.ts`) | camelCase | `useApi.ts`, `apiClient.ts` |
| API 레이어 / shadcn 생성물 | kebab-case | `get-health-controller.ts`, `date-picker.tsx` |
| 프레임워크 강제 파일 | 관례 그대로 | `main.tsx`, `vite-env.d.ts`, `*.config.ts` |

**이유:** 주니어는 업계 표준 학습, 시니어는 생태계 관례 기반의 빠른 파악·구축.

상세: [file-naming.md](./file-naming.md)
