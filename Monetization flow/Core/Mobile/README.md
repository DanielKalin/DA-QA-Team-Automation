# DeviantArt Core Membership Mobile Testing Suite

## Overview
This directory contains automated mobile testing for DeviantArt Core Membership functionality using Playwright with iPhone 14 Pro Max emulation.

## Files Structure
- `mobile-core-test.spec.js` - Main test suite with 9 comprehensive steps
- `login.js` - Mobile authentication script 
- `playwright.config.js` - Mobile-specific Playwright configuration
- `storage/` - Authentication state storage (gitignored)
- `screenshots/` - Test screenshots with timestamps (gitignored)
- `test-results/` - Playwright test results

## Test Coverage
1. ✅ Page load verification
2. ✅ "Upgrade to" title and CORE icon detection  
3. ✅ Promotional text validation
4. ✅ Title attribute verification (Core Pro+, Core+, Pro, Max)
5. ✅ Pricing description validation
6. ✅ Random upgrade button interaction
7. ✅ Billing cycle modal verification
8. ✅ Radio button options logging (with whitespace detection)
9. ✅ Final price description confirmation

## How to Run
```bash
# Run the mobile test
npx playwright test mobile-core-test.spec.js --reporter=list

# Run with browser visible
npx playwright test mobile-core-test.spec.js --headed

# Generate login state (if needed)
node login.js
```

## Features
- 📱 iPhone 14 Pro Max emulation (430x932 viewport)
- 🕒 Timestamped screenshots (prevent overwrites)
- 📏 Consistent 430x800px clipped screenshots
- 🎯 Random plan selection with proximity detection
- 📝 Whitespace detection in form elements
- ⚡ Optimized with helper functions
- 🔍 Comprehensive element validation

## Requirements
- Node.js with Playwright installed
- Valid DeviantArt credentials (for login.js)
- WebKit browser engine (for Safari simulation)
