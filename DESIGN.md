---
name: scalable-monorepo-starter
description: Turborepo 모노레포의 단일 출처 디자인 토큰(packages/ui/src/styles/globals.css)과 shadcn/ui 기반 컴포넌트를 정리한 디자인 시스템 문서.
colors:
  # Brand · Blue 10단계
  blue-50: "#e1e9ef"
  blue-100: "#b5c8d6"
  blue-200: "#84a3bb"
  blue-300: "#527ea0"
  blue-400: "#2d638b"
  blue-500: "#084777"
  blue-600: "#07406f"
  blue-700: "#063764"
  blue-800: "#042f5a"
  blue-900: "#022047"
  # Neutral · Gray 10단계
  gray-50: "#e7e7e6"
  gray-100: "#c2c2c1"
  gray-200: "#9a9a98"
  gray-300: "#72726f"
  gray-400: "#535350"
  gray-500: "#353531"
  gray-600: "#30302c"
  gray-700: "#282825"
  gray-800: "#22221f"
  gray-900: "#161613"
  # System · 상태 색 5종
  system-red: "#c2050b"
  system-green: "#07b46f"
  system-warning: "#f9a80a"
  system-info: "#2196f3"
  system-white: "#ffffff"
  # 프로젝트 시맨틱 별칭 (globals.css @theme 선언 — 참고용, 실제 유틸리티 소비는 아래 shadcn 레이어 참조)
  text-primary: "#161613"
  text-secondary: "#535350"
  text-placeholder: "#9a9a98"
  border: "#c2c2c1"
  bg-primary: "#ffffff"
  bg-secondary: "#e7e7e6"
  interactive-default: "#084777"
  interactive-hover: "#07406f"
  interactive-active: "#042f5a"
  state-error: "#c2050b"
  state-success: "#07b46f"
  state-warning: "#f9a80a"
  state-info: "#2196f3"
  text-inverse: "#ffffff"
  bg-accent: "#e1e9ef"
  border-strong: "#72726f"
  focus-ring: "#084777"
  # shadcn 시맨틱 레이어 (:root, 라이트 기준값 — 실제 컴포넌트가 소비)
  background: "#ffffff"
  foreground: "#161613"
  card: "#ffffff"
  card-foreground: "#161613"
  popover: "#ffffff"
  popover-foreground: "#161613"
  primary: "#084777"
  primary-foreground: "#ffffff"
  secondary: "#e7e7e6"
  secondary-foreground: "#161613"
  muted: "#e7e7e6"
  muted-foreground: "#535350"
  accent: "#e1e9ef"
  accent-foreground: "#063764"
  destructive: "#c2050b"
  destructive-foreground: "#ffffff"
  input: "#c2c2c1"
  ring: "#084777"
typography:
  display:
    fontFamily: "'Roboto Mono', ui-monospace, monospace"
    fontSize: "56px"
    fontWeight: 700
    lineHeight: "72px"
  headline:
    fontFamily: "'Open Sans', ui-sans-serif, system-ui, sans-serif"
    fontSize: "40px"
    fontWeight: 700
    lineHeight: "56px"
  title:
    fontFamily: "'Open Sans', ui-sans-serif, system-ui, sans-serif"
    fontSize: "24px"
    fontWeight: 600
    lineHeight: "40px"
  body:
    fontFamily: "'Open Sans', ui-sans-serif, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "20px"
  label:
    fontFamily: "'Roboto Mono', ui-monospace, SFMono-Regular, monospace"
    fontSize: "12px"
    fontWeight: 700
    lineHeight: "16px"
rounded:
  none: "0"
  sm: "4px"
  md: "6px"
  lg: "8px"
  xl: "12px"
  "2xl": "24px"
  full: "9999px"
