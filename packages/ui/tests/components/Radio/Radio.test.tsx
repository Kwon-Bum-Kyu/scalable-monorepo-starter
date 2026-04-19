import { render, screen } from "@testing-library/react";
import { describe, expect,it } from "vitest";

import Radio from "../../../src/components/Radio";

describe("Radio 컴포넌트", () => {
  it("기본 라디오 버튼이 렌더링되어야 한다.", () => {
    render(<Radio label="Radio Label" name="radio-group" />);
    expect(screen.getByLabelText("Radio Label")).toBeInTheDocument();
    expect(screen.getByLabelText("Radio Label")).not.toBeChecked();
  });

  it("선택된 라디오 버튼이 렌더링되어야 한다.", () => {
    render(<Radio label="Radio Label" name="radio-group" defaultChecked />);
    expect(screen.getByLabelText("Radio Label")).toBeInTheDocument();
    expect(screen.getByLabelText("Radio Label")).toBeChecked();
  });

  it("비활성화된 라디오 버튼이 렌더링된다.", () => {
    render(<Radio label="Radio Label" name="radio-group" disabled />);
    expect(screen.getByLabelText("Radio Label")).toBeDisabled();
  });
});
