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

- **Polyglot Challenge:** **Java (Spring Boot)** for the enterprise-grade dossier engine.
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

- **Polyglot Challenge:** **Rust** for the memory-safe, high-performance RAG terminal — delivered across two surfaces via **Tauri v2** (desktop) and **Axum + Tokio** (web).
- **Core Utility:** Solves "Information Friction." The fastest possible way to get a specific answer without browsing — available whether you're at `cli.aazucena.com` in a browser or running the native desktop app.
- **Detailed Functionality:**
  - **CLI-First Command Bar:** A minimalist, single-purpose command line. Users type `query stack` or `query exp` to get immediate, synthesized answers from your knowledge base.
  - **Intelligent Synthesis:** The terminal reasons across your documentation to answer complex queries (e.g., _"How has Aldrin's database strategy evolved since 2024?"_).
  - **Curiosity Audit:** Logs search trends into ClickHouse, giving you data-driven insights into what technical topics visitors care about most.
- **Dual-Surface Architecture:**
  - **Web (`cli.aazucena.com`):** React frontend + Axum (Rust) backend deployed on Railway. Multi-turn conversational RAG with typewriter-style output. Full visitor access.
  - **Desktop (Tauri v2 app):** Same React frontend wrapped in a native Tauri shell. Rust sidecar handles offline RAG — indexes local files, queries without a network hop. macOS / Windows / Linux. ~3–4MB binary (vs. ~120MB Electron equivalent).
  - **Shared core:** One Rust RAG engine. Web surface calls it via HTTP; desktop surface bundles it as a Tauri sidecar. No logic duplication.
- **What Tauri unlocks over the web surface:**

  | Capability                        | Web  | Desktop (Tauri) |
  | --------------------------------- | ---- | --------------- |
  | Offline RAG (local corpus)        | ❌   | ✅              |
  | OS keychain auth                  | ❌   | ✅              |
  | System tray persistent access     | ❌   | ✅              |
  | Local file indexing               | ❌   | ✅              |
  | Native menus + keyboard shortcuts | ❌   | ✅              |
  | Bundle size                       | ~web | ~3–4 MB         |

- **SCHOLAR Research Angle:** Tauri vs. web terminal is a measurable HCI experiment — same RAG interface, different runtime. SCHOLAR can run user studies comparing task completion time, perceived latency, and trust between the two surfaces. Binary size, memory footprint, and TTFT benchmarks feed the polyglot benchmarking layer.
- **Technical Implementation:**
  - **Stack:** Tauri v2 + Rust (Axum + Tokio) + React frontend + LangGraph + Intel Engine.
  - **Logic:** Multi-turn conversational RAG with typewriter-style output. Tauri sidecar for offline mode; Railway-hosted Axum for web mode.
  - **Data Flow (web):** `User Query` → `Axum API (Railway)` → `Librarian Agent` → `RAG Context` → `Synthesized Answer`.
  - **Data Flow (desktop):** `User Query` → `Tauri Sidecar (local Rust)` → `Librarian Agent` → `Local pgVector / Cached Corpus` → `Synthesized Answer`.
- **Visual Persona:** Single-purpose terminal. Blinking cursor, terminal-green typewriter text, and zero distractions. Identical across web and desktop — Tauri renders the same React UI.

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

### 9. 🔨 AAZUCENA_FORGE // `forge.aazucena.com`

**The Workshop Node // Private Client Engagement & Project Pipeline**

