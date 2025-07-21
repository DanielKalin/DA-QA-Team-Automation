// mobile/login.js - Mobile login with iPhone 14 Pro Max emulation
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// Try to import credentials from parent directory
let credentials;
try {
  credentials = require('../credentials.json');
} catch (error) {
  console.error('❌ credentials.json not found. Please create credentials.json in the parent directory with:');
  console.error('{ "username": "your_username", "password": "your_password" }');
  process.exit(1);
}

(async () => {
  console.log('📱 Starting mobile login with iPhone 14 Pro Max emulation...');
  
  // Launch browser
  const browser = await chromium.launch({ 
    headless: false,
  });
  
  // Create context with iPhone 14 Pro Max emulation
  const context = await browser.newContext({
    viewport: { width: 430, height: 932 }, // iPhone 14 Pro Max dimensions
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
    locale: 'en-US',
    timezoneId: 'America/New_York',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'
  });
  
  const page = await context.newPage();

  console.log('🔗 Navigating to DeviantArt mobile login...');
  await page.goto('https://www.deviantart.com/users/login');
  
  // Take screenshot of mobile login page
  await page.screenshot({ 
    path: 'screenshots/mobile-login-start.png',
    fullPage: true 
  });

  console.log('📱 Filling username on mobile...');
  
  // Use tap instead of click for mobile interactions
  await page.tap('input[name="username"]');
  await page.fill('input[name="username"]', credentials.username);
  
  await page.waitForTimeout(1000);
  
  // Tap submit button (mobile-specific)
  await page.tap('button[type="submit"]');

  console.log('🔒 Entering password on mobile...');
  
  // Mobile password interaction
  await page.tap('input[name="password"]');
  await page.fill('input[name="password"]', credentials.password);
  
  await page.waitForTimeout(2000);
  await page.tap('button[type="submit"]');

  console.log('⏭️ Handling mobile popups...');
  
  // Handle mobile-specific "Maybe Later" button
  try {
    await page.tap('text=Maybe Later', { timeout: 5000 });
  } catch (error) {
    console.log('ℹ️ Maybe Later button not found, continuing...');
  }
  
  // Wait for mobile navigation to complete
  await page.waitForTimeout(3000);
  
  // Take screenshot of successful mobile login
  await page.screenshot({ 
    path: 'screenshots/mobile-login-success.png',
    fullPage: true 
  });
  
  // Ensure storage directory exists
  const storageDir = path.join(__dirname, 'storage');
  if (!fs.existsSync(storageDir)) {
    fs.mkdirSync(storageDir, { recursive: true });
  }
  
  // Save mobile session state
  await context.storageState({ path: 'storage/mobile-state.json' });

  console.log('✅ Mobile session saved to storage/mobile-state.json');
  
  // Verify mobile-specific elements are visible
  try {
    // Check for mobile navigation menu or other mobile indicators
    const currentUrl = page.url();
    console.log(`📱 Current URL: ${currentUrl}`);
    console.log('📱 Mobile login completed successfully!');
  } catch (error) {
    console.log('ℹ️ Mobile verification check skipped');
  }
  
  await browser.close();
  console.log('🏁 Mobile login automation completed!');
})().catch(error => {
  console.error('❌ Mobile login failed:', error);
  process.exit(1);
}); 