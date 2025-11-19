# Prerequisites Checklist

**[← Back to Index](./README.md)** | **[Next: Requirements Summary →](./01-requirements-summary.md)**

---

## Before You Begin

This document outlines all prerequisites that must be in place before creating Strapi content types.

---

## Prerequisites Checklist

Before starting, ensure:

- ✅ **Strapi v5** running at `http://localhost:1337/admin`
- ✅ **PostgreSQL 16** with pgVector extension installed
- ✅ **Cloudinary** configured for media uploads
- ✅ **Admin panel** setup complete
- ✅ **TypeScript** configuration enabled
- ✅ **Redis** running for caching (optional but recommended)
- ✅ **Gemini API key** configured for embeddings

---

## Detailed Requirements

### 1. Strapi v5 Installation

**Verify Strapi is running:**
```bash
# Check if Strapi is accessible
curl http://localhost:1337/admin

# Should return 200 OK
```

**If not installed:**
```bash
# See Phase 0.2.2 documentation for Docker Compose setup
docker compose up -d strapi
```

---

### 2. PostgreSQL 16 with pgVector

**Verify PostgreSQL version:**
```sql
SELECT version();
-- Should show PostgreSQL 16.x
```

**Verify pgVector extension:**
```sql
CREATE EXTENSION IF NOT EXISTS vector;
SELECT extname, extversion FROM pg_extension WHERE extname = 'vector';
```

**Docker Compose configuration:**
```yaml
# docker-compose.yml
postgres:
  container_name: aazucena-db
  image: pgvector/pgvector:pg16
  platform: linux/amd64  # Required for Apple Silicon (M1/M2/M3) Macs
  ports:
    - "5432:5432"
  environment:
    POSTGRES_DB: strapi
    POSTGRES_USER: strapi
    POSTGRES_PASSWORD: strapi
  volumes:
    - postgres-data:/var/lib/postgresql/data
    - ./apps/cms/database/init.sql:/docker-entrypoint-initdb.d/init.sql
  networks:
    - aazucena-network
  healthcheck:
    test: ["CMD-SHELL", "pg_isready -U strapi -d strapi"]
    interval: 10s
    timeout: 5s
    retries: 5
  restart: unless-stopped
```

**Note for MacOS Users:**
The `platform: linux/amd64` setting is required for Apple Silicon (M1/M2/M3) Macs to prevent compatibility issues with the pgvector Docker image.

