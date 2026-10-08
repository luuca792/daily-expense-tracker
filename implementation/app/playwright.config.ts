import { defineConfig, devices } from '@playwright/test';

// End-to-end tests (plan §5) against the production build, so the service worker is the real one.
// E2E_BASE_URL=http://localhost:18081/ runs them against an already running server instead
// (e.g. the Docker image, to check its headers and CSP).
const external = process.env.E2E_BASE_URL;

export default defineConfig({
  testDir: 'e2e',
  fullyParallel: false,
  retries: 0,
  reporter: 'list',
  use: {
    ...devices['Pixel 7'], // mobile viewport, Chromium
    baseURL: external ?? 'http://localhost:4174/',
    locale: 'vi-VN',
    timezoneId: 'Asia/Ho_Chi_Minh',
  },
  webServer: external ? undefined : {
    command: 'npm run build && npx vite preview --port 4174 --strictPort',
    url: 'http://localhost:4174/',
    reuseExistingServer: false,
    timeout: 180_000,
  },
});
