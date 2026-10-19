import { cva, type VariantProps } from "class-variance-authority";

export const badgeVariants = cva(
  "inline-flex items-center gap-1.5 border px-2.5 py-1 text-xs font-semibold leading-4 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-gray-100 bg-gray-50 text-gray-700 hover:bg-gray-100/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        success:
          "border-transparent bg-system-green text-primary-foreground hover:bg-system-green/90",
        outline: "text-foreground",
        primary:
          "border-blue-100 bg-blue-50 text-blue-700 hover:bg-blue-100/80",
        warn:
          "border-system-warning bg-system-warning/15 text-gray-900 hover:bg-system-warning/25",
        error:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
      },
      shape: {
        pill: "rounded-full",
        sq: "rounded-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      shape: "pill",
    },
  },
);

export type BadgeVariantsProps = VariantProps<typeof badgeVariants>;
