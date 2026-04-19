import * as React from "react";
import { Link as RouterLink } from "react-router-dom";

import { cn } from "@repo/ui/lib/utils";

export interface LogoProps {
  to?: string;
  src?: string;
  alt?: string;
  className?: string;
  imgClassName?: string;
}

function Logo({
  to = "/",
  src = "/logo.png",
  alt = "Logo",
  className,
  imgClassName,
}: LogoProps): React.JSX.Element {
  return (
    <RouterLink to={to} className={cn("inline-flex items-center", className)}>
      <img
        src={src}
        alt={alt}
        className={cn("h-10 w-40 flex-none object-contain", imgClassName)}
      />
    </RouterLink>
  );
}

export { Logo };
