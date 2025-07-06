const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  // Persistent context = non-incognito
  const userDataDir = './user-data'; // Local folder for browser profile
  const context = await chromium.launchPersistentContext(userDataDir, {
    headless: false,
    viewport: { width: 1280, height: 800 },
  });

  const page = context.pages()[0] || await context.newPage();

  // Go to login page
  await page.goto('https://www.deviantart.com/users/login');
  //await page.screenshot({ path: 'screenshots/step1-login-page.png' });

  // Login 
  await page.fill('input[name="username"]', '');
  await page.waitForTimeout(5000);
  await page.click('button[type="submit"]');
  //Password
  await page.fill('input[name="password"]', '')
  await page.waitForTimeout(5000);
  await page.click('button[type="submit"]');
  //await page.screenshot({ path: 'screenshots/step2-filled-credentials.png' });
  //Maybe Later
  await page.click('text=Maybe Later');

  // Click submit
  await page.click('button[type="submit"]');
  await page.waitForLoadState('networkidle'); // Wait for page to settle
  await page.waitForTimeout(3000); // Optional wait for visual stability

  // Take screenshot after login
  await page.screenshot({ path: 'screenshots/step3-after-login.png' });

  // Optionally close the browser
  await context.close();
})();
