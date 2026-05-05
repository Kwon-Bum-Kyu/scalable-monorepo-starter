# TDD 및 한국어 BDD 테스트 규칙

> scalable-monorepo-starter의 모든 기능 구현·버그 수정은 TDD 사이클을 따른다.

## Red-Green-Refactor Cycle (필수)

1. **RED** — 실패하는 테스트 먼저 작성 (행동 기준, 구현 기준 아님)
2. **GREEN** — 테스트를 통과하는 최소 구현 (하드코딩 허용)
3. **REFACTOR** — 테스트가 통과된 상태에서 코드 정리
4. **삼각측량** — 두 번째 테스트 케이스를 추가해 하드코딩 제거

단순 UI 컴포넌트와 단일 유틸리티는 삼각측량 생략 가능.

> "스펙이 변한 게 아니라 리팩토링으로 내부구조만 변했다면 테스트는 여전히 통과해야 한다."

## 테스트 파일 위치

| Workspace     | 단위 테스트                       | 통합/E2E                        |
| ------------- | --------------------------------- | ------------------------------- |
| `apps/web`    | `tests/unit/**/*.test.{ts,tsx}`   | `tests/e2e/**/*.spec.ts`        |
| `apps/api`    | `test/unit/**/*.test.ts`          | `test/integration/**/*.test.ts` |
| `packages/ui` | `tests/**/*.test.{ts,tsx}`        | —                               |

## Mock 전략 (Classicist)

실제 객체를 최대한 사용. Mock은 외부 경계에만 허용.

- **Mock 허용:** Prisma Client, 외부 HTTP API, 파일 시스템, `Date.now()`/타이머
- **Mock 금지:** 도메인 로직, 서비스, 유틸리티, 동일 레이어 모듈
- **테스트당 Mock 최대 2개** — 초과 시 책임 분리 리팩토링

## 테스트 네이밍 규칙

한국어 행동 중심: `[주체]가 [조건]일 때 [기대 결과]`

```typescript
// GOOD
it("상태가 active인 사용자만 반환한다", () => {});
it("disabled 상태이면 클릭할 수 없다", () => {});
it("비밀번호가 8자 미만일 때 저장에 실패한다", () => {});

// BAD
it("repository.findAll을 호출한다", () => {}); // 구현 테스트
it("getUserById 테스트", () => {});             // 모호함
```

- 비동기 상태: `[상태: 로딩 중] 스피너가 표시된다` 형태 허용
- 실패 케이스: 항상 `~에 실패한다` 또는 `~할 수 없다`로 종결

## 커버리지 기준

워크스페이스별로 강제. 미달 시 CI 실패.

| Metric     | 최소 | 목표 |
| ---------- | ---- | ---- |
| Statements | 80%  | 90%  |
| Branches   | 80%  | 85%  |
| Functions  | 80%  | 90%  |
| Lines      | 80%  | 90%  |

## 워크스페이스별 전략

- **`apps/web`**: 사용자 관점 테스트. `@testing-library/user-event`로 실제 인터랙션 시뮬레이션. 중요 흐름은 Playwright E2E.
- **`apps/api`**: 서비스 단위 테스트(Prisma mock) + Supertest 통합 테스트(실제 테스트 DB).
- **`packages/ui`**: 컴포넌트 행동·접근성 테스트. 각 컴포넌트 디렉터리에 `*.test.tsx` 필수.

## Anti-Patterns (금지)

1. **구현 세부사항 테스트** — 내부 상태, private 메서드, 함수 호출 횟수 검증 금지
2. **스냅샷 남용** — 전체 컴포넌트 스냅샷 금지, 행동을 명시적으로 assert
3. **테스트 간 공유 가변 상태** — `beforeEach`로 반드시 초기화
4. **Mock 2개 초과** — 즉시 리팩토링 고려
5. **private 메서드 직접 테스트** — 별도 모듈로 분리
6. **리팩토링 후 테스트 삭제** — 행동 기반으로 재작성, 삭제 금지
7. **비동기 정리 누락** — 타이머·서버·DB·mock은 반드시 `afterEach`에서 cleanup
