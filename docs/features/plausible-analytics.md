# Self-Hosted Plausible Analytics

## Overview

This document describes the integration of self-hosted Plausible Analytics alongside the existing Vercel Analytics and Vercel Speed Insights for comprehensive, privacy-friendly traffic analysis.

**Estimated Effort:** 2-3 days

---

## Why Use All Three Analytics Tools Together

The portfolio uses a complementary three-tool analytics strategy:

| Tool | Primary Focus | Key Benefits |
|------|---------------|--------------|
| **Vercel Analytics** | Real User Monitoring (RUM) | Audience insights, geographic data, device breakdown, Vercel-native integration |
| **Vercel Speed Insights** | Performance Metrics | Core Web Vitals (LCP, FID, CLS, TTFB), performance scoring, field data collection |
| **Plausible Analytics** | Traffic Analytics | Privacy-friendly, UTM tracking, goals/events, referrer data, campaign attribution |

### Why Not Just Use One?

1. **Vercel Analytics** excels at RUM but lacks detailed campaign tracking and goal funnels
2. **Vercel Speed Insights** focuses solely on performance, not traffic patterns
3. **Plausible** provides comprehensive traffic analytics without cookies or personal data collection

**Combined Value:**
- Complete picture of both performance AND traffic
- GDPR/CCPA compliant without cookie banners
- Own your data with self-hosting
- No sampling or data limits
- Detailed campaign attribution (UTM parameters)
- Custom event tracking for user journeys

---

## Self-Hosted Plausible Setup

### Architecture Overview

```
                    +------------------+
                    |   Portfolio      |
                    |   (Astro)        |
                    +--------+---------+
                             |
              +--------------+---------------+
              |              |               |
     +--------v------+ +-----v-----+ +-------v--------+
     | Plausible     | | Vercel    | | Vercel Speed   |
     | (Self-hosted) | | Analytics | | Insights       |
     +--------+------+ +-----------+ +----------------+
              |
     +--------v--------+
     | ClickHouse      |
     | (Analytics DB)  |
     +-----------------+
```

### Docker Compose Configuration (Local Development)

Add the following services to your existing `docker-compose.yml`:

```yaml
# docker-compose.yml (add to existing services)

services:
  # ... existing strapi and postgres services ...

  plausible:
    container_name: aazucena-plausible
    image: ghcr.io/plausible/community-edition:v2.1.3
    restart: unless-stopped
    ports:
      - "8000:8000"
    environment:
      BASE_URL: http://localhost:8000
      SECRET_KEY_BASE: ${PLAUSIBLE_SECRET_KEY_BASE}
      TOTP_VAULT_KEY: ${PLAUSIBLE_TOTP_VAULT_KEY}
      DATABASE_URL: postgres://plausible:plausible@plausible_db:5432/plausible
      CLICKHOUSE_DATABASE_URL: http://plausible_events_db:8123/plausible_events_db
      DISABLE_REGISTRATION: invite_only
      MAILER_EMAIL: noreply@localhost
      SMTP_HOST_ADDR: mailhog
      SMTP_HOST_PORT: 1025
    depends_on:
      - plausible_db
      - plausible_events_db
    volumes:
      - plausible-data:/var/lib/plausible

  plausible_db:
    container_name: aazucena-plausible-db
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_DB: plausible
      POSTGRES_USER: plausible
      POSTGRES_PASSWORD: plausible
    volumes:
      - plausible-db-data:/var/lib/postgresql/data

  plausible_events_db:
    container_name: aazucena-plausible-clickhouse
    image: clickhouse/clickhouse-server:24.3-alpine
    restart: unless-stopped
    volumes:
      - plausible-events-data:/var/lib/clickhouse
      - ./apps/cms/plausible/clickhouse-config.xml:/etc/clickhouse-server/config.d/logging.xml:ro
      - ./apps/cms/plausible/clickhouse-user-config.xml:/etc/clickhouse-server/users.d/logging.xml:ro
    ulimits:
      nofile:
        soft: 262144
        hard: 262144

  mailhog:
    container_name: aazucena-mailhog
    image: mailhog/mailhog:latest
    restart: unless-stopped
    ports:
      - "1025:1025"
      - "8025:8025"

volumes:
  # ... existing volumes ...
  plausible-data:
  plausible-db-data:
  plausible-events-data:
```

