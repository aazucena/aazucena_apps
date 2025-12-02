# Requirements Summary

**[← Back to Prerequisites](./00-prerequisites.md)** | **[Next: Reusable Components →](./02-components.md)**

---

## Overview

This document outlines the confirmed project requirements that guide content type creation, technical decisions, and user experience design.

---

## Content Strategy

Based on confirmed project requirements:

### ✅ Hero Section
- **Type:** Single Type (CMS-editable)
- **Rationale:** Allow easy updates without code changes
- **Features:** Background image/video, CTAs, scroll indicator

### ✅ Music Organization
- **Type:** Genre-based (Collection Type: Music Genres)
- **Rationale:** Simple filtering by genre tags
- **Features:** Genre taxonomy, cover images, color coding
- **No Playlists:** Genre filtering only (per requirements)

### ✅ Blog Architecture
- **Type:** Simplified - Single `post` collection type + `blog` single type for configuration
- **Rationale:** Simplified architecture is more maintainable for current use case
- **Features:** Post status, ordering, cover images
- **Note:** Blog Series was considered but not implemented. Series functionality can be added later if needed via categories or relations.

### ✅ Testimonials
- **Type:** Collection Type with approval workflow
- **Rationale:** Email notifications with rejection reasons
- **Features:** Approval status, rejection reason field, email hooks

### ✅ Projects Display
- **Type:** Collection Type with `featured` field
- **Rationale:** Featured by default on projects page
- **Features:** All projects shown, `isFeaturedOnHome` for homepage

### ✅ Form Retention
- **Type:** Collection Type (Form Submissions)
- **Rationale:** Keep all submissions forever for analytics
- **Features:** No automatic deletion, status tracking

### ✅ Internationalization (i18n)
- **Status:** Enabled for future language support
- **Applies to:** All Single Types and Collection Types
- **Not needed:** Settings (internal configuration)

---

## Technical Configuration

### ✅ Embedding Provider

**Choice:** Google Gemini (textembedding-gecko)

**Specifications:**
- **Model:** `text-embedding-004` (Gemini)
- **Dimensions:** 768
- **Cost:** Free tier available
- **Rationale:** Balance of performance, cost, and Google integration

**Alternative Providers Considered:**
- OpenAI (text-embedding-3-small: 1536 dims, paid)
- Cohere (embed-english-v3.0: 1024 dims, paid)
- Voyage AI (voyage-2: 1024 dims, Claude-optimized, paid)
- Local Models (all-MiniLM-L6-v2: 384 dims, offline)

---

### ✅ pgVector Index Type

**Choice:** ivfflat (speed-optimized)

**Configuration:**
```sql
CREATE INDEX idx_project_description_embedding
  ON projects USING ivfflat (description_embedding vector_cosine_ops)
  WITH (lists = 100);
```

**Rationale:**
- **Speed:** Faster queries than HNSW for medium datasets
- **Trade-off:** 95-99% recall vs 100% brute force
- **Use case:** Portfolio has <1000 entries per content type

**Alternative Considered:**
- HNSW (higher recall, slower build time, better for very large datasets)

---

### ✅ Content Caching

**Cached Content Types:**
- Skills (1 hour TTL)
- Projects (30 minutes TTL)
- Blog Posts (30 minutes TTL)
- Settings (2 hours TTL)
- About (1 hour TTL)

**Not Cached:**
- Form Submissions (real-time)
- Easter Egg Completions (real-time)
- Testimonials (approval workflow needs fresh data)

**Backend:** Redis

**Rationale:**
- Reduce database load
- Faster API responses
- Skills/Projects change infrequently

---

### ✅ Media Storage

**Provider:** Cloudinary only

**Configuration:**
- Images: Auto-optimize, WebP format
- Videos: Cloudinary video processing
- Audio: Cloudinary audio storage (Compositions)

**No Local Storage:**
- Reason: Simplifies deployment, CDN benefits
- Trade-off: Cloudinary costs (free tier sufficient for portfolio)

---

### ✅ Admin Security

**Initial:** Open access (localhost development)

**Production:** IP whitelist later

**Configuration:**
```env
# .env.production
ADMIN_WHITELIST_IPS=  # Add your IP later
```

**Rationale:**
- Easier development initially
- Harden for production deployment

---

### ✅ Rate Limiting

**Configuration:** 100 requests/minute per IP

**Middleware:**
```javascript
{
  name: 'strapi::ratelimit',
  config: {
    interval: 60000, // 1 minute
    max: 100,
    delayAfter: 50,
    timeWait: 1000,
  },
}
```

**Rationale:**
- Prevent abuse on Form Submissions endpoint
- Balance between security and legitimate usage

---

### ✅ TypeScript

**Mode:** Strict types enabled

**Type Generation:**
```bash
pnpm strapi ts:generate-types
```

**Output:** `types/generated/contentTypes.d.ts`

**Rationale:**
- Type safety in frontend integration
- Better IDE autocomplete
- Catch errors at compile time

---

## User Experience

### ✅ Comments System

**Decision:** Decide post-launch (not in Phase 0)

**Rationale:**
- Focus on core features first
- Can add later with plugin (strapi-plugin-comments)

**If Added Later:**
- Use existing plugin
- Or build custom with Form Submissions content type

---

### ✅ Music Playlists

**Decision:** Genre filtering only (no manual playlists)

**Rationale:**
- Simpler implementation
- Genre taxonomy sufficient for portfolio
- Manual playlists add complexity

**Implementation:**
- `Music Genres` Collection Type
- Many-to-many relation with `Compositions`
- Filter by genre on frontend

---

