# 🎛️ Feature: Analytics Visual Identity (Avra Realignment)

📍 **Related Documentation:** [AZUCENA_LYTICS Plan](./azucena-lytics-plan.md) | [Architecture](../architecture.md) | [Avra Design System](https://avra.aazucena.com) | [Ecosystem Overview](../ecosystem/README.md)

## 🎯 Objective

Realign the AZUCENA_LYTICS dashboard (`apps/analytics`) onto the **Avra** design system.

The dashboard currently reads as a generic AI-generated analytics template rather than as a node in
this ecosystem. This is not a case of Avra being unavailable to it: `apps/analytics/package.json:23`
**already declares `@aazucena/design-system` as a workspace dependency**. The system is installed and
unused, while the interface paints in stock Tailwind `zinc` and stock D3 chart palettes.

Avra's own stated intent (`apps/storybook/stories/docs/introduction.mdx:21`) is that it should be
"invisible when it's working, immediately noticed when it's absent." This is the absent case.

**This document is a direction spec, not an implementation ticket.** The five decisions in
§3 are unanswered by design and are the owner's to author. No implementation begins until they are.

---

## 1. How this happened

`git log -- apps/analytics` records 32 commits. The entire visual layer landed on **2026-02-03** in
six commits (`53bc870` → `5085659`). Every one of the 26 commits since is data-layer work: ClickHouse
schemas, webhook handlers, Vercel log drains, auth middleware, ingestion fixes.

There is no design-iteration commit in the app's history. The UI was generated once and frozen while
engineering attention moved to the pipeline beneath it.

---

## 2. Audit — current state (as of 2026-09-07)

### 2.1 Distinctive — keep and build on

- **Copy voice.** `CORE_OPERATIONAL`, `SIGNAL_LINK_SEVERED`, `Sentinel_Watchdog_v1`,
  `AZUCENA_LYTICS // Core_Terminal`. This is the strongest identity signal in the app.
- **Typographic rhythm.** Micro-caps eyebrows at 8–10px with `tracking-[0.2em]`–`[0.4em]`, set
  against `font-black tracking-tighter` display type.
- **Nav concept.** The SYSTEM / INTELLIGENCE mode switch is an unusual and ownable idea.
- **Motion.** framer-motion across 4 components, ping/pulse status dots, a 30s delayed-entrance
  easter egg.

### 2.2 Generic — the actual problem

- **Color.** Custom OKLCH cyan `#32A0C5` and coral `#FF7B54` ramps are defined and never used. The
  UI paints `zinc-*` — 381 background hits, 631 text hits. Semantic utilities (`bg-card`,
  `bg-background`, `border-border`) appear nowhere in app TSX, so the token layer is decorative:
  changing `--primary-500` would recolor accents and leave every surface, border, and text color
  untouched.
- **Charts — the weakest link.** The D3 components ship **Tableau10 defaults**, fixed `#94a3b8` axis
  fills, and unthemed `rgba(0,0,0,0.8)` tooltips. No `colorMap` is passed anywhere.
- **The panel.** A single class string is duplicated **verbatim 23 times** across 11 page files:

  ```
  bg-white/50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800
  rounded-[2.5rem] p-8 backdrop-blur-md transition-all duration-300
  ```

  Distribution: `easter-eggs` ×4, `page.tsx` ×3, `ai/costs` ×3, `performance` ×3, `traffic` ×2,
  `music` ×2, `finance` ×2, and one each in `logs`, `forms`, `ai/prompts`, `ai/trajectories`.

  Glass panel + oversized radius + backdrop-blur is the most recognizable signature of LLM-generated
  dashboards. Because the identity lives in duplicated strings rather than components, it is
  consistent today and structurally fragile.

### 2.3 Broken underneath

These are defects independent of any aesthetic decision.

| Issue                               | Location                                                                                            | Effect                                                                                                                       |
| ----------------------------------- | --------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `tailwind.config.ts` never compiles | no `@config` in `globals.css`; postcss uses `@tailwindcss/postcss` only                             | 4px spacing grid, named `fontSize` scale, `maxWidth.container`, `minHeight.touch-target`, `hue-shift` animation are all dead |
| Font mismatch                       | `globals.css:456-461` declares Fira Sans/Code; `src/app/layout.tsx:7-15` loads Inter/JetBrains Mono | Fira is never fetched                                                                                                        |
| Radius contradiction                | `globals.css:412-416` caps `--radius-xl` at `0.75rem`; pages use `rounded-[2.5rem]` ×35             | token ignored                                                                                                                |
| Broken shadcn path                  | `components.json:8` → `src/app/globals.css` (real: `src/styles/globals.css`)                        | `shadcn add` writes to the wrong place                                                                                       |
| No theme-init script                | `src/app/layout.tsx`                                                                                | first paint always light; hydration flash for dark-mode users                                                                |
| Hardcoded color                     | `components/ui/timeline.tsx:83` `text-white`                                                        | unreadable in light mode                                                                                                     |
| Dead duplicate shell                | `src/layouts/RootLayout.tsx`                                                                        | byte-level duplicate of `(dashboard)/layout.tsx`, unreferenced, re-declares `metadata` and font loaders                      |

---

## 3. Decisions — OWNER-AUTHORED

All five answered 2026-11-10. A static prototype of the Overview page (ecosystem rail as the signature element) was reviewed the same day.

### D1 — Surface language

Does the glass panel (`rounded-[2.5rem]` + `backdrop-blur-md`) stay as intentional identity, or is it
precisely the thing being replaced? If replaced, what governs surfaces instead — flat bordered
instrument panels, hairline dividers, elevation via shadow, something else?

> **Decision (2026-11-10): Replace the glass panel with instrument panels.** Flat surface, 1px hairline
> border, square or 2px corners, no `backdrop-blur`. Each panel carries a framed header strip (micro-caps
> label, e.g. `TRAFFIC // 30D`, with a status indicator at the right edge). Elevation comes from borders and
> surface steps, not shadow or blur.

### D2 — Palette authority

Which Avra vibe governs the analytics node? `packages/design-system/src/themes/registry.ts` registers
**17** vibes (`default`, `minimal`, `nature`, `cyberpunk`, `hoyoverse`, `glass`, plus 11 seasonal).
Options: adopt an existing vibe, or register a dedicated analytics vibe.

> Note: five documents claim "18 themes" (`ROADMAP.md:77`, `docs/CONTEXT.md:22`,
> `docs/architecture.md:189`, `README.md:338`, `packages/design-system/README.md:88`) against 17
> actually registered. Reconcile while here.

> **Decision (2026-11-10): Register a dedicated analytics vibe** in `packages/design-system/src/themes/`,
> built on the existing cyan (`oklch(0.64 0.11 215)`, `#32A0C5`) and coral (`oklch(0.69 0.15 35)`,
> `#FF7B54`) ramps over a near-black base. Cyan is the primary/data color. **Coral is reserved for
> alerts, anomalies, and destructive states** and never used as a plain series color. The vibe defines
> this accent language itself; the "SHADES gradient" wording in node specs (§5) gets reconciled to it
> afterward rather than blocking it.

### D3 — Chart color language

What categorical ramp replaces Tableau10, and where does it live so that all 21
`@aazucena/visualizations` components inherit it rather than each being passed a prop? Also needs
resolving: sequential and diverging ramps, axis/gridline color, and tooltip surface.

> **Functional states (2026-11-11):** success = mint `#55c1a3` (dark) / `#007b62` (light), replacing stock green. It was chosen for the best color-blind separation from coral. New warning = amber `#d9a02c` / `#896100`, always marked ◆ (coral keeps ▲). All pass AA on both panels.
>
> **Decision (2026-11-10): approved.** Categorical order, validated with the dataviz palette validator
> (dark mode, all checks pass on both `#13232B` panel and `#0E1A20` ink): **`#32A0C5` signal → `#889D37` olive →
> `#7C5BC5` violet → `#D4679F` rose.** Coral `#FF7B54` is status-only and always paired with a ▲ marker.
> Surfaces: ink `#0E1A20`, panel `#13232B`, rule `#24404C`, text `#D7E6EC`, muted `#7F9AA5`.
> Original proposal:
>
> - **Categorical:** led by cyan; additional series spread around the OKLCH hue wheel at matched
>   lightness/chroma, **skipping the coral hue band (~20–50°)** so alerts stay unambiguous. Validate
>   contrast and color-vision-deficiency separation before locking values.
> - **Sequential:** single-hue cyan ramp (light → dark), used for heatmaps and magnitude.
> - **Diverging:** cyan ↔ neutral ↔ coral, only for above/below-baseline data where "below" is bad.
> - **Axes/gridlines:** `border` token at reduced opacity, never a hardcoded slate.
> - **Tooltip:** instrument-panel surface (same as D1), hairline border, Fira Code values.
> - **Home:** defaults live in `packages/visualizations/src/hooks/` so all 21 chart components inherit
>   them with no per-call `colorMap`.

### D4 — Typeface

Fira Sans / Fira Code (declared) or Inter / JetBrains Mono (loaded)? One of the two declarations is
wrong and must be deleted, not left contradictory.

> **Decision (2026-11-10): Fira Sans + Fira Code.** Keep the `globals.css` declaration; delete the
> Inter / JetBrains Mono loaders in `src/app/layout.tsx` and load Fira there instead.

### D5 — Density

The current shell is airy — `max-w-7xl` main with `p-8` panels. An instrument/terminal reading would
be considerably denser. This decision governs spacing scale, table row heights, and chart aspect
ratios.

> **Decision (2026-11-10): Dense terminal.** Full-width layout (drop `max-w-7xl`), 12–16px gutters,
> compact table rows, panel padding around `p-3`/`p-4` instead of `p-8`. Optimize for data per screen.

---

## 4. Implementation outline

Fully unblocked. Ordered by leverage-per-effort, smallest first.

1. **Chart defaults.** Centralize color, axis, and tooltip defaults in
   `packages/visualizations/src/hooks/` so every consumer inherits them. Replace `#94a3b8` axis fills
   and the `rgba(0,0,0,0.8)` tooltip with token references, and set tooltip type to the mono stack.
   _This single step removes the most template-looking element in the app._
2. **Extract primitives.** Create `Panel`, `PageHeader`, `SectionTitle` in
   `apps/analytics/src/components/` and retire all 23 duplicated class strings plus the repeated
   `h1`/`h3` patterns (12 files each).
3. **Repair the token layer.** Add `@config` to `globals.css` or delete `tailwind.config.ts`;
   resolve D4 across `globals.css` + `layout.tsx`; reconcile `--radius-xl` with actual usage; fix
   `components.json:8`.
4. **Route surfaces through semantic tokens.** Replace `zinc-*` surface/border/text usage with the
   semantic scale so the vibe from D2 actually governs the interface.
5. **Cleanup.** Add a blocking theme-init script to `layout.tsx`; fix `timeline.tsx:83`; delete
   `src/layouts/RootLayout.tsx`.

---

## 5. Terminology note

Four distinct concepts have shared the name SHADES in this repo. For the record:

- **Avra** — the design system. `packages/design-system/`, documented at avra.aazucena.com.
- **SHADES** — the inquiry-scoring framework: **S**entiment, **H**istory, **A**lignment, **D**rive,
  **E**conomics, **S**ignal. Defined in `docs/features/inquiry-firewall.md:19-26`.
- **Knowledge-source highlighting** — the `[KNOWLEDGE_SOURCE]` styling in Trajectory Labs, formerly
  also called "SHADES Highlighting."
- **A gradient / accent visual language** — used across the ecosystem node specs: "SHADES gradients"
  (`docs/ecosystem/nodes/gage.md:84`), "SHADES gradient accents" (`sona.md:41`), "SHADES accent
  colors" (`cast.md:157`), "SHADES-styled components" (`cast.md:61`), "a stylized SHADES interface"
  (`dar.md:23`).

**This fourth usage is unresolved and is a prerequisite for D2.** Five node specs describe visual
identity in terms of "SHADES" gradients and accents. Either that is a real gradient/accent system
that needs defining inside Avra under a non-colliding name, or the wording is inherited from the same
drafting error corrected in `docs/ecosystem/README.md`. Settle this before answering D2 — it
determines whether the analytics palette inherits an existing ecosystem-wide accent language or
defines one.

---

## ✅ Success Criteria

- A visitor cannot produce a lookalike of this dashboard from a one-shot prompt.
- Changing the governing vibe in `@aazucena/design-system` visibly re-skins the entire analytics app.
- No panel/heading class string is duplicated more than once.
- Charts read as part of the same system as the surfaces around them.
- `tailwind.config.ts`, `globals.css`, and `layout.tsx` agree with each other.

---

**Last Updated:** 2026-11-10
**Status:** 🟢 UNBLOCKED — scheduled in the next release (`phase-5/next-release`, see [backlog](../next-release-backlog.md))
**Remaining gate:** none. Audit counts in §2 re-verified 2026-11-10 (381 `bg-zinc`, 632 `text-zinc`, unchanged).
