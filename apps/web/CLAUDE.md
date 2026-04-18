# apps/web

React 19 + Vite 7 + Tailwind CSS v4 프런트엔드 (port 3000).

## 디렉터리 역할

| 디렉터리 | 역할 |
| --- | --- |
| `src/components/` | 앱 전용 컴포넌트 (재사용 가능하면 `@repo/ui`로 승격) |
| `src/config/` | `api.ts` — `API_CONFIG` (baseURL, timeout, retry), `API_ENDPOINTS` |
| `src/hooks/` | `useApi` (조회), `useMutation` (변경) — 공통 API 훅 |
| `src/routes/` | `createBrowserRouter` 구성, `ROUTES` 상수 |
| `src/types/` | 앱 로컬 타입 (`api.ts`, `user.ts` 등). FE/BE 공유 타입은 `@repo/shared-types` |
| `src/utils/` | `ApiClient` 클래스, `api` 싱글턴, `errorHandler` |
| `src/view/` | 라우터에 마운트되는 페이지 컴포넌트 |

## 규칙

- **Import 경로**: 내부 모듈은 `@/` 별칭 필수. 상대 경로 `../` 금지. 같은 디렉터리 `./`는 허용.
- **공유 UI**: `@repo/ui`에서 import. `packages/ui/src/components/**`를 직접 import 금지.
- **API 호출**: `ApiClient` 싱글턴(`src/utils/api.ts`) 경유. 컴포넌트에서 `fetch` 직접 호출 금지.
- **훅 선택**: 조회는 `useApi`, 생성/수정/삭제는 `useMutation`.
- **Tailwind**: `@repo/ui/globals.css`의 `@theme` 토큰만 사용. 임의 값(`bg-[#...]`) 금지.

## 테스트 경로

- 단위: `tests/unit/**/*.test.{ts,tsx}` (Vitest + Testing Library)
- E2E: `tests/e2e/**/*.spec.ts` (Playwright)

## 디렉터리별 규칙

- `src/components/` → 이 파일의 "공유 UI" 항목 참조. 승격 기준은 루트 [CLAUDE.local.md](../../CLAUDE.local.md).
