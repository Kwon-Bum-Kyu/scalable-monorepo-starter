import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
  RadioGroup,
  RadioGroupItem,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SimpleTabs,
  Slider,
  Switch,
  SystemIcon,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  toast,
} from "@repo/ui";
import React, { useState } from "react";

type SidebarLink = {
  href: string;
  label: string;
  external?: boolean;
};
type SidebarGroup = { title: string; links: ReadonlyArray<SidebarLink> };

const REPO_URL = "https://github.com/Kwon-Bum-Kyu/scalable-monorepo-starter";

const SIDEBAR_GROUPS: ReadonlyArray<SidebarGroup> = [
  {
    title: "시작",
    links: [
      { href: "#overview", label: "개요" },
      { href: "#principles", label: "원칙" },
    ],
  },
  {
    title: "토큰",
    links: [
      { href: "#colors", label: "컬러" },
      { href: "#type", label: "타이포그래피" },
      { href: "#spacing", label: "스페이싱 · 라운딩 · 그림자" },
      { href: "#breakpoints", label: "브레이크포인트" },
    ],
  },
  {
    title: "컴포넌트",
    links: [
      { href: "#components", label: "기본 컴포넌트" },
      { href: "#brand", label: "로고 · 아이콘" },
    ],
  },
  {
    title: "UI Kit",
    links: [{ href: "#uikit", label: "웹 UI Kit" }],
  },
  {
    title: "참고",
    links: [
      { href: "#overview", label: "README" },
      { href: REPO_URL, label: "monorepo starter ↗", external: true },
    ],
  },
];

const PRINCIPLES: ReadonlyArray<{ title: string; description: string }> = [
  {
    title: "Tokens first",
    description: "하드코딩 색·픽셀 금지. 항상 var(--color-*) 사용.",
  },
  {
    title: "shadcn 호환",
    description: "컴포넌트 API는 variant·size 패턴 유지.",
  },
  { title: "Mobile-first", description: "기본은 모바일, 미디어 쿼리로 확장." },
  { title: "Type-safe", description: "props는 union 타입으로 좁히기." },
  {
    title: "Accessibility",
    description: "aria-label, focus ring, 44px 터치 타겟.",
  },
  {
    title: "적게, 명확하게",
    description: "variants는 6개 이하. 신중히 추가.",
  },
];

type ColorRow = { name: string; value: string; className: string };

const BLUE_PALETTE: ReadonlyArray<ColorRow> = [
  { name: "--color-blue-50", value: "#e1e9ef", className: "bg-blue-50" },
  { name: "--color-blue-100", value: "#b5c8d6", className: "bg-blue-100" },
  { name: "--color-blue-200", value: "#84a3bb", className: "bg-blue-200" },
  { name: "--color-blue-300", value: "#527ea0", className: "bg-blue-300" },
  { name: "--color-blue-400", value: "#2d638b", className: "bg-blue-400" },
  { name: "--color-blue-500", value: "#084777", className: "bg-blue-500" },
  { name: "--color-blue-600", value: "#07406f", className: "bg-blue-600" },
  { name: "--color-blue-700", value: "#063764", className: "bg-blue-700" },
  { name: "--color-blue-800", value: "#042f5a", className: "bg-blue-800" },
  { name: "--color-blue-900", value: "#022047", className: "bg-blue-900" },
];

const GRAY_PALETTE: ReadonlyArray<ColorRow> = [
  { name: "--color-gray-50", value: "#e7e7e6", className: "bg-gray-50" },
  { name: "--color-gray-100", value: "#c2c2c1", className: "bg-gray-100" },
  { name: "--color-gray-200", value: "#9a9a98", className: "bg-gray-200" },
  { name: "--color-gray-300", value: "#72726f", className: "bg-gray-300" },
  { name: "--color-gray-400", value: "#535350", className: "bg-gray-400" },
  { name: "--color-gray-500", value: "#353531", className: "bg-gray-500" },
  { name: "--color-gray-600", value: "#30302c", className: "bg-gray-600" },
  { name: "--color-gray-700", value: "#282825", className: "bg-gray-700" },
  { name: "--color-gray-800", value: "#22221f", className: "bg-gray-800" },
  { name: "--color-gray-900", value: "#161613", className: "bg-gray-900" },
];

