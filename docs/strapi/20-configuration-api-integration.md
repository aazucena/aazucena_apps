# Configuration API Integration Guide

**Last Updated:** 2025-01-18

This guide documents the 8 configuration-focused content types implemented for frontend integration. These are **site-wide settings** that control layout, behavior, and appearance.

---

## Overview

All configuration APIs follow the **production-ready pattern**:
- ✅ Zod runtime validation
- ✅ Graceful fallback to defaults
- ✅ SSG caching (force-cache or no-cache)
- ✅ Type safety (TypeScript + Zod inference)
- ✅ Clear error logging

---

## 1. Homepage Configuration

**Content Type:** `homepage` (single type)
**API Client:** `apps/portfolio/src/lib/api/homepage.ts`

### Schema
```typescript
{
  sections: Section[] // Min: 1, Max: 8
}

interface Section {
  id: number;
  enabled: boolean;
  name: string;         // Unique identifier (e.g., "hero", "about")
  title: string;        // Display title
  subtitle?: string;    // Optional subtitle
  buttonLabel?: string; // Optional CTA label
  icon?: any;          // Optional icon (icons-field)
}
```

### Usage
```typescript
import { getHomepage } from '~/lib/api/homepage';

const homepage = await getHomepage();

// Returns:
// {
//   sections: [
//     { id: 1, name: 'hero', title: 'Welcome', subtitle: '...', enabled: true },
//     { id: 2, name: 'about', title: 'About', ... },
//     ...
//   ]
// }

// Only enabled sections are returned
const enabledSections = homepage.sections; // Already filtered
```

### Default Fallback
8 sections: hero, about, projects, skills, experience, testimonials, blog, contact

---

## 2. Hero Section Configuration

**Content Type:** `hero` (single type)
**API Client:** `apps/portfolio/src/lib/api/hero.ts`

### Schema
```typescript
{
  flipWords: string[];           // Sortable list (e.g., ["ideas", "visions"])
  taglineTemplate: string;       // Template with {flipWord} placeholder
  primaryButtonText?: string;    // CTA text (default: "Get Started")
  showDropdown: boolean;         // Show dropdown menu
  secondaryButtonText?: string;  // Secondary CTA (default: "View Resume")
  showSecondaryButton: boolean;  // Show secondary button
}
```

### Usage
```typescript
import { getHero } from '~/lib/api/hero';

const hero = await getHero();

// Returns:
// {
//   flipWords: ['ideas', 'concepts', 'visions', 'dreams'],
//   taglineTemplate: 'Turning {flipWord} into elegant code...',
//   primaryButtonText: 'Get Started',
//   showDropdown: true,
//   secondaryButtonText: 'View Resume',
//   showSecondaryButton: true
// }

// Use in template:
const tagline = hero.taglineTemplate.replace('{flipWord}', hero.flipWords[0]);
```

### Default Fallback
Pre-configured with sensible hero section defaults

---

## 3. Website Configuration

**Content Type:** `website-configuration` (single type)
**API Client:** `apps/portfolio/src/lib/api/website-config.ts`

### Schema
```typescript
{
  siteName: string;              // Site title
  siteUrl: string;               // Full URL (e.g., https://example.com)
  siteTagline?: string;          // Site tagline
  baseUrl: string;               // Base path (default: "/")
  siteLogo?: any;                // Site logo media
  favicon?: any;                 // Favicon media
  seo: {
    metaTitle: string;           // Default meta title
    metaDescription: string;     // Default meta description (50-160 chars)
    metaImage?: any;             // Default OG image
    keywords?: string;           // SEO keywords
    metaRobots: string;          // Robots directive
    metaViewport: string;        // Viewport meta tag
    canonicalURL?: string;       // Canonical URL
    structuredData?: any;        // JSON-LD structured data
    twitterCard: string;         // Twitter card type
    openGraph?: {
      ogTitle: string;
      ogDescription: string;
      ogImage?: any;
      ogUrl?: string;
      ogType: string;            // website | article | profile
    };
  };
  metaTitleTemplate: string;     // Title template (e.g., "%s — {siteName}")
  openGraphSiteName?: string;    // OG site name override
  twitterHandle?: string;        // Twitter handle (e.g., @username)
  robotsIndex: boolean;          // Allow indexing
  robotsFollow: boolean;         // Allow following links
  googleSiteVerificationId?: string; // Google verification ID
  trailingSlash: boolean;        // URL trailing slash preference
  cleanUrls: boolean;            // Clean URLs (no .html extension)
}
```

