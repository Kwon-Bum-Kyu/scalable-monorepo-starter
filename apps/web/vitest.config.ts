import { reactConfig } from "@repo/vitest-config";
import { defineConfig, mergeConfig } from "vitest/config";

import viteConfig from "./vite.config";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      ...reactConfig,
      name: "unit",
      include: ["tests/unit/**/*.test.{ts,tsx}"],
      exclude: ["tests/e2e/**", "node_modules/**"],
      setupFiles: ["./tests/unit/setup.ts"],
      coverage: {
        provider: "v8",
        include: ["src/**/*.{ts,tsx}"],
        exclude: [
          "src/**/*.d.ts",
          "src/**/types.ts",
          "src/**/types/**",
          "src/**/index.ts",
          "src/main.tsx",
          "src/App.tsx",
          "src/config/**",
          "src/routes/**",
          "src/utils/api.ts",
        ],
        thresholds: {
          lines: 80,
          statements: 80,
          functions: 80,
          branches: 80,
        },
      },
    },
  })
);
