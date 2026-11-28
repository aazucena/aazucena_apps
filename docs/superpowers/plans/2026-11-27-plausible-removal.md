# Plausible Removal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove Plausible and every reference to it, and repoint intel-engine's Sage traffic summary to first-party telemetry.

**Architecture:** Deletion work across the portfolio, analytics app, `@aazucena/api`, the CMS schema, intel-engine, the design system and the service compose files, one concern per task. The only behaviour change is Sage, which reads `analytics.telemetry_events` instead of Plausible's ClickHouse.

**Tech Stack:** Astro 7, Next.js 16, TypeScript, Zod 4, Strapi 5, Python 3.11 (FastAPI, clickhouse-connect), pytest, Changesets.

**Spec:** `docs/features/plausible-removal.md`

## Global Constraints

- One commit per concern; stage explicit paths; subject format `<emoji> type(scope): lower-case subject`, under 100 characters.
- No AI attribution in commits.
- Commit locally; never push or create branches.
- Never stage `apps/cms/src/extensions/documentation/documentation/1.0.0/full_documentation.json`.
- No live calls to external services in tests.
- No local `astro build`, `next build` or Storybook build; use type-check, lint and tests.
- A change to a package documented in Storybook (`@aazucena/design-system`) or a published workspace package (`@aazucena/api`) gets a changeset (`pnpm changeset`).
- Always pnpm.

## Review Focus

1. **Old CMS data with Plausible fields.** The analytic single type still returns `plausibleEnabled`/`plausibleDomain` until the CMS deploys. The validator must parse that payload without throwing (Task 3 test).
2. **Stale Vercel env.** `PUBLIC_PLAUSIBLE_API_HOST` may still be set in Vercel after deploy. No page may inject any script because of it (Task 1 check: no reference to the variable remains in `apps/portfolio/src`).
3. **Historic `plausible*` health rows** in `analytics.system_integrity`. The status page must still render them, under their raw service name (Task 2 check: page type-checks and its label map has no Plausible keys).
4. **Empty telemetry.** Sage must return its "no traffic" sentence, not an error, when `telemetry_events` has no page views in 24 h (Task 5 test).
5. **Root compose.** `docker compose config` must still parse after the Plausible include and services are removed (Task 6 check).

---

### Task 1: Portfolio stops loading Plausible

**Files:**

- Delete: `apps/portfolio/src/components/common/PlausibleScript.astro`
- Modify: `apps/portfolio/src/layouts/BaseLayout.astro` (import at line 17, element at line 134)
- Modify: `apps/portfolio/src/env.d.ts` (lines 14–15)
- Modify: `apps/portfolio/.env.example` (lines 44–46)
- Modify: `turbo.json` (line 34: drop `"PUBLIC_PLAUSIBLE_DOMAIN", "PUBLIC_PLAUSIBLE_API_HOST"`)

**Interfaces:**

- Consumes: none.
- Produces: none.

- [ ] **Step 1: Confirm the references exist**

Run: `git grep -n -i plausible -- apps/portfolio turbo.json`
Expected: hits in the five files above.

- [ ] **Step 2: Delete the component and remove every reference listed above**

- [ ] **Step 3: Verify nothing is left and the app type-checks**

Run: `git grep -n -i plausible -- apps/portfolio turbo.json; pnpm --filter portfolio type-check; pnpm --filter portfolio test`
Expected: no grep output; type-check `0 errors`; tests pass (65).

- [ ] **Step 4: Commit**

```bash
git add apps/portfolio/src/components/common/PlausibleScript.astro apps/portfolio/src/layouts/BaseLayout.astro apps/portfolio/src/env.d.ts apps/portfolio/.env.example turbo.json
git commit -m "🔥 chore(portfolio): stop loading the plausible script"
```

---

### Task 2: Analytics app drops its Plausible stats

**Files:**

