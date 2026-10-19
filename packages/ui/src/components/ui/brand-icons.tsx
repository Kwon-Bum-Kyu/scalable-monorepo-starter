import type { LucideIcon, LucideProps } from "lucide-react";
import * as React from "react";

function createBrandIcon(
  displayName: string,
  viewBox: string,
  paths: readonly string[],
): LucideIcon {
  const Icon = React.forwardRef<SVGSVGElement, LucideProps>(
    ({ size = 24, color = "currentColor", strokeWidth, ...props }, ref) => {
      void strokeWidth;
      return (
        <svg
          ref={ref}
          xmlns="http://www.w3.org/2000/svg"
          width={size}
          height={size}
          viewBox={viewBox}
          fill={color}
          aria-hidden="true"
          focusable="false"
          {...props}
        >
          {paths.map((d) => (
            <path key={d} d={d} />
          ))}
        </svg>
      );
    },
  );
  Icon.displayName = displayName;
  return Icon as unknown as LucideIcon;
}

export const GithubBrandIcon = createBrandIcon("GithubBrandIcon", "0 0 24 24", [
  "M12 .5C5.73.5.83 5.4.83 11.67c0 4.92 3.19 9.09 7.62 10.56.56.1.76-.24.76-.54 0-.27-.01-1.16-.02-2.1-3.1.67-3.76-1.31-3.76-1.31-.5-1.27-1.22-1.61-1.22-1.61-1-.68.08-.67.08-.67 1.11.08 1.69 1.14 1.69 1.14.99 1.69 2.59 1.2 3.22.91.1-.72.39-1.2.7-1.48-2.47-.28-5.07-1.24-5.07-5.5 0-1.21.43-2.2 1.14-2.98-.11-.28-.5-1.41.11-2.94 0 0 .93-.3 3.05 1.14.89-.25 1.85-.37 2.8-.37.95 0 1.91.12 2.8.37 2.12-1.44 3.05-1.14 3.05-1.14.61 1.53.22 2.66.11 2.94.71.78 1.14 1.77 1.14 2.98 0 4.27-2.6 5.22-5.08 5.5.4.34.75 1.02.75 2.05 0 1.48-.01 2.67-.01 3.03 0 .3.2.65.77.54 4.42-1.48 7.61-5.64 7.61-10.56C23.17 5.4 18.27.5 12 .5z",
]);

export const LinkedinBrandIcon = createBrandIcon(
  "LinkedinBrandIcon",
  "0 0 24 24",
  [
    "M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.28 2.38 4.28 5.47v6.27zM5.34 7.43a2.07 2.07 0 1 1 0-4.15 2.07 2.07 0 0 1 0 4.15zm1.78 13.02H3.56V9h3.56v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.21 0 22.22 0h.01z",
  ],
);
