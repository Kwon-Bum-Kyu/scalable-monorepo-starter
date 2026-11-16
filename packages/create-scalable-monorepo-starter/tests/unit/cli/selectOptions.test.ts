import { describe, expect, it } from "vitest";

import { displayWidth } from "../../../src/cli/displayWidth.mjs";
import {
  buildSelectOptions,
  commandColumnWidth,
  nameColumnWidth,
} from "../../../src/cli/selectOptions.mjs";
import { readManifest } from "../../../src/setup/manifest.mjs";

const apps = [
  { id: "api", label: "api", hint: "서버", dev: { script: "dev:api" } },
  { id: "storybook", label: "storybook", hint: "문서", dev: { script: "dev:sb" } },
];

describe("nameColumnWidth", () => {
  it("선택 화면의 이름 열이 가장 긴 label의 열 수에 2를 더한 값이다", () => {
    expect(nameColumnWidth(apps)).toBe(11);
  });

  it("label에 한글이 있을 때 한 글자를 2열로 세어 계산한다", () => {
    expect(nameColumnWidth([{ label: "앱앱앱" }])).toBe(8);
  });

  it("실제 매니페스트에서 이름 열이 11칸이다", () => {
    expect(nameColumnWidth(readManifest().apps)).toBe(11);
  });
});

describe("commandColumnWidth", () => {
  it("완료 안내의 명령 열 폭이 가장 긴 npm run dev 스크립트 명령에 3을 더한 값이다", () => {
    expect(commandColumnWidth(apps)).toBe(`npm run dev:api`.length + 3);
  });

  it("실제 매니페스트에서 명령 열이 24칸이다", () => {
    expect(commandColumnWidth(readManifest().apps)).toBe(24);
  });
});

describe("buildSelectOptions", () => {
  it("선택지 줄이 label을 이름 열 폭에 맞춰 채운 뒤 hint를 이어 붙인다", () => {
    expect(buildSelectOptions(apps)).toEqual([
      { value: "api", label: "api        서버" },
      { value: "storybook", label: "storybook  문서" },
    ]);
  });

  it("hint가 모든 줄의 같은 열에서 시작한다", () => {
    const options = buildSelectOptions(readManifest().apps);
    const starts = options.map(
      (option, index) =>
        displayWidth(option.label) -
        displayWidth(readManifest().apps[index].hint),
    );
    expect(new Set(starts)).toEqual(new Set([11]));
  });

  it("hint 필드를 만들지 않는다", () => {
    for (const option of buildSelectOptions(apps)) {
      expect(option).not.toHaveProperty("hint");
    }
  });
});
