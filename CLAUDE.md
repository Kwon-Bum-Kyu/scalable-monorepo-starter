# scalable-monorepo-starter

> 2시간 안에 셋업하고 1주 안에 배포하는 풀스택 모노레포 스타터.
> 주니어와 시니어 모두에게 친숙한 Turborepo + React 19 + Express + Prisma 템플릿.

본 문서는 Claude(또는 다른 AI 코딩 어시스턴트)가 본 레포에서 작업할 때 참조하는 프로젝트 가이드다. 사람이 직접 읽기 위한 첫 진입점은 [README.md](./README.md)다.

## 핵심 목표

| 항목 | 기준 |
| ---- | ---- |
| 셋업 시간 | **2시간 이내** (clone → `npm install` → `npm run dev`) |
| 첫 배포 시간 | **1주일 이내** (신규 사이드 프로젝트 기준) |
| 사용자 페르소나 | 주니어·시니어 무관 모든 개발자 |

**의사결정 원칙:**
- 새 기능·문서·아키텍처 결정은 *"주니어가 README만 보고 따라할 수 있는가?"* 로 검토한다.
- **명시적 설정 > 암묵적 컨벤션**, **문서화된 규칙 > 구두 전수**.
- 추상화·메타 레이어는 위 두 KPI를 해치지 않을 때만 도입한다.

## 워크스페이스 구성

| Workspace | Description | Port |
| --------- | ----------- | ---- |
| `apps/web` | React 19 + Vite 7 frontend | 3000 |
| `apps/api` | Express + Prisma + PostgreSQL backend | 4000 |
| `apps/storybook` | Storybook 10 component docs | 6006 |
| `packages/shared-types` | FE/BE 공유 TypeScript 타입 (런타임 코드 금지) | — |
| `packages/ui` | 공유 UI 컴포넌트 라이브러리 (shadcn/ui) | — |
| `packages/eslint-config` | 공유 ESLint 설정 | — |
| `packages/typescript-config` | 공유 tsconfig | — |
| `packages/vitest-config` | 공유 Vitest 설정 | — |

## 기술 스택

| 구분 | 기술 | 버전 |
| ---- | ---- | ---- |
| 런타임 | Node.js | >= 22.13.0 |
| 패키지 매니저 | npm | >= 10.0.0 |
| 모노레포 | Turborepo | ^2.9 |
| 언어 | TypeScript | ~5.8 |
| Frontend | React + Vite + Tailwind CSS | 19 / 7 / 4 |
| Backend | Express + Prisma | 4 / 7 |
| DB | PostgreSQL (로컬: Docker / 배포: Neon) | 18 |
| 테스트 | Vitest + Testing Library + Playwright | ^4.1 / ^16 / ^1.59 |
| 컴포넌트 문서 | Storybook | 10 |
| UI 컴포넌트 | shadcn/ui | latest |

## 주요 명령어

```bash
# 루트 (전체 워크스페이스)
npm run dev          # web(3000) + api(4000) + storybook(6006) 동시 구동
npm run build        # 전체 빌드 (의존 순서 자동)
npm run typecheck    # 전체 타입 검사
npm run lint         # ESLint (--max-warnings=0)
npm run test         # Vitest + Playwright
npm run format       # Prettier

# 워크스페이스 필터
turbo run <task> --filter=<web|api|storybook|ui>

# apps/api 내부
npm run dev | migrate | seed | test

# shadcn/ui 컴포넌트 추가 (packages/ui에서)
npx shadcn add <component>   # 추가 후 src/index.ts에 수동 re-export
```

## 9가지 변경 불가 규칙 (요약)

위반 시 PR 반려. 상세는 [.claude/rules/monorepo-invariants.md](./.claude/rules/monorepo-invariants.md).

