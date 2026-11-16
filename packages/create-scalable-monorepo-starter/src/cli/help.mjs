import { displayWidth } from "./displayWidth.mjs";
import { FLAG_TABLE } from "./parseCliArgs.mjs";

const INDENT = "  ";
const FIRST_COLUMN_GAP = 6;
const MEANING_COLUMN_GAP = 3;

/** @param {string} text @param {number} width */
const pad = (text, width) => text + " ".repeat(Math.max(0, width - displayWidth(text)));

/**
 * `--help` 화면(PRD 4.1절)의 줄을 만든다. 의미와 기본값은 FLAG_TABLE의 문구이고,
 * `--apps`의 기본값과 앱 목록은 매니페스트에서 읽은 값이다.
 * @param {{ id: string, default: boolean }[]} manifestApps
 * @returns {string[]}
 */
export function buildHelpLines(manifestApps) {
  const defaultApps = manifestApps.filter((app) => app.default).map((app) => app.id).join(",");
  const rows = FLAG_TABLE.map((row) => ({
    usage: row.usage.split("\n"),
    meaning: row.meaning,
    defaultText: row.defaultText ?? defaultApps,
  }));
  const usageWidth = Math.max(...rows.flatMap((row) => row.usage.map(displayWidth)));
  const firstWidth = INDENT.length + usageWidth + FIRST_COLUMN_GAP;
  const meaningWidth = Math.max(...rows.map((row) => displayWidth(row.meaning))) + MEANING_COLUMN_GAP;

  const tableLines = rows.flatMap(({ usage, meaning, defaultText }) => [
    `${pad(INDENT + usage[0], firstWidth)}${pad(meaning, meaningWidth)}${defaultText}`.trimEnd(),
    ...usage.slice(1).map((line) => INDENT + line),
  ]);

  return [
    "사용법",
    "  npm create scalable-monorepo-starter@latest [이름] -- [플래그]",
    "  npx create-scalable-monorepo-starter@latest [이름] [플래그]",
    "",
    `${pad("인자와 플래그", firstWidth)}${pad("의미", meaningWidth)}기본값`,
    ...tableLines,
    "",
    `선택할 수 있는 앱: ${manifestApps.map((app) => app.id).join(", ")}`,
  ];
}
