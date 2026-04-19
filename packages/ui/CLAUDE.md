# packages/ui

shadcn/ui 호환 공유 UI 컴포넌트 라이브러리. `apps/web`·`apps/storybook`에서 import.

## 디렉터리 구조

```
src/
├── components/
│   ├── <ComponentName>/      # PascalCase 공개 컴포넌트 (L1 래퍼)
│   │   ├── index.tsx         # 컴포넌트 구현 (default export)
│   │   └── types.ts          # Props 타입 (named export)
│   ├── ui/                   # shadcn 원시(primitive) — 비공개 레이어
│   │   ├── button.tsx        # kebab-case, shadcn CLI가 생성
│   │   └── ...               # src/index.ts에 노출 금지
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

## 공개 API 경계

`packages/ui`는 두 레이어로 구성된다.

| 레이어 | 위치 | 공개 여부 | 비고 |
| ---- | ---- | ---- | ---- |
| L0 — shadcn primitive | `src/components/ui/*.tsx` | 비공개 | kebab-case, shadcn CLI가 생성·수정. `apps/*`에서 직접 import 금지. |
| L1 — 프로젝트 래퍼 | `src/components/<PascalCase>/` | 공개 | L0을 조합·스타일링한 래퍼. `src/index.ts`에 반드시 배럴 등록. |

**왜 L0을 숨기는가:** shadcn primitive는 디자인 시스템에 맞춰 L1에서 재조합되는 빌딩 블록이다. L0를 직접 공개하면 앱마다 다른 스타일·Prop 조합이 확산되어 일관성이 깨진다. 새 컴포넌트가 필요하면 `npx shadcn add <name>`으로 L0을 추가한 뒤 반드시 L1 래퍼(`<PascalCase>/index.tsx`)를 만들고 `src/index.ts`에 배럴 export한다.

## 규칙

- **컴포넌트 추가**: `npx shadcn add <component>`로 L0 추가 → L1 래퍼(`<PascalCase>/`) 작성 → `src/index.ts`에 배럴 등록.
- **배럴 export 필수 (L1만)**: 새 L1 컴포넌트는 `src/index.ts`에 `export { default as <Name> } from "./components/<Name>"` 추가. 타입도 `export * from "./components/<Name>/types"` 추가. L0(`ui/*`)은 배럴에 노출하지 않는다.
- **default export**: L1 컴포넌트는 `export default`, 타입은 named export. L0는 shadcn 규약(named export)을 유지.
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
