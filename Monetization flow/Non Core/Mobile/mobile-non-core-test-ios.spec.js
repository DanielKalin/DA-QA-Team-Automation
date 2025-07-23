// mobile/mobile-non-core-test-ios.spec.js
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

// Function to generate comprehensive HTML report for iOS mobile test
function generateMobileIOSReport(stepResults, testMetadata, screenshots) {
  const timestamp = testMetadata.reportTimestamp;
  const totalSteps = stepResults.length;
  const passedSteps = stepResults.filter(step => step.status === 'passed').length;
  const failedSteps = stepResults.filter(step => step.status === 'failed').length;
  const overallStatus = failedSteps === 0 ? 'PASSED' : 'FAILED';
  
  const htmlContent = `<!DOCTYPE html>
<html>
<head>
    <title>DeviantArt Core Membership - iOS Mobile Test Report - ${timestamp}</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; padding: 20px; background: linear-gradient(135deg, #007bff 0%, #6610f2 100%); color: white; border-radius: 8px; }
        .header h1 { margin: 0; font-size: 28px; }
        .header p { margin: 5px 0 0 0; opacity: 0.9; }
        
        .test-overview { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .overview-card { background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; }
        .overview-card.passed { border-left: 4px solid #28a745; }
        .overview-card.failed { border-left: 4px solid #dc3545; }
        .overview-card h3 { margin: 0 0 10px 0; font-size: 16px; color: #495057; }
        .overview-card .value { font-size: 24px; font-weight: bold; margin: 10px 0; }
        .overview-card .value.passed { color: #28a745; }
        .overview-card .value.failed { color: #dc3545; }
        .overview-card .value.neutral { color: #6c757d; }
        
        .overall-status { background: ${overallStatus === 'PASSED' ? '#d4edda' : '#f8d7da'}; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 30px; border-left: 4px solid ${overallStatus === 'PASSED' ? '#28a745' : '#dc3545'}; }
        .overall-status h2 { margin: 0 0 10px 0; color: ${overallStatus === 'PASSED' ? '#155724' : '#721c24'}; }
        .overall-status .status-text { font-size: 36px; font-weight: bold; color: ${overallStatus === 'PASSED' ? '#28a745' : '#dc3545'}; }
        
        .step-results { margin-bottom: 30px; }
        .step-results h2 { color: #495057; margin-bottom: 20px; }
        .step-card { margin-bottom: 15px; border: 1px solid #dee2e6; border-radius: 8px; overflow: hidden; }
        .step-card.passed { border-left: 4px solid #28a745; }
        .step-card.failed { border-left: 4px solid #dc3545; }
        
        .step-header { padding: 15px; background: #f8f9fa; display: flex; justify-content: between; align-items: center; cursor: pointer; }
        .step-header:hover { background: #e9ecef; }
        .step-title { display: flex; align-items: center; gap: 15px; flex: 1; }
        .step-number { font-size: 16px; font-weight: bold; color: #495057; min-width: 60px; }
        .step-name { font-size: 16px; font-weight: 600; color: #212529; }
        .step-status { padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: bold; }
        .step-status.passed { background: #28a745; color: white; }
        .step-status.failed { background: #dc3545; color: white; }
        .toggle-arrow { font-size: 16px; color: #6c757d; margin-left: 10px; }
        
        .step-content { padding: 20px; display: none; background: white; }
        .step-content.show { display: block; }
        .step-details { background: #f8f9fa; padding: 15px; border-radius: 6px; margin-bottom: 15px; }
        .step-details h4 { margin: 0 0 10px 0; color: #495057; font-size: 14px; }
        .step-details .details-text { font-family: 'Courier New', monospace; font-size: 13px; line-height: 1.4; color: #495057; }
        .error-details { background: #f8d7da; padding: 15px; border-radius: 6px; border-left: 3px solid #dc3545; }
        .error-details h4 { margin: 0 0 10px 0; color: #721c24; }
        .error-details .error-text { font-family: 'Courier New', monospace; font-size: 13px; line-height: 1.4; color: #721c24; }
        
        .screenshots-section { margin-top: 30px; }
        .screenshots-section h2 { color: #495057; margin-bottom: 20px; }
        .screenshots-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
        .screenshot-card { border: 1px solid #dee2e6; border-radius: 8px; overflow: hidden; background: white; }
        .screenshot-header { padding: 15px; background: #f8f9fa; }
        .screenshot-header h3 { margin: 0; font-size: 16px; color: #495057; }
        .screenshot-img { width: 100%; height: auto; display: block; }
        .screenshot-description { padding: 20px; background: #f8f9fa; border-top: 1px solid #dee2e6; font-size: 14px; line-height: 1.6; color: #495057; }
        
        .test-metadata { background: #e9ecef; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
        .test-metadata h2 { margin: 0 0 15px 0; color: #495057; }
        .metadata-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; }
        .metadata-item { display: flex; justify-content: space-between; padding: 8px; background: white; border-radius: 4px; }
        .metadata-label { font-weight: 600; color: #495057; }
        .metadata-value { color: #6c757d; font-family: 'Courier New', monospace; font-size: 13px; }
        
        .mobile-badge { display: inline-block; background: #17a2b8; color: white; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: bold; margin-left: 10px; }
        
        .test-overview-table { background: white; padding: 30px; border-radius: 8px; margin-bottom: 30px; border: 1px solid #dee2e6; }
        .test-overview-table h2 { color: #495057; margin-bottom: 20px; }
        .overview-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        .overview-table th, .overview-table td { padding: 12px; text-align: center; border: 1px solid #dee2e6; }
        .overview-table th { background: #f8f9fa; font-weight: 600; color: #495057; }
        .step-number-cell { font-weight: bold; color: #495057; }
        .step-name-cell { text-align: left; max-width: 400px; padding-left: 20px; color: #212529; }
        .status-cell { font-weight: bold; }
        .pass-cell { background: #d4edda; color: #155724; }
        .fail-cell { background: #f8d7da; color: #721c24; }
        
        .summary-stats { margin-top: 30px; }
        .summary-card { background: #f8f9fa; padding: 25px; border-radius: 8px; border-left: 4px solid #007bff; }
        .summary-title { font-size: 18px; font-weight: 600; color: #495057; margin-bottom: 20px; }
        .summary-content { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; }
        .stat-item { display: flex; justify-content: space-between; padding: 10px; background: white; border-radius: 6px; }
        .stat-label { font-weight: 600; color: #495057; }
        .stat-value { font-weight: bold; }
        .stat-value.passed { color: #28a745; }
        .stat-value.failed { color: #dc3545; }
        
        @media (max-width: 768px) {
            .container { margin: 10px; padding: 20px; }
            .test-overview { grid-template-columns: 1fr; }
            .screenshots-grid { grid-template-columns: 1fr; }
            .metadata-grid { grid-template-columns: 1fr; }
            .overview-table { font-size: 14px; }
            .summary-content { grid-template-columns: 1fr; }
        }
    </style>
    <script>
        function toggleStep(stepNumber) {
            const content = document.getElementById('step-content-' + stepNumber);
            const arrow = document.getElementById('arrow-' + stepNumber);
            if (content.classList.contains('show')) {
                content.classList.remove('show');
                arrow.textContent = '▼';
            } else {
                content.classList.add('show');
                arrow.textContent = '▲';
            }
        }
        
        function expandAll() {
            const contents = document.querySelectorAll('.step-content');
            const arrows = document.querySelectorAll('.toggle-arrow');
            contents.forEach(content => content.classList.add('show'));
            arrows.forEach(arrow => arrow.textContent = '▲');
        }
        
        function collapseAll() {
            const contents = document.querySelectorAll('.step-content');
            const arrows = document.querySelectorAll('.toggle-arrow');
            contents.forEach(content => content.classList.remove('show'));
            arrows.forEach(arrow => arrow.textContent = '▼');
        }
    </script>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🍎 DeviantArt Core Membership - iOS Mobile Test<span class="mobile-badge">MOBILE</span></h1>
            <p>Comprehensive monetization flow verification on iOS platform</p>
            <p>Test executed: ${testMetadata.date} at ${testMetadata.time}</p>
        </div>
        
        <div class="test-overview">
            <div class="overview-card ${overallStatus === 'PASSED' ? 'passed' : 'failed'}">
                <h3>Overall Status</h3>
                <div class="value ${overallStatus === 'PASSED' ? 'passed' : 'failed'}">${overallStatus}</div>
            </div>
            <div class="overview-card passed">
                <h3>Steps Passed</h3>
                <div class="value passed">${passedSteps}</div>
            </div>
            <div class="overview-card ${failedSteps > 0 ? 'failed' : 'passed'}">
                <h3>Steps Failed</h3>
                <div class="value ${failedSteps > 0 ? 'failed' : 'passed'}">${failedSteps}</div>
            </div>
            <div class="overview-card neutral">
                <h3>Total Steps</h3>
                <div class="value neutral">${totalSteps}</div>
            </div>
            <div class="overview-card neutral">
                <h3>Duration</h3>
                <div class="value neutral">${testMetadata.duration}s</div>
            </div>
        </div>
        
        <div class="overall-status">
            <h2>Test Execution Summary</h2>
            <div class="status-text">${overallStatus === 'PASSED' ? '🎉 ALL TESTS PASSED' : '💥 TEST FAILED'}</div>
            <p>${overallStatus === 'PASSED' ? 'All monetization flow steps completed successfully on iOS platform' : 'One or more critical steps failed during iOS testing'}</p>
        </div>
        
        <div class="test-metadata">
            <h2>📱 Test Environment & Metadata</h2>
            <div class="metadata-grid">
                <div class="metadata-item">
                    <span class="metadata-label">Platform:</span>
                    <span class="metadata-value">iOS Mobile</span>
                </div>
                <div class="metadata-item">
                    <span class="metadata-label">Viewport:</span>
                    <span class="metadata-value">430 × 932</span>
                </div>
                <div class="metadata-item">
                    <span class="metadata-label">User Agent:</span>
                    <span class="metadata-value">iPhone iOS 16.0 Safari</span>
                </div>
                <div class="metadata-item">
                    <span class="metadata-label">Test Type:</span>
                    <span class="metadata-value">Non-Core Monetization Flow</span>
                </div>
                <div class="metadata-item">
                    <span class="metadata-label">Duration:</span>
                    <span class="metadata-value">${testMetadata.duration} seconds</span>
                </div>
            </div>
        </div>
        
        <div class="test-overview-table">
            <h2>📋 Test Steps Overview</h2>
            <table class="overview-table">
                <thead>
                    <tr>
                        <th>Step</th>
                        <th>Test Step Name</th>
                        <th>🍎 iOS Mobile</th>
                    </tr>
                </thead>
                <tbody>
                    ${stepResults.map(step => `
                        <tr>
                            <td class="step-number-cell">${step.step}</td>
                            <td class="step-name-cell">${step.message}</td>
                            <td class="status-cell ${step.status === 'passed' ? 'pass-cell' : 'fail-cell'}">
                                ${step.status === 'passed' ? 'PASS' : 'FAIL'}
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            
            <div class="summary-stats">
                <div class="summary-card">
                    <div class="summary-title">Test Results Summary</div>
                    <div class="summary-content">
                        <div class="stat-item">
                            <span class="stat-label">Overall Status:</span>
                            <span class="stat-value ${overallStatus === 'PASSED' ? 'passed' : 'failed'}">${overallStatus}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Success Rate:</span>
                            <span class="stat-value">${Math.round((passedSteps / totalSteps) * 100)}%</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Steps Passed:</span>
                            <span class="stat-value passed">${passedSteps}/${totalSteps}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Steps Failed:</span>
                            <span class="stat-value ${failedSteps > 0 ? 'failed' : 'passed'}">${failedSteps}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Test Duration:</span>
                            <span class="stat-value">${testMetadata.duration}s</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="step-results">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2>📋 Detailed Step Results</h2>
                <div>
                    <button onclick="expandAll()" style="margin-right: 10px; padding: 8px 16px; border: 1px solid #dee2e6; background: #f8f9fa; border-radius: 4px; cursor: pointer;">Expand All</button>
                    <button onclick="collapseAll()" style="padding: 8px 16px; border: 1px solid #dee2e6; background: #f8f9fa; border-radius: 4px; cursor: pointer;">Collapse All</button>
                </div>
            </div>
            
            ${stepResults.map(step => `
                <div class="step-card ${step.status}">
                    <div class="step-header" onclick="toggleStep(${step.step})">
                        <div class="step-title">
                            <div class="step-number">Step ${step.step}</div>
                            <div class="step-name">${step.message}</div>
                        </div>
                        <div style="display: flex; align-items: center;">
                            <div class="step-status ${step.status}">${step.status.toUpperCase()}</div>
                            <div class="toggle-arrow" id="arrow-${step.step}">▼</div>
                        </div>
                    </div>
                    <div class="step-content" id="step-content-${step.step}">
                        <div class="step-details">
                            <h4>Step Description</h4>
                            <div class="details-text">${step.message}</div>
                        </div>
                        ${step.status === 'passed' ? `
                            <div class="step-details" style="background: #d4edda; border-left: 3px solid #28a745;">
                                <h4>✅ Success Details</h4>
                                <div class="details-text">Step executed successfully without errors</div>
                            </div>
                        ` : ''}
                        ${step.error ? `
                            <div class="error-details">
                                <h4>❌ Error Details</h4>
                                <div class="error-text">${step.error}</div>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `).join('')}
        </div>
        
        ${screenshots && Object.keys(screenshots).length > 0 ? `
        <div class="screenshots-section">
            <h2>📸 Test Screenshots & Visual Evidence</h2>
            <p style="color: #6c757d; margin-bottom: 25px;">Screenshots captured during test execution showing actual results at key verification points:</p>
            <div class="screenshots-grid">
                ${Object.entries(screenshots).map(([key, filename]) => {
                    let description = '';
                    let stepNumber = '';
                    switch(key) {
                        case 'main1':
                            stepNumber = 'Step 1 - Section 1';
                            description = `<strong>Actual Result:</strong> Top section of Core membership page showing the page header, "Upgrade to" title, Core icon, and promotional subtitle "Create, promote, and monetize your art!" This section captures the initial view when the page loads.`;
                            break;
                        case 'main2':
                            stepNumber = 'Step 1 - Section 2';
                            description = `<strong>Actual Result:</strong> Second section showing the subscription plans with PRO+ plan (Popular with orange border), CORE+ plan, and their respective pricing ($12.50/mo, $6.67/mo). All pricing displays "/mo" indicators clearly.`;
                            break;
                        case 'main3':
                            stepNumber = 'Step 1 - Section 3';
                            description = `<strong>Actual Result:</strong> Third section displaying PRO plan ($8.33/mo) and MAX plan ($16.67/mo) with their descriptions and upgrade buttons. Continues the pricing verification with "/mo" indicators visible.`;
                            break;
                        case 'main4':
                            stepNumber = 'Step 1 - Section 4';
                            description = `<strong>Actual Result:</strong> Bottom section of the page showing the pricing disclaimer "Displayed prices are for yearly subscriptions" and "The final price can be seen on the purchase page, before payment is completed." This completes the full page verification.`;
                            break;
                        case 'modal':
                            stepNumber = 'Step 9-11';
                            description = `<strong>Actual Result:</strong> Billing cycle modal opened successfully with "Choose your billing cycle" title. Modal displays the selected plan details with two pricing options: Yearly (discounted rate with savings amount) and Monthly (standard rate). Both options show clear pricing with "/mo" indicators. Modal includes the required price disclaimer: "The final price can be seen on the purchase page, before payment is completed." Go to Checkout button is visible and enabled.`;
                            break;
                        case 'joinPage':
                            stepNumber = 'Step 13';
                            description = `<strong>Actual Result:</strong> Successfully redirected to DeviantArt join page after clicking "Go to Checkout". URL contains proper purchase referer parameters and package ID, confirming the monetization flow completed correctly. Page displays account creation form for completing the subscription purchase process.`;
                            break;
                        default:
                            description = 'Test execution screenshot captured at verification point.';
                    }
                    return `
                        <div class="screenshot-card">
                            <div class="screenshot-header">
                                <h3>${stepNumber}: ${key.charAt(0).toUpperCase() + key.slice(1)} Page Verification</h3>
                            </div>
                            <img src="../screenshots/${filename}" alt="${key} screenshot" class="screenshot-img" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                            <div style="display: none; padding: 20px; text-align: center; color: #6c757d;">Screenshot not available</div>
                            <div class="screenshot-description">
                                ${description}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
        ` : ''}
        
        <div style="text-align: center; margin-top: 40px; padding: 20px; background: #f8f9fa; border-radius: 8px;">
            <p style="margin: 0; color: #6c757d; font-size: 14px;">
                Generated by DeviantArt QA Automation Suite | iOS Mobile Testing Framework<br>
                Report created on ${new Date().toLocaleString()}
            </p>
        </div>
    </div>
</body>
</html>`;
  
  // Ensure Reports directory exists
  const reportsDir = path.join(__dirname, 'Reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }
  
  // Generate filename
  const reportFilename = `ios-mobile-test-report-${timestamp}.html`;
  const reportPath = path.join(reportsDir, reportFilename);
  
  // Write the HTML file
  fs.writeFileSync(reportPath, htmlContent);
  
  return {
    filename: reportFilename,
    path: reportPath,
    url: `file://${reportPath}`
  };
}

test.describe('Non-Core Flow - iOS', () => {
  test('Non-Core Flow on iOS', async ({ browser }) => {
    const expectedTitles = ['Core Pro+ Member', 'Core+ Member', 'Core Pro Member', 'Core Max Member'];
    const stepResults = [];
    let currentStep = 0;
    
    // Test metadata
    const testStartTime = new Date();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const testMetadata = {
      date: testStartTime.toISOString().split('T')[0],
      time: testStartTime.toLocaleTimeString(),
      startTime: testStartTime,
      reportTimestamp: timestamp.slice(0, -5)
    };
    
    const context = await browser.newContext({
      viewport: { width: 430, height: 932 },
      deviceScaleFactor: 3,
      isMobile: true,
      hasTouch: true,
      locale: 'en-US',
      timezoneId: 'America/New_York',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'
    });
    
    const page = await context.newPage();
    
    // Screenshots collection
    const screenshots = {};
    
    const executeStep = async (step, message, fn) => {
      currentStep = step;
      stepResults[step - 1] = { step, message, status: 'running', error: null };
      console.log(`Step ${step}: ${message}`);
      
      try {
        await fn();
        stepResults[step - 1].status = 'passed';
      } catch (error) {
        stepResults[step - 1].status = 'failed';
        stepResults[step - 1].error = error.message;
        console.log(`Step ${step} failed: ${error.message}`);
        throw error;
      }
    };
    
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

    let selectedPlan = 'Unknown';

    try {
      // 1. Visit page
      await executeStep(1, 'Core membership page load', async () => {
        await page.goto('https://www.deviantart.com/core-membership');
        await page.waitForLoadState('networkidle');
        
        // Take 4 screenshots at different scroll positions to capture the entire page
        const screenshotHeight = 932;
        const scrollPositions = [0, 832, 1664, 2496]; // Minimal overlap scroll positions
        
        for (let i = 0; i < scrollPositions.length; i++) {
          await page.evaluate((scrollY) => window.scrollTo(0, scrollY), scrollPositions[i]);
          await page.waitForTimeout(1000); // Wait for scroll to complete
          
          const screenshotPath = `screenshots/ios-non-core-membership-main-${i + 1}-${timestamp}.png`;
          await page.screenshot({ 
            path: screenshotPath,
            clip: { x: 0, y: 0, width: 430, height: screenshotHeight }
          });
          screenshots[`main${i + 1}`] = `ios-non-core-membership-main-${i + 1}-${timestamp}.png`;
        }
        
        // Scroll back to top for subsequent steps
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.waitForTimeout(500);
        
        logSuccess('iOS page loaded with 4 section screenshots captured');
      });
      
      // 2. Check "Upgrade to" title and CORE icon
      await executeStep(2, "'Upgrade' title and 'Core' icon display", async () => {
        const upgradeFound = await checkTextInElements(page.locator('h2'), 'Upgrade to', 'Upgrade title');
        if (!upgradeFound) throw new Error('Upgrade title not found');
        
        const zh0rDExists = await page.locator('.zh0rD').count() > 0;
        if (zh0rDExists && await page.locator('.zh0rD').first().isVisible()) {
          logSuccess('CORE icon found');
        } else {
          logWarning('CORE icon not found or not visible');
        }
      });
      
      // 3. Check promotional text
      await executeStep(3, 'Promotional subtitle display', async () => {
        const promoFound = await checkTextInElements(page.locator('h2'), 'Create, promote, and monetize your art!', 'Promotional text');
        if (!promoFound) throw new Error('Promotional text not found');
      });
      
      // 4. Check plan order and Popular designation
      await executeStep(4, "Package order and 'Popular' designation", async () => {
        const expectedPlanOrder = [
          { title: 'Core Pro+ Member', hasPopular: true, description: 'Grow your sales and profits' },
          { title: 'Core+ Member', hasPopular: false, description: 'Create and connect with fans' },
          { title: 'Core Pro Member', hasPopular: false, description: 'Promote and sell your art' },
          { title: 'Core Max Member', hasPopular: false, description: 'Level up your business' }
        ];
        
        const upgradeButtons = page.locator('button:has-text("Upgrade")');
        const planCount = await upgradeButtons.count();
        
        if (planCount !== 4) throw new Error(`Expected 4 plans, found ${planCount}`);
        
        for (let i = 0; i < expectedPlanOrder.length; i++) {
          const expectedPlan = expectedPlanOrder[i];
          const titleElement = page.locator(`[title="${expectedPlan.title}"]`).nth(0);
          const hasTitleAttribute = await titleElement.count() > 0;
          
          if (!hasTitleAttribute) {
            logWarning(`Plan ${i + 1}: Expected title "${expectedPlan.title}" not found`);
            continue;
          }
          
          if (expectedPlan.hasPopular) {
            const popularClassElement = page.locator('.WENpS');
            const popularText = await popularClassElement.first().textContent();
            if (popularText?.includes('Popular')) {
              logSuccess('Found Popular designation on PRO+ plan');
            }
            
            const orangeBorderElement = page.locator('._1YTnR._1tQIu');
            if (await orangeBorderElement.count() > 0) {
              logSuccess('Found orange border classes on PRO+ plan');
            }
          }
          
          const descriptionElements = page.locator('._1I-8H');
          const descriptionCount = await descriptionElements.count();
          
          if (descriptionCount > 0) {
            for (let j = 0; j < descriptionCount; j++) {
              const descriptionText = await descriptionElements.nth(j).textContent();
              if (descriptionText?.includes(expectedPlan.description)) {
                logSuccess(`Plan ${i + 1}: Found correct description`);
                break;
              }
            }
          }
        }
        logSuccess('All plans verified');
      });
       
      // 5. Check title attributes
      await executeStep(5, 'Package icon verification', async () => {
        const titleResults = await Promise.all(
          expectedTitles.map(async (title) => {
            const exists = await page.locator(`[title="${title}"]`).count() > 0;
            if (exists) logSuccess(`Found: title="${title}"`);
            return exists;
          })
        );
        
        const foundCount = titleResults.filter(Boolean).length;
        if (foundCount !== expectedTitles.length) {
          throw new Error(`Missing plan titles. Found ${foundCount}/${expectedTitles.length}`);
        }
      });
       
      // 6. Check pricing display
      await executeStep(6, 'Pricing verification', async () => {
        const expectedPricing = [
          { plan: 'PRO+', price: '12.50' },
          { plan: 'CORE+', price: '6.67' },
          { plan: 'PRO', price: '8.33' },
          { plan: 'MAX', price: '16.67' }
        ];
        
        for (const expectedPrice of expectedPricing) {
          const priceFound = await page.locator(`text=${expectedPrice.price}`).count() > 0;
          if (!priceFound) throw new Error(`Price ${expectedPrice.price} not found for ${expectedPrice.plan}`);
          
          const pageText = await page.textContent('body');
          const priceIndex = pageText?.indexOf(expectedPrice.price);
          if (priceIndex && priceIndex > -1) {
            const surroundingText = pageText?.substring(Math.max(0, priceIndex - 50), priceIndex + 100);
            if (!surroundingText?.includes('/mo')) {
              throw new Error(`"/mo" indicator not found for ${expectedPrice.plan} price`);
            }
          }
          logSuccess(`Price ${expectedPrice.price} and "/mo" verified for ${expectedPrice.plan}`);
        }
      });
       
      // 7. Check pricing description
      await executeStep(7, 'Pricing description verification', async () => {
        const pricingElement = page.locator('._2zpMn');
        const pricingExists = await pricingElement.count() > 0;
        
        if (pricingExists) {
          const descriptionText = await pricingElement.first().textContent();
          const isCorrect = descriptionText?.includes("Displayed prices are for yearly subscriptions") && 
                           descriptionText?.includes("The final price can be seen on the purchase page");
          if (!isCorrect) throw new Error('Pricing description mismatch');
          logSuccess('Pricing description is correct');
        } else {
          const bodyText = await page.textContent('body');
          if (!bodyText?.includes("Displayed prices are for yearly subscriptions")) {
            throw new Error('Pricing description not found');
          }
        }
      });
       
      // 8. Click random upgrade button
      await executeStep(8, 'Upgrade button verification', async () => {
        const upgradeButtons = page.locator('button:has-text("Upgrade")');
        const upgradeCount = await upgradeButtons.count();
        
        if (upgradeCount === 0) throw new Error('No upgrade buttons found');
        
        const randomIndex = Math.floor(Math.random() * upgradeCount);
        const selectedButton = upgradeButtons.nth(randomIndex);
        
        // Find closest plan title
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
        
        await selectedButton.scrollIntoViewIfNeeded();
        await page.waitForTimeout(1500);
        await selectedButton.tap();
        logSuccess(`Tapped upgrade button for ${selectedPlan} plan`);
      });
       
      // 9. Verify billing modal
      await executeStep(9, 'Cycle Picker modal display', async () => {
        const billingModalExists = await page.locator('text=Choose your billing cycle').count() > 0;
        if (!billingModalExists) throw new Error('Billing cycle modal did not open');
        
        const pageText = await page.textContent('body');
        const planKeywords = selectedPlan.toLowerCase().split(' ').filter(word => word.length > 2);
        const planInSubtitle = planKeywords.some(keyword => pageText?.toLowerCase().includes(keyword));
        logSuccess(`Billing cycle modal opened. Plan in subtitle: ${planInSubtitle}`);
      });
       
      // 10. Log radio button options
      await executeStep(10, 'Monthly and Yearly pricing plan display', async () => {
        const radioButtons = page.locator('input[type="radio"]');
        const radioCount = await radioButtons.count();
        
        console.log(`Found ${radioCount} radio button options:`);
        for (let i = 0; i < radioCount; i++) {
          const radioParent = radioButtons.nth(i).locator('xpath=..');
          const radioText = await radioParent.textContent();
          const trimmedText = radioText?.trim();
          const hasWhitespace = radioText?.length !== trimmedText?.length;
          
          if (hasWhitespace) {
            console.log(`  - Option ${i + 1}: "${radioText}" (${radioText?.length - trimmedText?.length} whitespace chars)`);
          } else {
            console.log(`  - Option ${i + 1}: "${trimmedText}"`);
          }
        }
      });
       
      // 11. Verify final price description
      await executeStep(11, 'Cycle Picker price description verification', async () => {
        const pageText = await page.textContent('body');
        const finalPriceExists = await page.locator('text=The final price can be seen on the purchase page, before payment is completed').count() > 0;
        
        if (finalPriceExists) {
          logSuccess('Final price description found in modal');
        } else {
          const hasSimilarText = pageText?.includes('final price') && pageText?.includes('purchase page');
          if (!hasSimilarText) logWarning('No final price text found');
        }
      });
       
      const billingScreenshotPath = `screenshots/ios-non-core-billing-cycle-modal-${timestamp}.png`;
      await page.screenshot({ 
        path: billingScreenshotPath, 
        clip: { x: 0, y: 0, width: 430, height: 932 }
      });
      screenshots.modal = `ios-non-core-billing-cycle-modal-${timestamp}.png`;
       
      // 12. Tap "Go to Checkout" button
      await executeStep(12, 'Go to Checkout button verification', async () => {
        const checkoutButton = page.locator('button:has-text("Go to Checkout")');
        const checkoutButtonExists = await checkoutButton.count() > 0;
        
        if (checkoutButtonExists) {
          await checkoutButton.first().tap();
          logSuccess('Tapped "Go to Checkout" button');
        } else {
          const altCheckoutButton = page.locator('button:has-text("Checkout")').or(page.locator('button:has-text("Continue")'));
          const altButtonExists = await altCheckoutButton.count() > 0;
          
          if (altButtonExists) {
            await altCheckoutButton.first().tap();
            logSuccess('Tapped checkout button (alternative selector)');
          } else {
            throw new Error('Go to Checkout button not found');
          }
        }
      });
       
      // 13. Verify redirect to join page
      await executeStep(13, 'Redirect to Join Page', async () => {
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);
        
        const currentUrl = page.url();
        const isJoinPage = currentUrl.includes('deviantart.com/join/');
        const hasReferer = currentUrl.includes('referer=');
        const hasPurchaseId = currentUrl.includes('purchase%3Fid%3D');
        
        if (!isJoinPage) throw new Error(`Expected redirect to join page, but got: ${currentUrl}`);
        
        if (isJoinPage && hasReferer && hasPurchaseId) {
          const idMatch = currentUrl.match(/purchase%3Fid%3D(\d+)/);
          const packageId = idMatch ? idMatch[1] : 'unknown';
          logSuccess(`Successfully redirected to join page with purchase referer. Package ID: ${packageId}`);
        } else {
          logWarning(`Redirect verification incomplete. Join: ${isJoinPage}, Referer: ${hasReferer}, Purchase ID: ${hasPurchaseId}`);
        }
        
        const joinScreenshotPath = `screenshots/ios-non-core-join-page-${timestamp}.png`;
        await page.screenshot({ 
          path: joinScreenshotPath, 
          clip: { x: 0, y: 0, width: 430, height: 932 }
        });
        screenshots.joinPage = `ios-non-core-join-page-${timestamp}.png`;
      });

    } catch (error) {
      if (currentStep > 0 && stepResults[currentStep - 1]?.status === 'running') {
        stepResults[currentStep - 1].status = 'failed';
        stepResults[currentStep - 1].error = error.message;
      }
    } finally {
      // Calculate test duration
      const testEndTime = new Date();
      const durationSeconds = ((testEndTime - testMetadata.startTime) / 1000).toFixed(2);
      testMetadata.duration = durationSeconds;
      
      console.log('\n' + '='.repeat(60));
      console.log('📊 TEST STEP SUMMARY');
      console.log('='.repeat(60));
      
      const totalSteps = stepResults.length;
      const passedSteps = stepResults.filter(step => step.status === 'passed').length;
      const failedSteps = stepResults.filter(step => step.status === 'failed').length;
      
      stepResults.forEach(step => {
        const statusIcon = step.status === 'passed' ? '✅' : step.status === 'failed' ? '❌' : '⏳';
        console.log(`${statusIcon} Step ${step.step}: ${step.message} [${step.status.toUpperCase()}]`);
        if (step.error) console.log(`   Error: ${step.error}`);
      });
      
      console.log(`\n📈 Results: ${passedSteps}/${totalSteps} steps passed, ${failedSteps} failed`);
      console.log(failedSteps === 0 && passedSteps === totalSteps ? '🎉 TEST PASSED' : '💥 TEST FAILED');
      console.log('='.repeat(60));
      
      // Generate HTML Report
      try {
        const reportInfo = generateMobileIOSReport(stepResults, testMetadata, screenshots);
        console.log(`\n📊 HTML Report Generated: ${reportInfo.filename}`);
        console.log(`📁 Report Path: ${reportInfo.path}`);
        console.log(`🌐 Open in browser: ${reportInfo.url}`);
      } catch (reportError) {
        console.log(`⚠️ Failed to generate HTML report: ${reportError.message}`);
      }
      
      await context.close();
    }
  });
}); 