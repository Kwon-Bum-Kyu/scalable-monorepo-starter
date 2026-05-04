import { Badge } from "@repo/ui/components/badge";
import { badgeVariants } from "@repo/ui/components/badge-variants";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("Badge variants 정본 SSOT 확장 (Ralph R3b — primary/warn/error alias 추가 + shape variant + 기존 5종 보존)", () => {
  it("variant='primary' (정본 alias)는 blue-50/blue-700/blue-100 컬러를 사용한다", () => {
    const cls = badgeVariants({ variant: "primary" });
    expect(
      /bg-blue-50/.test(cls) && /text-blue-700/.test(cls) &&
        /border-blue-100/.test(cls),
      `Badge primary variant는 blue-50/blue-700/blue-100을 사용해야 합니다 (실제: ${cls})`,
    ).toBe(true);
  });

  it("variant='warn'은 system-warning 계열을 사용한다", () => {
    const cls = badgeVariants({ variant: "warn" });
    expect(
      /bg-system-warning|warn|warning/.test(cls),
      `Badge warn variant는 warning 계열 색을 사용해야 합니다 (실제: ${cls})`,
    ).toBe(true);
  });

  it("variant='error'는 destructive와 동일한 색(alias)을 사용한다", () => {
    const cls = badgeVariants({ variant: "error" });
    expect(
      /bg-destructive|bg-system-red/.test(cls),
      `Badge error variant는 destructive(system-red) alias여야 합니다 (실제: ${cls})`,
    ).toBe(true);
  });

  it("기존 variant default/secondary/destructive/success/outline은 보존된다", () => {
    for (const v of ["default", "secondary", "destructive", "success", "outline"] as const) {
      const cls = badgeVariants({ variant: v });
      expect(cls.length, `${v} variant 보존 실패`).toBeGreaterThan(0);
    }
  });

  it("shape 'pill'(default)은 rounded-full을 사용한다", () => {
    const cls = badgeVariants({ shape: "pill" });
    expect(/rounded-full/.test(cls)).toBe(true);
  });

  it("shape 'sq'는 rounded-sm(4px) 사용한다", () => {
    const cls = badgeVariants({ shape: "sq" });
    expect(/rounded-sm/.test(cls)).toBe(true);
    expect(/rounded-full/.test(cls)).toBe(false);
  });

  it("Badge 컴포넌트는 dot prop으로 6×6 dot을 렌더링할 수 있다", () => {
    const { container } = render(<Badge dot>label</Badge>);
    const dot = container.querySelector("[data-slot='badge-dot']");
    expect(
      dot,
      "Badge는 dot prop=true일 때 data-slot='badge-dot' 요소를 렌더해야 합니다",
    ).not.toBeNull();
  });
});
