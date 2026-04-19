import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { describe, expect, it } from "vitest";

import ErrorPage from "@/view/error";

describe("ErrorPage 컴포넌트", () => {
  it("isError가 false일 때는 아무 것도 렌더링하지 않는다", () => {
    const router = createMemoryRouter(
      [
        {
          path: "/",
          element: <ErrorPage isError={false} />,
        },
      ],
      { initialEntries: ["/"] },
    );

    const { container } = render(<RouterProvider router={router} />);
    expect(container.querySelector("#error-page")).toBeNull();
  });

  it("isError가 true일 때 '찾으시는 페이지가 없습니다.' 안내가 보인다", () => {
    const router = createMemoryRouter(
      [
        {
          path: "/",
          element: <ErrorPage isError />,
        },
      ],
      { initialEntries: ["/"] },
    );

    render(<RouterProvider router={router} />);
    expect(
      screen.getByText("찾으시는 페이지가 없습니다."),
    ).toBeInTheDocument();
  });

  it("isError가 true일 때 본문 설명 문구도 함께 표시된다", () => {
    const router = createMemoryRouter(
      [
        {
          path: "/",
          element: <ErrorPage isError />,
        },
      ],
      { initialEntries: ["/"] },
    );

    render(<RouterProvider router={router} />);
    expect(
      screen.getByText(/페이지가 삭제되었거나 주소가 변경되어/),
    ).toBeInTheDocument();
  });

  it("className prop이 main 요소에 합성되어 적용된다", () => {
    const router = createMemoryRouter(
      [
        {
          path: "/",
          element: <ErrorPage isError className="custom-error" />,
        },
      ],
      { initialEntries: ["/"] },
    );

    const { container } = render(<RouterProvider router={router} />);
    const main = container.querySelector("#error-page");
    expect(main).not.toBeNull();
    expect(main?.className).toContain("custom-error");
  });
});
