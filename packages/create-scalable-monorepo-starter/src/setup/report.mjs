const LIST_LIMIT = 10;

/** @param {string} title @param {string[]} items @returns {string[]} */
function formatLimitedList(title, items) {
  const lines = [
    title,
    ...items.slice(0, LIST_LIMIT).map((item) => `  - ${item}`),
  ];
  if (items.length > LIST_LIMIT) {
    lines.push(`  - 외 ${items.length - LIST_LIMIT}개`);
  }
  return lines;
}

/**
 * @param {{ removals: string[], edits: string[], notices: string[] }} plan
 * @param {boolean} dryRun
 * @returns {string[]}
 */
export function formatReport(plan, dryRun) {
  const lines = dryRun
    ? [
        ...formatLimitedList(
          `[dry-run] 지울 경로: ${plan.removals.length}개`,
          plan.removals,
        ),
        ...formatLimitedList(
          `[dry-run] 고칠 파일: ${plan.edits.length}개`,
          plan.edits,
        ),
      ]
    : [
        `처리 결과: 지운 경로 ${plan.removals.length}개, 고친 파일 ${plan.edits.length}개`,
        ...plan.removals.map((path) => `  - 삭제 ${path}`),
        ...plan.edits.map((path) => `  - 수정 ${path}`),
      ];

  return [...lines, ...plan.notices.map((notice) => `안내: ${notice}`)];
}
