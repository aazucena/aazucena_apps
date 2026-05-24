# 💬 AAZUCENA_COMMS // `comms.aazucena.com`

📍 **Ecosystem:** [README](../README.md) | [Ideation Plan](../IDEATION_PLAN.md) | [Build Sequence](../IDEATION_PLAN.md#tier-3--communication--community-nodes)

**The Connection Node // Advanced Inquiry & Interaction Firewall**

- **Tier:** 3 — Communication & Community Node (build before GAGE)
- **Language:** PHP 8.3 (Laravel 11)
- **Frontend:** TanStack Start
- **Build prerequisite:** Polished Core only — COMMS is the pipeline entry point, not a consumer of other nodes

---

## Overview

- **Polyglot Challenge:** **PHP (Laravel 11)** for the high-velocity communication and notification engine.
- **Core Utility:** Solves "Communication Noise." Consolidates all ecosystem interactions into a single, intelligent stream.

---

## Detailed Functionality

- **Inquiry Firewall:** A robust backend that processes all form submissions (from `ai-forms.md`), performing secondary validation, PII scrubbing, and intelligent routing.
- **Omnichannel Notifications:** Uses Laravel's notification system to sync alerts across Email, Discord, and the `AZUCENA_LYTICS` dashboard.
- **Interaction Persistence:** Tracks every touchpoint a visitor has across the nodes (e.g., "Visitor A read the WIKI, then looked at SONA"), building a "Social Graph" for your People-Centric research.

---

## Technical Implementation

- **Stack:** PHP 8.3 + Laravel 11 + TanStack Start (frontend) + PostgreSQL + Redis.
- **Why TanStack Start:** TanStack Query and TanStack Table are already powering the analytics app. COMMS reuses the same query patterns for notification feeds and interaction logs — no new mental model for the frontend. TanStack Start's server functions call the Laravel API without a separate REST contract.
- **Why Laravel Octane:** RoadRunner/Swoole keeps worker processes warm between requests — critical for a high-velocity notification bus where every millisecond of startup time adds up.
- **Logic:** Event-driven architecture using Laravel Jobs and Queues.
- **Data Flow:** `Frontend Form (TanStack Start)` → `COMMS API (Laravel)` → `PII Scrubber` → `Lytics Event` → `Notification Dispatch`.

---

## Pipeline Position

COMMS is the **start** of the engagement pipeline, not a consumer of other nodes:

```
COMMS (inquiry firewall) ──► ACCESS_GRANTED ──► GAGE (client pipeline)
```

Build COMMS before GAGE. GAGE cannot run its full qualification pipeline without it.

---

## ⚠️ Portfolio Handoff — Inline Form Handling

The portfolio currently handles form submissions inline via its own API routes (see `docs/features/ai-forms.md`). **These routes are a stopgap** — they exist because COMMS does not yet exist. When COMMS ships, the inline handling must be removed.

### What the portfolio currently does inline

| Responsibility                   | Current location                             | Status when COMMS ships                  |
| -------------------------------- | -------------------------------------------- | ---------------------------------------- |
| Zod + react-hook-form validation | `@aazucena/forms` templates                  | ✅ Keep — client-side stays in portfolio |
| LangGraph AI conversation layer  | `apps/portfolio/src/lib/langchain/`          | ✅ Keep — COMMS does not replicate this  |
| Server-side validation           | `apps/portfolio/src/pages/api/ai-contact.ts` | ❌ Delete — COMMS takes over             |
| PII scrubbing                    | ❌ Not present inline                        | ✅ COMMS adds this                       |
| Email notification               | `apps/portfolio/src/pages/api/ai-contact.ts` | ❌ Delete — COMMS takes over             |
| Discord notification             | ❌ Not present inline                        | ✅ COMMS adds this                       |
| Strapi submission storage        | `apps/portfolio/src/lib/api/`                | ❌ Delete — COMMS owns persistence       |
| LYTICS telemetry event           | Partial — LYTICS ingest only                 | ✅ COMMS makes this explicit             |
| Routing → GAGE                   | ❌ Impossible inline                         | ✅ COMMS `ACCESS_GRANTED` handoff        |
| Cross-node journey tracking      | ❌ Not possible                              | ✅ COMMS social graph                    |

### Files to delete from `apps/portfolio/` when COMMS ships

```
apps/portfolio/src/pages/api/ai-contact.ts   ← server submission handler
apps/portfolio/src/pages/api/contact.ts      ← fallback contact handler (if present)
apps/portfolio/src/lib/langchain/            ← only if LangGraph conversation moves to COMMS
```

> The LangGraph AI conversation layer is the one piece that may stay in the portfolio — COMMS handles dispatch and routing, not the conversational UX. Decide at build time whether the LangGraph layer remains portfolio-side (better UX colocation) or moves into COMMS (centralized pipeline). Do not duplicate it in both.

### Transition strategy

1. Build COMMS with its own contact interface at `comms.aazucena.com`
2. Update the portfolio contact section to proxy to COMMS (or link directly)
3. Verify COMMS handles all 8 form types from `ai-forms.md`
4. Delete the portfolio inline handlers
5. Confirm no dangling email/notification logic remains in the portfolio API routes

---

## Visual Persona

"Social Terminal." Minimalist card-based UI, activity feeds, and real-time interaction logs.
