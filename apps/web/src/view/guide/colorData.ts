export interface ColorSwatch { name: string; value: string; className: string }

export const BLUE_PALETTE: ReadonlyArray<ColorSwatch> = [
  { name: "blue-50", value: "#e1e9ef", className: "bg-blue-50" },
  { name: "blue-100", value: "#b5c8d6", className: "bg-blue-100" },
  { name: "blue-200", value: "#84a3bb", className: "bg-blue-200" },
  { name: "blue-300", value: "#527ea0", className: "bg-blue-300" },
  { name: "blue-400", value: "#2d638b", className: "bg-blue-400" },
  { name: "blue-500", value: "#084777", className: "bg-blue-500" },
  { name: "blue-600", value: "#07406f", className: "bg-blue-600" },
  { name: "blue-700", value: "#063764", className: "bg-blue-700" },
  { name: "blue-800", value: "#042f5a", className: "bg-blue-800" },
  { name: "blue-900", value: "#022047", className: "bg-blue-900" },
];

export const GRAY_PALETTE: ReadonlyArray<ColorSwatch> = [
  { name: "gray-50", value: "#e7e7e6", className: "bg-gray-50" },
  { name: "gray-100", value: "#c2c2c1", className: "bg-gray-100" },
  { name: "gray-200", value: "#9a9a98", className: "bg-gray-200" },
  { name: "gray-300", value: "#72726f", className: "bg-gray-300" },
  { name: "gray-400", value: "#535350", className: "bg-gray-400" },
  { name: "gray-500", value: "#353531", className: "bg-gray-500" },
  { name: "gray-600", value: "#30302c", className: "bg-gray-600" },
  { name: "gray-700", value: "#282825", className: "bg-gray-700" },
  { name: "gray-800", value: "#22221f", className: "bg-gray-800" },
  { name: "gray-900", value: "#161613", className: "bg-gray-900" },
];

export interface SemanticAliasSwatch { name: string; target: string; className: string }
export const SEMANTIC_ALIASES: ReadonlyArray<SemanticAliasSwatch> = [
  { name: "text-primary", target: "gray-900", className: "bg-gray-900" },
  { name: "text-secondary", target: "gray-400", className: "bg-gray-400" },
  { name: "border", target: "gray-100", className: "bg-gray-100" },
  { name: "bg-secondary", target: "gray-50", className: "bg-gray-50" },
  { name: "interactive-default", target: "blue-500", className: "bg-blue-500" },
  { name: "focus-ring", target: "blue-500", className: "bg-blue-500" },
  { name: "state-error", target: "system-red", className: "bg-system-red" },
  { name: "state-success", target: "system-green", className: "bg-system-green" },
];
