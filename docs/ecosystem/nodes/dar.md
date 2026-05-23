# 📡 AAZUCENA_DAR // `radar.aazucena.com`

📍 **Ecosystem:** [README](../README.md) | [Ideation Plan](../IDEATION_PLAN.md) | [Build Sequence](../IDEATION_PLAN.md#tier-1--foundation-nodes)

**The Horizon Node // Development Pulse & Roadmap Proxy**

- **Tier:** 1 — Foundation Node
- **Language:** Go (Golang)
- **Frontend:** Next.js
- **Build prerequisite:** LYTICS live + GitHub repos public

---

## Overview

- **Polyglot Challenge:** **Go (Golang)** — not just a Gin HTTP wrapper, but a full concurrent signal aggregator. Multiple GitHub endpoints polled in parallel via goroutines, signals fanned into a central channel, and pushed live to the frontend via WebSocket. The architecture _is_ the polyglot demonstration.
- **Core Utility:** Solves "Static Portfolio Syndrome." Proves the project is a **living kernel** — not a snapshot, a live feed.

---

## Detailed Functionality

- **GitHub Signal Proxy:** A stylized SHADES interface for GitHub Issues, PRs, Discussions, and commit activity — all polled concurrently, never blocking each other.
- **Endorsement Voting:** Visitors "Ping" specific features or bugs on the roadmap. Votes are visualized as a real-time Sentiment Heatmap and synced back to GitHub as reactions via `go-github`.
- **Physical Node Pulse:** Integrates `AirportEvent` telemetry from LYTICS to show the current Operational Region (e.g., _Active in SFO_) alongside the latest commits — the dev feed and the person behind it, together.

---

## Concurrent Fan-In / Fan-Out Architecture

```
goroutine 1 ── polls GitHub Issues      (30s interval) ──┐
goroutine 2 ── polls GitHub PRs         (30s interval) ──┤
goroutine 3 ── polls GitHub Commits     (30s interval) ──┼──► channel aggregator ──► WebSocket broadcaster
goroutine 4 ── polls GitHub Discussions (30s interval) ──┤         (gorilla/websocket)         │
goroutine 5 ── polls LYTICS ClickHouse  (live region)  ──┘                                     ▼
                                                                                   Next.js frontend
                                                                                   (no client polling)
```

Each goroutine runs independently — a slow GitHub endpoint never blocks the others. The channel aggregates whatever arrives first; the WebSocket broadcaster pushes it immediately. The frontend receives live signals without polling.

---

## Go Ecosystem Stack

| Tool                      | Role                                                                                      |
| ------------------------- | ----------------------------------------------------------------------------------------- |
| **Gin**                   | HTTP router — REST endpoints for vote submission and region pulse                         |
| **goroutines + channels** | Concurrent polling — each GitHub endpoint in its own goroutine, fan-in via channel        |
| **gorilla/websocket**     | WebSocket server — pushes live signals to Next.js frontend                                |
| **go-github**             | Google's typed Go GitHub client — replaces Octokit (TS) in the backend, full API coverage |
| **robfig/cron**           | Cron-style scheduler managing each goroutine's polling interval                           |
| **GORM**                  | ORM — persisting votes, endorsements, operational region events to PostgreSQL             |
| **go-redis**              | Response caching — critical for GitHub rate limit management (5,000 req/hr cap)           |

**Why goroutines over async/await:** Node.js or Python would chain concurrent requests via async/await — cooperative multitasking on a single thread. Go's goroutines are scheduled by the runtime across OS threads — genuinely parallel, not just interleaved. For a proxy handling 5 independent polling loops, that distinction is measurable.

---

## Technical Implementation

- **Stack:** Go (Gin + goroutines + gorilla/websocket + go-github + GORM + go-redis) + Next.js frontend.
- **Logic:** Each GitHub endpoint owned by a dedicated goroutine + `robfig/cron` scheduler. Signals fan into a shared channel. WebSocket hub broadcasts to all connected Next.js clients. Votes written to PostgreSQL via GORM and synced to GitHub reactions via `go-github`.
- **Data Flow (live signals):** `go-github goroutines (parallel)` → `channel aggregator` → `gorilla/websocket hub` → `Next.js frontend`.
- **Data Flow (votes):** `Next.js vote submit` → `Gin endpoint` → `GORM → PostgreSQL` → `go-github reaction sync` → `LYTICS telemetry`.
- **Data Flow (region pulse):** `LYTICS ClickHouse (AirportEvent)` → `goroutine 5` → `channel` → `WebSocket` → `Next.js`.

---

## Visual Persona

Industrial terminal style. Blinking "Pings," progress bars, and a scrolling vertical "Dev-Log" ticker. Live goroutine signal indicators subtly visible in the UI — the concurrent architecture made tangible.
