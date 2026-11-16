import { describe, expect, it } from "vitest";

import { readManifest } from "../../../src/setup/manifest.mjs";
import { resolveSelection } from "../../../src/setup/resolveSelection.mjs";

describe("resolveSelection", () => {
  const manifest = readManifest();

  it("앱 선택이 storybook만 포함할 때 web을 자동으로 함께 포함한다", () => {
    expect(resolveSelection(manifest, ["storybook"], false)).toEqual({
      apps: ["web", "storybook"],
      autoAdded: ["web"],
      removeExamples: true,
    });
  });

  it("앱 선택이 비어 있을 때 확정에 실패한다", () => {
    expect(() => resolveSelection(manifest, [], false)).toThrow(
      "앱을 하나 이상 선택해야 합니다.",
    );
  });

  it("앱 선택에 api가 없을 때 examples를 항상 제거로 확정한다", () => {
    expect(resolveSelection(manifest, ["web"], false).removeExamples).toBe(
      true,
    );
  });

  it("앱 선택에 api가 있을 때 사용자의 examples 결정을 유지한다", () => {
    expect(resolveSelection(manifest, ["api"], false).removeExamples).toBe(
      false,
    );
    expect(resolveSelection(manifest, ["api"], true).removeExamples).toBe(true);
  });

  it("앱 선택이 중복되고 순서가 달라도 매니페스트 순서로 중복 없이 확정한다", () => {
    expect(
      resolveSelection(manifest, ["desktop", "api", "desktop"], false).apps,
    ).toEqual(["api", "desktop"]);
  });

  it("앱 선택에 알 수 없는 id가 있을 때 확정에 실패한다", () => {
    expect(() => resolveSelection(manifest, ["mobile"], false)).toThrow(
      "알 수 없는 앱 id: mobile",
    );
  });

  it("앱 선택이 requires를 여러 단계로 가질 때 모두 자동으로 포함한다", () => {
    const customManifest = {
      apps: [
        { id: "api", requires: [] },
        { id: "web", requires: ["api"] },
        { id: "storybook", requires: ["web"] },
      ],
    };

    expect(resolveSelection(customManifest, ["storybook"], false)).toEqual({
      apps: ["api", "web", "storybook"],
      autoAdded: ["api", "web"],
      removeExamples: false,
    });
  });

  it("앱 선택을 확정할 때 입력 배열과 매니페스트를 바꾸지 않는다", () => {
    const selected = ["storybook"];
    const manifestBefore = structuredClone(manifest);

    resolveSelection(manifest, selected, false);

    expect(selected).toEqual(["storybook"]);
    expect(manifest).toEqual(manifestBefore);
  });
});
