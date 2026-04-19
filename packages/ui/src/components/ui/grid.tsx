import * as React from "react";

import { cn } from "@repo/ui/lib/utils";

type ColsValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
type GapValue = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12;

const COLS_CLASS: Record<ColsValue, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
  7: "grid-cols-7",
  8: "grid-cols-8",
  9: "grid-cols-9",
  10: "grid-cols-10",
  11: "grid-cols-11",
  12: "grid-cols-12",
};

const GAP_CLASS: Record<GapValue, string> = {
  0: "gap-0",
  1: "gap-1",
  2: "gap-2",
  3: "gap-3",
  4: "gap-4",
  5: "gap-5",
  6: "gap-6",
  8: "gap-8",
  10: "gap-10",
  12: "gap-12",
};

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: ColsValue;
  gap?: GapValue;
}

const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ className, cols = 1, gap, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "grid",
          COLS_CLASS[cols],
          gap !== undefined && GAP_CLASS[gap],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Grid.displayName = "Grid";

type SpanValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | "full";

const SPAN_CLASS: Record<SpanValue, string> = {
  1: "col-span-1",
  2: "col-span-2",
  3: "col-span-3",
  4: "col-span-4",
  5: "col-span-5",
  6: "col-span-6",
  7: "col-span-7",
  8: "col-span-8",
  9: "col-span-9",
  10: "col-span-10",
  11: "col-span-11",
  12: "col-span-12",
  full: "col-span-full",
};

export interface GridItemProps extends React.HTMLAttributes<HTMLDivElement> {
  colSpan?: SpanValue;
}

const GridItem = React.forwardRef<HTMLDivElement, GridItemProps>(
  ({ className, colSpan, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(colSpan !== undefined && SPAN_CLASS[colSpan], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
GridItem.displayName = "GridItem";

export { Grid, GridItem };
