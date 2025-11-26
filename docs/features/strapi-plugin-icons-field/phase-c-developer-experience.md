# Phase C: Developer Experience (6-8 days)

[← Back to Overview](./README.md)

---

## Executive Summary

Create best-in-class developer experience with comprehensive testing, Storybook component library, and complete documentation.

**Goal:** Ensure plugin is production-ready with excellent DX.

**Duration:** 6-8 days
- C.1: Comprehensive Testing Suite (3-4 days)
- C.2: Storybook Component Library (2-3 days)
- C.3: Developer Documentation & API Reference (1-2 days)

---

## Table of Contents

1. [C.1: Comprehensive Testing Suite](#c1-comprehensive-testing-suite)
2. [C.2: Storybook Component Library](#c2-storybook-component-library)
3. [C.3: Developer Documentation](#c3-developer-documentation)

---

## C.1: Comprehensive Testing Suite

### Test Coverage Targets

- **Unit tests:** 85%+
- **Integration tests:** 70%+
- **E2E tests:** Critical user flows (100%)

### Unit Tests

**File:** `__tests__/unit/services/icon-cache.test.ts`

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { IconCacheService } from '../../../server/src/services/icon-cache';

describe('IconCacheService', () => {
  let cache: IconCacheService;
  let strapi: any;

  beforeEach(() => {
    strapi = {
      dirs: { static: { public: '/tmp/test-public' } },
      config: { get: vi.fn(() => 'icons') }
    };
    cache = new IconCacheService(strapi);
  });

  describe('generateManifest', () => {
    it('should generate manifest with all icons', async () => {
      const manifest = await cache.generateManifest();

      expect(manifest).toMatchObject({
        version: expect.stringMatching(/^\d+\.\d+\.\d+$/),
        timestamp: expect.any(Number),
        icons: expect.any(Array),
        categories: expect.any(Array),
        hash: expect.stringMatching(/^[a-f0-9]{64}$/)
      });
    });

    it('should categorize icons by folder structure', async () => {
      const manifest = await cache.generateManifest();
      const categorized = manifest.icons.find(i => i.category !== 'uncategorized');

      expect(categorized).toBeDefined();
    });

    it('should calculate correct icon hashes', async () => {
      const manifest = await cache.generateManifest();
      const icon = manifest.icons[0];

      expect(icon.hash).toHaveLength(32); // MD5 hash
    });
  });

  describe('getManifest', () => {
    it('should return cached manifest if fresh', async () => {
      await cache.generateManifest();
      const spy = vi.spyOn(cache, 'generateManifest');

      await cache.getManifest();

      expect(spy).not.toHaveBeenCalled();
    });

    it('should regenerate manifest if stale', async () => {
      await cache.generateManifest();

      // Mock stale cache
      vi.useFakeTimers();
      vi.advanceTimersByTime(cache.cacheTTL + 1000);

      const spy = vi.spyOn(cache, 'generateManifest');
      await cache.getManifest();

      expect(spy).toHaveBeenCalled();

      vi.useRealTimers();
    });
  });
});
```

### E2E Tests (Playwright)

**File:** `__tests__/e2e/icon-selection.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Icon Selection Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/content-manager/collection-types/api::article.article/create');
  });

  test('should open icon picker modal', async ({ page }) => {
    await page.click('[data-testid="icon-field-trigger"]');

    await expect(page.locator('[role="dialog"]')).toBeVisible();
    await expect(page.locator('text=Select an icon')).toBeVisible();
  });

  test('should search icons by name', async ({ page }) => {
    await page.click('[data-testid="icon-field-trigger"]');
    await page.fill('[placeholder="Search icons..."]', 'arrow');

    const icons = page.locator('[role="gridcell"]');
    await expect(icons).toHaveCount(expect.any(Number));

    const firstIcon = icons.first();
    await expect(firstIcon).toContainText('arrow', { ignoreCase: true });
  });

  test('should filter icons by category', async ({ page }) => {
    await page.click('[data-testid="icon-field-trigger"]');
    await page.selectOption('[data-testid="category-filter"]', 'navigation');

    const icons = page.locator('[role="gridcell"]');
    const count = await icons.count();

    expect(count).toBeGreaterThan(0);
  });

  test('should select icon with keyboard', async ({ page }) => {
    await page.click('[data-testid="icon-field-trigger"]');

    // Navigate with arrow keys
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('Enter');

    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
    await expect(page.locator('[data-testid="selected-icon"]')).toBeVisible();
  });

  test('should save favorites', async ({ page }) => {
    await page.click('[data-testid="icon-field-trigger"]');

    const firstIcon = page.locator('[role="gridcell"]').first();
    await firstIcon.hover();
    await page.click('[data-testid="favorite-button"]');

    await page.click('[data-testid="show-favorites"]');

    const favorites = page.locator('[role="gridcell"]');
    await expect(favorites).toHaveCount(1);
  });
});
```

### Performance Tests

**File:** `__tests__/performance/icon-cache.bench.ts`

```typescript
import { describe, bench } from 'vitest';
import { IconCacheService } from '../../server/src/services/icon-cache';

