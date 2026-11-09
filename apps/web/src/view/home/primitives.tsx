import { cn } from "@repo/ui";
import type React from "react";

import InlineCode from "@/components/InlineCode";
import PageContainer from "@/components/layouts/PageContainer";

export interface HomeSectionProps {
  id: string;
  tinted?: boolean;
  children: React.ReactNode;
}

export function HomeSection({
  id,
  tinted,
  children,
}: HomeSectionProps): React.JSX.Element {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={cn("scroll-mt-4 py-16 tablet:py-24", tinted && "bg-secondary")}
    >
      <PageContainer>{children}</PageContainer>
    </section>
  );
}

export interface SectionHeadProps {
  id: string;
  eyebrow: string;
  title: string;
  lead?: string;
  className?: string;
}

export function SectionHead({
  id,
  eyebrow,
  title,
  lead,
  className,
}: SectionHeadProps): React.JSX.Element {
  return (
    <div className={cn("mb-8 grid max-w-188 gap-2 tablet:mb-12", className)}>
      <p className="text-xs font-bold tracking-eyebrow text-muted-foreground">
        {eyebrow}
      </p>
      <h2
        id={`${id}-title`}
        tabIndex={-1}
        className="text-2xl font-bold focus:outline-none tablet:text-4xl"
      >
        {title}
      </h2>
      {lead ? (
        <p className="mt-2 text-base text-muted-foreground tablet:text-lg">
          <InlineCode text={lead} />
        </p>
      ) : null}
    </div>
  );
}
