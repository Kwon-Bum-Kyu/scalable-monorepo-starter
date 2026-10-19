import { SimplePagination } from "@repo/ui/components/simple-pagination";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

describe("SimplePagination", () => {
  it("current 페이지에 aria-current=page가 적용된다", () => {
    render(<SimplePagination current={2} total={5} />);
    const active = screen.getByRole("link", { name: "2" });
    expect(active).toHaveAttribute("aria-current", "page");
  });

  it("페이지 숫자 클릭 시 onChange가 해당 숫자로 호출된다", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<SimplePagination current={1} total={5} onChange={onChange} />);
    await user.click(screen.getByRole("link", { name: "3" }));
    expect(onChange).toHaveBeenCalledWith(3);
  });

  it("current=1일 때 이전 버튼은 숨겨지거나 비활성화된다", () => {
    render(<SimplePagination current={1} total={3} />);
    const prev = screen.queryByRole("link", { name: /previous/i });
    if (prev) {
      expect(prev).toHaveAttribute("aria-disabled", "true");
    } else {
      expect(prev).toBeNull();
    }
  });

  it("total 이하의 페이지만 렌더된다", () => {
    render(<SimplePagination current={1} total={3} />);
    expect(screen.getByRole("link", { name: "1" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "3" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "4" })).toBeNull();
  });

  it("총 페이지가 많을 때 ellipsis 윈도우로 축약된다", () => {
    render(<SimplePagination current={50} total={100} />);
    expect(screen.getByRole("link", { name: "1" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "100" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "50" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "25" })).toBeNull();
    expect(screen.queryByRole("link", { name: "75" })).toBeNull();
    expect(screen.getAllByText("More pages").length).toBeGreaterThan(0);
  });
});
