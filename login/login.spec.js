const { test, expect, chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
//important to keep the same session
test('DeviantArt login flow using persistent context', async () => {
  const userDataDir = './user-data'; // Saves browser session locally

  const context = await chromium.launchPersistentContext(userDataDir, {
    headless: false,
    viewport: { width: 1920, height: 1080 },
  });

  const page = context.pages()[0] || await context.newPage();

  // Go to login page
  await page.goto('https://www.deviantart.com/users/login');
  await page.screenshot({ path: 'screenshots/step1-login-page.png' });

  // Login
  await page.fill('input[name="username"]', '');
  await page.waitForTimeout(5000);
  await page.click('button[type="submit"]');

  // Password
  await page.fill('input[name="password"]', '');
  await page.waitForTimeout(5000);
  await page.click('button[type="submit"]');

  await page.screenshot({ path: 'screenshots/step2-filled-credentials.png' });

  // "Maybe Later" button
  await page.click('text=Maybe Later');

  // Click submit (final step?)
  await page.click('button[type="submit"]');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);

  await context.close();
});
