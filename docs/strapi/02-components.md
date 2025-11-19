# Reusable Components

**[← Back to Requirements](./01-requirements-summary.md)** | **[Next: Single Types →](./03-single-types.md)**

---

## Overview

Create these reusable components **BEFORE** creating any content types. Content types will reference these components.

**Creation Location:** `Content-Type Builder > Create new component`

### Currently Implemented Components

The following components have been created in the CMS (under `shared` category):

| Component | Status | Description |
|-----------|--------|-------------|
| `shared.seo` | Configured | SEO metadata with nested Open Graph |
| `shared.open-graph` | Configured | Open Graph meta tags (used by SEO) |
| `shared.social-links` | Created | Shell only - fields need to be added |

### Planned Components

The following components are documented for future implementation:

- `meta.seo-metadata` - Alternative SEO structure
- `media.audio-metadata` - Music track metadata
- `ui.cta-button` - Call-to-action buttons
- `content.stat` - Statistics display
- `content.achievement` - Achievement tracking

---

## Implemented: SEO Component (shared.seo)

**Location:** `src/components/shared/seo.json`

**Component Name:** `seo`
**Display Name:** `seo`
**Icon:** `search`
**Category:** `shared`

### Fields (Implemented)

| Field Name | Type | Settings |
|------------|------|----------|
| `metaTitle` | String | **Max length:** 60, **Required:** true |
| `metaDescription` | String | **Max length:** 160, **Min length:** 50, **Required:** true |
| `metaImage` | Media (Single image) | **Allowed types:** Images only |
| `openGraph` | Component | References `shared.open-graph` |
| `keywords` | Text | **Regex:** `[^,]+` |
| `metaRobots` | String | **Regex:** `[^,]+` |
| `metaViewport` | String | Viewport settings |
| `canonicalURL` | String | Canonical URL |
| `structuredData` | JSON | Structured data (JSON-LD) |

### Usage
- Any content type requiring SEO metadata
- Blog Posts, Projects, Pages

---

## Implemented: Open Graph Component (shared.open-graph)

**Location:** `src/components/shared/open-graph.json`

**Component Name:** `open-graph`
**Display Name:** `openGraph`
**Icon:** `project-diagram`
**Category:** `shared`

### Fields (Implemented)

| Field Name | Type | Settings |
|------------|------|----------|
| `ogTitle` | String | **Max length:** 70, **Required:** true |
| `ogDescription` | String | **Max length:** 200, **Required:** true |
| `ogImage` | Media (Single image) | **Allowed types:** Images only |
| `ogUrl` | String | Page URL |
| `ogType` | String | Content type (e.g., "website", "article") |

### Usage
- Nested within `shared.seo` component
- Controls social media preview cards

---

## Planned: SEO Metadata (Alternative Structure)

**Note:** The following is an alternative planned structure. The `shared.seo` component above is currently implemented.

**Location:** `Content-Type Builder > Create new component > meta`

**Component Name:** `seo-metadata`
**Display Name:** `SEO Metadata`
**Icon:** `search`
**Category:** `meta`

### Fields

| Field Name | Type | Settings |
|------------|------|----------|
| `metaTitle` | Text (Short text) | **Max length:** 60, **Required:** false, **Placeholder:** "Default to page title if empty" |
| `metaDescription` | Text (Long text) | **Max length:** 160, **Required:** false, **Placeholder:** "SEO-friendly description" |
| `keywords` | Text (Short text) | **Max length:** 255, **Required:** false, **Placeholder:** "keyword1, keyword2, keyword3" |
| `ogImage` | Media (Single image) | **Required:** false, **Allowed types:** Images only |
| `ogTitle` | Text (Short text) | **Max length:** 60, **Required:** false, **Placeholder:** "Defaults to metaTitle" |
| `ogDescription` | Text (Long text) | **Max length:** 160, **Required:** false, **Placeholder:** "Defaults to metaDescription" |
| `twitterCard` | Enumeration | **Values:** `summary`, `summary_large_image`, `app`, `player` - **Default:** `summary_large_image` |

**Click "Finish" then "Save"**

### Usage
- Settings (default SEO)
- Projects (project-specific SEO)
- Blog Posts (article SEO)
- Blog Series (series SEO)

### Best Practices
- Always provide `ogImage` for better social sharing
- Keep `metaTitle` under 60 characters (Google truncates)
- Keep `metaDescription` under 160 characters
- Use `summary_large_image` for rich previews on Twitter

