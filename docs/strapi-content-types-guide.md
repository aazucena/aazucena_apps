# Strapi v5 Content Types Guide - Overview

**Version 2.0 - High-Level Overview & Quick Reference**

**Production-Ready Configuration with pgVector Integration, AI Forms, and Semantic Search**

---

## Overview

This guide provides a high-level overview of the Strapi v5 content types implementation for the portfolio project. All detailed step-by-step instructions, code examples, and configurations have been moved to **modular documentation** for easier navigation and reference.

**For detailed implementation instructions, see the modular documentation:**

**[Complete Modular Documentation →](./strapi/README.md)**

**Quick Access Links:**
- [Prerequisites & Setup](./strapi/00-prerequisites.md)
- [Requirements Summary](./strapi/01-requirements.md)
- [Reusable Components](./strapi/02-components.md)
- [Single Types](./strapi/03-single-types.md)
- [Collection Types - Core](./strapi/04-collection-types-core.md)
- [Collection Types - Content](./strapi/05-collection-types-content.md)
- [Collection Types - Publishing](./strapi/06-collection-types-publishing.md)
- [Collection Types - AI Forms](./strapi/07-collection-types-ai.md)
- [pgVector Setup & Configuration](./strapi/08-pgvector-setup.md)
- [API Permissions](./strapi/09-api-permissions.md)
- [Security & Deployment](./strapi/10-security-deployment.md)
- [Data Migration Scripts](./strapi/11-data-migration.md)
- [Testing Checklist](./strapi/12-testing.md)
- [Best Practices](./strapi/13-best-practices.md)
- [Troubleshooting Guide](./strapi/14-troubleshooting.md)
- [Implementation Timeline](./strapi/15-implementation-timeline.md)

---

## Requirements Summary

Based on confirmed project requirements:

**Content Strategy:**
- ✅ Hero section: CMS-editable (Single Type)
- ✅ Music: Genre-based organization (Collection Type)
- ✅ Blog: Simplified architecture (Post collection + Blog configuration, no separate series type)
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

**For full requirements details:** [Requirements Documentation](./strapi/01-requirements.md)

---

## Architecture Overview

### Content Types Summary

**Total: 20 Content Types (Implemented)**
- **10 Single Types:** Portfolio, About Section, Hero Section, Homepage, Animation System, Website Configuration, Theme & Branding, Maintenance Mode, Analytics & Monitoring, Blog Configuration
- **10 Collection Types:** Skills, Music Genres, Posts (Blog), Projects, Experience, Testimonials, Awards, Compositions, Form Submissions (handles 8 form types via enumeration), Easter Egg Completions

**Components: 9 Fully Implemented**

**Implemented:**
- `shared.seo` - SEO metadata with nested Open Graph
- `shared.open-graph` - Open Graph meta tags
- `shared.social-links` - Social media URLs (GitHub, LinkedIn, Twitter, YouTube, Email)
- `media.audio-metadata` - Music track metadata with enharmonic keys
- `ui.cta-button` - CTA buttons with icon picker (@mynaui/icons integration via strapi-plugin-icons-field v1.1.5)
- `content.stats` - Statistics display component
- `content.achievement` - Achievement tracking component
- `content.education` - Education history component
- `ui.image-element` - Image component with alt text

**Implementation Note:** Blog architecture was simplified - no separate "Blog Series" collection type. Uses Post collection + Blog configuration single type instead.

### Creation Order & Dependencies

```
1. Reusable Components (9 components) → Create First
   ├── SEO Metadata (shared.seo)
   ├── Open Graph (shared.open-graph)
   ├── Social Links (shared.social-links)
   ├── Audio Metadata (media.audio-metadata)
   ├── CTA Button (ui.cta-button)
   ├── Stats (content.stats)
   ├── Achievement (content.achievement)
   ├── Education (content.education)
   └── Image Element (ui.image-element)

2. Single Types (10 types) → Create Early
   ├── Website Configuration (independent)
   ├── Theme & Branding (independent)
   ├── Homepage (independent)
   ├── Animation System (independent)
   ├── Maintenance Mode (independent)
   ├── Blog Configuration (independent)
   ├── Analytics & Monitoring (independent)
   ├── Portfolio (uses multiple components)
   ├── Hero Section (uses CTA Button)
   └── About Section (uses Social Links, Stats)

3. Collection Types (10 types) → Create Last
   ├── Skills (independent)
   ├── Music Genres (independent)
   ├── Projects (depends on Skills)
   ├── Experience (depends on Skills, Projects)
   ├── Testimonials (depends on Projects)
   ├── Posts (independent - simplified blog, no series dependency)
   ├── Awards (depends on Projects, Skills)
   ├── Compositions (depends on Music Genres)
   ├── Form Submissions (independent - handles 8 form types via formType enum)
   └── Easter Egg Completions (independent)
```

