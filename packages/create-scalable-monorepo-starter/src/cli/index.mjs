#!/usr/bin/env node

import { realpathSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import * as clack from "@clack/prompts";

import { readManifest } from "../setup/manifest.mjs";
import { resolveProjectName } from "../setup/projectName.mjs";
import { resolveSelection } from "../setup/resolveSelection.mjs";
import { buildCompletionLines } from "./completion.mjs";
import {
  FETCH_PROGRESS,
  fetchFailureLines,
  fetchTemplate,
  FetchTemplateError,
  readOwnVersion,
} from "./fetchTemplate.mjs";
import { buildHelpLines } from "./help.mjs";
import { parseCliArgs } from "./parseCliArgs.mjs";
import { InstallError, runPostSteps } from "./postSteps.mjs";
import { parseFailureLines, preflight } from "./preflight.mjs";
import { askApps, askProjectName, askRemoveExamples, autoAddedLines } from "./prompts.mjs";
import { runSetup } from "./runSetup.mjs";
import { createWorkDir } from "./workDir.mjs";

const CANCEL_TEXT = "취소했습니다. 만든 파일은 없습니다.";
const CANCEL_CODE = 130;
export const DRY_RUN_TEXT = "변경 계획입니다. 파일은 바꾸지 않습니다.";
const INSTALL_PROGRESS = "의존성을 설치하는 중입니다 (몇 분 걸릴 수 있습니다)";
const NPM_ERROR_TAIL = 10;

/**
 * 프롬프트 묶음은 테스트가 가짜를 주입하므로 형태만 느슨하게 둔다.
 * @typedef {any} PromptApi
 * @typedef {{ displayName: string, npmName: string, apps: string[], removeExamples: boolean }} Choice
 * @typedef {{
 *   args: import("./parseCliArgs.mjs").CliArgs, manifest: ReturnType<typeof readManifest>,
 *   prompts: PromptApi, isTTY: boolean, env: NodeJS.ProcessEnv, cwd: string,
 *   fetch: typeof fetchTemplate, session: ReturnType<typeof createSession>, version: string,
 * }} Ctx
 */

/** @param {string} name */
const installFailText = (name) =>
  `의존성 설치에 실패했습니다. cd ${name} 후 npm install 을 다시 실행해 주세요.`;

/** 사용자에게 줄 문장을 가진 실패. 문장은 그대로 stderr에 나온다. */
class CliFailure extends Error {
  /** @param {string[]} lines */
  constructor(lines) {
    super(lines.join("\n"));
    this.lines = lines;
  }
}

/** @param {string[]} lines */
const writeErr = (lines) => process.stderr.write(`${lines.join("\n")}\n`);
/** @param {string[]} lines */
const writeOut = (lines) => process.stdout.write(`${lines.join("\n")}\n`);

/**
 * 임시 폴더를 지운다. 지우지 못하면 경로를 알리는 줄을 돌려준다(더 시도하지 않는다).
 * @param {{ path: string, cleanup: () => void } | null} work
 * @returns {string[]}
 */
function cleanupLines(work) {
  try {
    work?.cleanup();
    return [];
  } catch {
    return [`임시 폴더를 지우지 못했습니다. 직접 지워 주세요: ${work?.path}`];
  }
}

/**
 * 중단 처리. 라이브러리의 회전 표시는 Ctrl+C를 가로채 process.exit(0)을 부르므로
 * exit 시점에 종료 코드를 바꾸고(동기 코드만 쓴다), 신호로 오는 중단은 직접 받는다.
 * @param {PromptApi} prompts
 */
function createSession(prompts) {
  const state = {
    message: CANCEL_TEXT,
    code: CANCEL_CODE,
    /** @type {{ cancel: (m: string) => void, clear: () => void } | null} */
    spinner: null,
    /** @type {{ path: string, cleanup: () => void, promote: () => void } | null} */
    workDir: null,
  };
  const abort = new AbortController();
  const onSigint = () => {
    abort.abort();
    if (state.spinner) state.spinner.cancel(state.message);
    else prompts.cancel(state.message);
    process.exit(state.code);
  };
  /** @param {number} code */
  const onExit = (code) => {
    abort.abort();
    if (state.spinner && code === 0) process.exitCode = state.code;
    const lines = cleanupLines(state.workDir);
    if (lines.length > 0) writeErr(lines);
  };
  process.once("SIGINT", onSigint);
  process.once("SIGTERM", onSigint);
  process.on("exit", onExit);
  return {
    state,
    signal: abort.signal,
    dispose() {
      process.off("SIGINT", onSigint);
      process.off("SIGTERM", onSigint);
      process.off("exit", onExit);
    },
  };
}

/**
 * 시간이 걸리는 단계. 터미널이면 회전 표시, 아니면 끝난 문장만 평문 한 줄로 낸다.
 * @template T
 * @param {{ prompts: PromptApi, isTTY: boolean, session: ReturnType<typeof createSession> }} ui
 * @param {{ start: string, done: string }} text
 * @param {() => Promise<T>} task
 * @returns {Promise<T>}
 */
async function withProgress(ui, { start, done }, task) {
  const { prompts, isTTY, session } = ui;
  if (!isTTY) {
    const result = await task();
    process.stdout.write(`◇  ${done}\n`);
    return result;
  }
  const spinner = prompts.spinner({ cancelMessage: session.state.message });
  session.state.spinner = spinner;
  spinner.start(start);
  try {
    const result = await task();
    spinner.stop(done);
    return result;
  } catch (error) {
    spinner.clear();
    throw error;
  } finally {
    session.state.spinner = null;
  }
}

/** 금방 끝나는 단계의 끝난 문장.
 * @param {PromptApi} prompts @param {boolean} isTTY @param {string} text */
function stepLine(prompts, isTTY, text) {
  if (isTTY) prompts.log.step(text);
  else process.stdout.write(`◇  ${text}\n`);
}

/**
 * 이름, 앱, examples를 정한다. 플래그가 있으면 묻지 않는다.
 * @param {Ctx} ctx
 * @returns {Promise<{ cancelled: true } | ({ cancelled: false } & Choice)>}
 */
async function interview({ args, manifest, prompts, isTTY, cwd }) {
  const canAsk = isTTY && !args.yes;
  const name =
    args.name === undefined
      ? await askProjectName({ prompts, cwd })
      : { cancelled: false, ...resolveProjectName(args.name) };
  if (name.cancelled) return { cancelled: true };

  let appIds = args.apps ?? manifest.apps.filter((app) => app.default).map((app) => app.id);
  if (args.apps === undefined && canAsk) {
    const asked = await askApps({ prompts, manifest });
    if (asked.cancelled) return { cancelled: true };
    appIds = asked.apps;
  }
  const resolved = resolveSelection(manifest, appIds, false);
  const apps = resolved.apps;
  if (!(args.apps === undefined && canAsk)) {
    for (const line of autoAddedLines(manifest, appIds, resolved.autoAdded)) prompts.log.info(line);
  }

  let removeExamples = args.examples === "remove";
  if (!apps.includes("api") || (args.examples === undefined && canAsk)) {
    const asked = await askRemoveExamples({ prompts, apps });
    if (asked.cancelled) return { cancelled: true };
    removeExamples = asked.removeExamples;
  }
  const selection = resolveSelection(manifest, apps, removeExamples);
  const { displayName, npmName } = /** @type {{ displayName: string, npmName: string }} */ (name);
  return { cancelled: false, displayName, npmName, apps: selection.apps, removeExamples: selection.removeExamples };
}

/**
 * 내려받기, setup, 이름 바꾸기까지. dry-run이면 계획만 보이고 폴더를 지운다.
 * @param {Ctx} ctx @param {Choice} choice @returns {Promise<{ done: boolean }>}
 */
async function createProject(ctx, choice) {
  const { args, manifest, prompts, isTTY, env, fetch, session, version } = ctx;
  const targetDir = path.resolve(ctx.cwd, choice.npmName);
  const work = createWorkDir(targetDir, choice.npmName);
  session.state.workDir = work;

  const ui = { prompts, isTTY, session };
  await withProgress(
    ui,
    { start: FETCH_PROGRESS.running(version), done: FETCH_PROGRESS.done(version) },
    () => fetch({ destDir: work.path, env }),
  );
  const removedApps = manifest.apps.map((app) => app.id).filter((id) => !choice.apps.includes(id));
  const setup = await runSetup({
    workDir: work.path,
    npmName: choice.npmName,
    displayName: choice.displayName,
    apps: choice.apps,
    removedApps,
    removeExamples: choice.removeExamples,
    dryRun: args.dryRun,
    signal: session.signal,
  });
  if (!setup.ok) throw new CliFailure(setup.output.trimEnd().split("\n"));

  if (args.dryRun) {
    prompts.log.info(DRY_RUN_TEXT);
    process.stdout.write(setup.output);
    const lines = cleanupLines(work);
    if (lines.length > 0) throw new CliFailure(lines);
    prompts.outro(`계획만 출력했습니다. ${choice.npmName} 폴더는 만들지 않았습니다.`);
    return { done: true };
  }
  for (const line of setup.lines) stepLine(prompts, isTTY, line);
  try {
    work.promote();
  } catch (error) {
    if (!["ENOTEMPTY", "EEXIST"].includes(/** @type {NodeJS.ErrnoException} */ (error).code ?? "")) throw error;
    throw new CliFailure([
      `"${choice.npmName}" 폴더가 그 사이에 만들어졌습니다. 다른 이름으로 다시 실행해 주세요.`,
    ]);
  }
  return { done: false };
}

/** 이름을 바꾼 뒤의 단계: 설치, git, 완료 안내. 폴더는 이미 대상 이름이다.
 * @param {Ctx} ctx @param {Choice} choice */
async function finishProject(ctx, choice) {
  const { args, manifest, prompts, isTTY, session } = ctx;
  const cwd = path.resolve(ctx.cwd, choice.npmName);
  const ui = { prompts, isTTY, session };

  // 설치 중의 Ctrl+C는 폴더를 남기고 설치 실패와 같은 문장, 종료 코드 1로 끝난다.
  session.state.message = installFailText(choice.npmName);
  session.state.code = 1;
  if (args.install) {
    await withProgress(ui, { start: INSTALL_PROGRESS, done: "의존성을 설치했습니다" }, () =>
      runPostSteps({ cwd, install: true, git: false, signal: session.signal }),
    );
  }
  if (args.git) {
    const { warnings } = await runPostSteps({ cwd, install: false, git: true, signal: session.signal });
    if (warnings.length > 0) prompts.log.warn(warnings[0]);
    else stepLine(prompts, isTTY, "git 저장소를 만들었습니다");
  }
  const [, ...lines] = buildCompletionLines({
    manifestApps: manifest.apps,
    selectedIds: choice.apps,
    targetName: choice.npmName,
    install: args.install,
    removeExamples: choice.removeExamples,
  });
  prompts.outro("완료했습니다.");
  writeOut(lines);
}

/** @param {unknown} error @param {string | undefined} npmName @returns {string[]} */
function failureLines(error, npmName) {
  if (error instanceof FetchTemplateError) return fetchFailureLines(error);
  if (error instanceof CliFailure) return error.lines;
  if (error instanceof InstallError) {
    return [...error.npmErrorLines.slice(-NPM_ERROR_TAIL), installFailText(String(npmName))];
  }
  return [error instanceof Error ? error.message : String(error)];
}

/** @param {Ctx} ctx @returns {Promise<number>} */
async function execute(ctx) {
  const { prompts, session } = ctx;
  let npmName;
  try {
    const choice = await interview(ctx);
    if (choice.cancelled) {
      prompts.cancel(CANCEL_TEXT);
      return CANCEL_CODE;
    }
    npmName = choice.npmName;
    const created = await createProject(ctx, choice);
    if (!created.done) await finishProject(ctx, choice);
    return 0;
  } catch (error) {
    const kept = error instanceof InstallError;
    writeErr([...failureLines(error, npmName), ...(kept ? [] : cleanupLines(session.state.workDir))]);
    return 1;
  }
}

/**
 * CLI 본체. 종료 코드를 돌려준다.
 * @param {{
 *   argv: string[], env?: NodeJS.ProcessEnv, cwd?: string, isTTY?: boolean,
 *   prompts?: PromptApi, fetch?: typeof fetchTemplate,
 * }} options
 * @returns {Promise<number>}
 */
export async function main({
  argv,
  env = process.env,
  cwd = process.cwd(),
  isTTY = Boolean(process.stdout.isTTY && process.stdin.isTTY),
  prompts = clack,
  fetch = fetchTemplate,
}) {
  const parsed = parseCliArgs(argv);
  if (!parsed.ok) {
    writeErr(parseFailureLines(parsed));
    return 1;
  }
  const args = parsed.values;
  const manifest = readManifest();
  const version = await readOwnVersion();
  if (args.help) return (writeOut(buildHelpLines(manifest.apps)), 0);
  if (args.version) return (writeOut([version]), 0);

  const check = preflight({
    args,
    apps: manifest.apps,
    isTTY,
    nodeVersion: process.version,
    userAgent: env.npm_config_user_agent,
    cwd,
  });
  if (!check.ok) {
    writeErr(check.lines);
    return check.exitCode;
  }

  prompts.intro(`scalable-monorepo-starter v${version}`);
  const devSource = env.STARTER_TEMPLATE_DIR || env.STARTER_TEMPLATE_REF;
  if (devSource) prompts.log.info(`개발용 템플릿을 사용합니다: ${devSource}`);
  const session = createSession(prompts);
  try {
    return await execute({ args, manifest, prompts, isTTY, env, cwd, fetch, session, version });
  } finally {
    session.dispose();
  }
}

const isEntry =
  process.argv[1] !== undefined &&
  realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url));

if (isEntry) {
  process.exitCode = await main({ argv: process.argv.slice(2) });
}
