# Phase B.2-B.5: Additional Advanced Features (5-7 days)

[← Back to Overview](./README.md)

---

## Executive Summary

Implement batch operations, analytics, accessibility, and internationalization features to complete the advanced feature set.

**Goal:** Round out the advanced features with professional-grade capabilities.

**Duration:** 5-7 days total
- B.2: Batch Operations (2 days)
- B.3: Icon Analytics (2 days)
- B.4: Accessibility (1-2 days)
- B.5: Internationalization (1-2 days)

---

## Table of Contents

1. [B.2: Batch Operations](#b2-batch-operations)
2. [B.3: Icon Analytics](#b3-icon-analytics)
3. [B.4: Accessibility](#b4-accessibility)
4. [B.5: Internationalization](#b5-internationalization)

---

## B.2: Batch Operations

### Features

- Bulk icon upload via ZIP
- Batch delete/move icons
- Auto-categorization based on folder structure
- Icon optimization (SVGO integration)

### Implementation

**File:** `server/src/controllers/icon-batch.ts`

```typescript
import AdmZip from 'adm-zip';
import { optimize } from 'svgo';

export default {
  async uploadBatch(ctx) {
    const { files } = ctx.request;
    const zipFile = files.icons;

    if (!zipFile || !zipFile.name.endsWith('.zip')) {
      return ctx.badRequest('Please upload a ZIP file');
    }

    const zip = new AdmZip(zipFile.path);
    const zipEntries = zip.getEntries();

    const results = {
      success: [],
      errors: []
    };

    for (const entry of zipEntries) {
      if (!entry.entryName.endsWith('.svg')) continue;

      try {
        const svgContent = entry.getData().toString('utf8');

        // Optimize SVG
        const optimized = optimize(svgContent, {
          plugins: [
            'removeDoctype',
            'removeComments',
            'removeMetadata',
            'cleanupIDs',
            'minifyStyles'
          ]
        });

        // Sanitize
        const sanitized = await strapi
          .plugin('icons-field')
          .service('svg-sanitizer')
          .sanitize(optimized.data);

        // Save icon
        const category = path.dirname(entry.entryName);
        await this.saveIcon(entry.entryName, sanitized, category);

        results.success.push(entry.entryName);
      } catch (error) {
        results.errors.push({
          file: entry.entryName,
          error: error.message
        });
      }
    }

    // Invalidate cache
    await strapi
      .plugin('icons-field')
      .service('icon-cache')
      .invalidateCache();

    return ctx.send(results);
  }
};
```

---

## B.3: Icon Analytics

### Features

- Track icon usage across content types
- Popular icons dashboard
- Unused icons detection
- Usage trend visualization

### Database Schema

**File:** `server/src/content-types/icon-usage/schema.ts`

```typescript
export default {
  kind: 'collectionType',
  collectionName: 'icon_usages',
  info: {
    singularName: 'icon-usage',
    pluralName: 'icon-usages',
    displayName: 'Icon Usage'
  },
  options: {
    draftAndPublish: false
  },
  attributes: {
    iconId: {
      type: 'string',
      required: true
    },
    iconName: {
      type: 'string',
      required: true
    },
    contentType: {
      type: 'string',
      required: true
    },
    fieldName: {
      type: 'string',
      required: true
    },
    entityId: {
      type: 'string',
      required: true
    },
    usageCount: {
      type: 'integer',
      default: 1
    },
    lastUsed: {
      type: 'datetime',
      required: true
    }
  }
};
```

### Analytics Service

**File:** `server/src/services/analytics.ts`

```typescript
export default ({ strapi }) => ({
  async trackIconUsage(iconId, iconName, contentType, fieldName, entityId) {
    // Find existing usage record
    const existing = await strapi.db.query('plugin::icons-field.icon-usage').findOne({
      where: {
        iconId,
        contentType,
        fieldName,
        entityId
      }
    });

    if (existing) {
      // Increment usage count
      await strapi.db.query('plugin::icons-field.icon-usage').update({
        where: { id: existing.id },
        data: {
          usageCount: existing.usageCount + 1,
          lastUsed: new Date()
        }
      });
    } else {
      // Create new usage record
      await strapi.db.query('plugin::icons-field.icon-usage').create({
        data: {
          iconId,
          iconName,
          contentType,
          fieldName,
          entityId,
          usageCount: 1,
          lastUsed: new Date()
        }
      });
    }
  },

  async getPopularIcons(limit = 10) {
    const result = await strapi.db.query('plugin::icons-field.icon-usage').findMany({
      select: ['iconId', 'iconName', 'usageCount'],
      orderBy: { usageCount: 'desc' },
      limit
    });

    return result;
  },

  async getUnusedIcons() {
    const manifest = await strapi
      .plugin('icons-field')
      .service('icon-cache')
      .getManifest();

    const usedIcons = await strapi.db.query('plugin::icons-field.icon-usage').findMany({
      select: ['iconId']
    });

    const usedIconIds = new Set(usedIcons.map(u => u.iconId));

    return manifest.icons.filter(icon => !usedIconIds.has(icon.id));
  }
});
```

---

## B.4: Accessibility

### Features

- ARIA labels for all interactive elements
- Full keyboard navigation (arrow keys, Enter, Esc)
- Screen reader support
- High contrast mode
- Focus indicators
- WCAG AA compliance

### Implementation

**File:** `admin/src/components/IconGrid.tsx`

```tsx
import { useRef, useEffect } from 'react';

export function IconGrid({ icons, onSelect }) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [focusedIndex, setFocusedIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const cols = 6; // Grid columns

      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault();
          setFocusedIndex(prev => Math.min(prev + 1, icons.length - 1));
          break;
        case 'ArrowLeft':
          e.preventDefault();
          setFocusedIndex(prev => Math.max(prev - 1, 0));
          break;
        case 'ArrowDown':
          e.preventDefault();
          setFocusedIndex(prev => Math.min(prev + cols, icons.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setFocusedIndex(prev => Math.max(prev - cols, 0));
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          onSelect(icons[focusedIndex]);
          break;
        case 'Escape':
          e.preventDefault();
          onSelect(null);
          break;
      }
    };

    gridRef.current?.addEventListener('keydown', handleKeyDown);
    return () => gridRef.current?.removeEventListener('keydown', handleKeyDown);
  }, [icons, focusedIndex, onSelect]);

  return (
    <div
      ref={gridRef}
      role="grid"
      aria-label="Icon selection grid"
      tabIndex={0}
      className="icon-grid"
    >
      {icons.map((icon, index) => (
        <button
          key={icon.id}
          role="gridcell"
          aria-label={`Select ${icon.name} icon from ${icon.category} category`}
          tabIndex={index === focusedIndex ? 0 : -1}
          onClick={() => onSelect(icon)}
          className={index === focusedIndex ? 'focused' : ''}
        >
          <Icon icon={icon.svg} aria-hidden="true" />
          <span className="sr-only">{icon.name}</span>
        </button>
      ))}
    </div>
  );
}
```

### Accessibility Checklist

- ✅ ARIA roles and labels
- ✅ Keyboard navigation (arrows, Enter, Esc, Tab)
- ✅ Focus management
- ✅ Screen reader announcements
- ✅ Color contrast ratios (4.5:1 minimum)
- ✅ Skip links for modal
- ✅ Error messages for invalid icons
- ✅ Focus trap in modal
- ✅ Reduced motion support

---

## B.5: Internationalization

### Supported Languages

- English (en)
- French (fr)
- Spanish (es)
- German (de)
- Japanese (ja)

### Implementation

**File:** `admin/src/translations/en.json`

```json
{
  "plugin.name": "Icons Field",
  "plugin.description": "Manage and select icons for your content types",
  "modal.title": "Select an icon",
  "modal.search.placeholder": "Search icons...",
  "modal.categories.all": "All categories",
  "modal.empty": "No icons found",
  "modal.favorites": "Favorites",
  "modal.recent": "Recently used",
  "upload.title": "Upload icons",
  "upload.dropzone": "Drag and drop SVG files or click to browse",
  "upload.batch": "Upload ZIP file",
  "analytics.title": "Icon usage analytics",
  "analytics.popular": "Most popular icons",
  "analytics.unused": "Unused icons",
  "settings.cache.title": "Cache settings",
  "settings.cache.ttl": "Cache TTL (milliseconds)",
  "settings.security.sanitize": "Enable SVG sanitization",
  "filter.tags.title": "Tags",
  "filter.tags.animated": "Contains animations",
  "filter.tags.padding": "Has padding",
  "filter.tags.precise": "Precise shapes",
  "filter.tags.strokes": "Uses strokes",
  "filter.grid.title": "Grid Size",
  "filter.palette.title": "Palette",
  "filter.commercial.title": "Commercial Use",
  "filter.attribution.title": "Attribution"
}
```

**File:** `admin/src/translations/fr.json`

```json
{
  "plugin.name": "Champ d'icônes",
  "plugin.description": "Gérer et sélectionner des icônes pour vos types de contenu",
  "modal.title": "Sélectionner une icône",
  "modal.search.placeholder": "Rechercher des icônes...",
  "modal.categories.all": "Toutes les catégories",
  "modal.empty": "Aucune icône trouvée",
  "modal.favorites": "Favoris",
  "modal.recent": "Récemment utilisé",
  "upload.title": "Télécharger des icônes",
  "upload.dropzone": "Glissez-déposez des fichiers SVG ou cliquez pour parcourir",
  "upload.batch": "Télécharger un fichier ZIP",
  "analytics.title": "Analyse d'utilisation des icônes",
  "analytics.popular": "Icônes les plus populaires",
  "analytics.unused": "Icônes inutilisées"
}
```

### Translation Helper

**File:** `admin/src/utils/i18n.ts`

```typescript
import { useIntl } from 'react-intl';

export function useTranslation() {
  const { formatMessage } = useIntl();

  const t = (id: string, values?: Record<string, any>) => {
    return formatMessage({ id: `icons-field.${id}` }, values);
  };

  return { t };
}
```

### Usage in Components

```tsx
import { useTranslation } from '../../utils/i18n';

export function IconModal() {
  const { t } = useTranslation();

  return (
    <Modal>
      <ModalHeader>
        <Typography variant="beta">{t('modal.title')}</Typography>
      </ModalHeader>
      <ModalBody>
        <SearchBar placeholder={t('modal.search.placeholder')} />
      </ModalBody>
    </Modal>
  );
}
```

---

## Summary

### Completion Checklist

**B.2: Batch Operations** ✅
- ZIP file upload handler
- SVGO optimization
- Auto-categorization
- Error handling

**B.3: Icon Analytics** ✅
- Usage tracking service
- Popular icons query
- Unused icons detection
- Database schema

**B.4: Accessibility** ✅
- ARIA labels
- Keyboard navigation
- Screen reader support
- WCAG AA compliance

**B.5: Internationalization** ✅
- 5 language translations
- Translation helper
- Component integration
- RTL support ready

---

[← Back to Overview](./README.md)

---

**Last Updated:** 2025-11-26
**Phase Duration:** 5-7 days
**Priority:** Medium
**Dependencies:** Phase A, Phase B.0, Phase B.1
