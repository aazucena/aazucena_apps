# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a **pnpm + Turborepo monorepo** for Aldrin Azucena's portfolio project. The primary application is an Astro-based portfolio with React integration, featuring advanced animations (GSAP, Three.js, PixiJS) and a planned Strapi CMS backend.

**Package Manager:** pnpm v10.21.0 (required)
**Node Version:** >=18

## Project Structure

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

## Essential Commands

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

### Portfolio-Specific (from apps/portfolio/)
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
npx playwright test

# Run specific test file
npx playwright test tests/example.spec.ts

# Run tests in headed mode
npx playwright test --headed

# View test report
npx playwright show-report
```

**Note:** Vitest is installed but test configuration not yet implemented. Playwright config exists at `apps/portfolio/playwright.config.ts` with test directory at `apps/portfolio/tests/`.

## Architecture Overview

### Portfolio App Architecture

**Framework Stack:**
- **Astro 5.15+** as the meta-framework with React integration
- **React 19.2** for interactive components
- **Tailwind CSS 4** with @tailwindcss/vite plugin
- **TypeScript** throughout

**Animation Architecture (Critical):**

The portfolio features a complex animation system located in `apps/portfolio/src/components/animations/`. This is the **current refactoring priority** (Phase 1).

**Current Structure:**
```
src/components/animations/
├── Section.tsx              # Main orchestrator (324 lines - needs refactoring)
├── Scene.tsx                # Three.js scene
├── Particles.tsx            # PixiJS particle system
├── config/                  # Configuration and types
├── hooks/                   # 9 custom React hooks
│   ├── useDeviceCapabilities.ts
│   ├── useSectionTransition.ts
│   ├── useAtmosphericLayer.ts
│   ├── useModal.ts
│   └── ... (5 more)
├── particles/               # Particle system internals
├── scene/                   # Three.js scene components
├── sections/                # 8 portfolio sections (Hero, About, Projects, etc.)
├── ui/                      # UI components (modals, toolbar, panels)
└── utilities/               # Helper functions
```

**Key Animation Concepts:**

1. **Atmospheric Layers:** The portfolio uses a metaphor of atmospheric layers (troposphere, stratosphere, mesosphere, exosphere) that transition based on scroll progress. Each layer has different visual effects and backgrounds.

2. **Section Navigation:** 8 distinct sections (0-7) that users navigate through. Each section has dedicated content components.

3. **Performance Tiers:** Device capabilities are detected and animations adapt (high/medium/low performance modes). Heavy animations (Three.js, PixiJS) are conditionally rendered.

4. **State Management:** Currently uses scattered useState and custom hooks. **Phase 1 refactoring will centralize state into contexts** (PortfolioContext, AnimationContext).

### Hooks System

The animation system relies on custom hooks for encapsulation:
- `useDeviceCapabilities` - Detects performance tier
- `useSectionTransition` - Manages section navigation state
- `useAtmosphericLayer` - Determines current atmospheric layer
- `useGSAPEntrance` - GSAP animation setup
- `useSectionTransitions` - GSAP section transitions
- `useFlipText` - Text flipping animation
- `useModal` - Modal state management
- `useSectionRefs` - Manages refs for 8 sections

### State Flow (Current)

```
Section.tsx (main orchestrator)
├─ useDeviceCapabilities() → capabilities, mounted
├─ useSectionTransition() → currentSection, scrollProgress
├─ useAtmosphericLayer() → atmosphericLayer, backgroundStyle
├─ useState for panels → showInfoPanel, showSettingsPanel, showSocialMenu
├─ useModal() → isExperienceModalOpen, selectedExperienceIndex
└─ Renders:
   ├─ DynamicBackground (inline)
   ├─ AtmosphericOverlays (inline)
   ├─ PixiJSParticles (conditional)
   ├─ Three.js Canvas with Scene.tsx
   ├─ 8 section content divs
   ├─ Toolbar + panels
   └─ Modals
