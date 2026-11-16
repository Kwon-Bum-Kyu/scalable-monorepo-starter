const EXPRESSION = "[a-z][a-z0-9-]*(?:\\+[a-z][a-z0-9-]*)*";
const BLOCK_MARKERS = [
  new RegExp(`^\\s*(?:#|//)\\s*(>>>|<<<)\\s+APP:(${EXPRESSION})\\s*$`, "u"),
  new RegExp(`^\\s*<!--\\s*(>>>|<<<)\\s+APP:(${EXPRESSION})\\s*-->\\s*$`, "u"),
];
const INLINE_MARKER = new RegExp(
  `^(.*?)(?:\\s+#\\s*APP:(${EXPRESSION})\\s*|\\s+//\\s*APP:(${EXPRESSION})\\s*|\\s*<!--\\s*APP:(${EXPRESSION})\\s*-->\\s*)$`,
  "u",
);

/** @param {string} line @returns {{ direction: string, expression: string } | null} */
function readBlockMarker(line) {
  for (const pattern of BLOCK_MARKERS) {
    const match = line.match(pattern);
    if (match) {
      return { direction: match[1], expression: match[2] };
    }
  }
  return null;
}

/** @param {string} line @returns {{ content: string, expression: string } | null} */
function readInlineMarker(line) {
  const match = line.match(INLINE_MARKER);
  if (!match) {
    return null;
  }
  return {
    content: match[1],
    expression: /** @type {string} */ (match[2] ?? match[3] ?? match[4]),
  };
}

/**
 * @param {string} expression
 * @param {Set<string>} selected
 * @param {Set<string>} known
 */
function matchesSelection(expression, selected, known) {
  const appIds = expression.split("+");
  for (const appId of appIds) {
    if (appId !== "template" && !known.has(appId)) {
      throw new Error(`알 수 없는 앱 id: ${appId}`);
    }
  }
  return (
    !appIds.includes("template") && appIds.every((appId) => selected.has(appId))
  );
}

/**
 * @param {string} source
 * @param {string[]} selectedApps
 * @param {string[]} knownAppIds
 * @returns {string}
 */
export function stripMarkers(source, selectedApps, knownAppIds) {
  const newline = source.includes("\r\n") ? "\r\n" : "\n";
  const lines = source.split(/\r?\n/u);
  const selected = new Set(selectedApps);
  const known = new Set(knownAppIds);
  const output = [];
  /** @type {{ expression: string, keep: boolean } | null} */
  let block = null;

  for (const line of lines) {
    const blockMarker = readBlockMarker(line);
    if (blockMarker?.direction === ">>>") {
      if (block) {
        throw new Error("블록 마커는 중첩할 수 없습니다.");
      }
      block = {
        expression: blockMarker.expression,
        keep: matchesSelection(blockMarker.expression, selected, known),
      };
      continue;
    }
    if (blockMarker?.direction === "<<<") {
      if (!block || block.expression !== blockMarker.expression) {
        throw new Error("블록 마커의 짝이 맞지 않습니다.");
      }
      matchesSelection(blockMarker.expression, selected, known);
      block = null;
      continue;
    }

    const inlineMarker = readInlineMarker(line);
    if (inlineMarker) {
      const keep = matchesSelection(inlineMarker.expression, selected, known);
      if ((!block || block.keep) && keep) {
        output.push(inlineMarker.content);
      }
    } else if (line.includes("APP:")) {
      throw new Error("올바르지 않은 APP 마커가 있습니다.");
    } else if (!block || block.keep) {
      output.push(line);
    }
  }

  if (block) {
    throw new Error("블록 마커의 짝이 맞지 않습니다.");
  }
  return output.join(newline);
}
