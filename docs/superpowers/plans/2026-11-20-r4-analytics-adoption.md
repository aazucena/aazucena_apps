# R4: Analytics App Adopts Avra, Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move AZUCENA_LYTICS (`apps/analytics`) from its own pre-Avra styling onto `@aazucena/ui` and the instrument language, page by page, matching the approved Figma frames.

**Architecture:** A ratcheting guard test lists every analytics file that still uses stock palette, glass or oversized radii. Each task removes its files from the list (the test goes red), restyles them against their Figma frame (green), and checks them in a browser with a shared screenshot script. The token layer goes first because nothing renders correctly without it.

**Tech Stack:** Next.js 16 (App Router), Tailwind 4, `@aazucena/ui` (Panel, Badge, Button, Dialog, Switch, Tabs, Table), `@aazucena/visualizations`, vitest (design-system guards), `@playwright/test` (screenshot script), Figma MCP (`get_screenshot`).

**Spec:** `docs/features/analytics-visual-identity.md` §3 (D1–D6) and §4, plus R4 in `docs/superpowers/plans/2026-11-12-avra-redesign-completion.md`.

## Global Constraints

- **Palette (D2):** the dedicated analytics vibe D2 asked for became Avra's default vibe in R0 (ink `#0E1A20`, panel `#13232B`, signal `#32A0C5`), so analytics uses the default vibe and registers none.
- **Figma is the target.** File `KIKPyhRdGbeBhj8dS0km2G`, page `Analytics` (12:2). Where a frame and the code differ, the frame wins (D6 frame check, 2026-11-15). Each task names its frames; fetch them with Figma MCP `get_screenshot` (call `create_session` first).
- **Tokens only:** `bg-background`, `bg-panel`, `bg-panel-raised`, `bg-state`, `border-rule`, `border-rule-strong`, `text-foreground`, `text-muted-foreground`, `text-signal`, `text-alert`, `text-success`, `text-warning`, `rounded-card` (6px), `rounded-control` (4px), `h-control` (30/36/44), `micro-label`, `font-mono`. No stock palette, `text-white`/`text-black`, hex or `rgba()` in TSX, `backdrop-blur`, `shadow-*` on surfaces, `rounded-2xl|3xl|[…]`, `max-w-7xl`. Drop `dark:` colour variants: the tokens switch with `.dark`.
- **Status grammar:** ● info (signal), OK success (mint), ◆ warning (amber), ▲ alert (coral). Coral only for alerts and destructive states, always with ▲. Show status with ui `Badge` / `Panel status`, which render the markers, not hand-coloured text. Mapping: rose/red → alert, emerald/green → success, amber/yellow → warning, cyan/sky/blue → signal.
- **Surfaces (D1):** flat `Panel` with a `label` header strip in the app's copy voice (`TRAFFIC // 30D`), 1px rules, no blur or shadow. Overlays (Dialog, popover, command palette) keep the shadow the ui component gives them.
- **Layout (frame 12:8):**
  - sidebar `w-52` (208px)
  - top bar `h-14` (56px) with `px-6`
  - main content `px-6 pb-6`, full width (no `max-w-*`)
  - `gap-4` (16px) between rows and columns
  - panel padding comes from `Panel` (`p-panel`)
- **Type:** Fira Sans and Fira Code (D4). Page titles use the app's copy (`TRAFFIC_CENTER`, `TELEMETRY_STREAM`, …) through `PageHeader`.
- **Charts:** colours come from `@aazucena/visualizations` defaults (`chartTheme`, `categorical`). Never pass hex colours to a chart.
- **No data locally.** Pages render without ClickHouse. Every panel must show an empty or error state (muted text, no crash) when its fetch fails.
- **Commits:** one per task or page group, `git add <paths>` (no `-A`), conventional commit with emoji, body lines ≤ 100 chars, no AI attribution, never push or branch. The pre-commit hook regenerates `CHANGELOG.md`.
- **No changesets:** `apps/analytics` is a private app, not a versioned package.
- **Machine:** about 11 GB RAM. Never run `next build` or `storybook build`. The dev server is `pnpm --filter analytics dev` (port 8080, heap already capped). Stop it afterwards with `lsof -ti:8080 | xargs -r kill`.
- **Gates for every task:**
  - `pnpm --filter @aazucena/design-system exec vitest run src/utils/analytics-token-usage.test.ts`
  - `pnpm --filter analytics type-check`
  - `pnpm --filter analytics lint`

## Review Focus

