import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";

const ColorSwatch = ({ name, cssVar }: { name: string; cssVar: string }) => (
  <div className="flex items-center gap-3">
    <div
      className="h-8 w-8 rounded border border-(--color-border)"
      style={{ backgroundColor: `var(${cssVar})` }}
    />
    <span className="text-sm text-(--color-text-primary)">{name}</span>
    <code className="text-xs text-(--color-text-secondary)">{cssVar}</code>
  </div>
);

const TypographyRow = ({
  label,
  cssVarSize,
  cssVarLineHeight,
}: {
  label: string;
  cssVarSize: string;
  cssVarLineHeight: string;
}) => (
  <div className="flex items-baseline gap-4">
    <span
      style={{
        fontSize: `var(${cssVarSize})`,
        lineHeight: `var(${cssVarLineHeight})`,
      }}
      className="text-(--color-text-primary)"
    >
      {label}
    </span>
    <code className="text-xs text-(--color-text-secondary)">
      {cssVarSize} / {cssVarLineHeight}
    </code>
  </div>
);

const DesignTokensDoc = () => (
  <div className="space-y-10 p-8 bg-(--color-bg-primary)">
    <section>
      <h2 className="mb-4 text-xl font-semibold text-(--color-text-primary)">Blue Palette</h2>
      <div className="space-y-2">
        {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((n) => (
          <ColorSwatch key={n} name={`blue-${n}`} cssVar={`--color-blue-${n}`} />
        ))}
      </div>
    </section>

    <section>
      <h2 className="mb-4 text-xl font-semibold text-(--color-text-primary)">Gray Palette</h2>
      <div className="space-y-2">
        {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((n) => (
          <ColorSwatch key={n} name={`gray-${n}`} cssVar={`--color-gray-${n}`} />
        ))}
      </div>
    </section>

    <section>
      <h2 className="mb-4 text-xl font-semibold text-(--color-text-primary)">System Colors</h2>
      <div className="space-y-2">
        <ColorSwatch name="system-red" cssVar="--color-system-red" />
        <ColorSwatch name="system-green" cssVar="--color-system-green" />
        <ColorSwatch name="system-white" cssVar="--color-system-white" />
      </div>
    </section>

    <section>
      <h2 className="mb-4 text-xl font-semibold text-(--color-text-primary)">Semantic Colors</h2>
      <div className="space-y-2">
        <ColorSwatch name="text-primary" cssVar="--color-text-primary" />
        <ColorSwatch name="text-secondary" cssVar="--color-text-secondary" />
        <ColorSwatch name="text-placeholder" cssVar="--color-text-placeholder" />
        <ColorSwatch name="border" cssVar="--color-border" />
        <ColorSwatch name="bg-primary" cssVar="--color-bg-primary" />
        <ColorSwatch name="bg-secondary" cssVar="--color-bg-secondary" />
        <ColorSwatch name="interactive-default" cssVar="--color-interactive-default" />
        <ColorSwatch name="interactive-hover" cssVar="--color-interactive-hover" />
        <ColorSwatch name="interactive-active" cssVar="--color-interactive-active" />
        <ColorSwatch name="state-error" cssVar="--color-state-error" />
        <ColorSwatch name="state-success" cssVar="--color-state-success" />
      </div>
    </section>

    <section>
      <h2 className="mb-4 text-xl font-semibold text-(--color-text-primary)">Typography Scale</h2>
      <div className="space-y-4">
        <TypographyRow label="h1 — Heading 1" cssVarSize="--font-size-6xl" cssVarLineHeight="--line-height-72" />
        <TypographyRow label="h2 — Heading 2" cssVarSize="--font-size-5xl" cssVarLineHeight="--line-height-64" />
        <TypographyRow label="h3 — Heading 3" cssVarSize="--font-size-4xl" cssVarLineHeight="--line-height-48" />
        <TypographyRow label="h4 — Heading 4" cssVarSize="--font-size-3xl" cssVarLineHeight="--line-height-40" />
        <TypographyRow label="h5 — Heading 5" cssVarSize="--font-size-2xl" cssVarLineHeight="--line-height-32" />
        <TypographyRow label="h6 — Heading 6" cssVarSize="--font-size-xl" cssVarLineHeight="--line-height-32" />
        <TypographyRow label="large — Large Text" cssVarSize="--font-size-lg" cssVarLineHeight="--line-height-24" />
        <TypographyRow label="paragraph — Body Text" cssVarSize="--font-size-base" cssVarLineHeight="--line-height-24" />
        <TypographyRow label="small — Small Text" cssVarSize="--font-size-sm" cssVarLineHeight="--line-height-24" />
        <TypographyRow label="xsmall — Extra Small" cssVarSize="--font-size-xs" cssVarLineHeight="--line-height-16" />
      </div>
    </section>
  </div>
);

const meta: Meta = {
  title: "Common/DesignTokens",
  component: DesignTokensDoc,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
