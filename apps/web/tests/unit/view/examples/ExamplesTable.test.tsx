import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import ExamplesTable from "@/view/examples/ExamplesTable";

const items = [
  {
    id: "id-1",
    title: "첫 번째 예제",
    status: "draft" as const,
    createdAt: "2026-11-01T00:00:00.000Z",
  },
];

const renderTable = (
  props: Partial<React.ComponentProps<typeof ExamplesTable>> = {},
) =>
  render(
    <ExamplesTable
      view="list"
      items={items}
      busy={false}
      onEdit={() => {}}
      onDelete={() => {}}
      onRetry={() => {}}
      {...props}
    />,
  );

describe("ExamplesTable", () => {
  it("표 머리 4개가 Title·Status·Created·Actions 순서로 보인다", () => {
    renderTable();

    expect(
      screen.getAllByRole("columnheader").map((th) => th.textContent),
    ).toEqual(["Title", "Status", "Created", "Actions"]);
  });

  it("[상태: 재조회 중] 행을 유지하면서 aria-busy가 true이다", () => {
    renderTable({ busy: true });

    expect(screen.getByText("첫 번째 예제")).toBeInTheDocument();
    expect(screen.getByRole("table").parentElement).toHaveAttribute(
      "aria-busy",
      "true",
    );
  });

  it("[상태: 로딩 중] 자리표시 행 3개가 실제 행과 같은 높이 클래스를 가진다", () => {
    renderTable({ view: "loading", items: [] });

    const rows = screen.getAllByRole("row").slice(1);
    expect(rows).toHaveLength(3);
    rows.forEach((row) => expect(row).toHaveClass("h-17", "tablet:h-14"));
  });

  it("조회 실패일 때 표 머리만 남기고 alert 안내를 보여 준다", () => {
    renderTable({ view: "error", items: [] });

    expect(screen.getAllByRole("row")).toHaveLength(1);
    expect(
      within(screen.getByRole("alert")).getByRole("button", {
        name: "다시 시도",
      }),
    ).toBeInTheDocument();
  });

  it("다시 시도를 클릭하면 onRetry가 호출된다", async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    renderTable({ view: "error", items: [], onRetry });

    await user.click(screen.getByRole("button", { name: "다시 시도" }));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