const SYSTEM_COLORS: ReadonlyArray<ColorRow> = [
  {
    name: "--color-system-red",
    value: "#c2050b",
    className: "bg-system-red",
  },
  {
    name: "--color-system-green",
    value: "#07b46f",
    className: "bg-system-green",
  },
  {
    name: "--color-system-warning",
    value: "#f9a80a",
    className: "bg-system-warning",
  },
  {
    name: "--color-system-info",
    value: "#2196f3",
    className: "bg-system-info",
  },
  {
    name: "--color-system-white",
    value: "#ffffff",
    className: "bg-system-white border border-border",
  },
];

const FONT_FAMILIES: ReadonlyArray<{
  token: string;
  family: string;
  className?: string;
  inlineFamilyVar?: string;
  sample: string;
}> = [
  {
    token: "--font-family-sans",
    family: "Open Sans (300–800, 12 face)",
    className: "font-sans",
    sample: "The quick brown fox jumps over the lazy dog",
  },
  {
    token: "--font-family-mono",
    family: "Roboto Mono (400/500/700)",
    className: "font-mono",
    sample: "const tokens = { sans: 'Open Sans' };",
  },
  {
    token: "--font-family-display",
    family: "Roboto Mono (display)",
    inlineFamilyVar: "--font-family-display",
    sample: "Display · KBK Monorepo Design",
  },
  {
    token: "--font-family-body-alt",
    family: "PT Sans (body-alt)",
    inlineFamilyVar: "--font-family-body-alt",
    sample: "본문 보조 패밀리. 긴 본문이나 기사 톤 콘텐츠에 사용한다.",
  },
];

const TYPE_SCALE: ReadonlyArray<{
  token: string;
  size: string;
  utility: string;
  className: string;
}> = [
  {
    token: "--font-size-6xl",
    size: "56px",
    utility: "text-6xl",
    className: "text-6xl",
  },
  {
    token: "--font-size-5xl",
    size: "48px",
    utility: "text-5xl",
    className: "text-5xl",
  },
  {
    token: "--font-size-4xl",
    size: "40px",
    utility: "text-4xl",
    className: "text-4xl",
  },
  {
    token: "--font-size-3xl",
    size: "32px",
    utility: "text-3xl",
    className: "text-3xl",
  },
  {
    token: "--font-size-2xl",
    size: "24px",
    utility: "text-2xl",
    className: "text-2xl",
  },
  {
    token: "--font-size-xl",
    size: "20px",
    utility: "text-xl",
    className: "text-xl",
  },
  {
    token: "--font-size-lg",
    size: "18px",
    utility: "text-lg",
    className: "text-lg",
  },
  {
    token: "--font-size-base",
    size: "16px",
    utility: "text-base",
    className: "text-base",
  },
  {
    token: "--font-size-sm",
    size: "14px",
    utility: "text-sm",
    className: "text-sm",
  },
  {
    token: "--font-size-xs",
    size: "12px",
    utility: "text-xs",
    className: "text-xs",
  },
];

const FONT_WEIGHTS: ReadonlyArray<{
  token: string;
  value: string;
  className: string;
}> = [
  {
    token: "--font-weight-regular",
    value: "400",
    className: "font-normal",
  },
  {
    token: "--font-weight-semibold",
    value: "600",
    className: "font-semibold",
  },
  { token: "--font-weight-bold", value: "700", className: "font-bold" },
];

