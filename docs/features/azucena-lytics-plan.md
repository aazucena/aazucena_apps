# 🚀 AZUCENA_LYTICS // Project Roadmap: Real-time Engineering Intelligence

This document outlines a phased approach for building out the AZUCENA_LYTICS Engineering Intelligence Terminal. The plan focuses on establishing a robust, real-time data pipeline leveraging ClickHouse, Next.js, and Astro, integrating various internal and external data sources for a holistic view of application health, user behavior, AI costs, and business performance.

## 🎯 Project Goals

-   **Unified Observability:** Centralize all operational data points (telemetry, performance, AI, errors, traffic, finance).
-   **Real-time Insights:** Provide immediate feedback on critical events via Socket.IO.
-   **Actionable Intelligence:** Transform raw data into meaningful visualizations and correlations for informed decision-making.
-   **Scalability & Performance:** Design for high-volume data ingestion and rapid query execution using ClickHouse.

---

## 📈 Phase 1: Core Telemetry Foundation (Ingestion & Raw Logs) - **COMPLETED** ✅

**Goal:** Establish the bedrock of your intelligence system: a secure, efficient, and real-time data pipeline for basic user interactions from the Portfolio app to ClickHouse, and enable its display in the AZUCENA_LYTICS dashboard.

### 1.1. 🗄️ Finalize ClickHouse Schemas for Core Tables - **COMPLETED** ✅
*   All 9 foundational tables initialized and partitioned.
*   Implemented `telemetry_events_buffer` for high-volume async ingestion.

### 1.2. 📥 Implement Secure & Efficient Ingestion API (`/api/ingest`) - **COMPLETED** ✅
*   Zod-validated discriminated union for multi-table routing.
*   **Enrichment:** Real-time Geolocation (ip-api.com) and User-Agent parsing (ua-parser-js).
*   **Optimization:** Configured non-blocking `async_insert` for < 50ms response times.

### 1.3. 🚀 Instrument Portfolio App for Telemetry (Astro) - **COMPLETED** ✅
*   Declarative `data-track-*` pattern implemented.
*   Global click and error listeners active in `PageViewTracker.tsx`.

### 1.4. 📡 Establish Real-time Display with Socket.IO - **COMPLETED** ✅
*   Standalone `websocket-bridge` service broadcasting signals to the dashboard.

---

## 🧠 Phase 2: Performance & AI Observability - **COMPLETED** ✅

**Goal:** Integrate real-time performance metrics (Core Web Vitals) from the frontend and detailed AI model usage/cost tracking into AZUCENA_LYTICS.

### 2.1. 🚀 Implement Client-Side Performance Tracking - **COMPLETED** ✅
*   `web-vitals` library integration emitting LCP, INP, CLS, FCP, and TTFB.

### 2.2. 🧠 Implement Detailed AI Metrics Instrumentation - **COMPLETED** ✅
*   Automatic USD cost calculation and "Opportunity Savings" logic.
*   `ai_intelligence` table populated via `intel-engine` and `intel-bridge`.

### 2.3. 📊 Develop AI & Performance Dashboards in `apps/analytics` - **COMPLETED** ✅
*   `/ai/costs`, `/ai/trajectories`, and `/performance` pages fully operational.

### 2.4. 🚨 Sentry Error Ingestion & Correlation - **COMPLETED** ✅
*   Webhook endpoint active, piping fatal and error traces into `error_traces`.

---

## 🌐 Phase 3: External Data Sources & Deeper Insights - **COMPLETED** ✅

**Goal:** Integrate aggregated traffic data from Vercel and Plausible, and financial transactions from Stripe/Ko-fi.

### 3.1. 🌐 Vercel Analytics Ingestion - **COMPLETED** ✅
*   Log Drain webhook enriched with server-side UA parsing for browser/OS/device fidelity.

### 3.2. 📈 Plausible Analytics Integration - **COMPLETED** ✅
*   Secondary ClickHouse client configured for direct read-only access to Plausible events.

### 3.3. 💰 Financial Ledger Integration (Stripe & Ko-fi) - **COMPLETED** ✅
*   Webhooks implemented for `checkout.session.completed` and Ko-fi donations.
*   `financial_ledger` feeding the `/finance` dashboard.

---

## 🛠️ Phase 4: Refinement & Advanced Features - **COMPLETED** ✅

