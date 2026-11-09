"use client";

import { cn } from "@repo/ui/lib/utils";
import {
  CircleCheck,
  Info,
  LoaderCircle,
  OctagonX,
  TriangleAlert,
} from "lucide-react";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const TOAST_OFFSET = { top: "calc(var(--spacing-header) + 1rem)" } as const;

const Toaster = ({ className, ...props }: ToasterProps) => (
  <Sonner
    className={cn("toaster group", className)}
    position="top-center"
    closeButton
    offset={TOAST_OFFSET}
    mobileOffset={TOAST_OFFSET}
    icons={{
      success: <CircleCheck className="h-4 w-4" />,
      info: <Info className="h-4 w-4" />,
      warning: <TriangleAlert className="h-4 w-4" />,
      error: <OctagonX className="h-4 w-4" />,
      loading: <LoaderCircle className="h-4 w-4 animate-spin" />,
    }}
    toastOptions={{
      closeButtonAriaLabel: "토스트 닫기",
      classNames: {
        toast:
          "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border group-[.toaster]:border-gray-100 group-[.toaster]:rounded-lg group-[.toaster]:shadow-3-raised",
        description: "group-[.toast]:text-muted-foreground",
        actionButton:
          "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
        cancelButton:
          "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
      },
    }}
    {...props}
  />
);

export { Toaster };
