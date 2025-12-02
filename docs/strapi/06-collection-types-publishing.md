# Collection Types: Publishing

**[← Back to Content Types](./05-collection-types-content.md)** | **[Next: AI Forms Types →](./07-collection-types-ai.md)**

---

## Overview

Publishing-focused Collection Types: Blog Posts (simplified), Awards, and Compositions (music tracks).

**Note:** The blog implementation was simplified from the original design. Blog Series was not implemented as a separate content type. See [Implementation Note](#implementation-note-blog-architecture) below.

---

## ⚠️ Known Strapi v5 Issues

### UID Field Auto-Generation Bug

**Issue:** UID fields (slugs) do not auto-generate correctly in Strapi v5.

**Impact:** Affects Posts `slug` and Compositions `slug` fields

**See:** [GitHub Issue #21472](https://github.com/strapi/strapi/issues/21472) | **[Workarounds →](./04-collection-types-core.md#uid-field-auto-generation-bug)**

---

## Implementation Note: Blog Architecture

**Original Design:** The blog was originally designed with a separate "Blog Series" collection type for organizing multi-part tutorials.

**Actual Implementation:** Simplified to a single "Post" collection type. Blog Series was not implemented.

**Rationale:** The simplified architecture is more maintainable and covers the current use case. If series functionality is needed in the future, it can be added via a new relation or category system.

---

## Collection Type 7: Posts (Blog Posts)

**Display Name:** `Post`
**API ID (Singular):** `post`
**API ID (Plural):** `posts`

### Advanced Settings

- **Draft & Publish:** ✅ Enabled
- **Default sort attribute:** `sort` (ascending)
- **Internationalization (i18n):** ✅ Enabled (for future language support)

### Fields

| Field Name | Type | Settings |
|------------|------|----------|
| `title` | Text (Short text) | **Max length:** 200, **Required:** true |
| `slug` | UID | **Attached field:** `title`, **Required:** true |
| `description` | Rich Text (Markdown) | **Required:** true |
| `coverImage` | Component | **Component:** `ui.image-element`, **Required:** false, **Repeatable:** false |
| `status` | Enumeration | **Values:** `Planned`, `In Progress`, `Completed`, `On Hold` - **Default:** none |
| `sort` | Number (Integer) | **Min:** 0, **Required:** false, **Default:** 0 |
| `featured` | Boolean | **Default:** false |

**Click "Save"**

### Notes

- Simplified blog post structure without series or advanced features
- Status field helps track article completion state
- Featured flag for highlighting important posts
- i18n enabled for future multilingual content
- Rich text editor supports markdown formatting

### Status Usage Guide

- **Planned:** Article idea/outline created, not yet written
- **In Progress:** Currently writing/editing the post
- **Completed:** Article finished and ready for publication
- **On Hold:** Article paused, may resume later

### Example Data

```json
{
  "title": "Building a Modern Portfolio with Astro",
  "slug": "building-modern-portfolio-astro",
  "description": "Learn how to create a stunning portfolio website using Astro, React, and modern web technologies...",
  "coverImage": {
    "image": "portfolio-tutorial.jpg",
    "altText": "Modern portfolio website screenshot"
  },
  "status": "Completed",
  "sort": 1,
  "featured": true
}
```

---

## Collection Type 8: Awards

**Display Name:** `Award`
**API ID:** `award` / `awards`

### Fields (abbreviated)

| Field | Type | Key Settings |
|-------|------|--------------|
| `title` | Text | Max 200, Required |
| `organization` | Text | Max 150, Required |
| `issuer` | Text | Max 150 |
| `credentialId` | Text | Max 100 |
| `year` | Text | Max 4, Regex: `^(19|20)\d{2}`, Required |
| `description` | Rich Text | |
| `category` | Enum | Academic, Professional, Community, Music, Design, Certification, Competition, Other |
| `verificationUrl` | Text | Max 255, Regex: `^https?://.*` |
| `badge` | Media (Single image) | |
| `certificate` | Media | PDF or images |
| `relatedProject` | Relation | Many-to-one → Projects |
| `relatedSkill` | Relation | Many-to-one → Skills |
| `featured` | Boolean | Default: false |

### Advanced Settings

- Draft & Publish: ✅ Enabled
- Default sort: `year` (descending)
- i18n: ✅ Enabled

---

## Collection Type 9: Compositions

**Display Name:** `Composition`
**API ID:** `composition` / `compositions`

### Fields (abbreviated)

| Field | Type | Key Settings |
|-------|------|--------------|
| `title` | Text | Max 200, Required |
| `slug` | UID | From title, Required |
| `description` | Rich Text | |
| `audioFile` | Media | Audio only, Required |
| `coverArt` | Media (Single image) | |
| `audioMetadata` | Component | `media.audio-metadata`, Required |
| `genres` | Relation | Many-to-many → Music Genres |
| `releaseDate` | Date | Required |
| `featured` | Boolean | Default: false |
| `playCount` | Number | Min 0, Default 0, Auto-incremented |
| `downloadCount` | Number | Min 0, Default 0 |
| `isFreeDownload` | Boolean | Default: false |
| `hasLyrics` | Boolean | Default: false |
| `lyrics` | Rich Text | |
| `spotifyUrl` | Text | Regex: `^https?://open\.spotify\.com/.*` |
| `soundcloudUrl` | Text | Regex: `^https?://soundcloud\.com/.*` |
| `youtubeUrl` | Text | Regex: `^https?://(www\.)?youtube\.com/.*` |
| `collaborators` | Text | Max 255, Comma-separated |

### Advanced Settings

- Draft & Publish: ✅ Enabled
- Default sort: `releaseDate` (descending)
- i18n: ✅ Enabled (for lyrics translation)

### Notes

- Genre-based organization via Music Genres relation
- `playCount` auto-incremented when played
- `hasLyrics` boolean for filtering
- i18n for lyrics translation

---

## API Endpoints

### Posts (Blog Posts)

```bash
# Get all posts
GET http://localhost:1337/api/posts

# Get featured posts only
GET http://localhost:1337/api/posts?filters[featured][$eq]=true

# Get posts by status
GET http://localhost:1337/api/posts?filters[status][$eq]=Completed

# Get single post with cover image
GET http://localhost:1337/api/posts/1?populate=coverImage

# Get posts sorted by sort order
GET http://localhost:1337/api/posts?sort=sort:asc
```

### Awards

```bash
# Get all awards
GET http://localhost:1337/api/awards

# Get awards by category
GET http://localhost:1337/api/awards?filters[category][$eq]=Professional

# Get single award with relations
GET http://localhost:1337/api/awards/1?populate=relatedProject,relatedSkill

# Get featured awards
GET http://localhost:1337/api/awards?filters[featured][$eq]=true
```

### Compositions

```bash
# Get all compositions
GET http://localhost:1337/api/compositions

# Get compositions with metadata
GET http://localhost:1337/api/compositions?populate=genres,audioMetadata

# Get compositions by genre
GET http://localhost:1337/api/compositions?filters[genres][slug][$eq]=electronic

# Get featured compositions
GET http://localhost:1337/api/compositions?filters[featured][$eq]=true
```

---

## Next Steps

**[→ Create AI Forms Types](./07-collection-types-ai.md)** - Form Submissions & Easter Eggs (CRITICAL)

---

**Last Updated:** 2025-12-02

**Changelog:**
- **2025-12-02:** Updated Posts schema to match actual implementation - removed blog-post references, removed advanced features (series, embeddings, auto-processing), documented actual simplified Post structure
- **2025-01-15:** Initial documentation

**[← Content Types](./05-collection-types-content.md)** | **[Next: AI Forms →](./07-collection-types-ai.md)**
