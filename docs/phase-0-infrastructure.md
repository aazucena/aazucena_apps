# Phase 0: Infrastructure & Architecture Foundation

📍 **Full Documentation:** [ROADMAP.md Phase 0](../ROADMAP.md#phase-0-infrastructure--architecture-foundation-after-phase-1-)

## Priority Status: 🚧 IN PROGRESS - Currently at 0.5 (Portfolio Pages) 🔥

**Estimated Effort:** 16-20 days
**Progress:** ~95% Complete (Steps 0.1, 0.2.1, 0.2.2, 0.2.3, 0.2.4, 0.3, 0.4 completed - 2026-01-14)

## Overview

Convert to monorepo structure, integrate Strapi CMS, and establish production-ready deployment pipeline.

## Implementation Plan

### 0.1 Monorepo Restructuring (2-3 days) - ✅ COMPLETED

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

### 0.2 Strapi CMS Integration (5-7 days) - 🚧 IN PROGRESS

**Goal:** Replace hardcoded content with dynamic CMS-managed content

#### 0.2.1 Local Development with Docker Compose (1-2 days) - ✅ COMPLETED

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

#### 0.2.2 Strapi Configuration (1 day) - ✅ COMPLETED

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

#### 0.2.3 Content Types Creation (7-10 days) - ✅ COMPLETED

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

**Content Types to Create:** 20 total (10 Single Types + 10 Collection Types)

**Reusable Components (9 total):**
- SEO Metadata (`shared.seo`)
- Open Graph (`shared.open-graph`)
- Social Links (`shared.social-links`)
- Audio Metadata (`media.audio-metadata`)
- CTA Button (`ui.cta-button`)
- Image Element (`ui.image-element`)
- Stats (`content.stats`)
- Achievement (`content.achievement`)
- Education (`content.education`)

**Single Types (10):**
1. **Hero Banner** - CMS-editable hero section with CTAs, background media, animation variants
2. **About** - Name, bio, profile image, social links, stats, achievements, pgVector embeddings
3. **Settings** (Website Configuration) - Site configuration, SEO defaults, feature flags, Easter Egg settings
4. **Homepage** - Homepage-specific configuration
5. **Portfolio** - Portfolio page configuration
6. **Blog** - Blog configuration and settings
7. **Theme** - Theme and styling configuration
8. **Analytics** - Analytics configuration
9. **Animation** - Animation settings
10. **Maintenance** - Maintenance mode configuration

**Collection Types (10):**
1. **Skills** - Name, category, proficiency, icon, self-relations for hierarchies
2. **Music Genres** - Genre taxonomy for compositions with color/icon
3. **Posts** - Blog articles (simplified architecture, no separate series)
4. **Projects** - Title, description, tech stack (Skills relation), pgVector embeddings, metrics
5. **Experience** - Work history with Skills/Projects relations, achievements component
6. **Testimonials** - Client reviews with approval workflow, email notifications, pgVector embeddings
7. **Awards** - Certifications with Projects/Skills relations
8. **Compositions** - Music tracks with genre-based organization (Music Genres relation)
9. **Form Submissions** - **CRITICAL for AI-powered forms** - Stores raw user input + AI-processed data with pgVector embeddings for semantic search, LangSmith integration, reCAPTCHA scoring
10. **Easter Egg Completions** - Global challenge tracking with leaderboard support

**Note:** The blog architecture was simplified from the original design. Instead of a separate "Blog Series" collection type, there is a single `post` collection type and a `blog` single type for configuration. See [Collection Types: Publishing](../docs/strapi/06-collection-types-publishing.md) for details.

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
- ✅ Hero section is CMS-editable (Single Type: Hero Banner)
- ✅ Music organized by genres (Music Genres collection)
- ✅ Blog articles with simplified architecture (Posts collection + Blog single type)
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

#### 0.2.4 Frontend API Integration (1-2 days) - ✅ COMPLETED (2025-12-19)

**Goal:** Replace static data with CMS-driven content via Strapi SDK

**Implementation:**

**1. API Layer Architecture**
```
src/lib/
├── api/              # 15+ specialized API clients
│   ├── homepage-data.ts    # Orchestrates all homepage data fetching
│   ├── layout-data.ts      # Layout-specific data (theme, maintenance, etc.)
│   ├── hero.ts             # Hero section API
│   ├── about.ts            # About section API
│   ├── projects.ts         # Projects collection API
│   ├── experiences.ts      # Work experience API
│   ├── testimonials.ts     # Testimonials collection API
│   ├── awards.ts           # Awards/achievements API
│   ├── posts.ts            # Blog posts API
│   ├── skills.ts           # Skills collection API
│   ├── skill-categories.ts # Skill categories API
│   ├── animation.ts        # Animation config API
│   ├── theme.ts            # Theme config API
│   ├── maintenance.ts      # Maintenance mode API
│   ├── website-config.ts   # Website metadata API
│   ├── blog-config.ts      # Blog configuration API
│   ├── showcase.ts         # Showcase config API
│   ├── portfolio.ts        # Portfolio metadata API
│   ├── homepage.ts         # Homepage config API
│   └── preloader.ts        # Preloader config API
├── validators/       # 15+ Zod schemas (type-safe validation)
├── transformers/     # 15+ data transformers (clean structures)
├── utils/            # Helper functions
│   ├── index.ts
│   ├── contentHelpers.ts
│   └── experienceHelpers.ts
└── strapi.ts         # Base Strapi client
```

**2. DataContext System**
- Created `DataContext.tsx` - Provides homepage data, portfolio data, and section registry
- Custom hooks:
  - `useDataContext()` - Full data access
  - `useSectionData()` - Section-specific data
  - `usePortfolioData()` - Portfolio metadata
  - `useHomepageData()` - Homepage configuration
  - `useRegistry()` - Section component registry
- **Impact:** Complete elimination of prop drilling for CMS data

**3. Component Refactoring**
- `HomepageContent.tsx` - Replaces `SectionContent.tsx`, uses context hooks
- `SectionLayout.tsx` - Reusable layout wrapper for consistent section structure
- All section components refactored to use context hooks instead of props

**4. Type Safety & Validation**
- Zod schemas for all CMS responses (`/lib/validators/*`)
- Runtime validation with graceful fallbacks
- TypeScript inference from Zod schemas
- Example:
  ```typescript
  const HeroSchema = z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    // ... full schema
  });

  export type Hero = z.infer<typeof HeroSchema>;
  ```

**5. Caching Strategy**
- `force-cache` for SSG builds (fast production builds)
- `no-cache` for maintenance mode checks (always fresh)
- Parallel fetching via `Promise.all()` for all 15+ endpoints

**6. Error Handling**
- Graceful fallbacks to default data if CMS unavailable
- Error logging for debugging
- Build-time validation of CMS data
- Example:
  ```typescript
  try {
    const data = await fetchFromCMS();
    return HeroSchema.parse(data);
  } catch (error) {
    console.error('CMS fetch failed, using fallback:', error);
    return DEFAULT_HERO_DATA;
  }
  ```

**Test Results:**
- ✅ All 8 configuration APIs tested and working
- ✅ Build passing with actual CMS data
- ✅ Type safety validated across all endpoints
- ✅ Error handling tested (CMS down scenario)
- ✅ Parallel fetching reduces page load time

**Test Report:** [Phase 0.2.4 Test Report](/docs/strapi/PHASE_0.2.4_TEST_REPORT.md)

**Key Files:**
- `/apps/portfolio/src/lib/api/homepage-data.ts` - Main data orchestration
- `/apps/portfolio/src/components/animations/contexts/DataContext.tsx` - CMS data provider
- `/apps/portfolio/src/components/animations/HomepageContent.tsx` - Section renderer
- `/apps/portfolio/src/components/animations/sections/layouts/SectionLayout.tsx` - Reusable layout

**Status:** ✅ COMPLETED (2025-12-19)

---

### 0.3 Deployment Strategy (1 day) - ✅ COMPLETED (2025-12-29)

**See [Deployment Strategy Documentation](/home/aazucena/Projects/aazucena_apps/docs/deployment-strategy.md) for complete details.**

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

**Effort:** 0.25 days (just configuration)

---

#### Backend Deployment (Railway)

**Railway Setup:**
- Deploy `apps/cms` to Railway
- **Railway handles Docker image building** (no need for external CI/CD for builds)
- Provision PostgreSQL 16+ database with pgVector
- Provision Redis for caching
- Configure environment variables
- Automatic deployments from `main` branch

**Database:**
- PostgreSQL 16+ on Railway (with pgVector extension)
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

REDIS_URL=${REDIS_URL}

ALLOWED_ORIGINS=https://yoursite.com
```

**Railway Docker Build Process:**
- Railway automatically detects `Dockerfile` in `apps/cms/`
- Builds Docker image on each deployment
- Handles container orchestration and scaling
- Zero-downtime deployments with health checks

**Effort:** 0.75 days

---

#### CircleCI - Future Enhancement (Stashed)

**Current Status:** Stashed for future implementation when test suite matures (Phase 5+)

**Rationale for Stashing:**
- **Avoid Duplication:** Railway already handles Docker builds and deployments
- **Iterative Approach:** CircleCI provides limited value without comprehensive tests
- **Cost Efficiency:** No need for additional CI/CD infrastructure at this stage
- **Simplicity:** Fewer moving parts reduces complexity and maintenance burden

**Future Scope (Post-Phase 5):**

When revisited, CircleCI will **only handle prechecks**, NOT Docker builds or deployment:

**What CircleCI WILL Do:**
- ✅ Linting (ESLint, Prettier)
- ✅ Type checking (TypeScript strict mode)
- ✅ Unit tests (Vitest - when coverage is 70%+)
- ✅ Integration tests (when implemented)
- ✅ Security audits (npm audit, Snyk, OWASP dependency check)
- ✅ Code quality checks (SonarQube, CodeClimate)

**What CircleCI WON'T Do:**
- ❌ Docker image building (Railway handles this)
- ❌ Deployment (Railway auto-deploys from GitHub)
- ❌ Database migrations (Strapi handles this)

**Future Workflow (Prechecks Only):**
```yaml
jobs:
  - install-dependencies
  - lint (requires: install-dependencies)
  - type-check (requires: install-dependencies)
  - test-unit (requires: install-dependencies)
  - test-integration (requires: install-dependencies)
  - security-audit (requires: install-dependencies)
  - code-quality (requires: install-dependencies)
  - approve-deployment (requires: all checks, manual approval)
```

**When to Implement:**
- After Phase 5 (Testing & Quality) is complete
- When unit test coverage reaches 70%+
- When integration tests are implemented
- When E2E tests with Playwright are mature
- When security scanning is a priority

**Environment Variables (Future):**
- `STRAPI_API_URL` - For testing
- `STRAPI_API_TOKEN` - For testing
- No Railway deployment tokens needed (Railway auto-deploys)

**See:** [Deployment Strategy Guide](/home/aazucena/Projects/aazucena_apps/docs/deployment-strategy.md) for decision rationale and future implementation plan.

---

### 0.4 Content Migration & Transfer Token Workflow (3-4 days) - ✅ COMPLETED (2026-01-14)

**Goal:** Populate production CMS with real content using Strapi's Transfer Token workflow

**Note:** Static data files (813 lines in `sections/data/*.ts`) contain fake/placeholder data and are NOT imported by any components. All 8 section components already use CMS via `useSectionData()` hook.

---

#### 0.4.1 Transfer Token Workflow

**Overview:**
Use Strapi's native Transfer Token feature to sync content from local CMS (localhost:1337) to production Railway. This is more reliable than custom migration scripts and handles media files, relations, and content structure automatically.

**Prerequisites:**
- ✅ Local Strapi running (`cd apps/cms && docker compose up`)
- ✅ Production Strapi deployed to Railway
- ✅ Admin access to both local and production instances

---

**Step 1: Populate Local CMS**

1. Access `http://localhost:1337/admin`
2. Create content in these content types (in order):
   - **Portfolio** (Single Type): Personal info, social links, bio, resume
   - **Hero** (Single Type): Flip words, tagline, button text
   - **About** (Single Type): Bio, stats, highlights, learn more cards
   - **Skill Categories** (Collection): 5-6 categories (Frontend, Backend, etc.)
   - **Skills** (Collection): 15-30 individual skills linked to categories
   - **Experiences** (Collection): 3+ work experiences with achievements
   - **Website Configuration** (Single Type): Site metadata, SEO
   - **Homepage** (Single Type): Section ordering and visibility
   - **Project Showcase** (Single Type): Projects section UI config
   - **Preloader** (Single Type): Preloader configuration
3. **Publish all content** (not Draft status)
4. Verify content displays in local portfolio (`pnpm dev` in `apps/portfolio`)

---

**Step 2: Create Transfer Tokens**

**Local Strapi:**
1. Settings → Transfer Tokens → "+ Create new Transfer Token"
2. Token name: `Local to Production Transfer`
3. Token duration: `7 days` (or appropriate)
4. Token type: `Push` (sending data)
5. **Copy token immediately** (can't view again)

**Production Railway:**
1. Access `https://your-project.up.railway.app/admin`
2. Settings → Transfer Tokens → "+ Create new Transfer Token"
3. Token name: `Production Receiver`
4. Token duration: `7 days`
5. Token type: `Pull` (receiving data)
6. **Copy token immediately**

---

**Step 3: Run Transfer Command**

```bash
cd apps/cms

pnpm dlx strapi transfer \
  --from http://localhost:1337 \
  --from-token <local-push-token> \
  --to https://your-project.up.railway.app \
  --to-token <production-pull-token>
```

**What gets transferred:**
- ✅ All content entries (Portfolio, Hero, About, Skills, Experiences, etc.)
- ✅ Media files (uploaded to Cloudinary on production)
- ✅ Relations between content (Skills ↔ Experiences, Projects ↔ Skills)
- ✅ Components (SEO, Social Links, CTA Buttons, etc.)
- ✅ User roles and permissions (optional, can exclude with `--exclude admin`)

**Transfer Progress:**
- Terminal shows real-time progress
- Displays count of transferred entries
- Reports any errors or conflicts

---

**Step 4: Verify Transfer**

**In Railway Strapi Admin:**
- [ ] Check all content types have entries
- [ ] Verify media files are in Cloudinary (not localhost paths)
- [ ] Test relations (Skills linked to Experiences, etc.)
- [ ] Verify all content is Published (not Draft)

**Test API Endpoints:**
```bash
curl https://your-project.up.railway.app/api/portfolio
curl https://your-project.up.railway.app/api/hero
curl https://your-project.up.railway.app/api/about
curl https://your-project.up.railway.app/api/skill-categories?populate=skills
```

**Trigger Vercel Rebuild:**
1. Push any change to `main` branch, OR
2. Vercel Dashboard → Deployments → Redeploy
3. Wait for build to complete (2-5 min)
4. Visit production site and verify CMS content displays

---

**Troubleshooting:**

**Token Authentication Failed:**
- Verify tokens are correct (copy/paste errors)
- Check token hasn't expired
- Ensure `--from-token` is Push type, `--to-token` is Pull type

**Schema Mismatch:**
- Ensure both local and production have identical content type schemas
- Run `docker compose restart strapi` locally after schema changes
- Verify Railway deployment is up to date

**Media Transfer Issues:**
- Check Cloudinary credentials in Railway environment variables
- Verify `CLOUDINARY_NAME`, `CLOUDINARY_KEY`, `CLOUDINARY_SECRET` are set
- Test media upload in production Strapi admin

**Transfer Fails Midway:**
- Re-run command (Strapi handles duplicates)
- Check Railway logs for errors
- Verify PostgreSQL connection is stable

---

**Post-Transfer Cleanup:**

After successful transfer and verification:
1. **Delete static data arrays** from `apps/portfolio/src/components/animations/sections/data/*.ts`
2. Keep type definitions (or move to `types/portfolio.ts`)
3. Update imports to use CMS transformer types
4. Remove unused placeholder files

---

## Timeline Summary

| Phase | Duration | Status | Dependencies |
|-------|----------|--------|--------------|
| 0.1 Monorepo Restructuring | 2-3 days | ✅ COMPLETED | None |
| 0.2.1 Docker Compose Setup | 1-2 days | ✅ COMPLETED | Monorepo |
| 0.2.2 Strapi Configuration | 1 day | ✅ COMPLETED | Docker setup |
| 0.2.3 Content Types | 7-10 days | ✅ COMPLETED | Strapi config |
| 0.2.4 Frontend API Integration | 1-2 days | ✅ COMPLETED (2025-12-19) | Content types |
| 0.3 Deployment Strategy | 1 day | ✅ COMPLETED (2025-12-29) | CMS setup |
| 0.4 Content Migration | 3-4 days | ✅ COMPLETED (2026-01-14) | All above |

**Total:** 16-23 days (reduced from 16-20 days - CircleCI stashed)
**Completed:** ~18-22 days (Steps 0.1, 0.2.1, 0.2.2, 0.2.3, 0.2.4, 0.3, 0.4)
**Remaining:** ~5-6 hours (Step 0.5 - Portfolio Pages)

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

### 0.5 Portfolio Pages Implementation (5-6 hours) - ⏳ PENDING

**Goal:** Create the actual Astro pages that CMS links navigate to, including list/detail pages for projects/experiences, plus About and Journey pages.

**Detailed Plan:** [`.claude/plans/logical-strolling-neumann.md` - Phase 2](../.claude/plans/logical-strolling-neumann.md#phase-2-portfolio-pages-implementation)

#### Pages to Create

| Page | Route | Purpose | Time Est. |
|------|-------|---------|-----------|
| Projects List | `/projects` | Grid of all projects with filtering | 45 min |
| Project Detail | `/projects/[slug]` | Individual project showcase | 60 min |
| Experiences List | `/experiences` | Timeline of work experience | 30 min |
| Experience Detail | `/experiences/[slug]` | Individual experience details | 45 min |
| About | `/about` | Extended bio, interests, hobbies | 45 min |
| Journey | `/journey` | Interactive career timeline | 60 min |

#### Key Features

**Projects List (`/projects`):**
- Grid layout with project cards
- Filter by display level (featured, standard)
- Cover images with hover effects
- Tag display (first 3 tags per project)
- Links to detail pages

**Project Detail (`/projects/[slug]`):**
- Full project description (Markdown rendering)
- Cover image and screenshots gallery
- Tech stack with skill chips
- Impact metrics (stats component)
- Live demo and repository links
- Static generation via `getStaticPaths()`

**Experiences List (`/experiences`):**
- Timeline visualization with gradient line
- Chronological sorting (most recent first)
- Timeline dots with hover effects
- Company and role display
- Links to detail pages

**Experience Detail (`/experiences/[slug]`):**
- Full experience description
- Responsibilities and achievements
- Technologies used
- Timeline (start date - end date)

**About Page (`/about`):**
- Extended bio with profile image
- Interests & hobbies grid (Music, Gaming, Hardware, Community)
- Stats section ("By the Numbers")
- Markdown content rendering
- Back navigation to home

**Journey Page (`/journey`):**
- Interactive timeline (alternating left/right)
- Chronological view (oldest first)
- Year markers
- Visual timeline with gradient line
- Click to navigate to experience details

#### Final Step: Enable Navigation Cards

**Edit:** `apps/portfolio/src/components/animations/sections/AboutSection.tsx`

Uncomment the two navigation cards (lines 68-113):

```tsx
{/* Get to Know Me Card */}
<a href="/about" className="...">
  {/* Card content */}