### ClickHouse Configuration Files

Create the following configuration files:

**`apps/cms/plausible/clickhouse-config.xml`:**

```xml
<clickhouse>
    <logger>
        <level>warning</level>
        <console>true</console>
    </logger>

    <query_thread_log remove="remove"/>
    <query_log remove="remove"/>
    <text_log remove="remove"/>
    <trace_log remove="remove"/>
    <metric_log remove="remove"/>
    <asynchronous_metric_log remove="remove"/>
    <session_log remove="remove"/>
    <part_log remove="remove"/>
</clickhouse>
```

**`apps/cms/plausible/clickhouse-user-config.xml`:**

```xml
<clickhouse>
    <profiles>
        <default>
            <log_queries>0</log_queries>
            <log_query_threads>0</log_query_threads>
        </default>
    </profiles>
</clickhouse>
```

### Environment Variables

Add to your `.env` file at the project root:

```env
# Plausible Analytics (Local Development)
PLAUSIBLE_SECRET_KEY_BASE=your-secret-key-min-64-chars-long-generate-with-openssl-rand-base64-64
PLAUSIBLE_TOTP_VAULT_KEY=your-totp-vault-key-generate-with-openssl-rand-base64-32

# Production (Railway)
PLAUSIBLE_BASE_URL=https://analytics.yourdomain.com
```

**Generate Secret Keys:**

```bash
# Generate SECRET_KEY_BASE (64+ characters)
openssl rand -base64 64

# Generate TOTP_VAULT_KEY (32 characters)
openssl rand -base64 32
```

### Initial Setup

1. **Start the services:**
   ```bash
   docker compose up -d
   ```

2. **Create admin account:**
   ```bash
   docker compose exec plausible /app/bin/plausible createsite \
     --domain localhost \
     --timezone America/Los_Angeles
   ```

3. **Access the dashboard:**
   - URL: http://localhost:8000
   - Create your first admin account on first visit

4. **Add your site:**
   - Go to Settings > Sites
   - Add `localhost` for development
   - Add your production domain when deploying

---

## Railway Deployment Configuration (Production)

### Railway Service Setup

Create a new Railway service for Plausible with the following configuration:

**`railway.toml`** (create in `apps/plausible/` directory):

```toml
[build]
builder = "dockerfile"
dockerfilePath = "Dockerfile"

[deploy]
healthcheckPath = "/api/health"
healthcheckTimeout = 300
restartPolicyType = "on_failure"
restartPolicyMaxRetries = 3
```

### Railway Dockerfile

**`apps/plausible/Dockerfile`:**

```dockerfile
FROM ghcr.io/plausible/community-edition:v2.1.3

# Plausible is pre-configured in the base image
# Environment variables are set via Railway dashboard
```

### Required Railway Services

