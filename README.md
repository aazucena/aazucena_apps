# Aldrin Azucena Portfolio Monorepo

A **pnpm + Turborepo monorepo** for Aldrin Azucena's portfolio project. The primary application is an Astro-based portfolio with React integration, featuring advanced animations (GSAP, Three.js, PixiJS) and a planned Strapi CMS backend.

**Package Manager:** pnpm v10.21.0 (required)
**Node Version:** >=18

## 🎯 Quick Links

- **[Full ROADMAP](./ROADMAP.md)** - Complete development roadmap with phases and features
- **[Documentation Hub](./docs/README.md)** - Detailed implementation guides
- **[Phase 2 (Current Priority)](./docs/phase-2-component-architecture.md)** - Component Architecture

---

## 📁 Project Structure

```
aazucena_apps/
├── apps/
│   ├── portfolio/          # Main Astro portfolio application
│   ├── analytics/          # AZUCENA_LYTICS: Engineering Intelligence Terminal (Next.js)
│   └── cms/                # Strapi CMS backend
├── packages/
│   ├── shared/             # Shared utilities and types
│   └── ui/                 # Shared UI components
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
Phase 4 (Developer Experience) → 16-22 days
    ↓
Phase 5 (Testing) → 5-8 days
    ↓
Features (as needed) → 3-40 days each
```

**Total Core Phases:** 52-71 days (~2.5-3.5 months)

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

### In Progress 🚧
- **Phase 4:** Developer Experience - 🔥 CURRENT PRIORITY
  - TypeScript strict mode & centralized types
  - Figma Design System
  - Storybook Setup
  - Chromatic Visual Testing

### Next Up ⏳
- **Phase 5:** Testing & Quality (Vitest, Playwright)

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
- **Current Priority:** Phase 4 - Developer Experience 🔥
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

**Last Updated:** 2026-02-04

**Recent Changes:**
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