**If pgVector is not installed:**
- Use the official `pgvector/pgvector:pg16` Docker image
- See [Phase 0.2.1 Documentation](/docs/phase-0-infrastructure.md#0-2-1-local-development-with-docker-compose)

---

### 3. Cloudinary Configuration

**Required environment variables:**
```env
# .env
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_KEY=your_api_key
CLOUDINARY_SECRET=your_api_secret
```

**Verify Cloudinary is configured in Strapi:**
```javascript
// config/plugins.ts
export default {
  upload: {
    config: {
      provider: 'cloudinary',
      providerOptions: {
        cloud_name: env('CLOUDINARY_NAME'),
        api_key: env('CLOUDINARY_KEY'),
        api_secret: env('CLOUDINARY_SECRET'),
      },
    },
  },
};
```

**Test upload:**
1. Go to Media Library in Strapi admin
2. Upload a test image
3. Verify it appears in your Cloudinary dashboard

---

### 4. Admin Panel Setup

**Verify admin account exists:**
```bash
# Navigate to admin panel
open http://localhost:1337/admin

# You should be able to log in
```

**If no admin account:**
```bash
# Create admin user via CLI
docker compose exec strapi pnpm dlx strapi admin:create-user
```

---

### 5. TypeScript Configuration

**Verify TypeScript is enabled:**
```bash
# Check for TypeScript config
ls -la apps/strapi/tsconfig.json

# Generate types (should work without errors)
pnpm strapi ts:generate-types
```

**Required in `strapi-server.ts`:**
```typescript
export default {
  config: {
    typescript: {
      generate: true,
      outputPath: './types/generated/contentTypes.d.ts',
    },
  },
};
```

---

### 6. Redis (Optional but Recommended)

**Verify Redis is running:**
```bash
# Test Redis connection
redis-cli ping
# Should return: PONG

# Or via Docker
docker compose exec redis redis-cli ping
```

**Docker Compose configuration:**
```yaml
# docker-compose.yml
services:
  redis:
    container_name: aazucena-redis
    image: bitnami/redis:latest
    ports:
      - "6379:6379"
    environment:
      - ALLOW_EMPTY_PASSWORD=yes
      # For production, use: REDIS_PASSWORD=your_secure_password
    volumes:
      - redis-data:/bitnami/redis/data
    networks:
      - aazucena-network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped
```

**Environment variables:**
```env
REDIS_HOST=redis  # Use 'redis' for Docker, 'localhost' for local
REDIS_PORT=6379
REDIS_PASSWORD=  # Optional for development
```

**Redis Plugins Installed:**
- `@strapi-community/plugin-redis` - Core Redis integration
- `@strapi-community/plugin-rest-cache` - REST API caching
- `@strapi-community/provider-rest-cache-redis` - Redis cache provider

**If Redis is not required:**
- Rate limiting will use in-memory store (not recommended for production)
- REST API caching will be disabled (slower API responses)

---

### 7. Gemini API Key

**Get API key:**
1. Visit [Google AI Studio](https://ai.google.dev/)
2. Create a new API key
3. Copy the key to your `.env` file

**Environment variable:**
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

**Test Gemini API:**
```typescript
// Test script
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });

const result = await model.embedContent('test');
console.log('Embedding dimensions:', result.embedding.values.length); // Should be 768
```

---

## Creation Order & Dependencies

**IMPORTANT:** Content types must be created in this specific order to avoid dependency issues.

### Recommended Order

```
1. Reusable Components (6 components) → Create FIRST
   ├── SEO Metadata (meta.seo-metadata)
   ├── Social Links (links.social-links)
   ├── Audio Metadata (media.audio-metadata)
   ├── CTA Button (ui.cta-button)
   ├── Stats (content.stat)
   └── Achievement (content.achievement)

2. Collection Types (11 types) - Create in this order
   ├── Skills (independent)
   ├── Music Genres (independent)
   ├── Blog Series (independent)
   ├── Projects (depends on Skills)
   ├── Experience (depends on Skills, Projects)
   ├── Testimonials (depends on Projects)
   ├── Blog Posts (depends on Blog Series)
   ├── Awards (depends on Projects, Skills)
   ├── Compositions (depends on Music Genres)
   ├── Form Submissions (independent) - CRITICAL for AI forms
   └── Easter Egg Completions (independent)

3. Single Types (3 types)
   ├── Hero (depends on CTA Button component)
   ├── About (depends on Social Links, Stats, Achievement components)
   └── Settings (depends on SEO Metadata component)
```

---

## Why This Order?

### Components First
- **Reason:** Single Types and Collection Types reference components
- **Impact:** Cannot create content types until components exist
- **Example:** Hero uses `ui.cta-button`, About uses `links.social-links`

### Skills Before Projects
- **Reason:** Projects has Many-to-many relation with Skills
- **Impact:** Cannot create relation if Skills doesn't exist
- **Solution:** Create Skills first, then Projects

### Music Genres Before Compositions
- **Reason:** Compositions links to Music Genres for filtering
- **Impact:** Cannot assign genres to compositions
- **Solution:** Create Music Genres first

### Blog Series Before Blog Posts
- **Reason:** Blog Posts belong to Blog Series
- **Impact:** Cannot organize posts into series
- **Solution:** Create Blog Series first

### Form Submissions Critical for AI Forms
- **Reason:** Backbone of AI-powered forms system
- **Impact:** AI forms feature won't work without this content type
- **Solution:** Create early in process (Phase C recommended)

---

## Verification Checklist

Run through this checklist before proceeding:

### Environment
- [ ] Strapi v5 is running and accessible
- [ ] PostgreSQL 16 is running
- [ ] pgVector extension is installed
- [ ] Redis is running (optional)
- [ ] All environment variables are set

### Configuration
- [ ] Cloudinary is configured
- [ ] TypeScript is enabled
- [ ] Admin account exists and can log in
- [ ] Gemini API key is valid

### Documentation
- [ ] Read [Requirements Summary](./01-requirements-summary.md)
- [ ] Understand content type dependencies
- [ ] Familiar with creation order

### Tools
- [ ] Docker and Docker Compose installed
- [ ] pnpm installed (v10.21.0+)
- [ ] Node.js 20+ installed (Node 22 recommended)
- [ ] PostgreSQL client (psql) installed

---

## Installed Plugins

The CMS comes pre-configured with the following plugins. These are automatically installed when running `docker compose up` or `pnpm install`.

### Official Strapi Plugins

| Plugin | Version | Purpose |
|--------|---------|---------|
| `@strapi/plugin-graphql` | ^5.31.0 | GraphQL API support |
| `@strapi/plugin-documentation` | ^5.31.0 | OpenAPI/Swagger documentation |
| `@strapi/plugin-sentry` | ^5.31.0 | Error tracking and monitoring |
| `@strapi/plugin-seo` | ^2.0.8 | SEO management for content types |
| `@strapi/plugin-color-picker` | ^5.31.0 | Color picker field type |
| `@strapi/provider-upload-cloudinary` | ^5.31.0 | Cloudinary media upload |
| `@strapi/plugin-users-permissions` | 5.31.0 | User authentication |

### Community Plugins

| Plugin | Version | Purpose |
|--------|---------|---------|
| `@strapi-community/plugin-redis` | ^2.0.0 | Redis integration for caching |
| `@strapi-community/plugin-rest-cache` | ^5.0.1 | REST API response caching |
| `@strapi-community/provider-rest-cache-redis` | ^5.0.0 | Redis provider for REST cache |

### Third-Party Plugins

| Plugin | Version | Purpose |
|--------|---------|---------|
| `@_sh/strapi-plugin-ckeditor` | ^6.0.3 | Rich text editor (CKEditor 5) |
| `strapi-plugin-preview-button` | ^3.0.2 | Content preview functionality |
| `strapi-plugin-multi-select` | ^2.1.1 | Multi-select field type |
| `strapi-advanced-uuid` | ^2.1.1 | UUID field generation |
| `strapi-plugin-navigation` | ^3.2.4 | Navigation management |
| `strapi-plugin-duplicate-button` | ^2.0.0 | Content duplication |
| `strapi-plugin-config-sync` | ^3.1.2 | Configuration synchronization |
| `strapi-plugin-publisher` | ^2.0.5 | Scheduled publishing |

### Installing/Updating Plugins

To install or update plugins, use the provided script:

```bash
# From the monorepo root
cd apps/cms

# Make the script executable and run
pnpm run update-plugins
```

This runs `plugins.sh` which:
1. Installs all plugins via pnpm
2. Runs `pnpm install --ignore-workspace`
3. Rebuilds the Docker image with `docker compose build --no-cache`

### Plugin Configuration

The Redis and Cloudinary plugins are configured in `config/plugins.ts`:

```typescript
// config/plugins.ts
export default ({ env }) => ({
  redis: {
    config: {
      settings: {
        debug: false,
        enableRedlock: false,
        lockTTL: 5000,
      },
      connections: {
        default: {
          connection: {
            host: env('REDIS_HOST', '127.0.0.1'),
            port: env.int('REDIS_PORT', 6379),
            db: 0,
          },
        },
      },
    },
  },
  "rest-cache": {
    config: {
      provider: {
        name: "redis",
        options: {
          connection: "default",
          ttl: 3600 * 1000  // 1 hour
        },
      },
    }
  },
  upload: {
    config: {
      provider: 'cloudinary',
      providerOptions: {
        cloud_name: env('CLOUDINARY_NAME'),
        api_key: env('CLOUDINARY_KEY'),
        api_secret: env('CLOUDINARY_SECRET'),
      },
    },
  },
});
```

---

## Troubleshooting Prerequisites

### Strapi Not Starting

**Issue:** Strapi container fails to start

**Solutions:**
```bash
# Check Docker logs
docker compose logs -f strapi

# Common issues:
# 1. Database connection failed
#    → Verify PostgreSQL is running
#    → Check DATABASE_* env vars

# 2. Port already in use
#    → Change PORT in .env
#    → Or stop conflicting service

# 3. Missing environment variables
#    → Check .env file exists
#    → Verify all required vars are set
```

---

### pgVector Extension Error

**Issue:** `CREATE EXTENSION vector` fails

**Solutions:**
```sql
-- Check if pgvector is installed
SELECT * FROM pg_available_extensions WHERE name = 'vector';

-- If not available, install via Docker
-- Use pgvector/pgvector:pg16 image
```

See [08-pgvector-setup.md](./08-pgvector-setup.md) for detailed migration.

---

### Cloudinary Upload Fails

**Issue:** Media uploads fail with authentication error

**Solutions:**
```bash
# 1. Verify credentials in Cloudinary dashboard
# 2. Check .env file has correct values
# 3. Restart Strapi after changing .env
docker compose restart strapi

# 4. Test credentials with curl
curl -X POST https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload \
  -F "file=@test.jpg" \
  -F "api_key=YOUR_API_KEY" \
  -F "timestamp=$(date +%s)" \
  -F "signature=GENERATED_SIGNATURE"
```

---

### Redis Connection Failed

**Issue:** Strapi logs show Redis connection errors

**Solutions:**
```bash
# 1. Verify Redis is running
docker compose ps redis

# 2. Test connection manually
redis-cli -h localhost -p 6379 ping

# 3. Check firewall rules
sudo ufw allow 6379

# 4. Temporarily disable Redis
# Comment out redis config in config/plugins.ts
```

---

## Next Steps

Once all prerequisites are verified:

1. ✅ **[Review Requirements Summary](./01-requirements-summary.md)** - Understand content strategy
2. ✅ **[Create Components](./02-components.md)** - Build reusable components first
3. ✅ **[Create Content Types](./03-single-types.md)** - Follow creation order

---

## Related Documentation

- **[Phase 0.2.1: Docker Compose Setup](/docs/phase-0-infrastructure.md#0-2-1-local-development-with-docker-compose)**
- **[Phase 0.2.2: Strapi Configuration](/docs/phase-0-infrastructure.md#0-2-2-strapi-configuration)**
- **[pgVector Setup Guide](./08-pgvector-setup.md)**

---

**Last Updated:** 2025-11-18

**[<- Back to Index](./README.md)** | **[Next: Requirements Summary ->](./01-requirements-summary.md)**