### Usage
```typescript
import { getWebsiteConfig } from '~/lib/api/website-config';

const config = await getWebsiteConfig();

// Use in Astro layout:
<head>
  <title>{config.seo.metaTitle}</title>
  <meta name="description" content={config.seo.metaDescription} />
  <meta name="keywords" content={config.seo.keywords} />
  <meta name="robots" content={config.seo.metaRobots} />

  {config.seo.openGraph && (
    <>
      <meta property="og:title" content={config.seo.openGraph.ogTitle} />
      <meta property="og:description" content={config.seo.openGraph.ogDescription} />
      <meta property="og:type" content={config.seo.openGraph.ogType} />
    </>
  )}

  <meta name="twitter:card" content={config.seo.twitterCard} />
  {config.twitterHandle && (
    <meta name="twitter:site" content={config.twitterHandle} />
  )}
</head>
```

### Default Fallback
Basic SEO setup with Aldrin Azucena branding

---

## 4. Blog Configuration

**Content Type:** `blog` (single type)
**API Client:** `apps/portfolio/src/lib/api/blog-config.ts`

### Schema
```typescript
{
  postsPerPage: number;          // Posts per page (1-50, default: 6)
  permalink: string;             // Permalink structure (e.g., "/%slug%")
  paths: {
    main: string;                // Blog base path (default: "blog")
    category: string;            // Category path (default: "category")
    tag: string;                 // Tag path (default: "tag")
  };
  relatedPosts: {
    enabled: boolean;            // Show related posts
    count: number;               // Number of related posts (1-10, default: 4)
  };
}
```

### Usage
```typescript
import { getBlogConfig } from '~/lib/api/blog-config';

const blog = await getBlogConfig();

// Use for pagination:
const page = 1;
const offset = (page - 1) * blog.postsPerPage;

// Use for URL building:
const blogUrl = `/${blog.paths.main}/`;
const categoryUrl = `/${blog.paths.main}/${blog.paths.category}/tech/`;
const tagUrl = `/${blog.paths.main}/${blog.paths.tag}/javascript/`;

// Use for related posts:
if (blog.relatedPosts.enabled) {
  const relatedPosts = await getRelatedPosts(postId, blog.relatedPosts.count);
}
```

### Default Fallback
Standard blog configuration (6 posts/page, related posts enabled)

---

## 5. Animation Configuration

**Content Type:** `animation` (single type)
**API Client:** `apps/portfolio/src/lib/api/animation.ts`

### Schema
```typescript
{
  enabled: boolean;              // Master animation toggle
  heavyAnimations: boolean;      // Enable Three.js/PixiJS animations
  defaultPerformanceTier: 'low' | 'medium' | 'high' | 'auto';
  particleCounts: {
    low: number;                 // 0-100 particles (default: 50)
    medium: number;              // 0-200 particles (default: 100)
    high: number;                // 0-500 particles (default: 200)
  };
  timing: {
    flipText: number;            // Flip text interval (ms, 1000-10000, default: 3000)
    sectionTransition: number;   // Section transition (ms, 100-5000, default: 1000)
  };
}
```

### Usage
```typescript
import { getAnimationConfig } from '~/lib/api/animation';

const animationConfig = await getAnimationConfig();

// Use in animation setup:
const particleCount = animationConfig.particleCounts[performanceTier];

// Use in GSAP config:
gsap.to(element, {
  duration: animationConfig.timing.sectionTransition / 1000, // Convert to seconds
  ...
});

// Use for feature flags:
if (!animationConfig.enabled) {
  return; // Skip all animations
}

if (!animationConfig.heavyAnimations) {
  return; // Skip Three.js/PixiJS
}
```

