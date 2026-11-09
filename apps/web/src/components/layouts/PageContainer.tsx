import { cn } from "@repo/ui";
import type React from "react";

export interface PageContainerProps {
  className?: string;
  children: React.ReactNode;
}

export default function PageContainer({
  className,
  children,
}: PageContainerProps): React.JSX.Element {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-app px-4 tablet:px-8 desktop:px-page-x",
        className,
      )}
    >
      {children}
    </div>
  );
}
