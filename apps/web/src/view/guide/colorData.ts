export type ColorRow = { name: string; value: string; className: string };

export const BLUE_PALETTE: ReadonlyArray<ColorRow> = [
  { name: "--color-blue-50", value: "#e1e9ef", className: "bg-blue-50" },
  { name: "--color-blue-100", value: "#b5c8d6", className: "bg-blue-100" },
  { name: "--color-blue-200", value: "#84a3bb", className: "bg-blue-200" },
  { name: "--color-blue-300", value: "#527ea0", className: "bg-blue-300" },
  { name: "--color-blue-400", value: "#2d638b", className: "bg-blue-400" },
  { name: "--color-blue-500", value: "#084777", className: "bg-blue-500" },
  { name: "--color-blue-600", value: "#07406f", className: "bg-blue-600" },
  { name: "--color-blue-700", value: "#063764", className: "bg-blue-700" },
  { name: "--color-blue-800", value: "#042f5a", className: "bg-blue-800" },
  { name: "--color-blue-900", value: "#022047", className: "bg-blue-900" },
];

export const GRAY_PALETTE: ReadonlyArray<ColorRow> = [
  { name: "--color-gray-50", value: "#e7e7e6", className: "bg-gray-50" },
  { name: "--color-gray-100", value: "#c2c2c1", className: "bg-gray-100" },
  { name: "--color-gray-200", value: "#9a9a98", className: "bg-gray-200" },
  { name: "--color-gray-300", value: "#72726f", className: "bg-gray-300" },
  { name: "--color-gray-400", value: "#535350", className: "bg-gray-400" },
  { name: "--color-gray-500", value: "#353531", className: "bg-gray-500" },
  { name: "--color-gray-600", value: "#30302c", className: "bg-gray-600" },
  { name: "--color-gray-700", value: "#282825", className: "bg-gray-700" },
  { name: "--color-gray-800", value: "#22221f", className: "bg-gray-800" },
  { name: "--color-gray-900", value: "#161613", className: "bg-gray-900" },
];

export const SYSTEM_COLORS: ReadonlyArray<ColorRow> = [
  {
    name: "--color-system-red",
    value: "#c2050b",
    className: "bg-system-red",
  },
  {
    name: "--color-system-green",
    value: "#07b46f",
    className: "bg-system-green",
  },
  {
    name: "--color-system-warning",
    value: "#f9a80a",
    className: "bg-system-warning",
  },
  {
    name: "--color-system-info",
    value: "#2196f3",
    className: "bg-system-info",
  },
  {
    name: "--color-system-white",
    value: "#ffffff",
    className: "bg-system-white border border-border",
  },
];
