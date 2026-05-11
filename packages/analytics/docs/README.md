# Analytics Package Documentation

## 📚 DOCUMENTATION_INDEX

Complete reference for the aazucena Telemetry Intelligence System.

---

## Quick Start

- **[Telemetry Patterns](./telemetry-patterns.md)** - Event tracking, batching, offline queue, Web Vitals
- **[Agentic Tracking](./agentic-tracking.md)** - MG/EG phases, cost profiling, SHADES analysis

---

## Core Features

### Telemetry Emitter

Structured event collection with ClickHouse integration. Batched sends, offline queue, and automatic retries for reliable telemetry delivery.

### Agentic Phase Tracking

Midgame (MG) and Endgame (EG) performance profiling for AI reasoning and synthesis phases. Track token usage, API costs, latency, and quality metrics.

### Cost Profiling

Real-time tracking of AI API costs across models (Claude, GPT, Gemini). Token counting, cost estimation, and efficiency metrics for budget optimization.

### Latency Monitoring

Measure response times, identify bottlenecks, and track performance degradation. Percentile-based analysis (p50, p95, p99) for SLA compliance.

### Web Vitals Integration

Core Web Vitals tracking (CLS, FID, LCP, FCP, TTFB) with automatic reporting to AZUCENA_LYTICS. Real User Monitoring (RUM) for production performance insights.

### SHADES Analysis

Sentiment, History, Alignment, Drive, Economics, Signal analysis for AI interactions. Context-aware quality scoring and user satisfaction metrics.

---

## Documentation Topics

### [Telemetry Patterns](./telemetry-patterns.md) - Event_Intelligence

- Event tracking patterns (page views, interactions, errors)
- Batching strategies for network efficiency
- Offline event queue with persistence
- Web Vitals integration and thresholds
- React hooks for component tracking
- Privacy-first telemetry design

### [Agentic Tracking](./agentic-tracking.md) - AI_Intelligence

- Midgame (MG) reasoning phase profiling
- Endgame (EG) synthesis phase profiling
- Cost tracking across AI models
- Latency percentile analysis
- SHADES analysis framework
- ClickHouse schema design
- AZUCENA_LYTICS dashboard integration

---

## Architecture

### Component Layer

React components for automatic tracking: `TelemetryProvider`, `PageViewTracker`.

### Service Layer

Core telemetry service with configuration injection, batching, and retry logic.

### Schema Layer

Zod validation schemas for type-safe event ingestion: `ingest.ts`, `sentryWebhook.ts`, `vercelAnalyticsWebhook.ts`, `financialWebhooks.ts`.

### Integration Layer

ClickHouse sink, Sentry error tracking, Vercel Analytics, payment webhooks.

---

## Quick Links

- **Main Package**: [README.md](../README.md)
- **Source Code**: [src/](../src/)
- **Types**: [@aazucena/types](../../types/)
- **Stores**: [@aazucena/stores](../../stores/)
- **Visualizations**: [@aazucena/visualizations](../../visualizations/)

---

**LAST_UPDATED:** 2026-02-11
**MAINTAINER:** aazucena_intelligence_engine
