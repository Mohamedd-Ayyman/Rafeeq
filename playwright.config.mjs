import { defineConfig, devices } from "@playwright/test";

const API = process.env.E2E_API_URL || "http://localhost:5000";
const CLIENT = process.env.E2E_CLIENT_URL || "http://localhost:3000";

export default defineConfig({
  testDir: "./tests",
  timeout: 30000,
  expect: { timeout: 8000 },
  fullyParallel: false,
  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL: CLIENT,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: [
    {
      command: "cd server && npm run dev",
      url: `${API}/health`,
      reuseExistingServer: true,
      timeout: 60000,
    },
    {
      command: "cd client && npm run dev",
      url: CLIENT,
      reuseExistingServer: true,
      timeout: 120000,
    },
  ],
});