1. **Theme on first paint.** A stored `theme=light` must render light from the first frame, with no dark flash and no hydration warning. Nothing stored means dark. Pinned in Task 2, step 5.
2. **Pages with no data.** With ClickHouse unreachable, every page shows its panels with empty or error states, and nothing throws. Pinned by the console-error check in `visual-check.mjs` (Task 2), run in every page task.
3. **Coral without ▲.** A colour swap can leave `text-alert` on plain text. Pinned in Task 10, step 2: every `alert` use is reviewed for a ▲ or comes from Badge/Panel.
4. **Reduced motion.** framer-motion entrances (SentinelWatchdog, Header, the delayed-entrance panels) must respect `prefers-reduced-motion`. Pinned in Task 2: the guard asserts `RootProvider` wraps the app in `<MotionConfig reducedMotion="user">`.
5. **Narrow desktop.** At 1024px wide, the dense layout must not scroll sideways. Pinned by the overflow check in `visual-check.mjs`, run at 1440 and 1024.

---

## File Structure

| File                                                                                     | Responsibility                                                                                                         |
| ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `packages/design-system/src/utils/analytics-token-usage.test.ts` (create)                | Ratcheting guard: no stock palette or glass outside `PENDING`; `PENDING` files still need work; token-layer assertions |
| `apps/analytics/scripts/visual-check.mjs` (create)                                       | Signs in, screenshots routes light and dark at 1440 and 1024, reports console errors and horizontal overflow           |
| `apps/analytics/src/styles/globals.css`                                                  | `@import '@aazucena/ui/globals.css'` plus `@source` lines and app-only rules                                           |
| `apps/analytics/src/app/layout.tsx`                                                      | Fira fonts, token body classes, theme-init script                                                                      |
| `apps/analytics/src/components/common/PageHeader.tsx` (create)                           | Page title in the copy voice, optional meta and actions                                                                |
| `apps/analytics/src/components/**`, `src/app/**`                                         | Restyle per frame                                                                                                      |
| Delete: `apps/analytics/tailwind.config.ts`, `apps/analytics/src/layouts/RootLayout.tsx` | Unused                                                                                                                 |

---

### Task 1: Ratcheting guard

**Files:**

- Create: `packages/design-system/src/utils/analytics-token-usage.test.ts`

**Interfaces:**

- Produces: `PENDING: Set<string>` (paths relative to `apps/analytics/src`) and `violations(file: string): string[]`. Every later task deletes its files from `PENDING`.

- [x] **Step 1: Write the test.** Constants: `ROOT = join(__dirname, '../../../..')`, `SRC = join(ROOT, 'apps/analytics/src')`. Walk `SRC` for `.tsx`, skipping `app/api/`. `violations(file)` returns the matches of these patterns, outside `//` and `/* */` comments:

  ```ts
  const RULES: Array<[name: string, re: RegExp]> = [
    [
      'stock palette',
      /\b(?:bg|text|border|ring|fill|stroke|from|via|to|divide|outline|placeholder|decoration|accent|caret|shadow)-(?:zinc|slate|gray|neutral|stone|rose|red|emerald|green|amber|yellow|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|orange|teal|lime)-\d{2,3}\b/g,
    ],
    ['white/black', /\b(?:bg|text|border)-(?:white|black)\b/g],
    ['glass', /\bbackdrop-blur\b/g],
    ['big radius', /\brounded-(?:2xl|3xl|\[[^\]]+\])/g],
    ['surface shadow', /\bshadow-(?:sm|md|lg|xl|2xl)\b/g],
    ['width cap', /\bmax-w-7xl\b/g],
    ['literal colour', /#[0-9a-fA-F]{6}\b|\brgba?\(/g],
  ];
  ```

  Tests:
  - `it('uses Avra tokens in every finished file')`: for each file not in `PENDING`, `expect({ file, hits: violations(f) }).toEqual({ file, hits: [] })`.
  - `it('lists only files that still need work')`: every `PENDING` entry exists and has at least one violation (so a finished file must leave the list).

  Fill `PENDING` with exactly the files that fail today. Run the walker once and paste the list sorted; it is about 37 files.

- [x] **Step 2: Run it.** `pnpm --filter @aazucena/design-system exec vitest run src/utils/analytics-token-usage.test.ts`. Expected: 2 passed. Then delete one entry, see test 1 fail with that file's hits, and restore it.

- [x] **Step 3: Commit.** `✅ test(design-system): ratcheting Avra token guard for the analytics app`

