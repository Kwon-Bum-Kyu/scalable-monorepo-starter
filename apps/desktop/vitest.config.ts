import { resolve } from "node:path";

import { reactConfig } from "@repo/vitest-config";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

// renderer 단위 테스트 전용 설정. electron-vite 설정(main/preload 포함)과 분리한다.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: /^@\//,
        replacement: `${resolve(import.meta.dirname, "src/renderer/src")}/`,
      },
      {
        find: /^@shared\//,
        replacement: `${resolve(import.meta.dirname, "src/shared")}/`,
      },
    ],
  },
  test: {
    ...reactConfig,
    name: "unit",
    include: ["tests/unit/**/*.test.{ts,tsx}"],
    exclude: ["tests/e2e/**", "node_modules/**"],
    setupFiles: ["./tests/unit/setup.ts"],
    coverage: {
      provider: "v8",
      include: ["src/renderer/src/**/*.{ts,tsx}"],
      exclude: [
        "src/renderer/src/**/*.d.ts",
        "src/renderer/src/**/types.ts",
        "src/renderer/src/**/types/**",
        "src/renderer/src/**/index.ts",
        "src/renderer/src/main.tsx",
        "src/renderer/src/App.tsx",
        "src/renderer/src/config/**",
        "src/renderer/src/routes/**",
        "src/renderer/src/utils/api.ts",
        // guide는 비즈니스 로직 없는 정적 디자인 시스템 카탈로그 — 커버리지 강제 대상 제외
        "src/renderer/src/view/guide/**",
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