spacing:
  logo-h: "40px"
  header: "64px"
  page-x: "72px"
  "16": "64px"
  container-app: "1280px"
  container-content: "1280px"
  container-error-text: "480px"
  container-datepicker: "240px"
  container-logo: "160px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.lg}"
    padding: "8px 16px"
    height: "40px"
  button-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.secondary-foreground}"
    rounded: "{rounded.lg}"
    padding: "8px 16px"
    height: "40px"
  button-outline:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
    padding: "8px 16px"
    height: "40px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
    padding: "8px 16px"
    height: "40px"
  card-elev:
    backgroundColor: "{colors.card}"
    textColor: "{colors.card-foreground}"
    rounded: "{rounded.lg}"
    padding: "24px"
  card-flat:
    backgroundColor: "{colors.card}"
    textColor: "{colors.card-foreground}"
    rounded: "{rounded.lg}"
    padding: "24px"
  card-subtle:
    backgroundColor: "{colors.card}"
    textColor: "{colors.card-foreground}"
    rounded: "{rounded.lg}"
    padding: "24px"
  input-default:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
    padding: "8px 12px"
    height: "40px"
  dialog-content:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
    padding: "24px"
    width: "512px"
  badge-default:
    backgroundColor: "{colors.gray-50}"
    textColor: "{colors.gray-700}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
  badge-primary:
    backgroundColor: "{colors.blue-50}"
    textColor: "{colors.blue-700}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
  badge-success:
    backgroundColor: "{colors.system-green}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
  badge-destructive:
    backgroundColor: "{colors.destructive}"
    textColor: "{colors.destructive-foreground}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
---

# Design System: scalable-monorepo-starter

## Overview

**Creative North Star: "청사진 (The Blueprint)"**

이 시스템의 단일 출처는 `packages/ui/src/styles/globals.css`의 `@theme` 블록이다. 여기서 정의된 토큰이 `packages/ui/src/components/ui/`의 shadcn/ui 기반 컴포넌트 약 40종으로 흘러가고, 그 결과가 `apps/web/src/view/Guide.tsx`(및 `guide/sections/*`)에서 살아있는 카탈로그로 그대로 렌더링된다. 컴포넌트는 세 계층으로 조립된다 — L1(shadcn CLI 원본 그대로), L2(프로젝트 커스텀 wrapper), L3(`Simple*` 프리셋). 새 화면을 만들 때는 이 계층 중 어디에 놓일 컴포넌트인지부터 정한다.

성격은 편집적이지 않고 계기판적이다. 인터랙티브 액센트는 짙은 네이비 블루(blue-500, `#084777`) 하나뿐이고, 나머지는 살짝 웜톤이 도는 뉴트럴 그레이 스케일이 떠받친다. 서체는 본문용 Open Sans와, 라벨·강조·코드 성격 텍스트에만 쓰는 모노스페이스 Roboto Mono로 명확히 이원화된다. 색·폰트 크기·행간이 모두 10단계 스케일로 선언 순서까지 나란히 맞춰져 있어(`--color-blue-50…900`, `--font-size-xs…6xl`, `--line-height-16…72`), 무드보드보다는 사양서(spec sheet)에 가깝게 읽힌다.

깊이감은 완전히 평면적이지는 않지만 절제되어 있다 — shadow는 0~4 5단계뿐이고 표면 위계(card=2, popover/select/tooltip=3, dialog/sheet=4)에 엄격히 매핑된다. 코너는 부드럽지만 둥글둥글하지 않다(기준 radius 0.5rem/8px). 확인된 시각적 배제 사항: 임의의 색·픽셀 값(`bg-[#...]`, `text-[14px]`)을 쓰는 유기적·에디토리얼 스타일은 이 시스템의 반례다 — 모든 값은 `@theme` 토큰으로 환원되어야 한다.

**Key Characteristics:**
- 단일 브랜드 액센트(blue-500)와 웜 뉴트럴 그레이 10단계
- Open Sans(본문) / Roboto Mono(라벨·디스플레이·코드)의 이원 서체 체계
- 색·폰트 크기·행간이 모두 10단계로 페어링되는 "짝맞춤 스케일"
- shadow 5단계(0~4)를 표면 위계에 role-bound로만 사용
- 부모 radius ≤ 자식 radius가 되지 않도록, 중첩 시 자식 radius를 한 단계 좁힘
- L1(shadcn 원본)/L2(커스텀 wrapper)/L3(Simple 프리셋) 3계층 컴포넌트 조립

## Colors

팔레트는 단일 블루 액센트 + 웜 그레이 스케일 + 5종 시스템 색으로 구성되며, 전량 `packages/ui/src/styles/globals.css`의 `@theme`/`:root`/`.dark`에서 나온다.

### Primary
- **Blue 500** (`#084777`): `interactive-default` / shadcn `primary`. 기본 버튼·링크·포커스 링에 쓰는 유일한 브랜드 액센트.
- **Blue 50 / Blue 700** (`#e1e9ef` / `#063764`): `accent` / `accent-foreground` 조합. 배지·강조 배경에 쓰는 짝.
- **Blue 400** (`#2d638b`): 다크 모드에서 `primary`가 바뀌는 값(`.dark --primary`).

