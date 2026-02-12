# Agentic Tracking Guide

## SUMMARY

Comprehensive guide to AI performance profiling: Midgame (MG) and Endgame (EG) phase tracking, cost profiling, latency monitoring, SHADES analysis, and AZUCENA_LYTICS dashboard integration.

---

## 🎭 MG_EG_PHASES

### Conceptual Framework

**Midgame (MG)**: AI reasoning phase
- Problem analysis, context gathering, multi-step thinking
- Higher token consumption, longer latency
- Quality measured by reasoning depth and accuracy

**Endgame (EG)**: AI synthesis phase
- Final answer formulation, output generation, polish
- Lower token consumption, faster response
- Quality measured by coherence and completeness

---

### Basic Phase Tracking

```typescript
import { trackAgenticPhase } from '@aazucena/analytics';

// Track MG (Midgame) reasoning phase
const mgTracker = trackAgenticPhase({
  phase: 'midgame',
  taskId: 'research-semantic-search',
  model: 'claude-sonnet-4.5',
});

// ... AI reasoning happens ...
// Claude analyzes query, explores documentation, considers context

mgTracker.end({
  tokenCount: 2500,
  costUsd: 0.015,
  latency: 850,
  success: true,
});

// Track EG (Endgame) synthesis phase
const egTracker = trackAgenticPhase({
  phase: 'endgame',
  taskId: 'research-semantic-search',
  model: 'claude-sonnet-4.5',
});

// ... AI synthesis happens ...
// Claude generates final answer, formats output

egTracker.end({
  tokenCount: 1200,
  costUsd: 0.007,
  latency: 420,
  quality: 0.95,
});
```

---

### Multi-Step Tracking

```typescript
import { trackAgenticPhase } from '@aazucena/analytics';

async function handleComplexQuery(query: string) {
  // Step 1: MG - Query understanding
  const mg1 = trackAgenticPhase({
    phase: 'midgame',
    taskId: `query-${Date.now()}`,
    model: 'claude-sonnet-4.5',
    metadata: { step: 'understanding' },
  });

  const understanding = await analyzeQuery(query);
  mg1.end({ tokenCount: 800, costUsd: 0.005, latency: 300, success: true });

  // Step 2: MG - Context retrieval
  const mg2 = trackAgenticPhase({
    phase: 'midgame',
    taskId: `query-${Date.now()}`,
    model: 'claude-sonnet-4.5',
    metadata: { step: 'retrieval' },
  });

  const context = await retrieveContext(understanding);
  mg2.end({ tokenCount: 1500, costUsd: 0.009, latency: 500, success: true });

  // Step 3: EG - Answer generation
  const eg = trackAgenticPhase({
    phase: 'endgame',
    taskId: `query-${Date.now()}`,
    model: 'claude-sonnet-4.5',
    metadata: { step: 'generation' },
  });

  const answer = await generateAnswer(context);
  eg.end({ tokenCount: 1000, costUsd: 0.006, latency: 350, quality: 0.92 });

  return answer;
}
```

---

## 💰 COST_PROFILING

### Model Cost Tracking

```typescript
// Cost per 1M tokens (as of 2026-02-11)
const MODEL_COSTS = {
  'claude-opus-4.6': { input: 15.0, output: 75.0 },
  'claude-sonnet-4.5': { input: 3.0, output: 15.0 },
  'claude-haiku-4.5': { input: 0.25, output: 1.25 },
  'gpt-4-turbo': { input: 10.0, output: 30.0 },
  'gpt-4o': { input: 5.0, output: 15.0 },
  'gemini-2.0-flash': { input: 0.075, output: 0.30 },
};

function calculateCost(model: string, inputTokens: number, outputTokens: number): number {
  const costs = MODEL_COSTS[model];
  if (!costs) return 0;

  const inputCost = (inputTokens / 1_000_000) * costs.input;
  const outputCost = (outputTokens / 1_000_000) * costs.output;

  return inputCost + outputCost;
}

// Track with accurate cost
const tracker = trackAgenticPhase({
  phase: 'midgame',
  taskId: 'task-001',
  model: 'claude-sonnet-4.5',
});

// ... AI call ...
const response = await callClaude({ inputTokens: 2000, outputTokens: 500 });

tracker.end({
  tokenCount: 2500,
  costUsd: calculateCost('claude-sonnet-4.5', 2000, 500), // $0.0135
  latency: 850,
  success: true,
});
```

