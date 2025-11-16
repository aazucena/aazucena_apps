# Aldrin Azucena Portfolio Monorepo

A **pnpm + Turborepo monorepo** for Aldrin Azucena's portfolio project. The primary application is an Astro-based portfolio with React integration, featuring advanced animations (GSAP, Three.js, PixiJS) and a planned Strapi CMS backend.

**Package Manager:** pnpm v10.21.0 (required)
**Node Version:** >=18

## 🎯 Quick Links

- **[Full ROADMAP](./ROADMAP.md)** - Complete development roadmap with phases and features
- **[Documentation Hub](./docs/README.md)** - Detailed implementation guides
- **[Phase 1 (Current Priority)](./docs/phase-1-animations-refactoring.md)** - Animations refactoring

---

## 📁 Project Structure

```
aazucena_apps/
├── apps/
│   └── portfolio/          # Main Astro portfolio application
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

### Frontend
- **Framework:** Astro (with React integration)
- **Build Tool:** Vite
- **UI Library:** React 18+ with TypeScript
- **Styling:** Tailwind CSS 4
- **UI Components:** ShadCN UI
- **Animations:** GSAP (GreenSock), Three.js, PixiJS
- **Audio:** Howler.js (playback), wavesurfer.js (waveform), Strudel.cc (live coding)
- **Icons:** @mynaui/icons-react v0.3.9
- **Data Management:** TanStack Query, TanStack Table
- **Forms:** react-hook-form + Zod
- **Payments:** Stripe, Ko-fi
- **State Management:** React Context API + Custom Hooks

### Backend & Infrastructure
- **CMS:** Strapi v5
- **Database:** PostgreSQL 16+ with pgVector extension
- **Storage:** Cloudinary
- **Monorepo:** pnpm + Turborepo
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
- [Phase 0: Infrastructure](./docs/phase-0-infrastructure.md)
- [Phase 1: Animations Refactoring](./docs/phase-1-animations-refactoring.md) 🔥 **CURRENT PRIORITY**
- [Phase 2: Component Architecture](./docs/phase-2-component-architecture.md)
- [Phase 3: Performance](./docs/phase-3-performance.md)
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
- Icons switched to @mynaui/icons-react
- Scroll indicators with animations
- Toolbar panels with backdrop
- Resume button improvements
- Comprehensive ROADMAP & documentation

### In Progress 🚧
- **None** (Ready to start Phase 1)

### Next Up ⏳
- **Phase 1.1:** Create PortfolioContext & AnimationContext
- **Phase 1.2:** Extract components from Section.tsx
- **Phase 1.3:** File renaming & cleanup

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
- **Current Priority:** Phase 1 - Animations Refactoring (must complete before infrastructure changes)
- **AI Forms:** Comprehensive implementation with pgVector for semantic search, embeddings, and RAG capabilities
- **Strapi v5:** Upgraded for better PostgreSQL integration and pgVector support

---

## 🤝 Contributing

This is a personal portfolio project. For major changes or suggestions:

1. Check the [ROADMAP](./ROADMAP.md)
2. Review the [documentation](./docs/)
3. Follow established patterns in Phase 1+

---

**Last Updated:** 2025-11-12

**Current Priority:** Phase 1 - Animations Refactoring 🔥
