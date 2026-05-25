export const FONT_FAMILIES: ReadonlyArray<{
  token: string;
  family: string;
  className?: string;
  inlineFamilyVar?: string;
  sample: string;
}> = [
  {
    token: "--font-family-sans",
    family: "Open Sans (300–800, 12 face)",
    className: "font-sans",
    sample: "The quick brown fox jumps over the lazy dog",
  },
  {
    token: "--font-family-mono",
    family: "Roboto Mono (400/500/700)",
    className: "font-mono",
    sample: "const tokens = { sans: 'Open Sans' };",
  },
  {
    token: "--font-family-display",
    family: "Roboto Mono (display)",
    inlineFamilyVar: "--font-family-display",
    sample: "Display · KBK Monorepo Design",
  },
  {
    token: "--font-family-body-alt",
    family: "PT Sans (body-alt)",
    inlineFamilyVar: "--font-family-body-alt",
    sample: "본문 보조 패밀리. 긴 본문이나 기사 톤 콘텐츠에 사용한다.",
  },
];

export const TYPE_SCALE: ReadonlyArray<{
  token: string;
  size: string;
  utility: string;
  className: string;
}> = [
  {
    token: "--font-size-6xl",
    size: "56px",
    utility: "text-6xl",
    className: "text-6xl",
  },
  {
    token: "--font-size-5xl",
    size: "48px",
    utility: "text-5xl",
    className: "text-5xl",
  },
  {
    token: "--font-size-4xl",
    size: "40px",
    utility: "text-4xl",
    className: "text-4xl",
  },
  {
    token: "--font-size-3xl",
    size: "32px",
    utility: "text-3xl",
    className: "text-3xl",
  },
  {
    token: "--font-size-2xl",
    size: "24px",
    utility: "text-2xl",
    className: "text-2xl",
  },
  {
    token: "--font-size-xl",
    size: "20px",
    utility: "text-xl",
    className: "text-xl",
  },
  {
    token: "--font-size-lg",
    size: "18px",
    utility: "text-lg",
    className: "text-lg",
  },
  {
    token: "--font-size-base",
    size: "16px",
    utility: "text-base",
    className: "text-base",
  },
  {
    token: "--font-size-sm",
    size: "14px",
    utility: "text-sm",
    className: "text-sm",
  },
  {
    token: "--font-size-xs",
    size: "12px",
    utility: "text-xs",
    className: "text-xs",
  },
];

export const FONT_WEIGHTS: ReadonlyArray<{
  token: string;
  value: string;
  className: string;
}> = [
  {
    token: "--font-weight-regular",
    value: "400",
    className: "font-normal",
  },
  {
    token: "--font-weight-semibold",
    value: "600",
    className: "font-semibold",
  },
  { token: "--font-weight-bold", value: "700", className: "font-bold" },
];

export const SPACING_SCALE: ReadonlyArray<{
  token: string;
  size: string;
  utility: string;
  widthClassName: string;
}> = [
  { token: "p-1", size: "4px", utility: "p-1", widthClassName: "w-1" },
  { token: "p-2", size: "8px", utility: "p-2", widthClassName: "w-2" },
  { token: "p-3", size: "12px", utility: "p-3", widthClassName: "w-3" },
  { token: "p-4", size: "16px", utility: "p-4", widthClassName: "w-4" },
  { token: "p-6", size: "24px", utility: "p-6", widthClassName: "w-6" },
  { token: "p-8", size: "32px", utility: "p-8", widthClassName: "w-8" },
  { token: "p-12", size: "48px", utility: "p-12", widthClassName: "w-12" },
  {
    token: "p-16 (--spacing-16)",
    size: "64px",
    utility: "p-16",
    widthClassName: "w-16",
  },
  { token: "p-20", size: "80px", utility: "p-20", widthClassName: "w-20" },
];

export const RADIUS_SCALE: ReadonlyArray<{
  token: string;
  size: string;
  className: string;
}> = [
  { token: "--radius-none", size: "0", className: "rounded-none" },
  { token: "--radius-sm", size: "4px", className: "rounded-sm" },
  { token: "--radius-md", size: "6px", className: "rounded-md" },
  { token: "--radius-lg", size: "8px", className: "rounded-lg" },
  { token: "--radius-xl", size: "12px", className: "rounded-xl" },
  { token: "--radius-2xl", size: "24px", className: "rounded-2xl" },
  { token: "--radius-full", size: "9999px", className: "rounded-full" },
];

export const SHADOW_SCALE: ReadonlyArray<{
  token: string;
  level: string;
  description: string;
  className: string;
}> = [
  {
    token: "--shadow-1-subtle",
    level: "1",
    description: "tabs active · calendar dropdown",
    className: "shadow-1-subtle",
  },
  {
    token: "--shadow-2-default",
    level: "2",
    description: "card · 컨텐츠 그룹화 default",
    className: "shadow-2-default",
  },
  {
    token: "--shadow-3-raised",
    level: "3",
    description: "popover · select · tooltip",
    className: "shadow-3-raised",
  },
  {
    token: "--shadow-4-overlay",
    level: "4",
    description: "Dialog / Sheet / Drawer",
    className: "shadow-4-overlay",
  },
];
