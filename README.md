# Aldrin Azucena Portfolio Monorepo

![Status](https://img.shields.io/badge/status-active_development-orange) ![Phase](https://img.shields.io/badge/phase-5_%E2%80%94_testing_%26_quality-blue)

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=nodedotjs&logoColor=white) ![pnpm](https://img.shields.io/badge/pnpm-10.33.4-F69220?logo=pnpm&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white) ![Turborepo](https://img.shields.io/badge/Turborepo-monorepo-EF4444?logo=turborepo&logoColor=white)

![Astro](https://img.shields.io/badge/Astro-5.x-FF5D01?logo=astro&logoColor=white) ![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black) ![Next.js](https://img.shields.io/badge/Next.js-15-000000?logo=nextdotjs&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)

![Storybook](https://img.shields.io/badge/Storybook-373%2B_stories-FF4785?logo=storybook&logoColor=white) ![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel&logoColor=white) ![Railway](https://img.shields.io/badge/Backend-Railway-0B0D0E?logo=railway&logoColor=white) ![CircleCI](https://img.shields.io/badge/CI-CircleCI-343434?logo=circleci&logoColor=white)

A **pnpm + Turborepo monorepo** for Aldrin Azucena's portfolio project. The primary application is an Astro-based portfolio with React integration, featuring advanced animations (GSAP, Three.js, PixiJS) and a planned Strapi CMS backend.

**Package Manager:** pnpm v10.33.4 (required)
**Node Version:** >=18

---

## 🏁 Getting Started

### Prerequisites

- **Node.js >=18** — [nodejs.org/en/download](https://nodejs.org/en/download) (verify: `node --version`)
- **pnpm 10.33.4** — install via npm:

```bash
npm install -g pnpm@10.33.4
```

> **Why pnpm?** This monorepo uses pnpm workspaces. The `package.json` pins the exact version (`10.33.4`) via the `packageManager` field — using a different version may cause a silent install failure. Always install the pinned version.

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
- **[Phase 5 (Current Priority)](./docs/phase-5-testing.md)** - Testing & Quality

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
- [Phase 3: Performance](./docs/phase-3-performance.md) ✅ COMPLETED
- [Phase 4: Developer Experience](./docs/phase-4-developer-experience.md) ✅ COMPLETED
- [Phase 5: Testing](./docs/phase-5-testing.md) 🔥 **CURRENT PRIORITY**

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

- **Phase 4:** Developer Experience (100% complete) - 2026-05-11
  - ✅ 16 packages scaffolded with full content
  - ✅ 373+ Storybook stories/docs (260 component, 94 form, charts, animations, MDX)
  - ✅ 94 form templates + 48 Zod schemas (`@aazucena/forms`)
  - ✅ Design system: 7 tokens, 18 themes, 35 platform integrations
  - ✅ TypeScript strict mode (all apps) + Git hooks (Husky + lint-staged)
  - ✅ All 16 `@aazucena/*` packages integrated into `apps/portfolio/`
  - ✅ Public Storybook hosting live
  - ✅ Portfolio & CMS version upgrades complete
  - ⏳ Chromatic — deferred (paid plan required)
  - ⏳ Figma Design System — deferred

### In Progress 🔥

- **Phase 5:** Testing & Quality — CURRENT PRIORITY
  - ⏳ Vitest unit tests (hooks, utilities — 70–80% coverage target)
  - ⏳ Playwright E2E (critical user flows — 100% coverage target)

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
- **Current Priority:** Phase 5 - Testing & Quality 🔥
- **Phase 4 Complete:** Developer Experience — 16 packages, 373+ Storybook stories, public hosting
- **Phase 3 Complete:** Performance Optimization — 74.3% bundle reduction (410KB → 105KB)
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

**Last Updated:** 2026-05-11

See **[CHANGELOG.md](./CHANGELOG.md)** for the full history of changes.

**Current Priority:** Phase 5 - Testing & Quality 🔥
