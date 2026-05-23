# 🔨 AAZUCENA_GAGE // `gage.aazucena.com`

📍 **Ecosystem:** [README](../README.md) | [Ideation Plan](../IDEATION_PLAN.md) | [Build Sequence](../IDEATION_PLAN.md#tier-3--communication--community-nodes)

**The Workshop Node // Private Client Engagement & Project Pipeline**

- **Tier:** 3 — Communication & Community Node (build after COMMS)
- **Language:** Ruby on Rails 8
- **Frontend:** Hotwire (Turbo + Stimulus)
- **Build prerequisite:** COMMS live + LYTICS live + Strapi live
- **Visibility:** Private — clients receive a direct login link; `gage.aazucena.com` is not publicly listed

---

## Overview

- **Name Origin:** From en-**GAGE**-ment — the fragment sits in the middle of the word, mirroring stu-**DIO**. Secondary meaning: a pledge or security deposit (old English), resonant for a contract/invoice node.
- **Polyglot Challenge:** **Ruby on Rails 8** for convention-driven relational back-office tooling — the one architectural pattern none of the other nodes demonstrate.
- **Core Utility:** Solves "Engagement Gap." The portfolio handles the public story; the Inquiry Firewall qualifies leads; GAGE handles everything after `ACCESS_GRANTED` — briefs, proposals, contracts, milestones, invoicing, and delivery.

---

## Detailed Functionality

- **Project Pipeline:** Five-stage board — Brief → Proposal → Contract → Active → Delivered. Each stage has defined entry/exit conditions. Aldrin manages the full pipeline; clients see only their own project workspace.
- **Brief Builder:** Structured intake form replacing open-text contact forms. Requirements, tech stack, timeline, budget, and reference links. Both parties sign off before work begins.
- **Client Workspace:** Isolated per client. Project status, milestone timeline, threaded messages per milestone (ActionCable — real-time), file delivery (Cloudinary-backed), and sign-off requests.
- **Proposal & Contract Generator:** Prawn (PDF gem) generates branded proposals and contracts from brief data. Client signs digitally. Signed contract triggers the first invoice milestone.
- **Milestone Invoicing:** Stripe-backed payment tied to deliverables — milestone accepted → invoice sent → paid → next milestone unlocks. Full ledger feeds LYTICS's `financial_ledger` table.
- **Private Admin View:** Aldrin's dashboard — full pipeline overview, revenue by project, time tracking, overdue alerts. Rin surfaces anomalies: _"Client A has been in the Brief stage for 9 days without a response."_

---

## Why Rails Specifically

| Rails capability               | What it does in GAGE                                                                |
| ------------------------------ | ----------------------------------------------------------------------------------- |
| **ActiveRecord**               | Clean relational model: `Client → Project → Milestone → Invoice → Payment`          |
| **ActionCable**                | Real-time milestone updates in client workspace — no polling                        |
| **Hotwire (Turbo + Stimulus)** | Full interactivity without a React SPA — the right tool for a private back-office   |
| **Devise + Pundit**            | Auth (client login) + role-based access (Aldrin sees all; client sees own) in hours |
| **ActiveJob + ActionMailer**   | Milestone notifications, invoice reminders, overdue escalations                     |
| **ActiveStorage**              | File attachments on milestones — deliverables, design assets, documents             |
| **Kamal**                      | Modern Docker deployment — container-native, fits Railway infrastructure            |
| **Multi-tenancy**              | Row-level isolation via `scope: current_client` — clients never cross-contaminate   |

---

## Connection to the Existing Ecosystem

```
COMMS            →  qualified leads enter GAGE pipeline after ACCESS_GRANTED
LYTICS           ←  milestone payments feed financial_ledger ClickHouse table
LYTICS           ←  milestone events logged as named telemetry signals
COMMS            ←  GAGE triggers cross-channel alerts (email, Discord, LYTICS)
SONA             →  proposal template selected by client's active az_active_persona
Strapi projects  →  portfolio project data referenced in proposals and briefs
Rin OS           →  Rin surfaces overdue milestones and today's revenue on home screen
CAST             ←  speaking inquiries from CAST event pages enter the GAGE pipeline
```

---

## Technical Implementation

- **Stack:** Ruby 3.x + Rails 8 + PostgreSQL + Redis + ActionCable + Hotwire + Stripe + Prawn.
- **Logic:** Convention-driven CRUD with event-driven milestone transitions. ActiveJob handles async invoice delivery and Stripe webhooks.
- **Data Flow:** `Brief Form` → `Rails Pipeline` → `Milestone Trigger` → `Stripe Invoice` → `LYTICS financial_ledger`.

---

## SCHOLAR Language Pairing

GAGE (Ruby/Rails — interpreted) pairs with INTRO (Crystal — compiled Ruby) as SCHOLAR's direct language-family benchmark:

- Same syntax lineage, radically different runtimes
- SCHOLAR measures: startup time, memory footprint, request latency, binary size
- The benchmark is meaningful precisely because the languages look so similar

---

## Visual Persona

Clean, minimal, professional. No SHADES gradients — this is a workspace, not a showcase. High information density, calm typography, Linear-meets-Basecamp aesthetic. The one node that deliberately does not look like the rest of the ecosystem.
