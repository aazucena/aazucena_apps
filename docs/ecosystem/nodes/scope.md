# 🔭 AAZUCENA_SCOPE // `scope.aazucena.com`

📍 **Ecosystem:** [README](../README.md) | [Ideation Plan](../IDEATION_PLAN.md) | [Build Sequence](../IDEATION_PLAN.md#tier-2--knowledge--intelligence-nodes)

**The Sentinel Node // Ecosystem Health Monitor & Status Board**

- **Tier:** 2 — Knowledge & Intelligence Node (build last in Tier 2 — needs Tier 1 nodes live)
- **Language:** Gleam 1.x
- **Frontend:** SolidJS
- **Build prerequisite:** LYTICS live + Tier 1 nodes live (something to monitor) + ⚠️ CAST soft dependency for PubSub bridge

---

## Overview

- **Name Origin:** From tele-**SCOPE** / micro-**SCOPE** — an instrument of observation. End-of-word extraction matching know-**LEDGE** exactly.
- **Polyglot Challenge:** **Gleam** — a statically typed language that compiles to Erlang/BEAM bytecode, pairing with CAST (Elixir) on the same BEAM VM. The only node in the ecosystem that can share OTP supervisors, subscribe to Phoenix.PubSub, and call Elixir libraries natively without an HTTP boundary.
- **Core Utility:** Solves "Ecosystem Blindness." One dashboard that tells you — in real time — whether every other node is healthy, degraded, or down. The sentinel that watches the watchers.
- **Visibility:** Public status page. Incidents visible to anyone. Private admin view for drill-down telemetry.

---

## The BEAM Pairing with CAST

SCOPE and CAST run on the same BEAM VM runtime. This is the defining architectural story of SCOPE:

```
CAST (Elixir)  ──  Phoenix.PubSub broadcast  ──► SCOPE (Gleam) GenServer subscribes
SCOPE (Gleam)  ──  health check result        ──► CAST PubSub ("Node SONA degraded")
                                                        │
                                                        ▼
                                              CAST community feed:
                                              "SONA is experiencing slowness — ETA 5min"
```

- **Shared OTP cluster:** SCOPE's GenServers can be supervised by the same application supervisor as CAST — one fault-tolerant process tree for both nodes
- **Zero-overhead interop:** Gleam calls Elixir functions with no FFI overhead; both compile to Erlang bytecode
- **Gleam's stronger type system:** Pattern matching in Gleam is exhaustively checked at compile time — every health state (`Healthy | Degraded | Down | Unknown`) must be handled, no runtime surprises

---

## Detailed Functionality

- **Node Health Board:** One-glance status for all 12 ecosystem nodes. Each node is polled on a configurable interval — HTTP endpoint check + response time measurement. Displayed as SolidJS signals (each node's status is an independent reactive atom — a status flip on one node doesn't re-render any other).
- **Incident Timeline:** Structured incident log. When a node transitions to `Degraded` or `Down`, SCOPE opens an incident record with timestamp, affected node, and last healthy response. Incidents auto-resolve when health is restored.
- **SLA Tracking:** Rolling uptime percentages (7d / 30d / 90d) and response time P50/P95/P99 per node. Feeds the `system_integrity` table in LYTICS ClickHouse.
- **CAST Community Bridge:** SCOPE publishes ecosystem health events to CAST's Phoenix.PubSub. CAST surfaces major incidents in the community feed — visitors see status without visiting `scope.aazucena.com` directly.
- **Rin OS Integration:** Rin receives a push notification when any core node goes down. SCOPE is the heartbeat sensor; Rin is the voice.

---

## Why SolidJS for the Frontend

Each node's health indicator — a coloured dot, a latency sparkline, an uptime badge — is a reactive primitive. SolidJS signals map cleanly to this model:

```typescript
// Each node is an independent signal — no virtual DOM diffing
const [sonaHealth, setSonaHealth] = createSignal<HealthState>('healthy');
const [darHealth, setDarHealth] = createSignal<HealthState>('healthy');
// Updating one signal only re-renders that node's indicator — nothing else
```

React would wrap these in state and reconcile the full component tree on each update. SolidJS compiles to direct DOM operations — a status flip on SONA touches exactly one DOM node. For a dashboard with 12 live-updating indicators, that's the right abstraction.

---

## Connection to the Existing Ecosystem

```
All 12 nodes   →  SCOPE polls health endpoints every 30s
LYTICS         ←  system_integrity events + P95 response times per node
CAST           ↔  PubSub bridge — incidents published to community feed; CAST reactions feed back
Rin OS         ←  push notification on node_down / node_degraded events
SCHOLAR        ←  uptime + latency data feeds HCI research on "perceived system reliability"
```

---

## Technical Implementation

- **Stack:** Gleam 1.x + Phoenix (shared BEAM cluster with CAST) + SolidJS + ClickHouse
- **Health checks:** Gleam GenServer per node — each polls independently, crashes restart in isolation (OTP "let it crash")
- **Data Flow:** `Gleam GenServer poll` → `Health state update` → `Phoenix.PubSub broadcast` → `SolidJS signal` + `LYTICS ClickHouse`
- **Deployment:** Co-deployed with CAST on Fly.io — shares the BEAM cluster, one release pipeline

---

## Visual Persona

Minimal. Clinical precision. Every pixel is information. Dark background, monochrome with single-colour status signals (green/amber/red). No decoration — the ecosystem's vital signs, nothing else. Operators trust dashboards that have no room for noise.
