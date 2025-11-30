# Single Types

**[← Back to Components](./02-components.md)** | **[Next: Core Collection Types →](./04-collection-types-core.md)**

---

## Overview

Create these 3 Single Types after creating all reusable components. Single Types represent unique pages/settings (only one instance exists).

**Creation Location:** `Content-Type Builder > Create new single type`

---

## Single Type 1: Hero Banner - ⚠️ DEPRECATED

**Status:** 🔴 **DEPRECATED** - Merged into About single type

### ⚠️ Important Notice

**This single type should be removed.** The Hero section content is now managed through the **About** single type, as the `HeroSection.tsx` component uses `AboutData`.

### Why This Change?

**Problem Found:**
- `HeroSection.tsx` uses `AboutData` (from About single type)
- This Hero Banner schema was never actually used by the component
- Fields didn't match implementation (missing `flipWords`, `heroTaglineTemplate`, etc.)
- Caused confusion having two separate content types for related content

**Solution:**
- Hero-specific fields added to About single type (GROUP 1: Hero Section Fields)
- All hero content managed in one place
- Simpler content management
- Matches actual implementation

### Migration Steps

If you have existing Hero Banner content:

1. **Backup current Hero Banner data:**
   ```bash
   GET http://localhost:1337/api/hero-banner
   ```

2. **Map to About single type:**
   - `heading` → `name`
   - `subheading` → `title`
   - Add `flipWords`: `["ideas", "concepts", "visions", "dreams"]`
   - Add `heroTaglineTemplate`: "Turning {flipWord} into elegant code, one pixel at a time."
   - Configure `heroDropdownOptions` for navigation

3. **Delete Hero Banner:**
   - Remove from Content-Type Builder
   - Delete `apps/cms/src/api/hero-banner/` folder
   - Update frontend to use About API endpoint

### Alternative: Keep Hero Banner (Not Recommended)

If you still want a separate Hero Banner, see:
- **[Hero Banner Revision Options](./HERO-BANNER-REVISION.md)** (Option B: Fix separately)

However, **Option A (merge into About)** is recommended because:
- ✅ Matches actual implementation
- ✅ Less duplication
- ✅ Simpler content management
- ✅ One source of truth

---

### ~~Original Schema~~ (Reference Only)

<details>
<summary>Click to see original Hero Banner schema (deprecated)</summary>

**Display Name:** `Hero Banner`
**API ID (Singular):** `hero-banner`
**API ID (Plural):** `hero-banners`

**Fields:**
- `heading` (Text)
- `subheading` (Text)
- `description` (Long text)
- `overlayOpacity` (Number)
- `primaryButton` (CTA component)
- `secondaryButton` (CTA component)
- `scrollIndicatorText` (Text)
- `showScrollIndicator` (Boolean)
- `animation` (Enumeration)

**Location:** `apps/cms/src/api/hero-banner/content-types/hero-banner/schema.json`

**Note:** These fields don't match what `HeroSection.tsx` actually uses.
</details>

---

## Single Type 2: Portfolio (includes Hero content) - REVISED ✨

**Display Name:** `Portfolio`
**API ID (Singular):** `portfolio`
**API ID (Plural):** N/A (Single Type)

**Note:** This single type includes both Hero section and About section content, as the HeroSection component uses this data. Previously named "About", renamed to "Portfolio" for clarity.

### Advanced Settings

- **Draft & Publish:** ✅ Enabled
- **Internationalization (i18n):** ✅ Enabled (for future language support)

---

## 🎯 Organized Field Groups

### GROUP 1: Hero Section Fields

**Used by:** HeroSection component

| Field Name | Type | Settings | Implementation Notes |
|------------|------|----------|---------------------|
| `fullName` | Text (Short text) | **Max length:** 100, **Required:** true, **Help:** "Your name (displayed in hero)" | ⚠️ **Renamed:** Was `name` in original design |
| `occupation` | Text (Short text) | **Max length:** 200, **Required:** true, **Help:** "Your main title/role" | ⚠️ **Renamed:** Was `title` in original design |
| `flipWords` | JSON | **Required:** true, **Help:** "Rotating words for hero animation" | ✅ **As Designed:** Default should be `["ideas", "concepts", "visions", "dreams"]` |
| `heroTaglineTemplate` | Text (Long text) | **Max length:** 200, **Required:** true, **Default:** "Turning {flipWord} into elegant code, one pixel at a time.", **Help:** "Hero tagline with {flipWord} placeholder" | ⚠️ **Changed:** Now required (was optional in design) |
| `heroCTAPrimaryText` | Text (Short text) | **Max length:** 50, **Required:** false, **Default:** "Get Started", **Help:** "Primary button text" | ⚠️ **Renamed:** Capitalized CTA (was `heroCtaPrimaryText`) |
| `heroShowDropdown` | Boolean | **Default:** true, **Help:** "Show dropdown navigation on primary button" | ✅ **As Designed** |
| `heroDropdownOptions` | JSON | **Required:** false, **Help:** "Dropdown navigation options (array of {label, sectionIndex, icon})" | ✅ **As Designed** |
| `heroCTASecondaryText` | Text (Short text) | **Max length:** 50, **Required:** false, **Default:** "View Resume", **Help:** "Secondary button text" | ⚠️ **Renamed:** Capitalized CTA (was `heroCtaSecondaryText`) |
| `heroShowSecondaryButton` | Boolean | **Default:** true, **Help:** "Show/hide resume button" | ✅ **As Designed** |

