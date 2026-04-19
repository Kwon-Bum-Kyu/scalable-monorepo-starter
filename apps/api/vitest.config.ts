import { nodeConfig } from "@repo/vitest-config";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    ...nodeConfig,
    name: "api",
    include: ["test/**/*.test.{ts,tsx}"],
    setupFiles: ["./test/setup.ts"],
    coverage: {
      provider: "v8",
      include: ["src/**/*.ts"],
      exclude: [
        "src/**/*.d.ts",
        "src/**/index.ts",
        "src/index.ts",
        "src/config/env.ts",
        "src/lib/prisma.ts",
        "src/generated/**",
        "prisma.config.ts",
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
