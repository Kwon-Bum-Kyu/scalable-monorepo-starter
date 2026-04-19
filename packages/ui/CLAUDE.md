# packages/ui

shadcn/ui 기반 3-tier 공유 UI 컴포넌트 라이브러리. `apps/web`·`apps/storybook`에서 import.

## 디렉터리 구조

```
src/
├── components/
│   └── ui/                   # 모든 컴포넌트 (L1·L2·L3 혼재)
│       ├── button.tsx        # L1: shadcn 원본
│       ├── typography.tsx    # L2: wrapper (PascalCase export)
│       ├── simple-select.tsx # L3: Simple 프리셋
│       └── ...
├── lib/
│   └── utils.ts              # cn (clsx + tailwind-merge)
├── hooks/                    # 공용 훅
├── styles/
│   └── globals.css           # Tailwind CSS v4 @theme 변수
└── index.ts                  # 공개 API 배럴 (유일한 진입점)
```

## 3-tier 컴포지션

| Tier   | 정의                                  | 예시                                                                                                                                                 | 명명                                                    |
| ------ | ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| **L1** | shadcn 원본 (CLI 설치 그대로)         | `Button`, `Input`, `Checkbox`, `RadioGroup`, `Select`, `Tabs`, `Pagination`, `Breadcrumb`, `Popover`, `Calendar`, `Slider`, `Label`, `Carousel`      | shadcn 규약 그대로 (kebab-case 파일, PascalCase export) |
| **L2** | 프로젝트 커스텀 wrapper (shadcn 조합) | `Typography`, `Grid`, `ButtonGroup`, `Radio`, `CheckboxField`, `DatePicker`, `FormSelect`, `Empty`, `Link`, `Logo`, `SystemIcon`, `Header`, `Footer` | PascalCase export, kebab-case 파일                      |
| **L3** | options 배열 기반 프리셋              | `SimpleRadio`, `SimpleCheckboxGroup`, `SimpleSelect`, `SimpleTabs`, `SimpleBreadcrumb`, `SimplePagination`                                           | `Simple` 접두사                                         |

**선택 가이드:**

- 재사용 형태가 고정된 단순 케이스 → L3 `Simple*`
- 피그마 variant 기반 커스텀이 필요한 경우 → L2 PascalCase
- shadcn 원본 그대로 합성해서 쓸 때 → L1

## 규칙

- **컴포넌트 추가 (L1):** `cd packages/ui && npx shadcn add <component>` → `src/components/ui/<name>.tsx` 생성 → `src/index.ts`에 re-export 추가.
- **컴포넌트 추가 (L2/L3):** `src/components/ui/<name>.tsx`에 직접 작성 → `src/index.ts`에 re-export 추가.
- **배럴 export 필수:** 컴포넌트·Props 타입 모두 `src/index.ts`에 export 해야 함 (Props는 `export type`).
- **스타일:** 색상·폰트·간격은 반드시 `globals.css`의 `@theme` 토큰 사용. 하드코딩 금지.
- **cn 유틸:** `src/lib/utils.ts`의 단일 출처. 다른 cn 구현 금지.
- **외부 의존:** `apps/*` import 절대 금지.

## Tailwind CSS v4

- 테마 변수는 `src/styles/globals.css`의 `@theme` 블록에만 정의.
- 토큰 네이밍: `--color-<name>-<scale>`, `--font-family-<name>`, `--breakpoint-<name>`.
- 상세: [.claude/rules/tailwind-v4.md](../../.claude/rules/tailwind-v4.md).

## 테스트

- 경로: `tests/**/*.test.{ts,tsx}` (Vitest + Testing Library).
- 컴포넌트당 2건 이상의 행동·접근성 테스트 필수.
- 스냅샷 남용 금지, 행동 중심 BDD 한국어 네이밍.

## Storybook

- 스토리는 `apps/storybook/stories/` 하위에 Tier별로 배치 (L1/L2/L3).
- 이 패키지 내부에 스토리 파일 두지 않음.
