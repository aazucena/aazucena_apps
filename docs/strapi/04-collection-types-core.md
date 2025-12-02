# Collection Types: Core

**[← Back to Single Types](./03-single-types.md)** | **[Next: Collection Types - Content →](./05-collection-types-content.md)**

---

## Overview

These are the foundational Collection Types that other content types depend on. Create these **first** before creating Projects, Experience, Blog Posts, etc.

**Creation Location:** `Content-Type Builder > Create new collection type`

---

## ⚠️ Known Strapi v5 Issues

Before creating these Collection Types, be aware of these known bugs:

### UID Field Auto-Generation Bug

**Issue:** UID fields (slugs) do not auto-generate correctly in Strapi v5.

**Symptoms:**
- If UID is NOT required: slug remains empty
- If UID IS required: uses collection name instead of attached field value

**Workarounds:**

**Option 1: Install Plugin**
```bash
npm install strapi-plugin-auto-slug-manager-a-mi13
```

**Option 2: Manual Generation in Middleware**
```typescript
// src/middlewares/slug-generator.ts
export default (config, { strapi }) => {
  return async (ctx, next) => {
    await next();
    // Generate slug from title/name field
  };
};
```

**Option 3: Frontend Validation**
```typescript
// Require users to manually enter slugs in admin panel
// Add validation to ensure slug is unique
```

