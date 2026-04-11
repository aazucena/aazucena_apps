# Aldrin Azucena Portfolio Monorepo

![Status](https://img.shields.io/badge/status-active_development-orange) ![Phase](https://img.shields.io/badge/phase-4_%E2%80%94_developer_experience-blue)

A **pnpm + Turborepo monorepo** for Aldrin Azucena's portfolio project. The primary application is an Astro-based portfolio with React integration, featuring advanced animations (GSAP, Three.js, PixiJS) and a planned Strapi CMS backend.

**Package Manager:** pnpm v10.33.0 (required)
**Node Version:** >=18

---

## 🏁 Getting Started

### Prerequisites

- **Node.js >=18** — [nodejs.org/en/download](https://nodejs.org/en/download) (verify: `node --version`)
- **pnpm 10.33.0** — install via npm:

```bash
npm install -g pnpm@10.33.0
```

> **Why pnpm?** This monorepo uses pnpm workspaces. The `package.json` pins the exact version (`10.33.0`) via the `packageManager` field — using a different version may cause a silent install failure. Always install the pinned version.

### Install & Run

```bash
# 1. Clone the repo
git clone https://github.com/aazucena/aazucena_apps.git
cd aazucena_apps

# 2. Install all workspace dependencies
pnpm install

# 3. Copy the environment file for the portfolio
cp apps/portfolio/.env.example apps/portfolio/.env

# 4. Start the portfolio
pnpm web:dev
```

The portfolio will be available at `http://localhost:4321`.

> **No CMS required to run locally.** Every API call falls back to built-in default content if the CMS is unreachable, so the portfolio renders fully — animations, components, and layout — without needing a running Strapi instance. Your own project data (posts, skills, etc.) won't appear until the CMS is connected, but the full frontend experience is visible.

| App                 | Requires         | Command              | URL                   |
| ------------------- | ---------------- | -------------------- | --------------------- |
| Portfolio (Astro)   | `.env` copy only | `pnpm web:dev`       | http://localhost:4321 |
| Storybook           | Nothing          | `pnpm storybook:dev` | http://localhost:6006 |
| Analytics (Next.js) | ClickHouse + DB  | `pnpm analytics:dev` | http://localhost:3000 |
| CMS (Strapi)        | PostgreSQL       | `pnpm cms:dev`       | http://localhost:1337 |

> **Note:** Running all apps simultaneously (`pnpm dev`) requires significant RAM (~8GB free). Start with `pnpm web:dev` for the portfolio or `pnpm storybook:dev` for the component library.

---

## 🎯 Quick Links

- **[Full ROADMAP](./ROADMAP.md)** - Complete development roadmap with phases and features
- **[Documentation Hub](./docs/README.md)** - Detailed implementation guides
- **[Phase 4 (Current Priority)](./docs/phase-4-developer-experience.md)** - Developer Experience

---

## 📁 Project Structure

```
aazucena_apps/
├── apps/
│   ├── portfolio/          # Main Astro portfolio application
│   ├── analytics/          # AZUCENA_LYTICS: Engineering Intelligence Terminal (Next.js)
│   └── cms/                # Strapi CMS backend
├── packages/               # 13 specialized packages (Phase 4)
│   ├── design-system/      # Design tokens + 35 platform integrations + docs
│   ├── ui/                 # Component library (ShadCN + composed)
│   ├── hooks/              # React hooks library
│   ├── utils/              # Pure utility functions
│   ├── types/              # TypeScript type definitions
│   ├── constants/          # Global constants
│   ├── animations/         # Animation utilities (GSAP, Three.js, PixiJS)
│   ├── api/                # API clients, validators, transformers
│   ├── forms/              # Form system (react-hook-form + Zod)
│   ├── layouts/            # Layout components
│   ├── icons/              # Icon system
│   ├── analytics/          # Tracking & telemetry
│   └── config/             # Build configurations
├── turbo.json              # Turborepo task pipeline configuration
├── pnpm-workspace.yaml     # pnpm workspace configuration
└── package.json            # Root workspace scripts
```

---

## 🚀 Essential Commands

### Development

```bash
# Run all workspaces in dev mode
pnpm dev

# Run only portfolio app
pnpm web:dev

# Run only analytics dashboard
pnpm analytics:dev

# Build all apps
pnpm build

# Lint all apps
pnpm lint

# Format code
pnpm format
```

### Portfolio-Specific Commands

From `apps/portfolio/`:

```bash
# Development server (Astro)
pnpm dev

# Production build
pnpm build

# Preview production build
pnpm preview
```

### Analytics-Specific Commands

From `apps/analytics/`:

```bash
# Development server (Next.js)
pnpm dev

# Production build
pnpm build
```

### Testing

```bash
# E2E tests (Playwright) - from portfolio directory
pnpm dlx playwright test

# Run specific test file
pnpm dlx playwright test tests/example.spec.ts

# Run tests in headed mode
pnpm dlx playwright test --headed

# View test report
pnpm dlx playwright show-report
```

**Note:** Vitest is installed but test configuration not yet implemented. Playwright config exists at `apps/portfolio/playwright.config.ts`.

---

## 🛠️ Tech Stack

### Frontend & Analytics

- **Frameworks:** Astro (Portfolio), Next.js 15 (Analytics)
- **Build Tool:** Vite, Turbo
- **UI Library:** React 19 with TypeScript
- **Styling:** Tailwind CSS 4
- **UI Components:** ShadCN UI
- **Animations:** GSAP (GreenSock), Three.js, PixiJS, Framer Motion
- **Visualizations:** D3.js (Telemetry Dashboards)
- **Audio:** Howler.js (playback), wavesurfer.js (waveform), Strudel.cc (live coding)
- **Icons:** @mynaui/icons-react v0.3.9
- **Data Management:** TanStack Query v5, TanStack Table
- **Forms:** react-hook-form + Zod
- **Payments:** Stripe, Ko-fi
- **State Management:** Redux Toolkit (Analytics), React Context API + Custom Hooks (Portfolio)

### Backend & Infrastructure

- **CMS:** Strapi v5
- **Databases:**
  - PostgreSQL 16+ with pgVector extension (App Data)
  - ClickHouse (OLAP Analytics Data)
- **Storage:** Cloudinary
- **Monorepo:** pnpm + Turborepo
- **Caching:** Redis
- **Frontend Deploy:** Vercel (auto via GitHub)
- **Backend Deploy:** Railway
- **CI/CD:** CircleCI (CMS only)

### Monitoring & Logging

- **Frontend:** Sentry, Vercel Analytics, Vercel Speed Insights
- **Backend:** Pino, Sentry
- **Caching:** Redis

### Development Tools

- **Design:** Figma
- **Component Dev:** Storybook
- **Visual Testing:** Chromatic
- **Testing:** Vitest (unit), Playwright (E2E)
- **API Testing:** Postman

### AI/ML

- **LLM Orchestration:** LangChain, LangGraph
- **Observability:** LangSmith
- **Primary LLM:** Anthropic Claude 3.5 Sonnet
- **Vector Database:** pgVector (PostgreSQL extension)
- **Embeddings Models:**
  - OpenAI (text-embedding-3-small, text-embedding-3-large)
  - Cohere (embed-english-v3.0, embed-multilingual-v3.0)
  - Anthropic Claude (via Voyage AI)
  - Google Gemini (Vertex AI textembedding-gecko)
  - Local Models (Sentence Transformers, all-MiniLM-L6-v2)
- **Retrieval & Ranking:** LangChain Retrievers, Cohere Rerank, Cross-encoders
- **ML Frameworks:** PyTorch/TensorFlow (optional, for advanced features)

### API Integrations

- YouTube, LinkedIn, Spotify, SoundCloud, Weather, WakaTime, SendGrid/Resend, Ko-fi, reCAPTCHA v3

---

## 📚 Documentation

All detailed implementation guides, code examples, and specifications are in the **[`docs/`](./docs/)** folder:

### Phase Documentation

- [Phase 0: Infrastructure](./docs/phase-0-infrastructure.md) ✅ COMPLETED
- [Phase 1: Animations Refactoring](./docs/phase-1-animations-refactoring.md) ✅ COMPLETED
- [Phase 2: Component Architecture](./docs/phase-2-component-architecture.md) ✅ COMPLETED
- [Phase 3: Performance](./docs/phase-3-performance.md) 🔥 **CURRENT PRIORITY**
- [Phase 4: Developer Experience](./docs/phase-4-developer-experience.md)
- [Phase 5: Testing](./docs/phase-5-testing.md)

### Feature Documentation

- [Music Player & Compositions](./docs/features/music-player.md)
- [Strudel.cc Live Coding](./docs/features/strudel-integration.md)
- [AI-Powered Forms](./docs/features/ai-forms.md) - Comprehensive with vector search
- [Machine Learning Features](./docs/features/machine-learning.md)
- [Logging & Monitoring](./docs/features/logging-monitoring.md)
- [Payment Integration](./docs/features/payments.md)

---

## ⏱️ Development Timeline

### Recommended Order

```
Phase 1 (Animations) → 9-11 days ⚡ START HERE
    ↓
Phase 0 (Infrastructure) → 12-16 days
    ↓
Phase 2 (Component Architecture) → 6-8 days
    ↓
Phase 3 (Performance) → 4-6 days
    ↓
Phase 4 (Developer Experience) → 19-20 days (adjusted)
    ↓
Phase 5 (Testing) → 5-8 days
    ↓
Features (as needed) → 3-40 days each
```

**Total Core Phases:** 61.5-75 days (~2.5-3.5 months)

---

## 🎯 Current Status

### Completed ✅

- **Phase 3:** Performance Optimization (100% complete) - 2026-02-04
  - ✅ 74.3% bundle reduction (410KB → 105KB gzipped)
  - ✅ Exceeded 63% target by 11.3%
  - ✅ Lazy loading (AnimationCanvas, modals, layers)
  - ✅ Code splitting (6 dynamic chunks)
  - ✅ Demand-based rendering (Three.js frameloop='demand')
  - ✅ React 19 polyfill workaround
  - ✅ Progressive enhancement architecture
- **Phase 2:** Component Architecture (100% complete) - 2026-02-02
  - ✅ Template system (3 templates operational)
  - ✅ Utility refactoring (15 modular files)
  - ✅ Common components (6 new components)
  - ✅ Site config centralization
  - ✅ Navigation Plugin Integration - CMS-driven navigation
  - ✅ Footer CMS Integration - Dynamic tech stack
  - ✅ Homepage restructuring (animations → homepage, type-first)
  - ✅ Journey restructuring (type-first: ui/journey, visualizations/journey)
  - ✅ Scene directory flattening (depth 3 → 2, ~70 files reorganized)
  - ✅ Component extraction (all 8 sections <120 lines)
  - ✅ AZUCENA_LYTICS_v1 (Engineering Intelligence Terminal)
- **Phase 1:** Animations Refactoring (324 → 174 lines, 46% reduction) - 2025-01-13
- **Phase 1.5:** Code Quality & Security Fixes (CVEs, memory leaks) - 2025-12-03
- **Phase 0:** Infrastructure & Architecture (100% complete) - 2026-01-17
  - Sub-phases 0.1 → 0.5 (CMS, Deployment, Content Migration, 15 Pages)
  - 24 modular API clients, Footer, RSS, Sitemap, 500 error page
  - Fixed rich text rendering and Vercel build configuration

### In Progress 🚧 (~95% Complete)

- **Phase 4:** Developer Experience - 🔥 CURRENT PRIORITY
  - ✅ 16 packages scaffolded with full content
  - ✅ 373+ Storybook stories/docs (260 component, 94 form, charts, animations, MDX)
  - ✅ 94 form templates + 48 Zod schemas (`@aazucena/forms`)
  - ✅ Design system: 7 tokens, 18 themes, 35 platform integrations
  - ✅ TypeScript strict mode (all apps) + Git hooks (Husky + lint-staged)
  - ✅ All 13 `@aazucena/*` packages integrated into `apps/portfolio/`
  - ✅ Storybook stories synced with latest package props
  - ⏳ Chromatic — skipped (paid plan required); visual regression deferred to Phase 5
  - ⏳ Figma Design System — deferred post-Phase 4

### Next Up ⏳

- **Phase 5:** Testing & Quality (Vitest unit tests + Playwright E2E)

---

## 🔧 Monorepo Utilities

This Turborepo has the following tools configured:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting
- [pnpm](https://pnpm.io/) for fast, disk-efficient package management
- [Turborepo](https://turbo.build/repo/docs) for task orchestration and caching

### Turborepo Tips

```bash
# Run commands for specific workspace
pnpm dev --filter *portfolio*

# Force rebuild (bypass cache)
turbo build --force

# Clear Turborepo cache
turbo prune
```

---

## 📝 Important Notes

- **Always use pnpm** (never npm or yarn) for consistency
- **Turborepo caches builds** - use `turbo build --force` to bypass cache
- **Current Priority:** Phase 4 - Developer Experience (19-20 days, 13 packages, 2 existing) 🔥
- **Phase 3 Complete:** Performance Optimization - 74.3% bundle reduction (410KB → 105KB)
- **Phase 2 Complete:** Component Architecture - Flat structure (max depth 2), all sections <120 lines
- **AI Forms:** Comprehensive implementation with pgVector for semantic search, embeddings, and RAG capabilities
- **Strapi v5:** Upgraded for better PostgreSQL integration and pgVector support

---

## 🤝 Contributing

This is a personal portfolio project. For major changes or suggestions:

1. Check the [ROADMAP](./ROADMAP.md)
2. Review the [documentation](./docs/)
3. Follow established patterns in Phase 1+

---

**Last Updated:** 2026-04-06

**Recent Changes:**

- ✅ **Phase 4 ~95% Complete (2026-04-06):**
  - All 13 `@aazucena/*` packages integrated into portfolio
  - Journey page: all interactive components switched to `client:only="react"` (fixes D3 width=0)
  - Navbar: scoped CSS transitions to prevent dark-mode toggle delay
  - BackToTop: default variant changed `glass` → `default` for visibility on portfolio backgrounds
  - Storybook stories updated with new visualization props (hideHeader, infoPanel,
    showYearControls, showPhysicsControls, highlightIds, laneKey, hoverPopup)
  - Chromatic skipped — requires paid plan; visual regression deferred to Phase 5
- ✅ **Phase 4 Documentation Updated (2026-02-04):**
  - Enhanced architecture plan: 4 → 13 specialized packages
  - Renamed @aazucena/design-tokens → @aazucena/design-system (expanded scope)
  - Renamed @aazucena/data → @aazucena/api (more descriptive)
  - Timeline refined: 16-22 days → 21 days
  - Package breakdown: design-system, ui, hooks, utils, types, constants, animations, api, forms, layouts, icons, analytics, config
  - Complete responsibility matrix with sizes and priorities
  - All docs synchronized (ROADMAP.md, CLAUDE.md, README.md, GEMINI.md)
- ✅ **Phase 3 Complete - Performance Optimization (2026-02-04):**
  - 74.3% bundle reduction (410KB → 105KB gzipped)
  - Exceeded 63% target by 11.3%
  - Lazy loading: AnimationCanvas (-302KB), Modals (-2.7KB), Atmospheric layers
  - Demand-based rendering: Three.js frameloop='demand'
  - React 19 polyfill: suspendOnActiveViewTransition workaround
  - Progressive enhancement: content first, animations second
  - Time to Interactive: 5-6s → 1.5-2s (67% faster)
- ✅ **IntegrityBadge Component (2026-02-04):**
  - Real-time system health indicator in Footer
  - 4 states: OPERATIONAL (green pulse), DEGRADED (amber), UNKNOWN (gray), LOADING (blue pulse)
  - Links to AZUCENA_LYTICS status dashboard
- ✅ **Edge Runtime Ingestion (2026-02-04):**
  - Vercel Edge Runtime for <50ms response times
  - Native geo-headers (x-vercel-ip-country/city/lat/lon) - eliminated ip-api.com dependency
- ✅ **Phase 2 Complete - Component Architecture (2026-02-02):**
  - Scene directory flattening (depth 3 → 2)
  - Deleted 24 legacy files (ground/, .BACKUP.tsx files, utilities redirect)
  - Moved 7 layer files from scene/layers/ → scene/
  - Updated 7 files with new import paths
  - Homepage restructuring (animations → homepage)
  - Journey restructuring (type-first: ui/journey, visualizations/journey)
  - All 8 sections now <120 lines (component extraction complete)
  - Template system (3 templates)
  - Utility refactoring (15 specialized modules)
  - Common components (6 new reusable components)
  - Site config centralization
  - CMS integration (Navigation Plugin, Footer)
  - Build verified: 35.89s, all 18 pages rendered, zero TypeScript errors
- ✅ **Footer CMS Implementation (2026-01-27):**
  - Extended `website-configuration` with footer fields
  - Dynamic tech stack with `ui.tech-stack-item` component
- ✅ **Navigation Plugin Integration (2026-01-27):**
  - CMS-driven navigation with custom fields
  - Performance: API calls reduced 3→2 (33% faster)

**Current Priority:** Phase 4 - Developer Experience 🔥