const SPACING_SCALE: ReadonlyArray<{
  token: string;
  size: string;
  utility: string;
  widthClassName: string;
}> = [
  { token: "p-1", size: "4px", utility: "p-1", widthClassName: "w-1" },
  { token: "p-2", size: "8px", utility: "p-2", widthClassName: "w-2" },
  { token: "p-3", size: "12px", utility: "p-3", widthClassName: "w-3" },
  { token: "p-4", size: "16px", utility: "p-4", widthClassName: "w-4" },
  { token: "p-6", size: "24px", utility: "p-6", widthClassName: "w-6" },
  { token: "p-8", size: "32px", utility: "p-8", widthClassName: "w-8" },
  { token: "p-12", size: "48px", utility: "p-12", widthClassName: "w-12" },
  {
    token: "p-16 (--spacing-16)",
    size: "64px",
    utility: "p-16",
    widthClassName: "w-16",
  },
  { token: "p-20", size: "80px", utility: "p-20", widthClassName: "w-20" },
];

const RADIUS_SCALE: ReadonlyArray<{
  token: string;
  size: string;
  className: string;
}> = [
  { token: "--radius-none", size: "0", className: "rounded-none" },
  { token: "--radius-sm", size: "8px", className: "rounded-sm" },
  { token: "--radius-md", size: "10px", className: "rounded-md" },
  { token: "--radius-lg", size: "12px", className: "rounded-lg" },
  { token: "--radius-xl", size: "16px", className: "rounded-xl" },
  { token: "--radius-2xl", size: "24px", className: "rounded-2xl" },
  { token: "--radius-full", size: "9999px", className: "rounded-full" },
];

const SHADOW_SCALE: ReadonlyArray<{
  token: string;
  level: string;
  description: string;
  className: string;
}> = [
  {
    token: "--shadow-1-subtle",
    level: "1",
    description: "tabs active · calendar dropdown",
    className: "shadow-1-subtle",
  },
  {
    token: "--shadow-2-default",
    level: "2",
    description: "card · 컨텐츠 그룹화 default",
    className: "shadow-2-default",
  },
  {
    token: "--shadow-3-raised",
    level: "3",
    description: "popover · select · tooltip",
    className: "shadow-3-raised",
  },
  {
    token: "--shadow-4-overlay",
    level: "4",
    description: "Dialog / Sheet / Drawer",
    className: "shadow-4-overlay",
  },
];

const BREAKPOINTS: ReadonlyArray<{
  name: string;
  width: string;
  columns: string;
  margin: string;
  gutter: string;
}> = [
  {
    name: "Mobile",
    width: "< 768px",
    columns: "4",
    margin: "16px",
    gutter: "16px",
  },
  {
    name: "Tablet",
    width: "768 – 1279px",
    columns: "8",
    margin: "32px",
    gutter: "16px",
  },
  {
    name: "Desktop",
    width: "≥ 1280px",
    columns: "12",
    margin: "72px",
    gutter: "16px",
  },
];

const SECTION_TONE = {
  eyebrowClass:
    "font-mono text-xs font-bold uppercase tracking-[0.08em] text-gray-400",
  titleClass: "mt-1 text-3xl font-bold tracking-tight text-gray-900",
  descClass: "mt-2 max-w-prose text-sm leading-6 text-gray-400",
} as const;

const Section = ({
  id,
  eyebrow,
  title,
  description,
  children,
  headingLevel = 2,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  headingLevel?: 1 | 2;
}) => {
  const HeadingTag = headingLevel === 1 ? "h1" : "h2";
  const titleClass =
    headingLevel === 1
      ? "mt-2 text-4xl font-bold tracking-tight text-gray-900 leading-tight"
      : SECTION_TONE.titleClass;
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className="border-t border-gray-50 py-12 first:border-t-0 first:pt-8"
    >
      <div className={SECTION_TONE.eyebrowClass}>{eyebrow}</div>
      <HeadingTag id={`${id}-heading`} className={titleClass}>
        {title}
      </HeadingTag>
      {description ? (
        <p className={SECTION_TONE.descClass}>{description}</p>
      ) : null}
      <div className="mt-6">{children}</div>
    </section>
  );
};

