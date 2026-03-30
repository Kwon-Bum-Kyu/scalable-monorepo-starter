import type { Environment } from "@repo/shared-types";

export type NodeEnvironment = Environment;

function resolveNodeEnvironment(): NodeEnvironment {
  const currentEnvironment = process.env.NODE_ENV;

  if (
    currentEnvironment === "development" ||
    currentEnvironment === "test" ||
    currentEnvironment === "production"
  ) {
    return currentEnvironment;
  }

  return "development";
}

export const appConfig = {
  name: "api",
  version: process.env.npm_package_version ?? "0.0.0",
  environment: resolveNodeEnvironment(),
};