- Delete: `apps/analytics/src/app/api/stats/plausible/route.ts`
- Modify: `apps/analytics/src/hooks/useTelemetry.ts` (remove `usePlausibleStats`, lines 67–80; keep the journey hooks and fix the comment above them)
- Modify: `apps/analytics/src/lib/services/clickhouse.ts` (remove `plausibleClient` import, the `plausible:` config block lines 27–32, `plausibleClickhouseClient` export line 39)
- Modify: `apps/analytics/src/app/status/page.tsx` (remove the four Plausible label keys, lines 14–18, and the auto-detect branch, lines 23–26)
- Modify: `apps/analytics/.env.example` (lines 103–108)

**Interfaces:**

- Consumes: none.
- Produces: the analytics app no longer imports `plausibleClient` from `@aazucena/api` (Task 3 removes it).

- [ ] **Step 1: Confirm no page uses the hook**

Run: `git grep -n "usePlausibleStats\|plausibleClickhouseClient" -- apps/analytics/src`
Expected: only the definitions in `useTelemetry.ts`, `clickhouse.ts` and the route.

- [ ] **Step 2: Delete the route and remove the references listed above**

- [ ] **Step 3: Verify**

Run: `git grep -n -i plausible -- apps/analytics; pnpm --filter analytics type-check; pnpm --filter analytics lint`
Expected: no grep output; type-check passes; lint has no errors.

- [ ] **Step 4: Commit**

```bash
git add apps/analytics/src/app/api/stats/plausible/route.ts apps/analytics/src/hooks/useTelemetry.ts apps/analytics/src/lib/services/clickhouse.ts apps/analytics/src/app/status/page.tsx apps/analytics/.env.example
git commit -m "🔥 chore(analytics): remove the plausible stats route, hook and client"
```

---

### Task 3: `@aazucena/api` drops the Plausible client and fields

**Files:**

- Modify: `packages/api/src/services/clickhouse.ts` (remove `plausible?` config, `plausibleClient?` global, its creation at lines 114–117, `getPlausibleClient`, the `plausibleClient` proxy at line 186, and Plausible mentions in JSDoc)
- Modify: `packages/api/src/validators/analytic.ts` (remove `plausibleEnabled`, `plausibleDomain`)
- Create: `packages/api/src/validators/analytic.test.ts`
- Create: `.changeset/remove-plausible-api.md`

**Interfaces:**

- Consumes: Task 2 (no app imports `plausibleClient`).
- Produces: `initClickHouseClients({ viewer, ingest })` with no `plausible` key; the analytic validator without Plausible fields.

- [ ] **Step 1: Write the failing test**

Test file uses the validator's existing export name (read it from `analytic.ts`). Tests:

- `"parses old CMS data that still carries plausible fields"`: parse a valid analytic payload plus `plausibleEnabled: true, plausibleDomain: "aazucena.com"`; expect success and `"plausibleEnabled" in result` to be `false`.
- `"has no plausible keys in its shape"`: expect `Object.keys(schema.shape)` not to contain `plausibleEnabled` or `plausibleDomain`.

If `packages/api` has no Vitest config, run the test with `pnpm --filter @aazucena/api exec vitest run src/validators/analytic.test.ts` (Vitest is in the workspace); add a minimal `vitest.config.ts` only if that fails.

- [ ] **Step 2: Run it to see the second test fail**

Run: `pnpm --filter @aazucena/api exec vitest run src/validators/analytic.test.ts`
Expected: "has no plausible keys" FAILS.

- [ ] **Step 3: Remove the fields and the client**

- [ ] **Step 4: Verify**

Run: `pnpm --filter @aazucena/api exec vitest run src/validators/analytic.test.ts; pnpm --filter @aazucena/api exec tsc --noEmit; pnpm --filter analytics type-check; git grep -n -i plausible -- packages/api`
Expected: both tests pass; type-checks pass; no grep output.

- [ ] **Step 5: Add the changeset**

