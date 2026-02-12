# @aazucena/api : Data_Intelligence_Gateway

## SUMMARY

Unified API orchestration layer providing type-safe CMS and analytics access. Engineered for meta-framework agnosticism with runtime validation, singleton clients, and zero-config transformers.

---

## 🛠️ TOOLKIT_MANIFEST

| System                 | Protocol       | Description                                                                 |
| :--------------------- | :------------- | :-------------------------------------------------------------------------- |
| **Strapi_Client**      | Config_Inject  | Authenticated CMS fetching with framework-agnostic initialization.          |
| **ClickHouse_Client**  | Singleton_OLAP | High-performance analytics queries with read/write separation.              |
| **Zod_Validators**     | Runtime_Guard  | 50+ validation schemas ensuring type safety at API boundaries.              |
| **Data_Transformers**  | Clean_Structs  | 50+ transform functions for sanitized, predictable data structures.         |
| **Domain_Modules**     | Separation     | 30+ specialized endpoints (hero, about, projects, posts, experiences).      |
| **AI_Gateway**         | Vercel_SDK     | Multi-provider LLM orchestration with streaming support.                    |

---

## 🏗️ SYSTEM_FACTORIES

### [Services] : The_Core

- **Location:** `src/services/`
- **Logic:** Strapi CMS client, ClickHouse analytics, AI Gateway integration.
- **Pattern:** Singleton with config injection for meta-framework compatibility.

### [Modules] : The_Endpoints

- **Location:** `src/modules/`
- **Logic:** 30+ domain-specific API clients (homepage, projects, experiences, posts).
- **Pattern:** One module per content type, parallel-fetch ready.

### [Validators] : The_Guards

- **Location:** `src/validators/`
- **Logic:** Zod schemas for runtime type validation (ProjectSchema, PostSchema, etc.).
- **Pattern:** Single source of truth for API contracts.

### [Transformers] : The_Sanitizers

- **Location:** `src/transformers/`
- **Logic:** Clean, predictable data structures (transformProject, transformPost).
- **Pattern:** Strapi response → Clean TypeScript object.

---

## 🚦 INITIALIZATION_PROTOCOLS

### Strapi Configuration (Required)

```typescript
import { setStrapiConfig } from '@aazucena/api';

// Next.js / Remix
setStrapiConfig({
  url: process.env.STRAPI_URL!,
  token: process.env.STRAPI_API_TOKEN!,
});

// Astro
setStrapiConfig({
  url: import.meta.env.STRAPI_URL,
  token: import.meta.env.STRAPI_API_TOKEN,
});
```

### ClickHouse Configuration (Analytics)

```typescript
import { initClickHouseClients } from '@aazucena/api';

initClickHouseClients({
  viewer: { host, username, password, database }, // Read-only
  ingest: { host, username, password, database, async_insert: 1 }, // Write-only
});
```

---

## 📡 USAGE_PATTERNS

```typescript
// CMS Data Fetching
import { fetchHomepage, fetchProjects, fetchPosts } from '@aazucena/api';

const homepage = await fetchHomepage();
const projects = await fetchProjects();
const posts = await fetchPosts({ limit: 10, featured: true });

// Runtime Validation
import { ProjectSchema } from '@aazucena/api';

const validatedProject = ProjectSchema.parse(apiResponse);

// Analytics Queries
import { getViewerClient } from '@aazucena/api';

const viewer = getViewerClient();
const result = await viewer.query({
  query: 'SELECT * FROM telemetry_events WHERE event = {event:String}',
  query_params: { event: 'PageView' },
});
```

---

## ✅ VERIFICATION_SUITE

- **Meta-Framework Agnostic:** Config injection pattern, no hardcoded `process.env`.
- **Type Safety:** Zod runtime validation + TypeScript compile-time checks.
- **Performance:** Singleton clients, parallel fetching, zero overhead transformers.
- **Separation of Concerns:** Services → Modules → Validators → Transformers.

---

## 🔗 DEPENDENCY_GRAPH

**Internal:** @aazucena/constants, @aazucena/types, @aazucena/utils
**External:** @clickhouse/client-web, qs, zod

**Compatible:** ✅ Next.js | ✅ Astro | ✅ Remix | ✅ Vite

---

## 📚 TUTORIAL_GUIDE

### Quick Start

```bash
# 1. Install dependencies (handled by monorepo)
pnpm install

# 2. Configure environment variables
# .env (Next.js/Remix) or .env.local (Astro)
STRAPI_URL=https://your-strapi-instance.com
STRAPI_API_TOKEN=your_api_token_here
CLICKHOUSE_HOST=https://clickhouse.cloud
CLICKHOUSE_VIEWER_USER=viewer
CLICKHOUSE_VIEWER_PASSWORD=viewer_pass
CLICKHOUSE_INGEST_USER=ingest
CLICKHOUSE_INGEST_PASSWORD=ingest_pass
CLICKHOUSE_DB=analytics

# 3. Initialize clients in your app entry point
# See INITIALIZATION_PROTOCOLS section above
```

### Common Patterns

#### Parallel Data Fetching

```typescript
import { fetchHomepage, fetchProjects, fetchPosts, fetchExperiences } from '@aazucena/api';

// Fetch multiple endpoints in parallel
const [homepage, projects, posts, experiences] = await Promise.all([
  fetchHomepage(),
  fetchProjects(),
  fetchPosts({ limit: 10 }),
  fetchExperiences(),
]);
```

#### Safe Validation with Error Handling

```typescript
import { ProjectSchema } from '@aazucena/api';

const result = ProjectSchema.safeParse(apiResponse);

if (result.success) {
  const project = result.data; // Fully typed
  console.log(project.title, project.technologies);
} else {
  console.error('Validation failed:', result.error.issues);
  // Fallback to default values or error state
}
```

