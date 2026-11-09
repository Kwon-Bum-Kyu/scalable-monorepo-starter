import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { ComponentsSection } from "@/view/guide/sections/components";

const card = (name: string) => screen.getByRole("heading", { level: 3, name }).closest("div") as HTMLElement;

describe("기본 컴포넌트 섹션", () => {
  it("카드 9개를 시안 순서대로 렌더한다", () => {
    render(<ComponentsSection />);
    expect(screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent)).toEqual([
      "Button", "Input", "Selection", "Slider", "Badge", "Card", "Toast", "Modal", "Tabs",
    ]);
  });

  it("격자가 Tablet 2열, Desktop 3열일 때 카드가 좁은 폭에서 넘치지 않는다", () => {
    const { container } = render(<ComponentsSection />);
    expect(container.querySelector(".grid.grid-cols-1")).toHaveClass("tablet:grid-cols-2", "desktop:grid-cols-3");
  });

  it("Input 카드의 캡션 Label이 기본 굵기보다 가벼운 font-normal이다", () => {
    render(<ComponentsSection />);
    ["default", "aria-invalid", "disabled"].forEach((name) =>
      expect(screen.getByText(name, { selector: "label" })).toHaveClass("font-normal"),
    );
  });

  it("Radio 글자가 Label로 첫 라디오와 연결될 때 글자를 눌러도 선택할 수 있다", () => {
    render(<ComponentsSection />);
    const label = screen.getByText("Radio", { selector: "label" });
    expect(document.getElementById(label.getAttribute("for")!)).toHaveAttribute("role", "radio");
  });

  it("Button이 variant 6개와 size 3개, 상태 견본 3개를 렌더한다", () => {
    render(<ComponentsSection />);
    const buttons = within(card("Button")).getAllByRole("button");
    expect(buttons).toHaveLength(12);
    ["default", "secondary", "outline", "ghost", "destructive", "link"].forEach((v) =>
      expect(within(card("Button")).getAllByRole("button", { name: v }).length).toBeGreaterThan(0),
    );
    expect(within(card("Button")).getByRole("button", { name: "disabled" })).toBeDisabled();
  });

  it("Input의 invalid 상태가 오류 문구와 aria-describedby로 연결된다", () => {
    render(<ComponentsSection />);
    const input = screen.getByLabelText("aria-invalid");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("Title을 입력해야 저장할 수 있습니다.");
    expect(screen.getByLabelText("disabled")).toBeDisabled();
    expect(screen.getByPlaceholderText("예제 제목")).toBeInTheDocument();
  });

  it("Selection과 Slider가 실제 컨트롤을 렌더한다", () => {
    render(<ComponentsSection />);
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
    expect(screen.getByRole("radiogroup")).toBeInTheDocument();
    expect(screen.getAllByRole("radio")).toHaveLength(2);
    expect(screen.getByRole("switch")).toBeInTheDocument();
    // 단일 Slider thumb 1개 + 범위 Slider thumb 2개
    expect(screen.getAllByRole("slider")).toHaveLength(3);
  });

  it("Badge가 variant 7개와 shape 견본 3개를 렌더한다", () => {
    render(<ComponentsSection />);
    const badge = card("Badge");
    ["default", "primary", "secondary", "success", "warn", "destructive", "outline", "pill", "sq", "dot"].forEach((label) =>
      expect(within(badge).getAllByText(label).length).toBeGreaterThan(0),
    );
  });

  it("Toast 견본이 오류 문구를 알림 영역으로 렌더한다", () => {
    render(<ComponentsSection />);
    expect(within(card("Toast")).getByRole("status")).toHaveTextContent("알 수 없는 오류");
  });

  it("Modal 트리거를 클릭할 때 dialog가 열린다", async () => {
    render(<ComponentsSection />);
    await userEvent.click(within(card("Modal")).getByRole("button", { name: "Dialog" }));
    expect(screen.getByRole("dialog")).toHaveTextContent("Dialog");
  });

  it("Tabs 세 종류가 탭 3개씩을 렌더하고 견본 자리 문구가 없다", () => {
    const { container } = render(<ComponentsSection />);
    expect(screen.getAllByRole("tablist")).toHaveLength(3);
    ["underline", "boxed"].forEach((v) => expect(screen.getByRole("tablist", { name: `Tabs ${v} 견본` })).toHaveClass("w-full"));
    expect(screen.getAllByRole("tab")).toHaveLength(9);
    expect(container).not.toHaveTextContent("견본 자리");
  });
});
