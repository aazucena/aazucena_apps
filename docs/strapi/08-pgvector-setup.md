# pgVector Configuration

**[← Back to AI Forms](./07-collection-types-ai.md)** | **[Next: API Permissions →](./09-api-permissions.md)**

---

## Overview

Complete setup for pgVector integration with Strapi v5 and PostgreSQL 16.

**Embedding Provider:** Google Gemini (textembedding-gecko)
**Vector Dimensions:** 768
**Index Type:** ivfflat (speed-optimized)

**Content Types with pgVector:**
- About (`bioEmbedding`)
- Projects (`descriptionEmbedding`)
- Testimonials (`contentEmbedding`)
- Blog Posts (`contentEmbedding`)
- Form Submissions (`messageEmbedding`, `summaryEmbedding`)

---

## Step 1: Database Migration

Run this SQL migration in PostgreSQL:

```sql
-- Enable pgVector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Add vector columns to content types
ALTER TABLE abouts ADD COLUMN IF NOT EXISTS bio_embedding vector(768);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS description_embedding vector(768);
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS content_embedding vector(768);
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS content_embedding vector(768);
ALTER TABLE form_submissions ADD COLUMN IF NOT EXISTS message_embedding vector(768);
ALTER TABLE form_submissions ADD COLUMN IF NOT EXISTS summary_embedding vector(768);

-- Create ivfflat indexes (speed-optimized)
CREATE INDEX IF NOT EXISTS idx_about_bio_embedding
  ON abouts USING ivfflat (bio_embedding vector_cosine_ops)
  WITH (lists = 10);

CREATE INDEX IF NOT EXISTS idx_project_description_embedding
  ON projects USING ivfflat (description_embedding vector_cosine_ops)
  WITH (lists = 100);

CREATE INDEX IF NOT EXISTS idx_testimonial_content_embedding
  ON testimonials USING ivfflat (content_embedding vector_cosine_ops)
  WITH (lists = 50);

CREATE INDEX IF NOT EXISTS idx_blog_post_content_embedding
  ON blog_posts USING ivfflat (content_embedding vector_cosine_ops)
  WITH (lists = 50);

CREATE INDEX IF NOT EXISTS idx_form_message_embedding
  ON form_submissions USING ivfflat (message_embedding vector_cosine_ops)
  WITH (lists = 100);

CREATE INDEX IF NOT EXISTS idx_form_summary_embedding
  ON form_submissions USING ivfflat (summary_embedding vector_cosine_ops)
  WITH (lists = 100);
```

**Index Configuration:**
- `lists` parameter: `sqrt(total_rows)` or `rows/1000`
- Adjust based on actual data volume

---

## Step 2: Gemini Embedding Service

Create embedding service in Strapi:

```typescript
// src/services/embedding.service.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

interface EmbeddingResult {
  embedding: number[];
  model: string;
  dimensions: number;
}

export class EmbeddingService {
  private model = genAI.getGenerativeModel({ model: 'text-embedding-004' });

  async generateEmbedding(text: string): Promise<EmbeddingResult> {
    if (!text || text.trim().length === 0) {
      throw new Error('Text cannot be empty');
    }

    const result = await this.model.embedContent(text);
    return {
      embedding: Array.from(result.embedding.values),
      model: 'gemini-textembedding-gecko',
      dimensions: 768,
    };
  }

  async generateBatchEmbeddings(texts: string[]): Promise<EmbeddingResult[]> {
    return Promise.all(texts.map(text => this.generateEmbedding(text)));
  }

  cosineSimilarity(vecA: number[], vecB: number[]): number {
    const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
    return dotProduct / (magnitudeA * magnitudeB);
  }
}

export default new EmbeddingService();
```

**Environment Variables:**
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

---

## Step 3: Document Service Middleware (Strapi v5)

**CRITICAL:** Strapi v5 changed how lifecycle hooks work with Draft & Publish. Using traditional lifecycle hooks can cause **duplicate embeddings** when publishing drafts.

**Recommended Approach:** Document Service Middleware

### Why Middleware Instead of Lifecycle Hooks?

In Strapi v5 with Draft & Publish enabled, publishing a draft triggers:
1. `beforeDelete` + `afterDelete` on the old published entry
2. `beforeCreate` + `afterCreate` on the new published entry

This causes lifecycle hooks to fire twice, creating duplicate embeddings.

