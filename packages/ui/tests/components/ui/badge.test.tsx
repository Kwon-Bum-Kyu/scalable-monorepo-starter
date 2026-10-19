import { Badge } from "@repo/ui/components/badge";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("Badge", () => {
  it("기본 variant가 렌더되고 텍스트가 노출된다", () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText("New")).toBeInTheDocument();
  });

  it("variant가 default일 때 neutral 톤(bg-gray-50) 배경 클래스가 적용된다", () => {
    render(<Badge data-testid="badge">Default</Badge>);
    expect(screen.getByTestId("badge").className).toContain("bg-gray-50");
  });

  it("variant가 destructive일 때 destructive 배경 클래스가 적용된다", () => {
    render(
      <Badge variant="destructive" data-testid="badge">
        Destructive
      </Badge>,
    );
    expect(screen.getByTestId("badge").className).toContain("bg-destructive");
  });

  it("variant가 success일 때 system-green 배경 클래스가 적용된다", () => {
    render(
      <Badge variant="success" data-testid="badge">
        Success
      </Badge>,
    );
    expect(screen.getByTestId("badge").className).toContain("bg-system-green");
  });

  it("5개 variants(default·secondary·outline·destructive·success) 모두 다른 클래스를 갖는다", () => {
    const { rerender } = render(
      <Badge variant="default" data-testid="badge">
        x
      </Badge>,
    );
    const seen = new Set<string>();
    seen.add(screen.getByTestId("badge").className);

    for (const v of ["secondary", "outline", "destructive", "success"] as const) {
      rerender(
        <Badge variant={v} data-testid="badge">
          x
        </Badge>,
      );
      seen.add(screen.getByTestId("badge").className);
    }

    expect(seen.size).toBe(5);
  });
});
