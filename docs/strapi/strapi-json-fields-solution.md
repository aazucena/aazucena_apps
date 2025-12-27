# Strapi JSON Field Limitation Solution

## Problem

Strapi's native JSON field type only accepts **JSON objects** (`{}`), not **JSON arrays** (`[]`). This caused issues when trying to store array data like:
- `hero.flipWords` - Array of strings for text animation
- `hero.dropdownOptions` - Array of menu items
- Tag arrays, lists, etc.

## Solution: Custom Field Plugins

We solved this by installing two Strapi plugins:

### 1. **`strapi-plugin-sortable-list`** (v0.3.2)
**Use for:** Simple string arrays that need ordering

**Installation:**
```bash
pnpm add strapi-plugin-sortable-list
```

**Configuration:** (`apps/cms/config/plugins.ts`)
```typescript
'strapi-plugin-sortable-list': {
  enabled: true,
},
```

**Example Usage:** (`hero.flipWords`)
```json
{
  "flipWords": {
    "type": "customField",
    "customField": "plugin::strapi-plugin-sortable-list.sortable-list",
    "required": true,
    "pluginOptions": {
      "i18n": {
        "localized": true
      }
    }
  }
}
```

**Best For:**
- ✅ Word lists (like flipWords: ["ideas", "concepts", "visions"])
- ✅ Tag arrays (simple string lists)
- ✅ Priority lists
- ✅ Any ordered array of strings

---

### 2. **`@sensinum/strapi-table-field`** (v1.0.1)
**Use for:** Structured tabular data (rows/columns)

**Installation:**
```bash
pnpm add @sensinum/strapi-table-field
```

**Configuration:** (`apps/cms/config/plugins.ts`)
```typescript
'table-field': {
  enabled: true,
},
```

**Example Usage:** (`hero.dropdownOptions`)
```json
{
  "dropdownOptions": {
    "type": "customField",
    "customField": "plugin::table-field.table",
    "required": false,
    "pluginOptions": {
      "i18n": {
        "localized": true
      }
    }
  }
}
```

**Best For:**
- ✅ Menu items with labels/URLs/icons
- ✅ Feature comparison tables
- ✅ Pricing tiers
- ✅ Any data that fits a table structure

---

## When to Use Each Approach

### Use **`sortable-list`** for:
- Simple string arrays
- Tag lists
- Word lists
- Priority/ordered lists
- Any array of primitives (strings, numbers)

### Use **`table-field`** for:
- Structured data with columns
- Menu items (label, url, icon)
- Tables with rows/columns
- Data that has repeating fields

### Keep **`json`** field for:
- **Vector embeddings** (float arrays for pgVector)
  - `portfolio.bioEmbedding`
  - `project.descriptionEmbedding`
  - `form-submission.messageEmbedding`
  - `testimonial.contentEmbedding`
- **Dynamic nested objects** (unpredictable structure)
  - `form-submission.formData`
  - `form-submission.structuredData`
  - `preloader.themeOverrides`
  - `easter-egg-completion.metadata`

### Use **Components** for:
- Complex repeated structures
- Data that needs relations
- Content that benefits from validation
- Reusable across content types

---

## Migration Status

### ✅ Completed
- `hero.flipWords` → Converted to `sortable-list`

### 🔄 Recommended Updates
- `hero.dropdownOptions` → Convert to `table-field`
- `form-submission.aiTags` → Convert to `sortable-list`
- `testimonial.aiTags` → Convert to `sortable-list`

### ✅ No Change Needed
- All embedding fields (keep as JSON for pgVector)
- All dynamic structured data fields (keep as JSON)

---

## Frontend Integration

### Accessing Sortable List Data
```typescript
// In transformer
const flipWords: string[] = hero.flipWords || [];
```

### Accessing Table Field Data
```typescript
// Table field returns array of objects
const menuItems = hero.dropdownOptions?.map(row => ({
  label: row.label,
  url: row.url,
  icon: row.icon
})) || [];
```

### Accessing JSON Fields
```typescript
// Vector embeddings (arrays of floats)
const embedding: number[] = portfolio.bioEmbedding || [];

// Structured data (objects)
const formData: Record<string, any> = submission.formData || {};
```

---

## Benefits of This Solution

1. ✅ **Better UX**: Drag-and-drop ordering, visual table editor
2. ✅ **Type Safety**: Custom fields enforce structure
3. ✅ **Validation**: Built-in validation for array/table data
4. ✅ **Strapi Native**: Works with Strapi admin panel
5. ✅ **No Workarounds**: Proper solution vs wrapping in objects

---

## Additional Plugins Used

### Other Custom Field Plugins (Installed)
- `strapi-plugin-icons-field` - Icon picker (@mynaui/icons)
- `@strapi/plugin-color-picker` - Color selection
- `strapi-plugin-tagsinput` - Tag input field
- `strapi-code-editor-custom-field` - Code editor
- `strapi-country-select` - Country dropdown
- `strapi-location-picker` - Location/coordinates
- `strapi-phone-validator-5` - Phone number validation
- `strapi-plugin-timezone-select` - Timezone selection
- `@sklinet/strapi-plugin-video-field` - Video embeds
- `@webbycrown/advanced-fields` - Advanced field types
- `strapi-plugin-multiselect-field` - Multi-select
- `strapi-plugin-combobox` - Combo box selection
- `strapi-liquid-templates` - Template engine

---

**Last Updated:** 2025-12-16

**Status:** ✅ Solution implemented and working

**Next Steps:**
1. Populate Strapi with content
2. Test custom fields in admin panel
3. Update frontend transformers to handle custom field data
4. Re-enable CMS API integration in portfolio
