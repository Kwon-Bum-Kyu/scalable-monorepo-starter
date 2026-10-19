import { resolve } from "node:path";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";

// electron-vite는 main / preload / renderer 세 영역을 독립적으로 빌드한다.
// renderer는 apps/web과 동일한 React 19 + Vite 7 + Tailwind v4 + @repo/ui 환경을 사용한다.
export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: [
        {
          find: /^@shared\//,
          replacement: `${resolve("src/shared")}/`,
        },
      ],
    },
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: [
        {
          find: /^@shared\//,
          replacement: `${resolve("src/shared")}/`,
        },
      ],
    },
  },
  renderer: {
    root: resolve("src/renderer"),
    // 루트 .env(단일 관리)에서 VITE_API_BASE_URL 등을 로드한다.
    envDir: resolve("../../"),
    resolve: {
      alias: [
        {
          find: /^@\//,
          replacement: `${resolve("src/renderer/src")}/`,
        },
        {
          // main/preload와 공유하는 IPC 채널 타입(src/shared)을 renderer에서 참조한다.
          find: /^@shared\//,
          replacement: `${resolve("src/shared")}/`,
        },
      ],
    },
    server: {
      port: 3100,
    },
    build: {
      rollupOptions: {
        input: {
          index: resolve("src/renderer/index.html"),
        },
      },
    },
    plugins: [react(), tailwindcss()],
  },
});
