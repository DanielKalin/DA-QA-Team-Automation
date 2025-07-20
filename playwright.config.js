const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: '.',
  expect: {
    timeout: 5000
  },
  fullyParallel: true,
  retries: 0,
  reporter: [['list'], ['html']],
  use: {
    headless: false,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    storageState: 'storage/state.json',
    screenshot: 'on',
  }
  /*projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
    {
      name: 'firefox',
      use: { browserName: 'firefox' },
    },
    {
      name: 'webkit',
      use: { browserName: 'webkit' },
    },
  ],*/

});
