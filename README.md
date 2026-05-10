# scalable-monorepo-starter

> 2시간 안에 셋업하고 1주 안에 배포하는 풀스택 모노레포 스타터.
> 주니어와 시니어가 똑같이 빠르게 손에 익도록 설계된 Turborepo 템플릿.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D22.13.0-43853d.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178c6.svg)](https://www.typescriptlang.org/)

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

## 기술 스택

| 구분 | 기술 | 버전 |
| ---- | ---- | ---- |
| 런타임 | Node.js | >= 22.13.0 |
| 패키지 매니저 | npm | >= 10.0.0 |
| 모노레포 | Turborepo | ^2.9 |
| 언어 | TypeScript | ^6.0 |
| Frontend | React + Vite + Tailwind CSS | 19 / 7 / 4 |
| Backend | Express + Prisma | 5 / 7 |
| DB | PostgreSQL (로컬: Docker / 배포: Neon) | 18 |
| 테스트 | Vitest + Testing Library + Playwright | ^4.1 / ^16 / ^1.59 |
| 컴포넌트 문서 | Storybook | 10 |
| UI 컴포넌트 | shadcn/ui | latest |

## Quickstart

### 1. 템플릿 가져오기

```bash
# degit (권장 — 히스토리 없이 깔끔하게)
npx degit <your-org>/scalable-monorepo-starter my-project
cd my-project

# 또는 git clone
git clone <repo-url> my-project
cd my-project
```

### 2. 의존성 설치 + 환경 변수

```bash
npm install
cp .env.example .env
```

`.env`에서 `DATABASE_URL`을 실제 환경에 맞게 설정한다.

- 로컬(Docker): `postgresql://postgres:postgres@localhost:5432/myapp` (기본값)
- Neon: `postgresql://<user>:<password>@<host>.neon.tech/<dbname>?sslmode=require`

### 3. 개발 서버 기동

```bash
npm run dev
```

루트 `npm run dev`는 다음을 자동 처리한다:

1. `predev` — Docker Postgres 컨테이너 기동 + `pg_isready` 폴링 + Prisma 마이그레이션 적용
2. `web`(3000) + `api`(4000) + `storybook`(6006) + Prisma Studio(5555) 동시 구동

> Docker가 없거나 외부 DB(Neon 등)를 사용하려면 `SKIP_DEV_BOOTSTRAP=1 npm run dev` 로 부트스트랩을 건너뛴다.

### 4. 접속

| 앱 | URL |
| -- | --- |
| Web (React) | http://localhost:3000 |
| API (Express) | http://localhost:4000 |
| Storybook | http://localhost:6006 |
| Prisma Studio | http://localhost:5555 |

## 워크스페이스 구조

```
scalable-monorepo-starter/
├── apps/
│   ├── web/                    # React 19 + Vite 7 (port 3000)
│   ├── api/                    # Express + Prisma + PostgreSQL (port 4000)
│   └── storybook/              # Storybook 10 (port 6006)
├── packages/
│   ├── shared-types/           # FE/BE 공유 TypeScript 타입 (런타임 코드 금지)
│   ├── ui/                     # 공유 UI 컴포넌트 (shadcn/ui)
│   ├── eslint-config/          # 공유 ESLint 설정
│   ├── typescript-config/      # 공유 tsconfig
│   └── vitest-config/          # 공유 Vitest 설정
├── scripts/                    # 개발 부트스트랩 스크립트
└── turbo.json                  # Turborepo 파이프라인
```

## 주요 명령어

| 명령 | 설명 |
| ---- | ---- |
| `npm run dev` | 전체 워크스페이스 동시 구동 (web + api + storybook) |
| `npm run build` | 전체 빌드 (의존 순서 자동) |
| `npm run typecheck` | 전체 타입 검사 |
| `npm run lint` | 전체 ESLint (워크스페이스별) |
| `npm run test` | 전체 단위/통합 테스트 |
| `npm run test:web` | `apps/web` 만 테스트 |
| `npm run test:api` | `apps/api` 만 테스트 |
| `npm run storybook` | Storybook 단독 구동 |
| `turbo run <task> --filter=<workspace>` | 특정 워크스페이스만 실행 |

### `apps/api` 내부

```bash
cd apps/api
npm run migrate         # Prisma 마이그레이션 생성·적용 (개발)
npm run migrate:deploy  # 배포 환경 마이그레이션 적용
npm run seed            # 시드 데이터 주입
```

### shadcn/ui 컴포넌트 추가

```bash
cd packages/ui
npx shadcn add button
# 추가 후 packages/ui/src/index.ts에 수동으로 re-export
```

## 변경 불가 규칙 (요약)

위반 시 리뷰 반려. 상세는 [.claude/rules/monorepo-invariants.md](./.claude/rules/monorepo-invariants.md).

1. **앱 간 직접 import 금지** — 공유 코드는 `packages/*` 경유
2. **`packages/shared-types`에 런타임 코드 금지** — 순수 TypeScript 타입만
3. **SQL 격리** — 모든 DB 쿼리는 Repository 계층에만
4. **파라미터화 쿼리 필수** — Prisma Client 경유, raw 문자열 연결 금지
5. **마이그레이션 파일 불변** — 기존 `*.sql` 수정 금지, 새 마이그레이션 생성
6. **import 경로 규칙** — `apps/web` 은 `@/` 별칭 필수, `../` 금지
7. **TDD 필수** — Red → Green → Refactor ([상세](./.claude/rules/tdd-korean-bdd.md))
8. **Tailwind 테마 변수** — `@theme` 토큰만 사용, 하드코딩 금지 ([상세](./.claude/rules/tailwind-v4.md))
9. **파일명 컨벤션** — React 컴포넌트 PascalCase, 훅·유틸 camelCase, API 레이어·shadcn 생성물 kebab-case ([상세](./.claude/rules/file-naming.md))

## 환경 변수

`.env.example` 참조. 주요 항목:

| 변수 | 기본값 | 비고 |
| ---- | ----- | ---- |
| `DATABASE_URL` | (필수) | 로컬 Docker 또는 Neon 연결 문자열 |
| `PORT` | 4000 | API 포트 |
| `NODE_ENV` | development | |
| `LOG_LEVEL` | dev: debug / prod: info | |
| `CORS_ALLOWED_ORIGINS` | http://localhost:3000 | 콤마 구분 다중 허용 |
| `RATE_LIMIT_WINDOW_MS` / `RATE_LIMIT_MAX` | 60000 / 100 | API rate-limit |
| `ENABLE_EXAMPLES` | dev: true / prod: false | 레퍼런스 CRUD 활성화 |
| `VITE_API_BASE_URL` | http://localhost:4000 | FE → API |

> 배포 환경(Vercel 등)에서는 `.env` 파일을 사용하지 않는다. 플랫폼의 Environment Variables UI에서 직접 설정한다.

## 테스트

| 워크스페이스 | 단위 테스트 | 통합 / E2E |
| ----------- | ---------- | --------- |
| `apps/web` | `tests/unit/**/*.test.{ts,tsx}` | `tests/e2e/**/*.spec.ts` (Playwright) |
| `apps/api` | `test/unit/**/*.test.ts` | `test/integration/**/*.test.ts` (Supertest) |
| `packages/ui` | `tests/**/*.test.{ts,tsx}` | — |

커버리지 임계치는 워크스페이스별 80% (statements/branches/functions/lines).

E2E 실행:

```bash
# DB·web·api가 기동 중이어야 함 (npm run dev 권장)
cd apps/web
npx playwright test --project=chromium
```

## 기여하기

[CONTRIBUTING.md](./CONTRIBUTING.md) 참조. TDD 흐름·9 불변 규칙·커밋 컨벤션·PR 절차를 정리해두었다.

## 라이선스

[MIT](./LICENSE)