### Default Fallback
All animations enabled with auto performance tier detection

---

## 6. Theme Configuration

**Content Type:** `theme` (single type)
**API Client:** `apps/portfolio/src/lib/api/theme.ts`

### Schema
```typescript
{
  mode: 'system' | 'light' | 'dark' | 'light:only' | 'dark:only';
  colors: {
    light: {
      primary: string;           // Hex color (e.g., "#3b82f6")
      secondary: string;
      accent: string;
    };
    dark: {
      primary: string;
      secondary: string;
      accent: string;
    };
  };
  fonts: {
    sans: string;                // Font family name (default: "Fira Sans")
    serif: string;
    heading: string;
    code: string;                // Code font (default: "Fira Code")
  };
}
```

### Usage
```typescript
import { getTheme } from '~/lib/api/theme';

const theme = await getTheme();

// Use in CSS variables:
<style>
  :root {
    --color-primary: {theme.colors.light.primary};
    --color-secondary: {theme.colors.light.secondary};
    --color-accent: {theme.colors.light.accent};

    --font-sans: {theme.fonts.sans};
    --font-serif: {theme.fonts.serif};
    --font-heading: {theme.fonts.heading};
    --font-code: {theme.fonts.code};
  }

  .dark {
    --color-primary: {theme.colors.dark.primary};
    --color-secondary: {theme.colors.dark.secondary};
    --color-accent: {theme.colors.dark.accent};
  }
</style>

// Use in Tailwind config:
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: theme.colors.light.primary,
        // ...
      },
      fontFamily: {
        sans: [theme.fonts.sans, 'sans-serif'],
        // ...
      },
    },
  },
};
```

### Default Fallback
Blue/Purple color scheme with Fira Sans/Fira Code fonts

---

## 7. Maintenance Mode

**Content Type:** `maintenance` (single type)
**API Client:** `apps/portfolio/src/lib/api/maintenance.ts`

### Schema
```typescript
{
  enabled: boolean;              // Master maintenance toggle
  message: string;               // Maintenance message (rich text → plain text)
}
```

### Usage
```typescript
import { getMaintenance } from '~/lib/api/maintenance';

// IMPORTANT: Uses no-cache for real-time status checks
const maintenance = await getMaintenance();

// Use in middleware or layout:
if (maintenance.enabled) {
  return new Response(
    `
    <!DOCTYPE html>
    <html>
      <head><title>Under Maintenance</title></head>
      <body>
        <h1>Site Under Maintenance</h1>
        <p>${maintenance.message}</p>
      </body>
    </html>
    `,
    { status: 503, headers: { 'Content-Type': 'text/html' } }
  );
}
```

### Default Fallback
Maintenance disabled with generic message

### ⚠️ Important Notes
- Uses `cache: 'no-cache'` for real-time checks
- All other APIs use `force-cache` for SSG optimization
- Rich text message is converted to plain text automatically

---

## 8. About Section Configuration

**Content Type:** `about` (single type)
**API Client:** `apps/portfolio/src/lib/api/about.ts`

### Schema
```typescript
{
  tagline: string;               // Section tagline (max 150 chars)
  descriptions: any;             // Blocks content (rich text)
  highlights: any;               // Blocks content (rich text)
  stats: Array<{
    id: number;
    label: string;               // Stat label (max 50 chars)
    value: string;               // Stat value (max 20 chars)
    description?: string;        // Stat description (max 100 chars)
    icon?: any;                  // Icon (icons-field)
    sort?: number;               // Sort order
  }>;
  learnMoreCards: Array<{
    id: number;
    title: string;               // Card title (max 100 chars)
    variant?: 'cyan-blue' | 'purple-pink' | 'green-teal' | 'orange-red' | 'indigo-violet';
    description?: string;        // Card description (max 255 chars)
    icon?: any;                  // Icon (icons-field)
    button: {
      id: number;
      text: string;
      url?: string;
      variant?: 'default' | 'outline' | 'ghost';
      size?: 'sm' | 'md' | 'lg';
      icon?: any;
    };
  }>;
}
```

