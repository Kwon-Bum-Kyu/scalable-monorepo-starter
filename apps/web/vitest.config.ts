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
          // guide는 비즈니스 로직 없는 정적 디자인 시스템 카탈로그 — 행동 테스트는 guide.test로 충분, 커버리지 강제 대상에서 제외
          "src/view/guide/**",
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
  }),
);
