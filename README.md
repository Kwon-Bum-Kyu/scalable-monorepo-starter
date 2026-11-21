<img src="docs/assets/readme-header.svg" alt="scalable-monorepo-starter: 2시간 안에 셋업하고 1주 안에 배포하는 풀스택 모노레포 스타터" width="100%">

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
| Frontend | React + Vite + Tailwind CSS | 19 / 8 / 4 |
| Backend | Express + Prisma | 5 / 7 |
| DB | PostgreSQL (로컬: Docker / 배포: Neon) | 18 |
| 테스트 | Vitest + Testing Library + Playwright | ^4.1 / ^16 / ^1.59 |
| 컴포넌트 문서 | Storybook | 10 |
| UI 컴포넌트 | shadcn/ui | latest |

## Quickstart

### 1. 프로젝트 만들기

```bash
npm create scalable-monorepo-starter@latest
```

처음 실행할 때 npm이 패키지 설치를 물으면 y를 누릅니다.

터미널에서 질문에 답하면 CLI가 다음 일을 순서대로 한다. 설치할 앱을 고르고, 템플릿을 내려받고, 선택하지 않은 앱을 정리하고, 프로젝트 이름을 반영하고, `.env`를 만들고, 의존성을 설치하고, git 저장소를 만든다. 의존성 설치는 몇 분 걸릴 수 있다.

이름을 미리 정하면 이름 질문을 건너뛴다.

```bash
npm create scalable-monorepo-starter@latest my-app
```

질문 없이 플래그로 끝까지 실행할 수도 있다. `npm create`로 플래그를 넘길 때는 이름 뒤에 `--`가 필요하다.

```bash
npm create scalable-monorepo-starter@latest my-app -- --apps api,web --yes
```

#### 버전 고르기

CLI의 버전이 곧 내려받는 템플릿의 버전이다.

| 하고 싶은 일              | 명령                                                 |
| ------------------------- | ---------------------------------------------------- |
| 가장 최근 버전으로 만들기 | `npm create scalable-monorepo-starter@latest`        |
| 특정 버전으로 만들기      | `npm create scalable-monorepo-starter@1.3.0`         |
| 고를 수 있는 버전 보기    | `npm view create-scalable-monorepo-starter versions` |

- npm에 없는 버전을 지정하면 npm이 오류를 내고 CLI는 실행되지 않는다.
- CLI가 처음 npm에 배포된 `1.3.0-rc.1`보다 앞선 템플릿 버전(`v1.2.0` 이하)은 CLI로 고를 수 없다.

#### 플래그

| 인자와 플래그                          | 의미                      | 기본값                    |
| -------------------------------------- | ------------------------- | ------------------------- |
| `[이름]`                               | 프로젝트 이름             | 없음. 비대화형에서는 필수 |
| `--apps <id,...>`                      | 설치할 앱 id 목록         | `api,web`                 |
| `--remove-examples`, `--keep-examples` | examples 처리             | 남겨 둔다                 |
| `--yes`                                | 묻지 않고 기본값으로 진행 | 꺼짐                      |
| `--no-install`                         | `npm install` 생략        | 설치한다                  |
| `--no-git`                             | `git init` 생략           | 만든다                    |
| `--dry-run`                            | 변경 계획만 출력          | 꺼짐                      |
| `--help`, `--version`                  | 도움말, 버전              | 없음                      |

- 선택할 수 있는 앱 id는 `api`, `web`, `desktop`, `storybook`이다. `storybook`을 고르면 `web`이 함께 설치된다.
- 터미널이 아닌 환경(CI 등)에서는 프로젝트 이름이 필요하고, `--apps` 또는 `--yes` 중 하나도 있어야 한다.

### 2. 환경 변수

프로젝트 폴더로 이동해 `.env`의 `DATABASE_URL`을 실제 환경에 맞게 설정한다. CLI가 `.env.example`을 복사해 `.env`를 이미 만들어 둔다.

- 로컬(Docker): `postgresql://postgres:postgres@localhost:5432/myapp` (기본값)
- Neon: `postgresql://<user>:<password>@<host>.neon.tech/<dbname>?sslmode=require`

### 3. 개발 서버 기동

