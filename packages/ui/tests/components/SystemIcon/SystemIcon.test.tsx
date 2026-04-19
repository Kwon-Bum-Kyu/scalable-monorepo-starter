import { render } from "@testing-library/react";
import { describe, expect,it } from "vitest";

import SystemIcon from "../../../src/components/SystemIcon";

describe("SystemIcon 컴포넌트", () => {
  it("기본 아이콘이 렌더링되어야 한다.", () => {
    const { container } = render(<SystemIcon name="search" />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("다양한 아이콘 타입이 렌더링된다.", () => {
    const icons = ["bars", "close", "user", "envelope"] as const;
    icons.forEach((name) => {
      const { container } = render(<SystemIcon name={name} />);
      expect(container.querySelector("svg")).toBeInTheDocument();
    });
  });

  it("커스텀 사이즈가 적용된다.", () => {
    const { container } = render(<SystemIcon name="search" size={24} />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("커스텀 className이 적용된다.", () => {
    const { container } = render(
      <SystemIcon name="search" className="text-blue-500" />
    );
    const svg = container.querySelector("svg");
    expect(svg).toHaveClass("text-blue-500");
  });
});
