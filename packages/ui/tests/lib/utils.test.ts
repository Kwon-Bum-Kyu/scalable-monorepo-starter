import { cn } from "@repo/ui/lib/utils";
import { describe, expect, it } from "vitest";

describe("cn", () => {
  it("여러 클래스 문자열을 공백으로 합친다", () => {
    expect(cn("px-2", "py-1")).toBe("px-2 py-1");
  });

  it("false/undefined는 제외한다", () => {
    const disabled = false;
    const maybe: string | undefined = undefined;
    expect(cn("px-2", disabled && "opacity-50", maybe, "py-1")).toBe(
      "px-2 py-1",
    );
  });

  it("Tailwind 충돌 클래스는 뒤의 것이 이긴다 (twMerge)", () => {
    expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4");
  });
});
