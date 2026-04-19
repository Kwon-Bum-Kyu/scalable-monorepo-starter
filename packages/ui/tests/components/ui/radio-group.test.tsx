import {
  RadioGroup,
  RadioGroupItem,
} from "@repo/ui/components/radio-group";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("RadioGroup", () => {
  it("기본 라디오 그룹이 렌더된다", () => {
    render(
      <RadioGroup defaultValue="a" aria-label="옵션">
        <RadioGroupItem value="a" aria-label="A" />
        <RadioGroupItem value="b" aria-label="B" />
      </RadioGroup>
    );
    expect(screen.getByRole("radio", { name: "A" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "B" })).toBeInTheDocument();
  });

  it("defaultValue와 일치하는 항목이 체크 상태로 표시된다", () => {
    render(
      <RadioGroup defaultValue="a" aria-label="옵션">
        <RadioGroupItem value="a" aria-label="A" />
        <RadioGroupItem value="b" aria-label="B" />
      </RadioGroup>
    );
    expect(screen.getByRole("radio", { name: "A" })).toHaveAttribute(
      "data-state",
      "checked"
    );
  });
});
