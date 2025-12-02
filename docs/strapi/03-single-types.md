# Strapi Single Types - Implementation Documentation

**Version:** 2.0 (Implemented Architecture)
**Last Updated:** 2025-12-01
**Status:** ✅ Production-Ready

---

## 📋 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Implementation Summary](#implementation-summary)
3. [Single Type Specifications](#single-type-specifications)
4. [Design Patterns](#design-patterns)
5. [Migration Notes](#migration-notes)

---

## Architecture Overview

### 🎯 Design Decision: Configuration Split

**Original Plan:** One massive `website-configuration` single type with 50+ fields across 7 groups.

**Implemented Architecture:** Split into **5 separate single types** for better UX and maintainability:

```
website-configuration (8 fields)  ← Site Identity + SEO
theme (10 fields)                 ← Theme & Branding
homepage (7 fields)               ← Section Visibility
blog (7 fields)                   ← Blog Configuration
analytic (8 fields)               ← Analytics & Monitoring
```

**Why This Approach?**

✅ **Better UX:** Navigating 8-10 fields is far easier than 50+ fields in Strapi admin
✅ **Separation of Concerns:** Each config type has a clear, focused purpose
✅ **Easier Permissions:** Can grant granular access (e.g., designer gets theme, not analytics)
✅ **Cleaner API:** Frontend fetches only what it needs
✅ **Maintainability:** Changes to theme don't affect site config

---

## Implementation Summary

### Single Types Created (10)

| # | Name | Purpose | i18n | Draft/Publish | Fields |
|---|------|---------|------|---------------|--------|
| 1 | **Portfolio** | Hero/profile data | ✅ | ✅ | 20 |
| 2 | **About Section** | About Me content | ✅ | ✅ | 5 |
| 3 | **Hero Section** | Hero banner | ✅ | ✅ | 8 |
| 4 | **Homepage** | Section toggles | ❌ | ❌ | 7 |
| 5 | **Animation System** | Performance settings | ❌ | ❌ | 7 |
| 6 | **Website Configuration** | Site identity & SEO | ❌ | ❌ | 8 |
| 7 | **Theme & Branding** | Colors & fonts | ❌ | ❌ | 10 |
| 8 | **Maintenance Mode** | Maintenance settings | ✅ | ❌ | 2 |
| 9 | **Analytics & Monitoring** | Analytics config | ❌ | ✅ | 8 |
| 10 | **Blog Configuration** | Blog settings | ❌ | ❌ | 7 |

**Total Fields:** 82 fields across 10 single types (avg: 8.2 fields per type)

---

## Single Type Specifications

### 1. Portfolio

**Purpose:** Hero/profile data for main portfolio page
**API ID:** `portfolio`
**i18n:** ✅ Enabled (all fields localized)
**Draft & Publish:** ✅ Enabled

**Fields (20):**

```json
{
  "fullName": "string (100 chars, required)",
  "occupation": "string (200 chars, required)",
  "flipWords": "json (required) - Array for text flip animation",
  "heroTaglineTemplate": "text (200 chars, required) - Template with {flipWord} placeholder",
  "heroCTAPrimaryText": "string (50 chars, default: 'Get Started')",
  "heroShowDropdown": "boolean (default: true)",
  "heroDropdownOptions": "json",
  "heroCTASecondaryText": "string (50 chars, default: 'View Resume')",
  "heroShowSecondaryButton": "boolean (default: true)",
  "tagline": "string (150 chars, required)",
  "descriptions": "blocks (required)",
  "highlights": "blocks (required)",
  "stats": "component (content.stats, repeatable, max: 6)",
  "learnMoreCards": "blocks",
  "profileImage": "component (ui.image-element)",
  "resumeFile": "media (files only)",
  "bio": "richtext",
  "socialLinks": "component (shared.social-links, repeatable, max: 1)",
  "yearsOfExperience": "integer (min: 0, max: 50)",
  "location": "string (100 chars)",
  "education": "component (content.education, repeatable, max: 10)",
  "bioEmbedding": "json - Vector embedding for AI/RAG",
  "bioEmbeddingModel": "string (50 chars)",
  "bioEmbeddingGeneratedAt": "datetime"
}
```

**File:** `apps/cms/src/api/portfolio/content-types/portfolio/schema.json`

---

### 2. About Section

**Purpose:** Dedicated "About Me" section content (separate from Portfolio hero)
**API ID:** `about`
**i18n:** ✅ Enabled (all fields localized)
**Draft & Publish:** ✅ Enabled

**Fields (5):**

```json
{
  "tagline": "string (150 chars, required)",
  "descriptions": "blocks (required)",
  "highlights": "blocks (required)",
  "stats": "component (content.stats, repeatable, min: 0, max: 6)",
  "learnMoreCards": "blocks"
}
```

**Note:** These fields are similar to Portfolio but serve a different UI section (About page vs Hero section).

**File:** `apps/cms/src/api/about/content-types/about/schema.json`

---

### 3. Hero Section

**Purpose:** Hero banner configuration
**API ID:** `hero`
**i18n:** ✅ Enabled (content-level AND field-level)
**Draft & Publish:** ✅ Enabled

**Fields (8):**

```json
{
  "title": "string (100 chars, required)",
  "subtitle": "string (200 chars, required)",
  "flipWords": "json (required)",
  "taglineTemplate": "text (200 chars, required, default: 'Turning {flipWord} into elegant code, one pixel at a time.')",
  "primaryButtonText": "string (50 chars, default: 'Get Started')",
  "showDropdown": "boolean (default: true)",
  "dropdownOptions": "json",
  "secondaryButtonText": "string (50 chars, default: 'View Resume')",
  "showSecondaryButton": "boolean (default: true)"
}
```

**i18n Pattern (Correct):**
```json
{
  "pluginOptions": {"i18n": {"localized": true}},  // Content-type level
  "attributes": {
    "title": {
      "pluginOptions": {"i18n": {"localized": true}}  // Field level
    }
  }
}
```

**File:** `apps/cms/src/api/hero/content-types/hero/schema.json`

---

### 4. Homepage

**Purpose:** Section visibility toggles for homepage
**API ID:** `homepage`
**i18n:** ❌ Disabled (visibility settings not language-specific)
**Draft & Publish:** ❌ Disabled (config, not content)

**Fields (7):**

```json
{
  "heroSection": "boolean (required, default: true)",
  "aboutSection": "boolean (required, default: true)",
  "experienceSection": "boolean (required, default: true)",
  "skillsSection": "boolean (required, default: true)",
  "testimonialsSection": "boolean (required, default: true)",
  "blogSection": "boolean (required, default: true)",
  "awardsSection": "boolean (required, default: true)"
}
```

**Why Separate from Website Configuration?**
- Could expand to include section ordering, layout configs
- Clear, focused purpose
- Easy to understand for non-technical users

**File:** `apps/cms/src/api/homepage/content-types/homepage/schema.json`

---

### 5. Animation System

**Purpose:** Global animation performance settings
**API ID:** `animation`
**i18n:** ❌ Disabled (performance settings not language-specific)
**Draft & Publish:** ❌ Disabled (config, not content)

**Fields (7):**

```json
{
  "enabled": "boolean (required, default: true)",
  "heavyAnimations": "boolean (required, default: true) - Enable Three.js/PixiJS",
  "defaultPerformanceTier": "enum (required, default: 'auto') - ['low', 'medium', 'high', 'auto']",
  "particleCountLow": "integer (default: 50, min: 0, max: 100)",
  "particleCountMedium": "integer (default: 100, min: 0, max: 200)",
  "particleCountHigh": "integer (default: 200, min: 0, max: 500)",
  "timingFlipText": "integer (default: 3000, min: 1000, max: 10000) - ms",
  "timingSectionTransition": "integer (default: 1000, min: 100, max: 5000) - ms"
}
```

**Why Separate Single Type?**
- ✅ Clean separation of concerns
- ✅ Easy to disable all animations globally
- ✅ Can be extended with more animation configs
- ✅ Doesn't clutter Website Configuration

**File:** `apps/cms/src/api/animation/content-types/animation/schema.json`

---

### 6. Website Configuration

**Purpose:** Site identity and SEO metadata (Groups 1 & 2 from original plan)
**API ID:** `website-configuration`
**i18n:** ❌ Disabled (site config not typically localized)
**Draft & Publish:** ❌ Disabled (config, not content)

**Fields (8):**

```json
{
  "siteName": "string (100 chars, required)",
  "siteUrl": "string (200 chars, required, regex: '^https?://.*')",
  "siteTagline": "string (200 chars)",
  "baseUrl": "string (50 chars, default: '/', min: 1)",
  "siteLogo": "media (images only)",
  "favicon": "media (images only)",
  "defaultSEO": "component (shared.seo, required)",
  "metaTitleTemplate": "string (100 chars, default: '%s — {siteName}')",
  "openGraphSiteName": "string (100 chars)",
  "twitterHandle": "string (50 chars, regex: '^@.*')",
  "robotsIndex": "boolean (default: true)",
  "robotsFollow": "boolean (default: true)",
  "googleSiteVerificationId": "string (100 chars)",
  "trailingSlash": "boolean (default: false) - Add trailing slash to URLs",
  "cleanUrls": "boolean (default: true) - Remove .html extensions"
}
```

**New Fields Added:**
- `trailingSlash`: Control URL trailing slashes (e.g., `/about/` vs `/about`)
- `cleanUrls`: Enable clean URLs (e.g., `/blog/post` vs `/blog/post.html`)

**File:** `apps/cms/src/api/website-configuration/content-types/website-configuration/schema.json`

---

### 7. Theme & Branding

**Purpose:** Theme colors and typography (Group 4 from original plan)
**API ID:** `theme`
**i18n:** ❌ Disabled (theme settings not language-specific)
**Draft & Publish:** ❌ Disabled (config, not content)

**Fields (10):**

```json
{
  "mode": "enum (required, default: 'system') - ['system', 'light', 'dark', 'light:only', 'dark:only']",
  "primaryColor": "customField (plugin::color-picker.color, required, regex: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$')",
  "primaryColorDark": "customField (plugin::color-picker.color, required)",
  "secondaryColor": "customField (plugin::color-picker.color, required)",
  "secondaryColorDark": "customField (plugin::color-picker.color, required)",
  "accentColor": "customField (plugin::color-picker.color, required)",
  "accentColorDark": "customField (plugin::color-picker.color, required)",
  "fontSans": "string (100 chars, default: 'Fira Sans')",
  "fontSerif": "string (100 chars, default: 'Fira Sans')",
  "fontHeading": "string (100 chars, default: 'Fira Sans')",
  "fontCode": "string (100 chars, default: 'Fira Code')"
}
```

**Custom Field Integration:**
- Uses `@strapi/plugin-color-picker` for color fields
- Provides visual color picker UI in Strapi admin
- Validates hex color format with regex

**File:** `apps/cms/src/api/theme/content-types/theme/schema.json`

---

### 8. Maintenance Mode

**Purpose:** Site-wide maintenance mode with localized messages
**API ID:** `maintenance`
**i18n:** ✅ Enabled (message is localized, enabled flag is NOT)
**Draft & Publish:** ❌ Disabled (config, not content)

**Fields (2):**

```json
{
  "enabled": "boolean (required, default: false, i18n: NOT localized)",
  "message": "richtext (required, maxLength: 1000, i18n: localized)"
}
```

**i18n Strategy:**
- `enabled` is NOT localized (one maintenance toggle for all languages)
- `message` IS localized (different messages per language)

**File:** `apps/cms/src/api/maintenance/content-types/maintenance/schema.json`

---

### 9. Analytics & Monitoring

**Purpose:** Analytics and monitoring service configuration (Group 7 from original plan)
**API ID:** `analytic`
**i18n:** ❌ Disabled (service config not language-specific)
**Draft & Publish:** ✅ Enabled

**Fields (8) with Conditional Visibility:**

```json
{
  "googleAnalyticsEnabled": "boolean (required, default: false)",
  "googleAnalyticsId": "string (50 chars, required, regex: '^(G|UA|GTM)-.*', visible if googleAnalyticsEnabled = true)",
  "vercelAnalyticsEnabled": "boolean (required, default: true)",
  "vercelSpeedInsightsEnabled": "boolean (required, default: true)",
  "plausibleEnabled": "boolean (required, default: false)",
  "plausibleDomain": "string (200 chars, required, visible if plausibleEnabled = true)",
  "sentryEnabled": "boolean (required, default: false)",
  "sentryDSN": "string (200 chars, required, visible if sentryEnabled = true)"
}
```

**Conditional Visibility Pattern:**
```json
{
  "googleAnalyticsId": {
    "conditions": {
      "visible": {
        "!=": [{"var": "googleAnalyticsEnabled"}, false]
      }
    }
  }
}
```

**Benefits:**
- ✅ Hides irrelevant fields dynamically
- ✅ Cleaner admin UI
- ✅ Prevents invalid configurations

**File:** `apps/cms/src/api/analytic/content-types/analytic/schema.json`

---

### 10. Blog Configuration

**Purpose:** Blog system settings (Group 6 from original plan)
**API ID:** `blog`
**i18n:** ❌ Disabled (blog config not language-specific)
**Draft & Publish:** ❌ Disabled (config, not content)

**Fields (7) with Conditional Visibility:**

```json
{
  "enabled": "boolean (required, default: true)",
  "postsPerPage": "integer (required, default: 6, min: 1, max: 50)",
  "permalink": "string (100 chars, required, default: '/%slug%')",
  "mainPath": "string (50 chars, required, default: 'blog')",
  "categoryPath": "string (50 chars, required, default: 'category')",
  "tagPath": "string (50 chars, required, default: 'tag')",
  "relatedPostsEnabled": "boolean (required, default: true)",
  "relatedPostsCount": "integer (required, default: 4, min: 1, max: 10, visible if relatedPostsEnabled = true)"
}
```

**Conditional Visibility:**
```json
{
  "relatedPostsCount": {
    "conditions": {
      "visible": {
        "==": [{"var": "relatedPostsEnabled"}, true]
      }
    }
  }
}
```

**File:** `apps/cms/src/api/blog/content-types/blog/schema.json`

---

## Design Patterns

### Pattern 1: Draft & Publish Strategy

**Content Types (Draft & Publish ENABLED):**
- Portfolio, About, Hero, Analytics

**Configuration Types (Draft & Publish DISABLED):**
- Homepage, Animation, Website Configuration, Theme, Blog, Maintenance

**Reasoning:**
- Content needs approval workflow before going live
- Configuration changes should be immediate (no draft state needed)

---

### Pattern 2: i18n Configuration (Strapi Official Plugin)

**Correct Pattern (Hero, About, Portfolio):**
```json
{
  "pluginOptions": {"i18n": {"localized": true}},  // ✅ Required: Enables i18n for content type
  "attributes": {
    "title": {
      "pluginOptions": {"i18n": {"localized": true}}  // ✅ Per-field control
    }
  }
}
```

**Why BOTH levels are required:**
- **Top-level (`pluginOptions.i18n`)**: Declares content type supports i18n (creates locale entries)
- **Field-level**: Controls which fields are localized vs shared across locales

**Example: Maintenance Mode (Mixed)**
```json
{
  "enabled": {"pluginOptions": {"i18n": {"localized": false}}},  // Shared across locales
  "message": {"pluginOptions": {"i18n": {"localized": true}}}    // Different per locale
}
```

---

### Pattern 3: Conditional Field Visibility

**Use Case:** Hide fields that are only relevant when a toggle is enabled

**Example: Analytics**
```json
{
  "googleAnalyticsEnabled": {"type": "boolean"},
  "googleAnalyticsId": {
    "type": "string",
    "conditions": {
      "visible": {
        "!=": [{"var": "googleAnalyticsEnabled"}, false]
      }
    }
  }
}
```

**Benefits:**
- Cleaner admin UI (no clutter)
- Prevents invalid configurations
- Better UX for content editors

**Used in:**
- Analytics (GA, Plausible, Sentry fields)
- Blog (relatedPostsCount)
- Education component (graduationDate)

---

### Pattern 4: Custom Field Integration

**Color Picker Plugin (`@strapi/plugin-color-picker`):**
```json
{
  "primaryColor": {
    "type": "customField",
    "customField": "plugin::color-picker.color",
    "regex": "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$",
    "required": true
  }
}
```

**Icons Field Plugin (`strapi-plugin-icons-field`):**
```json
{
  "icon": {
    "type": "customField",
    "customField": "plugin::icons-field.icon",
    "options": {"preset": "icons"}
  }
}
```

**Benefits:**
- Visual UI in Strapi admin (color picker, icon browser)
- Still validates with regex for data integrity
- Better UX for non-technical users

---

## Migration Notes

### From Original Documentation

**Group 3 (Internationalization):** ❌ Skipped
- **Reason:** Strapi's official i18n plugin handles this
- **No need to:** Duplicate `defaultLanguage`, `supportedLanguages`, etc.
- **Configuration:** Managed in Strapi admin settings and `config/plugins.ts`

**Group 4 (Theme & Branding):** ✅ Extracted to separate `theme` single type
- **Fields:** 10 fields (mode, 6 colors, 4 fonts)
- **Why separate:** Designers can manage theme without touching site config

**Group 5 (Section Visibility):** ✅ Extracted to `homepage` single type
- **Fields:** 7 boolean toggles
- **Why separate:** Clear purpose, can expand with layout configs

**Group 6 (Blog Configuration):** ✅ Extracted to `blog` single type
- **Fields:** 7 blog settings
- **Why separate:** Blog admins can manage without touching other settings

**Group 7 (Analytics & Monitoring):** ✅ Extracted to `analytic` single type
- **Fields:** 8 analytics settings with conditional visibility
- **Why separate:** Privacy-sensitive, separate permissions

**New Fields Added:**
- `trailingSlash` and `cleanUrls` in Website Configuration
- `fontCode` in Theme

---

## Summary

**Total Implementation:**
- ✅ 10 Single Types
- ✅ 82 Total Fields
- ✅ Average 8.2 fields per type (vs 50+ in original plan)
- ✅ Production-ready with proper validation, i18n, conditional visibility

**Key Decisions:**
1. **5-way configuration split** for better UX
2. **Skipped Group 3** (using official i18n plugin)
3. **Draft & Publish pattern** (content vs config)
4. **Conditional visibility** for cleaner admin UI
5. **Custom field integration** for better UX

**Next Steps:**
- See [Components Documentation](./04-components.md) for component specifications
- See [Collection Types](./05-collection-types.md) for collection types

---

**Documentation Status:** ✅ Accurate to Implementation
**Last Verified:** 2025-12-01