필요한 앱만 골라서 기동한다. 만든 프로젝트에는 설치한 앱의 명령만 있다.

```bash
npm run dev:web
npm run dev:api
npm run dev:desktop
npm run dev:storybook
```

모든 앱을 함께 기동하려면 다음 명령을 사용한다:

```bash
npm run dev
```

api를 기동하면 Docker Postgres 컨테이너 기동, `pg_isready` 폴링, Prisma 마이그레이션 적용, Prisma Client 생성을 먼저 실행한다. desktop을 기동하면 Electron 앱을 먼저 빌드한다.

> Docker가 없거나 외부 DB(Neon 등)를 사용하려면 `SKIP_DEV_BOOTSTRAP=1 npm run dev:api`로 api 준비를 건너뛴다.

### 4. 접속

| 앱 | URL |
| -- | --- |
| Web (React) | http://localhost:3000 |
| API (Express) | http://localhost:4000 |
| Storybook | http://localhost:6006 |
| Prisma Studio | http://localhost:5555 |

## 필요한 앱만 남기기

clone한 저장소에서 쓸 앱만 남기고 프로젝트 이름을 바꿀 수 있다. 앱 폴더와 그 앱 전용 설정, 스크립트, CI 단계가 함께 정리된다.

먼저 저장소를 가져온다.

```bash
# degit (히스토리 없이 가져오기)
npx degit <your-org>/scalable-monorepo-starter my-project
cd my-project

# 또는 git clone
git clone <repo-url> my-project
cd my-project
```

앱을 줄이지 않고 모두 쓰려면 `npm install`과 `cp .env.example .env`를 실행한 뒤 Quickstart 2단계부터 따른다.

앱을 줄이려면 다음 순서로 `setup`을 실행한다.

```bash
# 1. 먼저 --dry-run으로 지울 경로와 고칠 파일을 확인한다 (파일은 바뀌지 않는다)
npm run setup -- --name my-shop --apps web,api --dry-run

# 2. 확인한 대로 실행한다
npm run setup -- --name my-shop --apps web,api

# 3. 의존성과 lock 파일을 맞춘다
npm install
```

| 옵션 | 설명 |
| ---- | ---- |
| `--name <이름>` | 새 프로젝트 이름 (필수). `package.json`의 `name` 등에 npm 이름 규칙으로 변환해 쓴다 |
| `--apps <id,...>` | 남길 앱 id를 콤마로 구분한다 (필수). 고를 수 있는 id는 `api`, `web`, `desktop`, `storybook`이다. `storybook`을 고르면 `web`이 함께 남는다 |
| `--display-name <이름>` | 화면에 보일 이름. 생략하면 `--name`에서 만든다 |
| `--remove-examples` | Examples 레퍼런스 코드를 지운다. `api`를 남기지 않으면 자동으로 지운다 |
| `--dry-run` | 아무것도 바꾸지 않고 계획만 출력한다 |

주의할 점:

- 커밋하지 않은 변경이 있으면 거부된다. 먼저 커밋하거나 stash 한다.
- 이미 있는 `.env`는 그대로 두고, 없을 때만 `.env.example`을 복사한다.
- 실행이 끝나면 `setup` 스크립트와 CLI 패키지 폴더는 프로젝트에서 사라진다. 한 번만 쓰는 도구다.
- 실행 도중 실패하거나 결과가 마음에 들지 않으면 `git checkout . && git clean -fd`로 되돌린다. (`git clean`은 추적하지 않는 파일도 지우므로 먼저 커밋 상태를 확인한다)

## 워크스페이스 구조

```
scalable-monorepo-starter/
├── apps/
│   ├── web/                    # React 19 + Vite 8 (port 3000)
│   ├── api/                    # Express + Prisma + PostgreSQL (port 4000)
│   ├── storybook/              # Storybook 10 (port 6006)
│   └── desktop/                # Electron 데스크톱 앱 (electron-vite, renderer port 3100)
├── packages/
│   ├── shared-types/           # FE/BE 공유 TypeScript 타입 (런타임 코드 금지)
│   ├── ui/                     # 공유 UI 컴포넌트 (shadcn/ui)
│   ├── eslint-config/          # 공유 ESLint 설정
│   ├── typescript-config/      # 공유 tsconfig
│   └── vitest-config/          # 공유 Vitest 설정
├── docs/assets/                # README 헤더·소셜 미리보기 이미지
├── scripts/                    # renderer 패리티 검사·Examples 제거 스크립트
└── turbo.json                  # Turborepo 파이프라인
```

