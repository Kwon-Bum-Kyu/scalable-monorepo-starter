import type { RouteObject } from "react-router-dom";

import App from "@/App";
import RootLayout from "@/components/layouts/RootLayout";
import { ROUTES } from "@/routes/paths";
import ErrorPage from "@/view/Error";
// >>> EXAMPLES_START
import ExamplesPage from "@/view/examples/ExamplesPage";
// <<< EXAMPLES_END
import Guide from "@/view/Guide";
import Home from "@/view/Home";

export const buildRoutes = (): RouteObject[] => {
  const pageRoutes: RouteObject[] = [
    { index: true, element: <Home /> },
    { path: ROUTES.guide, element: <Guide /> },
    {
      path: ROUTES.error,
      element: <ErrorPage variant="route-error" />,
    },
  ];

  // >>> EXAMPLES_START
  if (!import.meta.env.PROD) {
    pageRoutes.push({
      path: ROUTES.examples,
      element: <ExamplesPage />,
    });
  }
  // <<< EXAMPLES_END

  pageRoutes.push({ path: "*", element: <ErrorPage variant="not-found" /> });

  return [
    {
      path: ROUTES.root,
      Component: App,
      errorElement: (
        <main>
          <ErrorPage />
        </main>
      ),
      children: [
        {
          element: <RootLayout />,
          children: [
            {
              errorElement: <ErrorPage />,
              children: pageRoutes,
            },
          ],
        },
      ],
    },
  ];
};

export const routes: RouteObject[] = buildRoutes();
