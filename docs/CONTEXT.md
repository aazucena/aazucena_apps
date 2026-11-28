## Repository Overview

**pnpm + Turborepo monorepo** for Aldrin Azucena's portfolio project.
**Package Manager:** pnpm v10.33.4 (required) | **Node:** >=22.23.4

---

## Project Structure

```
aazucena_apps/
│
│  ── Deployable apps ──
├── apps/
│   ├── portfolio/      # Astro 7 + React 19 — main portfolio (aazucena.com)
│   ├── analytics/      # AZUCENA_LYTICS — Next.js 16 telemetry dashboard
│   ├── cms/            # Strapi v5 CMS (PostgreSQL + pgVector + Cloudinary)
│   └── storybook/      # Component library host (avra.aazucena.com, 373+ stories)
│
│  ── Shared JS/TS libraries (pnpm workspace, @aazucena/* namespace) ──
├── packages/
│   ├── design-system/  # 7 tokens, 18 themes, 35 platform integrations
│   ├── ui/             # 75+ composed components (CVA + forwardRef pattern)
│   ├── forms/          # 94 templates + 98 Zod schemas (TanStack Form)
│   ├── hooks/          # animations/, data/, device/, dom/
│   ├── utils/          # domain utilities (cn(), formatters, etc.)
│   ├── types/          # TypeScript definitions
│   ├── constants/      # global constants
│   ├── animations/     # gsap/, pixi/, three/
│   ├── api/            # API clients, transformers
│   ├── layouts/        # AutoGrid, DashboardLayout, Grid
│   ├── icons/          # registry + custom icons
│   ├── analytics/      # telemetry components + services
│   ├── config/         # ESLint, TS, Prettier, Playwright configs
│   ├── context/        # AnimationContext, DataContext, PortfolioContext
│   ├── stores/         # Redux slices (interactions, journey)
│   └── visualizations/ # D3, intelligence, common
│
│  ── Docker infrastructure services (not in pnpm workspace) ──
├── services/
│   ├── clickhouse/     # OLAP analytics DB (compose + SQL migration scripts 01–07)
│   ├── websocket/      # Real-time WebSocket server (TypeScript)
│   ├── intel-engine/   # Python AI/ML engine (LangChain + LangGraph)
│   ├── intel-bridge/   # Python bridge connecting intel-engine to the stack
│   └── ollama/         # Local LLM runtime (dropped — compose kept for reference)
│
│  ── Documentation ──
├── docs/
│   ├── CONTEXT.md          # Single source of truth (you are here)
│   ├── architecture.md     # Deep-dive: animation system, CMS data flow, packages
│   ├── phase-*.md          # Per-phase plans and status
│   ├── features/           # Feature specs (Rin, music player, AI forms, etc.)
│   ├── ecosystem/nodes/    # 13-node polyglot ecosystem specs
│   ├── incidents/          # Incident post-mortems
│   └── strapi/             # CMS-specific docs
│
│  ── Monorepo config ──
├── turbo.json              # Turborepo task pipeline
├── pnpm-workspace.yaml     # Workspace definition (apps/, packages/)
├── package.json            # Root scripts + tooling deps
├── pnpm-lock.yaml          # Lockfile
├── .npmrc                  # shamefully-hoist + Babel hoist (required for Vercel)
├── compose.yml             # Root Docker Compose (orchestrates services/)
│
│  ── Code quality ──
├── eslint.config.js        # Root ESLint flat config
├── .eslintrc.js            # Legacy ESLint (transitional)
├── .prettierrc.mjs         # Prettier config
├── commitlint.config.mjs   # Enforces conventional commit format
├── cliff.toml              # git-cliff: auto-generates CHANGELOG.md from commits
│
│  ── Git + CI/CD ──
├── .husky/                 # Git hooks (pre-commit → lint-staged)
├── .changeset/             # Changeset versioning config
├── .circleci/              # CircleCI pipeline config
│
│  ── AI assistant configs ──
├── .claude/                # Claude Code: agents, commands, skills, sessions
├── .gemini/                # Gemini session context
│
│  ── Deploy + editor ──
├── .vercel/                # Vercel project link
├── .vscode/                # Shared editor settings
├── .dockerignore
├── .gitignore
│
│  ── Project docs ──
└── README.md / ROADMAP.md / CHANGELOG.md / CLAUDE.md / GEMINI.md / SECURITY.md / LICENSE / NOTICE
```

