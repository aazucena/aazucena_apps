# 📄 AAZUCENA // Engineering Intelligence Ideation Plan

This document provides the exhaustive technical and brand specifications for the future nodes of the **aazucena** ecosystem. Each node is designed to solve a specific, recurring problem for either the owner or the visitor, ensuring a high-utility, low-friction digital presence.

---

## 🏛️ The "Polished Core" Mandate
**CRITICAL:** Implementation of any future node is strictly forbidden until the following **Core Stack** is verified as **100% Polished, Deployed, and Functional**:

1.  **Portfolio (`aazucena.com`):** 
    *   Phase 3 Performance (Lazy Loading) active and verified.
    *   All 15 pages production-ready with zero placeholder content.
    *   Full mobile responsiveness audit complete.
2.  **LYTICS (`analytics.aazucena.com`):** 
    *   Fully deployed on Railway with live RBAC and health badges.
    *   ClickHouse Materialized Views populated and accelerating all dashboards.
    *   Tiered Data Retention (TTL) active.
3.  **Strapi (`admin.aazucena.com`):** 
    *   100% of the 20 content types populated with high-fidelity, production data.
    *   Media library fully migrated to Cloudinary.
4.  **Intel Engine:** 
    *   100% stable with the corrected JSON prompt templates.
    *   Internal RAG 100% synchronized with the latest monorepo context.

---

## 🚀 Node Specifications

### 1. 💼 AAZUCENA_SONA // `cv.aazucena.com`
**The Projection Node // Recruitment Velocity Tool**

*   **Core Utility:** Solves "Scanning Friction" for technical recruiters and CTOs.
*   **Detailed Functionality:**
    *   **Quantum Toggling:** Visitors select a professional lens (e.g., *Lead Architect*, *Creative Developer*, *System Engineer*). The site instantly re-ranks and filters the Strapi `api::experience` and `api::project` data to project the most relevant sub-identity.
    *   **Dynamic Dossier Engine:** A headless PDF generation service (e.g., using Puppeteer/Playwright) that converts the active persona view into a branded, high-fidelity resume on the fly.
    *   **Persona Persistence:** Syncs the chosen persona across the entire ecosystem using the `az_active_persona` key in `localStorage`.
*   **Technical Implementation:**
    *   **Stack:** Next.js 15 (App Router) + Framer Motion.
    *   **Logic:** Dynamic sorting algorithm based on Strapi relations.
    *   **Data Flow:** `Strapi` → `Transformer (Role-Based)` → `UI`.
*   **Visual Persona:** Zero-latency, minimalist "High-Density" UI. White-label professional aesthetic with SHADES gradient accents.

---

### 2. 🗃️ AAZUCENA_LEDGE // `wiki.aazucena.com`
**The Memory Node // Public Engineering Wiki & Blueprint Repository**

*   **Core Utility:** Solves "Knowledge Decay." Codifies complex technical wins into permanent, reusable solutions.
*   **Detailed Functionality:**
    *   **Blueprint Foundry:** Every technical hurdle solved (e.g., *ClickHouse RBAC implementation*) is documented as an "Engineering Blueprint." These are highly structured specifications with copy-pasteable XMLs, Zod schemas, and verified code blocks.
    *   **pgVector Semantic Search:** A natural-language search bar powered by the **Internal RAG**. Users type a problem, and the WIKI retrieves the exact solution chunk from the monorepo's documentation.
    *   **Interconnectivity Graph:** A D3 force-directed graph showing how technologies are interconnected within the aazucena stack (e.g., *Astro* → *ClickHouse* → *D3*).
*   **Technical Implementation:**
    *   **Stack:** Astro (Static) + MDX + pgVector.
    *   **Logic:** Automated indexing via the `Intel Engine` indexer.
    *   **Data Flow:** `Markdown` → `pgVector` → `Retriever` → `Search UI`.
*   **Visual Persona:** "Library of the Future." Dark-mode monospace markdown, hierarchical navigation, and technical diagrams.

---

### 3. 📡 AAZUCENA_DAR // `radar.aazucena.com`
**The Horizon Node // Development Pulse & Roadmap Proxy**

*   **Core Utility:** Solves "Static Portfolio Syndrome." Proves the project is a **living kernel**.
*   **Detailed Functionality:**
    *   **GitHub Signal Proxy:** A stylized SHADES interface for your GitHub Issues, PRs, and Discussions.
    *   **Endorsement Voting:** Visitors can "Ping" specific features or bugs on the roadmap. These votes are visualized as a "Sentiment Heatmap" and synced back to GitHub as reactions.
    *   **Physical Node Pulse:** Integrates your `AirportEvent` telemetry to show your current "Operational Region" (e.g., *Active in SFO*) alongside your latest commits.
