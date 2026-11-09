import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  createMemoryRouter,
  Link,
  RouterProvider,
} from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

import RootLayout from "@/components/layouts/RootLayout";

const renderWithRouter = (outlet: React.ReactElement = <div>Outlet</div>) => {
  const router = createMemoryRouter(
    [
      {
        path: "/",
        element: <RootLayout />,
        children: [{ index: true, element: outlet }],
      },
    ],
    { initialEntries: ["/"] },
  );
  return render(<RouterProvider router={router} />);
};

describe("RootLayout", () => {
  afterEach(() => vi.restoreAllMocks());

  it("[루트 레이아웃]이 렌더될 때 헤더와 콘텐츠와 푸터를 순서대로 표시한다", () => {
    renderWithRouter(<div data-testid="outlet">Outlet</div>);

    const banner = screen.getByRole("banner");
    const outlet = screen.getByTestId("outlet");
    const footer = screen.getByRole("contentinfo");
    expect(banner.compareDocumentPosition(outlet)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
    expect(outlet.compareDocumentPosition(footer)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
  });

  it("[헤더 로고]가 렌더될 때 계약된 대체 문구와 반응형 폭을 사용한다", () => {
    renderWithRouter();

    expect(screen.getByAltText("scalable-monorepo-starter")).toHaveClass(
      "w-50",
      "desktop:w-62.5",
    );
    expect(
      screen.getByRole("navigation", { name: "주 메뉴" }),
    ).toBeInTheDocument();
  });

  it("[메인 콘텐츠]가 렌더될 때 페이지 폭을 제한하지 않는다", () => {
    renderWithRouter(<div data-testid="outlet">내용</div>);

    const main = screen.getByRole("main");
    expect(main).toContainElement(screen.getByTestId("outlet"));
    expect(main.className).not.toContain("max-w-app");
    expect(main.className).not.toContain("px-page-x");
  });

  it("[스크롤 복원]이 경로가 바뀔 때 화면 맨 위로 이동한다", async () => {
    const user = userEvent.setup();
    const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    const router = createMemoryRouter(
      [
        {
          path: "/",
          element: <RootLayout />,
          children: [
            { index: true, element: <Link to="/next">다음 화면</Link> },
            { path: "next", element: <div>도착</div> },
          ],
        },
      ],
      { initialEntries: ["/"] },
    );
    render(<RouterProvider router={router} />);
    scrollTo.mockClear();

    await user.click(screen.getByRole("link", { name: "다음 화면" }));

    await waitFor(() => expect(scrollTo).toHaveBeenCalledWith(0, 0));
  });

  it("[푸터]가 렌더될 때 네 개의 계약 열을 표시한다", () => {
    renderWithRouter();

    const footer = screen.getByRole("contentinfo");
    for (const title of ["문서", "워크스페이스", "저장소", "라이선스"]) {
      expect(within(footer).getByRole("heading", { name: title })).toBeVisible();
    }
  });

  it("[푸터 문서 링크]가 렌더될 때 기본 브랜치 파일과 폴더를 가리킨다", () => {
    renderWithRouter();

    expect(screen.getByRole("link", { name: "README" })).toHaveAttribute(
      "href",
      expect.stringContaining("/blob/main/README.md"),
    );
    expect(screen.getByRole("link", { name: "apps/web" })).toHaveAttribute(
      "href",
      expect.stringContaining("/tree/main/apps/web"),
    );
    expect(screen.getByRole("link", { name: "MIT" })).toHaveAttribute(
      "href",
      expect.stringContaining("/blob/main/LICENSE"),
    );
    expect(screen.getByRole("link", { name: "apps/web" })).toHaveClass(
      "font-mono",
    );
  });

  it("[푸터 이메일]이 렌더될 때 정확한 메일 링크를 노출한다", () => {
    renderWithRouter();

    expect(screen.getByRole("link", { name: "Email" })).toHaveAttribute(
      "href",
      "mailto:missing107@gmail.com",
    );
  });

  it("[외부 링크]가 렌더될 때 새 창 보안 속성을 사용한다", () => {
    renderWithRouter();

    const externalLinks = screen
      .getAllByRole("link")
      .filter((link) => /^https:/.test(link.getAttribute("href") ?? ""));
    expect(externalLinks.length).toBeGreaterThan(0);
    for (const link of externalLinks) {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
    expect(screen.getByRole("link", { name: "Email" })).not.toHaveAttribute("target");
    expect(screen.getByRole("link", { name: "Email" })).not.toHaveAttribute("rel");
  });

  it("[푸터 저작권]이 렌더될 때 프로젝트 기여자 표기를 사용한다", () => {
    renderWithRouter();

    expect(screen.getByRole("contentinfo")).toHaveTextContent(
      "© scalable-monorepo-starter contributors",
    );
  });
});
