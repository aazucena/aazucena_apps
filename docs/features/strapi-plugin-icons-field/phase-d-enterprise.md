# Phase D: Enterprise Features (5-7 days)

[← Back to Overview](./README.md)

---

## Executive Summary

Add advanced enterprise capabilities including versioning, CDN integration, advanced permissions, and icon presets.

**Goal:** Enterprise-grade features for professional use.

**Duration:** 5-7 days
- D.1: Icon Versioning & History (2 days)
- D.2: CDN Integration & Asset Optimization (2 days)
- D.3: Advanced Permissions & RBAC (1-2 days)
- D.4: Icon Presets & Templates (1-2 days)

---

## Table of Contents

1. [D.1: Icon Versioning & History](#d1-icon-versioning--history)
2. [D.2: CDN Integration](#d2-cdn-integration)
3. [D.3: Advanced Permissions](#d3-advanced-permissions)
4. [D.4: Icon Presets](#d4-icon-presets)

---

## D.1: Icon Versioning & History

### Features

- Track icon changes over time
- Rollback to previous versions
- Compare icon versions
- Audit log for icon modifications

### Database Schema

**File:** `server/src/content-types/icon-version/schema.ts`

```typescript
export default {
  kind: 'collectionType',
  collectionName: 'icon_versions',
  info: {
    singularName: 'icon-version',
    pluralName: 'icon-versions',
    displayName: 'Icon Version'
  },
  attributes: {
    iconId: { type: 'string', required: true },
    version: { type: 'integer', required: true },
    svg: { type: 'text', required: true },
    changeLog: { type: 'text' },
    changedBy: {
      type: 'relation',
      relation: 'manyToOne',
      target: 'admin::user'
    },
    timestamp: { type: 'datetime', required: true }
  }
};
```

### Versioning Service

**File:** `server/src/services/versioning.ts`

```typescript
export default ({ strapi }) => ({
  async createVersion(iconId, svg, changeLog, userId) {
    // Get current version number
    const latestVersion = await strapi.db
      .query('plugin::icons-field.icon-version')
      .findOne({
        where: { iconId },
        orderBy: { version: 'desc' }
      });

    const version = latestVersion ? latestVersion.version + 1 : 1;

    // Create new version
    return strapi.db.query('plugin::icons-field.icon-version').create({
      data: {
        iconId,
        version,
        svg,
        changeLog,
        changedBy: userId,
        timestamp: new Date()
      }
    });
  },

  async getVersionHistory(iconId) {
    return strapi.db.query('plugin::icons-field.icon-version').findMany({
      where: { iconId },
      orderBy: { version: 'desc' },
      populate: { changedBy: true }
    });
  },

  async rollback(iconId, targetVersion) {
    const version = await strapi.db
      .query('plugin::icons-field.icon-version')
      .findOne({
        where: { iconId, version: targetVersion }
      });

    if (!version) {
      throw new Error('Version not found');
    }

    // Create new version with old SVG
    return this.createVersion(
      iconId,
      version.svg,
      `Rolled back to version ${targetVersion}`,
      null
    );
  }
});
```

---

## D.2: CDN Integration

### Features

- Cloudinary integration for icon hosting
- Automatic icon optimization (SVGO)
- WebP/AVIF fallbacks for raster icons
- Global CDN distribution

### Implementation

**File:** `server/src/services/cdn-uploader.ts`

```typescript
import { v2 as cloudinary } from 'cloudinary';
import { optimize } from 'svgo';

export class CDNUploaderService {
  constructor(private config: any) {
    cloudinary.config({
      cloud_name: config.cloudName,
      api_key: config.apiKey,
      api_secret: config.apiSecret
    });
  }

  async uploadIcon(iconId: string, svg: string): Promise<string> {
    const result = await cloudinary.uploader.upload(
      `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`,
      {
        public_id: `icons/${iconId}`,
        folder: 'strapi-icons',
        resource_type: 'image',
        format: 'svg',
        invalidate: true
      }
    );

    return result.secure_url;
  }

  async optimizeAndUpload(iconId: string, svg: string): Promise<string> {
    const optimized = optimize(svg, {
      multipass: true,
      plugins: [
        'removeDoctype',
        'removeComments',
        'removeMetadata',
        'cleanupIDs',
        'minifyStyles',
        'removeEmptyAttrs',
        'removeEmptyContainers'
      ]
    });

    return this.uploadIcon(iconId, optimized.data);
  }

  async deleteIcon(iconId: string): Promise<void> {
    await cloudinary.uploader.destroy(`icons/${iconId}`);
  }
}
```

### Configuration

**File:** `config/plugins.ts`

```typescript
export default {
  'icons-field': {
    enabled: true,
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

## D.3: Advanced Permissions

### Features

- Role-based access control for icon management
- Custom permissions (upload, delete, edit)
- Content type-specific icon restrictions
- Audit logging for permission changes

### Permission Schema

**File:** `server/src/config/permissions.ts`

```typescript
export default {
  'plugin::icons-field': {
    actions: [
      {
        section: 'plugins',
        displayName: 'View icons',
        uid: 'icons.view',
        pluginName: 'icons-field'
      },
      {
        section: 'plugins',
        displayName: 'Upload icons',
        uid: 'icons.upload',
        pluginName: 'icons-field'
      },
      {
        section: 'plugins',
        displayName: 'Delete icons',
        uid: 'icons.delete',
        pluginName: 'icons-field'
      },
      {
        section: 'plugins',
        displayName: 'Manage icon sets',
        uid: 'icon-sets.manage',
        pluginName: 'icons-field'
      },
      {
        section: 'plugins',
        displayName: 'View analytics',
        uid: 'analytics.view',
        pluginName: 'icons-field'
      }
    ]
  }
};
```

### Permission Middleware

**File:** `server/src/middlewares/check-permissions.ts`

```typescript
export default (requiredPermission: string) => async (ctx, next) => {
  const { user } = ctx.state;

  if (!user) {
    return ctx.forbidden('Authentication required');
  }

  const hasPermission = await strapi
    .service('admin::permission')
    .checkPermission(user, requiredPermission);

  if (!hasPermission) {
    return ctx.forbidden('Insufficient permissions');
  }

  await next();
};
```

---

## D.4: Icon Presets

### Features

- Create icon preset collections
- Share presets across projects
- Import community presets
- Export custom presets

### Database Schema

**File:** `server/src/content-types/icon-preset/schema.ts`

```typescript
export default {
  kind: 'collectionType',
  collectionName: 'icon_presets',
  info: {
    singularName: 'icon-preset',
    pluralName: 'icon-presets',
    displayName: 'Icon Preset'
  },
  attributes: {
    name: {
      type: 'string',
      required: true,
      unique: true
    },
    description: {
      type: 'text'
    },
    icons: {
      type: 'json',
      required: true
    },
    isPublic: {
      type: 'boolean',
      default: false
    },
    createdBy: {
      type: 'relation',
      relation: 'manyToOne',
      target: 'admin::user'
    },
    tags: {
      type: 'json',
      default: []
    }
  }
};
```

### Preset Service

**File:** `server/src/services/presets.ts`

```typescript
export default ({ strapi }) => ({
  async createPreset(name, description, iconIds, userId, isPublic = false) {
    // Fetch icon data
    const manifest = await strapi
      .plugin('icons-field')
      .service('icon-cache')
      .getManifest();

    const icons = manifest.icons.filter(icon => iconIds.includes(icon.id));

    return strapi.db.query('plugin::icons-field.icon-preset').create({
      data: {
        name,
        description,
        icons,
        createdBy: userId,
        isPublic
      }
    });
  },

  async getPresets(userId) {
    return strapi.db.query('plugin::icons-field.icon-preset').findMany({
      where: {
        $or: [
          { createdBy: userId },
          { isPublic: true }
        ]
      },
      populate: { createdBy: true }
    });
  },

  async exportPreset(presetId) {
    const preset = await strapi.db
      .query('plugin::icons-field.icon-preset')
      .findOne({ where: { id: presetId } });

    if (!preset) {
      throw new Error('Preset not found');
    }

    return {
      version: '2.0.0',
      name: preset.name,
      description: preset.description,
      icons: preset.icons,
      exportedAt: new Date().toISOString()
    };
  },

  async importPreset(presetData, userId) {
    return this.createPreset(
      presetData.name,
      presetData.description,
      presetData.icons.map(i => i.id),
      userId,
      false
    );
  }
});
```

---

## Enterprise Feature Summary

### Deliverables

- ✅ **Icon Versioning:** Track changes, rollback capability, audit logs
- ✅ **CDN Integration:** Cloudinary upload, optimization, global distribution
- ✅ **Advanced Permissions:** RBAC, content-type restrictions, audit logs
- ✅ **Icon Presets:** Collections, import/export, sharing

### Benefits

- **Version Control:** Never lose icon changes
- **Performance:** CDN delivers icons faster globally
- **Security:** Fine-grained permission control
- **Productivity:** Reusable icon collections

---

[← Back to Overview](./README.md)

---

**Last Updated:** 2025-11-26
**Phase Duration:** 5-7 days
**Priority:** Low
**Dependencies:** Phase A, B, C complete
