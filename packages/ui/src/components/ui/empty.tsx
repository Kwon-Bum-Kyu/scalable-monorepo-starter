import { cn } from "@repo/ui/lib/utils";
import * as React from "react";

export interface EmptyProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

const Empty = React.forwardRef<HTMLDivElement, EmptyProps>(
  ({ className, title, description, icon, action, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-center justify-center gap-3 py-12 text-center",
          className
        )}
        {...props}
      >
        {icon && <div className="text-muted-foreground">{icon}</div>}
        <div className="text-lg font-semibold text-foreground">{title}</div>
        {description && (
          <div className="text-sm text-muted-foreground">{description}</div>
        )}
        {action && <div className="mt-2">{action}</div>}
      </div>
    );
  }
);
Empty.displayName = "Empty";

export { Empty };
