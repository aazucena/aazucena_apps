# Avra Redesign, Part 2: Finish the Library, Then Adopt It Everywhere

> On approval, copy to `docs/superpowers/plans/2026-11-12-avra-redesign-completion.md` and execute with superpowers:executing-plans (inline, one final fresh-context review). Steps use `- [ ]`.

## Context

Part 1 (`docs/superpowers/plans/2026-11-11-avra-instrument-redesign.md`, 32 local commits) put the instrument language into `@aazucena/design-system` and `@aazucena/ui`. It left these behind, as its final report said:

- The 255-file codemod was reviewed **by pattern**. Nobody has looked at each component in Storybook yet.
- The allowlist and inline-style colors, plus five deferred minors.
- **I4:** seasonal vibes show default cyan on actions.
- The analytics app, the chart package and the portfolio were out of scope.
- **Figma gaps:** no glass/cyber/gradient variants; Tier-2 categories only have pattern sheets; only 6 stories link to Figma.

The owner chose (2026-11-12) to cover **all four workstreams**, and for I4, that **vibes bring their own accent**. Owner process rule from Part 1: **Figma first for review, then code.** Phase 1 below restyles against the already-approved Figma kits. Phases 3–5 wait for the Phase 2 Figma gate.

## Global constraints (carried from Part 1)

- **Tokens:**
  - Use `bg-panel`, `bg-state`, `border-rule`, `text-signal`, `rounded-card|control`, `h-control`, `micro-label`, `--series-1..4`, `--chart-*`, `--motion-*`. Never stock palette classes.
  - Coral (`alert`) is for alerts and destructive states only, always with a ▲ marker. Status grammar: ● info, OK success, ◆ warning, ▲ alert.
- **Shape and density:** card 6px, control 4px, 1px rules, no shadows or blur on default surfaces, controls 30/36/44, Fira Sans + Fira Code.
- **Contrast:** AA (4.5 body, 3 UI), checked by tests, not by eye.
- **API:** no component API breaks; deprecations only (0.3.0 removal list).
- **Process:**
  - Commit locally per concern, staging paths explicitly. No AI attribution trailers. Never push or branch.
  - Every package change gets a changeset (ui / design-system / visualizations: minor).

## Phase 0: Tokens (unblocks everything)

### Task 0.1: Vibes bring their own accent (I4)

- **Files:**
  - `packages/design-system/src/utils/aliases.ts`
  - `utils/generate-css.ts`
  - `utils/_theme-core.ts`
  - `src/themes/*.ts`
  - `packages/types/src/config.ts`
- [ ] Failing test first, in `generate-css.test.ts`: **loop all 17 vibes × light/dark**. Each must emit `--signal`, `--signal-foreground`, `--signal-faint|subtle|line`, and pass these:
  - `signal-foreground`/`signal` ≥ 4.5
  - `signal`/`panel` ≥ 3 (UI)
  - text on `signal-subtle` ≥ 4.5
- [ ] **Implement:**
  - `deriveAliases` derives `signal = c.signal ?? c.primary`, and the tints from it with `getColor`-style alpha (8/15/40%). It does the same for `series1` and `chartSeq*` when absent.
  - Emit the derived values in both the static CSS and the runtime `writeThemeConfig`, so `ThemeManager` switches clear and re-write them (keep the C1 stale-token fix).
- [ ] **Fix failing vibes** by nudging the primary weight in each `themes/<vibe>.ts`. Known risks: glass (translucent primary; composite it over the background), new-years light zinc400, easter dark purple300. `minimal`/`nature` dark inherit default (cyan); give them their own dark primary.
- [ ] **Vibe matrix:** extend `apps/storybook/stories/design-tokens/vibes-matrix.stories.tsx` `checkRows` with `signal-foreground` on `signal` and a check that `--signal` differs per vibe. Add the matrix story to the visual globs in `.storybook/interaction-tests.ts`.
- [ ] Commits: `✅ test(design-system): every vibe emits an AA signal`, `🎨 feat(design-system): vibes derive signal from their primary`, `♿ fix(design-system): per-vibe primary contrast`, changeset.

### Task 0.2: Chart theme module

