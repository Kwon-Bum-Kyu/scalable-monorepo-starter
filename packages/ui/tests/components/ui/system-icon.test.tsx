import {
  SYSTEM_ICON_NAMES,
  SystemIcon,
} from "@repo/ui/components/system-icon";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("SystemIcon", () => {
  it("유효한 name이 주어지면 lucide svg가 렌더된다", () => {
    render(<SystemIcon name="search" data-testid="icon" />);
    const node = screen.getByTestId("icon");
    expect(node.tagName.toLowerCase()).toBe("svg");
  });

  it("className이 svg에 적용된다", () => {
    render(
      <SystemIcon
        name="close"
        className="text-destructive"
        data-testid="icon"
      />,
    );
    expect(screen.getByTestId("icon")).toHaveClass("text-destructive");
  });

  it("SystemIcon이 copy와 octagon-x 이름을 받을 때 각각 svg를 렌더한다", () => {
    const { rerender } = render(
      <SystemIcon name="copy" data-testid="icon" />,
    );
    expect(screen.getByTestId("icon").tagName.toLowerCase()).toBe("svg");

    rerender(<SystemIcon name="octagon-x" data-testid="icon" />);
    expect(screen.getByTestId("icon").tagName.toLowerCase()).toBe("svg");
  });

  it("SystemIcon이 지원하는 이름을 런타임 목록으로 공개한다", () => {
    expect(SYSTEM_ICON_NAMES).toContain("copy");
    expect(SYSTEM_ICON_NAMES).toContain("octagon-x");
    expect(new Set(SYSTEM_ICON_NAMES).size).toBe(SYSTEM_ICON_NAMES.length);
  });

  it("알 수 없는 name이면 null을 반환한다", () => {
    const { container } = render(
      // @ts-expect-error 의도적으로 잘못된 이름 전달
      <SystemIcon name="__invalid__" />,
    );
    expect(container.firstChild).toBeNull();
  });
});
