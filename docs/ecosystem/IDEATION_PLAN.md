# 📄 AAZUCENA // Engineering Intelligence Ideation Plan

This document provides the exhaustive technical and brand specifications for the future nodes of the **aazucena** ecosystem. Each node is designed to solve a specific, recurring problem for either the owner or the visitor, ensuring a high-utility, low-friction digital presence.

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

## 🚀 Node Specifications

### 1. 💼 AAZUCENA_SONA // `cv.aazucena.com`

**The Projection Node // Recruitment Velocity Tool**

- **Polyglot Challenge:** **Java (Spring Boot / Quarkus)** for the enterprise-grade dossier engine.
- **Core Utility:** Solves "Scanning Friction" for technical recruiters and CTOs.
- **Detailed Functionality:**
  - **Quantum Toggling:** Visitors select a professional lens (e.g., _Lead Architect_, _Creative Developer_, _System Engineer_). The site instantly re-ranks and filters the Strapi `api::experience` and `api::project` data to project the most relevant sub-identity.
  - **Dynamic Dossier Engine:** A headless PDF generation service (e.g., using Puppeteer/Playwright) that converts the active persona view into a branded, high-fidelity resume on the fly.
  - **Persona Persistence:** Syncs the chosen persona across the entire ecosystem using the `az_active_persona` key in `localStorage`.
- **Technical Implementation:**
  - **Stack:** Next.js 15 (App Router) + Framer Motion.
  - **Logic:** Dynamic sorting algorithm based on Strapi relations.
  - **Data Flow:** `Strapi` → `Transformer (Role-Based)` → `UI`.
- **Visual Persona:** Zero-latency, minimalist "High-Density" UI. White-label professional aesthetic with SHADES gradient accents.

---

### 2. 🗃️ AAZUCENA_LEDGE // `wiki.aazucena.com`

**The Memory Node // Public Engineering Wiki & Blueprint Repository**

- **Polyglot Challenge:** **C/C++** for the low-level knowledge graph indexer.
- **Core Utility:** Solves "Knowledge Decay." Codifies complex technical wins into permanent, reusable solutions.
- **Detailed Functionality:**
  - **Blueprint Foundry:** Every technical hurdle solved (e.g., _ClickHouse RBAC implementation_) is documented as an "Engineering Blueprint." These are highly structured specifications with copy-pasteable XMLs, Zod schemas, and verified code blocks.
  - **pgVector Semantic Search:** A natural-language search bar powered by the **Internal RAG**. Users type a problem, and the WIKI retrieves the exact solution chunk from the monorepo's documentation.
  - **Interconnectivity Graph:** A D3 force-directed graph showing how technologies are interconnected within the aazucena stack (e.g., _Astro_ → _ClickHouse_ → _D3_).
- **Technical Implementation:**
  - **Stack:** Astro (Static) + MDX + pgVector.
  - **Logic:** Automated indexing via the `Intel Engine` indexer.
  - **Data Flow:** `Markdown` → `pgVector` → `Retriever` → `Search UI`.
- **Visual Persona:** "Library of the Future." Dark-mode monospace markdown, hierarchical navigation, and technical diagrams.

---

### 3. 📡 AAZUCENA_DAR // `radar.aazucena.com`

**The Horizon Node // Development Pulse & Roadmap Proxy**

- **Polyglot Challenge:** **Go (Golang)** for the high-speed GitHub signal proxy.
- **Core Utility:** Solves "Static Portfolio Syndrome." Proves the project is a **living kernel**.
- **Detailed Functionality:**
  - **GitHub Signal Proxy:** A stylized SHADES interface for your GitHub Issues, PRs, and Discussions.
  - **Endorsement Voting:** Visitors can "Ping" specific features or bugs on the roadmap. These votes are visualized as a "Sentiment Heatmap" and synced back to GitHub as reactions.
  - **Physical Node Pulse:** Integrates your `AirportEvent` telemetry to show your current "Operational Region" (e.g., _Active in SFO_) alongside your latest commits.
