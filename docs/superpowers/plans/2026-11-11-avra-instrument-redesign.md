# Avra Instrument Redesign: Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development or superpowers:executing-plans. Steps use `- [ ]`. On approval, copy this file to `docs/superpowers/plans/2026-11-11-avra-instrument-redesign.md`.

**Goal:** Replace Avra's stock-shadcn/glassmorphism look with the "instrument" language. Design it in Figma first for owner review, then implement it in `@aazucena/design-system` + `@aazucena/ui`.

**Architecture:**

- **Tokens are the lever.** The default vibe gets tinted ink neutrals, hairline rules, a 2px radius and signal/alert roles.
- **Components read tokens.** Components stop hardcoding colors and read the semantic variables instead.
- **`glass`/`cyber` keep their prop names** but become token-driven treatments.
- **Figma review gate.** Code starts only after the owner approves the Figma frames.

**Tech stack:**

- Figma MCP (`use_figma`, skills `figma-use` + `figma-generate-library`), file `KIKPyhRdGbeBhj8dS0km2G`.
- OKLCH tokens via culori, Tailwind 4 `@theme inline`, CVA.
- Storybook 10 + Argos for visual diffs.

**Spec:** `docs/features/analytics-visual-identity.md` (decisions D1–D5, 2026-11-10) + `apps/storybook/stories/docs/principles.mdx`. Owner decisions taken 2026-11-11:

1. The instrument language becomes **Avra's base**, not just an analytics vibe.
2. `glass`/`cyber` are **redefined on tokens**.
3. Figma round 1 covers **foundations + 5 core components + Panel + 1 screen**.
4. **Both modes, with dark leading.**

## Context

Storybook and the dashboard read as generic AI output, and the 2026-11-11 audit shows why:

- **Default variant:** stock shadcn: `rounded-xl`, `shadow-sm`, `ring-offset-background`, pill badges.
- **Glass:** white-alpha `backdrop-blur-xl` plus `shadow-2xl` and `rounded-[2rem]`. The `.glass` utility in `packages/design-system/src/tailwind.ts:160` is a Tailwind 3 plugin that the Tailwind 4 chain never loads, so it is dead.
- **Cyber:** stock Tailwind `cyan-*` hardcoded **836×** across 224 ui files, plus `rgba(6,182,212)` glows. That cyan is not the brand cyan, which is oklch hue 215.
- **Other hardcoded colors:** zinc 127, slate 68, gray 48, `bg-white` 149, gradient `from-` 104, `backdrop-blur` 82.
- **Neutrals:** `themes/default.ts` builds every neutral from achromatic `zinc`, and the light-mode accent is pink-500.

## Global Constraints

- **Surface tokens (dark, locked by D3):**
  - ink `#0E1A20`, panel `#13232B`, rule `#24404C`, text `#D7E6EC`, muted `#7F9AA5`
  - signal `#32A0C5` / `oklch(0.64 0.11 215)`
  - alert coral `#FF7B54` / `oklch(0.69 0.15 35)`
- **Alert rule:** coral is used only for alerts and destructive states, always paired with a ▲ marker or label, and never as a series color.
- **Categorical order:** `#32A0C5` → `#889D37` → `#7C5BC5` → `#D4679F`.
- **Shape:**
  - Radius 2px for card, button, input, select and panel.
  - Badge 2px, not pill.
  - Progress 0.
  - 1px hairline borders, no `backdrop-blur` on the default variant, no drop shadows (elevation = surface step + rule).
- **Type:**
  - Fira Sans (UI) + Fira Code (data, values, labels).
  - Micro-caps labels are 10px, `tracking-[0.2em]`, uppercase, Fira Code.
- **Density:**
  - Panel padding 12–16px, controls 32px tall (sm 28, lg 40).
  - Gutters 12–16px.