### Neutral
- **Gray 900** (`#161613`): `text-primary` / shadcn `foreground`. 기본 본문·헤딩 텍스트.
- **Gray 400** (`#535350`): `text-secondary` / `muted-foreground`. 보조 설명 텍스트.
- **Gray 200** (`#9a9a98`): `text-placeholder`.
- **Gray 100** (`#c2c2c1`): `border` / shadcn `input`. 기본 테두리 색.
- **Gray 50** (`#e7e7e6`): `bg-secondary` / shadcn `secondary` / `muted`. 은은한 표면 배경.
- **System White** (`#ffffff`): `bg-primary` / shadcn `background` / `card` / `primary-foreground`.

### System (상태 색)
- **System Red** (`#c2050b`): `state-error` / shadcn `destructive`.
- **System Green** (`#07b46f`): `state-success`.
- **System Warning** (`#f9a80a`): `state-warning`.
- **System Info** (`#2196f3`): `state-info`.

### Named Rules

**The One Accent Rule.** 인터랙티브 기본색은 blue-500 하나뿐이다. blue-50~900의 나머지 단계는 그 액센트 하나를 위한 배경·테두리·호버 변주이며, 두 번째 브랜드 컬러를 만들지 않는다.

**The Light-Blue Body Text Ban.** blue-200(`#84a3bb`)은 옅은 배경 위 본문 텍스트로 쓰지 않는다 — 흰색 대비 2.65:1, gray-50 대비 2.47:1로 WCAG AA(4.5:1) 미달이다. 아이콘 스트로크나 비강조 보더로만 쓴다. (근거: `packages/ui/CLAUDE.md` NFR-3)

**The Two-Layer Alias Rule.** 색 별칭은 두 겹으로 존재한다 — ① 프로젝트 시맨틱 별칭(`--color-text-primary` 등, `@theme`에 선언은 되어 있으나 현재 어떤 컴포넌트도 `text-text-primary` 같은 Tailwind 유틸리티로 직접 소비하지 않는다), ② shadcn 시맨틱 레이어(`--primary`, `--background` 등, `:root`/`.dark`에 선언되고 버튼·카드·인풋·다이얼로그가 실제로 소비한다). 새 컴포넌트를 만들 때는 ②(shadcn 레이어)를 1순위로 쓴다 — 다크 모드 전환과 실제로 연결되는 레이어이기 때문이다.

## Typography

**Display Font:** `'Roboto Mono', ui-monospace, monospace` (`--font-family-display`)
**Body Font:** `'Open Sans', ui-sans-serif, system-ui, sans-serif` (`--font-family-sans`, 자체 호스팅 12 face, `apps/web/public/fonts/`)
**Label/Mono Font:** `'Roboto Mono', ui-monospace, SFMono-Regular, monospace` (`--font-family-mono`)
**보조 본문 Font:** `'PT Sans', 'Open Sans', sans-serif` (`--font-family-body-alt`) — "긴 본문이나 기사 톤 콘텐츠"용으로 문서화된 보조 패밀리(Guide 원문 설명 그대로).

**Character:** 본문은 Open Sans의 인문적인 산세리프로 읽히고, 라벨·디스플레이·코드 성격 텍스트는 Roboto Mono로 전환되어 "본문 대 계기판 표기"를 서체 자체로 분리한다.

### Hierarchy
- **Display** (700, 56px, line-height 72px): 최상위 노출용 스케일 상단값. 코드베이스에 구체적인 사용 컴포넌트는 아직 없고 `text-6xl` 스케일 정의로만 존재한다.
- **Headline** (700, 40px, line-height 56px): 섹션 대제목급.
- **Title** (600, 24px, line-height 40px — 페어드 스케일 기준값): `CardTitle`이 실제로 24px/600을 쓰지만, line-height는 `leading-none`(1)을 써서 이 페어링을 따르지 않는다. `DialogTitle`은 18px/600/leading-none.
- **Body** (400, 14px, line-height 20px): `CardDescription`/`DialogDescription`이 쓰는 `text-sm text-muted-foreground` 그대로.
- **Label** (700, 12px, line-height 16px, Roboto Mono): 테이블 헤더·eyebrow 텍스트(대문자 + 자간). Badge는 같은 12px에서 600(semibold)·Open Sans로 변주한다.

### Named Rules

