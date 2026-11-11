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
- [ ] **Unpatched transitive advisories (after 2026-11 override prune).** No in-major fix; forcing them crosses a major inside a dependency:
  - `adm-zip` <0.6.0 (high) via `strapi-plugin-config-sync` — wait for plugin release.
  - `@graphql-tools/utils` ≤12.0.0 (high) via `@strapi/plugin-graphql` → `@apollo/server` — wait for Strapi.
  - `sharp` <0.35.0 (high) via `astro` — recheck after the Astro 7 upgrade.
- [ ] **Refactor `setState` inside effects** (`react-hooks/set-state-in-effect`, downgraded to warn when eslint-config-next 16.4 made it an error): analytics `ai/prompts/page.tsx:55,62`, `ai/trajectories/page.tsx:222`, `forms/page.tsx:171`, `components/common/LoginOverlay.tsx:59`; storybook `key-value.stories.tsx:70`. Restore the rule to error after.
- [ ] **Vercel preview of the portfolio before merging.** Astro 7 + Vite 8 can't be built locally (OOM), and Vite 8 changed CommonJS interop (`react-countup` broke in dev). Check the journey page charts, Rin chat streaming (AI SDK 7, no local gateway key), and the 500 page on the preview.
- [ ] **Audit `compressHTML: 'jsx'`.** `apps/portfolio/astro.config.mjs` pins `compressHTML: true` to keep Astro 6 whitespace. Check inline-element spacing, then drop the pin to use Astro 7's default.
- [ ] **ESLint 10 (blocked upstream).** `eslint-plugin-react`, `eslint-plugin-jsx-a11y`, and `eslint-plugin-import` (pulled in by `eslint-config-next` and the Storybook config) peer on ESLint ≤9, and `eslint-plugin-astro` 3 / `astro-eslint-parser` 3 require ESLint 10. Upgrade all five together once those three plugins support ESLint 10.
- [ ] **git-cliff skips 120 commits** with grouping errors, so they're missing from `CHANGELOG.md`. Run `git cliff -vv` to find the unmatched commit types and add groups to `cliff.toml`.

## Carried over

- [ ] **Host Rin's `.riv` asset** and set `PUBLIC_RIN_CHARACTER_SRC`. `RinCharacter` falls back to the static SVG until then.
- [ ] **10 Playwright smoke tests** (from Phase 4).
