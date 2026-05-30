import { config as reactConfig } from "@repo/eslint-config/react";

/** @type {import("eslint").Linter.Config} */
export default [
  ...reactConfig,
  {
    // main/preload/설정 파일은 React 컴포넌트 모듈이 아니므로 fast-refresh 규칙 제외
    files: [
      "src/main/**/*.ts",
      "src/preload/**/*.ts",
      "electron.vite.config.ts",
      "vitest.config.ts",
    ],
    rules: {
      "react-refresh/only-export-components": "off",
    },
  },
  {
    ignores: ["out/**", "dist/**"],
  },
];
