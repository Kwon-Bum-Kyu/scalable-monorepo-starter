import { Slider } from "@repo/ui/components/slider";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("Slider", () => {
  it("기본 slider가 렌더된다", () => {
    render(<Slider defaultValue={[50]} max={100} />);
    expect(screen.getByRole("slider")).toBeInTheDocument();
  });

  it("disabled 상태이면 data-disabled 속성이 부여된다", () => {
    const { container } = render(
      <Slider defaultValue={[50]} disabled data-testid="slider-root" />,
    );
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveAttribute("data-disabled");
  });
});

describe("Slider 범위", () => {
  it("값이 [20, 80]일 때 thumb 2개를 slider로 렌더한다", () => {
    render(<Slider defaultValue={[20, 80]} aria-label="범위" />);
    const thumbs = screen.getAllByRole("slider");
    expect(thumbs).toHaveLength(2);
    expect(thumbs.map((t) => t.getAttribute("aria-valuenow"))).toEqual(["20", "80"]);
  });

  it("controlled value가 있을 때 value 길이만큼 thumb을 렌더한다", () => {
    render(<Slider value={[10, 50, 90]} onValueChange={() => {}} />);
    expect(screen.getAllByRole("slider")).toHaveLength(3);
  });
});
