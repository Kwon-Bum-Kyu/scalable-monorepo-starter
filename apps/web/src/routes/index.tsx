import { createBrowserRouter } from "react-router-dom";

import App from "@/App.tsx";
import Rootlayout from "@/components/layouts/rootLayout.tsx";
import ErrorPage from "@/view/error.tsx";
import Guide from "@/view/guide.tsx";

export const ROUTES = {
  root: "/",
  error: "/error",
};

export const router = createBrowserRouter([
  {
    Component: App,
    path: ROUTES.root,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <Rootlayout />,
        children: [
          { index: true, element: <Guide /> },
        ],
      },
      { path: ROUTES.error, element: <ErrorPage /> },
    ],
  },
]);
