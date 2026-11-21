# R5: Portfolio Adopts Avra, Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

> **Status:** draft, written 2026-11-21 just before the usage limit. Two parts are still to write:
>
> - per-task file lists for Tasks 5–10, beyond the groupings below
> - frame IDs for the mobile and toolbar states, beyond the ones listed

**Goal:** Move the portfolio (`apps/portfolio`, Astro 7 + React 19) onto `@aazucena/ui` and the instrument language, matching the approved Figma frames, with the R4 tooling and rules.

**Architecture:**

- **Guard:** a ratcheting guard test (`portfolio-token-usage.test.ts`) lists the 96 files that still use stock palette, glass or literal colours. Each task removes its files and restyles them against Figma.
- **Token layer first:** `globals.css` imports `@aazucena/ui/globals.css`, and the homepage content layer is bound to dark tokens.
- **Scenes:** Three.js and Pixi scenes keep their imagery, and particle colours are read from tokens at scene start.

**Tech Stack:** Astro 7, React 19, Tailwind 4, `@aazucena/ui`, `@aazucena/visualizations`, vitest (design-system guards), `@playwright/test` (screenshot script), Figma MCP.

**Spec:**

- `docs/features/portfolio-visual-identity.md` (owner decisions, 2026-11-12)
- R5 in `docs/superpowers/plans/2026-11-12-avra-redesign-completion.md`

## Global Constraints

- **Figma is the target:** file `KIKPyhRdGbeBhj8dS0km2G`, page `Portfolio` (45:2). Where a frame and the code differ, the frame wins on layout, panels and labels, and never on data.
- **Homepage:**
  - The scenes keep their imagery. Panels, type and actions take Avra, and particle colours use the signal and series hues.
  - Text on a scene uses `text-foreground`. Signal colour stays inside panels.
  - The homepage is always dark: bind its content layer to the dark tokens, whatever the site theme is.
  - Inner pages, the Rin chat and mobile inner pages follow the theme.
- **Rin trigger:** a signal-cyan outline with Rin's face and "Chat". The open state reads ✕ "Close". Coral is never used on it.
- **Tokens and status grammar:** the same rules as R4's Global Constraints (`docs/superpowers/plans/2026-11-20-r4-analytics-adoption.md`):
  - tokens only
  - coral only with ▲, warnings ◆
  - no fake numbers, and labels say what the data is
  - no badge that nothing computes
  - scrollable panes get `tabIndex={0}`, `role="region"` and an `aria-label`
  - charts get colours from the visualizations defaults
- **Scene imagery exemption:** files whose literal colours are scene imagery (Three.js/Pixi skies, shaders, atmospheric gradients) may sit in a `SCENE_EXEMPT` list in the guard. Each entry needs a one-line reason, and it can never cover panel or text styling.
- **Theme storage:** the key is `aazucena-theme` (`BaseLayout.astro:90`). The dev server is `pnpm web:dev` on :4321. There's no auth.
- **Machine:** the portfolio build runs out of memory locally, so the gate is `pnpm --filter portfolio type-check` (`astro check`) and `pnpm --filter portfolio lint`. Never run `astro build` or a storybook build.
- **Commits:** one per page group, `git add <path>` only, lower-case subject after the type, no AI attribution, never push or branch. Changesets only when a package changes.

## Review Focus

1. **Theme toggle on the homepage.** Switching to light must not lighten the homepage content, which stays dark, while inner pages follow the toggle. Pinned in Task 3.
2. **Text on bright sky scenes** (Projects, Experience, What I do) must reach 4.5:1. Use `text-foreground` on scenes, never signal. Pinned in Task 9 with a contrast check in the screenshot pass.
3. **Mobile at 390px:** no sideways scroll, and the menu and the toolbar both work. `visual-check` runs at 1440 and 390. Pinned in Task 2.
4. **Strapi down:** pages render their built-in fallback content without throwing. Pinned by the console-error check in `visual-check` (uncaught exceptions fail the run).
5. **Particle colours after a theme or vibe change** come from tokens. Three.js gets numbers that are read once at scene start. Pinned in Task 9.

---

## Tasks

### Task 1: Follow-ups from R4 and the model catalogue

- **Rin chat route:** `apps/portfolio/src/pages/api/chat.ts:68` changes from `gateway("anthropic/claude-sonnet-4.6")` to `gateway(DEFAULT_CHAT_MODEL)` from `@aazucena/constants`. Commit: `🔧 chore(portfolio): rin chat uses the catalogue default model`.
- **Analytics sidebar mode:** `apps/analytics/src/components/common/Sidebar.tsx` (around lines 84–90) derives the mode from the pathname on navigation: `INTELLIGENCE` when the route is in `INTELLIGENCE_NAV`, else `SYSTEM`. Keep manual switching. Commit: `🐛 fix(analytics): sidebar mode follows the current route`.
- **Gates:** both type-checks pass, and the analytics guard passes.

### Task 2: Ratcheting guard and screenshot script

- **Guard:** `packages/design-system/src/utils/portfolio-token-usage.test.ts`, the same shape as the analytics guard:
  - It walks `.astro`, `.tsx` and `.ts` under `apps/portfolio/src`, skipping `pages/api/` and `*.test.ts`.
  - Rules: the analytics rules plus `\b0x[0-9a-fA-F]{6}\b`.
  - `PENDING` starts as exactly today's failing files, about 96.
  - `SCENE_EXEMPT` holds reasoned entries.
  - Test 2 checks that every `PENDING` file is still dirty.
- **Script:** `apps/portfolio/scripts/visual-check.mjs`, adapted from the analytics script:
  - port 4321, no cookie
  - themes via `localStorage['aazucena-theme']`
  - widths 1440 and 390
  - output `route theme width overflow=<px> errors=<n>`
  - exits 1 on overflow or an uncaught exception, and 2 when the server can't be reached
  - `.shots/` is gitignored

