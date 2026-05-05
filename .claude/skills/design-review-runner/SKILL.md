---
name: design-review-runner
description: UI 컴포넌트 구현 직후 기존 디자인 스킬(audit·critique·normalize·polish·harden·typeset·colorize·arrange)을 호출하여 접근성·UX·디자인 시스템 정합성을 검수하는 스킬. 컴포넌트 단위로 점진적으로 실행하며, Tailwind @theme 토큰 위반을 P0로 차단한다. UI 구현 직후 반드시 사용.
---

# design-review-runner

## 목적

fe-developer가 방금 완성한 UI 컴포넌트/페이지에 대해 기존 디자인 스킬을 호출하는 조율자 역할을 한다. 새 검수 로직은 만들지 않는다.

## 왜 중요한가

- 전체 개발 완료 후 한 번에 검수하면 누적된 문제를 재작업하기 늦다
- 접근성·Tailwind 토큰 위반은 코드 시점에 잡는 게 가장 싸다
- 디자인 스킬들은 이미 전문화되어 있어서 래퍼로 충분

## 트리거 타이밍

**프런트엔드 개발자가 UI 태스크 완료 보고 직후** 이 스킬을 호출한다.

대상:
- `apps/web/src/view/**/*.tsx` (페이지)
- `apps/web/src/components/**/*.tsx` (앱 전용 컴포넌트)
- `packages/ui/src/components/**/*.tsx` (공유 컴포넌트 — 신규 추가·변경 시)

## 검수 스킬 호출 순서

### Step 1: audit (기본, 항상 실행)

스킬 호출: `audit`

audit은 접근성·성능·반응형·테마·안티패턴을 P0~P3 스코어로 리포트한다. 이 리포트를 기준으로 후속 스킬을 선택적으로 호출한다.

### Step 2: Critical/High 이슈 기반 후속 호출

audit 결과에 따라:

| audit 발견 이슈        | 호출 스킬             |
| ---------------------- | --------------------- |
| 접근성 P0 (대비, ARIA) | `harden` → 재구현 요청 |
| Tailwind 토큰 하드코딩 | `normalize`           |
| 에러·엣지 케이스 미처리 | `harden`              |
| 레이아웃/간격 불일치  | `arrange`             |
| 타이포 계층 약함      | `typeset`             |
| 색·톤 문제            | `colorize` / `quieter` |

### Step 3: UX 관점 검토 (주요 페이지 한정)

대시보드·랜딩·온보딩 같은 핵심 페이지만 `critique` 호출.

### Step 4: 마무리

중요 이슈가 해결된 후 `polish` 1회 호출 (정렬·간격·일관성 마이크로 디테일).

## Tailwind 토큰 위반 차단

다음은 **P0로 즉시 반송**:

- className에 `bg-[#hex]` 등 임의값 사용
- style 속성에 하드코딩 색상/간격
- @theme에 없는 토큰명 사용

반송 경로: fe-developer에게 SendMessage + shared-types-coordinator에 토큰 추가 필요 여부 확인 요청.

## 접근성 필수 체크

audit 결과에 다음 항목이 Pass인지 재확인:

- [ ] Semantic HTML (div 남발 대신 button/nav/main)
- [ ] ARIA 속성 (필요 시: aria-label, aria-describedby)
- [ ] 키보드 내비게이션 (Tab 순서, Enter/Space 동작)
- [ ] 대비율 WCAG AA (4.5:1 텍스트, 3:1 UI)
- [ ] 포커스 표시 (focus-visible ring)

한 항목이라도 Fail이면 P0.

## 리포트 템플릿

컴포넌트별 섹션 형식:

```markdown
## {컴포넌트명} 디자인 검수 — {YYYY-MM-DD HH:mm}

**검수 대상:**
- apps/web/src/view/auth/LoginPage.tsx
- packages/ui/src/components/PasswordField.tsx (신규)

**호출한 스킬:** audit, normalize, polish

### audit 스코어
- 접근성: 92/100
- 성능: 88/100
- 반응형: 100/100
- 테마 정합성: 85/100 (Tailwind 토큰 2건 위반)
- 안티패턴: 95/100

### 이슈
**P0 (즉시 수정):**
- [P0-1] bg-[#3b82f6] 하드코딩 — `bg-blue-500` 토큰으로 교체 필요

**P1 (개선 권장):**
- [P1-1] 에러 메시지 aria-live 누락 (audit + harden 권고)

### 재작업 필요 여부: 예 (P0 이슈)
### 담당: 프런트엔드 개발자
```

## 체크리스트

- [ ] audit 먼저 호출하여 기준 스코어 확보
- [ ] 발견 이슈에 따라 harden/normalize/arrange 등 선택 호출
- [ ] Tailwind 토큰 위반은 P0로 분류
- [ ] 접근성 5개 필수 항목 Pass 확인
- [ ] polish는 마무리 단계에 1회
- [ ] 재작업 필요 시 fe-developer에 반송 + 사유 기록
