# Phase 0: Infrastructure & Architecture Foundation

📍 **Full Documentation:** [ROADMAP.md Phase 0](../ROADMAP.md#phase-0-infrastructure--architecture-foundation-after-phase-1-)

## Priority Status: Execute AFTER Phase 1

**Estimated Effort:** 12-16 days

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
   npx create-strapi-app@latest cms \
     --quickstart \
     --no-run \
     --skip-cloud \
     --typescript
   ```

3. **Configure Dockerfile**
   ```dockerfile
   FROM node:18-alpine

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

   COPY package.json pnpm-lock.yaml ./
   RUN npm install -g pnpm && pnpm install

   COPY . .

   ENV NODE_ENV=development

   EXPOSE 1337

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
   docker-compose up -d

   # View logs
   docker-compose logs -f strapi

   # Access admin panel
   # http://localhost:1337/admin
   ```

7. **Useful Docker Commands**
   ```bash
   # Stop containers
   docker-compose down

   # Remove volumes (reset database)
   docker-compose down -v

   # Rebuild after dependency changes
   docker-compose up -d --build

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
- ✅ Easy team onboarding (just `docker-compose up`)

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

#### 0.2.3 Content Types Creation (1-2 days)

**Goal:** Define all content models in Strapi admin panel

**Content Types to Create:**

1. **About** (Single Type)
   - Name, bio, profile image, social links
   - Rich text for biography
   - Future: Embedding field for AI-powered forms (pgVector)

2. **Experience** (Collection)
   - Company, position, duration, highlights
   - Rich text editor for detailed descriptions
   - Boolean for `isCurrent` status

3. **Projects** (Collection)
   - Title, description, images, tech stack
   - Relation to Skills collection
   - GitHub/live demo URLs

4. **Skills** (Collection)
   - Name, category, proficiency level (1-100)
   - Icon/logo upload
   - Relation to Projects

5. **Testimonials** (Collection)
   - Author, content, avatar, rating (1-5)
   - Approval status workflow (draft/published)
   - Company/role information
   - Future: Embedding field for semantic search (pgVector)

6. **Blog Posts** (Collection)
   - Title, content (Markdown/Rich text), tags
   - Featured image, excerpt
   - SEO metadata (title, description, keywords)
   - Published date, author

7. **Awards** (Collection)
   - Title, organization, year, description
   - Verification URL
   - Badge/certificate image upload

8. **Compositions** (Collection)
   - Title, audio file (Cloudinary)
   - Metadata (BPM, key, duration, genre)
   - Waveform data (JSON for wavesurfer.js)
   - Release date, description

9. **Settings** (Single Type)
   - Site configuration (title, tagline, logo)
   - SEO defaults (meta tags, OG images)
   - Analytics IDs (Google, Vercel)
   - Feature flags (enable/disable sections)
   - Social media links

**Content Type Best Practices:**
- Use `draft/publish` system for content review
- Add `createdAt` and `updatedAt` timestamps (automatic)
- Set up field validations (required, min/max length)
- Configure API permissions per content type

**Note:** pgVector fields for embeddings will be added in later phases when implementing AI-powered forms and semantic search features (see `docs/features/ai-forms.md`).

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
| 0.2.3 Content Types | 1-2 days | Strapi config |
| 0.2.4 Frontend API Integration | 1-2 days | Content types |
| 0.3 Deployment Strategy | 1.5 days | CMS setup |
| 0.4 Content Migration | 3 days | All above |

**Total:** 11-16 days (Phase 0.2 now broken into 4 sub-phases)

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
- ✅ One-command setup (`docker-compose up`)
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
- [Phase 1: Animations Refactoring](./phase-1-animations-refactoring.md)
- [Logging & Monitoring](./features/logging-monitoring.md)
