#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import {
  copyFileSync,
  existsSync,
  readFileSync,
  realpathSync,
  rmSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";

import { applyPlan } from "./applyPlan.mjs";
import { buildPlan } from "./buildPlan.mjs";
import { validateManifest } from "./manifest.mjs";
import { resolveProjectName } from "./projectName.mjs";
import { formatReport } from "./report.mjs";
import { resolveSelection } from "./resolveSelection.mjs";

const DIRTY_MESSAGE =
  "커밋하지 않은 변경이 있습니다. 커밋하거나 stash 한 뒤 다시 실행해 주세요.";
const ENV_NOTICE = ".env 파일이 이미 있어 그대로 두었습니다.";

/** @param {string[]} lines */
function writeLines(lines) {
  process.stdout.write(`${lines.join("\n")}\n`);
}

/** @param {string} rootDir */
function assertCleanRoot(rootDir) {
  if (!existsSync(path.join(rootDir, ".git"))) {
    return false;
  }
  const status = execFileSync("git", ["status", "--porcelain"], {
    cwd: rootDir,
    encoding: "utf8",
  });
  if (status.length > 0) {
    throw new Error(DIRTY_MESSAGE);
  }
  return true;
}

/** @param {string} rootDir */
function readRootManifest(rootDir) {
  const manifestPath = path.join(
    rootDir,
    "packages/create-scalable-monorepo-starter/starter.manifest.json",
  );
  return validateManifest(JSON.parse(readFileSync(manifestPath, "utf8")));
}

/** @param {string} rootDir @param {string[]} args */
export function runSetup(rootDir, args) {
  assertCleanRoot(rootDir);
  const { values } = parseArgs({
    args,
    options: {
      name: { type: "string" },
      "display-name": { type: "string" },
      apps: { type: "string" },
      "remove-examples": { type: "boolean", default: false },
      "dry-run": { type: "boolean", default: false },
    },
    strict: true,
  });
  if (!values.name) {
    throw new Error("--name 값이 필요합니다.");
  }
  if (!values.apps) {
    throw new Error("--apps 값이 필요합니다.");
  }

  const project = resolveProjectName(values.name);
  if (!project.ok) {
    throw new Error("유효한 프로젝트 이름이 아닙니다.");
  }
  const displayName = (values["display-name"] ?? project.displayName).trim();
  if (displayName.length === 0) {
    throw new Error("표시 이름은 비어 있을 수 없습니다.");
  }
  const selectedApps = values.apps
    .split(",")
    .map((appId) => appId.trim())
    .filter(Boolean);
  const manifest = readRootManifest(rootDir);
  const selection = resolveSelection(
    manifest,
    selectedApps,
    values["remove-examples"],
  );
  const input = {
    rootDir,
    manifest,
    selectedApps,
    removeExamples: values["remove-examples"],
    displayName,
    npmName: project.npmName,
  };
  const plan = buildPlan(input);
  const reportPlan = existsSync(path.join(rootDir, ".env"))
    ? { ...plan, notices: [...plan.notices, ENV_NOTICE] }
    : plan;

  if (values["dry-run"]) {
    writeLines(formatReport(reportPlan, true));
    return;
  }

  applyPlan({ ...input, plan });
  if (selection.removeExamples) {
    const script = path.join(rootDir, "scripts/remove-examples.mjs");
    const output = execFileSync(process.execPath, [script], {
      cwd: rootDir,
      encoding: "utf8",
    });
    process.stdout.write(output);
    rmSync(script, { force: true });
  }
  if (!existsSync(path.join(rootDir, ".env"))) {
    copyFileSync(
      path.join(rootDir, ".env.example"),
      path.join(rootDir, ".env"),
    );
  }
  writeLines(formatReport(reportPlan, false));
}

function main() {
  const rootDir = process.cwd();
  const hasRootGit = existsSync(path.join(rootDir, ".git"));
  try {
    runSetup(rootDir, process.argv.slice(2));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`${message}\n`);
    if (hasRootGit && message !== DIRTY_MESSAGE) {
      process.stderr.write("복구: git checkout . && git clean -fd\n");
    }
    process.exitCode = 1;
  }
}

if (
  process.argv[1] &&
  realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url))
) {
  main();
}
