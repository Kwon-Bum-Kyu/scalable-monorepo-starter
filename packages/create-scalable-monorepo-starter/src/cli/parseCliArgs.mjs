import { parseArgs } from "node:util";

/**
 * PRD 4.1절 플래그 표. `--help`(T3-11)도 이 표를 쓴다.
 * `usage`는 도움말의 첫 열 문구, `meaning`과 `defaultText`는 표의 문구 그대로다.
 * `defaultText`가 null이면 호출자가 매니페스트에서 읽은 실제 값으로 채운다(`--apps`).
 * @type {ReadonlyArray<{ flags: readonly string[], usage: string, meaning: string, defaultText: string | null }>}
 */
export const FLAG_TABLE = Object.freeze([
  { flags: [], usage: "[이름]", meaning: "프로젝트 이름", defaultText: "없음. 비대화형에서는 필수" },
  { flags: ["--apps"], usage: "--apps <id,...>", meaning: "설치할 앱 id 목록", defaultText: null },
  { flags: ["--remove-examples", "--keep-examples"], usage: "--remove-examples\n--keep-examples", meaning: "examples 처리", defaultText: "남겨 둔다" },
  { flags: ["--yes"], usage: "--yes", meaning: "묻지 않고 기본값으로 진행", defaultText: "꺼짐" },
  { flags: ["--no-install"], usage: "--no-install", meaning: "npm install 생략", defaultText: "설치한다" },
  { flags: ["--no-git"], usage: "--no-git", meaning: "git init 생략", defaultText: "만든다" },
  { flags: ["--dry-run"], usage: "--dry-run", meaning: "변경 계획만 출력", defaultText: "꺼짐" },
  { flags: ["--help", "--version"], usage: "--help, --version", meaning: "도움말, 버전", defaultText: "" },
]);

const OPTIONS = /** @type {const} */ ({
  apps: { type: "string" },
  "remove-examples": { type: "boolean" },
  "keep-examples": { type: "boolean" },
  yes: { type: "boolean" },
  "no-install": { type: "boolean" },
  "no-git": { type: "boolean" },
  "dry-run": { type: "boolean" },
  help: { type: "boolean" },
  version: { type: "boolean" },
});

/**
 * @typedef {{
 *   name: string | undefined,
 *   apps: string[] | undefined,
 *   examples: "remove" | "keep" | undefined,
 *   yes: boolean, install: boolean, git: boolean,
 *   dryRun: boolean, help: boolean, version: boolean,
 * }} CliArgs
 * @typedef {{ ok: true, values: CliArgs } |
 *   { ok: false, reason: "invalid-option", message: string } |
 *   { ok: false, reason: "too-many-positionals" | "conflicting-examples" }} ParseResult
 */

/**
 * 인자 해석만 한다. 비TTY 필수값 판정과 앱 id 검증은 호출자가 한다.
 * @param {readonly string[]} argv
 * @returns {ParseResult}
 */
export function parseCliArgs(argv) {
  let parsed;
  try {
    parsed = parseArgs({ args: [...argv], options: OPTIONS, allowPositionals: true });
  } catch (error) {
    return { ok: false, reason: "invalid-option", message: /** @type {Error} */ (error).message };
  }
  const { values, positionals } = parsed;

  if (positionals.length > 1) {
    return { ok: false, reason: "too-many-positionals" };
  }
  if (values["remove-examples"] && values["keep-examples"]) {
    return { ok: false, reason: "conflicting-examples" };
  }

  /** @type {CliArgs["examples"]} */
  let examples;
  if (values["remove-examples"]) examples = "remove";
  if (values["keep-examples"]) examples = "keep";

  return {
    ok: true,
    values: {
      name: positionals[0],
      apps: values.apps?.split(",").map((id) => id.trim()).filter((id) => id !== ""),
      examples,
      yes: values.yes ?? false,
      install: !values["no-install"],
      git: !values["no-git"],
      dryRun: values["dry-run"] ?? false,
      help: values.help ?? false,
      version: values.version ?? false,
    },
  };
}
