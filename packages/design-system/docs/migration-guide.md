# [Migration Guide] : Version_Upgrades

## SUMMARY

Step-by-step migration guide for upgrading between major versions of the aazucena design system. Includes breaking changes, deprecation notices, and automated migration scripts.

---

## VERSION_HISTORY

### v1.0.0 (Current) - Intelligence Core Release

- Initial stable release
- OKLCH color system
- MG/EG phase protocols
- 4px baseline grid
- Tailwind 4 integration

### v0.x.x (Beta) - Pre-release

- Experimental implementations
- HSL color system (deprecated)
- Non-standardized spacing

---

## BREAKING_CHANGES

### v0.x → v1.0 (Major)

#### 1. Color System Migration (HSL → OKLCH)

**What Changed:**

- All color tokens now use OKLCH instead of HSL
- New lightness-based contrast system
- Semantic color names updated

**Migration Steps:**

```typescript
// ❌ Old (HSL)
const primaryColor = 'hsl(220, 100%, 50%)';

// ✅ New (OKLCH)
const primaryColor = 'oklch(60% 0.2 220)';
```

**Automated Migration:**

```bash
# Run codemod
npx @aazucena/design-system-codemod hsl-to-oklch

# Or manually with find/replace
find . -name "*.css" -exec sed -i 's/hsl(/oklch(/g' {} \;
```

#### 2. Spacing Tokens Standardization

**What Changed:**

- Moved from arbitrary px values to 4px baseline grid
- All spacing tokens are multiples of 4

**Migration Table:**

| Old (px) | New (Token) | Multiplier |
| :------- | :---------- | :--------- |
| 6px      | spacing-1.5 | 4px × 1.5  |
| 12px     | spacing-3   | 4px × 3    |
| 18px     | spacing-4.5 | 4px × 4.5  |
| 24px     | spacing-6   | 4px × 6    |

**Migration Steps:**

```css
/* ❌ Old */
.container {
  padding: 12px 24px;
  margin-bottom: 18px;
}

/* ✅ New */
.container {
  padding: var(--spacing-3) var(--spacing-6);
  margin-bottom: var(--spacing-4-5);
}
```

#### 3. Typography Scale Changes

**What Changed:**

- Font families consolidated to Fira Sans/Code
- Type scale uses rem instead of px
- Line heights normalized

**Migration Steps:**

```css
/* ❌ Old */
h1 {
  font-family: 'Inter', sans-serif;
  font-size: 32px;
  line-height: 1.2;
}

/* ✅ New */
h1 {
  font-family: 'Fira Sans', sans-serif;
  font-size: 2rem; /* 32px */
  line-height: 1.25;
}
```

---

## DEPRECATED_FEATURES

### Deprecated in v1.0 (Removal in v2.0)

#### 1. Legacy Color Classes

```typescript
// ⚠️ Deprecated
'text-blue-500'; // Use text-primary-500
'bg-green-500'; // Use bg-success-500
'border-red-500'; // Use border-error-500

// ✅ Replacement
'text-primary-500';
'bg-success-500';
'border-error-500';
```

#### 2. Non-Standard Spacing

```css
/* ⚠️ Deprecated */
.spacing-arbitrary {
  padding: 14px; /* Not multiple of 4 */
}

/* ✅ Replacement */
.spacing-standard {
  padding: var(--spacing-3-5); /* 14px = 4px × 3.5 */
}
```

#### 3. HSL Color Utilities

```typescript
// ⚠️ Deprecated
import { hslToRgb } from '@aazucena/design-system';

// ✅ Replacement
import { oklchToRgb } from '@aazucena/design-system';
```

---

## MIGRATION_SCRIPTS

### Automated Codemods

```bash
# Install codemod tool
pnpm add -D @aazucena/design-system-codemod

# Run all migrations
npx @aazucena/design-system-codemod migrate --from=0.x --to=1.0

# Run specific migrations
npx @aazucena/design-system-codemod hsl-to-oklch
npx @aazucena/design-system-codemod spacing-tokens
npx @aazucena/design-system-codemod typography-scale
```

### Manual Migration Checklist

- [ ] Update `@aazucena/design-system` to v1.0.0
- [ ] Run `hsl-to-oklch` codemod on all CSS/SCSS files
- [ ] Replace deprecated color classes with semantic tokens
- [ ] Update spacing values to 4px multiples
- [ ] Switch font families to Fira Sans/Code
- [ ] Update Tailwind config to use new preset
- [ ] Test all components for visual regressions
- [ ] Run accessibility audit (Lighthouse, axe)
- [ ] Update Storybook stories
- [ ] Verify dark mode still works