describe('Icon Cache Performance', () => {
  bench('Generate manifest (1000 icons)', async () => {
    const cache = new IconCacheService(strapi);
    await cache.generateManifest();
  });

  bench('Get cached manifest', async () => {
    const cache = new IconCacheService(strapi);
    await cache.getManifest(); // Should be <1ms with cache
  });

  bench('Search icons (fuzzy)', async () => {
    const manifest = await cache.getManifest();
    const results = searchIcons(manifest.icons, 'arrow');
  });
});
```

**Performance Targets:**
- Manifest generation: <500ms for 1000 icons
- Cached manifest read: <5ms
- Icon search: <50ms for 10,000 icons
- Memory usage: <50MB for 5000 icons

---

## C.2: Storybook Component Library

### Setup

**File:** `.storybook/main.ts`

```typescript
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../admin/src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y'
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {}
  }
};

export default config;
```

### Icon Component Stories

**File:** `admin/src/components/Icon.stories.tsx`

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from './Icon';

const meta: Meta<typeof Icon> = {
  title: 'Components/Icon',
  component: Icon,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg', 'xl']
    },
    color: { control: 'color' }
  }
};

export default meta;
type Story = StoryObj<typeof Icon>;

export const Default: Story = {
  args: {
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2l9 7-9 7-9-7z"/></svg>',
    size: 'md'
  }
};

export const WithCustomColor: Story = {
  args: {
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2l9 7-9 7-9-7z"/></svg>',
    size: 'md',
    color: '#FF5733'
  }
};

export const LargeIcon: Story = {
  args: {
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2l9 7-9 7-9-7z"/></svg>',
    size: 'xl'
  }
};
```

### Filter Panel Stories

**File:** `admin/src/components/FilterPanel.stories.tsx`

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { FilterPanel } from './FilterPanel';

