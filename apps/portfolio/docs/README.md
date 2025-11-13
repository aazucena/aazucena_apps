# Portfolio Development Documentation

This folder contains detailed documentation for the portfolio refactoring and feature implementation.

## 📚 Documentation Structure

### Core Phases (Execute in Order)

#### Phase 1: Animations Refactoring (Priority: IMMEDIATE) 🔥
**[Documentation](./phase-1-animations-refactoring.md)** | **Effort:** 9-11 days

Refactor animations folder, create contexts, extract components, reduce Section.tsx from 324 → 150 lines.

**Status:** ⏳ Not Started

---

#### Phase 0: Infrastructure & Architecture (After Phase 1)
**[Documentation](./phase-0-infrastructure.md)** | **Effort:** 12-16 days

Monorepo restructuring, Strapi CMS integration, Vercel + Railway deployment, content migration.

**Status:** ⏳ Pending

---

#### Phase 2: Component Architecture Improvements
**[Documentation](./phase-2-component-architecture.md)** | **Effort:** 6-8 days

Further component optimization, Scene.tsx refactoring, section standardization.

**Status:** ⏳ Pending

---

#### Phase 3: Performance Optimization
**[Documentation](./phase-3-performance.md)** | **Effort:** 4-6 days

Code splitting, lazy loading, animation performance, bundle size reduction.

**Status:** ⏳ Pending

---

#### Phase 4: Developer Experience
**[Documentation](./phase-4-developer-experience.md)** | **Effort:** 16-22 days

TypeScript improvements, Figma design system, Storybook setup, Chromatic visual testing.

**Status:** ⏳ Pending

---

#### Phase 5: Testing & Quality
**[Documentation](./phase-5-testing.md)** | **Effort:** 5-8 days

Unit tests, integration tests, E2E tests with Playwright.

**Status:** ⏳ Pending

---

### Feature Documentation

#### Music & Compositions 🎵
- **[Music Player](./features/music-player.md)** - Howler.js, waveform visualization (4-6 days)
- **[Strudel.cc Live Coding](./features/strudel-integration.md)** - Interactive TidalCycles patterns (9-13 days)

#### AI & Intelligence 🤖
- **[AI-Powered Forms](./features/ai-forms.md)** - LangChain + LangGraph + Claude with vector search, embeddings, and RAG (16-20 days comprehensive, 7-9 days basic)
- **[Machine Learning Features](./features/machine-learning.md)** - PyTorch/TensorFlow use cases (10-40 days)

#### Infrastructure & Monitoring 📊
- **[Logging & Monitoring](./features/logging-monitoring.md)** - Sentry, Vercel Analytics, Pino, Redis (3-4 days)

#### Monetization 💰
- **[Payment Integration](./features/payments.md)** - Stripe + Ko-fi (3-4 days)

---

## 🎯 Quick Start

### New to This Project?

1. **Read:** [ROADMAP.md](../ROADMAP.md) - Complete overview of all phases and features
2. **Start Here:** [Phase 1: Animations Refactoring](./phase-1-animations-refactoring.md) - Current priority
3. **Explore Features:** Browse `/features` folder for specific implementations

### Execution Order (Recommended)

```
Phase 1 (Animations Refactoring) → 9-11 days
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
Features (Music, AI, ML, etc.) → 3-40 days each
```

**Total Core Phases:** 52-71 days (~2.5-3.5 months)

---

## 📝 Tech Stack Summary

### Frontend
- **Framework:** Astro + React 18+
- **Build Tool:** Vite
- **Styling:** Tailwind CSS 4 + ShadCN UI
- **Animations:** GSAP, Three.js, PixiJS
- **Audio:** Howler.js, wavesurfer.js, Strudel.cc
- **Data:** TanStack Query, TanStack Table
- **Forms:** react-hook-form + Zod
- **State:** React Context API + Custom Hooks

### Backend
- **CMS:** Strapi v5
- **Database:** PostgreSQL 16+ with pgVector extension
- **Storage:** Cloudinary
- **Auth:** Strapi built-in

### Infrastructure
- **Monorepo:** pnpm + Turborepo
- **Frontend Deploy:** Vercel (auto via GitHub)
- **Backend Deploy:** Railway
- **CI/CD:** CircleCI (CMS only)

### Monitoring & Logging
- **Frontend:** Sentry, Vercel Analytics, Vercel Speed Insights
- **Backend:** Pino, Sentry, Redis

### Development
- **Design:** Figma
- **Component Dev:** Storybook
- **Visual Testing:** Chromatic
- **Testing:** Vitest, Playwright
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

### Payments
- **Stripe** - Downloads, consultations
- **Ko-fi** - Tips, donations

---

## 📖 Documentation Conventions

- **📍 Full Documentation:** Links back to ROADMAP.md sections
- **Estimated Effort:** Time estimates for each phase/feature
- **Status Indicators:**
  - 🔥 Current priority
  - ⏳ Not started
  - 🚧 In progress
  - ✅ Completed

---

## 🔗 Quick Links

- [Full ROADMAP](../ROADMAP.md)
- [Tech Stack (ROADMAP)](../ROADMAP.md#tech-stack)
- [Table of Contents (ROADMAP)](../ROADMAP.md#-table-of-contents)

---

**Last Updated:** 2025-11-12

**Note:** AI-Powered Forms now includes comprehensive vector database (pgVector) integration with embeddings from multiple providers (OpenAI, Cohere, Voyage AI, Gemini, local models), semantic search, retrieval & ranking with Cohere Rerank and cross-encoders, and full RAG capabilities for intelligent form processing.
