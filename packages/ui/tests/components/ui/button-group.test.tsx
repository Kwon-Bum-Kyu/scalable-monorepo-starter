import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Button } from "@repo/ui/components/button";
import { ButtonGroup } from "@repo/ui/components/button-group";

describe("ButtonGroup", () => {
  it("자식 Button이 role=group 컨테이너 안에 렌더된다", () => {
    render(
      <ButtonGroup>
        <Button>A</Button>
        <Button>B</Button>
      </ButtonGroup>
    );
    const group = screen.getByRole("group");
    expect(group).toBeInTheDocument();
    expect(group.querySelectorAll("button")).toHaveLength(2);
  });

  it("orientation=vertical일 때 flex-col 클래스가 적용된다", () => {
    render(
      <ButtonGroup orientation="vertical">
        <Button>A</Button>
        <Button>B</Button>
      </ButtonGroup>
    );
    expect(screen.getByRole("group")).toHaveClass("flex-col");
  });

  it("orientation 기본값은 horizontal이며 inline-flex가 적용된다", () => {
    render(
      <ButtonGroup>
        <Button>A</Button>
      </ButtonGroup>
    );
    expect(screen.getByRole("group")).toHaveClass("inline-flex");
  });
});
