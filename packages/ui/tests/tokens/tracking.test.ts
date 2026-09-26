import { describe, expect, it } from "vitest";

import { getCssVar, tokenExists } from "./helpers";

describe("tracking tokens", () => {
  it("tracking-eyebrow 토큰이 0.08em으로 정의된다", () => {
    expect(getCssVar("--tracking-eyebrow")).toBe("0.08em");
  });

  it("tracking-label 토큰이 0.06em으로 정의된다", () => {
    expect(getCssVar("--tracking-label")).toBe("0.06em");
  });

  it("Tailwind 기본 tracking 키를 @theme에서 재정의하지 않는다", () => {
    for (const k of ["tighter", "tight", "normal", "wide", "wider", "widest"]) {
      expect(tokenExists(`--tracking-${k}`)).toBe(false);
    }
  });
});
