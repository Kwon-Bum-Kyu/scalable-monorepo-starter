import { config as reactConfig } from "@repo/eslint-config/react";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...reactConfig,
  {
    files: ["src/components/ui/**/*.{ts,tsx}"],
    rules: {
      "react-refresh/only-export-components": [
        "warn",
        {
          allowConstantExport: true,
          allowExportNames: ["buttonVariants", "typographyVariants"],
        },
      ],
    },
  },
];
