#!/usr/bin/env node

import { spawn } from "node:child_process";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import { waitForPostgres } from "./lib/wait-for-postgres.mjs";

const apiRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

/**
 * @param {string} command
 * @param {string[]} args
 * @param {{stdio?: import("node:child_process").StdioOptions}} [options]
 * @returns {Promise<{code: number}>}
 */
function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: apiRoot,
      stdio: options.stdio ?? "inherit",
      shell: false,
    });
    child.on("error", reject);
    child.on("exit", (code) => resolve({ code: code ?? 1 }));
  });
}

/**
 * @typedef {Object} PrepareDevOptions
 * @property {NodeJS.ProcessEnv | Record<string, string | undefined>} [env]
 * @property {typeof runCommand} [run]
 * @property {(message: string) => void} [log]
 * @property {(ms: number) => Promise<void>} [sleep]
 *
 * @param {PrepareDevOptions} [options]
 */
export async function prepareDev(options = {}) {
  const {
    env = process.env,
    run = runCommand,
    log = (message) => process.stdout.write(`${message}\n`),
    sleep,
  } = options;

  if (env.SKIP_DEV_BOOTSTRAP === "1") {
    log("[dev-prepare] SKIP_DEV_BOOTSTRAP=1: 건너뜁니다.");
    return;
  }

  log("[dev-prepare] 1/4 docker compose up -d");
  const up = await run("docker", ["compose", "up", "-d"]);
  if (up.code !== 0) {
    throw new Error(`docker compose up 실패 (exit=${up.code})`);
  }

  log("[dev-prepare] 2/4 Postgres 준비 대기");
  const result = await waitForPostgres({
    exec: () =>
      run(
        "docker",
        [
          "compose",
          "exec",
          "-T",
          "db",
          "pg_isready",
          "-U",
          "postgres",
          "-d",
          "myapp",
        ],
        { stdio: "ignore" },
      ),
    maxAttempts: 30,
    intervalMs: 1000,
    log: (message) => log(`[dev-prepare]   ${message}`),
    sleep,
  });
  log(`[dev-prepare]   준비 완료 (시도 ${result.attempts}회)`);

  log("[dev-prepare] 3/4 prisma migrate deploy");
  const migrate = await run("npx", ["prisma", "migrate", "deploy"]);
  if (migrate.code !== 0) {
    throw new Error(`prisma migrate deploy 실패 (exit=${migrate.code})`);
  }

  log("[dev-prepare] 4/4 prisma generate");
  const generate = await run("npx", ["prisma", "generate"]);
  if (generate.code !== 0) {
    throw new Error(`prisma generate 실패 (exit=${generate.code})`);
  }

  log("[dev-prepare] 완료");
}

if (
  process.argv[1] &&
  fileURLToPath(import.meta.url) === path.resolve(process.argv[1])
) {
  prepareDev().catch((error) => {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`[dev-prepare] 실패: ${message}\n`);
    process.exitCode = 1;
  });
}