**Why This Order?**
- Components must exist before being used in content types
- Skills must exist before Projects (relation dependency)
- Music Genres must exist before Compositions
- Single Types are configuration-focused, create early
- Collection Types depend on components and other collections, create last

**Implementation Reality:**
- Blog architecture simplified - no "Blog Series" type
- Posts collection is independent (no series relation)
- AI Forms consolidated - single Form Submission collection type with formType enumeration instead of 8 separate collection types
- 20 total content types (10 single + 10 collection)

**For detailed field specifications:**
- [Components Documentation](./strapi/02-components.md)
- [Single Types Documentation](./strapi/03-single-types.md)
- [Collection Types - Core](./strapi/04-collection-types-core.md)
- [Collection Types - Content](./strapi/05-collection-types-content.md)
- [Collection Types - Publishing](./strapi/06-collection-types-publishing.md)
- [Collection Types - AI Forms](./strapi/07-collection-types-ai.md)

---

## Key Features

### pgVector Integration

✅ **768-dimensional Gemini embeddings** for semantic search
✅ **ivfflat indexing** for speed-optimized vector queries
✅ **Multiple content types** with vector embeddings (About, Projects, Testimonials, Blog Posts, Form Submissions)
✅ **Metadata filtering** combined with vector similarity search
✅ **Auto-generation** via lifecycle hooks when content is updated

**Content Types with pgVector:**
- About (`bioEmbedding`)
- Projects (`descriptionEmbedding`)
- Testimonials (`contentEmbedding`)
- Blog Posts (`contentEmbedding`)
- Form Submissions (`messageEmbedding`, `summaryEmbedding`)

**For full pgVector setup:** [pgVector Setup Guide](./strapi/08-pgvector-setup.md)

---

### AI-Powered Forms

✅ **Form Submissions content type** - Single collection type handling all form types via enumeration
✅ **8 Form Types** - Contact, Feedback, Testimonial, Bug Report, Feature Request, Collaboration, Referral, Music Feedback
✅ **LangGraph integration** - Multi-agent workflow for intelligent processing
✅ **LangSmith tracing** - Full conversation flow tracking
✅ **reCAPTCHA v3** - Spam protection
✅ **Semantic search** - Find similar submissions, duplicate detection
✅ **RAG capabilities** - Retrieval-Augmented Generation for context-aware responses

**Architecture:**
- Single `Form Submission` collection type with `formType` enumeration field
- Flexible `formData` and `structuredData` JSON fields adapt to each form type
- Better maintainability and DRY principle compared to 8 separate collection types

**For full AI forms implementation:** [AI Forms Documentation](./strapi/07-collection-types-ai.md) and [AI Forms Feature Guide](./features/ai-forms.md)

---

### Security Hardening

✅ **Rate limiting** - 100 requests/minute per IP
✅ **CORS configuration** - Localhost + Vercel domains
✅ **Redis caching** - High-traffic content types cached
✅ **Health check endpoint** - Monitor system status
✅ **API permissions** - Public read, admin write
✅ **Content Security Policy** - XSS protection

**For security configuration:** [Security & Deployment Guide](./strapi/10-security-deployment.md)

---

### i18n Support

✅ **Internationalization enabled** for future multi-language content
✅ **Applied to:** Single Types (Hero, About), most Collection Types
✅ **Not applied to:** Settings (internal config), Skills (taxonomy), Music Genres

---

### Email Notifications

✅ **Testimonial workflow** - Approval/rejection emails with reasons
✅ **Lifecycle hooks** - Auto-send on status change
✅ **Rejection reason required** - Validation enforced

---

### Semantic Search

✅ **pgVector-powered** similarity search
✅ **Cohere Rerank** for improved relevance (optional)
✅ **Metadata filtering** before vector search (formType, sentiment, date)
✅ **Custom API endpoint** for semantic queries

