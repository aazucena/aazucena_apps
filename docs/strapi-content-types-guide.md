# Strapi v5 Enhanced Content Types Creation Guide (Phase 0.2.3)

**Version 2.0 - Comprehensive Step-by-Step Guide for Creating All 14 Content Types**

**Production-Ready Configuration with pgVector Integration, AI Forms, and Semantic Search**

---

## Prerequisites Checklist

Before starting, ensure:
- ✅ Strapi v5 running at `http://localhost:1337/admin`
- ✅ PostgreSQL 16 with pgVector extension installed
- ✅ Cloudinary configured for media uploads
- ✅ Admin panel setup complete
- ✅ TypeScript configuration enabled
- ✅ Redis running for caching (optional but recommended)
- ✅ Gemini API key configured for embeddings

---

## Requirements Summary

Based on confirmed project requirements:

**Content Strategy:**
- ✅ Hero section: CMS-editable (Single Type)
- ✅ Music: Genre-based organization (Collection Type)
- ✅ Blog series: Dedicated content type for series management
- ✅ Testimonials: Email notifications with rejection reasons
- ✅ Projects: Featured by default on projects page
- ✅ Form retention: Keep all submissions forever
- ✅ i18n: Enabled for future language support

**Technical Configuration:**
- ✅ Embedding provider: **Gemini** (textembedding-gecko, 768 dimensions)
- ✅ pgVector index: **ivfflat** (speed-optimized)
- ✅ Caching: Skills, Projects, Blog Posts, Settings, About
- ✅ Media storage: **Cloudinary only**
- ✅ Admin security: Open initially → IP whitelist later
- ✅ Rate limit: **100 requests/minute per IP**
- ✅ TypeScript: **Strict types** enabled

**User Experience:**
- ✅ Comments: Decide post-launch (not in Phase 0)
- ✅ Playlists: Genre filtering only
- ✅ Analytics: Vercel + Sentry (not in Strapi)
- ✅ Easter Egg: Global challenge with leaderboard
- ✅ Project metrics: Optional manual entry

---

## Table of Contents

