# Phase 0: Infrastructure & Architecture Foundation

📍 **Full Documentation:** [ROADMAP.md Phase 0](../ROADMAP.md#phase-0-infrastructure--architecture-foundation-after-phase-1-)

## Priority Status: Execute AFTER Phase 1

**Estimated Effort:** 16-20 days

## Overview

Convert to monorepo structure, integrate Strapi CMS, and establish production-ready deployment pipeline.

## Implementation Plan

### 0.1 Monorepo Restructuring (2-3 days)

**Goal:** Create well-organized monorepo with proper separation of concerns

**New Structure:**
```
aazucena_apps/
├── apps/
│   ├── portfolio/              # Frontend (Astro + React)
│   └── cms/                    # Backend (Strapi)
├── packages/
│   ├── shared/                 # Shared TypeScript types
│   ├── ui/                     # Shared UI components
│   └── utils/                  # Shared utilities
├── pnpm-workspace.yaml
├── turbo.json
└── package.json
```

**Tools:**
- pnpm workspaces
- Turborepo for build orchestration
- Unified linting/formatting

**Benefits:**
- Code sharing between frontend and CMS
- Consistent TypeScript types across stack
- Unified build system
- Easier dependency management

---

### 0.2 Strapi CMS Integration (5-7 days)

**Goal:** Replace hardcoded content with dynamic CMS-managed content

#### 0.2.1 Local Development with Docker Compose (1-2 days)

**Why Docker Compose?**
- Consistent development environment across team members
- Isolated PostgreSQL database with pgVector extension
- Easy setup and teardown
- Matches production infrastructure (Railway uses PostgreSQL)
- No need to install PostgreSQL or Strapi globally

**Docker Compose Architecture:**
```yaml
services:
  strapi:
    container_name: aazucena-cms
    build: ./apps/cms
    ports:
      - "1337:1337"
    volumes:
      - ./apps/cms:/srv/app
      - /srv/app/node_modules
    environment:
      NODE_ENV: development
      DATABASE_CLIENT: postgres
      DATABASE_HOST: postgres
      DATABASE_PORT: 5432
      DATABASE_NAME: strapi
      DATABASE_USERNAME: strapi
      DATABASE_PASSWORD: strapi
      DATABASE_SSL: false
      CLOUDINARY_NAME: ${CLOUDINARY_NAME}
      CLOUDINARY_KEY: ${CLOUDINARY_KEY}
      CLOUDINARY_SECRET: ${CLOUDINARY_SECRET}
    depends_on:
      - postgres

  postgres:
    container_name: aazucena-db
    image: pgvector/pgvector:pg16
    ports:
      - "5432:5432"
    environment:
      POSTGRES_DB: strapi
      POSTGRES_USER: strapi
      POSTGRES_PASSWORD: strapi
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./apps/cms/database/init.sql:/docker-entrypoint-initdb.d/init.sql

volumes:
  postgres-data:
```

**Setup Steps:**

1. **Create `apps/cms` directory structure**
   ```
   apps/cms/
   ├── Dockerfile
   ├── .dockerignore
   ├── database/
   │   └── init.sql          # pgVector extension initialization
   └── .env.example          # Environment template
   ```

2. **Initialize Strapi v5**
   ```bash
   cd apps
   pnpm dlx create-strapi-app@latest cms \
     --quickstart \
     --no-run \
     --skip-cloud \
     --typescript
   ```

3. **Configure Dockerfile**
   ```dockerfile
   FROM node:22-alpine

   RUN apk update && apk add --no-cache \
     build-base \
     gcc \
     autoconf \
     automake \
     zlib-dev \
     libpng-dev \
     vips-dev \
     git

   WORKDIR /srv/app

   # Copy CMS package files directly to WORKDIR
   COPY apps/cms/pnpm-lock.yaml ./
   COPY apps/cms/package.json ./

   # Install pnpm globally
   RUN npm install -g pnpm@10.21.0

   # Install dependencies (standalone, with lockfile for deterministic builds)
   RUN pnpm install --frozen-lockfile

   # Copy CMS application files
   COPY apps/cms ./

   # Set environment
   ENV NODE_ENV=development

   # Expose Strapi port
   EXPOSE 1337

   # Start Strapi in development mode
   CMD ["pnpm", "develop"]
   ```

4. **Create pgVector initialization script** (`apps/cms/database/init.sql`)
   ```sql
   -- Enable pgVector extension
   CREATE EXTENSION IF NOT EXISTS vector;

   -- Verify installation
   SELECT * FROM pg_extension WHERE extname = 'vector';
   ```

5. **Configure Strapi for PostgreSQL** (`apps/cms/config/database.ts`)
   ```typescript
   export default ({ env }) => ({
     connection: {
       client: 'postgres',
       connection: {
         host: env('DATABASE_HOST', '127.0.0.1'),
         port: env.int('DATABASE_PORT', 5432),
         database: env('DATABASE_NAME', 'strapi'),
         user: env('DATABASE_USERNAME', 'strapi'),
         password: env('DATABASE_PASSWORD', 'strapi'),
         ssl: env.bool('DATABASE_SSL', false) && {
           rejectUnauthorized: env.bool('DATABASE_SSL_SELF', false),
         },
       },
       debug: false,
     },
   });
   ```

6. **Start Local Development**
   ```bash
   # From project root
   docker compose up -d

   # View logs
   docker compose logs -f strapi

   # Access admin panel
   # http://localhost:1337/admin
   ```

7. **Useful Docker Commands**
   ```bash
   # Stop containers
   docker compose down

   # Remove volumes (reset database)
   docker compose down -v

   # Rebuild after dependency changes
   docker compose up -d --build

   # Access PostgreSQL shell
   docker exec -it aazucena-db psql -U strapi -d strapi

   # Verify pgVector extension
   docker exec -it aazucena-db psql -U strapi -d strapi -c "SELECT * FROM pg_extension WHERE extname = 'vector';"
   ```

**Benefits:**
- ✅ PostgreSQL 16+ with pgVector extension out of the box
- ✅ Persistent data via Docker volumes
- ✅ Hot reload for Strapi development
- ✅ Isolated environment (no conflicts with system PostgreSQL)
- ✅ Easy team onboarding (just `docker compose up`)

---

#### 0.2.2 Strapi Configuration (1 day)

**Admin Panel Setup:**
- First run: Access http://localhost:1337/admin
- Create super admin account
- Configure admin panel settings
- Set up role-based access control (RBAC)

**Cloudinary Integration:**
- Install Strapi upload provider: `@strapi/provider-upload-cloudinary`
- Configure in `config/plugins.ts` or `config/plugins.js`
- Add Cloudinary credentials to `.env`
- Test media upload functionality

**Database Schema:**
- Strapi will auto-generate PostgreSQL tables on first run
- pgVector extension available for future AI features
- Connection pooling configured via environment variables

---

#### 0.2.3 Content Types Creation (7-10 days)

**Goal:** Define all content models in Strapi admin panel with production-ready configuration

**📋 Comprehensive Guide:** See detailed step-by-step implementation in [strapi-content-types-guide.md](../docs/strapi-content-types-guide.md) (Version 2.0 - Enhanced)

> **📝 Note:** All content types have been customized based on 20 confirmed user requirements including:
> - i18n enabled for future language support
> - Gemini embeddings (768 dimensions) for semantic search
> - Rate limiting (100 req/min per IP)
> - Redis caching for performance
> - Email notifications for testimonials
> - Global Easter Egg challenge support
> - Form retention forever (no deletion)
> - Projects featured by default

**Content Types to Create:** 14 total (3 Single Types + 11 Collection Types)

**Reusable Components (6 total):**
- SEO Metadata (`meta.seo-metadata`)
- Social Links (`links.social-links`)
- Audio Metadata (`media.audio-metadata`)
- CTA Button (`ui.cta-button`) ⭐ NEW
- Stats (`content.stat`) ⭐ NEW
- Achievement (`content.achievement`) ⭐ NEW

**Single Types (3):**
1. **Hero** ⭐ NEW - CMS-editable hero section with CTAs, background media, animation variants
2. **About** - Name, bio, profile image, social links, stats, achievements, pgVector embeddings
3. **Settings** - Site configuration, SEO defaults, feature flags, Easter Egg settings

**Collection Types (11):**
1. **Skills** - Name, category, proficiency, icon, self-relations for hierarchies
2. **Music Genres** ⭐ NEW - Genre taxonomy for compositions with color/icon
3. **Blog Series** ⭐ NEW - Multi-part tutorial/article series management
4. **Projects** - Title, description, tech stack (Skills relation), pgVector embeddings, metrics
5. **Experience** - Work history with Skills/Projects relations, achievements component
6. **Testimonials** - Client reviews with approval workflow, email notifications, pgVector embeddings
7. **Blog Posts** - Articles with series relation, auto-generated TOC, pgVector embeddings
8. **Awards** - Certifications with Projects/Skills relations
9. **Compositions** - Music tracks with genre-based organization (Music Genres relation)
10. **Form Submissions** ⭐ NEW - **CRITICAL for AI-powered forms** - Stores raw user input + AI-processed data with pgVector embeddings for semantic search, LangSmith integration, reCAPTCHA scoring
11. **Easter Egg Completions** ⭐ NEW - Global challenge tracking with leaderboard support

**Enhanced Features (Production-Ready):**
- ✅ **pgVector Integration** - 768-dimensional embeddings from Gemini (textembedding-gecko)
- ✅ **Semantic Search** - Vector similarity search with metadata filtering
- ✅ **Rate Limiting** - 100 requests/minute per IP with Redis backing
- ✅ **Redis Caching** - Skills, Projects, Blog Posts, Settings, About
- ✅ **i18n Enabled** - Future language support for all content types
- ✅ **Email Notifications** - Testimonial approval/rejection with reasons
- ✅ **LangSmith Integration** - AI tracing for form submissions
- ✅ **Lifecycle Hooks** - Auto-generate embeddings, TOC, read time, tags

**Implementation Timeline (7-10 days):**
- **Phase A:** Pre-implementation (1 day) - PostgreSQL 16 + pgVector, Cloudinary, Redis setup
- **Phase B:** Core content types (2-3 days) - Components, Single Types, basic Collections
- **Phase C:** pgVector & Advanced Features (1-2 days) - Embeddings service, semantic search, Form Submissions
- **Phase D:** Security & Configuration (1 day) - Rate limiting, CORS, API permissions
- **Phase E:** Data Migration & Production (1-2 days) - Migration scripts, deployment

**Key User Requirements Implemented:**
- ✅ Hero section is CMS-editable (Single Type)
- ✅ Music organized by genres (Music Genres collection)
- ✅ Blog series for multi-part tutorials (Blog Series collection)
- ✅ Testimonial email notifications with rejection reasons
- ✅ Projects featured by default on projects page
- ✅ All form submissions retained forever
- ✅ Embedding provider: Gemini (768 dimensions)
- ✅ pgVector index: ivfflat (speed-optimized)
- ✅ Global Easter Egg challenge with leaderboard

**Content Type Best Practices:**
- Use `draft/publish` system for content requiring review
- Field validations (required, min/max length, regex patterns)
- Metadata filtering for efficient pgVector queries
- Lifecycle hooks for auto-generated fields
- Relations for rich content connections
- Components for reusable patterns

**Note:** This is a **comprehensive, production-ready implementation** based on 20 confirmed user requirements. See [strapi-content-types-guide.md](../docs/strapi-content-types-guide.md) for complete field specifications, validation rules, pgVector configuration, and migration strategies.

---

#### 0.2.4 Frontend API Integration (1-2 days)

**Goal:** Connect portfolio app to Strapi CMS API

**API Client Setup:**

1. **Install Strapi SDK**
   ```bash
   cd apps/portfolio
   pnpm add @strapi/sdk-js
   ```

2. **Create API Client** (`apps/portfolio/src/lib/strapi.ts`)
   ```typescript
   import { Strapi } from '@strapi/sdk-js';

   const strapi = new Strapi({
     url: import.meta.env.STRAPI_API_URL || 'http://localhost:1337',
     apiToken: import.meta.env.STRAPI_API_TOKEN,
   });

   export default strapi;
   ```

3. **Type Generation**
   - Use Strapi's TypeScript type generation
   - Create shared types in `packages/shared/src/types/strapi.ts`
   - Export to portfolio app

4. **Data Fetching Utilities**
   - Implement caching strategy (Astro's built-in cache)
   - Add ISR with revalidation (60 seconds)
   - Error handling and fallbacks
   - Loading states for client-side fetching

5. **Replace Static Data**
   ```astro
   ---
   // Before (static)
   import { aboutData } from '@/data/about';

   // After (CMS)
   import strapi from '@/lib/strapi';
   const aboutData = await strapi.find('about');
   ---
   ```

**Caching Strategy:**
- **Astro SSG:** Pre-render pages at build time
- **ISR:** Revalidate every 60 seconds (Vercel)
- **Strapi Webhooks:** Trigger Vercel rebuilds on content changes
- **Redis (Optional):** Cache frequently accessed data

---

### 0.3 Deployment Strategy (1.5 days)

#### Frontend Deployment (Vercel)

**Automatic via GitHub Integration:**
- ✅ Builds on every push to `main`
- ✅ Preview deployments for all PRs
- ✅ Automatic SSL certificates
- ✅ Edge caching and CDN
- ✅ Image optimization

**Configuration:**
- **Framework:** Astro
- **Root Directory:** `apps/portfolio`
- **Build Command:** `pnpm turbo run build --filter=portfolio`
- **Output Directory:** `apps/portfolio/dist`

**Environment Variables:**
```env
STRAPI_API_URL=https://cms.yoursite.com
STRAPI_API_TOKEN=xxxxx
```

**Effort:** 0.5 days (just configuration)

---

#### Backend Deployment (Railway)

**Railway Setup:**
- Deploy `apps/cms` to Railway
- Provision PostgreSQL database
- Configure environment variables
- Automatic deployments from `main` branch

**Database:**
- PostgreSQL 14+ on Railway
- Automated daily backups
- Connection pooling (PgBouncer)
- SSL connections enabled

**Environment Variables:**
```env
NODE_ENV=production
DATABASE_CLIENT=postgres
DATABASE_HOST=${PGHOST}
DATABASE_PORT=${PGPORT}
DATABASE_NAME=${PGDATABASE}
DATABASE_USERNAME=${PGUSER}
DATABASE_PASSWORD=${PGPASSWORD}
DATABASE_SSL=true

CLOUDINARY_NAME=xxxxx
CLOUDINARY_KEY=xxxxx
CLOUDINARY_SECRET=xxxxx

ALLOWED_ORIGINS=https://yoursite.com
```

**Effort:** 1 day

---

#### CircleCI (CMS Only)

**Why CircleCI for CMS only?**
- Vercel handles frontend CI/CD automatically
- CircleCI focuses solely on CMS deployment to Railway
- Centralized testing and linting for entire monorepo

**Workflow:**
```yaml
jobs:
  - install-dependencies
  - lint-and-test (requires: install-dependencies)
  - build-cms (requires: lint-and-test, branch: main)
  - deploy-cms (requires: build-cms, branch: main)
```

**Environment Variables:**
- `RAILWAY_TOKEN` - Railway API token for deployment
- `STRAPI_API_URL` - For testing
- `STRAPI_API_TOKEN` - For testing

---

### 0.4 Content Migration & API Integration (3 days)

**Goal:** Seamlessly migrate from static to CMS-driven content

**Migration Steps:**

1. **Create Migration Scripts**
   - Export existing data from `src/data/*` files
   - Transform to Strapi format
   - Bulk import via Strapi API

2. **Build API Client**
   ```typescript
   // lib/strapi.ts
   import type { AboutData, Experience, Project } from '@aazucena/shared';

   export class StrapiClient {
     async getAbout(): Promise<AboutData>
     async getExperiences(): Promise<Experience[]>
     async getProjects(): Promise<Project[]>
     // ...
   }
   ```

3. **Update Components**
   ```astro
   ---
   // Before
   import { aboutData } from '@/data/about';

   // After
   import { strapiClient } from '@/lib/strapi';
   const aboutData = await strapiClient.getAbout();
   ---
   ```

4. **Caching Strategy**
   - Use Astro's built-in caching
   - Implement ISR with revalidation (60 seconds)
   - Add Strapi webhooks to trigger Vercel rebuilds
   - Optional: Redis cache layer for frequently accessed data

---

## Timeline Summary

| Phase | Duration | Dependencies |
|-------|----------|--------------|
| 0.1 Monorepo Restructuring | 2-3 days | None |
| 0.2.1 Docker Compose Setup | 1-2 days | Monorepo |
| 0.2.2 Strapi Configuration | 1 day | Docker setup |
| 0.2.3 Content Types | **7-10 days** | Strapi config |
| 0.2.4 Frontend API Integration | 1-2 days | Content types |
| 0.3 Deployment Strategy | 1.5 days | CMS setup |
| 0.4 Content Migration | 3 days | All above |

**Total:** 16-20 days (Phase 0.2.3 updated to reflect production-ready implementation with pgVector, semantic search, and 14 content types)

---

## Success Metrics

**Before:**
- Static data in code
- Manual deployments
- No content management
- Single codebase
- Local PostgreSQL installation required
- Inconsistent development environments

**After:**
- ✅ Dynamic CMS-managed content
- ✅ Automatic deployments (Vercel + Railway)
- ✅ Non-technical content editing
- ✅ Monorepo with shared packages
- ✅ Type-safe API integration
- ✅ Docker Compose for consistent local development
- ✅ PostgreSQL 16+ with pgVector extension ready
- ✅ One-command setup (`docker compose up`)
- ✅ Isolated development environment (no system conflicts)

---

## Next Steps After Phase 0

1. **Phase 2:** Component Architecture Improvements
2. **Phase 3:** Performance Optimization
3. **Phase 4:** Developer Experience (Figma/Storybook/Chromatic)
4. **Features:** Music player, logging, AI forms, etc.

---

**Related Documentation:**
- [ROADMAP.md - Full Phase 0 Details](../ROADMAP.md#phase-0-infrastructure--architecture-foundation-after-phase-1-)
- [Strapi Content Types Guide - Version 2.0 Enhanced](../docs/strapi-content-types-guide.md) ⭐ **Production-Ready Guide**
- [Phase 1: Animations Refactoring](./phase-1-animations-refactoring.md)
- [AI-Powered Forms Feature](./features/ai-forms.md)
- [Logging & Monitoring](./features/logging-monitoring.md)
