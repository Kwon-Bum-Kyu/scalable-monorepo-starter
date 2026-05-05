---
name: shared-types-sync
description: packages/shared-types의 타입 단일 출처 관리와 Tailwind @theme 토큰 추가를 조율하는 스킬. FE/BE 계약 충돌을 방지하고, shadcn/ui 컴포넌트의 index.ts 재수출을 강제한다. shared-types·@theme 토큰·packages/ui 변경 시 반드시 사용.
---

# shared-types-sync

## 목적

FE/BE 병렬 개발 중 shared-types와 디자인 토큰이 두 에이전트 사이에서 일관되게 유지되도록 조율한다.

## 왜 중요한가

- shared-types는 FE/BE의 계약서 — 한쪽만 수정하면 통합 단계에서 타입 충돌
- Tailwind v4는 CSS 변수 기반이라 중복 토큰 정의 시 우선순위 문제 발생
- shadcn/ui 컴포넌트의 index.ts 재수출 누락은 runtime 에러가 아니라 build fail로 드러남

## 규칙

### 1. shared-types 런타임 코드 금지

```typescript
// GOOD — 순수 타입
export type User = { id: string; email: string };
export type ApiResponse<T> = { success: boolean; data?: T; error?: { message: string; code: string } };

// BAD — 런타임 코드
export const USER_ROLE = "admin";  // 상수도 금지
export class UserDto { }            // 클래스 금지
export function validateUser() { }  // 함수 금지
export const UserSchema = z.object({ });  // Zod 금지
```

ESLint로 감지되지 않을 수 있으므로 리뷰에서 반드시 확인.

### 2. 타입 변경 시 영향 공지

shared-types 수정 시 SendMessage로 fe-developer, be-developer 둘 다에 diff 공지:

```
[shared-types-coordinator] 타입 변경 공지
- 파일: packages/shared-types/src/auth.ts
- 변경: User에 `avatarUrl?: string` 추가
- 영향:
  - FE: useCurrentUser 훅 소비처 확인 필요
  - BE: UserRepository.findById 응답에 avatarUrl 포함 필요
```

### 3. Tailwind @theme 토큰 추가 절차

fe-developer 또는 design-reviewer가 토큰 추가 요청 시:

**Step 1: 재사용 가능성 검토**

`packages/ui/src/styles/globals.css`의 기존 @theme 변수에서 근사값 찾기:

```css
@theme {
  --color-blue-500: #3b82f6;
  --color-blue-600: #2563eb;
  /* 이 사이를 원한다면 blue-500 또는 blue-600 재사용 가능 */
}
```

**Step 2: 신규 토큰 추가 (재사용 불가 시만)**

네이밍 패턴:
- 색상: `--color-{name}-{shade}` 또는 `--color-{semantic}` (success, warning, danger)
- 폰트: `--font-family-{name}`, `--font-size-{size}`
- 간격: `--spacing-{name}`
- 브레이크포인트: `--breakpoint-{name}`

```css
@theme {
  --color-success-500: #22c55e;  /* 추가 */
  --color-success-600: #16a34a;  /* 페어 */
}
```

**Step 3: 영향 공지**

추가된 토큰을 dev-log에 기록하고 두 에이전트에 공지.

### 4. shadcn/ui 컴포넌트 추가 후 재수출 강제

컴포넌트 추가:
```bash
cd packages/ui
npx shadcn add dialog
```

생성된 파일 (예: `packages/ui/src/components/dialog.tsx`)을 **반드시** index.ts에 추가:

```typescript
// packages/ui/src/index.ts
export { Button } from "./components/Button";
export { Dialog, DialogContent, DialogTrigger } from "./components/dialog";  // 추가
```

재수출 누락 시 apps/web에서 `import { Dialog } from "@repo/ui"` 실패.

### 5. 계약 버전 검증

주기적으로 또는 QA 단계에서:

- PRD의 API 계약 섹션과 실제 shared-types 내용이 일치하는지
- apps/api 컨트롤러 응답 타입과 shared-types가 일치하는지
- apps/web 훅의 소비 타입과 shared-types가 일치하는지

불일치 발견 시 두 에이전트에 동시 수정 요청.

## 충돌 해결

FE/BE 요구가 상반될 때 (예: FE는 string ID, BE는 number ID):

1. 두 입장을 나란히 정리한 통합 제안 작성
2. 두 에이전트에 브로드캐스트하여 합의 유도
3. 합의 실패 시 사용자에게 판정 요청
4. 결정 후 근거와 함께 기록

## 체크리스트

- [ ] shared-types에 런타임 코드 없음
- [ ] 타입 변경 시 FE/BE 모두에 공지 발신
- [ ] 신규 토큰 추가 전 기존 @theme 재사용 검토
- [ ] 토큰 네이밍 패턴 준수
- [ ] shadcn/ui 추가 후 index.ts 재수출
- [ ] PRD ↔ shared-types ↔ 실제 구현 3자 정합성 주기 검증
