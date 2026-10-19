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
      // 목표 100% (필요 이상의 테스트는 작성하지 않음). CI 게이트는 80%로 유지해 점진적으로 수렴.
      thresholds: {
        lines: 80,
        statements: 80,
        functions: 80,
        branches: 80,
      },
    },
  },
});
