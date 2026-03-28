# AZUCENA_COMMS — Professional Communications Layer

**Module of:** AZUCENA_LYTICS (`/comms` route, private)
**Priority:** Post Phase 5 — showcase feature
**Status:** Ideation

---

## Overview

AZUCENA_COMMS is a private professional communications layer built inside AZUCENA_LYTICS. It uses Twilio to mask Aldrin's real phone number, enforces voiced consent before connecting any inbound call, and uses LangChain + Groq to automatically transcribe, summarize, and score every professional interaction post-call.

The system is designed for all professional inbound contacts — recruiters (majority), freelance clients, collaborators, event organizers, and press — not solely as a recruiter filter.

**The key demo loop:** A recruiter contacts the public Twilio number listed on the portfolio → the system routes, consents, records, and scores the call → the dashboard surfaces the full transcript and AI analysis privately to Aldrin. The recruiter using the contact number literally becomes a live demo of the feature.

---

## Why Build This

- **Privacy:** Real phone number never exposed on resume or portfolio
- **Scam prevention:** Voiced consent IVR forces human confirmation before connecting
- **Self-improvement:** AI scores both the opportunity quality and Aldrin's own call performance
- **Portfolio signal:** Demonstrates full-stack thinking across Twilio, LangChain, real-time infrastructure, and private dashboards
- **Practical utility:** Actively useful during job search and freelance outreach

---

## Tech Stack

| Layer          | Technology                                                        |
| -------------- | ----------------------------------------------------------------- |
| Communications | Twilio Proxy, Programmable Voice, Voice Intelligence              |
| AI / LLM       | LangChain + Groq (hosted, fast inference, free tier)              |
| Observability  | LangSmith (existing in AZUCENA_LYTICS AI Terminal)                |
| Dashboard      | Next.js 15 App Router — new `/comms` route in `apps/analytics/`   |
| State          | Redux Toolkit — new `comms` slice                                 |
| Data Fetching  | TanStack Query v5 (existing pattern)                              |
| Visualizations | D3.js (existing pattern)                                          |
| CMS            | Strapi v5 — stores Aldrin's professional profile as system prompt |
| Auth           | NextAuth or API key — route-level protection on `/comms`          |

---

## Architecture

### Call Flow

```
Contact calls/texts public Twilio number
        │
        ▼
Twilio webhook → Next.js Route Handler (apps/analytics/)
        │
        ▼
Twilio IVR plays voiced consent prompt:
"You are contacting Aldrin Azucena professionally.
 Press 1 to confirm you consent to call recording and connection.
 Press 2 or hang up to cancel."
        │
        ├── No input / Press 2 → call ends, session logged
        │
        └── Press 1 (consent)
                │
                ▼
        Twilio Proxy creates session
        Routes to Aldrin's real number (personal or work — chosen at session creation)
        Call recording starts via Twilio Voice Intelligence
                │
                ▼
        Call ends → Twilio sends recording + transcript webhook
                │
                ▼
        LangChain chains run (post-call, async):
        ├── Summary Chain
        ├── Opportunity Score Chain
        └── Performance Score Chain
                │
                ▼
        Results stored → surfaced in AZUCENA_COMMS dashboard
```

### Number Routing

One Twilio number supports multiple real destination numbers. The destination is assigned when the Proxy session is created:

```
Contact A → +1-TWILIO-NUMBER → Aldrin's personal number
Contact B → +1-TWILIO-NUMBER → Aldrin's work number
```

Twilio matches inbound sender to the correct session by caller ID.

---

## AI Pipeline

### LangChain Chains

All chains run async post-call, triggered by Twilio's recording-complete webhook.

**1. Summary Chain**

- Input: full call transcript (from Twilio Voice Intelligence)
- Output: structured summary — who called, company/context, purpose, key points discussed, next steps mentioned

**2. Opportunity Score Chain**

- Input: transcript + Aldrin's professional profile (system prompt from Strapi)
- Output: 0–100 score + rationale across dimensions:
  - Stack relevance (does the role/project match Aldrin's skills?)
  - Seniority fit
  - Compensation signals (if mentioned)
  - Company signals
  - Contact type classification (recruiter / client / collaborator / other)

**3. Performance Score Chain**

- Input: transcript + scoring rubric (stored in Strapi)
- Output: 0–100 score + actionable notes across dimensions:
  - Communication clarity
  - How well Aldrin pitched his work
  - Questions asked (curiosity signal)
  - Follow-up commitments made
  - Overall impression left

### Professional Profile (Strapi-stored System Prompt)

The LangChain chains reference a **professional profile** stored in Strapi — Aldrin's ideal engagement criteria, current availability, stack, and preferences. Updating it in Strapi updates chain behavior without redeployment.

```
Ideal role: Senior / Staff Frontend or Full-Stack Engineer
Stack alignment: React, TypeScript, Astro, Next.js, Node.js
Open to: Remote-first, contract-to-hire, greenfield product work
Not interested in: Purely management roles, legacy stack with no modernization path
Current availability: [updatable]
```

---

## Dashboard — AZUCENA_COMMS Module

Private route: `/comms` inside `apps/analytics/`, behind auth.

### Panels

**Active Sessions**

- Live proxy sessions (contact name/number masked, session status)
- Manual controls: close session, block contact

**Call Log**

- All past sessions with timestamps, contact type, duration
- Filter by contact type, date range, score range

**Transcript Viewer**

- Full transcript per call
- Summary + opportunity score + performance score displayed inline

**Score Trends** _(D3)_

- Opportunity score over time — are inbound contacts improving in quality?
- Performance score over time — is Aldrin improving on calls?
- Contact type breakdown (pie/donut)

---

## Implementation Plan

### Phase A — Twilio Foundation

- [ ] Provision Twilio number
- [ ] Set up Twilio Proxy Service
- [ ] Build Next.js Route Handlers for Twilio webhooks (voice + SMS)
- [ ] Implement IVR consent flow with `<Gather>` TwiML verb
- [ ] Wire number routing logic (personal vs work number per session)
- [ ] Secure webhook endpoints with Twilio signature validation

### Phase B — AI Pipeline

- [ ] Set up Groq via LangChain (`ChatGroq`)
- [ ] Build Summary Chain
- [ ] Build Opportunity Score Chain
- [ ] Build Performance Score Chain
- [ ] Store professional profile in Strapi as updatable content type
- [ ] Wire LangSmith tracing (chains visible in existing AI Terminal panel)

### Phase C — Dashboard

- [ ] Add `comms` Redux slice
- [ ] Build `/comms` route in `apps/analytics/`
- [ ] Active Sessions panel
- [ ] Call Log panel with filters
- [ ] Transcript Viewer with inline AI scores
- [ ] D3 score trend charts

---

## Security Considerations

- `/comms` route protected — accessible only to Aldrin
- Twilio webhook endpoints validate `X-Twilio-Signature` header on every request
- Real phone numbers never stored in plaintext in the dashboard — only session IDs
- Call recordings stored in Twilio (not self-hosted) — access via authenticated API only
- Groq API key scoped to this service only

---

## Notes

- **Free trial constraint:** Twilio free trial only calls/texts verified numbers. Upgrade to paid (~$15-20 credit) before going live with real contacts.
- **Groq free tier:** Sufficient for post-call async summarization workloads. Upgrade path to paid Groq or Railway-hosted Ollama if volume grows.
- **Do not over-engineer the proxy mechanics** — the impressive parts are the consent IVR, AI scoring, and dashboard. Keep proxy setup simple.
