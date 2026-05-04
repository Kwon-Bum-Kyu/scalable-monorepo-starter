import { Slider } from "@repo/ui/components/slider";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("Slider 정본 SSOT 양보값 (Ralph R3b — track h:1(=4) / thumb 20×20 / shadow 생략)", () => {
  it("track height가 h-1(4px)다", () => {
    const { container } = render(<Slider defaultValue={[50]} max={100} />);
    const track = container.querySelector("[data-orientation]")!.querySelector(
      "span span",
    )!;
    expect(
      /\bh-1\b/.test(track.className),
      `Slider track은 h-1(4px)이어야 합니다 (실제: ${track.className})`,
    ).toBe(true);
    expect(
      /\bh-2\b/.test(track.className),
      `Slider track은 h-2(8px)를 사용하지 않아야 합니다 (실제: ${track.className})`,
    ).toBe(false);
  });

  it("thumb는 h-5 w-5 (20×20) + shadow 클래스 0개", () => {
    const { container } = render(<Slider defaultValue={[50]} max={100} />);
    const thumb = container.querySelector("[role='slider']")!;
    expect(/\bh-5\b/.test(thumb.className)).toBe(true);
    expect(/\bw-5\b/.test(thumb.className)).toBe(true);
    expect(
      /shadow-/.test(thumb.className),
      `Slider thumb은 shadow 클래스를 사용하지 않아야 합니다 (정본 SSOT — 사용자 결정 생략) (실제: ${thumb.className})`,
    ).toBe(false);
  });
});
