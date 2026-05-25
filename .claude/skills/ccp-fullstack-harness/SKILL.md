---
name: ccp-fullstack-harness
description: scalable-monorepo-starter의 풀스택 개발 파이프라인을 ccp 플러그인 3-role(Gemini 리서치 / Codex 개발 / Claude 리뷰)로 실행하는 오케스트레이터. 새 기능 개발, 요구사항 분석, 구현, TDD, 리뷰, 가드, QA 요청 시 사용. "기능 개발", "구현해줘", "리서치", "개발 시작", "코딩", "파이프라인 돌려", "ccp 하네스" 같은 표현에 트리거된다.
---

# ccp-fullstack-harness

scalable-monorepo-starter의 풀스택 개발을 **ccp 플러그인 기반 3-role 파이프라인**으로 조율한다.

| Role | 담당 | 도구 |
| ---- | ---- | ---- |
| 리서치 | Gemini | `/gemini:rescue` — 요구사항 분석, 기술 조사, 라이브러리 문서 대조, 대용량 컨텍스트 요약 |
| 개발 | Codex | `/ccp:codex-rescue` — 계획 기반 TDD 구현, 코드 생성, 리팩토링 |
| 리뷰 | Claude (메인) | 아키텍처 가드, 린트, QA, 경계면 검증 — 위임하지 않고 메인이 직접 수행 |

## 설계 원칙

- **메인 컨텍스트 보존:** 리서치·개발은 ccp 서브에이전트에 위임한다. rescue 호출은 요약(≤500자) + result 파일 경로만 반환하므로 메인 Claude 컨텍스트가 오염되지 않는다.
- **리뷰는 위임 금지:** 검수는 프로젝트 불변 규칙 판정이므로 메인 Claude가 직접 수행한다. 자기 검증 회피 — 구현자(Codex)와 검수자(Claude)를 분리한다.
- **자동 위임 없음:** ccp는 `auto_routing: false` 기본값. 본 스킬은 각 Phase에서 명시적으로 rescue를 호출한다.
- **사전 준비:** 파이프라인 진입 전 `/ccp:gemini-setup`·`/ccp:codex-setup`으로 CLI·OAuth 상태를 확인한다. 실패 시 사용자에게 안내 후 중단한다.

## Phase 0: 진입 확인

신규 기능 키워드 감지 시, 코드·테스트 변경에 들어가기 전 다음 4단계를 통과한다. 직접 구현 직행을 막는 진입 게이트다.

1. **slug 추출** — 기능 slug를 추출한다. 불명확하면 사용자에게 kebab-case로 확인받는다.
2. **사용자 결정 사전 수집** — 신규 기능이면 결정 필요 항목(입력 자료 범위·라우팅/UI 옵션·비목표·호환성 영향)을 먼저 수집한다. 명시적 답을 받기 전까지 임시 결정으로 구현에 진입하지 않는다.
3. **ccp CLI 준비 확인** — `/ccp:gemini-setup`, `/ccp:codex-setup`으로 CLI·OAuth 상태를 점검한다.
4. **산출물 기록 활성화** — 산출물 기록이 필요하면 "산출물 기록" 단계(아래 참조)를 활성화한다.

> 프로젝트에 추가 진입 게이트 룰(슬러그 인덱스 조회·재실행 분기 등)이 설정돼 있으면 그 룰을 함께 적용한다.

## Phase 1: 리서치 (Gemini)

`/gemini:rescue`로 위임한다.

```
/ccp:gemini-rescue "<slug> 기능의 요구사항을 풀스택 관점(FE apps/web / BE apps/api / shared packages/shared-types)에서 분해하라.
기능 요구·비기능 요구·제약을 구조화하고, 수용 기준을 Given/When/Then으로 작성하라.
필요한 라이브러리·API는 최신 문서로 확인하라." --files "apps/**,packages/**"
```

- 반환된 요약과 result 파일을 읽고 메인 Claude가 **계획을 검토**한다.
- 누락·모순이 있으면 사용자 확인 후 리서치를 재호출한다.
- 산출물: 요구사항 분석 + 구현 계획.

## Phase 2: 개발 (Codex)

검토를 통과한 계획을 입력으로 `/ccp:codex-rescue`에 위임한다.

**TDD 강제 — RED → GREEN → REFACTOR 순서를 위임 지시에 명시한다:**

```
/ccp:codex-rescue "<slug>: 아래 계획대로 TDD로 구현하라.
1) RED — 실패하는 테스트를 먼저 작성. 한국어 BDD 네이밍([주체]가 [조건]일 때 [기대 결과]). Classicist mock(외부 경계만, 테스트당 2개 이하).
2) GREEN — 테스트를 통과하는 최소 구현.
3) REFACTOR — 테스트 green 유지하며 정리.
프로젝트 불변 규칙 준수: apps/web @/ 별칭, apps/api 레이어드 아키텍처, shared-types 런타임 코드 금지, Tailwind @theme 토큰, apps/*/src 파일당 300L 이하.
[계획 본문]" --sandbox workspace-write --effort high
```

- 구현 작업은 파일을 써야 하므로 `--sandbox workspace-write`가 필수다 (rescue 기본값은 `read-only`).
- FE/BE를 분리 위임할 수 있다 — 의존이 없으면 두 rescue 호출을 병렬로.
- 대규모 구현은 `--background`로 비동기 실행 후 `/ccp:codex-status`·`/ccp:codex-result`로 회수한다.

## Phase 3: 리뷰 (Claude 메인)

Codex 구현 결과를 메인 Claude가 직접 검수한다. 위임하지 않는다.

1. **아키텍처 가드** — `architecture-guard` 스킬/에이전트로 8가지 불변 규칙 정적 스캔.
2. **TDD 검증** — `tdd-guide` 에이전트로 RED가 실제 실패했는지, 한국어 BDD·mock 규칙 준수 확인.
3. **린트 게이트** — `lint-enforcer` 스킬/에이전트로 `turbo run lint` error·warning 0/0 수렴.
4. **타입·테스트** — `turbo run typecheck`·`turbo run test` 전체 통과 확인.
5. **경계면 QA** — `fullstack-qa` 계열 검증으로 API 응답 shape과 FE 훅 소비 타입 대조.

P0(불변 규칙 위반·테스트 실패)이 있으면 Phase 2로 돌아가 Codex에 수정을 재위임한다.

## Phase 4: 커밋

리뷰를 모두 통과하면 `commit` 스킬로 Conventional Commits 타입별 분할 커밋한다.

## 산출물 기록 (선택)

요구사항·계획·리뷰 결과를 외부 문서 시스템에 기록하는 단계는 환경에 따라 다르다.
프로젝트에 문서 기록 어댑터(예: Obsidian vault 연동)가 설정돼 있으면 각 Phase 종료 시 그 어댑터에 위임한다.
어댑터가 없으면 본 스킬은 rescue가 생성한 result 파일 경로를 그대로 산출물로 사용한다.

## 실패 처리

| 상황 | 처리 |
| ---- | ---- |
| `CCP-OAUTH-*` | `/ccp:gemini-setup` 또는 `/ccp:codex-setup` 재인증 안내. 사용자 선택 후 재개 |
| `CCP-CTX-001` | 응답이 1,500토큰 초과 추정 — `--background` 후 `--summary-only`로 회수 |
| `CCP-TIMEOUT-001` | `--background`로 재시도 |
| rescue 결과가 불변 규칙 위반 | Phase 3에서 P0 차단, Phase 2 재위임 |
