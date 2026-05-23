# 📄 AAZUCENA // Engineering Intelligence Ideation Plan

This document is the **governing specification** for the AAZUCENA ecosystem. It covers the Polished Core mandate, architectural strategy, and the build sequence with prerequisites. Individual node specs live in [`nodes/`](./nodes/).

---

## 🏛️ The "Polished Core" Mandate

**CRITICAL:** Implementation of any future node is strictly forbidden until the following **Core Stack** is verified as **100% Polished, Deployed, and Functional**:

1.  **Portfolio (`aazucena.com`):**
    - Phase 3 Performance (Lazy Loading) active and verified.
    - All 15 pages production-ready with zero placeholder content.
    - Full mobile responsiveness audit complete.
2.  **LYTICS (`analytics.aazucena.com`):**
    - Fully deployed on Railway with live RBAC and health badges.
    - ClickHouse Materialized Views populated and accelerating all dashboards.
    - Tiered Data Retention (TTL) active.
3.  **Strapi (`admin.aazucena.com`):**
    - 100% of the 20 content types populated with high-fidelity, production data.
    - Media library fully migrated to Cloudinary.
4.  **Intel Engine:**
    - 100% stable with the corrected JSON prompt templates.
    - Internal RAG 100% synchronized with the latest monorepo context.

---

## 🗂️ Node Directory

| Node        | Spec                             | Tier | Language           | Frontend         | Subdomain                |
| :---------- | :------------------------------- | :--- | :----------------- | :--------------- | :----------------------- |
| **LYTICS**  | _(live — no spec file)_          | Core | TypeScript         | Next.js          | `analytics.aazucena.com` |
| **SONA**    | [sona.md](./nodes/sona.md)       | 1    | Java (Spring Boot) | Remix            | `cv.aazucena.com`        |
| **LEDGE**   | [ledge.md](./nodes/ledge.md)     | 2    | C/C++ WASM         | Gatsby           | `wiki.aazucena.com`      |
| **DAR**     | [dar.md](./nodes/dar.md)         | 1    | Go                 | Next.js          | `radar.aazucena.com`     |
| **DIO**     | [dio.md](./nodes/dio.md)         | 4    | Haskell            | Vite + React SPA | `studio.aazucena.com`    |
| **SIM**     | [sim.md](./nodes/sim.md)         | 4    | C# / .NET          | Unity WebGL      | `play.aazucena.com`      |
| **CLE**     | [cle.md](./nodes/cle.md)         | 2    | Rust + Tauri       | React / Preact   | `cli.aazucena.com`       |
| **SCHOLAR** | [scholar.md](./nodes/scholar.md) | 4    | Python             | Astro + Remix    | `scholar.aazucena.com`   |
| **COMMS**   | [comms.md](./nodes/comms.md)     | 3    | PHP (Laravel)      | TanStack Start   | `comms.aazucena.com`     |
| **GAGE**    | [gage.md](./nodes/gage.md)       | 3    | Ruby on Rails      | Hotwire          | `gage.aazucena.com`      |
| **CAST**    | [cast.md](./nodes/cast.md)       | 3    | Elixir             | Phoenix LiveView | `cast.aazucena.com`      |
| **SCOPE**   | [scope.md](./nodes/scope.md)     | 2    | Gleam              | SolidJS          | `scope.aazucena.com`     |
| **INTRO**   | [intro.md](./nodes/intro.md)     | 1    | Crystal            | Qwik             | `intro.aazucena.com`     |

---

## 🏗️ Polyglot Orchestration Strategy

**The "Systems Benchmarking" Architecture**

The ecosystem utilizes a **Containerized Microservices Architecture** orchestrated via Docker Compose and high-performance communication protocols. This setup transforms the portfolio into a live laboratory for comparing language performance, memory safety, and concurrency models.

### 1. The Communication Handshake (gRPC + Protobuf)

To ensure strict type safety across 12 different languages, the ecosystem uses **gRPC (Protocol Buffers)** for internal service-to-service communication.

- **Why:** Allows the Rust terminal (CLE) to talk to the Java dossier engine (SONA) with sub-millisecond overhead and shared schema definitions.
- **Research Signal:** Demonstrates mastery of high-performance distributed systems.

### 2. Language-Specific Integration Roles

