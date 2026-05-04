import { cva, type VariantProps } from "class-variance-authority";

export const cardVariants = cva(
  "rounded-lg bg-card text-card-foreground",
  {
    variants: {
      variant: {
        elev: "border-transparent shadow-2-default",
        flat: "border border-border shadow-none",
        subtle: "border border-border shadow-0-subtle",
      },
    },
    defaultVariants: {
      variant: "elev",
    },
  },
);

export type CardVariantsProps = VariantProps<typeof cardVariants>;
