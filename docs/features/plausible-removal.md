# Remove Plausible (short design)

Date: 2026-11-27. Branch: `phase-5/next-release`. Status: owner-decided.

**Intent.** Plausible's Railway container has been off since 2026-11-10 (its ClickHouse ran away with memory and cost). The owner decided to remove Plausible entirely; losing its stored history and the tracking of a second site it served is fine (owner, 2026-11-27). The visitor-experience lab replaces its standard traffic panels with first-party data.

**Approaches.** Remove it (chosen) or re-enable it with a memory-capped fork of the Railway template (the earlier plan). Re-enabling keeps a second ClickHouse to pay for and duplicates the lab's traffic panels.

**What goes** (one commit per concern):

- Portfolio: `PlausibleScript.astro`, its use in `BaseLayout.astro`, `PUBLIC_PLAUSIBLE_*` in `env.d.ts` and `.env.example`; the failing `script.js` request on every page disappears.
- Analytics app: `app/api/stats/plausible/route.ts`, `usePlausibleStats` in `hooks/useTelemetry.ts`, the Plausible client in `lib/services/clickhouse.ts`, Plausible on the status page.
- `@aazucena/api`: the `plausible` option and client in `services/clickhouse.ts`, the Plausible fields in `validators/analytic.ts`.
- intel-engine: `PLAUSIBLE_CLICKHOUSE_*` in `compose.yml`.
- CMS: the Plausible fields in the `analytic` content type schema (removed through the running container; regenerate types; `full_documentation.json` stays uncommitted).
- `services/plausible/` folder and any compose references; the design-system's Plausible integration theme and the Plausible icon only if nothing else uses them (the icon may stay as a brand mark).
- Docs: backlog items for re-enabling Plausible and for the `PlausibleScript` option merge are closed; CONTEXT.md's services list updated; the memory note about the cost incident updated.

**Owner actions on Railway and Vercel.** Delete the disabled Plausible and its ClickHouse services and their volumes in Railway; unset `PUBLIC_PLAUSIBLE_API_HOST` in Vercel.

**Verification.** No `plausible` references left outside history and the changelog (`git grep -i plausible`); portfolio, analytics and api type-checks and tests pass; the status page renders without a Plausible row; no request to a Plausible host in the browser's network log.