1. [Creation Order & Dependencies](#creation-order--dependencies)
2. [Reusable Components (Create First)](#reusable-components-create-first)
3. [Single Types](#single-types)
4. [Collection Types](#collection-types)
5. [pgVector Configuration](#pgvector-configuration)
6. [API Permissions Configuration](#api-permissions-configuration)
7. [Security & Deployment](#security--deployment)
8. [Data Migration Strategy](#data-migration-strategy)
9. [Testing Checklist](#testing-checklist)
10. [Best Practices](#best-practices)
11. [Implementation Timeline](#implementation-timeline)
12. [Troubleshooting](#troubleshooting)

---

## Creation Order & Dependencies

**Recommended Order:**

```
1. Reusable Components (6 components)
   ├── SEO Metadata (meta.seo-metadata)
   ├── Social Links (links.social-links)
   ├── Audio Metadata (media.audio-metadata)
   ├── CTA Button (ui.cta-button) ⭐ NEW
   ├── Stats (content.stat) ⭐ NEW
   └── Achievement (content.achievement) ⭐ NEW

2. Collection Types (12 types) - Create in this order
   ├── Skills (independent)
   ├── Music Genres (independent) ⭐ NEW
   ├── Blog Series (independent) ⭐ NEW
   ├── Projects (depends on Skills)
   ├── Experience (depends on Skills, Projects)
   ├── Testimonials (depends on Projects)
   ├── Blog Posts (depends on Blog Series)
   ├── Awards (depends on Projects, Skills)
   ├── Compositions (depends on Music Genres)
   ├── Form Submissions (independent) ⭐ NEW - CRITICAL for AI forms
   └── Easter Egg Completions (independent) ⭐ NEW

3. Single Types (3 types)
   ├── Hero (depends on CTA Button component) ⭐ NEW
   ├── About (depends on Social Links, Stats, Achievement components)
   └── Settings (depends on SEO Metadata component)
```

**Why This Order?**
- Components must exist before being used in content types
- Skills must exist before Projects (relation dependency)
- Music Genres must exist before Compositions
- Blog Series must exist before Blog Posts
- Single Types reference components, so create them last
- Form Submissions is critical for AI-powered forms functionality

---

## Reusable Components (Create First)

### Component 1: SEO Metadata

**Location:** `Content-Type Builder > Create new component > meta`

**Component Name:** `seo-metadata`
**Display Name:** `SEO Metadata`
**Icon:** `search`
**Category:** `meta`

**Fields:**

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

---

### Component 2: Social Links

**Location:** `Content-Type Builder > Create new component > links`

**Component Name:** `social-links`
**Display Name:** `Social Links`
**Icon:** `share`
**Category:** `links`

**Fields:**

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

---

### Component 3: Audio Metadata

**Location:** `Content-Type Builder > Create new component > media`

**Component Name:** `audio-metadata`
**Display Name:** `Audio Metadata`
**Icon:** `music`
**Category:** `media`

**Fields:**

| Field Name | Type | Settings |
|------------|------|----------|
| `bpm` | Number (Integer) | **Min:** 20, **Max:** 300, **Required:** false |
| `key` | Enumeration | **Values:** `C`, `C#`, `D`, `D#`, `E`, `F`, `F#`, `G`, `G#`, `A`, `A#`, `B`, `Cm`, `C#m`, `Dm`, `D#m`, `Em`, `Fm`, `F#m`, `Gm`, `G#m`, `Am`, `A#m`, `Bm` |
| `duration` | Number (Integer) | **Min:** 1, **Required:** true, **Placeholder:** "Duration in seconds" |
| `genre` | Text (Short text) | **Max length:** 100, **Required:** false |
| `waveformData` | JSON | **Required:** false, **Placeholder:** "JSON array for wavesurfer.js visualization" |

**Click "Finish" then "Save"**

---

### Component 4: CTA Button

**Location:** `Content-Type Builder > Create new component > ui`

**Component Name:** `cta-button`
**Display Name:** `CTA Button`
**Icon:** `cursor`
**Category:** `ui`

**Fields:**

| Field Name | Type | Settings |
|------------|------|----------|
| `label` | Text (Short text) | **Max length:** 50, **Required:** true, **Placeholder:** "e.g., Get Started" |
| `url` | Text (Short text) | **Max length:** 255, **Required:** true, **Regex:** `^(https?://.*\|/.*\|#.*)` |
| `variant` | Enumeration | **Values:** `primary`, `secondary`, `outline`, `ghost` - **Default:** `primary` |
| `size` | Enumeration | **Values:** `sm`, `md`, `lg` - **Default:** `md` |
| `openInNewTab` | Boolean | **Default:** false |
| `icon` | Text (Short text) | **Max length:** 50, **Required:** false, **Placeholder:** "Icon name from @mynaui/icons-react" |

**Click "Finish" then "Save"**

---

### Component 5: Stats

**Location:** `Content-Type Builder > Create new component > content`

**Component Name:** `stat`
**Display Name:** `Stats`
**Icon:** `chart-bar`
**Category:** `content`

**Fields:**

| Field Name | Type | Settings |
|------------|------|----------|
| `label` | Text (Short text) | **Max length:** 50, **Required:** true, **Placeholder:** "e.g., Years of Experience" |
| `value` | Text (Short text) | **Max length:** 20, **Required:** true, **Placeholder:** "e.g., 10+" |
| `description` | Text (Short text) | **Max length:** 100, **Required:** false |
| `icon` | Text (Short text) | **Max length:** 50, **Required:** false, **Placeholder:** "Icon name from @mynaui/icons-react" |
| `order` | Number (Integer) | **Min:** 0, **Required:** false, **Default:** 0 |

**Click "Finish" then "Save"**

---

### Component 6: Achievement

**Location:** `Content-Type Builder > Create new component > content`

**Component Name:** `achievement`
**Display Name:** `Achievement`
**Icon:** `trophy`
**Category:** `content`

**Fields:**

| Field Name | Type | Settings |
|------------|------|----------|
| `title` | Text (Short text) | **Max length:** 100, **Required:** true |
| `description` | Text (Long text) | **Max length:** 300, **Required:** false |
| `icon` | Text (Short text) | **Max length:** 50, **Required:** false, **Placeholder:** "Icon name from @mynaui/icons-react" |
| `badge` | Media (Single image) | **Required:** false, **Allowed types:** Images only |
| `date` | Date | **Type:** Date only, **Required:** false |

**Click "Finish" then "Save"**

---

## Single Types

### Single Type 1: Hero ⭐ NEW

**Location:** `Content-Type Builder > Create new single type`

**Display Name:** `Hero`
**API ID (Singular):** `hero`
**API ID (Plural):** N/A (Single Type)

**Advanced Settings:**
- **Draft & Publish:** ✅ Enabled
- **Internationalization (i18n):** ✅ Enabled (for future language support)

**Fields:**

| Field Name | Type | Settings |
|------------|------|----------|
| `heading` | Text (Short text) | **Max length:** 150, **Required:** true, **Placeholder:** "Main hero headline" |
| `subheading` | Text (Short text) | **Max length:** 200, **Required:** false, **Placeholder:** "Supporting text" |
| `description` | Text (Long text) | **Max length:** 500, **Required:** false |
| `backgroundImage` | Media (Single image) | **Required:** false, **Allowed types:** Images only |
| `backgroundVideo` | Media (Single file) | **Required:** false, **Allowed types:** Video only (.mp4, .webm) |
| `overlayOpacity` | Number (Integer) | **Min:** 0, **Max:** 100, **Required:** false, **Default:** 50, **Placeholder:** "Background overlay opacity (0-100)" |
| `primaryCTA` | Component (Repeatable) | **Component:** `ui.cta-button`, **Required:** false, **Min:** 0, **Max:** 1 |
| `secondaryCTA` | Component (Repeatable) | **Component:** `ui.cta-button`, **Required:** false, **Min:** 0, **Max:** 1 |
| `scrollIndicatorText` | Text (Short text) | **Max length:** 50, **Required:** false, **Placeholder:** "e.g., Scroll to explore" |
| `showScrollIndicator` | Boolean | **Default:** true |
| `animationVariant` | Enumeration | **Values:** `fade`, `slide-up`, `slide-left`, `zoom`, `none` - **Default:** `fade` |

**Click "Save"**

**Notes:**
- This Single Type controls the hero section at the top of the homepage
- CMS-editable per requirements
- i18n enabled for future language support
- Uses CTA Button component for action buttons

---

### Single Type 2: About

**Location:** `Content-Type Builder > Create new single type`

**Display Name:** `About`
**API ID (Singular):** `about`
**API ID (Plural):** N/A (Single Type)

**Advanced Settings:**
- **Draft & Publish:** ✅ Enabled
- **Internationalization (i18n):** ✅ Enabled (for future language support)

**Fields:**

| Field Name | Type | Settings |
|------------|------|----------|
| `name` | Text (Short text) | **Max length:** 100, **Required:** true |
| `title` | Text (Short text) | **Max length:** 200, **Required:** true, **Placeholder:** "e.g., Full-Stack Developer & Music Producer" |
| `bio` | Rich Text (Markdown) | **Required:** true, **Placeholder:** "Write your biography here..." |
| `profileImage` | Media (Single image) | **Required:** true, **Allowed types:** Images only |
| `profileImageAlt` | Text (Short text) | **Max length:** 150, **Required:** false, **Placeholder:** "Alt text for accessibility" |
| `resumeFile` | Media (Single file) | **Required:** false, **Allowed types:** PDF only |
| `socialLinks` | Component (Repeatable) | **Component:** `links.social-links`, **Required:** false, **Min:** 0, **Max:** 1 |
| `yearsOfExperience` | Number (Integer) | **Min:** 0, **Max:** 50, **Required:** false |
| `location` | Text (Short text) | **Max length:** 100, **Required:** false, **Placeholder:** "e.g., San Francisco, CA" |
| `tagline` | Text (Short text) | **Max length:** 150, **Required:** false, **Placeholder:** "Short catchy tagline" |
| `flipWords` | JSON | **Required:** false, **Placeholder:** "JSON array of rotating words for hero section e.g., [\"Developer\", \"Designer\", \"Creator\"]" |
| `descriptions` | JSON | **Required:** false, **Placeholder:** "JSON array of section descriptions" |
| `highlights` | JSON | **Required:** false, **Placeholder:** "JSON array of key highlights/achievements" |
| `stats` | Component (Repeatable) | **Component:** `content.stat`, **Required:** false, **Min:** 0, **Max:** 10 |
| `education` | JSON | **Required:** false, **Placeholder:** "JSON array of education entries" |
| `bioEmbedding` | JSON | **Required:** false, **Placeholder:** "Vector embedding for semantic search (768 dimensions for Gemini)" |
| `bioEmbeddingModel` | Text (Short text) | **Max length:** 50, **Required:** false, **Default:** "gemini-textembedding-gecko", **Placeholder:** "Embedding model used" |
| `bioEmbeddingGeneratedAt` | DateTime | **Required:** false |

**Click "Save"**

**pgVector Integration:**
- `bioEmbedding` stores the 768-dimensional vector from Gemini (textembedding-gecko)
- Used for semantic search and RAG in AI-powered forms
- Auto-generated via lifecycle hooks when bio is updated
- See [pgVector Configuration](#pgvector-configuration) section for implementation details

---

### Single Type 3: Settings

**Location:** `Content-Type Builder > Create new single type`

**Display Name:** `Settings`
**API ID (Singular):** `setting`
**API ID (Plural):** N/A (Single Type)

**Advanced Settings:**
- **Draft & Publish:** ❌ Disabled (settings should be immediately active)

**Fields:**

| Field Name | Type | Settings |
|------------|------|----------|
| `siteName` | Text (Short text) | **Max length:** 100, **Required:** true |
| `siteTagline` | Text (Short text) | **Max length:** 200, **Required:** false |
| `siteLogo` | Media (Single image) | **Required:** false, **Allowed types:** Images only |
| `favicon` | Media (Single image) | **Required:** false, **Allowed types:** Images only |
| `defaultSEO` | Component (Repeatable) | **Component:** `meta.seo-metadata`, **Required:** true, **Min:** 1, **Max:** 1 |
| `googleAnalyticsId` | Text (Short text) | **Max length:** 50, **Required:** false, **Regex:** `^(G|UA|GTM)-.*` |
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

**Notes:**
- Settings content type is cached in Redis for performance (per requirements)
- Easter Egg settings control the global challenge
- i18n not needed for settings (internal configuration)

---

## Collection Types

### Collection Type 1: Skills

**Location:** `Content-Type Builder > Create new collection type`

**Display Name:** `Skill`
**API ID (Singular):** `skill`
**API ID (Plural):** `skills`

**Advanced Settings:**
- **Draft & Publish:** ❌ Disabled (skills don't need drafts)
- **Default sort attribute:** `order` (ascending)
- **Internationalization (i18n):** ✅ Enabled (for future language support)

**Fields:**

| Field Name | Type | Settings |
|------------|------|----------|
| `name` | Text (Short text) | **Max length:** 100, **Required:** true, **Unique:** true |
| `category` | Enumeration | **Values:** `Frontend`, `Backend`, `Database`, `DevOps`, `Design`, `Tools`, `Music Production`, `Other` - **Required:** true |
| `proficiency` | Number (Integer) | **Min:** 0, **Max:** 100, **Required:** true, **Default:** 50, **Placeholder:** "0-100 skill level" |
| `icon` | Media (Single image) | **Required:** false, **Allowed types:** Images only |
| `description` | Text (Long text) | **Max length:** 500, **Required:** false |
| `yearsOfExperience` | Number (Decimal) | **Min:** 0, **Max:** 50, **Required:** false |
| `isFeatured` | Boolean | **Default:** false |
| `isCore` | Boolean | **Default:** false, **Placeholder:** "Mark as core/primary skill" |
| `url` | Text (Short text) | **Max length:** 255, **Required:** false, **Regex:** `^https?://.*`, **Placeholder:** "Official website/documentation URL" |
| `order` | Number (Integer) | **Min:** 0, **Required:** false, **Default:** 0 |

**Relations:**
- `projects` → Many-to-many → Projects (create after Projects collection exists)
- `parentSkill` → Many-to-one → Skills (self-relation for skill hierarchies, e.g., "React" parent of "React Hooks")
- `subSkills` → One-to-many → Skills (reverse of parentSkill)

**Click "Save"**

**Notes:**
- Skills content type is cached in Redis for performance (per requirements)
- `isCore` helps identify primary skills for homepage display
- Self-relation allows skill hierarchies (e.g., JavaScript → React → Next.js)

---

### Collection Type 2: Music Genres ⭐ NEW

**Location:** `Content-Type Builder > Create new collection type`

**Display Name:** `Music Genre`
**API ID (Singular):** `music-genre`
**API ID (Plural):** `music-genres`

**Advanced Settings:**
- **Draft & Publish:** ❌ Disabled (genres are simple taxonomy)
- **Default sort attribute:** `name` (ascending)
- **Internationalization (i18n):** ✅ Enabled (for future language support)

**Fields:**

| Field Name | Type | Settings |
|------------|------|----------|
| `name` | Text (Short text) | **Max length:** 100, **Required:** true, **Unique:** true, **Placeholder:** "e.g., Electronic, Hip-Hop, Ambient" |
| `slug` | UID | **Attached field:** `name`, **Required:** true |
| `description` | Text (Long text) | **Max length:** 500, **Required:** false |
| `color` | Text (Short text) | **Max length:** 7, **Required:** false, **Regex:** `^#([A-Fa-f0-9]{6}\|[A-Fa-f0-9]{3})$`, **Placeholder:** "Hex color for UI (e.g., #FF5733)" |
| `icon` | Text (Short text) | **Max length:** 50, **Required:** false, **Placeholder:** "Icon name from @mynaui/icons-react" |
| `coverImage` | Media (Single image) | **Required:** false, **Allowed types:** Images only |
| `order` | Number (Integer) | **Min:** 0, **Required:** false, **Default:** 0 |

**Relations:**
- `compositions` → One-to-many → Compositions (reverse relation, create after Compositions)

**Click "Save"**

**Notes:**
- Used for genre-based filtering of compositions (per requirements)
- Each composition can belong to multiple genres
- Color field helps create visual distinction in UI

---

### Collection Type 3: Blog Series ⭐ NEW

**Location:** `Content-Type Builder > Create new collection type`

**Display Name:** `Blog Series`
**API ID (Singular):** `blog-series`
**API ID (Plural):** `blog-series`

**Advanced Settings:**
- **Draft & Publish:** ✅ Enabled
- **Default sort attribute:** `order` (ascending)
- **Internationalization (i18n):** ✅ Enabled (for future language support)

**Fields:**

| Field Name | Type | Settings |
|------------|------|----------|
| `title` | Text (Short text) | **Max length:** 200, **Required:** true, **Placeholder:** "e.g., Building a Portfolio from Scratch" |
| `slug` | UID | **Attached field:** `title`, **Required:** true |
| `description` | Rich Text (Markdown) | **Required:** true, **Placeholder:** "Series overview and what readers will learn" |
| `coverImage` | Media (Single image) | **Required:** false, **Allowed types:** Images only |
| `coverImageAlt` | Text (Short text) | **Max length:** 150, **Required:** false |
| `status` | Enumeration | **Values:** `Planned`, `In Progress`, `Completed`, `On Hold` - **Default:** `In Progress` |
| `order` | Number (Integer) | **Min:** 0, **Required:** false, **Default:** 0 |
| `featured` | Boolean | **Default:** false |
| `seo` | Component (Repeatable) | **Component:** `meta.seo-metadata`, **Required:** false, **Min:** 0, **Max:** 1 |

**Relations:**
- `posts` → One-to-many → Blog Posts (reverse relation, create after Blog Posts)

**Click "Save"**

**Notes:**
- Dedicated content type for blog series management (per requirements)
- Allows organizing multi-part tutorials and article sequences
- Status field helps readers know if series is complete or ongoing

---

### Collection Type 4: Projects

**Location:** `Content-Type Builder > Create new collection type`

**Display Name:** `Project`
**API ID (Singular):** `project`
**API ID (Plural):** `projects`

**Advanced Settings:**
- **Draft & Publish:** ✅ Enabled
- **Default sort attribute:** `order` (ascending)
- **Internationalization (i18n):** ✅ Enabled (for future language support)

**Fields:**

| Field Name | Type | Settings |
|------------|------|----------|
| `title` | Text (Short text) | **Max length:** 200, **Required:** true |
| `slug` | UID | **Attached field:** `title`, **Required:** true |
| `shortDescription` | Text (Long text) | **Max length:** 300, **Required:** true, **Placeholder:** "Brief project summary" |
| `description` | Rich Text (Markdown) | **Required:** true |
| `coverImage` | Media (Single image) | **Required:** true, **Allowed types:** Images only |
| `coverImageAlt` | Text (Short text) | **Max length:** 150, **Required:** false |
| `screenshots` | Media (Multiple images) | **Required:** false, **Allowed types:** Images only, **Max:** 10 |
| `demoVideo` | Media (Single file) | **Required:** false, **Allowed types:** Video only (.mp4, .webm) |
| `gallery` | Media (Multiple images) | **Required:** false, **Allowed types:** Images only, **Max:** 10 |
| `techStack` | Relation | **Type:** Many-to-many, **Related to:** Skills |
| `githubUrl` | Text (Short text) | **Max length:** 255, **Required:** false, **Regex:** `^https?://github\.com/.*` |
| `repositoryUrl` | Text (Short text) | **Max length:** 255, **Required:** false, **Regex:** `^https?://.*`, **Placeholder:** "GitLab, Bitbucket, or other repo URL" |
| `liveDemoUrl` | Text (Short text) | **Max length:** 255, **Required:** false, **Regex:** `^https?://.*` |
| `projectType` | Enumeration | **Values:** `Web Application`, `Mobile App`, `Desktop App`, `Library`, `API`, `CLI Tool`, `Game`, `Music Production`, `Other` - **Default:** `Web Application` |
| `metrics` | Component (Repeatable) | **Component:** `content.stat`, **Required:** false, **Min:** 0, **Max:** 5, **Placeholder:** "Optional project metrics (users, downloads, etc.)" |
| `featured` | Boolean | **Default:** true, **Placeholder:** "Featured on projects page by default" |
| `isFeaturedOnHome` | Boolean | **Default:** false, **Placeholder:** "Show on homepage" |
| `order` | Number (Integer) | **Min:** 0, **Required:** false, **Default:** 0 |
| `startDate` | Date | **Type:** Date only, **Required:** false |
| `endDate` | Date | **Type:** Date only, **Required:** false |
| `status` | Enumeration | **Values:** `In Progress`, `Completed`, `Maintenance`, `Archived` - **Default:** `Completed` |
| `tags` | Text (Short text) | **Max length:** 255, **Required:** false, **Placeholder:** "tag1, tag2, tag3" |
| `viewCount` | Number (Integer) | **Min:** 0, **Required:** false, **Default:** 0, **Placeholder:** "Page views (auto-incremented)" |
| `descriptionEmbedding` | JSON | **Required:** false, **Placeholder:** "Vector embedding for semantic search (768 dimensions)" |
| `descriptionEmbeddingModel` | Text (Short text) | **Max length:** 50, **Required:** false, **Default:** "gemini-textembedding-gecko" |
| `descriptionEmbeddingGeneratedAt` | DateTime | **Required:** false |
| `seo` | Component (Repeatable) | **Component:** `meta.seo-metadata`, **Required:** false, **Min:** 0, **Max:** 1 |

**Click "Save"**

**Relation Setup:**
1. After creating Projects, go back to **Skills** content type
2. Add relation field: `projects` → Many-to-many → Projects
3. Save Skills content type

**Notes:**
- Projects content type is cached in Redis for performance (per requirements)
- `featured` defaults to true (all projects shown on projects page per requirements)
- `isFeaturedOnHome` controls homepage display (separate from projects page)
- pgVector integration for semantic project search
- `metrics` component allows optional manual entry of project statistics

---

### Collection Type 5: Experience

**Location:** `Content-Type Builder > Create new collection type`

**Display Name:** `Experience`
**API ID (Singular):** `experience`
**API ID (Plural):** `experiences`

**Advanced Settings:**
- **Draft & Publish:** ✅ Enabled
- **Default sort attribute:** `startDate` (descending)
- **Internationalization (i18n):** ✅ Enabled (for future language support)

**Fields:**

| Field Name | Type | Settings |
|------------|------|----------|
| `company` | Text (Short text) | **Max length:** 150, **Required:** true |
| `position` | Text (Short text) | **Max length:** 150, **Required:** true |
| `companyLogo` | Media (Single image) | **Required:** false, **Allowed types:** Images only |
| `companyLogoAlt` | Text (Short text) | **Max length:** 150, **Required:** false |
| `companyIndustry` | Enumeration | **Values:** `Technology`, `Finance`, `Healthcare`, `Education`, `Entertainment`, `Retail`, `Manufacturing`, `Government`, `Non-Profit`, `Startup`, `Other` - **Required:** false |
| `companySize` | Enumeration | **Values:** `1-10`, `11-50`, `51-200`, `201-500`, `501-1000`, `1001-5000`, `5000+` - **Required:** false |
| `location` | Text (Short text) | **Max length:** 150, **Required:** false |
| `startDate` | Date | **Type:** Date only, **Required:** true |
| `endDate` | Date | **Type:** Date only, **Required:** false |
| `isCurrent` | Boolean | **Default:** false |
| `description` | Rich Text (Markdown) | **Required:** true, **Placeholder:** "Describe your role, responsibilities, and achievements" |
| `highlights` | Rich Text (Markdown) | **Required:** false, **Placeholder:** "Key achievements (bullet points)" |
| `achievements` | Component (Repeatable) | **Component:** `content.achievement`, **Required:** false, **Min:** 0, **Max:** 10 |
| `skillsUsed` | Relation | **Type:** Many-to-many, **Related to:** Skills |
| `projectsCompleted` | Relation | **Type:** Many-to-many, **Related to:** Projects |
| `employmentType` | Enumeration | **Values:** `Full-time`, `Part-time`, `Contract`, `Freelance`, `Internship` - **Required:** true |
| `companyWebsite` | Text (Short text) | **Max length:** 255, **Required:** false, **Regex:** `^https?://.*` |
| `order` | Number (Integer) | **Min:** 0, **Required:** false, **Default:** 0 |

**Click "Save"**

**Relations:**
- `skillsUsed` links to Skills used in this role
- `projectsCompleted` links to Projects completed during this employment

**Notes:**
- Enhanced with company metadata (industry, size) for richer context
- `achievements` component allows structured achievement tracking
- Relations to Skills and Projects provide comprehensive work history

---

### Collection Type 6: Testimonials

**Location:** `Content-Type Builder > Create new collection type`

**Display Name:** `Testimonial`
**API ID (Singular):** `testimonial`
**API ID (Plural):** `testimonials`

**Advanced Settings:**
- **Draft & Publish:** ✅ Enabled (approval workflow)
- **Default sort attribute:** `createdAt` (descending)
- **Internationalization (i18n):** ✅ Enabled (for future language support)

**Fields:**

| Field Name | Type | Settings |
|------------|------|----------|
| `author` | Text (Short text) | **Max length:** 100, **Required:** true |
| `authorTitle` | Text (Short text) | **Max length:** 150, **Required:** false, **Placeholder:** "e.g., CEO at Company" |
| `company` | Text (Short text) | **Max length:** 100, **Required:** false |
| `content` | Text (Long text) | **Max length:** 1000, **Required:** true, **Placeholder:** "Testimonial content" |
| `avatar` | Media (Single image) | **Required:** false, **Allowed types:** Images only |
| `rating` | Number (Integer) | **Min:** 1, **Max:** 5, **Required:** true, **Default:** 5 |
| `featured` | Boolean | **Default:** false |
| `projectRelated` | Relation | **Type:** Many-to-one, **Related to:** Projects |
| `relationship` | Enumeration | **Values:** `Client`, `Colleague`, `Manager`, `Mentee`, `Collaborator`, `Other` - **Required:** false |
| `approvalStatus` | Enumeration | **Values:** `Pending`, `Approved`, `Rejected` - **Default:** `Pending` |
| `approvedBy` | Text (Short text) | **Max length:** 100, **Required:** false, **Placeholder:** "Admin who approved/rejected" |
| `approvedAt` | DateTime | **Required:** false |
| `rejectionReason` | Text (Long text) | **Max length:** 500, **Required:** false, **Placeholder:** "Required when status is Rejected" |
| `submittedAt` | DateTime | **Required:** false |
| `authorEmail` | Email | **Required:** false |
| `authorLinkedIn` | Text (Short text) | **Max length:** 255, **Required:** false, **Regex:** `^https?://(www\.)?linkedin\.com/.*` |
| `contentEmbedding` | JSON | **Required:** false, **Placeholder:** "Vector embedding for semantic search (768 dimensions)" |
| `contentEmbeddingModel` | Text (Short text) | **Max length:** 50, **Required:** false, **Default:** "gemini-textembedding-gecko" |
| `contentEmbeddingGeneratedAt` | DateTime | **Required:** false |
| `aiSentiment` | Enumeration | **Values:** `Very Positive`, `Positive`, `Neutral`, `Negative`, `Very Negative` - **Required:** false |
| `aiTags` | JSON | **Required:** false, **Placeholder:** "AI-generated tags for categorization" |

**Click "Save"**

**Lifecycle Hooks:**
- On approval/rejection: Send email notification to author (per requirements)
- On rejection: Validate that `rejectionReason` is provided
- On save: Generate embedding for `content` field

**pgVector Integration:**
- `contentEmbedding` stores 768-dimensional vector from Gemini
- Used for semantic search and duplicate detection
- `aiSentiment` and `aiTags` auto-generated by AI analysis

**Notes:**
- Email notifications sent on approval/rejection (per requirements)
- Rejection reason is required when status is "Rejected"
- All testimonials retained forever (per requirements)

---

### Collection Type 7: Blog Posts

**Location:** `Content-Type Builder > Create new collection type`

**Display Name:** `Blog Post`
**API ID (Singular):** `blog-post`
**API ID (Plural):** `blog-posts`

**Advanced Settings:**
- **Draft & Publish:** ✅ Enabled
- **Default sort attribute:** `publishedAt` (descending)
- **Internationalization (i18n):** ✅ Enabled (for future language support)

**Fields:**

| Field Name | Type | Settings |
|------------|------|----------|
| `title` | Text (Short text) | **Max length:** 200, **Required:** true |
| `slug` | UID | **Attached field:** `title`, **Required:** true |
| `excerpt` | Text (Long text) | **Max length:** 300, **Required:** true, **Placeholder:** "Brief summary for previews" |
| `content` | Rich Text (Markdown) | **Required:** true |
| `featuredImage` | Media (Single image) | **Required:** true, **Allowed types:** Images only |
| `featuredImageAlt` | Text (Short text) | **Max length:** 150, **Required:** false |
| `featuredImageCaption` | Text (Short text) | **Max length:** 200, **Required:** false |
| `author` | Text (Short text) | **Max length:** 100, **Required:** true, **Default:** "Aldrin Azucena" |
| `series` | Relation | **Type:** Many-to-one, **Related to:** Blog Series |
| `seriesOrder` | Number (Integer) | **Min:** 1, **Required:** false, **Placeholder:** "Position in series (e.g., Part 3)" |
| `relatedPosts` | Relation | **Type:** Many-to-many, **Related to:** Blog Posts (self-relation) |
| `tags` | Text (Short text) | **Max length:** 255, **Required:** false, **Placeholder:** "tag1, tag2, tag3" |
| `category` | Enumeration | **Values:** `Development`, `Music`, `Design`, `Tutorial`, `Opinion`, `News` - **Required:** true |
| `readTime` | Number (Integer) | **Min:** 1, **Required:** false, **Placeholder:** "Estimated read time in minutes (auto-calculated)" |
| `tableOfContents` | JSON | **Required:** false, **Placeholder:** "Auto-generated from markdown headings" |
| `featured` | Boolean | **Default:** false |
| `viewCount` | Number (Integer) | **Min:** 0, **Required:** false, **Default:** 0 |
| `contentEmbedding` | JSON | **Required:** false, **Placeholder:** "Vector embedding for semantic search (768 dimensions)" |
| `contentEmbeddingModel` | Text (Short text) | **Max length:** 50, **Required:** false, **Default:** "gemini-textembedding-gecko" |
| `contentEmbeddingGeneratedAt` | DateTime | **Required:** false |
| `autoGeneratedTags` | JSON | **Required:** false, **Placeholder:** "AI-generated tags from content analysis" |
| `seo` | Component (Repeatable) | **Component:** `meta.seo-metadata`, **Required:** false, **Min:** 0, **Max:** 1 |

**Click "Save"**

**Lifecycle Hooks:**
- On save: Auto-calculate `readTime` from content length
- On save: Auto-generate `tableOfContents` from markdown headings
- On save: Generate `contentEmbedding` for semantic search
- On save: Generate `autoGeneratedTags` using AI analysis

**Notes:**
- Blog Posts content type is cached in Redis for performance (per requirements)
- Relation to Blog Series allows multi-part tutorials
- Self-relation (`relatedPosts`) enables "You might also like" features
- pgVector integration for semantic article search

---

### Collection Type 8: Awards

**Location:** `Content-Type Builder > Create new collection type`

**Display Name:** `Award`
**API ID (Singular):** `award`
**API ID (Plural):** `awards`

**Advanced Settings:**
- **Draft & Publish:** ✅ Enabled
- **Default sort attribute:** `year` (descending)
- **Internationalization (i18n):** ✅ Enabled (for future language support)

**Fields:**

| Field Name | Type | Settings |
|------------|------|----------|
| `title` | Text (Short text) | **Max length:** 200, **Required:** true |
| `organization` | Text (Short text) | **Max length:** 150, **Required:** true |
| `issuer` | Text (Short text) | **Max length:** 150, **Required:** false, **Placeholder:** "Issuing authority (if different from organization)" |
| `credentialId` | Text (Short text) | **Max length:** 100, **Required:** false, **Placeholder:** "Certificate/credential ID" |
| `year` | Number (Integer) | **Min:** 1900, **Max:** 2100, **Required:** true |
| `description` | Rich Text (Markdown) | **Required:** false |
| `category` | Enumeration | **Values:** `Academic`, `Professional`, `Community`, `Music`, `Design`, `Certification`, `Competition`, `Other` - **Required:** true |
| `verificationUrl` | Text (Short text) | **Max length:** 255, **Required:** false, **Regex:** `^https?://.*` |
| `badge` | Media (Single image) | **Required:** false, **Allowed types:** Images only |
| `badgeAlt` | Text (Short text) | **Max length:** 150, **Required:** false |
| `certificate` | Media (Single file) | **Required:** false, **Allowed types:** PDF, Images |
| `relatedProject` | Relation | **Type:** Many-to-one, **Related to:** Projects |
| `relatedSkill` | Relation | **Type:** Many-to-one, **Related to:** Skills |
| `featured` | Boolean | **Default:** false |

**Click "Save"**

**Relations:**
- `relatedProject` links award to specific project (if applicable)
- `relatedSkill` links award to skill domain (e.g., "React Certification" → React skill)

**Notes:**
- Enhanced with credential tracking (`credentialId`, `issuer`)
- Relations provide context for portfolio storytelling
- Accessibility improved with `badgeAlt` field

---

### Collection Type 9: Compositions

**Location:** `Content-Type Builder > Create new collection type`

**Display Name:** `Composition`
**API ID (Singular):** `composition`
**API ID (Plural):** `compositions`

**Advanced Settings:**
- **Draft & Publish:** ✅ Enabled
- **Default sort attribute:** `releaseDate` (descending)
- **Internationalization (i18n):** ✅ Enabled (for lyrics translation)

**Fields:**

| Field Name | Type | Settings |
|------------|------|----------|
| `title` | Text (Short text) | **Max length:** 200, **Required:** true |
| `slug` | UID | **Attached field:** `title`, **Required:** true |
| `description` | Rich Text (Markdown) | **Required:** false |
| `audioFile` | Media (Single file) | **Required:** true, **Allowed types:** Audio only (.mp3, .wav, .ogg, .flac) |
| `coverArt` | Media (Single image) | **Required:** false, **Allowed types:** Images only |
| `audioMetadata` | Component (Repeatable) | **Component:** `media.audio-metadata`, **Required:** true, **Min:** 1, **Max:** 1 |
| `genres` | Relation | **Type:** Many-to-many, **Related to:** Music Genres |
| `releaseDate` | Date | **Type:** Date only, **Required:** true |
| `featured` | Boolean | **Default:** false |
| `playCount` | Number (Integer) | **Min:** 0, **Required:** false, **Default:** 0, **Placeholder:** "Total plays (auto-incremented)" |
| `downloadCount` | Number (Integer) | **Min:** 0, **Required:** false, **Default:** 0, **Placeholder:** "Download count" |
| `isFreeDownload` | Boolean | **Default:** false |
| `hasLyrics` | Boolean | **Default:** false |
| `lyrics` | Rich Text (Markdown) | **Required:** false |
| `spotifyUrl` | Text (Short text) | **Max length:** 255, **Required:** false, **Regex:** `^https?://open\.spotify\.com/.*` |
| `soundcloudUrl` | Text (Short text) | **Max length:** 255, **Required:** false, **Regex:** `^https?://soundcloud\.com/.*` |
| `youtubeUrl` | Text (Short text) | **Max length:** 255, **Required:** false, **Regex:** `^https?://(www\.)?youtube\.com/.*` |
| `collaborators` | Text (Short text) | **Max length:** 255, **Required:** false, **Placeholder:** "Comma-separated collaborator names" |

**Click "Save"**

**Relations:**
- `genres` links to Music Genres for genre-based filtering (per requirements)

**Notes:**
- Genre-based organization via relation to Music Genres (per requirements)
- `playCount` auto-incremented when composition is played
- `hasLyrics` boolean helps filter compositions with/without lyrics
- i18n enabled for lyrics translation support

---

### Collection Type 10: Form Submissions ⭐ NEW - CRITICAL

**Location:** `Content-Type Builder > Create new collection type`

**Display Name:** `Form Submission`
**API ID (Singular):** `form-submission`
**API ID (Plural):** `form-submissions`

**Advanced Settings:**
- **Draft & Publish:** ❌ Disabled (submissions are final)
- **Default sort attribute:** `submittedAt` (descending)

**Fields:**

| Field Name | Type | Settings |
|------------|------|----------|
| `formType` | Enumeration | **Values:** `Contact`, `Feedback`, `Testimonial`, `Bug Report`, `Feature Request`, `Collaboration`, `Referral`, `Music Feedback` - **Required:** true |
| `rawMessage` | Text (Long text) | **Max length:** 5000, **Required:** true, **Placeholder:** "Original message from user" |
| `structuredData` | JSON | **Required:** false, **Placeholder:** "AI-extracted fields (name, email, subject, etc.)" |
| `aiIntent` | Text (Short text) | **Max length:** 100, **Required:** false, **Placeholder:** "AI-classified intent" |
| `aiSummary` | Text (Long text) | **Max length:** 500, **Required:** false, **Placeholder:** "AI-generated summary (50-150 words)" |
| `aiSentiment` | Enumeration | **Values:** `Very Positive`, `Positive`, `Neutral`, `Negative`, `Very Negative` - **Required:** false |
| `aiTags` | JSON | **Required:** false, **Placeholder:** "AI-generated tags" |
| `easterEggDetected` | Boolean | **Default:** false |
| `submittedAt` | DateTime | **Required:** true |
| `submitterIP` | Text (Short text) | **Max length:** 45, **Required:** false, **Placeholder:** "IPv4 or IPv6 address" |
| `submitterEmail` | Email | **Required:** false |
| `submitterName` | Text (Short text) | **Max length:** 100, **Required:** false |
| `recaptchaScore` | Number (Decimal) | **Min:** 0, **Max:** 1, **Required:** false, **Placeholder:** "reCAPTCHA v3 score (0-1)" |
| `status` | Enumeration | **Values:** `New`, `In Progress`, `Resolved`, `Closed`, `Spam` - **Default:** `New` |
| `assignedTo` | Text (Short text) | **Max length:** 100, **Required:** false, **Placeholder:** "Admin handling the submission" |
| `internalNotes` | Text (Long text) | **Max length:** 2000, **Required:** false |
| `relatedProject` | Relation | **Type:** Many-to-one, **Related to:** Projects |
| `langSmithTraceId` | Text (Short text) | **Max length:** 100, **Required:** false, **Placeholder:** "LangSmith trace ID for debugging" |
| `messageEmbedding` | JSON | **Required:** false, **Placeholder:** "Vector embedding for semantic search (768 dimensions)" |
| `summaryEmbedding` | JSON | **Required:** false, **Placeholder:** "Vector embedding of AI summary (768 dimensions)" |
| `embeddingModel` | Text (Short text) | **Max length:** 50, **Required:** false, **Default:** "gemini-textembedding-gecko" |
| `embeddingGeneratedAt` | DateTime | **Required:** false |

**Click "Save"**

**CRITICAL for AI-Powered Forms:**
- This content type is the backbone of the AI forms system
- Stores raw user input + AI-processed structured data
- pgVector integration for semantic search and duplicate detection
- LangSmith integration for AI tracing and debugging
- reCAPTCHA v3 integration for spam protection

**pgVector Integration:**
- `messageEmbedding`: Vector of original user message (for similarity search)
- `summaryEmbedding`: Vector of AI-generated summary (for semantic search)
- Used for finding similar submissions, duplicate detection, RAG context

**Lifecycle Hooks:**
- On create: Process through LangGraph AI pipeline
- On create: Generate embeddings asynchronously
- On create: Check for Easter Egg keywords
- On create: Auto-assign based on formType

**Metadata for pgVector:**
- Index on: `formType`, `aiSentiment`, `submittedAt`, `status`
- Enables efficient filtering before vector similarity search
- Combined filters: "Find similar bug reports from last 30 days with negative sentiment"

**Notes:**
- All submissions retained forever (per requirements)
- Rate limiting: 100 requests/minute per IP
- See [AI-Powered Forms Documentation](/docs/features/ai-forms.md) for full implementation

---

### Collection Type 11: Easter Egg Completions ⭐ NEW

**Location:** `Content-Type Builder > Create new collection type`

**Display Name:** `Easter Egg Completion`
**API ID (Singular):** `easter-egg-completion`
**API ID (Plural):** `easter-egg-completions`

**Advanced Settings:**
- **Draft & Publish:** ❌ Disabled (completions are final)
- **Default sort attribute:** `completedAt` (descending)

**Fields:**

| Field Name | Type | Settings |
|------------|------|----------|
| `userIdentifier` | Text (Short text) | **Max length:** 100, **Required:** true, **Placeholder:** "Session ID, email, or username" |
| `challengeType` | Enumeration | **Values:** `Hidden Keyword`, `Secret Page`, `Konami Code`, `Scroll Pattern`, `Time-Based`, `Interactive Element`, `Other` - **Required:** true, **Default:** `Hidden Keyword` |
| `keywordFound` | Text (Short text) | **Max length:** 100, **Required:** false, **Placeholder:** "Keyword/phrase that triggered the Easter Egg" |
| `pageUrl` | Text (Short text) | **Max length:** 500, **Required:** false, **Placeholder:** "Page where Easter Egg was found" |
| `completedAt` | DateTime | **Required:** true |
| `userIP` | Text (Short text) | **Max length:** 45, **Required:** false |
| `userAgent` | Text (Long text) | **Max length:** 500, **Required:** false |
| `timeToComplete` | Number (Integer) | **Min:** 0, **Required:** false, **Placeholder:** "Seconds from page load to completion" |
| `attemptsCount` | Number (Integer) | **Min:** 1, **Required:** false, **Default:** 1 |
| `rewardClaimed` | Boolean | **Default:** false |
| `rewardType` | Enumeration | **Values:** `Badge`, `Confetti`, `Secret Content`, `Downloadable`, `Certificate`, `Leaderboard Entry`, `Other` - **Required:** false |
| `canRetryAt` | DateTime | **Required:** false, **Placeholder:** "Time-based blocking (e.g., can retry after 24 hours)" |
| `metadata` | JSON | **Required:** false, **Placeholder:** "Additional context (device, browser, session data)" |

**Click "Save"**

**Global Challenge Features (per requirements):**
- `userIdentifier` tracks unique users (can be anonymous session ID)
- `canRetryAt` implements time-based blocking (prevent spam)
- Leaderboard query: Sort by `completedAt`, filter by `challengeType`
- Time-to-complete tracking for speed challenges

**Notes:**
- Supports multiple challenge types for future Easter Eggs
- Time-based blocking prevents repeated attempts
- Metadata field allows extensibility
- Can be displayed on public leaderboard (anonymized)

---

## pgVector Configuration

### Overview

This section covers the complete setup for pgVector integration with Strapi v5 and PostgreSQL 16.

**Embedding Provider:** Google Gemini (textembedding-gecko)
**Vector Dimensions:** 768
**Index Type:** ivfflat (speed-optimized per requirements)

**Content Types with pgVector:**
- About (`bioEmbedding`)
- Projects (`descriptionEmbedding`)
- Testimonials (`contentEmbedding`)
- Blog Posts (`contentEmbedding`)
- Form Submissions (`messageEmbedding`, `summaryEmbedding`)

---

### Step 1: Database Migration - Add Vector Columns

Run this SQL migration in PostgreSQL:

```sql
-- Enable pgVector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Add vector columns to content types
ALTER TABLE abouts ADD COLUMN IF NOT EXISTS bio_embedding vector(768);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS description_embedding vector(768);
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS content_embedding vector(768);
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS content_embedding vector(768);
ALTER TABLE form_submissions ADD COLUMN IF NOT EXISTS message_embedding vector(768);
ALTER TABLE form_submissions ADD COLUMN IF NOT EXISTS summary_embedding vector(768);

-- Create ivfflat indexes (speed-optimized)
-- Note: Replace 'lists' value based on row count (recommendation: rows/1000)
CREATE INDEX IF NOT EXISTS idx_about_bio_embedding
  ON abouts USING ivfflat (bio_embedding vector_cosine_ops)
  WITH (lists = 10);

CREATE INDEX IF NOT EXISTS idx_project_description_embedding
  ON projects USING ivfflat (description_embedding vector_cosine_ops)
  WITH (lists = 100);

CREATE INDEX IF NOT EXISTS idx_testimonial_content_embedding
  ON testimonials USING ivfflat (content_embedding vector_cosine_ops)
  WITH (lists = 50);

CREATE INDEX IF NOT EXISTS idx_blog_post_content_embedding
  ON blog_posts USING ivfflat (content_embedding vector_cosine_ops)
  WITH (lists = 50);

CREATE INDEX IF NOT EXISTS idx_form_message_embedding
  ON form_submissions USING ivfflat (message_embedding vector_cosine_ops)
  WITH (lists = 100);

CREATE INDEX IF NOT EXISTS idx_form_summary_embedding
  ON form_submissions USING ivfflat (summary_embedding vector_cosine_ops)
  WITH (lists = 100);
```

**Index Configuration Notes:**
- `lists` parameter affects query performance vs build time tradeoff
- Recommendation: `lists = sqrt(total_rows)` or `rows/1000`
- Can be adjusted later based on actual data volume

---

### Step 2: Gemini Embedding Service

Create embedding service using Google Generative AI SDK:

```typescript
// src/services/embedding.service.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

interface EmbeddingResult {
  embedding: number[];
  model: string;
  dimensions: number;
}

export class EmbeddingService {
  private model = genAI.getGenerativeModel({ model: 'text-embedding-004' });

  /**
   * Generate embedding for text using Gemini
   * @param text - Text to embed
   * @returns 768-dimensional embedding vector
   */
  async generateEmbedding(text: string): Promise<EmbeddingResult> {
    try {
      if (!text || text.trim().length === 0) {
        throw new Error('Text cannot be empty');
      }

      const result = await this.model.embedContent(text);
      const embedding = result.embedding.values;

      return {
        embedding: Array.from(embedding),
        model: 'gemini-textembedding-gecko',
        dimensions: 768,
      };
    } catch (error) {
      console.error('Embedding generation failed:', error);
      throw error;
    }
  }

  /**
   * Batch generate embeddings (more efficient for multiple texts)
   */
  async generateBatchEmbeddings(texts: string[]): Promise<EmbeddingResult[]> {
    return Promise.all(texts.map(text => this.generateEmbedding(text)));
  }

  /**
   * Calculate cosine similarity between two vectors
   */
  cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length) {
      throw new Error('Vectors must have same dimensions');
    }

    const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));

    return dotProduct / (magnitudeA * magnitudeB);
  }
}

export default new EmbeddingService();
```

**Environment Variables:**
```env
# .env
GEMINI_API_KEY=your_gemini_api_key_here
```

---

### Step 3: Lifecycle Hooks for Auto-Embedding

Add lifecycle hooks to auto-generate embeddings on content save:

```typescript
// src/api/project/content-types/project/lifecycles.ts
import embeddingService from '../../../../services/embedding.service';

export default {
  async beforeCreate(event) {
    const { data } = event.params;

    if (data.description) {
      try {
        const { embedding, model } = await embeddingService.generateEmbedding(
          data.description
        );

        data.descriptionEmbedding = embedding;
        data.descriptionEmbeddingModel = model;
        data.descriptionEmbeddingGeneratedAt = new Date();
      } catch (error) {
        console.error('Failed to generate embedding:', error);
        // Don't block creation if embedding fails
      }
    }
  },

  async beforeUpdate(event) {
    const { data } = event.params;

    // Only regenerate if description changed
    if (data.description) {
      try {
        const { embedding, model } = await embeddingService.generateEmbedding(
          data.description
        );

        data.descriptionEmbedding = embedding;
        data.descriptionEmbeddingModel = model;
        data.descriptionEmbeddingGeneratedAt = new Date();
      } catch (error) {
        console.error('Failed to generate embedding:', error);
      }
    }
  },
};
```

**Apply similar lifecycle hooks to:**
- About (`src/api/about/content-types/about/lifecycles.ts`)
- Testimonials (`src/api/testimonial/content-types/testimonial/lifecycles.ts`)
- Blog Posts (`src/api/blog-post/content-types/blog-post/lifecycles.ts`)
- Form Submissions (`src/api/form-submission/content-types/form-submission/lifecycles.ts`)

---

### Step 4: Semantic Search Implementation

Create semantic search service:

```typescript
// src/services/semantic-search.service.ts
import embeddingService from './embedding.service';

interface SearchOptions {
  contentType: 'projects' | 'blog-posts' | 'testimonials' | 'form-submissions';
  limit?: number;
  threshold?: number;
  filters?: Record<string, any>;
}

interface SearchResult {
  id: number;
  similarity: number;
  data: any;
}

export class SemanticSearchService {
  /**
   * Semantic search using pgVector cosine similarity
   */
  async search(
    query: string,
    options: SearchOptions
  ): Promise<SearchResult[]> {
    const { contentType, limit = 10, threshold = 0.7, filters = {} } = options;

    // Generate query embedding
    const { embedding: queryEmbedding } = await embeddingService.generateEmbedding(query);

    // Build SQL query with pgVector cosine similarity
    const tableName = this.getTableName(contentType);
    const embeddingColumn = this.getEmbeddingColumn(contentType);

    let sql = `
      SELECT
        id,
        1 - (${embeddingColumn} <=> $1::vector) as similarity,
        *
      FROM ${tableName}
      WHERE 1 - (${embeddingColumn} <=> $1::vector) > $2
    `;

    // Add metadata filters
    const params = [JSON.stringify(queryEmbedding), threshold];
    let paramIndex = 3;

    if (filters.formType) {
      sql += ` AND form_type = $${paramIndex}`;
      params.push(filters.formType);
      paramIndex++;
    }

    if (filters.sentiment) {
      sql += ` AND ai_sentiment = $${paramIndex}`;
      params.push(filters.sentiment);
      paramIndex++;
    }

    if (filters.dateFrom) {
      sql += ` AND created_at >= $${paramIndex}`;
      params.push(filters.dateFrom);
      paramIndex++;
    }

    sql += ` ORDER BY similarity DESC LIMIT $${paramIndex}`;
    params.push(limit);

    // Execute query
    const results = await strapi.db.connection.raw(sql, params);

    return results.rows;
  }

  private getTableName(contentType: string): string {
    const mapping = {
      'projects': 'projects',
      'blog-posts': 'blog_posts',
      'testimonials': 'testimonials',
      'form-submissions': 'form_submissions',
    };
    return mapping[contentType] || contentType.replace('-', '_');
  }

  private getEmbeddingColumn(contentType: string): string {
    const mapping = {
      'projects': 'description_embedding',
      'blog-posts': 'content_embedding',
      'testimonials': 'content_embedding',
      'form-submissions': 'message_embedding',
    };
    return mapping[contentType] || 'embedding';
  }
}

export default new SemanticSearchService();
```

---

### Step 5: API Route for Semantic Search

Create custom API route:

```typescript
// src/api/semantic-search/routes/semantic-search.ts
export default {
  routes: [
    {
      method: 'POST',
      path: '/semantic-search',
      handler: 'semantic-search.search',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};

// src/api/semantic-search/controllers/semantic-search.ts
import semanticSearchService from '../../../services/semantic-search.service';

export default {
  async search(ctx) {
    const { query, contentType, limit, threshold, filters } = ctx.request.body;

    if (!query || !contentType) {
      return ctx.badRequest('Query and contentType are required');
    }

    try {
      const results = await semanticSearchService.search(query, {
        contentType,
        limit,
        threshold,
        filters,
      });

      return ctx.send({ results });
    } catch (error) {
      console.error('Semantic search failed:', error);
      return ctx.internalServerError('Search failed');
    }
  },
};
```

---

### Step 6: Testing Semantic Search

Example API calls:

```bash
# Find similar projects
curl -X POST http://localhost:1337/api/semantic-search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "React portfolio with animations",
    "contentType": "projects",
    "limit": 5,
    "threshold": 0.7
  }'

# Find similar form submissions with filters
curl -X POST http://localhost:1337/api/semantic-search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Bug report about animation performance",
    "contentType": "form-submissions",
    "limit": 10,
    "threshold": 0.75,
    "filters": {
      "formType": "Bug Report",
      "sentiment": "Negative",
      "dateFrom": "2025-01-01"
    }
  }'
```

---

## API Permissions Configuration

After creating all content types, configure API permissions for public access.

### Step 1: Navigate to Settings

1. Go to **Settings** (left sidebar)
2. Click **Users & Permissions Plugin** → **Roles**
3. Click **Public** role

### Step 2: Configure Permissions for Each Content Type

**Single Types:**

| Content Type | Permissions |
|--------------|-------------|
| Hero | ✅ `find` |
| About | ✅ `find` |
| Settings | ✅ `find` |

**Collection Types:**

| Content Type | Permissions |
|--------------|-------------|
| Skills | ✅ `find`, ✅ `findOne` |
| Music Genres | ✅ `find`, ✅ `findOne` |
| Blog Series | ✅ `find`, ✅ `findOne` |
| Projects | ✅ `find`, ✅ `findOne` |
| Experience | ✅ `find`, ✅ `findOne` |
| Testimonials | ✅ `find`, ✅ `findOne` (only published) |
| Blog Posts | ✅ `find`, ✅ `findOne` |
| Awards | ✅ `find`, ✅ `findOne` |
| Compositions | ✅ `find`, ✅ `findOne` |
| Form Submissions | ✅ `create` only (public can submit, admin can read/manage) |
| Easter Egg Completions | ✅ `create` only (public can submit completions) |

**DO NOT enable for most content types:**
- ❌ `create`
- ❌ `update`
- ❌ `delete`

**EXCEPTION - Enable `create` only for:**
- Form Submissions (public form submissions)
- Easter Egg Completions (public challenge completions)

These should only be accessible via Admin panel for read/update/delete operations.

### Step 3: Save Permissions

Click **Save** at the top right.

---

## Security & Deployment

### Rate Limiting Configuration

Configure rate limiting to prevent abuse (100 requests/minute per IP per requirements):

```javascript
// config/middlewares.ts
export default [
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': ["'self'", 'data:', 'blob:', 'https://res.cloudinary.com'],
          'media-src': ["'self'", 'data:', 'blob:', 'https://res.cloudinary.com'],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
  {
    name: 'strapi::ratelimit',
    config: {
      interval: 60000, // 1 minute
      max: 100, // 100 requests per minute per IP
      delayAfter: 50, // start delaying after 50 requests
      timeWait: 1000, // delay 1 second
      whitelist: [], // IP whitelist (add later when needed)
      store: {
        // Use Redis for distributed rate limiting (optional)
        type: 'redis',
        options: {
          host: process.env.REDIS_HOST || 'localhost',
          port: process.env.REDIS_PORT || 6379,
          password: process.env.REDIS_PASSWORD || '',
        },
      },
    },
  },
];
```

---

### CORS Configuration

Allow requests from localhost (development) and Vercel (production):

```javascript
// config/middlewares.ts (CORS section)
{
  name: 'strapi::cors',
  config: {
    enabled: true,
    origin: [
      'http://localhost:4321', // Astro dev server
      'http://localhost:3000', // Alternative dev port
      'https://aazucena.vercel.app', // Production frontend
      'https://*.vercel.app', // Vercel preview deployments
    ],
    headers: '*',
  },
}
```

---

### Redis Caching Configuration

Cache frequently accessed content types (per requirements):

```javascript
// config/plugins.ts
export default ({ env }) => ({
  'rest-cache': {
    enabled: true,
    config: {
      provider: {
        name: 'redis',
        options: {
          host: env('REDIS_HOST', 'localhost'),
          port: env.int('REDIS_PORT', 6379),
          password: env('REDIS_PASSWORD', ''),
          db: env.int('REDIS_DB', 0),
        },
      },
      strategy: {
        contentTypes: [
          // Cache these content types (per requirements)
          {
            contentType: 'api::skill.skill',
            maxAge: 3600000, // 1 hour
          },
          {
            contentType: 'api::project.project',
            maxAge: 1800000, // 30 minutes
          },
          {
            contentType: 'api::blog-post.blog-post',
            maxAge: 1800000, // 30 minutes
          },
          {
            contentType: 'api::setting.setting',
            maxAge: 7200000, // 2 hours
          },
          {
            contentType: 'api::about.about',
            maxAge: 3600000, // 1 hour
          },
        ],
      },
    },
  },
});
```

---

### Health Check Endpoint

Create health check for monitoring:

```typescript
// src/api/health/routes/health.ts
export default {
  routes: [
    {
      method: 'GET',
      path: '/health',
      handler: 'health.check',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
};

// src/api/health/controllers/health.ts
export default {
  async check(ctx) {
    try {
      // Check database connection
      await strapi.db.connection.raw('SELECT 1');

      // Check Redis connection (if enabled)
      let redisStatus = 'disabled';
      if (strapi.plugins['rest-cache']) {
        redisStatus = 'connected';
      }

      return ctx.send({
        status: 'ok',
        timestamp: new Date().toISOString(),
        database: 'connected',
        redis: redisStatus,
        version: strapi.config.get('info.strapi'),
      });
    } catch (error) {
      console.error('Health check failed:', error);
      return ctx.internalServerError({
        status: 'error',
        message: error.message,
      });
    }
  },
};
```

---

### Production Environment Configuration

```env
# .env.production
NODE_ENV=production
HOST=0.0.0.0
PORT=1337

# Database
DATABASE_CLIENT=postgres
DATABASE_HOST=your-postgres-host
DATABASE_PORT=5432
DATABASE_NAME=strapi_production
DATABASE_USERNAME=strapi_user
DATABASE_PASSWORD=secure_password
DATABASE_SSL=true

# Cloudinary
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_KEY=your_api_key
CLOUDINARY_SECRET=your_api_secret

# Redis
REDIS_HOST=your-redis-host
REDIS_PORT=6379
REDIS_PASSWORD=redis_password

# API Keys
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=generate_secure_random_string
API_TOKEN_SALT=generate_secure_random_string
ADMIN_JWT_SECRET=generate_secure_random_string

# Security
ADMIN_WHITELIST_IPS=  # Comma-separated IPs (add later)
RATE_LIMIT_ENABLED=true
```

---

## Data Migration Strategy

### Migration Script Template

Create migration scripts to transfer data from static TypeScript files to Strapi:

```typescript
// scripts/migrate-to-strapi.ts
import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

interface MigrationOptions {
  dryRun?: boolean;
  verbose?: boolean;
}

class DataMigration {
  private client;

  constructor() {
    this.client = axios.create({
      baseURL: STRAPI_URL,
      headers: {
        Authorization: `Bearer ${STRAPI_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Migrate skills data
   */
  async migrateSkills(options: MigrationOptions = {}) {
    console.log('Migrating skills...');

    // Import from static file
    const { skills } = await import('../apps/portfolio/src/data/skills.ts');

    for (const skill of skills) {
      try {
        if (options.dryRun) {
          console.log(`[DRY RUN] Would create skill: ${skill.name}`);
          continue;
        }

        const response = await this.client.post('/api/skills', {
          data: {
            name: skill.name,
            category: skill.category,
            proficiency: skill.proficiency,
            description: skill.description,
            yearsOfExperience: skill.yearsOfExperience,
            isFeatured: skill.isFeatured || false,
            isCore: skill.isCore || false,
            order: skill.order || 0,
          },
        });

        if (options.verbose) {
          console.log(`✅ Created skill: ${skill.name}`);
        }
      } catch (error) {
        console.error(`❌ Failed to migrate skill: ${skill.name}`, error.response?.data || error.message);
      }
    }

    console.log('Skills migration complete!');
  }

  /**
   * Migrate projects data (with Skills relation)
   */
  async migrateProjects(options: MigrationOptions = {}) {
    console.log('Migrating projects...');

    const { projects } = await import('../apps/portfolio/src/data/projects.ts');

    for (const project of projects) {
      try {
        if (options.dryRun) {
          console.log(`[DRY RUN] Would create project: ${project.title}`);
          continue;
        }

        // First, get skill IDs from names
        const techStackIds = await this.getSkillIdsByNames(project.techStack || []);

        const response = await this.client.post('/api/projects', {
          data: {
            title: project.title,
            shortDescription: project.shortDescription,
            description: project.description,
            coverImageAlt: `${project.title} cover image`,
            techStack: techStackIds,
            githubUrl: project.githubUrl,
            liveDemoUrl: project.liveDemoUrl,
            featured: project.featured !== undefined ? project.featured : true,
            isFeaturedOnHome: project.featuredOnHome || false,
            status: project.status || 'Completed',
            tags: project.tags?.join(', '),
            publishedAt: new Date(),
          },
        });

        if (options.verbose) {
          console.log(`✅ Created project: ${project.title}`);
        }
      } catch (error) {
        console.error(`❌ Failed to migrate project: ${project.title}`, error.response?.data || error.message);
      }
    }

    console.log('Projects migration complete!');
  }

  /**
   * Helper: Get skill IDs by names
   */
  private async getSkillIdsByNames(names: string[]): Promise<number[]> {
    const ids: number[] = [];

    for (const name of names) {
      try {
        const response = await this.client.get(`/api/skills?filters[name][$eq]=${encodeURIComponent(name)}`);
        if (response.data.data.length > 0) {
          ids.push(response.data.data[0].id);
        }
      } catch (error) {
        console.warn(`Could not find skill: ${name}`);
      }
    }

    return ids;
  }

  /**
   * Migrate About data
   */
  async migrateAbout(options: MigrationOptions = {}) {
    console.log('Migrating About...');

    const { about } = await import('../apps/portfolio/src/data/about.ts');

    try {
      if (options.dryRun) {
        console.log('[DRY RUN] Would update About');
        return;
      }

      await this.client.put('/api/about', {
        data: {
          name: about.name,
          title: about.title,
          bio: about.bio,
          location: about.location,
          tagline: about.tagline,
          yearsOfExperience: about.yearsOfExperience,
          publishedAt: new Date(),
        },
      });

      console.log('✅ About updated successfully');
    } catch (error) {
      console.error('❌ Failed to migrate About', error.response?.data || error.message);
    }
  }

  /**
   * Run all migrations
   */
  async runAll(options: MigrationOptions = {}) {
    console.log('Starting full migration...\n');

    await this.migrateSkills(options);
    await this.migrateProjects(options); // Must run after skills
    await this.migrateAbout(options);
    // Add more migrations as needed

    console.log('\n✅ All migrations complete!');
  }
}

// CLI execution
const migration = new DataMigration();

const dryRun = process.argv.includes('--dry-run');
const verbose = process.argv.includes('--verbose');

migration.runAll({ dryRun, verbose }).catch(console.error);
```

---

### Running Migrations

```bash
# 1. Install dependencies
pnpm add -D axios ts-node

# 2. Dry run (preview without creating)
STRAPI_API_TOKEN=your_token ts-node scripts/migrate-to-strapi.ts --dry-run --verbose

# 3. Run actual migration
STRAPI_API_TOKEN=your_token ts-node scripts/migrate-to-strapi.ts --verbose

# 4. Verify in Strapi admin panel
open http://localhost:1337/admin
```

---

### Handling Missing Data

For missing data (placeholder images, etc.):

```typescript
// scripts/handle-missing-data.ts

/**
 * Generate placeholder images for projects without covers
 */
async function generatePlaceholders() {
  const projects = await strapi.entityService.findMany('api::project.project', {
    filters: { coverImage: { $null: true } },
  });

  for (const project of projects) {
    // Use a placeholder service like https://placehold.co/
    const placeholderUrl = `https://placehold.co/1200x630/1e293b/f1f5f9?text=${encodeURIComponent(project.title)}`;

    console.log(`Project "${project.title}" needs placeholder: ${placeholderUrl}`);
    // You can download and upload to Cloudinary here
  }
}

/**
 * Set default values for missing fields
 */
async function setDefaults() {
  // Set default featured status for all projects (per requirements)
  await strapi.db.query('api::project.project').updateMany({
    where: { featured: null },
    data: { featured: true },
  });

  // Set default proficiency for skills without it
  await strapi.db.query('api::skill.skill').updateMany({
    where: { proficiency: null },
    data: { proficiency: 50 },
  });
}
```

---

## Testing Checklist

### 1. Verify Content Types in Admin Panel

- [ ] All 6 components visible in Components section
- [ ] All 3 Single Types visible in Content Manager
- [ ] All 11 Collection Types visible in Content Manager
- [ ] All fields appear correctly for each content type
- [ ] pgVector columns exist in database (check via SQL)

### 2. Test API Endpoints (Public Access)

**Single Types:**

```bash
# Test Hero endpoint
curl http://localhost:1337/api/hero

# Test About endpoint
curl http://localhost:1337/api/about

# Test Settings endpoint
curl http://localhost:1337/api/setting
```

**Collection Types:**

```bash
# Test Skills endpoint
curl http://localhost:1337/api/skills

# Test Music Genres endpoint
curl http://localhost:1337/api/music-genres

# Test Blog Series endpoint
curl http://localhost:1337/api/blog-series

# Test Projects endpoint
curl http://localhost:1337/api/projects

# Test Experience endpoint
curl http://localhost:1337/api/experiences

# Test Testimonials endpoint
curl http://localhost:1337/api/testimonials

# Test Blog Posts endpoint
curl http://localhost:1337/api/blog-posts

# Test Awards endpoint
curl http://localhost:1337/api/awards

# Test Compositions endpoint
curl http://localhost:1337/api/compositions

# Test Form Submissions endpoint (admin only for GET)
curl -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  http://localhost:1337/api/form-submissions

# Test Easter Egg Completions endpoint (admin only for GET)
curl -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  http://localhost:1337/api/easter-egg-completions
```

**Test pgVector Semantic Search:**

```bash
# Test semantic search
curl -X POST http://localhost:1337/api/semantic-search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "portfolio with animations",
    "contentType": "projects",
    "limit": 5
  }'
```

**Test Health Check:**

```bash
curl http://localhost:1337/api/health
```

**Test Individual Entry:**

```bash
# Get single project by ID
curl http://localhost:1337/api/projects/1

# Get single skill by ID
curl http://localhost:1337/api/skills/1
```

**Test Populated Relations:**

```bash
# Get projects with skills relation populated
curl http://localhost:1337/api/projects?populate=techStack
```

### 3. Create Test Content

Create at least one entry for each content type to verify:
- [ ] All fields save correctly
- [ ] Media uploads work (Cloudinary integration)
- [ ] Relations work (Projects ↔ Skills)
- [ ] Draft/Publish workflow works
- [ ] Validation rules are enforced

### 4. Verify Data Structure

Example API response for Projects:

```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "title": "My Portfolio",
        "slug": "my-portfolio",
        "shortDescription": "Personal portfolio website",
        "description": "...",
        "coverImage": {
          "data": {
            "attributes": {
              "url": "https://res.cloudinary.com/..."
            }
          }
        },
        "techStack": {
          "data": [
            {
              "id": 1,
              "attributes": {
                "name": "React",
                "category": "Frontend"
              }
            }
          ]
        },
        "createdAt": "2025-01-14T00:00:00.000Z",
        "updatedAt": "2025-01-14T00:00:00.000Z",
        "publishedAt": "2025-01-14T00:00:00.000Z"
      }
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 1,
      "total": 1
    }
  }
}
```

---

## Best Practices

### 1. Field Naming Conventions

- Use **camelCase** for field names (e.g., `coverImage`, not `cover_image`)
- Use descriptive names (e.g., `shortDescription` instead of `desc`)
- Avoid reserved words (`id`, `createdAt`, `updatedAt`, `publishedAt`)

### 2. Validation Rules

- Always set **max length** for text fields to prevent database overflow
- Use **regex validation** for URLs, emails, and structured data
- Set **min/max values** for numbers (proficiency: 0-100, rating: 1-5)
- Mark critical fields as **required**

### 3. Performance Optimization

- Use **indexes** on frequently queried fields (slug, category)
- Limit **gallery/media** fields to prevent large payloads
- Use **pagination** for collection types with many entries
- Populate relations only when needed (avoid deep nesting)

### 4. Content Strategy

- Use **Draft & Publish** for content that needs review (blog posts, projects)
- Disable Draft & Publish for simple data (skills, settings)
- Use **featured** boolean to highlight content on homepage
- Use **order** field for manual sorting control

### 5. SEO & Metadata

- Add SEO component to content types that generate pages (Projects, Blog Posts)
- Use **slug** fields for clean URLs
- Store **structured data** for rich snippets (JSON-LD)

### 6. Media Management

- Restrict file types (images only, PDF only, audio only)
- Set reasonable **max file size** limits in Strapi settings
- Use **Cloudinary transformations** for responsive images
- Store **alt text** for accessibility

---

## Troubleshooting

### Issue: Content Type Not Appearing in API

**Solution:**
1. Check **API Permissions** (Settings → Roles → Public)
2. Ensure content is **published** (if Draft & Publish enabled)
3. Restart Strapi: `docker-compose restart strapi`

### Issue: Relation Not Populating

**Solution:**
1. Use `populate` query parameter: `?populate=techStack`
2. Check relation is bidirectional (both content types have relation field)
3. Ensure related content is published

### Issue: Media Upload Fails

**Solution:**
1. Verify **Cloudinary credentials** in `.env`
2. Check Cloudinary upload preset settings
3. Verify file type restrictions in content type configuration
4. Check Docker logs: `docker-compose logs strapi`

### Issue: Validation Error on Save

**Solution:**
1. Check all **required fields** are filled
2. Verify **max length** constraints
3. Check **regex patterns** match expected format
4. Ensure **min/max values** are within range

### Issue: TypeScript Type Generation Fails

**Solution:**
1. Ensure `--typescript` flag was used during Strapi initialization
2. Run type generation: `pnpm strapi ts:generate-types`
3. Check `types/generated/contentTypes.d.ts` exists

### Issue: Docker Container Crashes

**Solution:**
1. Check Docker logs: `docker-compose logs -f strapi`
2. Verify PostgreSQL is running: `docker-compose ps`
3. Check database connection in `config/database.ts`
4. Ensure `.env` file has correct credentials
5. Rebuild containers: `docker-compose up -d --build`

---

## Implementation Timeline

### Phase A: Pre-Implementation (1 day)

**Day 1:**
- [ ] Review requirements and architecture
- [ ] Set up PostgreSQL 16 with pgVector extension
- [ ] Configure Cloudinary account
- [ ] Set up Redis (optional but recommended)
- [ ] Install required npm packages
- [ ] Configure environment variables

---

### Phase B: Core Content Types (2-3 days)

**Day 2:**
- [ ] Create all 6 reusable components
- [ ] Create 3 Single Types (Hero, About, Settings)
- [ ] Test Single Types API endpoints
- [ ] Upload placeholder media to Cloudinary

**Day 3:**
- [ ] Create Skills content type
- [ ] Create Music Genres content type
- [ ] Create Blog Series content type
- [ ] Test relations between content types

**Day 4:**
- [ ] Create Projects content type (with Skills relation)
- [ ] Create Experience content type (with Skills/Projects relations)
- [ ] Create Testimonials content type (with Projects relation)
- [ ] Test all relations and populated queries

**Day 5:**
- [ ] Create Blog Posts content type (with Blog Series relation)
- [ ] Create Awards content type (with Projects/Skills relations)
- [ ] Create Compositions content type (with Music Genres relation)
- [ ] Test all Collection Types endpoints

---

### Phase C: pgVector & Advanced Features (1-2 days)

**Day 6:**
- [ ] Run pgVector database migration
- [ ] Create embedding service (Gemini integration)
- [ ] Add lifecycle hooks for auto-embedding
- [ ] Test embedding generation

**Day 7:**
- [ ] Create semantic search service
- [ ] Add semantic search API route
- [ ] Test semantic search functionality
- [ ] Create Form Submissions content type (CRITICAL for AI forms)
- [ ] Create Easter Egg Completions content type

---

### Phase D: Security & Configuration (1 day)

**Day 8:**
- [ ] Configure rate limiting (100 req/min per IP)
- [ ] Set up CORS for localhost + Vercel
- [ ] Configure Redis caching for content types
- [ ] Create health check endpoint
- [ ] Configure API permissions (public vs admin)
- [ ] Test security configurations

---

### Phase E: Data Migration & Production (1-2 days)

**Day 9:**
- [ ] Create migration scripts
- [ ] Run dry-run migrations
- [ ] Migrate existing static data to Strapi
- [ ] Handle missing data (placeholders, defaults)
- [ ] Verify all data migrated correctly

**Day 10:**
- [ ] Set up production environment variables
- [ ] Deploy to Railway (or hosting platform)
- [ ] Configure production database
- [ ] Test production API endpoints
- [ ] Set up monitoring (health checks)
- [ ] Configure backups

---

### Total Estimated Time: 7-10 days

**Breakdown:**
- **Minimum (7 days):** Experienced developer, no issues
- **Average (8-9 days):** Some troubleshooting, learning curve
- **Maximum (10 days):** First time with Strapi v5/pgVector, thorough testing

**Critical Path:**
1. Database setup (Day 1)
2. Core content types (Days 2-5)
3. pgVector integration (Days 6-7)
4. Production deployment (Days 9-10)

**Parallel Work Opportunities:**
- Frontend integration can start after Day 5 (core content types complete)
- Security configuration can happen during data migration

---

## Next Steps After Content Types Creation

1. **Populate Test Data** - Create sample entries for each content type
2. **Frontend Integration** (Phase 0.2.4) - Connect Astro app to Strapi API
3. **Type Generation** - Generate TypeScript types for frontend
4. **Migration Scripts** - Execute data migration from static files
5. **Webhook Setup** - Configure Strapi webhooks to trigger Vercel rebuilds
6. **AI Forms Integration** - Implement LangGraph pipeline for Form Submissions
7. **Monitoring** - Set up Sentry, health checks, and logging

---

## Related Documentation

- [Phase 0 Infrastructure Documentation](/docs/phase-0-infrastructure.md)
- [Strapi v5 Official Docs](https://docs.strapi.io/dev-docs/intro)
- [PostgreSQL & pgVector Setup](/docs/phase-0-infrastructure.md#0-2-1-local-development-with-docker-compose)
- [AI-Powered Forms Feature](/docs/features/ai-forms.md)
- [Google Generative AI - Embeddings](https://ai.google.dev/tutorials/embeddings_quickstart)
- [pgVector Documentation](https://github.com/pgvector/pgvector)

---

**Last Updated:** 2025-01-15
**Version:** 2.0 Enhanced
**Strapi Version:** v5
**Database:** PostgreSQL 16 + pgVector
**Environment:** Docker Compose
**Embedding Provider:** Google Gemini (textembedding-gecko, 768 dimensions)

---

**Estimated Time:** 7-10 days (production-ready implementation with pgVector, security, and migrations)

**Completion Criteria:**
- ✅ All 14 content types created (3 Single Types + 11 Collection Types)
- ✅ All 6 reusable components created
- ✅ All API endpoints accessible and tested
- ✅ pgVector integration complete with semantic search
- ✅ Sample content created and validated
- ✅ All relations working correctly
- ✅ Media uploads functional (Cloudinary)
- ✅ API permissions configured (public + admin)
- ✅ Rate limiting active (100 req/min per IP)
- ✅ Redis caching configured for performance
- ✅ Security hardened (CORS, CSP, rate limiting)
- ✅ Health check endpoint working
- ✅ Data migration from static files complete
- ✅ Production environment configured and deployed
