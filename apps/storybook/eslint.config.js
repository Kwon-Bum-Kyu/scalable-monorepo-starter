import { config as reactConfig } from "@repo/eslint-config/react";
import storybook from "eslint-plugin-storybook";

/** @type {import("eslint").Linter.Config} */
export default [
  ...reactConfig,
  ...storybook.configs["flat/recommended"],
  {
    ignores: ["storybook-static/**", "node_modules/**"],
  },
];