- [ ] **Add** `packages/design-system/src/tokens/chart.ts`:
  - `chartTheme` exports CSS `var()` strings (`series: ['var(--series-1)'…]`, `seq`, `div`, `grid`, `axis`, `tooltip` surface/rule/text, `fontMono`).
  - D3 accepts `var()` in fill and stroke, so charts follow vibe and mode switches with no `getComputedStyle`.
- [ ] Rewrite or delete the unused `src/integrations/d3/scales.ts` (stale primary/zinc palette) so that it re-exports `chartTheme`.
- [ ] Test it in `generate-css.test.ts`: every `chartTheme` var name exists in the generated CSS.

## Phase 1: Per-component pass on `@aazucena/ui` (against the approved Figma kits)

### Task 1.1: Screenshot sweep by category

- [ ] **Run** `pnpm --filter @aazucena/storybook test:visual` locally, sharded, in light and dark, with the default vibe plus one seasonal vibe (christmas) to show I4. PNGs land in `apps/storybook/screenshots/`.
- [ ] **Review** in the Figma Tier-2 category order: forms, navigation, overlays, feedback, data, marketing/content, media, complex data, effects, AI/system, layout. For each component, compare against its Core kit, Analytics kit or Patterns frame.
- [ ] **Look for:**
  - empty fills or invisible text
  - leftover glow, pill or rounded-xl shapes
  - text on `bg-accent` without matching text
  - translucent surfaces
  - status without a marker
  - density off-grid
- [ ] **Log the findings** in a ledger (scratchpad) as `file — problem — fix`. Fix them in batches per category: `🎨 style(ui): instrument pass, <category>`.
- [ ] **Gate per batch:** `pnpm --filter @aazucena/ui type-check`, `pnpm --filter @aazucena/storybook test:ci`, `pnpm --filter @aazucena/design-system test`.

### Task 1.2: Allowlist, inline colors, deferred minors

**Allowlist and inline colors.** Tokenize the cyan glows and grids as `signal`-based arbitrary values: `shadow-[0_0_10px_var(--signal-line)]`, `[background-image:…var(--signal-faint)…]`.

- [ ] `brand-logo.tsx:21`
- [ ] `device-mockup.tsx:65`
- [ ] `map.impl.tsx:51`
- [ ] `color-picker.tsx:39` (chrome only; the swatches stay literal)
- [ ] `cta.tsx:30`
- [ ] `environment.tsx:64`
- [ ] `react-wheel-picker.tsx:192`

**Keep these, and document them in the backlog line:**

- [ ] `hover-3d-card` white glare
- [ ] `coming-soon` RGB scanlines (an effect)
- [ ] `tour` scrim → `var(--scrim)`
- [ ] `preloader-overlay` hoyoverse literal → `bg-panel`

**Deferred minors.** Each gets a play test or guard first.

- [ ] **Panel:** `status` defaults to `none` (`panel.tsx` L25/41/86). Stories that show LIVE pass it explicitly.
- [ ] **Badge `destructive`:** renders the ▲ marker itself (`badge.tsx:15`).
- [ ] **Select item:** uses `rounded-control` (`select.tsx:150`).
- [ ] **`hover:bg-accent`:** gets `hover:text-accent-foreground` in combobox L24/173, cascader L24/211, datepicker L24, button-group L54 and code-block L94. Add a guard to `ui-token-usage.test.ts`: `hover:bg-accent` must co-occur with `hover:text-accent-foreground`.
- [ ] **Cyber secondary text:** at 40–60% signal → `text-muted-foreground` or `signal` at full opacity (find it with `rg "text-signal/[4-6]0"`).

**Wrap-up.**

- [ ] Update the backlog's "Instrument sweep allowlist" line to what's actually left. Changeset.

## Phase 2: Figma completeness (owner review gate)

File `KIKPyhRdGbeBhj8dS0km2G`. Load `figma-use` + `figma-generate-library` first, then `create_session`. Build from instances of the existing masters and bind every paint to a variable. Make a dark and a light board for each.

### Task 2.1: Library gaps