### Usage
```typescript
import { getAbout } from '~/lib/api/about';

const about = await getAbout();

// Use in About section:
<section>
  <h2>{about.tagline}</h2>

  {/* Render blocks content */}
  <div>{about.descriptions}</div>
  <div>{about.highlights}</div>

  {/* Render stats */}
  <div class="stats-grid">
    {about.stats.map(stat => (
      <div key={stat.id}>
        <span>{stat.value}</span>
        <span>{stat.label}</span>
        {stat.description && <p>{stat.description}</p>}
      </div>
    ))}
  </div>

  {/* Render learn more cards */}
  <div class="cards-grid">
    {about.learnMoreCards.map(card => (
      <div key={card.id} class={`card-${card.variant}`}>
        <h3>{card.title}</h3>
        <p>{card.description}</p>
        <a href={card.button.url}>{card.button.text}</a>
      </div>
    ))}
  </div>
</section>
```

### Default Fallback
Basic about section with tagline and description

---

## Integration Example

Complete example showing how to use all configuration APIs in an Astro layout:

```typescript
---
// src/layouts/ConfiguredLayout.astro
import { getWebsiteConfig } from '~/lib/api/website-config';
import { getTheme } from '~/lib/api/theme';
import { getMaintenance } from '~/lib/api/maintenance';
import { getAnimationConfig } from '~/lib/api/animation';

// Fetch all configurations at build time
const [websiteConfig, theme, maintenance, animationConfig] = await Promise.all([
  getWebsiteConfig(),
  getTheme(),
  getMaintenance(),
  getAnimationConfig(),
]);

// Check maintenance mode first
if (maintenance.enabled) {
  return Astro.redirect('/maintenance', 503);
}
---

<!DOCTYPE html>
<html lang="en" data-theme={theme.mode}>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content={websiteConfig.seo.metaViewport} />

    {/* SEO */}
    <title>{websiteConfig.seo.metaTitle}</title>
    <meta name="description" content={websiteConfig.seo.metaDescription} />
    <meta name="keywords" content={websiteConfig.seo.keywords} />
    <meta name="robots" content={websiteConfig.seo.metaRobots} />

    {/* Open Graph */}
    {websiteConfig.seo.openGraph && (
      <>
        <meta property="og:title" content={websiteConfig.seo.openGraph.ogTitle} />
        <meta property="og:description" content={websiteConfig.seo.openGraph.ogDescription} />
        <meta property="og:type" content={websiteConfig.seo.openGraph.ogType} />
        <meta property="og:site_name" content={websiteConfig.openGraphSiteName || websiteConfig.siteName} />
      </>
    )}

    {/* Twitter */}
    <meta name="twitter:card" content={websiteConfig.seo.twitterCard} />
    {websiteConfig.twitterHandle && (
      <meta name="twitter:site" content={websiteConfig.twitterHandle} />
    )}

    {/* Favicon */}
    {websiteConfig.favicon && (
      <link rel="icon" href={websiteConfig.favicon} />
    )}

    {/* Theme CSS Variables */}
    <style define:vars={{
      colorPrimaryLight: theme.colors.light.primary,
      colorSecondaryLight: theme.colors.light.secondary,
      colorAccentLight: theme.colors.light.accent,
      colorPrimaryDark: theme.colors.dark.primary,
      colorSecondaryDark: theme.colors.dark.secondary,
      colorAccentDark: theme.colors.dark.accent,
      fontSans: theme.fonts.sans,
      fontSerif: theme.fonts.serif,
      fontHeading: theme.fonts.heading,
      fontCode: theme.fonts.code,
    }}>
      :root {
        --color-primary: var(--colorPrimaryLight);
        --color-secondary: var(--colorSecondaryLight);
        --color-accent: var(--colorAccentLight);
        --font-sans: var(--fontSans);
        --font-serif: var(--fontSerif);
        --font-heading: var(--fontHeading);
        --font-code: var(--fontCode);
      }

      .dark {
        --color-primary: var(--colorPrimaryDark);
        --color-secondary: var(--colorSecondaryDark);
        --color-accent: var(--colorAccentDark);
      }
    </style>
  </head>

  <body>
    <slot />

    {/* Pass animation config to client-side JS */}
    <script define:vars={{ animationConfig }}>
      window.__ANIMATION_CONFIG__ = animationConfig;
    </script>
  </body>
</html>
```

