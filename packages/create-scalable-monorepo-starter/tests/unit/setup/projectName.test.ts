import { describe, expect, it } from "vitest";

import { resolveProjectName } from "../../../src/setup/projectName.mjs";

describe("resolveProjectName", () => {
  it("프로젝트 이름이 My Shop일 때 npm 이름을 my-shop으로 변환한다", () => {
    expect(resolveProjectName("  My Shop  ")).toEqual({
      ok: true,
      displayName: "My Shop",
      npmName: "my-shop",
    });
  });

  it("프로젝트 이름이 Acme_Web 2일 때 npm 이름을 acme-web-2로 변환한다", () => {
    expect(resolveProjectName("Acme_Web 2")).toEqual({
      ok: true,
      displayName: "Acme_Web 2",
      npmName: "acme-web-2",
    });
  });

  it("프로젝트 이름에 연속 기호가 있을 때 변환 규칙 순서대로 정리한다", () => {
    expect(resolveProjectName(" .My---Shop... ")).toEqual({
      ok: true,
      displayName: ".My---Shop...",
      npmName: "my-shop",
    });
  });

  it("프로젝트 이름이 비어 있을 때 빈 입력 사유로 변환할 수 없다", () => {
    expect(resolveProjectName("   ")).toEqual({ ok: false, reason: "empty" });
  });

  it("프로젝트 이름이 한글뿐일 때 규칙 위반 사유로 변환할 수 없다", () => {
    expect(resolveProjectName("한글이름")).toEqual({
      ok: false,
      reason: "invalid",
    });
  });

  it("프로젝트 이름이 @로 시작할 때 스코프 사유로 변환할 수 없다", () => {
    expect(resolveProjectName(" @org/name ")).toEqual({
      ok: false,
      reason: "scope",
    });
  });

  it("프로젝트 이름이 node_modules일 때 예약어 사유로 변환할 수 없다", () => {
    expect(resolveProjectName("node_modules")).toEqual({
      ok: false,
      reason: "reserved",
    });
  });

  it("프로젝트 이름이 favicon.ico일 때 예약어 사유로 변환할 수 없다", () => {
    expect(resolveProjectName("favicon.ico")).toEqual({
      ok: false,
      reason: "reserved",
    });
  });

  it("프로젝트 이름이 214자를 넘을 때 규칙 위반 사유로 변환할 수 없다", () => {
    expect(resolveProjectName("a".repeat(215))).toEqual({
      ok: false,
      reason: "invalid",
    });
  });
});