</a>

{/* Career Journey Card */}
<a href="/journey" className="...">
  {/* Card content */}
</a>
```

#### Testing Checklist

- [ ] All 6 pages build successfully
- [ ] Static generation works for dynamic routes
- [ ] CMS data displays correctly
- [ ] Navigation between pages works
- [ ] Back links function properly
- [ ] Responsive on mobile/tablet/desktop
- [ ] MarkdownRenderer component exists (or create)

#### Dependencies

**Requires:**
- ✅ CMS content types (projects, experiences, portfolio, about)
- ✅ API clients (getProjects, getExperiences, getAbout, getPortfolio)
- ✅ BaseLayout component
- ⚠️ MarkdownRenderer component (verify exists or create)

**Creates:**
- 6 new Astro pages
- Enables 2 navigation cards in AboutSection

---

## Next Steps After Phase 0

1. **Step 0.5:** Portfolio Pages Implementation (5-6 hours) ⏳ **COMPLETE THIS BEFORE PHASE 2**
2. **Phase 2:** Component Architecture Improvements
3. **Phase 3:** Performance Optimization
4. **Phase 4:** Developer Experience (Figma/Storybook/Chromatic)
5. **Features:** Music player, logging, AI forms, etc.

---

---

## 📊 Progress Tracker

**Overall Progress:** 🚧 ~90% Complete

### Completed ✅
- ✅ 0.1: Monorepo verification
- ✅ 0.2.1: Docker Compose setup (Strapi v5.31.0 + PostgreSQL 16 + pgVector)
- ✅ 0.2.2: Strapi configuration (admin panel, Cloudinary)
- ✅ 0.2.3: Content types creation (20 content types: 10 collection + 10 single + 9 components)
- ✅ 0.2.4: Frontend API Integration (Strapi SDK) - **COMPLETED** (2025-12-19)
  - ✅ Modular API architecture: 19 specialized clients (replaced monolithic `api.ts`)
  - ✅ Type safety: 18 Zod validators + 17 transformers
  - ✅ DataContext system for CMS data access (no prop drilling)
  - ✅ New components: HomepageContent (replaces SectionContent), SectionLayout
  - ✅ New hooks: useSectionRegistry, useHandlebars, useDataContext
  - ✅ Caching strategy (force-cache for SSG, no-cache for maintenance)
  - ✅ Error handling with graceful fallbacks
  - ✅ All 15+ configuration APIs tested and working
  - ✅ Build passing with actual CMS data
- ✅ 0.3: Deployment Strategy - **COMPLETED** (2025-12-29)
  - ✅ Railway: Strapi CMS deployed at admin.aazucena.com
  - ✅ Vercel: Production portfolio deployed and connected
  - ✅ Integration: Frontend successfully connects to Railway CMS
  - ✅ APIs: All 19 endpoints accessible from production

### Completed ✅ (Phase 0.4)
- ✅ 0.4: Content Migration via Transfer Token (3-4 days) - **COMPLETED** (2026-01-14)
  - ✅ All content transferred from local Strapi to Railway production
  - ✅ Transfer Token workflow successful
  - ✅ Key fix: Transfer URL must include `/admin` suffix (e.g., `https://admin.aazucena.com/admin`)

