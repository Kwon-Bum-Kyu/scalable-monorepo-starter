import { Card } from "@repo/ui";
import type React from "react";

import { BLUE_PALETTE, GRAY_PALETTE, SEMANTIC_ALIASES } from "@/view/guide/colorData";
import { GuideSection, GuideTable, TD } from "@/view/guide/primitives";
import {
  BREAKPOINT_BARS,
  FONT_FAMILIES,
  FONT_WEIGHTS,
  RADIUS_SCALE,
  SHADOW_SCALE,
  SPACING_TOKENS,
  TYPE_SCALE,
} from "@/view/guide/scaleData";

const SubTitle = ({ children }: { children: React.ReactNode }) => (
  <p className="-mb-3 text-base font-semibold">{children}</p>
);

const Swatch = ({ name, note, className }: { name: string; note: string; className: string }) => (
  <div className="overflow-hidden rounded-lg border border-border bg-card">
    <div data-swatch-chip className={`h-16 border-b border-border ${className}`} />
    <div className="grid px-3 py-2 font-mono text-xs">
      <span className="font-semibold">{name}</span>
      <span className="text-muted-foreground">{note}</span>
    </div>
  </div>
);

const SpecCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <Card variant="flat" className="grid content-start gap-4 p-5">
    <h3 className="text-base font-semibold">{title}</h3>
    {children}
  </Card>
);

const TIGHT_PALETTE_GRID = "grid grid-cols-2 gap-2 tablet:grid-cols-3 desktop:grid-cols-5";

export const ColorSection = () => (
  <GuideSection id="color" eyebrow="토큰" title="컬러">
    <SubTitle>Blue</SubTitle>
    <div className={TIGHT_PALETTE_GRID}>
      {BLUE_PALETTE.map((s) => (
        <Swatch key={s.name} name={s.name} note={s.value} className={s.className} />
      ))}
    </div>
    <SubTitle>Gray</SubTitle>
    <div className={TIGHT_PALETTE_GRID}>
      {GRAY_PALETTE.map((s) => (
        <Swatch key={s.name} name={s.name} note={s.value} className={s.className} />
      ))}
    </div>
    <SubTitle>의미 별칭</SubTitle>
    <div className="grid grid-cols-2 gap-4 tablet:grid-cols-3 desktop:grid-cols-4">
      {SEMANTIC_ALIASES.map((a) => (
        <Swatch key={a.name} name={a.name} note={`→ ${a.target}`} className={a.className} />
      ))}
    </div>
  </GuideSection>
);

const NameValueRow = ({ children, value, valueClassName }: { children: React.ReactNode; value: string; valueClassName?: string }) => (
  <tr className="group">
    <td className={TD}>{children}</td>
    <td className={`${TD} ${valueClassName ?? ""}`}>{value}</td>
  </tr>
);

export const TypographySection = () => (
  <GuideSection id="type" eyebrow="토큰" title="타이포그래피">
    <div className="grid grid-cols-1 gap-4 tablet:grid-cols-2">
      <GuideTable head={["서체 토큰", "값"]}>
        {FONT_FAMILIES.map((f) => (
          <NameValueRow key={f.token} value={f.family} valueClassName={f.className}>
            <code>{f.token}</code>
          </NameValueRow>
        ))}
      </GuideTable>
      <GuideTable head={["굵기 토큰", "값"]}>
        {FONT_WEIGHTS.map((w) => (
          <NameValueRow key={w.token} value={w.value} valueClassName={w.className}>
            <code>{w.token}</code>
          </NameValueRow>
        ))}
      </GuideTable>
    </div>
    <GuideTable head={["크기 토큰", "크기 / 행간", "견본"]} className="min-w-150">
      {TYPE_SCALE.map((t) => (
        <tr key={t.token} className="group">
          <td className={TD}>
            <code>{t.token}</code>
          </td>
          <td className={`${TD} whitespace-nowrap font-mono`}>{`${t.size} / ${t.lineHeight}`}</td>
          <td className={`${TD} whitespace-nowrap ${t.className}`}>Aa 공유 루트</td>
        </tr>
      ))}
    </GuideTable>
  </GuideSection>
);

const BAR = "h-2 max-w-full rounded-sm bg-foreground";

export const SpacingSection = () => (
  <GuideSection id="space" eyebrow="토큰" title="스페이싱 · 라운딩 · 그림자">
    <div className="grid grid-cols-1 gap-4 tablet:grid-cols-3">
      <SpecCard title="스페이싱">
        <ul className="grid gap-3">
          <li className="grid gap-1.5">
            <span className="text-sm">
              <code>4px</code> 원자 단위 · Tailwind <code>p-1</code>
            </span>
            <span className={`${BAR} w-1`} />
          </li>
          {SPACING_TOKENS.map((s) => (
            <li key={s.token} className="grid gap-1.5">
              <span className="text-sm">
                <code>{s.token}</code> {s.value}
              </span>
              <span className={`${BAR} ${s.barClassName}`} />
            </li>
          ))}
        </ul>
      </SpecCard>
      <SpecCard title="라운딩">
        <ul className="flex flex-wrap gap-3">
          {RADIUS_SCALE.map((r) => (
            <li key={r.token} className="grid justify-items-center gap-1.5">
              <span className={`h-12 w-12 border-2 border-foreground bg-secondary ${r.className}`} />
              <code className="text-xs">{r.token}</code>
              <span className="text-xs text-muted-foreground">{r.value}</span>
            </li>
          ))}
        </ul>
      </SpecCard>
      <SpecCard title="그림자">
        <ul className="grid gap-4 rounded-md bg-secondary p-4">
          {SHADOW_SCALE.map((s) => (
            <li key={s.token} className={`grid rounded-md bg-card px-4 py-3 ${s.className}`}>
              <code className="text-xs">{s.token}</code>
              {s.note ? <span className="text-xs text-muted-foreground">{s.note}</span> : null}
            </li>
          ))}
        </ul>
      </SpecCard>
    </div>
  </GuideSection>
);

export const BreakpointSection = () => (
  <GuideSection id="bp" eyebrow="토큰" title="브레이크포인트">
    <div className="grid gap-2">
      {BREAKPOINT_BARS.map((bp) => (
        <div
          key={bp.name}
          className={`flex min-h-11 min-w-fit items-center gap-3 rounded-md border border-border bg-secondary px-4 ${bp.barClassName}`}
        >
          <span className="text-sm font-semibold">{bp.name}</span>
          <span className="whitespace-nowrap font-mono text-xs text-muted-foreground">{`≥ ${bp.value}`}</span>
        </div>
      ))}
    </div>
  </GuideSection>
);
