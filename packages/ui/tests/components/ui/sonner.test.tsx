import { Toaster } from "@repo/ui/components/sonner";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";
import { describe, expect, it } from "vitest";

describe("Sonner", () => {
  it("Toaster를 마운트하고 toast를 호출하면 알림 컨테이너가 노출된다", async () => {
    const user = userEvent.setup();
    render(
      <>
        <button onClick={() => toast("초기 토스트")}>알림</button>
        <Toaster />
      </>,
    );
    await user.click(screen.getByRole("button", { name: "알림" }));
    await screen.findByText("초기 토스트");
    expect(document.querySelector("[data-sonner-toaster]")).not.toBeNull();
  });

  it("toast.success가 호출되면 메시지가 화면에 등장한다", async () => {
    const user = userEvent.setup();
    render(
      <>
        <button onClick={() => toast.success("저장되었습니다")}>저장</button>
        <Toaster />
      </>,
    );
    await user.click(screen.getByRole("button", { name: "저장" }));
    expect(await screen.findByText("저장되었습니다")).toBeInTheDocument();
  });

  it("toast.error가 호출되면 메시지가 화면에 등장한다", async () => {
    const user = userEvent.setup();
    render(
      <>
        <button onClick={() => toast.error("오류가 발생했습니다")}>오류</button>
        <Toaster />
      </>,
    );
    await user.click(screen.getByRole("button", { name: "오류" }));
    expect(await screen.findByText("오류가 발생했습니다")).toBeInTheDocument();
  });
});