**Deep architecture details:** `docs/architecture.md`

---

## Essential Commands

```bash
# Root (all workspaces)
pnpm dev                          # all apps in dev mode
pnpm build                        # build all
pnpm lint && pnpm format

# Specific apps
pnpm web:dev                      # portfolio only
pnpm analytics:dev                # analytics only
pnpm --filter portfolio build     # ⚠️ OOMs locally — machine constraint (see below)
pnpm --filter storybook dev       # Storybook on :6006

# ⚠️ Machine constraints (dev machine: 11.6GB RAM, ~3.5GB available, swap exhausted)
# Portfolio build: OOMs during SSR page rendering — deploy via Vercel instead
# Storybook build: needs 8GB heap
NODE_OPTIONS="--max-old-space-size=8192" pnpm --filter storybook build:storybook
# Local quality gate for portfolio: use type-check instead of build
pnpm --filter portfolio type-check

# Chromatic (first run captures baselines)
cd apps/storybook && pnpm chromatic

# TypeScript check (preferred quality gate over Storybook build)
cd packages/ui && pnpm tsc --noEmit
cd packages/forms && pnpm tsc --noEmit

# E2E tests (from apps/portfolio/)
pnpm dlx playwright test
pnpm dlx playwright test --headed
```

---

## Architecture Overview

**Full details:** `docs/architecture.md`

### Portfolio (`apps/portfolio/`)

- **Astro 7.4** + React 19.3 + Tailwind CSS 4 + TypeScript
- **Rendering:** Hybrid (static default, SSR for maintenance/500 pages)
- **Animation System:** `src/components/animations/Section.tsx` (174 lines) — orchestrates 8 sections via PortfolioContext + AnimationContext + DataContext
- **CMS:** Strapi → 25 API clients → Zod validators → transformers → DataContext → hooks

### Analytics (`apps/analytics/`)

- **Next.js 16** (App Router) + Redux Toolkit + TanStack Query v5 + D3.js + Vercel AI SDK
- **ClickHouse** OLAP for high-volume telemetry; Edge Runtime ingestion (<50ms)
- Dashboards: Node Overview, Audio Intelligence, Telemetry Stream, System Integrity, AI Terminal, AI Cost Center, Trajectory Labs

### Critical Build Patterns

**CMS has two lockfiles.** The workspace uses the root `pnpm-lock.yaml`, but `apps/cms/Dockerfile*` and Railway install `apps/cms` standalone from `apps/cms/pnpm-lock.yaml`, where `apps/cms/package.json`'s own `pnpm.overrides` apply (pnpm warns that they're ignored in the workspace; keep them anyway). After changing cms dependencies or root security overrides, mirror the overrides and run `pnpm install --ignore-workspace --lockfile-only` in `apps/cms`. Standalone cms stays on React 18 (Strapi 5 peer).

**Avra tokens are named once.** The Figma variables' WEB code syntax matches the CSS custom properties `packages/design-system` emits (`--panel`, `--state`, `--rule`, `--signal`, `--signal-subtle`, `--alert`, `--warning`, `--series-1..4`, `--chart-seq-*`, `--radius-card|control`, `--control-md`, `--motion-*`), and `@aazucena/ui` exposes them as Tailwind utilities (`bg-panel`, `bg-state`, `border-rule`, `rounded-control`, `h-control`, `micro-label`). Use those, not stock palette classes; the shadcn names (`--card`, `--muted`, `--ring`) are derived aliases.

**Chart colors come from `chartTheme`.** `@aazucena/visualizations` reads series, ramps, grid, axis and tooltip colors as CSS `var()` strings (`chartTheme`, `categorical`, `sequentialScale`, `chartTooltip` in `src/theme.ts`), so charts follow the vibe and mode with no redraw. Never tween a fill between two `var()` values: D3 interpolates the digits in the variable name, so set colors outright and transition only geometry. Continuous ramps are binned (`scaleQuantize` onto five steps) because variables can't be interpolated. A guard test (`visualizations-color.test.ts`) rejects literal colors, D3 schemes and stock Tailwind hues in the package. Apps that don't load `css-vars.css` import `@aazucena/visualizations/chart.css` (generated with `structure.css` by `ds:structure`); the portfolio gets the chart roles through `@aazucena/ui/globals.css` and generates the package's Tailwind classes through `@source` lines in `apps/portfolio/src/styles/globals.css` (a guard fails when an imported package with markup has none; before 2026-11-22 the visualizations package had none, so Journey chart controls had no styles). Figma mirrors this on the Analytics kit page: `ChartPanel`, `ChartControl`, `ChartExport`, `ChartTooltip`, `ChartLegendToggle`, `ChartSequentialLegend`, and the `color/chart/*` variables.

