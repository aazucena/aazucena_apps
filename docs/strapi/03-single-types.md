# Single Types

**[← Back to Components](./02-components.md)** | **[Next: Core Collection Types →](./04-collection-types-core.md)**

---

## Overview

Create these 3 Single Types after creating all reusable components. Single Types represent unique pages/settings (only one instance exists).

**Creation Location:** `Content-Type Builder > Create new single type`

---

## Single Type 1: Hero Banner

**Display Name:** `Hero Banner`
**API ID (Singular):** `hero-banner`
**API ID (Plural):** `hero-banners` (Collection Name)

**Status:** ✅ **IMPLEMENTED**

### Advanced Settings

- **Draft & Publish:** ✅ Enabled
- **Internationalization (i18n):** ✅ Enabled (for future language support)

### Fields

| Field Name | Type | Settings |
|------------|------|----------|
| `heading` | Text (Short text) | **Max length:** 150, **Required:** true, **Placeholder:** "Main hero headline" |
| `subheading` | Text (Short text) | **Max length:** 200, **Required:** false, **Placeholder:** "Supporting text" |
| `description` | Text (Long text) | **Max length:** 500, **Required:** false |
| `overlayOpacity` | Number (Integer) | **Min:** 0, **Max:** 100, **Required:** false, **Default:** 50, **Placeholder:** "Background overlay opacity (0-100)" |
| `primaryButton` | Component (Single) | **Component:** `ui.cta-button`, **Required:** false |
| `secondaryButton` | Component (Single) | **Component:** `ui.cta-button`, **Required:** false |
| `scrollIndicatorText` | Text (Short text) | **Max length:** 50, **Required:** false, **Placeholder:** "e.g., Scroll to explore" |
| `showScrollIndicator` | Boolean | **Default:** true |
| `animation` | Enumeration | **Values:** `fade`, `slide-up`, `slide-left`, `slide-right`, `zoom`, `none` - **Default:** `fade` |

**Location:** `apps/cms/src/api/hero-banner/content-types/hero-banner/schema.json`

### Notes

- ✅ **IMPLEMENTED** - Hero Banner is fully configured and ready to use
- CMS-editable hero section (per requirements)
- i18n enabled for future language support
- Uses CTA Button component (`ui.cta-button`) for action buttons
- `overlayOpacity` controls dark overlay for text readability
- `animation` controls entrance animation variant
- All fields are i18n localized for multi-language support

### Example Content

```json
{
  "heading": "Hi, I'm Aldrin Azucena",
  "subheading": "Full-Stack Developer & Music Producer",
  "description": "Building immersive web experiences with cutting-edge animations",
  "overlayOpacity": 60,
  "primaryButton": {
    "label": "View My Work",
    "url": "#projects",
    "variant": "primary",
    "size": "lg"
  },
  "secondaryButton": {
    "label": "Get in Touch",
    "url": "#contact",
    "variant": "outline",
    "size": "lg"
  },
  "scrollIndicatorText": "Scroll to explore",
  "showScrollIndicator": true,
  "animation": "fade"
}
```

### Frontend Integration

```typescript
// TypeScript interface (auto-generated)
import type { ApiHeroBannerHeroBanner } from '@/types/generated/contentTypes';

// Fetch Hero Banner content
const response = await fetch('http://localhost:1337/api/hero-banner?populate=*');
const { data } = await response.json();

// Type-safe access
const heroBanner: ApiHeroBannerHeroBanner = data.attributes;
```

---

## Single Type 2: About

**Display Name:** `About`
**API ID (Singular):** `about`
**API ID (Plural):** N/A (Single Type)

### Advanced Settings

- **Draft & Publish:** ✅ Enabled
- **Internationalization (i18n):** ✅ Enabled (for future language support)

### Fields

