export const FONT_FAMILIES = [
  { token: "font-sans", family: "Open Sans", className: "font-sans" },
  { token: "font-mono", family: "Roboto Mono", className: "font-mono" },
  { token: "font-display", family: "Roboto Mono", className: "font-display" },
  { token: "font-body-alt", family: "PT Sans", className: "font-body-alt" },
] as const;
export const FONT_WEIGHTS = [
  { token: "font-weight-regular", value: "400", className: "font-normal" },
  { token: "font-weight-medium", value: "500", className: "font-medium" },
  { token: "font-weight-semibold", value: "600", className: "font-semibold" },
  { token: "font-weight-bold", value: "700", className: "font-bold" },
] as const;
export const TYPE_SCALE = [
  { token: "text-xs", size: "12", lineHeight: "16", className: "text-xs" },
  { token: "text-sm", size: "14", lineHeight: "20", className: "text-sm" },
  { token: "text-base", size: "16", lineHeight: "24", className: "text-base" },
  { token: "text-lg", size: "18", lineHeight: "28", className: "text-lg" },
  { token: "text-xl", size: "20", lineHeight: "32", className: "text-xl" },
  { token: "text-2xl", size: "24", lineHeight: "40", className: "text-2xl" },
  { token: "text-3xl", size: "32", lineHeight: "48", className: "text-3xl" },
  { token: "text-4xl", size: "40", lineHeight: "56", className: "text-4xl" },
  { token: "text-5xl", size: "48", lineHeight: "64", className: "text-5xl" },
  { token: "text-6xl", size: "56", lineHeight: "72", className: "text-6xl" },
] as const;
export const SPACING_TOKENS = [
  { token: "spacing-16", value: "64px", barClassName: "w-16" },
  { token: "spacing-header", value: "64px", barClassName: "w-header" },
  { token: "spacing-page-x", value: "72px", barClassName: "w-page-x" },
  { token: "spacing-logo-h", value: "40px", barClassName: "w-logo-h" },
  { token: "container-app", value: "1280px", barClassName: "w-full" },
] as const;
export const RADIUS_SCALE = [
  { token: "radius-none", value: "0", className: "rounded-none" },
  { token: "radius-sm", value: "4px", className: "rounded-sm" },
  { token: "radius-md", value: "6px", className: "rounded-md" },
  { token: "radius-lg", value: "8px", className: "rounded-lg" },
  { token: "radius-xl", value: "12px", className: "rounded-xl" },
  { token: "radius-2xl", value: "24px", className: "rounded-2xl" },
  { token: "radius-full", value: "9999px", className: "rounded-full" },
] as const;
export const SHADOW_SCALE = [
  { token: "shadow-0-subtle", note: "외곽선 수준", className: "shadow-0-subtle" },
  { token: "shadow-1-subtle", note: null, className: "shadow-1-subtle" },
  { token: "shadow-2-default", note: "card", className: "shadow-2-default" },
  { token: "shadow-3-raised", note: "popover · select · tooltip", className: "shadow-3-raised" },
  { token: "shadow-4-overlay", note: "dialog · sheet", className: "shadow-4-overlay" },
] as const;
export const BREAKPOINT_BARS = [
  { name: "mobile", value: "640px", barClassName: "w-1/3" },
  { name: "tablet", value: "768px", barClassName: "w-2/5" },
  { name: "desktop", value: "1280px", barClassName: "w-2/3" },
  { name: "wide", value: "1920px", barClassName: "w-full" },
] as const;
