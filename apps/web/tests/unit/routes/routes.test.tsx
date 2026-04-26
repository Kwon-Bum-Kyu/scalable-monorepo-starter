import { describe, expect, it } from "vitest";

import { buildRoutes, ROUTES } from "@/routes/index";

const flattenRoutePaths = (
  routes: ReadonlyArray<{
    path?: string;
    children?: ReadonlyArray<unknown>;
  }>,
): string[] => {
  const paths: string[] = [];
  const visit = (
    nodes: ReadonlyArray<{
      path?: string;
      children?: ReadonlyArray<unknown>;
    }>,
  ) => {
    for (const node of nodes) {
      if (node.path) {
        paths.push(node.path);
      }
      if (node.children) {
        visit(
          node.children as ReadonlyArray<{
            path?: string;
            children?: ReadonlyArray<unknown>;
          }>,
        );
      }
    }
  };
  visit(routes);
  return paths;
};

describe("buildRoutes", () => {
  it("[환경: 개발] /examples 라우트를 등록한다", () => {
    const routes = buildRoutes(false);
    const paths = flattenRoutePaths(routes);
    expect(paths).toContain(ROUTES.examples);
  });

  it("[환경: 프로덕션] /examples 라우트를 등록하지 않는다", () => {
    const routes = buildRoutes(true);
    const paths = flattenRoutePaths(routes);
    expect(paths).not.toContain(ROUTES.examples);
  });
});
