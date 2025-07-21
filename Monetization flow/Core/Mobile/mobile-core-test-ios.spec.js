// mobile/mobile-core-test.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Mobile DeviantArt Core Membership Tests - iOS', () => {

  test('Mobile Core Membership comprehensive flow per requirements', async ({ browser }) => {
    console.log('📱 Starting comprehensive mobile core membership test on iOS...');
    
    const expectedTitles = ['Core Pro+ Member', 'Core+ Member', 'Core Pro Member', 'Core Max Member'];
    
    // Create iOS context
    const context = await browser.newContext({
      viewport: { width: 430, height: 932 },
      deviceScaleFactor: 3,
      isMobile: true,
      hasTouch: true,
      locale: 'en-US',
      timezoneId: 'America/New_York',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
      storageState: 'storage/mobile-state.json'
    });
    
    const page = await context.newPage();
    
    // Generate timestamp for unique screenshots
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    
    // Helper functions
    const logStep = (step, message) => console.log(`📱 Step ${step}: ${message}`);
    const logSuccess = (message) => console.log(`✅ ${message}`);
    const logWarning = (message) => console.log(`⚠️ ${message}`);
    
    const checkTextInElements = async (locator, searchText, description) => {
      const elements = await locator.all();
      for (const element of elements) {
        const text = await element.textContent();
        if (text?.includes(searchText)) {
          logSuccess(`${description} found`);
          return true;
        }
      }
      logWarning(`${description} not found`);
      return false;
    };
    
    // 1. Visit page
    logStep(1, 'Visiting core membership page...');
    await page.goto('https://www.deviantart.com/core-membership');
    await page.waitForLoadState('networkidle');
    logSuccess('iOS page loaded');
    
    await page.screenshot({ 
      path: `screenshots/ios-core-membership-main-${timestamp}.png`,
      clip: { x: 0, y: 0, width: 430, height: 800 }
    });
    
    // 2. Check "Upgrade to" title and CORE icon
    logStep(2, 'Checking upgrade title and CORE icon...');
    const h2Elements = page.locator('h2');
    const upgradeFound = await checkTextInElements(h2Elements, 'Upgrade to', 'Upgrade title');
    expect(upgradeFound).toBeTruthy();
    
    const zh0rDExists = await page.locator('.zh0rD').count() > 0;
    zh0rDExists ? logSuccess('CORE icon found') : logWarning('CORE icon not found');
    if (zh0rDExists) await expect(page.locator('.zh0rD').first()).toBeVisible();
    
    // 3. Check promotional text
    logStep(3, 'Checking promotional text...');
    const promoFound = await checkTextInElements(h2Elements, 'Create, promote, and monetize your art!', 'Promotional text');
    expect(promoFound).toBeTruthy();
    
    // 4. Check title attributes
    logStep(4, 'Checking plan title attributes...');
    const titleResults = await Promise.all(
      expectedTitles.map(async (title) => {
        const exists = await page.locator(`[title="${title}"]`).count() > 0;
        exists ? logSuccess(`Found: title="${title}"`) : console.log(`❌ Missing: title="${title}"`);
        return exists;
      })
    );
    
    const foundCount = titleResults.filter(Boolean).length;
    console.log(`📱 Title verification: ${foundCount}/${expectedTitles.length} titles found`);
    expect(titleResults.every(Boolean)).toBeTruthy();
    
    // 5. Check pricing description
    logStep(5, 'Checking pricing description...');
    const pricingElement = page.locator('._2zpMn');
    const pricingExists = await pricingElement.count() > 0;
    
    if (pricingExists) {
      await expect(pricingElement.first()).toBeVisible();
      const descriptionText = await pricingElement.first().textContent();
      const isCorrect = descriptionText?.includes("Displayed prices are for yearly subscriptions") && 
                       descriptionText?.includes("The final price can be seen on the purchase page");
      
      console.log(`📱 Found description: "${descriptionText}"`);
      isCorrect ? logSuccess('Pricing description is correct') : logWarning('Pricing description mismatch');
      expect(isCorrect).toBeTruthy();
    } else {
      logWarning('Pricing description element not found');
      const bodyText = await page.textContent('body');
      expect(bodyText?.includes("Displayed prices are for yearly subscriptions")).toBeTruthy();
    }
    
    // 6. Click random upgrade button
    logStep(6, 'Clicking random upgrade button...');
    const upgradeButtons = page.locator('button:has-text("Upgrade")');
    const upgradeCount = await upgradeButtons.count();
    
    console.log(`📱 Found ${upgradeCount} upgrade buttons`);
    expect(upgradeCount).toBeGreaterThan(0);
    
    const randomIndex = Math.floor(Math.random() * upgradeCount);
    const selectedButton = upgradeButtons.nth(randomIndex);
    
    // Find closest plan title
    let selectedPlan = 'Unknown';
    for (const title of expectedTitles) {
      const titleElement = page.locator(`[title="${title}"]`);
      if (await titleElement.count() > 0) {
        const buttonBox = await selectedButton.boundingBox();
        const titleBox = await titleElement.first().boundingBox();
        
        if (buttonBox && titleBox && Math.abs(buttonBox.y - titleBox.y) < 500) {
          selectedPlan = title;
          break;
        }
      }
    }
    
    console.log(`📱 Selected plan: ${selectedPlan} (button ${randomIndex + 1})`);
    
    await selectedButton.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500);
    await selectedButton.tap();
    logSuccess(`Tapped upgrade button for ${selectedPlan} plan`);
    
    // 7. Verify billing modal
    logStep(7, 'Verifying billing cycle modal...');
    const billingModalExists = await page.locator('text=Choose your billing cycle').count() > 0;
    
    if (!billingModalExists) {
      await page.screenshot({ 
        path: `screenshots/ios-billing-modal-debug-${timestamp}.png`, 
        clip: { x: 0, y: 0, width: 430, height: 800 }
      });
      throw new Error('Billing cycle modal did not open');
    }
    
    logSuccess('Billing cycle modal opened');
    
    const pageText = await page.textContent('body');
    const planKeywords = selectedPlan.toLowerCase().split(' ').filter(word => word.length > 2);
    const planInSubtitle = planKeywords.some(keyword => pageText?.toLowerCase().includes(keyword));
    console.log(`📱 Selected plan "${selectedPlan}" matches subtitle: ${planInSubtitle}`);
    
    // 8. Log radio button options with whitespace detection
    logStep(8, 'Logging radio button options...');
    const radioButtons = page.locator('input[type="radio"]');
    const radioCount = await radioButtons.count();
    
    console.log(`📱 Found ${radioCount} radio button options:`);
    for (let i = 0; i < radioCount; i++) {
      const radioParent = radioButtons.nth(i).locator('xpath=..');
      const radioText = await radioParent.textContent();
      const trimmedText = radioText?.trim();
      const hasWhitespace = radioText?.length !== trimmedText?.length;
      
      if (hasWhitespace) {
        console.log(`  - Option ${i + 1}: "${radioText}" (${radioText?.length - trimmedText?.length} whitespace chars)`);
        console.log(`    Trimmed: "${trimmedText}"`);
      } else {
        console.log(`  - Option ${i + 1}: "${trimmedText}"`);
      }
    }
    
    // 9. Verify final price description
    logStep(9, 'Checking final price description...');
    const finalPriceExists = await page.locator('text=The final price can be seen on the purchase page, before payment is completed').count() > 0;
    
    if (finalPriceExists) {
      logSuccess('Final price description found in modal');
    } else {
      const hasSimilarText = pageText?.includes('final price') && pageText?.includes('purchase page');
      logWarning('Exact final price description not found');
      console.log(`📱 Similar final price text found: ${hasSimilarText}`);
    }
    
    expect(finalPriceExists || pageText?.includes('final price')).toBeTruthy();
    
    await page.screenshot({ 
      path: `screenshots/ios-billing-cycle-modal-${timestamp}.png`, 
      clip: { x: 0, y: 0, width: 430, height: 800 }
    });
    
    logSuccess('Comprehensive iOS test completed!');
    await context.close();
  });
}); 