#### Transform Raw Data

```typescript
import { transformProject, transformPost } from '@aazucena/api';

// Strapi returns nested { data: { id, attributes: {...} } }
const rawProject = await fetchStrapi('projects/1');

// Transform to clean { id, title, description, ... }
const cleanProject = transformProject(rawProject.data);
```

#### Custom Strapi Queries

```typescript
import { fetchStrapi } from '@aazucena/api';

// With query parameters (qs library handles encoding)
const posts = await fetchStrapi('posts', {
  populate: ['image', 'tags'],
  filters: { featured: { $eq: true } },
  pagination: { pageSize: 10 },
  sort: ['publishedAt:desc'],
});

// Update entry
import { updateStrapiEntry } from '@aazucena/api';

await updateStrapiEntry('posts', postId, {
  title: 'Updated Title',
  featured: true,
});
```

#### ClickHouse Analytics Queries

```typescript
import { getViewerClient } from '@aazucena/api';

const viewer = getViewerClient();

// Query with parameters (prevents SQL injection)
const pageViews = await viewer.query({
  query: `
    SELECT
      url,
      COUNT(*) as views
    FROM telemetry_events
    WHERE
      event = {event:String}
      AND timestamp >= {start:DateTime}
    GROUP BY url
    ORDER BY views DESC
    LIMIT 10
  `,
  query_params: {
    event: 'PageView',
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
  },
  format: 'JSONEachRow',
});

const results = await pageViews.json();
console.log('Top 10 pages:', results);
```

#### Ingest Telemetry Events

```typescript
import { getIngestClient } from '@aazucena/api';

const ingest = getIngestClient();

// Single event
await ingest.insert({
  table: 'telemetry_events',
  values: [
    {
      event: 'PageView',
      url: '/about',
      sessionId: 'abc123',
      timestamp: Date.now(),
      metadata: JSON.stringify({ referrer: document.referrer }),
    },
  ],
  format: 'JSONEachRow',
});

// Batch insert (recommended for performance)
const events = Array.from({ length: 100 }, (_, i) => ({
  event: 'ButtonClick',
  url: '/dashboard',
  sessionId: `session-${i}`,
  timestamp: Date.now(),
}));

await ingest.insert({
  table: 'telemetry_events',
  values: events,
  format: 'JSONEachRow',
});
```

### Advanced Usage

#### Custom Validators

```typescript
import { z } from 'zod';

// Extend existing schema
import { ProjectSchema } from '@aazucena/api';

const ExtendedProjectSchema = ProjectSchema.extend({
  customField: z.string().optional(),
});

// Create custom schema
const CustomSchema = z.object({
  id: z.number(),
  name: z.string().min(1),
  email: z.string().email(),
  role: z.enum(['admin', 'user', 'guest']),
});
```

#### Custom Transformers

```typescript
// Create reusable transformer
export function transformCustomData(raw: any) {
  return {
    id: raw.id,
    name: raw.attributes?.name || 'Unknown',
    metadata: {
      createdAt: raw.attributes?.createdAt,
      updatedAt: raw.attributes?.updatedAt,
    },
  };
}

// Use with Strapi response
import { transformCollection } from '@aazucena/api';

const rawData = await fetchStrapi('custom-collection');
const transformed = transformCollection(rawData.data, transformCustomData);
```

#### Per-Request Config Override

```typescript
import { fetchStrapi, setStrapiConfig } from '@aazucena/api';

// Set global config
setStrapiConfig({ url: 'https://primary.com', token: 'token1' });

// Override for specific request
const data = await fetchStrapi(
  'posts',
  { populate: '*' },
  {
    url: 'https://secondary.com',
    token: 'token2',
  }
);
```

### Troubleshooting

#### Error: "Strapi config not initialized"

```typescript
// ❌ Wrong: Calling fetchStrapi before initialization
const data = await fetchHomepage();

// ✅ Correct: Initialize first
import { setStrapiConfig } from '@aazucena/api';

setStrapiConfig({
  url: process.env.STRAPI_URL!,
  token: process.env.STRAPI_API_TOKEN!,
});

const data = await fetchHomepage(); // Now works
```

#### Error: "ClickHouse client not initialized"

```typescript
// ❌ Wrong: Using client before initialization
const viewer = getViewerClient(); // Throws error

// ✅ Correct: Initialize first
import { initClickHouseClients } from '@aazucena/api';

initClickHouseClients({
  viewer: { host, username, password, database },
  ingest: { host, username, password, database },
});

const viewer = getViewerClient(); // Now works
```

#### Validation Errors

```typescript
// Zod provides detailed error messages
import { ProjectSchema } from '@aazucena/api';

try {
  const project = ProjectSchema.parse(invalidData);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error('Validation errors:', error.issues);
    // [
    //   { path: ['title'], message: 'Required' },
    //   { path: ['technologies'], message: 'Expected array, received string' }
    // ]
  }
}
```

#### Strapi Populate Issues

```typescript
// ❌ Wrong: Forgetting to populate relations
const project = await fetchStrapi('projects/1');
console.log(project.data.attributes.image); // undefined

// ✅ Correct: Explicitly populate relations
const project = await fetchStrapi('projects/1', {
  populate: ['image', 'technologies', 'tags'],
});
console.log(project.data.attributes.image.data.attributes.url); // Works

// 🎯 Best: Use transformers to handle nested structure
import { transformProject } from '@aazucena/api';

const cleanProject = transformProject(project.data);
console.log(cleanProject.imageUrl); // Clean, flat structure
```

---

**VERSION:** 0.0.0
**STATUS:** Development
**PROVIDER:** aazucena_intelligence_engine
