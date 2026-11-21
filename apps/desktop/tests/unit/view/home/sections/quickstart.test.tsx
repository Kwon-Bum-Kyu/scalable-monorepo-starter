import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { QuickstartSection } from "@/view/home/sections/quickstart";

describe("QuickstartSection", () => {
  it("시작하기가 렌더될 때 제목과 세 단계 목록을 표시한다", () => {
    render(<QuickstartSection />);
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "세 단계로 프로젝트를 만들고 필요한 앱만 띄웁니다.",
      }),
    ).toHaveAttribute("id", "quickstart-title");
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(3);
    expect(
      screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent),
    ).toEqual(["프로젝트 만들기", "필요한 앱 띄우기", "접속"]);
    expect(screen.getByText("01")).toHaveClass("font-display");
    expect(screen.getByText("03")).toHaveClass("font-display");
    expect(screen.queryByText("04")).not.toBeInTheDocument();
  });

  it("단계 목록이 Desktop부터 2열이고 그 전에는 1열이며 01 카드는 전체 폭을 차지한다", () => {
    render(<QuickstartSection />);
    const list = screen.getAllByRole("list")[0];
    expect(list).toHaveClass("grid-cols-1", "desktop:grid-cols-2");
    expect(list).not.toHaveClass("tablet:grid-cols-2");
    expect(screen.getAllByRole("listitem")[0]).toHaveClass("desktop:col-span-2");
  });

  it("코드 블록이 만들기, 다른 버전, 앱 띄우기 순서로 나온다", () => {
    const { container } = render(<QuickstartSection />);
    const codes = [...container.querySelectorAll("pre")].map((pre) => pre.textContent);
    expect(codes).toEqual([
      "npm create scalable-monorepo-starter@latest",
      "npm create scalable-monorepo-starter@1.3.0",
      "cd my-app\nnpm run dev:web",
    ]);
  });

  it("01 카드가 만들기 안내와 다른 버전으로 만들기 안내를 함께 가진다", () => {
    render(<QuickstartSection />);
    expect(screen.getByText("다른 버전으로 만들기")).toBeInTheDocument();
    expect(screen.getByText("Node.js 22.13 이상이 필요합니다.")).toBeInTheDocument();
    expect(screen.getByText("@latest").tagName).toBe("CODE");
    expect(
      screen.getByText("npm view create-scalable-monorepo-starter versions").tagName,
    ).toBe("CODE");
    expect(screen.getByRole("link", { name: "Releases" })).toHaveAttribute(
      "href",
      "https://github.com/Kwon-Bum-Kyu/scalable-monorepo-starter/releases",
    );
  });

  it("시작하기에 npx degit과 npm run setup이 나오지 않는다", () => {
    const { container } = render(<QuickstartSection />);
    expect(container.textContent).not.toContain("npx degit");
    expect(container.textContent).not.toContain("npm run setup");
    expect(container.textContent).not.toContain("--filter");
  });

  it("02의 표가 앱별 명령 네 개 뒤에 npm run dev가 마지막 줄로 온다", () => {
    render(<QuickstartSection />);
    const table = screen.getAllByRole("table")[0];
    expect(
      within(table)
        .getAllByRole("columnheader")
        .map((h) => h.textContent),
    ).toEqual(["명령", "띄우는 앱", "사전 조건"]);
    const rows = within(table).getAllByRole("row").slice(1);
    expect(rows.map((r) => within(r).getAllByRole("cell")[0].textContent)).toEqual([
      "npm run dev:api",
      "npm run dev:web",
      "npm run dev:desktop",
      "npm run dev:storybook",
      "npm run dev",
    ]);
    expect(within(rows[0]).getByText("Docker 실행 중")).toBeInTheDocument();
  });

  it("02의 표 아래에 설치하지 않은 앱의 명령은 프로젝트에 없다고 안내한다", () => {
    render(<QuickstartSection />);
    expect(
      screen.getByText(/설치하지 않은 앱의 명령은 프로젝트에 없습니다\./),
    ).toBeInTheDocument();
    expect(screen.getByText("SKIP_DEV_BOOTSTRAP=1").tagName).toBe("CODE");
    expect(screen.getByText("DATABASE_URL").tagName).toBe("CODE");
  });

  it("03의 표가 머리 두 칸과 서비스 주소 네 행을 보여 준다", () => {
    render(<QuickstartSection />);
    const table = screen.getAllByRole("table")[1];
    expect(
      within(table)
        .getAllByRole("columnheader")
        .map((h) => h.textContent),
    ).toEqual(["서비스", "주소"]);
    expect(within(table).getAllByRole("row")).toHaveLength(5);
    expect(within(table).getByText("http://localhost:5555").tagName).toBe("CODE");
    expect(
      screen.getByText(/설치하고 띄운 앱의 주소만 열립니다\./),
    ).toBeInTheDocument();
  });
});
