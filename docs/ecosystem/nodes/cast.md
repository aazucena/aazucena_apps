# 🏛️ AAZUCENA_CAST // `cast.aazucena.com`

📍 **Ecosystem:** [README](../README.md) | [Ideation Plan](../IDEATION_PLAN.md) | [Build Sequence](../IDEATION_PLAN.md#tier-3--communication--community-nodes)

**The Broadcast Node // Creator Community Hub & Anonymous Q&A Platform**

- **Tier:** 3 — Communication & Community Node
- **Language:** Elixir 1.17 + Phoenix 1.7
- **Frontend:** Phoenix LiveView
- **Build prerequisite:** Portfolio + SONA live (for "ask" link distribution) + LYTICS live
- **Visibility:** Public — the community-facing node, the town square of the ecosystem

---

## Overview

- **Name Origin:** From broad-**CAST** — the newsletter, live AMA sessions, and talk archive are all forms of broadcast. End-of-word extraction matching know-**LEDGE** exactly.
- **Polyglot Challenge:** **Elixir 1.17 + Phoenix 1.7** for fault-tolerant real-time community infrastructure — the one concurrency model none of the other nodes demonstrate.
- **Core Utility:** Solves "Audience Distance." Every other node requires Aldrin to produce content. CAST generates content from the audience — anonymous questions become public answers, public answers become newsletter issues, newsletter issues drive more subscribers who ask more questions. A self-sustaining content flywheel.
- **Inspiration:** Marshmallow (marshmallow.app) — anonymous Q&A where the audience generates the questions and the creator curates what becomes public. Extended into a full creator hub with events, learning, and broadcast.

---

## The Content Flywheel

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

## The Five Pillars

### Pillar 1 — Anonymous Q&A Inbox (The Marshmallow Layer)

The core feature. The audience generates the content.

- **Shareable ask link:** `cast.aazucena.com/ask` — one URL distributed across portfolio, SONA, and social profiles
- **Anonymous by default:** Zero friction — no account required to submit a question
- **Private inbox:** All questions land in Aldrin's curated inbox — nothing is auto-published. Full control over what becomes public
- **Community upvoting:** Unanswered questions can be upvoted to signal priority — the most-wanted answers surface naturally
- **Live AMA sessions:** Scheduled "Ask Me Anything" windows where questions stream in real-time via Phoenix Channels. Aldrin answers live; the feed updates for attendees without page refresh. Pre-talk Q&A collection for conference sessions — audience submits before the event, best questions answered on stage
- **Public answer archive:** Every published answer is permanent, searchable, and shareable. Each becomes a content piece with its own URL

### Pillar 2 — Newsletter (The Broadcast)

- **Subscriber segmentation:** Audience segments map to the 4 Persona Selection personas — developer questions go to technical subscribers, career questions to recruiter subscribers, music/creative content to creative subscribers
- **Auto-digest:** Weekly newsletter compiled automatically from the top answered Q&As — content without additional writing effort
- **Custom issues:** MDX composer with code blocks, embeds, and SHADES-styled components for hand-crafted issues
- **Delivery:** Oban background jobs queue delivery via Resend. Exponential backoff on failures
- **Paid tier:** Stripe-backed member tier — premium Q&A sessions, early access to learning content, ad-free experience
- **Analytics:** Open rates, click events, and unsubscribes piped back to LYTICS `telemetry_events`

### Pillar 3 — Community & Presence (The Live Layer)

- **Phoenix.Presence:** Distributed real-time tracking of who's reading what — subtle live indicator on answers and posts (_"11 people reading this now"_). No polling — OTP processes own the presence state
- **Reactions:** Emoji reactions on public answers — lightweight social proof without full comment threads
- **Topic subscriptions:** Members follow specific topics (AI, TypeScript, audio, career) and receive targeted broadcasts — not a firehose
- **Not a Discord replacement:** Focused, topical, curated. The signal-to-noise ratio is the product

### Pillar 4 — Events & Speaking (The Stage)

- **Talk archive:** Conference recordings, slide decks, timestamps, and key quotes. Each talk has its own Q&A thread — audience asks follow-up questions post-talk
- **Event calendar:** Upcoming conferences, workshops, and live sessions with one-click notification subscription
- **Live session hosting:** Phoenix Channels — real-time attendee counter, live Q&A feed, Rin narrates milestones (_"100 people in the room"_)
- **Speaking inquiry route:** Interest form on event pages feeds directly into the GAGE pipeline — qualified inquiries become project briefs

### Pillar 5 — Open Learning (The Workshop Floor)

- **Tutorial series:** Short, practical content — not academic (that's SCHOLAR), not documentation (that's LEDGE). Actionable skills with clear outcomes
- **Interactive code examples:** Phoenix LiveView renders interactive exercises server-side — zero JS bundle overhead for the learner
- **Progress tracking:** Completion events logged to LYTICS. Members see their progress; Aldrin sees aggregate learning patterns
- **Free vs. member tier:** Public previews; full content for newsletter subscribers
- **SCHOLAR pipeline:** Research findings in SCHOLAR surface here as public-facing learning content — the academic-to-practical bridge

---

## Why Elixir + Phoenix

The Marshmallow layer makes the real-time requirements heavier, not lighter. Four of Phoenix's standard primitives map directly to CAST's core needs:

| Phoenix primitive    | CAST use                                                                    |
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
GAGE (Ruby/Rails)      →  convention-driven request/response + ActionCable
CAST (Elixir/Phoenix)  →  processes all the way down — concurrency is the default
```

Three languages, three answers to "how do you build for many concurrent users doing different things simultaneously."

---

## BEAM Pairing with SCOPE

CAST and SCOPE run on the same BEAM VM cluster (Fly.io). SCOPE subscribes to CAST's Phoenix.PubSub to receive ecosystem health events and surface them in the community feed. See [scope.md](./scope.md) for full details.

---

## Connection to the Existing Ecosystem

```
Portfolio + SONA      →  "ask" link distributed on every public surface
LYTICS                ←  subscriber opens, event attendance, tutorial completions as telemetry
LYTICS financial_ledger ← Stripe member subscriptions feed ClickHouse
COMMS                 ←  CAST events trigger cross-channel notifications (email, Discord)
SCHOLAR               →  research findings become CAST learning content
SCHOLAR               ←  Q&A topic trends feed HCI research signal
GAGE                  ←  speaking inquiries from event pages enter the GAGE pipeline
LEDGE                 ←  technical answers auto-suggest becoming Engineering Blueprints
DIO                   ←  music compositions embedded in newsletter issues
DAR                   ←  roadmap updates broadcast to CAST subscribers
SCOPE                 ↔  PubSub bridge — ecosystem health events surfaced in community feed
Rin OS                →  Rin surfaces "47 new questions this week" on the home screen
```

---

## Technical Implementation

- **Stack:** Elixir 1.17 + Phoenix 1.7 + Phoenix LiveView + Phoenix.Presence + Oban + Ecto + PostgreSQL + Redis
- **Auth:** Phx.Gen.Auth (built-in Phoenix auth generator) for member accounts; anonymous question submission requires no auth
- **Deployment:** Fly.io (Elixir-native, multi-region BEAM clustering — shared cluster with SCOPE)
- **Data Flow (Q&A):** `Anonymous submission` → `Elixir GenServer inbox` → `Aldrin curates` → `Published answer` → `PubSub broadcast` → `Oban digest queue`
- **Data Flow (Live AMA):** `Phoenix Channel join` → `Presence tracked` → `Question broadcast` → `Answer pushed to all subscribers` → `LYTICS event logged`
- **Data Flow (Newsletter):** `Oban scheduler` → `Top answered Q&As compiled` → `Segmented by persona` → `Resend delivery` → `Open/click events → LYTICS`

---

## Visual Persona

Warm, editorial, open. The one node that feels like a **home**, not a dashboard or terminal. Readable serif typography for Q&A content, clean sans-serif for UI chrome. Subtle presence indicators — ambient, not intrusive. The ask form is the hero element: one input, one button, no account wall.

SHADES accent colours apply but the overall tone is lighter and more inviting than the rest of the ecosystem. If every other node is a tool or showcase, CAST is the living room.
