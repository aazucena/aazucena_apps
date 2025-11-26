# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Rules
- full context (x being the id of the session we are operation, if file doesn't exist, then create one)
- @ROADMAP.md should contain most of context for what we did, and overall plan. All meticulous details in the file are located at @docs, and are added/updated to.

## Repository Overview

This is a **pnpm + Turborepo monorepo** for Aldrin Azucena's portfolio project. The primary application is an Astro-based portfolio with React integration, featuring advanced animations (GSAP, Three.js, PixiJS) and a planned Strapi CMS backend.

**Package Manager:** pnpm v10.22.0 (required)
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
pnpm dlx playwright test

# Run specific test file
pnpm dlx playwright test tests/example.spec.ts

# Run tests in headed mode
pnpm dlx playwright test --headed

# View test report
pnpm dlx playwright show-report
```

**Note:** Vitest is installed but test configuration not yet implemented. Playwright config exists at `apps/portfolio/playwright.config.ts` with test directory at `apps/portfolio/tests/`.

## Architecture Overview

### Portfolio App Architecture

**Framework Stack:**
- **Astro 5.16.0** as the meta-framework with React integration
- **React 19.2** for interactive components
- **Tailwind CSS 4** with @tailwindcss/vite plugin
- **TypeScript** throughout

**Animation Architecture (Post-Phase 1 Refactoring):**

The portfolio features a complex animation system located in `apps/portfolio/src/components/animations/`. This was successfully refactored in Phase 1 (completed 2025-01-13).

**Current Structure (Post-Phase 1):**
```
src/components/animations/
├── Section.tsx              # Main orchestrator (174 lines - refactored)
├── ThreeJSScene.tsx         # Three.js scene (renamed from Scene.tsx)
├── PixiJSParticles.tsx      # PixiJS particle system (renamed from Particles.tsx)
├── contexts/                # State management contexts
│   ├── PortfolioContext.tsx
│   └── AnimationContext.tsx
├── components/              # Extracted components
│   ├── DynamicBackground.tsx
│   ├── AtmosphericOverlays.tsx
│   ├── AnimationCanvas.tsx
│   ├── SectionContent.tsx
│   └── UIOverlays.tsx
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

4. **State Management:** Uses centralized contexts (PortfolioContext, AnimationContext) established in Phase 1 refactoring.

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

### State Flow (Post-Phase 1)

```
Section.tsx (main orchestrator - 174 lines)
├─ PortfolioContext → Centralized portfolio state
├─ AnimationContext → Centralized animation state
└─ Renders:
   ├─ DynamicBackground (extracted component)
   ├─ AtmosphericOverlays (extracted component)
   ├─ AnimationCanvas (extracted component)
   │   ├─ PixiJSParticles (conditional)
   │   └─ Three.js Canvas with ThreeJSScene
   ├─ SectionContent (extracted component)
   └─ UIOverlays (extracted component)
```

## Development Roadmap

**CRITICAL:** Always consult `ROADMAP.md` and `docs/` before major changes.

### ✅ Phase 1 - Animations Refactoring (COMPLETED - 2025-01-13)

**Detailed docs:** `docs/phase-1-animations-refactoring.md`

**Achievements:**
- ✅ Reduced Section.tsx from 324 → 174 lines (46% reduction)
- ✅ Created centralized contexts (PortfolioContext, AnimationContext)
- ✅ Extracted 5 components (DynamicBackground, AtmosphericOverlays, AnimationCanvas, SectionContent, UIOverlays)
- ✅ Eliminated prop drilling
- ✅ Renamed files (Particles → PixiJSParticles, Scene → ThreeJSScene)
- ✅ All tests passing

### Current Priority: Phase 0 - Infrastructure & Architecture (16-20 days)

**Detailed docs:** `docs/phase-0-infrastructure.md`

**Goal:** Set up production-ready infrastructure with Docker Compose

**Sub-phases:**
- **0.1:** Verify monorepo structure (pnpm + Turborepo) ✅ COMPLETED
- **0.2.1:** Docker Compose setup (Strapi + PostgreSQL 16 + pgVector) - 1-2 days
- **0.2.2:** Strapi configuration (admin panel, Cloudinary) - 1 day
- **0.2.3:** Content types creation (14 types) - 1-2 days
- **0.2.4:** Frontend API integration (Strapi SDK) - 1-2 days
- **0.3:** Deployment strategy (Vercel + Railway + CircleCI) - 1.5 days
- **0.4:** Content migration from static to CMS - 3 days

**Key Technology Decisions:**
- ✅ Docker Compose for local development (consistent environment)
- ✅ PostgreSQL 16+ with pgVector extension (ready for AI features)
- ✅ Strapi v5 (upgraded from v4 for better PostgreSQL support)
- ✅ One-command setup: `docker compose up`

**Status:** Documentation updated, ready to begin Phase 0.2.1

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
- **Strapi Plugins:**
  - `strapi-plugin-icons-field` v1.1.5 - Icon picker field with @mynaui/icons support
  - `@strapi/plugin-graphql` - GraphQL API
  - `@strapi/plugin-documentation` - Auto-generated API documentation
  - `@strapi/plugin-sentry` - Error tracking
  - `@strapi/plugin-seo` - SEO management
  - `@_sh/strapi-plugin-ckeditor` - Rich text editor
  - `strapi-plugin-multi-select` - Multi-select field
  - `strapi-advanced-uuid` - Advanced UUID generation
  - `@strapi/plugin-color-picker` - Color picker field
  - `strapi-plugin-preview-button` - Content preview
  - `strapi-plugin-navigation` - Navigation builder
  - `strapi-plugin-duplicate-button` - Content duplication
  - `strapi-plugin-config-sync` - Configuration synchronization
  - `strapi-plugin-publisher` - Publishing workflow
  - `@strapi-community/plugin-rest-cache` - REST API caching
  - `@strapi-community/plugin-redis` - Redis integration
- **PostgreSQL 16+** with pgVector extension for vector similarity search
- **Redis** - Caching
- **Sentry** - Error tracking (frontend & backend)
- **Pino** - Logging (backend)
- **Railway** - Backend deployment
- **Cloudinary** - Media storage via @strapi/provider-upload-cloudinary

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
- `ROADMAP.md` - High-level roadmap (318 lines)
- `docs/README.md` - Documentation index
- `docs/phase-*.md` - Phase-specific documentation
- `docs/features/*.md` - Feature documentation

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
1. Read relevant documentation in `docs/`
2. Check ROADMAP.md for current phase and priorities
3. Understand the animation architecture if working with `src/components/animations/`

### When Working with Animations
1. Section.tsx is the main orchestrator - it's now cleaner (174 lines) after Phase 1
2. Use PortfolioContext and AnimationContext for state management
3. Test all 8 sections after changes
4. Verify atmospheric layer transitions work
5. Check modal interactions (Experience modal)
6. Test toolbar panel toggling
7. Ensure performance tiers still work (high/medium/low)

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

1. **Don't add new state directly to Section.tsx** - use PortfolioContext or AnimationContext instead
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

**Last Updated:** 2025-11-25

**Key Updates:**
- ✅ **Phase 1 Completed:** Animations refactoring (324 → 174 lines, 46% reduction)
- ✅ **Astro v5.15 → v5.16.0:** Framework upgrade for latest features
- ✅ **Strapi Components Added:** Audio Metadata component with enharmonic keys (media.audio-metadata)
- ✅ **Icons Integration:** strapi-plugin-icons-field v1.1.5 with @mynaui/icons support
- ✅ **CTA Button Component:** UI component with icons-field integration (ui.cta-button)
- ✅ **Enhanced Icons Script:** icons.sh now supports multiple categorized icon sources
- ✅ Strapi v4 → v5 upgrade for better PostgreSQL and pgVector support
- ✅ Comprehensive AI/ML stack with LangChain, LangGraph, LangSmith
- ✅ AI-Powered Forms architecture with vector database and semantic search
- ✅ Multiple embedding providers and retrieval/ranking systems
- ✅ Enhanced monitoring with Vercel Speed Insights

**Strapi CMS Components (Implemented):**
- `shared.seo` - SEO metadata with nested Open Graph
- `shared.open-graph` - Open Graph meta tags (used by SEO)
- `shared.social-links` - Social media URLs
- `media.audio-metadata` - Music track metadata with enharmonic keys, BPM, time signatures, scales
- `ui.cta-button` - Call-to-action buttons with icon picker (@mynaui/icons integration)