---

## Component 2: Social Links

**Location:** `Content-Type Builder > Create new component > shared`

**Component Name:** `social-links`
**Display Name:** `Social Links`
**Icon:** `link`
**Category:** `shared`

**Status:** Component created (commit `1593f31`). Fields need to be added via Content-Type Builder.

### Fields

| Field Name | Type | Settings |
|------------|------|----------|
| `github` | Text (Short text) | **Max length:** 255, **Required:** false, **Regex:** `^https?://github\.com/.*` |
| `linkedin` | Text (Short text) | **Max length:** 255, **Required:** false, **Regex:** `^https?://(www\.)?linkedin\.com/.*` |
| `twitter` | Text (Short text) | **Max length:** 255, **Required:** false, **Regex:** `^https?://(www\.)?(twitter\.com\|x\.com)/.*` |
| `email` | Email | **Required:** false |
| `youtube` | Text (Short text) | **Max length:** 255, **Required:** false, **Regex:** `^https?://(www\.)?youtube\.com/.*` |
| `spotify` | Text (Short text) | **Max length:** 255, **Required:** false, **Regex:** `^https?://open\.spotify\.com/.*` |
| `soundcloud` | Text (Short text) | **Max length:** 255, **Required:** false, **Regex:** `^https?://soundcloud\.com/.*` |
| `website` | Text (Short text) | **Max length:** 255, **Required:** false, **Regex:** `^https?://.*` |

**Click "Finish" then "Save"**

### Usage
- About (personal social links)

### Best Practices
- Regex validation ensures only valid URLs are accepted
- Twitter field supports both twitter.com and x.com
- Email field uses built-in email validation

---

## Component 3: Audio Metadata

**Location:** `Content-Type Builder > Create new component > media`

**Component Name:** `audio-metadata`
**Display Name:** `Audio Metadata`
**Icon:** `music`
**Category:** `media`

### Fields

| Field Name | Type | Settings |
|------------|------|----------|
| `bpm` | Number (Integer) | **Min:** 20, **Max:** 300, **Required:** false |
| `key` | Enumeration | **Values:** `C`, `C#`, `D`, `D#`, `E`, `F`, `F#`, `G`, `G#`, `A`, `A#`, `B`, `Cm`, `C#m`, `Dm`, `D#m`, `Em`, `Fm`, `F#m`, `Gm`, `G#m`, `Am`, `A#m`, `Bm` |
| `duration` | Number (Integer) | **Min:** 1, **Required:** true, **Placeholder:** "Duration in seconds" |
| `genre` | Text (Short text) | **Max length:** 100, **Required:** false |
| `waveformData` | JSON | **Required:** false, **Placeholder:** "JSON array for wavesurfer.js visualization" |

**Click "Finish" then "Save"**

### Usage
- Compositions (music track metadata)

### Best Practices
- `bpm` range 20-300 covers most music
- `key` enumeration includes major and minor keys
- `waveformData` stores pre-computed waveform for visualization (generated by wavesurfer.js)
- `duration` is required for music player functionality

### Waveform Data Format
```json
{
  "waveformData": [0.1, 0.5, 0.8, 0.4, ...]
}
```

---

## Component 4: CTA Button

**Location:** `Content-Type Builder > Create new component > ui`

**Component Name:** `cta-button`
**Display Name:** `CTA Button`
**Icon:** `cursor`
**Category:** `ui`

### Fields

| Field Name | Type | Settings |
|------------|------|----------|
| `label` | Text (Short text) | **Max length:** 50, **Required:** true, **Placeholder:** "e.g., Get Started" |
| `url` | Text (Short text) | **Max length:** 255, **Required:** true, **Regex:** `^(https?://.*\|/.*\|#.*)` |
| `variant` | Enumeration | **Values:** `primary`, `secondary`, `outline`, `ghost` - **Default:** `primary` |
| `size` | Enumeration | **Values:** `sm`, `md`, `lg` - **Default:** `md` |
| `openInNewTab` | Boolean | **Default:** false |
| `icon` | Text (Short text) | **Max length:** 50, **Required:** false, **Placeholder:** "Icon name from @mynaui/icons-react" |

**Click "Finish" then "Save"**

### Usage
- Hero (primary and secondary CTAs)

### Best Practices
- `url` regex allows:
  - External URLs: `https://example.com`
  - Internal paths: `/about`
  - Anchor links: `#contact`