### In Progress 🚧
- 🚧 0.5: Portfolio Pages Implementation (5-6 hours) - **CURRENT PRIORITY** 🔥
  - Create 6 new Astro pages:
    - `/projects` - Projects listing
    - `/projects/[slug]` - Individual project detail
    - `/experiences` - Experiences listing
    - `/experiences/[slug]` - Individual experience detail
    - `/about` - Expanded about page
    - `/journey` - Career journey timeline
  - Enable navigation cards in AboutSection

---

**Related Documentation:**
- [ROADMAP.md - Full Phase 0 Details](../ROADMAP.md#phase-0-infrastructure--architecture-foundation-after-phase-1-)
- [Strapi Content Types Guide - Version 2.0 Enhanced](../docs/strapi-content-types-guide.md) ⭐ **Production-Ready Guide**
- [Phase 1: Animations Refactoring](./phase-1-animations-refactoring.md)
- [Phase 1.5: Code Quality & Security Fixes](./phase-1.5-code-quality-security.md) ✅ **Completed**
- [AI-Powered Forms Feature](./features/ai-forms.md)
- [Logging & Monitoring](./features/logging-monitoring.md)

**Last Updated:** 2026-01-14

**Current Focus:** Step 0.5 - Portfolio Pages Implementation

**Recent Completions:**
- Step 0.4 - Content Migration ✅ (2026-01-14) - Transfer Token workflow successful, all content migrated to Railway
- Step 0.3 - Deployment Strategy ✅ (2025-12-29) - Railway + Vercel deployed, all APIs accessible
- Step 0.2.4 - Frontend API Integration ✅ (2025-12-19) - 19 API clients, 18 validators, 17 transformers
