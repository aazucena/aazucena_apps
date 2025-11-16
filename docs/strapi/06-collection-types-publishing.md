# Collection Types: Publishing

**[← Back to Content Types](./05-collection-types-content.md)** | **[Next: AI Forms Types →](./07-collection-types-ai.md)**

---

## Overview

Publishing-focused Collection Types: Blog Posts, Awards, and Compositions (music tracks).

---

## Collection Type 7: Blog Posts

**Display Name:** `Blog Post`
**API ID:** `blog-post` / `blog-posts`

### Fields (abbreviated)

| Field | Type | Key Settings |
|-------|------|--------------|
| `title` | Text | Max 200, Required |
| `slug` | UID | From title, Required |
| `excerpt` | Text (Long) | Max 300, Required |
| `content` | Rich Text | Required |
| `featuredImage` | Media | Required |
| `series` | Relation | Many-to-one → Blog Series |
| `seriesOrder` | Number | Part number in series |
| `relatedPosts` | Relation | Many-to-many → Blog Posts (self) |
| `tags` | Text | Max 255 |
| `category` | Enum | Development, Music, Design, Tutorial, Opinion, News |
| `readTime` | Number | Auto-calculated from content |
| `tableOfContents` | JSON | Auto-generated from headings |
| `contentEmbedding` | JSON | 768 dimensions |
| `seo` | Component | `meta.seo-metadata` |

### Lifecycle Hooks

- Auto-calculate `readTime` from content length
- Auto-generate `tableOfContents` from markdown headings
- Generate `contentEmbedding` for semantic search

### Advanced Settings

- Draft & Publish: ✅ Enabled
- i18n: ✅ Enabled
- Cached in Redis (per requirements)

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
| `year` | Number | Min 1900, Max 2100, Required |
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

```bash
# Blog Posts
GET /api/blog-posts
GET /api/blog-posts?populate=series,relatedPosts,seo
GET /api/blog-posts?filters[series][slug][$eq]=portfolio-series

# Awards
GET /api/awards
GET /api/awards?filters[category][$eq]=Professional
GET /api/awards/1?populate=relatedProject,relatedSkill

# Compositions
GET /api/compositions
GET /api/compositions?populate=genres,audioMetadata
GET /api/compositions?filters[genres][slug][$eq]=electronic
```

---

## Next Steps

**[→ Create AI Forms Types](./07-collection-types-ai.md)** - Form Submissions & Easter Eggs (CRITICAL)

---

**Last Updated:** 2025-01-15

**[← Content Types](./05-collection-types-content.md)** | **[Next: AI Forms →](./07-collection-types-ai.md)**
