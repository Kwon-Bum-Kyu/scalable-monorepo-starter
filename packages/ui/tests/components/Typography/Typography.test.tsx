import { render, screen } from "@testing-library/react";
import { describe, expect,it } from "vitest";

import Typography from "../../../src/components/Typography";

describe("Typography 컴포넌트", () => {
  it("텍스트가 올바르게 렌더링되어야 한다.", () => {
    render(<Typography>Typography text example</Typography>);
    expect(screen.getByText("Typography text example")).toBeInTheDocument();
  });

  it("h1 variant가 적용된다.", () => {
    render(<Typography variant="h1">Heading 1</Typography>);
    expect(screen.getByText("Heading 1")).toBeInTheDocument();
  });

  it("paragraph variant가 적용된다.", () => {
    render(<Typography variant="paragraph">Paragraph text</Typography>);
    expect(screen.getByText("Paragraph text")).toBeInTheDocument();
  });

  it("커스텀 className이 적용된다.", () => {
    render(
      <Typography className="custom-class">Styled text</Typography>
    );
    expect(screen.getByText("Styled text")).toHaveClass("custom-class");
  });
});
