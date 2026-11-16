import { displayWidth } from "./displayWidth.mjs";
import { commandColumnWidth } from "./selectOptions.mjs";

const URL_COLUMN_GAP = 3;

/** @param {string} text @param {number} width */
const pad = (text, width) => text + " ".repeat(Math.max(0, width - displayWidth(text)));

/**
 * 완료 안내(PRD 4.1절 7번)의 줄을 만든다. 첫 줄 `완료했습니다.`는 outro가 내므로 포함하지 않는다.
 * 명령 열과 주소 열은 선택과 무관하게 매니페스트 전체로 계산해 폭을 고정한다.
 * @param {{
 *   manifestApps: { id: string, dev: { script: string, url: string | null, note: string | null, prerequisite: string | null } }[],
 *   selectedIds: readonly string[], targetName: string, install: boolean, removeExamples: boolean,
 * }} input
 * @returns {string[]}
 */
export function buildCompletionLines({ manifestApps, selectedIds, targetName, install, removeExamples }) {
  const commandWidth = commandColumnWidth(manifestApps);
  const urlWidth = Math.max(0, ...manifestApps.map((app) => displayWidth(app.dev.url ?? ""))) + URL_COLUMN_GAP;
  const selected = manifestApps.filter((app) => selectedIds.includes(app.id));

  const startLines = selected.map(({ dev }) => {
    const command = pad(`npm run ${dev.script}`, commandWidth);
    const rest = dev.url === null ? (dev.note ?? "") : `${pad(dev.url, urlWidth)}${dev.prerequisite ?? ""}`;
    return `  ${command}${rest}`.trimEnd();
  });
  if (selected.length >= 2) {
    startLines.push(`  ${pad("npm run dev", commandWidth)}선택한 앱을 모두 띄웁니다`);
  }

  const migration =
    removeExamples && selected.some((app) => app.id === "api")
      ? [
          "",
          "예제 테이블을 지우는 마이그레이션이 필요합니다. 다음 명령을 실행해 주세요.",
          "  cd apps/api && npm run migrate -- --name drop_examples_table",
        ]
      : [];

  return [
    "",
    "다음 단계",
    `  cd ${targetName}`,
    ...(install ? [] : ["  npm install"]),
    ...startLines,
    ...migration,
    "",
    "문서는 README.md 를 참고해 주세요.",
  ];
}
