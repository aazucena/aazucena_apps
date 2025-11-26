# Phase B.1: Icon Set Grouping & 5D Filtering (3-4 days)

[← Back to Overview](./README.md)

---

## Executive Summary

Transform icon browsing into a professional, Google Fonts-inspired experience with icon set management and sophisticated 5-dimensional filtering.

**Goal:** Organize icons by families (icon sets) and provide advanced filtering capabilities for professional icon discovery.

**Duration:** 3-4 days

---

## Table of Contents

1. [Icon Set Grouping](#icon-set-grouping)
2. [5-Dimensional Filter System](#5-dimensional-filter-system)
3. [Variant Comparison](#variant-comparison)
4. [Implementation](#implementation)
5. [UI/UX Design](#uiux-design)

---

## Icon Set Grouping

### Concept

Organize icons by icon sets (families) similar to how Google Fonts organizes font families.

### Features

- **Icon set browsing page** (primary navigation)
- **Icon set metadata display** (total icons, license, version, author)
- **Variant management** per icon set (regular, solid, sharp, outlined, rounded, duotone, light, bold)
- **Icon set comparison view**
- **Subgroup/variant navigation**
- **"Similar icons" suggestions** across sets

### Database Schema Enhancement

**File:** `server/src/content-types/icon-set/schema.ts`

```typescript
export default {
  kind: 'collectionType',
  collectionName: 'icon_sets',
  info: {
    singularName: 'icon-set',
    pluralName: 'icon-sets',
    displayName: 'Icon Set'
  },
  attributes: {
    name: {
      type: 'string',
      unique: true,
      required: true
    },
    displayName: {
      type: 'string',
      required: true
    },
    description: {
      type: 'text'
    },
    author: {
      type: 'string'
    },
    license: {
      type: 'string',
      enum: ['MIT', 'Apache-2.0', 'CC-BY-4.0', 'CC0', 'Proprietary']
    },
    licenseUrl: {
      type: 'string'
    },
    commercialUse: {
      type: 'boolean',
      default: true
    },
    attributionRequired: {
      type: 'boolean',
      default: false
    },
    totalIcons: {
      type: 'integer',
      default: 0
    },
    version: {
      type: 'string'
    },
    websiteUrl: {
      type: 'string'
    },
    variants: {
      type: 'json',
      default: ['regular']
    },
    tags: {
      type: 'json',
      default: []
    }
  }
};
```

### API Endpoints

**File:** `server/src/routes/icon-sets.ts`

```typescript
export default [
  {
    method: 'GET',
    path: '/icon-sets',
    handler: 'icon-sets.find',
    config: {
      policies: []
    }
  },
  {
    method: 'GET',
    path: '/icon-sets/:id',
    handler: 'icon-sets.findOne',
    config: {
      policies: []
    }
  },
  {
    method: 'GET',
    path: '/icon-sets/:id/icons',
    handler: 'icon-sets.getIcons',
    config: {
      policies: []
    }
  },
  {
    method: 'GET',
    path: '/icon-sets/:id/variants',
    handler: 'icon-sets.getVariants',
    config: {
      policies: []
    }
  }
];
```

### UI Component - Icon Set Browser

**File:** `admin/src/components/IconSetBrowser.tsx`

```tsx
import { useState } from 'react';
import { Badge, Card, Text, Grid } from '@strapi/design-system';

interface IconSetBrowserProps {
  onSelectSet: (setId: string) => void;
}

export function IconSetBrowser({ onSelectSet }: IconSetBrowserProps) {
  const [iconSets, setIconSets] = useState<IconSetMetadata[]>([]);
  const [filters, setFilters] = useState({
    commercialUse: null,
    attribution: null
  });

  useEffect(() => {
    fetchIconSets();
  }, [filters]);

  const fetchIconSets = async () => {
    const params = new URLSearchParams();
    if (filters.commercialUse !== null) {
      params.append('commercialUse', filters.commercialUse.toString());
    }
    if (filters.attribution !== null) {
      params.append('attributionRequired', filters.attribution.toString());
    }

    const response = await fetch(`/api/icons-field/icon-sets?${params}`);
    const data = await response.json();
    setIconSets(data);
  };

  return (
    <div className="icon-set-browser">
      <FilterPanel filters={filters} onChange={setFilters} />

      <Grid gap={4}>
        {iconSets.map(set => (
          <Card
            key={set.id}
            onClick={() => onSelectSet(set.id)}
            className="icon-set-card"
          >
            <div className="icon-set-header">
              <Text variant="beta">{set.displayName}</Text>
              <Badge>{set.totalIcons} icons</Badge>
            </div>

            <Text variant="pi" className="icon-set-description">
              {set.description}
            </Text>

            <div className="icon-set-metadata">
              <Badge variant="secondary">{set.license}</Badge>
              <Badge variant={set.commercialUse ? 'success' : 'danger'}>
                {set.commercialUse ? 'Commercial Use ✓' : 'Non-Commercial'}
              </Badge>
              {set.attributionRequired && (
                <Badge variant="warning">Attribution Required</Badge>
              )}
            </div>

            <div className="icon-set-variants">
              {set.variants.map(variant => (
                <Badge key={variant} variant="neutral">{variant}</Badge>
              ))}
            </div>

            <Text variant="sigma" className="icon-set-author">
              by {set.author} • v{set.version}
            </Text>
          </Card>
        ))}
      </Grid>
    </div>
  );
}
```

---

## 5-Dimensional Filter System

### Filter Categories

#### A. Tags Filter (Icon Properties)
- Contains animations (animated SVGs)
- Has padding (icons with built-in padding)
- Precise shapes (geometric precision)
- Uses strokes (stroke-based vs fill-based)

#### B. Grid Filter (Optimized Sizes)
- Find icons designed to look sharp at specific pixel heights
- Options: 16px, 24px, 32px, 48px, 64px, Any
- Similar to how some icons are optimized for specific grid sizes

#### C. Palette Filter (Color Type)
- All (show all palette types)
- Multiple Colors (multi-color icons)
- Monotone (single color icons)

#### D. Commercial Use Filter
- All (show all licenses)
- Allowed (commercially usable)
- Not allowed (non-commercial only)

#### E. Attribution Filter
- All
- Required (must provide attribution)
- Optional (attribution not required)

### Implementation

**File:** `admin/src/hooks/useIconSearch.ts`

```typescript
import Fuse from 'fuse.js';
import { useMemo, useState, useEffect } from 'react';
import type { IconMetadata } from '../../../shared/src/schemas/icon.schema';

interface FilterState {
  query: string;
  selectedCategories: string[];
  showFavoritesOnly: boolean;
  // 5-dimensional filter system
  tags: {
    animated: boolean;
    hasPadding: boolean;
    preciseShapes: boolean;
    usesStrokes: boolean;
  };
  gridSize: number | null; // 16, 24, 32, 48, 64, or null for "Any"
  paletteType: 'all' | 'monotone' | 'multicolor';
  commercialUse: 'all' | 'allowed' | 'notAllowed';
  attribution: 'all' | 'required' | 'optional';
}

export function useIconSearch(icons: IconMetadata[]) {
  const [filters, setFilters] = useState<FilterState>(() => {
    // Load saved filters from localStorage
    const saved = localStorage.getItem('icon-filter-preferences');
    return saved ? JSON.parse(saved) : {
      query: '',
      selectedCategories: [],
      showFavoritesOnly: false,
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
    };
  });

  // Persist filter preferences
  useEffect(() => {
    localStorage.setItem('icon-filter-preferences', JSON.stringify(filters));
  }, [filters]);

  const fuse = useMemo(() => {
    return new Fuse(icons, {
      keys: ['name', 'category', 'iconSetName'],
      threshold: 0.4,
      includeScore: true
    });
  }, [icons]);

  const filteredIcons = useMemo(() => {
    let results = icons;

    // 1. Fuzzy search
    if (filters.query) {
      results = fuse.search(filters.query).map(result => result.item);
    }

    // 2. Category filter
    if (filters.selectedCategories.length > 0) {
      results = results.filter(icon =>
        filters.selectedCategories.includes(icon.category)
      );
    }

    // 3. Tags filter (icon properties)
    if (filters.tags.animated) {
      results = results.filter(icon => icon.isAnimated === true);
    }
    if (filters.tags.hasPadding) {
      results = results.filter(icon => icon.hasPadding === true);
    }
    if (filters.tags.preciseShapes) {
      results = results.filter(icon => icon.isPreciseShape === true);
    }
    if (filters.tags.usesStrokes) {
      results = results.filter(icon => icon.usesStrokes === true);
    }

    // 4. Grid size filter (optimized sizes)
    if (filters.gridSize !== null) {
      results = results.filter(icon =>
        icon.optimizedSizes?.includes(filters.gridSize!)
      );
    }

    // 5. Palette type filter
    if (filters.paletteType !== 'all') {
      results = results.filter(icon =>
        icon.paletteType === filters.paletteType
      );
    }

    // 6. Commercial use filter
    if (filters.commercialUse === 'allowed') {
      results = results.filter(icon => icon.commercialUse === true);
    } else if (filters.commercialUse === 'notAllowed') {
      results = results.filter(icon => icon.commercialUse === false);
    }

    // 7. Attribution filter
    if (filters.attribution === 'required') {
      results = results.filter(icon => icon.attributionRequired === true);
    } else if (filters.attribution === 'optional') {
      results = results.filter(icon => icon.attributionRequired === false);
    }

    // 8. Favorites filter
    if (filters.showFavoritesOnly) {
      const favorites = JSON.parse(
        localStorage.getItem('icon-favorites') || '[]'
      );
      results = results.filter(icon => favorites.includes(icon.id));
    }

    return results;
  }, [icons, filters, fuse]);

  // Helper functions
  const updateFilter = <K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleTagFilter = (tag: keyof FilterState['tags']) => {
    setFilters(prev => ({
      ...prev,
      tags: {
        ...prev.tags,
        [tag]: !prev.tags[tag]
      }
    }));
  };

  const resetFilters = () => {
    setFilters({
      query: '',
      selectedCategories: [],
      showFavoritesOnly: false,
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
    });
  };

  return {
    filters,
    updateFilter,
    toggleTagFilter,
    resetFilters,
    filteredIcons,
    // Count active filters
    activeFilterCount: Object.values(filters.tags).filter(Boolean).length +
      (filters.gridSize !== null ? 1 : 0) +
      (filters.paletteType !== 'all' ? 1 : 0) +
      (filters.commercialUse !== 'all' ? 1 : 0) +
      (filters.attribution !== 'all' ? 1 : 0) +
      filters.selectedCategories.length
  };
}
```

### Filter Panel UI Component

**File:** `admin/src/components/FilterPanel.tsx`

```tsx
import { useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  SingleSelect,
  SingleSelectOption,
  Badge,
  Flex
} from '@strapi/design-system';

interface FilterPanelProps {
  filters: FilterState;
  onUpdateFilter: (key: string, value: any) => void;
  onToggleTag: (tag: string) => void;
  onReset: () => void;
  activeFilterCount: number;
}

export function FilterPanel({
  filters,
  onUpdateFilter,
  onToggleTag,
  onReset,
  activeFilterCount
}: FilterPanelProps) {
  return (
    <Box padding={4} background="neutral100" className="filter-panel">
      <Flex justifyContent="space-between" marginBottom={3}>
        <Text variant="sigma">Filters</Text>
        {activeFilterCount > 0 && (
          <Flex gap={2}>
            <Badge>{activeFilterCount} active</Badge>
            <Button size="S" variant="tertiary" onClick={onReset}>
              Reset All
            </Button>
          </Flex>
        )}
      </Flex>

      {/* Tags Filter */}
      <Box marginBottom={4}>
        <Text variant="pi" fontWeight="bold" marginBottom={2}>
          Tags (Icon Properties)
        </Text>
        <Flex direction="column" gap={2}>
          <Checkbox
            checked={filters.tags.animated}
            onChange={() => onToggleTag('animated')}
          >
            Contains animations
          </Checkbox>
          <Checkbox
            checked={filters.tags.hasPadding}
            onChange={() => onToggleTag('hasPadding')}
          >
            Has padding
          </Checkbox>
          <Checkbox
            checked={filters.tags.preciseShapes}
            onChange={() => onToggleTag('preciseShapes')}
          >
            Precise shapes (geometric)
          </Checkbox>
          <Checkbox
            checked={filters.tags.usesStrokes}
            onChange={() => onToggleTag('usesStrokes')}
          >
            Uses strokes
          </Checkbox>
        </Flex>
      </Box>

      {/* Grid Size Filter */}
      <Box marginBottom={4}>
        <Text variant="pi" fontWeight="bold" marginBottom={2}>
          Grid Size (Optimized For)
        </Text>
        <SingleSelect
          value={filters.gridSize?.toString() || 'any'}
          onChange={(value) =>
            onUpdateFilter('gridSize', value === 'any' ? null : parseInt(value))
          }
        >
          <SingleSelectOption value="any">Any</SingleSelectOption>
          <SingleSelectOption value="16">16px</SingleSelectOption>
          <SingleSelectOption value="24">24px</SingleSelectOption>
          <SingleSelectOption value="32">32px</SingleSelectOption>
          <SingleSelectOption value="48">48px</SingleSelectOption>
          <SingleSelectOption value="64">64px</SingleSelectOption>
        </SingleSelect>
      </Box>

      {/* Palette Type Filter */}
      <Box marginBottom={4}>
        <Text variant="pi" fontWeight="bold" marginBottom={2}>
          Palette
        </Text>
        <SingleSelect
          value={filters.paletteType}
          onChange={(value) => onUpdateFilter('paletteType', value)}
        >
          <SingleSelectOption value="all">All</SingleSelectOption>
          <SingleSelectOption value="monotone">Monotone</SingleSelectOption>
          <SingleSelectOption value="multicolor">Multiple Colors</SingleSelectOption>
        </SingleSelect>
      </Box>

      {/* Commercial Use Filter */}
      <Box marginBottom={4}>
        <Text variant="pi" fontWeight="bold" marginBottom={2}>
          Commercial Use
        </Text>
        <SingleSelect
          value={filters.commercialUse}
          onChange={(value) => onUpdateFilter('commercialUse', value)}
        >
          <SingleSelectOption value="all">All</SingleSelectOption>
          <SingleSelectOption value="allowed">Allowed</SingleSelectOption>
          <SingleSelectOption value="notAllowed">Not Allowed</SingleSelectOption>
        </SingleSelect>
      </Box>

      {/* Attribution Filter */}
      <Box marginBottom={4}>
        <Text variant="pi" fontWeight="bold" marginBottom={2}>
          Attribution
        </Text>
        <SingleSelect
          value={filters.attribution}
          onChange={(value) => onUpdateFilter('attribution', value)}
        >
          <SingleSelectOption value="all">All</SingleSelectOption>
          <SingleSelectOption value="required">Required</SingleSelectOption>
          <SingleSelectOption value="optional">Optional</SingleSelectOption>
        </SingleSelect>
      </Box>
    </Box>
  );
}
```

---

## Variant Comparison

### Features

- Side-by-side variant comparison
- Visual property indicators (badges for animated, stroke-based, etc.)
- Grid size preview (show icon at 16px, 24px, 32px, 48px simultaneously)
- Similar icons suggestions
- Icon details panel with full metadata

### UI Component

**File:** `admin/src/components/VariantComparison.tsx`

```tsx
import { useState, useEffect } from 'react';
import { Box, Grid, Badge, Flex, Text } from '@strapi/design-system';

interface VariantComparisonProps {
  iconName: string;
  iconSetId: string;
}

export function VariantComparison({ iconName, iconSetId }: VariantComparisonProps) {
  const [variants, setVariants] = useState<IconMetadata[]>([]);
  const [selectedSizes, setSelectedSizes] = useState([16, 24, 32, 48]);

  useEffect(() => {
    fetchVariants();
  }, [iconName, iconSetId]);

  const fetchVariants = async () => {
    const response = await fetch(
      `/api/icons-field/icon-sets/${iconSetId}/icons?name=${iconName}`
    );
    const data = await response.json();
    setVariants(data);
  };

  return (
    <Box padding={4}>
      <Text variant="beta" marginBottom={4}>
        Compare Variants: {iconName}
      </Text>

      <Grid gap={4} gridCols={variants.length}>
        {variants.map(variant => (
          <Card key={variant.id} padding={3}>
            <Text variant="sigma" marginBottom={2}>
              {variant.variant}
            </Text>

            {/* Icon Property Badges */}
            <Flex gap={1} wrap="wrap" marginBottom={3}>
              {variant.isAnimated && (
                <Badge variant="success">Animated</Badge>
              )}
              {variant.usesStrokes && (
                <Badge variant="secondary">Strokes</Badge>
              )}
              {variant.isPreciseShape && (
                <Badge variant="primary">Precise</Badge>
              )}
              {variant.hasPadding && (
                <Badge variant="warning">Padding</Badge>
              )}
              {variant.paletteType === 'multicolor' && (
                <Badge variant="alternative">Multicolor</Badge>
              )}
            </Flex>

            {/* Size Previews */}
            <Flex direction="column" gap={2}>
              {selectedSizes.map(size => (
                <Flex key={size} alignItems="center" gap={2}>
                  <Text variant="pi" width="40px">{size}px</Text>
                  <Box
                    style={{
                      width: `${size}px`,
                      height: `${size}px`,
                      border: '1px solid #ddd',
                      padding: '2px'
                    }}
                    dangerouslySetInnerHTML={{ __html: variant.svg }}
                  />
                  {variant.optimizedSizes?.includes(size) && (
                    <Badge variant="success" size="S">✓ Optimized</Badge>
                  )}
                </Flex>
              ))}
            </Flex>

            {/* License Info */}
            <Box marginTop={3} paddingTop={3} borderTop="1px solid #eee">
              <Flex gap={1} direction="column">
                <Flex gap={1} alignItems="center">
                  <Text variant="pi" fontWeight="bold">Commercial:</Text>
                  <Text variant="pi">
                    {variant.commercialUse ? '✓ Allowed' : '✗ Not Allowed'}
                  </Text>
                </Flex>
                <Flex gap={1} alignItems="center">
                  <Text variant="pi" fontWeight="bold">Attribution:</Text>
                  <Text variant="pi">
                    {variant.attributionRequired ? 'Required' : 'Optional'}
                  </Text>
                </Flex>
              </Flex>
            </Box>
          </Card>
        ))}
      </Grid>
    </Box>
  );
}
```

---

## UI/UX Design

### Icon Set Browser Page

```
┌─────────────────────────────────────────────────────────┐
│ Select Icon Set                    [Search...]   [×]    │
├─────────────────────────────────────────────────────────┤
│ Filters: [ Commercial Use ▼ ] [ Attribution ▼ ]        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ MynaUI Icons │  │ Heroicons    │  │ Lucide       │  │
│  │ 1,247 icons  │  │ 896 icons    │  │ 1,582 icons  │  │
│  │              │  │              │  │              │  │
│  │ MIT License  │  │ MIT License  │  │ ISC License  │  │
│  │ ✓ Commercial │  │ ✓ Commercial │  │ ✓ Commercial │  │
│  │              │  │              │  │              │  │
│  │ [regular]    │  │ [solid]      │  │ [regular]    │  │
│  │ [solid]      │  │ [outline]    │  │ [filled]     │  │
│  │              │  │              │  │              │  │
│  │ by Author    │  │ by Tailwind  │  │ by Lucide    │  │
│  │ v2.1.0       │  │ v2.0.0       │  │ v0.294.0     │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Icon Grid with 5D Filters

```
┌─────────────────────────────────────────────────────────────┐
│ MynaUI Icons (1,247 icons)          [Search...]    [×]     │
├───────────────┬─────────────────────────────────────────────┤
│ FILTERS (5)   │ Showing 143 icons                           │
│ [Reset All]   │                                             │
│               │  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐        │
│ Tags          │  │🏠  │ │⚙️  │ │🔍  │ │❤️  │ │🌙  │        │
│ ☑ Animated    │  │home│ │cog │ │zoom│ │like│ │moon│        │
│ ☐ Padding     │  │ 📌 │ │ ⚡ │ │ 📌 │ │    │ │ ⚡ │        │
│ ☑ Precise     │  └────┘ └────┘ └────┘ └────┘ └────┘        │
│ ☐ Strokes     │                                             │
│               │  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐        │
│ Grid Size     │  │📧  │ │🔔  │ │📅  │ │👤  │ │⭐  │        │
│ ( ) Any       │  │mail│ │bell│ │cal │ │user│ │star│        │
│ (•) 24px      │  │ 📌 │ │    │ │ 📌 │ │ ⚡ │ │ 📌 │        │
│ ( ) 32px      │  └────┘ └────┘ └────┘ └────┘ └────┘        │
│               │                                             │
│ Palette       │  Legend: 📌 = Optimized  ⚡ = Animated      │
│ ( ) All       │         🎨 = Multicolor  ⚪ = Monotone      │
│ (•) Monotone  │                                             │
│ ( ) Multi     │  [Load More...]                             │
│               │                                             │
│ Commercial    │                                             │
│ (•) Allowed   │                                             │
│               │                                             │
│ Attribution   │                                             │
│ (•) Optional  │                                             │
└───────────────┴─────────────────────────────────────────────┘
```

---

[← Back to Overview](./README.md)

---

**Last Updated:** 2025-11-26
**Phase Duration:** 3-4 days
**Priority:** High
**Dependencies:** Phase A, Phase B.0
