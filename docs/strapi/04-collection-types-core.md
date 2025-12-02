# Collection Types: Core

**[← Back to Single Types](./03-single-types.md)** | **[Next: Collection Types - Content →](./05-collection-types-content.md)**

---

## Overview

These are the foundational Collection Types that other content types depend on. Create these **first** before creating Projects, Experience, Blog Posts, etc.

**Note:** This document covers **2 core collection types** (Skills, Music Genres). Blog-related content types (Post, Blog Configuration) are documented in [Collection Types: Publishing](./06-collection-types-publishing.md).

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

**Impact:** Affects Music Genres and other content types with UID fields (see docs 05-07)

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
| `category` | Enumeration | **Values:** `Frontend`, `Backend`, `Database`, `DevOps`, `Design`, `Tools`, `Music Production`, `Other` - **Required:** false |
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

- `projects` → Many-to-many → Projects (mapped by `techStack` on Projects side)
- `experiences` → Many-to-many → Experience (mapped by `skillsUsed` on Experience side)

**Optional Self-Relations (for skill hierarchies):**
- `parentSkill` → Many-to-one → Skills (for organizing skills in tree structure)
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

## Implementation Note: Blog Series

**Note:** The originally planned "Blog Series" collection type was simplified during implementation. Instead of a separate series management system, blog functionality uses:

- **`blog` (Single Type):** Global blog configuration and settings
- **`post` (Collection Type):** Individual blog posts and articles

For detailed documentation on blog-related content types, see [Collection Types: Publishing](./06-collection-types-publishing.md).

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

**Note:** Blog-related API endpoints (posts, blog configuration) are documented in [Collection Types: Publishing](./06-collection-types-publishing.md).

---

## Verification Checklist

After creating the 2 core Collection Types:

- [ ] Skills and Music Genres visible in Content Manager
- [ ] All fields have correct validation (max length, regex, min/max)
- [ ] Default values set correctly
- [ ] i18n enabled for Skills and Music Genres
- [ ] API endpoints return 200 OK (`/api/skills` and `/api/music-genres`)
- [ ] Relations work correctly after creating related content types

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
- **[Collection Types: Publishing](./06-collection-types-publishing.md)** - Blog Posts and Blog Configuration
- **[Best Practices](./13-best-practices.md)** - Content type design patterns

---

**Last Updated:** 2025-12-02

**Changelog:**
- **2025-12-02:** Updated to match actual implementation - removed Blog Series, documented simplified blog structure, fixed Skills category field
- **2025-01-15:** Initial documentation

**[← Back to Single Types](./03-single-types.md)** | **[Next: Collection Types - Content →](./05-collection-types-content.md)**