### Task 2: Token layer, fonts, theme init, screenshot script

**Files:**

- Modify: `apps/analytics/src/styles/globals.css`, `src/app/layout.tsx`, `src/providers/RootProvider.tsx`, `components.json`, `package.json`, `.gitignore`
- Delete: `apps/analytics/tailwind.config.ts`, `apps/analytics/src/layouts/RootLayout.tsx`
- Create: `apps/analytics/scripts/visual-check.mjs`
- Test: `analytics-token-usage.test.ts`

**Interfaces:**

- Produces: `node --env-file=.env scripts/visual-check.mjs <route…>` (run from `apps/analytics`, dev server on 8080). It sets the `az_session` cookie to `process.env.ADMIN_SECRET` (never prints it). For each route × `light|dark` × width `1440|1024` (height 900), it sets `localStorage.theme`, loads the page, waits for network idle, and saves `.shots/<route-slug>-<theme>-<width>.png`. It prints one line per shot: `route theme width overflow=<px> errors=<n>`, then the console error texts. It exits 1 when any shot has `overflow > 0`. `overflow` is `document.documentElement.scrollWidth - clientWidth`. Failed-fetch errors count but don't fail the run.

- [x] **Step 1: Add the failing tests** to the guard file:
  - `it('loads Avra through ui globals')`:
    - `globals.css` matches `/@import ['"]@aazucena\/ui\/globals\.css['"]/`
    - it does not match `/--(?:primary|secondary|neutral|destructive|success)-\d{2,3}\s*:/` or `/@theme inline/`
  - `it('loads Fira and sets the theme before paint')`:
    - `layout.tsx` matches `/Fira_Sans/` and `/Fira_Code/`
    - it does not match `/Inter|JetBrains_Mono/`
    - it matches `/localStorage\.getItem\(['"]theme['"]\)/`
    - it matches `/suppressHydrationWarning/`
  - `it('respects reduced motion')`: `providers/RootProvider.tsx` matches `/<MotionConfig[^>]*reducedMotion="user"/`.
  - Remove `app/layout.tsx` and `layouts/RootLayout.tsx` from `PENDING`.

- [x] **Step 2: Run the guard.** Expected: the new tests fail, and so does test 1 for `app/layout.tsx`.