---

### GROUP 2: About Section Fields

**Used by:** AboutSection component

| Field Name | Type | Settings | Implementation Notes |
|------------|------|----------|---------------------|
| `tagline` | Text (Short text) | **Max length:** 150, **Required:** true, **Help:** "About section tagline" | ⚠️ **Note:** Default value "Building Products That Drive Impact" should be set in Strapi admin |
| `descriptions` | Blocks (Rich text) | **Required:** true, **Help:** "About section paragraphs with rich text formatting" | ⚠️ **Changed:** Now uses Blocks instead of JSON for rich text support |
| `highlights` | Blocks (Rich text) | **Required:** true, **Help:** "Key highlights with checkmarks" | ⚠️ **Changed:** Now uses Blocks instead of JSON for rich text support |
| `stats` | Component (Repeatable) | **Component:** `content.stats`, **Required:** false, **Min:** 0, **Max:** 6, **Help:** "Statistics (years, projects, etc.)" | ✅ **As Designed** |
| `learnMoreCards` | Blocks (Rich text) | **Required:** false, **Help:** "Additional about page cards with rich text formatting" | ⚠️ **Changed:** Now uses Blocks instead of JSON for rich text support |

---

### GROUP 3: Profile & Media

| Field Name | Type | Settings | Implementation Notes |
|------------|------|----------|---------------------|
| `profileImage` | Component (Single) | **Component:** `ui.image-element`, **Required:** false, **Help:** "Profile photo with alt text (enforces accessibility)" | ✅ **As Designed:** Uses `ui.image-element` component |
| `resumeFile` | Media (Single file) | **Required:** false, **Allowed types:** Files, **Help:** "Resume PDF (opened by 'View Resume' button)" | ⚠️ **Note:** Implementation allows all file types, should restrict to PDF only |
| `bio` | Rich Text (Markdown) | **Required:** false, **Help:** "Full biography with rich formatting (for dedicated About page, optional if using descriptions)" | ✅ **As Designed** |

---

### GROUP 4: Additional Information

| Field Name | Type | Settings | Implementation Notes |
|------------|------|----------|---------------------|
| `socialLinks` | Component (Repeatable) | **Component:** `shared.social-links`, **Required:** true, **Min:** 0, **Max:** 1 | ⚠️ **Changed:** Now required (was optional in design) |
| `yearsOfExperience` | Number (Integer) | **Min:** 0, **Max:** 50, **Required:** false | ✅ **As Designed** |
| `location` | Text (Short text) | **Max length:** 100, **Required:** false | ✅ **As Designed:** Placeholder "e.g., San Francisco, CA" should be set in Strapi |
| `education` | Component (Repeatable) | **Component:** `content.education`, **Required:** false, **Min:** 0, **Max:** 10, **Help:** "Educational credentials with 11 fields: type, degree, field, institution, dates, location, gpa, description, honors" | ✅ **Production-Ready:** All critical issues FIXED (gpa 0-5, honors string max 200, description max 1000) |

---

### GROUP 5: AI/Vector Search (Advanced)

| Field Name | Type | Settings | Implementation Notes |
|------------|------|----------|---------------------|
| `bioEmbedding` | JSON | **Required:** false, **Help:** "Vector embedding for semantic search (768 dimensions, auto-generated)" | ✅ **As Designed** |
| `bioEmbeddingModel` | Text (Short text) | **Max length:** 50, **Required:** false | ⚠️ **Note:** Default value "gemini-textembedding-gecko" should be set in Strapi admin |
| `bioEmbeddingGeneratedAt` | DateTime | **Required:** false | ✅ **As Designed** |

---

## 📋 Field Count

**Total Fields:** 23 fields (organized into 5 logical groups)
- Hero Section: 9 fields
- About Section: 5 fields
- Profile & Media: 3 fields (profileImage uses ui.image-element component)
- Additional Info: 4 fields
- AI/Vector: 3 fields

---

## 📖 Example Content

### Hero Section Data

```json
{
  "fullName": "Aldrin Azucena",
  "occupation": "Full Stack Software Developer",
  "flipWords": ["ideas", "concepts", "visions", "dreams"],
  "heroTaglineTemplate": "Turning {flipWord} into elegant code, one pixel at a time.",
  "heroCTAPrimaryText": "Get Started",
  "heroShowDropdown": true,
  "heroDropdownOptions": [
    { "label": "Learn About Me", "sectionIndex": 1, "icon": "user" },
    { "label": "Explore My Work", "sectionIndex": 2, "icon": "briefcase" },
    { "label": "See My Journey", "sectionIndex": 3, "icon": "clock-circle" },
    { "label": "Seek My Tech Stack", "sectionIndex": 4, "icon": "code" },
    { "label": "Read Testimonials", "sectionIndex": 5, "icon": "message-dots" },
    { "label": "Browse Articles", "sectionIndex": 6, "icon": "file-text" },
    { "label": "View Achievements", "sectionIndex": 7, "icon": "badge" }
  ],
  "heroCTASecondaryText": "View Resume",
  "heroShowSecondaryButton": true
}
```

### About Section Data

**Note:** `descriptions`, `highlights`, and `learnMoreCards` now use **Blocks (rich text)** instead of JSON.

