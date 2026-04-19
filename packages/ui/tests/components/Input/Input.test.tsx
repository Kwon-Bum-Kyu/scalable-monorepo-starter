import { render, screen } from "@testing-library/react";
import { describe, expect,it } from "vitest";

import Input from "../../../src/components/Input";

describe("Input 컴포넌트", () => {
  it("기본 Input이 렌더링되면 모든 요소가 표시된다.", () => {
    render(<Input label="Label" placeholder="Text input" />);
    expect(screen.getByText("Label")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Text input")).toBeInTheDocument();
  });

  it("보조 텍스트가 표시된다.", () => {
    render(<Input label="Label" assistiveText="도움말 텍스트" />);
    expect(screen.getByText("도움말 텍스트")).toBeInTheDocument();
  });

  it("에러 메시지가 표시된다.", () => {
    render(<Input label="Label" errorMessage="에러 발생" />);
    expect(screen.getByText("에러 발생")).toBeInTheDocument();
  });

  it("비활성화 상태로 렌더링된다.", () => {
    render(<Input label="Label" disabled />);
    expect(screen.getByRole("textbox")).toBeDisabled();
  });
});
