import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import CodeBlock from "@/view/home/CodeBlock";

const segments = [
  { text: "npx degit " },
  { text: "<your-org>", isVariable: true },
  { text: "/starter" },
];

const click = async (): Promise<void> => {
  await act(async () => {
    fireEvent.click(screen.getByRole("button", { name: "복사" }));
  });
};

describe("CodeBlock", () => {
  const writeText = vi.fn();

  beforeEach(() => {
    vi.useFakeTimers();
    writeText.mockReset();
    writeText.mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      configurable: true,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("복사를 누를 때 세그먼트를 이은 문자열을 클립보드에 쓰고 복사됨을 표시한다", async () => {
    render(<CodeBlock segments={segments} />);
    await click();
    expect(writeText).toHaveBeenCalledWith("npx degit <your-org>/starter");
    expect(screen.getByText("복사됨")).toBeInTheDocument();
  });

  it("복사 버튼이 코드 블록을 aria-describedby로 가리킨다", () => {
    const { container } = render(<CodeBlock segments={segments} />);
    const pre = container.querySelector("pre");
    expect(pre?.id).toBeTruthy();
    expect(screen.getByRole("button", { name: "복사" })).toHaveAttribute(
      "aria-describedby",
      pre?.id,
    );
  });

  it("복사 버튼이 lg 크기이고 Tablet부터 32px로 줄어든다", () => {
    render(<CodeBlock segments={segments} />);
    expect(screen.getByRole("button", { name: "복사" })).toHaveClass(
      "h-11",
      "tablet:h-8",
      "tablet:px-3",
      "tablet:text-sm",
    );
  });

  it("복사됨이 표시된 지 2초가 지날 때 복사로 돌아간다", async () => {
    render(<CodeBlock segments={segments} />);
    await click();
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(screen.getByText("복사")).toBeInTheDocument();
    expect(screen.queryByText("복사됨")).toBeNull();
  });

  it("클립보드 쓰기가 거부될 때 표시를 바꾸지 못한다", async () => {
    writeText.mockRejectedValue(new Error("denied"));
    render(<CodeBlock segments={segments} />);
    await click();
    expect(screen.getByText("복사")).toBeInTheDocument();
    expect(screen.queryByText("복사됨")).toBeNull();
  });

  it("변수 세그먼트일 때 점선 테두리 클래스를 가진다", () => {
    render(<CodeBlock segments={segments} />);
    expect(screen.getByText("<your-org>")).toHaveClass("border-dashed");
    expect(screen.getByText("npx degit")).not.toHaveClass("border-dashed");
  });

  it("언어를 지정하지 않을 때 bash를 표시한다", () => {
    render(<CodeBlock segments={segments} />);
    expect(screen.getByText("bash")).toBeInTheDocument();
  });

  it("[넘치는 코드 블록]이 키보드 포커스를 받을 때 어두운 장면 포커스 링을 표시한다", () => {
    const { container } = render(<CodeBlock segments={segments} />);
    expect(container.querySelector("pre")).toHaveClass(
      "focus-visible:outline-none",
      "focus-visible:ring-2",
      "focus-visible:ring-system-white",
      "focus-visible:ring-offset-2",
      "focus-visible:ring-offset-gray-900",
    );
  });

  it("복사됨 상태에서 unmount될 때 대기 중인 타이머를 정리한다", async () => {
    const { unmount } = render(<CodeBlock segments={segments} />);
    await click();
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});
