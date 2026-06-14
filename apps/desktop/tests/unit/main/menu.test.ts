import { describe, expect, it, vi } from "vitest";

import { buildMenuTemplate } from "../../../src/main/menu";

vi.mock("electron", () => ({
  Menu: {
    buildFromTemplate: vi.fn(),
    setApplicationMenu: vi.fn(),
  },
}));

describe("buildMenuTemplate", () => {
  it("편집/보기/창 메뉴 role을 포함한다", () => {
    const roles = buildMenuTemplate().map((item) => item.role);

    expect(roles).toContain("editMenu");
    expect(roles).toContain("viewMenu");
    expect(roles).toContain("windowMenu");
  });
});
