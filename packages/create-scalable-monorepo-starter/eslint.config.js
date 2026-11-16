import { config as baseConfig } from "@repo/eslint-config/base";
import globals from "globals";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...baseConfig,
  {
    files: ["**/*.{mjs,ts}"],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    ignores: ["coverage/**"],
  },
];
