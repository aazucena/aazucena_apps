# LangChain + pgVector + Embeddings Integration Guide

**AI-Powered Forms with Semantic Search & RAG**

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Installation](#installation)
4. [Phase 1: Embeddings Setup](#phase-1-embeddings-setup)
5. [Phase 2: pgVector Vector Store](#phase-2-pgvector-vector-store)
6. [Phase 3: Semantic Search](#phase-3-semantic-search)
7. [Phase 4: RAG Pipeline](#phase-4-rag-pipeline)
8. [Phase 5: LangGraph Integration](#phase-5-langgraph-integration)
9. [Phase 6: Reranking & Optimization](#phase-6-reranking--optimization)
10. [Phase 7: LangSmith Observability](#phase-7-langsmith-observability)
11. [Testing](#testing)
12. [Production Deployment](#production-deployment)

---

## Overview

This guide shows how to integrate LangChain embeddings with pgVector for the AI-powered forms system, enabling:

- **Semantic Search** - Find similar form submissions using vector similarity
- **RAG (Retrieval-Augmented Generation)** - Use past submissions as context for AI responses
- **Duplicate Detection** - Identify duplicate bug reports/feature requests
- **Intent Classification** - Route submissions based on semantic similarity
- **Analytics Clustering** - Group similar feedback for insights

### Tech Stack

- **LangChain** - LLM orchestration framework
- **LangGraph** - State machine for multi-turn conversations
- **pgVector** - PostgreSQL vector similarity search
- **Google Gemini** - Primary embedding model (768 dims, free tier)
- **Anthropic Claude** - Primary LLM (3.5 Sonnet)
- **Cohere** - Reranking for improved relevance (optional)
- **LangSmith** - Observability and tracing

---

## Architecture

### Data Flow

```
User Submits Form
    ↓
Strapi API Endpoint
    ↓
LangGraph State Machine
    ↓
┌─────────────────────────────────────┐
│ Node 1: Intent Classification       │
│  - Generate query embedding         │
│  - Search similar submissions       │
│  - Classify form type               │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│ Node 2: Field Extraction            │
│  - Use LLM to extract structured    │
│  - Validate extracted fields        │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│ Node 3: Semantic Search (RAG)       │
│  - Find similar past submissions    │
│  - Retrieve top 5-10 results        │
│  - Filter by metadata               │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│ Node 4: AI Summarization            │
│  - Use similar submissions context  │
│  - Generate summary + sentiment     │
│  - Suggest auto-response            │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│ Node 5: Embedding Generation        │
│  - Generate message embedding       │
│  - Generate summary embedding       │
│  - Store in pgVector via middleware │
└─────────────────────────────────────┘
    ↓
Save to Strapi + Send Response
```

### Vector Storage Schema

```sql
-- form_submissions table with pgVector
CREATE TABLE form_submissions (
  id SERIAL PRIMARY KEY,
  form_type VARCHAR(50) NOT NULL,
  raw_message TEXT NOT NULL,
  ai_summary TEXT,
  ai_sentiment VARCHAR(20),

  -- Vector embeddings (768 dimensions - Gemini)
  message_embedding vector(768),
  summary_embedding vector(768),

  -- Metadata for filtering
  metadata JSONB,  -- {formType, sentiment, tags, submittedAt}

  -- Timestamps
  submitted_at TIMESTAMP NOT NULL,
  embedding_generated_at TIMESTAMP,

  -- LangSmith tracking
  langsmith_trace_id VARCHAR(100)
);

-- Vector similarity indexes
CREATE INDEX idx_message_embedding ON form_submissions
  USING ivfflat (message_embedding vector_cosine_ops)
  WITH (lists = 100);

CREATE INDEX idx_summary_embedding ON form_submissions
  USING ivfflat (summary_embedding vector_cosine_ops)
  WITH (lists = 100);

-- Metadata indexes for filtering
CREATE INDEX idx_form_type ON form_submissions (form_type);
CREATE INDEX idx_sentiment ON form_submissions (ai_sentiment);
CREATE INDEX idx_submitted_at ON form_submissions (submitted_at);
```

---

## Installation

### 1. Install LangChain Packages

```bash
# From apps/cms directory
pnpm add @langchain/core @langchain/community @langchain/anthropic @langchain/google-genai @langchain/cohere langchain

# LangGraph for state machines
pnpm add @langchain/langgraph

# pgVector support
pnpm add pg pgvector

# LangSmith for observability
pnpm add langsmith

# Utilities
pnpm add zod dotenv
```

### 2. Environment Variables

```env
# apps/cms/.env

# Embedding Models
GEMINI_API_KEY=your_gemini_api_key_here

# LLM
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Reranking (optional)
COHERE_API_KEY=your_cohere_api_key_here

# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=strapi
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=strapi

# LangSmith (optional but recommended)
LANGCHAIN_TRACING_V2=true
LANGCHAIN_API_KEY=your_langsmith_api_key_here
LANGCHAIN_PROJECT=aazucena-ai-forms

# Optional: Alternative embedding providers
OPENAI_API_KEY=your_openai_api_key_here
```

### 3. TypeScript Configuration

```json
// apps/cms/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "moduleResolution": "node",
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "strict": true,
    "skipLibCheck": true
  }
}
```

---

## Phase 1: Embeddings Setup

### 1.1 Create Embeddings Service

```typescript
// apps/cms/src/services/embeddings/embedding.service.ts
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { OpenAIEmbeddings } from "@langchain/openai";
import { CohereEmbeddings } from "@langchain/cohere";

export type EmbeddingProvider = "gemini" | "openai" | "cohere";

export interface EmbeddingConfig {
  provider: EmbeddingProvider;
  modelName?: string;
  dimensions: number;
}

export class EmbeddingService {
  private embeddings: GoogleGenerativeAIEmbeddings | OpenAIEmbeddings | CohereEmbeddings;
  private config: EmbeddingConfig;

  constructor(config: EmbeddingConfig) {
    this.config = config;
    this.embeddings = this.initializeEmbeddings();
  }

  private initializeEmbeddings() {
    switch (this.config.provider) {
      case "gemini":
        return new GoogleGenerativeAIEmbeddings({
          apiKey: process.env.GEMINI_API_KEY,
          modelName: this.config.modelName || "text-embedding-004",
        });

      case "openai":
        return new OpenAIEmbeddings({
          apiKey: process.env.OPENAI_API_KEY,
          modelName: this.config.modelName || "text-embedding-3-small",
        });

      case "cohere":
        return new CohereEmbeddings({
          apiKey: process.env.COHERE_API_KEY,
          model: this.config.modelName || "embed-english-v3.0",
        });

      default:
        throw new Error(`Unsupported embedding provider: ${this.config.provider}`);
    }
  }

  /**
   * Generate embedding for a single query
   */
  async embedQuery(text: string): Promise<number[]> {
    if (!text || text.trim().length === 0) {
      throw new Error("Text cannot be empty");
    }

    try {
      const embedding = await this.embeddings.embedQuery(text);
      return embedding;
    } catch (error) {
      console.error("Embedding generation failed:", error);
      throw new Error(`Failed to generate embedding: ${error.message}`);
    }
  }

  /**
   * Generate embeddings for multiple documents (batch)
   */
  async embedDocuments(texts: string[]): Promise<number[][]> {
    if (!texts || texts.length === 0) {
      throw new Error("Texts array cannot be empty");
    }

    try {
      const embeddings = await this.embeddings.embedDocuments(texts);
      return embeddings;
    } catch (error) {
      console.error("Batch embedding generation failed:", error);
      throw new Error(`Failed to generate batch embeddings: ${error.message}`);
    }
  }

  /**
   * Calculate cosine similarity between two vectors
   */
  cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length) {
      throw new Error("Vectors must have the same dimensions");
    }

    const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));

    return dotProduct / (magnitudeA * magnitudeB);
  }

  /**
   * Get embedding dimensions for current provider
   */
  getDimensions(): number {
    return this.config.dimensions;
  }

  /**
   * Get current provider name
   */
  getProvider(): EmbeddingProvider {
    return this.config.provider;
  }
}

// Export default instance (Gemini)
export default new EmbeddingService({
  provider: "gemini",
  dimensions: 768,
});
```

### 1.2 Create Embeddings Factory

```typescript
// apps/cms/src/services/embeddings/factory.ts
import { EmbeddingService, EmbeddingProvider } from "./embedding.service";

export class EmbeddingServiceFactory {
  private static instances: Map<EmbeddingProvider, EmbeddingService> = new Map();

  static getService(provider: EmbeddingProvider = "gemini"): EmbeddingService {
    if (!this.instances.has(provider)) {
      const dimensions = this.getDimensions(provider);
      const service = new EmbeddingService({ provider, dimensions });
      this.instances.set(provider, service);
    }

    return this.instances.get(provider)!;
  }

  private static getDimensions(provider: EmbeddingProvider): number {
    const dimensionsMap: Record<EmbeddingProvider, number> = {
      gemini: 768,
      openai: 1536,
      cohere: 1024,
    };

    return dimensionsMap[provider];
  }
}
```

### 1.3 Test Embeddings

```typescript
// apps/cms/src/services/embeddings/__tests__/embedding.test.ts
import embeddingService from "../embedding.service";

describe("EmbeddingService", () => {
  it("should generate embedding for single text", async () => {
    const text = "I found a bug in the contact form";
    const embedding = await embeddingService.embedQuery(text);

    expect(embedding).toBeDefined();
    expect(embedding.length).toBe(768); // Gemini dimensions
    expect(embedding[0]).toBeTypeOf("number");
  });

  it("should generate embeddings for multiple texts", async () => {
    const texts = [
      "Feature request: Add dark mode",
      "Bug report: Login button not working",
      "Feedback: Great portfolio design!",
    ];

    const embeddings = await embeddingService.embedDocuments(texts);

    expect(embeddings).toHaveLength(3);
    expect(embeddings[0].length).toBe(768);
  });

  it("should calculate cosine similarity", () => {
    const vec1 = [1, 2, 3];
    const vec2 = [4, 5, 6];

    const similarity = embeddingService.cosineSimilarity(vec1, vec2);

    expect(similarity).toBeGreaterThan(0);
    expect(similarity).toBeLessThanOrEqual(1);
  });

  it("should throw error for empty text", async () => {
    await expect(embeddingService.embedQuery("")).rejects.toThrow(
      "Text cannot be empty"
    );
  });
});
```

---

## Phase 2: pgVector Vector Store

### 2.1 Create Vector Store Service

```typescript
// apps/cms/src/services/vectorstore/pgvector.service.ts
import { PGVectorStore } from "@langchain/community/vectorstores/pgvector";
import { Document } from "@langchain/core/documents";
import { PoolConfig } from "pg";
import embeddingService from "../embeddings/embedding.service";

export interface VectorSearchOptions {
  k?: number; // Number of results
  filter?: Record<string, any>; // Metadata filter
  threshold?: number; // Minimum similarity score
}

export interface VectorSearchResult {
  document: Document;
  score: number;
  metadata: Record<string, any>;
}

export class PGVectorService {
  private vectorStore: PGVectorStore | null = null;
  private config: PoolConfig;

  constructor() {
    this.config = {
      host: process.env.DATABASE_HOST || "localhost",
      port: Number(process.env.DATABASE_PORT) || 5432,
      database: process.env.DATABASE_NAME || "strapi",
      user: process.env.DATABASE_USERNAME || "strapi",
      password: process.env.DATABASE_PASSWORD || "strapi",
    };
  }

  /**
   * Initialize vector store
   */
  async initialize(): Promise<PGVectorStore> {
    if (this.vectorStore) {
      return this.vectorStore;
    }

    try {
      this.vectorStore = await PGVectorStore.initialize(
        embeddingService,
        {
          postgresConnectionOptions: this.config,
          tableName: "form_submissions",
          columns: {
            idColumnName: "id",
            vectorColumnName: "message_embedding",
            contentColumnName: "raw_message",
            metadataColumnName: "metadata",
          },
        }
      );

      console.log("✅ PGVectorStore initialized successfully");
      return this.vectorStore;
    } catch (error) {
      console.error("❌ Failed to initialize PGVectorStore:", error);
      throw error;
    }
  }

  /**
   * Add documents to vector store
   */
  async addDocuments(
    documents: Document[],
    metadata?: Record<string, any>[]
  ): Promise<void> {
    const store = await this.initialize();

    try {
      await store.addDocuments(documents, metadata);
      console.log(`✅ Added ${documents.length} documents to vector store`);
    } catch (error) {
      console.error("❌ Failed to add documents:", error);
      throw error;
    }
  }

  /**
   * Semantic search with similarity scores
   */
  async similaritySearchWithScore(
    query: string,
    options: VectorSearchOptions = {}
  ): Promise<VectorSearchResult[]> {
    const store = await this.initialize();
    const { k = 5, filter, threshold = 0.7 } = options;

    try {
      const results = await store.similaritySearchWithScore(query, k, filter);

      // Filter by threshold and format results
      return results
        .filter(([_, score]) => score >= threshold)
        .map(([document, score]) => ({
          document,
          score,
          metadata: document.metadata,
        }));
    } catch (error) {
      console.error("❌ Similarity search failed:", error);
      throw error;
    }
  }

  /**
   * Semantic search (documents only, no scores)
   */
  async similaritySearch(
    query: string,
    options: VectorSearchOptions = {}
  ): Promise<Document[]> {
    const results = await this.similaritySearchWithScore(query, options);
    return results.map(r => r.document);
  }

  /**
   * Find similar submissions by form type
   */
  async findSimilarSubmissions(
    query: string,
    formType: string,
    k: number = 5
  ): Promise<VectorSearchResult[]> {
    return this.similaritySearchWithScore(query, {
      k,
      filter: { formType },
      threshold: 0.7,
    });
  }

  /**
   * Find duplicate submissions (very high similarity)
   */
  async findDuplicates(
    query: string,
    formType: string,
    threshold: number = 0.95
  ): Promise<VectorSearchResult[]> {
    return this.similaritySearchWithScore(query, {
      k: 10,
      filter: { formType },
      threshold,
    });
  }

  /**
   * Close vector store connection
   */
  async close(): Promise<void> {
    if (this.vectorStore) {
      await this.vectorStore.end();
      this.vectorStore = null;
      console.log("✅ PGVectorStore connection closed");
    }
  }
}

// Export singleton instance
export default new PGVectorService();
```

### 2.2 Create Vector Store Initialization Script

```typescript
// apps/cms/src/scripts/init-vectorstore.ts
import pgVectorService from "../services/vectorstore/pgvector.service";

async function initializeVectorStore() {
  console.log("🚀 Initializing PGVector store...");

  try {
    await pgVectorService.initialize();
    console.log("✅ Vector store initialized successfully");
  } catch (error) {
    console.error("❌ Initialization failed:", error);
    process.exit(1);
  } finally {
    await pgVectorService.close();
  }
}

initializeVectorStore();
```

```json
// apps/cms/package.json (add script)
{
  "scripts": {
    "init:vectorstore": "ts-node src/scripts/init-vectorstore.ts"
  }
}
```

---

## Phase 3: Semantic Search

### 3.1 Create Semantic Search Service

```typescript
// apps/cms/src/services/semantic-search/search.service.ts
import pgVectorService, { VectorSearchResult } from "../vectorstore/pgvector.service";
import { Document } from "@langchain/core/documents";

export interface SearchFilters {
  formType?: string;
  sentiment?: string;
  tags?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface SearchOptions {
  k?: number;
  threshold?: number;
  filters?: SearchFilters;
  rerank?: boolean;
}

export class SemanticSearchService {
  /**
   * Search form submissions by semantic similarity
   */
  async searchSubmissions(
    query: string,
    options: SearchOptions = {}
  ): Promise<VectorSearchResult[]> {
    const { k = 5, threshold = 0.7, filters = {} } = options;

    // Build metadata filter
    const metadataFilter: Record<string, any> = {};

    if (filters.formType) {
      metadataFilter.formType = filters.formType;
    }

    if (filters.sentiment) {
      metadataFilter.sentiment = filters.sentiment;
    }

    if (filters.tags && filters.tags.length > 0) {
      // Filter by tags (array contains any)
      metadataFilter.tags = { $in: filters.tags };
    }

    if (filters.dateRange) {
      metadataFilter.submittedAt = {
        $gte: filters.dateRange.start,
        $lte: filters.dateRange.end,
      };
    }

    // Perform semantic search
    const results = await pgVectorService.similaritySearchWithScore(query, {
      k,
      filter: metadataFilter,
      threshold,
    });

    return results;
  }

  /**
   * Find similar bug reports
   */
  async findSimilarBugReports(
    description: string,
    k: number = 5
  ): Promise<VectorSearchResult[]> {
    return this.searchSubmissions(description, {
      k,
      filters: { formType: "Bug Report" },
      threshold: 0.75,
    });
  }

  /**
   * Find similar feature requests
   */
  async findSimilarFeatureRequests(
    description: string,
    k: number = 5
  ): Promise<VectorSearchResult[]> {
    return this.searchSubmissions(description, {
      k,
      filters: { formType: "Feature Request" },
      threshold: 0.75,
    });
  }

  /**
   * Find similar feedback (all types)
   */
  async findSimilarFeedback(
    message: string,
    k: number = 10
  ): Promise<VectorSearchResult[]> {
    return this.searchSubmissions(message, {
      k,
      threshold: 0.7,
    });
  }

  /**
   * Detect duplicate submissions
   */
  async detectDuplicates(
    message: string,
    formType: string
  ): Promise<{
    isDuplicate: boolean;
    duplicates: VectorSearchResult[];
  }> {
    const duplicates = await pgVectorService.findDuplicates(
      message,
      formType,
      0.95 // Very high threshold for duplicates
    );

    return {
      isDuplicate: duplicates.length > 0,
      duplicates,
    };
  }

  /**
   * Get submissions for RAG context
   */
  async getContextForRAG(
    query: string,
    formType: string,
    k: number = 5
  ): Promise<string> {
    const results = await this.searchSubmissions(query, {
      k,
      filters: { formType },
      threshold: 0.7,
    });

    // Format results as context string
    return results
      .map((result, index) => {
        const { document, score } = result;
        return `
[${index + 1}] (Similarity: ${(score * 100).toFixed(1)}%)
Form Type: ${document.metadata.formType}
Sentiment: ${document.metadata.sentiment}
Message: ${document.pageContent}
`;
      })
      .join("\n---\n");
  }
}

// Export singleton instance
export default new SemanticSearchService();
```

### 3.2 Create Search API Endpoint

```typescript
// apps/cms/src/api/semantic-search/routes/semantic-search.ts
export default {
  routes: [
    {
      method: "POST",
      path: "/semantic-search",
      handler: "semantic-search.search",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "POST",
      path: "/semantic-search/duplicates",
      handler: "semantic-search.detectDuplicates",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
```

```typescript
// apps/cms/src/api/semantic-search/controllers/semantic-search.ts
import semanticSearchService from "../../../services/semantic-search/search.service";

export default {
  async search(ctx) {
    try {
      const { query, formType, k, threshold } = ctx.request.body;

      if (!query) {
        return ctx.badRequest("Query is required");
      }

      const results = await semanticSearchService.searchSubmissions(query, {
        k: k || 5,
        threshold: threshold || 0.7,
        filters: { formType },
      });

      return ctx.send({
        success: true,
        results: results.map(r => ({
          content: r.document.pageContent,
          metadata: r.metadata,
          similarity: r.score,
        })),
      });
    } catch (error) {
      strapi.log.error("Semantic search failed:", error);
      return ctx.internalServerError("Search failed");
    }
  },

  async detectDuplicates(ctx) {
    try {
      const { message, formType } = ctx.request.body;

      if (!message || !formType) {
        return ctx.badRequest("Message and formType are required");
      }

      const result = await semanticSearchService.detectDuplicates(
        message,
        formType
      );

      return ctx.send({
        success: true,
        isDuplicate: result.isDuplicate,
        duplicates: result.duplicates.map(d => ({
          content: d.document.pageContent,
          metadata: d.metadata,
          similarity: d.score,
        })),
      });
    } catch (error) {
      strapi.log.error("Duplicate detection failed:", error);
      return ctx.internalServerError("Duplicate detection failed");
    }
  },
};
```

---

## Phase 4: RAG Pipeline

### 4.1 Create RAG Service

```typescript
// apps/cms/src/services/rag/rag.service.ts
import { ChatAnthropic } from "@langchain/anthropic";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import semanticSearchService from "../semantic-search/search.service";

export interface RAGOptions {
  formType: string;
  k?: number;
  threshold?: number;
  includeContext?: boolean;
}

export interface RAGResult {
  summary: string;
  sentiment: string;
  tags: string[];
  context: string;
  similarCount: number;
}

export class RAGService {
  private llm: ChatAnthropic;

  constructor() {
    this.llm = new ChatAnthropic({
      modelName: "claude-3-5-sonnet-20241022",
      apiKey: process.env.ANTHROPIC_API_KEY,
      temperature: 0.7,
    });
  }

  /**
   * Generate AI summary with RAG context
   */
  async generateSummaryWithContext(
    message: string,
    options: RAGOptions
  ): Promise<RAGResult> {
    const { formType, k = 5, threshold = 0.7, includeContext = true } = options;

    // Step 1: Retrieve similar submissions for context
    const context = includeContext
      ? await semanticSearchService.getContextForRAG(message, formType, k)
      : "";

    // Step 2: Create prompt with context
    const prompt = PromptTemplate.fromTemplate(`
You are an AI assistant analyzing form submissions for a portfolio website.

{context}

Current Submission:
Form Type: {formType}
Message: {message}

Task: Analyze this submission and provide:
1. A concise summary (50-150 words)
2. Sentiment classification (Very Positive, Positive, Neutral, Negative, Very Negative)
3. Up to 5 relevant tags

{similarContext}

Output Format (JSON):
{{
  "summary": "...",
  "sentiment": "...",
  "tags": ["tag1", "tag2", ...]
}}
`);

    const similarContext = context
      ? `\nSimilar Past Submissions:\n${context}\n\nConsider these similar submissions when analyzing the current one.`
      : "";

    // Step 3: Generate summary with LLM
    const chain = prompt.pipe(this.llm).pipe(new StringOutputParser());

    const response = await chain.invoke({
      formType,
      message,
      context: context ? "Similar submissions context:" : "",
      similarContext,
    });

    // Step 4: Parse JSON response
    let result: RAGResult;
    try {
      const parsed = JSON.parse(response);
      result = {
        summary: parsed.summary,
        sentiment: parsed.sentiment,
        tags: parsed.tags || [],
        context,
        similarCount: context ? k : 0,
      };
    } catch (error) {
      // Fallback if JSON parsing fails
      result = {
        summary: response.substring(0, 500),
        sentiment: "Neutral",
        tags: [],
        context,
        similarCount: 0,
      };
    }

    return result;
  }

  /**
   * Generate auto-response based on similar submissions
   */
  async generateAutoResponse(
    message: string,
    formType: string
  ): Promise<string> {
    const context = await semanticSearchService.getContextForRAG(
      message,
      formType,
      3
    );

    const prompt = PromptTemplate.fromTemplate(`
You are a friendly AI assistant responding to form submissions.

Similar Past Submissions:
{context}

Current Submission:
Form Type: {formType}
Message: {message}

Task: Generate a personalized, friendly response acknowledging the submission.
- Thank them for their input
- Reference similar submissions if relevant
- Be concise (2-3 sentences)
- Match the tone of their message

Response:
`);

    const chain = prompt.pipe(this.llm).pipe(new StringOutputParser());

    const response = await chain.invoke({
      formType,
      message,
      context,
    });

    return response.trim();
  }

  /**
   * Classify intent using RAG
   */
  async classifyIntent(message: string): Promise<string> {
    // Retrieve similar submissions across all form types
    const results = await semanticSearchService.findSimilarFeedback(message, 5);

    if (results.length === 0) {
      return "General Inquiry";
    }

    // Use majority voting from similar submissions
    const intentCounts: Record<string, number> = {};
    results.forEach(r => {
      const formType = r.metadata.formType;
      intentCounts[formType] = (intentCounts[formType] || 0) + r.score;
    });

    // Return form type with highest weighted score
    const sortedIntents = Object.entries(intentCounts).sort(
      ([, a], [, b]) => b - a
    );

    return sortedIntents[0][0];
  }
}

// Export singleton instance
export default new RAGService();
```

### 4.2 Test RAG Pipeline

```typescript
// apps/cms/src/services/rag/__tests__/rag.test.ts
import ragService from "../rag.service";

describe("RAGService", () => {
  it("should generate summary with context", async () => {
    const message = "The contact form submit button doesn't work on mobile";
    const result = await ragService.generateSummaryWithContext(message, {
      formType: "Bug Report",
      k: 5,
    });

    expect(result.summary).toBeDefined();
    expect(result.sentiment).toMatch(
      /Very Positive|Positive|Neutral|Negative|Very Negative/
    );
    expect(result.tags).toBeInstanceOf(Array);
    expect(result.similarCount).toBeGreaterThanOrEqual(0);
  });

  it("should classify intent correctly", async () => {
    const message = "I found a bug in the navigation menu";
    const intent = await ragService.classifyIntent(message);

    expect(intent).toBe("Bug Report");
  });

  it("should generate auto-response", async () => {
    const message = "Love the dark mode feature!";
    const response = await ragService.generateAutoResponse(message, "Feedback");

    expect(response).toBeDefined();
    expect(response.length).toBeGreaterThan(10);
  });
});
```

---

## Phase 5: LangGraph Integration

### 5.1 Create LangGraph State Machine

```typescript
// apps/cms/src/services/langgraph/form-processing.graph.ts
import { StateGraph, END } from "@langchain/langgraph";
import { BaseMessage } from "@langchain/core/messages";
import ragService from "../rag/rag.service";
import semanticSearchService from "../semantic-search/search.service";
import embeddingService from "../embeddings/embedding.service";

// Define state interface
export interface FormProcessingState {
  rawMessage: string;
  formType: string;
  submitterEmail?: string;
  submitterName?: string;

  // AI processing results
  classifiedIntent?: string;
  extractedData?: Record<string, any>;
  aiSummary?: string;
  aiSentiment?: string;
  aiTags?: string[];
  autoResponse?: string;

  // Embeddings
  messageEmbedding?: number[];
  summaryEmbedding?: number[];

  // RAG context
  similarSubmissions?: any[];
  isDuplicate?: boolean;

  // Easter egg
  easterEggDetected?: boolean;

  // Tracking
  langSmithTraceId?: string;
  processingErrors?: string[];
}

/**
 * Node: Classify Intent
 */
async function classifyIntent(state: FormProcessingState): Promise<Partial<FormProcessingState>> {
  try {
    const intent = await ragService.classifyIntent(state.rawMessage);

    return {
      classifiedIntent: intent,
      formType: intent, // Update form type based on classification
    };
  } catch (error) {
    return {
      processingErrors: [...(state.processingErrors || []), `Intent classification failed: ${error.message}`],
    };
  }
}

/**
 * Node: Detect Duplicates
 */
async function detectDuplicates(state: FormProcessingState): Promise<Partial<FormProcessingState>> {
  try {
    const result = await semanticSearchService.detectDuplicates(
      state.rawMessage,
      state.formType
    );

    return {
      isDuplicate: result.isDuplicate,
      similarSubmissions: result.duplicates.map(d => ({
        content: d.document.pageContent,
        similarity: d.score,
        metadata: d.metadata,
      })),
    };
  } catch (error) {
    return {
      processingErrors: [...(state.processingErrors || []), `Duplicate detection failed: ${error.message}`],
    };
  }
}

/**
 * Node: Generate AI Summary with RAG
 */
async function generateSummary(state: FormProcessingState): Promise<Partial<FormProcessingState>> {
  try {
    const result = await ragService.generateSummaryWithContext(
      state.rawMessage,
      {
        formType: state.formType,
        k: 5,
        threshold: 0.7,
      }
    );

    return {
      aiSummary: result.summary,
      aiSentiment: result.sentiment,
      aiTags: result.tags,
    };
  } catch (error) {
    return {
      processingErrors: [...(state.processingErrors || []), `Summary generation failed: ${error.message}`],
    };
  }
}

/**
 * Node: Generate Auto-Response
 */
async function generateAutoResponse(state: FormProcessingState): Promise<Partial<FormProcessingState>> {
  try {
    const response = await ragService.generateAutoResponse(
      state.rawMessage,
      state.formType
    );

    return {
      autoResponse: response,
    };
  } catch (error) {
    return {
      processingErrors: [...(state.processingErrors || []), `Auto-response failed: ${error.message}`],
    };
  }
}

/**
 * Node: Generate Embeddings
 */
async function generateEmbeddings(state: FormProcessingState): Promise<Partial<FormProcessingState>> {
  try {
    const [messageEmbedding, summaryEmbedding] = await Promise.all([
      embeddingService.embedQuery(state.rawMessage),
      state.aiSummary
        ? embeddingService.embedQuery(state.aiSummary)
        : Promise.resolve([]),
    ]);

    return {
      messageEmbedding,
      summaryEmbedding,
    };
  } catch (error) {
    return {
      processingErrors: [...(state.processingErrors || []), `Embedding generation failed: ${error.message}`],
    };
  }
}

/**
 * Node: Detect Easter Egg
 */
async function detectEasterEgg(state: FormProcessingState): Promise<Partial<FormProcessingState>> {
  const easterEggKeywords = [
    "konami code",
    "up up down down",
    "secret challenge",
    "hidden step",
    // Add your Easter egg keywords
  ];

  const message = state.rawMessage.toLowerCase();
  const detected = easterEggKeywords.some(keyword => message.includes(keyword));

  return {
    easterEggDetected: detected,
  };
}

/**
 * Create and configure the LangGraph state machine
 */
export function createFormProcessingGraph() {
  const graph = new StateGraph<FormProcessingState>({
    channels: {
      rawMessage: null,
      formType: null,
      submitterEmail: null,
      submitterName: null,
      classifiedIntent: null,
      extractedData: null,
      aiSummary: null,
      aiSentiment: null,
      aiTags: null,
      autoResponse: null,
      messageEmbedding: null,
      summaryEmbedding: null,
      similarSubmissions: null,
      isDuplicate: null,
      easterEggDetected: null,
      langSmithTraceId: null,
      processingErrors: null,
    },
  });

  // Add nodes
  graph.addNode("classifyIntent", classifyIntent);
  graph.addNode("detectDuplicates", detectDuplicates);
  graph.addNode("generateSummary", generateSummary);
  graph.addNode("generateAutoResponse", generateAutoResponse);
  graph.addNode("generateEmbeddings", generateEmbeddings);
  graph.addNode("detectEasterEgg", detectEasterEgg);

  // Define edges (execution flow)
  graph.setEntryPoint("classifyIntent");
  graph.addEdge("classifyIntent", "detectDuplicates");
  graph.addEdge("detectDuplicates", "generateSummary");
  graph.addEdge("generateSummary", "generateAutoResponse");
  graph.addEdge("generateAutoResponse", "generateEmbeddings");
  graph.addEdge("generateEmbeddings", "detectEasterEgg");
  graph.addEdge("detectEasterEgg", END);

  return graph.compile();
}

// Export compiled graph
export default createFormProcessingGraph();
```

### 5.2 Use LangGraph in Form Submission

```typescript
// apps/cms/src/api/form-submission/controllers/form-submission.ts
import formProcessingGraph from "../../../services/langgraph/form-processing.graph";

export default {
  async create(ctx) {
    try {
      const { rawMessage, formType, submitterEmail, submitterName } = ctx.request.body;

      // Validate input
      if (!rawMessage || !formType) {
        return ctx.badRequest("rawMessage and formType are required");
      }

      // Run LangGraph AI processing pipeline
      const result = await formProcessingGraph.invoke({
        rawMessage,
        formType,
        submitterEmail,
        submitterName,
        processingErrors: [],
      });

      // Create form submission in Strapi
      const submission = await strapi.entityService.create(
        "api::form-submission.form-submission",
        {
          data: {
            formType: result.formType,
            rawMessage: result.rawMessage,
            aiIntent: result.classifiedIntent,
            aiSummary: result.aiSummary,
            aiSentiment: result.aiSentiment,
            aiTags: result.aiTags,
            submitterEmail: result.submitterEmail,
            submitterName: result.submitterName,
            easterEggDetected: result.easterEggDetected || false,
            submittedAt: new Date(),
            status: "New",
            metadata: {
              isDuplicate: result.isDuplicate,
              similarCount: result.similarSubmissions?.length || 0,
            },
            // Embeddings will be added by middleware asynchronously
          },
        }
      );

      // Return response with auto-response
      return ctx.send({
        success: true,
        submission: {
          id: submission.id,
          formType: submission.formType,
          aiSummary: submission.aiSummary,
          aiSentiment: submission.aiSentiment,
          easterEggDetected: submission.easterEggDetected,
        },
        autoResponse: result.autoResponse,
        isDuplicate: result.isDuplicate,
        processingErrors: result.processingErrors,
      });
    } catch (error) {
      strapi.log.error("Form submission processing failed:", error);
      return ctx.internalServerError("Form submission failed");
    }
  },
};
```

---

## Phase 6: Reranking & Optimization

### 6.1 Add Cohere Reranking

```typescript
// apps/cms/src/services/reranking/cohere.reranker.ts
import { CohereClient } from "cohere-ai";

export interface RerankResult {
  index: number;
  relevanceScore: number;
  document: any;
}

export class CohereReranker {
  private client: CohereClient;

  constructor() {
    this.client = new CohereClient({
      token: process.env.COHERE_API_KEY,
    });
  }

  /**
   * Rerank search results using Cohere Rerank API
   */
  async rerank(
    query: string,
    documents: string[],
    topN: number = 10
  ): Promise<RerankResult[]> {
    if (!documents || documents.length === 0) {
      return [];
    }

    try {
      const response = await this.client.rerank({
        model: "rerank-english-v3.0",
        query,
        documents,
        topN,
        returnDocuments: true,
      });

      return response.results.map(result => ({
        index: result.index,
        relevanceScore: result.relevanceScore,
        document: result.document,
      }));
    } catch (error) {
      console.error("Reranking failed:", error);
      throw error;
    }
  }
}

// Export singleton instance
export default new CohereReranker();
```

### 6.2 Update Semantic Search with Reranking

```typescript
// apps/cms/src/services/semantic-search/search.service.ts (add method)

import cohereReranker from "../reranking/cohere.reranker";

export class SemanticSearchService {
  // ... existing methods ...

  /**
   * Search with reranking for improved relevance
   */
  async searchWithReranking(
    query: string,
    options: SearchOptions = {}
  ): Promise<VectorSearchResult[]> {
    const { k = 10, threshold = 0.7, filters = {} } = options;

    // Step 1: Vector search (retrieve top 50 candidates)
    const vectorResults = await this.searchSubmissions(query, {
      k: 50,
      threshold: 0.5, // Lower threshold for initial retrieval
      filters,
    });

    if (vectorResults.length === 0) {
      return [];
    }

    // Step 2: Rerank with Cohere
    const documents = vectorResults.map(r => r.document.pageContent);
    const rerankedResults = await cohereReranker.rerank(query, documents, k);

    // Step 3: Map reranked results back to vector results
    return rerankedResults.map(rr => {
      const original = vectorResults[rr.index];
      return {
        ...original,
        score: rr.relevanceScore, // Use reranking score
      };
    });
  }
}
```

---

## Phase 7: LangSmith Observability

### 7.1 Enable LangSmith Tracing

```typescript
// apps/cms/src/config/langsmith.ts
import { Client } from "langsmith";

export const langsmithClient = new Client({
  apiKey: process.env.LANGCHAIN_API_KEY,
  projectName: process.env.LANGCHAIN_PROJECT || "aazucena-ai-forms",
});

export function enableLangSmith() {
  if (process.env.LANGCHAIN_TRACING_V2 === "true") {
    console.log("✅ LangSmith tracing enabled");
  } else {
    console.log("⚠️ LangSmith tracing disabled (set LANGCHAIN_TRACING_V2=true to enable)");
  }
}
```

### 7.2 Add Tracing to RAG Service

```typescript
// apps/cms/src/services/rag/rag.service.ts (update methods)

import { traceable } from "langsmith/traceable";

export class RAGService {
  // Wrap methods with traceable for LangSmith tracking

  @traceable({ name: "generate_summary_with_rag" })
  async generateSummaryWithContext(
    message: string,
    options: RAGOptions
  ): Promise<RAGResult> {
    // ... existing implementation ...
  }

  @traceable({ name: "classify_intent" })
  async classifyIntent(message: string): Promise<string> {
    // ... existing implementation ...
  }

  @traceable({ name: "generate_auto_response" })
  async generateAutoResponse(
    message: string,
    formType: string
  ): Promise<string> {
    // ... existing implementation ...
  }
}
```

---

## Testing

### Test Semantic Search

```bash
# Test semantic search API
curl -X POST http://localhost:1337/api/semantic-search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "The navigation menu is broken on mobile",
    "formType": "Bug Report",
    "k": 5,
    "threshold": 0.7
  }'
```

### Test Duplicate Detection

```bash
# Test duplicate detection
curl -X POST http://localhost:1337/api/semantic-search/duplicates \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Contact form submit button not working",
    "formType": "Bug Report"
  }'
```

### Test Form Submission with AI Processing

```bash
# Submit form with AI processing
curl -X POST http://localhost:1337/api/form-submissions \
  -H "Content-Type: application/json" \
  -d '{
    "rawMessage": "I found a bug in the contact form. The submit button does not work on mobile devices (iPhone 14).",
    "formType": "Bug Report",
    "submitterEmail": "user@example.com",
    "submitterName": "John Doe"
  }'
```

---

## Production Deployment

### 1. Environment Variables

```env
# Production .env
GEMINI_API_KEY=prod_gemini_key
ANTHROPIC_API_KEY=prod_anthropic_key
COHERE_API_KEY=prod_cohere_key

DATABASE_HOST=prod_postgres_host
DATABASE_PORT=5432
DATABASE_NAME=strapi_prod
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=secure_password

LANGCHAIN_TRACING_V2=true
LANGCHAIN_API_KEY=prod_langsmith_key
LANGCHAIN_PROJECT=aazucena-ai-forms-prod
```

### 2. Database Migration

```sql
-- Run this on production database
CREATE EXTENSION IF NOT EXISTS vector;

ALTER TABLE form_submissions
  ADD COLUMN IF NOT EXISTS message_embedding vector(768),
  ADD COLUMN IF NOT EXISTS summary_embedding vector(768),
  ADD COLUMN IF NOT EXISTS metadata JSONB;

CREATE INDEX IF NOT EXISTS idx_message_embedding
  ON form_submissions USING ivfflat (message_embedding vector_cosine_ops)
  WITH (lists = 100);

CREATE INDEX IF NOT EXISTS idx_summary_embedding
  ON form_submissions USING ivfflat (summary_embedding vector_cosine_ops)
  WITH (lists = 100);

CREATE INDEX IF NOT EXISTS idx_metadata
  ON form_submissions USING gin (metadata);
```

### 3. Performance Tuning

```typescript
// apps/cms/src/config/vectorstore.config.ts

export const vectorStoreConfig = {
  // Adjust based on data volume
  ivfflatLists: Math.ceil(Math.sqrt(totalRows)), // e.g., sqrt(10000) = 100

  // Connection pooling
  poolConfig: {
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  },

  // Cache settings
  cacheSize: 1000, // Cache top 1000 queries
  cacheTTL: 3600 * 1000, // 1 hour
};
```

### 4. Monitoring

```typescript
// apps/cms/src/services/monitoring/metrics.service.ts

export class MetricsService {
  async trackEmbeddingGeneration(duration: number, provider: string) {
    // Track embedding generation time
    console.log(`Embedding generation: ${duration}ms (${provider})`);
  }

  async trackSemanticSearch(duration: number, resultsCount: number) {
    // Track search performance
    console.log(`Semantic search: ${duration}ms (${resultsCount} results)`);
  }

  async trackRAGQuery(duration: number, contextSize: number) {
    // Track RAG query performance
    console.log(`RAG query: ${duration}ms (${contextSize} context chars)`);
  }
}
```

---

## Next Steps

1. ✅ **Complete this integration** (7-9 days estimated)
2. ✅ **Test with sample data** (1-2 days)
3. ✅ **Frontend integration** (Astro/React forms)
4. ✅ **Production deployment** (Railway + Vercel)
5. ✅ **Monitor with LangSmith** (ongoing)

---

**Last Updated:** 2025-12-01

**Related Documentation:**
- [AI-Powered Forms Overview](/docs/features/ai-forms.md)
- [pgVector Setup](/docs/strapi/08-pgvector-setup.md)
- [Form Submissions Collection Type](/docs/strapi/07-collection-types-ai.md)
- [Phase 0: Infrastructure](/docs/phase-0-infrastructure.md)
