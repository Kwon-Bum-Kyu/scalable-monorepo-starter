#!/usr/bin/env node
/**
 * 로컬 개발 부트스트랩.
 *
 * 1) docker compose up -d  — Postgres 컨테이너 기동
 * 2) pg_isready 폴링       — DB가 connection을 받을 준비가 될 때까지 대기
 * 3) prisma migrate deploy — 최신 마이그레이션 적용
 * 4) prisma generate       — Prisma Client 생성 (gitignore된 generated/prisma)
 *
 * 이 스크립트는 root 의 `npm run predev` 에서 호출되며, 모든 단계가 끝나면 종료한다.
 * 이후 turbo run dev 가 web/api/storybook + Prisma Studio 를 동시 구동한다.
 *
 * 환경 변수:
 *   SKIP_DEV_BOOTSTRAP=1   부트스트랩 전체 건너뛰기 (CI 등 외부에서 DB 제공 시)
 */

import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { waitForPostgres } from "./lib/wait-for-postgres.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const apiRoot = path.resolve(__dirname, "../apps/api");

if (process.env.SKIP_DEV_BOOTSTRAP === "1") {
  console.log("[dev-bootstrap] SKIP_DEV_BOOTSTRAP=1 → 건너뜁니다.");
  process.exit(0);
}

/**
 * @param {string} command
 * @param {string[]} args
 * @param {{cwd?: string, stdio?: import("node:child_process").StdioOptions}} [options]
 * @returns {Promise<{code: number}>}
 */
function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: options.cwd ?? apiRoot,
      stdio: options.stdio ?? "inherit",
      shell: false,
    });
    child.on("error", reject);
    child.on("exit", (code) => resolve({ code: code ?? 1 }));
  });
}

/**
 * docker compose exec 로 컨테이너 안에서 pg_isready 호출.
 * 컨테이너가 아직 안 떠 있으면 docker 자체가 non-zero 종료.
 *
 * @returns {Promise<{code: number}>}
 */
async function probePgReady() {
  return run(
    "docker",
    ["compose", "exec", "-T", "db", "pg_isready", "-U", "postgres", "-d", "myapp"],
    { stdio: "ignore" },
  );
}

async function main() {
  console.log("[dev-bootstrap] 1/4 docker compose up -d");
  const up = await run("docker", ["compose", "up", "-d"]);
  if (up.code !== 0) {
    throw new Error(`docker compose up 실패 (exit=${up.code})`);
  }

  console.log("[dev-bootstrap] 2/4 Postgres 준비 대기");
  const result = await waitForPostgres({
    exec: probePgReady,
    maxAttempts: 30,
    intervalMs: 1000,
    log: (msg) => console.log(`[dev-bootstrap]   ${msg}`),
  });
  console.log(`[dev-bootstrap]   준비 완료 (시도 ${result.attempts}회)`);

  console.log("[dev-bootstrap] 3/4 prisma migrate deploy");
  const migrate = await run("npx", ["prisma", "migrate", "deploy"]);
  if (migrate.code !== 0) {
    throw new Error(`prisma migrate deploy 실패 (exit=${migrate.code})`);
  }

  console.log("[dev-bootstrap] 4/4 prisma generate");
  const generate = await run("npx", ["prisma", "generate"]);
  if (generate.code !== 0) {
    throw new Error(`prisma generate 실패 (exit=${generate.code})`);
  }

  console.log("[dev-bootstrap] 완료");
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[dev-bootstrap] 실패: ${message}`);
  process.exit(1);
});
