# apps/web

Turborepo 모노레포의 프런트엔드 애플리케이션이다. Vite 8, React 19, TypeScript를 쓰고 공유 UI 패키지 `@repo/ui`와 공유 타입 패키지 `@repo/shared-types`를 사용한다. 개발 서버 포트는 3000이다.

## 구성

- React 19 + Vite 8 (`@vitejs/plugin-react`, `@tailwindcss/vite`)
- 라우팅: `react-router-dom` (`src/routes/`)
- 스타일: Tailwind CSS v4. `src/index.css`가 `@repo/ui/globals.css`를 import하고, 디자인 토큰 값의 원천은 루트 `DESIGN.md`다
- 테스트: Vitest + Testing Library(단위), Playwright(E2E)

## 사전 요구사항

- Node.js 22.13 이상, npm 10 이상 (루트 `package.json`의 `engines`)
- 루트에서 `npm install`을 먼저 실행한다 (npm workspaces)

## 개발 서버

루트에서 실행하면 DB 부트스트랩과 함께 web·api·storybook·desktop이 같이 뜬다.

```bash
npm run dev
```

web만 띄우려면 다음 중 하나를 쓴다.

```bash
npx turbo run dev --filter=web
# 또는
cd apps/web && npm run dev
```

서버는 `http://localhost:3000`에서 열린다. API 주소와 엔드포인트는 `src/config/api.ts`에 있다.

## 프로젝트 구조

```
apps/web/
├── src/
│   ├── components/   # 앱 전용 컴포넌트 (layouts)
│   ├── config/       # API_CONFIG, API_ENDPOINTS
│   ├── hooks/        # useApi, useMutation 등 공통 훅
│   ├── routes/       # createBrowserRouter 구성, ROUTES 상수
│   ├── services/     # 도메인별 API 함수
│   ├── types/        # 앱 로컬 타입
│   ├── utils/        # ApiClient 싱글턴, errorHandler
│   ├── view/         # 라우터에 마운트되는 페이지 (Guide, examples, Error)
│   ├── index.css     # @repo/ui/globals.css import
│   └── main.tsx      # 진입점
├── public/           # 정적 에셋 (fonts 포함)
├── tests/
│   ├── unit/         # Vitest 단위 테스트
│   └── e2e/          # Playwright (examples, visual-regression)
└── vite.config.ts
```

## 규칙

- 내부 모듈 import는 `@/` 별칭을 쓴다. 상대 경로 `../`는 쓰지 않는다.
- 공유 UI는 `@repo/ui`에서 import한다. `packages/ui/src/components/**`를 직접 import하지 않는다.
- API 호출은 `ApiClient` 싱글턴을 거친다. 조회는 `useApi`, 생성·수정·삭제는 `useMutation`을 쓴다.
- 색·간격·글꼴은 `@theme` 토큰만 쓴다. 임의 값(`bg-[#...]`, `text-[14px]`)은 쓰지 않는다.
- 상세 규칙은 [CLAUDE.md](./CLAUDE.md)와 루트 `.claude/rules/`에 있다.

## 공유 UI 사용

```tsx
import { Button, Typography } from "@repo/ui";

function MyComponent() {
  return (
    <div>
      <Typography variant="h1">Hello</Typography>
      <Button>Click Me</Button>
      <Button variant="secondary">Cancel</Button>
    </div>
  );
}
```

새 공통 컴포넌트가 필요하면 `apps/web`에 두지 말고 `packages/ui`에 추가한 뒤 `packages/ui/src/index.ts`에서 re-export한다.

## 테스트

```bash
npm run test                              # Vitest 단위 테스트
npx playwright test --project=chromium    # E2E (DB·web·api 기동 필요)
```

시각 회귀 테스트(`tests/e2e/visual-regression.spec.ts`)는 선택 항목이다. 기준 스냅샷이 macOS 전용이라 CI에서는 실행하지 않으며, 실행·갱신 명령은 spec 상단 주석에 있다.