*   **Technical Implementation:**
    *   **Stack:** Next.js + GitHub Octokit SDK.
    *   **Logic:** Real-time polling of GitHub activity with ClickHouse event logging.
    *   **Data Flow:** `GitHub API` → `Lytics Observer` → `Radar Dashboard`.
*   **Visual Persona:** Industrial terminal style. Blinking "Pings," progress bars, and a scrolling vertical "Dev-Log" ticker.

---

### 4. 🎹 AAZUCENA_DIO // `studio.aazucena.com`
**The Frequency Node // Generative Audio Lab & Sonification Station**

*   **Core Utility:** Solves "Passive Listening." Turns your music background into an interactive technical showcase of sound engineering.
*   **Detailed Functionality:**
    *   **Interactive Strudel Sandbox:** A live-coding studio pre-loaded with your **TidalCycles** code patterns. Visitors can edit the music patterns in the browser to hear real-time sound changes.
    *   **Lytics-Modulated Focus Radio:** A persistent ambient focus stream. The music's BPM, timbre, and glitch-density are modulated in real-time by the live signal pulses from `analytics.aazucena.com`.
    *   **Oscilloscope Audit:** High-fidelity technical visualizations (via `wavesurfer.js`) providing frequency distribution and dynamic range data for every composition.
*   **Technical Implementation:**
    *   **Stack:** Strudel.cc + Web Audio API + wavesurfer.js.
    *   **Logic:** Data-to-MIDI/Oscillator mapping using ClickHouse telemetry.
    *   **Data Flow:** `Lytics Stream` → `Audio Mapping Engine` → `Generative Stream`.
*   **Visual Persona:** "Cyber-Acoustic Studio." Glowing neon waveforms (Cyan/Coral), oscilloscopes, and integrated code editors.

---

### 5. 🎮 AAZUCENA_SIM // `play.aazucena.com`
**The Arena Node // Agentic Identity Mission**

*   **Core Utility:** Solves "Visitor Boredom." Demonstrates game-dev and AI orchestration skills via a 5-minute interactive mission.
*   **Detailed Functionality:**
    *   **Kernel Arena:** A physics-based world (built with **Phaser** or **Three.js**) representing the internal structure of your monorepo.
    *   **Agent NPCs:** Your digital twin personas (**Architect, Librarian**) appear as companions. Users must interact with them via the RAG system to solve infrastructure puzzles representing past projects.
    *   **Trajectory Playback:** User sessions are recorded as `ai_trajectory` events, allowing you to review recruiter "playthroughs" in the **Trajectory Labs** dashboard.
*   **Technical Implementation:**
    *   **Stack:** Phaser 3 / React Three Fiber + LangGraph.
    *   **Logic:** State-based puzzle solving connected to the RAG knowledge base.
    *   **Data Flow:** `Game State` → `LangGraph Request` → `RAG Context` → `Agent Action`.
*   **Visual Persona:** Retro-future game world. High-contrast sprites, floating data voxels, and physics-based navigation.

---

### 6. 🔮 AAZUCENA_CLE // `cli.aazucena.com`
**The Brain Node // Intelligent Search & Interaction Terminal**

*   **Core Utility:** Solves "Information Friction." The fastest possible way to get a specific answer without browsing.
*   **Detailed Functionality:**
    *   **CLI-First Command Bar:** A minimalist, single-purpose command line. Users type `query stack` or `query exp` to get immediate, synthesized answers from your knowledge base.
    *   **Intelligent Synthesis:** The terminal reasons across your documentation to answer complex queries (e.g., *"How has Aldrin's database strategy evolved since 2024?"*).
    *   **Curiosity Audit:** Logs search trends into ClickHouse, giving you data-driven insights into what technical topics visitors care about most.
*   **Technical Implementation:**
    *   **Stack:** Vercel AI SDK + LangGraph + Intel Engine.
    *   **Logic:** Multi-turn conversational RAG with typewriter-style output.
    *   **Data Flow:** `User Query` → `Librarian Agent` → `RAG Context` → `Synthesized Answer`.
*   **Visual Persona:** Single-purpose terminal. Blinking cursor, terminal-green typewriter text, and zero distractions.

---
**ALDRIN AZUCENA // ECOSYSTEM_SPEC_V1_2026**