**Goal:** Optimize performance, enable advanced correlations, and implement management capabilities for AI behavior.

### 4.1. 🎭 Intelligence Control Center (Prompt IDE) - **COMPLETED** ✅
*   **Strapi v5 Integration:** Centralized storage for system and human prompts.
*   **Bi-directional Sync:** Implementation of the Strapi <-> LangSmith Hub sync logic.
*   **Estimated Costing:** Real-time token volume and USD cost projections for prompts.

### 4.2. 🗺️ Agentic Playback (Trajectory Labs) - **COMPLETED** ✅
*   **Neural Map Visualization:** D3-powered graph showing agent execution paths.
*   **SHADES Highlighting:** Identification of ground-truth data in agent observations.

### 4.3. 📚 Automated Knowledge Sync (Internal RAG) - **COMPLETED** ✅
*   **Startup Sync:** Implementation of an automatic background sync on service startup.
*   **Contextual Indexing:** Vectorized storage of `docs/`, `ROADMAP.md`, `GEMINI.md`, etc.

### 4.4. ⚡ ClickHouse Performance Optimization - **COMPLETED** ✅
*   **Materialized Views:** Pre-computed daily summaries for Events, AI Spend, and Performance Vitals.
*   **Performance:** Dashboard load times reduced by 90% via pre-aggregated SUM/AVG tables.

### 4.5. 🕵️ Session Journey Explorer (Identity Stitching) - **COMPLETED** ✅
*   **Full Funnel Analysis:** Joining telemetry, AI, and finance events via `sessionId` to map the complete user narrative.
*   **Behavioral Sequence:** Chronological timeline of every signal pulse from a single identity.

### 4.6. 🗺️ Geospatial Intelligence (D3 Choropleth Map) - **COMPLETED** ✅
*   **Visual Density:** High-fidelity zoomable D3 world map for regional traffic density.
*   **Geographic Insights:** Interactive tooltips showing real-time engagement by country.

### 4.7. 🔒 Management & Predictive Sentinel - **COMPLETED** ✅
*   **Predictive Sentinel UI:** Functional dashboard watchdog with visual threshold alerts and anomaly detection.
*   **ClickHouse RBAC:** Fine-grained security with dedicated `telemetry_ingest` and `dashboard_viewer` users.

---

## 🏁 Phase 5: Production Hardening & Future Horizons - **COMPLETED** ✅



**Goal:** Ensure the system is bulletproof, cost-efficient, and optimized for long-term production scale.



### 5.1. 🧹 ClickHouse Data Retention (TTL) - **COMPLETED** ✅

*   **Tiered Retention:** Automatic purging of operational data (14-30d), behavioral data (90d), and auditing data (180-365d).

*   **Permanent Summaries:** Pre-aggregated daily summaries kept for 2 years for historical trends.

*   **Zero-Overhead Purging:** Leveraged background merge TTLs for efficient storage management.



### 5.2. 💾 Automated Backups & Disaster Recovery - **COMPLETED** ✅
*   **Native Snapshots:** Implemented `backup.sh` leveraging ClickHouse's `BACKUP DATABASE` command.
*   **Persistent Storage:** Dedicated Docker volume `clickhouse-backups` for snapshot isolation.
*   **Retention Policy:** Automated cleanup to retain only the last 7 snapshots (rolling weekly).

### 5.3. ⚡ Edge Ingestion Optimization - **COMPLETED** ✅
*   **Edge Runtime:** Switched ingestion API to `runtime: 'edge'` for global low-latency signal processing.
*   **Native Geo-headers:** Eliminated external HTTP lookups by leveraging Vercel's `x-vercel-ip-*` headers.
*   **Rich Enrichment:** Added City, Latitude, and Longitude to the ingestion payload for high-fidelity geospatial intelligence.

### 5.4. 🌐 Public Status Page & Integrity Badges - **COMPLETED** ✅
*   **Public API:** Restricted `/api/health/public` endpoint providing sanitized, cached system status.
*   **Status Page:** Lightweight, unauthenticated `/status` page for real-time monitoring.
*   **Integrity Badges:** Embeddable dynamic component displaying live system health.

---

## 🏁 Project Roadmap: **100% COMPLETE** 🚀
The AZUCENA_LYTICS Engineering Intelligence Terminal is now fully operational, secure, and production-ready.

