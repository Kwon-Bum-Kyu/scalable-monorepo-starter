import {
  createBrowserRouter,
  type RouteObject,
} from "react-router-dom";

import App from "@/App.tsx";
import Rootlayout from "@/components/layouts/rootLayout.tsx";
import ErrorPage from "@/view/error.tsx";
import ExamplesPage from "@/view/examples/ExamplesPage";
import Guide from "@/view/guide.tsx";

export const ROUTES = {
  root: "/",
  error: "/error",
  examples: "/examples",
};

export const buildRoutes = (isProd: boolean): RouteObject[] => {
  const layoutChildren: RouteObject[] = [{ index: true, element: <Guide /> }];

  if (!isProd) {
    layoutChildren.push({
      path: ROUTES.examples,
      element: <ExamplesPage />,
    });
  }

  return [
    {
      Component: App,
      path: ROUTES.root,
      errorElement: <ErrorPage />,
      children: [
        {
          element: <Rootlayout />,
          children: layoutChildren,
        },
        { path: ROUTES.error, element: <ErrorPage /> },
      ],
    },
  ];
};

export const routes = buildRoutes(import.meta.env.PROD);

export const router = createBrowserRouter(routes);
