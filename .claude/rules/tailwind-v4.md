# Tailwind CSS v4 규칙

> scalable-monorepo-starter는 Tailwind CSS v4를 사용한다. v3와 설정 방식이 다르므로 주의.

## 테마 변수 정의 위치

디자인 토큰 값의 원천은 루트 `DESIGN.md`(frontmatter와 정규 섹션 토큰 표)다. `packages/ui/src/styles/globals.css`의 `@theme` 블록은 그 값을 CSS 변수로 구현하며, 코드는 `@theme` 토큰만 소비한다. 둘의 일치는 `packages/ui/tests/tokens/design-md-sync.test.ts`가 검증한다.
`/impeccable document`를 코드 스캔 모드로 실행해 DESIGN.md를 다시 생성하거나 덮어쓰지 않는다 — 원천 방향이 뒤집힌다. 필요하면 `.impeccable/design.json`만 갱신한다.

```css
/* packages/ui/src/styles/globals.css */
@import "tailwindcss";

@theme {
  --font-sans: "Open Sans", ui-sans-serif, system-ui, sans-serif;

  --color-blue-500: #3b82f6;
  --color-gray-900: #111827;

  --breakpoint-mobile: 640px;
  --breakpoint-tablet: 768px;
  --breakpoint-desktop: 1280px;
}
```

**토큰 네이밍 규칙:**
- 색상: `--color-<name>-<scale>` (예: `--color-blue-500`)
- 폰트: `--font-<name>` (예: `--font-sans`)
- 글자 크기: `--text-<k>`. 짝 행간은 하위 키 `--text-<k>--line-height` (예: `--text-sm`, `--text-sm--line-height`)
- 브레이크포인트: `--breakpoint-<name>` (예: `--breakpoint-desktop`)

## 네임스페이스 → utility 매핑 (필수 준수)

Tailwind v4는 `@theme` 토큰의 **네임스페이스 prefix** 로 utility 클래스를 자동 생성한다. 잘못된 prefix를 쓰면 토큰이 정의되어 있어도 utility가 만들어지지 않아 클래스가 무효화된다 (R10. Header Token Gap이 이 누락으로 발생).

| 네임스페이스          | 자동 생성되는 utility                                                                       | 예시                                                          |
| --------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| `--color-*`           | `bg-*`, `text-*`, `border-*`, `ring-*`, `outline-*`, `divide-*`, `from-*`/`via-*`/`to-*`    | `--color-blue-500` → `bg-blue-500`                            |
| `--spacing-*`         | `p-*`, `m-*`, `w-*`, `h-*`, `min-w-*`, `min-h-*`, `max-w-*`, `max-h-*`, `gap-*`, `inset-*`  | `--spacing-page-x: 72px` → `px-page-x` / `--spacing-header: 64px` → `min-h-header` |
| `--container-*`       | `max-w-*`, `@container` 컨테이너 쿼리 변형                                                   | `--container-app: 1280px` → `max-w-app`                       |
| `--font-*`            | `font-*` (글꼴)                                                                             | `--font-sans` → `font-sans`                                   |
| `--text-*`            | `text-*` (크기). 하위 키 `--text-*--line-height`가 같은 클래스의 기본 행간                  | `--text-xl: 20px` + `--text-xl--line-height: 32px` → `text-xl` |
| `--leading-*`         | `leading-*` (행간 단독 지정)                                                                | `--leading-tight: 1.25` → `leading-tight` (Tailwind 기본 키)  |
| `--font-weight-*`     | `font-*` (굵기)                                                                             | `--font-weight-medium: 500` → `font-medium`                  |
| `--tracking-*`        | `tracking-*` (자간)                                                                         | `--tracking-label: 0.06em` → `tracking-label`                |
| `--breakpoint-*`      | 반응형 변형 prefix                                                                          | `--breakpoint-desktop: 1280px` → `desktop:flex`               |
| `--radius-*`          | `rounded-*`                                                                                 | `--radius-lg` → `rounded-lg`                                  |
| `--shadow-*`          | `shadow-*`                                                                                  | `--shadow-md` → `shadow-md`                                   |

