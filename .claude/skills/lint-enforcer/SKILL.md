---
name: lint-enforcer
description: scalable-monorepo-starter의 `turbo run lint`를 실행하여 ESLint error와 warning을 모두 0으로 수렴시키는 스킬. warning도 error와 동등하게 취급(--max-warnings=0). 린트 실행, 경고 해소, error 수정, eslint --fix, 워크스페이스별 린트, 린트 게이트, 완료 전 린트 확인 요청 시 반드시 사용. "린트 돌려줘", "경고 다 잡아줘", "eslint 실행", "error + warning 0으로", "lint 게이트" 같은 표현에 트리거된다.
---

# lint-enforcer

## 목적

ESLint는 아키텍처 가드가 정적 스캔으로 잡지 못하는 세부 규칙(import sort·no-unused-vars·no-explicit-any·react-hooks/rules-of-hooks 등)을 처리한다. 사용자 요구사항: **error뿐 아니라 warning도 필수 처리**. `turbo run lint`를 게이트로 삼아 QA 전에 0/0을 강제한다.

## 언제 실행하는가

- **전체 QA 직전**: typecheck/test/build 이전에 먼저 린트를 0/0으로 통과시켜야 이후 단계 진입 허용
- **사용자 직접 요청**: "린트 돌려", "경고 잡아줘" 등

## 실행 절차

### 1단계: 전체 실행

```bash
turbo run lint
```

출력에서 각 워크스페이스의 error·warning 카운트를 파싱.

### 2단계: 결과 분기

- `0 errors, 0 warnings` (모든 워크스페이스) → PASS, 3단계 스킵
- 그 외 → 3단계

### 3단계: 자동 수정 시도 (1회)

각 위반 워크스페이스에서:

```bash
cd <workspace> && npx eslint . --fix --max-warnings=0
```

`--max-warnings=0`은 최종 판정용이며, `--fix`는 수정 가능한 규칙(import sort·prettier·no-var 등)만 처리한다.

### 4단계: 재실행 및 위임 분배

```bash
turbo run lint
```

잔여 위반을 워크스페이스별로 모아 개발자에게 SendMessage:

| 워크스페이스 | 담당 에이전트 |
| ---- | ---- |
| `apps/web` | fe-developer |
| `apps/api` | be-developer |
| `packages/ui` | fe-developer |
| `apps/storybook` | fe-developer |
| `packages/shared-types` | shared-types-coordinator |

메시지 포함 항목: 파일 경로, 줄 번호, 규칙명, 메시지, 스니펫(±2줄).

### 5단계: 재시도 루프

개발자가 수정 완료 메시지를 보내면 1단계부터 재실행. **3회 초과 시 중단**하고 사용자에게 보고.

## 금지 사항

1. **`eslint-disable` 주석 추가로 회피 금지** — 코드 수정으로 해결. 개발자가 disable을 요청하면 반려.
2. **룰 끄기(`"rule-name": "off"`) 금지** — ESLint 설정 변경은 사용자 승인 필요.
3. **ignore 경로 확장 금지** — 기존 `dist/**`, 생성물만 유지. 신규 ignore는 사용자 확인.
4. **warning 무시 금지** — "경고는 넘어가자"는 요청은 오케스트레이터 경유 사용자 승인 없이 수용 금지.

## 자주 걸리는 규칙과 수정 방향 (빠른 참조)

| 규칙 | 빈번한 원인 | 수정 |
| ---- | ---- | ---- |
| `simple-import-sort/imports` | 수동 import 재배치 | `--fix` 자동 해결 |
| `@typescript-eslint/no-unused-vars` | 미사용 변수·파라미터 | 제거 or `_` 접두 |
| `@typescript-eslint/no-explicit-any` | `any` 타입 사용 | `unknown` + 타입 가드 |
| `no-console` | 프로덕션 로그 | pino/logger로 교체 or 제거 |
| `react-hooks/rules-of-hooks` | 조건부 훅 호출 | 훅 구조 재설계 |
| `react-hooks/exhaustive-deps` | deps 누락 | 의도적이면 분할, 아니면 추가 |
| `react-refresh/only-export-components` | 비컴포넌트 공통 export | 별도 파일로 분리 |
| `import/no-duplicates` | 동일 모듈 중복 import | 병합 |
| `turbo/no-undeclared-env-vars` | turbo.json 미등록 env | `turbo.json` globalEnv/env 갱신 |

## 리포트 템플릿

```markdown
# Lint Enforcer Report — {slug} — {YYYY-MM-DD HH:MM}

## 요약
| 워크스페이스 | error | warning | 상위 규칙 Top 3 |
| ---- | ---- | ---- | ---- |
| apps/web | 0 | 0 | - |
| apps/api | 2 | 5 | no-unused-vars(4), no-explicit-any(2) |
| packages/ui | 0 | 3 | react-hooks/exhaustive-deps(3) |

- `--fix`로 자동 해결: N건
- 위임 대상: be-developer(7), fe-developer(3)

## 잔여 위반
- `apps/api/src/services/user.service.ts:22` — `@typescript-eslint/no-unused-vars` — `'email' is defined but never used.`
  ```ts
  async function findUser(id: string, email: string) {
    return prisma.user.findUnique({ where: { id } });
  }
  ```

## 최종 상태
- PASS / FAIL(위임 진행 중) / BLOCKED(3회 초과)
```

## 반복 실행

재호출되면:
1. 이전 결과와 비교하여 동일 위반 재발견 여부 확인
2. 3회 초과 시 사용자 보고: "근본 원인 의심 — ESLint 설정·코드 패턴 재검토 필요"

## 스킬-에이전트 연결

- 호출 주체: `lint-enforcer` 에이전트
- 호출 시점: 전체 QA 직전 게이트

## 체크리스트

- [ ] `turbo run lint` 실행
- [ ] error와 warning 동등 취급 (`--max-warnings=0`)
- [ ] `--fix` 1회만 시도
- [ ] 잔여 위반은 워크스페이스별 개발자에 위임
- [ ] `eslint-disable`·룰 끄기·신규 ignore 절대 금지
- [ ] 3회 초과 시 중단 후 사용자 보고
- [ ] lint.md append (라운드별 섹션)
