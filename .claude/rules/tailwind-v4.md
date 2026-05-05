# Tailwind CSS v4 규칙

> scalable-monorepo-starter는 Tailwind CSS v4를 사용한다. v3와 설정 방식이 다르므로 주의.

## 테마 변수 정의 위치

모든 디자인 토큰은 `packages/ui/src/styles/globals.css`의 `@theme` 블록에서 CSS 변수로 정의한다.

```css
/* packages/ui/src/styles/globals.css */
@import "tailwindcss";

@theme {
  --font-family-sans: "Open Sans", ui-sans-serif, system-ui, sans-serif;

  --color-blue-500: #3b82f6;
  --color-gray-900: #111827;

  --breakpoint-mobile: 640px;
  --breakpoint-tablet: 768px;
  --breakpoint-desktop: 1440px;
}
```

**토큰 네이밍 규칙:**
- 색상: `--color-<name>-<scale>` (예: `--color-blue-500`)
- 폰트: `--font-family-<name>` (예: `--font-family-sans`)
- 브레이크포인트: `--breakpoint-<name>` (예: `--breakpoint-desktop`)

## 네임스페이스 → utility 매핑 (필수 준수)

Tailwind v4는 `@theme` 토큰의 **네임스페이스 prefix** 로 utility 클래스를 자동 생성한다. 잘못된 prefix를 쓰면 토큰이 정의되어 있어도 utility가 만들어지지 않아 클래스가 무효화된다 (R10. Header Token Gap이 이 누락으로 발생).

| 네임스페이스          | 자동 생성되는 utility                                                                       | 예시                                                          |
| --------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| `--color-*`           | `bg-*`, `text-*`, `border-*`, `ring-*`, `outline-*`, `divide-*`, `from-*`/`via-*`/`to-*`    | `--color-blue-500` → `bg-blue-500`                            |
| `--spacing-*`         | `p-*`, `m-*`, `w-*`, `h-*`, `min-w-*`, `min-h-*`, `max-w-*`, `max-h-*`, `gap-*`, `inset-*`  | `--spacing-page-x: 72px` → `px-page-x` / `--spacing-header: 88px` → `min-h-header` |
| `--container-*`       | `max-w-*`, `@container` 컨테이너 쿼리 변형                                                   | `--container-app: 1280px` → `max-w-app`                       |
| `--font-family-*`     | `font-*`                                                                                    | `--font-family-sans` → `font-sans`                            |
| `--font-size-*`       | `text-*` (크기)                                                                             | `--font-size-xl: 20px` → `text-xl`                            |
| `--line-height-*`     | `leading-*`                                                                                 | `--line-height-32: 32px` → `leading-32`                       |
| `--breakpoint-*`      | 반응형 변형 prefix                                                                          | `--breakpoint-desktop: 1440px` → `desktop:flex`               |
| `--radius-*`          | `rounded-*`                                                                                 | `--radius-lg` → `rounded-lg`                                  |
| `--shadow-*`          | `shadow-*`                                                                                  | `--shadow-md` → `shadow-md`                                   |

**금지 — 정의해도 utility가 생성되지 않는 prefix:**
- `--size-*` ❌ (Tailwind v4 표준 namespace 아님 → orphan 토큰이 됨)
- 임의로 만든 `--token-*`, `--design-*` 등 ❌

**올바른 패턴:**

```css
/* GOOD — utility 자동 생성 */
@theme {
  --spacing-header: 88px;       /* → min-h-header, h-header, p-header 등 */
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

임의 값(`[#3b82f6]`, `bg-[rgb(...)]`)·하드코딩 크기(`text-[14px]`) 사용 금지. 필요하면 `@theme`에 토큰을 먼저 추가한다.

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
