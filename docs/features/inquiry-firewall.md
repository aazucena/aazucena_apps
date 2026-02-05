# Feature: Intelligent Inquiry Firewall (Gated Scheduling)

📍 **Related Documentation:** [AI-Powered Forms](./ai-forms.md) | [Phase 4: DX Plan](../phase-4-developer-experience.md)

## 🎯 Objective
Protect Aldrin’s "Deep Work" sessions by eliminating cold calls and low-quality inquiries from recruiters and clients. This feature transforms the portfolio from a passive contact point into an active **Gatekeeper**.

---

## 🛡️ The "Firewall" Logic

The firewall operates on a **Qualification-First** protocol. No public meeting links (Cal.com) or direct phone numbers are exposed until the user passes through the **Neural Handshake**.

### 1. The Neural Handshake (UI/UX)
- **Aesthetic:** A terminal-driven interface matching the `AZUCENA_LYTICS` brand.
- **Entry:** Users are greeted with a `READY_TO_COLLABORATE? [Y/N]` prompt.
- **Process:** Instead of a long form, the AI Assistant conducts a "Mini-Interview" asking for intent, tech stack, budget, and timeline.

### 2. SHADES Analysis (The Brain)
Every submission is processed by the `intel-engine` (Claude 3.5 Sonnet) using the **SHADES** framework:
- **S**entiment: Is the request respectful and serious?
- **H**istory: Has this entity reached out before?
- **A**lignment: Does the tech stack (e.g., LangSmith Stack) match Aldrin's roadmap?
- **D**rive: Is there a clear urgency or specific goal?
- **E**conomics: Does the project meet the minimum resource threshold?
- **S**ignal: Is this a unique opportunity or a generic template?

### 3. Branching Outcomes
- **Outcome A (Low Alignment):** Terminal displays `[STATUS] CAPACITY_FULL`. AI politely declines and redirects to passive resources (RSS/Blog). **Cal.com link is never loaded.**
- **Outcome B (High Alignment):** Terminal displays `[STATUS] ACCESS_GRANTED`. The UI transforms, and the **Cal.com Embed** slides in, allowing the user to book a vetted time slot immediately.

---

## 📦 Phase 4 Integration (Architecture)

This feature serves as the "Apex Stress Test" for the modular package restructuring in Phase 4.

| Package | Responsibility |
|---------|----------------|
| `@aazucena/ui` | **Scheduler Component**: A composed wrapper for `@calcom/embed-react`. |
| `@aazucena/forms` | **GatedInquiry Logic**: Multi-step state machine for "Interview -> Analysis -> Fulfillment". |
| `@aazucena/api` | **MeetingQualifier**: Service interface for the `intel-engine` handshake. |
| `@aazucena/constants` | **Meeting Config**: Calendar IDs, event types, and SHADES thresholds. |

---

## 🚀 Roadmap: The "Final Boss" (Voice Proxy)

While the web-based firewall is implemented in Phase 4, the **Voice AI Proxy** is a future extension (Phase 6).

### Voice Strategy:
- **Provider:** **Vapi.ai** (Orchestration) + **Deepgram Aura** (Budget-friendly AI Voice).
- **Function:** Call forwarding from Aldrin's public number to a Twilio interceptor.
- **Action:** AI greets the caller, runs SHADES analysis on the transcript, and only sends a scheduling link via SMS if the caller qualifies.

---

## ✅ Success Metrics
- **Zero Cold Calls:** No unscheduled meetings on the calendar.
- **High Signal-to-Noise:** 100% of scheduled meetings are pre-vetted by the `intel-engine`.
- **Brand Authority:** The "Handshake" reinforces the image of an engineer who builds intelligence systems to solve real-world problems (including his own schedule).

---

**Last Updated:** 2026-02-05
**Status:** 🏗️ ARCHITECTURE DEFINED (Phase 4 Week 2 Target)
