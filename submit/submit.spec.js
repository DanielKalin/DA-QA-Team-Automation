const { test } = require('@playwright/test');
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const wait = (ms) => new Promise(res => setTimeout(res, ms));

const now = new Date();
const timestamp = `${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}-${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}`;

// Get a random image from folder
const folderPath = '/Users/ivanh/Downloads/screenshots';
const files = fs.readdirSync(folderPath).filter(file => file.endsWith('.jpg'));
const randomFile = files[Math.floor(Math.random() * files.length)];
const fullPath = path.join(folderPath, randomFile);

test('DeviantArt login flow using persistent context', async () => {
  const userDataDir = './user-data'; // Saves browser session locally

  const context = await chromium.launchPersistentContext(userDataDir, {
    headless: false,
    viewport: { width: 1920, height: 1080 },
  });

  const page = context.pages()[0] || await context.newPage();

  await page.goto('https://www.deviantart.com/studio?new=1');
  await wait(3000);

  await page.click('button:has-text("Upload Your Art")');
  await wait(3000);

  // Upload random image
  await page.setInputFiles('input[type="file"]', fullPath);
  await wait(3000);

  console.log(`✅ Image submitted: ${randomFile}`);
  console.log(`✅ Screenshot will be saved as: submit-test-${timestamp}.png`);

  await page.goto('https://www.deviantart.com/studio');
  await page.screenshot({
    path: `/Users/ivanh/Documents/automation/screenshots/submit-test-${timestamp}.png`,
  });  
  await wait(3000);

  // Optionally submit
  // await page.click('button[type="submit"]');
});
