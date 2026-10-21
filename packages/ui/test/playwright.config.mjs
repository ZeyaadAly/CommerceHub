import { defineConfig } from '@playwright/test';
import path from 'node:path';
export default defineConfig({
  testDir: './browser',
  testMatch: '*.spec.mjs',
  workers: 1,
  outputDir: '../../../.verification/ui-browser-results',
  reporter: 'list',
  use: { baseURL: 'http://127.0.0.1:4173', headless: true, trace: 'retain-on-failure' },
  webServer: {
    cwd: path.resolve(import.meta.dirname, '..'),
    command: 'node node_modules/vite/bin/vite.js --config test/vite.config.mjs',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: false,
    timeout: 30000,
  },
});