- **Light mode:** a paper-toned derivation with the same hue (215) and the same hairline/radius rules. It is not a separate design.
- **Copy voice:** keep `SNAKE_CAPS // Labels` (e.g. `TRAFFIC // 30D`).
- **Contrast:** text/background pairs must reach WCAG AA (4.5:1 body, 3:1 for large text and UI borders on interactive controls).
- **Variant API:** the `variant: 'default' | 'glass' | 'cyber'` props stay source-compatible, and no story breaks.
- **Process:**
  - Commit locally per concern, staging paths explicitly.
  - No AI attribution trailers. Never push, never branch.
  - Packages get a changeset (minor; 0.1.0 → 0.2.0).

## Review Focus

1. **Seasonal and other vibes after the default change.** The 16 non-default vibes override colors only and inherit the new radius and rule. Each must still render legibly, so Task 5 renders one story per vibe in Argos.
2. **Light mode contrast.** Paper-toned muted text on paper panels easily fails AA. Task 1's test asserts contrast for the light pairs as well as the dark ones.
3. **Focus visibility.** Without `ring-offset` and shadows, focus has to come from a 1px signal outline plus an inset rule. Task 3's interaction test asserts that a `:focus-visible` outline exists on Button/Input/Select.
4. **Glass variant on non-gradient backgrounds.** Redefined glass must stay readable on plain ink, not only on Storybook's purple gradient. Task 4 removes that gradient from `withVariantBackground`.
5. **Destructive vs alert.** `destructive` and `alert` both map to coral. The destructive button must still carry a text label or icon, never color alone (covered in Task 3's a11y run).

---

## Phase A: Figma (owner review gate)

All work goes in file `KIKPyhRdGbeBhj8dS0km2G`. Before each `use_figma` session, load the `figma-use` skill. Load `ui-ux-pro-max:design-system` before Task A1 (primitive → semantic → component token layering). Load `ui-ux-pro-max:ui-ux-pro-max` before A2/A3 for its density, contrast and data-UI guidelines.

### Task A1: Instrument foundations

**Files:** none in the repo. One scratch script, `scratchpad/instrument-tokens.ts`, computes the values with culori from the constraints above. It writes nothing to the repo.

**Produces** the variable names that code Task 1 mirrors exactly:

- `Primitives/ink/{50..950}`: hue 215, chroma ≤ 0.03. Dark ink `#0E1A20` maps to ink/950, panel `#13232B` to ink/900, rule `#24404C` to ink/800.
- `Theme` (Light/Dark): `background, panel, panel-raised, rule, rule-strong, foreground, muted-foreground, signal, signal-foreground, alert, alert-foreground, series/1..4`. Keep the existing shadcn names (`card`, `border`, `primary`, `destructive`) aliased to these, so the WEB code syntax stays stable.
- `Dimension`: `radius/control = 2`, `radius/badge = 2`, `radius/progress = 0`, `control/{sm,md,lg} = 28/32/40`, `panel/padding = 12`.
- Text styles: add `Label/Micro` (Fira Code 10 / 0.2em / uppercase) and `Data/Value` (Fira Code 13 tabular).
- Delete the effect styles that hold drop shadows. Keep one `Focus/Signal` (1px outline).

Steps:

- [ ] Generate the light-mode values: paper `oklch(0.975 0.008 215)` background, panel 0.96, rule 0.86, foreground ink/900, muted ink/600. Check every text pair in both modes for AA with the script. Expected: all pass, and the script prints the table.
- [ ] Write the variables and styles with `use_figma`, using the same per-mode approach as the 2026-11-11 foundations build (see memory `reference-figma-avra-file`).
- [ ] Verify with `get_variable_defs`: 0 broken aliases, every variable has `var(--…)` code syntax, and no variable uses ALL_SCOPES.

### Task A2: Restyle the core component sets, add Panel

**Consumes:** A1 variables. **Produces:** updated sets Button `4:62`, Badge `4:95`, Input `5:8`, Select `5:21`, Card `5:40`, plus a new Panel set (variants `status: idle|live|alert`, a `Header` text property with default `TRAFFIC // 30D`, a slot for the body). Node ids stay the same, so the Storybook `parameters.design` links keep working.

- [ ] **Button:** 2px radius, no shadow.
  - default = signal fill; outline = 1px rule; ghost.
  - destructive = alert outline + label.
  - cyber = transparent fill, 1px signal border, Fira Code uppercase, 1px inner signal glow at 30% opacity.
  - glass = panel at 70% opacity + rule, no blur.
  - Focus = `Focus/Signal`.
- [ ] **Badge:** square 2px, Label/Micro type, a status dot variant; drop the stock indigo/sky/emerald colors in favor of series/1..4 + alert.
- [ ] **Input/Select:** 32px, ink fill, 1px rule, signal rule on focus, Fira Code value text; the Select chevron stays `3:10`.
- [ ] **Card:** a panel surface with a rule border, no shadow. Card and Panel differ only in Panel's framed header strip (a 24px tall strip with a Label/Micro title on the left, a status dot on the right and a bottom rule).
- [ ] Screenshot each set with `get_screenshot` in both modes and check it against the constraints.

### Task A3: One composed screen: analytics Overview

- [ ] Build a `Screens/Overview` page frame at 1440 wide, dark and light:
  - an ecosystem rail (the signature element from the 2026-11-10 prototype)
  - a 12px-gutter grid of six Panels: KPI strip, traffic line chart, a series 1–4 bar, a log table with compact 28px rows, an alert panel using coral ▲, and an IntegrityBadge row
- [ ] Use only A1 variables and A2 instances (no detached fills). Check with `get_metadata` that no fill uses a raw hex.

### Task A4: Review handoff (STOP)

- [ ] Send the owner the frame links (foundations, components, Overview) and a 5-line summary of what changed and why.
- [ ] **Wait for approval.** Feedback loops back into A1–A3. Phase B does not start until the owner says the Figma is approved.
- [ ] Record the approval in `docs/features/analytics-visual-identity.md`: add a §3 note dated the day it is given.

### Round 2 (2026-11-11): "instrument in air", approved direction

The owner approved the round-2 direction. These values replace the round-1 shape and density constants:

- **Radius:** card/panel 6px, control/button/badge 4px, progress full.
- **Density:** controls 30/36/44, rows 36px, panel padding 20px, panel header 32px, `--layout-gutter` 24px.
- **Surfaces:** separated by tone steps, not full borders. An alert is a 2px coral left edge.
- **Type:** headline metrics use `Display/Value` (Fira Sans Light 40); mono for labels, tables and captions.
- **Air:** a token-to-token fade (`--signal` → `--panel`, 40% opacity) under chart lines and on live states only.
- **Motion:** `--motion-breath` 4000ms (live-dot pulse), `--motion-draw` 900ms (line draw-in), `--motion-base` 200ms. All are off under `prefers-reduced-motion`.

### Task A5: Analytics kit in Figma (owner request, before Phase B)

Every component the analytics app uses, on a new `Analytics kit` page:

- Dialog (default + confirm)
- Toast
- NotificationCenter + NotificationItem
- Textarea
- Table header/row
- Tooltip (incl. chart tooltip)
- DropdownMenu + MenuItem
- CommandPalette
- Tabs/segmented (mode switch)
- Switch (theme toggle)
- Timeline item
- Sidebar NavItem
- Badge `Status` variant (IntegrityBadge)
- Chart foundations: axis, gridline, legend item, sequential cyan ramp, diverging cyan↔neutral↔coral, heatmap cells

Built from A1 variables + round-2 values. Review gate as in A4.

### Task A6: Remaining @aazucena/ui components in Figma

The remaining ~240 components, grouped by category (forms, navigation, overlays, feedback, data display, media, layout). The approach for the long tail (full component vs pattern sheet) is decided with the owner after A5. Review gate as in A4.

## Phase B: Code (only after A4 approval)

Values come from the approved Figma variables. If Figma changed during review, Figma wins over the constraints above.

### Task 1: Ink palette and the instrument default vibe

**Files:**

- Modify: `packages/design-system/src/tokens/colors.ts` (add an `ink` scale), `packages/design-system/src/themes/default.ts`, `packages/design-system/src/utils/generate-css.ts` (emit `--panel, --panel-raised, --rule, --rule-strong, --signal, --alert, --series-1..4, --radius-control, --control-sm|md|lg`)
- Modify: `packages/types` `SystemThemeConfig` (optional new color keys, so the other 16 vibes still compile)
- Create: `packages/design-system/src/utils/generate-css.test.ts`, a vitest config if the package lacks one, and a `"test"` script

**Produces:** the CSS variable names listed in A1. Existing names (`--card`, `--border`, `--primary`, `--destructive`, `--radius-card`…) stay and alias the new ones.

- [ ] Write the failing tests. Call `generateCSS(defaultVibe)` and assert:
  - `.dark` contains `--background: #0E1A20` or the equivalent oklch, `--rule`, and `--alert` set to the coral oklch
  - `--radius-card` and `--radius-button` are `2px`, `--radius-badge` is `2px`
  - the default vibe's semantic block contains no `oklch(… 0 0)` achromatic neutral
  - a contrast helper (culori `wcagContrast`) gives ≥ 4.5 for foreground/background and muted/panel in both modes
- [ ] Run `pnpm --filter @aazucena/design-system test`. Expected: FAIL.
- [ ] Implement it: `ink` comes from A1's script output, and `default.ts` uses `getColor('ink', n)` for every neutral, signal for `accent` (pink is dropped), `effects.shadow = 'none'`, and no `glowColor` in light mode.
- [ ] Run the tests (PASS), then `pnpm --filter @aazucena/design-system build` (regenerates `dist/css-vars.css`) and `type-check`.
- [ ] Commit `🎨 feat(design-system): instrument default vibe on ink neutrals`.

### Task 2: Wire the tokens into Tailwind, remove the dead glass utility

**Files:** `packages/ui/src/styles/globals.css` (`@theme inline`: `--color-panel`, `--color-rule`, `--color-signal`, `--color-alert`, `--color-series-1..4`, `--radius-control`), `packages/ui/src/styles/core.css` (Tailwind 4 `@utility glass` = `bg-panel/70 border border-rule` with no blur, `@utility micro-label`), `packages/design-system/src/tailwind.ts` (delete the dead `.glass`/`.glass-m` plugin).

- [ ] Add a smoke assertion to the existing `button.stories.tsx` play test: `getComputedStyle(document.documentElement).getPropertyValue('--radius-control').trim() === '2px'` and `--rule` is non-empty. Run `test:ci` and expect it to fail. Implement, then expect it to pass. Task 3 adds the element-level radius check.
- [ ] Commit `🎨 feat(ui): expose instrument tokens as Tailwind utilities`.

### Task 3: Restyle the core primitives

**Files:** `button.tsx`, `badge.tsx`, `input.tsx`, `select.tsx`, `card.tsx`, plus a new `panel.tsx` (exports `Panel`, `PanelHeader`, `PanelBody`; props `label: string`, `status?: 'idle'|'live'|'alert'`; follows the CVA + forwardRef + 3-variant pattern). Add `panel` to the barrel `index.ts`. Add `stories/components/panel.stories.tsx` with a `parameters.design` link to the A2 Panel set.

**Class rules (one pattern for every file):**

- Remove `ring-offset-*`, `shadow-*`, `rounded-{lg,xl,full}`, `backdrop-blur-*`, every `cyan-*`/`zinc-*`/`slate-*`/`gray-*`/`from-*`.
- Use `rounded-control`, `border-rule`, `bg-panel`, and `focus-visible:outline focus-visible:outline-1 focus-visible:outline-signal`.
- cyber = `border-signal/60 text-signal font-mono uppercase`; glass = `glass`.
- Delete button's `gradient` variant: alias it to `default` with a `console.warn` in dev, and remove it in 0.3.0.

- [ ] Add play tests to Button/Input/Select stories: after a tab keypress, the element has a non-`none` `outline-style`. Panel's play test checks that `status="alert"` renders the ▲ marker text. Run them and expect FAIL.
- [ ] Restyle the components and run `pnpm --filter @aazucena/ui type-check` and `pnpm --filter @aazucena/storybook test:ci`. Expected: all pass, including a11y.
- [ ] Add a changeset (`@aazucena/ui`, `@aazucena/design-system`: minor, "Instrument visual language").
- [ ] Commit by concern: `✨ feat(ui): add Panel`, `🎨 style(ui): instrument styling for core primitives`, `📝 docs(storybook): Panel story`, `🔖 chore: changeset`.

### Task 4: Sweep the rest of `packages/ui`

The same class rules apply to the remaining ~255 files. Work in batches by import fan-out:

1. tooltip, progress, label, separator, skeleton, dialog, tabs, table
2. the 224 files with `cyan-*`
3. everything that's left

- [ ] For each batch: apply the class rules. A codemod is allowed for the mechanical replacements (`cyan-500` → `signal`, `zinc-800` → `rule`, `rounded-xl` → `rounded-control`), but review each diff by hand.
- [ ] Gate after each batch: `rg -c "cyan-|zinc-|slate-|gray-|backdrop-blur|ring-offset|rounded-(xl|2xl|3xl|\[)" packages/ui/src/components/ui` must go down, and type-check and `test:ci` must stay green.
- [ ] `apps/storybook/.storybook/preview.tsx`: `withVariantBackground` puts glass on `--background`, not on the purple gradient (Review Focus 4).
- [ ] `packages/design-system/src/integrations/storybook/manager-theme.ts`: move the Storybook chrome from zinc to ink.
- [ ] Commit one commit per batch: `🎨 style(ui): instrument sweep, batch N`.
- [ ] Final gate: the grep count is 0, apart from an allowlist (decorative `animations`/seasonal components). Each allowlisted entry is a backlog line.

### Task 5: Visual verification and vibes

- [ ] Run `test:visual` locally (Argos-compatible screenshots), shard 1, and look at Button/Card/Panel/Dialog in light and dark.
- [ ] Add `stories/design-tokens/vibes-matrix.stories.tsx`: one Panel + Button + Badge row per registered vibe (17). Use it to check each seasonal vibe for legibility (Review Focus 1). For any vibe that fails, adjust its colors in `themes/<vibe>.ts`.
- [ ] Dev-server smoke check with Playwright MCP: screenshot the Overview-equivalent recipe story and compare it to the A3 frame with `get_screenshot`.
- [ ] Run the `ui-ux-pro-max:ui-ux-pro-max` review checklist on the screenshots and fix the findings.
- [ ] Docs:
  - `principles.mdx` and `introduction.mdx` describe the instrument language and replace "Chromatic" with Argos
  - `CONTEXT.md` gets one line on the token names
  - the backlog marks the redesign done and leaves the analytics app adoption (spec §4 steps 1–5) as the next item
- [ ] Commits: `✅ test(storybook): vibe matrix story`, `📝 docs: document the instrument language`.

## Out of scope (next plan)

- Adopting the new look in `apps/analytics` (spec §4).
- Chart defaults in `packages/visualizations`.
- The portfolio's own Astro sections.

Each consumes these tokens, but they need their own plans.

## Verification

- **Phase A:** `get_variable_defs` shows clean aliases. Screenshots exist for every set in both modes. The owner approval is recorded.
- **Phase B checks:** `pnpm --filter @aazucena/design-system test`, `type-check` for design-system, ui, storybook and portfolio, and `pnpm --filter @aazucena/storybook test:ci` all green. The hardcoded-color grep reports 0 outside the allowlist.
- **Visual:** Argos shows an intentional full-library diff. Approve it as the new baseline after merge to main.
- **Attribution:** `git log --format=%B main..HEAD | grep -ci co-authored` returns 0.
