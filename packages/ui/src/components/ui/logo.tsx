import { cn } from "@repo/ui/lib/utils";
import * as React from "react";
import { Link as RouterLink } from "react-router-dom";

import lockupHorizontalSrc from "../../assets/brand/logo/lockup-horizontal.svg";

export interface LogoProps {
  to?: string;
  src?: string;
  alt?: string;
  className?: string;
  imgClassName?: string;
}

function Logo({
  to = "/",
  src = lockupHorizontalSrc,
  alt = "scalable-monorepo-starter",
  className,
  imgClassName,
}: LogoProps): React.JSX.Element {
  return (
    <RouterLink
      to={to}
      className={cn(
        "inline-flex items-center rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className,
      )}
    >
      <img
        src={src}
        alt={alt}
        className={cn("h-auto w-62.5 flex-none", imgClassName)}
      />
    </RouterLink>
  );
}

export { Logo };
