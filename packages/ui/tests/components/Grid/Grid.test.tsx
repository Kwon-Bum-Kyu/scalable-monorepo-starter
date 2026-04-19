import { render, screen } from "@testing-library/react";
import { describe, expect,it } from "vitest";

import { Grid, GridItem } from "../../../src/components/Grid";

describe("Grid 컴포넌트", () => {
  it("그리드 아이템들이 올바르게 렌더링되어야 한다.", () => {
    render(
      <Grid>
        <GridItem>1</GridItem>
        <GridItem>2</GridItem>
        <GridItem>3</GridItem>
      </Grid>
    );
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("GridItem에 className이 적용된다.", () => {
    render(
      <Grid>
        <GridItem className="custom-class">Content</GridItem>
      </Grid>
    );
    const item = screen.getByText("Content");
    expect(item).toHaveClass("custom-class");
  });
});
