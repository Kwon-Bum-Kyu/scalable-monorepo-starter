import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef, useRef, useState } from "react";
import { describe, expect, it, vi } from "vitest";

import ExampleFormDialog from "@/view/examples/ExampleFormDialog";
import {
  EMPTY_EXAMPLE_FORM,
  type ExampleFormState,
} from "@/view/examples/exampleFormState";

const noop = () => {};

const renderDialog = (
  props: Partial<React.ComponentProps<typeof ExampleFormDialog>> = {},
) =>
  render(
    <ExampleFormDialog
      open={true}
      mode="create"
      value={EMPTY_EXAMPLE_FORM}
      onChange={noop}
      onSubmit={noop}
      onClose={noop}
      returnFocusRef={createRef<HTMLElement>()}
      {...props}
    />,
  );

const Harness = ({ initial }: { initial: ExampleFormState }) => {
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={(event) => {
          returnFocusRef.current = event.currentTarget;
          setOpen(true);
        }}
      >
        열기
      </button>
      <ExampleFormDialog
        open={open}
        mode="create"
        value={initial}
        onChange={noop}
        onSubmit={noop}
        onClose={() => setOpen(false)}
        returnFocusRef={returnFocusRef}
      />
    </>
  );
};

describe("ExampleFormDialog", () => {
  it("[상태: open=false] 다이얼로그가 렌더되지 않는다", () => {
    renderDialog({ open: false });

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("열리면 공유 Dialog 구조(dialog, radiogroup, textarea)로 렌더되고 자체 그림자·반경 클래스가 없다", () => {
    renderDialog();

    const dialog = screen.getByRole("dialog", { name: "New Example" });
    expect(screen.getByRole("radiogroup")).toBeInTheDocument();
    expect(screen.getByLabelText("Description").tagName).toBe("TEXTAREA");
    expect(dialog.className).not.toContain("shadow-md");
    expect(dialog.className).not.toContain("rounded-md");
  });

  it("[모드: edit] 헤더가 'Edit Example' 이고 제출 버튼은 'Save'이다", () => {
    renderDialog({
      mode: "edit",
      value: { ...EMPTY_EXAMPLE_FORM, title: "기존" },
    });

    expect(screen.getByText("Edit Example")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^save$/i })).toBeEnabled();
  });

  it("Cancel 버튼 클릭 시 onClose가 호출된다", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderDialog({ value: { ...EMPTY_EXAMPLE_FORM, title: "x" }, onClose });

    await user.click(screen.getByRole("button", { name: /cancel/i }));

    expect(onClose).toHaveBeenCalled();
  });

  it("title 입력 시 onChange가 새 객체로 호출된다", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderDialog({ onChange });

    await user.type(screen.getByLabelText(/Title/), "a");

    expect(onChange.mock.calls[0][0]).toMatchObject({ title: "a" });
  });

  it("title이 공백뿐일 때 제출 버튼을 클릭할 수 없다", () => {
    renderDialog({ value: { ...EMPTY_EXAMPLE_FORM, title: "   " } });

    expect(screen.getByRole("button", { name: /create/i })).toBeDisabled();
  });

  it("title이 있으면 제출 버튼이 활성이고 클릭 시 onSubmit이 호출된다", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    renderDialog({
      value: { ...EMPTY_EXAMPLE_FORM, title: "x" },
      onSubmit,
    });

    await user.click(screen.getByRole("button", { name: /^create$/i }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("title이 비었을 때 Enter로는 제출할 수 없다", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    renderDialog({ onSubmit });

    await user.type(screen.getByLabelText(/Title/), "{Enter}");

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("Title을 비운 채 포커스를 떠나면 오류 표시가 켜진다", async () => {
    const user = userEvent.setup();
    renderDialog();
    const title = screen.getByLabelText(/Title/);
    const help = screen.getByText("Title을 입력해야 저장할 수 있습니다.");
    expect(title).toHaveAttribute("aria-invalid", "false");
    expect(help).toHaveClass("text-muted-foreground");

    await user.tab();
    await user.tab({ shift: true });
    await user.tab();

    expect(title).toHaveAttribute("aria-invalid", "true");
    expect(help).toHaveClass("text-destructive");
  });

  it("status 라디오를 선택하면 onChange가 해당 status로 호출된다", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderDialog({ onChange });

    await user.click(screen.getByRole("radio", { name: "published" }));

    expect(onChange.mock.calls[0][0]).toMatchObject({ status: "published" });
  });

  it("description 입력 시 onChange가 새 description으로 호출된다", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderDialog({ onChange });

    await user.type(screen.getByLabelText("Description"), "d");

    expect(onChange.mock.calls[0][0]).toMatchObject({ description: "d" });
  });

  it("Escape 키를 누르면 onClose가 호출된다", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderDialog({ onClose });

    await user.keyboard("{Escape}");

    expect(onClose).toHaveBeenCalled();
  });

  it("열리면 title 입력에 포커스가 이동한다", () => {
    renderDialog();

    expect(screen.getByLabelText(/Title/)).toHaveFocus();
  });

  it("닫기 버튼은 sr-only 이름 '닫기'를 가진다", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderDialog({ onClose });

    await user.click(screen.getByRole("button", { name: "닫기" }));

    expect(onClose).toHaveBeenCalled();
  });

  it("마지막 요소에서 Tab을 누르면 다이얼로그 안에 포커스가 머문다", async () => {
    const user = userEvent.setup();
    renderDialog({ value: { ...EMPTY_EXAMPLE_FORM, title: "x" } });

    screen.getByRole("button", { name: /create/i }).focus();
    await user.tab();
    await user.tab();

    expect(screen.getByRole("dialog")).toContainElement(
      document.activeElement as HTMLElement,
    );
  });

  it("첫 요소에서 Shift+Tab을 누르면 다이얼로그 안에 포커스가 머문다", async () => {
    const user = userEvent.setup();
    renderDialog();

    screen.getByRole("button", { name: "닫기" }).focus();
    await user.tab({ shift: true });

    expect(screen.getByRole("dialog")).toContainElement(
      document.activeElement as HTMLElement,
    );
  });

  it("Title 입력은 Mobile 44px, Tablet 40px 높이 클래스를 가진다", () => {
    renderDialog();

    expect(screen.getByLabelText(/Title/)).toHaveClass("h-11", "tablet:h-10");
  });

  describe.each([
    [
      "Cancel 클릭",
      async (user: ReturnType<typeof userEvent.setup>) => {
        await user.click(screen.getByRole("button", { name: "Cancel" }));
      },
    ],
    [
      "Esc",
      async (user: ReturnType<typeof userEvent.setup>) => {
        await user.keyboard("{Escape}");
      },
    ],
    [
      "닫기 클릭",
      async (user: ReturnType<typeof userEvent.setup>) => {
        await user.click(screen.getByRole("button", { name: "닫기" }));
      },
    ],
  ])("포커스 복귀 (%s)", (_name, close) => {
    it("닫은 뒤 포커스가 다이얼로그를 연 버튼으로 돌아온다", async () => {
      const user = userEvent.setup();
      render(<Harness initial={EMPTY_EXAMPLE_FORM} />);

      await user.click(screen.getByRole("button", { name: "열기" }));
      await close(user);

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      expect(screen.getByRole("button", { name: "열기" })).toHaveFocus();
    });
  });
});
