const PLACEHOLDER = /\{\{[^}]+\}\}/u;

/**
 * @param {{ apps: Array<{ id: string, dev: { script: string, url: string | null, note: string | null, prerequisite: string | null } }> }} manifest
 * @param {string[]} selectedApps
 * @returns {string}
 */
export function renderAppLines(manifest, selectedApps) {
  const selected = new Set(selectedApps);
  const apps = manifest.apps.filter((app) => selected.has(app.id));
  if (apps.length !== selected.size) {
    throw new Error("선택한 앱을 매니페스트에서 찾을 수 없습니다.");
  }

  const lines = apps.map((app) => {
    const destination = app.dev.url ?? app.dev.note;
    const prerequisite = app.dev.prerequisite
      ? ` - ${app.dev.prerequisite}`
      : "";
    return `- \`npm run ${app.dev.script}\` - ${destination}${prerequisite}`;
  });
  if (apps.length > 1) {
    lines.push("- `npm run dev` - 선택한 앱을 모두 띄웁니다");
  }
  return lines.join("\n");
}

/**
 * @param {string} template
 * @param {{ apps: Array<{ id: string, dev: { script: string, url: string | null, note: string | null, prerequisite: string | null } }> }} manifest
 * @param {string[]} selectedApps
 * @param {{ displayName: string, npmName: string }} project
 * @returns {string}
 */
export function renderReadme(template, manifest, selectedApps, project) {
  const rendered = template
    .split("{{displayName}}")
    .join(project.displayName)
    .split("{{npmName}}")
    .join(project.npmName)
    .split("{{appLines}}")
    .join(renderAppLines(manifest, selectedApps));

  if (PLACEHOLDER.test(rendered)) {
    throw new Error("README에 채워지지 않은 자리표시가 있습니다.");
  }
  return rendered;
}