**금지 — 정의해도 utility가 생성되지 않는 prefix:**
- `--size-*` ❌ (Tailwind v4 표준 namespace 아님 → orphan 토큰이 됨)
- 임의로 만든 `--token-*`, `--design-*` 등 ❌
- `--font-family-*`, `--font-size-*`, `--line-height-*` (Tailwind v3식 이름. v4는 읽지 않아 `font-*`·`text-*`·`leading-*`에 반영되지 않는다. `--font-*`, `--text-*`, `--text-*--line-height`를 쓴다)
- 숫자 이름 `--leading-<숫자>` (예: `--leading-32`). 선언한 숫자만 `var()`로 바뀌고 선언하지 않은 `leading-<n>`은 `calc(var(--spacing) * n)` 그대로라 같은 계열이 두 의미로 섞인다. 짝 행간은 `--text-<k>--line-height`로 둔다

**올바른 패턴:**

```css
/* GOOD — utility 자동 생성 */
@theme {
  --spacing-header: 64px;       /* → min-h-header, h-header, p-header 등 */
  --spacing-page-x: 72px;       /* → px-page-x, mx-page-x 등 */
  --container-app: 1280px;      /* → max-w-app */
  --container-content: 1280px;  /* → max-w-content */
}
```

```css
/* BAD — utility 생성 안 됨, var(...) 호출이나 arbitrary value로만 사용 가능 */
@theme {
  --size-header-min-h: 88px;    /* min-h-header-min-h 클래스 생성 안 됨 */
  --size-logo-h: 40px;          /* h-logo-h 클래스 생성 안 됨 */
}
```

**검증 방법:**
- 새 토큰 추가 시 의도한 utility 클래스(`min-h-header`, `px-page-x` 등)를 컴포넌트에 적용 후 빌드 결과 CSS에서 매핑 컴파일을 확인한다.
- 클래스가 무효화되면 십중팔구 namespace prefix가 잘못된 것 — `--spacing-*` / `--container-*` 표준으로 이주.

## CSS Import 방식

```typescript
// apps/storybook/.storybook/preview.ts
import "@repo/ui/globals.css";
```

```css
/* apps/web/src/index.css 또는 tailwind.css */
@import "@repo/ui/globals.css";
```

`packages/ui/package.json`의 `exports` 필드에 `"./globals.css"` 경로가 등록되어 있어야 한다.

## v3와의 주요 차이점

| 항목              | v3 방식                               | v4 방식                            |
| ----------------- | ------------------------------------- | ---------------------------------- |
| 설정 파일         | `tailwind.config.js`                  | `globals.css` 내 `@theme`          |
| 테마 커스터마이징 | JS 객체                               | CSS 변수 (`--color-*`, `--font-*`) |
| 플러그인          | `plugins: []`                         | `@plugin` 디렉티브                 |
| Import            | `@tailwind base/components/utilities` | `@import "tailwindcss"`            |

## 하드코딩 금지

임의 값(`[#3b82f6]`, `bg-[rgb(...)]`)·하드코딩 크기(`text-[14px]`) 사용 금지. 필요하면 `DESIGN.md`에 토큰을 먼저 추가하고 같은 이름·값으로 `@theme`에 구현한다.

```tsx
// BAD
<button className="bg-[#3b82f6] text-[14px] p-[12px]">

// GOOD (토큰 기반)
<button className="bg-blue-500 text-sm p-3">
```

**이유:** 디자인 시스템 일관성, 다크모드·테마 확장 대응.

## shadcn/ui 컴포넌트 추가

```bash
cd packages/ui
npx shadcn add button
```

추가 후 `packages/ui/src/index.ts`에 수동으로 re-export 필요.
