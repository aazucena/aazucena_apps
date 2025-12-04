# Deployment Strategy

**Status:** CircleCI stashed for future implementation (prechecks only)
**Current Approach:** Vercel (frontend) + Railway (backend with Docker builds)
**Last Updated:** 2025-12-04

---

## Table of Contents

1. [Current Deployment Architecture](#current-deployment-architecture)
2. [Why CircleCI is Stashed](#why-circleci-is-stashed)
3. [CircleCI Future Scope](#circleci-future-scope)
4. [Railway Deployment Details](#railway-deployment-details)
5. [Vercel Deployment Details](#vercel-deployment-details)
6. [Decision Matrix](#decision-matrix)
7. [Migration Plan (Future)](#migration-plan-future)

---

## Current Deployment Architecture

### Overview

The portfolio uses a **simplified two-platform deployment strategy** that avoids duplication and complexity:

```
┌─────────────────────────────────────────────────────────────┐
│                      GitHub Repository                       │
│                    (aazucena_apps - main)                   │
└───────────────┬─────────────────────────────┬───────────────┘
                │                             │
                │                             │
     ┌──────────▼─────────┐       ┌──────────▼──────────┐
     │   Vercel (Auto)    │       │  Railway (Auto)     │
     │                    │       │                     │
     │  Frontend Deploy   │       │  Backend Deploy     │
     │  - Astro Portfolio │       │  - Strapi CMS       │
     │  - React           │       │  - Docker Build     │
     │  - SSG + ISR       │       │  - PostgreSQL 16+   │
     │                    │       │  - pgVector         │
     │                    │       │  - Redis            │
     └────────────────────┘       └─────────────────────┘
              │                            │
              │    API Requests            │
              └────────────────────────────┘
```

### Key Characteristics

- **Zero CI/CD Infrastructure:** No CircleCI, Jenkins, GitHub Actions needed
- **Automatic Deployments:** Both platforms auto-deploy from GitHub
- **Railway Handles Docker Builds:** No need for external Docker registry or build pipeline
- **Simple Mental Model:** Push to `main` → Everything deploys automatically

---

## Why CircleCI is Stashed

### Rationale for Deferring CircleCI

The decision to stash CircleCI implementation was made based on the following considerations:

#### 1. Avoid Duplication

**Problem:**
- Railway already builds Docker images from `apps/cms/Dockerfile`
- Railway already deploys to production on every push to `main`
- Adding CircleCI would duplicate this build/deploy workflow

**Solution:**
- Let Railway handle what it does best (Docker builds + deployments)
- Only introduce CircleCI when it provides **unique value** (prechecks)

#### 2. Iterative Approach

**Problem:**
- CircleCI is most valuable with a mature test suite
- Current test coverage: ~0% (Vitest installed but not configured)
- Without tests, CircleCI just adds complexity without safety

**Solution:**
- Implement CircleCI **after Phase 5 (Testing & Quality)** when:
  - Unit test coverage reaches 70%+
  - Integration tests are implemented
  - E2E tests with Playwright are mature
  - Security scanning is a priority

#### 3. Cost Efficiency

**Problem:**
- CircleCI has usage limits on free tier (2,500 credits/month)
- Running redundant Docker builds wastes credits
- Personal portfolio doesn't need enterprise-grade CI/CD yet

**Solution:**
- Use free automatic deployments (Vercel + Railway)
- Introduce paid CI/CD only when justified by comprehensive testing

#### 4. Simplicity & Maintenance

**Problem:**
- More infrastructure = more moving parts = more maintenance
- CircleCI config requires ongoing updates (`.circleci/config.yml`)
- Debugging CI/CD issues takes time away from feature development

**Solution:**
- Keep deployment strategy simple until project matures
- Focus on building features, not maintaining infrastructure

### What We Lose (Acceptable Trade-offs)

By stashing CircleCI, we temporarily lose:

- ❌ **Pre-deployment Checks:** No automatic linting/testing before deploy
- ❌ **Monorepo-wide Testing:** No centralized test runner
- ❌ **Security Audits:** No automatic vulnerability scanning
- ❌ **Code Quality Gates:** No blocking on quality issues

**Why This is Acceptable:**

- Local development catches most issues (linting, type checking)
- Small team (solo developer) can manually verify changes
- Railway/Vercel both have rollback mechanisms if issues arise
- Can add CircleCI later when test suite justifies the infrastructure

---

## CircleCI Future Scope

### When to Implement

CircleCI should be revisited **after Phase 5 (Testing & Quality)** when:

✅ **Test Suite Maturity:**
- Unit test coverage: 70%+ (Vitest)
- Integration tests: Implemented for critical flows
- E2E tests: Playwright tests for user journeys
- Visual regression: Chromatic tests for UI components

✅ **Security Requirements:**
- Need automated vulnerability scanning
- Compliance requirements emerge
- Dependency audits become critical

✅ **Team Growth:**
- Multiple developers contributing
- Pull request approval process needed
- Quality gates required before merging

### CircleCI Prechecks-Only Approach

When implemented, CircleCI will **NOT duplicate Railway's work**. Instead:

#### What CircleCI WILL Do (Prechecks)

```yaml
# .circleci/config.yml (Future)
version: 2.1

workflows:
  precheck-only:
    jobs:
      - install-dependencies
      - lint:
          requires: [install-dependencies]
      - type-check:
          requires: [install-dependencies]
      - test-unit:
          requires: [install-dependencies]
      - test-integration:
          requires: [install-dependencies]
      - security-audit:
          requires: [install-dependencies]
      - code-quality:
          requires: [install-dependencies]
      - approve-deployment:
          type: approval
          requires:
            - lint
            - type-check
            - test-unit
            - test-integration
            - security-audit
            - code-quality
```

**Specific Checks:**

1. **Linting**
   - ESLint (JavaScript/TypeScript)
   - Prettier (code formatting)
   - Stylelint (CSS/SCSS - if applicable)

2. **Type Checking**
   - TypeScript strict mode (`tsc --noEmit`)
   - Type coverage checks

3. **Unit Tests**
   - Vitest test runner
   - Coverage reports (70%+ threshold)
   - Fail on coverage drop

4. **Integration Tests**
   - API endpoint tests
   - Database integration tests
   - Strapi lifecycle hook tests

5. **Security Audits**
   - `npm audit` (critical vulnerabilities)
   - Snyk vulnerability scanning
   - OWASP dependency check
   - License compliance

6. **Code Quality**
   - SonarQube analysis
   - CodeClimate maintainability
   - Complexity metrics
   - Duplication detection

#### What CircleCI WON'T Do

- ❌ **Docker Image Building** → Railway handles this
- ❌ **Deployment** → Railway auto-deploys from GitHub
- ❌ **Database Migrations** → Strapi handles this
- ❌ **Asset Optimization** → Vercel/Railway handle this
- ❌ **Environment Provisioning** → Railway handles this

### Future Workflow

```
┌────────────────────────────────────────────────────────────┐
│  Developer pushes to main branch                            │
└────────────┬───────────────────────────────────────────────┘
             │
             ├─────────────────┬──────────────────────────────┐
             │                 │                              │
    ┌────────▼────────┐  ┌────▼────────┐         ┌──────────▼─────────┐
    │  CircleCI       │  │  Vercel     │         │  Railway           │
    │  (Prechecks)    │  │  (Frontend) │         │  (Backend)         │
    │                 │  │             │         │                    │
    │  ✓ Lint         │  │  Build Astro│         │  Build Docker      │
    │  ✓ Type Check   │  │  Deploy     │         │  Migrate DB        │
    │  ✓ Unit Tests   │  │             │         │  Deploy            │
    │  ✓ Integration  │  │             │         │                    │
    │  ✓ Security     │  │             │         │                    │
    │  ✓ Quality      │  │             │         │                    │
    └─────────────────┘  └─────────────┘         └────────────────────┘
             │                 │                              │
             │                 │                              │
             ▼                 ▼                              ▼
    Manual Approval     Auto Deploy                    Auto Deploy
    (if checks pass)
```

**Key Insight:** CircleCI runs in parallel with deployments but **doesn't block them** (unless configured to). It provides visibility and optional approval gates.

### Environment Variables (Future)

```env
# CircleCI Environment Variables
STRAPI_API_URL=https://cms-staging.yoursite.com
STRAPI_API_TOKEN=test_token_xxxxx

# NO deployment tokens needed:
# - No RAILWAY_TOKEN (Railway auto-deploys)
# - No VERCEL_TOKEN (Vercel auto-deploys)
```

---

## Railway Deployment Details

### Overview

Railway is a **Platform-as-a-Service (PaaS)** that handles:
- Docker image building
- Container orchestration
- Database provisioning (PostgreSQL 16+ with pgVector)
- Redis provisioning
- Automatic deployments from GitHub

### Docker Build Process

Railway automatically:

1. **Detects Dockerfile:** Finds `apps/cms/Dockerfile` in repository
2. **Builds Image:** Runs `docker build` on Railway's infrastructure
3. **Optimizes Layers:** Caches Docker layers for faster builds
4. **Runs Migrations:** Strapi auto-migrates database schema on startup
5. **Health Checks:** Waits for app to be healthy before switching traffic
6. **Zero-Downtime Deploy:** Gradually shifts traffic from old to new container

### Infrastructure

```yaml
# Railway Services (Auto-provisioned)
services:
  - strapi:
      dockerfile: apps/cms/Dockerfile
      port: 1337
      auto_deploy: true
      branch: main

  - postgres:
      image: pgvector/pgvector:pg16
      auto_backup: true
      connection_pooling: true

  - redis:
      image: redis:7-alpine
      persistence: true
```

### Environment Variables

```env
# Node Environment
NODE_ENV=production

# Database (Railway auto-injects)
DATABASE_CLIENT=postgres
DATABASE_HOST=${PGHOST}           # Railway provides
DATABASE_PORT=${PGPORT}           # Railway provides
DATABASE_NAME=${PGDATABASE}       # Railway provides
DATABASE_USERNAME=${PGUSER}       # Railway provides
DATABASE_PASSWORD=${PGPASSWORD}   # Railway provides
DATABASE_SSL=true

# Redis (Railway auto-injects)
REDIS_URL=${REDIS_URL}            # Railway provides

# Cloudinary (User provides)
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_KEY=your_api_key
CLOUDINARY_SECRET=your_api_secret

# CORS (User provides)
ALLOWED_ORIGINS=https://yoursite.com,https://www.yoursite.com

# Strapi (User provides)
ADMIN_JWT_SECRET=random_secret_xxxxx
API_TOKEN_SALT=random_salt_xxxxx
APP_KEYS=key1,key2,key3,key4
JWT_SECRET=random_jwt_secret_xxxxx
TRANSFER_TOKEN_SALT=random_transfer_salt_xxxxx
```

### Benefits

✅ **No Docker Registry Needed:** Railway builds and stores images
✅ **No CI/CD Config:** No `.circleci/config.yml` or GitHub Actions
✅ **Automatic Rollbacks:** Easy rollback to previous deployments
✅ **Built-in Monitoring:** CPU, memory, network metrics
✅ **Logs Aggregation:** Centralized log viewer
✅ **Custom Domains:** SSL certificates auto-managed

### Deployment Triggers

Railway automatically deploys when:
- Push to `main` branch
- Manual trigger via Railway dashboard
- API call to Railway deployment webhook

**No CircleCI needed for deployment!**

---

## Vercel Deployment Details

### Overview

Vercel is optimized for **frontend frameworks** (Astro, Next.js, React):
- Automatic builds on every push
- Preview deployments for PRs
- Edge network CDN
- Image optimization
- ISR (Incremental Static Regeneration)

### Build Configuration

```json
// vercel.json
{
  "buildCommand": "cd ../.. && pnpm turbo run build --filter=portfolio",
  "outputDirectory": "apps/portfolio/dist",
  "framework": "astro",
  "installCommand": "pnpm install --frozen-lockfile"
}
```

### Environment Variables

```env
# Strapi CMS
STRAPI_API_URL=https://cms.yoursite.com
STRAPI_API_TOKEN=readonly_token_xxxxx

# Analytics
VERCEL_ANALYTICS_ID=xxxxx
SENTRY_DSN=xxxxx

# Public Variables (Exposed to Browser)
PUBLIC_SITE_URL=https://yoursite.com
```

### Deployment Triggers

Vercel automatically deploys when:
- Push to `main` branch → Production deployment
- Push to any PR → Preview deployment (unique URL)
- Manual trigger via Vercel dashboard

### Benefits

✅ **Zero Config:** Detects Astro automatically
✅ **Preview URLs:** Every PR gets a unique URL
✅ **Edge Caching:** Content cached at edge for speed
✅ **ISR Support:** Revalidate pages every 60 seconds
✅ **Image Optimization:** Automatic WebP/AVIF conversion

---

## Decision Matrix

### Current Approach (Vercel + Railway)

| Aspect | Vercel | Railway | CircleCI (Stashed) |
|--------|--------|---------|-------------------|
| **Frontend Build** | ✅ Yes | - | - |
| **Backend Build** | - | ✅ Yes (Docker) | ❌ No |
| **Deployment** | ✅ Auto | ✅ Auto | ❌ No |
| **Database** | - | ✅ PostgreSQL + pgVector | - |
| **Redis** | - | ✅ Yes | - |
| **Linting** | ❌ No | ❌ No | ⏳ Future |
| **Testing** | ❌ No | ❌ No | ⏳ Future |
| **Security Scans** | ❌ No | ❌ No | ⏳ Future |
| **Cost** | Free tier | Free tier | Future (paid) |
| **Complexity** | Low | Low | Medium (when added) |

### Pros & Cons

#### Current Approach (No CircleCI)

**Pros:**
- ✅ Simplest possible setup (2 platforms, both free)
- ✅ No redundant Docker builds (Railway handles it)
- ✅ Automatic deployments (push to `main` → deploys)
- ✅ No CI/CD config maintenance
- ✅ Fast iteration (fewer moving parts)
- ✅ Low learning curve

**Cons:**
- ❌ No pre-deployment testing
- ❌ No security audits
- ❌ No code quality gates
- ❌ Manual checks required before pushing

#### Future Approach (With CircleCI Prechecks)

**Pros:**
- ✅ Automated testing before deploy
- ✅ Security vulnerability scanning
- ✅ Code quality enforcement
- ✅ Prevents regressions
- ✅ Team collaboration safety

**Cons:**
- ❌ Additional infrastructure to maintain
- ❌ CI/CD config complexity (`.circleci/config.yml`)
- ❌ Potential cost (after free tier)
- ❌ Slower feedback loop (wait for checks)

---

## Migration Plan (Future)

### When to Add CircleCI

**Trigger Conditions:**

1. **Test Suite Milestone**
   - Unit test coverage: 70%+
   - Integration tests: Implemented
   - E2E tests: Mature Playwright suite

2. **Team Growth**
   - Multiple contributors
   - Need pull request approvals
   - Quality gates required

3. **Security Requirements**
   - Compliance mandates
   - Automated vulnerability scanning
   - OWASP dependency checks

### Implementation Steps

**Phase A: Setup (1 day)**

1. Create CircleCI account and link GitHub
2. Create `.circleci/config.yml` in repo root
3. Configure environment variables (STRAPI_API_URL, STRAPI_API_TOKEN)
4. Test with simple linting workflow

**Phase B: Test Integration (2-3 days)**

1. Add Vitest unit tests to CircleCI
2. Add integration tests
3. Configure coverage thresholds (70%+)
4. Test failure scenarios

**Phase C: Security & Quality (1-2 days)**

1. Add `npm audit` security checks
2. Integrate Snyk vulnerability scanning
3. Add SonarQube/CodeClimate analysis
4. Configure quality gates

**Phase D: Documentation (0.5 day)**

1. Update deployment strategy docs
2. Create CircleCI troubleshooting guide
3. Document approval workflow

**Total Effort:** 4.5-6.5 days (when implemented)

### Rollback Plan

If CircleCI causes issues:

1. **Disable CircleCI:** Project Settings → Stop Building
2. **Revert to Railway/Vercel Only:** Deployments continue automatically
3. **Keep Config File:** Leave `.circleci/config.yml` for future use
4. **Document Issues:** Log what went wrong for future attempt

---

## Key Takeaways

### Current Strategy

1. **Railway handles all backend concerns** (Docker builds, deployments, database, Redis)
2. **Vercel handles all frontend concerns** (builds, deployments, CDN, ISR)
3. **CircleCI is stashed** until test suite matures (Phase 5+)

### When CircleCI is Added

1. **CircleCI will only do prechecks** (linting, tests, security, quality)
2. **CircleCI will NOT build Docker images** (Railway already does this)
3. **CircleCI will NOT deploy** (Railway/Vercel auto-deploy from GitHub)
4. **CircleCI provides safety nets**, not deployment pipelines

### Decision Principles

- **Avoid Duplication:** Don't replicate what platforms already do well
- **Iterative Approach:** Add infrastructure only when justified by maturity
- **Cost Efficiency:** Use free tiers until paid features are necessary
- **Simplicity First:** Fewer moving parts = easier maintenance

---

## Related Documentation

- [Phase 0: Infrastructure](/home/aazucena/Projects/aazucena_apps/docs/phase-0-infrastructure.md) - Complete infrastructure setup
- [Phase 5: Testing & Quality](/home/aazucena/Projects/aazucena_apps/docs/phase-5-testing.md) - When CircleCI becomes valuable
- [ROADMAP.md](/home/aazucena/Projects/aazucena_apps/ROADMAP.md) - Overall project roadmap

---

**Last Updated:** 2025-12-04
**Status:** CircleCI stashed - Vercel + Railway active
**Next Review:** After Phase 5 (Testing & Quality) completion
