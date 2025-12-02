# API Permissions Configuration

**[← Back to pgVector](./08-pgvector-setup.md)** | **[Next: Security & Deployment →](./10-security-deployment.md)**

---

## Overview

Configure API permissions for public access after creating all content types.

---

## Step 1: Navigate to Settings

1. Go to **Settings** (left sidebar)
2. Click **Users & Permissions Plugin** → **Roles**
3. Click **Public** role

---

## Step 2: Configure Permissions

### Single Types

| Content Type | Permissions |
|--------------|-------------|
| Hero | ✅ `find` |
| About | ✅ `find` |
| Settings | ✅ `find` |

### Collection Types

| Content Type | Permissions |
|--------------|-------------|
| Skills | ✅ `find`, ✅ `findOne` |
| Music Genres | ✅ `find`, ✅ `findOne` |
| Posts | ✅ `find`, ✅ `findOne` |
| Projects | ✅ `find`, ✅ `findOne` |
| Experience | ✅ `find`, ✅ `findOne` |
| Testimonials | ✅ `find`, ✅ `findOne` (only published) |
| Awards | ✅ `find`, ✅ `findOne` |
| Compositions | ✅ `find`, ✅ `findOne` |
| Form Submissions | ✅ `create` only |
| Easter Egg Completions | ✅ `create`, ✅ `find` (for leaderboard) |

**Note:** The blog architecture was simplified - there is a single `post` collection type instead of separate Blog Series and Blog Posts. See [Collection Types: Publishing](./06-collection-types-publishing.md) for details.

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
# Should work (200 OK)
curl http://localhost:1337/api/hero
curl http://localhost:1337/api/skills
curl http://localhost:1337/api/posts
curl http://localhost:1337/api/projects

# Should work (create)
curl -X POST http://localhost:1337/api/form-submissions \
  -H "Content-Type: application/json" \
  -d '{"formType": "Contact", "rawMessage": "Test", "submittedAt": "2025-01-15T00:00:00Z"}'

# Should fail (403 Forbidden) - requires admin
curl -X POST http://localhost:1337/api/projects \
  -H "Content-Type: application/json" \
  -d '{"title": "Test"}'
```

---

## Next Steps

**[→ Configure Security & Deployment](./10-security-deployment.md)**

---

**Last Updated:** 2025-01-15

**[← pgVector](./08-pgvector-setup.md)** | **[Next: Security →](./10-security-deployment.md)**
