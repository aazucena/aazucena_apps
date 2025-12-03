# 🚀 Railway Deployment - Quick Start

**5-minute deployment checklist for Strapi CMS on Railway**

---

## ⚡ Quick Steps

### 1. Create Project (2 min)
1. Go to [railway.app](https://railway.app) → New Project
2. Deploy from GitHub → Select `aazucena/aazucena_apps`
3. Root directory: `apps/cms`

### 2. Add Database (1 min)
1. Click "+ New" → Database → PostgreSQL
2. Railway auto-configures connection variables

### 3. Generate Keys (1 min)
```bash
# Run locally to generate 8 secure keys
for i in {1..8}; do openssl rand -base64 32; done
```

### 4. Set Environment Variables (2 min)

**Copy-paste template (replace values):**

```env
NODE_ENV=production
HOST=0.0.0.0
PORT=${{PORT}}

# Paste your 8 generated keys here
APP_KEYS=<key1>,<key2>,<key3>,<key4>
API_TOKEN_SALT=<key5>
ADMIN_JWT_SECRET=<key6>
TRANSFER_TOKEN_SALT=<key7>
JWT_SECRET=<key8>

# Database (auto-filled by Railway)
DATABASE_CLIENT=postgres
DATABASE_HOST=${{Postgres.PGHOST}}
DATABASE_PORT=${{Postgres.PGPORT}}
DATABASE_NAME=${{Postgres.PGDATABASE}}
DATABASE_USERNAME=${{Postgres.PGUSER}}
DATABASE_PASSWORD=${{Postgres.PGPASSWORD}}
DATABASE_SSL=true

# Cloudinary (from cloudinary.com/console)
CLOUDINARY_NAME=<your_cloud_name>
CLOUDINARY_KEY=<your_api_key>
CLOUDINARY_SECRET=<your_api_secret>

# Frontend URL (your Vercel deployment)
ALLOWED_ORIGINS=https://your-domain.vercel.app
```

### 5. Deploy & Verify (1 min)
1. Railway auto-deploys
2. Get public URL: Settings → Networking → Generate Domain
3. Visit: `https://your-project.up.railway.app/admin`

### 6. Create API Token
1. Strapi Admin → Settings → API Tokens → Create
2. Name: `Frontend Token`
3. Type: Read-Only
4. Duration: Unlimited
5. **Copy token immediately!**

### 7. Update Vercel
Vercel Dashboard → Your Project → Settings → Environment Variables:
```env
STRAPI_URL=https://your-project.up.railway.app
STRAPI_TOKEN=<paste_token_here>
```

---

## ✅ Quick Verification

```bash
# Health check
curl https://your-project.up.railway.app/_health

# Test API
curl https://your-project.up.railway.app/api/skills
```

---

## 📖 Full Guide

See [docs/railway-deployment-guide.md](./docs/railway-deployment-guide.md) for detailed instructions, troubleshooting, and best practices.

---

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| 502 Bad Gateway | Check `HOST=0.0.0.0` and `PORT=${{PORT}}` |
| Database connection failed | Verify `DATABASE_SSL=true` and PostgreSQL is linked |
| Admin panel won't load | Check `ADMIN_JWT_SECRET` and `APP_KEYS` format |
| API returns 403 | Grant Public role permissions in Strapi admin |
| Build fails | Verify `pnpm-lock.yaml` exists in `apps/cms` |

---

**Estimated Time:** 10-15 minutes total
**Cost:** ~$5-10/month (Railway Hobby Plan)
