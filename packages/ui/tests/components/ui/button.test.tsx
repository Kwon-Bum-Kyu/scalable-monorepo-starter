import { Button } from "@repo/ui/components/button";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("Button", () => {
  it("기본 variant가 렌더된다", () => {
    render(<Button>저장</Button>);
    const btn = screen.getByRole("button", { name: "저장" });
    expect(btn).toBeInTheDocument();
    expect(btn.className).toContain("bg-primary");
  });

  it("disabled 상태이면 클릭할 수 없다", () => {
    render(<Button disabled>저장</Button>);
    const btn = screen.getByRole("button", { name: "저장" });
    expect(btn).toBeDisabled();
  });
});
