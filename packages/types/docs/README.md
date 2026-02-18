# Types Package Documentation

## 📚 DOCUMENTATION_INDEX

Complete reference for the aazucena Type Intelligence System.

---

## Quick Start

- **[Type Catalog](./type-catalog.md)** - Complete reference for all type definitions
- **[Type Patterns](./type-patterns.md)** - Discriminated unions, type guards, Zod integration

---

## Core Categories

### Core Types (animations.ts, config.ts, enums.ts, icons.ts)

Foundational types for animations (GSAP config, atmospheric layers), configuration (site settings, feature flags), shared enums (ContentStatus, PageTemplate), and icon system interfaces.

### API Contracts (api/strapi.ts, api/clickhouse.ts, api/responses.ts)

Standardized request/response types for Strapi CMS (paginated responses, media objects), ClickHouse analytics (telemetry events, query builders), and generic API wrappers (success/error responses).

### Component Props (components/props.ts)

Shared prop interfaces for React components. Button, Card, Modal, FormField base props with proper TypeScript variance.

### Data Models (data/\*)

Domain entities organized by category:

- **content.ts**: Blog posts, projects, experiences, testimonials, awards, education, skills, pages
- **agentic.ts**: AI telemetry types - AgenticPhase (MG/EG), TelemetryEvent, SHADESAnalysis
- **ai.ts**: ModelConfig, EmbeddingVector, RAGContext for AI/ML features
- **analytics.ts**: SessionData, EventData, PerformanceMetrics for web analytics
- **journey.ts**: JourneyNode, SkillEvolution for timeline visualizations
- **navigation.ts**: NavItem, Breadcrumb for navigation systems
- **rich-text.ts**: BlocksContent, MarkdownContent for CMS content rendering
- **preloader.ts**: PreloaderState, ProgressData for loading state machines

---

## Documentation Topics

### [Type Catalog](./type-catalog.md) - Complete_Reference

All type definitions with examples, categorized by domain and purpose.

### [Type Patterns](./type-patterns.md) - Advanced_Techniques

- Discriminated unions for type narrowing
- Type guards and predicates
- Zod runtime validation integration
- Generics and utility types
- Immutable patterns with readonly

---

## Quick Links

- **Main Package**: [README.md](../README.md)
- **Source Code**: [src/](../src/)
- **API Package**: [@aazucena/api](../../api/)
- **Utils Package**: [@aazucena/utils](../../utils/)

---

**LAST_UPDATED:** 2026-02-11
**MAINTAINER:** aazucena_intelligence_engine