---

## TAILWIND_CONFIG_MIGRATION

### v0.x Tailwind Config

```javascript
// tailwind.config.js (Old)
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'hsl(220, 100%, 98%)',
          100: 'hsl(220, 100%, 95%)',
          // ... HSL values
        },
      },
    },
  },
};
```

### v1.0 Tailwind Config

```javascript
// tailwind.config.js (New)
import { tailwindPreset } from '@aazucena/design-system';

export default {
  presets: [tailwindPreset],
  content: ['./src/**/*.{astro,tsx,ts,jsx,js}'],
  theme: {
    extend: {
      // Custom overrides (optional)
    },
  },
};
```

---

## FIGMA_SYNC_MIGRATION

### Updating Design Tokens

```bash
# Re-export tokens from Figma
pnpm run export-figma-tokens

# Generates updated figma.json
# Location: packages/design-system/figma.json

# Sync tokens to code
pnpm run sync-tokens
```

### Verifying Token Sync

```typescript
// Check if tokens are up-to-date
import { verifyTokenSync } from '@aazucena/design-system/scripts';

verifyTokenSync().then((result) => {
  if (result.hasChanges) {
    console.warn('Tokens out of sync with Figma');
    console.log('Changed tokens:', result.changes);
  }
});
```

---

## COMPONENT_MIGRATION

### Updated Component APIs

#### Button Component

```typescript
// ❌ Old API
<Button color="blue" size="md">
  Click Me
</Button>

// ✅ New API
<Button variant="primary" size="md">
  Click Me
</Button>
```

#### Badge Component

```typescript
// ❌ Old API
<Badge color="green">Success</Badge>

// ✅ New API
<Badge variant="success">Success</Badge>
```

---

## STORYBOOK_MIGRATION

### Updating Stories

```typescript
// ❌ Old Story Format
export default {
  title: 'Components/Button',
  component: Button,
};

export const Primary = () => <Button color="blue">Click Me</Button>;

// ✅ New Story Format (CSF 3.0)
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://figma.com/file/...',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Click Me',
  },
};
```

---

## TESTING_AFTER_MIGRATION

### Visual Regression Testing

```bash
# Capture baseline screenshots
pnpm chromatic --project-token=<TOKEN>

# After migration, compare
pnpm chromatic --project-token=<TOKEN>
```

### Accessibility Testing

```bash
# Run accessibility audit
pnpm test-storybook --accessibility

# Or manually with axe
npx @axe-core/cli http://localhost:6006
```

### Unit Testing

```bash
# Run all tests
pnpm test

# Update snapshots if needed
pnpm test -u
```

---

## ROLLBACK_PROCEDURE

If you encounter critical issues after migration:

### 1. Revert Package Version

```bash
# Rollback to previous version
pnpm add @aazucena/design-system@0.x.x

# Clear caches
rm -rf node_modules/.cache
rm -rf .next
rm -rf dist
```

### 2. Restore Configuration

```bash
# Restore from git
git restore tailwind.config.js
git restore src/styles/globals.css
```

### 3. Report Issues

```bash
# Create detailed issue report
# Include: error messages, screenshots, reproduction steps
```

---

## SUPPORT

### Getting Help

- **Documentation**: [Design System Docs](./README.md)
- **Discord**: #design-system channel
- **GitHub Issues**: [Report a bug](https://github.com/aazucena/aazucena-apps/issues)
- **Migration Support**: [migration@aazucena.com](mailto:migration@aazucena.com)

### Common Issues

#### Issue: Colors look washed out after migration

**Solution**: OKLCH uses different color space. Adjust chroma values:

```css
/* Increase chroma for more vibrant colors */
--primary-500: oklch(60% 0.25 220); /* Was 0.2 */
```

#### Issue: Spacing feels off

**Solution**: 4px grid may require layout adjustments. Use half-steps:

```css
--spacing-2-5: 10px; /* 4px × 2.5 */
```

#### Issue: Font rendering different

**Solution**: Fira Sans has different metrics than Inter. Adjust line-height:

```css
body {
  line-height: 1.6; /* Was 1.5 */
}
```

---

**STATUS:** 🔄 MIGRATION_GUIDE_ACTIVE
**LAST_UPDATED:** 2026-02-11
**AUTHOR:** aazucena_migration_team