### ✅ Analytics

**Decision:** Vercel + Sentry (not in Strapi)

**Rationale:**
- Vercel Analytics for frontend performance
- Sentry for error tracking
- No need for Strapi-based analytics

**Not Tracking in Strapi:**
- Page views (use Vercel Analytics)
- User sessions (use Vercel)
- Error logs (use Sentry)

**Tracking in Strapi:**
- `viewCount` field for Projects/Blog Posts (manual increment)
- `playCount` field for Compositions

---

### ✅ Easter Egg

**Type:** Global challenge with leaderboard

**Content Type:** Easter Egg Completions

**Features:**
- Multiple challenge types (Hidden Keyword, Secret Page, Konami Code, etc.)
- Time tracking (`timeToComplete`)
- Attempt counting
- Leaderboard queries
- Time-based blocking (prevent spam)

**Configuration in Settings:**
```javascript
{
  easterEggChallenge: "Description of challenge",
  easterEggKeywords: ["keyword1", "keyword2"],
  easterEggEnabled: true,
}
```

---

### ✅ Project Metrics

**Decision:** Optional manual entry

**Implementation:**
- `metrics` component (content.stat) on Projects
- Repeatable: 0-5 metrics per project
- Example: "10K+ Users", "99% Uptime", "50ms Response Time"

**Rationale:**
- Some projects have metrics, some don't
- Manual entry gives full control
- No automatic tracking needed

---

## Content Types Summary

Based on requirements, we need:

### Single Types (3)
1. **Hero Banner** - ✅ IMPLEMENTED - CMS-editable hero section (`hero-banner`)
2. **About** - About page with bio embedding (pending)
3. **Settings** - Global settings + Easter Egg config (pending)

### Collection Types (10)
1. **Skills** - Technical skills (cached)
2. **Music Genres** - Genre taxonomy
3. **Posts** - Blog articles (cached, simplified architecture)
4. **Projects** - Portfolio projects (cached, featured by default)
5. **Experience** - Work history with achievements
6. **Testimonials** - Client reviews with approval workflow
7. **Awards** - Certifications and achievements
8. **Compositions** - Music tracks with genre relations
9. **Form Submissions** - CRITICAL for AI forms (keep forever)
10. **Easter Egg Completions** - Global challenge tracking

### Reusable Components (9)
1. **SEO Metadata** - shared.seo
2. **Open Graph** - shared.open-graph
3. **Social Links** - shared.social-links
4. **Audio Metadata** - media.audio-metadata
5. **CTA Button** - ui.cta-button
6. **Image Element** - ui.image-element
7. **Stats** - content.stats
8. **Achievement** - content.achievement
9. **Education** - content.education

---

## pgVector Integration

**Content Types with Embeddings:**

| Content Type | Field | Dimensions | Use Case |
|--------------|-------|------------|----------|
| About | `bioEmbedding` | 768 | Semantic search for bio |
| Projects | `descriptionEmbedding` | 768 | Find similar projects |
| Testimonials | `contentEmbedding` | 768 | Duplicate detection |
| Posts | `contentEmbedding` | 768 | Related articles |
| Form Submissions | `messageEmbedding` | 768 | Similar submissions |
| Form Submissions | `summaryEmbedding` | 768 | AI summary search |

**Use Cases:**
- Semantic search ("Find projects about animation")
- Duplicate detection (similar testimonials/bug reports)
- Related content recommendations
- RAG for AI-powered forms

See [08-pgvector-setup.md](./08-pgvector-setup.md) for implementation.

---

## Security Requirements

### ✅ Rate Limiting
- **Global:** 100 req/min per IP
- **Backend:** Redis (distributed rate limiting)
- **Whitelist:** Empty initially (add production IPs later)

### ✅ CORS
```javascript
origin: [
  'http://localhost:4321', // Astro dev
  'http://localhost:3000', // Alt dev port
  'https://aazucena.vercel.app', // Production
  'https://*.vercel.app', // Preview deployments
]
```

### ✅ API Permissions

**Public (Unauthenticated):**
- `find` on all Single Types
- `find` + `findOne` on most Collection Types
- `create` only on Form Submissions + Easter Egg Completions

**Admin Only:**
- `create`, `update`, `delete` on all content types
- `find` on Form Submissions, Easter Egg Completions

See [09-api-permissions.md](./09-api-permissions.md) for configuration.

---

## Performance Targets

### API Response Times
- **Cached endpoints:** <100ms
- **Non-cached endpoints:** <500ms
- **Semantic search:** <1000ms

### Database
- **ivfflat index:** 95-99% recall
- **Query time:** <200ms for vector search

### Caching
- **Redis:** 80%+ hit rate for cached content types
- **TTL:** 30 minutes to 2 hours (depends on content type)

---

## Next Steps

With requirements confirmed, proceed to:

1. **[Create Reusable Components](./02-components.md)** - Build 6 components first
2. **[Create Single Types](./03-single-types.md)** - Hero, About, Settings
3. **[Create Collection Types](./04-collection-types-core.md)** - Follow dependency order

---

## Related Documentation

- **[AI-Powered Forms Feature](/docs/features/ai-forms.md)** - Form Submissions implementation
- **[Phase 0 Infrastructure](/docs/phase-0-infrastructure.md)** - Overall infrastructure setup
- **[pgVector Setup](./08-pgvector-setup.md)** - Embedding and semantic search

---

**Last Updated:** 2025-11-26

**Recent Changes:**
- ✅ Hero Banner single type implemented and documented

**[← Back to Prerequisites](./00-prerequisites.md)** | **[Next: Reusable Components →](./02-components.md)**
