import { nodeConfig } from "@repo/vitest-config";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    ...nodeConfig,
    name: "create-scalable-monorepo-starter",
    include: ["tests/**/*.test.ts"],
    coverage: {
      provider: "v8",
      include: ["src/**/*.mjs"],
      thresholds: {
        lines: 80,
        statements: 80,
        functions: 80,
        branches: 80,
      },
    },
  },
});
