---
name: fullstack-tdd
description: scalable-monorepo-starter 프로젝트에서 Red-Green-Refactor TDD 사이클을 강제하는 스킬. 한국어 BDD 네이밍, Classicist mock 전략, 워크스페이스별 테스트 경로, 커버리지 80% 규칙을 적용한다. 모든 기능 개발·버그 수정 시 반드시 사용.
---

# fullstack-tdd

## 목적

TDD Red-Green-Refactor 사이클을 강제하고, 프로젝트의 테스트 규칙(한국어 BDD, Classicist mock, 80% 커버리지)을 모든 개발 태스크에 적용한다.

## 왜 중요한가

- 테스트 없이 작성된 코드는 리팩토링 불가 → 스타터 프로젝트의 확장성 목표와 충돌
- 구현 디테일 테스트는 리팩토링 시 함께 수정 필요 → 행동 기반 테스트가 훨씬 안정적
- Mock 남용은 프로덕션 버그를 테스트로 은폐 → Classicist 전략으로 실제 통합 검증

## TDD 사이클

### 1. RED — 실패하는 테스트 먼저

행동 기준으로 작성 (구현 기준 아님).

**작성 후 반드시 실행해서 실패하는지 확인:**
```bash
# apps/web
turbo run test --filter=web
# apps/api
turbo run test --filter=api
# packages/ui
turbo run test --filter=@repo/ui
```

실행 결과 실패(에러 또는 assertion fail)가 확인되어야 다음 단계.

### 2. GREEN — 최소 구현

테스트 통과만 목표. 하드코딩 허용. 중복 허용.

### 3. REFACTOR — 정리

테스트가 통과된 상태에서 구조 개선. 모든 테스트가 여전히 통과해야 한다.

### 4. Triangulation

하드코딩을 제거하기 위해 두 번째 테스트 케이스 추가.

예외: 단순 UI 컴포넌트, 단일 유틸리티 함수는 생략 가능.

## 테스트 네이밍 (한국어 BDD)

형식: `[주체]가 [조건]일 때 [기대 결과]`

```typescript
// GOOD
it("상태가 active인 사용자만 반환한다", () => {});
it("disabled 상태이면 클릭할 수 없다", () => {});
it("비밀번호가 8자 미만일 때 저장에 실패한다", () => {});

// BAD
it("repository.findAll을 호출한다", () => {});  // 구현 디테일
it("getUserById 테스트", () => {});              // 모호
it("should return user", () => {});             // 영어
```

실패 케이스는 `~에 실패한다` 또는 `~할 수 없다`로 끝낸다.

## Mock 전략 (Classicist)

### Mock 허용
- Prisma Client (DB 외부 경계)
- 외부 HTTP API (fetch, axios)
- 파일 시스템
- Date.now(), setTimeout (시간 의존 로직)

### Mock 금지
- 도메인 서비스 (비즈니스 로직 직접 호출)
- 유틸리티 함수
- 동일 레이어 내 다른 모듈

### 규칙
- **테스트당 mock 2개 이하**. 초과 시 책임 분리 리팩토링.
- Mock이 많다는 것은 의존성이 복잡하다는 신호.

## 워크스페이스별 테스트 경로

| Workspace     | Unit tests                      | Integration / E2E               |
| ------------- | ------------------------------- | ------------------------------- |
| apps/web      | tests/unit/**/*.test.{ts,tsx}   | tests/e2e/**/*.spec.ts          |
| apps/api      | test/unit/**/*.test.ts          | test/integration/**/*.test.ts   |
| packages/ui   | tests/**/*.test.{ts,tsx}        | —                               |

경로 밖에 테스트를 두면 vitest workspace에서 수집되지 않는다.

## 커버리지 기준

| Metric     | 최소 | 목표 |
| ---------- | ---- | ---- |
| Statements | 80%  | 90%  |
| Branches   | 80%  | 85%  |
| Functions  | 80%  | 90%  |
| Lines      | 80%  | 90%  |

기능 완성 시 워크스페이스별 커버리지 확인:
```bash
turbo run test -- --coverage --filter=web
turbo run test -- --coverage --filter=api
```

## 워크스페이스별 도구

- **apps/web:** Vitest + Testing Library + user-event (단위) / Playwright (E2E)
- **apps/api:** Vitest + Supertest (통합, 실제 테스트 DB) / Vitest + Prisma mock (단위)
- **packages/ui:** Vitest + Testing Library (행동·접근성)

## Anti-Patterns (절대 금지)

1. 구현 세부사항 테스트 (내부 state, 함수 호출 횟수, private 메서드)
2. 스냅샷 남용 — 행동을 명시적으로 assert
3. 테스트 간 공유 가변 상태 — `beforeEach`로 초기화
4. Mock 2개 초과 — 즉시 리팩토링
5. private 메서드 직접 테스트 — 별도 모듈로 분리
6. 리팩토링 후 테스트 삭제 — 행동 기반으로 재작성
7. 비동기 정리 누락 — 타이머/서버/DB/mock은 `afterEach` cleanup

## 체크리스트

개발 태스크 완료 전 확인:

- [ ] RED 단계에서 실패 로그를 확인했는가
- [ ] 테스트 이름이 한국어 BDD 형식인가
- [ ] Mock이 2개 이하인가
- [ ] 테스트 파일이 올바른 경로에 있는가
- [ ] 워크스페이스 커버리지 80% 이상인가
- [ ] Triangulation으로 하드코딩을 제거했는가 (해당 시)
- [ ] afterEach cleanup이 있는가 (비동기 리소스 사용 시)