| Field Name | Type | Settings |
|------------|------|----------|
| `name` | Text (Short text) | **Max length:** 100, **Required:** true |
| `title` | Text (Short text) | **Max length:** 200, **Required:** true, **Placeholder:** "e.g., Full-Stack Developer & Music Producer" |
| `bio` | Rich Text (Markdown) | **Required:** true, **Placeholder:** "Write your biography here..." |
| `profileImage` | Media (Single image) | **Required:** true, **Allowed types:** Images only |
| `profileImageAlt` | Text (Short text) | **Max length:** 150, **Required:** false, **Placeholder:** "Alt text for accessibility" |
| `resumeFile` | Media (Single file) | **Required:** false, **Allowed types:** PDF only |
| `socialLinks` | Component (Repeatable) | **Component:** `shared.social-links`, **Required:** false, **Min:** 0, **Max:** 1 |
| `yearsOfExperience` | Number (Integer) | **Min:** 0, **Max:** 50, **Required:** false |
| `location` | Text (Short text) | **Max length:** 100, **Required:** false, **Placeholder:** "e.g., San Francisco, CA" |
| `tagline` | Text (Short text) | **Max length:** 150, **Required:** false, **Placeholder:** "Short catchy tagline" |
| `flipWords` | JSON | **Required:** false, **Placeholder:** "JSON array of rotating words e.g., [\"Developer\", \"Designer\", \"Creator\"]" |
| `descriptions` | JSON | **Required:** false, **Placeholder:** "JSON array of section descriptions" |
| `highlights` | JSON | **Required:** false, **Placeholder:** "JSON array of key highlights/achievements" |
| `stats` | Component (Repeatable) | **Component:** `content.stat`, **Required:** false, **Min:** 0, **Max:** 10 |
| `education` | JSON | **Required:** false, **Placeholder:** "JSON array of education entries" |
| `bioEmbedding` | JSON | **Required:** false, **Placeholder:** "Vector embedding for semantic search (768 dimensions for Gemini)" |
| `bioEmbeddingModel` | Text (Short text) | **Max length:** 50, **Required:** false, **Default:** "gemini-textembedding-gecko" |
| `bioEmbeddingGeneratedAt` | DateTime | **Required:** false |

**Click "Save"**

### pgVector Integration

- `bioEmbedding` stores the 768-dimensional vector from Gemini (textembedding-gecko)
- Used for semantic search and RAG in AI-powered forms
- Auto-generated via lifecycle hooks when bio is updated
- See [pgVector Configuration](./08-pgvector-setup.md) for implementation details

### Notes

- Supports markdown in `bio` field for rich formatting
- `stats` component allows up to 10 personal statistics
- `flipWords` creates rotating text effect on homepage
- Accessibility: Always provide `profileImageAlt`

### Example JSON Fields

**flipWords:**
```json
["Developer", "Designer", "Music Producer", "Creator"]
```

**descriptions:**
```json
[
  "Building scalable web applications with modern technologies",
  "Creating immersive experiences with animations and 3D graphics",
  "Producing electronic music and soundscapes"
]
```

**highlights:**
```json
[
  "10+ years of development experience",
  "50+ projects delivered",
  "Expert in React, TypeScript, and Node.js"
]
```

**education:**
```json
[
  {
    "degree": "Bachelor of Science in Computer Science",
    "institution": "University of California",
    "year": 2014
  }
]
```

---

## Single Type 3: Settings

**Display Name:** `Settings`
**API ID (Singular):** `setting`
**API ID (Plural):** N/A (Single Type)

### Advanced Settings

- **Draft & Publish:** ❌ Disabled (settings should be immediately active)

### Fields

| Field Name | Type | Settings |
|------------|------|----------|
| `siteName` | Text (Short text) | **Max length:** 100, **Required:** true |
| `siteTagline` | Text (Short text) | **Max length:** 200, **Required:** false |
| `siteLogo` | Media (Single image) | **Required:** false, **Allowed types:** Images only |
| `favicon` | Media (Single image) | **Required:** false, **Allowed types:** Images only |
| `defaultSEO` | Component (Repeatable) | **Component:** `shared.seo`, **Required:** true, **Min:** 1, **Max:** 1 |
| `googleAnalyticsId` | Text (Short text) | **Max length:** 50, **Required:** false, **Regex:** `^(G\|UA\|GTM)-.*` |
| `vercelAnalyticsEnabled` | Boolean | **Default:** false |
| `sentryDSN` | Text (Short text) | **Max length:** 200, **Required:** false |
| `enableAnimations` | Boolean | **Default:** true |
| `enableMusicPlayer` | Boolean | **Default:** true |
| `enableBlog` | Boolean | **Default:** true |
| `enableTestimonials` | Boolean | **Default:** true |
| `maintenanceMode` | Boolean | **Default:** false |
| `maintenanceMessage` | Text (Long text) | **Max length:** 500, **Required:** false |
| `easterEggChallenge` | Text (Long text) | **Max length:** 1000, **Required:** false, **Placeholder:** "Global Easter Egg challenge description" |
| `easterEggKeywords` | JSON | **Required:** false, **Placeholder:** "JSON array of keywords/phrases that unlock the Easter Egg" |
| `easterEggEnabled` | Boolean | **Default:** true |

