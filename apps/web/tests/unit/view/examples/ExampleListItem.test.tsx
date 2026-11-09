import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import ExampleListItem from "@/view/examples/ExampleListItem";

const item = {
  id: "id-1",
  title: "첫 번째 예제",
  status: "published" as const,
  createdAt: "2026-11-03T00:00:00.000Z",
};

const renderRow = (onEdit = vi.fn(), onDelete = vi.fn()) => {
  render(
    <table>
      <tbody>
        <ExampleListItem item={item} onEdit={onEdit} onDelete={onDelete} />
      </tbody>
    </table>,
  );
  return { onEdit, onDelete };
};

describe("ExampleListItem", () => {
  it("Status가 Badge 문자 값으로 보인다", () => {
    renderRow();

    expect(screen.getByText("published")).toHaveClass("rounded-full");
  });

  it("Edit 버튼을 클릭하면 id와 함께 onEdit이 호출된다", async () => {
    const user = userEvent.setup();
    const { onEdit, onDelete } = renderRow();

    await user.click(screen.getByRole("button", { name: "Edit 첫 번째 예제" }));

    expect(onEdit).toHaveBeenCalledWith("id-1");
    expect(onDelete).not.toHaveBeenCalled();
  });

  it("Delete 버튼을 클릭하면 id와 함께 onDelete가 호출된다", async () => {
    const user = userEvent.setup();
    const { onDelete } = renderRow();

    await user.click(
      screen.getByRole("button", { name: "Delete 첫 번째 예제" }),
    );

    expect(onDelete).toHaveBeenCalledWith("id-1");
  });
});
