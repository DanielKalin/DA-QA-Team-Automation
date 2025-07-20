// submit/deviantart-core-membership.spec.js
const { test, expect } = require('@playwright/test');

test('DeviantArt Core Membership page shows price section', async ({ page }) => {

    await page.goto('https://www.deviantart.com/core-membership/buy');

  const priceLocator = page.locator(':has-text("$6.67/mo")');
  await expect(priceLocator.first()).toBeVisible();
  console.log('✓ Pricing section is visible');
});