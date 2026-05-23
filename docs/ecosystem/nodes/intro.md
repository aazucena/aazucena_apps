# 🪪 AAZUCENA_INTRO // `intro.aazucena.com`

📍 **Ecosystem:** [README](../README.md) | [Ideation Plan](../IDEATION_PLAN.md) | [Build Sequence](../IDEATION_PLAN.md#tier-1--foundation-nodes)

**The Threshold Node // Digital Identity Card & NFC Landing Experience**

- **Tier:** 1 — Foundation Node (smallest node in the ecosystem — build first)
- **Language:** Crystal 1.x (Kemal)
- **Frontend:** Qwik
- **Build prerequisite:** Portfolio live + LYTICS live + Strapi live

---

## Overview

- **Name Origin:** From **INTRO**-duction — a business card is a literal introduction. Beginning-of-word extraction; the node is the entry point before the ecosystem begins.
- **Polyglot Challenge:** **Crystal** — compiled Ruby. Same expressive syntax as GAGE (Ruby on Rails), compiled to a native binary via LLVM. The SCHOLAR benchmark writes the same business card API in both languages and measures binary size, cold start, memory footprint, and request latency.
- **Core Utility:** Solves "Business Card Friction." Tap the physical card → instant, rich first impression — no URL typing, no app download, no loading spinner. The threshold every visitor crosses before they reach the portfolio.
- **Visibility:** Public. The most-accessed node at conferences and networking events — it must load in under 200ms.

---

## The GAGE / Crystal Language Pairing

| Dimension             | GAGE (Ruby on Rails 8)       | INTRO (Crystal)                       |
| --------------------- | ---------------------------- | ------------------------------------- |
| Syntax family         | Ruby                         | Ruby (nearly identical)               |
| Execution             | Interpreted (MRI/YARV)       | Compiled to native binary (LLVM)      |
| Startup time          | ~1–2s (JVM-style warmup)     | <50ms                                 |
| Memory                | ~80–150MB (Rails stack)      | ~4–8MB                                |
| Concurrency model     | Puma multi-process + Ractors | Fibers (cooperative coroutines)       |
| Nil safety            | Runtime `NoMethodError`      | Compile-time nil check (`T \| Nil`)   |
| Use case in ecosystem | Convention-heavy back-office | Performance-critical first-impression |

**Crystal's Fiber model** is the third concurrency model in the ecosystem — alongside Go's goroutines (preemptive, OS-thread-based) and Elixir/Gleam's BEAM processes (actor model, millions of lightweight processes). SCHOLAR benchmarks all three for I/O-bound workloads: handling 1,000 concurrent card-load requests across Go, Crystal, and Elixir.

---

## Detailed Functionality

- **NFC / QR Landing:** Physical card contains an NFC chip and QR code both pointing to `intro.aazucena.com`. The page loads with zero hydration cost — Qwik's resumability means the HTML is interactive from the first byte delivered. No JavaScript parsed before the visitor sees the card.
- **Context-Aware Identity View:** Crystal backend reads the `Referer` and `UTM` parameters to surface the most relevant persona lens. Conference referrer → engineering-focused card. LinkedIn QR → professional summary card. Direct URL → full card.
- **Rin AR Trigger Point:** When a visitor opens the Rin OS camera and points at the physical card, the Rin OS AR mode launches — Rin appears over the card in AR and delivers the elevator pitch. INTRO provides the backend endpoint that Rin OS polls to confirm card identity during AR detection.
- **Ecosystem Gateway:** The card links to all public nodes — a curated, persona-aware entry into the full ecosystem. Not a list of links — a narrative path: _"Start with the portfolio. Then explore the radar. Then ask Rin anything."_
- **SCHOLAR Benchmark Surface:** The `/bench` endpoint exposes Crystal's server metrics in real time — response time, memory usage, Fiber count, GC pauses. SCHOLAR reads this and compares against the GAGE equivalent.

---

## Why Qwik for the Frontend

The NFC card is a first impression. The visitor taps their phone and expects the page to be ready — not loading. Qwik's **resumability** model is designed for exactly this constraint:

| Model          | What happens on tap                                                                |
| -------------- | ---------------------------------------------------------------------------------- |
| **React/Next** | Browser downloads JS bundle → parses → runs hydration → attaches event listeners   |
| **Qwik**       | HTML is already interactive. Browser only downloads JS for interactions that occur |

A visitor who taps the card and reads the name, title, and links — without clicking anything — downloads **zero JavaScript**. The page is fully readable and visually polished from the first HTTP response.

```
Crystal backend ──► Pre-rendered HTML (server) ──► Browser renders immediately
                                                         │
                                                   Qwik serializes state into HTML
                                                         │
                                               Only loads JS when visitor interacts
```

---

## Connection to the Existing Ecosystem

```
Physical NFC card / QR code  →  intro.aazucena.com
SONA                         →  persona lens data — intro surfaces the relevant sub-identity
Portfolio                    →  primary CTA from the card
Rin OS                       →  AR trigger — intro confirms card identity for AR detection
LYTICS                       ←  tap events, referrer source, persona selected, path taken
SCHOLAR                      ←  Crystal performance metrics feed the benchmarking layer
GAGE                         ←  language-family benchmark pairing (Ruby vs Crystal)
CAST                         →  "share card" posts an intro link to the CAST community feed
```

---

## Technical Implementation

- **Stack:** Crystal 1.x + Kemal (lightweight HTTP framework) + Qwik + ClickHouse
- **Why Kemal over Lucky/Amber:** Kemal is Crystal's lightest HTTP framework — single file, ~4MB binary. INTRO has one job; a full MVC framework adds overhead with no payoff.
- **Data Flow:** `NFC/QR tap` → `Kemal route` → `Persona resolution` → `Qwik pre-rendered HTML` → `LYTICS tap event`
- **Deployment:** Railway (static binary — no runtime dependency, container image < 10MB)

---

## Visual Persona

The card, not the portfolio. Clean white (or near-white) card aesthetic — the physical business card translated to screen. Name, title, two key links, and Rin's mark. No animations on load (they cost time). Micro-interactions only after the card is visible. The one node that intentionally defers to what it's pointing at, rather than being a destination itself.
