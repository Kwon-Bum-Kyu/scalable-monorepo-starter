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

### spacing 정책 (FR-10)

- **의미적 별칭만 정의**: `--spacing-page-x`(72px), `--spacing-header`(64px), `--spacing-logo-h`(40px), `--spacing-16`(64px, header content alias) — 페이지 레이아웃·콘텐츠 영역에서 반복 사용되는 의미 있는 값만 토큰화한다.
- **4px-base 풀세트는 Tailwind 표준에 의존**: `p-1=4px`, `p-2=8px`, ..., `p-20=80px`, `p-32=128px` 등은 Tailwind v4 가 자동 생성한다. `--spacing-1`~`--spacing-32` 같은 풀세트 토큰을 추가로 정의하지 않는다.
- **`--spacing-80` 같은 숫자 별칭 추가 금지**: 자동 utility 와 의미가 중복되며, 의미적 토큰의 가독성을 떨어뜨린다 (FR-10 deprecate).

### 색상 사용 가이드 (NFR-3 / WCAG AA)

- **`blue-200` (`#84a3bb`)는 옅은 배경 본문 텍스트로 사용 금지** — white(2.65:1) / gray-50(2.47:1) 모두 WCAG AA(4.5:1) 미달. 어두운 배경(gray-900: 6.71:1) 또는 보조 시각 요소(아이콘 stroke, 비강조 border)로만 사용.
- **focus-ring(`--color-focus-ring` = `blue-500` `#084777`)** 은 white 9.64:1 / blue-50 7.85:1 모두 AAA 충족 — 포커스 강조에 안전.
- **본문 텍스트 권장**: `gray-900`(white 16:1+ AAA), `gray-700` 이상. `gray-500` 미만은 옅은 배경 본문 텍스트로 사용 금지.

### radius 비례 원칙 (FR-7)

기준값 `--radius: 0.75rem`(12px). 컴포넌트 중첩 시 다음 비례를 따른다:

- **컨테이너 레벨**: `rounded-md`(10px) — input, select trigger·content, popover content, tabs list, calendar, button(default·sm·lg)
- **nested 요소**: `rounded-sm`(8px) — select item, tabs trigger, checkbox(4×4), 작은 inline 요소
- **range edge** (calendar 등): `rounded-l-md`/`rounded-r-md`로 컨테이너 곡률과 일치
- **명세 외 변형**: `--radius-none`(0), `--radius-xl`(16px), `--radius-2xl`(24px) — 의도된 강조 표현에만 사용

원칙: **자식 요소 radius ≤ 부모 요소 radius**. 그래야 corner blending이 자연스럽다.

### elevation 위계 매핑 (FR-8)

shadow 토큰은 4단계 위계로 정의된다(`globals.css` `@theme`). 각 컴포넌트는 의도된 표면 위계에 따라 정확한 토큰만 사용한다.

| 토큰 | utility | 위계 | 용도 |
| ---- | ------- | ---- | ---- |
| `--shadow-1-subtle` | `shadow-1-subtle` | 1 (subtle) | 같은 평면 내 미세 강조 — `tabs trigger active`, `calendar dropdown_root` |
| `--shadow-2-default` | `shadow-2-default` | 2 (default) | 컨텐츠 그룹화 default surface — `card` |
| `--shadow-3-raised` | `shadow-3-raised` | 3 (raised) | 사용자 트리거로 띄워지는 raised surface — `popover content`, `select content`, `tooltip content` |
| `--shadow-4-overlay` | `shadow-4-overlay` | 4 (overlay) | 최상위 overlay — Dialog/Sheet/Drawer (해당 컴포넌트 추가 시 적용) |

**원칙:**
- **자식 위계 ≤ 부모 위계** — popover 안에 떠 있는 select은 부모(popover)와 같은 raised 또는 더 약한 위계만 허용.
- **외부 override 가능**: `<Card className="shadow-3-raised">` 같이 호출부에서 위계 변경 가능 (Tailwind 우선순위로 자연 동작).
- **하드코딩 금지**: `shadow-md`/`shadow-sm`/`shadow-xs` 등 Tailwind 기본 토큰 직접 사용 금지 — 4단계 토큰만 사용.

## 테스트

- 경로: `tests/**/*.test.{ts,tsx}` (Vitest + Testing Library).
- 컴포넌트당 2건 이상의 행동·접근성 테스트 필수.
- 스냅샷 남용 금지, 행동 중심 BDD 한국어 네이밍.

## Storybook

- 스토리는 `apps/storybook/stories/` 하위에 Tier별로 배치 (L1/L2/L3).
- 이 패키지 내부에 스토리 파일 두지 않음.