- `variant` matches ShadCN UI button variants
- `icon` uses icon names from @mynaui/icons-react package

### Example Frontend Usage
```tsx
import { ArrowRight } from '@mynaui/icons-react';

<Button variant={cta.variant} size={cta.size}>
  {cta.label}
  {cta.icon && <ArrowRight />}
</Button>
```

---

## Component 5: Stats

**Location:** `Content-Type Builder > Create new component > content`

**Component Name:** `stat`
**Display Name:** `Stats`
**Icon:** `chart-bar`
**Category:** `content`

### Fields

| Field Name | Type | Settings |
|------------|------|----------|
| `label` | Text (Short text) | **Max length:** 50, **Required:** true, **Placeholder:** "e.g., Years of Experience" |
| `value` | Text (Short text) | **Max length:** 20, **Required:** true, **Placeholder:** "e.g., 10+" |
| `description` | Text (Short text) | **Max length:** 100, **Required:** false |
| `icon` | Text (Short text) | **Max length:** 50, **Required:** false, **Placeholder:** "Icon name from @mynaui/icons-react" |
| `order` | Number (Integer) | **Min:** 0, **Required:** false, **Default:** 0 |

**Click "Finish" then "Save"**

### Usage
- About (personal stats/achievements)
- Projects (project metrics - optional manual entry)

### Best Practices
- `value` is text (not number) to allow "10+", "1M+", "$500K" formatting
- `order` controls display sequence
- `description` provides additional context on hover

### Example Stats
- Label: "Years of Experience", Value: "10+", Description: "Building web applications"
- Label: "Projects Completed", Value: "50+", Description: "Across 5 industries"
- Label: "Client Satisfaction", Value: "99%", Description: "Based on 100+ reviews"

---

## Component 6: Achievement

**Location:** `Content-Type Builder > Create new component > content`

**Component Name:** `achievement`
**Display Name:** `Achievement`
**Icon:** `trophy`
**Category:** `content`

### Fields

| Field Name | Type | Settings |
|------------|------|----------|
| `title` | Text (Short text) | **Max length:** 100, **Required:** true |
| `description` | Text (Long text) | **Max length:** 300, **Required:** false |
| `icon` | Text (Short text) | **Max length:** 50, **Required:** false, **Placeholder:** "Icon name from @mynaui/icons-react" |
| `badge` | Media (Single image) | **Required:** false, **Allowed types:** Images only |
| `date` | Date | **Type:** Date only, **Required:** false |

**Click "Finish" then "Save"**

### Usage
- Experience (key achievements at a company)

### Best Practices
- Use either `icon` (simple) or `badge` (custom image), not both
- `date` records when achievement was earned
- `description` provides context and details

### Example Achievements
- Title: "Led team of 5 developers", Description: "Successfully delivered 10 projects on time", Date: "2023-06-01"
- Title: "Increased performance by 80%", Description: "Optimized database queries and caching"
- Title: "Mentor of the Year", Badge: "award-badge.png"

---

## Verification Checklist

After creating all 6 components:

- [ ] All components visible in `Components` section of Content-Type Builder
- [ ] Each component has correct icon and category
- [ ] All fields have appropriate validation (max length, regex, min/max)
- [ ] Required fields are marked correctly
- [ ] Default values set where appropriate

---

## Common Issues

### Issue: Component Not Appearing in Content Type Builder

**Solution:**
```bash
# Restart Strapi
docker compose restart strapi

# Clear Strapi cache
rm -rf .cache
pnpm strapi build --clean
```

---

### Issue: Cannot Use Component in Content Type

**Cause:** Component category doesn't match

**Solution:**
- Verify component category matches what you're trying to use
- Example: `ui.cta-button` requires category `ui`

---

## Next Steps

With all 6 components created:

1. ✅ **[Create Single Types](./03-single-types.md)** - Hero, About, Settings
2. ✅ **[Create Core Collection Types](./04-collection-types-core.md)** - Skills, Music Genres, Blog Series

---

## Related Documentation

- **[Requirements Summary](./01-requirements-summary.md)** - Why these components exist
- **[Single Types](./03-single-types.md)** - Content types that use these components
- **[Best Practices](./13-best-practices.md)** - Component design patterns

---

**Last Updated:** 2025-11-18

**[<- Back to Requirements](./01-requirements-summary.md)** | **[Next: Single Types ->](./03-single-types.md)**
