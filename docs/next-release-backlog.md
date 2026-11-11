# Next Release Backlog

**Branch:** `phase-5/next-release` · **Ships as:** `phase-5` tag · **Started:** 2026-11-10

Phase 5 testing plus the work that piled up during a ~5 month break: analytics UI redesign, new features, and maintenance. Phase 5 testing scope lives in [phase-5-testing.md](./phase-5-testing.md).

---

## Analytics UI

- [ ] **Avra visual identity realignment for AZUCENA_LYTICS.** The dashboard reads like a one-shot Claude artifact: glass cards, stock zinc, Inter + JetBrains Mono, Tableau10 charts, airy layout. Direction decided 2026-11-10 (instrument panels, dedicated cyan/coral vibe, Fira, dense). All five decisions made; Overview prototype reviewed. Spec and implementation order: [analytics-visual-identity.md](./features/analytics-visual-identity.md).
- [ ] **Mirror the locked analytics tokens as Figma variables** (unblocked: Figma Starter full seat, 2026-11): ink, panel, rule, text, muted, signal, alert, plus the four categorical colors in order. Later design passes start in Figma instead of HTML prototypes.

## Storybook (Avra)

- [ ] **Link Figma frames to stories.** `@storybook/addon-designs` is registered in `apps/storybook/.storybook/main.ts` but no story sets `parameters.design`. Once the Figma design system exists, add `design: { type: 'figma', url }`, starting with the analytics `Panel` and `PageHeader`. (Figma's Storybook Connect plugin needs a Chromatic-published Storybook, which is still deferred; `addon-designs` works without it.)
- [ ] **Rin character story.** Add `stories/components/rin-character.stories.tsx` with the SVG fallback (no src) and the `.riv` (once hosted), plus an `emotion` control over the 22 EmotionSM values.

## Features

_To be filled in from the feature list._

## Maintenance

- [x] **Dependency maintenance pass (2026-11-11).** Plan: [2026-11-10-maintenance-pass.md](./superpowers/plans/2026-11-10-maintenance-pass.md). `pnpm audit` went from 29 critical / 171 high to 0 critical / 9 high (all Strapi-plugin transitives, listed below). Node 22 baseline; Strapi 5.61, Next 16.4, Astro 7, Storybook 10.6, Vitest 5, Vite 8, Zod 4, AI SDK 7, Sentry 11. Deferred: ESLint 10, TypeScript 7, d3-cloud 2 (entries below).
- [ ] **Smoke-test Strapi 5.61 locally.** Skipped during the pass because it would run forward-only migrations on the shared local Postgres used by the `aazucena-cms` container (5.45). Rebuild the container (`docker compose build cms`) and check the admin, navigation, CKEditor field, and config-sync pages.
- [ ] **Remove the React 19.2 `suspendOnActiveViewTransition` polyfill** from `index.astro` if React 19.3 no longer needs it (check the Vercel preview without it).
- [ ] **Re-enable Plausible with a ClickHouse memory cap.** The Plausible container on Railway was disabled 2026-11-10 to stop the cost spike (unbounded ClickHouse memory, $5 → $50+/mo). Fix: fork `railwayapp-templates/plausible`, add `<max_server_memory_usage>1610612736</max_server_memory_usage>` (1.5GB) to `packages/clickhouse/ch-config.xml`, repoint the Railway service source to the fork, redeploy, then confirm memory stays under the cap. Data is preserved on the `clickhouse-volume` volume.
  - While disabled: the portfolio requests a dead `script.js` on every page (unset `PUBLIC_PLAUSIBLE_API_HOST` in Vercel to stop it), and analytics `/api/stats/plausible` returns 500.
- [ ] **Fix option merge order in `PlausibleScript.astro`.** `apps/portfolio/src/components/common/PlausibleScript.astro` builds config as `{ ...opts, ...defaultOptions }`, so defaults overwrite caller props (e.g. `outboundLinks={true}` silently becomes `false`). Swap to `{ ...defaultOptions, ...opts }`.
- [ ] **Unpatched transitive advisories (after 2026-11 override prune).** No in-major fix; forcing them crosses a major inside a dependency:
  - `adm-zip` <0.6.0 (high) via `strapi-plugin-config-sync` — wait for plugin release.
  - `@graphql-tools/utils` ≤12.0.0 (high) via `@strapi/plugin-graphql` → `@apollo/server` — wait for Strapi.
  - `zod` 3.x (high, fixed only in 4.6.6) via `@strapi-community/cloudinary-media-library` — wait for plugin release.
- [ ] **Refactor `setState` inside effects** (`react-hooks/set-state-in-effect`, downgraded to warn when eslint-config-next 16.4 made it an error): analytics `ai/prompts/page.tsx:55,62`, `ai/trajectories/page.tsx:222`, `forms/page.tsx:171`, `components/common/LoginOverlay.tsx:59`; storybook `key-value.stories.tsx:70`. Restore the rule to error after.
- [ ] **Vercel preview of the portfolio before merging.** Astro 7 + Vite 8 can't be built locally (OOM), and Vite 8 changed CommonJS interop (`react-countup` broke in dev). Check the journey page charts, Rin chat streaming (AI SDK 7, no local gateway key), and the 500 page on the preview.
- [ ] **Audit `compressHTML: 'jsx'`.** `apps/portfolio/astro.config.mjs` pins `compressHTML: true` to keep Astro 6 whitespace. Check inline-element spacing, then drop the pin to use Astro 7's default.
- [ ] **ESLint 10 (blocked upstream).** `eslint-plugin-react`, `eslint-plugin-jsx-a11y`, and `eslint-plugin-import` (pulled in by `eslint-config-next` and the Storybook config) peer on ESLint ≤9, and `eslint-plugin-astro` 3 / `astro-eslint-parser` 3 require ESLint 10. Upgrade all five together once those three plugins support ESLint 10.
- [ ] **Port the word cloud to d3-cloud 2.** v2 replaces the `cloud()` factory and `.on('end')` events with a `CloudLayout` class and explicit sprite placement (see the package's `MIGRATING.md`). `packages/visualizations/src/hooks/useWordCloud.ts` stays on `d3-cloud@^1.2.9` until it's rewritten.
- [ ] **TypeScript 7 (blocked upstream).** `typescript-eslint` peers on TypeScript `<6.1.0` and `@astrojs/check` on `^5 || ^6`. Repo stays on `^5.9.3`. TypeScript 6 is allowed by both and is a possible intermediate step.
- [ ] **git-cliff skips 120 commits** with grouping errors, so they're missing from `CHANGELOG.md`. Run `git cliff -vv` to find the unmatched commit types and add groups to `cliff.toml`.

## Carried over

- [ ] **Author and host Rin's `.riv`** (unblocked: Rive Cadet plan, 2026-11). Build EmotionSM (22 emotions) and MovementSM (5 behaviors) with the input names in [rin.md](./features/rin.md), export, host, and set `PUBLIC_RIN_CHARACTER_SRC`. `RinCharacter` falls back to the static SVG until then.
- [ ] **10 Playwright smoke tests** (from Phase 4).
