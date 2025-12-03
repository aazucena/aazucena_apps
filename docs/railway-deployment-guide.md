# Railway Deployment Guide - Strapi CMS

**Complete step-by-step guide for deploying Strapi v5 to Railway with PostgreSQL**

---

## 📋 Prerequisites

- [x] Railway account (sign up at [railway.app](https://railway.app))
- [x] GitHub repository with Strapi CMS (`apps/cms`)
- [x] Cloudinary account for media storage
- [x] Local Strapi working (tested with Docker Compose)

---

## 🚀 Deployment Steps

### Step 1: Create Railway Project

1. **Go to Railway Dashboard**
   - Visit [railway.app](https://railway.app)
   - Click "New Project"

2. **Choose GitHub Repository**
   - Click "Deploy from GitHub repo"
   - Select `aazucena/aazucena_apps`
   - Railway will detect your monorepo

3. **Configure Root Directory**
   - Railway should auto-detect the monorepo
   - If not, set root directory: `apps/cms`

---

### Step 2: Add PostgreSQL Database

1. **Add PostgreSQL Service**
   - In your Railway project, click "+ New"
   - Select "Database" → "PostgreSQL"
   - Railway will automatically provision a PostgreSQL instance

2. **Note Database Variables**
   Railway automatically creates these environment variables:
   - `PGHOST` - Database host
   - `PGPORT` - Database port (usually 5432)
   - `PGDATABASE` - Database name
   - `PGUSER` - Database username
   - `PGPASSWORD` - Database password
   - `DATABASE_URL` - Full connection string

3. **Enable pgVector Extension** (if needed for AI features)
   ```sql
   -- Connect to Railway PostgreSQL via Railway's Data tab
   CREATE EXTENSION IF NOT EXISTS vector;
   ```

---

### Step 3: Configure Environment Variables

In Railway project → Strapi service → Variables tab, add:

#### Required Variables

```env
# Node Environment
NODE_ENV=production

# Strapi Keys (IMPORTANT: Generate unique production keys!)
# Generate with: openssl rand -base64 32
APP_KEYS=<generate_key_1>,<generate_key_2>,<generate_key_3>,<generate_key_4>
API_TOKEN_SALT=<generate_key_5>
ADMIN_JWT_SECRET=<generate_key_6>
TRANSFER_TOKEN_SALT=<generate_key_7>
JWT_SECRET=<generate_key_8>

# Database (Railway provides these automatically)
DATABASE_CLIENT=postgres
DATABASE_HOST=${{Postgres.PGHOST}}
DATABASE_PORT=${{Postgres.PGPORT}}
DATABASE_NAME=${{Postgres.PGDATABASE}}
DATABASE_USERNAME=${{Postgres.PGUSER}}
DATABASE_PASSWORD=${{Postgres.PGPASSWORD}}
DATABASE_SSL=true

# Host & Port
HOST=0.0.0.0
PORT=${{PORT}}

# Cloudinary (from https://cloudinary.com/console)
CLOUDINARY_NAME=<your_cloud_name>
CLOUDINARY_KEY=<your_api_key>
CLOUDINARY_SECRET=<your_api_secret>

# CORS - Your frontend URL
ALLOWED_ORIGINS=https://your-domain.vercel.app
```

#### Optional Variables

```env
# Database Pool
DATABASE_POOL_MIN=0
DATABASE_POOL_MAX=10

# Redis (if using Railway Redis add-on)
REDIS_HOST=${{Redis.REDIS_HOST}}
REDIS_PORT=${{Redis.REDIS_PORT}}
REDIS_PASSWORD=${{Redis.REDIS_PASSWORD}}
REDIS_DB=0

# Monitoring
SENTRY_DSN=<your_sentry_dsn>
LOG_LEVEL=info

# Plugins
DOCUMENTATION_ENABLED=true
GRAPHQL_ENABLED=true
GRAPHQL_PLAYGROUND=false
GRAPHQL_DEPTH_LIMIT=10

# Rate Limiting
RATE_LIMIT_ENABLED=true
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_MS=60000
```

---

### Step 4: Generate Production Keys

Run this command locally to generate secure keys:

```bash
# Generate 8 unique keys for production
for i in {1..8}; do openssl rand -base64 32; done
```

Copy each generated key to the corresponding variable:
- Key 1 → First value in `APP_KEYS`
- Key 2 → Second value in `APP_KEYS`
- Key 3 → Third value in `APP_KEYS`
- Key 4 → Fourth value in `APP_KEYS`
- Key 5 → `API_TOKEN_SALT`
- Key 6 → `ADMIN_JWT_SECRET`
- Key 7 → `TRANSFER_TOKEN_SALT`
- Key 8 → `JWT_SECRET`

**Format for APP_KEYS:**
```
APP_KEYS=key1,key2,key3,key4
```

---

### Step 5: Configure Build Settings

Railway should auto-detect these settings via `railway.json`, but verify:

**Build Command:**
```bash
pnpm install && pnpm build
```

**Start Command:**
```bash
pnpm start
```

**Healthcheck Path:**
```
/_health
```

---

### Step 6: Deploy

1. **Trigger Deployment**
   - Railway automatically deploys on push to `main`
   - Or click "Deploy" in Railway dashboard

2. **Monitor Build Logs**
   - Watch for errors in Railway dashboard
   - Build should take 3-5 minutes

3. **Check Deployment Status**
   - Look for "Deployed successfully" message
   - Note your Railway URL (e.g., `https://cms-production.railway.app`)

---

### Step 7: Access Strapi Admin Panel

1. **Get Railway Public URL**
   - In Railway dashboard → Strapi service → Settings → Networking
   - Click "Generate Domain" if not already generated
   - Your URL: `https://your-project-name.up.railway.app`

2. **Create Admin Account**
   - Visit: `https://your-project-name.up.railway.app/admin`
   - Create your first admin user
   - **IMPORTANT:** Save these credentials securely!

3. **Verify Strapi is Running**
   - Health check: `https://your-project-name.up.railway.app/_health`
   - API: `https://your-project-name.up.railway.app/api`

---

### Step 8: Create API Token for Frontend

1. **Navigate to API Tokens**
   - Strapi Admin → Settings → API Tokens
   - Click "Create new API Token"

2. **Configure Token**
   - **Name:** `Frontend Build/SSR Token`
   - **Description:** `Token for Astro frontend to fetch CMS data during build`
   - **Token duration:** Unlimited
   - **Token type:** Read-Only (recommended) or Full Access

3. **Set Permissions**
   - Grant access to all content types you'll fetch:
     - ✅ `hero` (find)
     - ✅ `about` (find)
     - ✅ `skills` (find, findOne)
     - ✅ `projects` (find, findOne)
     - ✅ `posts` (find, findOne)
     - ✅ `experiences` (find)
     - ✅ `testimonials` (find)
     - ✅ `awards` (find)
     - ✅ `compositions` (find, findOne)
     - ✅ (Add others as needed)

4. **Copy Token**
   - **CRITICAL:** Copy the token immediately
   - You won't be able to see it again!
   - Save it securely for Vercel configuration

---

### Step 9: Configure Public API Permissions

**Required for frontend to fetch published content:**

1. **Navigate to Roles & Permissions**
   - Strapi Admin → Settings → Users & Permissions Plugin → Roles
   - Click "Public" role

2. **Grant Read Permissions**
   For each content type, enable:
   - ✅ `find` - Fetch all entries
   - ✅ `findOne` - Fetch single entry by ID/slug

   **Content Types to Configure:**
   - Hero (Single Type)
   - About (Single Type)
   - Portfolio (Single Type)
   - Website Configuration (Single Type)
   - Skills (Collection)
   - Projects (Collection)
   - Posts (Collection)
   - Experiences (Collection)
   - Testimonials (Collection - only approved)
   - Awards (Collection)
   - Compositions (Collection)
   - Music Genres (Collection)

3. **Save Changes**

**Security Note:** Never enable `create`, `update`, or `delete` for Public role unless using authenticated requests.

---

### Step 10: Test Railway Deployment

Run these tests from your terminal:

```bash
# 1. Health Check
curl https://your-project-name.up.railway.app/_health

# 2. Test API (should return API info)
curl https://your-project-name.up.railway.app/api

# 3. Test Content Type (example: skills)
curl https://your-project-name.up.railway.app/api/skills

# 4. Test with Bearer Token
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  https://your-project-name.up.railway.app/api/hero?populate=*
```

**Expected Results:**
- Health check: `200 OK`
- API: JSON with Strapi version info
- Skills: JSON array with skill entries (if populated)
- Hero: JSON object with hero data

---

### Step 11: Update Vercel Environment Variables

1. **Go to Vercel Dashboard**
   - Navigate to your portfolio project
   - Go to Settings → Environment Variables

2. **Add Strapi Variables**
   ```env
   STRAPI_URL=https://your-project-name.up.railway.app
   STRAPI_TOKEN=<paste_api_token_from_step_8>
   ```

3. **Apply to All Environments**
   - ✅ Production
   - ✅ Preview
   - ✅ Development (optional)

4. **Save Changes**

5. **Redeploy Portfolio**
   - Trigger a new Vercel deployment
   - Or wait for next git push

---

## ✅ Verification Checklist

After deployment, verify:

- [ ] Railway deployment shows "Deployed successfully"
- [ ] Railway public URL is accessible
- [ ] Strapi admin panel loads (`/admin`)
- [ ] Admin account created successfully
- [ ] Health check endpoint returns 200 (`/_health`)
- [ ] API endpoint returns JSON (`/api`)
- [ ] Content types are accessible (e.g., `/api/skills`)
- [ ] API token created with proper permissions
- [ ] Public role has read permissions for content types
- [ ] Cloudinary integration works (test by uploading an image)
- [ ] Vercel environment variables updated
- [ ] Test Vercel build with new Strapi URL (should succeed)

---

## 🐛 Troubleshooting

### Build Fails on Railway

**Error:** `pnpm: command not found`
- **Fix:** Railway should auto-detect pnpm via `package.json` engines field
- **Alternative:** Add `pnpm-lock.yaml` to root of `apps/cms`

**Error:** `Database connection failed`
- **Fix:** Verify PostgreSQL service is linked
- **Fix:** Check `DATABASE_SSL=true` is set
- **Fix:** Ensure database variables use Railway references: `${{Postgres.PGHOST}}`

### Strapi Admin Panel Won't Load

**Error:** 502 Bad Gateway
- **Fix:** Check Railway logs for errors
- **Fix:** Verify `PORT` is set to `${{PORT}}`
- **Fix:** Ensure `HOST=0.0.0.0` (not `127.0.0.1`)

**Error:** Admin panel loads but can't create admin
- **Fix:** Check `ADMIN_JWT_SECRET` is set
- **Fix:** Verify `APP_KEYS` are properly formatted (comma-separated)

### API Returns 403 Forbidden

**Error:** API requests return 403
- **Fix:** Grant Public role permissions for content types
- **Fix:** Verify API token has proper permissions
- **Fix:** Check `ALLOWED_ORIGINS` includes your Vercel URL

### Cloudinary Upload Fails

**Error:** Media upload returns error
- **Fix:** Verify Cloudinary credentials are correct
- **Fix:** Check Cloudinary plugin is configured in `config/plugins.ts`
- **Fix:** Ensure Cloudinary account has sufficient quota

### Content Not Showing on Frontend

**Error:** Vercel build succeeds but content is empty
- **Fix:** Verify content is published in Strapi (not in draft state)
- **Fix:** Check Public role has `find` permissions
- **Fix:** Test API endpoint directly in browser
- **Fix:** Check Vercel environment variables are set correctly

---

## 📊 Performance Optimization

### Enable Redis Caching (Optional)

1. **Add Redis Service to Railway**
   - Click "+ New" → Database → Redis
   - Railway provisions Redis instance

2. **Update Environment Variables**
   ```env
   REDIS_HOST=${{Redis.REDIS_HOST}}
   REDIS_PORT=${{Redis.REDIS_PORT}}
   REDIS_PASSWORD=${{Redis.REDIS_PASSWORD}}
   REDIS_DB=0
   ```

3. **Configure Strapi Cache Plugin**
   - Already installed: `@strapi-community/plugin-rest-cache`
   - Already configured in `config/plugins.ts`
   - Cache duration: 3600s (1 hour) for most content

### Database Connection Pooling

Already configured in `config/database.ts`:
```env
DATABASE_POOL_MIN=0
DATABASE_POOL_MAX=10
```

Adjust based on Railway plan limits.

---

## 🔒 Security Best Practices

1. **Never commit secrets to Git**
   - ✅ `.env` is in `.gitignore`
   - ✅ Use Railway environment variables

2. **Use strong, unique keys**
   - ✅ Generate new keys for production (never reuse local keys)
   - ✅ Use `openssl rand -base64 32` for each key

3. **Limit API token permissions**
   - ✅ Use Read-Only tokens when possible
   - ✅ Create separate tokens for different purposes

4. **Configure CORS properly**
   - ✅ Set `ALLOWED_ORIGINS` to your actual domain
   - ✅ Never use `*` in production

5. **Enable SSL**
   - ✅ Railway provides SSL by default
   - ✅ Ensure `DATABASE_SSL=true`

6. **Regular updates**
   - Keep Strapi and plugins updated
   - Monitor Railway logs for security alerts

---

## 💰 Cost Estimate

**Railway Pricing (as of 2025):**
- **Hobby Plan:** $5/month (500 hours + $0.000463/minute after)
- **PostgreSQL:** Included in plan
- **Redis:** Included in plan (optional)

**Expected Monthly Cost:**
- Small project: ~$5-10/month
- Medium traffic: ~$10-20/month

**Cloudinary Pricing:**
- Free tier: 25 GB storage, 25 GB bandwidth
- Usually sufficient for portfolio projects

---

## 📚 Additional Resources

- [Railway Documentation](https://docs.railway.app)
- [Strapi Deployment Guide](https://docs.strapi.io/dev-docs/deployment)
- [PostgreSQL + pgVector](https://github.com/pgvector/pgvector)
- [Cloudinary Strapi Plugin](https://market.strapi.io/providers/@strapi-provider-upload-cloudinary)

---

## 🎯 Next Steps

After successful Railway deployment:

1. ✅ Complete Phase 0.2.4: Replace static data with CMS calls
2. ✅ Complete Phase 0.4: Migrate content from static to Strapi
3. ✅ Test full integration (Vercel frontend + Railway backend)
4. ✅ Set up Strapi webhooks to trigger Vercel rebuilds
5. ✅ Configure CircleCI for automated CMS deployments (optional)

---

**Last Updated:** 2025-12-03

**Status:** Ready for deployment ✅
