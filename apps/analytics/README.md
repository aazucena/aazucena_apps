# AZUCENA_LYTICS // Core_Terminal v1.0

A high-fidelity engineering intelligence terminal and telemetry dashboard for the Aldrin Azucena portfolio ecosystem. Built with **Next.js**, **D3.js**, and **ClickHouse**, this system provides real-time observability into user interactions, audio engagement, and infrastructure integrity.

## 🛰️ System Architecture

AZUCENA_LYTICS operates as an isolated analytics engine within the monorepo, keeping the public portfolio (Astro) lightweight while providing a deep-storage layer for trillions of event rows.

### The Data Pipeline
1.  **Ingestion:** The Portfolio/Apps send signals to `/api/ingest` via a secure signed header.
2.  **Storage:** ClickHouse (OLAP) stores immutable event logs with high compression.
3.  **Processing:** Next.js API routes run specialized SQL aggregations (Pivoting, Time-series).
4.  **Visualization:** D3.js renders low-level SVG paths for organic, high-performance charts.
5.  **State:** Redux Toolkit manages global filters and page-specific telemetry presets.

## 🛠️ Tech Stack

-   **Frontend:** Next.js 15 (App Router)
-   **Visualization:** D3.js (Custom Heatmaps & StreamGraphs)
-   **State Management:** Redux Toolkit + TanStack Query v5
-   **Database:** ClickHouse (Columnar OLAP)
-   **Icons:** @mynaui/icons-react
-   **Styling:** Tailwind CSS (Zinc/Cyberpunk design system)

## 🚀 Getting Started

### 1. Infrastructure Setup
Ensure the backing services are running via Docker:
```bash
cd apps/cms
docker compose up -d clickhouse
```

### 2. ClickHouse Schema
Execute the following command in the ClickHouse client (http://localhost:8123/play) to initialize the telemetry buffer:

```sql
CREATE TABLE IF NOT EXISTS analytics_events
(
    id UUID DEFAULT generateUUIDv4(),
    event String,
    url String,
    timestamp DateTime DEFAULT now(),
    session_id String,
    data String, -- JSON Metadata
    user_agent String,
    ip_address String,
    country String
)
ENGINE = MergeTree()
ORDER BY (event, timestamp);
```

### 3. Environment Variables
Create `apps/analytics/.env.local`:
```bash
# Connection
CLICKHOUSE_HOST=http://localhost:8123
CLICKHOUSE_DB=analytics
CLICKHOUSE_USER=admin
CLICKHOUSE_PASSWORD=your_password

# Security
INGESTION_SECRET_KEY=your_generated_key
PORT=8080
```

### 4. Development
```bash
pnpm dev --filter analytics
```
Terminal will be available at `http://localhost:8080`.

## 📡 API Reference

### `POST /api/ingest`
Ingests a new telemetry signal. Requires `x-secret-key` header.
```json
{
  "event": "Music Play",
  "sessionId": "sess_123",
  "url": "/music",
  "data": { "track": "Neon Lights", "volume": 80 }
}
```

### `GET /api/stats/summary`
Returns high-level KPIs for the `Node Overview`.

### `GET /api/stats/trends`
Returns time-series data for D3 visualizations.

## 🎨 Branding Guidelines

-   **Theme:** Strictly dark-first, Zinc-scale UI.
-   **Primary:** Cyan/Blue (#32A0C5) - Represents "Steady State" and healthy signals.
-   **Secondary:** Coral/Orange (#FF7B54) - Represents "Exceptions" and active interrupts.
-   **Voice:** Technical, precise, and industrial. Use uppercase for system labels (e.g., `CORE_OPERATIONAL`).

---
**ALDRIN AZUCENA // SYSTEMS_INTEGRITY_LAB**
