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
