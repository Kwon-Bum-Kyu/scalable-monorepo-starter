import globals from "globals";
import { config as baseConfig } from "./base.js";

export const config = [
  ...baseConfig,
  {
    files: ["**/*.{ts,js}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.node,
    },
    rules: {
      // Node.js 환경에서는 console.log 사용 허용 (필요 시)
      "no-console": "off",
    },
  },
];