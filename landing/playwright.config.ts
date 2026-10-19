import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "e2e",
  timeout: 30_000,
  use: { baseURL: process.env.BASE_URL ?? "http://127.0.0.1:4173" },
  webServer: process.env.BASE_URL
    ? undefined
    : { command: "npm run build && npx vite preview --port 4173 --host 127.0.0.1", url: "http://127.0.0.1:4173", reuseExistingServer: true },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
});