1. **앱 간 직접 import 금지** — `apps/*` 끼리 직접 import 금지. 공유 코드는 `packages/*` 경유.
2. **shared-types 런타임 코드 금지** — 순수 TypeScript 타입만. Zod·class·function·상수 모두 금지.
3. **SQL 격리** — Controllers·Services에 SQL 금지. Repository 계층에만 위치.
4. **파라미터화 쿼리 필수** — Prisma Client 경유. Raw SQL 문자열 연결 금지.
5. **마이그레이션 파일 불변** — `apps/api/prisma/migrations/` 의 기존 파일 수정 금지. 변경 필요 시 새 마이그레이션 생성.
6. **`@/` 별칭 (apps/web)** — 내부 모듈 import는 `@/` 별칭 필수. 상대 경로 `../` 금지(같은 디렉터리 `./` 는 허용).
7. **TDD 필수** — Red → Green → Refactor 사이클 강제. 한국어 BDD 네이밍. 상세는 [.claude/rules/tdd-korean-bdd.md](./.claude/rules/tdd-korean-bdd.md).
8. **Tailwind `@theme` 토큰** — `packages/ui/src/styles/globals.css` 의 `@theme` 변수만 사용. `bg-[#...]` 같은 임의 값 금지. 상세는 [.claude/rules/tailwind-v4.md](./.claude/rules/tailwind-v4.md).
9. **파일명 컨벤션** — React 컴포넌트 PascalCase, 훅·유틸 camelCase, API 레이어·shadcn 생성물 kebab-case, 프레임워크 강제 파일은 관례 그대로. 상세는 [.claude/rules/file-naming.md](./.claude/rules/file-naming.md).

## 워크스페이스별 CLAUDE.md

작업 중인 디렉터리에 따라 아래 파일들이 자동 로드된다.

- [apps/web/CLAUDE.md](./apps/web/CLAUDE.md) — 디렉터리 역할, `@/` 별칭, `useApi`/`useMutation`
- [apps/api/CLAUDE.md](./apps/api/CLAUDE.md) — 레이어드 아키텍처, `sendSuccess`/`AppError`, 마이그레이션
  - [apps/api/src/services/CLAUDE.md](./apps/api/src/services/CLAUDE.md) — 비즈니스 로직 규칙
  - [apps/api/src/repositories/CLAUDE.md](./apps/api/src/repositories/CLAUDE.md) — SQL 격리 규칙
- [packages/ui/CLAUDE.md](./packages/ui/CLAUDE.md) — 컴포넌트 추가·배럴 export·Tailwind
- [packages/shared-types/CLAUDE.md](./packages/shared-types/CLAUDE.md) — 런타임 코드 금지

## 환경 변수

```bash
# .env.example 참조 (루트에서 단일 관리)
DATABASE_URL=   # 필수. 로컬: Docker, 배포: Neon
PORT=4000       # 선택
NODE_ENV=development
```

로컬: `cp .env.example .env` / 배포: 플랫폼(Vercel 등)의 환경변수에서 직접 설정.

## 테스트·빌드

| Workspace | Unit | Integration / E2E |
| --------- | ---- | ----------------- |
| `apps/web` | `tests/unit/**/*.test.{ts,tsx}` | `tests/e2e/**/*.spec.ts` |
| `apps/api` | `test/unit/**/*.test.ts` | `test/integration/**/*.test.ts` |
| `packages/ui` | `tests/**/*.test.{ts,tsx}` | — |

루트에서 `npm run test` 로 전체 실행. 워크스페이스 단위 실행은 `turbo run test --filter=<name>`.

커버리지 최소치는 80% (statements / branches / functions / lines). 미달 시 CI 실패.

## 추가 프로젝트 제약

- 코드·주석·문서에 이모지 금지
- 프로덕션 코드에 `console.log` 금지
- 입력 검증은 Zod 사용 (단, `packages/shared-types` 에는 금지)

## 라이선스 / 기여

- 라이선스: [MIT](./LICENSE)
- 기여 가이드: [CONTRIBUTING.md](./CONTRIBUTING.md)

## 프로젝트 룰 인덱스

- [.claude/rules/monorepo-invariants.md](./.claude/rules/monorepo-invariants.md) — 9가지 변경 불가 규칙 상세
- [.claude/rules/tailwind-v4.md](./.claude/rules/tailwind-v4.md) — Tailwind CSS v4 테마·import·하드코딩 금지
- [.claude/rules/tdd-korean-bdd.md](./.claude/rules/tdd-korean-bdd.md) — Red-Green-Refactor·BDD 네이밍·Mock·안티패턴
- [.claude/rules/file-naming.md](./.claude/rules/file-naming.md) — 파일명 컨벤션