**See:** [GitHub Issue #21472](https://github.com/strapi/strapi/issues/21472)

**Impact:** Affects Music Genres, Blog Series (and all content types with UID fields in docs 05-07)

### Enumeration Naming Constraint

**Rule:** All enumeration values MUST start with an alphabetical character (A-Z, a-z).

**Valid:**
- ✅ `Frontend`, `Backend`, `Database`
- ✅ `In Progress`, `Completed`, `On Hold`
- ✅ `First Place`, `Award 2023`

**Invalid (Will Crash GraphQL Plugin):**
- ❌ `1st Place`, `2nd Place`, `3rd Place`
- ❌ `2023 Award`, `2024 Award`
- ❌ `100% Complete`

**Workaround:** Prefix numbers with text: `Place 1st`, `Award 2023`, `Complete 100%`

**Why:** GraphQL schema generation fails when enum values start with numbers or special characters.

---

## Collection Type 1: Skills

**Display Name:** `Skill`
**API ID (Singular):** `skill`
**API ID (Plural):** `skills`

### Advanced Settings

- **Draft & Publish:** ❌ Disabled (skills don't need drafts)
- **Default sort attribute:** `order` (ascending)
- **Internationalization (i18n):** ✅ Enabled (for future language support)

### Fields

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

### Relations

**Note:** Create these relations AFTER creating the related content types.

- `projects` → Many-to-many → Projects (create after Projects collection exists)
- `parentSkill` → Many-to-one → Skills (self-relation for skill hierarchies)
- `subSkills` → One-to-many → Skills (reverse of parentSkill)

**Click "Save"**

### Relation Setup Instructions

**After creating Projects content type:**

1. Go back to Skills content type
2. Add new relation field:
   - Field name: `projects`
   - Relation type: Many-to-many
   - Related to: Projects
3. Save Skills content type

**For skill hierarchies (self-relation):**

1. Add relation field:
   - Field name: `parentSkill`
   - Relation type: Many-to-one
   - Related to: Skills (same content type)
2. Add reverse relation:
   - Field name: `subSkills`
   - Relation type: One-to-many
   - Related to: Skills
3. Save

### Notes

- Skills content type is cached in Redis for performance (per requirements)
- `isCore` helps identify primary skills for homepage display
- Self-relation allows skill hierarchies (e.g., JavaScript → React → Next.js)

### Example Skill Hierarchy

```
JavaScript (parent)
  ├── React (child)
  │   ├── Next.js (grandchild)
  │   └── React Hooks (grandchild)
  └── TypeScript (child)
```

### Example Data

```json
{
  "name": "React",
  "category": "Frontend",
  "proficiency": 95,
  "description": "Expert in building modern React applications with hooks, context, and performance optimization",
  "yearsOfExperience": 5.5,
  "isFeatured": true,
  "isCore": true,
  "url": "https://react.dev",
  "order": 1,
  "parentSkill": { "id": 1, "name": "JavaScript" },
  "subSkills": [
    { "id": 3, "name": "Next.js" },
    { "id": 4, "name": "React Hooks" }
  ]
}
```

---

## Collection Type 2: Music Genres

**Display Name:** `Music Genre`
**API ID (Singular):** `music-genre`
**API ID (Plural):** `music-genres`

### Advanced Settings

- **Draft & Publish:** ❌ Disabled (genres are simple taxonomy)
- **Default sort attribute:** `name` (ascending)
- **Internationalization (i18n):** ✅ Enabled (for future language support)

### Fields

| Field Name | Type | Settings |
|------------|------|----------|
| `name` | Text (Short text) | **Max length:** 100, **Required:** true, **Unique:** true, **Placeholder:** "e.g., Electronic, Hip-Hop, Ambient" |
| `slug` | UID | **Attached field:** `name`, **Required:** true |
| `description` | Text (Long text) | **Max length:** 500, **Required:** false |
| `color` | Text (Short text) | **Max length:** 7, **Required:** false, **Regex:** `^#([A-Fa-f0-9]{6}\|[A-Fa-f0-9]{3})$`, **Placeholder:** "Hex color for UI (e.g., #FF5733)" |
| `icon` | Text (Short text) | **Max length:** 50, **Required:** false, **Placeholder:** "Icon name from @mynaui/icons-react" |
| `coverImage` | Media (Single image) | **Required:** false, **Allowed types:** Images only |
| `order` | Number (Integer) | **Min:** 0, **Required:** false, **Default:** 0 |

### Relations

- `compositions` → One-to-many → Compositions (reverse relation, create after Compositions)

**Click "Save"**

### Notes

- Used for genre-based filtering of compositions (per requirements)
- Each composition can belong to multiple genres
- Color field helps create visual distinction in UI
- Slug auto-generated from name

### Color Coding Example

```json
{
  "Electronic": "#FF6B6B",
  "Hip-Hop": "#4ECDC4",
  "Ambient": "#95E1D3",
  "Jazz": "#F38181",
  "Rock": "#AA96DA"
}
```

### Example Data

```json
{
  "name": "Electronic",
  "slug": "electronic",
  "description": "Electronic music encompasses a wide range of styles including house, techno, and drum & bass",
  "color": "#FF6B6B",
  "icon": "music-waves",
  "coverImage": "electronic-cover.jpg",
  "order": 1
}
```

---

## Collection Type 3: Blog Series

**Display Name:** `Blog Series`
**API ID (Singular):** `blog-series`
**API ID (Plural):** `blog-series`

### Advanced Settings

- **Draft & Publish:** ✅ Enabled
- **Default sort attribute:** `order` (ascending)
- **Internationalization (i18n):** ✅ Enabled (for future language support)

### Fields

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

### Relations

- `posts` → One-to-many → Blog Posts (reverse relation, create after Blog Posts)

**Click "Save"**

### Notes

- Dedicated content type for blog series management (per requirements)
- Allows organizing multi-part tutorials and article sequences
- Status field helps readers know if series is complete or ongoing
- Featured series can be highlighted on blog index page

### Series Status Guide

- **Planned:** Series announced but not yet started
- **In Progress:** Actively publishing posts in this series
- **Completed:** All posts published, series is finished
- **On Hold:** Series paused, may resume later

### Example Data

```json
{
  "title": "Building a Portfolio from Scratch",
  "slug": "building-a-portfolio-from-scratch",
  "description": "A comprehensive guide to creating a modern portfolio website with Astro, React, and advanced animations. This series covers everything from initial setup to deployment.",
  "coverImage": "series-portfolio.jpg",
  "coverImageAlt": "Portfolio building tutorial series cover",
  "status": "In Progress",
  "order": 1,
  "featured": true,
  "seo": {
    "metaTitle": "Building a Portfolio from Scratch - Tutorial Series",
    "metaDescription": "Learn to build a modern portfolio with Astro, React, and animations"
  }
}
```

---

## API Endpoints

### Skills

```bash
# Get all skills
GET http://localhost:1337/api/skills

# Get skills by category
GET http://localhost:1337/api/skills?filters[category][$eq]=Frontend

# Get featured skills
GET http://localhost:1337/api/skills?filters[isFeatured][$eq]=true

# Get single skill with relations
GET http://localhost:1337/api/skills/1?populate=projects,parentSkill,subSkills

# Get skills sorted by proficiency
GET http://localhost:1337/api/skills?sort=proficiency:desc
```

### Music Genres

```bash
# Get all genres
GET http://localhost:1337/api/music-genres

# Get single genre with compositions
GET http://localhost:1337/api/music-genres/1?populate=compositions

# Get genres sorted by name
GET http://localhost:1337/api/music-genres?sort=name:asc
```

### Blog Series

```bash
# Get all series
GET http://localhost:1337/api/blog-series

# Get featured series
GET http://localhost:1337/api/blog-series?filters[featured][$eq]=true

# Get single series with posts
GET http://localhost:1337/api/blog-series/1?populate=posts,seo

# Get series by status
GET http://localhost:1337/api/blog-series?filters[status][$eq]=Completed
```

---

## Verification Checklist

After creating all 3 core Collection Types:

- [ ] Skills, Music Genres, Blog Series visible in Content Manager
- [ ] All fields have correct validation (max length, regex, min/max)
- [ ] Default values set correctly
- [ ] i18n enabled for Skills and Music Genres
- [ ] SEO component linked to Blog Series
- [ ] API endpoints return 200 OK

---

## Common Issues

### Issue: Cannot Create Skill with Same Name

**Cause:** `name` field has **Unique** constraint

**Solution:**
- Use different skill names
- Or remove uniqueness constraint if duplicates are needed

---

### Issue: Self-Relation Not Working

**Cause:** Incorrect relation setup for `parentSkill` and `subSkills`

**Solution:**
```bash
# Both relations must be created:
1. parentSkill (Many-to-one to Skills)
2. subSkills (One-to-many to Skills)

# They are reverse of each other
```

---

### Issue: Color Validation Fails

**Cause:** Invalid hex color format

**Valid Formats:**
```
#FF5733  (6 characters)
#F57     (3 characters)
```

**Invalid:**
```
FF5733   (missing #)
#FF57    (wrong length)
rgb(255, 87, 51)  (not hex)
```

---

## Next Steps

With core Collection Types created:

1. ✅ **[Create Content Collection Types](./05-collection-types-content.md)** - Projects, Experience, Testimonials
2. ✅ **[Create Relations](./05-collection-types-content.md#relation-setup)** - Link Skills to Projects

---

## Related Documentation

- **[Collection Types: Content](./05-collection-types-content.md)** - Projects depend on Skills
- **[Collection Types: Publishing](./06-collection-types-publishing.md)** - Blog Posts depend on Series
- **[Best Practices](./13-best-practices.md)** - Content type design patterns

---

**Last Updated:** 2025-01-15

**[← Back to Single Types](./03-single-types.md)** | **[Next: Collection Types - Content →](./05-collection-types-content.md)**
