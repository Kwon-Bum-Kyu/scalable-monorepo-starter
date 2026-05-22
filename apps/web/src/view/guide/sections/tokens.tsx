import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui";

import {
  BLUE_PALETTE,
  GRAY_PALETTE,
  SYSTEM_COLORS,
} from "@/view/guide/color-data";
import { BREAKPOINTS } from "@/view/guide/nav-data";
import { Section, SwatchRow, TokenCard } from "@/view/guide/primitives";
import {
  FONT_FAMILIES,
  FONT_WEIGHTS,
  RADIUS_SCALE,
  SHADOW_SCALE,
  SPACING_SCALE,
  TYPE_SCALE,
} from "@/view/guide/scale-data";

export const ColorsSection = () => (
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
      <TokenCard
        title="Semantic alias"
        hint="focus-ring · text-inverse · bg-accent"
      >
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

export const TypographySection = () => (
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
              <span className="font-mono text-xs text-gray-400">{w.token}</span>
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

export const SpacingSection = () => (
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

export const BreakpointsSection = () => (
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
