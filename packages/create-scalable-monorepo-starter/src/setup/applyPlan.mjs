import {
  existsSync,
  lstatSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";

import { renderReadme } from "./renderReadme.mjs";
import { resolveSelection } from "./resolveSelection.mjs";
import { stripMarkers } from "./stripMarkers.mjs";

/**
 * @typedef {{
 *   id: string,
 *   dir: string,
 *   requires: string[],
 *   rootScripts: string[],
 *   dev: { script: string, url: string | null, note: string | null, prerequisite: string | null }
 * }} ApplyApp
 * @typedef {{ path: string, rootScripts: string[] }} ApplyConditionalPath
 * @typedef {{ file: string, from: string, to: string }} ApplyReplacement
 * @typedef {{
 *   apps: ApplyApp[],
 *   conditionalPaths: ApplyConditionalPath[],
 *   markerFiles: string[],
 *   rename: {
 *     from: string,
 *     displayFrom: string,
 *     npmNameFiles: string[],
 *     displayNameFiles: string[],
 *     replacements: ApplyReplacement[]
 *   }
 * }} ApplyManifest
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

/** @param {string} source @param {unknown} value */
function serializeJson(source, value) {
  return `${JSON.stringify(value, null, 2)}${source.endsWith("\n") ? "\n" : ""}`;
}

/**
 * @param {string} rootDir
 * @param {string} relativePath
 * @param {(relativePath: string) => void} visit
 */
function visitFiles(rootDir, relativePath, visit) {
  const absolutePath = path.join(rootDir, relativePath);
  const stat = lstatSync(absolutePath);
  if (stat.isSymbolicLink()) {
    return;
  }
  if (!stat.isDirectory()) {
    visit(normalize(relativePath));
    return;
  }
  for (const entry of readdirSync(absolutePath)) {
    visitFiles(rootDir, path.join(relativePath, entry), visit);
  }
}

/**
 * @param {{
 *   rootDir: string,
 *   manifest: ApplyManifest,
 *   selectedApps: string[],
 *   removeExamples: boolean,
 *   displayName: string,
 *   npmName: string,
 *   plan: { removals: string[], edits: string[], notices: string[] }
 * }} input
 */
export function applyPlan(input) {
  const selection = resolveSelection(
    input.manifest,
    input.selectedApps,
    input.removeExamples,
  );
  const selected = new Set(selection.apps);
  const editPaths = new Set(input.plan.edits.map(normalize));
  /** @type {Map<string, string>} */
  const contents = new Map();
  /** @type {(relativePath: string) => string} */
  const read = (relativePath) => {
    const normalized = normalize(relativePath);
    const current = contents.get(normalized);
    if (current !== undefined) {
      return current;
    }
    const source = readFileSync(path.join(input.rootDir, normalized), "utf8");
    contents.set(normalized, source);
    return source;
  };
  /** @type {(relativePath: string, from: string, to: string) => void} */
  const replace = (relativePath, from, to) => {
    const normalized = normalize(relativePath);
    if (editPaths.has(normalized)) {
      contents.set(normalized, read(normalized).split(from).join(to));
    }
  };

  if (editPaths.has("package.json")) {
    const source = read("package.json");
    const packageJson = JSON.parse(source);
    const removedScripts = new Set(["setup"]);
    for (const app of input.manifest.apps) {
      if (!selected.has(app.id)) {
        app.rootScripts.forEach((script) => removedScripts.add(script));
      }
    }
    for (const conditional of input.manifest.conditionalPaths) {
      if (isRemoved(conditional.path, input.plan.removals)) {
        conditional.rootScripts.forEach((script) =>
          removedScripts.add(script),
        );
      }
    }
    const scripts = Object.fromEntries(
      Object.entries(packageJson.scripts ?? {}).filter(
        ([name]) => !removedScripts.has(name),
      ),
    );
    contents.set(
      "package.json",
      serializeJson(source, {
        ...packageJson,
        name: input.npmName,
        version: "0.1.0",
        scripts,
      }),
    );
  }

  if (editPaths.has("package-lock.json")) {
    const source = read("package-lock.json");
    const lock = JSON.parse(source);
    const packages = Object.fromEntries(
      Object.entries(lock.packages ?? {}).filter(([key, value]) => {
        if (isRemoved(key, input.plan.removals)) {
          return false;
        }
        return !(
          typeof value === "object" &&
          value !== null &&
          value.link === true &&
          typeof value.resolved === "string" &&
          input.plan.removals.includes(normalize(value.resolved))
        );
      }),
    );
    packages[""] = { ...(packages[""] ?? {}), name: input.npmName };
    contents.set(
      "package-lock.json",
      serializeJson(source, { ...lock, name: input.npmName, packages }),
    );
  }

  if (editPaths.has("turbo.json")) {
    const source = read("turbo.json");
    const turbo = JSON.parse(source);
    const globalDependencies = /** @type {string[]} */ (
      turbo.globalDependencies ?? []
    ).filter(
      (dependency) =>
        dependency.includes("*") ||
        !isRemoved(dependency, input.plan.removals),
    );
    contents.set(
      "turbo.json",
      serializeJson(source, { ...turbo, globalDependencies }),
    );
  }

  const appIds = input.manifest.apps.map((app) => app.id);
  for (const markerFile of input.manifest.markerFiles) {
    const normalized = normalize(markerFile);
    if (editPaths.has(normalized)) {
      contents.set(
        normalized,
        stripMarkers(read(normalized), selection.apps, appIds),
      );
    }
  }
  for (const relativePath of input.manifest.rename.npmNameFiles) {
    if (!isRemoved(relativePath, input.plan.removals)) {
      visitFiles(input.rootDir, relativePath, (file) =>
        replace(file, input.manifest.rename.from, input.npmName),
      );
    }
  }
  for (const relativePath of input.manifest.rename.displayNameFiles) {
    replace(
      relativePath,
      input.manifest.rename.displayFrom,
      input.displayName,
    );
  }
  for (const replacement of input.manifest.rename.replacements) {
    replace(
      replacement.file,
      replacement.from,
      replacement.to.split("{{npmName}}").join(input.npmName),
    );
  }

  const templatePath =
    "packages/create-scalable-monorepo-starter/src/setup/readme.template.md";
  contents.set(
    "README.md",
    renderReadme(
      read(templatePath),
      input.manifest,
      selection.apps,
      { displayName: input.displayName, npmName: input.npmName },
    ),
  );

  for (const removal of input.plan.removals) {
    const absolutePath = path.join(input.rootDir, removal);
    if (existsSync(absolutePath) || lstatExists(absolutePath)) {
      rmSync(absolutePath, { recursive: true, force: true });
    }
  }
  for (const [relativePath, content] of contents) {
    if (editPaths.has(relativePath)) {
      writeFileSync(path.join(input.rootDir, relativePath), content);
    }
  }
}

/** @param {string} target */
function lstatExists(target) {
  try {
    lstatSync(target);
    return true;
  } catch {
    return false;
  }
}
