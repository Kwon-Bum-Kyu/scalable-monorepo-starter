# 파일명 컨벤션

> scalable-monorepo-starter의 파일명은 **각 기술 생태계의 관례**를 따른다. 하나의 고정 케이스를 강제하지 않고, 파일의 성격(React 컴포넌트·훅·유틸·API 레이어·생성물)에 맞춘 표준을 사용한다.
>
> **이유:** 주니어는 업계 표준을 자연스럽게 학습하고, 시니어는 생태계 관례대로 바로 파악·구축할 수 있도록 한다. (스타터킷 핵심 목표: 2시간 세팅·1주 배포·모든 개발자 친화)

## 컨벤션 매트릭스

| 파일 성격                                | 케이스             | 예시                                       | 근거                                                  |
| ---------------------------------------- | ------------------ | ------------------------------------------ | ----------------------------------------------------- |
| React 컴포넌트 (`.tsx`)                  | **PascalCase**     | `Button.tsx`, `RootLayout.tsx`, `Error.tsx` | React 공식 문서, Vite/CRA/Next.js 템플릿 관례         |
| React 훅 (`.ts`)                         | **camelCase**      | `useApi.ts`, `useMutation.ts`              | React "Rules of Hooks" 관례 (`use*` 접두)             |
| 일반 유틸·모듈 (`.ts`)                   | **camelCase**      | `apiClient.ts`, `errorHandler.ts`          | JavaScript/TypeScript 표준 네이밍                     |
| API 레이어 (controllers/services/repositories/middlewares/schemas/errors) | **kebab-case** | `get-health-controller.ts`, `error-handler.ts`, `app-error.ts` | 프로젝트 내부 일관성 — Express 생태계는 단일 표준이 없어 케밥으로 고정 |
| shadcn/ui 생성 파일 (`packages/ui/src/components/ui/`) | **kebab-case** | `button.tsx`, `date-picker.tsx`            | shadcn CLI 기본 출력 — 리네임하지 않음                |
| 프레임워크 강제 파일                     | **해당 관례 그대로** | `main.tsx`, `vite-env.d.ts`, `*.config.ts`, `*.d.ts` | Vite·TypeScript 등 도구가 지정하는 이름               |
| 타입 전용 파일 (`packages/shared-types`) | **camelCase**      | `user.ts`, `api.ts`                        | 일반 TS 모듈 관례                                     |

## 세부 규칙

### React 컴포넌트 (PascalCase)

- 파일명과 default export 컴포넌트 이름은 일치시킨다.
- 컴포넌트 폴더 안의 하위 파일(스타일·테스트·유틸)은 각자 성격에 맞춘다.

```
// GOOD
components/Button.tsx           // export default Button
view/Error.tsx                  // export default Error
components/layouts/RootLayout.tsx

// BAD
components/button.tsx           // shadcn 생성물이 아닌 수동 작성 컴포넌트
view/error.tsx
components/layouts/rootLayout.tsx
```

### React 훅 (camelCase, `use` 접두)

```
// GOOD
hooks/useApi.ts
hooks/useMutation.ts

// BAD
hooks/use-api.ts
hooks/UseApi.ts
```

### 일반 유틸·모듈 (camelCase)

```
// GOOD
utils/apiClient.ts
utils/errorHandler.ts
config/api.ts

// BAD
utils/api-client.ts
utils/ApiClient.ts
```

### API 레이어 (kebab-case)

`apps/api/src/` 하위의 controllers·services·repositories·middlewares·schemas·errors는 모두 kebab-case.

```
// GOOD
controllers/health/get-health-controller.ts
services/system/get-system-info.ts
repositories/health/health.repository.ts
middlewares/error-handler.ts
errors/app-error.ts
schemas/system/system-info-query-schema.ts

// BAD (현 프로젝트 기준)
controllers/health/getHealthController.ts
errors/AppError.ts
```

**참고:** `*.repository.ts` 같은 닷(`.`) 구분 suffix는 허용 (NestJS 영향). 다만 프로젝트 내부에서 한 스타일을 선택했으면 일관되게 사용한다.

### shadcn/ui 생성 파일 (kebab-case, 리네임 금지)

`npx shadcn add` 로 생성된 `packages/ui/src/components/ui/*` 파일은 CLI 출력 그대로 유지한다.

```
// 유지 (변경 금지)
packages/ui/src/components/ui/button.tsx
packages/ui/src/components/ui/date-picker.tsx
packages/ui/src/components/ui/form-select.tsx
```

**이유:** shadcn 업데이트·신규 컴포넌트 추가 시 충돌 없이 그대로 수용하기 위함.

### 프레임워크 강제 파일 (관례 그대로)

도구·프레임워크가 파일명을 인식하는 경우 그 관례를 따른다.

```
// Vite / React
apps/web/src/App.tsx           // Vite 템플릿 기본
apps/web/src/main.tsx
apps/web/src/vite-env.d.ts

// 설정 파일
vite.config.ts
vitest.config.ts
eslint.config.ts
tsconfig.json

// 타입 선언
*.d.ts
```

## 디렉터리 이름

- 일반 디렉터리: **kebab-case** 또는 **camelCase** 중 워크스페이스 내부 기존 관례 유지
- React 컴포넌트를 담는 디렉터리: 컴포넌트 이름을 따르는 경우 PascalCase도 허용 (`components/UserProfile/index.tsx`)
- 현재 프로젝트 기본: kebab-case 및 단일어 소문자 (`components`, `hooks`, `controllers`, `health`, `system`)

## 체크리스트

새 파일 생성·코드 리뷰 시:

- [ ] `.tsx`이면서 default export가 React 컴포넌트인가? → PascalCase
- [ ] `use`로 시작하는 훅인가? → camelCase
- [ ] `apps/api/src/` 하위 레이어 파일인가? → kebab-case
- [ ] `packages/ui/src/components/ui/` 내부인가? → shadcn 생성물 그대로, 변경 금지
- [ ] 프레임워크가 인식하는 특수 파일인가? → 도구 관례 준수
- [ ] 그 외 `.ts` 파일인가? → camelCase

## 예외 처리 원칙

위 매트릭스에 없는 새로운 기술 스택을 도입할 때:

1. 해당 라이브러리·프레임워크의 **공식 문서/공식 템플릿**이 쓰는 파일명 관례를 따른다.
2. 공식 표준이 없으면 팀에서 합의 후 본 문서에 추가한다.
3. 개인 선호로 관례를 벗어나지 않는다.