### Task 3: Token layer

- **`globals.css`:** import `@aazucena/ui/globals.css` (it already includes css-vars with the structural and chart roles). Drop the direct `tailwindcss` and `tw-animate-css` imports, `structure.css`, `chart.css`, the `:root`/`.dark` palette, and the `@theme inline` duplicates. Keep the `@source` lines and the portfolio-only rules that are actually used, grepping before removing.
- **`config/site.ts`:** remove the theme hex values (lines 71–72) and their consumers in favour of tokens.
- **Homepage always dark:** `HomeLayout` wraps the content layer in a `.dark` element (the dark tokens apply under `.dark`), whatever `<html>` says.
- **Guard tests:** `globals.css` imports ui globals and has no palette; the `HomeLayout` content root has `class` containing `dark`.
- **Docs:** update the `docs/CONTEXT.md` note on structure.css and chart.css.

### Task 4: Shared chrome

- **Files:**
  - `layouts/*`, `templates/*`
  - `components/Footer.astro`, `Button.astro`
  - `components/common/*`
  - `components/ui/{Navbar,SettingsPanel,SocialMenu,StatusBadge.astro,MetricCard.astro}`
  - `components/ui/common/*`: `GlassCard` becomes ui `Panel`. The local drawer `Panel.tsx` is renamed `SlidePanel`.
- **Frames:** Navbar `86:1022`, NavLink `86:716`, Footer `87:2546`, Availability `90:2722`, Mobile menu `77:453` / `155:5074`.

### Task 5: About, Contact, Support, Changelog, error states

- **Pages:** `about`, `contact`, `support`, `changelog`, `404`/`500`/`maintenance`, and `[slug]` (the legal template). Plus their `components/ui` parts (about/*, ChangelogTimeline, ChangelogSections, AskMeAbout).

| Page      | Dark     | Light     |
| --------- | -------- | --------- |
| About     | `65:159` | `77:521`  |
| Contact   | `73:339` | `77:1653` |
| Support   | `74:354` | `98:3023` |
| Changelog | `75:372` | `77:1848` |
| 404       | `74:441` | `77:2015` |

### Task 6: Projects, Experience, Expertise

- **Pages:** `projects/*`, `experiences/*`, `skills/index` (Expertise). Plus ProjectCard, ExperienceCard, ServiceCard, ServiceTabs, TechStackDistribution, EducationItem, awards/*, PhoneDialTabs, InteractiveCard, InfoPanel, RelatedLinks.

| Page                          | Dark       | Light      |
| ----------------------------- | ---------- | ---------- |
| Projects                      | `66:152`   | `77:684`   |
| Project detail                | `67:199`   | `77:848`   |
| Experience                    | `68:234`   | `113:3152` |
| Experience detail             | `70:279`   | `77:1208`  |
| Experience detail (RAD Intel) | `113:3619` | `113:3841` |
| Expertise                     | `72:317`   | `92:3014`  |

### Task 7: Blog

- **Pages:** `blog/index`, `blog/[slug]`. Plus blog/* (NewspaperStack, BlogCard, ViewAllButton) and blocks/* (BlockRenderers, SimpleRichTextRenderer).

| Page             | Dark     | Light      |
| ---------------- | -------- | ---------- |
| Blog             | `47:308` | `47:413`   |
| Blog post        | `71:310` | `77:1374`  |
| Mobile blog post | `77:490` | `155:5108` |

### Task 8: Journey

- **Files:** `journey.astro`, `JourneyDashboard.tsx`, `components/ui/journey/*`.
- **Frames:** Journey `95:2813` (dark) / `113:4022` (light).
- **Charts** keep the visualizations defaults.

### Task 9: Homepage content layer and particle colours

- **Files:** `components/homepage/sections/*`, `overlays/*`, `ui/hero/*`, ScrollIndicators, SectionNavFAB.

| Element        | Frames                                                                                                                                       |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Home sections  | Hero `46:37`, About `46:67`, Projects `46:111`, Experience `46:175`, What I do `47:37`, Skills `47:100`, Blog `47:182`, What's next `47:214` |
| Toolbar states | `145:3596`, `145:3645`, `145:3728`, `145:3805`                                                                                               |
| Mobile         | Home hero `77:429`, toolbar `145:3904`                                                                                                       |
| Components     | Control dock `103:3191`, Section dots `103:3264`                                                                                             |

- **Particle colours:** `config/animations.ts` `PARTICLE_PRESETS` (16 `0x` colours) are replaced with `readTokenColor(name: string): number`, which uses `getComputedStyle` on `document.documentElement` and parses the colour to `0xRRGGBB`. Scenes call it once at start. The `NewspaperStack` and `PhoneDialTabs` inline colours get the same treatment.

### Task 10: Rin assistant UI

- **Files:** `components/assistant/*`.
- **Frames:**
  - Rin trigger `147:4076`, greeting `147:4077`, chat set `151:4435`
  - Floating `76:390` / `155:5154`
  - First open `151:4634` / `155:5278`
  - Side panel `151:4821` / `155:5402`
  - Full screen `151:5065` / `155:5525`
- **Behaviour:** the chat, emotion pipeline and streaming stay unchanged.

### Task 11: Close the guard, audit, full pass, docs

- **Guard:** delete `PENDING`, and keep `SCENE_EXEMPT` with its reasons.
- **Coral audit:** every coral use carries ▲.
- **Full screenshot pass:** every route at 1440 and 390, light and dark.
- **Docs:** CONTEXT.md, `portfolio-visual-identity.md`, R5 ticks in the redesign plan, ROADMAP. Record exactly which frames were compared.