## 주요 명령어

| 명령 | 설명 |
| ---- | ---- |
| `npm run dev` | 전체 워크스페이스 동시 구동 (web + api + storybook + desktop) |
| `npm run dev:api` | API + Prisma Studio 기동 (DB 준비 포함) |
| `npm run dev:web` | Web 단독 기동 |
| `npm run dev:desktop` | Desktop 단독 기동 (빌드 포함) |
| `npm run dev:storybook` | Storybook 단독 기동 |
| `npm run build` | 전체 빌드 (의존 순서 자동) |
| `npm run typecheck` | 전체 타입 검사 |
| `npm run lint` | 전체 ESLint (워크스페이스별) |
| `npm run test` | 전체 단위/통합 테스트 |
| `npm run test:coverage` | 전체 단위/통합 테스트 + 커버리지 80% 임계 검사 (CI와 같은 명령) |
| `npm run check:parity` | web 화면 코드와 desktop renderer 사본이 같은지 검사 (CI와 같은 명령) |
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

### 디자인 검수 도구 (선택)

UI 품질 검수에는 [Impeccable](https://impeccable.style/)을 권장한다. 레포에는 포함하지 않으므로 필요한 사람이 자기 환경에 설치한다. 설치하지 않아도 빌드·테스트·린트·가드 스킬에는 영향이 없다.

```bash
npx impeccable install --global --no-hooks
# 설치기가 사용 중인 AI 코딩 도구(Claude Code, Cursor, Codex 등)를 감지한다
# 이후 AI 코딩 도구 안에서 /impeccable audit apps/web/src/view/Guide.tsx 형태로 호출
```

제품 맥락과 디자인 토큰은 루트의 [PRODUCT.md](./PRODUCT.md)와 [DESIGN.md](./DESIGN.md)에서 설명하고 토큰 사용 규칙은 아래 변경 불가 규칙 8을 따른다.

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
| `ENABLE_EXAMPLES` | dev: true / prod: false | 레퍼런스 CRUD 활성화. 개발 중에 끄면 web의 Examples 화면은 그대로 열리고 목록 조회만 실패한다(목록 자리에 오류 안내 표시) |
| `VITE_API_BASE_URL` | http://localhost:4000 | FE → API |

> 배포 환경(Vercel 등)에서는 `.env` 파일을 사용하지 않는다. 플랫폼의 Environment Variables UI에서 직접 설정한다.

## 테스트

| 워크스페이스 | 단위 테스트 | 통합 / E2E |
| ----------- | ---------- | --------- |
| `apps/web` | `tests/unit/**/*.test.{ts,tsx}` | `tests/e2e/**/*.spec.ts` (Playwright) |
| `apps/api` | `test/unit/**/*.test.ts` | `test/integration/**/*.test.ts` (Supertest) |
| `apps/desktop` | `tests/unit/**/*.test.{ts,tsx}` | — |
| `packages/ui` | `tests/**/*.test.{ts,tsx}` | — |

커버리지 임계치는 워크스페이스별 80% (statements/branches/functions/lines).

E2E 실행:

```bash
# DB가 기동 중이어야 함 (web·api는 playwright.config.ts의 webServer가 띄우거나 실행 중인 서버를 재사용)
cd apps/web
npx playwright test --project=chromium
```

시각 회귀 테스트(`tests/e2e/visual-regression.spec.ts`)는 선택 항목이다. 기준 스냅샷이 macOS 전용이라 CI에서는 실행하지 않으며 실행·갱신 명령은 spec 상단 주석에 있다.

## 기여하기

[CONTRIBUTING.md](./CONTRIBUTING.md) 참조. TDD 흐름·9 불변 규칙·커밋 컨벤션·PR 절차를 정리해두었다.

## 라이선스

[MIT](./LICENSE)
