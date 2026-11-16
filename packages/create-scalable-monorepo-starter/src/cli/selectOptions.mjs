import { displayWidth } from "./displayWidth.mjs";

const NAME_COLUMN_GAP = 2;
const COMMAND_COLUMN_GAP = 3;

/** @param {string[]} texts */
function maxWidth(texts) {
  return Math.max(0, ...texts.map(displayWidth));
}

/** 선택 화면의 이름 열 폭: 가장 긴 label의 열 수 + 2.
 * @param {{ label: string }[]} apps */
export function nameColumnWidth(apps) {
  return maxWidth(apps.map((app) => app.label)) + NAME_COLUMN_GAP;
}

/** 완료 안내의 명령 열 폭: 가장 긴 `npm run <dev.script>`의 열 수 + 3.
 * @param {{ dev: { script: string } }[]} apps */
export function commandColumnWidth(apps) {
  return (
    maxWidth(apps.map((app) => `npm run ${app.dev.script}`)) + COMMAND_COLUMN_GAP
  );
}

/**
 * clack 선택지를 만든다. 설명은 hint 필드가 아니라 label에 이어 붙인다
 * (hint는 커서와 선택된 줄에만 보이므로, T3-1-2).
 * @param {{ id: string, label: string, hint: string }[]} apps
 * @returns {{ value: string, label: string }[]}
 */
export function buildSelectOptions(apps) {
  const width = nameColumnWidth(apps);
  return apps.map((app) => ({
    value: app.id,
    label: `${app.label}${" ".repeat(width - displayWidth(app.label))}${app.hint}`,
  }));
}
