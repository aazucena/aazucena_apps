# Migration Guide: v1.1.5 → v2.0.0

[← Back to Overview](./README.md)

---

## Executive Summary

**Backward Compatibility:** v2.0.0 is designed to be **100% backward compatible** with v1.1.5. Existing icons will continue to work without changes.

**Migration Required:** Optional. A migration script is provided to convert v1 data to v2 format and unlock new features (analytics, versioning, etc.).

**Time Estimate:** 15-30 minutes

---

## Table of Contents

1. [Breaking Changes](#breaking-changes)
2. [Upgrade Steps](#upgrade-steps)
3. [Migration Script](#migration-script)
4. [Backward Compatibility](#backward-compatibility)
5. [New Configuration Options](#new-configuration-options)
6. [Troubleshooting](#troubleshooting)

---

## Breaking Changes

### 1. Plugin Configuration (Minor)

**v1.1.5:**
```typescript
// config/plugins.ts
export default {
  'icons-field': {
    enabled: true,
    config: {
      publicPath: 'icons'
    }
  }
};
```

**v2.0.0:**
```typescript
// config/plugins.ts
export default {
  'icons-field': {
    enabled: true,
    config: {
      publicPath: 'icons',              // LEGACY: Still supported
      cacheTTL: 3600000,                 // NEW: Cache duration (default: 1hr)
      maxIconSize: 512000,               // NEW: Max icon size (default: 500KB)
      enableAnalytics: false,            // NEW: Usage tracking (default: false)
      sanitize: true,                    // NEW: SVG sanitization (default: true)

      // NEW: Automatic icon discovery
      iconPackages: [                    // OPTIONAL: Auto-discover from node_modules
        {
          name: '@mynaui/icons-react',
          iconPath: 'dist/icons',
          pattern: '**/*.svg'
        }
      ]
    }
  }
};
```

**Impact:** Minimal. Old configuration continues to work. New options are optional.

---

### 2. Icon Data Structure (Breaking)

**v1.1.5:**
```json
{
  "icon": "<svg>...</svg>"
}
```

**v2.0.0:**
```json
{
  "icon": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "arrow-right",
    "category": "navigation",
    "svg": "<svg>...</svg>"
  }
}
```

**Impact:** High for new features. Low for existing usage (compatibility layer handles conversion).

---

## Upgrade Steps

### Step 1: Backup Your Database

**Critical:** Always backup before upgrading!

```bash
# PostgreSQL backup
pg_dump portfolio_db > backup_v1_$(date +%Y%m%d).sql

# Or use Strapi's backup command
npm run strapi export -- --file backup_v1.tar.gz
```

---

### Step 2: Update Plugin Version

```bash
# Using npm
npm install strapi-plugin-icons-field@^2.0.0

# Using yarn
yarn add strapi-plugin-icons-field@^2.0.0

# Using pnpm
pnpm add strapi-plugin-icons-field@^2.0.0
```

---

### Step 3: Update Configuration (Optional)

Add new configuration options to `config/plugins.ts`:

```typescript
export default {
  'icons-field': {
    enabled: true,
    config: {
      publicPath: 'icons',              // Keep existing path

      // NEW: Optional configuration
      cacheTTL: 3600000,                 // 1 hour cache
      maxIconSize: 512000,               // 500KB max
      enableAnalytics: true,             // Enable usage tracking
      sanitize: true,                    // Enable SVG sanitization

      // NEW: Automatic icon discovery (highly recommended!)
      iconPackages: [
        {
          name: '@mynaui/icons-react',
          iconPath: 'dist/icons',
          pattern: '**/*.svg',
          category: 'mynaui',
          variant: 'regular'
        }
      ]
    }
  }
};
```

---

### Step 4: Run Migration Script (Optional but Recommended)

Create migration file:

**File:** `database/migrations/migrate-icons-field.ts`

```typescript
import type { Strapi } from '@strapi/strapi';
import crypto from 'crypto';

export default async ({ strapi }: { strapi: Strapi }) => {
  console.log('Starting strapi-plugin-icons-field v1 → v2 migration...');

  const contentTypes = Object.keys(strapi.contentTypes);
  let totalMigrated = 0;

  for (const ctName of contentTypes) {
    const ct = strapi.contentTypes[ctName];

    // Find icon fields in this content type
    const iconFields = Object.entries(ct.attributes)
      .filter(([_, attr]) => attr.customField === 'plugin::icons-field.icon')
      .map(([name]) => name);

    if (iconFields.length === 0) continue;

    console.log(`Processing ${ctName} (${iconFields.length} icon fields)...`);

    // Get all entries
    const entries = await strapi.db.query(ctName).findMany();

    for (const entry of entries) {
      const updates: Record<string, any> = {};

      for (const fieldName of iconFields) {
        const oldValue = entry[fieldName];

        // Skip if already migrated or null
        if (!oldValue || typeof oldValue === 'object') continue;

        // Convert string SVG to icon object
        updates[fieldName] = {
          id: crypto.randomUUID(),
          name: 'migrated-icon',
          category: 'uncategorized',
          svg: oldValue
        };

        totalMigrated++;
      }

      // Update entry if needed
      if (Object.keys(updates).length > 0) {
        await strapi.db.query(ctName).update({
          where: { id: entry.id },
          data: updates
        });
      }
    }

    console.log(`✓ Migrated ${entries.length} entries for ${ctName}`);
  }

  console.log(`✅ Migration complete! Migrated ${totalMigrated} icon fields.`);
};
```

Run migration:

```bash
# Add script to package.json
{
  "scripts": {
    "migrate:icons": "node -r ts-node/register database/migrations/migrate-icons-field.ts"
  }
}

# Run migration
npm run migrate:icons
```

---

### Step 5: Rebuild Admin Panel

```bash
# Rebuild Strapi admin
npm run build

# Or for development
npm run develop
```

---

### Step 6: Verify Icon Fields

1. Open Strapi admin panel
2. Go to Content Manager
3. Open an entry with icon field
4. Verify icon displays correctly
5. Try selecting a new icon
6. Check analytics (if enabled)

---

## Migration Script

### Enhanced Migration with Metadata Extraction

If you want to preserve icon names and categories from file paths:

```typescript
import type { Strapi } from '@strapi/strapi';
import crypto from 'crypto';
import path from 'path';

export default async ({ strapi }: { strapi: Strapi }) => {
  console.log('Starting enhanced icon migration...');

  // Load icon manifest
  const manifest = await strapi
    .plugin('icons-field')
    .service('icon-cache')
    .getManifest();

  // Create lookup map for quick matching
  const iconLookup = new Map(
    manifest.icons.map(icon => [icon.svg.trim(), icon])
  );

  const contentTypes = Object.keys(strapi.contentTypes);
  let totalMigrated = 0;
  let matched = 0;
  let unmatched = 0;

  for (const ctName of contentTypes) {
    const ct = strapi.contentTypes[ctName];

    const iconFields = Object.entries(ct.attributes)
      .filter(([_, attr]) => attr.customField === 'plugin::icons-field.icon')
      .map(([name]) => name);

    if (iconFields.length === 0) continue;

    const entries = await strapi.db.query(ctName).findMany();

    for (const entry of entries) {
      const updates: Record<string, any> = {};

      for (const fieldName of iconFields) {
        const oldValue = entry[fieldName];

        if (!oldValue || typeof oldValue === 'object') continue;

        // Try to match with existing icon in manifest
        const existingIcon = iconLookup.get(oldValue.trim());

        if (existingIcon) {
          // Use existing icon metadata
          updates[fieldName] = {
            id: existingIcon.id,
            name: existingIcon.name,
            category: existingIcon.category,
            svg: existingIcon.svg
          };
          matched++;
        } else {
          // Create new icon object
          updates[fieldName] = {
            id: crypto.randomUUID(),
            name: 'migrated-icon',
            category: 'uncategorized',
            svg: oldValue
          };
          unmatched++;
        }

        totalMigrated++;
      }

      if (Object.keys(updates).length > 0) {
        await strapi.db.query(ctName).update({
          where: { id: entry.id },
          data: updates
        });
      }
    }
  }

  console.log(`✅ Migration complete!`);
  console.log(`Total migrated: ${totalMigrated}`);
  console.log(`Matched with manifest: ${matched}`);
  console.log(`Unmatched (new icons): ${unmatched}`);
};
```

---

## Backward Compatibility

### Automatic Conversion Layer

v2.0.0 includes a **compatibility layer** that automatically converts v1 icon data to v2 format:

```typescript
// admin/src/components/IconField.tsx
function normalizeIconValue(value: any) {
  // v1 format (string) - auto-convert
  if (typeof value === 'string') {
    return {
      id: crypto.randomUUID(),
      name: 'legacy-icon',
      category: 'uncategorized',
      svg: value
    };
  }

  // v2 format (object) - use as-is
  return value;
}
```

**Result:** Old icons continue to work without migration, but you won't have access to new features (analytics, versioning, etc.) until you run the migration script.

---

## New Configuration Options

### Icon Discovery (Recommended)

**Eliminates manual icon copying!**

```typescript
export default {
  'icons-field': {
    config: {
      iconPackages: [
        {
          name: '@mynaui/icons-react',    // npm package name
          iconPath: 'dist/icons',         // Path inside package
          pattern: '**/*.svg',            // Glob pattern
          category: 'mynaui',             // Optional custom category
          variant: 'regular'              // Optional variant name
        },
        {
          name: '@heroicons/react',
          iconPath: 'optimized',
          pattern: '**/*.svg',
          category: 'heroicons'
        }
      ],

      // Development: use API proxy for auto-discovery
      useNodeModulesDiscovery: process.env.NODE_ENV === 'development',

      // Cache TTL for discovered icons (development only)
      discoveryCacheTTL: 60000 // 1 minute
    }
  }
};
```

### Analytics

```typescript
export default {
  'icons-field': {
    config: {
      enableAnalytics: true    // Track icon usage
    }
  }
};
```

**Benefits:**
- See most popular icons
- Find unused icons
- Track usage by content type

### CDN Integration (Optional)

```typescript
export default {
  'icons-field': {
    config: {
      cdn: {
        enabled: true,
        provider: 'cloudinary',
        config: {
          cloudName: process.env.CLOUDINARY_NAME,
          apiKey: process.env.CLOUDINARY_KEY,
          apiSecret: process.env.CLOUDINARY_SECRET
        }
      }
    }
  }
};
```

---

## Troubleshooting

### Issue: Icons not showing after upgrade

**Cause:** Admin panel cache

**Solution:**
```bash
# Clear admin build cache
rm -rf .cache build
npm run build
```

---

### Issue: Migration script fails

**Cause:** Missing content type

**Solution:**
```bash
# Check content types
npm run strapi content-types:list

# Rebuild content types
npm run strapi build
```

---

### Issue: Icon fields show as plain text

**Cause:** Plugin not properly loaded

**Solution:**
1. Check `config/plugins.ts` has `enabled: true`
2. Restart Strapi: `npm run develop`
3. Clear browser cache

---

### Issue: "Cannot find module" error

**Cause:** Missing dependencies

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Or force reinstall plugin
npm install strapi-plugin-icons-field@^2.0.0 --force
```

---

### Issue: SVG icons not rendering

**Cause:** SVG sanitization too strict

**Solution:**
```typescript
// config/plugins.ts - Temporarily disable sanitization
export default {
  'icons-field': {
    config: {
      sanitize: false  // WARNING: Only disable if you trust icon sources
    }
  }
};
```

---

## Rollback Plan

If something goes wrong, rollback to v1.1.5:

### Step 1: Restore Database

```bash
# Restore from backup
psql portfolio_db < backup_v1_YYYYMMDD.sql

# Or use Strapi import
npm run strapi import -- --file backup_v1.tar.gz
```

### Step 2: Downgrade Plugin

```bash
npm install strapi-plugin-icons-field@^1.1.5
```

### Step 3: Rebuild Admin

```bash
rm -rf .cache build
npm run build
npm run develop
```

---

## FAQ

### Q: Do I need to run the migration script?

**A:** Not required, but recommended. Without migration:
- Old icons will continue to work (compatibility layer)
- New features (analytics, versioning) won't be available
- Icon metadata (name, category) will be generic

### Q: Can I migrate later?

**A:** Yes! Migration can be run anytime after upgrade. Icons work without it.

### Q: Will my frontend break?

**A:** No. Frontend code accessing `data.icon.svg` continues to work unchanged.

### Q: What if I have custom icon sources?

**A:** Configure both `publicPath` (legacy) and `iconPackages` (new). They coexist.

### Q: How do I verify migration succeeded?

**A:** Check admin panel:
1. Open icon field
2. Verify icon names/categories are correct (not "migrated-icon")
3. Check analytics (if enabled)

---

[← Back to Overview](./README.md)

---

**Last Updated:** 2025-11-26
**Migration Difficulty:** Easy
**Estimated Time:** 15-30 minutes
**Backward Compatible:** ✅ Yes
