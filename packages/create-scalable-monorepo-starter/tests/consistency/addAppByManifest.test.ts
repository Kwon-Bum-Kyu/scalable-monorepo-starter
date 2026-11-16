import { describe, expect, it } from "vitest";

import { buildCompletionLines } from "../../src/cli/completion.mjs";
import { buildHelpLines } from "../../src/cli/help.mjs";
import { preflight } from "../../src/cli/preflight.mjs";
import {
  buildSelectOptions,
  commandColumnWidth,
  nameColumnWidth,
} from "../../src/cli/selectOptions.mjs";
import { readManifest, validateManifest } from "../../src/setup/manifest.mjs";

type Manifest = ReturnType<typeof readManifest>;

function withApp(
  id: string,
  dev: Partial<Manifest["apps"][number]["dev"]> = {},
): Manifest {
  const manifest = readManifest();
  const app = {
    id,
    label: id,
    hint: "모바일 앱",
    dir: `apps/${id}`,
    default: false,
    requires: [],
    packages: ["shared-types"],
    rootScripts: [`dev:${id}`],
    paths: [],
    dev: {
      script: `dev:${id}`,
      url: null,
      note: "기기에서 열립니다",
      prerequisite: null,
      ...dev,
    },
  };
  return { ...manifest, apps: [...manifest.apps, app] };
}

function completion(manifest: Manifest, selectedIds: string[]): string[] {
  return buildCompletionLines({
    manifestApps: manifest.apps,
    selectedIds,
    targetName: "my-app",
    install: true,
    removeExamples: false,
  });
}

describe("앱 추가는 매니페스트만 고친다", () => {
  it("매니페스트에 mobile 항목만 더했을 때 코드를 고치지 않아도 선택 화면에 mobile이 나온다", () => {
    const manifest = withApp("mobile");
    expect(validateManifest(manifest)).toBe(manifest);
    expect(
      buildSelectOptions(manifest.apps).map((option) => option.value),
    ).toContain("mobile");
  });

  it("매니페스트에 mobile 항목만 더했을 때 완료 안내와 --help에 mobile이 나온다", () => {
    const manifest = withApp("mobile");
    expect(completion(manifest, ["mobile"]).join("\n")).toContain(
      "npm run dev:mobile",
    );
    expect(buildHelpLines(manifest.apps).join("\n")).toContain("mobile");
  });

  it("매니페스트에 mobile 항목만 더했을 때 mobile을 앱으로 지정해도 검증을 통과한다", () => {
    const manifest = withApp("mobile");
    const result = preflight({
      args: { name: "my-app", apps: ["mobile"], yes: true },
      apps: manifest.apps,
      isTTY: true,
      nodeVersion: "v22.13.0",
      cwd: "/nonexistent-parent",
    });
    expect(result).toEqual({ ok: true });
  });

  it("mobile의 id가 9자를 넘는 가짜 항목을 더했을 때 열 폭이 함께 넓어진다", () => {
    const before = readManifest();
    const after = withApp("mobile-preview");
    expect(nameColumnWidth(after.apps)).toBeGreaterThan(
      nameColumnWidth(before.apps),
    );
    expect(commandColumnWidth(after.apps)).toBeGreaterThan(
      commandColumnWidth(before.apps),
    );
    expect(commandColumnWidth(before.apps)).toBe(24);
  });

  it("mobile의 열이 넓어졌을 때 기존 앱의 줄도 새 열 폭에 맞춰 정렬된다", () => {
    const manifest = withApp("mobile-preview");
    const nameWidth = nameColumnWidth(manifest.apps);
    const apiLabel = buildSelectOptions(manifest.apps)[0]?.label ?? "";
    expect(apiLabel.startsWith(`api${" ".repeat(nameWidth - 3)}Express`)).toBe(
      true,
    );
  });

  it("dev.note가 필요한 앱에서 비어 있을 때 매니페스트 검증에 실패한다", () => {
    const manifest = withApp("mobile", { note: null });
    expect(() => validateManifest(manifest)).toThrow("dev.note");
  });

  it("dev.url과 dev.note가 둘 다 값일 때 매니페스트 검증에 실패한다", () => {
    const manifest = withApp("mobile", { url: "http://localhost:8081" });
    expect(() => validateManifest(manifest)).toThrow("dev.note");
  });
});
