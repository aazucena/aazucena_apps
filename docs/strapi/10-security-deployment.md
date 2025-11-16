# Security & Deployment

**[← Back to API Permissions](./09-api-permissions.md)** | **[Next: Data Migration →](./11-data-migration.md)**

---

## Rate Limiting

Configure rate limiting (100 req/min per IP):

```javascript
// config/middlewares.ts
export default [
  // ... other middlewares
  {
    name: 'strapi::ratelimit',
    config: {
      interval: 60000, // 1 minute
      max: 100, // 100 requests per minute per IP
      delayAfter: 50,
      timeWait: 1000,
      whitelist: [],
      store: {
        type: 'redis',
        options: {
          host: process.env.REDIS_HOST || 'localhost',
          port: process.env.REDIS_PORT || 6379,
          password: process.env.REDIS_PASSWORD || '',
        },
      },
    },
  },
];
```

---

## CORS Configuration

```javascript
// config/middlewares.ts (CORS section)
{
  name: 'strapi::cors',
  config: {
    enabled: true,
    origin: [
      'http://localhost:4321', // Astro dev
      'http://localhost:3000',
      'https://aazucena.vercel.app', // Production
      'https://*.vercel.app', // Preview deployments
    ],
    headers: '*',
  },
}
```

---

## Redis Caching

Cache frequently accessed content types:

```javascript
// config/plugins.ts
export default ({ env }) => ({
  'rest-cache': {
    enabled: true,
    config: {
      provider: {
        name: 'redis',
        options: {
          host: env('REDIS_HOST', 'localhost'),
          port: env.int('REDIS_PORT', 6379),
          password: env('REDIS_PASSWORD', ''),
        },
      },
      strategy: {
        contentTypes: [
          { contentType: 'api::skill.skill', maxAge: 3600000 }, // 1 hour
          { contentType: 'api::project.project', maxAge: 1800000 }, // 30 min
          { contentType: 'api::blog-post.blog-post', maxAge: 1800000 },
          { contentType: 'api::setting.setting', maxAge: 7200000 }, // 2 hours
          { contentType: 'api::about.about', maxAge: 3600000 },
        ],
      },
    },
  },
});
```

---

## Health Check Endpoint

```typescript
// src/api/health/routes/health.ts
export default {
  routes: [{
    method: 'GET',
    path: '/health',
    handler: 'health.check',
    config: { auth: false },
  }],
};

// src/api/health/controllers/health.ts
export default {
  async check(ctx) {
    await strapi.db.connection.raw('SELECT 1');
    return ctx.send({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: 'connected',
    });
  },
};
```

---

## Production Environment

```env
# .env.production
NODE_ENV=production
HOST=0.0.0.0
PORT=1337

# Database
DATABASE_CLIENT=postgres
DATABASE_HOST=your-postgres-host
DATABASE_PORT=5432
DATABASE_NAME=strapi_production
DATABASE_USERNAME=strapi_user
DATABASE_PASSWORD=secure_password
DATABASE_SSL=true

# Cloudinary
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_KEY=your_api_key
CLOUDINARY_SECRET=your_api_secret

# Redis
REDIS_HOST=your-redis-host
REDIS_PORT=6379
REDIS_PASSWORD=redis_password

# API Keys
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=generate_secure_random_string
API_TOKEN_SALT=generate_secure_random_string
ADMIN_JWT_SECRET=generate_secure_random_string

# Security
ADMIN_WHITELIST_IPS=  # Add later
RATE_LIMIT_ENABLED=true
```

---

**[← API Permissions](./09-api-permissions.md)** | **[Next: Data Migration →](./11-data-migration.md)**
