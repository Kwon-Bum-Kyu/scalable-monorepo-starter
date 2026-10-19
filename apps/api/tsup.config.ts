import { defineConfig } from "tsup";

export default defineConfig({
  entry: { app: "src/app.ts" },
  format: ["esm"],
  platform: "node",
  target: "node22",
  outDir: "dist",
  clean: true,
  sourcemap: true,
  splitting: false,
  noExternal: ["@repo/shared-types"],
  tsconfig: "./tsconfig.json",
});
