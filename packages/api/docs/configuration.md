# API Configuration Guide

## SUMMARY

Meta-framework agnostic initialization patterns for Strapi CMS and ClickHouse analytics clients.

---

## STRAPI_CONFIGURATION

### Next.js Setup

```typescript
// app/layout.tsx or pages/_app.tsx
import { setStrapiConfig } from '@aazucena/api';

setStrapiConfig({
  url: process.env.STRAPI_URL!,
  apiEndpoint: process.env.STRAPI_API_ENDPOINT || '/api',
  token: process.env.STRAPI_API_TOKEN!,
});
```

### Astro Setup

```typescript
// src/middleware.ts or src/pages/_app.astro
import { setStrapiConfig } from '@aazucena/api';

setStrapiConfig({
  url: import.meta.env.STRAPI_URL,
  apiEndpoint: import.meta.env.STRAPI_API_ENDPOINT || '/api',
  token: import.meta.env.STRAPI_API_TOKEN,
});
```

---

## CLICKHOUSE_CONFIGURATION

### Client Initialization

```typescript
import { initClickHouseClients } from '@aazucena/api';

initClickHouseClients({
  viewer: {
    host: process.env.CLICKHOUSE_HOST!,
    username: process.env.CLICKHOUSE_VIEWER_USER!,
    password: process.env.CLICKHOUSE_VIEWER_PASSWORD!,
    database: process.env.CLICKHOUSE_DB!,
  },
  ingest: {
    host: process.env.CLICKHOUSE_HOST!,
    username: process.env.CLICKHOUSE_INGEST_USER!,
    password: process.env.CLICKHOUSE_INGEST_PASSWORD!,
    database: process.env.CLICKHOUSE_DB!,
    clickhouse_settings: {
      async_insert: 1,
      wait_for_async_insert: 0,
    },
  },
});
```

### Usage

```typescript
import { getViewerClient, getIngestClient } from '@aazucena/api';

// Read-only queries
const viewer = getViewerClient();
const result = await viewer.query({
  query: 'SELECT * FROM telemetry_events LIMIT 10',
});

// Write-only ingestion
const ingest = getIngestClient();
await ingest.insert({
  table: 'telemetry_events',
  values: [{ event: 'PageView', url: '/' }],
  format: 'JSONEachRow',
});
```

---

## ENVIRONMENT_VARIABLES

```bash
# Strapi CMS
STRAPI_URL=https://cms.aazucena.com
STRAPI_API_ENDPOINT=/api
STRAPI_API_TOKEN=your_api_token_here

# ClickHouse Analytics
CLICKHOUSE_HOST=https://clickhouse.cloud:8443
CLICKHOUSE_VIEWER_USER=viewer
CLICKHOUSE_VIEWER_PASSWORD=viewer_password
CLICKHOUSE_INGEST_USER=ingest
CLICKHOUSE_INGEST_PASSWORD=ingest_password
CLICKHOUSE_DB=analytics
```

---

**AUTHOR:** aazucena_api_config
