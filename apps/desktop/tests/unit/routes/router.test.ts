import { afterAll, describe, expect, it } from "vitest";

import { routes } from "@/routes/index";
import { router } from "@/routes/router";

const routeShape = (
  nodes: ReadonlyArray<{ path?: string; index?: boolean; children?: unknown[] }>,
): unknown =>
  nodes.map(({ path, index, children }) => ({
    path,
    index,
    children: children
      ? routeShape(
          children as ReadonlyArray<{
            path?: string;
            index?: boolean;
            children?: unknown[];
          }>,
        )
      : undefined,
  }));

describe("애플리케이션 라우터", () => {
  afterAll(() => router.dispose());

  it("[애플리케이션 라우터]가 생성될 때 루트 트리를 그대로 사용한다", () => {
    expect(router.routes[0]?.path).toBe("/");
    expect(routeShape(router.routes[0]?.children ?? [])).toEqual(
      routeShape(routes[0]?.children ?? []),
    );
  });
});
