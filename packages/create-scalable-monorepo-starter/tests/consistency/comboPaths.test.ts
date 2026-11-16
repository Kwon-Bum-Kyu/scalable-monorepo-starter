import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { readManifest } from "../../src/setup/manifest.mjs";

const REPO_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../../..",
);
const WORKFLOW_PATH = ".github/workflows/template-combos.yml";

/** pull_request 아래 paths 목록의 항목을 글자 그대로 꺼낸다. */
function pullRequestPaths(workflow: string): string[] {
  const lines = workflow.split("\n");
  const start = lines.findIndex((line) => /^\s+paths:\s*$/.test(line));
  if (start < 0) {
    return [];
  }
  const items: string[] = [];
  for (const line of lines.slice(start + 1)) {
    const match = /^\s+-\s+"?([^"\s]+)"?\s*$/.exec(line);
    if (!match) {
      break;
    }
    items.push(match[1]);
  }
  return items;
}

function missingMarkerFiles(workflow: string, markerFiles: string[]): string[] {
  const listed = new Set(pullRequestPaths(workflow));
  return markerFiles.filter((markerFile) => !listed.has(markerFile));
}

describe("조합 검증 워크플로의 경로 조건", () => {
  const manifest = readManifest();

  it("markerFiles의 경로가 조합 검증의 경로 조건에 없을 때 검사에 실패한다", () => {
    const workflow = [
      "on:",
      "  pull_request:",
      "    paths:",
      '      - "package.json"',
      '      - ".env.example"',
    ].join("\n");
    expect(missingMarkerFiles(workflow, manifest.markerFiles)).toEqual(
      manifest.markerFiles.filter((file) => file !== ".env.example"),
    );
  });

  it("경로 조건이 글롭으로만 마커 파일을 덮을 때 검사에 실패한다", () => {
    const workflow = [
      "on:",
      "  pull_request:",
      "    paths:",
      '      - ".github/workflows/**"',
    ].join("\n");
    expect(missingMarkerFiles(workflow, [".github/workflows/ci.yml"])).toEqual([
      ".github/workflows/ci.yml",
    ]);
  });

  it("실제 워크플로가 markerFiles를 모두 적었을 때 검사를 통과한다", () => {
    const workflow = readFileSync(path.join(REPO_ROOT, WORKFLOW_PATH), "utf8");
    expect(missingMarkerFiles(workflow, manifest.markerFiles)).toEqual([]);
  });

  it("조합 검증 워크플로가 templateOnly에 등록되어 있다", () => {
    expect(manifest.templateOnly).toContain(WORKFLOW_PATH);
  });
});
