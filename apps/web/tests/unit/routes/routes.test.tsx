import { render, screen, waitFor } from "@testing-library/react";
import { isValidElement } from "react";
import {
  createMemoryRouter,
  type RouteObject,
  RouterProvider,
} from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

import RootLayout from "@/components/layouts/RootLayout";
import { buildRoutes, ROUTES } from "@/routes/index";
// >>> EXAMPLES_START
import ExamplesPage from "@/view/examples/ExamplesPage";
// <<< EXAMPLES_END

const pageRoutes = (tree: RouteObject[]) =>
  tree[0]?.children?.[0]?.children?.[0]?.children ?? [];

const replaceLayoutElement = (
  tree: RouteObject[],
  element: React.ReactNode,
): RouteObject[] => [
  {
    ...tree[0],
    children: tree[0]?.children?.map((route, index) =>
      index === 0 ? { ...route, element } : route,
    ),
  } as RouteObject,
];

const replaceGuideElement = (
  tree: RouteObject[],
  element: React.ReactNode,
): RouteObject[] => {
  const root = tree[0];
  const layout = root?.children?.[0];
  const boundary = layout?.children?.[0];

  return [
    {
      ...root,
      children: [
        {
          ...layout,
          children: [
            {
              ...boundary,
              children: boundary?.children?.map((route) =>
                route.path === ROUTES.guide ? { ...route, element } : route,
              ),
            } as RouteObject,
          ],
        } as RouteObject,
      ],
    } as RouteObject,
  ];
};

describe("buildRoutes", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("[라우트 트리]가 생성될 때 App과 레이아웃과 화면 경계를 중첩한다", () => {
    vi.stubEnv("PROD", true);
    const tree = buildRoutes();
    const root = tree[0];
    const layout = root?.children?.[0];
    const boundary = layout?.children?.[0];

    expect(root?.path).toBe(ROUTES.root);
    expect(root?.errorElement).toBeDefined();
    expect(isValidElement(layout?.element) ? layout.element.type : undefined).toBe(
      RootLayout,
    );
    expect(layout?.errorElement).toBeUndefined();
    expect(boundary?.path).toBeUndefined();
    expect(boundary?.errorElement).toBeDefined();
    expect(pageRoutes(tree).map(({ path, index }) => ({ path, index }))).toEqual([
      { path: undefined, index: true },
      { path: ROUTES.guide, index: undefined },
      { path: ROUTES.error, index: undefined },
      { path: "*", index: undefined },
    ]);
  });

  // >>> EXAMPLES_START
  it("[라우트 트리]가 개발 환경에서 생성될 때 Examples 화면을 등록한다", () => {
    vi.stubEnv("PROD", false);
    const examplesRoute = pageRoutes(buildRoutes()).find(
      ({ path }) => path === ROUTES.examples,
    );

    expect(
      isValidElement(examplesRoute?.element)
        ? examplesRoute.element.type
        : undefined,
    ).toBe(ExamplesPage);
  });
  // <<< EXAMPLES_END

  it("[라우트 트리]가 프로덕션 환경에서 생성될 때 Examples 화면을 등록할 수 없다", () => {
    vi.stubEnv("PROD", true);

    expect(pageRoutes(buildRoutes()).some(({ path }) => path === "/examples")).toBe(
      false,
    );
  });

  it("[오류 라우트]가 열릴 때 레이아웃 안에 라우트 오류를 표시한다", async () => {
    vi.stubEnv("PROD", true);
    const router = createMemoryRouter(buildRoutes(), {
      initialEntries: [ROUTES.error],
    });
    render(<RouterProvider router={router} />);

    expect(
      await screen.findByRole("heading", { name: "페이지를 표시하지 못했습니다." }),
    ).toBeVisible();
    expect(screen.getByRole("banner")).toBeVisible();
    expect(screen.getByRole("contentinfo")).toBeVisible();
  });

  it("[자식 화면]이 렌더에 실패할 때 레이아웃 안에 오류를 표시한다", async () => {
    vi.stubEnv("PROD", true);
    function ThrowingPage(): React.JSX.Element {
      throw new Error("child failed");
    }
    const router = createMemoryRouter(
      replaceGuideElement(buildRoutes(), <ThrowingPage />),
      { initialEntries: [ROUTES.guide] },
    );
    render(<RouterProvider router={router} />);

    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: "페이지를 표시하지 못했습니다." }),
      ).toBeVisible(),
    );
    expect(screen.getByRole("banner")).toBeVisible();
    expect(screen.getByRole("contentinfo")).toBeVisible();
  });

  it("[루트 레이아웃]이 렌더에 실패할 때 최상위 단독 오류 화면을 표시한다", async () => {
    vi.stubEnv("PROD", true);
    function ThrowingLayout(): React.JSX.Element {
      throw new Error("layout failed");
    }
    const router = createMemoryRouter(
      replaceLayoutElement(buildRoutes(), <ThrowingLayout />),
      { initialEntries: [ROUTES.root] },
    );
    render(<RouterProvider router={router} />);

    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: "페이지를 표시하지 못했습니다." }),
      ).toBeVisible(),
    );
    expect(screen.queryByRole("banner")).toBeNull();
    expect(screen.queryByRole("contentinfo")).toBeNull();
    expect(screen.getAllByRole("main")).toHaveLength(1);
  });
});
