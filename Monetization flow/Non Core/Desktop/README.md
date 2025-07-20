# DeviantArt Pricing Page During Sale Test

## 📋 Overview

This test verifies the **DeviantArt Core Membership pricing page** during sale periods to ensure all components are displayed correctly and functionality works as expected for logged-out users.

**Test File**: `deviantart-pp-during-sale.spec.js`  
**Target URL**: `https://www.deviantart.com/core-membership`  
**Framework**: Playwright Test Automation  

## 🎯 What This Test Does

### **Sale Components Verification**
- ✅ **Sale countdown timer** with dynamic date filtering
- ✅ **Sale disclaimer** with dynamic date filtering  
- ✅ **Multiple pricing cards** verification
- ✅ **Background images** verification

### **Package Components Detection**
- ✅ **Package icons** verification (Max, Pro+, Pro, Core+)
- ✅ **Package titles** using actual page content:
  - **Max**: "Level up your business"
  - **Pro+**: "Grow your sales and profits"  
  - **Pro**: "Promote and sell your art"
  - **Core+**: "Create and connect with fans"

### **Comprehensive Pricing Information**
- ✅ **Current sale prices** (e.g., $8.34/mo)
- ✅ **Original prices** (e.g., was $16.67/mo)
- ✅ **Sale percentages** (e.g., 50% OFF)
- ✅ **Monthly savings** calculations (e.g., Monthly Savings: $8.33)
- ✅ **Structured pricing display** for all packages

### **Functionality Testing**
- ✅ **"Upgrade Now" button** functionality and redirect verification
- ✅ **Background image styling** verification
- ✅ **Page navigation** and proper redirects

## 🚀 How to Run the Test

### **Prerequisites**
```bash
# Install dependencies
npm install
```

### **Run Commands**

**Run the specific test:**
```bash
npx playwright test "Monetization flow/Non Core/Desktop/deviantart-pp-during-sale.spec.js"
```

**Run with browser visible:**
```bash
npx playwright test "Monetization flow/Non Core/Desktop/deviantart-pp-during-sale.spec.js" --headed
```

**Run in debug mode:**
```bash
npx playwright test "Monetization flow/Non Core/Desktop/deviantart-pp-during-sale.spec.js" --debug
```

## 📊 Test Output Example

```
📦 MAX PACKAGE:
  Monthly: $8.34/mo (was $16.67/mo)
  Sale: 50% OFF
  Monthly Savings: $8.33

📦 PRO+ PACKAGE:
  Monthly: $8.34/mo (was $16.67/mo)
  Sale: 50% OFF
  Monthly Savings: $8.33

📦 PRO PACKAGE:
  Monthly: $8.34/mo (was $16.67/mo)
  Sale: 50% OFF
  Monthly Savings: $8.33

📦 CORE+ PACKAGE:
  Monthly: $8.34/mo (was $16.67/mo)
  Sale: 50% OFF
  Monthly Savings: $8.33

==================================================
✓ Max package has pricing information
✓ Pro+ package has pricing information  
✓ Pro package has pricing information
✓ Core+ package has pricing information
💰 Total pricing elements found: 78
🏷️ Sale price indicators found: 81
✓ Features/Benefits section is visible
✓ Page title contains DeviantArt
```

## 🧪 Test Cases

### **Test Case 1: Component Verification**
**Purpose**: Verify all expected page components are present during sale
- Sale countdown timer
- Sale disclaimer  
- Multiple pricing cards
- Background images
- Package icons
- Features/Benefits section
- Page title validation

### **Test Case 2: Button Functionality**  
**Purpose**: Ensure "Upgrade Now" button works correctly
- Button presence verification
- Click functionality
- Redirect validation
- Background image styling

## 🎯 Enhanced Features

### **🔧 Intelligent Package Detection**
- **Uses actual package titles** from the page instead of just package names
- **Flexible selectors** that adapt to UI changes
- **Multiple detection strategies** for robust identification
- **Debug output** for troubleshooting

### **💰 Comprehensive Pricing Extraction**
- **Real-time pricing data** extraction from page
- **Sale price calculations** with original prices
- **Savings computations** for each package
- **Structured formatting** with clear separators
- **Error handling** for missing or malformed data

### **⏰ Dynamic Content Handling**
- **Sale countdown filtering** to handle dynamic time information
- **Date replacement** with placeholders ([DATE], [TIME])
- **Time filtering** for countdown timers ([X] Days, [X] Hours)
- **Flexible date patterns** to accommodate various formats

## 🏗️ Technical Architecture

### **Page Object Pattern**
- Organized selectors for maintainability
- Reusable functions for common operations
- Clear separation of test logic and page interaction

### **Error Handling**
- **Graceful failures** for missing optional components
- **Detailed logging** for debugging issues
- **Screenshot capture** on failures
- **Comprehensive assertions** with meaningful messages

### **Debugging Features**
- **Package detection debugging** with detailed output
- **Pricing extraction logging** showing found elements
- **Element count verification** for validation
- **Search result logging** for troubleshooting

## 📈 Performance Metrics

**Typical Test Execution:**
- **Duration**: ~7-8 seconds
- **Test Cases**: 2 test cases
- **Success Rate**: 100% when properly configured
- **Elements Verified**: 78+ pricing elements, 81+ sale indicators

## 🔍 Troubleshooting

### **Common Issues:**

**Package Not Detected:**
- Check if package titles have changed on the page
- Verify network connectivity during test execution
- Review debug output for detection attempts

**Pricing Information Missing:**  
- Confirm sale is currently active on DeviantArt
- Check if pricing structure has been updated
- Verify selectors are finding the correct elements

**Button Functionality Issues:**
- Ensure page fully loads before testing
- Check for any UI changes in button styling
- Verify redirect URLs are still valid

## 📝 Maintenance Notes

### **When to Update:**
- **UI Changes**: If DeviantArt updates their pricing page layout
- **New Packages**: When new membership tiers are introduced  
- **Pricing Structure**: If pricing display format changes
- **Sale Format**: If sale presentation is modified

### **Key Selectors to Monitor:**
- Package title text content
- Pricing element structures
- Button selectors and styling
- Sale countdown and disclaimer elements

## 🎉 Recent Improvements

### **Enhanced Package Detection (Latest)**
- **Fixed Max package detection** using actual page titles
- **Improved reliability** across all package types
- **Added comprehensive debugging** output
- **Enhanced error handling** for edge cases

### **Pricing Display Enhancement**
- **Real-time extraction** of current sale information
- **Structured output** with clear formatting
- **Comprehensive calculations** including savings
- **Dynamic content filtering** for time-sensitive elements

## 🏷️ Test Categories

- **UI Component Testing** ✅
- **Pricing Verification** ✅  
- **Functionality Testing** ✅
- **Sale Period Testing** ✅
- **Cross-browser Compatibility** ✅
- **Dynamic Content Handling** ✅

---

**Last Updated**: January 2025  
**Test Version**: Enhanced Package Detection v2.0  
**Maintainer**: QA Team 