**Example Use Cases:**
- Find similar projects based on description
- Detect duplicate bug reports
- Semantic blog post recommendations
- RAG context retrieval for AI forms

**For semantic search implementation:** [pgVector Setup Guide](./strapi/08-pgvector-setup.md)

---

## Quick Start

Follow these steps to implement the Strapi content types:

### 1. Prerequisites
- Strapi v5 running at `http://localhost:1337/admin`
- PostgreSQL 16 with pgVector extension installed
- Cloudinary configured for media uploads
- Redis running for caching (optional but recommended)
- Gemini API key for embeddings

**Full prerequisites checklist:** [Prerequisites Guide](./strapi/00-prerequisites.md)

---

### 2. Create Components
Create 9 reusable components (SEO, Open Graph, Social Links, Audio Metadata, CTA Button, Stats, Achievement, Education, Image Element)

**Step-by-step instructions:** [Components Guide](./strapi/02-components.md)

---

### 3. Create Content Types
Follow the creation order:
1. Single Types (10 types)
2. Collection Types (10 types)

**Detailed guides:**
- [Single Types](./strapi/03-single-types.md)
- [Collection Types - Core](./strapi/04-collection-types-core.md)
- [Collection Types - Content](./strapi/05-collection-types-content.md)
- [Collection Types - Publishing](./strapi/06-collection-types-publishing.md)
- [Collection Types - AI Forms](./strapi/07-collection-types-ai.md)

---

### 4. Configure pgVector
Run database migrations, create embedding service, add lifecycle hooks

**Full pgVector setup:** [pgVector Setup Guide](./strapi/08-pgvector-setup.md)

---

### 5. Set Permissions
Configure API permissions for public and admin access

**API permissions configuration:** [API Permissions Guide](./strapi/09-api-permissions.md)

---

### 6. Deploy
Set up security (rate limiting, CORS), configure production environment

**Deployment guide:** [Security & Deployment Guide](./strapi/10-security-deployment.md)

---

### 7. Migrate Data
Create migration scripts to transfer data from static files to Strapi

**Migration scripts:** [Data Migration Guide](./strapi/11-data-migration.md)

---

### 8. Test & Verify
Run comprehensive tests to ensure everything works

**Testing checklist:** [Testing Guide](./strapi/12-testing.md)

---

**Estimated Time:** 7-10 days

**For detailed timeline:** [Implementation Timeline](./strapi/15-implementation-timeline.md)

---

## Implementation Timeline

### Phase A: Pre-Implementation (1 day)
- Database setup (PostgreSQL 16 + pgVector)
- Cloudinary configuration
- Redis setup
- Environment variables

---

### Phase B: Core Content Types (2-3 days)
- Create all 9 reusable components
- Create 10 Single Types
- Create 10 Collection Types
- Test all API endpoints

---

### Phase C: pgVector & Advanced Features (1-2 days)
- pgVector database migration
- Embedding service (Gemini integration)
- Lifecycle hooks for auto-embedding
- Semantic search service
- Form Submissions and Easter Egg Completions

---

### Phase D: Security & Configuration (1 day)
- Rate limiting configuration
- CORS setup
- Redis caching
- Health check endpoint
- API permissions

---

### Phase E: Data Migration & Production (1-2 days)
- Migration scripts
- Data migration from static files
- Production deployment
- Monitoring setup

---

**Total Estimated Time: 7-10 days**

**Breakdown:**
- **Minimum (7 days):** Experienced developer, no issues
- **Average (8-9 days):** Some troubleshooting, learning curve
- **Maximum (10 days):** First time with Strapi v5/pgVector, thorough testing

**For detailed day-by-day breakdown:** [Implementation Timeline](./strapi/15-implementation-timeline.md)

---

## Testing Checklist

### Content Types Verification
- [ ] All 9 components visible in Components section
- [ ] All 10 Single Types visible in Content Manager
- [ ] All 10 Collection Types visible in Content Manager
- [ ] pgVector columns exist in database

### API Endpoints Testing
- [ ] All Single Types endpoints accessible
- [ ] All Collection Types endpoints accessible
- [ ] Semantic search endpoint working
- [ ] Health check endpoint responding

### Data Validation
- [ ] Media uploads work (Cloudinary integration)
- [ ] Relations populate correctly
- [ ] Draft/Publish workflow functions
- [ ] Validation rules enforced

