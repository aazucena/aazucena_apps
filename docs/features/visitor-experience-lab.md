# Visitor-experience lab (design)

Date: 2026-11-27. Branch: `phase-5/next-release`. Status: brainstormed with the owner; every decision below was confirmed by the owner unless marked as the author's call. Not yet planned or built.

## Intent

The owner wants to understand how visitors experience each screen of the portfolio: how long they look, how they interact with its elements across the senses the site uses (sight, hearing, touch and motion), how they feel about it, what feedback they give, and what they are likely to do next. Analysis, tracing and prediction. It serves the owner (and developers) through the analytics dashboard, and visitors through Rin.

The owner's focus areas are HCI, UI/UX, human-centric computing, DX and software engineering education, so the lab follows HCI practice: consent and transparency, the least data that answers the question, explainable measures, and honest reporting of sample size and coverage.

## Goals

1. A privacy-respecting tracker and schema that capture interactions without personal identifiers by default.
2. A per-page report (seven panels) plus an interaction score for pages, components and interactions.
3. System friction (network, outages, external services) recorded and traced to server logs, kept separate from design friction.
4. An opt-in participant program with the non-technical pieces it needs.
5. Rin as a feedback and comfort channel for visitors.
6. Sentiment themes and simple, explainable predictions.

## Non-goals

- Third-party product analytics (PostHog and similar) for collection.
- Tracking anyone across visits or days.
- Opaque predictive models.
- Disguising the tracker to get past blockers.

## Anti-goals

- Personal data collected without consent.
- A design blamed for a system failure.
- Findings presented without their sample size or coverage.
- Rin interrupting or nagging visitors.

## Current state (2026-11-27)

- **Tracker**: `@aazucena/analytics` (`packages/analytics/src/services/telemetry.ts`); the portfolio sends only `PageView` (`PageViewTracker` in `BaseLayout.astro`). `sendInteractionTelemetry` exists but nothing calls it. The visit ID lives in `localStorage` (`getOrCreateSessionId`), so it persists across visits. No referrer or UTM capture. Events post to the analytics app's `/api/ingest` on its own domain.
- **Ingest** (`apps/analytics/src/app/api/ingest/route.ts`): writes `telemetry_events` (via the Buffer table) and a bronze `raw_ingest` row that stores `source_ip`, the raw user-agent, city and latitude/longitude (30-day TTL).
- **Vercel Analytics and Speed Insights** run on the portfolio. Plausible is being removed.
- **Rin** conversations are not stored. No consent banner exists. The footer links a Privacy Framework and Terms of Service whose text lives in Strapi.
- **Journey page** (analytics) reads sessions from ClickHouse; the ClickHouse design adds a content dimension (URL to title, type, tags).

## Approaches considered (owner chose A, built the C way)

|                      | **A · Own stack (chosen)**                          | B · PostHog or similar                      | C · Own stack, replay via rrweb in object storage |
| -------------------- | --------------------------------------------------- | ------------------------------------------- | ------------------------------------------------- |
| Events and score     | own tracker → ClickHouse → intel-engine → dashboard | vendor collects; score rebuilt from exports | as A                                              |
| Replay               | rrweb, stored by us                                 | vendor                                      | rrweb, recordings in object storage               |
| Agreed privacy rules | exactly                                             | partly; data goes to a third party          | exactly                                           |

Chosen: A, with C's replay storage. Recordings are large blobs and stay out of ClickHouse; they go to a **Railway storage bucket** (owner decision, 2026-11-27; S3-compatible, so AWS S3 later is a configuration change).

## Consent model (owner-confirmed)

**Tier 1 · everyone, no consent needed**

- Visit ID per tab in `sessionStorage` (no cookie, nothing persistent).
- Daily unique visitors counted the Plausible way: at ingest, hash of IP + user-agent + a salt that is replaced daily and discarded; the IP is never written to disk.
- Collected: section dwell, scroll depth, clicks on interface elements, rage and dead clicks, path within the visit, per-sense interaction signals, system friction, coverage.
- Stored location detail: country (region if useful) and parsed browser, OS and device. No IP, no city, no latitude/longitude, no raw user-agent (the bronze layer changes accordingly; old rows age out within 30 days).
- Explained on a public "How this site studies its visitors" page.

**Tier 2 · opt-in participants**

