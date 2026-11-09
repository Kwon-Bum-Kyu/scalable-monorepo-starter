import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import InlineCode from "@/components/InlineCode";

describe("InlineCode", () => {
  it("백틱으로 감싼 구간만 code로 렌더한다", () => {
    const { container } = render(<InlineCode text="`apps/web`은 `@/` 별칭 필수" />);
    const codes = container.querySelectorAll("code");
    expect(codes).toHaveLength(2);
    expect(codes[0]).toHaveTextContent("apps/web");
    expect(codes[0]).toHaveClass("font-mono", "whitespace-nowrap");
    expect(codes[1]).toHaveTextContent("@/");
  });

  it("백틱이 없을 때 일반 텍스트로만 렌더한다", () => {
    const { container } = render(<InlineCode text="평범한 문장" />);
    expect(screen.getByText("평범한 문장")).toBeInTheDocument();
    expect(container.querySelector("code")).toBeNull();
  });

  it("백틱이 맨 앞에 있을 때 첫 구간을 code로 렌더한다", () => {
    const { container } = render(<InlineCode text="`a` b" />);
    expect(container.querySelector("code")).toHaveTextContent("a");
  });
});
