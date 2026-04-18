## Repository Overview

**pnpm + Turborepo monorepo** for Aldrin Azucena's portfolio project.
**Package Manager:** pnpm v10.33.0 (required) | **Node:** >=18

---

## Project Structure

```
aazucena_apps/
├── apps/
│   ├── portfolio/      # Astro 5 + React 19 — main portfolio
│   ├── analytics/      # AZUCENA_LYTICS — Next.js 15 telemetry dashboard
│   ├── cms/            # Strapi v5 CMS
│   └── storybook/      # Standalone Storybook app (373+ stories)
├── packages/           # 16 specialized packages (all scaffolded — Phase 4)
│   ├── design-system/  # 7 tokens, 18 themes, 35 platform integrations
│   ├── ui/             # 284 component files (75+ composed components)
│   ├── forms/          # 94 templates + 48 Zod schemas
│   ├── hooks/          # animations/, data/, device/, dom/
│   ├── utils/          # domain utilities
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
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
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

- **Astro 5.16.0** + React 19.2 + Tailwind CSS 4 + TypeScript
- **Rendering:** Hybrid (static default, SSR for maintenance/500 pages)
- **Animation System:** `src/components/animations/Section.tsx` (174 lines) — orchestrates 8 sections via PortfolioContext + AnimationContext + DataContext
- **CMS:** Strapi → 25 API clients → Zod validators → transformers → DataContext → hooks

### Analytics (`apps/analytics/`)

- **Next.js 15** (App Router) + Redux Toolkit + TanStack Query v5 + D3.js + Vercel AI SDK
- **ClickHouse** OLAP for high-volume telemetry; Edge Runtime ingestion (<50ms)
- Dashboards: Node Overview, Audio Intelligence, Telemetry Stream, System Integrity, AI Terminal, AI Cost Center, Trajectory Labs

### Critical Build Patterns

```typescript
// Vercel .npmrc — required for Babel dependency tracing
shamefully-hoist=true
public-hoist-pattern[]=*babel*

// React 19.2 polyfill — add to index.astro (until React 19.3+)
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
// ZodEffects (.refine()/.superRefine()) returns ZodEffects not ZodObject — cannot access .shape
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

| Phase                            | Status        | Key Achievement                  |
| -------------------------------- | ------------- | -------------------------------- |
| Phase 1 — Animations Refactoring | ✅ 2025-01-13 | Section.tsx 324→174 lines        |
| Phase 1.5 — Code Quality         | ✅ 2025-12-03 | CVEs fixed, memory leaks patched |
| Phase 0 — Infrastructure         | ✅ 2026-01-17 | Strapi + Railway + 15 pages      |
| Phase 2 — Component Architecture | ✅ 2026-02-02 | Templates, flat structure        |
| Phase 3 — Performance            | ✅ 2026-02-04 | 410KB → 105KB (74.3% reduction)  |
| Phase 4 — Developer Experience   | 🚧 ~90%       | 16 packages + 373+ stories       |
| Phase 5 — Testing                | ⏳ next       | Vitest + Playwright              |

**Phase 4 remaining (1-2 days):** Chromatic first baseline + CircleCI Chromatic job + portfolio importing `@aazucena/*`

---

## Tech Stack

| Layer     | Tech                                                                   |
| --------- | ---------------------------------------------------------------------- |
| Portfolio | Astro 5, React 19.2, Tailwind 4, GSAP, Three.js, PixiJS, Framer Motion |
| Analytics | Next.js 15, Redux Toolkit, TanStack Query v5, D3.js, Vercel AI SDK     |
| CMS       | Strapi v5, PostgreSQL 16 + pgVector, Cloudinary, Redis                 |
| Forms     | react-hook-form + Zod, TanStack Form                                   |
| Testing   | Playwright (configured), Vitest (installed, not configured)            |
| DX        | Storybook, Chromatic, Husky, lint-staged, Turborepo                    |
| AI/ML     | LangChain, LangGraph, LangSmith, Claude 3.5 Sonnet, pgVector           |
| Deploy    | Vercel (frontend), Railway (CMS), CircleCI (CI)                        |

---

## Git & Deployment

**Current Branch:** `phase-4/developer-experience`
**CI/CD:** CircleCI — currently prechecks only; Railway handles Docker builds
**Frontend:** Vercel (auto-deploy from GitHub)
**Backend:** Railway

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

**Last Updated:** 2026-04-06

### Completed ✅

- Phases 0→3 (Infrastructure, Animations, Components, Performance)
- AZUCENA_LYTICS v1 (all 5 phases: ingestion, AI observability, external data, advanced features, hardening)
- Phase 4 core: 16 packages, 373+ Storybook stories, 94 form templates, design system

### In Progress 🚧 (~90% Complete)

- **Phase 4:** Developer Experience
  - ✅ 16 packages scaffolded with full content
  - ✅ 373+ Storybook stories/docs in `apps/storybook/`
  - ✅ 94 form templates + 48 Zod schemas (`@aazucena/forms`)
  - ✅ Design system: 7 tokens, 18 themes, 35 platform integrations
  - ✅ TypeScript strict mode (all apps) + Git hooks (Husky)
  - ⏳ Remaining: Chromatic first baseline + CircleCI Chromatic job + portfolio importing `@aazucena/*`

### Next

- **Phase 5:** Testing — Vitest unit tests + Playwright E2E