**Apps that render `@aazucena/ui` components must load its structural tokens.** Components read stacking, density and motion through `var()` (`z-(--z-modal)`, `duration-(--motion-base)`); an undefined variable makes the whole declaration invalid, so z-index falls back to `auto` and durations to 0. Storybook, analytics and the portfolio get the tokens from `css-vars.css` (the portfolio through `@aazucena/ui/globals.css`, which also loads Avra's palette; the homepage content is bound to the dark tokens by a `.dark` wrapper in `HomeLayout.astro`, so it stays dark whatever the site theme). `@aazucena/ui/structure.css` is a committed file for apps without `css-vars.css`, generated by `pnpm --filter @aazucena/design-system ds:structure` after changing `tokens/z-index.ts` or `tokens/instrument.ts` (a test fails when it is stale).

**Storybook docs pages theme through a container, not decorators.** Decorators never run on a standalone MDX page, so `.storybook/docs-container.tsx` applies the light/dark class and the vibe to every docs page and swaps the docs theme. MDX demos import real `@aazucena/ui` components inside an `sb-unstyled` wrapper; live token swatches come from `stories/design-tokens/_token-swatches.tsx`. A story file whose stories only work in one mode locks it with `globals: { theme: 'dark' }` on its meta; the docs container honours the lock on the docs page too (see `animation-particles.stories.tsx`).

**Accessibility is gated in three places.** Storybook runs axe on every interaction-test story with `a11y.test: 'error'`; `packages/design-system/src/utils/ui-token-usage.test.ts` fails on dimmed text (`opacity-*` or `text-foreground/50` on text; use `text-muted-foreground`), on a tint above 10% under signal or status text, and on `outline-none` with no focus style; `@aazucena/config/eslint/a11y.js` makes unnamed controls and missing `alt` lint errors in ui, forms and layouts. A custom widget gets a keyboard play test in its story. Audit and results: `docs/audits/2026-11-13-accessibility.md`.

**Storybook shows where the apps use each component.** Storybook is the general catalog; "Used in" on each component docs page lists the analytics and portfolio files that import it, and `Docs/Component Usage` indexes every module (used ones first, catalog-only collapsed). `.storybook/usage/scan.ts` reads the apps' imports from `@aazucena/ui`, `visualizations`, `layouts` and `forms` when Storybook starts and serves them as `virtual:component-usage` (plugin in `main.ts`), so the data can't go stale and nothing is committed. A page finds its module from `component`, then the title; gallery pages with several components (the charts) list every module their story file imports. Override with `parameters.usage: { module: 'ui/sonner' }` or hide with `{ show: false }`. Local copies of a component in an app don't count; only imports do.

**Analytics runs on Avra.** `apps/analytics/src/styles/globals.css` imports `@aazucena/ui/globals.css`, and `packages/design-system/src/utils/analytics-token-usage.test.ts` fails on stock palette, glass, big radii and literal colours in any analytics `.tsx` file.

**Portfolio runs on Avra.** `apps/portfolio/src/styles/globals.css` imports `@aazucena/ui/globals.css`, and `packages/design-system/src/utils/portfolio-token-usage.test.ts` fails on stock palette, glass, big radii and literal colours in any portfolio `.astro`, `.tsx` or `.ts` file; `SCENE_EXEMPT` lists the two files whose colours are scene imagery. Fonts come from `lib/utils/fonts.ts` through `fontVariablesCss` (plain CSS in `BaseLayout`), never `define:vars`, whose variables never resolved and left the system font on the branch; `portfolio-fonts.test.ts` guards it. A visual check must confirm the computed `font-family` (Fira Sans, Fira Code), because a fallback font looks plausible.

**Portfolio headers and footer use `WatermarkBackground`.** A Figma frame that omits an existing decoration or content is not permission to remove it: ask the owner.

**Tailwind `@custom-variant` with a comma media list needs the block form** (`@custom-variant x { @media (a), (b) { @slot; } }`). The one-line shorthand drops comma media lists.

**Storybook visual tests run on Argos.** `argosVitestPlugin` in `apps/storybook/vitest.config.ts` screenshots every story the Vitest run renders. It uploads only when `CI` is set, using `ARGOS_TOKEN` (a CircleCI project env var, never committed); local runs write `apps/storybook/screenshots/` (gitignored). CI runs on main only, so the latest main build is the baseline and changes are reviewed after merge.

```typescript
// Vercel .npmrc — required for Babel dependency tracing
shamefully-hoist=true
public-hoist-pattern[]=*babel*

// React 19.2 polyfill — add to index.astro (React is now 19.3; removal tracked in the backlog)
if (typeof window !== 'undefined' && !window.suspendOnActiveViewTransition) {
  window.suspendOnActiveViewTransition = function() { return null; };
}

// CMS rendering
MarkdownRenderer  // for Strapi 'richtext' fields (string)
BlocksRenderer    // for Strapi 'blocks' fields (JSON array)

// Performance: SSR pages need
export const prerender = false  // maintenance.astro, 500.astro

// Lazy loading — must use client:only="react", NOT client:load or client:visible
// Reason: client:load/visible SSR the component → D3 reads width=0 on first mount
//         → charts render empty; client:only skips SSR so real DOM dimensions are
//         available immediately. All journey page components require client:only.
// Remove static imports for code-split modules; dynamic imports only
// Three.js: frameloop="demand", call invalidate() to request frames

// Tailwind dark-mode + scroll animations — avoid transition-all on themed elements
// transition-all animates every CSS property including color/background-color, causing
// a visible delay (~300ms) when the dark-mode class toggles. Scope to specific props:
//   nav scroll state → transition-[padding,box-shadow,backdrop-filter]
//   link hover state → transition-[box-shadow]
//   interactive tap  → transition-transform
```

---

## Package System (Phase 4)

All 16 packages are scaffolded and populated. **Portfolio app does not yet import from them** — integration is the remaining Phase 4 work.

**UI component pattern:**

```tsx
// CVA + React.forwardRef + 3 variants + cn() from @aazucena/utils
// Barrel: packages/ui/src/components/ui/index.ts (225+ entries)
```

**Forms pattern:**

```tsx
import { LoginForm } from '@aazucena/forms/templates'
const form = useForm({ ... } as any)  // validatorAdapter not in FormOptions type
onSubmit: async ({ value }: { value: any }) => { ... }
// Zod 4: .refine()/.superRefine() keep the ZodObject type, so .shape is available
```

---

## Code Patterns & Conventions

### File Naming

- React components: PascalCase (`Section.tsx`, `HeroSection.tsx`)
- Hooks: `use` prefix camelCase (`useModal.ts`)
- Utilities: camelCase (`formatDate.ts`)

### Component Structure

- Astro: `.astro` extension
- React: `.tsx` extension, default export, `ComponentNameProps` interface

### State Management

- React Context for cross-component state; custom hooks for encapsulation
- Avoid prop drilling — use contexts
- `capabilities.canUseHeavyAnimations` gates Three.js/PixiJS rendering

### Utilities (Phase 2 Pattern)

- Import from `~/lib/utils` (barrel via `index.ts`)
- Domain-specific files: `blog.ts`, `projects.ts`, `experiences.ts`, etc.
- Adding new: create domain file → export with JSDoc → add to `index.ts`

### @aazucena/forms Type Error Patterns

- Custom props conflicting with native HTML handlers → add to `Omit<>` list
- `React.useRef<T>()` without initial → use `React.useRef<T>(undefined)`
- `field.state.meta.errors` → render as `String(field.state.meta.errors[0])`
- Generic forwardRef components need wrapper function + cast pattern

---

## Important File Locations

### Configuration

- `apps/portfolio/astro.config.mjs` — Astro configuration
- `apps/portfolio/tailwind.config.mjs` — Tailwind
- `turbo.json` — Turborepo pipeline
- `.husky/pre-commit` — lint-staged hook

### Documentation

- `ROADMAP.md` — high-level roadmap + phase status
- `docs/architecture.md` — deep architecture reference (animation, CMS, packages)
- `docs/phase-*.md` — per-phase docs
- `docs/features/*.md` — feature planning docs
- `docs/incidents/README.md` — incident documentation standard (structure, severity threshold)
- `docs/incidents/YYYY-MM-DD-*/` — per-incident directories: `README.md` + `debug-log.md` + `post-incident.md`

### Portfolio Key Files

- `apps/portfolio/src/pages/index.astro` — entry point
- `apps/portfolio/src/pages/[slug].astro` — dynamic page router (73 lines)
- `apps/portfolio/src/templates/` — EditorialTemplate, LegalTemplate, LandingTemplate
- `apps/portfolio/src/config/site.ts` — centralized site config
- `apps/portfolio/src/components/animations/Section.tsx` — animation orchestrator (174 lines)
- `apps/portfolio/src/components/animations/contexts/` — PortfolioContext, AnimationContext, DataContext
- `apps/portfolio/src/lib/api/` — 25 Strapi API clients
- `apps/portfolio/src/lib/validators/` — 20+ Zod schemas
- `apps/portfolio/src/lib/transformers/` — 20+ data transformers
- `apps/portfolio/src/lib/utils/` — 15 modular utility files

### Storybook

- `apps/storybook/stories/components/` — 260 component stories
- `apps/storybook/stories/forms/` — 94 form stories (13 categories)
- `apps/storybook/stories/design-tokens/` — MDX token docs
- `apps/storybook/.env` — `CHROMATIC_PROJECT_TOKEN` configured

---

## Development Roadmap (Summary)

**Full details:** `ROADMAP.md`

**Phase names.** Three plans number their phases, so each has a prefix:

- **Phase N** (no prefix): the roadmap phases below.
- **R0–R5**: the Avra redesign, Part 2 (`docs/superpowers/plans/2026-11-12-avra-redesign-completion.md`). R4 is the analytics app, R5 the portfolio.
- **D0–D7**: Avra distribution outside this repo (`docs/features/avra-distribution.md`). D1 is cleanup and ui 0.3.0, D2 the design-system `var()` refactor.

| Phase                            | Status        | Key Achievement                               |
| -------------------------------- | ------------- | --------------------------------------------- |
| Phase 1 — Animations Refactoring | ✅ 2025-01-13 | Section.tsx 324→174 lines                     |
| Phase 1.5 — Code Quality         | ✅ 2025-12-03 | CVEs fixed, memory leaks patched              |
| Phase 0 — Infrastructure         | ✅ 2026-01-17 | Strapi + Railway + 15 pages                   |
| Phase 2 — Component Architecture | ✅ 2026-02-02 | Templates, flat structure                     |
| Phase 3 — Performance            | ✅ 2026-02-04 | 410KB → 105KB (74.3% reduction)               |
| Phase 4 — Developer Experience   | ✅ 2026-05-11 | 16 packages + 373+ stories + public Storybook |
| Phase 5 — Testing                | 🔥 current    | Vitest + Playwright                           |

---

## Tech Stack

| Layer     | Tech                                                                   |
| --------- | ---------------------------------------------------------------------- |
| Portfolio | Astro 7, React 19.3, Tailwind 4, GSAP, Three.js, PixiJS, Framer Motion |
| Analytics | Next.js 16, Redux Toolkit, TanStack Query v5, D3.js, Vercel AI SDK     |
| CMS       | Strapi v5, PostgreSQL 16 + pgVector, Cloudinary, Redis                 |
| Forms     | react-hook-form + Zod, TanStack Form                                   |
| Testing   | Playwright (configured), Vitest (installed, not configured)            |
| DX        | Storybook, Chromatic, Husky, lint-staged, Turborepo                    |
| AI/ML     | LangChain, LangGraph, LangSmith, Claude 3.5 Sonnet, pgVector           |
| Deploy    | Vercel (frontend), Railway (CMS), CircleCI (CI)                        |

---

## Git & Deployment

**Current Branch:** `phase-5/next-release` (Phase 5 testing + analytics UI redesign + features + maintenance)
**CI/CD:** CircleCI — currently prechecks only; Railway handles Docker builds
**Frontend:** Vercel (auto-deploy from GitHub). Previews are off for `phase-5/next-release` to save build cost, through `git.deploymentEnabled` in the `vercel.json` of portfolio, analytics and storybook; delete that rule from all three to get previews back. `main` still deploys.
**Backend:** Railway

### Commits

Commit by separate concern: one commit per logical change, even when several changes are pending together. A `.gitignore` tweak and a CI config change are two commits, not one. Stage files explicitly (`git add <path>`) rather than `git add -A` so unrelated changes don't ride along.

### Versioning

`@aazucena/*` packages are versioned with Changesets (first release 0.1.0, 2026-11-11). A change to a package that Storybook documents needs a changeset: `pnpm changeset`, pick the packages and bump, write a one-line summary. To cut a release on main, run `GITHUB_TOKEN=$(gh auth token) pnpm version-packages`; it bumps versions, writes each package's `CHANGELOG.md`, and Storybook's Docs/Changelog page renders the ui and design-system logs. The toolbar badge shows the `@aazucena/ui` version (`apps/storybook/.storybook/version.ts`). Packages are not published to npm.

Storybook's version switcher (`storybook-addon-semantic-version`) reads `apps/storybook/public/root/versions.json` and links to `/storybooks/<version>/`, which `apps/storybook/vercel.json` rewrites. At each release:

1. Add the new version to the top of `versions.json`.
2. Point the old version's rewrite at the immutable URL of the last avra deployment that served it (Vercel dashboard → avra → Deployments), and add `/storybooks/<new>/:path*` → `/:path*` for the current one.
3. Check that `/storybooks/<old>/` loads on avra.aazucena.com. Vercel Deployment Protection covers `*.vercel.app` deployment URLs by default; if the proxied page returns 401, relax protection for the avra project.

### Authorship

No AI-attributed authoring anywhere in the repo. AI assistants (Claude, Gemini, etc.) must not add:

- `Co-Authored-By:` trailers for AI models in commit messages
- "Generated with Claude Code" / "🤖 Generated with ..." lines in PR descriptions
- AI author credits, bylines, or "written by AI" notes in code comments, docs, or changelogs

---

## Workflow Tips

### Before Starting Work

1. Check `ROADMAP.md` for current priorities
2. Check `docs/architecture.md` for architecture deep-dives
3. Check `docs/phase-*.md` for the relevant phase

### Working with Animations

1. `Section.tsx` is the orchestrator (174 lines) — don't add more logic here
2. Use PortfolioContext / AnimationContext / DataContext via hooks
3. Test all 8 sections after changes; verify atmospheric layer transitions

### Working with Page Templates

1. Router (`[slug].astro`) = routing + SEO only; templates = presentation only
2. Adding templates: `PageTemplateEnum` → `[Name]Template.astro` → `templates/index.ts` → router conditional

### Working with Packages

1. Type-check with `pnpm tsc --noEmit` (faster than Storybook build)
2. Storybook stories in `apps/storybook/stories/` — Gold Standard: JSDoc + autodocs + argTypes with table.category
3. Export name matches filename PascalCase (`datepicker.tsx` → `Datepicker`)
4. `pnpm format` has a pre-existing analytics app failure — format UI/forms files directly

### Monorepo

- Always use `pnpm` (never npm/yarn)
- `pnpm dev --filter *portfolio*` — workspace filter
- `turbo build --force` — bypass Turbo cache

---

## Current Status

**Last Updated:** 2026-11-27

### Completed ✅

- Phases 0→3 (Infrastructure, Animations, Components, Performance)
- AZUCENA_LYTICS v1 (all 5 phases: ingestion, AI observability, external data, advanced features, hardening)
- **Phase 4:** Developer Experience — 16 packages + 373+ Storybook stories + public Storybook hosting + portfolio/CMS upgrades
- **Avra redesign R0–R5** (2026-11): tokens, ui pass, Figma kits and app frames, charts on `chartTheme`, analytics (R4, 2026-11-20) and portfolio (R5, 2026-11-27) on Avra. Before merging to main, check one Vercel preview (backlog).

### In Progress 🔥

- **Phase 5:** Testing & Quality
  - 🟡 Vitest: set up in 8 workspaces, 31 test files (portfolio 65 tests, design-system 181, utils 41, hooks 4), mostly guard tests; the 70–80% coverage target for hooks and utilities is not measured yet, and `ui` has no unit tests
  - 🟡 Storybook interaction tests: 60 story files, axe at `error`
  - ⏳ Playwright E2E: not started (`apps/portfolio/tests/example.spec.ts` is the template); 100% critical-flow target and the 10 smoke tests carried over from Phase 4 are open
- **Avra distribution P1** (cleanup and ui 0.3.0): 2 of 8 tasks done (declared dependencies, `tw-animate-css`); the legacy-variant removal, registry prep and release notes are next