---

### Budget Monitoring

```typescript
import { trackAgenticPhase } from '@aazucena/analytics';

let totalCost = 0;
const DAILY_BUDGET = 10.0; // $10/day

function trackWithBudget(phase: 'midgame' | 'endgame', taskId: string, model: string) {
  if (totalCost >= DAILY_BUDGET) {
    console.warn('⚠️ Daily budget exceeded, using cached responses');
    return null; // Fallback to cache
  }

  const tracker = trackAgenticPhase({ phase, taskId, model });

  return {
    end: (metrics: { tokenCount: number; costUsd: number; latency: number }) => {
      totalCost += metrics.costUsd;

      if (totalCost > DAILY_BUDGET * 0.9) {
        console.warn(`⚠️ Budget warning: $${totalCost.toFixed(2)} / $${DAILY_BUDGET}`);
      }

      tracker.end(metrics);
    },
  };
}

// Usage
const tracker = trackWithBudget('midgame', 'task-001', 'claude-sonnet-4.5');
if (tracker) {
  // ... AI call ...
  tracker.end({ tokenCount: 2500, costUsd: 0.015, latency: 850 });
}
```

---

## ⏱️ LATENCY_MONITORING

### Percentile Analysis

```typescript
import { trackAgenticPhase } from '@aazucena/analytics';

// Collect latency samples
const latencySamples: number[] = [];

function trackLatency(phase: 'midgame' | 'endgame', taskId: string, model: string) {
  const startTime = Date.now();
  const tracker = trackAgenticPhase({ phase, taskId, model });

  return {
    end: (metrics: { tokenCount: number; costUsd: number; success: boolean }) => {
      const latency = Date.now() - startTime;
      latencySamples.push(latency);

      tracker.end({ ...metrics, latency });

      // Calculate percentiles
      const p50 = calculatePercentile(latencySamples, 50);
      const p95 = calculatePercentile(latencySamples, 95);
      const p99 = calculatePercentile(latencySamples, 99);

      console.log(`Latency - p50: ${p50}ms, p95: ${p95}ms, p99: ${p99}ms`);
    },
  };
}

function calculatePercentile(samples: number[], percentile: number): number {
  const sorted = [...samples].sort((a, b) => a - b);
  const index = Math.ceil((percentile / 100) * sorted.length) - 1;
  return sorted[index];
}
```

---

### SLA Compliance

```typescript
const SLA_THRESHOLDS = {
  midgame: { p95: 2000, p99: 5000 }, // MG: p95 < 2s, p99 < 5s
  endgame: { p95: 1000, p99: 2000 }, // EG: p95 < 1s, p99 < 2s
};

function checkSLA(phase: 'midgame' | 'endgame', latency: number, percentile: 'p95' | 'p99') {
  const threshold = SLA_THRESHOLDS[phase][percentile];

  if (latency > threshold) {
    trackEvent({
      category: 'sla',
      action: 'violation',
      label: `${phase}_${percentile}`,
      value: latency,
      metadata: {
        threshold,
        excess: latency - threshold,
      },
    });
  }
}
```

---

## 🎯 SHADES_ANALYSIS

### SHADES Framework

**S**entiment: User satisfaction (-1 to 1)
**H**istory: Interaction sequence
**A**lignment: Goal alignment score (0 to 1)
**D**rive: User intent classification
**E**conomics: Cost and efficiency metrics
**S**ignal: Confidence level

---

### Implementing SHADES

