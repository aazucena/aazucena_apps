# AZUCENA_LYTICS // Core_Terminal v1.2

A high-fidelity engineering intelligence terminal and telemetry dashboard for the Aldrin Azucena portfolio ecosystem. Built with **Next.js**, **D3.js**, and **ClickHouse**, this system provides real-time observability into user interactions, audio engagement, and infrastructure integrity.

**Status: 100% Roadmap Complete (All 5 Phases Finished).**

AZUCENA_LYTICS operates as an isolated analytics engine within the monorepo, keeping the public portfolio (Astro) lightweight while providing a deep-storage layer for trillions of event logs.

### The Data Pipeline
1.  **Edge Ingestion:** Telemetry signals are processed via Vercel Edge Runtime for global low-latency. Geolocation is enriched instantly via native Vercel headers.
2.  **Storage:** ClickHouse (OLAP) stores immutable event logs with tiered TTL retention (14 days to 2 years).
3.  **Performance Layer:** Materialized Views pre-compute daily/hourly KPIs, reducing dashboard query time by ~90%.
4.  **Processing:** Next.js API routes run specialized SQL aggregations (Pivoting, Quantiles, Time-series).
5.  **Visualization:** D3.js renders low-level SVG paths for organic, high-performance charts and world maps.

## 🧠 Intelligence Subsystems

### AI Core Terminal
A model-agnostic command center for interacting with the portfolio's logic.
-   **Multi-Model Support:** Native integration with GPT-4o, Claude 3.5, and Gemini 1.5 via Vercel AI Gateway.
-   **Internal RAG:** Automated knowledge indexing of monorepo documentation (`docs/`, `ROADMAP.md`, `GEMINI.md`) into pgVector.
-   **Thought Traces:** Real-time visibility into the agent's internal state machine nodes.

### Predictive Sentinel
Automated health watchdog and anomaly detection.
-   **Threshold Alerts:** Real-time monitoring of AI costs, LCP latency, and exception velocity.
-   **Traffic Anomaly:** Flags sudden drops in signal pulses compared to 7-day rolling averages.
-   **Integrity Badges:** Embeddable dynamic components for public-facing system health.

### Journey Explorer (Identity Stitching)
Behavioral mapping of unique identities.
-   **Full Funnel Analysis:** Chronological timeline mapping every signal pulse from a single identity.
-   **Persona Inference:** Detection of behavioral archetypes (e.g., *MUSIC_ENTHUSIAST*, *AUDITOR*).
-   **Geospatial Map:** High-fidelity D3 world map for regional engagement density.

### Trajectory Labs
Visual playback of agent decision-making.
-   **Neural Mapping:** Dynamic D3 visualization of the LangGraph execution path.
-   **SHADES Highlighting:** Automatic detection and styling of `[KNOWLEDGE_SOURCE]` ground-truth data.

## 🛠️ Tech Stack

-   **Frontend:** Next.js 15 (App Router)
-   **Runtime:** Vercel Edge Runtime (Ingestion)
-   **AI Stack:** Vercel AI SDK + Vercel AI Gateway + LangGraph
-   **Visualization:** D3.js + TopoJSON (Choropleth Maps, Heatmaps, Neural Maps)
-   **State Management:** Redux Toolkit + TanStack Query v5
-   **Database:** ClickHouse (@clickhouse/client-web) + pgVector (PostgreSQL 16)
-   **Icons:** @mynaui/icons-react
-   **Styling:** Tailwind CSS 4 (Zinc/Cyberpunk design system)

## 🚀 Getting Started

### 1. Infrastructure Setup
Ensure the backing services are running via Docker:
```bash
cd apps/cms
docker compose up -d clickhouse postgres redis ollama intel-engine intel-bridge websocket
```

### 2. ClickHouse Schema & Performance
Execute the scripts in order to set up tables, MVs, and security:
```bash
# 1. Base Schema
docker exec -i aazucena-clickhouse clickhouse-client -u admin --password clickhouse --database analytics < apps/cms/services/clickhouse/scripts/01_init_analytics_schema.sql

# 2. Performance Layer (Materialized Views)
docker exec -i aazucena-clickhouse clickhouse-client -u admin --password clickhouse --database analytics < apps/cms/services/clickhouse/scripts/02_materialized_views.sql

# 3. RBAC Security Users
docker exec -i aazucena-clickhouse clickhouse-client -u admin --password clickhouse --database analytics < apps/cms/services/clickhouse/scripts/03_rbac_security.sql

# 4. Data Retention (TTL)
docker exec -i aazucena-clickhouse clickhouse-client -u admin --password clickhouse --database analytics < apps/cms/services/clickhouse/scripts/04_data_retention_ttl.sql
```

### 3. Backups
Manually trigger a snapshot or automate via crontab:
```bash
./apps/cms/services/clickhouse/backup.sh
```

## 📡 API Reference

### `POST /api/ingest` (Edge)
Ingests telemetry. Supports `telemetry_event`, `ai_event`, `ai_trajectory`, `music_playback`, and `system_integrity`. Requires `telemetry_ingest` RBAC permissions.

### `GET /api/stats/journeys`
Returns unique user identities or detailed event streams for a specific `sessionId`.

### `GET /api/health/public` (Edge)
A sanitized, unauthenticated view of system integrity for public health badges.

### `GET /api/stats/ai`
Returns financial and performance metrics for AI inferences from the `daily_ai_summary` view.

## 🎨 Branding Guidelines

-   **Theme:** Strictly dark-first, Zinc-scale UI.
-   **Primary:** Cyan/Blue (#32A0C5) - Represents "Steady State" and healthy signals.
-   **Secondary:** Coral/Orange (#FF7B54) - Represents "Exceptions" and active interrupts.
-   **Voice:** Technical, precise, and industrial. Use uppercase for system labels (e.g., `CORE_OPERATIONAL`).

---
**ALDRIN AZUCENA // SYSTEMS_INTEGRITY_LAB**