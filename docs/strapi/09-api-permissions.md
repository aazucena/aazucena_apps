# API Permissions Configuration

**[← Back to pgVector](./08-pgvector-setup.md)** | **[Next: Security & Deployment →](./10-security-deployment.md)**

---

## Overview

Configure API permissions for public access after creating all content types.

**Scope:** This guide covers **public API permissions** for content types that need to be accessible to unauthenticated users (frontend visitors). Configuration single types are excluded as they are accessed server-side with admin credentials.

---

## Configuration Single Types (No Public Access Required)

The following single types are **configuration-only** and do NOT require public API permissions:

| Single Type | Purpose | Access Method |
|-------------|---------|---------------|
| Portfolio | Hero/profile data | Server-side with admin credentials |
| Homepage | Section visibility toggles | Server-side with admin credentials |
| Animation System | Performance settings | Server-side with admin credentials |
| Website Configuration | Site metadata | Server-side with admin credentials |
| Theme & Branding | Colors and fonts | Server-side with admin credentials |
| Maintenance Mode | Site maintenance | Server-side with admin credentials |
| Analytics & Monitoring | Tracking configuration | Server-side with admin credentials |
| Blog Configuration | Blog settings | Server-side with admin credentials |

**Why No Public Access?**
- These are internal configurations fetched at build time or via authenticated server-side calls
- Exposing them publicly would be a security risk (API keys, internal settings)
- Frontend receives this data through server-side rendering or build-time data fetching

---

## Step 1: Navigate to Settings

1. Go to **Settings** (left sidebar)
2. Click **Users & Permissions Plugin** → **Roles**
3. Click **Public** role

---

## Step 2: Configure Permissions

### Single Types (Public Access)

**Note:** Only single types that serve public content need `find` permission. Configuration types (see above) should NOT have public access enabled.

| Content Type | Permissions | Notes |
|--------------|-------------|-------|
| Hero | ✅ `find` | Hero banner content |
| About | ✅ `find` | About section content |

### Collection Types

**Core Content:**

| Content Type | Permissions | Notes |
|--------------|-------------|-------|
| Skills | ✅ `find`, ✅ `findOne` | Technical skills display |
| Music Genres | ✅ `find`, ✅ `findOne` | Genre taxonomy |

**Content & Portfolio:**

| Content Type | Permissions | Notes |
|--------------|-------------|-------|
| Posts | ✅ `find`, ✅ `findOne` | Blog articles (simplified architecture) |
| Projects | ✅ `find`, ✅ `findOne` | Portfolio projects |
| Experience | ✅ `find`, ✅ `findOne` | Work history |
| Testimonials | ✅ `find`, ✅ `findOne` | Client reviews (only published) |
| Awards | ✅ `find`, ✅ `findOne` | Certifications and achievements |
| Compositions | ✅ `find`, ✅ `findOne` | Music tracks |

**Interactive/Forms (Special Permissions):**

| Content Type | Permissions | Notes |
|--------------|-------------|-------|
| Form Submissions | ✅ `create` only | Public form submissions (Contact, Feedback, etc.) |
| Easter Egg Completions | ✅ `create`, ✅ `find` | Challenge completions + leaderboard |

**Architecture Note:** The blog architecture was simplified - there is a single `post` collection type instead of separate Blog Series and Blog Posts. See [Collection Types: Publishing](./06-collection-types-publishing.md) for details.

### DO NOT Enable

For most content types:
- ❌ `create`
- ❌ `update`
- ❌ `delete`

### EXCEPTION

Enable `create` ONLY for:
- **Form Submissions** (public form submissions)
- **Easter Egg Completions** (public challenge completions)

Admin panel handles read/update/delete for these.

---

## Step 3: Save Permissions

Click **Save** at the top right.

---

## Verification

Test endpoints:

```bash
# ✅ Should work (200 OK) - Public content
curl http://localhost:1337/api/hero
curl http://localhost:1337/api/about
curl http://localhost:1337/api/skills
curl http://localhost:1337/api/posts
curl http://localhost:1337/api/projects

# ✅ Should work (create only)
curl -X POST http://localhost:1337/api/form-submissions \
  -H "Content-Type: application/json" \
  -d '{"formType": "Contact", "rawMessage": "Test", "submittedAt": "2025-01-15T00:00:00Z"}'

# ❌ Should fail (403 Forbidden) - Configuration types require admin auth
curl http://localhost:1337/api/portfolio
curl http://localhost:1337/api/website-configuration
curl http://localhost:1337/api/theme
curl http://localhost:1337/api/animation

# ❌ Should fail (403 Forbidden) - Write operations require admin
curl -X POST http://localhost:1337/api/projects \
  -H "Content-Type: application/json" \
  -d '{"title": "Test"}'
```

**Expected Results:**
- Public content endpoints return data (Hero, About, Skills, etc.)
- Form submission creation succeeds
- Configuration endpoints return 403 Forbidden
- Write operations (POST/PUT/DELETE) on content return 403 Forbidden

---

## Next Steps

**[→ Configure Security & Deployment](./10-security-deployment.md)**

---

**Last Updated:** 2025-12-02

**[← pgVector](./08-pgvector-setup.md)** | **[Next: Security →](./10-security-deployment.md)**