```json
{
  "tagline": "Building Products That Drive Impact",
  "descriptions": {
    "type": "blocks",
    "content": [
      {
        "type": "paragraph",
        "children": [
          {
            "type": "text",
            "text": "I'm a full-stack professional who transforms ideas into market-ready products. From rapid MVP development to enterprise-scale systems, I build high-performance SaaS, web, and mobile applications that deliver measurable business impact."
          }
        ]
      },
      {
        "type": "paragraph",
        "children": [
          {
            "type": "text",
            "text": "With expertise spanning TypeScript, Python, PHP, and Java, I leverage AI-powered workflows to create smarter, scalable solutions. I specialize in legacy system modernization, complex database migrations, and delivering secure, compliant applications that users love."
          }
        ]
      }
    ]
  },
  "highlights": {
    "type": "blocks",
    "content": [
      {
        "type": "list",
        "format": "unordered",
        "children": [
          { "type": "list-item", "children": [{ "type": "text", "text": "Full-Stack Development & Architecture" }] },
          { "type": "list-item", "children": [{ "type": "text", "text": "MVP to Enterprise Scaling" }] },
          { "type": "list-item", "children": [{ "type": "text", "text": "AI-Integrated Applications" }] },
          { "type": "list-item", "children": [{ "type": "text", "text": "Secure & Compliant Engineering" }] },
          { "type": "list-item", "children": [{ "type": "text", "text": "Legacy System Modernization" }] },
          { "type": "list-item", "children": [{ "type": "text", "text": "Clear Communication & Collaboration" }] }
        ]
      }
    ]
  },
  "stats": [
    { "value": "4+", "label": "Years Experience" },
    { "value": "30+", "label": "Databases Migrated" },
    { "value": "50+", "label": "Client Sites Managed" }
  ],
  "learnMoreCards": {
    "type": "blocks",
    "content": [
      {
        "type": "paragraph",
        "children": [
          {
            "type": "text",
            "text": "Get to Know Me - Interests, hobbies, and what drives me",
            "metadata": {
              "link": "/about",
              "icon": "smile",
              "gradient": "cyan-to-blue"
            }
          }
        ]
      },
      {
        "type": "paragraph",
        "children": [
          {
            "type": "text",
            "text": "Career Journey - Interactive timeline of my professional growth",
            "metadata": {
              "link": "/journey",
              "icon": "chart",
              "gradient": "purple-to-pink"
            }
          }
        ]
      }
    ]
  }
}
```

**Frontend Migration Note:** You'll need to convert Blocks content to your frontend format. Strapi's Blocks type provides a rich text structure similar to Notion or Contentful.

### Additional Information (Demonstrating All Education Fixes)

```json
{
  "education": [
    {
      "id": 1,
      "type": "diploma",
      "degree": "Diploma in Computer Science",
      "field": "Computer Science",
      "institution": "Your Institution Name",
      "location": "Calgary, AB, Canada",
      "startDate": "2019-09-01",
      "graduationDate": "2021-06-15",
      "current": false,
      "gpa": 3.5,
      "honors": null,
      "description": "<p>Focused on web development and database management. Completed capstone project on responsive web design.</p>"
    },
    {
      "id": 2,
      "type": "bachelor",
      "degree": "B.S. Computer Science",
      "field": "Computer Science",
      "institution": "University of Lethbridge",
      "location": "Lethbridge, AB, Canada",
      "startDate": "2021-09-01",
      "graduationDate": "2023-05-30",
      "current": false,
      "gpa": 3.85,
      "honors": "Summa Cum Laude, Dean's List 2021-2023",
      "description": "<p><strong>Thesis:</strong> Advanced Neural Networks for NLP</p><p><strong>Focus Areas:</strong> AI/ML, Deep Learning, NLP</p>"
    },
    {
      "id": 3,
      "type": "master",
      "degree": "M.S. Artificial Intelligence",
      "field": "Computer Science",
      "institution": "Stanford University",
      "location": "Stanford, CA, USA",
      "startDate": "2023-09-01",
      "current": true,
      "gpa": 4.2,
      "honors": "Graduate Fellowship Recipient",
      "description": "<p>Specializing in Large Language Models and RAG systems. Research on transformer architectures.</p>"
    }
  ],
  "location": "San Francisco, CA",
  "yearsOfExperience": 4
}
```

**Education Component Implementation (Production-Ready - All Fixes Applied):**
- ✅ **All Critical Issues FIXED:** 3 data type/range issues resolved (2025-11-29)
- ✅ **GPA Range Fixed:** 0-5 (was 1-4) - now supports weighted GPAs (4.2 in example 3)
- ✅ **Honors Type Fixed:** String max 200 (was boolean) - now stores actual honor names ("Summa Cum Laude, Dean's List 2021-2023")
- ✅ **Description Bounded:** Max 1000 chars (was unbounded) - prevents bloat, ~150-200 words per entry
- ✅ **Required Fields:** `type`, `degree`, `field`, `institution`, `startDate`, `current` (always required)
- ✅ **Conditional Field:** `graduationDate` (date, visible only when `current` = false)
- ✅ **Optional Fields (All Fixed):** `location` (max 200), `gpa` (0-5), `description` (max 1000), `honors` (string max 200)
- ✅ **Conditional Visibility:** `graduationDate` automatically hidden when `current` is true (prevents data entry errors)
- ✅ **Rich Text Support:** `description` field uses Markdown/HTML for formatted content (thesis topics, coursework, honors details)
- ✅ **Data Quality:** All examples demonstrate fixes: weighted GPA support, honor names stored, bounded descriptions

