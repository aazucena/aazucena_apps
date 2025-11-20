# Logging & Monitoring Infrastructure

📍 **Full Documentation:** [ROADMAP.md Section 3.20](../../ROADMAP.md#320-logging--monitoring-infrastructure-)

## Overview

Comprehensive logging, error tracking, and performance monitoring stack for the portfolio.

## Tech Stack

### Frontend
- **Sentry** - Error tracking & session replay
- **Vercel Analytics** - Web analytics & audience insights (built-in)
- **Vercel Speed Insights** - Core Web Vitals & performance scoring (built-in)
- **Plausible (Self-hosted)** - Privacy-friendly traffic analytics, UTM tracking, custom events

### Backend
- **Pino** - Structured JSON logging for Strapi
- **Sentry** - Backend error tracking
- **Redis** - Caching, rate limiting, session storage

### API Testing
- **Postman** - API documentation & integration testing

## Implementation Priority

| Tool | Priority | Effort | Status |
|------|----------|--------|--------|
| Vercel Analytics | High | 0 days | ⏳ Pending |
| Vercel Speed Insights | High | 0 days | ⏳ Pending |
| Sentry Frontend | High | 1 day | ⏳ Pending |
| Plausible Analytics | Medium | 2-3 days | ⏳ Pending |
| Pino Logger | Medium | 0.5 day | ⏳ Pending |
| Redis Cache | Medium | 1-2 days | ⏳ Pending |
| Postman Collection | Low | 0.5 day | ⏳ Pending |
| Sentry Backend | Medium | 0.5 day | ⏳ Pending |

**Total Effort:** 5-7 days

## Key Features

### Sentry Frontend
- Real-time error tracking
- Session replay (10% of sessions, 100% of errors)
- Performance monitoring
- Custom error boundaries
- Structured logging with breadcrumbs

### Redis Caching
- API response caching (5-15 min TTL)
- Rate limiting (100 req/min per IP)
- Session storage
- Background job queues (Bull/BullMQ)

### Pino Logger
- Structured JSON logs (production)
- Pretty-printed logs (development)
- Request/response serialization
- Custom log levels (info, warn, error)

## Environment Variables

```env
# Frontend
PUBLIC_SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
PUBLIC_VERCEL_ANALYTICS_ID=xxxxx
PUBLIC_PLAUSIBLE_DOMAIN=yourdomain.com
PUBLIC_PLAUSIBLE_API_HOST=https://analytics.yourdomain.com

# Backend
SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
REDIS_HOST=redis.railway.app
REDIS_PORT=6379
REDIS_PASSWORD=xxxxx
LOG_LEVEL=info
```

## Usage Examples

```typescript
// Frontend logging
import { logger } from '@/lib/logger';

logger.info('Music track played', { trackId: '123', trackName: 'My Song' });
logger.error('Failed to load composition', error, { compositionId });
logger.event('Ko-fi Button Clicked', { location: '/music' });
```

```javascript
// Backend logging (Strapi)
strapi.log.info({
  method: 'GET',
  path: '/api/compositions',
  status: 200,
  duration: '45ms'
});
```

## Next Steps

1. Set up Sentry projects (frontend + backend)
2. Configure Vercel Analytics in dashboard
3. Deploy Redis instance on Railway
4. Integrate Pino logger in Strapi
5. Create Postman collection for API documentation

---

**Related Documentation:**
- [ROADMAP.md - Full Implementation Details](../../ROADMAP.md#320-logging--monitoring-infrastructure-)
- [Phase 0: Infrastructure](../phase-0-infrastructure.md)
- [Plausible Analytics Setup](./plausible-analytics.md)