```typescript
import type { SHADESAnalysis } from '@aazucena/types';

interface SHADESMetrics {
  sentiment: number;
  history: string[];
  alignment: number;
  drive: 'research' | 'creative' | 'analytical' | 'social';
  economics: {
    costUsd: number;
    tokenCount: number;
    efficiency: number;
  };
  signal: 'high_confidence' | 'medium_confidence' | 'low_confidence';
}

function analyzeSHADES(
  userFeedback: string,
  interactionHistory: string[],
  taskMetrics: { tokenCount: number; costUsd: number; quality: number }
): SHADESMetrics {
  // Sentiment analysis (placeholder - use actual NLP)
  const sentiment = analyzeSentiment(userFeedback); // -1 to 1

  // History tracking
  const history = interactionHistory;

  // Alignment score based on task success
  const alignment = taskMetrics.quality;

  // Drive classification (placeholder - use actual classifier)
  const drive = classifyIntent(userFeedback);

  // Economics
  const efficiency = taskMetrics.quality / taskMetrics.costUsd;
  const economics = {
    costUsd: taskMetrics.costUsd,
    tokenCount: taskMetrics.tokenCount,
    efficiency,
  };

  // Signal confidence
  const signal = sentiment > 0.7 && alignment > 0.8 ? 'high_confidence' :
                 sentiment > 0.3 && alignment > 0.5 ? 'medium_confidence' :
                 'low_confidence';

  return { sentiment, history, alignment, drive, economics, signal };
}

// Track SHADES
const shades = analyzeSHADES(
  'This answer was very helpful!',
  ['query_1', 'query_2', 'query_3'],
  { tokenCount: 3500, costUsd: 0.021, quality: 0.92 }
);

trackEvent({
  category: 'shades',
  action: 'analysis',
  metadata: shades,
});
```

---

### SHADES Dashboard

```typescript
// Aggregate SHADES metrics for dashboard
interface SHADESDashboard {
  avgSentiment: number;
  avgAlignment: number;
  totalCost: number;
  avgEfficiency: number;
  driveDistribution: Record<string, number>;
  signalDistribution: Record<string, number>;
}

function calculateSHADESDashboard(analyses: SHADESMetrics[]): SHADESDashboard {
  const total = analyses.length;

  return {
    avgSentiment: analyses.reduce((sum, a) => sum + a.sentiment, 0) / total,
    avgAlignment: analyses.reduce((sum, a) => sum + a.alignment, 0) / total,
    totalCost: analyses.reduce((sum, a) => sum + a.economics.costUsd, 0),
    avgEfficiency: analyses.reduce((sum, a) => sum + a.economics.efficiency, 0) / total,
    driveDistribution: {
      research: analyses.filter((a) => a.drive === 'research').length / total,
      creative: analyses.filter((a) => a.drive === 'creative').length / total,
      analytical: analyses.filter((a) => a.drive === 'analytical').length / total,
      social: analyses.filter((a) => a.drive === 'social').length / total,
    },
    signalDistribution: {
      high: analyses.filter((a) => a.signal === 'high_confidence').length / total,
      medium: analyses.filter((a) => a.signal === 'medium_confidence').length / total,
      low: analyses.filter((a) => a.signal === 'low_confidence').length / total,
    },
  };
}
```

---

## 🗄️ CLICKHOUSE_INTEGRATION

### Schema Design

```sql
-- Agentic events table
CREATE TABLE agentic_events (
  id UUID DEFAULT generateUUIDv4(),
  timestamp DateTime64(3),
  phase Enum8('midgame' = 1, 'endgame' = 2),
  task_id String,
  model String,
  token_count UInt32,
  cost_usd Float64,
  latency UInt32,
  success UInt8,
  quality Nullable(Float64),
  metadata String,
  INDEX idx_timestamp timestamp TYPE minmax GRANULARITY 8192,
  INDEX idx_phase phase TYPE set(2) GRANULARITY 8192
) ENGINE = MergeTree()
ORDER BY (timestamp, phase)
PARTITION BY toYYYYMM(timestamp)
TTL timestamp + INTERVAL 90 DAY;

-- SHADES analysis table
CREATE TABLE shades_analysis (
  id UUID DEFAULT generateUUIDv4(),
  timestamp DateTime64(3),
  sentiment Float64,
  alignment Float64,
  drive Enum8('research' = 1, 'creative' = 2, 'analytical' = 3, 'social' = 4),
  cost_usd Float64,
  token_count UInt32,
  efficiency Float64,
  signal Enum8('high' = 1, 'medium' = 2, 'low' = 3),
  history Array(String),
  INDEX idx_timestamp timestamp TYPE minmax GRANULARITY 8192
) ENGINE = MergeTree()
ORDER BY timestamp
PARTITION BY toYYYYMM(timestamp)
TTL timestamp + INTERVAL 90 DAY;
```

---

### Querying ClickHouse

```typescript
import { query } from '@aazucena/api/clickhouse';

// Get MG/EG cost breakdown
const costBreakdown = await query(`
  SELECT
    phase,
    SUM(cost_usd) AS total_cost,
    AVG(cost_usd) AS avg_cost,
    COUNT(*) AS event_count
  FROM agentic_events
  WHERE timestamp >= now() - INTERVAL 7 DAY
  GROUP BY phase
  ORDER BY total_cost DESC