---

## 🎨 Icon & Gradient Options

### Available Icons (from @mynaui/icons)
- `user`, `briefcase`, `clock-circle`, `code`, `message-dots`, `file-text`, `badge`
- `smile`, `chart`, `award`, `book`, `heart`, `star`, `trophy`

### Available Gradients (for learnMoreCards)
- `cyan-to-blue` - Cyan to Blue
- `purple-to-pink` - Purple to Pink
- `emerald-to-teal` - Emerald to Teal
- `orange-to-red` - Orange to Red
- `indigo-to-purple` - Indigo to Purple

---

## 📝 Important Notes

### Hero Section Integration
- HeroSection component uses AboutData, not a separate Hero Banner
- `flipWords` creates the rotating text effect in hero
- `heroTaglineTemplate` uses `{flipWord}` as placeholder
- Dropdown navigation can be customized via `heroDropdownOptions`

### About Section Usage
- `descriptions` is used for paragraph display (JSON array)
- `bio` is optional rich text for full About page
- `learnMoreCards` controls the additional page links
- `stats` component should match structure: `{ value: string, label: string }`

### Profile & Media
- `profileImage` uses `ui.image-element` component (enforces accessibility by requiring alt text)
- Component structure: `{ src: Media, altText: string (required, max 150) }`
- Reusable across other content types (Projects, Blog, Testimonials)
- Prevents "forgot alt text" accessibility bugs

### Education Component Implementation (Production-Ready - All Critical Issues FIXED)
- `education` uses `content.education` repeatable component (supports multiple degrees, diplomas, certifications)
- **✅ Production-Ready (All Fixes Applied - 11 Fields Total):**
  - **Required Fields (7):** `type` (diploma/bachelor/master/doctorates/certificate), `degree`, `field`, `institution`, `startDate` (date), `graduationDate` (date - conditional), `current` (boolean)
  - **Optional Fields (4 - ALL FIXED):** `location` (max 200), `gpa` (0-5 scale), `description` (max 1000), `honors` (string max 200)
- **✅ Critical Fixes Applied (2025-11-29):**
  - **GPA Range Fixed:** 0-5 (was 1-4) - now supports weighted GPAs (4.0-5.0 scale) and international variations
  - **Honors Type Fixed:** String max 200 (was boolean) - now stores actual honor names ("Summa Cum Laude, Dean's List 2021-2023")
  - **Description Bounded:** Max 1000 chars (was unbounded) - prevents bloat, allows ~150-200 words of context
  - **Location Correct:** Max 200 (already correct) - accommodates full institutional addresses