---

## Testing Checklist

- [ ] **Homepage:** Verify sections array, enabled filtering
- [ ] **Hero:** Test flipWords array parsing, button visibility
- [ ] **Website Config:** Verify nested SEO and OpenGraph components
- [ ] **Blog Config:** Test pagination calculations, URL path building
- [ ] **Animation:** Verify performance tier settings, timing configurations
- [ ] **Theme:** Test color variables, font family application
- [ ] **Maintenance:** Test real-time toggle (no-cache), message rendering
- [ ] **About:** Verify stats sorting, card link components

---

## Error Handling

All APIs follow consistent error handling:

```typescript
try {
  const data = await getConfigAPI();
  // Use data
} catch (error) {
  // Already logged by API client
  // Falls back to DEFAULT_* constant
}
```

### Error Logs
- `[Homepage] Invalid CMS data:` - Zod validation failed
- `[Hero] Failed to fetch:` - Network or CMS error
- `[WebsiteConfig] Invalid CMS data:` - SEO component validation failed
- etc.

---

## Performance Considerations

1. **SSG Caching:** All APIs use `force-cache` except Maintenance (`no-cache`)
2. **Parallel Fetching:** Use `Promise.all()` for multiple configs:
   ```typescript
   const [homepage, hero, theme] = await Promise.all([
     getHomepage(),
     getHero(),
     getTheme(),
   ]);
   ```
3. **Build-Time Fetching:** Fetch in `.astro` frontmatter for SSG optimization
4. **Graceful Degradation:** All APIs have sensible defaults

---

## File Structure

```
apps/portfolio/src/lib/
├── api/
│   ├── homepage.ts          # ✅ New
│   ├── hero.ts              # ✅ New
│   ├── website-config.ts    # ✅ New
│   ├── blog-config.ts       # ✅ New
│   ├── animation.ts         # ✅ New
│   ├── theme.ts             # ✅ New
│   ├── maintenance.ts       # ✅ New
│   └── about.ts             # ✅ New
├── validators/
│   ├── homepage.ts          # ✅ New
│   ├── hero.ts              # ✅ New
│   ├── website-config.ts    # ✅ New
│   ├── blog-config.ts       # ✅ New
│   ├── animation.ts         # ✅ New
│   ├── theme.ts             # ✅ New
│   ├── maintenance.ts       # ✅ New
│   └── about.ts             # ✅ New
└── transformers/
    ├── homepage.ts          # ✅ New
    ├── hero.ts              # ✅ New
    ├── website-config.ts    # ✅ New
    ├── blog-config.ts       # ✅ New
    ├── animation.ts         # ✅ New
    ├── theme.ts             # ✅ New
    ├── maintenance.ts       # ✅ New
    └── about.ts             # ✅ New
```

---

## Next Steps

1. **Test all APIs manually** with live CMS data
2. **Integrate into Astro layouts** (BaseLayout.astro, etc.)
3. **Update ROADMAP.md** to mark Phase 0.2.4 as complete
4. **Deploy to Railway** (Phase 0.3) and test end-to-end

---

**Related Documentation:**
- [03-single-types.md](./03-single-types.md) - Strapi single type schemas
- [17-frontend-integration-guide.md](./17-frontend-integration-guide.md) - General frontend integration
- [Phase 0.2.4 Documentation](../../ROADMAP.md#phase-024-frontend-api-integration)
