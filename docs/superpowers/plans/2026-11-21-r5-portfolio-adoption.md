# R5: Portfolio Adopts Avra, Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

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

## Restyle procedure (Tasks 4–10 follow it)

File paths in Tasks 3–10 are relative to `apps/portfolio/src`. The lists come from a scan of the
96 failing files on 2026-11-21. Task 2 regenerates `PENDING` from the walker. A `PENDING` file no
task names is picked up by Task 11.

- [ ] **R1:** remove the task's files from `PENDING`. Run the guard
      (`pnpm --filter @aazucena/design-system exec vitest run src/utils/portfolio-token-usage.test.ts`)
      and see test 1 fail with their hits. Remove each page group's entries in the same commit as
      that group, so the guard is green after every commit.
- [ ] **R2:** fetch the task's frames, dark and light, with Figma MCP `get_screenshot`.
- [ ] **R3:** restyle to the frame under the Global Constraints:
  - Local glass cards become ui `Panel`.
  - Status text becomes ui `Badge`.
  - Hand-rolled buttons become ui `Button`.
  - Keep every data loader, Strapi call, fallback, handler and route as it is.
  - Astro files use the same token classes in `class` and `class:list`.
- [ ] **R4:** gates: the guard is green, and `pnpm --filter portfolio type-check` and
      `pnpm --filter portfolio lint` pass. Before the last commit of the task, run the full
      design-system suite once.
- [ ] **R5:** start the dev server (`pnpm web:dev`, :4321). From `apps/portfolio`, run
      `node scripts/visual-check.mjs <routes>`. Expected: `overflow=0` and exit 0. Compare the 1440
      shots with the dark and light frames, and the 390 shots with the mobile frames where they
      exist. Write down which frames you compared. Stop the server with
      `lsof -ti:4321 | xargs -r kill`.
- [ ] **R6:** commit `🎨 style(portfolio): <group> in the instrument language`, one commit per
      group the task lists.

A task with more than about 15 files runs as two dispatches (a/b) along the split shown.

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

- **4a, layouts and building blocks (commit: layouts and shared parts):**
  - `layouts/DetailLayout.astro`, `layouts/ListLayout.astro`
  - `templates/EditorialTemplate.astro`, `templates/LandingTemplate.astro`, `templates/LegalTemplate.astro`
  - `components/Button.astro`, `components/BrandIconLoader.astro`, `components/IntegrityBadge.tsx`
  - `components/common/Breadcrumbs.astro`, `DetailNavigation.astro`, `GradientAccent.astro`
  - `components/ui/common/Badge.tsx`, `GlassCard.tsx` (becomes ui `Panel`), `Panel.tsx` (the local
    drawer, renamed `SlidePanel` along with its imports), `Popover.tsx`
  - `components/ui/MetricCard.astro`, `components/ui/StatusBadge.astro`
- **4b, site chrome (commit: navbar, footer and menus):**
  - `components/ui/Navbar.tsx`, `components/Footer.astro`, `components/ui/SettingsPanel.tsx`,
    `components/ui/SocialMenu.tsx`
- **Frames:**
  - Navbar `86:1022`, NavLink `86:716`, Footer `87:2546`, Availability `90:2722`
  - Mobile menu `77:453` (dark) / `155:5074` (light)
- **Routes for R5:** `/about` (it uses DetailLayout and the chrome), `/projects` (ListLayout),
  `/privacy` or any legal `[slug]` page.

### Task 5: About, Contact, Support, Changelog, error states

- **Files, one commit per page group:**
  - About: `pages/about.astro`, `components/ui/about/HighlightsPanel.tsx`, `LearnMoreCard.tsx`,
    `StatCard.tsx`, `components/ui/AskMeAbout.tsx`, `components/ui/WorkingStyleSection.tsx`,
    `components/ui/TestimonialCard.tsx`
  - Contact and Support: `pages/contact.astro`, `pages/support.astro`
  - Changelog: `pages/changelog.astro`, `components/ui/ChangelogTimeline.astro`,
    `components/ui/ChangelogSections.tsx`
  - Error states: `pages/404.astro`, `pages/500.astro`, `pages/maintenance.astro` (500 and
    maintenance have no frames; they follow the 404 frame)