const SwatchRow = ({ row }: { row: ColorRow }) => (
  <div className="flex items-center gap-3 border-b border-gray-50 py-2 last:border-b-0">
    <span
      aria-hidden
      className={`inline-block h-6 w-6 rounded-sm border border-gray-100 ${row.className}`}
    />
    <span className="font-mono text-xs text-gray-700">{row.name}</span>
    <span className="ml-auto font-mono text-xs text-gray-400">{row.value}</span>
  </div>
);

const TokenCard = ({
  title,
  hint,
  children,
  frameClassName,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
  frameClassName?: string;
}) => (
  <Card className="overflow-hidden shadow-2-default">
    <CardContent
      data-testid="card-frame"
      className={`min-w-0 max-w-full bg-gray-50 p-6 ${frameClassName ?? ""}`}
    >
      {children}
    </CardContent>
    <CardFooter
      data-testid="card-meta"
      className="flex items-baseline justify-between gap-3 border-t border-gray-50 px-4 py-3.5"
    >
      <CardTitle
        data-testid="card-meta-title"
        className="text-sm font-semibold"
      >
        {title}
      </CardTitle>
      {hint ? (
        <CardDescription
          data-testid="card-meta-hint"
          className="font-mono text-xs text-gray-400"
        >
          {hint}
        </CardDescription>
      ) : null}
    </CardFooter>
  </Card>
);