- [ ] **Variants:** add glass, cyber and gradient (deprecated) variants to the Button, Badge, Input, Select and Card sets. Glass = `panel-glass` + rule; cyber = signal rule + mono. Add the open Select listbox.
- [ ] **Tier-2 categories:** promote them from pattern sheets to full component sets for components the apps actually use (analytics: Timeline, MetricCard pattern, CommandPalette are already there; check the rest against the Phase 1 ledger). The remainder stay pattern sheets.
- [ ] **Vibe preview:** a `Vibes` board showing Panel/Button/Badge in 4 representative vibes (default, christmas, halloween, northern-lights) after I4. This needs a `Theme` variable mode per vibe, or the board is a code-generated screenshot.
- [ ] **Code Connect / story links:** set `parameters.design` on every story whose component has a Figma set (today there are 6 links). Batch commit: `📝 docs(storybook): link stories to Figma frames`.

### Task 2.2: App screens

- [ ] **Analytics:** frames for the screens beyond Overview, built from the Analytics kit: Traffic, AI (Terminal), AI Costs, Trajectories, Logs, Performance, Status, and the Login overlay. Show the shell once (Sidebar, Header, CommandPalette), then each page's panel grid.
- [ ] **Portfolio:** frames for the homepage sections (Hero, About, Experience, Projects, Skills, Services, Awards, Testimonials, Blog, Exit), plus the Journey dashboard, Editorial template and Footer.
  - **Owner decision to surface in review:** how far the instrument language reaches into the expressive homepage. Recommendation: the instrument language applies to chrome, cards, type and data UI. Three.js/Pixi scenes keep their atmosphere, with particle colors moved to the signal and series hues.
- [ ] **Review handoff (STOP):** send the frame links with a 5-line summary, and wait for approval. Record it in `docs/features/analytics-visual-identity.md` §3, and in a new `docs/features/portfolio-visual-identity.md`.

## Phase 3: Charts (`packages/visualizations`)

- [ ] **Replace hardcoded chart colors** with `chartTheme`:
  - Replace `d3.schemeTableau10` in the 15 files: 12 hooks plus `ForceDirectedGraph`, `InteractiveTimeline` and `LineChart` (drop the inline Tableau hex).
  - Replace `interpolateBlues` in `useHeatmap` with the `seq` ramp.
  - Replace the 63 hex literals with tokens: `#94a3b8` → axis, `#e5e7eb` → grid, `#fff` separators → `var(--panel)`, the gray ramp in `useSpiderChart` → seq/neutral.
  - Replace the `var(--color-primary, #3b82f6)` defaults with `var(--series-1)`.
- [ ] **One tooltip helper** in `src/hooks/` (panel surface, rule border, mono, no blur), used by StreamGraph, ForceDirected, Bar, Heatmap, Spider and Sankey.
- [ ] **Chart chrome:** `ChartExportControl`, `InteractiveTimeline` buttons, `SpiderChart` and `LineChart` hover move to ui tokens and components.
- [ ] **Guard:** a test that greps `packages/visualizations/src` for `scheme|#[0-9a-f]{3,6}\b|interpolate(Blues|…)` and expects 0. Add vitest to visualizations, or put the guard in design-system next to `ui-token-usage.test.ts`.
- [ ] Verify with the 6 chart story files under `stories/charts/` (add them to the visual globs), light and dark. Changeset.

## Phase 4: Analytics app adoption (spec §4, adjusted)

- [ ] **Token layer (step 3 first, since nothing renders without it):**
  - `apps/analytics/src/styles/globals.css` imports `@aazucena/ui/globals.css` and `@aazucena/ui/core.css`. Drop its duplicate `@theme inline` radii and the conflicting vars.
  - Delete the unwired `tailwind.config.ts`.
  - Fix `components.json:8`.
  - `layout.tsx`: replace Inter/JetBrains Mono with Fira Sans + Fira Code (next/font), and the body `bg-zinc-*` with `bg-background text-foreground`.
  - Add a blocking theme-init script.
  - Add `@aazucena/utils` to `package.json`.