1. **Plausible Web** - The main Plausible application
2. **PostgreSQL** - Plausible metadata database (separate from Strapi's PostgreSQL)
3. **ClickHouse** - Analytics event storage

**Note:** Railway supports ClickHouse via the official Docker image. Create a new service using `clickhouse/clickhouse-server:24.3-alpine`.

### Railway Environment Variables

Set these in the Railway dashboard for the Plausible service:

```env
BASE_URL=https://analytics.yourdomain.com
SECRET_KEY_BASE=${PLAUSIBLE_SECRET_KEY_BASE}
TOTP_VAULT_KEY=${PLAUSIBLE_TOTP_VAULT_KEY}
DATABASE_URL=postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}:${PGPORT}/${PGDATABASE}
CLICKHOUSE_DATABASE_URL=http://${CLICKHOUSE_HOST}:8123/plausible_events_db
DISABLE_REGISTRATION=invite_only
MAILER_EMAIL=analytics@yourdomain.com
SMTP_HOST_ADDR=${SMTP_HOST}
SMTP_HOST_PORT=${SMTP_PORT}
SMTP_HOST_SSL_ENABLED=true
SMTP_USER_NAME=${SMTP_USER}
SMTP_USER_PWD=${SMTP_PASSWORD}
```

### Database Requirements

| Database | Purpose | Size Estimate | Railway Plan |
|----------|---------|---------------|--------------|
| PostgreSQL | Plausible metadata, users, sites | ~100MB | Starter |
| ClickHouse | Event storage, analytics data | ~1GB/100k pageviews | Starter |

**Note:** ClickHouse is highly efficient for time-series analytics data. Expect ~10 bytes per pageview.

---

## Frontend Integration (Astro)

### Install Plausible Script

Create a Plausible component that works alongside existing Vercel scripts:

**`apps/portfolio/src/components/analytics/PlausibleAnalytics.astro`:**

```astro
---
interface Props {
  domain: string;
  apiHost?: string;
  trackOutboundLinks?: boolean;
  trackFileDownloads?: boolean;
  hashMode?: boolean;
}

const {
  domain,
  apiHost = import.meta.env.PUBLIC_PLAUSIBLE_API_HOST || 'https://analytics.yourdomain.com',
  trackOutboundLinks = true,
  trackFileDownloads = true,
  hashMode = false,
} = Astro.props;

// Build script src with extensions
let scriptSrc = `${apiHost}/js/script`;
const extensions: string[] = [];

if (trackOutboundLinks) extensions.push('outbound-links');
if (trackFileDownloads) extensions.push('file-downloads');
if (hashMode) extensions.push('hash');

if (extensions.length > 0) {
  scriptSrc += '.' + extensions.join('.');
}
scriptSrc += '.js';
---

<script
  defer
  data-domain={domain}
  data-api={`${apiHost}/api/event`}
  src={scriptSrc}
></script>

<script>
  // Make plausible available globally for custom events
  window.plausible = window.plausible || function() {
    (window.plausible.q = window.plausible.q || []).push(arguments);
  };
</script>
```

### Update Base Layout

Modify your base layout to include all three analytics tools:

**`apps/portfolio/src/layouts/BaseLayout.astro`:**

```astro
---
import PlausibleAnalytics from '@/components/analytics/PlausibleAnalytics.astro';

const plausibleDomain = import.meta.env.PUBLIC_PLAUSIBLE_DOMAIN || 'localhost';
const isProduction = import.meta.env.PROD;
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <!-- Plausible Analytics (Self-hosted) -->
    {isProduction && (
      <PlausibleAnalytics
        domain={plausibleDomain}
        trackOutboundLinks={true}
        trackFileDownloads={true}
      />
    )}

    <slot name="head" />
  </head>
  <body>
    <slot />

    <!-- Vercel Analytics & Speed Insights (existing) -->
    {isProduction && (
      <>
        <script>
          import { inject } from '@vercel/analytics';
          inject();
        </script>
        <script>
          import { injectSpeedInsights } from '@vercel/speed-insights';
          injectSpeedInsights();
        </script>
      </>
    )}
  </body>
</html>
```

### Environment Variables (Frontend)

Add to `apps/portfolio/.env`:

```env
# Plausible Analytics
PUBLIC_PLAUSIBLE_DOMAIN=yourdomain.com
PUBLIC_PLAUSIBLE_API_HOST=https://analytics.yourdomain.com
```

### Custom Event Tracking

Create a utility for tracking custom events:

**`apps/portfolio/src/lib/analytics.ts`:**

```typescript
// Plausible custom event tracking
export function trackEvent(
  eventName: string,
  props?: Record<string, string | number | boolean>
): void {
  if (typeof window !== 'undefined' && window.plausible) {
    window.plausible(eventName, { props });
  }
}

// Predefined events for the portfolio
export const AnalyticsEvents = {
  // Navigation
  SECTION_VIEW: 'Section View',
  MODAL_OPEN: 'Modal Open',
  MODAL_CLOSE: 'Modal Close',

  // Content
  PROJECT_CLICK: 'Project Click',
  BLOG_READ: 'Blog Read',
  COMPOSITION_PLAY: 'Composition Play',
  RESUME_DOWNLOAD: 'Resume Download',

  // Engagement
  CONTACT_FORM_START: 'Contact Form Start',
  CONTACT_FORM_SUBMIT: 'Contact Form Submit',
  KOFI_CLICK: 'Ko-fi Click',
  SOCIAL_LINK_CLICK: 'Social Link Click',

  // Easter Eggs
  EASTER_EGG_FOUND: 'Easter Egg Found',
  EASTER_EGG_COMPLETE: 'Easter Egg Complete',
} as const;

// Usage examples
export function trackSectionView(sectionName: string): void {
  trackEvent(AnalyticsEvents.SECTION_VIEW, { section: sectionName });
}

export function trackProjectClick(projectId: string, projectName: string): void {
  trackEvent(AnalyticsEvents.PROJECT_CLICK, {
    id: projectId,
    name: projectName
  });
}

export function trackCompositionPlay(trackId: string, trackName: string): void {
  trackEvent(AnalyticsEvents.COMPOSITION_PLAY, {
    id: trackId,
    name: trackName
  });
}
```

### TypeScript Declarations

**`apps/portfolio/src/types/plausible.d.ts`:**

```typescript
interface PlausibleFunction {
  (eventName: string, options?: { props?: Record<string, string | number | boolean> }): void;
  q?: unknown[][];
}

declare global {
  interface Window {
    plausible: PlausibleFunction;
  }
}

export {};
```

---

## Strapi CMS Integration (Optional)

### Tracking Admin Panel Usage

If you want to track Strapi admin panel usage, add Plausible to the admin panel:

**`apps/cms/src/admin/app.tsx`:**

```typescript
export default {
  config: {
    head: {
      scripts: [
        {
          src: 'https://analytics.yourdomain.com/js/script.js',
          defer: true,
          'data-domain': 'cms.yourdomain.com',
        },
      ],
    },
  },
  bootstrap() {},
};
```

### API Endpoint Analytics

Track API usage via Strapi middleware:

**`apps/cms/src/middlewares/analytics.ts`:**

```typescript
import { Strapi } from '@strapi/strapi';

export default (config: unknown, { strapi }: { strapi: Strapi }) => {
  return async (ctx: any, next: () => Promise<void>) => {
    await next();

    // Track API calls (optional - consider rate limiting this)
    // You could batch these and send to Plausible periodically
    const endpoint = ctx.request.path;
    const method = ctx.request.method;
    const status = ctx.response.status;

    // Log for monitoring (see logging-monitoring.md for Pino setup)
    strapi.log.info({
      type: 'api_call',
      endpoint,
      method,
      status,
      duration: ctx.response.get('X-Response-Time'),
    });
  };
};
```

### Content Performance Dashboard

Create a custom Strapi admin page to view content performance:

**Recommended approach:** Use Plausible's Stats API to fetch data and display in Strapi admin.

```typescript
// Example: Fetch page views for a specific blog post
const response = await fetch(
  `${PLAUSIBLE_API_HOST}/api/v1/stats/breakdown?` +
  new URLSearchParams({
    site_id: 'yourdomain.com',
    period: '30d',
    property: 'event:page',
    filters: 'event:page==/blog/my-post',
  }),
  {
    headers: {
      Authorization: `Bearer ${PLAUSIBLE_API_KEY}`,
    },
  }
);
```

---

## Dashboard & Reporting

### Plausible Dashboard Access

- **Local:** http://localhost:8000
- **Production:** https://analytics.yourdomain.com

### Key Metrics from Each Tool

| Metric | Vercel Analytics | Vercel Speed Insights | Plausible |
|--------|------------------|----------------------|-----------|
| Page Views | Yes | No | Yes |
| Unique Visitors | Yes | No | Yes |
| Bounce Rate | No | No | Yes |
| Session Duration | No | No | Yes |
| LCP/FID/CLS | No | Yes | No |
| Performance Score | No | Yes | No |
| UTM Parameters | Limited | No | Yes |
| Custom Events | No | No | Yes |
| Conversion Goals | No | No | Yes |
| Referrer Details | Basic | No | Detailed |

### Recommended Dashboard Setup

1. **Plausible:** Primary traffic dashboard
   - Daily/weekly/monthly visitor trends
   - Top pages, referrers, countries
   - Campaign performance (UTM tracking)
   - Goal conversions (form submissions, downloads)

2. **Vercel Analytics:** Audience insights
   - Device types, browsers
   - Geographic distribution
   - Real-time visitors

3. **Vercel Speed Insights:** Performance monitoring
   - Core Web Vitals trends
   - Page-by-page performance
   - Performance score over time

### Goals to Configure in Plausible

```
1. Resume Download - Track PDF downloads
2. Contact Form Submit - Track form completions
3. Ko-fi Click - Track donation intent
4. Composition Play - Track music engagement
5. Project View - Track portfolio exploration
6. Easter Egg Complete - Track gamification engagement
```

---

## Privacy & Compliance

### Why Plausible is GDPR Compliant

1. **No cookies** - Uses session hashing, not cookies
2. **No personal data** - No IP addresses stored
3. **No cross-site tracking** - Only tracks single domain
4. **Data ownership** - Self-hosted means you control all data
5. **EU data hosting** - When self-hosted on EU servers

### Cookie Banner Requirements

| Tool | Requires Cookie Banner |
|------|------------------------|
| Vercel Analytics | No (privacy-friendly, no cookies) |
| Vercel Speed Insights | No (uses web-vitals library, no cookies) |
| Plausible | No (no cookies, no personal data) |

**Result:** No cookie banner needed for analytics when using all three tools together.

### Privacy Policy Updates

Add the following to your privacy policy:

```markdown
## Analytics

We use privacy-friendly analytics tools that do not use cookies or collect personal data:

### Vercel Analytics
- Collects aggregate, anonymized visitor data
- Does not use cookies
- Data processed in accordance with Vercel's privacy policy

### Vercel Speed Insights
- Measures Core Web Vitals performance metrics
- Does not collect personal data
- Uses the web-vitals JavaScript library

### Plausible Analytics (Self-hosted)
- Open-source, privacy-first analytics
- No cookies, no personal data collection
- IP addresses are never stored
- Data is self-hosted and owned by us
- Compliant with GDPR, CCPA, and PECR

We do not:
- Use any third-party advertising trackers
- Sell or share analytics data
- Build user profiles for advertising
```

---

## Implementation Timeline

### Phase 1: Local Development Setup (0.5 day)

- [ ] Add Plausible services to docker-compose.yml
- [ ] Create ClickHouse configuration files
- [ ] Generate secret keys
- [ ] Start services and create admin account
- [ ] Add localhost site

### Phase 2: Frontend Integration (0.5 day)

- [ ] Create PlausibleAnalytics.astro component
- [ ] Update BaseLayout to include Plausible
- [ ] Create analytics.ts utility for custom events
- [ ] Add TypeScript declarations
- [ ] Configure environment variables

### Phase 3: Custom Event Tracking (0.5 day)

- [ ] Implement section view tracking
- [ ] Add project/composition click tracking
- [ ] Track form interactions
- [ ] Configure goals in Plausible dashboard

### Phase 4: Production Deployment (0.5 day)

- [ ] Create Railway services (Plausible, PostgreSQL, ClickHouse)
- [ ] Configure environment variables
- [ ] Set up custom domain (analytics.yourdomain.com)
- [ ] Add production site to Plausible
- [ ] Test tracking in production

### Phase 5: Testing & Documentation (0.5 day)

- [ ] Verify all three analytics tools work together
- [ ] Test custom events
- [ ] Update privacy policy
- [ ] Document dashboard access

**Total Estimated Effort:** 2-3 days

---

## Cost Analysis

### Self-Hosted Costs (Railway)

| Service | Railway Plan | Estimated Monthly Cost |
|---------|--------------|------------------------|
| Plausible Web | Starter | ~$5 |
| PostgreSQL (Plausible) | Starter | ~$5 |
| ClickHouse | Starter | ~$7 |
| **Total** | | **~$17/month** |

**Note:** Railway charges based on usage. The above estimates are for a portfolio with ~10,000 pageviews/month.

### Plausible Cloud Pricing (Alternative)

| Plan | Page Views | Monthly Cost |
|------|------------|--------------|
| Personal | 10,000 | $9 |
| Startup | 100,000 | $19 |
| Business | 1,000,000 | $69 |

**Self-hosted vs Cloud:**
- Self-hosted is cheaper for high traffic (>50,000 pageviews)
- Cloud is simpler to manage and includes automatic updates
- Self-hosted gives full data ownership and control

### Total Analytics Cost

| Tool | Monthly Cost |
|------|--------------|
| Vercel Analytics | Free (Hobby) / $0 |
| Vercel Speed Insights | Free (Hobby) / $0 |
| Plausible (Self-hosted) | ~$17 |
| **Total** | **~$17/month** |

---

## Technical Considerations

### No Conflicts Between Tools

All three analytics tools work independently:

1. **Different tracking mechanisms:**
   - Vercel: Custom fetch/beacon API
   - Speed Insights: web-vitals library
   - Plausible: Custom script with beacon API

2. **No shared state:**
   - Each tool has its own namespace
   - No overlapping global variables

3. **Minimal overhead:**
   - Combined script size: ~15KB gzipped
   - All scripts load async/defer
   - No impact on Core Web Vitals

### Performance Impact

```
Plausible script: ~1.4KB (smallest analytics script)
Vercel Analytics: ~4KB
Vercel Speed Insights: ~2KB
Total additional load: ~7.5KB
```

This is negligible and will not impact Lighthouse scores.

### Data Consistency Notes

- **Page view counts may differ** between Vercel Analytics and Plausible due to different counting methods
- **Plausible is more accurate** for unique visitors (session-based hashing)
- **Vercel is better for real-time** data (streaming analytics)

### Potential Issues

1. **Ad blockers:** Some block Plausible even when self-hosted
   - Mitigation: Use custom domain (analytics.yourdomain.com) and proxy script

2. **ClickHouse memory:** Can be resource-intensive
   - Mitigation: Configure proper limits in clickhouse-config.xml

3. **Secret key rotation:** Requires re-authentication
   - Mitigation: Document key rotation procedure

---

## Troubleshooting

### Events Not Appearing

1. Check browser console for script errors
2. Verify domain matches exactly in Plausible settings
3. Check that `data-domain` attribute is correct
4. Ensure API host is accessible (CORS)

### High Resource Usage (ClickHouse)

1. Reduce log retention in ClickHouse config
2. Limit memory usage with `max_memory_usage` setting
3. Consider increasing Railway plan

### Railway Deployment Issues

1. Ensure all environment variables are set
2. Check PostgreSQL and ClickHouse are running
3. Verify network connectivity between services

---

## References

- [Plausible Documentation](https://plausible.io/docs)
- [Plausible Self-Hosting Guide](https://plausible.io/docs/self-hosting)
- [Plausible Events API](https://plausible.io/docs/events-api)
- [Vercel Analytics Documentation](https://vercel.com/docs/analytics)
- [Vercel Speed Insights Documentation](https://vercel.com/docs/speed-insights)
- [Railway Documentation](https://docs.railway.app)

---

**Related Documentation:**

- [ROADMAP.md - Monitoring & Logging](../../ROADMAP.md#monitoring--logging)
- [Logging & Monitoring](./logging-monitoring.md)
- [Phase 0: Infrastructure](../phase-0-infrastructure.md)

---

**Last Updated:** 2025-11-19

**Status:** Planned

**Dependencies:**
- Phase 0.2.1: Docker Compose setup must be complete
- Railway account with services for production deployment
