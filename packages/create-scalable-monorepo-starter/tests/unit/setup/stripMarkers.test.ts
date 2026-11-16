import { describe, expect, it } from "vitest";

import { stripMarkers } from "../../../src/setup/stripMarkers.mjs";

const APP_IDS = ["api", "web", "desktop", "storybook"];

describe("stripMarkers", () => {
  it("블록형 마커가 조건을 만족할 때 내용은 남기고 마커 줄만 지운다", () => {
    const source = [
      "before",
      "# >>> APP:api",
      "DATABASE_URL=value",
      "# <<< APP:api",
      "after",
      "",
    ].join("\n");

    expect(stripMarkers(source, ["api"], APP_IDS)).toBe(
      ["before", "DATABASE_URL=value", "after", ""].join("\n"),
    );
  });

  it("블록형 마커가 조건을 만족하지 못할 때 블록 전체를 지운다", () => {
    const source = [
      "before",
      "// >>> APP:api",
      "const api = true;",
      "// <<< APP:api",
      "after",
    ].join("\n");

    expect(stripMarkers(source, ["web"], APP_IDS)).toBe(
      ["before", "after"].join("\n"),
    );
  });

  it("HTML 블록형 마커가 조건을 만족할 때 내용만 남긴다", () => {
    const source = [
      "<!-- >>> APP:web -->",
      "web 문서",
      "<!-- <<< APP:web -->",
    ].join("\n");

    expect(stripMarkers(source, ["web"], APP_IDS)).toBe("web 문서");
  });

  it("줄 끝형 마커가 조건을 만족할 때 주석만 지운다", () => {
    const source = [
      "DATABASE_URL=value # APP:api",
      "const web = true; // APP:web",
      "| web | 3000 | <!-- APP:web -->",
    ].join("\n");

    expect(stripMarkers(source, ["api", "web"], APP_IDS)).toBe(
      ["DATABASE_URL=value", "const web = true;", "| web | 3000 |"].join("\n"),
    );
  });

  it("줄 끝형 마커가 조건을 만족하지 못할 때 그 줄을 지운다", () => {
    const source = ["always", "api only # APP:api", "after"].join("\n");

    expect(stripMarkers(source, ["web"], APP_IDS)).toBe(
      ["always", "after"].join("\n"),
    );
  });

  it("마커 식이 web과 desktop을 모두 요구할 때 하나라도 없으면 지운다", () => {
    const source = "parity # APP:web+desktop";

    expect(stripMarkers(source, ["web"], APP_IDS)).toBe("");
    expect(stripMarkers(source, ["web", "desktop"], APP_IDS)).toBe("parity");
  });

  it("마커가 예약 id template을 사용할 때 항상 지운다", () => {
    const source = "기여 안내 <!-- APP:template -->";

    expect(stripMarkers(source, [...APP_IDS, "template"], APP_IDS)).toBe("");
  });

  it("블록형 마커의 시작과 끝 짝이 맞지 않을 때 처리에 실패한다", () => {
    const source = ["# >>> APP:api", "content", "# <<< APP:web"].join("\n");

    expect(() => stripMarkers(source, ["api"], APP_IDS)).toThrow(
      "블록 마커의 짝이 맞지 않습니다.",
    );
  });

  it("블록형 마커의 끝이 없을 때 처리에 실패한다", () => {
    const source = ["# >>> APP:api", "content"].join("\n");

    expect(() => stripMarkers(source, ["api"], APP_IDS)).toThrow(
      "블록 마커의 짝이 맞지 않습니다.",
    );
  });

  it("블록형 마커가 중첩될 때 처리에 실패한다", () => {
    const source = [
      "# >>> APP:api",
      "# >>> APP:web",
      "content",
      "# <<< APP:web",
      "# <<< APP:api",
    ].join("\n");

    expect(() => stripMarkers(source, ["api", "web"], APP_IDS)).toThrow(
      "블록 마커는 중첩할 수 없습니다.",
    );
  });

  it("마커가 모르는 앱 id를 사용할 때 처리에 실패한다", () => {
    expect(() => stripMarkers("mobile # APP:mobile", [], APP_IDS)).toThrow(
      "알 수 없는 앱 id: mobile",
    );
  });

  it("마커가 잘못된 앱 id 형식을 사용할 때 처리에 실패한다", () => {
    expect(() => stripMarkers("mobile # APP:Mobile", [], APP_IDS)).toThrow(
      "올바르지 않은 APP 마커가 있습니다.",
    );
  });

  it("마커를 처리할 때 CRLF 줄바꿈을 유지한다", () => {
    const source = "# >>> APP:web\r\ncontent\r\n# <<< APP:web\r\n";

    expect(stripMarkers(source, ["web"], APP_IDS)).toBe("content\r\n");
  });
});
