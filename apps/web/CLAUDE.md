# apps/web

React 19 + Vite 7 + Tailwind CSS v4 프런트엔드 (port 3000).

## 디렉터리 역할

| 디렉터리          | 역할                                                                          |
| ----------------- | ----------------------------------------------------------------------------- |
| `src/components/` | 앱 전용 컴포넌트 (재사용 가능하면 `@repo/ui`로 승격)                          |
| `src/config/`     | `api.ts` — `API_CONFIG` (baseURL, timeout, retry), `API_ENDPOINTS`            |
| `src/hooks/`      | `useApi` (조회), `useMutation` (변경) — 공통 API 훅                           |
| `src/routes/`     | `createBrowserRouter` 구성, `ROUTES` 상수                                     |
| `src/services/`   | 도메인별 API 함수 (`examples.ts` 등) — `api` 클라이언트를 호출하고 envelope이 벗겨진 데이터를 반환 |
| `src/types/`      | 앱 로컬 타입 (`api.ts`, `user.ts` 등). FE/BE 공유 타입은 `@repo/shared-types` |
| `src/utils/`      | `ApiClient` 클래스, `api` 싱글턴, `errorHandler`                              |
| `src/view/`       | 라우터에 마운트되는 페이지 컴포넌트                                           |

## 규칙

- **Import 경로**: 내부 모듈은 `@/` 별칭 필수. 상대 경로 `../` 금지. 같은 디렉터리 `./`는 허용.
- **공유 UI**: `@repo/ui`에서 import. `packages/ui/src/components/**`를 직접 import 금지.
- **API 호출**: `ApiClient` 싱글턴(`src/utils/api.ts`) 경유. 컴포넌트에서 `fetch` 직접 호출 금지.
- **훅 선택**: 조회는 `useApi`, 생성/수정/삭제는 `useMutation`. 컴포넌트에서 `fetch` + `useState` + `useEffect`로 수동 데이터 패칭을 작성하지 말 것 (envelope 언래핑 누락·로딩/에러 분기 누락의 원인).
- **Tailwind**: `@repo/ui/globals.css`의 `@theme` 토큰만 사용. 임의 값(`bg-[#...]`) 금지.

## API 호출

API 응답은 BE가 항상 `ApiResponse<T>` envelope(`{ success, data, error?, meta? }`)을 반환한다. **envelope 언래핑은 `ApiClient`(`src/utils/apiClient.ts`)에서 단 한 번만 수행한다.** 그 이후 계층(services·hooks·view)은 envelope을 직접 다루지 않는다.

### 호출 계층

```
view (ExamplesPage)
  ↓ useExamplesList / useCreateExample ...
hooks/useExamples.ts (useApi · useMutation 래핑)
  ↓ fetchExamplesList / createExample ...
services/examples.ts (api.get<T> · api.post<T> ...)
  ↓ T 또는 ApiResponse<T>(meta가 필요한 목록 한정)
utils/apiClient.ts (envelope 단일 언래핑 지점)
  ↓ HTTP
apps/api
```

### `api.get<T>` 제네릭 사용 규칙

- `T`는 **언래핑된 데이터 타입**만 받는다. envelope 자체(`ApiResponse<...>`)를 제네릭으로 직접 넘기는 호출은 컴파일 시 차단된다(`packages/shared-types`가 envelope 사용 금지 가드를 노출).
- 페이지네이션이 필요한 목록 조회만 `ApiResponse<T>` 형태로 받아 `meta`까지 노출한다(아래 `fetchExamplesList` 패턴).

### 신규 도메인 추가 시 services 패턴

```ts
// src/services/users.ts
import type { User, UserListItem, CreateUserInput } from "@repo/shared-types";
import { api } from "@/utils/api";

const USERS_BASE = "/api/v1/users";

export async function fetchUsersList(): Promise<{ items: UserListItem[] }> {
  // 페이지네이션이 필요하면 envelope을 받아 meta까지 노출
  const response = await api.get<UserListItem[]>(USERS_BASE);
  return { items: response.data, meta: response.meta };
}

export async function fetchUser(id: string): Promise<User> {
  // 단건은 데이터 타입만 노출 — envelope은 ApiClient가 이미 벗긴다
  const response = await api.get<User>(`${USERS_BASE}/${id}`);
  return response.data;
}

export async function createUser(input: CreateUserInput): Promise<User> {
  const response = await api.post<User>(USERS_BASE, input);
  return response.data;
}
```

이후 `src/hooks/useUsers.ts`에서 `useApi(() => fetchUsersList())` / `useMutation((input) => createUser(input))` 형태로 래핑하고, 뷰는 `const { data, loading, error } = useUsersList()` 만 소비한다.

### ExamplesPage 패턴 요약

`src/view/examples/ExamplesPage.tsx`는 `useExamplesList`·`useCreateExample`·`useUpdateExample`·`useDeleteExample`만 사용하며, 토스트는 각 훅의 `error` 필드를 `useEffect`로 watching해 `ErrorHandler.formatToastMessage(error)`로 포맷한다. `fetch`·`useState<Example[]>`로 데이터를 직접 보관하지 않는다.

## 테스트 경로

- 단위: `tests/unit/**/*.test.{ts,tsx}` (Vitest + Testing Library)
- E2E: `tests/e2e/**/*.spec.ts` (Playwright)

### E2E 사전 기동 (examples CRUD)

`tests/e2e/examples.spec.ts`는 BE(4000) + DB(PostgreSQL)에 의존한다. 로컬 실행 전:

1. 루트에서 `npm run dev`로 web(3000) + api(4000)을 띄운다 (`playwright.config.ts`의 `webServer.reuseExistingServer`가 자동 reuse).
2. PostgreSQL이 가용해야 한다(`.env`의 `DATABASE_URL`). DB가 down이면 `/api/v1/examples`가 `INTERNAL_SERVER_ERROR`로 응답해 spec이 fail한다.
3. `cd apps/web && npx playwright test tests/e2e/examples.spec.ts --project=chromium`.

## 디렉터리별 규칙

- `src/components/` → 이 파일의 "공유 UI" 항목 참조. 승격 기준은 루트 [CLAUDE.local.md](../../CLAUDE.local.md).
