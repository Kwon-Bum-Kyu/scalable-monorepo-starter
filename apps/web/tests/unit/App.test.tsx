import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";
import { describe, expect, it } from "vitest";

import App from "@/App";

describe("App", () => {
  it("앱이 마운트된 후 toast를 호출하면 알림 컨테이너가 노출된다", async () => {
    const user = userEvent.setup();
    render(
      <>
        <button onClick={() => toast("앱 토스트")}>알림</button>
        <App />
      </>,
    );
    await user.click(screen.getByRole("button", { name: "알림" }));
    await screen.findByText("앱 토스트");
    expect(document.querySelector("[data-sonner-toaster]")).not.toBeNull();
  });
});
