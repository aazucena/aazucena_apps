# 🧬 AAZUCENA // The Engineering Intelligence Ecosystem

This document outlines the utilitarian nodes in Aldrin Azucena's engineering ecosystem. Each node covers exactly 1 domain. Together they express the project's 4 guiding principles: **personal, intent, interactive, engineered**.

Each node covers a domain in Aldrin's actual work, picks the language that fits that domain, connects to the shared intelligence layer, and ships something a visitor can use or interact with.

---

## 🏛️ The Memorable Map

| Internal App Name      | Memorable Subdomain          | Brand Identity | Language      |
| :--------------------- | :--------------------------- | :------------- | :------------ |
| **`AAZUCENA_LYTICS`**  | **`analytics.aazucena.com`** | The Observer   | TypeScript    |
| **`AAZUCENA_SONA`**    | **`cv.aazucena.com`**        | The Projection | Java          |
| **`AAZUCENA_LEDGE`**   | **`wiki.aazucena.com`**      | The Memory     | C/C++ (WASM)  |
| **`AAZUCENA_DAR`**     | **`radar.aazucena.com`**     | The Horizon    | Go            |
| **`AAZUCENA_DIO`**     | **`studio.aazucena.com`**    | The Frequency  | Haskell       |
| **`AAZUCENA_SIM`**     | **`play.aazucena.com`**      | The Arena      | C# / .NET     |
| **`AAZUCENA_CLE`**     | **`cli.aazucena.com`**       | The Brain      | Rust + Tauri  |
| **`AAZUCENA_SCHOLAR`** | **`scholar.aazucena.com`**   | The Wisdom     | Python        |
| **`AAZUCENA_COMMS`**   | **`comms.aazucena.com`**     | The Connection | PHP (Laravel) |
| **`AAZUCENA_GAGE`**    | **`gage.aazucena.com`**      | The Workshop   | Ruby on Rails |
| **`AAZUCENA_CAST`**    | **`cast.aazucena.com`**      | The Broadcast  | Elixir        |
| **`AAZUCENA_SCOPE`**   | **`scope.aazucena.com`**     | The Sentinel   | Gleam         |
| **`AAZUCENA_INTRO`**   | **`intro.aazucena.com`**     | The Threshold  | Crystal       |

---

## 🧭 Why this design

Each node has 1 job. There's no feature overlap — `AAZUCENA_LYTICS` handles observability, so `AAZUCENA_SCOPE` doesn't touch it. Each domain belongs to exactly 1 node.

Each language was chosen for the domain it covers:

- **Java** for `SONA` — 20+ years of JVM tooling for document processing and ranking. Spring Boot handles the CV pipeline with minimal ceremony.
- **C/C++ WASM** for `LEDGE` — the wiki runs in the browser at near-native speed. Search, parsing, and rendering happen client-side without server round-trips.
- **Go** for `DAR` — the roadmap tracker handles concurrent signals from GitHub webhooks. Go's concurrency model fits this directly.
- **Haskell** for `DIO` — live-coding processes music as pure data transformations. Haskell's type system and functional purity fit the mathematical structure of sound.
- **C# / .NET** for `SIM` — game mechanics and agentic NPCs run on Unity's .NET runtime. C# is the native language of that environment.
- **Rust + Tauri** for `CLE` — the RAG terminal runs locally with memory-safe, near-zero latency. Tauri keeps it cross-platform without Electron's memory overhead.
- **Python** for `SCHOLAR` — HCI research and recommender systems have their best tooling in Python's scientific stack (NumPy, PyTorch, Hugging Face).
- **PHP / Laravel** for `COMMS` — Laravel's queue and WebSocket support handle private communications at low operational cost.
- **Ruby on Rails** for `GAGE` — rapid prototyping with convention-over-configuration. Rails gets tooling built and tested faster than most alternatives.
- **Elixir** for `CAST` — live broadcast needs fault tolerance and real-time concurrency. Phoenix LiveView and the BEAM VM handle thousands of concurrent listeners without manual thread management.
- **Gleam** for `SCOPE` — type-safe functional code on the BEAM with Elixir interop. Right fit for a sentinel node.
- **Crystal** for `INTRO` — Ruby-like ergonomics compiled to native binaries. Clean performance without runtime overhead.

All 13 nodes share 4 infrastructure pieces: the SHADES design system for visual consistency, `AAZUCENA_LYTICS` for telemetry, the pgVector RAG layer for knowledge retrieval, and the LangGraph Intel Engine for decision logic. A new node picks up all 4 immediately.

---

## 🏗️ Architectural Foundations

All nodes utilize the **SHADES** design system and the **Intelligence Infrastructure**:

- **Observation:** `AAZUCENA_LYTICS` (ClickHouse)
- **Knowledge:** `Internal RAG` (pgVector)
- **Logic:** `Intel Engine` (LangGraph)
- **Persistence:** `Strapi v5` (PostgreSQL)

---

**ALDRIN AZUCENA // CORE_SYSTEMS_2026**
