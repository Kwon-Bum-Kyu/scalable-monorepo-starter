import { defineConfig, devices } from "@playwright/test";

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./tests/e2e",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: "http://localhost:3000",

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
      testIgnore: /visual-regression\.spec\.ts/,
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
      testIgnore: /visual-regression\.spec\.ts/,
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
      testIgnore: /visual-regression\.spec\.ts/,
    },
    /* Visual regression matrix — 4 viewport × 5 라우트 = 20 스냅샷 (claude-design-system-migration) */
    {
      name: "vr-mobile-640",
      testMatch: /visual-regression\.spec\.ts/,
      use: { viewport: { width: 640, height: 960 } },
    },
    {
      name: "vr-tablet-768",
      testMatch: /visual-regression\.spec\.ts/,
      use: { viewport: { width: 768, height: 1024 } },
    },
    {
      name: "vr-desktop-1280",
      testMatch: /visual-regression\.spec\.ts/,
      use: { viewport: { width: 1280, height: 800 } },
    },
    {
      name: "vr-wide-1920",
      testMatch: /visual-regression\.spec\.ts/,
      use: { viewport: { width: 1920, height: 1080 } },
    },
  ],

  /*
   * Run dependent dev servers before starting the tests.
   * The /examples flow hits apps/api (4000), so we boot web과 api 를 각각 직접 띄운다.
   * 루트 `npm run dev` 는 prisma studio 를 동반 기동하는데 CI 환경에서 studio 가 즉시 종료되면
   * concurrently --kill-others-on-fail 로 api dev:server 까지 함께 죽기 때문에, E2E 환경에서는
   * api 의 `dev:server` 만 호출한다. `reuseExistingServer` 는 로컬 `npm run dev` 를 그대로 재사용한다.
   */
  webServer: [
    {
      command: "npm run dev --workspace=web",
      cwd: "../..",
      url: "http://localhost:3000",
      reuseExistingServer: !process.env.CI,
      timeout: 180_000,
    },
    {
      command: "npm run dev:server --workspace=api",
      cwd: "../..",
      url: "http://localhost:4000/health/live",
      reuseExistingServer: !process.env.CI,
      timeout: 180_000,
    },
  ],
});
