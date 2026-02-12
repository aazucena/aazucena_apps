# @aazucena/analytics

## Summary

Telemetry, tracking, and agentic performance monitoring system. Collects structured events, tracks MG/EG phases, profiles cost/latency, and provides Web Vitals integration for AZUCENA_LYTICS dashboards.

---

## Features

| Feature | Description |
|:--------|:------------|
| **Telemetry Emitter** | Structured event collection with ClickHouse integration |
| **Agentic Phase Tracking** | Midgame (MG) and Endgame (EG) performance profiling |
| **Cost Profiling** | Track AI API costs and token usage |
| **Latency Monitoring** | Measure response times and bottlenecks |
| **Web Vitals** | CLS, FID, LCP, FCP, TTFB tracking |
| **Zod Validation** | Runtime schema validation for events |
| **React Integration** | Hooks for tracking user interactions |

---

## Installation

```bash
# This package is part of the @aazucena monorepo
# Internal workspace dependency - no separate installation needed
```

---

## Usage

### Configuration

```typescript
import { setTelemetryConfig } from '@aazucena/analytics';

// Initialize telemetry (call once at app startup)
setTelemetryConfig({
  endpoint: '/api/ingest',
  enabled: process.env.NODE_ENV === 'production',
  batchSize: 10,
  flushInterval: 5000, // 5 seconds
});
```

### Basic Event Tracking

```typescript
import { trackEvent } from '@aazucena/analytics';

// Track a page view
trackEvent({
  category: 'navigation',
  action: 'page_view',
  label: '/projects',
  value: Date.now(),
});

// Track a button click
trackEvent({
  category: 'interaction',
  action: 'button_click',
  label: 'contact_form_submit',
});
```

### Agentic Phase Tracking

```typescript
import { trackAgenticPhase } from '@aazucena/analytics';

// Track Midgame (MG) reasoning phase
const mgTracker = trackAgenticPhase({
  phase: 'midgame',
  taskId: 'research-001',
  model: 'claude-sonnet-4.5',
});

// ... AI reasoning happens ...

mgTracker.end({
  tokenCount: 2500,
  costUsd: 0.015,
  latency: 850,
  success: true,
});

// Track Endgame (EG) synthesis phase
const egTracker = trackAgenticPhase({
  phase: 'endgame',
  taskId: 'research-001',
  model: 'claude-sonnet-4.5',
});

// ... AI synthesis happens ...

egTracker.end({
  tokenCount: 1200,
  costUsd: 0.007,
  latency: 420,
  quality: 0.95,
});
```

### Web Vitals Tracking

```typescript
import { trackWebVitals } from '@aazucena/analytics';

// Track all Web Vitals automatically
trackWebVitals((metric) => {
  console.log(`${metric.name}: ${metric.value}`);
  // Automatically sent to telemetry endpoint
});
```

### React Component Tracking

```typescript
import { useTracking } from '@aazucena/analytics';

export function ContactForm() {
  const { trackInteraction } = useTracking();

  const handleSubmit = (data) => {
    trackInteraction('form_submit', {
      formType: 'contact',
      fields: Object.keys(data),
    });

    // Submit form...
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

### Advanced: Custom Schemas

```typescript
import { createEventSchema } from '@aazucena/analytics';
import { z } from 'zod';

// Define custom event schema
const musicPlaybackSchema = createEventSchema({
  category: 'music',
  action: z.enum(['play', 'pause', 'skip']),
  metadata: z.object({
    trackId: z.string(),
    duration: z.number(),
    timestamp: z.number(),
  }),
});

// Track with validation
trackEvent(musicPlaybackSchema, {
  category: 'music',
  action: 'play',
  metadata: {
    trackId: 'track-123',
    duration: 180000,
    timestamp: Date.now(),
  },
});
```

---

## API Reference

### Configuration

#### `setTelemetryConfig(config)`
**Purpose**: Initialize telemetry system

**Parameters**:
- `endpoint: string` - Ingestion API endpoint
- `enabled: boolean` - Enable/disable tracking
- `batchSize?: number` - Events to batch before sending (default: 10)
- `flushInterval?: number` - Flush interval in ms (default: 5000)
- `debug?: boolean` - Enable debug logging

**Example**:
```typescript
setTelemetryConfig({
  endpoint: '/api/ingest',
  enabled: true,
  batchSize: 20,
  flushInterval: 10000,
  debug: false,
});
```

### Event Tracking

#### `trackEvent(event)`
**Purpose**: Track a telemetry event

**Parameters**:
- `category: string` - Event category (navigation, interaction, error)
- `action: string` - Event action (click, view, submit)
- `label?: string` - Event label
- `value?: number` - Numeric value
- `metadata?: Record<string, any>` - Additional data

**Returns**: `void`

#### `trackPageView(path, metadata?)`
**Purpose**: Track page navigation

**Parameters**:
- `path: string` - Page path
- `metadata?: Record<string, any>` - Additional data

**Example**:
```typescript
trackPageView('/projects', {
  referrer: document.referrer,
  loadTime: 1250,
});
```

### Agentic Tracking

#### `trackAgenticPhase(config)`
**Purpose**: Start tracking an agentic phase

**Parameters**:
- `phase: 'midgame' | 'endgame'` - AI phase
- `taskId: string` - Unique task identifier
- `model: string` - AI model name

**Returns**: Tracker object with `end(metrics)` method

**Example**:
```typescript
const tracker = trackAgenticPhase({
  phase: 'midgame',
  taskId: 'task-001',
  model: 'claude-sonnet-4.5',
});