- **Contact form:** the form keeps its handler, validation and success and error toasts. Error text
  carries ▲ and `role="alert"`.
- **Routes:** `/about /contact /support /changelog /does-not-exist`.

| Page      | Dark     | Light     |
| --------- | -------- | --------- |
| About     | `65:159` | `77:521`  |
| Contact   | `73:339` | `77:1653` |
| Support   | `74:354` | `98:3023` |
| Changelog | `75:372` | `77:1848` |
| 404       | `74:441` | `77:2015` |

### Task 6: Projects, Experience, Expertise

- **6a, Projects and Experience (two commits):**
  - Projects: `pages/projects/index.astro`, `pages/projects/[slug].astro`,
    `components/ui/projects/ProjectCard.tsx`, `ViewMoreCard.tsx`, `PageIndicators.tsx`,
    `components/ui/RelatedLinks.tsx`
  - Experience: `pages/experiences/index.astro`, `pages/experiences/[slug].astro`,
    `components/ui/experience/ExperienceCard.tsx`, `ExperienceActions.tsx`, `CompanyLogo.tsx`,
    `components/ui/EducationItem.tsx`
- **6b, Expertise (one commit):**
  - `pages/skills/index.astro`, `components/ui/ServiceCard.tsx`, `ServiceTabs.tsx`,
    `TechStackDistribution.tsx`, `SkillBadgeList.tsx`, `InteractiveCard.tsx`, `InfoPanel.tsx`,
    `AwardModal.tsx`, `components/ui/awards/HexagonCard.tsx`, `SectionLabel.tsx`
- **Company logos and brand icons** keep their brand colours. If a logo needs a literal colour, add it
  to `SCENE_EXEMPT` with the reason "brand mark".
- **Routes:** `/projects`, one `/projects/<slug>`, `/experiences`, one `/experiences/<slug>`,
  `/skills`.

| Page                          | Dark       | Light      |
| ----------------------------- | ---------- | ---------- |
| Projects                      | `66:152`   | `77:684`   |
| Project detail                | `67:199`   | `77:848`   |
| Experience                    | `68:234`   | `113:3152` |
| Experience detail             | `70:279`   | `77:1208`  |
| Experience detail (RAD Intel) | `113:3619` | `113:3841` |
| Expertise                     | `72:317`   | `92:3014`  |

### Task 7: Blog

- **Files (one commit):** `pages/blog/index.astro`, `pages/blog/[slug].astro`,
  `components/ui/blog/BlogCard.tsx`, `ViewAllButton.tsx`, `components/blocks/BlockRenderers.tsx`,
  `SimpleRichTextRenderer.tsx`. `components/ui/blog/NewspaperStack.tsx` moves to Task 9, because
  its inline colours are homepage scene colours.
- **Rich text:** prose uses the typography plugin with token colours (`prose` plus foreground,
  muted and signal links). Code blocks use ui `CodeBlock`.
- **Routes:** `/blog`, one `/blog/<slug>`; 390 shots compared with the mobile blog-post frames.

| Page             | Dark     | Light      |
| ---------------- | -------- | ---------- |
| Blog             | `47:308` | `47:413`   |
| Blog post        | `71:310` | `77:1374`  |
| Mobile blog post | `77:490` | `155:5108` |

### Task 8: Journey

- **Files (one commit):** `pages/journey.astro`, `components/JourneyDashboard.tsx`,
  `components/ui/journey/CareerStats.tsx`, `ChronologyTimeline.tsx`, `DetailsModal.tsx`,
  `ExportControls.tsx`, `GrowthMetrics.tsx`, `HeatmapInfoPanel.tsx`, `SankeyWithSemantics.tsx`,
  `TimelineEventTooltip.tsx`, `Toolbar.tsx`