`.changeset/remove-plausible-api.md`: `"@aazucena/api": minor` — "Remove the Plausible ClickHouse client (`plausible` option, `getPlausibleClient`, `plausibleClient`) and the analytic validator's Plausible fields."

- [ ] **Step 6: Commit**

```bash
git add packages/api/src/services/clickhouse.ts packages/api/src/validators/analytic.ts packages/api/src/validators/analytic.test.ts .changeset/remove-plausible-api.md
git commit -m "🔥 chore(api): remove the plausible client and analytic fields"
```

---

### Task 4: CMS drops the Plausible fields

**Files:**

- Modify: `apps/cms/src/api/analytic/content-types/analytic/schema.json` (remove `plausibleEnabled` and `plausibleDomain`, including the condition that references `plausibleEnabled`)
- Modify: `apps/cms/types/generated/contentTypes.d.ts` (regenerated, see Step 2)
- Modify: `apps/cms/.env.example` (lines 70–76)

**Interfaces:**

- Consumes: Task 3 (the validator no longer expects the fields).
- Produces: none.

- [ ] **Step 1: Remove the two attributes and the env lines**

Check no other attribute's `conditions` still names `plausibleEnabled`.

- [ ] **Step 2: Regenerate types through the running CMS container**

Start the local CMS (`pnpm cms:dev` or its container), let Strapi sync the schema and write `types/generated/contentTypes.d.ts`, then stop it. Do not stage `full_documentation.json`.
Expected: `git grep -n -i plausible -- apps/cms/src apps/cms/types apps/cms/.env.example` prints nothing; the admin's Analytics single type opens without errors.

- [ ] **Step 3: Commit**

```bash
git add apps/cms/src/api/analytic/content-types/analytic/schema.json apps/cms/types/generated/contentTypes.d.ts apps/cms/.env.example
git commit -m "🔥 chore(cms): remove the plausible analytics fields"
```

---

### Task 5: Sage reads first-party traffic

**Files:**

- Modify: `services/intel-engine/app/services/sage.py` (`get_traffic_summary`)
- Modify: `services/intel-engine/app/core/clickhouse.py` (remove the Plausible settings, lines 13–17, and `get_plausible_client`, lines 29–36)
- Modify: `services/intel-engine/compose.yml` (lines 25–26)
- Create: `services/intel-engine/requirements-dev.txt` (`pytest==8.3.4`)
- Create: `services/intel-engine/tests/test_sage.py`

**Interfaces:**

- Consumes: `ch_core.get_analytics_client()` (exists).
- Produces: `Sage.get_traffic_summary() -> str` reading `analytics.telemetry_events`.

- [ ] **Step 1: Write the failing tests**

In `tests/test_sage.py`, patch `app.services.sage.ch_core.get_analytics_client` with a fake client whose `query(sql)` records the SQL and returns an object with `result_rows`:

- `test_traffic_summary_reads_first_party_telemetry`: rows `[(12, 40)]` → returns `"Traffic (24h): 12 visits, 40 page views."` and the recorded SQL contains `analytics.telemetry_events` and `event = 'PageView'`, and does not contain `plausible`.
- `test_traffic_summary_with_no_page_views`: rows `[(0, 0)]` → returns `"No traffic data recorded in the last 24 hours."`.
  Run with `asyncio.run(...)` since the method is async.

- [ ] **Step 2: Run them to see them fail**

Run: `cd services/intel-engine && pip install -r requirements.txt -r requirements-dev.txt -q && python -m pytest tests/test_sage.py -v`
Expected: FAIL (the method still calls `get_plausible_client`).

- [ ] **Step 3: Implement**

`get_traffic_summary` uses `ch_core.get_analytics_client()` and counts, for `timestamp >= subtractHours(now(), 24)`, `uniqIf(sessionId, event = 'PageView')` as visits and `countIf(event = 'PageView')` as page views from `analytics.telemetry_events`. Zero page views returns the "No traffic data" sentence. "Visits", not "unique visitors": unique visitors arrive with the visitor-experience lab.