// ... processing ...

tracker.end({
  tokenCount: 3000,
  costUsd: 0.018,
  latency: 950,
  success: true,
});
```

### Web Vitals

#### `trackWebVitals(callback?)`
**Purpose**: Track Core Web Vitals

**Parameters**:
- `callback?: (metric: Metric) => void` - Optional callback for each metric

**Metrics Tracked**:
- **CLS** (Cumulative Layout Shift)
- **FID** (First Input Delay)
- **LCP** (Largest Contentful Paint)
- **FCP** (First Contentful Paint)
- **TTFB** (Time to First Byte)

**Example**:
```typescript
trackWebVitals((metric) => {
  if (metric.value > metric.threshold) {
    console.warn(`${metric.name} exceeded threshold`);
  }
});
```

### React Hooks

#### `useTracking()`
**Purpose**: React hook for component-level tracking

**Returns**:
- `trackInteraction: (action: string, metadata?: object) => void`
- `trackError: (error: Error, metadata?: object) => void`
- `trackTiming: (label: string, duration: number) => void`

**Example**:
```typescript
const { trackInteraction, trackError, trackTiming } = useTracking();

trackInteraction('button_click', { buttonId: 'submit' });
trackError(new Error('Validation failed'), { field: 'email' });
trackTiming('api_request', 850);
```

### Schemas (Zod Validation)

#### `EventSchema`
**Base schema for all events**:
```typescript
{
  category: string;
  action: string;
  label?: string;
  value?: number;
  timestamp: number;
  sessionId: string;
  metadata?: Record<string, any>;
}
```

#### `AgenticEventSchema`
**Schema for agentic phase events**:
```typescript
{
  phase: 'midgame' | 'endgame';
  taskId: string;
  model: string;
  tokenCount: number;
  costUsd: number;
  latency: number;
  success: boolean;
  quality?: number;
}
```

---

## Architecture

This package is organized by **telemetry domain**:

```
src/
├── index.ts                    # Main export
├── components/
│   ├── TelemetryProvider.tsx   # React provider
│   └── TrackingPixel.tsx       # Client-side beacon
├── services/
│   ├── telemetry.ts            # Core telemetry service (uses setTelemetryConfig)
│   ├── agentic.ts              # Agentic phase tracking
│   └── webvitals.ts            # Web Vitals integration
└── schemas/
    ├── event.ts                # Event schemas (Zod)
    └── agentic.ts              # Agentic schemas (Zod)
```

**Design Principles**:
- **Privacy First**: No PII collection without consent
- **Batched Sends**: Reduce network overhead
- **Offline Support**: Queue events when offline
- **Type Safety**: Zod validation for all events
- **Framework Agnostic**: Works in any JavaScript environment

---

## Meta-Framework Compatibility

✅ Next.js | ✅ Astro | ✅ Remix | ✅ Vite | ✅ Universal

Core telemetry works everywhere. React hooks require React environment.

---

## Dependencies

**Internal**:
- @aazucena/constants - Telemetry constants
- @aazucena/types - Event type definitions

**External**:
- @reduxjs/toolkit - State management
- @tanstack/react-query - Data fetching
- @sentry/nextjs - Error tracking (optional)
- socket.io-client - Real-time events
- web-vitals - Web Vitals tracking
- Zod - Schema validation
- React (peer dependency)

---

## Related Packages

- [@aazucena/api](../api) - Sends telemetry to backend
- [@aazucena/stores](../stores) - Redux slices for analytics state
- [@aazucena/visualizations](../visualizations) - Charts for telemetry dashboards

---

**Version**: 0.0.0
**Status**: Development
**Maintainer**: @aazucena