- **Frames:** Journey `95:2813` (dark) / `113:4022` (light).
- **Charts** keep the visualizations defaults. Journey components still need `client:only="react"`
  (CONTEXT.md: D3 reads width 0 under SSR). Tooltips use `chartTooltip`, and chart values need a
  text equivalent (as in R4 Task 9).
- **Route:** `/journey`.

### Task 9: Homepage content layer and particle colours

- **9a, sections (one commit):** `components/homepage/sections/HeroSection.tsx`,
  `ProjectsSection.tsx`, `ServicesSection.tsx`, `SkillsSection.tsx`, `ExitSection.tsx`,
  `SectionLayout.tsx`, `components/ui/hero/NavigationButton.tsx`, `ResumeButton.tsx`,
  `components/ui/PhoneDialTabs.tsx`, `components/ui/blog/NewspaperStack.tsx`
- **9b, overlays and particles (two commits):**
  - Overlays: `components/homepage/overlays/NavigationToolbar.tsx`, `UIOverlays.tsx`,
    `AtmosphericOverlays.tsx`, `components/ui/ScrollIndicators.tsx`, `components/ui/SectionNavFAB.tsx`
  - Particles: `config/animations.ts` plus a new `lib/utils/token-color.ts`
- **Scenes:** the Three.js and Pixi scene files (the sky gradients and imagery in
  `AtmosphericOverlays` if they are imagery) can go in `SCENE_EXEMPT` with a reason. Panel, text and
  control styling can't.
- **Test for `readTokenColor`:** a vitest in `packages/utils` is wrong here, because the helper lives
  in the app. Put the parse logic in `@aazucena/utils` as
  `parseCssColor(value: string): number | null` (`#rgb`, `#rrggbb`, `rgb()`, `oklch()` via the
  browser's computed `rgb()` form), with tests:
  - `parseCssColor('#32a0c5') === 0x32a0c5`
  - `parseCssColor('rgb(50, 160, 197)') === 0x32a0c5`
  - `parseCssColor('nope') === null`

  The app helper calls `getComputedStyle` and then `parseCssColor`, falling back to the preset's old
  value when parsing fails.

- **Contrast check:** in R5's screenshot pass, read the computed colour of each section heading on
  the bright scenes. Text uses `text-foreground` in dark mode; record the values.
- **Route:** `/` at 1440 and 390. The homepage is always dark, so its light shots must look dark
  too (Review Focus 1).

| Element        | Frames                                                                                                                                       |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Home sections  | Hero `46:37`, About `46:67`, Projects `46:111`, Experience `46:175`, What I do `47:37`, Skills `47:100`, Blog `47:182`, What's next `47:214` |
| Toolbar states | `145:3596`, `145:3645`, `145:3728`, `145:3805`                                                                                               |
| Mobile         | Home hero `77:429`, toolbar `145:3904`                                                                                                       |
| Components     | Control dock `103:3191`, Section dots `103:3264`                                                                                             |

- **Particle colours:** `config/animations.ts` `PARTICLE_PRESETS` (16 `0x` colours) are replaced with `readTokenColor(name: string): number`, which uses `getComputedStyle` on `document.documentElement` and parses the colour to `0xRRGGBB`. Scenes call it once at start. The `NewspaperStack` and `PhoneDialTabs` inline colours get the same treatment.

### Task 10: Rin assistant UI

- **Files (one commit):**
  - Failing today: `components/assistant/AssistantInput.tsx`, `AssistantIntro.tsx`,
    `AssistantMessageList.tsx`, `variants.ts`
  - Clean, but checked against the frames: `AssistantChat.tsx`, `AssistantHeader.tsx`,
    `AssistantOverlay.tsx`, `AssistantTriggerPopover.tsx`, `RinMark.tsx`
- **Rin trigger:** a signal outline with Rin's face and "Chat"; the open state reads ✕ "Close".
  Never coral.
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
