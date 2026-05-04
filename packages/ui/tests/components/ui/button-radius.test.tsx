import { Button } from "@repo/ui/components/button";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("Button radius 정본 SSOT (Ralph R3a — claude-design-page-alignment)", () => {
  it("기본 Button은 rounded-lg(8px) 클래스를 사용한다 — Claude Design 옵션 B 결정 정합", () => {
    render(<Button>저장</Button>);
    const btn = screen.getByRole("button", { name: "저장" });
    expect(
      btn.className.includes("rounded-lg"),
      `Button은 정본 SSOT(Buttons & Inputs use rounded-lg 8px)에 따라 rounded-lg를 가져야 합니다 (실제: ${btn.className})`,
    ).toBe(true);
    expect(
      btn.className.includes("rounded-md"),
      `Button은 shadcn 기본 rounded-md를 사용하지 않아야 합니다 (실제: ${btn.className})`,
    ).toBe(false);
  });

  it("Button transition은 colors duration-150을 명시한다", () => {
    render(<Button>btn</Button>);
    const btn = screen.getByRole("button", { name: "btn" });
    expect(
      /transition-colors/.test(btn.className),
      `Button transition은 transition-colors를 가져야 합니다 (실제: ${btn.className})`,
    ).toBe(true);
    expect(
      /duration-150/.test(btn.className),
      `Button transition duration은 150ms (Tailwind 기본)를 명시해야 합니다 (실제: ${btn.className})`,
    ).toBe(true);
  });

  it("Button shadow는 shadow-none이다 (정본 SSOT)", () => {
    render(<Button>btn</Button>);
    const btn = screen.getByRole("button", { name: "btn" });
    expect(
      /shadow-none/.test(btn.className),
      `Button은 정본 SSOT에 따라 shadow-none을 명시해야 합니다 (실제: ${btn.className})`,
    ).toBe(true);
  });

  it("Button sm size는 h-8 px-3 text-sm이다 (정본 32×12 + fs 13→14 양보)", () => {
    render(<Button size="sm">sm</Button>);
    const btn = screen.getByRole("button", { name: "sm" });
    expect(/\bh-8\b/.test(btn.className)).toBe(true);
    expect(/\bpx-3\b/.test(btn.className)).toBe(true);
    expect(/\btext-sm\b/.test(btn.className)).toBe(true);
  });

  it("Button lg size는 h-11 px-8 text-base이다 (정본 SSOT)", () => {
    render(<Button size="lg">lg</Button>);
    const btn = screen.getByRole("button", { name: "lg" });
    expect(/\bh-11\b/.test(btn.className)).toBe(true);
    expect(/\bpx-8\b/.test(btn.className)).toBe(true);
    expect(/\btext-base\b/.test(btn.className)).toBe(true);
  });

  it("Button icon size는 h-10 w-10이다 (정본 40×40)", () => {
    render(<Button size="icon" aria-label="icon-btn" />);
    const btn = screen.getByRole("button", { name: "icon-btn" });
    expect(/\bh-10\b/.test(btn.className)).toBe(true);
    expect(/\bw-10\b/.test(btn.className)).toBe(true);
  });
});
