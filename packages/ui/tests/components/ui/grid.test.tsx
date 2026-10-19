import { Grid, GridItem } from "@repo/ui/components/grid";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("Grid", () => {
  it("cols=3일 때 grid-cols-3 클래스가 적용된다", () => {
    render(
      <Grid data-testid="grid" cols={3}>
        <span>child</span>
      </Grid>,
    );
    expect(screen.getByTestId("grid")).toHaveClass("grid", "grid-cols-3");
  });

  it("gap prop이 gap-* 클래스로 적용된다", () => {
    render(
      <Grid data-testid="grid" cols={2} gap={4}>
        <span>child</span>
      </Grid>,
    );
    expect(screen.getByTestId("grid")).toHaveClass("gap-4");
  });
});

describe("GridItem", () => {
  it("colSpan=2일 때 col-span-2 클래스가 적용된다", () => {
    render(
      <GridItem data-testid="item" colSpan={2}>
        item
      </GridItem>,
    );
    expect(screen.getByTestId("item")).toHaveClass("col-span-2");
  });

  it("colSpan이 없을 때 col-span-* 클래스가 없다", () => {
    render(<GridItem data-testid="item">item</GridItem>);
    const el = screen.getByTestId("item");
    expect(el.className).not.toMatch(/col-span-/);
  });
});
