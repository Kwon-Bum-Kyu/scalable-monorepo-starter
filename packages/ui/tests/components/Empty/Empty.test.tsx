import { render } from "@testing-library/react";
import { describe, expect,it } from "vitest";

import Empty from "../../../src/components/Empty";

describe("Empty 컴포넌트", () => {
  it("기본 Empty 컴포넌트가 렌더링되어야 한다.", () => {
    const { container } = render(<Empty />);
    expect(container.querySelector("div")).toBeInTheDocument();
  });

  it("blank 타입으로 렌더링된다.", () => {
    const { container } = render(<Empty type="blank" />);
    expect(container.querySelector("div")).toBeInTheDocument();
  });

  it("image 타입으로 렌더링된다.", () => {
    const { container } = render(<Empty type="image" />);
    expect(container.querySelector("div")).toBeInTheDocument();
  });

  it("text 타입으로 렌더링된다.", () => {
    const { container } = render(<Empty type="text" />);
    expect(container.querySelector("div")).toBeInTheDocument();
  });

  it("커스텀 사이즈로 렌더링된다.", () => {
    const { container } = render(<Empty size={128} />);
    const element = container.querySelector("div");
    expect(element).toHaveStyle({ width: "128px", height: "128px" });
  });
});
