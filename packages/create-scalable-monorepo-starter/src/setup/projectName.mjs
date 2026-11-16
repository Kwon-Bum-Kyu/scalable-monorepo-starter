const INVALID_CHARACTERS = /[^a-z0-9.-]/gu;
const SEPARATORS = /[\s_]+/gu;
const REPEATED_HYPHENS = /-+/gu;
const EDGE_PUNCTUATION = /^[.-]+|[.-]+$/gu;
const VALID_NPM_NAME = /^[a-z0-9][a-z0-9.-]*$/u;
const RESERVED_NAMES = new Set(["node_modules", "favicon.ico"]);
const MAX_NAME_LENGTH = 214;

/**
 * @typedef {{ ok: true, displayName: string, npmName: string } |
 *   { ok: false, reason: "empty" | "invalid" | "scope" | "reserved" }} ProjectNameResult
 */

/**
 * @param {string} input
 * @returns {ProjectNameResult}
 */
export function resolveProjectName(input) {
  const displayName = input.trim();
  if (displayName.length === 0) {
    return { ok: false, reason: "empty" };
  }
  if (displayName.startsWith("@")) {
    return { ok: false, reason: "scope" };
  }
  if (RESERVED_NAMES.has(displayName.toLowerCase())) {
    return { ok: false, reason: "reserved" };
  }

  const npmName = displayName
    .toLowerCase()
    .replace(SEPARATORS, "-")
    .replace(INVALID_CHARACTERS, "")
    .replace(REPEATED_HYPHENS, "-")
    .replace(EDGE_PUNCTUATION, "");

  if (npmName.length > MAX_NAME_LENGTH || !VALID_NPM_NAME.test(npmName)) {
    return { ok: false, reason: "invalid" };
  }
  return { ok: true, displayName, npmName };
}