- Session replay with all text and inputs masked; their Rin conversations stored for theme and tone analysis (emails and phone numbers removed before saving).
- Invitation: one quiet, dismissible card after the visitor reaches a second page, linking to the transparency page; shown once; the choice remembered only if they say yes.
- Retention 90 days; withdrawal at any time deletes their tagged data.
- Minimum age 16 (author's call); younger visitors stay Tier 1.

**Tier 3 · asked directly**

- One-tap reactions on a screen; a short SUS questionnaire offered to Tier 2 participants (author's defaults).
- Feedback a visitor chooses to give Rin counts here: only that answer is stored (redacted), not the conversation.

**Privacy signals and blockers**

- Global Privacy Control (`Sec-GPC: 1`, Brave's default): Tier 1 only, never shown the opt-in card, Rin never asks them anything unprompted.
- Events go to a same-origin endpoint on the portfolio (for example `/api/e`, forwarded to analytics) with plain, honest paths; no disguising. What blockers still stop stays stopped.
- Page loads are also counted server-side, so every report shows its **coverage** (share of page loads captured).

## Signals

- **Sight**: time each section or component is actually visible (IntersectionObserver), scroll reach, re-reads, hover on desktop, animations seen or skipped (reduced motion), media watched.
- **Hearing**: ambient sound turned on or kept muted, track play time, mutes and skips, sound hint dismissed.
- **Touch and motion**: taps and near-miss taps on small targets, swipes and their completion, drags, keyboard navigation.
- **Friction**: rage clicks, dead clicks, quick exits, client errors (`ClientError`).
- **System friction**: failed or timed-out requests, offline periods, slow resources, status and latency of the portfolio's own APIs (chat, contact action, brain), external services (Cloudinary, audio, embeds, fonts), WebGL context loss, audio play failures, INP.
- **Tracing**: every request from the page carries a W3C `traceparent` ID; the Astro API routes, analytics ingest, intel-engine and intel-bridge log it; Sentry is linked by the same ID; both sides land in ClickHouse so an interaction joins to what the server did.
- **Sources**: referrer and UTM parameters on the first page view of a visit.

## Per-page report (owner-confirmed panels)

Each page shows its sample size and coverage on every panel; small samples are flagged.

| Panel            | Source                                                                                                                                                                                                           |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Time on screen   | Tier 1 dwell and scroll                                                                                                                                                                                          |
| SEO              | the page's own metadata (title, description, social image, headings, structured data) checked from the build, plus Google Search Console (impressions, clicks, position, queries) imported daily into ClickHouse |
| Interactions     | Tier 1 clicks, rage and dead clicks                                                                                                                                                                              |
| Sentiment        | behaviour proxies plus Tier 2 participants' Rin themes, summarised and cited by intel-engine                                                                                                                     |
| Feedback         | Tier 3 reactions and SUS                                                                                                                                                                                         |
| Predictive       | simple, explainable models: likely next step, drop-off point, what predicts reaching Contact (odds ratios, not opaque scores)                                                                                    |
| Standard traffic | visitors, visits, page views, bounce, duration, sources, UTM, top/entry/exit pages, countries, devices                                                                                                           |

**Interaction score**: on top of the panels, an owner-defined score for pages, components and interactions, with sub-scores, rolling up interaction → component → page, explainable (what moved it is shown), confidence-aware and compared within page type. System friction is reported separately and never counted against a design. **The scoring method is kept privately by the owner; the builder receives it from the owner when that phase starts.**

## Rin for visitors (owner-confirmed first set)

1. **Ask how it feels**: at a natural moment (after reading a project, or on intent to leave), one light question about the current page; never on arrival; at most once per visit; a dismissal is remembered for the visit.
2. **Report a problem**: the visitor describes it; Rin attaches the page, browser and the trace IDs of recent errors, nothing personal; the report reaches the owner (destination is the builder's proposal, for example Strapi form submissions).
3. **Adjust the experience**: Rin changes the site's own settings (heavy animations, reduced motion, sound) or explains the controls, and the change is recorded as a signal.

Later: explain-this-page and find-something (after the retrieval project); the participant invitation and "you asked, we changed" notes (after the participant program).

## Non-technical deliverables

Drafted for the owner to review and edit before anything is published (content goes in Strapi):

- The transparency page "How this site studies its visitors".
- Participant information and consent text, worded so anonymised data may also be used in research published only as aggregate findings.
- A rewritten Privacy Framework matching the tiers, the daily-salt count, trace IDs and the processors involved (Vercel, Railway, Sentry, Google Search Console).
- Data-handling rules: access (owner only, behind the dashboard login), storage, the 90-day deletion, breach steps; a withdrawal and deletion process.
- The owner is independent (no ethics board). Practice follows TCPS 2 principles voluntarily; each actual study gets a short written protocol and tagged data. Laws to check (not legal advice): PIPEDA, Alberta PIPA, GDPR, CCPA.

## Phases (owner-confirmed order)

1. **Foundations**: privacy-fixed tracker (`sessionStorage`, daily salt, no IP, referrer and UTM, same-origin endpoint, GPC, trace IDs), ClickHouse schema for interaction events, server-side page-load counter for coverage.
2. **Interaction signals**: dwell, scroll, clicks, rage and dead clicks, per-sense signals, system friction.
3. **Reports**: per-page report, standard traffic, SEO (metadata check, Search Console import).
4. **Score**: from the owner's private method.
5. **Participant program**: transparency page, consent and legal text, opt-in card, Tier 2 replay and Rin storage, Tier 3 reactions and SUS, withdrawal.
6. **Rin's first set**: ask how it feels, report a problem, adjust the experience.
7. **Analysis**: sentiment themes and predictive models in intel-engine.

Each phase gets its own plan. Phases depend on the ClickHouse design (pinned version, migrations, async inserts, content dimension) and phase 6 partly on the retrieval design.

## Verification (per phase, detailed in each plan)

- No personal data in Tier 1 storage: a test asserts ingest drops the IP and raw user-agent and that the visit ID is session-scoped.
- GPC: a request with `Sec-GPC: 1` never yields an opt-in card.
- Coverage: server-side page loads vs client events reconciled in a test fixture.
- Tracing: a client request's trace ID appears in the server log row and joins in ClickHouse.
- Every report panel shows n and coverage; panels with small n are flagged.
- Browser checks with mocked APIs (no live gateway calls): dwell and click events fire, the opt-in card shows once, Rin's three features behave as specified.

## Decisions after the builder check (owner, 2026-11-27)

- **Sentry Session Replay runs for Tier 2 participants only**, fully masked. Today `packages/config/src/sentry/client.ts` (`replaysSessionSampleRate: 0.1`) and `apps/portfolio/sentry.client.config.ts` (`replayIntegration()`, 10% of error sessions) record visitors without consent; phase 1 changes both. Errors from everyone still reach Sentry as events with trace IDs, without a recording.
- **Personal fields stop now and are blanked in existing rows.** Ingest stops writing IP, raw user-agent, city and latitude/longitude into every table (not only bronze: `telemetry_events`, form submissions, easter eggs, AI and music tables), and a ClickHouse column update blanks them in existing rows. Rows, counts and charts stay, so this does not conflict with the ClickHouse design's "lose no analytics data" anti-goal. Contact-form spam checks use a short-lived hashed IP instead.
- **The daily-salt hash is stored per event**, as Plausible does, so the traffic panel can split visitors by page, source, country and device. The transparency page states that visits on the same day can be linked, never across days; the "tracking anyone across visits" non-goal reads "across days" for Tier 1.
- **Lab data is owner-only.** Every `/api/stats` endpoint goes behind the dashboard login now (`apps/analytics/src/proxy.ts` lists it as public today, including the per-session `/api/stats/journeys?sessionId=…`). A public showcase, if wanted later, shows aggregates only with a minimum sample size.

## Calls made after the builder check (author's, for the owner to check)

- **Participant identity.** Opting in creates a random participant ID in `localStorage`; that persistence is covered by the consent itself. Replays, Rin conversations and SUS answers from later visits link to it, so withdrawal and the 90-day deletion are exact. Consent is forward-only: Tier 1 events from earlier in the visit are not retro-tagged. Withdrawal: a "leave the program" control on the site (deletes everything under the ID from that device), plus a deletion code shown once at opt-in for requests from another device.
- **Declines are remembered without an identifier.** A "no" stores a plain, non-identifying flag (`studyInvite=declined`) in `localStorage` for six months, so the card is genuinely shown once rather than on every visit. It carries no ID and is described on the transparency page.
- **Coverage counter.** The owner is on Vercel Pro and the log drain is connected (owner, 2026-11-27), so server-side page loads come from the existing handler (`apps/analytics/src/app/api/webhooks/vercel/route.ts`, writes `vercel_analytics_events`), adding no runtime cost to prerendered pages. Bots are excluded from both sides of the ratio by user-agent rules.

## Left to the builder

Event schema details; IntersectionObserver thresholds; rage and dead click heuristics; replay masking configuration and storage layout; Search Console auth setup steps (the owner grants access); the report's visual layout within Avra; the predictive model choices within "simple and explainable".

## Open for the owner

- Google Search Console access (a service account added to the property) when phase 3 starts.
- The scoring method details, handed to the builder privately at phase 4.
