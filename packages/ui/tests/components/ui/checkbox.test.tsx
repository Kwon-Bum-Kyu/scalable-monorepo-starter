import { Checkbox } from "@repo/ui/components/checkbox";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("Checkbox", () => {
  it("기본 체크박스가 렌더된다", () => {
    render(<Checkbox aria-label="동의" />);
    expect(screen.getByRole("checkbox", { name: "동의" })).toBeInTheDocument();
  });

  it("disabled 상태이면 조작할 수 없다", () => {
    render(<Checkbox aria-label="동의" disabled />);
    expect(screen.getByRole("checkbox", { name: "동의" })).toBeDisabled();
  });
});
