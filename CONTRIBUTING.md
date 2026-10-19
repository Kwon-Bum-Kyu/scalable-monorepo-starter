# Contributing

이 프로젝트에 기여해주셔서 감사합니다. 본 문서는 개발 환경 셋업, 작업 흐름, 코드 스타일, 커밋·PR 규칙을 정리합니다.

## 개발 환경 셋업

[README.md](./README.md#quickstart) 의 Quickstart 섹션을 따른다.

## 작업 흐름 (TDD 강제)

scalable-monorepo-starter는 **모든 기능 구현·버그 수정에 TDD를 강제한다**.

### Red → Green → Refactor

1. **RED** — 실패하는 테스트를 먼저 작성한다 (행동 기준, 구현 기준 아님).
2. **GREEN** — 테스트를 통과하는 최소 구현을 작성한다 (하드코딩 허용).
3. **REFACTOR** — 테스트가 통과한 상태에서 코드를 정리한다.
4. **삼각측량** — 두 번째 테스트 케이스를 추가해 하드코딩을 제거한다.

상세: [.claude/rules/tdd-korean-bdd.md](./.claude/rules/tdd-korean-bdd.md)

### 한국어 BDD 네이밍

테스트 이름은 한국어 행동 중심 패턴을 따른다.

```typescript
// GOOD
it("상태가 active인 사용자만 반환한다", () => {});
it("disabled 상태이면 클릭할 수 없다", () => {});
it("비밀번호가 8자 미만일 때 저장에 실패한다", () => {});

// BAD
it("repository.findAll을 호출한다", () => {}); // 구현 테스트
it("getUserById 테스트", () => {});             // 모호함
```

### Mock 전략

Classicist — 실제 객체를 최대한 사용. Mock은 외부 경계에만 허용.

| Mock 허용 | Mock 금지 |
| --------- | -------- |
| Prisma Client | 도메인 로직 / 서비스 |
| 외부 HTTP API | 유틸리티 |
| 파일 시스템 | 동일 레이어 모듈 |
| `Date.now()`, 타이머 | DTO / 타입 객체 |

**테스트당 Mock 최대 2개.** 초과 시 책임 분리 리팩토링.

## 변경 불가 규칙 (9가지)

위반 시 PR 반려. 상세는 [.claude/rules/monorepo-invariants.md](./.claude/rules/monorepo-invariants.md).

1. **앱 간 직접 import 금지** — 공유 코드는 `packages/*` 경유
2. **`packages/shared-types`에 런타임 코드 금지** — 순수 타입만
3. **SQL 격리** — Repository 계층에만 위치
4. **파라미터화 쿼리 필수** — Prisma Client 경유
5. **마이그레이션 파일 불변** — 새 마이그레이션 생성
6. **import 경로** — `apps/web` 은 `@/` 별칭 필수
7. **TDD 필수**
8. **Tailwind 테마 변수** — `@theme` 토큰만 사용
9. **파일명 컨벤션** — React 컴포넌트 PascalCase, 훅·유틸 camelCase, API 레이어·shadcn 생성물 kebab-case

## 코드 스타일

- TypeScript: `any` 금지(외부 입력은 `unknown`으로 받고 narrowing)
- 불변성: spread 연산자로 새 객체 생성, in-place 변경 금지
- 입력 검증: Zod 사용 (단, `packages/shared-types` 에는 금지)
- 에러 처리: 모든 레이어에서 명시적 처리, 무음 swallow 금지
- 프로덕션 코드에 `console.log` 금지 — pino 등 로거 사용
- 코드·주석·문서에 이모지 금지

## 커밋 컨벤션

[Conventional Commits](https://www.conventionalcommits.org/) + 한국어 메시지.

```
<type>: <한국어 설명>
```

**타입:** `feat` · `fix` · `refactor` · `docs` · `test` · `chore` · `perf` · `ci` · `style`

**규칙:**
- scope·body 사용 금지 (단문 한 줄)
- Co-Authored-By 라인 추가 금지
- 이모지 금지
- `--no-verify` 금지 — 훅 실패 시 원인 수정 후 새 커밋

**예시:**
```
feat: 사용자 인증 미들웨어 추가
fix: examples 라우터의 envelope 언래핑 누락 수정
refactor: ApiClient envelope 단일 처리로 정리
docs: README Quickstart 섹션 추가
test: 라운드 3a 컴포넌트 정본 사양 단언 추가
chore: ESLint flat config 마이그레이션
ci: PR 게이트에 typecheck/lint/build/test 추가
```

## Pull Request 절차

### 사전 체크리스트

PR을 열기 전 다음을 모두 통과시킨다.

```bash
npm run typecheck   # 전체 타입 검사
npm run lint        # 전체 ESLint (warning 0 강제)
npm run test        # 전체 단위/통합 테스트
npm run build       # 전체 빌드
```

E2E (해당 변경 시):

```bash
cd apps/web
npx playwright test --project=chromium
```

### PR 본문

[.github/PULL_REQUEST_TEMPLATE.md](./.github/PULL_REQUEST_TEMPLATE.md) 가 자동으로 채워진다. 다음 항목을 채운다:

1. **변경 요약** — 무엇을 바꿨고 왜 바꿨는가
2. **관련 이슈** — `Closes #123` 등
3. **테스트 방법** — 리뷰어가 검증할 수 있는 절차
4. **체크리스트** — typecheck / lint / test / 9 불변 위반 여부

### 리뷰 기준

- CRITICAL / HIGH 지적은 머지 전 반드시 해결
- MEDIUM은 가능한 범위에서 처리, 후속 이슈로 분리 가능
- LOW는 백로그로 기록

## Issue 작성

[.github/ISSUE_TEMPLATE](./.github/ISSUE_TEMPLATE) 의 템플릿을 사용한다.

- **버그 리포트**: 재현 단계 / 기대 동작 / 실제 동작 / 환경 정보
- **기능 제안**: 목표 / 제안 / 대안 / 영향 범위 (FE/BE/shared)

## 행동 강령

기여자·메인테이너 모두 상호 존중하며 기술적 토론에 집중한다. 인신공격·차별 발언은 비허용.
