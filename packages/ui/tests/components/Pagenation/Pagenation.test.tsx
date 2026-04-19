import { fireEvent,render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import Pagination from "../../../src/components/Pagenation";

describe("Pagination 컴포넌트", () => {
  it("올바른 페이지 번호와 네비게이션 버튼이 렌더링되어야 한다.", () => {
    render(<Pagination current={1} total={10} onChange={() => {}} />);
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("<")).toBeInTheDocument();
    expect(screen.getByText(">")).toBeInTheDocument();
  });

  it("페이지 변경 시 onChange가 호출된다.", () => {
    const handleChange = vi.fn();
    render(<Pagination current={1} total={10} onChange={handleChange} />);
    const nextButton = screen.getByText(">");
    fireEvent.click(nextButton);
    expect(handleChange).toHaveBeenCalledWith(2);
  });

  it("첫 페이지에서 이전 버튼이 비활성화된다.", () => {
    render(<Pagination current={1} total={10} onChange={() => {}} />);
    const prevButton = screen.getByText("<");
    expect(prevButton).toBeDisabled();
  });

  it("마지막 페이지에서 다음 버튼이 비활성화된다.", () => {
    render(<Pagination current={10} total={10} onChange={() => {}} />);
    const nextButton = screen.getByText(">");
    expect(nextButton).toBeDisabled();
  });
});
