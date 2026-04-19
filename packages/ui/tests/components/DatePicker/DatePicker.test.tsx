import { fireEvent,render, screen } from "@testing-library/react";
import { describe, expect,it } from "vitest";

import DatePicker from "../../../src/components/DatePicker";

describe("DatePicker 컴포넌트", () => {
  it("기본 DatePicker가 렌더링되어야 한다.", () => {
    render(
      <DatePicker mode="single" value={undefined} onChange={() => {}} />
    );
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("달력이 열리고 닫힐 수 있어야 한다.", () => {
    render(
      <DatePicker mode="single" value={undefined} onChange={() => {}} />
    );
    const button = screen.getByRole("button");
    fireEvent.click(button);
    // 달력이 열리면 날짜 선택 요소가 표시됨
    expect(screen.getByRole("grid")).toBeInTheDocument();
  });

  it("Range 모드로 렌더링될 수 있다.", () => {
    render(
      <DatePicker mode="range" value={undefined} onChange={() => {}} />
    );
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("single 모드에서 value가 Date이면 yyyy-MM-dd 포맷으로 표시한다.", () => {
    render(
      <DatePicker
        mode="single"
        value={new Date("2026-04-19")}
        onChange={() => {}}
      />,
    );
    expect(screen.getByRole("button").textContent).toContain("2026-04-19");
  });

  it("range 모드에서 from만 있으면 시작 날짜만 표시한다.", () => {
    render(
      <DatePicker
        mode="range"
        value={{ from: new Date("2026-04-10") }}
        onChange={() => {}}
      />,
    );
    expect(screen.getByRole("button").textContent).toContain("04/10");
  });

  it("range 모드에서 from·to 모두 있으면 구간으로 표시한다.", () => {
    render(
      <DatePicker
        mode="range"
        value={{ from: new Date("2026-04-10"), to: new Date("2026-04-20") }}
        onChange={() => {}}
      />,
    );
    expect(screen.getByRole("button").textContent).toContain("04/10");
    expect(screen.getByRole("button").textContent).toContain("04/20");
  });
});
