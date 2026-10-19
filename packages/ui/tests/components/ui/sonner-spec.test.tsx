import { Toaster } from "@repo/ui/components/sonner";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

/**
 * Sonner Toaster의 toastOptions.classNames.toast 문자열을 직접 추출해 정본 SSOT 정합 검증.
 * 옵션 A — Sonner toastOptions로 props 주입 방식.
 */
describe("Sonner Toast 정본 SSOT (Ralph R3c — 옵션 A: toastOptions classNames)", () => {
  it("Toaster는 충돌 없이 마운트된다 (Portal로 body에 렌더되므로 container 검증은 생략)", () => {
    expect(() => render(<Toaster />)).not.toThrow();
  });

  // toastOptions.classNames.toast의 실제 값 검증은 Toaster 내부에서 sonner가 toast 추가 시 적용하므로
  // sonner.tsx 소스의 className 문자열을 직접 검사하는 단위 테스트로 분리한다.
  it("sonner.tsx 소스가 정본 사양 클래스를 toastOptions에 정의한다", async () => {
    const fs = await import("node:fs");
    const path = await import("node:path");
    const src = fs.readFileSync(
      path.resolve(__dirname, "../../../src/components/ui/sonner.tsx"),
      "utf-8",
    );
    expect(
      /shadow-4-overlay/.test(src),
      `sonner.tsx는 shadow-4-overlay를 정의해야 합니다 (정본 SSOT — Toast level 4 overlay)`,
    ).toBe(true);
    expect(
      /shadow-3-raised/.test(src),
      `sonner.tsx는 shadow-3-raised를 사용하지 않아야 합니다 (정본 SSOT는 level 4) (실제 src에 발견됨)`,
    ).toBe(false);
    expect(
      /rounded-lg/.test(src),
      `sonner.tsx는 rounded-lg(8px) radius를 정의해야 합니다`,
    ).toBe(true);
    expect(
      /border-gray-100/.test(src),
      `sonner.tsx는 border-gray-100을 정의해야 합니다`,
    ).toBe(true);
  });
});
