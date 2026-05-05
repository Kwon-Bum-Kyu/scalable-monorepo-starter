---
name: fe-implementation
description: apps/web + packages/ui 프론트엔드 구현 스킬. React 19 + Vite 7 + Tailwind CSS v4 + shadcn/ui 스택에서 FE 레이어 순서(types→services→hooks→view)와 @/ 별칭, Tailwind 토큰, shadcn/ui 추가 절차를 적용한다. FE 개발 시 반드시 사용.
---

# fe-implementation

## 목적

FE 개발 태스크를 프로젝트의 아키텍처 규칙(@/ 별칭, Tailwind 토큰, shadcn/ui, 레이어 순서)에 맞춰 구현한다.

## 왜 중요한가

- FE 계층 순서를 건너뛰면 hooks가 services 없이 직접 fetch를 호출해 비즈니스 로직이 새어나온다
- Tailwind v4 토큰 위반은 디자인 시스템 일관성을 무너뜨린다
- shadcn/ui 컴포넌트가 index.ts에 재수출되지 않으면 다른 워크스페이스에서 import 불가

## 구현 순서

### 1. shared-types 확인

작업 시작 전 `packages/shared-types`에 필요한 타입이 존재하는지 확인. 없으면 shared-types-coordinator에 요청.

### 2. 앱 로컬 타입 (apps/web/src/types/)

shared-types에서 확장된 ViewModel, FormState 등 앱 전용 타입.

```typescript
// apps/web/src/types/authForm.ts
import type { User } from "@repo/shared-types";

export type LoginFormState = {
  email: string;
  password: string;
  isSubmitting: boolean;
};
```

### 3. services/ — API 호출 정적 메서드

```typescript
// apps/web/src/services/authService.ts
import { api } from "@/utils/api";
import type { LoginRequest, AuthToken } from "@repo/shared-types";
import type { ApiResponse } from "@repo/shared-types";

export const AuthService = {
  async login(req: LoginRequest): Promise<ApiResponse<AuthToken>> {
    return api.post("/auth/login", req);
  },
};
```

### 4. hooks/ — React 상태 관리

```typescript
// apps/web/src/hooks/useLogin.ts
import { useMutation } from "@/hooks/useMutation";
import { AuthService } from "@/services/authService";

export function useLogin() {
  return useMutation((req) => AuthService.login(req));
}
```

### 5. view/ — 페이지 컴포넌트

```tsx
// apps/web/src/view/auth/LoginPage.tsx
import { Button } from "@repo/ui";
import { useLogin } from "@/hooks/useLogin";
```

### 6. components/ — 앱 전용 UI

공유 불필요한 앱 전용만. 공유 가능하면 packages/ui로 이동.

## 규칙

### @/ 별칭 필수

apps/web 내부 import는 반드시 `@/`:

```typescript
// GOOD
import { api } from "@/utils/api";
import { useLogin } from "@/hooks/useLogin";

// BAD
import { api } from "../../utils/api";
```

예외: `@repo/*` 패키지 (shared-types, ui)는 그대로 사용.

### Tailwind 토큰만 사용

```tsx
// GOOD
<div className="bg-blue-500 text-gray-900 p-4">

// BAD
<div style={{ backgroundColor: "#3b82f6", color: "#111827", padding: "16px" }}>
<div className="bg-[#3b82f6]">
```

필요한 토큰이 없으면 shared-types-coordinator에 요청.

### shadcn/ui 컴포넌트 추가

```bash
cd packages/ui
npx shadcn add button
```

추가 후 `packages/ui/src/index.ts`에 반드시 re-export:

```typescript
export { Button } from "./components/Button";
```

재수출 누락 시 다른 워크스페이스에서 import 불가.

### 불변성

```typescript
// GOOD
const updated = { ...user, name: newName };
const nextList = [...list, newItem];

// BAD
user.name = newName;
list.push(newItem);
```

### 이모지/console.log 금지

코드·주석·문서 전반. 디버깅용 console.log는 커밋 전 제거.

## 테스트 (packages/ui & apps/web)

### packages/ui 컴포넌트 테스트

```typescript
// packages/ui/tests/Button.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

it("disabled 상태이면 클릭 이벤트가 발생하지 않는다", async () => {
  const onClick = vi.fn();
  render(<Button disabled onClick={onClick}>저장</Button>);
  await userEvent.click(screen.getByRole("button"));
  expect(onClick).not.toHaveBeenCalled();
});
```

### apps/web hook/view 테스트

```typescript
// apps/web/tests/unit/useLogin.test.ts
it("로그인에 성공하면 토큰을 반환한다", async () => {
  // ...
});
```

사용자 관점 테스트. DOM 구현 디테일 쿼리(`getByTestId` 남용) 금지, `getByRole` 우선.

## 완료 보고 포맷

호출자에 다음 형식으로 보고:

```
[fe-developer] T-02 완료
- 변경 파일:
  - apps/web/src/services/authService.ts (신규)
  - apps/web/src/hooks/useLogin.ts (신규)
  - apps/web/src/view/auth/LoginPage.tsx (신규)
- 테스트:
  - apps/web/tests/unit/useLogin.test.ts (3건 pass)
- 커버리지: 87% (statements)
- 이슈: 없음
```

## 체크리스트

- [ ] @/ 별칭 사용, 상대 경로 없음
- [ ] Tailwind @theme 토큰만 사용
- [ ] shadcn/ui 추가 시 index.ts re-export
- [ ] 레이어 순서(types→services→hooks→view) 준수
- [ ] 불변성 유지
- [ ] 이모지/console.log 없음
- [ ] 테스트 커버리지 80% 이상
