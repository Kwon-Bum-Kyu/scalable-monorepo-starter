import { readFileSync } from "node:fs";
import { posix, win32 } from "node:path";

/**
 * @typedef {{
 *   id: string,
 *   label: string,
 *   hint: string,
 *   dir: string,
 *   default: boolean,
 *   requires: string[],
 *   packages: string[],
 *   rootScripts: string[],
 *   paths: string[],
 *   dev: { script: string, url: string | null, note: string | null, prerequisite: string | null }
 * }} StarterApp
 * @typedef {{ id: string, dir: string, always: boolean, paths: string[] }} StarterPackage
 * @typedef {{ path: string, keepWhen: { apps: string[], examples?: true }, rootScripts: string[] }} ConditionalPath
 * @typedef {{ file: string, from: string, to: string }} Replacement
 * @typedef {{
 *   apps: StarterApp[],
 *   packages: StarterPackage[],
 *   conditionalPaths: ConditionalPath[],
 *   templateOnly: string[],
 *   markerFiles: string[],
 *   rename: {
 *     from: string,
 *     displayFrom: string,
 *     npmNameFiles: string[],
 *     displayNameFiles: string[],
 *     replacements: Replacement[]
 *   }
 * }} StarterManifest
 */

const APP_ID_PATTERN = /^[a-z][a-z0-9-]*$/;
const MANIFEST_URL = new URL("../../starter.manifest.json", import.meta.url);

/** @param {unknown} value @param {string} field */
function assertObject(value, field) {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new TypeError(`${field}: 객체여야 합니다.`);
  }
}

/** @param {unknown} value @param {string} field */
function assertArray(value, field) {
  if (!Array.isArray(value)) {
    throw new TypeError(`${field}: 배열이어야 합니다.`);
  }
}

/** @param {unknown} value @param {string} field */
function assertString(value, field) {
  if (typeof value !== "string" || value.length === 0) {
    throw new TypeError(`${field}: 비어 있지 않은 문자열이어야 합니다.`);
  }
}

/** @param {unknown} value @param {string} field */
function assertBoolean(value, field) {
  if (typeof value !== "boolean") {
    throw new TypeError(`${field}: 불리언이어야 합니다.`);
  }
}

/** @param {unknown} value @param {string} field */
function assertNullableString(value, field) {
  if (value !== null) {
    assertString(value, field);
  }
}

/** @param {unknown} value @param {string} field @returns {string[]} */
function validateStringArray(value, field) {
  assertArray(value, field);
  const items = /** @type {unknown[]} */ (value);
  items.forEach((item, index) => assertString(item, `${field}[${index}]`));
  return /** @type {string[]} */ (items);
}

/** @param {string} value @param {string} field */
function validatePath(value, field) {
  assertString(value, field);
  if (
    posix.isAbsolute(value) ||
    win32.isAbsolute(value) ||
    value.split(/[\\/]/u).includes("..")
  ) {
    throw new TypeError(`${field}: 상대 경로만 사용할 수 있습니다.`);
  }
}

/** @param {unknown} value @param {string} field */
function validatePathArray(value, field) {
  assertArray(value, field);
  const items = /** @type {unknown[]} */ (value);
  items.forEach((item, index) => {
    assertString(item, `${field}[${index}]`);
    validatePath(/** @type {string} */ (item), `${field}[${index}]`);
  });
}

/**
 * @param {unknown} value
 * @returns {StarterManifest}
 */
