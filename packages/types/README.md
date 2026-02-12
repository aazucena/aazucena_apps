# @aazucena/types

## Summary

Centralized TypeScript type system for the aazucena ecosystem. Defines shared interfaces for agentic telemetry, RAG domain entities, API contracts, component props, and cross-application state management.

---

## Features

| Feature | Description |
|:--------|:------------|
| **Core Types** | Foundational types for animations, configuration, and enums |
| **API Contracts** | Standardized request/response types for Strapi and ClickHouse |
| **Component Props** | Shared prop interfaces for React components |
| **Data Models** | Domain entities for content, analytics, navigation, and visualizations |
| **Agentic Types** | Interfaces for AI telemetry, MG/EG phases, and SHADES analysis |
| **Icon Types** | Type-safe icon registry and component interfaces |
| **Rich Text Types** | Strapi BlocksRenderer and Markdown content types |

---

## Installation

```bash
# This package is part of the @aazucena monorepo
# Internal workspace dependency - no separate installation needed
```

---

## Usage

### Basic Example

```typescript
import type { Project, Post, Experience } from '@aazucena/types';

// Use content types
const project: Project = {
  id: 1,
  title: 'My Project',
  slug: 'my-project',
  description: 'A cool project',
  // ... other fields
};
```

### Advanced Example

```typescript
import type {
  TelemetryEvent,
  AgenticPhase,
  SHADESAnalysis,
  StrapiResponse
} from '@aazucena/types';

// Agentic telemetry
const telemetry: TelemetryEvent = {
  phase: 'midgame',
  tokenCount: 1250,
  latency: 850,
  costUsd: 0.005,
  timestamp: Date.now()
};

// SHADES analysis
const analysis: SHADESAnalysis = {
  sentiment: 0.75,
  history: ['interaction_1', 'interaction_2'],
  alignment: 0.92,
  drive: 'research',
  economics: { costUsd: 0.15, tokenCount: 5000 },
  signal: 'high_confidence'
};

// API response typing
const response: StrapiResponse<Project[]> = {
  data: [/* projects */],
  meta: { pagination: { page: 1, pageSize: 25, pageCount: 1, total: 10 } }
};
```

---

## API Reference

### Core Types (`animations.ts`, `config.ts`, `enums.ts`, `icons.ts`)

**`animations.ts`**:
- `AnimationConfig` - GSAP timeline configuration
- `AtmosphericLayer` - Layer state and transition data
- `ScrollProgress` - Scroll position and direction tracking

**`config.ts`**:
- `SiteConfig` - Global site configuration
- `ThemeConfig` - Theme and color scheme settings
- `FeatureFlags` - Feature toggle definitions

**`enums.ts`**:
- `ContentStatus` - Draft, published, archived states
- `PageTemplate` - Template types (editorial, legal, landing)
- `SkillLevel` - Proficiency levels (beginner, intermediate, expert)

**`icons.ts`**:
- `IconProps` - Standard icon component props
- `IconRegistry` - Icon name to component mapping

### API Types (`api/strapi.ts`, `api/clickhouse.ts`, `api/responses.ts`)

**`api/strapi.ts`**:
- `StrapiResponse<T>` - Paginated API response wrapper
- `StrapiEntity` - Base entity with id, createdAt, updatedAt
- `StrapiMedia` - Media object with formats and metadata

**`api/clickhouse.ts`**:
- `ClickHouseEvent` - Base event structure
- `TelemetryRow` - Telemetry table schema
- `AnalyticsQuery` - Query builder types

**`api/responses.ts`**:
- `ApiSuccess<T>` - Successful response wrapper
- `ApiError` - Error response with code and message
- `PaginationMeta` - Pagination metadata

### Component Props (`components/props.ts`)

**Exports**:
- `ButtonProps` - Button component props
- `CardProps` - Card component props
- `ModalProps` - Modal component props
- `FormFieldProps` - Form field base props

### Data Models