- [ ] **Primitives:** use `Panel`/`PanelHeader`/`PanelBody` from `@aazucena/ui`, not a local copy. Add local `PageHeader` + `SectionTitle` in `src/components/common/`. Replace the 23 glass class strings (the `rounded-[2.5rem] p-8 backdrop-blur-md` family) and the repeated h1/h3s.
- [ ] **Pages:** go page by page following the Phase 2 frames: overview, traffic, finance, music, performance, logs, ai, ai/costs, ai/prompts, ai/trajectories, journey, forms, easter-eggs, status, error/not-found/loading. Then the 19 components (Sidebar, Header, CommandPalette, LoginOverlay, ConfirmationModal, AdminMenu, IntegrityBadge → Badge status, MetricCard, ThemeToggle → ui Switch, DashboardFilters, SentinelWatchdog, logs/*).
- [ ] **Semantic tokens:** remove the stock palette (zinc 1,365, rose 86, emerald 70, …). Map by meaning: rose → alert, emerald → success, amber → warning.
- [ ] **Density (D5):** remove `max-w-7xl`, panel padding 20px, gutter 24px.
- [ ] **Cleanup:** fix `timeline.tsx:83`, delete `src/layouts/RootLayout.tsx`.
- [ ] **Guard + check:**
  - `rg -c "zinc-|slate-|gray-|backdrop-blur|rounded-(2xl|3xl|\[)" apps/analytics/src` reaches 0.
  - `pnpm --filter analytics type-check` + `lint`.
  - Commit per page group.

## Phase 5: Portfolio

- [ ] **Token layer:**
  - `apps/portfolio/src/styles/globals.css` imports `@aazucena/design-system/css-vars.css` + `@aazucena/ui/globals.css`.
  - Its own `--primary-*`/`--secondary-*`/`--chart-1..5` palette becomes aliases of Avra roles, then is removed once there are no consumers.
  - Move the `site.ts` theme hex values (`#60a5fa`, `#a78bfa`, `#22d3ee`) to tokens. Fonts already match (Fira).
- [ ] **Shared chrome first** (highest fan-out): `layouts/` (Base, Page, Detail, List, Home), `templates/`, `Footer.astro`, `components/common/`, `ui/common/` (GlassCard → ui `Card`/`Panel` treatment; the local drawer `Panel.tsx` is renamed `SlidePanel` to avoid confusion with the ui Panel).
- [ ] **Pages:** `src/pages/` (about 420 gray and 143 white/black utilities), then `ui/journey` (144 gray), `ui/blog`, and the homepage sections + overlays, following the Phase 2 frames.
- [ ] **Animation colors:** move `config/animations.ts` `PARTICLE_PRESETS` (16 `0x` hex values) and the inline colors in `NewspaperStack`/`PhoneDialTabs` to values from the signal and series roles. Read them at runtime via `getComputedStyle` once at scene init, since Three.js needs numbers rather than `var()`.
- [ ] **Guard:** a stock-hue grep over `apps/portfolio/src` (blue 362, purple, red, …) reaches 0 outside documented exceptions.
- [ ] **Gate:** `pnpm --filter portfolio type-check` (builds OOM locally; Vercel preview is the build check), and dev-server screenshots of `/`, `/journey`, `/blog`, `/about` with the repo Playwright, light and dark.

## Verification

- **Each phase:**
  - `pnpm --filter @aazucena/design-system test`
  - `type-check` for design-system, ui, visualizations, storybook, analytics, portfolio (whichever were touched)
  - `pnpm --filter @aazucena/storybook test:ci` green
- **Visual:**
  - Local `test:visual` screenshots reviewed per category (Phase 1).
  - Charts and the vibe matrix added to the visual globs.
  - Argos shows an intentional full diff on main; approve it as the new baseline after merge.
- **Apps:** dev server + Playwright screenshots of every analytics page and the four portfolio pages, compared with the Phase 2 frames via `get_screenshot`.
- **Guards:** the new tests stay green:
  - all-vibe AA
  - `hover:bg-accent` pairing
  - visualizations no-literal-color
  - analytics/portfolio stock-palette greps at 0
- **Attribution:** `git log --format=%B main..HEAD | grep -ci co-authored` = 0.
- **Docs:** backlog items ticked; `CONTEXT.md` one-liners (chartTheme, vibe signal derivation); ROADMAP/README status lines.
- **Final step:** one fresh-context review of the whole branch, then triage.
