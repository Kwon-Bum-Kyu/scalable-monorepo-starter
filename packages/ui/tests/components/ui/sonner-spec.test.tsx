import { Toaster } from "@repo/ui/components/sonner";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("Toaster", () => {
  it("Toaster가 기본 props로 렌더될 때 충돌 없이 마운트된다", () => {
    expect(() => render(<Toaster />)).not.toThrow();
  });

  it("Toaster 소스가 헤더 아래 중앙에 표시될 때 닫기와 elevation 3 계약을 제공한다", async () => {
    const fs = await import("node:fs");
    const path = await import("node:path");
    const src = fs.readFileSync(
      path.resolve(__dirname, "../../../src/components/ui/sonner.tsx"),
      "utf-8",
    );
    expect(src).toContain("group-[.toaster]:shadow-3-raised!");
    expect(src).not.toContain("shadow-4-overlay");
    expect(src).not.toContain("maxWidth");
    expect(src).toContain('position="top-center"');
    expect(src).toMatch(/\n\s+closeButton\n/);
    expect(src).toContain('top: "calc(var(--spacing-header) + 1rem)"');
    expect(src).toContain("offset={TOAST_OFFSET}");
    expect(src).toContain("mobileOffset={TOAST_OFFSET}");
    expect(src).toContain('containerAriaLabel="알림"');
    expect(src).toContain('closeButtonAriaLabel: "토스트 닫기"');
    expect(src).toContain("group-[.toaster]:bg-background!");
    expect(src).toContain("group-[.toaster]:text-foreground!");
    expect(src).toContain("group-[.toaster]:text-sm!");
    expect(src).toContain("group-[.toaster]:border-gray-100!");
    expect(src).toContain("group-[.toaster]:rounded-lg!");
  });

  it("Toaster가 기본 영역을 렌더할 때 알림 이름을 제공한다", () => {
    render(<Toaster />);

    expect(screen.getByLabelText(/^알림 /)).toBeInTheDocument();
  });
});
