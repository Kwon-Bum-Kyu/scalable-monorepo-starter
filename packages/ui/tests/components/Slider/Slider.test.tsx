import { render, screen } from "@testing-library/react";
import { describe, expect,it } from "vitest";

import Slider from "../../../src/components/Slider";

describe("Slider 컴포넌트", () => {
  it("기본 슬라이더가 렌더링되어야 한다.", () => {
    render(<Slider value={50} onChange={() => {}} />);
    expect(screen.getByRole("slider")).toBeInTheDocument();
  });

  it("라벨과 함께 렌더링된다.", () => {
    render(<Slider label="Volume" value={50} onChange={() => {}} />);
    expect(screen.getByText("Volume")).toBeInTheDocument();
  });

  it("값이 표시된다.", () => {
    render(<Slider value={50} onChange={() => {}} showValue />);
    expect(screen.getByText("50")).toBeInTheDocument();
  });

  it("비활성화 상태로 렌더링된다.", () => {
    render(<Slider value={50} onChange={() => {}} disabled />);
    expect(screen.getByRole("slider")).toBeDisabled();
  });
});