**The Paired Scale Rule.** font-size 10단계와 line-height 10단계는 globals.css 선언 순서로 1:1 대응한다 — xs↔16, sm↔20, base↔24, lg↔28, xl↔32, 2xl↔40, 3xl↔48, 4xl↔56, 5xl↔64, 6xl↔72. 새 텍스트 스타일은 이 페어를 기본값으로 삼고, `leading-none` 등으로 이탈할 때는 의도적 예외로 취급한다.

## Layout

그리드는 Mobile 4열 / Tablet 8열 / Desktop 12열이며, 각 구간의 마진·거터가 `apps/web/src/view/guide/nav-data.ts`의 `BREAKPOINTS`에 명시되어 있다.

| 구간 | 너비 | 컬럼 | 마진 | 거터 |
| ---- | ---- | ---- | ---- | ---- |
| Mobile | < 768px | 4 | 16px | 16px |
| Tablet | 768–1279px | 8 | 32px | 16px |
| Desktop | ≥ 1280px | 12 | 72px | 16px |

페이지 컨테이너는 `max-w-app`(`--container-app: 1280px`)을 공통 폭으로 쓰고, 좌우 여백은 `px-page-x`(`--spacing-page-x: 72px`)로 고정한다(`RootLayout.tsx`: `mx-auto w-full max-w-app px-page-x`). 헤더 높이는 `min-h-header`(`--spacing-header: 64px`). 4px 베이스의 전체 스페이싱 스케일(`p-1=4px` … `p-20=80px`)은 Tailwind v4 표준 자동 유틸리티에 의존하며, 이 값들을 위한 별도 토큰은 추가하지 않는다(FR-10, `packages/ui/CLAUDE.md`).

브레이크포인트 토큰은 `--breakpoint-mobile`(640px) / `--breakpoint-tablet`(768px) / `--breakpoint-desktop`(1280px) / `--breakpoint-wide`(1920px) 4단계다. 위 그리드 표의 컷오프(768px, 1280px)는 tablet·desktop 토큰과 일치하지만, 그리드 표가 말하는 "Mobile < 768px"의 하한은 `--breakpoint-mobile` 토큰값(640px)과 서술이 갈린다 — 발견된 사실이며 본 문서에서 임의로 통일하지 않는다.

## Elevation & Depth

완전한 플랫은 아니다. shadow는 0~4 5단계뿐이고, 표면 위계에 역할 기반(role-bound)으로 엄격히 매핑된다. 그림자는 장식이 아니라 "이 표면이 어떤 레이어에 떠 있는가"를 알려주는 신호다.

### Shadow Vocabulary
- **Level 0 · subtle** (`box-shadow: 0 1px 2px 0 rgba(22,22,19,0.04)`, `--shadow-0-subtle`): 같은 평면 위 미세한 아웃라인 대체.
- **Level 1 · subtle** (`0 1px 2px 0 rgba(22,22,19,0.05), 0 1px 3px 0 rgba(181,200,214,0.4)`, `--shadow-1-subtle`): 탭 활성 pill, 캘린더 드롭다운.
- **Level 2 · default** (`0 2px 4px -1px rgba(22,22,19,0.06), 0 4px 8px -2px rgba(181,200,214,0.4)`, `--shadow-2-default`): 카드 기본 표면.
- **Level 3 · raised** (`0 4px 6px -1px rgba(22,22,19,0.08), 0 10px 20px -4px rgba(181,200,214,0.7)`, `--shadow-3-raised`): 팝오버·셀렉트·툴팁처럼 사용자 조작으로 떠오르는 표면.
- **Level 4 · overlay** (`0 8px 12px -2px rgba(22,22,19,0.1), 0 20px 36px -8px rgba(225,233,239,0.75)`, `--shadow-4-overlay`): Dialog/Sheet 같은 최상위 오버레이.

### Named Rules

**The Child ≤ Parent Elevation Rule.** 중첩된 표면은 부모보다 높은 레벨을 쓸 수 없다 — 팝오버 안에 뜬 셀렉트는 팝오버와 같거나 더 낮은 레벨만 허용한다. (근거: `packages/ui/CLAUDE.md` FR-8)

**The No Default Tailwind Shadow Rule.** `shadow-sm`/`shadow-md` 같은 Tailwind 기본 그림자 유틸리티는 쓰지 않는다. 반드시 `shadow-0-subtle`~`shadow-4-overlay` 5단계 커스텀 토큰만 쓴다.

## Shapes