- **Technical Implementation:**
  - **Stack:** Next.js + GitHub Octokit SDK.
  - **Logic:** Real-time polling of GitHub activity with ClickHouse event logging.
  - **Data Flow:** `GitHub API` → `Lytics Observer` → `Radar Dashboard`.
- **Visual Persona:** Industrial terminal style. Blinking "Pings," progress bars, and a scrolling vertical "Dev-Log" ticker.

---

### 4. 🎹 AAZUCENA_DIO // `studio.aazucena.com`

**The Frequency Node // Generative Audio Lab & Sonification Station**

- **Polyglot Challenge:** **Haskell** for the functional sound synthesis and pattern logic.
- **Core Utility:** Solves "Passive Listening." Turns your music background into an interactive technical showcase of sound engineering.
- **Detailed Functionality:**
  - **Interactive Strudel Sandbox:** A live-coding studio pre-loaded with your **TidalCycles** code patterns. Visitors can edit the music patterns in the browser to hear real-time sound changes.
  - **Lytics-Modulated Focus Radio:** A persistent ambient focus stream. The music's BPM, timbre, and glitch-density are modulated in real-time by the live signal pulses from `analytics.aazucena.com`.
  - **Oscilloscope Audit:** High-fidelity technical visualizations (via `wavesurfer.js`) providing frequency distribution and dynamic range data for every composition.
- **Technical Implementation:**
  - **Stack:** Strudel.cc + Web Audio API + wavesurfer.js.
  - **Logic:** Data-to-MIDI/Oscillator mapping using ClickHouse telemetry.
  - **Data Flow:** `Lytics Stream` → `Audio Mapping Engine` → `Generative Stream`.
- **Visual Persona:** "Cyber-Acoustic Studio." Glowing neon waveforms (Cyan/Coral), oscilloscopes, and integrated code editors.

---

### 5. 🎮 AAZUCENA_SIM // `play.aazucena.com`

**The Arena Node // Agentic Identity Mission**

- **Polyglot Challenge:** **C# (Unity/Godot)** for the physics-based mission world.
- **Core Utility:** Solves "Visitor Boredom." Demonstrates game-dev and AI orchestration skills via a 5-minute interactive mission.
- **Detailed Functionality:**
  - **Kernel Arena:** A physics-based world (built with **Phaser** or **Three.js**) representing the internal structure of your monorepo.
  - **Agent NPCs:** Your digital twin personas (**Architect, Librarian**) appear as companions. Users must interact with them via the RAG system to solve infrastructure puzzles representing past projects.
  - **Trajectory Playback:** User sessions are recorded as `ai_trajectory` events, allowing you to review recruiter "playthroughs" in the **Trajectory Labs** dashboard.
- **Technical Implementation:**
  - **Stack:** Phaser 3 / React Three Fiber + LangGraph.
  - **Logic:** State-based puzzle solving connected to the RAG knowledge base.
  - **Data Flow:** `Game State` → `LangGraph Request` → `RAG Context` → `Agent Action`.
- **Visual Persona:** Retro-future game world. High-contrast sprites, floating data voxels, and physics-based navigation.

---

### 6. 🔮 AAZUCENA_CLE // `cli.aazucena.com`

**The Brain Node // Intelligent Search & Interaction Terminal**

- **Polyglot Challenge:** **Rust** for the memory-safe, high-performance RAG terminal.
- **Core Utility:** Solves "Information Friction." The fastest possible way to get a specific answer without browsing.
- **Detailed Functionality:**
  - **CLI-First Command Bar:** A minimalist, single-purpose command line. Users type `query stack` or `query exp` to get immediate, synthesized answers from your knowledge base.
  - **Intelligent Synthesis:** The terminal reasons across your documentation to answer complex queries (e.g., _"How has Aldrin's database strategy evolved since 2024?"_).
  - **Curiosity Audit:** Logs search trends into ClickHouse, giving you data-driven insights into what technical topics visitors care about most.
- **Technical Implementation:**
  - **Stack:** Vercel AI SDK + LangGraph + Intel Engine.
  - **Logic:** Multi-turn conversational RAG with typewriter-style output.
  - **Data Flow:** `User Query` → `Librarian Agent` → `RAG Context` → `Synthesized Answer`.
