# Remove Plausible (short design)

Date: 2026-11-27. Branch: `phase-5/next-release`. Status: owner-decided.

**Intent.** Remove Plausible from the stack. The owner decided this on 2026-11-27 and accepted losing its stored history and the tracking of a second site it served. First-party traffic panels from the [visitor-experience lab](./visitor-experience-lab.md) replace it.

## Why remove it

**1. It cost far more than it was worth.** Plausible's ClickHouse ran on Railway, deployed straight from Railway's upstream template, not from this repo. That template caps the mark cache but never sets `max_server_memory_usage`, so memory crept up over about three months. It reached 4.21 GB to serve 863 MB of data, and the Railway bill went from about $5 to more than $50 a month (Railway bills RAM at $10/GB-month). A 6 GB limit applied in August only capped the damage, and the container was switched off on 2026-11-10 to stop the cost.

**2. It already does nothing, but the code still pays for it.** Since 2026-11-10 Plausible has collected no data, yet:

- every portfolio page still requests the dead `script.js`, a failed request and console error on each page view;
- the analytics app's `/api/stats/plausible` route returns 500;
- the status page reports Plausible as down;
- intel-engine's Sage expert still queries Plausible's database for its traffic summary and gets errors back.

**3. It duplicates infrastructure.** Plausible needs its own app container, its own Postgres and its own ClickHouse, next to the analytics ClickHouse the stack already runs. That's three more services to pay for, upgrade, secure and back up. Because they deploy from an outside template, fixing them properly would first mean forking and maintaining that template.

**4. Its data can't join the rest.** Plausible keeps its events in a separate database with its own schema. The visitor-experience lab needs page views, interactions, system friction, trace IDs and the content dimension in one store, so a per-page report and the interaction score can combine them. Plausible numbers would always sit beside that picture, never inside it.

**5. The replacement is better aligned with the site's privacy model.**

- **One consent model and one transparency page:** the lab's tiers instead of a second tracker with its own rules.
- **Same-origin collection:** Plausible's script came from a separate host, which blockers commonly stop, while the lab's same-origin endpoint and coverage measure make the gap visible.
- **Nothing is lost by method:** the lab keeps the one Plausible idea worth having, the cookieless daily-salt visitor count.

**6. Visits are still counted meanwhile.** Vercel Analytics already counts page views and Speed Insights measures performance, so traffic isn't blind between the removal and the lab's first phase.

**What is given up, and why that's acceptable.** Plausible's stored history and the second site's tracking go with it. The history has been frozen since 2026-11-10, the owner doesn't need it, and the second site no longer needs tracking (owner, 2026-11-27).

## Approaches considered

|                  | **Remove it (chosen)**       | Re-enable with a memory-capped fork                                            | Plausible Cloud                                             |
| ---------------- | ---------------------------- | ------------------------------------------------------------------------------ | ----------------------------------------------------------- |
| Cost             | none                         | a second ClickHouse, Postgres and app on Railway again, even capped            | a monthly subscription                                      |
| Work             | deletions, one Sage change   | fork and maintain Railway's template, add the memory cap, repoint and redeploy | sign-up, script change                                      |
| Fit with the lab | the lab is the single source | duplicates the lab's traffic panels, data can't join                           | duplicates the panels; another processor holds visitor data |

Re-enabling was the earlier plan (fork the template, add a 1.5 GB cap). It would fix the cost, but leave the duplication and the separate data. Plausible Cloud removes the operations, but adds a subscription and an outside processor for the same duplicated numbers.

**What goes** (one commit per concern):

- Portfolio: `PlausibleScript.astro`, its use in `BaseLayout.astro`, `PUBLIC_PLAUSIBLE_*` in `env.d.ts` and `.env.example`; the failing `script.js` request on every page disappears.
- Analytics app: `app/api/stats/plausible/route.ts`, `usePlausibleStats` in `hooks/useTelemetry.ts`, the Plausible client in `lib/services/clickhouse.ts`, Plausible on the status page.
- `@aazucena/api`: the `plausible` option and client in `services/clickhouse.ts`, the Plausible fields in `validators/analytic.ts`.
- intel-engine: the Plausible ClickHouse client and `PLAUSIBLE_CLICKHOUSE_*` in `compose.yml`; Sage's traffic summary moves to `analytics.telemetry_events` (visits and page views).
- CMS: the Plausible fields in the `analytic` content type schema (removed through the running container; regenerate types; `full_documentation.json` stays uncommitted).
- `services/plausible/` folder and any compose references; the design-system's Plausible integration theme and the Plausible icon only if nothing else uses them (the icon may stay as a brand mark).
- Docs: backlog items for re-enabling Plausible and for the `PlausibleScript` option merge are closed; CONTEXT.md's services list updated; the memory note about the cost incident updated.

**Owner actions on Railway and Vercel.** Delete the disabled Plausible and its ClickHouse services and their volumes in Railway; unset `PUBLIC_PLAUSIBLE_API_HOST` in Vercel.

**Verification.** No `plausible` references left outside history and the changelog (`git grep -i plausible`); portfolio, analytics and api type-checks and tests pass; the status page renders without a Plausible row; no request to a Plausible host in the browser's network log.