| Node        | Language      | Runtime                                                            | Primary Research / Technical Role                                                                                                                                                                |
| :---------- | :------------ | :----------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **SONA**    | **Java**      | Spring Boot                                                        | **Enterprise Reliability:** High-concurrency PDF/Dossier generation via JasperReports. Spring Boot over Quarkus — persistent service, cold-start irrelevant.                                     |
| **LEDGE**   | **C/C++**     | WASM / Sidecar                                                     | **Low-Level Precision:** Ultra-fast trie-based search/indexing for the knowledge graph.                                                                                                          |
| **DAR**     | **Go**        | Gin + goroutines + gorilla/websocket + go-github + GORM + go-redis | **Genuine Parallelism:** 5 goroutines poll GitHub endpoints concurrently; channel fan-in aggregates signals; WebSocket broadcasts live to Next.js. No client polling.                            |
| **DIO**     | **Haskell**   | Servant + Vite + React SPA                                         | **Functional Purity:** Deterministic MIDI/OSC signal generation. React SPA (no meta-framework) — full `@aazucena/ui` access, Web Audio runs on separate thread.                                  |
| **SIM**     | **C# / .NET** | Unity WebGL + ASP.NET Core + SignalR                               | **Full .NET Stack:** Unity WebGL (C# → WASM) for the game client; ASP.NET Core + SignalR for server-authoritative state, NPC bridge, and trajectory recording.                                   |
| **CLE**     | **Rust**      | Axum / Tokio + Tauri v2                                            | **Memory Safety + Dual Surface:** Web RAG via Axum (Railway); native desktop via Tauri v2 sidecar. Same Rust core, two distribution targets.                                                     |
| **SCHOLAR** | **Python**    | FastAPI                                                            | **Data Science:** Optimized for NumPy/Pandas analysis of HCI research telemetry.                                                                                                                 |
| **COMMS**   | **PHP**       | Laravel Octane                                                     | **Interaction Speed:** High-velocity notification bus using RoadRunner/Swoole.                                                                                                                   |
| **GAGE**    | **Ruby**      | Rails 8 + Puma + Kamal                                             | **Convention-Driven Tooling:** Rapid relational back-office — the one pattern none of the other nodes demonstrate. Private client pipeline.                                                      |
| **CAST**    | **Elixir**    | Phoenix + Fly.io (BEAM cluster)                                    | **Fault-Tolerant Concurrency:** OTP actor model — processes all the way down. Real-time community, AMA sessions, newsletter, live presence.                                                      |
| **SCOPE**   | **Gleam**     | Gleam 1.x + Phoenix.PubSub (BEAM cluster, shared with CAST)        | **Type-Safe BEAM:** Statically typed Erlang-target language. Pairs with CAST on same VM — shares OTP supervisors, subscribes to Phoenix.PubSub natively. Sentinel for all 12 nodes.              |
| **INTRO**   | **Crystal**   | Kemal (Crystal 1.x) + Railway                                      | **Compiled Ruby:** Same syntax family as GAGE (Ruby). Native binary via LLVM — <50ms startup, ~4MB memory. Qwik frontend for zero-hydration NFC/QR landing. SCHOLAR's Ruby vs Crystal benchmark. |

### 3. The Shared Data Kernel

All nodes share a unified data layer to prevent "Information Silos":

- **PostgreSQL + pgVector:** The "Source of Truth" for all long-term identity and research data.
- **ClickHouse (OLAP):** The "Telemetry Lake" where all polyglot performance metrics and user interactions are logged.
- **Redis:** Shared high-speed caching for cross-node session persistence.

### 4. Researcher Utility: The "Benchmarking" Layer

By running these 12 stacks side-by-side, the **AAZUCENA_SCHOLAR** node can generate real-time performance comparisons:

- **Energy Efficiency:** Measuring CPU cycles vs. memory footprint across languages for the same task.
- **Interaction Latency:** Comparing the TTFT (Time to First Token) of the Rust terminal vs. the Go proxy.
- **Safe vs. Unsafe Performance:** Benchmarking the C++ indexer against the Rust terminal to study real-world safety overhead.
- **Ruby vs. Crystal:** Same language family, different runtimes — GAGE (interpreted) vs. INTRO (compiled).
- **Concurrency models:** Go goroutines vs. Crystal Fibers vs. Elixir/Gleam BEAM processes — all three running in production.

---

## 🗺️ Build Sequence

The Polished Core Mandate gates everything. After all four core conditions are met, build nodes in tier order — prerequisites drive sequence, not complexity alone.

```
Polished Core ──► Tier 1 ──► Tier 2 ──► Tier 3 ──► Tier 4
```

---

### 🔒 Polished Core (Gate — nothing below starts until all 4 are ✅)