- **Polyglot Challenge:** **Ruby on Rails 8** for convention-driven relational back-office tooling — the one architectural pattern none of the other 8 nodes demonstrate.
- **Core Utility:** Solves "Engagement Gap." The portfolio handles the public story; the Inquiry Firewall qualifies leads; FORGE handles everything after `ACCESS_GRANTED` — briefs, proposals, contracts, milestones, invoicing, and delivery.
- **Visibility:** Private. Clients receive a direct login link. `forge.aazucena.com` is not publicly listed.
- **Detailed Functionality:**
  - **Project Pipeline:** Five-stage board — Brief → Proposal → Contract → Active → Delivered. Each stage has defined entry/exit conditions. Aldrin manages the full pipeline; clients see only their own project workspace.
  - **Brief Builder:** Structured intake form replacing open-text contact forms. Requirements, tech stack, timeline, budget, and reference links. Both parties sign off before work begins.
  - **Client Workspace:** Isolated per client. Project status, milestone timeline, threaded messages per milestone (ActionCable — real-time), file delivery (Cloudinary-backed), and sign-off requests.
  - **Proposal & Contract Generator:** Prawn (PDF gem) generates branded proposals and contracts from brief data. Client signs digitally. Signed contract triggers the first invoice milestone.
  - **Milestone Invoicing:** Stripe-backed payment tied to deliverables — milestone accepted → invoice sent → paid → next milestone unlocks. Full ledger feeds LYTICS's `financial_ledger` table.
  - **Private Admin View:** Aldrin's dashboard — full pipeline overview, revenue by project, time tracking, overdue alerts. Rin surfaces anomalies: _"Client A has been in the Brief stage for 9 days without a response."_
- **Why Rails Specifically:**

  | Rails capability               | What it does in FORGE                                                               |
  | ------------------------------ | ----------------------------------------------------------------------------------- |
  | **ActiveRecord**               | Clean relational model: `Client → Project → Milestone → Invoice → Payment`          |
  | **ActionCable**                | Real-time milestone updates in client workspace — no polling                        |
  | **Hotwire (Turbo + Stimulus)** | Full interactivity without a React SPA — the right tool for a private back-office   |
  | **Devise + Pundit**            | Auth (client login) + role-based access (Aldrin sees all; client sees own) in hours |
  | **ActiveJob + ActionMailer**   | Milestone notifications, invoice reminders, overdue escalations                     |
  | **ActiveStorage**              | File attachments on milestones — deliverables, design assets, documents             |
  | **Kamal**                      | Modern Docker deployment — container-native, fits Railway infrastructure            |
  | **Multi-tenancy**              | Row-level isolation via `scope: current_client` — clients never cross-contaminate   |

- **Connection to the Existing Ecosystem:**
  - `COMMS` → qualified leads enter FORGE pipeline after `ACCESS_GRANTED`
  - `LYTICS financial_ledger` ← milestone payments feed ClickHouse in real-time
  - `LYTICS telemetry` ← milestone events logged as named telemetry signals
  - `COMMS notification bus` ← FORGE triggers cross-channel alerts (email, Discord, LYTICS)
  - `SONA persona lens` → proposal template selected by client's active `az_active_persona`
  - `Strapi projects` → portfolio project data referenced in proposals and briefs
  - `Rin OS` → Rin surfaces overdue milestones and today's revenue on the home screen
- **Technical Implementation:**
  - **Stack:** Ruby 3.x + Rails 8 + PostgreSQL + Redis + ActionCable + Hotwire + Stripe + Prawn.
  - **Logic:** Convention-driven CRUD with event-driven milestone transitions. ActiveJob handles async invoice delivery and Stripe webhooks.
  - **Data Flow:** `Brief Form` → `Rails Pipeline` → `Milestone Trigger` → `Stripe Invoice` → `LYTICS financial_ledger`.
- **Visual Persona:** Clean, minimal, professional. No SHADES gradients — this is a workspace, not a showcase. High information density, calm typography, Linear-meets-Basecamp aesthetic. The one node that deliberately does not look like the rest of the ecosystem.

---

### 10. 🏛️ AAZUCENA_AGORA // `agora.aazucena.com`

**The Agora Node // Creator Community Hub & Anonymous Q&A Platform**

