import type React from "react";

export interface GuideSectionProps {
  id: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}

export const GuideSection = ({ id, eyebrow, title, children }: GuideSectionProps) => (
  <section
    id={id}
    aria-labelledby={`${id}-title`}
    className="grid scroll-mt-24 gap-6 border-t border-border py-10 desktop:scroll-mt-4 desktop:py-12"
  >
    <div className="grid gap-1">
      <p className="text-xs font-bold tracking-eyebrow text-muted-foreground">{eyebrow}</p>
      <h2
        id={`${id}-title`}
        tabIndex={-1}
        className="text-xl font-semibold focus:outline-none tablet:text-2xl"
      >
        {title}
      </h2>
    </div>
    {children}
  </section>
);

export const TD = "border-b border-border p-3 align-middle group-last:border-b-0";