| Condition        | Requirement                                                                           |
| ---------------- | ------------------------------------------------------------------------------------- |
| **Portfolio**    | All 15 pages production-ready, Phase 3 performance active, full mobile audit complete |
| **LYTICS**       | Live on Railway, RBAC active, ClickHouse Materialized Views populated, TTL active     |
| **Strapi**       | All 20 content types populated with production data, Cloudinary migration complete    |
| **Intel Engine** | Stable RAG, corrected JSON prompt templates, monorepo context fully synchronized      |

---

### Tier 1 — Foundation Nodes

No ecosystem node dependencies. Each talks only to the Polished Core. Build in any order within this tier.

---

**INTRO** — [intro.md](./nodes/intro.md) | Crystal + Qwik

The smallest node in the ecosystem. Bounded scope, single job — build this first.

| Prerequisite   | Why                                                 |
| -------------- | --------------------------------------------------- |
| Portfolio live | INTRO links to it as the primary CTA                |
| LYTICS live    | Tap events and referrer source logged to ClickHouse |
| Strapi live    | Persona data drives the context-aware identity view |

---

**SONA** — [sona.md](./nodes/sona.md) | Java (Spring Boot) + Remix

Depends only on Strapi content — the experience and project content types are already in the Polished Core requirement.

| Prerequisite   | Why                                                                        |
| -------------- | -------------------------------------------------------------------------- |
| Strapi live    | `api::experience` and `api::project` content types feed the persona engine |
| Portfolio live | `az_active_persona` localStorage key synced across ecosystem               |

---

**DAR** — [dar.md](./nodes/dar.md) | Go + Next.js

Polls GitHub directly — no other nodes required. LYTICS is the only Polished Core dependency and it's already gated.

| Prerequisite        | Why                                                                 |
| ------------------- | ------------------------------------------------------------------- |
| LYTICS live         | AirportEvent telemetry feeds goroutine 5 (operational region pulse) |
| GitHub repos public | go-github polls Issues, PRs, Discussions, Commits                   |

---

### Tier 2 — Knowledge & Intelligence Nodes

Depend on Intel Engine (already a Polished Core condition) and benefit from Tier 1 nodes existing. SCOPE specifically needs live nodes to monitor — build it last within this tier.

---

**LEDGE** — [ledge.md](./nodes/ledge.md) | C/C++ WASM + Gatsby

Intel Engine is already a Polished Core gate. The documentation corpus can be seeded from the existing monorepo docs.

| Prerequisite         | Why                                                             |
| -------------------- | --------------------------------------------------------------- |
| Intel Engine live    | pgVector semantic search powers the RAG search bar              |
| Documentation corpus | MDX blueprints need content — seed from `docs/` in the monorepo |

---

**CLE** — [cle.md](./nodes/cle.md) | Rust + Tauri

Same Intel Engine dependency as LEDGE. The Axum backend needs Railway deployment; the Tauri desktop app is a separate release target.

| Prerequisite              | Why                                                 |
| ------------------------- | --------------------------------------------------- |
| Intel Engine live         | The entire RAG terminal depends on it               |
| pgVector corpus populated | Offline Tauri sidecar needs a local corpus to index |

---

**SCOPE** — [scope.md](./nodes/scope.md) | Gleam + SolidJS

Build last in Tier 2. A health monitor with nothing to monitor is incomplete — wait until Tier 1 nodes are live so SCOPE has real endpoints to poll from day one.

| Prerequisite      | Why                                                                                                                                                           |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| LYTICS live       | Feeds `system_integrity` events; SCOPE's primary data sink                                                                                                    |
| CAST live         | ⚠️ Soft — SCOPE functions without CAST but the PubSub bridge (incident broadcast to community) requires CAST. Wire this connection after CAST ships in Tier 3 |
| Tier 1 nodes live | Something to monitor beyond the Polished Core                                                                                                                 |

---

### Tier 3 — Communication & Community Nodes

Inter-node dependencies appear here. COMMS must come before GAGE — the lead qualification pipeline runs COMMS → GAGE. CAST can launch without COMMS but the notification bridge adds later.

---

**COMMS** — [comms.md](./nodes/comms.md) | PHP (Laravel) + TanStack Start

Build first within Tier 3. GAGE cannot complete its full pipeline without it.

| Prerequisite         | Why                                                                  |
| -------------------- | -------------------------------------------------------------------- |
| Polished Core        | COMMS is the inquiry entry point — needs the portfolio to route from |
| No node dependencies | COMMS is the start of the pipeline, not a consumer of other nodes    |

