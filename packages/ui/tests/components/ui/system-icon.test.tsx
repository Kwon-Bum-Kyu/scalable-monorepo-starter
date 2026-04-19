import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SystemIcon } from "@repo/ui/components/system-icon";

describe("SystemIcon", () => {
  it("유효한 name이 주어지면 lucide svg가 렌더된다", () => {
    render(<SystemIcon name="search" data-testid="icon" />);
    const node = screen.getByTestId("icon");
    expect(node.tagName.toLowerCase()).toBe("svg");
  });

  it("className이 svg에 적용된다", () => {
    render(
      <SystemIcon name="close" className="text-destructive" data-testid="icon" />
    );
    expect(screen.getByTestId("icon")).toHaveClass("text-destructive");
  });

  it("알 수 없는 name이면 null을 반환한다", () => {
    const { container } = render(
      // @ts-expect-error 의도적으로 잘못된 이름 전달
      <SystemIcon name="__invalid__" />
    );
    expect(container.firstChild).toBeNull();
  });
});
