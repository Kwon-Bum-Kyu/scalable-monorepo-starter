import path from "node:path";

import { resolveProjectName } from "../setup/projectName.mjs";
import { checkTargetDir } from "./workDir.mjs";

// 가정값: T3-13의 통합 테스트가 고정한다(R-23).
const EXIT_CODE = 1;
const MIN_NODE = [22, 13];
const MIN_NPM = 10;

const NAME_RULE_LINES = [
  "영문 소문자, 숫자, 하이픈으로 바꿀 수 있는 이름으로 다시 실행해 주세요.",
  "예: npm create scalable-monorepo-starter@latest my-app",
];
const SCOPE_LINES = ["스코프(@org/)는 지원하지 않습니다. 이름만 넣어 다시 실행해 주세요."];
const NON_INTERACTIVE_LINES = [
  "대화형으로 실행할 수 없는 환경입니다.",
  "프로젝트 이름을 지정하고, --apps 를 지정하거나 --yes 를 붙여 주세요.",
];

/** @param {string[]} lines */
const fail = (lines) => ({ ok: /** @type {const} */ (false), lines, exitCode: EXIT_CODE });

/** @param {string} version "v22.13.0" 형식 */
function isSupportedNode(version) {
  const [major = 0, minor = 0] = version.replace(/^v/u, "").split(".").map(Number);
  return major > MIN_NODE[0] || (major === MIN_NODE[0] && minor >= MIN_NODE[1]);
}

/**
 * npm_config_user_agent로 확인할 수 있을 때만 검사한다. 알 수 없으면 null.
 * @param {string | undefined} userAgent
 */
function oldNpmVersion(userAgent) {
  const match = /^npm\/(\d+\.[^\s]+)/u.exec(userAgent ?? "");
  return match && Number(match[1].split(".")[0]) < MIN_NPM ? match[1] : null;
}

/** @param {string} name @param {string} cwd */
function checkName(name, cwd) {
  const resolved = resolveProjectName(name);
  if (!resolved.ok) {
    return fail(resolved.reason === "scope" ? SCOPE_LINES : NAME_RULE_LINES);
  }
  if (!checkTargetDir(path.resolve(cwd, resolved.npmName)).usable) {
    return fail([
      `"${resolved.npmName}" 폴더가 이미 있고 비어 있지 않습니다. 다른 이름으로 다시 실행해 주세요.`,
    ]);
  }
  return null;
}

/**
 * 질문 없이 판정할 수 있는 검증(PRD 4.4절 CLI 단계 1, 3). 통과하면 첫 줄을 출력해도 된다.
 * @param {{
 *   args: { name?: string, apps?: string[], yes: boolean },
 *   apps: readonly { id: string }[],
 *   isTTY: boolean,
 *   nodeVersion: string,
 *   userAgent?: string,
 *   cwd: string
 * }} input
 * @returns {{ ok: true } | { ok: false, lines: string[], exitCode: number }}
 */
export function preflight({ args, apps, isTTY, nodeVersion, userAgent, cwd }) {
  if (!isSupportedNode(nodeVersion)) {
    return fail([`Node.js ${MIN_NODE.join(".")} 이상이 필요합니다. 현재 버전: ${nodeVersion}`]);
  }
  const npmVersion = oldNpmVersion(userAgent);
  if (npmVersion) {
    return fail([`npm ${MIN_NPM} 이상이 필요합니다. 현재 버전: ${npmVersion}`]);
  }
  if (!isTTY && (args.name === undefined || (args.apps === undefined && !args.yes))) {
    return fail(NON_INTERACTIVE_LINES);
  }
  const known = apps.map((app) => app.id);
  const unknown = (args.apps ?? []).filter((id) => !known.includes(id));
  if (unknown.length > 0) {
    return fail([
      `알 수 없는 앱입니다: ${unknown.join(", ")}. 선택할 수 있는 앱: ${known.join(", ")}`,
    ]);
  }
  return (args.name === undefined ? null : checkName(args.name, cwd)) ?? { ok: true };
}
