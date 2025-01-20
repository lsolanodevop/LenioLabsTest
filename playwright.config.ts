import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    workers: 1,
    timeout: 50000,
    reporter: "html",
    use: {
      headless: false,
      screenshot: "only-on-failure",
      //video: "on"
    }
  });