**Full testing checklist:** [Testing Guide](./strapi/12-testing.md)

---

## Common Pitfalls & Troubleshooting

### Content Type Not Appearing in API
- Check API Permissions (Settings → Roles → Public)
- Ensure content is published (if Draft & Publish enabled)
- Restart Strapi

### Relation Not Populating
- Use `populate` query parameter: `?populate=techStack`
- Check relation is bidirectional
- Ensure related content is published

### Media Upload Fails
- Verify Cloudinary credentials in `.env`
- Check file type restrictions
- Review Docker logs

### pgVector Issues
- Verify extension installed: `CREATE EXTENSION IF NOT EXISTS vector;`
- Check index created: `\d+ table_name`
- Validate embedding dimensions (768 for Gemini)

**Full troubleshooting guide:** [Troubleshooting Guide](./strapi/14-troubleshooting.md)

---

## Best Practices

### Field Naming Conventions
- Use **camelCase** for field names
- Use descriptive names
- Avoid reserved words

### Validation Rules
- Always set **max length** for text fields
- Use **regex validation** for URLs, emails
- Set **min/max values** for numbers

### Performance Optimization
- Use **indexes** on frequently queried fields
- Limit **gallery/media** fields
- Use **pagination** for large collections
- Populate relations only when needed

### Content Strategy
- Use **Draft & Publish** for content needing review
- Disable Draft & Publish for simple data
- Use **featured** boolean for highlighting
- Use **order** field for manual sorting

**Full best practices guide:** [Best Practices Guide](./strapi/13-best-practices.md)

---

## Next Steps After Completion

1. **Populate Test Data** - Create sample entries for each content type
2. **Frontend Integration** (Phase 0.2.4) - Connect Astro app to Strapi API
3. **Type Generation** - Generate TypeScript types for frontend
4. **Migration Scripts** - Execute data migration from static files
5. **Webhook Setup** - Configure Strapi webhooks to trigger Vercel rebuilds
6. **AI Forms Integration** - Implement LangGraph pipeline for Form Submissions
7. **Monitoring** - Set up Sentry, health checks, and logging

---

## Related Documentation

### Internal Documentation
- [Phase 0 Infrastructure Documentation](/docs/phase-0-infrastructure.md)
- [AI-Powered Forms Feature](/docs/features/ai-forms.md)
- [ROADMAP](/ROADMAP.md)
- [Complete Modular Strapi Docs](./strapi/README.md)

### External Resources
- [Strapi v5 Official Docs](https://docs.strapi.io/dev-docs/intro)
- [Google Generative AI - Embeddings](https://ai.google.dev/tutorials/embeddings_quickstart)
- [pgVector Documentation](https://github.com/pgvector/pgvector)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/16/)

---

## Completion Criteria

- ✅ All 20 content types created (10 Single Types + 10 Collection Types)
- ✅ All 9 reusable components created
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

---

**Last Updated:** 2025-11-18
**Version:** 2.1 Overview
**Strapi Version:** v5.31.0
**Database:** PostgreSQL 16 + pgVector
**Environment:** Docker Compose
**Node.js:** 20+ (22 recommended)
**Embedding Provider:** Google Gemini (textembedding-gecko, 768 dimensions)

**Total Lines:** ~300 (condensed from 2278)

### Installed Plugins

- **Official:** GraphQL, Documentation, Sentry, SEO, Color Picker, Cloudinary
- **Community:** Redis, REST Cache, REST Cache Redis Provider
- **Third-Party:** CKEditor 5, Preview Button, Multi-Select, Advanced UUID, Navigation, Duplicate Button, Config Sync, Publisher

See [Prerequisites - Installed Plugins](./strapi/00-prerequisites.md#installed-plugins) for complete configuration.

---

**Last Updated:** 2025-12-02

**Changelog:**
- **2025-12-02 (v2.1):** Corrected content type counts to match actual implementation (20 total: 10 single + 10 collection, not 26). Clarified AI Forms architecture uses single Form Submission collection type with formType enumeration instead of 8 separate collection types. Removed Blog Series references. Updated component count (9 implemented).
- **2025-11-18:** Initial v2.0 documentation created
- **Previous versions:** Original documentation

**For detailed implementation, always refer to the [modular documentation](./strapi/README.md).**
