# 🔮 AAZUCENA_CLE // `cli.aazucena.com`

📍 **Ecosystem:** [README](../README.md) | [Ideation Plan](../IDEATION_PLAN.md) | [Build Sequence](../IDEATION_PLAN.md#tier-2--knowledge--intelligence-nodes)

**The Brain Node // Intelligent Search & Interaction Terminal**

- **Tier:** 2 — Knowledge & Intelligence Node
- **Language:** Rust (Axum + Tokio + Tauri v2)
- **Frontend:** React (web surface) / Preact (Tauri desktop shell)
- **Build prerequisite:** Intel Engine live + pgVector corpus populated

---

## Overview

- **Polyglot Challenge:** **Rust** for the memory-safe, high-performance RAG terminal — delivered across two surfaces via **Tauri v2** (desktop) and **Axum + Tokio** (web).
- **Core Utility:** Solves "Information Friction." The fastest possible way to get a specific answer without browsing — available whether you're at `cli.aazucena.com` in a browser or running the native desktop app.

---

## Detailed Functionality

- **CLI-First Command Bar:** A minimalist, single-purpose command line. Users type `query stack` or `query exp` to get immediate, synthesized answers from your knowledge base.
- **Intelligent Synthesis:** The terminal reasons across your documentation to answer complex queries (e.g., _"How has Aldrin's database strategy evolved since 2024?"_).
- **Curiosity Audit:** Logs search trends into ClickHouse, giving you data-driven insights into what technical topics visitors care about most.

---

## Dual-Surface Architecture

- **Web (`cli.aazucena.com`):** React frontend + Axum (Rust) backend deployed on Railway. Multi-turn conversational RAG with typewriter-style output. Full visitor access.
- **Desktop (Tauri v2 app):** Same React frontend wrapped in a native Tauri shell. Rust sidecar handles offline RAG — indexes local files, queries without a network hop. macOS / Windows / Linux. ~3–4MB binary (vs. ~120MB Electron equivalent).
- **Shared core:** One Rust RAG engine. Web surface calls it via HTTP; desktop surface bundles it as a Tauri sidecar. No logic duplication.

### What Tauri unlocks over the web surface

| Capability                        | Web  | Desktop (Tauri) |
| --------------------------------- | ---- | --------------- |
| Offline RAG (local corpus)        | ❌   | ✅              |
| OS keychain auth                  | ❌   | ✅              |
| System tray persistent access     | ❌   | ✅              |
| Local file indexing               | ❌   | ✅              |
| Native menus + keyboard shortcuts | ❌   | ✅              |
| Bundle size                       | ~web | ~3–4 MB         |

---

## Technical Implementation

- **Stack:** Tauri v2 + Rust (Axum + Tokio) + React (web surface) + Preact (Tauri desktop shell) + LangGraph + Intel Engine.
- **Why Preact for desktop:** The Tauri shell binary target is size-sensitive — 3KB (Preact) vs 45KB (React). Same API, same component code, swapped at build time via `"react" → "preact/compat"` import alias in the Tauri build config. Zero code changes. SCHOLAR benchmarks the memory footprint difference between the two surfaces.
- **Logic:** Multi-turn conversational RAG with typewriter-style output. Tauri sidecar for offline mode; Railway-hosted Axum for web mode.
- **Data Flow (web):** `User Query` → `Axum API (Railway)` → `Librarian Agent` → `RAG Context` → `Synthesized Answer`.
- **Data Flow (desktop):** `User Query` → `Tauri Sidecar (local Rust)` → `Librarian Agent` → `Local pgVector / Cached Corpus` → `Synthesized Answer`.

---

## SCHOLAR Research Angle

Tauri vs. web terminal is a measurable HCI experiment — same RAG interface, different runtime. SCHOLAR can run user studies comparing task completion time, perceived latency, and trust between the two surfaces. Binary size, memory footprint, and TTFT benchmarks feed the polyglot benchmarking layer.

---

## Visual Persona

Single-purpose terminal. Blinking cursor, terminal-green typewriter text, and zero distractions. Identical across web and desktop — Tauri renders the same React UI.