- **Visual Persona:** Single-purpose terminal. Blinking cursor, terminal-green typewriter text, and zero distractions.

---

### 7. 🎓 AAZUCENA_SCHOLAR // `scholar.aazucena.com`

**The Wisdom Node // Academic Laboratory & Research Repository**

- **Polyglot Challenge:** **Python (Research Stack)** for the D3/Data Science analysis and experimental layers.
- **Core Utility:** Solves "Theory-Practice Gap." Bridges the distance between academic research (HCI/RecSys) and production-grade software engineering.
- **Detailed Functionality:**
  - **Experimental Layer (HCI):** A toggleable "Research Mode" on the main portfolio. Visitors can opt-in to user studies where high-fidelity telemetry (scroll velocity, focus-heatmaps, interaction pathing) is anonymized and streamed to **ClickHouse** to test hypotheses about 3D navigation and information density.
  - **Explainable RecSys Sandbox:** An interactive playground for **Recommender Systems**. Users can visualize how different algorithms (e.g., _Collaborative Filtering_ vs. _Content-Based RAG_) would re-rank the portfolio's projects. It includes a "Rationale" overlay explaining _why_ a specific project was recommended.
  - **Architectural Scaffolding (SE Education):** A pedagogical breakdown of the monorepo's 16 packages. It tracks a learner's "discovery path" through the code, identifying which design patterns (CVA, Zod, GSAP) they've interacted with and providing just-in-time "Contextual Lessons."
  - **Interactive Research Statement:** A dynamic version of the Statement of Purpose (SoP). Key research claims are hyperlinked directly to live code modules, telemetry datasets, or interactive visualizations in the portfolio, proving "Technical Feasibility" to admissions committees.
- **Technical Implementation:**
  - **Stack:** Astro (Static) + Next.js (Dynamic Lab) + ClickHouse + D3.js.
  - **Logic:** Hypothesis-driven A/B testing framework implemented via Vercel Middleware and Edge Config.
  - **Data Flow:** `User Interaction` → `Edge Telemetry` → `ClickHouse` → `D3 Data Analysis` → `Researcher Dashboard`.
- **Visual Persona:** "The Intentional Plain." Adopts the "Austerity of the Professor" aesthetic—high-density typography (LaTeX-inspired Serif), single-column layouts, and zero-distraction navigation. Signals "Information Over Decoration" to admissions committees.

- **Core Content Modules (Student Researcher Edition):**
  - **Research Interests:** Concise bullet points on HCI, RecSys, and SE Education.
  - **Education:** Degree progress, GPA, and specific "Relevant Coursework" highlights.
  - **Publications & Reports:** A repository of papers, preprints, and exhaustive technical reports.
  - **Selected Projects (Deep Dives):** The "Scientific Appendix" for your portfolio code—explaining methodology and data structures.
  - **Experience:** RA roles, internships, and industry experience with an academic lens.
  - **Honors & Awards:** Recognition of academic and technical excellence.
  - **Contact:** Formal academic identification (ORCID, LinkedIn, Institution Email).

- **🚀 Future Evolution (PhD+ Horizon):**
  - **Teaching & Pedagogy:** Evolution from "Instructional Design" to formal course materials and monorepo-as-a-curriculum.
  - **Student Mentorship:** Transition from "Collaborators" to managing a dedicated research lab and tracking student publications.
  - **Academic Service:** Peer review contributions, conference organization, and committee leadership.
  - **Openings:** Formal calls for Graduate Assistantships (GAs) and Post-Doc research opportunities.
  - **The Go-Powered Lab:** Implementation of the high-concurrency research engine (Go) for large-scale user studies and real-time HCI experimentation.

---

### 8. 💬 AAZUCENA_COMMS // `comms.aazucena.com`

**The Connection Node // Advanced Inquiry & Interaction Firewall**