---

**GAGE** — [gage.md](./nodes/gage.md) | Ruby on Rails + Hotwire

Cannot run its full pipeline without COMMS. Can launch with direct client onboarding as a temporary measure — wire the COMMS handoff after.

| Prerequisite | Why                                                          |
| ------------ | ------------------------------------------------------------ |
| COMMS live   | Qualified leads enter GAGE after `ACCESS_GRANTED` from COMMS |
| LYTICS live  | Milestone payments feed `financial_ledger` ClickHouse table  |
| Strapi live  | Portfolio project data referenced in proposals and briefs    |

---

**CAST** — [cast.md](./nodes/cast.md) | Elixir + Phoenix LiveView

Needs SONA and Portfolio for "ask" link distribution. COMMS notification bridge is additive — launch without it, wire later.

| Prerequisite          | Why                                                                                           |
| --------------------- | --------------------------------------------------------------------------------------------- |
| Portfolio + SONA live | `cast.aazucena.com/ask` link distributed on every public surface                              |
| LYTICS live           | Subscriber analytics, event attendance, tutorial completions                                  |
| COMMS live            | ⚠️ Soft — cross-channel notifications (email, Discord) routed via COMMS. Additive post-launch |

---

### Tier 4 — Ambitious & Long-Horizon Nodes

Highest effort, highest reward. SCHOLAR is last because its benchmarking layer needs the full ecosystem to exist. DIO and SIM can be built in parallel with SCHOLAR — they have no dependencies on each other.

---

**SCHOLAR** — [scholar.md](./nodes/scholar.md) | Python + Astro + Remix

The static research pages (publications, SoP, education) can launch earlier as a standalone Astro site. The full benchmarking layer requires all other nodes to be live.

| Prerequisite         | Why                                                                       |
| -------------------- | ------------------------------------------------------------------------- |
| LYTICS live          | HCI telemetry, A/B test data, user interaction streams                    |
| Intel Engine live    | RecSys sandbox depends on pgVector retrieval                              |
| All other nodes live | Benchmarking layer compares performance across the full 12-node ecosystem |
| ⚠️ Phased launch     | Static research pages (Astro) can ship before `/lab/` — split the release |

---

**DIO** — [dio.md](./nodes/dio.md) | Haskell + Vite + React SPA

Haskell proficiency is the real prerequisite here — not a node dependency but a personal one. Block on Haskell readiness, not on other nodes.

| Prerequisite                 | Why                                                                                                                                                                   |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| LYTICS live                  | BPM, timbre, glitch-density modulation from live ClickHouse signals                                                                                                   |
| Portfolio music section live | Strudel patterns and compositions are the content source                                                                                                              |
| ⚠️ Haskell proficiency       | Servant is non-trivial. Attempting DIO without prior Haskell exposure is the highest risk action in the ecosystem. Spike Haskell separately before starting this node |

---

**SIM** — [sim.md](./nodes/sim.md) | C# / .NET + Unity WebGL

Depends on Intel Engine for NPC RAG. Unity development is a distinct skillset — plan for context-switching cost.

| Prerequisite      | Why                                                                                |
| ----------------- | ---------------------------------------------------------------------------------- |
| Intel Engine live | ASP.NET Core proxies RAG requests for NPC dialogue                                 |
| LYTICS live       | Trajectory events logged to `ai_trajectories` ClickHouse table                     |
| ⚠️ Unity setup    | IL2CPP → WASM build pipeline requires Unity license and build toolchain configured |

---

### Build Sequence Summary

```
Polished Core (all 4 ✅)
        │
        ▼
Tier 1 ── INTRO ── SONA ── DAR              (any order)
        │
        ▼
Tier 2 ── LEDGE ── CLE ── SCOPE             (SCOPE last — needs Tier 1 nodes live)
        │
        ▼
Tier 3 ── COMMS ── GAGE ── CAST             (COMMS before GAGE; CAST any point after SONA)
        │
        ▼
Tier 4 ── SCHOLAR ── DIO ── SIM             (SCHOLAR last for full benchmarking; DIO/SIM parallel)
```

**Estimated horizon:** Tier 1 after Polished Core. Each subsequent tier adds roughly one major build cycle. The full 13-node ecosystem is a multi-year effort — the sequence above ensures every node builds on a stable foundation rather than racing ahead of its dependencies.

---

**ALDRIN AZUCENA // ECOSYSTEM_SPEC_V1_2026**
