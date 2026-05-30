# apps/desktop

React 19 + Vite 7 + Tailwind CSS v4 기반 Electron 데스크톱 앱 (renderer dev port 3100).
electron-vite v5로 빌드하며, renderer는 [apps/web](../web)과 **동일한 환경**(같은 스택·공유 패키지·테스트·규칙)을 사용한다.

## 디렉터리 구조

```
src/
├── main/index.ts        # 메인 프로세스 (BrowserWindow 생성, 창 생명주기)
├── preload/index.ts     # 프리로드 (contextBridge로 window.desktop 노출)
└── renderer/
    ├── index.html       # renderer 진입 HTML
    ├── public/          # 정적 자산 (fonts·logo)
    └── src/             # apps/web과 동일한 React 앱
        ├── components/  # 앱 전용 컴포넌트 (재사용 가능하면 @repo/ui로 승격)
        ├── config/      # api.ts (API_CONFIG · API_ENDPOINTS)
        ├── hooks/       # useApi(조회) · useMutation(변경)
        ├── routes/      # createHashRouter 구성, ROUTES 상수
        ├── services/    # 도메인별 API 함수 (envelope 벗긴 데이터 반환)
        ├── types/       # 앱 로컬 타입 (공유 타입은 @repo/shared-types)
        ├── utils/       # ApiClient · api 싱글턴 · errorHandler
        └── view/        # 라우터에 마운트되는 페이지
tests/unit/              # Vitest + Testing Library 단위 테스트
electron.vite.config.ts  # main/preload/renderer 3영역 빌드 설정
```

빌드 산출물은 `out/{main,preload,renderer}` 에 생성된다(gitignore).

## Electron 특이사항 (apps/web과의 차이)

- **라우터**: `createHashRouter` 사용. 프로덕션은 `file://` 로 로드되므로 history API(`createBrowserRouter`)가 동작하지 않는다. (web은 BrowserRouter)
- **renderer 위치**: 앱 코드는 `src/renderer/src` 에 있다. `@/` 별칭은 이 디렉터리를 가리킨다.
- **메인/프리로드**: `src/main` 은 Node 환경(BrowserWindow·app), `src/preload` 는 contextBridge로 `window.desktop`(platform·versions)을 안전 노출한다(sandbox + contextIsolation).
- **로드 분기**: dev는 `process.env.ELECTRON_RENDERER_URL`(electron-vite dev server), 프로덕션은 `out/renderer/index.html` 을 `loadFile` 로 로드한다.
- **env**: `VITE_` 접두 변수만 renderer에 노출된다. API base는 루트 `.env` 의 `VITE_API_BASE_URL` 을 재사용한다.

## 규칙 (apps/web과 공통)

- **Import 경로**: 내부 모듈은 `@/` 별칭 필수. 상대 경로 `../` 금지. 같은 디렉터리 `./` 는 허용.
- **공유 UI**: `@repo/ui` 에서 import. `packages/ui/src/components/**` 직접 import 금지.
- **API 호출**: `ApiClient` 싱글턴(`@/utils/api`) 경유. 컴포넌트에서 `fetch` 직접 호출 금지. 조회는 `useApi`, 변경은 `useMutation`.
- **envelope 언래핑**: `ApiClient` 에서 단 한 번만 수행. 이후 계층(services·hooks·view)은 envelope을 직접 다루지 않는다.
- **Tailwind**: `@repo/ui/globals.css` 의 `@theme` 토큰만 사용. 임의 값(`bg-[#...]`) 금지.
- **신규 도메인 추가**: services → hooks → view 순서, [apps/web/CLAUDE.md](../web/CLAUDE.md)의 services 패턴을 그대로 따른다.

## 명령어

```bash
turbo run dev --filter=desktop        # electron-vite dev (Electron 창 기동)
turbo run build --filter=desktop      # main/preload/renderer 번들 → out/
turbo run lint --filter=desktop       # eslint --max-warnings 0
turbo run typecheck --filter=desktop  # tsc (node + web 설정)
turbo run test --filter=desktop       # vitest run
```

루트 `npm run dev` 실행 시 web·api·storybook과 함께 desktop도 기동된다.

## 테스트 경로

- 단위: `tests/unit/**/*.test.{ts,tsx}` (Vitest + Testing Library, jsdom)
- E2E(Playwright on Electron)는 현재 범위에 포함되지 않는다(후속).

## tsconfig 구성

- `tsconfig.node.json` — main·preload·설정 파일 (Node 환경)
- `tsconfig.web.json` — renderer·tests (`@/*` → `src/renderer/src/*`)
- `tsconfig.json` — 위 둘을 references로 묶는 solution 파일
