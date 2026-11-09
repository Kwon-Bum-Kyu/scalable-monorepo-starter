import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { QuickstartSection } from "@/view/home/sections/quickstart";

describe("QuickstartSection", () => {
  it("시작하기가 렌더될 때 제목과 네 단계 목록을 표시한다", () => {
    render(<QuickstartSection />);
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "네 단계로 로컬 개발 환경을 띄웁니다.",
      }),
    ).toHaveAttribute("id", "quickstart-title");
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(4);
    expect(screen.getByText("01")).toHaveClass("font-display");
    expect(screen.getByText("04")).toHaveClass("font-display");
  });

  it("단계 목록이 Desktop부터 2열이고 그 전에는 1열이다", () => {
    render(<QuickstartSection />);
    const list = screen.getAllByRole("list")[0];
    expect(list).toHaveClass("grid-cols-1", "desktop:grid-cols-2");
    expect(list).not.toHaveClass("tablet:grid-cols-2");
  });

  it("3단계에서 npm run dev가 앱별 기동보다 앞에 온다", () => {
    const { container } = render(<QuickstartSection />);
    const codes = [...container.querySelectorAll("pre")].map((pre) => pre.textContent);
    expect(codes).toEqual([
      "npx degit <your-org>/scalable-monorepo-starter my-project",
      "npm install\ncp .env.example .env",
      "npm run dev",
      "turbo run dev --filter=<web|api|storybook|desktop>",
    ]);
  });

  it("4단계 표가 머리 두 칸과 서비스 주소 네 행을 보여 준다", () => {
    render(<QuickstartSection />);
    const table = screen.getByRole("table");
    expect(
      within(table)
        .getAllByRole("columnheader")
        .map((h) => h.textContent),
    ).toEqual(["서비스", "주소"]);
    expect(within(table).getAllByRole("row")).toHaveLength(5);
    expect(within(table).getByText("http://localhost:5555").tagName).toBe("CODE");
  });

  it("도움말의 백틱 구간이 code로 렌더된다", () => {
    render(<QuickstartSection />);
    expect(screen.getByText("DATABASE_URL").tagName).toBe("CODE");
    expect(screen.getByText("--filter").tagName).toBe("CODE");
  });
});
