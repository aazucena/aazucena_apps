# Feature: Agentic Telemetry Standard (Phase-Based)

📍 **Related Documentation:** [AZUCENA_LYTICS Plan](./azucena-lytics-plan.md) | [Phase 4: DX Plan](../phase-4-developer-experience.md)

## 🎯 Objective
Establish a uniform standard for reporting agentic performance across the monorepo. This allows `AZUCENA_LYTICS` to track cost, latency, and efficiency per execution phase (**Midgame** vs. **Endgame**).

---

## 📊 Telemetry Schema

Every agentic inference must emit an event following this structure to ClickHouse:

### 1. Phase Definitions
Agents operate in two distinct logical phases:
- **`PHASE_MIDGAME` (MG):** Reasoning, tool use, search, and context retrieval.
- **`PHASE_ENDGAME` (EG):** Final synthesis, response formatting, and delivery.

### 2. Core Stats Object
```typescript
interface AgenticEvent {
  trace_id: string;        // UUID for correlation
  agent_name: string;      // e.g., "BRAIN_CORE", "INQUIRY_GATE"
  phase: "MG" | "EG";      // Midgame or Endgame
  
  token_stats: {
    input: number;
    output: number;
    cache_hit?: boolean;
  };
  
  call_stats: {
    latency_ms: number;
    provider: string;      // e.g., "Anthropic", "LocalOllama"
    model: string;         // e.g., "claude-3-5-sonnet"
  };
  
  success: boolean;
}
```

---

## 🛠️ Implementation Strategy

### Layer A: `intel-engine` (Python)
The FastAPI backend will calculate phase-specific metrics using LangSmith metadata and push them to the ingestion API.

### Layer B: `@aazucena/analytics` (TS Package)
This package will provide a `TelemetryEmitter` class to standardize the data before sending it to ClickHouse.

### Layer C: `AZUCENA_LYTICS` (Dashboard)
New "Phase Efficiency" widgets will render:
- **MG Cost vs. EG Cost**: Identify where the most tokens are being spent.
- **Reasoning Latency**: Average time spent in `PHASE_MIDGAME`.
- **Inference Density**: Tokens-per-second across both phases.

---

## ✅ Success Metrics
- **Cost Observability:** Real-time visibility into the exact cost of a "Neural Handshake."
- **Bottleneck Detection:** Data-driven proof of whether reasoning or synthesis is slowing down the agent.
- **Infrastructure Optimization:** Identifying opportunities for prompt-caching based on MG/EG hit rates.

---

**Last Updated:** 2026-02-05
**Status:** 📊 SPECIFICATION DEFINED (Phase 4 Week 2 Target)