**`data/content.ts`**:
- `Post` - Blog post entity
- `Project` - Portfolio project entity
- `Experience` - Work experience entity
- `Testimonial` - Client testimonial entity
- `Award` - Achievement entity
- `Education` - Education history entity
- `Skill` - Skill entity with proficiency
- `Page` - Static page entity

**`data/agentic.ts`**:
- `AgenticPhase` - Midgame (MG) or Endgame (EG)
- `TelemetryEvent` - Performance tracking event
- `SHADESAnalysis` - Sentiment, History, Alignment, Drive, Economics, Signal

**`data/ai.ts`**:
- `ModelConfig` - AI model configuration
- `EmbeddingVector` - Vector embedding with metadata
- `RAGContext` - Retrieval-augmented generation context

**`data/analytics.ts`**:
- `SessionData` - User session tracking
- `EventData` - Analytics event structure
- `PerformanceMetrics` - Web vitals and performance data

**`data/about.ts`**:
- `AboutData` - About page content structure
- `BioSection` - Biography section data

**`data/journey.ts`**:
- `JourneyNode` - Timeline node with metadata
- `SkillEvolution` - Skill progression over time

**`data/navigation.ts`**:
- `NavItem` - Navigation item structure
- `Breadcrumb` - Breadcrumb data

**`data/rich-text.ts`**:
- `BlocksContent` - Strapi Blocks format
- `MarkdownContent` - Raw markdown string

**`data/preloader.ts`**:
- `PreloaderState` - Loading state machine
- `ProgressData` - Progress tracking data

**`data/domain.ts`**:
- `DomainConfig` - Domain-specific configuration
- `ServiceEndpoint` - Service URL and metadata

**`data/visualizations.ts`**:
- `ChartData` - Generic chart data structure
- `D3Config` - D3 visualization configuration

---

## Architecture

This package is organized by **domain and purpose**:

```
src/
├── index.ts                    # Barrel export
├── animations.ts               # Animation-specific types
├── config.ts                   # Configuration types
├── enums.ts                    # Shared enums
├── icons.ts                    # Icon system types
├── api/
│   ├── strapi.ts               # Strapi CMS types
│   ├── clickhouse.ts           # ClickHouse analytics types
│   └── responses.ts            # API response wrappers
├── components/
│   └── props.ts                # React component props
└── data/
    ├── content.ts              # Content entity types
    ├── agentic.ts              # AI telemetry types
    ├── ai.ts                   # AI/ML types
    ├── analytics.ts            # Analytics types
    ├── about.ts                # About page types
    ├── journey.ts              # Journey page types
    ├── navigation.ts           # Navigation types
    ├── rich-text.ts            # Rich text types
    ├── preloader.ts            # Preloader types
    ├── domain.ts               # Domain types
    └── visualizations.ts       # Visualization types
```

**Design Principles**:
- **Type-First Development**: All interfaces defined before implementation
- **Zod Integration**: Compatible with runtime validation schemas
- **Strict Mode Ready**: All types compatible with TypeScript strict mode
- **Discriminated Unions**: Use type guards for type narrowing
- **Immutability**: Prefer `readonly` for data structures

---

## Meta-Framework Compatibility

✅ Next.js | ✅ Astro | ✅ Remix | ✅ Vite | ✅ Universal

Types work across all environments. Zod integration provides runtime validation for server-side rendering.

---

## Dependencies

**Internal**: None (foundation package)

**External**:
- Zod - Runtime validation (peer dependency)
- React - For component prop types (dev dependency)
- TypeScript (dev dependency)

---

## Related Packages

- [@aazucena/constants](../constants) - Constants that use these types
- [@aazucena/api](../api) - API clients that implement these interfaces
- [@aazucena/ui](../ui) - Components that use these prop types
- [@aazucena/analytics](../analytics) - Telemetry that uses agentic types

---

**Version**: 0.0.0
**Status**: Development
**Maintainer**: @aazucena
