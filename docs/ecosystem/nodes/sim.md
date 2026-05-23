# 🎮 AAZUCENA_SIM // `play.aazucena.com`

📍 **Ecosystem:** [README](../README.md) | [Ideation Plan](../IDEATION_PLAN.md) | [Build Sequence](../IDEATION_PLAN.md#tier-4--ambitious--long-horizon-nodes)

**The Arena Node // Agentic Identity Mission**

- **Tier:** 4 — Ambitious & Long-Horizon Node
- **Language:** C# / .NET
- **Frontend:** Unity WebGL (C# → IL2CPP → WASM)
- **Build prerequisite:** Intel Engine live + LYTICS live + ⚠️ Unity build toolchain configured

---

## Overview

- **Polyglot Challenge:** **C# + .NET (Unity WebGL + ASP.NET Core)** — one language across two runtime contexts: game engine client and web server backend. The strongest C# polyglot story possible.
- **Core Utility:** Solves "Visitor Boredom." Demonstrates game-dev and AI orchestration skills via a 5-minute interactive mission.

---

## Detailed Functionality

- **Kernel Arena:** A physics-based Unity WebGL world representing the internal structure of your monorepo. The game client is written entirely in C# and compiled to WebAssembly via IL2CPP.
- **Agent NPCs:** Your digital twin personas (**Architect, Librarian**) appear as companions. Visitors interact with them via the RAG system to solve infrastructure puzzles based on real past projects. NPC requests route through the ASP.NET Core backend — credentials never leave the server.
- **Trajectory Playback:** User sessions recorded as `ai_trajectory` events via the ASP.NET Core layer, reviewable in the LYTICS Trajectory Labs dashboard.

---

## Two-Layer .NET Architecture

| Layer                   | Technology                              | Role                                                            |
| ----------------------- | --------------------------------------- | --------------------------------------------------------------- |
| **Game client**         | Unity WebGL (C# → IL2CPP → WASM)        | Rendering, game logic, player input                             |
| **Game server**         | ASP.NET Core + SignalR                  | Session state, NPC bridge, trajectory                           |
| **Real-time transport** | SignalR (Unity native client support)   | Bidirectional hub — reconnection, fallback, authoritative state |
| **Agent bridge**        | ASP.NET Core → LangGraph (Intel Engine) | Proxies RAG requests, keeps keys server-side                    |
| **Persistence**         | EF Core → PostgreSQL                    | Playthrough sessions, leaderboard, trajectory events            |

**Why SignalR over raw WebSockets:** Unity has a native SignalR client library. SignalR handles reconnection, transport fallback (WebSockets → SSE → long-poll), and the hub pattern maps cleanly to game event channels — no custom protocol design needed.

---

## Technical Implementation

- **Stack:** Unity WebGL (C#) + ASP.NET Core + SignalR + EF Core + LangGraph (Intel Engine).
- **Logic:** Server-authoritative game state via ASP.NET Core SignalR hub. State-based puzzle solving connected to the RAG knowledge base via ASP.NET Core proxy.
- **Data Flow (gameplay):** `Unity Client (C#)` → `SignalR Hub (ASP.NET Core)` → `LangGraph Request` → `RAG Context` → `Agent Action` → `SignalR broadcast back to client`.
- **Data Flow (trajectory):** `Game session events` → `ASP.NET Core` → `LYTICS telemetry pipeline` → `ClickHouse ai_trajectories`.

---

## Visual Persona

Retro-future game world. High-contrast sprites, floating data voxels, and physics-based navigation.
