# packages/ui

shadcn/ui 호환 공유 UI 컴포넌트 라이브러리. `apps/web`·`apps/storybook`에서 import.

## 디렉터리 구조

```
src/
├── components/
│   ├── <ComponentName>/      # PascalCase 디렉터리
│   │   ├── index.tsx         # 컴포넌트 구현 (default export)
│   │   └── types.ts          # Props 타입 (named export)
│   ├── Navigation/           # 레이아웃 전용 그룹
│   │   ├── Header/
│   │   ├── Footer/
│   │   └── index.ts          # Navigation 배럴
│   ├── utils/cn.ts           # clsx + tailwind-merge
│   └── index.ts              # components 내부 배럴 (사용 제한적)
├── styles/
│   └── globals.css           # Tailwind CSS v4 @theme 변수 정의
└── index.ts                  # 전체 배럴 (공개 API)
```

## 규칙

- **컴포넌트 추가**: `npx shadcn add <component>` 또는 수동으로 `<Name>/` 디렉터리 생성.
- **배럴 export 필수**: 새 컴포넌트는 반드시 `src/index.ts`에 `export { default as <Name> } from "./components/<Name>"` 추가. 타입도 `export * from "./components/<Name>/types"` 추가.
- **default export**: 컴포넌트는 `export default`, 타입은 named export.
- **스타일**: 모든 색상·폰트·간격은 `globals.css`의 `@theme` 토큰 사용. 하드코딩 금지.
- **cn 유틸**: 조건부 클래스는 반드시 `cn()` 사용.
- **외부 의존**: React만 허용. `apps/*` import 절대 금지.

## Tailwind CSS v4

- 테마 변수는 `src/styles/globals.css`의 `@theme` 블록에만 정의.
- 토큰 추가 시 네이밍: `--color-<name>-<scale>`, `--font-family-<name>`, `--breakpoint-<name>`.
- 상세: [.claude/rules/tailwind-v4.md](../../.claude/rules/tailwind-v4.md).

## 테스트

- 각 컴포넌트 디렉터리에 `*.test.tsx` 필수.
- 경로: `tests/**/*.test.{ts,tsx}` (Vitest + Testing Library).
- 행동·접근성 테스트 중심. 스냅샷 남용 금지.

## Storybook

- 스토리는 `apps/storybook/stories/`에 작성. 이 패키지 내부에 스토리 파일 두지 않음.
