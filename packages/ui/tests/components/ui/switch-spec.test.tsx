import { Switch } from "@repo/ui/components/switch";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("Switch 정본 SSOT 양보값 (Ralph R3b — track 36×20 / knob 16×16 / gray-200→blue-500)", () => {
  it("track은 h-5 w-9 (20×36) + bg-gray-200(off) + checked bg-blue-500을 가진다", () => {
    const { container } = render(<Switch aria-label="s" />);
    const root = container.querySelector("button[role='switch']")!;
    expect(/\bh-5\b/.test(root.className)).toBe(true);
    expect(/\bw-9\b/.test(root.className)).toBe(true);
    expect(
      /data-\[state=unchecked\]:bg-gray-200/.test(root.className),
      `Switch off bg는 gray-200이어야 합니다 (실제: ${root.className})`,
    ).toBe(true);
    expect(
      /data-\[state=checked\]:bg-blue-500/.test(root.className),
      `Switch on bg는 blue-500이어야 합니다 (실제: ${root.className})`,
    ).toBe(true);
  });

  it("thumb는 h-4 w-4 (16×16) + translate-x-4를 가진다", () => {
    const { container } = render(<Switch aria-label="s" />);
    const thumb = container.querySelector("span[data-state]")!;
    expect(/\bh-4\b/.test(thumb.className)).toBe(true);
    expect(/\bw-4\b/.test(thumb.className)).toBe(true);
    expect(/data-\[state=checked\]:translate-x-4/.test(thumb.className)).toBe(
      true,
    );
  });
});
