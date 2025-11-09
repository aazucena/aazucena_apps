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

**Strapi Setup:**
- Install Strapi v4 in `apps/cms`
- Configure PostgreSQL database (Railway)
- Set up admin panel authentication
- Configure media uploads (Cloudinary)

**Content Types to Create:**

1. **About** (Single Type) - Name, bio, profile image, social links
2. **Experience** (Collection) - Company, position, duration, highlights
3. **Projects** (Collection) - Title, description, images, tech stack
4. **Skills** (Collection) - Name, category, proficiency
5. **Testimonials** (Collection) - Author, content, avatar, rating
6. **Blog Posts** (Collection) - Title, content, tags, featured image
7. **Awards** (Collection) - Title, organization, year, verification
8. **Compositions** (Collection) - Audio files, metadata, waveform data
9. **Settings** (Single Type) - Site config, SEO, analytics

**Frontend Integration:**
- Create API client (`lib/strapi.ts`)
- Implement data fetching utilities
- Add ISR (Incremental Static Regeneration)
- Replace static data with API calls
- Add loading states and error handling

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
| 0.1 Monorepo | 2-3 days | None |
| 0.2 Strapi CMS | 5-7 days | Monorepo |
| 0.3 Deployment | 1.5 days | CMS setup |
| 0.4 Migration | 3 days | All above |

**Total:** 12-16 days

---

## Success Metrics

**Before:**
- Static data in code
- Manual deployments
- No content management
- Single codebase

**After:**
- ✅ Dynamic CMS-managed content
- ✅ Automatic deployments (Vercel + Railway)
- ✅ Non-technical content editing
- ✅ Monorepo with shared packages
- ✅ Type-safe API integration

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
