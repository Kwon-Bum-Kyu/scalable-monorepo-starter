import { cva, type VariantProps } from "class-variance-authority";

export const tabsListVariants = cva(
  "inline-flex items-center text-muted-foreground",
  {
    variants: {
      variant: {
        underline:
          "h-auto gap-6 border-b border-gray-100 rounded-none bg-transparent p-0",
        pill: "h-auto gap-2 bg-transparent p-0 rounded-none",
        boxed:
          "h-10 justify-center rounded-lg bg-muted p-1",
      },
    },
    defaultVariants: {
      variant: "underline",
    },
  },
);

export const tabsTriggerVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        underline:
          "relative px-0 py-2.5 text-gray-400 data-[state=active]:text-blue-700 data-[state=active]:after:content-[''] data-[state=active]:after:absolute data-[state=active]:after:left-0 data-[state=active]:after:right-0 data-[state=active]:after:-bottom-px data-[state=active]:after:h-0.5 data-[state=active]:after:bg-blue-500",
        pill:
          "rounded-full px-3.5 py-1.5 text-gray-400 border border-gray-100 data-[state=active]:bg-blue-500 data-[state=active]:text-primary-foreground data-[state=active]:border-blue-500",
        boxed:
          "rounded-md px-3 py-1.5 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-1-subtle",
      },
    },
    defaultVariants: {
      variant: "boxed",
    },
  },
);

export type TabsListVariantsProps = VariantProps<typeof tabsListVariants>;
export type TabsTriggerVariantsProps = VariantProps<typeof tabsTriggerVariants>;