코너는 부드럽지만 둥글지 않다. 기준 radius는 `--radius: 0.5rem`(8px)이고, 나머지 단계는 여기서 `calc()`로 파생된다: `--radius-sm`(4px) / `--radius-md`(6px) / `--radius-lg`(8px, 기준값) / `--radius-xl`(12px). `--radius-2xl`(24px)과 `--radius-full`(9999px)은 `calc()`가 아닌 고정값이다.

- **컨테이너급** 요소(버튼 전 사이즈, input, select trigger/content, popover content, calendar, tabs 세그먼트 컨테이너)는 `rounded-lg`(8px) 또는 `rounded-md`(6px)를 쓴다.
- **중첩 요소**(select item, checkbox, tabs underline trigger)는 한 단계 좁은 `rounded-sm`(4px)를 쓴다.
- **pill 형태**(badge 기본, tabs pill trigger)는 `rounded-full`(9999px)을 쓴다.

### Named Rules

**The Child Radius ≤ Parent Radius Rule.** 중첩 컴포넌트의 radius는 부모의 radius 이하여야 코너가 자연스럽게 겹친다. (근거: `packages/ui/CLAUDE.md` FR-7 — 다만 그 문서가 명시한 기준값 `0.75rem`(12px)은 실제 `globals.css`의 `0.5rem`(8px)과 다르다. 본 DESIGN.md는 `globals.css` 실측값을 채택했다.)

## Components

컴포넌트는 L1(shadcn 원본 그대로)/L2(프로젝트 커스텀 wrapper)/L3(`Simple*` 프리셋) 3계층으로 조립된다. 아래는 대표 컴포넌트의 실제 토큰 조합이다.

### Buttons
- **Shape:** `rounded-lg`(8px), 전 사이즈 동일 radius. 높이는 sm 32px(`h-8`) / default 40px(`h-10`) / lg 44px(`h-11`) / icon 40×40px.
- **Primary:** `bg-primary`(`#084777`) / `text-primary-foreground`(`#ffffff`), 패딩 8px 16px(default 기준).
- **Secondary:** `bg-secondary`(`#e7e7e6`) / `text-secondary-foreground`(`#161613`).
- **Outline:** `border-input`(`#c2c2c1`) + `bg-background`(`#ffffff`), hover 시 `bg-accent`(`#e1e9ef`)/`text-accent-foreground`(`#063764`)로 전환.
- **Ghost:** 배경 없음, hover 시에만 `bg-accent`/`text-accent-foreground`가 나타난다.
- **Destructive:** `bg-destructive`(`#c2050b`)/`text-destructive-foreground`(`#ffffff`).
- **Link:** 배경 없음, `text-primary`(`#084777`) + `underline-offset-4`, hover 시 밑줄만 나타난다.
- **Hover/Focus:** hover는 대부분 같은 배경색의 90%/80% 불투명도(`hover:bg-primary/90`, `hover:bg-secondary/80`)로 표현하고 새 색을 만들지 않는다. `focus-visible`은 `ring-2 ring-ring`(`#084777`) + `ring-offset-2`로 통일.
- **발견 사항:** 버튼 텍스트는 `font-medium`(500)을 쓰는데, 이는 프로젝트의 3단계 굵기 토큰(regular 400 / semibold 600 / bold 700)에 없는 값이다.

### Badges
- **Style:** 기본 `rounded-full`(pill), `shape="sq"`일 때만 `rounded-sm`(4px). 텍스트는 12px/600(semibold).
- **Variants:** default(`gray-50` 배경/`gray-700` 텍스트), primary(`blue-50`/`blue-700`), secondary(shadcn `secondary` 별칭), success(`system-green` 배경/흰 텍스트), warn(`system-warning`의 15% 배경/`gray-900` 텍스트), destructive·error(`destructive` 별칭), outline(테두리만).
- **Dot:** 좌측에 `h-1.5 w-1.5 rounded-full bg-current` 점을 옵션으로 붙일 수 있다.

### Cards
- **Corner Style:** `rounded-lg`(8px), 변형과 무관하게 동일.
- **Background:** `bg-card`(`#ffffff`) / `text-card-foreground`(`#161613`).
- **Shadow Strategy:** `elev`(기본값, `shadow-2-default`) / `flat`(그림자 없음, 테두리만) / `subtle`(`shadow-0-subtle` + 테두리). Elevation & Depth 섹션 참조.
- **Border:** `flat`·`subtle` 변형만 `border-border`(`#c2c2c1`)를 두르고, `elev`는 투명 테두리.
- **Internal Padding:** Header/Content/Footer 모두 24px(`p-6`), Content는 상단 패딩만 0으로 겹침을 방지(`pt-0`).

