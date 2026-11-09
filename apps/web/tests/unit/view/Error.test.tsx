import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  createMemoryRouter,
  Link,
  RouterProvider,
} from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

import { buildRoutes } from "@/routes/index";
import ErrorPage from "@/view/Error";

const NOT_FOUND_DESCRIPTION =
  "페이지가 삭제되었거나 주소가 바뀌었습니다. 입력하신 주소가 정확한지 확인해 주세요.";
const ROUTE_ERROR_DESCRIPTION =
  "페이지를 불러오는 중에 문제가 생겼습니다. 다시 시도해도 같은 화면이 보이면 홈으로 이동해 주세요.";

const renderVariant = (variant: "not-found" | "route-error", className?: string) => {
  const router = createMemoryRouter(
    [{ path: "/", element: <ErrorPage variant={variant} className={className} /> }],
    { initialEntries: ["/"] },
  );
  return render(<RouterProvider router={router} />);
};

describe("ErrorPage", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("[오류 페이지]가 404 변형일 때 찾을 수 없음 안내를 표시한다", () => {
    const { container } = renderVariant("not-found");

    expect(container.querySelector("#error-page")).toHaveClass(
      "py-20",
      "tablet:py-32",
    );
    expect(screen.getByText("404")).toHaveClass("font-display");
    expect(
      screen.getByRole("heading", { name: "페이지를 찾을 수 없습니다." }),
    ).toBeVisible();
    expect(screen.getByText(NOT_FOUND_DESCRIPTION)).toBeVisible();
    expect(screen.getByRole("link", { name: "홈으로" })).toHaveAttribute(
      "href",
      "/",
    );
  });

  it("[오류 페이지]가 라우트 오류 변형일 때 재시도 안내를 표시한다", () => {
    renderVariant("route-error");

    expect(screen.getByText("오류")).toHaveClass("font-sans");
    expect(screen.getByRole("alert")).toBeVisible();
    expect(
      screen.getByRole("heading", { name: "페이지를 표시하지 못했습니다." }),
    ).toBeVisible();
    expect(screen.getByText(ROUTE_ERROR_DESCRIPTION)).toBeVisible();
    expect(screen.getByRole("link", { name: "홈으로" })).toHaveAttribute(
      "href",
      "/",
    );
  });

  it("[오류 페이지]가 재시도를 클릭할 때 현재 문서를 다시 불러온다", async () => {
    const user = userEvent.setup();
    const reload = vi.fn();
    vi.stubGlobal("location", { ...window.location, reload });
    renderVariant("route-error");

    await user.click(screen.getByRole("button", { name: "다시 시도" }));

    expect(reload).toHaveBeenCalledOnce();
  });

  it("[오류 페이지]가 추가 클래스를 받을 때 루트에 합성한다", () => {
    const { container } = renderVariant("not-found", "custom-error");

    expect(container.querySelector("#error-page")).toHaveClass("custom-error");
  });

  it("[오류 페이지]가 loader 404를 받을 때 찾을 수 없음으로 자동 판정한다", async () => {
    const router = createMemoryRouter(
      [
        {
          path: "/missing",
          loader: () => {
            throw new Response(null, { status: 404 });
          },
          element: <div />,
          errorElement: <ErrorPage />,
        },
      ],
      { initialEntries: ["/missing"] },
    );
    render(<RouterProvider router={router} />);

    expect(
      await screen.findByRole("heading", { name: "페이지를 찾을 수 없습니다." }),
    ).toBeVisible();
  });

  it("[오류 페이지]가 렌더 오류를 받을 때 라우트 오류로 자동 판정한다", async () => {
    function ThrowingPage(): React.JSX.Element {
      throw new Error("render failed");
    }
    const router = createMemoryRouter(
      [
        {
          path: "/broken",
          element: <ThrowingPage />,
          errorElement: <ErrorPage />,
        },
      ],
      { initialEntries: ["/broken"] },
    );
    render(<RouterProvider router={router} />);

    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: "페이지를 표시하지 못했습니다." }),
      ).toBeVisible(),
    );
  });

  it("[오류 페이지]가 레이아웃 안에 렌더될 때 중첩 main을 만들 수 없다", () => {
    const router = createMemoryRouter(
      [
        {
          path: "/",
          element: (
            <main>
              <ErrorPage variant="not-found" />
              <Link to="/">홈</Link>
            </main>
          ),
        },
      ],
      { initialEntries: ["/"] },
    );
    const { container } = render(<RouterProvider router={router} />);

    expect(container.querySelectorAll("main")).toHaveLength(1);
  });

  it("[없는 경로]가 열릴 때 헤더와 푸터 안에 404를 표시한다", async () => {
    vi.stubEnv("PROD", true);
    const router = createMemoryRouter(buildRoutes(), {
      initialEntries: ["/nope"],
    });
    render(<RouterProvider router={router} />);

    expect(
      await screen.findByRole("heading", { name: "페이지를 찾을 수 없습니다." }),
    ).toBeVisible();
    expect(screen.getByRole("banner")).toBeVisible();
    expect(screen.getByRole("contentinfo")).toBeVisible();
  });
});