`);

// Get latency percentiles
const latencyPercentiles = await query(`
  SELECT
    phase,
    quantile(0.50)(latency) AS p50,
    quantile(0.95)(latency) AS p95,
    quantile(0.99)(latency) AS p99
  FROM agentic_events
  WHERE timestamp >= now() - INTERVAL 24 HOUR
  GROUP BY phase
`);

// Get SHADES sentiment over time
const sentimentTrend = await query(`
  SELECT
    toStartOfHour(timestamp) AS hour,
    AVG(sentiment) AS avg_sentiment,
    AVG(alignment) AS avg_alignment,
    AVG(efficiency) AS avg_efficiency
  FROM shades_analysis
  WHERE timestamp >= now() - INTERVAL 7 DAY
  GROUP BY hour
  ORDER BY hour ASC
`);
```

---

## 📊 AZUCENA_LYTICS_INTEGRATION

### Sending Events to Dashboard

```typescript
import { trackAgenticPhase } from '@aazucena/analytics';

// Events automatically flow to AZUCENA_LYTICS
const tracker = trackAgenticPhase({
  phase: 'midgame',
  taskId: 'research-001',
  model: 'claude-sonnet-4.5',
});

// ... AI processing ...

tracker.end({
  tokenCount: 2500,
  costUsd: 0.015,
  latency: 850,
  success: true,
});

// Event is batched and sent to /api/ingest
// ClickHouse ingests into agentic_events table
// AZUCENA_LYTICS dashboard queries ClickHouse for real-time display
```

---

### Real-Time Dashboard Metrics

```typescript
// WebSocket connection to AZUCENA_LYTICS
import io from 'socket.io-client';

const socket = io('https://analytics.example.com');

socket.on('agentic:update', (data) => {
  console.log('Real-time agentic metrics:', data);
  // {
  //   totalCost: 1.45,
  //   avgLatency: { mg: 950, eg: 420 },
  //   successRate: 0.98,
  //   modelDistribution: { 'claude-sonnet-4.5': 0.75, 'gpt-4o': 0.25 }
  // }
});

socket.on('shades:update', (data) => {
  console.log('Real-time SHADES metrics:', data);
  // {
  //   avgSentiment: 0.82,
  //   avgAlignment: 0.91,
  //   signalQuality: 'high'
  // }
});
```

---

## 🎯 BEST_PRACTICES

### 1. Always Track Both Phases

```typescript
// ✅ GOOD: Track MG and EG separately
const mg = trackAgenticPhase({ phase: 'midgame', taskId, model });
// ... reasoning ...
mg.end({ tokenCount: 2500, costUsd: 0.015, latency: 850, success: true });

const eg = trackAgenticPhase({ phase: 'endgame', taskId, model });
// ... synthesis ...
eg.end({ tokenCount: 1200, costUsd: 0.007, latency: 420, quality: 0.95 });

// ❌ BAD: Tracking only one phase
const tracker = trackAgenticPhase({ phase: 'midgame', taskId, model });
// ... both reasoning AND synthesis ...
tracker.end({ tokenCount: 3700, costUsd: 0.022, latency: 1270 });
// Loss of granularity - can't analyze phases separately
```

---

### 2. Use Consistent Task IDs

```typescript
// ✅ GOOD: Same task ID for related phases
const taskId = `research-${Date.now()}`;

const mg = trackAgenticPhase({ phase: 'midgame', taskId, model });
mg.end({ tokenCount: 2500, costUsd: 0.015, latency: 850, success: true });

const eg = trackAgenticPhase({ phase: 'endgame', taskId, model }); // Same taskId
eg.end({ tokenCount: 1200, costUsd: 0.007, latency: 420, quality: 0.95 });

// Can now query ClickHouse to see full task flow
```

---

### 3. Include Quality Metrics

```typescript
// ✅ GOOD: Track quality for EG phase
eg.end({
  tokenCount: 1200,
  costUsd: 0.007,
  latency: 420,
  quality: 0.95, // User satisfaction or output quality
});

// Allows optimization: cost vs quality trade-off
```

---

**AUTHOR:** aazucena_agentic_intelligence
