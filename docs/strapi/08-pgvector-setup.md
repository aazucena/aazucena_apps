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

## Step 3: Lifecycle Hooks

Auto-generate embeddings on content save:

```typescript
// src/api/project/content-types/project/lifecycles.ts
import embeddingService from '../../../../services/embedding.service';

export default {
  async beforeCreate(event) {
    const { data } = event.params;
    if (data.description) {
      try {
        const { embedding, model } = await embeddingService.generateEmbedding(data.description);
        data.descriptionEmbedding = embedding;
        data.descriptionEmbeddingModel = model;
        data.descriptionEmbeddingGeneratedAt = new Date();
      } catch (error) {
        console.error('Failed to generate embedding:', error);
      }
    }
  },

  async beforeUpdate(event) {
    const { data } = event.params;
    if (data.description) {
      try {
        const { embedding, model } = await embeddingService.generateEmbedding(data.description);
        data.descriptionEmbedding = embedding;
        data.descriptionEmbeddingModel = model;
        data.descriptionEmbeddingGeneratedAt = new Date();
      } catch (error) {
        console.error('Failed to generate embedding:', error);
      }
    }
  },
};
```

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

## Next Steps

**[→ Configure API Permissions](./09-api-permissions.md)**

---

**Last Updated:** 2025-01-15

**[← AI Forms](./07-collection-types-ai.md)** | **[Next: API Permissions →](./09-api-permissions.md)**