- **Date Field Precision:** Uses `startDate`/`graduationDate` (date type) instead of `startYear`/`endYear` (integer) for precise graduation records
- **Conditional Logic:** `graduationDate` is only visible when `current` is false (hidden for in-progress education, prevents data entry errors)
- **Multi-Record Design:** Supports diploma + bachelor + master's/PhD pipeline with expandable structure for certifications, courses, or additional degrees
- **Best Practices (Incorporating Fixes):**
  - Use `current: true` for in-progress education (e.g., ongoing master's program)
  - Order chronologically (oldest to newest recommended for timeline display)
  - Use `gpa` to showcase academic performance (0.0-5.0 scale supports unweighted and weighted GPAs)
  - Use `location` for geographic context (institution city, state/province, country)
  - Use `description` for rich context: thesis topics, notable coursework, focus areas (max 1000 chars)
  - Use `honors` field to store actual honor names: "Magna Cum Laude", "Dean's List", "President's Honor Roll"

### pgVector Integration
- `bioEmbedding` stores 768-dimensional vector from Gemini
- Used for semantic search and RAG in AI-powered forms
- Auto-generated via lifecycle hooks when bio is updated
- See [pgVector Configuration](./08-pgvector-setup.md) for implementation

### Accessibility
- `ui.image-element` component enforces alt text for all images (required field)
- Use semantic icon names in `heroDropdownOptions`
- Ensure contrast ratios meet WCAG AA standards
- Component-based approach prevents accessibility regressions

---

## Single Type 3: Website Configuration - REVISED ✨

**Display Name:** `Website Configuration`
**API ID (Singular):** `website-configuration`
**API ID (Plural):** N/A (Single Type)

### Advanced Settings

- **Draft & Publish:** ❌ Disabled (settings should be immediately active)
- **Internationalization (i18n):** ❌ Disabled (internal configuration)

---

## 🎯 Organized Field Groups

### GROUP 1: Site Identity

**User-friendly for:** Everyone (marketing, non-technical)

| Field Name | Type | Settings |
|------------|------|----------|
| `siteName` | Text (Short text) | **Max length:** 100, **Required:** true, **Default:** "Aldrin Azucena", **Help:** "Your portfolio name" |
| `siteUrl` | Text (Short text) | **Max length:** 200, **Required:** true, **Regex:** `^https?://.*`, **Placeholder:** "https://aazucena.vercel.app", **Help:** "Full site URL (include https://)" |
| `siteTagline` | Text (Short text) | **Max length:** 200, **Required:** false, **Placeholder:** "Full Stack Software Developer", **Help:** "Short description of who you are" |
| `baseUrl` | Text (Short text) | **Max length:** 50, **Required:** false, **Default:** "/", **Help:** "Base path for site (usually '/')" |
| `siteLogo` | Media (Single image) | **Required:** false, **Allowed types:** Images only, **Help:** "Main site logo" |
| `favicon` | Media (Single image) | **Required:** false, **Allowed types:** Images only, **Help:** "Browser tab icon (16x16 or 32x32px)" |

---

### GROUP 2: SEO & Meta Tags

**User-friendly for:** Marketing, SEO specialists

| Field Name | Type | Settings |
|------------|------|----------|
| `defaultSEO` | Component (Single) | **Component:** `shared.seo`, **Required:** true, **Help:** "Default SEO metadata for all pages" |
| `metaTitle` | Text (Short text) | **Max length:** 60, **Required:** false, **Default:** "Aldrin Azucena", **Help:** "Browser tab title" |
| `metaTitleTemplate` | Text (Short text) | **Max length:** 100, **Required:** false, **Default:** "%s — Aldrin Azucena", **Help:** "Template for page titles (%s = page name)" |
| `metaDescription` | Text (Long text) | **Max length:** 160, **Required:** false, **Help:** "Default meta description for search engines" |
| `openGraphSiteName` | Text (Short text) | **Max length:** 100, **Required:** false, **Help:** "Site name for social media shares" |
| `openGraphImage` | Media (Single image) | **Required:** false, **Help:** "Default share image (1200x628px recommended)" |
| `openGraphType` | Enumeration | **Values:** `website`, `article`, `profile` - **Default:** `website` |
| `twitterHandle` | Text (Short text) | **Max length:** 50, **Required:** false, **Regex:** `^@.*`, **Placeholder:** "@yourhandle", **Help:** "Your Twitter/X handle (include @)" |
| `twitterCardType` | Enumeration | **Values:** `summary`, `summary_large_image` - **Default:** `summary_large_image` |
| `robotsIndex` | Boolean | **Default:** true, **Help:** "Allow search engines to index site" |
| `robotsFollow` | Boolean | **Default:** true, **Help:** "Allow search engines to follow links" |
| `googleSiteVerificationId` | Text (Short text) | **Max length:** 100, **Required:** false, **Help:** "Google Search Console verification code" |

---

### GROUP 3: Internationalization (i18n)

**User-friendly for:** Content managers, translators

| Field Name | Type | Settings |
|------------|------|----------|
| `defaultLanguage` | Enumeration | **Values:** `en`, `es`, `fr`, `de`, `ja`, `zh` - **Default:** `en`, **Help:** "Primary site language" |
| `textDirection` | Enumeration | **Values:** `ltr` (Left to Right), `rtl` (Right to Left) - **Default:** `ltr`, **Help:** "Text reading direction" |
| `enableMultilingual` | Boolean | **Default:** false, **Help:** "Enable multi-language support (requires i18n setup)" |
| `supportedLanguages` | JSON | **Required:** false, **Placeholder:** `["en", "es", "fr"]`, **Help:** "List of enabled languages" |

---

### GROUP 4: Theme & Branding

**User-friendly for:** Designers, brand managers

| Field Name | Type | Settings |
|------------|------|----------|
| `themeMode` | Enumeration | **Values:** `system`, `light`, `dark`, `light:only`, `dark:only` - **Default:** `system`, **Help:** "Color theme preference" |
| `primaryColor` | Text (Short text) | **Max length:** 20, **Required:** false, **Default:** "#32a0c5", **Regex:** `^#[0-9A-Fa-f]{6}$`, **Help:** "Primary brand color (hex code)" |
| `primaryColorDark` | Text (Short text) | **Max length:** 20, **Required:** false, **Default:** "#32a0c5", **Regex:** `^#[0-9A-Fa-f]{6}$`, **Help:** "Primary color for dark mode" |
| `secondaryColor` | Text (Short text) | **Max length:** 20, **Required:** false, **Default:** "#3b79bc", **Regex:** `^#[0-9A-Fa-f]{6}$` |
| `secondaryColorDark` | Text (Short text) | **Max length:** 20, **Required:** false, **Default:** "#3b79bc", **Regex:** `^#[0-9A-Fa-f]{6}$` |
| `accentColor` | Text (Short text) | **Max length:** 20, **Required:** false, **Default:** "#25c6d2", **Regex:** `^#[0-9A-Fa-f]{6}$` |
| `accentColorDark` | Text (Short text) | **Max length:** 20, **Required:** false, **Default:** "#25c6d2", **Regex:** `^#[0-9A-Fa-f]{6}$` |
| `fontSans` | Text (Short text) | **Max length:** 100, **Required:** false, **Default:** "Fira Sans", **Help:** "Sans-serif font family" |
| `fontSerif` | Text (Short text) | **Max length:** 100, **Required:** false, **Default:** "Fira Sans", **Help:** "Serif font family" |
| `fontHeading` | Text (Short text) | **Max length:** 100, **Required:** false, **Default:** "Fira Sans", **Help:** "Heading font family" |

---

### GROUP 5: Section Visibility

**User-friendly for:** Everyone

| Field Name | Type | Settings |
|------------|------|----------|
| `showHeroSection` | Boolean | **Default:** true, **Help:** "Show/hide main hero banner" |
| `showAboutSection` | Boolean | **Default:** true, **Help:** "Show/hide About Me section" |
| `showProjectsSection` | Boolean | **Default:** true, **Help:** "Show/hide Featured Projects section" |
| `showExperienceSection` | Boolean | **Default:** true, **Help:** "Show/hide Work Experience section" |
| `showSkillsSection` | Boolean | **Default:** true, **Help:** "Show/hide Skills & Technologies section" |
| `showTestimonialsSection` | Boolean | **Default:** true, **Help:** "Show/hide Testimonials section" |
| `showBlogSection` | Boolean | **Default:** true, **Help:** "Show/hide Blog section" |
| `showAwardsSection` | Boolean | **Default:** true, **Help:** "Show/hide Awards & Certifications section" |

---

### GROUP 6: Blog Configuration

**User-friendly for:** Content managers, bloggers

| Field Name | Type | Settings |
|------------|------|----------|
| `blogEnabled` | Boolean | **Default:** true, **Help:** "Enable/disable entire blog feature" |
| `blogPostsPerPage` | Number (Integer) | **Min:** 1, **Max:** 50, **Default:** 6, **Help:** "Number of posts per page" |
| `blogPermalink` | Text (Short text) | **Max length:** 100, **Required:** false, **Default:** "/%slug%", **Help:** "URL structure for blog posts" |
| `blogMainPath` | Text (Short text) | **Max length:** 50, **Required:** false, **Default:** "blog", **Help:** "Main blog path (e.g., /blog)" |
| `blogCategoryPath` | Text (Short text) | **Max length:** 50, **Required:** false, **Default:** "category", **Help:** "Category path (e.g., /category)" |
| `blogTagPath` | Text (Short text) | **Max length:** 50, **Required:** false, **Default:** "tag", **Help:** "Tag path (e.g., /tag)" |
| `blogRelatedPostsEnabled` | Boolean | **Default:** true, **Help:** "Show related posts at end of articles" |
| `blogRelatedPostsCount` | Number (Integer) | **Min:** 1, **Max:** 10, **Default:** 4, **Help:** "Number of related posts to show" |

---

### GROUP 7: Animation System

**User-friendly for:** Developers, UX designers

| Field Name | Type | Settings |
|------------|------|----------|
| `animationsEnabled` | Boolean | **Default:** true, **Help:** "Master switch for all animations" |
| `heavyAnimationsEnabled` | Boolean | **Default:** true, **Help:** "Enable Three.js & PixiJS (disable for better performance)" |
| `defaultPerformanceTier` | Enumeration | **Values:** `low`, `medium`, `high`, `auto` - **Default:** `auto`, **Help:** "Animation quality level (auto = device-based detection)" |
| `particleCountLow` | Number (Integer) | **Min:** 0, **Max:** 100, **Default:** 50, **Help:** "Particle count for low-end devices" |
| `particleCountMedium` | Number (Integer) | **Min:** 0, **Max:** 200, **Default:** 100, **Help:** "Particle count for mid-range devices" |
| `particleCountHigh` | Number (Integer) | **Min:** 0, **Max:** 500, **Default:** 200, **Help:** "Particle count for high-end devices" |
| `animationTimingFlipText` | Number (Integer) | **Min:** 1000, **Max:** 10000, **Default:** 3000, **Help:** "Text flip interval (milliseconds)" |
| `animationTimingSectionTransition` | Number (Integer) | **Min:** 100, **Max:** 5000, **Default:** 1000, **Help:** "Section transition duration (milliseconds)" |

---

### GROUP 8: Analytics & Monitoring

**User-friendly for:** Marketing, developers

| Field Name | Type | Settings |
|------------|------|----------|
| `googleAnalyticsId` | Text (Short text) | **Max length:** 50, **Required:** false, **Regex:** `^(G\|UA\|GTM)-.*`, **Placeholder:** "G-XXXXXXXXXX", **Help:** "Google Analytics measurement ID" |
| `vercelAnalyticsEnabled` | Boolean | **Default:** false, **Help:** "Enable Vercel Analytics tracking" |
| `vercelSpeedInsightsEnabled` | Boolean | **Default:** false, **Help:** "Enable Vercel Speed Insights" |
| `plausibleEnabled` | Boolean | **Default:** false, **Help:** "Enable Plausible Analytics (privacy-friendly)" |
| `plausibleDomain` | Text (Short text) | **Max length:** 200, **Required:** false, **Help:** "Plausible Analytics domain" |
| `sentryDSN` | Text (Short text) | **Max length:** 200, **Required:** false, **Help:** "Sentry error tracking DSN (for developers)" |
| `sentryEnabled` | Boolean | **Default:** false, **Help:** "Enable Sentry error monitoring" |

---

### GROUP 9: Easter Egg & Engagement

**User-friendly for:** Everyone (fun feature!)

| Field Name | Type | Settings |
|------------|------|----------|
| `easterEggEnabled` | Boolean | **Default:** true, **Help:** "Enable hidden Easter Egg challenge" |
| `easterEggChallenge` | Text (Long text) | **Max length:** 1000, **Required:** false, **Help:** "Easter Egg challenge description" |
| `easterEggKeywords` | JSON | **Required:** false, **Placeholder:** `["konami", "secret", "hidden"]`, **Help:** "Keywords to unlock Easter Egg" |
| `easterEggReward` | Text (Long text) | **Max length:** 500, **Required:** false, **Help:** "Message/reward when Easter Egg is found" |

---

### GROUP 10: Maintenance & System

**User-friendly for:** Developers, site admins

| Field Name | Type | Settings |
|------------|------|----------|
| `maintenanceMode` | Boolean | **Default:** false, **Help:** "Enable maintenance mode (shows message to visitors)" |
| `maintenanceMessage` | Text (Long text) | **Max length:** 500, **Required:** false, **Placeholder:** "Site is under maintenance. Back soon!", **Help:** "Message to display during maintenance" |
| `trailingSlash` | Boolean | **Default:** false, **Help:** "Add trailing slash to URLs (e.g., /about/)" |
| `cleanUrls` | Boolean | **Default:** true, **Help:** "Remove .html from URLs (e.g., /about instead of /about.html)" |

---

## 📋 Complete Field Count

**Total Fields:** 61 fields (organized into 10 logical groups)

**Previous:** 15 fields (flat, disorganized)
**Revised:** 61 fields (grouped, comprehensive, user-friendly)

---

## 🎯 Key Improvements

### 1. **Matches Your config.yaml**
- ✅ All site settings (URL, base, verification)
- ✅ Complete SEO/meta configuration
- ✅ i18n settings (language, text direction)
- ✅ Theme & branding (colors, fonts)
- ✅ Blog configuration (postsPerPage, paths, etc.)

### 2. **Sophisticated Animation System**
- ✅ Performance tiers (low/medium/high/auto)
- ✅ Particle count per tier
- ✅ Animation timing settings
- ✅ Heavy animations toggle (Three.js, PixiJS)

### 3. **Per-Section Visibility**
- ✅ 8 individual section toggles
- ✅ Matches your actual sections: hero, about, projects, experience, skills, testimonials, blog, awards

### 4. **Comprehensive Analytics**
- ✅ Google Analytics
- ✅ Vercel Analytics + Speed Insights
- ✅ Plausible Analytics (privacy-friendly)
- ✅ Sentry error tracking

### 5. **Better Organization**
- ✅ 10 logical groups (Identity, SEO, i18n, Theme, Sections, Blog, Animation, Analytics, Easter Egg, Maintenance)
- ✅ Help text for every field
- ✅ User-friendly for all technical levels

### 6. **Accessibility Features**
- ✅ Clear labels and descriptions
- ✅ Regex validation for URLs, hex colors, Twitter handles
- ✅ Sensible defaults
- ✅ Min/max constraints

---

## 🔧 API Usage Example

```typescript
// Fetch website configuration
const response = await fetch('http://localhost:1337/api/website-configuration');
const { data } = await response.json();

// Type-safe access
const config = data.attributes;

// Site identity
console.log(config.siteName); // "Aldrin Azucena"
console.log(config.siteUrl); // "https://aazucena.vercel.app"

// Animation settings
if (config.animationsEnabled) {
  const tier = config.defaultPerformanceTier; // "auto", "low", "medium", "high"
  const particleCount = config[`particleCount${tier.charAt(0).toUpperCase() + tier.slice(1)}`];
}

// Section visibility
const sectionsToRender = {
  hero: config.showHeroSection,
  about: config.showAboutSection,
  projects: config.showProjectsSection,
  // ... etc
};

// Blog configuration
if (config.blogEnabled) {
  const postsPerPage = config.blogPostsPerPage; // 6
  const blogPath = config.blogMainPath; // "blog"
}

// Theme
const theme = config.themeMode; // "system", "light", "dark"
const colors = {
  primary: config.primaryColor,
  primaryDark: config.primaryColorDark,
  // ... etc
};
```

---

## API Endpoints

### Portfolio (includes Hero content)

```bash
# Get portfolio data (includes hero section data)
GET http://localhost:1337/api/portfolio

# With populated components
GET http://localhost:1337/api/portfolio?populate=socialLinks,stats,profileImage,education

# Full population (all nested components)
GET http://localhost:1337/api/portfolio?populate=deep
```

**Example Response:**
```json
{
  "data": {
    "id": 1,
    "attributes": {
      "fullName": "Aldrin Azucena",
      "occupation": "Full Stack Software Developer",
      "flipWords": ["ideas", "concepts", "visions", "dreams"],
      "heroTaglineTemplate": "Turning {flipWord} into elegant code...",
      "heroCTAPrimaryText": "Get Started",
      "heroCTASecondaryText": "View Resume",
      "tagline": "Building Products That Drive Impact",
      "descriptions": { "type": "blocks", "content": [...] },
      "highlights": { "type": "blocks", "content": [...] },
      "stats": [...],
      "learnMoreCards": { "type": "blocks", "content": [...] },
      "profileImage": {
        "src": { "url": "...", "width": 400, "height": 400 },
        "altText": "Aldrin Azucena profile photo"
      },
      "education": [
        {
          "type": "bachelor",
          "degree": "B.S. Computer Science",
          "field": "Computer Science",
          "institution": "University of Lethbridge",
          "startDate": "2021-09-01",
          "graduationDate": "2023-05-30",
          "current": false
        }
      ]
    }
  }
}
```

### Website Configuration

```bash
# Get website configuration
GET http://localhost:1337/api/website-configuration

# With populated SEO
GET http://localhost:1337/api/website-configuration?populate=defaultSEO
```

### ~~Hero Banner~~ (Deprecated)

**Note:** Hero Banner endpoint is deprecated. Use `/api/portfolio` instead for hero content.

---

## Verification Checklist

After creating all Single Types:

### Single Types Status
- [x] **~~Hero Banner~~** - 🔴 DEPRECATED (merged into Portfolio) - DELETED ✅
- [x] **Portfolio (with Hero fields)** - ✅ IMPLEMENTED (renamed from About)
- [ ] **Website Configuration** - ⚠️ Needs revision (61 fields)

### Configuration Checklist
- [x] Remove Hero Banner from Content-Type Builder ✅
- [x] Delete `apps/cms/src/api/hero-banner/` folder ✅
- [x] Add 9 hero fields to Portfolio single type (GROUP 1) ✅
- [x] Add `learnMoreCards` field to Portfolio single type ✅
- [x] Make `bio` field optional in Portfolio ✅
- [x] Use `ui.image-element` component for `profileImage` ✅
- [x] Use `content.education` repeatable component for `education` ✅
- [ ] Add all 61 fields to Website Configuration
- [x] Test Portfolio API endpoint with hero fields
- [x] Update frontend to use Portfolio for hero content

### After Implementation
- [x] Draft & Publish enabled for Portfolio ✅
- [ ] Draft & Publish disabled for Website Configuration
- [x] i18n enabled for Portfolio ✅
- [ ] i18n disabled for Website Configuration
- [x] API endpoint `/api/portfolio` returns 200 OK with hero fields ✅
- [ ] API endpoint `/api/website-configuration` returns 200 OK with all 61 fields
- [x] All components properly linked (Social Links, Stats, Image Element, Education) ✅

### Field Name Changes (Portfolio Implementation vs Design)
- ✅ `name` → `fullName` (more explicit)
- ✅ `title` → `occupation` (clearer semantic meaning)
- ✅ `heroCtaPrimaryText` → `heroCTAPrimaryText` (capitalized CTA)
- ✅ `heroCtaSecondaryText` → `heroCTASecondaryText` (capitalized CTA)
- ✅ `descriptions`, `highlights`, `learnMoreCards`: JSON → Blocks (rich text support)
- ✅ Education component: `startYear`/`endYear` → `startDate`/`graduationDate` (date type for precision)

---

## Common Issues

### Issue: Component Not Available

**Cause:** Components must be created before Single Types

**Solution:**
- Verify all 9 components exist in Components section (shared.seo, shared.open-graph, shared.social-links, media.audio-metadata, ui.cta-button, ui.image-element, content.stats, content.achievement, content.education)
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

**Last Updated:** 2025-11-29

**Recent Changes:**
- ✅ **Single Type Renamed** - "About" → "Portfolio" (API ID: `about` → `portfolio`)
- ✅ **Hero Banner DELETED** - Completely removed from Strapi (merged into Portfolio)
- ✅ **Education Component Added** - Uses `content.education` repeatable component with date fields (`startDate`, `graduationDate`)
- ✅ **Image Element Component** - Uses `ui.image-element` component for `profileImage` (enforces accessibility)
- ✅ **Field Count** - 23 fields total across 5 logical groups
- ✅ **Rich Text Support** - `descriptions`, `highlights`, `learnMoreCards` use Blocks (was JSON)
- ✅ **Date Precision** - Education uses `startDate`/`graduationDate` (date type) instead of `startYear`/`endYear` (integer)
- ✅ **Conditional Logic** - `graduationDate` hidden when `current` is true
- ✅ **Website Configuration REVISED** - Complete overhaul with 61 fields (was 15)
- ✅ Organized into 10 logical groups for better UX (Website Config) and 5 groups (Portfolio)
- ✅ Added sophisticated animation system (performance tiers, particle counts)
- ✅ Added per-section visibility controls (8 sections)
- ✅ Added comprehensive SEO, i18n, theme, and analytics fields
- ✅ **Education Component FIXED (2025-11-29)** - All critical issues resolved:
  - **GPA Range Fixed:** 0-5 (was 1-4) - now supports weighted GPAs (4.0-5.0)
  - **Honors Type Fixed:** String max 200 (was boolean) - now stores actual honor names
  - **Description Bounded:** Max 1000 chars (was unbounded) - prevents bloat
  - **Production-Ready Status:** Component now ready for production use

**Implementation vs Design Differences:**
- ⚠️ **Field Names:** `name` → `fullName`, `title` → `occupation`
- ⚠️ **CTA Fields:** `heroCtaPrimaryText` → `heroCTAPrimaryText` (capitalized)
- ⚠️ **Data Types:** JSON → Blocks for `descriptions`, `highlights`, `learnMoreCards`
- ⚠️ **Required Changes:** `heroTaglineTemplate` now required, `socialLinks` now required
- ✅ **Education Component Production-Ready:** All critical issues FIXED (gpa 0-5, honors string max 200, description max 1000)

**Breaking Changes:**
- 🚨 **API Endpoint Changed:** `/api/about` → `/api/portfolio`
- 🚨 **Field Name Changes:** Frontend must update to use `fullName` and `occupation`
- 🚨 **CTA Field Names:** Update to `heroCTAPrimaryText` and `heroCTASecondaryText`
- 🚨 **Blocks Migration:** Convert JSON data to Blocks format for rich text fields
- 🚨 **Education Dates:** Use date format ("2023-05-30") instead of integers (2023)

**[← Back to Components](./02-components.md)** | **[Next: Core Collection Types →](./04-collection-types-core.md)**
