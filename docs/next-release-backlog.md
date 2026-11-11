# Next Release Backlog

**Branch:** `phase-5/next-release` · **Ships as:** `phase-5` tag · **Started:** 2026-11-10

Phase 5 testing plus the work that piled up during a ~5 month break: analytics UI redesign, new features, and maintenance. Phase 5 testing scope lives in [phase-5-testing.md](./phase-5-testing.md).

---

## Analytics UI

- [ ] **Avra visual identity realignment for AZUCENA_LYTICS.** The dashboard reads like a one-shot Claude artifact: glass cards, stock zinc, Inter + JetBrains Mono, Tableau10 charts, airy layout. Direction decided 2026-11-10 (instrument panels, dedicated cyan/coral vibe, Fira, dense). All five decisions made; Overview prototype reviewed. Spec and implementation order: [analytics-visual-identity.md](./features/analytics-visual-identity.md).

## Features

_To be filled in from the feature list._

## Maintenance

- [ ] **Re-enable Plausible with a ClickHouse memory cap.** The Plausible container on Railway was disabled 2026-11-10 to stop the cost spike (unbounded ClickHouse memory, $5 → $50+/mo). Fix: fork `railwayapp-templates/plausible`, add `<max_server_memory_usage>1610612736</max_server_memory_usage>` (1.5GB) to `packages/clickhouse/ch-config.xml`, repoint the Railway service source to the fork, redeploy, then confirm memory stays under the cap. Data is preserved on the `clickhouse-volume` volume.
  - While disabled: the portfolio requests a dead `script.js` on every page (unset `PUBLIC_PLAUSIBLE_API_HOST` in Vercel to stop it), and analytics `/api/stats/plausible` returns 500.
- [ ] **Fix option merge order in `PlausibleScript.astro`.** `apps/portfolio/src/components/common/PlausibleScript.astro` builds config as `{ ...opts, ...defaultOptions }`, so defaults overwrite caller props (e.g. `outboundLinks={true}` silently becomes `false`). Swap to `{ ...defaultOptions, ...opts }`.
- [ ] **git-cliff skips 120 commits** with grouping errors, so they're missing from `CHANGELOG.md`. Run `git cliff -vv` to find the unmatched commit types and add groups to `cliff.toml`.

## Carried over

- [ ] **Host Rin's `.riv` asset** and set `PUBLIC_RIN_CHARACTER_SRC`. `RinCharacter` falls back to the static SVG until then.
- [ ] **10 Playwright smoke tests** (from Phase 4).
