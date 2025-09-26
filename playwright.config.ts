import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  webServer: {
    command: 'npm start -- --port=9089',
    url: 'http://localhost:9089/',
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
    // stdout: 'pipe',
    // stderr: 'pipe',
  },
  use: {
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    baseURL: 'http://localhost:9089/',
  },
  timeout: 5 * 1000,
};
export default config;