```

## Development Roadmap

**CRITICAL:** Always consult `apps/portfolio/ROADMAP.md` and `apps/portfolio/docs/` before major changes.

### ✅ Phase 1 - Animations Refactoring (COMPLETED - 2025-01-13)

**Detailed docs:** `apps/portfolio/docs/phase-1-animations-refactoring.md`

**Achievements:**
- ✅ Reduced Section.tsx from 324 → 174 lines (46% reduction)
- ✅ Created centralized contexts (PortfolioContext, AnimationContext)
- ✅ Extracted 5 components (DynamicBackground, AtmosphericOverlays, AnimationCanvas, SectionContent, UIOverlays)
- ✅ Eliminated prop drilling
- ✅ Renamed files (Particles → PixiJSParticles, Scene → ThreeJSScene)
- ✅ All tests passing

### Current Priority: Phase 0 - Infrastructure & Architecture (12-16 days)

**Detailed docs:** `apps/portfolio/docs/phase-0-infrastructure.md`

**Goal:** Set up production-ready infrastructure
1. Verify monorepo structure (pnpm + Turborepo) ✅
2. Integrate Strapi CMS v5 with PostgreSQL + pgVector
3. Configure deployment pipeline (Vercel + Railway + CircleCI)
4. Migrate static content to CMS

**Status:** In progress (Monorepo already configured)

### Upcoming Phases (execute in order)
- **Phase 2:** Component Architecture (6-8 days) - Further optimization
- **Phase 3:** Performance (4-6 days) - Code splitting, lazy loading
- **Phase 4:** Developer Experience (16-22 days) - Figma, Storybook, Chromatic
- **Phase 5:** Testing (9-13 days) - Vitest unit tests, Playwright E2E

### Planned Features (see docs/features/)
- Music Player (Howler.js, wavesurfer.js) - 4-6 days
- Strudel.cc Live Coding Integration - 9-13 days
- AI-Powered Forms (LangChain + LangGraph + Claude with pgVector, embeddings, RAG) - 16-20 days comprehensive
- Machine Learning Features (PyTorch/TensorFlow) - 10-40 days
- Logging & Monitoring (Sentry, Vercel Analytics, Vercel Speed Insights, Pino, Redis) - 3-4 days
- Payments (Stripe + Ko-fi) - 3-4 days

## Tech Stack Reference

### Core Dependencies
- **@astrojs/react** - React integration for Astro
- **gsap** - Animation library (includes ScrollToPlugin, ScrollTrigger)
- **three** + **@react-three/fiber** + **@react-three/drei** - 3D graphics
- **pixi.js** + **@pixi/react** - 2D particle system
- **framer-motion** - Additional animations
- **@radix-ui/** - Headless UI primitives (used by ShadCN)
- **react-hook-form** + **zod** - Form validation
- **@vercel/analytics** + **@vercel/speed-insights** - Analytics

### Development Tools
- **Playwright** - E2E testing (configured)
- **Vitest** - Unit testing (installed, not configured)
- **Prettier** - Code formatting
- **Turborepo** - Monorepo task orchestration

### Backend & Infrastructure (Planned/In Progress)
- **Strapi v5** (CMS) - Upgraded from v4 for better PostgreSQL and pgVector support
- **PostgreSQL 16+** with pgVector extension for vector similarity search
- **Redis** - Caching
- **Sentry** - Error tracking (frontend & backend)
- **Pino** - Logging (backend)
- **Railway** - Backend deployment

### AI/ML Stack (Comprehensive)
- **LangChain** - LLM orchestration framework
- **LangGraph** - State machine for multi-turn conversations
- **LangSmith** - Observability, tracing, and debugging
- **Anthropic Claude 3.5 Sonnet** - Primary language model
- **pgVector** - PostgreSQL extension for vector similarity search
- **Embeddings Models:**
  - OpenAI (text-embedding-3-small, text-embedding-3-large)
  - Cohere (embed-english-v3.0, embed-multilingual-v3.0)
  - Anthropic Claude (via Voyage AI)
  - Google Gemini (Vertex AI textembedding-gecko)
  - Local Models (Sentence Transformers, all-MiniLM-L6-v2)
- **Retrieval & Ranking:**
  - LangChain Retrievers for semantic search
  - Cohere Rerank API (rerank-english-v3.0)
  - Cross-encoder models (local)
  - ContextualCompressionRetriever
- **PyTorch/TensorFlow** - Optional for advanced ML features

## Code Patterns & Conventions

### File Naming
- React components: PascalCase (e.g., `Section.tsx`, `HeroSection.tsx`)
- Hooks: camelCase with `use` prefix (e.g., `useModal.ts`)
- Utilities: camelCase (e.g., `formatDate.ts`)
- Config: camelCase or kebab-case (e.g., `config.yaml`, `astro.config.mjs`)

### Component Structure
- Astro components use `.astro` extension
- React components use `.tsx` extension
- Export React components as default: `export default function ComponentName()`
- Type props interfaces as `ComponentNameProps`

### State Management Pattern
- Use React Context for cross-component state
- Custom hooks for encapsulated logic
- Avoid prop drilling (refactor to contexts if needed)

### Animation Patterns
- GSAP for imperative animations and scroll-triggered effects
- Three.js for 3D scenes
- PixiJS for performant 2D particles
- Framer Motion for declarative React animations
- Always check `capabilities.canUseHeavyAnimations` before rendering expensive animations

## Important File Locations

### Configuration Files
- `apps/portfolio/astro.config.mjs` - Astro configuration
- `apps/portfolio/tailwind.config.mjs` - Tailwind configuration
- `apps/portfolio/tsconfig.json` - TypeScript configuration
- `turbo.json` - Turborepo pipeline

### Documentation
- `apps/portfolio/ROADMAP.md` - High-level roadmap (318 lines)
- `apps/portfolio/docs/README.md` - Documentation index
- `apps/portfolio/docs/phase-*.md` - Phase-specific documentation
- `apps/portfolio/docs/features/*.md` - Feature documentation

### Key Source Files
- `apps/portfolio/src/pages/index.astro` - Main entry point
- `apps/portfolio/src/components/animations/Section.tsx` - Main animation orchestrator
- `apps/portfolio/src/components/animations/hooks/` - Custom hooks library

## Git & Deployment

**Current Branch:** `main`
**Status:** Clean working tree

**Deployment Strategy (future):**
- Frontend (Astro): Vercel (auto-deploy from GitHub)
- Backend (Strapi): Railway
- CI/CD: CircleCI (for CMS only)

## Workflow Tips

### Before Starting Work
1. Read relevant documentation in `apps/portfolio/docs/`
2. Check ROADMAP.md for current phase and priorities
3. Understand the animation architecture if working with `src/components/animations/`

### When Refactoring Animations (Phase 1)
1. Section.tsx is the main orchestrator - changes here impact everything
2. Test all 8 sections after changes
3. Verify atmospheric layer transitions work
4. Check modal interactions (Experience modal)
5. Test toolbar panel toggling
6. Ensure performance tiers still work (high/medium/low)

### When Adding Features
1. Check if similar functionality exists in custom hooks
2. Follow the contexts pattern (don't add more useState in Section.tsx)
3. Consider device capabilities for performance-heavy features
4. Update relevant documentation in `docs/` folder

### Monorepo Commands
- Use `pnpm` (never npm or yarn)
- Run commands from root for cross-workspace operations
- Use Turbo filters for specific workspaces: `pnpm dev --filter *portfolio*`
- Turbo caches builds - use `turbo build --force` to bypass cache

## AI-Powered Forms Architecture

### Overview
The portfolio implements a comprehensive AI-powered forms system with LangChain + LangGraph + Claude 3.5 Sonnet, featuring vector database integration for semantic search and RAG capabilities.

### Form Types (8 Total)
- **Contact** - General inquiries
- **Feedback** - Portfolio feedback collection
- **Testimonial** - Client reviews with approval workflow
- **Bug Report** - Issue tracking with GitHub integration
- **Feature Request** - Ideas with voting system
- **Collaboration** - Speaking/partnership opportunities
- **Referral** - Client referrals
- **Music Feedback** - Track-specific reviews

### Key Features
- ✨ **Easter Egg Step** - Hidden engagement step required before submission
- 🤖 **AI Intent Classification** - Automatic routing of form submissions
- 🔍 **Smart Field Extraction** - Extracts structured data from casual messages
- 💬 **Follow-up Questions** - Context-aware clarifications
- 📊 **Sentiment Analysis** - Analyzes emotional tone
- 🧠 **AI Summarization** - Generates concise summaries (50-150 words)
- 🔒 **reCAPTCHA v3** - Spam protection
- ✅ **Auto-Response** - Optional personalized replies

### Vector Database & Semantic Search
- **pgVector** - PostgreSQL extension for vector similarity search
- **Embeddings Storage** - Store embeddings of `rawMessage`, `rawFeedback`, `testimonialText`, `rawDescription`, `aiSummary`
- **Metadata Indexing** - `formType`, `sentiment`, `tags`, `submissionDate`, `langSmithId`
- **Retrieval Use Cases:**
  - Semantic search for similar feedback/bug reports
  - RAG (Retrieval-Augmented Generation) for AI responses
  - Analytics clustering and pattern detection
  - Duplicate detection for bug reports/feature requests

### AI Pipeline Flow
```
Frontend (Astro/React) → reCAPTCHA v3 + Rate Limiting → LangGraph State Machine
  ├─ IntentClassifierAgent (classify form type)
  ├─ EasterEggDetectorAgent (detect hidden keywords)
  ├─ FieldExtractionAgent (extract structured data)
  ├─ ValidationAgent (check required fields)
  ├─ SummarizationAgent (generate AI summary + sentiment)
  └─ AutoResponseAgent (optional personalized reply)
→ LangSmith (tracing/logging)
→ Strapi v5 (structured data storage)
→ [Async Job] Embedding Generation
→ pgVector (vector storage with metadata)
→ Retrieval & Ranking (query time with Cohere Rerank)
```

### Important Considerations
1. **Always use LangSmith for tracing** - Track full conversation flow and token usage
2. **Easter Egg detection is required** - Users must find hidden step before submission
3. **Embedding generation is async** - Don't block form submission on embedding creation
4. **Metadata filtering is crucial** - Use `formType`, `sentiment`, `tags` for efficient retrieval
5. **Reranking improves relevance** - Use Cohere Rerank or cross-encoders after vector search
6. **See `docs/features/ai-forms.md`** for complete implementation details

## Performance Considerations

1. **Heavy animations are gated by device detection** - always respect `capabilities.canUseHeavyAnimations`
2. **Three.js scene only renders if capable** - reduces load on low-end devices
3. **PixiJS particles only in "exosphere" layer** - conditional rendering based on scroll state
4. **Performance tier affects animation intensity** - `capabilities.performanceTier` is 'high', 'medium', or 'low'

## Common Pitfalls

1. **Don't add new state to Section.tsx** - use contexts instead (Phase 1 goal)
2. **Don't skip atmospheric layer logic** - it's core to the UX
3. **Always test section transitions** - GSAP animations are fragile
4. **Check refs before accessing** - many components use React refs that may be null
5. **pnpm lockfile is committed** - don't use other package managers
6. **Turborepo cache is in gitignore** - don't commit `.turbo/`

## Resources

- **Astro Docs:** https://astro.build
- **GSAP Docs:** https://gsap.com/docs
- **Three.js Docs:** https://threejs.org/docs
- **PixiJS Docs:** https://pixijs.com/guides
- **Turborepo Docs:** https://turbo.build/repo/docs
- **LangChain Docs:** https://langchain.com
- **LangGraph Docs:** https://langchain-ai.github.io/langgraph/
- **LangSmith Docs:** https://docs.smith.langchain.com/

---

**Last Updated:** 2025-01-13

**Key Updates:**
- ✅ **Phase 1 Completed:** Animations refactoring (324 → 174 lines, 46% reduction)
- ✅ Strapi v4 → v5 upgrade for better PostgreSQL and pgVector support
- ✅ Comprehensive AI/ML stack with LangChain, LangGraph, LangSmith
- ✅ AI-Powered Forms architecture with vector database and semantic search
- ✅ Multiple embedding providers and retrieval/ranking systems
- ✅ Enhanced monitoring with Vercel Speed Insights
