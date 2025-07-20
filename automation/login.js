// utils/save-auth.js
const { chromium } = require('playwright');
const fs = require('fs');
const credentials = require('./credentials.json'); // Import credentials

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto('https://www.deviantart.com/users/login');

  // Fill in credentials manually
  await page.waitForTimeout(2000);
  await page.fill('input[name="username"]', credentials.username); // Use from credentials
  await page.waitForTimeout(2000);
  await page.click('button[type="submit"]');

  // Password
  await page.waitForTimeout(2000);
  await page.fill('input[name="password"]', credentials.password); // Use from credentials
  await page.waitForTimeout(2000);
  await page.click('button[type="submit"]');

  // "Maybe Later" button
  await page.click('text=Maybe Later')
  // Click submit (final step?)
  await page.waitForTimeout(3000);
  // Save session state
  await page.context().storageState({ path: 'storage/state.json' });

  console.log('✅ Session saved to storage/state.json');
  await browser.close();
})();