- **Polyglot Challenge:** **Elixir 1.17 + Phoenix 1.7** for fault-tolerant real-time community infrastructure — the one concurrency model none of the other 9 nodes demonstrate.
- **Core Utility:** Solves "Audience Distance." Every other node requires Aldrin to produce content. AGORA generates content from the audience — anonymous questions become public answers, public answers become newsletter issues, newsletter issues drive more subscribers who ask more questions. A self-sustaining content flywheel.
- **Inspiration:** Marshmallow (marshmallow.app) — anonymous Q&A where the audience generates the questions and the creator curates what becomes public. Extended into a full creator hub with events, learning, and broadcast.
- **Visibility:** Public. The community-facing node — the town square of the ecosystem.

---

#### The Five Pillars

**Pillar 1 — Anonymous Q&A Inbox (The Marshmallow Layer)**

The core feature. The audience generates the content.

- **Shareable ask link:** `agora.aazucena.com/ask` — one URL distributed across portfolio, SONA, and social profiles
- **Anonymous by default:** Zero friction — no account required to submit a question
- **Private inbox:** All questions land in Aldrin's curated inbox — nothing is auto-published. Full control over what becomes public
- **Community upvoting:** Unanswered questions can be upvoted to signal priority — the most-wanted answers surface naturally
- **Live AMA sessions:** Scheduled "Ask Me Anything" windows where questions stream in real-time via Phoenix Channels. Aldrin answers live; the feed updates for attendees without page refresh. Pre-talk Q&A collection for conference sessions — audience submits before the event, best questions answered on stage
- **Public answer archive:** Every published answer is permanent, searchable, and shareable. Each becomes a content piece with its own URL

**The Content Flywheel:**

```
Audience submits anonymous questions
         ↓
Aldrin curates + answers the best ones publicly
         ↓
    ┌────┴────────────────────┐
    ↓                         ↓
Newsletter digest         LEDGE Blueprint
(auto-compiled weekly)    (if technical answer)
    ↓                         ↓
More subscribers          SCHOLAR signal
ask more questions        (what topics resonate)
    ↓
repeat
```

---

**Pillar 2 — Newsletter (The Broadcast)**

- **Subscriber segmentation:** Audience segments map to the 4 Persona Selection personas — developer questions go to technical subscribers, career questions to recruiter subscribers, music/creative content to creative subscribers
- **Auto-digest:** Weekly newsletter compiled automatically from the top answered Q&As — content without additional writing effort
- **Custom issues:** MDX composer with code blocks, embeds, and SHADES-styled components for hand-crafted issues
- **Delivery:** Oban background jobs queue delivery via Resend. Exponential backoff on failures
- **Paid tier:** Stripe-backed member tier — premium Q&A sessions, early access to learning content, ad-free experience
- **Analytics:** Open rates, click events, and unsubscribes piped back to LYTICS `telemetry_events`

---

**Pillar 3 — Community & Presence (The Live Layer)**

- **Phoenix.Presence:** Distributed real-time tracking of who's reading what — subtle live indicator on answers and posts (_"11 people reading this now"_). No polling — OTP processes own the presence state
- **Reactions:** Emoji reactions on public answers — lightweight social proof without full comment threads
- **Topic subscriptions:** Members follow specific topics (AI, TypeScript, audio, career) and receive targeted broadcasts — not a firehose
- **Not a Discord replacement:** Focused, topical, curated. The signal-to-noise ratio is the product

---

**Pillar 4 — Events & Speaking (The Stage)**

- **Talk archive:** Conference recordings, slide decks, timestamps, and key quotes. Each talk has its own Q&A thread — audience asks follow-up questions post-talk
- **Event calendar:** Upcoming conferences, workshops, and live sessions with one-click notification subscription
- **Live session hosting:** Phoenix Channels — real-time attendee counter, live Q&A feed, Rin narrates milestones (_"100 people in the room"_)
- **Speaking inquiry route:** Interest form on event pages feeds directly into the FORGE pipeline — qualified inquiries become project briefs

---

**Pillar 5 — Open Learning (The Workshop Floor)**

