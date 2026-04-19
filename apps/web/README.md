# KBK React TypeScript Template - Web App

이 프로젝트는 Turborepo 모노레포 구조 내의 Frontend 애플리케이션(`apps/web`)입니다.
Vite, React 19, TypeScript를 기반으로 하며, 공통 UI 라이브러리(`@repo/ui`)를 사용합니다.

## 🚀 주요 기능

- **React 19** & **Vite**: 최신 React 기능과 빠른 빌드 환경
- **Monorepo Integration**: `@repo/ui`, `@repo/shared-types` 패키지 활용
- **Tailwind CSS**: `@repo/ui`의 스타일 시스템을 상속받아 사용
- **React Router DOM**: 클라이언트 사이드 라우팅
- **Testing**: Vitest, React Testing Library (통합/E2E 테스트 중심)

## 📋 사전 요구사항

- Node.js (20 버전 이상 권장)
- npm (Workspaces 기능 사용)

## 🛠️ 개발 환경 시작

모노레포 루트에서 다음 명령어를 실행하여 개발 서버를 띄울 수 있습니다.

```bash
# 루트 디렉토리에서
npm install
npx turbo run dev --filter=web
```

또는 `apps/web` 디렉토리로 이동하여 실행할 수도 있습니다.

```bash
cd apps/web
npm run dev
```

서버는 기본적으로 `http://localhost:3000` (또는 Vite 설정에 따름)에서 실행됩니다.

## 🏗️ 프로젝트 구조

```
apps/web/
├── src/
│   ├── components/      # 앱 전용 컴포넌트 (Header, Footer, Layouts)
│   ├── routes/          # 라우팅 설정
│   ├── view/            # 페이지 컴포넌트
│   ├── hooks/           # 앱 전용 Custom Hooks
│   ├── services/        # API 통신 로직
│   ├── types/           # 앱 전용 타입 정의
│   ├── config/          # 환경 변수 및 설정
│   ├── utils/           # 유틸리티 함수
│   ├── App.tsx          # 메인 앱 컴포넌트
│   └── main.tsx         # 진입점 (UI CSS import 포함)
├── public/              # 정적 에셋
├── tests/               # 통합/E2E 테스트
└── vite.config.ts       # Vite 설정
```

## 🧩 컴포넌트 사용 가이드

### UI 컴포넌트 (`@repo/ui`)

버튼, 입력 필드 등 재사용 가능한 공통 UI 컴포넌트는 `packages/ui`에 정의되어 있으며, `@repo/ui` 패키지를 통해 import 합니다.

```tsx
import { Button, Typography } from "@repo/ui";

function MyComponent() {
  return (
    <div>
      <Typography variant="h1">Hello</Typography>
      <Button variant="primary">Click Me</Button>
    </div>
  );
}
```

### 스타일링

- **Tailwind CSS**: `src/index.css` 또는 `src/tailwind.css`에서 Tailwind 설정을 로드합니다.
- **UI 스타일**: `main.tsx`에서 `import "@repo/ui/styles.css";`를 통해 라이브러리 스타일을 불러옵니다.

## 🧪 테스트

앱 레벨의 테스트는 비즈니스 로직 검증과 페이지 통합 테스트에 집중합니다.

```bash
# 테스트 실행
npm run test
```

> **참고**: UI 컴포넌트의 단위 테스트와 Storybook은 `packages/ui` 패키지에서 관리됩니다.

## 🤝 기여하기

새로운 공통 UI 컴포넌트가 필요한 경우, `apps/web`에 직접 구현하지 말고 `packages/ui` 패키지에 추가한 뒤 버전을 업데이트하여 사용하세요.
