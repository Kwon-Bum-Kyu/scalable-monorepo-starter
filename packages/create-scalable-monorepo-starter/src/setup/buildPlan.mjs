import { existsSync, lstatSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

import { renderReadme } from "./renderReadme.mjs";
import { resolveSelection } from "./resolveSelection.mjs";
import { stripMarkers } from "./stripMarkers.mjs";

/**
 * @typedef {{
 *   id: string,
 *   dir: string,
 *   requires: string[],
 *   packages: string[],
 *   rootScripts: string[],
 *   paths: string[],
 *   dev: { script: string, url: string | null, note: string | null, prerequisite: string | null }
 * }} PlanApp
 * @typedef {{ id: string, dir: string, always: boolean, paths: string[] }} PlanPackage
 * @typedef {{ path: string, keepWhen: { apps: string[], examples?: true }, rootScripts: string[] }} PlanConditionalPath
 * @typedef {{ file: string, from: string, to: string }} PlanReplacement
 * @typedef {{
 *   apps: PlanApp[],
 *   packages: PlanPackage[],
 *   conditionalPaths: PlanConditionalPath[],
 *   templateOnly: string[],
 *   markerFiles: string[],
 *   rename: {
 *     from: string,
 *     displayFrom: string,
 *     npmNameFiles: string[],
 *     displayNameFiles: string[],
 *     replacements: PlanReplacement[]
 *   }
 * }} PlanManifest
 */

/** @param {string} value @returns {string} */
function normalize(value) {
  return value.split(path.sep).join("/");
}

/** @param {string} relativePath @param {string[]} removals */
function isRemoved(relativePath, removals) {
  return removals.some(
    (removal) =>
      relativePath === removal || relativePath.startsWith(`${removal}/`),
  );
}

/** @param {string} rootDir @param {string} relativePath */
function assertRegularFile(rootDir, relativePath) {
  const absolutePath = path.join(rootDir, relativePath);
  if (!existsSync(absolutePath)) {
    throw new Error(`파일을 찾을 수 없습니다: ${relativePath}`);
  }
  if (lstatSync(absolutePath).isSymbolicLink()) {
    throw new Error(
      `이름으로 지정된 파일은 symlink일 수 없습니다: ${relativePath}`,
    );
  }
  return absolutePath;
}

/**
 * @param {string} rootDir
 * @param {string} relativePath
 * @param {string[]} found
 */
function findEnvironmentFiles(rootDir, relativePath, found) {
  const absolutePath = path.join(rootDir, relativePath);
  if (!existsSync(absolutePath) || lstatSync(absolutePath).isSymbolicLink()) {
    return;
  }
  const stat = lstatSync(absolutePath);
  if (!stat.isDirectory()) {
    const name = path.basename(relativePath);
    if (
      (name === ".env" || name.startsWith(".env.")) &&
      name !== ".env.example"
    ) {
      found.push(normalize(relativePath));
    }
    return;
  }

  for (const entry of readdirSync(absolutePath, { withFileTypes: true })) {
    if (entry.name === "node_modules") {
      continue;
    }
    findEnvironmentFiles(rootDir, path.join(relativePath, entry.name), found);
  }
}

/**
 * @param {string} rootDir
 * @param {string} relativePath
 * @param {string} from
 * @param {string} to
 * @param {string[]} removals
 * @param {Set<string>} edits
 * @param {string[]} notices
 */
function planFolderReplacements(
  rootDir,
  relativePath,
  from,
  to,
  removals,
  edits,
  notices,
) {
  if (isRemoved(normalize(relativePath), removals)) {
    return;
  }
  const absolutePath = path.join(rootDir, relativePath);
  const stat = lstatSync(absolutePath);
  if (stat.isSymbolicLink()) {
    throw new Error(
      `이름으로 지정된 경로는 symlink일 수 없습니다: ${relativePath}`,
    );
  }
  if (!stat.isDirectory()) {
    const source = readFileSync(absolutePath, "utf8");
    if (source.split(from).join(to) !== source) {
      edits.add(normalize(relativePath));
    }
    return;
  }

  for (const entry of readdirSync(absolutePath, { withFileTypes: true })) {
    const child = path.join(relativePath, entry.name);
    const childStat = lstatSync(path.join(rootDir, child));
    if (childStat.isSymbolicLink()) {
      notices.push(`symlink를 건너뜁니다: ${normalize(child)}`);
      continue;
    }
    planFolderReplacements(
      rootDir,
      child,
      from,
      to,
      removals,
      edits,
      notices,
    );
  }
}

/** @param {string[]} items @returns {string[]} */
function unique(items) {
  return [...new Set(items.map(normalize))];
}

/**
 * @param {{
 *   rootDir: string,
 *   manifest: PlanManifest,
 *   selectedApps: string[],
 *   removeExamples: boolean,
 *   displayName: string,
 *   npmName: string
 * }} input
 * @returns {{ removals: string[], edits: string[], notices: string[] }}
 */
export function buildPlan(input) {
  const selection = resolveSelection(
    input.manifest,
    input.selectedApps,
    input.removeExamples,
  );
  const selected = new Set(selection.apps);
  const selectedApps = input.manifest.apps.filter((app) =>
    selected.has(app.id),
  );
  const usedPackages = new Set(selectedApps.flatMap((app) => app.packages));
  /** @type {string[]} */
  const removals = [];
  /** @type {string[]} */
  const removedRootScripts = ["setup"];

  for (const app of input.manifest.apps) {
    if (!selected.has(app.id)) {
      removals.push(app.dir, ...app.paths);
      removedRootScripts.push(...app.rootScripts);
    }
  }
  for (const itemPackage of input.manifest.packages) {
    if (!itemPackage.always && !usedPackages.has(itemPackage.id)) {
      removals.push(itemPackage.dir, ...itemPackage.paths);
    }
  }
  for (const conditional of input.manifest.conditionalPaths) {
    const keepApps = conditional.keepWhen.apps.every((appId) =>
      selected.has(appId),
    );
    const keepExamples =
      conditional.keepWhen.examples !== true || !selection.removeExamples;
    if (!keepApps || !keepExamples) {
      removals.push(conditional.path);
      removedRootScripts.push(...conditional.rootScripts);
    }
  }
  removals.push(...input.manifest.templateOnly);
  const normalizedRemovals = unique(removals);

  /** @type {string[]} */
  const environmentFiles = [];
  for (const removal of normalizedRemovals) {
    findEnvironmentFiles(input.rootDir, removal, environmentFiles);
  }
  if (environmentFiles.length > 0) {
    throw new Error(
      `지울 폴더 안에 환경 변수 파일이 있습니다. 옮기거나 지운 뒤 다시 실행해 주세요.\n${environmentFiles.join("\n")}`,
    );
  }

  /** @type {Set<string>} */
  const edits = new Set();
  /** @type {string[]} */
  const notices = [];
  const knownAppIds = input.manifest.apps.map((app) => app.id);

  const packageJsonPath = assertRegularFile(input.rootDir, "package.json");
  const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));
  const nextScripts = Object.fromEntries(
    Object.entries(packageJson.scripts ?? {}).filter(
      ([name]) => !removedRootScripts.includes(name),
    ),
  );
  if (
    packageJson.name !== input.npmName ||
    packageJson.version !== "0.1.0" ||
    Object.keys(nextScripts).length !==
      Object.keys(packageJson.scripts ?? {}).length
  ) {
    edits.add("package.json");
  }
  assertRegularFile(input.rootDir, "package-lock.json");
  edits.add("package-lock.json");

  const turboPath = assertRegularFile(input.rootDir, "turbo.json");
  const turbo = /** @type {{ globalDependencies?: string[] }} */ (
    JSON.parse(readFileSync(turboPath, "utf8"))
  );
  if (
    (turbo.globalDependencies ?? []).some(
      (dependency) =>
        !dependency.includes("*") && isRemoved(dependency, normalizedRemovals),
    )
  ) {
    edits.add("turbo.json");
  }

  for (const markerFile of input.manifest.markerFiles) {
    if (isRemoved(markerFile, normalizedRemovals)) {
      continue;
    }
    const absolutePath = assertRegularFile(input.rootDir, markerFile);
    const source = readFileSync(absolutePath, "utf8");
    if (stripMarkers(source, selection.apps, knownAppIds) !== source) {
      edits.add(normalize(markerFile));
    }
  }

  for (const npmNamePath of input.manifest.rename.npmNameFiles) {
    if (isRemoved(npmNamePath, normalizedRemovals)) {
      continue;
    }
    assertRegularFile(input.rootDir, npmNamePath);
    planFolderReplacements(
      input.rootDir,
      npmNamePath,
      input.manifest.rename.from,
      input.npmName,
      normalizedRemovals,
      edits,
      notices,
    );
  }
  for (const displayNameFile of input.manifest.rename.displayNameFiles) {
    if (isRemoved(displayNameFile, normalizedRemovals)) {
      continue;
    }
    const absolutePath = assertRegularFile(input.rootDir, displayNameFile);
    const source = readFileSync(absolutePath, "utf8");
    if (
      source
        .split(input.manifest.rename.displayFrom)
        .join(input.displayName) !== source
    ) {
      edits.add(normalize(displayNameFile));
    }
  }
  for (const replacement of input.manifest.rename.replacements) {
    if (isRemoved(replacement.file, normalizedRemovals)) {
      continue;
    }
    const absolutePath = assertRegularFile(input.rootDir, replacement.file);
    const source = readFileSync(absolutePath, "utf8");
    const target = replacement.to.split("{{npmName}}").join(input.npmName);
    if (source.split(replacement.from).join(target) === source) {
      throw new Error(
        `개별 치환 원본 문자열을 찾을 수 없습니다: ${replacement.file}`,
      );
    }
    edits.add(normalize(replacement.file));
  }

  const templatePath = assertRegularFile(
    input.rootDir,
    "packages/create-scalable-monorepo-starter/src/setup/readme.template.md",
  );
  renderReadme(
    readFileSync(templatePath, "utf8"),
    input.manifest,
    selection.apps,
    { displayName: input.displayName, npmName: input.npmName },
  );
  edits.add("README.md");

  return {
    removals: normalizedRemovals,
    edits: [...edits],
    notices,
  };
}