- **Tutorial series:** Short, practical content — not academic (that's SCHOLAR), not documentation (that's LEDGE). Actionable skills with clear outcomes
- **Interactive code examples:** Phoenix LiveView renders interactive exercises server-side — zero JS bundle overhead for the learner
- **Progress tracking:** Completion events logged to LYTICS. Members see their progress; Aldrin sees aggregate learning patterns
- **Free vs. member tier:** Public previews; full content for newsletter subscribers
- **SCHOLAR pipeline:** Research findings in SCHOLAR surface here as public-facing learning content — the academic-to-practical bridge

---

#### Why Elixir + Phoenix

The Marshmallow layer makes the real-time requirements heavier, not lighter. Four of Phoenix's standard primitives map directly to AGORA's core needs:

| Phoenix primitive    | AGORA use                                                                   |
| -------------------- | --------------------------------------------------------------------------- |
| **Phoenix.Presence** | Distributed real-time reader tracking — no polling, OTP-managed             |
| **Phoenix Channels** | Live AMA sessions — question stream + attendee feed                         |
| **Phoenix PubSub**   | Live upvote counts on unanswered questions without page refresh             |
| **Phoenix LiveView** | Interactive learning exercises — server-rendered reactivity, zero JS bundle |
| **Oban**             | Newsletter digest compilation + scheduled delivery queue                    |
| **Ecto**             | Subscriber management, Q&A inbox, answer archive                            |

**OTP "let it crash" for AMAs:** During a live session, if one attendee's WebSocket process crashes, it restarts in isolation. The session never goes down. Node.js or Python would need explicit error handling for every edge case; Elixir supervisors handle it structurally.

**Concurrency model contrast** (SCHOLAR benchmark material):

```
COMMS (PHP/Laravel)    →  queues and jobs — async deferral
FORGE (Ruby/Rails)     →  convention-driven request/response + ActionCable
AGORA (Elixir/Phoenix) →  processes all the way down — concurrency is the default
```

Three languages, three answers to "how do you build for many concurrent users doing different things simultaneously."

---

#### Connection to the Existing Ecosystem

```
Portfolio + SONA      →  "ask" link distributed on every public surface
LYTICS                ←  subscriber opens, event attendance, tutorial completions as telemetry
LYTICS financial_ledger ← Stripe member subscriptions feed ClickHouse
COMMS                 ←  AGORA events trigger cross-channel notifications (email, Discord)
SCHOLAR               →  research findings become AGORA learning content
SCHOLAR               ←  Q&A topic trends feed HCI research signal
FORGE                 ←  speaking inquiries from event pages enter the FORGE pipeline
LEDGE                 ←  technical answers auto-suggest becoming Engineering Blueprints
DIO                   ←  music compositions embedded in newsletter issues
DAR                   ←  roadmap updates broadcast to AGORA subscribers
Rin OS                →  Rin surfaces "47 new questions this week" on the home screen
```

---

#### Technical Implementation

- **Stack:** Elixir 1.17 + Phoenix 1.7 + Phoenix LiveView + Phoenix.Presence + Oban + Ecto + PostgreSQL + Redis
- **Auth:** Phx.Gen.Auth (built-in Phoenix auth generator) for member accounts; anonymous question submission requires no auth
- **Deployment:** Fly.io (Elixir-native, multi-region BEAM clustering) or Railway
- **Data Flow (Q&A):** `Anonymous submission` → `Elixir GenServer inbox` → `Aldrin curates` → `Published answer` → `PubSub broadcast` → `Oban digest queue`
- **Data Flow (Live AMA):** `Phoenix Channel join` → `Presence tracked` → `Question broadcast` → `Answer pushed to all subscribers` → `LYTICS event logged`
- **Data Flow (Newsletter):** `Oban scheduler` → `Top answered Q&As compiled` → `Segmented by persona` → `Resend delivery` → `Open/click events → LYTICS`

---

#### Visual Persona

Warm, editorial, open. The one node that feels like a **home**, not a dashboard or terminal. Readable serif typography for Q&A content, clean sans-serif for UI chrome. Subtle presence indicators — ambient, not intrusive. The ask form is the hero element: one input, one button, no account wall.

