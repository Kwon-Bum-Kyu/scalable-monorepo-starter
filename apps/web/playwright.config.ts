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
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],

  /*
   * Run dependent dev servers before starting the tests.
   * The /examples flow hits apps/api (4000), so we boot both apps via
   * the root turbo `dev` task. `reuseExistingServer` keeps developers'
   * locally running `npm run dev` intact.
   *
   * Note: the second entry only re-checks readiness for the API on
   * http://localhost:4000/api/v1/health and reuses the same root server
   * spawned by the first entry (no second process is started because
   * `reuseExistingServer: true` short-circuits when the URL is reachable).
   */
  webServer: [
    {
      command: "npm run dev -- --filter=web --filter=api",
      cwd: "../..",
      url: "http://localhost:3000",
      reuseExistingServer: !process.env.CI,
      timeout: 180_000,
    },
    {
      command: "echo 'api readiness probe'",
      url: "http://localhost:4000/health/live",
      reuseExistingServer: true,
      timeout: 180_000,
    },
  ],
});