const Sidebar = () => (
  <aside className="hidden w-60 shrink-0 lg:block">
    <nav
      aria-label="Design System Guide"
      className="sticky top-4 max-h-[calc(100vh-2rem)] overflow-auto border-r border-gray-50 pr-5"
    >
      <div className="mb-6">
        <div className="text-base font-bold text-gray-900">Design System</div>
        <div className="mt-1 font-mono text-xs text-gray-400">
          v1 · Apr 2026 · Web
        </div>
      </div>
      <ul className="space-y-5">
        {SIDEBAR_GROUPS.map((group) => (
          <li key={group.title}>
            <h4 className="mb-2 font-mono text-xs font-bold uppercase tracking-[0.08em] text-gray-300">
              {group.title}
            </h4>
            <ul className="space-y-1">
              {group.links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="block rounded-md px-2 py-1.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    {...(link.external
                      ? {
                          target: "_blank",
                          rel: "noopener noreferrer",
                          "aria-label": `${link.label} (외부 링크)`,
                        }
                      : null)}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </nav>
  </aside>
);

const OverviewSection = () => (
  <Section
    id="overview"
    eyebrow="KBK · Design System"
    title="디자인 시스템 한눈에 보기"
    description="Claude Design 명세와 packages/ui (shadcn/ui 기반) 의 토큰을 단일 소스로 통합합니다. 모든 색·타입·스페이싱·컴포넌트는 packages/ui/src/styles/globals.css 의 @theme 토큰에서 직접 가져옵니다."
    headingLevel={1}
  >
    <div className="flex flex-wrap gap-2">
      <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
        Source · <code className="font-mono text-xs">packages/ui</code>
      </span>
      <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-100 bg-gray-50 px-2.5 py-1 text-xs font-semibold text-gray-700">
        Tokens · <code className="font-mono text-xs">globals.css</code>
      </span>
      <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-100 bg-gray-50 px-2.5 py-1 text-xs font-semibold text-gray-700">
        Stack · <code className="font-mono text-xs">React 19 · Vite 7 · Tailwind v4</code>
      </span>
    </div>
  </Section>
);

const PrinciplesSection = () => (
  <Section
    id="principles"
    eyebrow="Principles"
    title="5가지 원칙"
    description="디자인 결정과 컴포넌트 작성 시 항상 따르는 기준입니다."
  >
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {PRINCIPLES.map((p, idx) => (
        <Card key={p.title} className="shadow-2-default">
          <CardContent className="pt-6">
            <div className="font-mono text-xs text-gray-400">
              0{idx + 1}
            </div>
            <div className="mt-1 font-semibold text-gray-900">{p.title}</div>
            <p className="mt-2 text-sm leading-6 text-gray-400">
              {p.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  </Section>
);

const ColorsSection = () => (
  <Section
    id="colors"
    eyebrow="Tokens · Colors"
    title="컬러"
    description="Brand Blue (50–900), Neutral Gray (50–900), System 5종."
  >
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <TokenCard title="Brand · Blue" hint="--color-blue-*">
        <div>
          {BLUE_PALETTE.map((row) => (
            <SwatchRow key={row.name} row={row} />
          ))}
        </div>
      </TokenCard>
      <TokenCard title="Neutral · Gray" hint="--color-gray-*">
        <div>
          {GRAY_PALETTE.map((row) => (
            <SwatchRow key={row.name} row={row} />
          ))}
        </div>
      </TokenCard>
      <TokenCard title="System" hint="red · green · warning · info · white">
        <div>
          {SYSTEM_COLORS.map((row) => (
            <SwatchRow key={row.name} row={row} />
          ))}
        </div>
      </TokenCard>
      <TokenCard title="Semantic alias" hint="focus-ring · text-inverse · bg-accent">
        <ul className="space-y-2 font-mono text-xs text-gray-700">
          <li>--color-text-primary → gray-900</li>
          <li>--color-text-secondary → gray-400</li>
          <li>--color-focus-ring → blue-500 (AAA on white)</li>
          <li>--color-bg-accent → blue-50</li>
          <li>--color-border-strong → gray-300</li>
        </ul>
      </TokenCard>
    </div>
  </Section>
);

const TypographySection = () => (
  <Section
    id="type"
    eyebrow="Tokens · Typography"
    title="타이포그래피"
    description="Open Sans (sans, 로컬 .ttf 12 face) · Roboto Mono (mono · display, CDN) · PT Sans (body-alt, CDN)."
  >
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <TokenCard title="Families" hint="--font-family-*">
        <ul className="space-y-4">
          {FONT_FAMILIES.map((f) => (
            <li key={f.token}>
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-mono text-xs text-gray-700">
                  {f.token}
                </span>
                <span className="font-mono text-xs text-gray-400">
                  {f.family}
                </span>
              </div>
              <p
                className={`${f.className ?? ""} mt-2 text-base text-gray-900`}
                style={
                  f.inlineFamilyVar
                    ? { fontFamily: `var(${f.inlineFamilyVar})` }
                    : undefined
                }
              >
                {f.sample}
              </p>
            </li>
          ))}
        </ul>
      </TokenCard>

      <TokenCard title="Weights" hint="--font-weight-*">
        <ul className="space-y-3">
          {FONT_WEIGHTS.map((w) => (
            <li
              key={w.token}
              className="flex items-baseline justify-between gap-3"
            >
              <span className={`${w.className} text-lg text-gray-900`}>
                Weight {w.value}
              </span>
              <span className="font-mono text-xs text-gray-400">
                {w.token}
              </span>
            </li>
          ))}
        </ul>
      </TokenCard>

      <Card className="shadow-2-default lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            Type scale (10 단계)
          </CardTitle>
          <CardDescription className="font-mono text-xs text-gray-400">
            --font-size-xs → --font-size-6xl
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {TYPE_SCALE.map((t) => (
              <li
                key={t.token}
                className="flex items-baseline justify-between gap-4 border-b border-gray-50 pb-2 last:border-b-0"
              >
                <span className={`${t.className} text-gray-900`}>
                  {t.utility}
                </span>
                <span className="font-mono text-xs text-gray-400">
                  {t.token} · {t.size}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  </Section>
);

const SpacingSection = () => (
  <Section
    id="spacing"
    eyebrow="Tokens · Spacing"
    title="스페이싱 · 라운딩 · 그림자"
    description="4px 베이스 스케일. Radius와 Elevation은 globals.css의 4단계 토큰을 사용합니다."
  >
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <TokenCard title="Spacing scale" hint="4 → 80 px">
        <ul className="space-y-2">
          {SPACING_SCALE.map((s) => (
            <li
              key={s.token}
              className="flex items-center gap-3 border-b border-gray-50 pb-2 last:border-b-0"
            >
              <span
                aria-hidden
                className={`inline-block h-3 ${s.widthClassName} bg-blue-500`}
              />
              <span className="font-mono text-xs text-gray-700">
                {s.utility}
              </span>
              <span className="ml-auto font-mono text-xs text-gray-400">
                {s.size}
              </span>
            </li>
          ))}
        </ul>
      </TokenCard>

      <TokenCard title="Border radius" hint="--radius-*">
        <ul className="space-y-3">
          {RADIUS_SCALE.map((r) => (
            <li
              key={r.token}
              className="flex items-center gap-3 border-b border-gray-50 pb-3 last:border-b-0"
            >
              <span
                aria-hidden
                className={`inline-block h-10 w-10 border border-blue-200 bg-blue-50 ${r.className}`}
              />
              <span className="font-mono text-xs text-gray-700">{r.token}</span>
              <span className="ml-auto font-mono text-xs text-gray-400">
                {r.size}
              </span>
            </li>
          ))}
        </ul>
      </TokenCard>

      <TokenCard title="Elevation" hint="--shadow-1 → --shadow-4">
        <ul className="space-y-4">
          {SHADOW_SCALE.map((s) => (
            <li key={s.token}>
              <div
                aria-hidden
                className={`mb-2 flex h-12 items-center justify-center rounded-md bg-white text-xs font-semibold text-gray-700 ${s.className}`}
              >
                Level {s.level}
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-mono text-xs text-gray-700">
                  {s.token}
                </span>
                <span className="text-xs text-gray-400">{s.description}</span>
              </div>
            </li>
          ))}
        </ul>
      </TokenCard>
    </div>
  </Section>
);

const BreakpointsSection = () => (
  <Section
    id="breakpoints"
    eyebrow="Tokens · Layout"
    title="브레이크포인트"
    description="Mobile 4col / Tablet 8col / Desktop 12col. 디자인 토큰: --breakpoint-mobile · --breakpoint-tablet · --breakpoint-desktop."
  >
    <Card className="overflow-hidden shadow-2-default">
      <table aria-label="Breakpoints" className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-50 bg-gray-50/40 text-left">
            <th className="px-3 py-2 font-mono text-xs font-bold uppercase tracking-[0.06em] text-gray-400">
              이름
            </th>
            <th className="px-3 py-2 font-mono text-xs font-bold uppercase tracking-[0.06em] text-gray-400">
              너비
            </th>
            <th className="px-3 py-2 font-mono text-xs font-bold uppercase tracking-[0.06em] text-gray-400">
              컬럼
            </th>
            <th className="px-3 py-2 font-mono text-xs font-bold uppercase tracking-[0.06em] text-gray-400">
              마진
            </th>
            <th className="px-3 py-2 font-mono text-xs font-bold uppercase tracking-[0.06em] text-gray-400">
              거터
            </th>
          </tr>
        </thead>
        <tbody>
          {BREAKPOINTS.map((bp) => (
            <tr
              key={bp.name}
              className="border-b border-gray-50 last:border-b-0"
            >
              <td className="px-3 py-2.5 font-semibold text-gray-900">
                {bp.name}
              </td>
              <td className="px-3 py-2.5 font-mono text-xs text-gray-700">
                {bp.width}
              </td>
              <td className="px-3 py-2.5 font-mono text-xs text-gray-700">
                {bp.columns}
              </td>
              <td className="px-3 py-2.5 font-mono text-xs text-gray-700">
                {bp.margin}
              </td>
              <td className="px-3 py-2.5 font-mono text-xs text-gray-700">
                {bp.gutter}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  </Section>
);

const ComponentsSection = ({
  sliderValue,
  onSliderChange,
  rangeValue,
  onRangeChange,
  activeTab,
  onActiveTabChange,
}: {
  sliderValue: number[];
  onSliderChange: (value: number[]) => void;
  rangeValue: number[];
  onRangeChange: (value: number[]) => void;
  activeTab: string;
  onActiveTabChange: (value: string) => void;
}) => (
  <Section
    id="components"
    eyebrow="Components"
    title="기본 컴포넌트"
    description="shadcn/ui 베이스 위에 KBK 브랜드 색을 입힌 핵심 컴포넌트."
  >
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <TokenCard title="Button · variants" hint="6 variants">
        <div className="flex flex-wrap gap-2">
          <Button variant="default">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
          <Button variant="destructive">Destructive</Button>
        </div>
      </TokenCard>

      <TokenCard title="Button · sizes" hint="sm · md · lg · icon">
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm">Small</Button>
          <Button size="default">Medium</Button>
          <Button size="lg">Large</Button>
          <Button size="icon" aria-label="아이콘 버튼">
            <span aria-hidden>★</span>
          </Button>
        </div>
      </TokenCard>

      <TokenCard title="Input · field" hint="label · hint · error">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="guide-input-default">Label</Label>
            <Input id="guide-input-default" placeholder="Text input" />
            <p className="text-xs text-gray-400">Assistive text</p>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="guide-input-error">Label</Label>
            <Input
              id="guide-input-error"
              placeholder="Text input"
              aria-invalid
            />
            <p className="text-xs text-system-red">Error message</p>
          </div>
          <Input placeholder="Text input" disabled />
        </div>
      </TokenCard>

      <TokenCard title="Selection" hint="checkbox · radio · switch">
        <div className="flex flex-wrap items-center gap-6">
          <label className="flex items-center gap-2 text-sm">
            <Checkbox aria-label="checkbox" />
            Checkbox
          </label>
          <RadioGroup defaultValue="a" className="flex gap-3">
            <label className="flex items-center gap-2 text-sm">
              <RadioGroupItem value="a" aria-label="radio" />
              Radio
            </label>
          </RadioGroup>
          <label className="flex items-center gap-2 text-sm">
            <Switch aria-label="switch" />
            Switch
          </label>
        </div>
      </TokenCard>

      <TokenCard title="Slider" hint="single · range">
        <div className="flex flex-col gap-4">
          <Slider value={sliderValue} onValueChange={onSliderChange} />
          <Slider value={rangeValue} onValueChange={onRangeChange} />
        </div>
      </TokenCard>

      <TokenCard title="Badge" hint="5 variants">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="default">Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="success">Success</Badge>
        </div>
      </TokenCard>

      <TokenCard title="Card" hint="header · body · footer">
        <Card className="shadow-2-default">
          <CardHeader>
            <CardTitle>Card 제목</CardTitle>
            <CardDescription>header · body · footer 컴포지션</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-6 text-gray-700">
              본문 영역. 길이가 길어지면 자동으로 줄바꿈됩니다.
            </p>
          </CardContent>
          <CardFooter>
            <Button size="sm" variant="outline">
              Footer 액션
            </Button>
          </CardFooter>
        </Card>
      </TokenCard>

      <TokenCard title="Toast" hint="info · success · warn · error">
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.info("Info 토스트")}
          >
            Info
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.success("Success 토스트")}
          >
            Success
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.warning("Warning 토스트")}
          >
            Warning
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.error("Error 토스트")}
          >
            Error
          </Button>
        </div>
      </TokenCard>

      <TokenCard title="Modal" hint="dialog · drawer">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="default" size="sm">
                  Dialog 열기
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Dialog 제목</DialogTitle>
                  <DialogDescription>
                    중앙 정렬 modal — focus trap · ESC 닫기 지원.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" size="sm">
                    닫기
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  Drawer 열기
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Drawer 제목</SheetTitle>
                  <SheetDescription>
                    측면에서 슬라이드되는 modal — 동일 Radix primitive 컴포지션.
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          </div>
          <p className="font-mono text-xs text-gray-400">
            dialog · drawer 는 동일 Radix primitive 위 컴포지션 패턴
          </p>
        </div>
      </TokenCard>

      <TokenCard title="Tabs · nav" hint="underline · pill">
        <div className="flex flex-col gap-4">
          <Tabs defaultValue="a">
            <TabsList>
              <TabsTrigger value="a">Underline A</TabsTrigger>
              <TabsTrigger value="b">Underline B</TabsTrigger>
            </TabsList>
            <TabsContent value="a">
              <p className="mt-3 text-sm text-gray-700">Underline 콘텐츠 A</p>
            </TabsContent>
            <TabsContent value="b">
              <p className="mt-3 text-sm text-gray-700">Underline 콘텐츠 B</p>
            </TabsContent>
          </Tabs>
          <SimpleTabs
            items={[
              { value: "Tab 1", label: "Pill 1", content: "Pill 콘텐츠 1" },
              { value: "Tab 2", label: "Pill 2", content: "Pill 콘텐츠 2" },
            ]}
            value={activeTab}
            onValueChange={onActiveTabChange}
          />
        </div>
      </TokenCard>
    </div>
  </Section>
);

const BrandSection = () => (
  <Section
    id="brand"
    eyebrow="Brand"
    title="로고 · 아이콘"
    description="System icons (Lucide 기반) — 16/20/24px 사이즈."
  >
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <TokenCard title="System icons" hint="--system-icon · 16/20/24px">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex flex-col items-center gap-1">
            <SystemIcon name="eye" size={20} />
            <span className="font-mono text-xs text-gray-400">eye</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <SystemIcon name="close" className="text-system-red" size={20} />
            <span className="font-mono text-xs text-gray-400">close</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <SystemIcon name="check-circle-outline" size={24} />
            <span className="font-mono text-xs text-gray-400">
              check-circle
            </span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <SystemIcon name="info" size={20} />
            <span className="font-mono text-xs text-gray-400">info</span>
          </div>
        </div>
      </TokenCard>

      <TokenCard title="Brand · Logo" hint="<Logo />">
        <p className="text-sm leading-6 text-gray-700">
          Logo 컴포넌트는 RootLayout 헤더에 사용됩니다. 사이즈는
          --container-logo (160px) · --spacing-logo-h (40px) 토큰으로 제어합니다.
        </p>
      </TokenCard>
    </div>
  </Section>
);

const UIKitSection = () => (
  <Section
    id="uikit"
    eyebrow="UI Kit"
    title="웹 UI Kit (TypeScript)"
    description="토큰과 컴포넌트를 조합한 실제 화면. 랜딩 → 인증 → 대시보드 플로우 포함."
  >
    <Card className="shadow-1-subtle">
      <CardContent className="pt-6">
        <p className="text-sm leading-6 text-gray-700">
          전체 화면으로 열기 → README .tsx · Babel standalone
        </p>
      </CardContent>
    </Card>
  </Section>
);

const Guide = () => {
  const [sliderValue, setSliderValue] = useState<number[]>([50]);
  const [rangeValue, setRangeValue] = useState<number[]>([20, 80]);
  const [activeTab, setActiveTab] = useState("Tab 1");

  return (
    <div className="flex w-full gap-8 py-10">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <OverviewSection />
        <PrinciplesSection />
        <ColorsSection />
        <TypographySection />
        <SpacingSection />
        <BreakpointsSection />
        <ComponentsSection
          sliderValue={sliderValue}
          onSliderChange={setSliderValue}
          rangeValue={rangeValue}
          onRangeChange={setRangeValue}
          activeTab={activeTab}
          onActiveTabChange={setActiveTab}
        />
        <BrandSection />
        <UIKitSection />
      </div>
    </div>
  );
};

export default Guide;