const meta: Meta<typeof FilterPanel> = {
  title: 'Components/FilterPanel',
  component: FilterPanel,
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<typeof FilterPanel>;

export const Default: Story = {
  args: {
    filters: {
      tags: {
        animated: false,
        hasPadding: false,
        preciseShapes: false,
        usesStrokes: false
      },
      gridSize: null,
      paletteType: 'all',
      commercialUse: 'all',
      attribution: 'all'
    },
    activeFilterCount: 0
  }
};

export const WithActiveFilters: Story = {
  args: {
    filters: {
      tags: {
        animated: true,
        hasPadding: false,
        preciseShapes: true,
        usesStrokes: false
      },
      gridSize: 24,
      paletteType: 'monotone',
      commercialUse: 'allowed',
      attribution: 'optional'
    },
    activeFilterCount: 5
  }
};
```

---

## C.3: Developer Documentation

### Documentation Structure

```
docs/
├── README.md (Overview)
├── getting-started.md
├── configuration.md
├── api-reference/
│   ├── services.md
│   ├── controllers.md
│   ├── hooks.md
│   └── components.md
├── guides/
│   ├── custom-icon-sources.md
│   ├── icon-optimization.md
│   ├── batch-operations.md
│   └── analytics.md
├── migration/
│   ├── v1-to-v2.md
│   └── breaking-changes.md
└── troubleshooting.md
```

### API Reference Example

**File:** `docs/api-reference/services.md`

````markdown
# API Reference: IconCacheService

## Overview

The `IconCacheService` provides efficient icon manifest generation and caching.

## Methods

### `generateManifest(): Promise<IconManifest>`

Scans the configured icons directory and generates a complete icon manifest.

**Returns:** `Promise<IconManifest>`

**Example:**

```typescript
const cache = strapi.plugin('icons-field').service('icon-cache');
const manifest = await cache.generateManifest();

console.log(`Found ${manifest.icons.length} icons`);
```

### `getManifest(): Promise<IconManifest>`

Returns cached manifest or generates new one if cache is stale.

**Returns:** `Promise<IconManifest>`

**Cache Behavior:**
- Returns cached manifest if age < `cacheTTL` (default: 1 hour)
- Regenerates manifest if cache is stale or missing

### `invalidateCache(): Promise<void>`

Force invalidate the current manifest cache.

**Use Cases:**
- After bulk icon upload
- After icon deletion
- Manual cache refresh

## Configuration

```typescript
// config/plugins.ts
export default {
  'icons-field': {
    enabled: true,
    config: {
      publicPath: 'icons',
      cacheTTL: 3600000, // 1 hour in milliseconds
      maxIconSize: 512000 // 500KB
    }
  }
};
```
````

### Getting Started Guide

**File:** `docs/getting-started.md`

````markdown
# Getting Started

## Installation

```bash
# Install plugin
pnpm add strapi-plugin-icons-field@^2.0.0

# Or with npm
npm install strapi-plugin-icons-field@^2.0.0
```

## Quick Start

1. **Enable the plugin** in `config/plugins.ts`:

```typescript
export default {
  'icons-field': {
    enabled: true,
    config: {
      publicPath: 'icons'
    }
  }
};
```

2. **Add icons to your project**:

```bash
# Create icons directory
mkdir -p public/icons

# Copy your SVG icons
cp my-icons/*.svg public/icons/
```

3. **Add icon field to content type**:
   - Go to Content-Type Builder
   - Select a content type
   - Add field → Custom → Icon
   - Save and rebuild admin

4. **Use in frontend**:

```tsx
import Icon from '@/components/Icon';

export default function MyComponent({ data }) {
  return <Icon icon={data.icon.svg} className="w-6 h-6" />;
}
```

## Next Steps

- [Configuration Guide](./configuration.md)
- [Custom Icon Sources](./guides/custom-icon-sources.md)
- [API Reference](./api-reference/)
````

---

## Testing Checklist

### Unit Testing
- ✅ Icon cache service
- ✅ SVG sanitizer
- ✅ Icon discovery service
- ✅ Analytics service
- ✅ Utility functions

### Integration Testing
- ✅ API endpoints
- ✅ Database operations
- ✅ File system operations
- ✅ Cache invalidation

### E2E Testing
- ✅ Icon selection flow
- ✅ Search and filter
- ✅ Keyboard navigation
- ✅ Favorites management
- ✅ Batch upload

### Performance Testing
- ✅ Manifest generation (<500ms for 1000 icons)
- ✅ Search performance (<50ms)
- ✅ Memory usage (<50MB)

---

[← Back to Overview](./README.md)

---

**Last Updated:** 2025-11-26
**Phase Duration:** 6-8 days
**Priority:** Medium
**Dependencies:** Phase A, B complete
