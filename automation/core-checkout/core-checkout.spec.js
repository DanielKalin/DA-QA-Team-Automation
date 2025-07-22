// submit/deviantart-core-membership.spec.js
const { test, expect } = require('@playwright/test');
const wait = (ms) => new Promise(res => setTimeout(res, ms));

test('DeviantArt Core Membership page shows price section', async ({ page }) => {
  // Session state is automatically loaded from storage/state.json via playwright.config.js
  await page.goto('https://www.deviantart.com/core-membership/buy');
  
  // Single query to get all upgrade buttons and their count
  const upgradeButtons = page.locator('button:has-text("Upgrade"), button:has-text("Upgrade Now")');
  const count = await upgradeButtons.count();
  console.log(`✅ Found ${count} upgrade buttons`);
  
  // Extract prices in batch with minimal DOM queries
  const priceInfo = await page.evaluate(() => {
    const buttons = document.querySelectorAll('button');
    const upgradeButtons = Array.from(buttons).filter(btn => 
      btn.textContent.includes('Upgrade')
    ).slice(0, 4);
    
    return upgradeButtons.map(button => {
      const container = button.closest('div');
      if (!container) return null;
      
      const priceElements = container.querySelectorAll('*');
      const prices = [];
      const discounts = [];
      
      priceElements.forEach(el => {
        const text = el.textContent || '';
        const priceMatch = text.match(/\$[0-9]+\.[0-9]+/);
        const discountMatch = text.match(/[0-9]+%\s*OFF/i);
        
        if (priceMatch && prices.length < 2) prices.push(priceMatch[0]);
        if (discountMatch && discounts.length === 0) discounts.push(discountMatch[0]);
      });
      
      if (prices.length === 0) return null;
      
      if (discounts.length > 0 && prices.length > 1) {
        return `${discounts[0]} ${prices[0]} (was ${prices[1]})`;
      } else if (prices.length > 1) {
        const price1 = parseFloat(prices[0].replace('$', ''));
        const price2 = parseFloat(prices[1].replace('$', ''));
        return price1 > price2 ? prices[0] : prices[1];
      } else {
        return prices[0];
      }
    }).filter(price => price !== null);
  });
  
  console.log(`✅ Available prices:`, priceInfo);

  // Click random upgrade button with single operation
  await wait(1000);
  const randomIndex = Math.floor(Math.random() * count);
  await upgradeButtons.nth(randomIndex).click();
  console.log(`✅ Clicked Upgrade button #${randomIndex + 1}`);

  // Handle modal with minimal queries
  await wait(2000);
  const modalResult = await page.evaluate(() => {
    const modal = document.querySelector('label:has(input[checked]), .ds-card-selected') ||
                  document.querySelector('[role="dialog"] label') ||
                  document.querySelector('label');
    
    if (!modal) return { success: false };
    
    const allText = modal.textContent || '';
    const prices = allText.match(/\$[0-9]+\.[0-9]+/g) || [];
    const hasDiscount = /[0-9]+%\s*OFF/i.test(allText);
    
    if (prices.length === 0) return { success: false };
    
    let priceDisplay = prices[0];
    if (hasDiscount && prices.length >= 2) {
      const price1 = parseFloat(prices[0].replace('$', ''));
      const price2 = parseFloat(prices[1].replace('$', ''));
      const currentPrice = price1 < price2 ? prices[0] : prices[1];
      const originalPrice = price1 < price2 ? prices[1] : prices[0];
      priceDisplay = `${currentPrice} (was ${originalPrice})`;
    }
    
    return { success: true, price: priceDisplay };
  });
  
  if (modalResult.success) {
    console.log(`✅ Selected pricing plan: ${modalResult.price}`);
    
    // Single click operation for checkout
    await page.locator('button:has-text("Go to Checkout"), button:has-text("checkout")').first().click();
    console.log('✅ Clicked "Go to Checkout" button');
  } else {
    console.log('❌ Could not find pricing modal');
  }
  
  await wait(1000);
});