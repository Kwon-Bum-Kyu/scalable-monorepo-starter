/**
 * @param {{ apps: Array<{ id: string, requires: string[] }> }} manifest
 * @param {string[]} selectedApps
 * @param {boolean} removeExamples
 * @returns {{ apps: string[], autoAdded: string[], removeExamples: boolean }}
 */
export function resolveSelection(manifest, selectedApps, removeExamples) {
  if (selectedApps.length === 0) {
    throw new Error("앱을 하나 이상 선택해야 합니다.");
  }

  const appById = new Map(manifest.apps.map((app) => [app.id, app]));
  for (const appId of selectedApps) {
    if (!appById.has(appId)) {
      throw new Error(`알 수 없는 앱 id: ${appId}`);
    }
  }

  const requested = new Set(selectedApps);
  const resolved = new Set(requested);
  const pending = [...requested];
  while (pending.length > 0) {
    const appId = pending.shift();
    const app = appById.get(/** @type {string} */ (appId));
    for (const requiredId of /** @type {{ requires: string[] }} */ (app)
      .requires) {
      if (!resolved.has(requiredId)) {
        resolved.add(requiredId);
        pending.push(requiredId);
      }
    }
  }

  const apps = manifest.apps
    .filter((app) => resolved.has(app.id))
    .map((app) => app.id);
  const autoAdded = apps.filter((appId) => !requested.has(appId));

  return {
    apps,
    autoAdded,
    removeExamples: !resolved.has("api") || removeExamples,
  };
}