- [ ] **Step 4: Remove the Plausible client and env, then verify**

Run: `python -m pytest tests/test_sage.py -v; git grep -n -i plausible -- services/intel-engine`
Expected: 2 passed; no grep output.

- [ ] **Step 5: Commit**

```bash
git add services/intel-engine/app/services/sage.py services/intel-engine/app/core/clickhouse.py services/intel-engine/compose.yml services/intel-engine/requirements-dev.txt services/intel-engine/tests/test_sage.py
git commit -m "♻️ refactor(intel-engine): sage reads traffic from first-party telemetry"
```

---

### Task 6: Services and design system drop Plausible

**Files:**

- Delete: `services/plausible/` (whole folder)
- Modify: `compose.yml` (include at line 11; `plausible` and `plausible-clickhouse` entries from line 27)
- Delete: `packages/design-system/src/integrations/plausible/theme.ts`
- Modify: `packages/design-system/src/integrations/index.ts` (line 16)
- Modify: `packages/design-system/docs/integrations.md` (line 68)
- Create: `.changeset/remove-plausible-theme.md`
- Keep: `packages/icons/src/custom/Plausible.tsx` (brand mark, per the spec)

**Interfaces:**

- Consumes: none.
- Produces: none.

- [ ] **Step 1: Remove the folder, the compose entries and the theme**

- [ ] **Step 2: Verify**

Run: `docker compose config -q && echo compose-ok; pnpm --filter @aazucena/design-system test; pnpm --filter @aazucena/design-system exec tsc --noEmit; git grep -n -i plausible -- services compose.yml packages/design-system`
Expected: `compose-ok`; tests pass; type-check passes; no grep output.

- [ ] **Step 3: Add the changeset**

`.changeset/remove-plausible-theme.md`: `"@aazucena/design-system": minor` — "Remove the Plausible dashboard theme integration (`plausibleTheme`)."

- [ ] **Step 4: Commit**

```bash
git add services/plausible compose.yml packages/design-system/src/integrations/plausible/theme.ts packages/design-system/src/integrations/index.ts packages/design-system/docs/integrations.md .changeset/remove-plausible-theme.md
git commit -m "🔥 chore: remove the plausible service and its dashboard theme"
```

---

### Task 7: Docs and owner handoff

**Files:**

- Modify: `docs/CONTEXT.md` (services list: remove the `plausible/` line)
- Modify: `docs/next-release-backlog.md` (close "Re-enable Plausible with a ClickHouse memory cap" and "Fix option merge order in `PlausibleScript.astro`" as removed, 2026-11-27, linking `docs/features/plausible-removal.md`)

**Interfaces:**

- Consumes: Tasks 1–6.
- Produces: none.

- [ ] **Step 1: Update the two docs**

- [ ] **Step 2: Verify the whole removal**

Run: `git grep -n -i plausible -- . ':!CHANGELOG.md' ':!**/CHANGELOG.md' ':!docs/**' ':!**/pnpm-lock.yaml' ':!pnpm-lock.yaml' ':!apps/cms/src/extensions/documentation/**'`
Expected: only `packages/icons/src/custom/Plausible.tsx`, `packages/icons/src/custom/index.ts` and `packages/icons/src/index.ts` (the kept brand icon).

- [ ] **Step 3: Commit**

```bash
git add docs/CONTEXT.md docs/next-release-backlog.md
git commit -m "📝 docs: record the plausible removal in context and the backlog"
```

- [ ] **Step 4: Report the owner's actions**

Tell the owner, without doing it: delete the disabled Plausible and Plausible ClickHouse services and their volumes in Railway; unset `PUBLIC_PLAUSIBLE_API_HOST` and `PUBLIC_PLAUSIBLE_DOMAIN` in Vercel; then the memory note about the cost incident gets updated by the controller.
