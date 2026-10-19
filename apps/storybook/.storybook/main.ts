import type { StorybookConfig } from "@storybook/react-vite";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { fileURLToPath } from "url";
import { loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  framework: "@storybook/react-vite",

  // stories 경로: apps/storybook/stories 및 apps/web/src 컴포넌트 참조
  stories: ["../stories/**/*.stories.@(ts|tsx|js|jsx|mdx)"],

  // 정적 자산 dev 서버 매핑 — apps/web/public 을 SSOT 로 사용
  // (font-family-extension 슬러그 FR-FF-5 + Q-FF-B = 1, .claude/rules/monorepo-invariants.md §1 staticDirs 예외)
  staticDirs: ["../../web/public"],

  addons: ["@storybook/addon-docs", "@storybook/addon-a11y"],

  core: {
    builder: "@storybook/builder-vite",
  },

  typescript: {
    reactDocgen: "react-docgen-typescript",
  },

  env: (config) => {
    const rootDir = path.resolve(__dirname, "../../..");
    const env = loadEnv("development", rootDir, "");
    return {
      ...config,
      ...env,
    };
  },

  async viteFinal(config) {
    const rootDir = path.resolve(__dirname, "../../..");
    const env = loadEnv("development", rootDir, "VITE_");

    // 기존 alias를 배열로 변환 (있다면)
    const existingAlias = config.resolve?.alias;
    const existingAliasArray = Array.isArray(existingAlias)
      ? existingAlias
      : existingAlias
        ? Object.entries(existingAlias).map(([find, replacement]) => ({
            find,
            replacement: replacement as string,
          }))
        : [];

    return {
      ...config,
      plugins: [
        ...(config.plugins || []),
        tailwindcss(),
        // storybook의 tsconfig.json을 사용 (stories의 @/common 등 해석)
        tsconfigPaths({
          root: path.resolve(__dirname, ".."),
        }),
        // apps/web의 tsconfig도 사용 (web 컴포넌트 내부 imports 해석)
        tsconfigPaths({
          root: path.resolve(__dirname, "../../web"),
          projects: [path.resolve(__dirname, "../../web/tsconfig.app.json")],
        }),
      ],
      resolve: {
        ...config.resolve,
        alias: [
          // 더 구체적인 alias를 먼저 정의 (prefix 매칭 문제 방지)
          {
            find: "@/common",
            replacement: path.resolve(
              __dirname,
              "../../web/src/components/common",
            ),
          },
          {
            find: /^@\//,
            replacement: path.resolve(__dirname, "../../web/src") + "/",
          },
          ...existingAliasArray,
        ],
      },
      define: {
        ...config.define,
        ...Object.keys(env).reduce(
          (acc, key) => {
            acc[`import.meta.env.${key}`] = JSON.stringify(env[key]);
            return acc;
          },
          {} as Record<string, string>,
        ),
      },
    };
  },
};

export default config;
