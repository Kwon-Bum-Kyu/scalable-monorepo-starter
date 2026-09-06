# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

사이드 프로젝트나 소규모 서비스를 새로 시작하는 개발자다. 주니어와 시니어를 가리지 않는다. 상황은 "아이디어는 있는데 프로젝트 구조를 처음부터 다시 정하고 싶지 않다"이고, 해내려는 일은 저장소를 clone한 뒤 2시간 안에 개발 서버를 띄우고 1주 안에 첫 배포를 마치는 것이다.

두 번째 사용자는 AI 코딩 어시스턴트(Claude Code 등)다. CLAUDE.md와 `.claude/rules/`를 읽고 같은 규칙으로 코드를 생성한다. (추정: README와 CLAUDE.md의 구성에서 유추했다.)

## Product Purpose

Turborepo 기반의 풀스택 모노레포 스타터 템플릿이다. React 19 + Vite 프론트엔드, Express + Prisma + PostgreSQL 백엔드, Storybook, 공유 UI 패키지(shadcn/ui)와 공유 타입 패키지를 미리 연결해 두었다. 존재 이유는 "구조 결정에 쓰는 시간을 0에 가깝게" 만드는 것이고, 성공 기준은 셋업 2시간 이내, 첫 배포 1주 이내, 그리고 주니어가 README만 보고 따라할 수 있는가이다.

## Positioning

명시적 설정을 암묵적 컨벤션보다, 문서화된 규칙을 구두 전수보다 우선한다. 9가지 변경 불가 규칙(앱 간 직접 import 금지, shared-types 런타임 코드 금지, SQL 격리, 파라미터화 쿼리, 마이그레이션 불변, `@/` 별칭, TDD, Tailwind `@theme` 토큰만 사용, 파일명 컨벤션)을 문서와 AI 가드 스킬(`architecture-guard`, `lint-enforcer`, `tdd-guide`)로 함께 강제한다. 한국어 문서와 한국어 BDD 테스트 네이밍을 기본으로 한다. (추정: 다른 스타터와의 차별점은 README의 의사결정 원칙에서 유추했다.)

## Operating Context

- 로컬: Docker PostgreSQL, `npm run dev`로 web(3000)·api(4000)·storybook(6006) 동시 구동.
- 배포: Neon PostgreSQL, Vercel 등 플랫폼 환경변수.
- 문서: README.md(사람 진입점), CLAUDE.md(AI 진입점), `.claude/rules/`(규칙 상세), 워크스페이스별 CLAUDE.md.
- 검증 의식: TDD Red-Green-Refactor, 커버리지 80%, `turbo run lint --max-warnings=0`, CI에서 typecheck·lint·test·e2e.
- 디자인 명세 소스: Claude Design(2026-05 이후). 디자인 토큰의 단일 출처는 `packages/ui/src/styles/globals.css`의 `@theme` 블록.

## Capabilities and Constraints

- 워크스페이스: `apps/web`, `apps/api`, `apps/storybook`, `packages/ui`, `packages/shared-types`, `packages/eslint-config`, `packages/typescript-config`, `packages/vitest-config`.
- 런타임 조건: Node.js 22.13 이상, npm 10 이상.
- 코드 제약: 이모지 금지, 프로덕션 코드에 `console.log` 금지, 입력 검증은 Zod(`packages/shared-types` 제외).
- 미결 사실: `apps/desktop` 워크스페이스가 존재하지만 README와 CLAUDE.md의 워크스페이스 표에는 없다. 제품 범위에 포함되는지는 확정되지 않았다.
- 용어: "워크스페이스"는 npm workspace 단위, "가드"는 규칙을 정적으로 검사하는 AI 스킬을 뜻한다.

## Brand Commitments

- 이름: scalable-monorepo-starter. 로고는 `apps/web/public/logo.png`.
- 목소리: 한국어, 평서문, 이모지 없음. 기술 용어는 원어를 유지한다.
- 구속력 있는 시각 제약: 색상·간격·폰트는 `@theme` 토큰만 사용하고 임의값(`bg-[#hex]`, `text-[14px]`)을 쓰지 않는다. shadcn/ui 생성 파일은 CLI 출력 그대로 유지한다.
- 서체: Open Sans 12종을 `apps/web/public/fonts/`에 동봉한다.

## Evidence on Hand

- 실제 구현: `apps/web/src/view/Guide.tsx`와 `apps/web/src/view/guide/sections/`(브랜드·토큰·컴포넌트 안내 페이지), `apps/web/src/view/examples/`(CRUD 예제), `packages/ui/src/components/ui/`(shadcn 기반 컴포넌트 약 40종), Storybook.
- 문서: README.md, CLAUDE.md, `.claude/rules/*.md`, CONTRIBUTING.md.
- 없는 것: 고객 사례, 추천사, 벤치마크, 가격 정보. 이후 작업에서 만들어 내지 않는다.

## Product Principles

1. 주니어가 README만 보고 따라할 수 있어야 한다. 그렇지 못한 기능·문서·구조는 채택하지 않는다.
2. 명시적 설정이 암묵적 컨벤션보다 낫고, 문서화된 규칙이 구두 전수보다 낫다.
3. 추상화와 메타 레이어는 셋업 2시간·배포 1주 목표를 해치지 않을 때만 들인다.
4. 복잡한 패턴은 반드시 가드(에이전트·스킬·룰)와 함께 도입해 누구나 같은 방식으로 쓰게 한다.
5. 규칙은 리뷰에서 협상하지 않는다. 위반은 반려한다.

## Accessibility & Inclusion

디자인 검수 기준으로 WCAG AA를 채택한다. 텍스트 대비 4.5:1, UI 요소 대비 3:1, 키보드 내비게이션(Tab 순서와 Enter·Space 동작), `focus-visible` 포커스 표시, 시맨틱 HTML(div 대신 button·nav·main)을 필수 항목으로 본다. (추정: 이전 디자인 검수 스킬의 필수 항목을 제품 기준으로 승격했다.)
