#!/usr/bin/env node
/**
 * Examples 도메인 제거 스크립트.
 *
 * 사용법:
 *   node scripts/remove-examples.mjs            실제 제거 실행
 *   node scripts/remove-examples.mjs --dry-run  변경 예정 항목 출력만
 *
 * 처리 항목:
 *   - apps/api/src/routes/v1/examples.router.ts
 *   - apps/api/src/{controllers,services,schemas,repositories}/examples
 *   - apps/api/src/config/examples-feature.ts
 *   - apps/api/test 의 examples 관련 unit/integration 파일
 *   - apps/api/prisma/schema.prisma 의 EXAMPLES_START/END 블록
 *   - apps/api/src/routes/v1/index.ts 의 examples 마운트 코드
 *   - apps/web/src/services/examples.ts
 *   - apps/web/src/view/examples
 *   - apps/web/tests/unit 의 examples services/view 테스트
 *   - apps/web/src/routes/index.tsx 의 /examples 라우트
 */

import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const dryRun = process.argv.includes("--dry-run");

const targets = {
  paths: [
    "apps/api/src/routes/v1/examples.router.ts",
    "apps/api/src/controllers/examples",
    "apps/api/src/services/examples",
    "apps/api/src/schemas/examples",
    "apps/api/src/repositories/examples",
    "apps/api/src/config/examples-feature.ts",
    "apps/api/test/unit/controllers/examples",
    "apps/api/test/unit/services/examples",
    "apps/api/test/unit/schemas/examples",
    "apps/api/test/unit/repositories/examples",
    "apps/api/test/unit/config/examples-feature.test.ts",
    "apps/api/test/integration/examples.test.ts",
    "apps/web/src/services/examples.ts",
    "apps/web/src/view/examples",
    "apps/web/tests/unit/services/examples.test.ts",
    "apps/web/tests/unit/services/examplesHooks.test.tsx",
    "apps/web/tests/unit/view/examples",
  ],
  schemaFile: "apps/api/prisma/schema.prisma",
  routerIndexFile: "apps/api/src/routes/v1/index.ts",
  webRouterFile: "apps/web/src/routes/index.tsx",
};

const SCHEMA_BLOCK_REGEX = /\n?\/\/\s*>>> EXAMPLES_START[\s\S]*?\/\/\s*<<< EXAMPLES_END\n?/m;

function removePath(rel) {
  const abs = path.join(repoRoot, rel);
  if (!existsSync(abs)) {
    return { rel, action: "skip", reason: "missing" };
  }
  if (dryRun) {
    return { rel, action: "would-remove" };
  }
  rmSync(abs, { recursive: true, force: true });
  return { rel, action: "removed" };
}

function stripSchemaBlock() {
  const abs = path.join(repoRoot, targets.schemaFile);
  if (!existsSync(abs)) {
    return { rel: targets.schemaFile, action: "skip", reason: "missing" };
  }
  const original = readFileSync(abs, "utf8");
  if (!SCHEMA_BLOCK_REGEX.test(original)) {
    return { rel: targets.schemaFile, action: "skip", reason: "no-block" };
  }
  const next = original.replace(SCHEMA_BLOCK_REGEX, "\n");
  if (dryRun) {
    return { rel: targets.schemaFile, action: "would-edit-schema" };
  }
  writeFileSync(abs, next);
  return { rel: targets.schemaFile, action: "edited" };
}

function stripApiRouterMount() {
  const abs = path.join(repoRoot, targets.routerIndexFile);
  if (!existsSync(abs)) {
    return { rel: targets.routerIndexFile, action: "skip", reason: "missing" };
  }
  const original = readFileSync(abs, "utf8");

  const next = original
    .replace(/^import \{ env \} from "\.\.\/\.\.\/config\/env";\n/m, "")
    .replace(
      /^import \{ isExamplesEnabled \} from "\.\.\/\.\.\/config\/examples-feature";\n/m,
      "",
    )
    .replace(/^import \{ logger \} from "\.\.\/\.\.\/lib\/logger";\n/m, "")
    .replace(
      /^import \{ examplesRouter \} from "\.\/examples\.router";\n/m,
      "",
    )
    .replace(
      /\nif \(isExamplesEnabled\(env\)\) \{\n\s*v1Router\.use\("\/examples", examplesRouter\);\n\} else \{\n\s*logger\.info\("examples router disabled"\);\n\}\n/,
      "\n",
    );

  if (next === original) {
    return { rel: targets.routerIndexFile, action: "skip", reason: "no-change" };
  }
  if (dryRun) {
    return { rel: targets.routerIndexFile, action: "would-edit-router" };
  }
  writeFileSync(abs, next);
  return { rel: targets.routerIndexFile, action: "edited" };
}

function stripWebRoute() {
  const abs = path.join(repoRoot, targets.webRouterFile);
  if (!existsSync(abs)) {
    return { rel: targets.webRouterFile, action: "skip", reason: "missing" };
  }
  const original = readFileSync(abs, "utf8");
  const next = original
    .replace(/^.*ExamplesPage.*\n/gm, "")
    .replace(/^.*\/examples.*\n/gm, "");
  if (next === original) {
    return { rel: targets.webRouterFile, action: "skip", reason: "no-change" };
  }
  if (dryRun) {
    return { rel: targets.webRouterFile, action: "would-edit-web-route" };
  }
  writeFileSync(abs, next);
  return { rel: targets.webRouterFile, action: "edited" };
}

const results = [];
for (const rel of targets.paths) {
  results.push(removePath(rel));
}
results.push(stripSchemaBlock());
results.push(stripApiRouterMount());
results.push(stripWebRoute());

const summary = results.reduce(
  (acc, r) => {
    acc[r.action] = (acc[r.action] ?? 0) + 1;
    return acc;
  },
  {},
);

process.stdout.write(
  `${dryRun ? "[dry-run] " : ""}examples 제거 결과: ${JSON.stringify(summary)}\n`,
);
for (const r of results) {
  process.stdout.write(
    `  - ${r.action.padEnd(20)} ${r.rel}${r.reason ? ` (${r.reason})` : ""}\n`,
  );
}

if (!dryRun) {
  process.stdout.write(
    "\n다음 단계: prisma migrate (drop_examples_table) 생성 후 npm run typecheck/test 실행을 권장합니다.\n",
  );
}