**Click "Save"**

### Notes

- Settings content type is cached in Redis for performance (per requirements)
- Easter Egg settings control the global challenge
- i18n not needed for settings (internal configuration)
- No Draft & Publish - changes are immediately active

### Easter Egg Configuration

**easterEggKeywords Example:**
```json
["konami", "secret", "hidden", "mystery"]
```

**Frontend Usage:**
```typescript
// Detect Easter Egg keywords
const keywords = settings.easterEggKeywords;
const userInput = form.message.toLowerCase();

const foundKeyword = keywords.find(kw => userInput.includes(kw));
if (foundKeyword && settings.easterEggEnabled) {
  // Easter Egg detected!
  showEasterEggModal();
}
```

### Feature Flags

Use boolean fields to toggle features:
- `enableAnimations` - Heavy animations (Three.js, PixiJS)
- `enableMusicPlayer` - Music player section
- `enableBlog` - Blog section
- `enableTestimonials` - Testimonials display

### Maintenance Mode

When `maintenanceMode` is `true`:
- Display `maintenanceMessage` to visitors
- Disable all interactive features
- Admin panel remains accessible

---

## API Endpoints

### Hero Banner

```bash
# Get hero banner data
GET http://localhost:1337/api/hero-banner

# With populated components (CTA buttons)
GET http://localhost:1337/api/hero-banner?populate=*
```

### About

```bash
# Get about data
GET http://localhost:1337/api/about

# With populated social links
GET http://localhost:1337/api/about?populate=socialLinks,stats
```

### Settings

```bash
# Get settings
GET http://localhost:1337/api/setting

# With populated SEO
GET http://localhost:1337/api/setting?populate=defaultSEO
```

---

## Verification Checklist

After creating all 3 Single Types:

- [x] **Hero Banner** - ✅ IMPLEMENTED (visible in Content Manager)
- [ ] **About** - Pending implementation
- [ ] **Settings** - Pending implementation
- [x] All components properly linked (CTA Button, Social Links, SEO, Stats)
- [x] Draft & Publish enabled for Hero Banner
- [ ] Draft & Publish enabled for About (when implemented)
- [ ] Draft & Publish disabled for Settings (when implemented)
- [x] i18n enabled for Hero Banner
- [ ] i18n enabled for About (when implemented)
- [x] API endpoint `/api/hero-banner` returns 200 OK

---

## Common Issues

### Issue: Component Not Available

**Cause:** Components must be created before Single Types

**Solution:**
- Verify all 6 components exist in Components section
- Recreate component if missing
- Restart Strapi if component doesn't appear

---

### Issue: Cannot Save Single Type

**Cause:** Validation error or missing required field

**Solution:**
- Check all required fields are filled
- Verify max length constraints
- Check media uploads are valid types

---

## Next Steps

With all Single Types created:

1. ✅ **[Create Core Collection Types](./04-collection-types-core.md)** - Skills, Music Genres, Blog Series
2. ✅ **[Configure API Permissions](./09-api-permissions.md)** - After all content types are created

---

## Related Documentation

- **[Components](./02-components.md)** - Reusable components used in Single Types
- **[pgVector Setup](./08-pgvector-setup.md)** - About bio embedding implementation
- **[Easter Egg Completions](./07-collection-types-ai.md)** - Easter Egg tracking content type

---

**Last Updated:** 2025-11-26

**Recent Changes:**
- ✅ Hero Banner implemented with correct field names (`primaryButton`, `secondaryButton`, `animation`)
- ✅ Added `slide-right` to animation enum options
- ✅ Updated API endpoints to use `/api/hero-banner`
- ✅ Added frontend integration example with TypeScript types

**[← Back to Components](./02-components.md)** | **[Next: Core Collection Types →](./04-collection-types-core.md)**