export function validateManifest(value) {
  assertObject(value, "manifest");
  const manifest = /** @type {Record<string, unknown>} */ (value);

  assertArray(manifest.apps, "apps");
  assertArray(manifest.packages, "packages");
  assertArray(manifest.conditionalPaths, "conditionalPaths");
  validatePathArray(manifest.templateOnly, "templateOnly");
  validatePathArray(manifest.markerFiles, "markerFiles");
  assertObject(manifest.rename, "rename");
  const apps = /** @type {unknown[]} */ (manifest.apps);
  const packages = /** @type {unknown[]} */ (manifest.packages);
  const conditionalPaths = /** @type {unknown[]} */ (manifest.conditionalPaths);
  const rename = /** @type {Record<string, unknown>} */ (manifest.rename);

  const appIds = new Set();
  apps.forEach((item, index) => {
    const field = `apps[${index}]`;
    assertObject(item, field);
    const app = /** @type {Record<string, unknown>} */ (item);
    assertString(app.id, `${field}.id`);
    const appId = /** @type {string} */ (app.id);
    if (
      !APP_ID_PATTERN.test(appId) ||
      appId === "template" ||
      appIds.has(appId)
    ) {
      throw new TypeError(`${field}.id: 유효하고 고유한 앱 id여야 합니다.`);
    }
    appIds.add(appId);
    assertString(app.label, `${field}.label`);
    assertString(app.hint, `${field}.hint`);
    validatePath(/** @type {string} */ (app.dir), `${field}.dir`);
    assertBoolean(app.default, `${field}.default`);
    validateStringArray(app.requires, `${field}.requires`);
    validateStringArray(app.packages, `${field}.packages`);
    validateStringArray(app.rootScripts, `${field}.rootScripts`);
    validatePathArray(app.paths, `${field}.paths`);
    assertObject(app.dev, `${field}.dev`);
    const dev = /** @type {Record<string, unknown>} */ (app.dev);
    assertString(dev.script, `${field}.dev.script`);
    assertNullableString(dev.url, `${field}.dev.url`);
    assertNullableString(dev.note, `${field}.dev.note`);
    assertNullableString(dev.prerequisite, `${field}.dev.prerequisite`);
    if ((dev.url === null) === (dev.note === null)) {
      throw new TypeError(
        `${field}.dev.note: dev.url과 dev.note 중 하나만 값이어야 합니다.`,
      );
    }
  });

  const packageIds = new Set();
  packages.forEach((item, index) => {
    const field = `packages[${index}]`;
    assertObject(item, field);
    const itemPackage = /** @type {Record<string, unknown>} */ (item);
    assertString(itemPackage.id, `${field}.id`);
    const packageId = /** @type {string} */ (itemPackage.id);
    if (packageIds.has(packageId)) {
      throw new TypeError(`${field}.id: 고유한 패키지 id여야 합니다.`);
    }
    packageIds.add(packageId);
    validatePath(/** @type {string} */ (itemPackage.dir), `${field}.dir`);
    assertBoolean(itemPackage.always, `${field}.always`);
    validatePathArray(itemPackage.paths, `${field}.paths`);
  });

  apps.forEach((item, index) => {
    const app = /** @type {Record<string, unknown>} */ (item);
    validateStringArray(app.requires, `apps[${index}].requires`).forEach(
      (requiredId, requiredIndex) => {
        if (!appIds.has(requiredId)) {
          throw new TypeError(
            `apps[${index}].requires[${requiredIndex}]: 존재하는 앱 id여야 합니다.`,
          );
        }
      },
    );
    validateStringArray(app.packages, `apps[${index}].packages`).forEach(
      (packageId, packageIndex) => {
        if (!packageIds.has(packageId)) {
          throw new TypeError(
            `apps[${index}].packages[${packageIndex}]: 존재하는 패키지 id여야 합니다.`,
          );
        }
      },
    );
  });

  conditionalPaths.forEach((item, index) => {
    const field = `conditionalPaths[${index}]`;
    assertObject(item, field);
    const conditionalPath = /** @type {Record<string, unknown>} */ (item);
    validatePath(/** @type {string} */ (conditionalPath.path), `${field}.path`);
    assertObject(conditionalPath.keepWhen, `${field}.keepWhen`);
    const keepWhen = /** @type {Record<string, unknown>} */ (
      conditionalPath.keepWhen
    );
    validateStringArray(keepWhen.apps, `${field}.keepWhen.apps`).forEach(
      (appId, appIndex) => {
        if (!appIds.has(appId)) {
          throw new TypeError(
            `${field}.keepWhen.apps[${appIndex}]: 존재하는 앱 id여야 합니다.`,
          );
        }
      },
    );
    if (keepWhen.examples !== undefined && keepWhen.examples !== true) {
      throw new TypeError(
        `${field}.keepWhen.examples: true만 사용할 수 있습니다.`,
      );
    }
    validateStringArray(conditionalPath.rootScripts, `${field}.rootScripts`);
  });

  assertString(rename.from, "rename.from");
  assertString(rename.displayFrom, "rename.displayFrom");
  validatePathArray(rename.npmNameFiles, "rename.npmNameFiles");
  validatePathArray(rename.displayNameFiles, "rename.displayNameFiles");
  assertArray(rename.replacements, "rename.replacements");
  const replacements = /** @type {unknown[]} */ (rename.replacements);
  replacements.forEach((item, index) => {
    const field = `rename.replacements[${index}]`;
    assertObject(item, field);
    const replacement = /** @type {Record<string, unknown>} */ (item);
    validatePath(/** @type {string} */ (replacement.file), `${field}.file`);
    assertString(replacement.from, `${field}.from`);
    assertString(replacement.to, `${field}.to`);
  });

  return /** @type {StarterManifest} */ (value);
}

/** @returns {StarterManifest} */
export function readManifest() {
  return validateManifest(JSON.parse(readFileSync(MANIFEST_URL, "utf8")));
}