- **Polyglot Challenge:** **PHP (Laravel 11)** for the high-velocity communication and notification engine.
- **Core Utility:** Solves "Communication Noise." Consolidates all ecosystem interactions into a single, intelligent stream.
- **Detailed Functionality:**
  - **Inquiry Firewall:** A robust backend that processes all form submissions (from `ai-forms.md`), performing secondary validation, PII scrubbing, and intelligent routing.
  - **Omnichannel Notifications:** Uses Laravel's notification system to sync alerts across Email, Discord, and the `AZUCENA_LYTICS` dashboard.
  - **Interaction Persistence:** Tracks every touchpoint a visitor has across the nodes (e.g., "Visitor A read the WIKI, then looked at SONA"), building a "Social Graph" for your People-Centric research.
- **Technical Implementation:**
  - **Stack:** PHP 8.3 + Laravel 11 + PostgreSQL + Redis.
  - **Logic:** Event-driven architecture using Laravel Jobs and Queues.
  - **Data Flow:** `Frontend Form` → `COMMS API` → `PII Scrubber` → `Lytics Event` → `Notification Dispatch`.
- **Visual Persona:** "Social Terminal." Minimalist card-based UI, activity feeds, and real-time interaction logs.

---

## 🏗️ Polyglot Orchestration Strategy

**The "Systems Benchmarking" Architecture**

To achieve the **Polyglot Challenge**, the ecosystem utilizes a **Containerized Microservices Architecture** orchestrated via Docker Compose and high-performance communication protocols. This setup transforms the portfolio into a live laboratory for comparing language performance, memory safety, and concurrency models.

### 1. The Communication Handshake (gRPC + Protobuf)

To ensure strict type safety across 8 different languages, the ecosystem uses **gRPC (Protocol Buffers)** for internal service-to-service communication.

- **Why:** Allows the Rust terminal (CLE) to talk to the Java dossier engine (SONA) with sub-millisecond overhead and shared schema definitions.
- **Research Signal:** Demonstrates mastery of high-performance distributed systems.

### 2. Language-Specific Integration Roles

| Node        | Language    | Runtime          | Primary Research / Technical Role                                                       |
| :---------- | :---------- | :--------------- | :-------------------------------------------------------------------------------------- |
| **SONA**    | **Java**    | Spring Boot      | **Enterprise Reliability:** High-concurrency PDF/Dossier generation via JasperReports.  |
| **LEDGE**   | **C/C++**   | WASM / Sidecar   | **Low-Level Precision:** Ultra-fast trie-based search/indexing for the knowledge graph. |
| **DAR**     | **Go**      | Gin / Goroutines | **Scalable Concurrency:** High-speed, non-blocking polling of GitHub & Pulse APIs.      |
| **DIO**     | **Haskell** | Servant          | **Functional Purity:** Deterministic MIDI/OSC signal generation for audio synthesis.    |
| **SIM**     | **C#**      | Unity WebGL      | **Interactive Physics:** Physics-based world-state management for the agentic mission.  |
| **CLE**     | **Rust**    | Axum / Tokio     | **Memory Safety:** Secure, high-speed RAG processing and vector math via `ndarray`.     |
| **SCHOLAR** | **Python**  | FastAPI          | **Data Science:** Optimized for NumPy/Pandas analysis of HCI research telemetry.        |
| **COMMS**   | **PHP**     | Laravel Octane   | **Interaction Speed:** High-velocity notification bus using RoadRunner/Swoole.          |

### 3. The Shared Data Kernel

All nodes share a unified data layer to prevent "Information Silos":

- **PostgreSQL + pgVector:** The "Source of Truth" for all long-term identity and research data.
- **ClickHouse (OLAP):** The "Telemetry Lake" where all polyglot performance metrics and user interactions are logged.
- **Redis:** Shared high-speed caching for cross-node session persistence.

### 4. Researcher Utility: The "Benchmarking" Layer

By running these 8 stacks side-by-side, the **AAZUCENA_SCHOLAR** node can generate real-time performance comparisons:

- **Energy Efficiency:** Measuring CPU cycles vs. memory footprint across languages for the same task.
- **Interaction Latency:** Comparing the TTFT (Time to First Token) of the Rust terminal vs. the Go proxy.
- **Safe vs. Unsafe Performance:** Benchmarking the C++ indexer against the Rust terminal to study real-world safety overhead.

---

**ALDRIN AZUCENA // ECOSYSTEM_SPEC_V1_2026**
