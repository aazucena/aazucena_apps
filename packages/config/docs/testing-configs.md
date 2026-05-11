# 🧪 TESTING_CONFIGURATIONS

**DEVELOPER_GUIDE** • **INTELLIGENCE_THEME** • **Phase_4_Developer_Experience**

Complete guide to **Playwright E2E testing** configuration in @aazucena/config. Cross-browser testing with Chromium, Firefox, and WebKit.

---

## 📋 TABLE_OF_CONTENTS

- [🎯 OVERVIEW](#-overview)
- [🔧 CONFIGURATION](#-configuration)
- [📝 WRITING_TESTS](#-writing_tests)
- [🎯 BEST_PRACTICES](#-best_practices)

---

## 🎯 OVERVIEW

### Playwright Configuration

**Purpose:** E2E testing with cross-browser support

**Features:**

- ✅ **Cross-browser** - Chromium, Firefox, WebKit
- ✅ **Parallel execution** - Fast test runs
- ✅ **CI/CD optimized** - Retries, workers, reporters
- ✅ **Trace on failure** - Debug failed tests
- ✅ **Screenshot/video** - Visual regression testing

---

## 🔧 CONFIGURATION

### Base Configuration

```typescript
// playwright/base.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:4321',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
```

### Usage

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';
import baseConfig from '@aazucena/config/playwright/base';

export default defineConfig({
  ...baseConfig,
  webServer: {
    command: 'pnpm dev',
    port: 4321,
    reuseExistingServer: !process.env.CI,
  },
});
```

---

## 📝 WRITING_TESTS

### Basic Test

```typescript
// tests/example.spec.ts
import { test, expect } from '@playwright/test';

test('homepage has title', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/Aldrin Azucena/);
});
```

### Navigation Test

```typescript
test('navigate to projects', async ({ page }) => {
  await page.goto('/');

  await page.click('text=Projects');

  await expect(page).toHaveURL(/\/projects/);
});
```

### Form Test

```typescript
test('submit contact form', async ({ page }) => {
  await page.goto('/contact');

  await page.fill('input[name="name"]', 'Test User');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('textarea[name="message"]', 'Hello!');

  await page.click('button[type="submit"]');

  await expect(page.locator('.success-message')).toBeVisible();
});
```

---

## 🎯 BEST_PRACTICES

### 1. Use Data Attributes

```typescript
// ✅ GOOD - Stable selectors
await page.click('[data-testid="submit-button"]');

// ❌ BAD - Fragile selectors
await page.click('.btn.btn-primary.submit');
```

### 2. Wait for Network

```typescript
await Promise.all([
  page.waitForResponse((response) => response.url().includes('/api/submit')),
  page.click('button[type="submit"]'),
]);
```

### 3. Test Isolation

```typescript
test.beforeEach(async ({ page }) => {
  // Clean state before each test
  await page.goto('/');
});
```

---

**DOCUMENTATION_METADATA:**

- **Version:** 1.0.0
- **Last Updated:** 2026-02-11
- **Lines:** ~200

**INTELLIGENCE_THEME** • **E2E_TESTING** 🧪