SHADES accent colours apply but the overall tone is lighter and more inviting than the rest of the ecosystem. If every other node is a tool or showcase, AGORA is the living room.

---

## 🏗️ Polyglot Orchestration Strategy

**The "Systems Benchmarking" Architecture**

To achieve the **Polyglot Challenge**, the ecosystem utilizes a **Containerized Microservices Architecture** orchestrated via Docker Compose and high-performance communication protocols. This setup transforms the portfolio into a live laboratory for comparing language performance, memory safety, and concurrency models.

### 1. The Communication Handshake (gRPC + Protobuf)

To ensure strict type safety across 10 different languages, the ecosystem uses **gRPC (Protocol Buffers)** for internal service-to-service communication.

- **Why:** Allows the Rust terminal (CLE) to talk to the Java dossier engine (SONA) with sub-millisecond overhead and shared schema definitions.
- **Research Signal:** Demonstrates mastery of high-performance distributed systems.

### 2. Language-Specific Integration Roles

| Node        | Language    | Runtime                 | Primary Research / Technical Role                                                                                                                            |
| :---------- | :---------- | :---------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **SONA**    | **Java**    | Spring Boot             | **Enterprise Reliability:** High-concurrency PDF/Dossier generation via JasperReports. Spring Boot over Quarkus — persistent service, cold-start irrelevant. |
| **LEDGE**   | **C/C++**   | WASM / Sidecar          | **Low-Level Precision:** Ultra-fast trie-based search/indexing for the knowledge graph.                                                                      |
| **DAR**     | **Go**      | Gin / Goroutines        | **Scalable Concurrency:** High-speed, non-blocking polling of GitHub & Pulse APIs.                                                                           |
| **DIO**     | **Haskell** | Servant                 | **Functional Purity:** Deterministic MIDI/OSC signal generation for audio synthesis.                                                                         |
| **SIM**     | **C#**      | Unity WebGL             | **Interactive Physics:** Physics-based world-state management for the agentic mission.                                                                       |
| **CLE**     | **Rust**    | Axum / Tokio + Tauri v2 | **Memory Safety + Dual Surface:** Web RAG via Axum (Railway); native desktop via Tauri v2 sidecar. Same Rust core, two distribution targets.                 |
| **SCHOLAR** | **Python**  | FastAPI                 | **Data Science:** Optimized for NumPy/Pandas analysis of HCI research telemetry.                                                                             |
| **COMMS**   | **PHP**     | Laravel Octane          | **Interaction Speed:** High-velocity notification bus using RoadRunner/Swoole.                                                                               |
| **FORGE**   | **Ruby**    | Rails 8 + Puma + Kamal  | **Convention-Driven Tooling:** Rapid relational back-office — the one pattern none of the other 8 nodes demonstrate. Private client pipeline.                |
| **AGORA**   | **Elixir**  | Phoenix + Fly.io        | **Fault-Tolerant Concurrency:** OTP actor model — processes all the way down. Real-time community, AMA sessions, newsletter, live presence.                  |

### 3. The Shared Data Kernel

All nodes share a unified data layer to prevent "Information Silos":

- **PostgreSQL + pgVector:** The "Source of Truth" for all long-term identity and research data.
- **ClickHouse (OLAP):** The "Telemetry Lake" where all polyglot performance metrics and user interactions are logged.
- **Redis:** Shared high-speed caching for cross-node session persistence.

### 4. Researcher Utility: The "Benchmarking" Layer

By running these 10 stacks side-by-side, the **AAZUCENA_SCHOLAR** node can generate real-time performance comparisons:

- **Energy Efficiency:** Measuring CPU cycles vs. memory footprint across languages for the same task.
- **Interaction Latency:** Comparing the TTFT (Time to First Token) of the Rust terminal vs. the Go proxy.
- **Safe vs. Unsafe Performance:** Benchmarking the C++ indexer against the Rust terminal to study real-world safety overhead.

---

**ALDRIN AZUCENA // ECOSYSTEM_SPEC_V1_2026**
