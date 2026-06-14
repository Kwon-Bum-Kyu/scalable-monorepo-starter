import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@repo/ui";
import React from "react";

import { type ColorRow } from "@/view/guide/color-data";
import { SIDEBAR_GROUPS } from "@/view/guide/nav-data";

const SECTION_TONE = {
  eyebrowClass:
    "font-mono text-xs font-bold uppercase tracking-[0.08em] text-gray-400",
  titleClass: "mt-1 text-3xl font-bold tracking-tight text-gray-900",
  descClass: "mt-2 max-w-prose text-sm leading-6 text-gray-400",
} as const;

export const Section = ({
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

export const SwatchRow = ({ row }: { row: ColorRow }) => (
  <div className="flex items-center gap-3 border-b border-gray-50 py-2 last:border-b-0">
    <span
      aria-hidden
      className={`inline-block h-6 w-6 rounded-sm border border-gray-100 ${row.className}`}
    />
    <span className="font-mono text-xs text-gray-700">{row.name}</span>
    <span className="ml-auto font-mono text-xs text-gray-400">{row.value}</span>
  </div>
);

export const TokenCard = ({
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
  <Card variant="subtle" className="overflow-hidden rounded-xl">
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
      <CardTitle data-testid="card-meta-title" className="text-sm font-semibold">
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

export const Sidebar = () => (
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