- [x] **Step 3: Rewrite `globals.css`.**
  - Keep: the five `@source` lines.
  - Replace lines 1–3, the plugin, the dark variant, `:root`, `.dark` and both `@theme inline` blocks with `@import '@aazucena/ui/globals.css';`. ui already imports Tailwind, `tw-animate-css`, css-vars, core and typography.
  - In `@layer base`, delete the font-family and the h1–h6, `p`, `code` and `.caption` type rules (ui's type scale applies).
  - Keep `html, body { height: 100% }`, plus `.perspective-1000`, `.homepage` and `.content-page` only if `rg` finds them used in `src`, and the scrollbar rules rewritten with `var(--rule)` and `var(--rule-strong)`.

- [x] **Step 4: Update `layout.tsx`.**
  - Fonts: `Fira_Sans` (weights 300/400/500/600/700) with `variable: '--font-sans'`, and `Fira_Code` (400/500) with `variable: '--font-mono'`, both from `next/font/google`.
  - `<html lang="en" suppressHydrationWarning>`.
  - In `<head>`, add an inline script (via `dangerouslySetInnerHTML`): `try{var t=localStorage.getItem('theme');document.documentElement.classList.toggle('dark',t!=='light')}catch(e){document.documentElement.classList.add('dark')}`.
  - Body classes: `${fonts} font-sans bg-background text-foreground antialiased`.
  - `RootProvider`: wrap its children in `<MotionConfig reducedMotion="user">` from `framer-motion`.
  - Delete `tailwind.config.ts` and `src/layouts/RootLayout.tsx`.
  - `components.json`: set `tailwind.config` to `""` and `tailwind.css` to `"src/styles/globals.css"`.
  - `package.json`: add `"@aazucena/utils": "workspace:*"` (`src/lib/utils` re-exports it), then `pnpm install`.
  - Add `.shots/` to `apps/analytics/.gitignore`.

- [x] **Step 5: Write `visual-check.mjs` and check the theme.** Start the dev server and run `node --env-file=.env scripts/visual-check.mjs /`. Also check first paint: open `/` with `localStorage.theme='light'` set by `addInitScript`, `waitUntil: 'commit'`, then after `domcontentloaded` evaluate `document.documentElement.classList.contains('dark')`. Expected: `false`, and no console message containing `Hydration`. Run it again with nothing stored. Expected: `true`.

- [x] **Step 6: Gates.** The guard (all pass), `type-check`, `lint`. Look at `.shots/root-dark-1440.png`: Fira on the body, ink background. Stop the server.

- [x] **Step 7: Commit, one per concern:**
  - `🎨 style(analytics): load Avra through ui globals.css and Fira fonts` (globals.css, layout.tsx, components.json, package.json, pnpm-lock.yaml, deleted config)
  - `♿ fix(analytics): respect reduced motion in framer-motion` (RootProvider.tsx). The theme-init script rides in the commit above with the rest of layout.tsx.
  - `🔥 chore(analytics): remove the unused RootLayout`
  - `🔧 chore(analytics): screenshot script for the redesign` (visual-check.mjs, .gitignore)
  - `✅ test(design-system): analytics token-layer guards` (guard file)

### Restyle procedure (Tasks 3–9 follow it)

Each restyle task lists its files, its frames and its specific changes. The steps are always these:

- [x] **R1:** remove the task's files from `PENDING`; run the guard and see test 1 fail with their hits.
- [x] **R2:** fetch the task's frames (dark and light) with Figma MCP `get_screenshot`, file `KIKPyhRdGbeBhj8dS0km2G`.
  - Verified: light frames compared directly for Overview, Traffic, Journey, Logs, AI Terminal, AI Costs, Login; by screenshot only for Status, Finance, Audio; not compared: Trajectories, Comms Inbox, Easter Eggs, Prompt IDE, Session expiring (open).
- [x] **R3:** restyle to the frame using the Global Constraints; replace local glass cards with `Panel` (`label`, `status`), headings with `PageHeader`, status text with `Badge`. Keep every data hook, query and handler as it is: this is a visual change.
- [x] **R4:** gates (guard green, `type-check`, `lint`).
- [x] **R5:** dev server, `node --env-file=.env scripts/visual-check.mjs <routes>`; expect `overflow=0` everywhere and no errors other than failed fetches; compare the 1440 shots with the frames side by side and fix layout differences the frame decides. Stop the server.
  - Verified: light frames compared directly for Overview, Traffic, Journey, Logs, AI Terminal, AI Costs, Login; by screenshot only for Status, Finance, Audio; not compared: Trajectories, Comms Inbox, Easter Eggs, Prompt IDE, Session expiring (open).
- [x] **R6:** commit `🎨 style(analytics): <page or group> in the instrument language`, one commit per page group listed in the task.

### Task 3: App shell and PageHeader

**Files:** `src/app/(dashboard)/layout.tsx`, `src/components/common/{Sidebar,Header,AdminMenu,ThemeToggle,CommandPalette}.tsx`; create `src/components/common/PageHeader.tsx`.
**Frames:** Overview / Dark `12:8` and Light `137:2208` (shell only), Overview / Settings open `187:1575` / `187:2973`.

**Interfaces:**

- Produces: `PageHeader({ title, meta, actions }: { title: string; meta?: React.ReactNode; actions?: React.ReactNode })` — `h1` in `text-2xl font-light tracking-tight` with `title` verbatim, `meta` as `micro-label text-muted-foreground` beside it, `actions` right-aligned; frame `Page header` row (54px, `gap-3`). Every page task uses it.

**Specific changes:**

- **Layout:** sidebar `w-52`; top bar `h-14 border-b border-rule bg-background px-6` (no blur, no translucency); main `px-6 pb-6`, `gap-4` between children, no `max-w-7xl`, no `p-8`. The top bar's left text is the breadcrumb `LYTICS // <PAGE>` in `micro-label`.
- **Sidebar** (spec revision 2026-11-12):
  - brand block (`AZUCENA_LYTICS`, `CORE_TERMINAL // V2`)
  - `SYSTEM | INTEL` segmented switch (ui `Tabs` or `ToggleGroup`)
  - `SYSTEM // 7` section label
  - `NavItem` rows `h-9` with the existing mynaui icons; the active row gets `bg-state`, a 2px signal left edge, a signal icon and `aria-current="page"`
  - integrity footer linking to `/status`
  - collapse control, which keeps today's behaviour
- **AdminMenu:** the ui popover per `187:1575`: Live feed `Switch`, Refresh all data, Clear AI history, Terminate session (destructive, ▲).
- **ThemeToggle:** ui `Button variant="ghost" size="icon"` whose `aria-label` names the target ("Switch to light theme"); keep the class/`localStorage` logic.
- **CommandPalette:** ui `Command` styling; drop its local blur and shadow classes (the dialog supplies the overlay).

Routes for R5: `/`.

### Task 4: Shared widgets, logs components and the Overview page

**Files:** `src/components/widgets/MetricCard.tsx`, `src/components/dashboard/{DashboardFilters,SentinelWatchdog}.tsx`, `src/components/common/{ExportControls,MarkdownRenderer,IntegrityBadge}.tsx`, `src/components/ui/timeline.tsx`, `src/components/logs/{TelemetryFeed,LogDetails,LogDetailModal}.tsx`, `src/app/(dashboard)/page.tsx`.
**Frames:** Overview `12:8` / `137:2208`.

**Specific changes:**

- **MetricCard** becomes a KPI-strip cell per the frame's `KPI strip`: `micro-label` name, value in `font-mono text-2xl font-light tabular-nums`, delta with a ▲/▼ glyph (▲ coral only when the direction is bad).
- **IntegrityBadge:** ui `Badge` with the status variant matching its state.
- **timeline.tsx:83:** `text-white` becomes `text-foreground`.
- **Overview layout (D6):** one KPI strip, then the Velocity Dynamics stream graph beside the Interaction Density calendar heatmap, then Raw Telemetry Logs beside Sentinel.
- Commits: widgets + logs components, then the Overview page.

Routes: `/`.

### Task 5: Auth overlays and app-level states

**Files:** `src/components/common/{LoginOverlay,ConfirmationModal}.tsx`, `src/app/{error,not-found}.tsx`, `src/app/(dashboard)/{loading,error}.tsx`.
**Frames:**

| Frame                  | Dark       | Light      |
| ---------------------- | ---------- | ---------- |
| Login                  | `41:2858`  | `137:4449` |
| Login / Error          | `167:1589` | `167:2780` |
| Login / Caps Lock      | `167:1982` | `167:3173` |
| Login / Authenticating | `169:1131` | `169:1581` |
| Session expiring       | `167:2376` | `167:3567` |

**Specific changes:**

- The login error uses Panel `status="alert"` (▲); caps lock is a warning (◆).
- `ConfirmationModal`'s destructive button is ui `Button variant="destructive"`.
- The error, not-found and loading pages have no frames: give them one `Panel` with `PageHeader` copy in the app voice (`SYSTEM_FAULT`, `NODE_NOT_FOUND`), muted body text, and a `Skeleton` grid for loading.
- Check Login by clearing the cookie: run `visual-check.mjs` with `--signed-out`, a flag this task adds that skips the cookie.

Routes: `/` signed out, `/does-not-exist`.

### Task 6: Traffic, Performance, Logs and Status

**Files:** `src/app/(dashboard)/{traffic,performance,logs}/page.tsx`, `src/app/status/page.tsx`.

**Frames:**

| Page        | Dark      | Light      |
| ----------- | --------- | ---------- |
| Traffic     | `40:98`   | `137:2560` |
| Performance | `41:1952` | `137:3483` |
| Logs        | `41:1491` | `137:3311` |
| Status      | `41:2405` | `137:3657` |

**Specific changes (D6):**

- **Traffic:**
  - the geospatial map is the hero
  - metric tabs (ui `Tabs`), a hover tooltip (`chartTooltip`) and Top regions cards
  - the frame decides the KPI set and region count
- **Performance:** Core Web Vitals over good / needs-work / poor bands, plus the vitals gauges as drawn in the frame, error traces, and service heartbeat tiles.
- **Logs:** a full-height console with level filters and ● / ◆ / ▲ markers, using the `TelemetryFeed` from Task 4.
- **Status:**
  - public page, no sidebar
  - an overall banner using Panel status
  - a 90-day uptime bar per service, cells in `bg-success` / `bg-warning` / `bg-alert` with a text legend that carries the markers
- **Commits:** one per page.
- **Routes:** `/traffic /performance /logs /status`.

### Task 7: AI Terminal, AI Costs, Trajectories, Prompt IDE

**Files:** `src/app/(dashboard)/ai/{page,costs/page,trajectories/page,prompts/page}.tsx`.

**Frames:**

| Page         | Dark       | Light      |
| ------------ | ---------- | ---------- |
| AI Terminal  | `41:140`   | `137:2859` |
| AI Costs     | `41:593`   | `137:2967` |
| Trajectories | `41:1038`  | `137:3142` |
| Prompt IDE   | `178:2303` | `187:2508` |

**Specific changes (D6):**

- **AI Terminal:** a chat terminal with a session list (as in the frame), a thread with an `INTERNAL_REASONING` block in `font-mono` on `bg-panel-raised`, and a composer. No KPI tiles.
- **AI Costs:** a ledger with a budget burn meter (spent / projected / budget, ui `Meter` or `Progress`, as in the frame), daily spend, and the Model Efficiency and Agent Resource tables (ui `Table`).
- **Trajectories:** three panes: trajectory list, NeuralMap with playback controls, and a step inspector (reward, confidence, JSON in `CodeBlock`).
- **Prompt IDE:** a prompt list beside an editor with Editor / Test lab `Tabs`, persona and template fields, detected variables, and a token estimate.
- **Commits:** one per page.
- **Routes:** `/ai /ai/costs /ai/trajectories /ai/prompts`.

### Task 8: Journey and Comms Inbox

**Files:** `src/app/(dashboard)/{journey,forms}/page.tsx`.

**Frames:**

| Page                   | Dark       | Light      |
| ---------------------- | ---------- | ---------- |
| Journey Explorer       | `178:1251` | `187:2029` |
| Comms Inbox (`/forms`) | `178:1603` | `187:2166` |

**Specific changes (D6):**

- **Journey:** master-detail: an identities table (search, last active, engagement, top events) beside a session panel with a timeline and an inference block.
- **Comms Inbox:** a mail client: a transmissions list with status filters, the message with an `AI_ANALYSIS` block, and a reply composer. It keeps the existing `Form` and `toast` usage.
- **Commits:** one per page.
- **Routes:** `/journey /forms`.

### Task 9: Easter Eggs, Audio and Finance

**Files:** `src/app/(dashboard)/{easter-eggs,music,finance}/page.tsx`.

**Frames:**

| Page                          | Dark       | Light      |
| ----------------------------- | ---------- | ---------- |
| Easter Eggs                   | `178:1953` | `187:2313` |
| Audio Intelligence (`/music`) | `178:2523` | `187:2626` |
| Financial Ledger (`/finance`) | `178:2743` | `187:2813` |

**Specific changes (D6):**

- **Easter Eggs:** egg leaderboard bars, unlocks by trigger type, 30-day trend columns, and a recent unlocks feed.
- **Audio:** a five-KPI strip (`MetricCard`), a Top Compositions table with completion bars, and the Genre Spectrum.
- **Finance:** a three-KPI strip, weekly revenue columns stacked by provider (Stripe, Ko-fi; `categorical` colours), and a Recent Transactions table.
- **Commits:** one per page.
- **Routes:** `/easter-eggs /music /finance`.

### Task 10: Close the ratchet, audit, docs

**Files:**

- Modify: `analytics-token-usage.test.ts`
- Modify: `docs/features/analytics-visual-identity.md`
- Modify: `docs/superpowers/plans/2026-11-12-avra-redesign-completion.md`
- Modify: `docs/CONTEXT.md`
- Modify: `ROADMAP.md`

- [x] **Step 1: Close the ratchet.** Delete `PENDING` and the "lists only files that still need work" test, so test 1 covers every file. Run the guard. Expected: pass.
- [x] **Step 2: Coral audit.** Run `rg -n "\b(text|bg|border)-alert\b" apps/analytics/src`. Each hit must either sit next to a `▲` in the same element or be a destructive control. Fix the rest.
- [x] **Step 3: Full visual pass.** Run `visual-check.mjs` over every route from Tasks 3–9. Expected: `overflow=0`, and no errors other than failed fetches.
  - Verified: light frames compared directly for Overview, Traffic, Journey, Logs, AI Terminal, AI Costs, Login; by screenshot only for Status, Finance, Audio; not compared: Trajectories, Comms Inbox, Easter Eggs, Prompt IDE, Session expiring (open).
- [x] **Step 4: Docs.**
  - Tick §4 in the visual identity doc and the R4 checklist in the redesign plan.
  - Add one line to the CONTEXT.md "Critical Build Patterns" section: analytics loads Avra through `@aazucena/ui/globals.css`, and `analytics-token-usage.test.ts` keeps stock palette out.
  - Update the ROADMAP status line.
- [x] **Step 5: Commit, one per concern:**
  - `✅ test(design-system): the analytics guard covers every file`
  - `♿ fix(analytics): alert colour only with ▲` (only if step 2 changed code)
  - `📝 docs: R4, the analytics app is on Avra`
