# Portfolio Development Roadmap

## ⚡ PRIORITY: Phase 1 - Animations Folder Refactoring First

**Decision:** Refactor the existing `apps/portfolio/src/components/animations` folder **BEFORE** infrastructure changes. This ensures a clean, maintainable codebase before adding monorepo complexity.

---

## 🎯 Quick Navigation

- **[Comprehensive Documentation](/docs/README.md)** - Full project documentation
- **[Current Priority: Phase 1](/docs/phase-1-animations-refactoring.md)** - Start here!
- **[Tech Stack](#tech-stack)** - Complete technology overview
- **[Execution Timeline](#execution-timeline)** - Recommended order

---

## Tech Stack

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
- **CMS:** Strapi v4
- **Database:** PostgreSQL
- **Storage:** Cloudinary
- **Monorepo:** pnpm + Turborepo
- **Frontend Deploy:** Vercel (auto via GitHub)
- **Backend Deploy:** Railway
- **CI/CD:** CircleCI (CMS only)

### Monitoring & Logging
- **Frontend:** Sentry, Vercel Analytics
- **Backend:** Pino, Sentry
- **Caching:** Redis

### Development Tools
- **Design:** Figma
- **Component Dev:** Storybook
- **Visual Testing:** Chromatic
- **Testing:** Vitest (unit), Playwright (E2E)
- **API Testing:** Postman

### AI/ML (Optional)
- **LLMs:** LangChain, Anthropic Claude
- **ML:** PyTorch/TensorFlow

### API Integrations
- YouTube, LinkedIn, Spotify, SoundCloud, Weather, WakaTime, SendGrid/Resend, Ko-fi

---

## 📋 Development Phases

### 🔥 Phase 1: Animations Refactoring (9-11 days) - **PRIORITY**
**[Full Documentation →](/docs/phase-1-animations-refactoring.md)**

Refactor the animations folder to improve maintainability and reduce complexity.

**Key Tasks:**
- Create centralized state management (PortfolioContext, AnimationContext)
- Break down Section.tsx from 324 → 150 lines
- Extract components (AtmosphericOverlays, DynamicBackground, AnimationCanvas, etc.)
- File renaming (Particles.tsx → PixiJSParticles.tsx, Scene.tsx → ThreeJSScene.tsx)
- Testing & validation

**Status:** ⏳ Not Started

---

### Phase 0: Infrastructure & Architecture (12-16 days)
**[Full Documentation →](/docs/phase-0-infrastructure.md)**

Convert to monorepo, integrate Strapi CMS, and establish deployment pipeline.

**Key Tasks:**
- Monorepo restructuring (pnpm + Turborepo)
- Strapi CMS setup with PostgreSQL
- Deployment (Vercel + Railway + CircleCI)
- Content migration from static to CMS

**Execute After:** Phase 1

---

### Phase 2: Component Architecture (6-8 days)
**[Full Documentation →](/docs/phase-2-component-architecture.md)**

Further component optimization and standardization.

**Key Tasks:**
- Scene.tsx optimization
- Section components standardization
- Create reusable patterns

---

### Phase 3: Performance Optimization (4-6 days)
**[Full Documentation →](/docs/phase-3-performance.md)**

Optimize bundle size, code splitting, and animation performance.

**Key Tasks:**
- Lazy loading (Scene.tsx, Particles.tsx)
- Animation performance tuning
- Bundle size reduction (target: <350KB gzipped)

**Target Metrics:**
- Lighthouse: 90+
- FCP: <1.5s
- TTI: <3.5s

---

### Phase 4: Developer Experience (16-22 days)
**[Full Documentation →](/docs/phase-4-developer-experience.md)**

TypeScript improvements and professional design workflow.

**Key Tasks:**
- TypeScript strict mode & centralized types
- **Figma Design System** (5-7 days)
- **Storybook Setup** (4-5 days)
- **Chromatic Visual Testing** (2-3 days)
- Configuration management

---

### Phase 5: Testing & Quality (5-8 days)
**[Full Documentation →](/docs/phase-5-testing.md)**

Comprehensive testing strategy.

**Key Tasks:**
- Unit tests (hooks, utilities)
- Integration tests (user flows)
- E2E tests with Playwright
- Visual regression with Chromatic

**Coverage Targets:**
- Unit: 70-80%
- Critical user flows: 100%

---

## 🎵 Feature Implementations

### Music & Compositions
- **[Music Player](/docs/features/music-player.md)** (4-6 days) - Howler.js, waveform visualization
- **[Strudel.cc Live Coding](/docs/features/strudel-integration.md)** (9-13 days) - Interactive TidalCycles patterns

### AI & Intelligence
- **[AI-Powered Forms](/docs/features/ai-forms.md)** (7-9 days) - LangChain + Claude conversational forms
- **[Machine Learning](/docs/features/machine-learning.md)** (10-40 days) - Content analysis, image enhancement, RAG chatbot

### Infrastructure
- **[Logging & Monitoring](/docs/features/logging-monitoring.md)** (3-4 days) - Sentry, Vercel Analytics, Pino, Redis

### Monetization
- **[Payments](/docs/features/payments.md)** (3-4 days) - Stripe + Ko-fi integration

---

## ⏱️ Execution Timeline

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

### Weekly Breakdown

| Week | Phase | Focus |
|------|-------|-------|
| 1-2 | Phase 1 | Animations refactoring |
| 3-5 | Phase 0 | Infrastructure & CMS |
| 6-7 | Phase 2-3 | Components & performance |
| 8-11 | Phase 4 | DX & design system |
| 12 | Phase 5 | Testing |
| 13+ | Features | Music, AI, logging, payments |

---

## 📊 Success Metrics

### Code Quality
- Average component size: -30%
- Type coverage: 80%+
- ESLint errors: 0

### Performance
- Lighthouse: 90+
- FCP: <1.5s
- TTI: <3.5s
- Bundle size: <350KB (gzipped)

### Developer Experience
- PR review time: -40%
- Component development: faster with Storybook
- Visual regression: automated with Chromatic

---

## 🚀 Current Status

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

## 📚 Documentation

All detailed implementation guides, code examples, and specifications are in the **[`/docs`](/docs/)** folder:

### Phase Documentation
- [Phase 0: Infrastructure](/docs/phase-0-infrastructure.md)
- [Phase 1: Animations Refactoring](/docs/phase-1-animations-refactoring.md) ⚡
- [Phase 2: Component Architecture](/docs/phase-2-component-architecture.md)
- [Phase 3: Performance](/docs/phase-3-performance.md)
- [Phase 4: Developer Experience](/docs/phase-4-developer-experience.md)
- [Phase 5: Testing](/docs/phase-5-testing.md)

### Feature Documentation
- [Music Player & Compositions](/docs/features/music-player.md)
- [Strudel.cc Live Coding](/docs/features/strudel-integration.md)
- [AI-Powered Forms](/docs/features/ai-forms.md)
- [Machine Learning Features](/docs/features/machine-learning.md)
- [Logging & Monitoring](/docs/features/logging-monitoring.md)
- [Payment Integration](/docs/features/payments.md)

### Main Documentation Hub
- **[Documentation Index](/docs/README.md)** - Complete overview with quick start guide

---

## 🎯 Why This Order?

### Phase 1 First (Animations Refactoring)
- ✅ Clean foundation before infrastructure complexity
- ✅ Easier to test components in isolation
- ✅ Better understanding of state management needs
- ✅ Prevents refactoring in monorepo (harder)

### Infrastructure After Refactoring
- ✅ CMS integration with clean components
- ✅ Easier content migration
- ✅ Better monorepo package extraction

### Performance & Testing Last
- ✅ Optimize after architecture is stable
- ✅ Test after all components are refactored
- ✅ Measure improvements accurately

---

## 🤝 Contributing

This is a personal portfolio project, but if you'd like to suggest improvements:

1. Check the [issues](https://github.com/yourusername/portfolio/issues)
2. Review the [documentation](/docs/)
3. Follow the established patterns in Phase 1+

---

## 📝 Notes

- **Tech Stack Decisions:** All major technology choices are documented with rationale
- **No Redux:** Using Context API + Custom Hooks (sufficient for portfolio complexity)
- **Ko-fi Already Set Up:** Quick win for monetization (15-30 min to integrate)
- **ML Features Optional:** Only implement if showcasing AI/ML skills
- **Vercel Auto-Deploys:** No CircleCI needed for frontend (Vercel handles it)

---

**Last Updated:** 2025-11-09

**Current Priority:** Phase 1 - Animations Refactoring 🔥

**Next Milestone:** Complete Phase 1 → Begin Infrastructure Setup
