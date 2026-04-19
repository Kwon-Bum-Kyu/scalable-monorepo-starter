import { resolve } from "node:path";

import { reactConfig } from "@repo/vitest-config";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: /^@repo\/ui\/lib\/utils$/,
        replacement: resolve(__dirname, "src/lib/utils.ts"),
      },
      {
        find: /^@repo\/ui\/components\/(.*)$/,
        replacement: resolve(__dirname, "src/components/ui/$1"),
      },
      {
        find: /^@repo\/ui\/hooks\/(.*)$/,
        replacement: resolve(__dirname, "src/hooks/$1"),
      },
      {
        find: /^@repo\/ui$/,
        replacement: resolve(__dirname, "src/index.ts"),
      },
    ],
  },
  test: {
    ...reactConfig,
    name: "ui",
    include: ["tests/**/*.test.{ts,tsx}"],
    exclude: ["node_modules/**"],
    setupFiles: ["./tests/setup.ts"],
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/**/*.d.ts",
        "src/**/types.ts",
        "src/**/types.tsx",
        "src/**/index.ts",
        "src/styles/**",
        "src/components/Navigation/**",
      ],
      thresholds: {
        lines: 80,
        statements: 80,
        functions: 80,
        branches: 80,
      },
    },
  },
});
