const { test, expect } = require('@playwright/test');

test.describe('DeviantArt Pricing Page During Sale', () => {
  
  test('should display all expected components on pricing page during sale', async ({ page }) => {
    // Navigate to DeviantArt Core Membership page
    await page.goto('https://www.deviantart.com/core-membership');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Take a screenshot for reference
    await page.screenshot({ path: 'tests/page-verification/pricing-page-during-sale.png' });
    
    // Test 1: Core Membership Specific Content
    console.log('Testing pricing page content during sale...');
    
    // Check for pricing information
    const pricingSection = page.locator(':has-text("50% off"), :has-text("Core"), :has-text("Membership"), .price, .pricing').first();
    await expect(pricingSection).toBeVisible();
    console.log('✓ Pricing section is visible');

    // Check for "Upgrade Now" button specifically
    const upgradeNowButton = page.locator(':has-text("Upgrade Now"), button:has-text("Upgrade Now")').first();
    await expect(upgradeNowButton).toBeVisible();
    console.log('✓ Upgrade Now button is present');
    
    // Verify the button background image and styling
    const buttonStyling = await upgradeNowButton.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return {
        backgroundImage: styles.backgroundImage,
        backgroundSize: styles.backgroundSize,
        backgroundRepeat: styles.backgroundRepeat,
        backgroundPosition: styles.backgroundPosition,
        color: styles.color,
        fontSize: styles.fontSize,
        fontWeight: styles.fontWeight
      };
    });
    
    console.log('✓ Upgrade Now button styling:');
    console.log(`  Background Image: ${buttonStyling.backgroundImage}`);
    console.log(`  Background Size: ${buttonStyling.backgroundSize}`);
    console.log(`  Background Repeat: ${buttonStyling.backgroundRepeat}`);
    console.log(`  Background Position: ${buttonStyling.backgroundPosition}`);
    console.log(`  Text Color: ${buttonStyling.color}`);
    console.log(`  Font Size: ${buttonStyling.fontSize}`);
    console.log(`  Font Weight: ${buttonStyling.fontWeight}`);
    
    // Validate button has proper styling
    if (buttonStyling.backgroundImage !== 'none') {
      console.log('✓ Button has background image');
    } else {
      console.log('ℹ Button has no background image');
    }
    
    // Validate readable text color
    expect(buttonStyling.color).not.toBe('rgba(0, 0, 0, 0)');
    console.log('✓ Button has readable text color');

    // Check for Sale Countdown Timer
    console.log('\n🕐 Checking Sale Countdown Timer...');
    const countdownTimer = page.locator(':has-text("Sale ends in"), :has-text("days"), :has-text("hours"), :has-text("minutes"), .countdown, .timer').first();
    const timerVisible = await countdownTimer.isVisible();
    if (timerVisible) {
      console.log('✓ Sale countdown timer is present');
      const timerText = await countdownTimer.textContent();
      
      // Filter out dynamic date/time information
      const sanitizedTimer = timerText
        .replace(/\d+\s*Days?/gi, '[X]Days')
        .replace(/\d+\s*Hours?/gi, '[X]Hours')
        .replace(/\d+\s*Minutes?/gi, '[X]Minutes')
        .replace(/\d+\s*Seconds?/gi, '[X]Seconds')
        .replace(/\d+:\d+:\d+/g, '[TIME]')
        .replace(/\d+:\d+/g, '[TIME]')
        .replace(/\s+/g, ' ')
        .trim();
      
      console.log(`  Timer text: ${sanitizedTimer}`);
    } else {
      console.log('ℹ Sale countdown timer not found (may not be active)');
    }

    // Check for Sale Disclaimer
    console.log('\n📋 Checking Sale Disclaimer...');
    const saleDisclaimer = page.locator(':has-text("Terms"), :has-text("conditions"), :has-text("offer"), :has-text("valid"), .disclaimer, .terms').first();
    const disclaimerVisible = await saleDisclaimer.isVisible();
    if (disclaimerVisible) {
      console.log('✓ Sale disclaimer is present');
      const disclaimerText = await saleDisclaimer.textContent();
      
      // Filter out dynamic date information (dates, months, years)
      const sanitizedText = disclaimerText
        .replace(/\d{1,2}\/\d{1,2}\/\d{2,4}/g, '[DATE]')  // MM/DD/YYYY format
        .replace(/\d{1,2}-\d{1,2}-\d{2,4}/g, '[DATE]')    // MM-DD-YYYY format
        .replace(/\d{2,4}-\d{1,2}-\d{1,2}/g, '[DATE]')    // YYYY-MM-DD format
        .replace(/\b\d{1,2}\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{2,4}\b/gi, '[DATE]')  // DD Month YYYY
        .replace(/\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{2,4}\b/gi, '[DATE]')  // Month DD, YYYY
        .replace(/\b\d{1,2}:\d{2}(:\d{2})?\s*(AM|PM|am|pm)?\b/g, '[TIME]')  // Time formats
        .replace(/\s+/g, ' ')  // Clean up multiple spaces
        .trim();
      
      console.log(`  Disclaimer: ${sanitizedText.substring(0, 100)}...`);
    } else {
      console.log('ℹ Sale disclaimer not found');
    }

    // Check for Multiple Pricing Cards
    console.log('\n💳 Checking Multiple Pricing Cards...');
    const pricingCards = page.locator('.card, .pricing-card, .plan, .membership-option, [class*="price"], [class*="plan"]');
    const cardsCount = await pricingCards.count();
    console.log(`✓ Found ${cardsCount} pricing cards/options`);
    
    if (cardsCount > 0) {
      const maxCards = Math.min(cardsCount, 5);
      for (let i = 0; i < maxCards; i++) {
        const cardText = await pricingCards.nth(i).textContent();
        const cardPreview = cardText.replace(/\s+/g, ' ').substring(0, 50);
        console.log(`  Card ${i + 1}: ${cardPreview}...`);
      }
    }

    // Check for Background Images
    console.log('\n🖼️ Checking Background Images...');
    const elementsWithBgImages = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      const bgImages = [];
      
      for (let i = 0; i < Math.min(elements.length, 100); i++) {
        const el = elements[i];
        const bgImage = window.getComputedStyle(el).backgroundImage;
        if (bgImage && bgImage !== 'none') {
          bgImages.push({
            tagName: el.tagName,
            className: el.className,
            bgImage: bgImage
          });
        }
      }
      return bgImages.slice(0, 5); // Limit to first 5 for performance
    });
    
    console.log(`✓ Found ${elementsWithBgImages.length} elements with background images`);
    elementsWithBgImages.forEach((el, index) => {
      console.log(`  Element ${index + 1}: ${el.tagName}${el.className ? '.' + el.className : ''}`);
    });

    // Check for Package Icons: Max, Pro+, Pro & Core+
    console.log('\n📦 Checking Package Icons...');
    
    // Check for Max package icon
    const maxIcon = page.locator(':has-text("Max"), :has-text("Core Max"), :has-text("Level up your business"), .max, [class*="max"], [class*="core-max"], [class*="core_max"]').first();
    const maxVisible = await maxIcon.isVisible();
    if (maxVisible) {
      console.log('✓ Max package icon is present');
    } else {
      console.log('ℹ Max package icon not found');
    }
    
    // Check for Pro+ package icon
    const proPlusIcon = page.locator(':has-text("Pro+"), :has-text("Grow your sales and profits"), .pro-plus, [class*="pro-plus"]').first();
    const proPlusVisible = await proPlusIcon.isVisible();
    if (proPlusVisible) {
      console.log('✓ Pro+ package icon is present');
    } else {
      console.log('ℹ Pro+ package icon not found');
    }
    
    // Check for Pro package icon
    const proIcon = page.locator(':has-text("Pro"), :has-text("Promote and sell your art"), .pro, [class*="pro"]').first();
    const proVisible = await proIcon.isVisible();
    if (proVisible) {
      console.log('✓ Pro package icon is present');
    } else {
      console.log('ℹ Pro package icon not found');
    }
    
    // Check for Core+ package icon
    const corePlusIcon = page.locator(':has-text("Core+"), :has-text("Create and connect with fans"), .core-plus, [class*="core-plus"]').first();
    const corePlusVisible = await corePlusIcon.isVisible();
    if (corePlusVisible) {
      console.log('✓ Core+ package icon is present');
    } else {
      console.log('ℹ Core+ package icon not found');
    }
    
    // Summary of package icons found
    const packageIcons = [
      { name: 'Max', visible: maxVisible },
      { name: 'Pro+', visible: proPlusVisible },
      { name: 'Pro', visible: proVisible },
      { name: 'Core+', visible: corePlusVisible }
    ];
    
    const foundPackages = packageIcons.filter(pkg => pkg.visible);
    console.log(`\n📊 Package Icons Summary: ${foundPackages.length}/4 packages found`);
    foundPackages.forEach(pkg => console.log(`  ✓ ${pkg.name}`));

    // Check Package Pricing
    console.log('\n💰 Checking Package Pricing...');
    
    // Enhanced pricing extraction and display
    const extractPackagePricing = async () => {
      console.log('\n📊 PACKAGE PRICING INFORMATION:');
      console.log('=' .repeat(50));
      
      // Look for all pricing cards with package information
      const pricingCards = await page.locator('[class*="package"], [class*="plan"], [class*="pricing"]').all();
      
      // Package names to look for with variations
      const packageNames = ['Max', 'Pro+', 'Pro', 'Core+'];
      const packagePricing = {};
      
      // Debug: Look for Max package variations on the page
      console.log('\n🔍 DEBUG: Searching for Max package variations...');
      const maxVariations = [
        'Max',
        'Core Max',
        'Level up your business',
        'core_max',
        'core-max',
        'CoreMax',
        'MAX',
        'core max',
        'CORE MAX'
      ];
      
      for (const variation of maxVariations) {
        const found = await page.locator(`*:has-text("${variation}")`).count();
        if (found > 0) {
          console.log(`  Found "${variation}": ${found} elements`);
        }
      }
      
      // Debug: Also check for other package titles
      console.log('\n🔍 DEBUG: Searching for other package titles...');
      const otherPackageTitles = [
        'Grow your sales and profits',
        'Promote and sell your art',
        'Create and connect with fans',
        'Pro+',
        'Pro',
        'Core+'
      ];
      
      for (const title of otherPackageTitles) {
        const found = await page.locator(`*:has-text("${title}")`).count();
        if (found > 0) {
          console.log(`  Found "${title}": ${found} elements`);
        }
      }
      
      // Extract pricing from the page content
      for (const packageName of packageNames) {
        try {
          // Look for package-specific pricing elements with variations
          let packageSection;
          if (packageName === 'Max') {
            packageSection = page.locator(`*:has-text("Max"):has-text("$"), *:has-text("Core Max"):has-text("$"), *:has-text("Level up your business"):has-text("$"), [class*="max"]:has-text("$"), [class*="core-max"]:has-text("$"), [class*="core_max"]:has-text("$")`).first();
          } else if (packageName === 'Pro+') {
            packageSection = page.locator(`*:has-text("Pro+"):has-text("$"), *:has-text("Grow your sales and profits"):has-text("$"), [class*="pro-plus"]:has-text("$")`).first();
          } else if (packageName === 'Pro') {
            packageSection = page.locator(`*:has-text("Pro"):has-text("$"), *:has-text("Promote and sell your art"):has-text("$"), [class*="pro"]:has-text("$")`).first();
          } else if (packageName === 'Core+') {
            packageSection = page.locator(`*:has-text("Core+"):has-text("$"), *:has-text("Create and connect with fans"):has-text("$"), [class*="core-plus"]:has-text("$")`).first();
          } else {
            packageSection = page.locator(`*:has-text("${packageName}"):has-text("$")`).first();
          }
          
          if (await packageSection.isVisible()) {
            const sectionText = await packageSection.textContent();
            
            // Debug: Show the actual text content for Max package
            if (packageName === 'Max') {
              console.log(`\n🔍 DEBUG: Max package section text: "${sectionText}"`);
            }
            
            // Extract current price (monthly)
            const monthlyMatch = sectionText.match(/\$(\d+\.?\d*)[\/\s]*mo/i);
            const currentMonthly = monthlyMatch ? monthlyMatch[1] : null;
            
            // Extract original price (crossed out or "was")
            const originalMatch = sectionText.match(/\$(\d+\.?\d*)[\/\s]*mo.*?\$(\d+\.?\d*)/i) || 
                                 sectionText.match(/was.*?\$(\d+\.?\d*)/i);
            const originalMonthly = originalMatch ? (originalMatch[2] || originalMatch[1]) : null;
            
            // Extract yearly pricing
            const yearlyMatch = sectionText.match(/\$(\d+\.?\d*)[\/\s]*year/i);
            const currentYearly = yearlyMatch ? yearlyMatch[1] : null;
            
            // Extract original yearly price
            const originalYearlyMatch = sectionText.match(/\$(\d+\.?\d*)[\/\s]*year.*?\$(\d+\.?\d*)/i);
            const originalYearly = originalYearlyMatch ? originalYearlyMatch[2] : null;
            
            // Look for sale percentage
            const saleMatch = sectionText.match(/(\d+)%\s*off/i);
            const salePercent = saleMatch ? saleMatch[1] : null;
            
            packagePricing[packageName] = {
              currentMonthly,
              originalMonthly,
              currentYearly,
              originalYearly,
              salePercent
            };
          } else {
            // Debug: Additional search for Max package if not found
            if (packageName === 'Max') {
              console.log(`\n🔍 DEBUG: Max package not found with standard search, trying broader search...`);
              
              // Try broader search for Max elements
              const maxElements = await page.locator('*:has-text("Max")').all();
              console.log(`  Found ${maxElements.length} elements containing "Max"`);
              
              for (let i = 0; i < Math.min(maxElements.length, 5); i++) {
                const elementText = await maxElements[i].textContent();
                console.log(`  Element ${i + 1}: "${elementText.substring(0, 100)}..."`);
              }
              
              // Also search for package title
              const titleElements = await page.locator('*:has-text("Level up your business")').all();
              console.log(`  Found ${titleElements.length} elements containing "Level up your business"`);
              
              for (let i = 0; i < Math.min(titleElements.length, 3); i++) {
                const elementText = await titleElements[i].textContent();
                console.log(`  Title Element ${i + 1}: "${elementText.substring(0, 100)}..."`);
              }
            }
          }
        } catch (error) {
          console.log(`  ⚠️  Error extracting pricing for ${packageName}: ${error.message}`);
        }
      }
      
      // Display structured pricing information
      for (const packageName of packageNames) {
        const pricing = packagePricing[packageName];
        
        if (pricing && (pricing.currentMonthly || pricing.currentYearly)) {
          console.log(`\n📦 ${packageName.toUpperCase()} PACKAGE:`);
          
          if (pricing.currentMonthly) {
            console.log(`  Monthly: $${pricing.currentMonthly}/mo${pricing.originalMonthly ? ` (was $${pricing.originalMonthly}/mo)` : ''}`);
          }
          
          if (pricing.currentYearly) {
            console.log(`  Yearly: $${pricing.currentYearly}/year${pricing.originalYearly ? ` (was $${pricing.originalYearly}/year)` : ''}`);
          }
          
          if (pricing.salePercent) {
            console.log(`  Sale: ${pricing.salePercent}% OFF`);
          }
          
          // Calculate savings if we have both prices
          if (pricing.currentMonthly && pricing.originalMonthly) {
            const savings = (parseFloat(pricing.originalMonthly) - parseFloat(pricing.currentMonthly)).toFixed(2);
            console.log(`  Monthly Savings: $${savings}`);
          }
          
          if (pricing.currentYearly && pricing.originalYearly) {
            const yearlySavings = (parseFloat(pricing.originalYearly) - parseFloat(pricing.currentYearly)).toFixed(2);
            console.log(`  Yearly Savings: $${yearlySavings}`);
          }
          
        } else {
          console.log(`\n📦 ${packageName.toUpperCase()} PACKAGE:`);
          console.log(`  ℹ️  Pricing information not detected`);
        }
      }
      
      console.log('\n' + '=' .repeat(50));
    };
    
    // Execute pricing extraction
    await extractPackagePricing();
    
    // Helper function to extract and validate pricing
    const checkPackagePricing = async (packageName, packageLocator) => {
      if (await packageLocator.isVisible()) {
        // Look for price elements near the package
        const priceElements = page.locator('[class*="price"], *:has-text("$")').first();
        const priceCount = await page.locator('[class*="price"], *:has-text("$")').count();
        
        if (priceCount > 0) {
          console.log(`✓ ${packageName} package has pricing information`);
          
          // Extract price text from multiple elements
          const prices = [];
          const maxPrices = Math.min(priceCount, 3);
          
          for (let i = 0; i < maxPrices; i++) {
            const priceText = await page.locator('[class*="price"], *:has-text("$")').nth(i).textContent();
            if (priceText.includes('$')) {
              const priceMatch = priceText.match(/\$[\d,.]+/g);
              if (priceMatch) {
                prices.push(...priceMatch);
              }
            }
          }
          
          if (prices.length > 0) {
            console.log(`  Found prices: ${prices.slice(0, 3).join(', ')}`);
            
            // Validate price format
            const validPrices = prices.filter(price => /^\$\d+(\.\d{2})?$/.test(price));
            if (validPrices.length > 0) {
              console.log(`  Valid price formats: ${validPrices.slice(0, 3).join(', ')}`);
            }
          }
        } else {
          console.log(`ℹ ${packageName} package pricing not found`);
        }
      }
    };
    
    // Check pricing for each package  
    await checkPackagePricing('Max', maxIcon);
    await checkPackagePricing('Pro+', proPlusIcon);
    await checkPackagePricing('Pro', proIcon);
    await checkPackagePricing('Core+', corePlusIcon);
    
    // Summary of pricing verification
    const totalPriceElements = await page.locator('[class*="price"], *:has-text("$")').count();
    console.log(`\n💰 Total pricing elements found: ${totalPriceElements}`);
    
    // Look for sale-specific pricing indicators
    const saleIndicators = await page.locator(':has-text("50% off"), :has-text("Sale"), :has-text("was"), :has-text("originally")').count();
    console.log(`🏷️ Sale price indicators found: ${saleIndicators}`);
    
    // Check for Features/Benefits section
    const featuresSection = page.locator(':has-text("Features"), :has-text("Benefits"), :has-text("Includes"), .features, .benefits').first();
    await expect(featuresSection).toBeVisible();
    console.log('✓ Features/Benefits section is visible');
    
    // Check for category navigation (optional)
    const categoryNav = page.locator('nav, .nav, .navigation');
    const navVisible = await categoryNav.isVisible();
    if (navVisible) {
      console.log('✓ Category navigation is present');
    } else {
      console.log('ℹ Category navigation not found');
    }
    
    // Check page title
    const pageTitle = await page.title();
    expect(pageTitle).toContain('DeviantArt');
    console.log(`✓ Page title contains DeviantArt: ${pageTitle}`);
  });
  
  test('should have functioning Get Core button', async ({ page }) => {
    await page.goto('https://www.deviantart.com/core-membership');
    await page.waitForLoadState('networkidle');
    
    // Test 2: Button Functionality
    console.log('Testing Upgrade Now button functionality...');
    
    const upgradeNowButton = page.locator(':has-text("Upgrade Now"), button:has-text("Upgrade Now")').first();
    await expect(upgradeNowButton).toBeVisible();
    
    // Test clicking the button
    await upgradeNowButton.click();
    await page.waitForLoadState('networkidle');
    
    // Check that we're redirected to a relevant page
    const currentUrl = page.url();
    console.log(`✓ Button redirected to: ${currentUrl}`);
    
    // Basic validation that we're on a relevant page
    expect(currentUrl).toMatch(/deviantart\.com/);
    console.log('✓ Redirect URL is valid DeviantArt page');
  });
}); 