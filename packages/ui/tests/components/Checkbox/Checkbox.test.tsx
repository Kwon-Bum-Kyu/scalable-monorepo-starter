import { render, screen } from "@testing-library/react";
import { describe, expect,it } from "vitest";

import Checkbox from "../../../src/components/Checkbox";

describe("Checkbox 컴포넌트", () => {
  it("기본 체크박스가 렌더링되어야 한다.", () => {
    render(<Checkbox label="Checkbox Label" />);
    expect(screen.getByLabelText("Checkbox Label")).toBeInTheDocument();
    expect(screen.getByLabelText("Checkbox Label")).not.toBeChecked();
  });

  it("선택된 체크박스가 렌더링되어야 한다.", () => {
    render(<Checkbox label="Checkbox Label" defaultChecked />);
    expect(screen.getByLabelText("Checkbox Label")).toBeInTheDocument();
    expect(screen.getByLabelText("Checkbox Label")).toBeChecked();
  });

  it("비활성화된 체크박스가 렌더링된다.", () => {
    render(<Checkbox label="Checkbox Label" disabled />);
    expect(screen.getByLabelText("Checkbox Label")).toBeDisabled();
  });
});
