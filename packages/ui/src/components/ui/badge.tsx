import { cn } from "@repo/ui/lib/utils";
import type { VariantProps } from "class-variance-authority";
import * as React from "react";

import { badgeVariants } from "./badge-variants";

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

function Badge(
  { className, variant, shape, dot, children, ...props }: BadgeProps,
) {
  return (
    <div
      className={cn(badgeVariants({ variant, shape }), className)}
      {...props}
    >
      {dot
        ? (
          <span
            data-slot="badge-dot"
            aria-hidden
            className="inline-block h-1.5 w-1.5 rounded-full bg-current"
          />
        )
        : null}
      {children}
    </div>
  );
}

export { Badge };