**See:** [Strapi v5 Breaking Changes - Lifecycle Hooks](https://docs.strapi.io/cms/migration/v4-to-v5/breaking-changes/lifecycle-hooks-document-service)

### Middleware Implementation

```typescript
// config/middlewares.ts
export default [
  'strapi::errors',
  'strapi::security',
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
  {
    name: 'global::embedding-generator',
    config: {},
  },
];
```

```typescript
// src/middlewares/embedding-generator.ts
import embeddingService from '../services/embedding.service';

interface EmbeddingConfig {
  uid: string;
  field: string;
  embeddingField: string;
}

const EMBEDDING_CONFIGS: EmbeddingConfig[] = [
  { uid: 'api::about.about', field: 'bio', embeddingField: 'bioEmbedding' },
  { uid: 'api::project.project', field: 'description', embeddingField: 'descriptionEmbedding' },
  { uid: 'api::testimonial.testimonial', field: 'content', embeddingField: 'contentEmbedding' },
  { uid: 'api::blog-post.blog-post', field: 'content', embeddingField: 'contentEmbedding' },
  { uid: 'api::form-submission.form-submission', field: 'rawMessage', embeddingField: 'messageEmbedding' },
  { uid: 'api::form-submission.form-submission', field: 'aiSummary', embeddingField: 'summaryEmbedding' },
];

export default (config, { strapi }) => {
  return async (ctx, next) => {
    await next();

    // Only process POST/PUT requests that succeeded
    if (!['POST', 'PUT'].includes(ctx.request.method) || ctx.status >= 400) {
      return;
    }

    const { uid } = ctx.params;
    if (!uid) return;

    // Find matching embedding config
    const configs = EMBEDDING_CONFIGS.filter(c => c.uid === uid);
    if (configs.length === 0) return;

    const entityId = ctx.response.body?.data?.id;
    if (!entityId) return;

    // Generate embeddings asynchronously (don't block response)
    setImmediate(async () => {
      try {
        const entity = await strapi.documents(uid).findOne({ documentId: entityId });

        for (const config of configs) {
          const textValue = entity[config.field];
          if (!textValue || typeof textValue !== 'string') continue;

          // Skip if embedding already exists and text hasn't changed
          if (entity[config.embeddingField] && entity[`${config.field}LastUpdated`]) {
            const lastUpdated = new Date(entity[`${config.field}LastUpdated`]);
            const embeddingGeneratedAt = new Date(entity[`${config.embeddingField}GeneratedAt`]);
            if (embeddingGeneratedAt >= lastUpdated) continue;
          }

          const { embedding, model } = await embeddingService.generateEmbedding(textValue);

          await strapi.db.query(uid).update({
            where: { id: entityId },
            data: {
              [config.embeddingField]: embedding,
              [`${config.embeddingField}Model`]: model,
              [`${config.embeddingField}GeneratedAt`]: new Date(),
            },
          });

          strapi.log.info(`Generated ${config.embeddingField} for ${uid}:${entityId}`);
        }
      } catch (error) {
        strapi.log.error(`Embedding generation failed for ${uid}:${entityId}`, error);
        // Don't throw - embedding generation failure shouldn't block content creation
      }
    });
  };
};
```

### Alternative: Lifecycle Hooks (Simple Use Cases Only)

If you're NOT using Draft & Publish, lifecycle hooks are simpler:

```typescript
// src/api/project/content-types/project/lifecycles.ts
import embeddingService from '../../../../services/embedding.service';

export default {
  async afterCreate(event) {
    const { result } = event;
    if (!result.description) return;

    try {
      const { embedding, model } = await embeddingService.generateEmbedding(result.description);
      await strapi.db.query('api::project.project').update({
        where: { id: result.id },
        data: {
          descriptionEmbedding: embedding,
          descriptionEmbeddingModel: model,
          descriptionEmbeddingGeneratedAt: new Date(),
        },
      });
    } catch (error) {
      strapi.log.error('Embedding generation failed:', error);
    }
  },

  async afterUpdate(event) {
    const { result } = event;
    if (!result.description) return;

    try {
      const { embedding, model } = await embeddingService.generateEmbedding(result.description);
      await strapi.db.query('api::project.project').update({
        where: { id: result.id },
        data: {
          descriptionEmbedding: embedding,
          descriptionEmbeddingModel: model,
          descriptionEmbeddingGeneratedAt: new Date(),
        },
      });
    } catch (error) {
      strapi.log.error('Embedding generation failed:', error);
    }
  },
};
```

**WARNING:** Only use lifecycle hooks if Draft & Publish is disabled on ALL content types with embeddings.

**Apply to:**
- About, Testimonials, Blog Posts, Form Submissions

---

## Step 4: Semantic Search Service

```typescript
// src/services/semantic-search.service.ts
import embeddingService from './embedding.service';

interface SearchOptions {
  contentType: 'projects' | 'blog-posts' | 'testimonials' | 'form-submissions';
  limit?: number;
  threshold?: number;
  filters?: Record<string, any>;
}

export class SemanticSearchService {
  async search(query: string, options: SearchOptions): Promise<any[]> {
    const { contentType, limit = 10, threshold = 0.7, filters = {} } = options;

    const { embedding: queryEmbedding } = await embeddingService.generateEmbedding(query);
    const tableName = this.getTableName(contentType);
    const embeddingColumn = this.getEmbeddingColumn(contentType);

    let sql = `
      SELECT id, 1 - (${embeddingColumn} <=> $1::vector) as similarity, *
      FROM ${tableName}
      WHERE 1 - (${embeddingColumn} <=> $1::vector) > $2
    `;

    const params = [JSON.stringify(queryEmbedding), threshold];
    let paramIndex = 3;

    // Add metadata filters
    if (filters.formType) {
      sql += ` AND form_type = $${paramIndex}`;
      params.push(filters.formType);
      paramIndex++;
    }

    sql += ` ORDER BY similarity DESC LIMIT $${paramIndex}`;
    params.push(limit);

    const results = await strapi.db.connection.raw(sql, params);
    return results.rows;
  }

  private getTableName(contentType: string): string {
    const mapping = {
      'projects': 'projects',
      'blog-posts': 'blog_posts',
      'testimonials': 'testimonials',
      'form-submissions': 'form_submissions',
    };
    return mapping[contentType];
  }

  private getEmbeddingColumn(contentType: string): string {
    const mapping = {
      'projects': 'description_embedding',
      'blog-posts': 'content_embedding',
      'testimonials': 'content_embedding',
      'form-submissions': 'message_embedding',
    };
    return mapping[contentType];
  }
}

export default new SemanticSearchService();
```

---

## Step 5: API Route

```typescript
// src/api/semantic-search/routes/semantic-search.ts
export default {
  routes: [{
    method: 'POST',
    path: '/semantic-search',
    handler: 'semantic-search.search',
  }],
};

// src/api/semantic-search/controllers/semantic-search.ts
import semanticSearchService from '../../../services/semantic-search.service';

export default {
  async search(ctx) {
    const { query, contentType, limit, threshold, filters } = ctx.request.body;

    if (!query || !contentType) {
      return ctx.badRequest('Query and contentType are required');
    }

    const results = await semanticSearchService.search(query, {
      contentType, limit, threshold, filters,
    });

    return ctx.send({ results });
  },
};
```

---

## Step 6: Testing

```bash
# Find similar projects
curl -X POST http://localhost:1337/api/semantic-search \
  -H "Content-Type: application/json" \
  -d '{"query": "React portfolio with animations", "contentType": "projects", "limit": 5}'

# Find similar form submissions
curl -X POST http://localhost:1337/api/semantic-search \
  -H "Content-Type: application/json" \
  -d '{"query": "Bug report", "contentType": "form-submissions", "filters": {"formType": "Bug Report"}}'
```

---

## Known Strapi v5 Issues

### JSON Field Serialization Bug

**Issue:** JSON fields may be returned as strings instead of objects in Strapi v5.

**Affected Fields:**
- Form Submissions: `structuredData`, `metadata`
- Music Tracks: `waveformData`

**Workaround:**

```typescript
// Always parse JSON fields when retrieving from API
const data = await strapi.entityService.findOne('api::form-submission.form-submission', id);

// Parse JSON fields
const structuredData = typeof data.structuredData === 'string'
  ? JSON.parse(data.structuredData)
  : data.structuredData;

const metadata = typeof data.metadata === 'string'
  ? JSON.parse(data.metadata)
  : data.metadata;
```

**Frontend Workaround:**

```typescript
// In React components
const parseJsonField = (field: any) => {
  if (typeof field === 'string') {
    try {
      return JSON.parse(field);
    } catch {
      return field;
    }
  }
  return field;
};

const structuredData = parseJsonField(submission.structuredData);
```

**See:** [GitHub Issue #20114](https://github.com/strapi/strapi/issues/20114)

### TypeScript Type Safety for pgVector

Add type definitions for vector columns:

```typescript
// types/pgvector.d.ts
declare module '@strapi/database' {
  interface Schema {
    tables: {
      abouts: {
        bio_embedding: number[];
      };
      projects: {
        description_embedding: number[];
      };
      testimonials: {
        content_embedding: number[];
      };
      blog_posts: {
        content_embedding: number[];
      };
      form_submissions: {
        message_embedding: number[];
        summary_embedding: number[];
      };
    };
  }
}
```

---

## Next Steps

**[→ Configure API Permissions](./09-api-permissions.md)**

---

**Last Updated:** 2025-12-01

**[← AI Forms](./07-collection-types-ai.md)** | **[Next: API Permissions →](./09-api-permissions.md)**