### Inputs
- **Style:** `border-input`(`#c2c2c1`) + `bg-background`(`#ffffff`), `rounded-lg`(8px), 높이 40px, 텍스트 16px(base) — `md` 이상 화면에서는 14px(sm)로 줄어든다.
- **Focus:** `ring-2 ring-ring`(`#084777`) + `ring-offset-2`, 기본 outline은 제거.
- **Disabled:** 불투명도 50%, `cursor-not-allowed`.
- **Placeholder:** `text-muted-foreground`(`#535350`).

### Navigation (Header)
- **Style:** `border-b border-border`(`#c2c2c1`) + `bg-background`, 내부 컨테이너는 `max-w-app`(1280px) + `px-page-x`(72px), 높이 `min-h-header`(64px).
- **Link 상태:** 기본 `text-muted-foreground`(`#535350`), hover 시 `text-foreground`(`#161613`)로 전환만 하고 새 색을 더하지 않는다.
- **Mobile:** `md` 미만에서 nav/actions를 숨기고 40×40px 햄버거 버튼(`rounded-md`)으로 대체하며, 펼치면 `border-t` 구분선을 가진 세로 메뉴가 나타난다.

### Dialog (Signature Component)
- **Style:** 화면 중앙 고정(`fixed`, `translate(-50%, -50%)`), `max-w-lg`(512px), `bg-background` + `p-6`(24px), `sm` 이상에서 `rounded-lg`, `shadow-4-overlay`.
- **Overlay:** `bg-gray-900/50`(gray-900의 50% 불투명도)로 전체 화면을 덮는다.
- **Title/Description:** Title은 18px/`font-semibold`(600)/`leading-none`/`tracking-tight`, Description은 14px/`text-muted-foreground`.
- **Close 버튼:** 우상단 absolute 배치, 기본 불투명도 70% → hover 100%, focus 시 `ring-2 ring-ring`.

## Do's and Don'ts

### Do:
- **Do** 모든 색·간격·폰트·라운드·그림자를 `packages/ui/src/styles/globals.css`의 `@theme` 토큰과 `:root`/`.dark` 시맨틱 변수에서만 가져온다. (`.claude/rules/tailwind-v4.md`)
- **Do** 새 컴포넌트는 shadcn 시맨틱 레이어(`bg-primary`, `bg-secondary`, `bg-accent`, `text-foreground` 등)를 1순위로 쓴다 — 다크 모드 전환(`.dark` 블록)과 실제로 연결되는 레이어다.
- **Do** 그림자는 표면 위계(card=2, popover/select/tooltip=3, dialog/sheet=4)에 맞는 정확한 레벨만 쓴다.
- **Do** 중첩 컴포넌트의 radius는 부모 radius 이하로 한 단계 좁힌다(예: `rounded-md` 팝오버 안의 아이템은 `rounded-sm`).
- **Do** 강조·라벨·코드성 텍스트에는 Roboto Mono(`--font-family-mono`/`--font-family-display`)를, 본문에는 Open Sans를 쓴다.

### Don't:
- **Don't** `bg-[#hex]`, `text-[14px]` 같은 임의 값을 쓰지 않는다 — 필요한 값이 없으면 `@theme`에 토큰을 먼저 추가한다. (`.claude/rules/tailwind-v4.md`)
- **Don't** blue-200(`#84a3bb`)을 옅은 배경 위 본문 텍스트로 쓰지 않는다 — WCAG AA 대비 기준(4.5:1)에 미달한다.
- **Don't** `shadow-sm`/`shadow-md` 같은 Tailwind 기본 그림자 유틸리티를 쓰지 않는다 — 반드시 `shadow-0-subtle`~`shadow-4-overlay` 5단계만 쓴다.
- **Don't** `packages/ui/src/components/ui/` 안의 shadcn 생성 파일명을 리네임하지 않는다 — CLI 산출물을 그대로 유지해야 이후 업데이트와 충돌하지 않는다.
- **Don't** 프로젝트 시맨틱 별칭(`--color-text-primary` 등)을 곧바로 `text-text-primary` 같은 새 Tailwind 클래스로 시도하지 않는다 — 현재 어떤 컴포넌트도 이 형태로 소비하지 않으며, 실제로는 shadcn 레이어가 쓰인다.
