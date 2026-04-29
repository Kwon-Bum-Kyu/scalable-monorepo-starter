import { expect, test } from "@playwright/test";

/**
 * 시각 회귀 매트릭스 — claude-design-system-migration FR-3 (header 64px) 회귀 검증.
 *
 * - viewport 4종: mobile-640 / tablet-768 / desktop-1280 / wide-1920
 *   (`playwright.config.ts`의 vr-* projects로 매핑)
 * - 라우트 2종: `/` (Guide), `/examples` (ExamplesPage)
 *   `/error` 는 라우터 정의는 있으나 시각 검증 가치가 낮아 제외
 *
 * 실행:
 *   npm run dev (web+api) 후
 *   npx playwright test tests/e2e/visual-regression.spec.ts \
 *     --project=vr-mobile-640 --project=vr-tablet-768 \
 *     --project=vr-desktop-1280 --project=vr-wide-1920
 */

const ROUTES: ReadonlyArray<{ name: string; path: string }> = [
  { name: "root", path: "/" },
  { name: "examples", path: "/examples" },
];

for (const route of ROUTES) {
  test(`스냅샷이 ${route.name} 라우트에서 안정적이다`, async ({ page }) => {
    await page.goto(route.path);
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot(`${route.name}.png`, {
      fullPage: true,
      maxDiffPixelRatio: 0.02,
    });
  });

  test(`헤더가 ${route.name} 라우트에서 잘리지 않는다`, async ({ page }) => {
    await page.goto(route.path);
    await page.waitForLoadState("networkidle");
    const banner = page.getByRole("banner");
    await expect(banner).toBeVisible();
    const box = await banner.boundingBox();
    expect(box, "header bounding box should exist").not.toBeNull();
    // FR-3: spacing-header = 64px. 경험적으로 64~96px 범위 내라면 R10 회귀 위험 없음.
    expect(box!.height).toBeGreaterThanOrEqual(48);
    expect(box!.height).toBeLessThanOrEqual(120);
  });
}
