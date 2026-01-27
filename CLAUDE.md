# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Rules
- full context (x being the id of the session we are operation, if file doesn't exist, then create one)
- @ROADMAP.md, @README.md should contain most of context for what we did, and overall plan. All meticulous details in the file are located at @docs, and are added/updated to.

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
- **Rendering Pattern**: Hybrid (Static by default, SSR for dynamic status pages)
- **React 19.2** for interactive components
- **Tailwind CSS 4** with @tailwindcss/vite plugin
- **TypeScript** throughout

**Build Configuration:**
- **Vercel + pnpm**: Requires `.npmrc` with `shamefully-hoist=true` and `public-hoist-pattern[]=*babel*` to resolve Babel dependency tracing issues.

**Content Rendering Pattern:**
- **MarkdownRenderer**: Used for `richtext` fields in Strapi (e.g., Post/Experience descriptions) which return strings.
- **BlocksRenderer**: Used for `blocks` fields in Strapi (e.g., Experience responsibilities, About descriptions) which return JSON arrays.
- **SSR Pages**: `maintenance.astro` and `500.astro` use `export const prerender = false` to support real-time status checks and error logging.

**Animation Architecture (Post-Phase 1 Refactoring):**

The portfolio features a complex animation system located in `apps/portfolio/src/components/animations/`. This was successfully refactored in Phase 1 (completed 2025-01-13).

**Current Structure (Post-Phase 0.2.4):**
```
src/components/animations/
├── Section.tsx              # Main orchestrator (174 lines - refactored)
├── HomepageContent.tsx      # Section content renderer (replaces SectionContent)
├── ThreeJSScene.tsx         # Three.js scene (renamed from Scene.tsx)
├── PixiJSParticles.tsx      # PixiJS particle system (renamed from Particles.tsx)
├── contexts/                # State management contexts
│   ├── PortfolioContext.tsx # Portfolio state (scroll, sections)
│   ├── AnimationContext.tsx # Animation state (layers, effects)
│   ├── DataContext.tsx      # CMS data provider (NEW in Phase 0.2.4)
│   ├── usePortfolio.ts      # Hook for portfolio context
│   ├── useAnimation.ts      # Hook for animation context
│   ├── useDataContext.ts    # Hook for CMS data (NEW)
│   └── index.ts             # Centralized exports
├── canvas/                  # Canvas components (extracted)
│   ├── AnimationCanvas.tsx
│   └── index.ts
├── overlays/                # Overlay components (extracted)
│   ├── UIOverlays.tsx
│   └── index.ts
├── config/                  # Configuration and types
├── hooks/                   # 13 custom React hooks
│   ├── useDeviceCapabilities.ts
│   ├── useSectionTransition.ts
│   ├── useAtmosphericLayer.ts
│   ├── useModal.ts
│   ├── useSectionRefs.ts
│   ├── useSectionTransitions.ts
│   ├── useGSAPEntrance.ts
│   ├── useFlipText.ts
│   ├── useLocalStorage.ts
│   ├── useSectionRegistry.ts  # NEW (0.2.4): Component mapping
│   ├── useHandlebars.ts       # NEW (0.2.4): Template rendering
│   ├── useDataContext.ts      # NEW (0.2.4): CMS data access
│   ├── usePortfolio.ts        # Exported from contexts/
│   ├── useAnimation.ts        # Exported from contexts/
│   └── index.ts
├── particles/               # Particle system internals
├── scene/                   # Three.js scene components
├── sections/                # 8 portfolio sections (Hero, About, Projects, etc.)
│   └── layouts/             # Reusable section layouts (NEW)
│       ├── SectionLayout.tsx
│       └── index.ts
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

### State Flow (Post-Phase 0.2.4)

```
Section.tsx (main orchestrator - 174 lines)
├─ DataContext → CMS data (homepage, portfolio, sections registry)
├─ PortfolioContext → Portfolio state (scroll, sections)
├─ AnimationContext → Animation state (layers, effects)
└─ Renders:
   ├─ DynamicBackground (extracted component)
   ├─ AtmosphericOverlays (extracted component)
   ├─ AnimationCanvas (extracted component)
   │   ├─ PixiJSParticles (conditional)
   │   └─ Three.js Canvas with ThreeJSScene
   ├─ HomepageContent (section content renderer)
   └─ UIOverlays (extracted component)
```

### Journey Visualizations (New in Phase 0.5)

Complex data visualizations for the `/journey` page, located in `src/components/journey/visualizations/`:
- **ForceDirectedGraph**: Interactive skill dependency graph
- **InteractiveTimeline**: Scroll-synced career progression
- **SpiderChart**: Multi-dimensional skill profiling
- **SankeyDiagram**: Career flow visualization
- **StreamGraph**: Skill evolution over time
- **Heatmap**: Activity and contribution tracking

### Page Template System (New in Phase 2)

**Architecture:** Clean separation between routing and presentation through dedicated template components.

**Directory Structure:**
```
src/
├── pages/
│   └── [slug].astro              # Router (~73 lines of logic)
└── templates/
    ├── index.ts                  # Type definitions & registry
    ├── EditorialTemplate.astro   # Default content pages
    ├── LegalTemplate.astro       # Legal documents (privacy, terms)
    └── LandingTemplate.astro     # Marketing pages (stub)
```

**Supported Templates:**
1. **Legal Template** (`template: 'legal'`):
   - Revision badge with formatted date + animated pulse
   - Back-to-home navigation button
   - Print-optimized styles (@media print)
   - Used for: Privacy Policy, Terms of Service

2. **Editorial Template** (`template: 'default'`):
   - Clean, minimal layout with centered title
   - Prose-styled content area
   - Optional table of contents
   - Used for: General content pages, articles, documentation

3. **Landing Template** (`template: 'landing'`):
   - Hero-style header with larger typography
   - Optional CTA button support
   - Wider layout (7xl vs 4xl)
   - Stub for future marketing pages

**Router Pattern:**
```typescript
// Router computes SEO, breadcrumbs, JSON-LD
const sharedProps = { title, content, seoTitle, jsonLd, ... };

// Conditional rendering ensures type safety
{templateType === 'legal' ? (
  <LegalTemplate {...sharedProps} lastUpdated={page.lastUpdated} />
) : templateType === 'landing' ? (
  <LandingTemplate {...sharedProps} />
) : (
  <EditorialTemplate {...sharedProps} />
)}
```

**Adding New Templates:**
1. Add template name to `PageTemplateEnum` in `validators/enums.ts`
2. Create `[TemplateName]Template.astro` component
3. Define props interface in `templates/index.ts`
4. Add to `TEMPLATE_MAP` constant
5. Update router conditional rendering

**Key Benefits:**
- ✅ **35% code reduction**: Router logic reduced from 113 → 73 lines
- ✅ **Type safety**: Explicit props contracts per template
- ✅ **Maintainability**: Self-contained, testable components
- ✅ **Extensibility**: Easy to add new templates without touching router
- ✅ **Separation of concerns**: Router handles routing, templates handle presentation

### CMS Data Architecture (Phase 0.2.4)

**Data Flow:**
```
Strapi CMS (PostgreSQL + pgVector)
   ↓
/lib/api/homepage-data.ts → Parallel fetch (15+ endpoints)
   ↓
/lib/validators/* → Zod schema validation (runtime type safety)
   ↓
/lib/transformers/* → Data transformation (clean structures)
   ↓
DataContext → Provides data to all components
   ↓
Custom hooks → Components access data
  ├─ useDataContext() → Full data access
  ├─ useSectionData() → Section-specific data
  ├─ usePortfolioData() → Portfolio metadata
  ├─ useHomepageData() → Homepage configuration
  └─ useRegistry() → Section component registry
```

**API Layer Structure:**
```
src/lib/
├── api/              # 24 specialized API clients (modular structure)
│   ├── hero.ts             # Hero section
│   ├── about.ts            # About section
│   ├── projects.ts         # Projects collection
│   ├── experiences.ts      # Work experience
│   ├── testimonials.ts     # Testimonials
│   ├── awards.ts           # Awards/achievements
│   ├── education.ts        # Education history
│   ├── posts.ts            # Blog posts
│   ├── skills.ts           # Skills collection
│   ├── skill-categories.ts # Skill categories
│   ├── pages.ts            # Static pages (legal, etc.)
│   ├── animation.ts        # Animation config
│   ├── theme.ts            # Theme config
│   ├── maintenance.ts      # Maintenance mode
│   ├── website-config.ts   # Website metadata
│   ├── blog-config.ts      # Blog configuration
│   ├── portfolio.ts        # Portfolio metadata
│   ├── homepage.ts         # Homepage config
│   ├── preloader.ts        # Preloader config
│   ├── journey.ts          # Journey page config (NEW)
│   ├── skill-showcase.ts   # Skill showcase (NEW)
│   ├── experience-showcase.ts # Experience showcase (NEW)
│   ├── project-showcase.ts # Project showcase (NEW)
│   └── contact-form.ts     # Contact form config (NEW)
├── validators/       # 20+ Zod schemas (type-safe validation)
├── transformers/     # 20+ data transformers (clean structures)
├── utils/            # Helper functions (15 modular utilities - Phase 2)
│   ├── index.ts              # Central exports
│   ├── about.ts              # About page utilities
│   ├── availability.ts       # Status indicator logic
│   ├── base.ts               # Base utilities
│   ├── blog.ts               # Blog utilities
│   ├── contact-form.ts       # Contact form helpers
│   ├── content.ts            # Content utilities
│   ├── debounce.ts           # Debounce utilities
│   ├── experiences.ts        # Experience utilities
│   ├── icons.ts              # Icon utilities
│   ├── projects.ts           # Project utilities
│   ├── strapi.ts             # Strapi helpers
│   ├── tagColors.ts          # Tag color mapping
│   ├── text.ts               # Text utilities
│   ├── toc.ts                # Table of contents
│   └── url.ts                # URL utilities
└── strapi.ts         # Base Strapi client
```

**Context Integration:**
```typescript
<DataProvider data={data} content={homepage} portfolio={portfolio}>
  <PortfolioProvider>
    <AnimationProvider>
      {/* All components have access to CMS data via hooks */}
    </AnimationProvider>
  </PortfolioProvider>
</DataProvider>
```

**Key Benefits:**
- ✅ Complete type safety with Zod runtime validation
- ✅ Parallel data fetching (all 15+ endpoints in parallel)
- ✅ Graceful fallbacks if CMS unavailable
- ✅ No prop drilling (context hooks throughout)
- ✅ Testable, modular API clients

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

### ✅ Phase 1.5 - Code Quality & Security Fixes (COMPLETED - 2025-12-03)

**Detailed docs:** `docs/phase-1.5-code-quality-security.md`

**Achievements:**
- ✅ Fixed critical CVEs (happy-dom upgraded to >=20.0.2)
- ✅ Eliminated memory leaks (PortfolioContext timeout cleanup)
- ✅ Improved type safety (AwardsSection typed properly)
- ✅ Fixed hook dependencies (exhaustive-deps violations resolved)
- ✅ Added GSAP cleanup (prevented animation memory leaks)
- ✅ Code quality: 7.5/10 → 8.5-9.0/10

### ✅ Phase 0 - Infrastructure & Architecture (COMPLETED - 2026-01-17)

**Detailed docs:** `docs/phase-0-infrastructure.md`

**Goal:** Set up production-ready infrastructure with Docker Compose

**Sub-phases:**
- **0.1:** Verify monorepo structure (pnpm + Turborepo) ✅ COMPLETED
- **0.2.1:** Docker Compose setup (Strapi + PostgreSQL 16 + pgVector) ✅ COMPLETED
- **0.2.2:** Strapi configuration (admin panel, Cloudinary) ✅ COMPLETED
- **0.2.3:** Content types creation (20 types implemented) ✅ COMPLETED
- **0.2.4:** Frontend API integration (Strapi SDK) ✅ COMPLETED (2025-12-19)
- **0.3:** Deployment strategy (Vercel + Railway) ✅ COMPLETED (2025-12-29)
- **0.4:** Content migration from static to CMS ✅ COMPLETED (2026-01-14)
- **0.5:** Portfolio pages implementation ✅ COMPLETED (2026-01-17)

**Key Technology Decisions:**
- ✅ Docker Compose for local development (configured and running)
- ✅ PostgreSQL 16+ with pgVector extension (configured)
- ✅ Strapi v5.31.0 (installed and configured)
- ✅ 20 content types created (Skills, Projects, Posts, Testimonials, Pages, etc.)
- ✅ 9 components implemented
- ✅ 14 pages implemented (Projects, Experiences, About, Journey, Blog, Legal, 404, Maintenance)
- ✅ Footer, RSS feed, Sitemap integrated

**Status:** ✅ 100% complete - All infrastructure, frontend integration, deployment, content migration, and pages implemented.

### 🚧 Phase 2 - Component Architecture (IN PROGRESS - Est. 40% Complete)

**Detailed docs:** `docs/phase-2-component-architecture.md`

**Completed:**
- ✅ Template system (Editorial, Legal, Landing) - 3 templates operational
- ✅ Utility refactoring - Split monolithic files into 15 specialized modules
- ✅ Common components - 6 new reusable components
  - `StatusBadge.tsx` - Reusable status indicators
  - `ThemeToggle.tsx` - Dark/light theme switcher
  - `Breadcrumbs.astro` - Navigation breadcrumbs
  - `GradientAccent.astro` - Gradient decorations
  - `WatermarkBackground.astro` - Branded watermarks
  - `DetailNavigation.astro` - Back/forward navigation
- ✅ Site config centralization - `config/site.ts` with types and helpers
- ✅ Footer component - Tech stack logos (Astro, React, Tailwind, Vite)

**In Progress:**
- 🚧 Scene.tsx optimization
- 🚧 Section components standardization

### Upcoming Phases (execute in order)
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
- `apps/portfolio/src/pages/[slug].astro` - Dynamic page router (73 lines logic, Phase 2 refactored)
- `apps/portfolio/src/templates/` - Page template components (Phase 2)
  - `index.ts` - Type definitions & template registry
  - `EditorialTemplate.astro` - Default content pages
  - `LegalTemplate.astro` - Legal documents with revision badge
  - `LandingTemplate.astro` - Marketing pages (stub)
- `apps/portfolio/src/config/site.ts` - Centralized site configuration (Phase 2)
- `apps/portfolio/src/components/common/` - Shared components (Phase 2)
  - `StatusBadge.tsx` - Reusable status indicators
  - `ThemeToggle.tsx` - Dark/light theme switcher
  - `Breadcrumbs.astro` - Navigation breadcrumbs
  - `GradientAccent.astro` - Gradient decorations
  - `WatermarkBackground.astro` - Branded watermarks
  - `DetailNavigation.astro` - Back/forward navigation
- `apps/portfolio/src/components/animations/Section.tsx` - Main animation orchestrator (174 lines)
- `apps/portfolio/src/components/animations/HomepageContent.tsx` - Section content renderer (replaces SectionContent.tsx ❌ deleted)
- `apps/portfolio/src/components/animations/contexts/DataContext.tsx` - CMS data provider (NEW in 0.2.4)
- `apps/portfolio/src/components/animations/sections/layouts/SectionLayout.tsx` - Reusable section wrapper
- `apps/portfolio/src/components/animations/hooks/` - Custom hooks library (13 total)
  - `useSectionRegistry.ts` - Component mapping (NEW)
  - `useHandlebars.ts` - Template rendering (NEW)
  - `useDataContext.ts` - CMS data access (NEW)
- `apps/portfolio/src/lib/api/` - 25 specialized API clients (modular structure)
  - Core: `hero.ts`, `about.ts`, `projects.ts`, `experiences.ts`, `education.ts`
  - Content: `posts.ts`, `testimonials.ts`, `awards.ts`, `skills.ts`, `pages.ts`
  - Config: `animation.ts`, `theme.ts`, `maintenance.ts`, `website-config.ts`, `blog-config.ts`, `portfolio.ts`, `homepage.ts`, `preloader.ts`, `skill-categories.ts`
  - Showcase: `journey.ts`, `skill-showcase.ts`, `experience-showcase.ts`, `project-showcase.ts`, `contact-form.ts`
  - Navigation: `navigation.ts` (NEW in Phase 2 - 2026-01-27)
- `apps/portfolio/src/lib/validators/` - Zod validation schemas (20+ schemas)
- `apps/portfolio/src/lib/transformers/` - Data transformation layer (20+ transformers)
- `apps/portfolio/src/lib/utils/` - Helper utilities (15 modular files - Phase 2)
  - See API Layer Structure section for complete list

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

### When Working with Page Templates
1. **Router is routing only** - `[slug].astro` handles SEO, breadcrumbs, and delegates to templates
2. **Templates are presentation only** - Each template focuses solely on layout and rendering
3. **Adding new templates**:
   - Add to `PageTemplateEnum` in `src/lib/validators/enums.ts`
   - Create `[Name]Template.astro` in `src/templates/`
   - Define props interface in `src/templates/index.ts`
   - Update router conditional rendering
4. **Template-specific features** - Add props to template's interface (e.g., `lastUpdated` for Legal)
5. **Test print styles** - Legal template has print optimization, verify with Cmd/Ctrl+P
6. **Type safety** - Use conditional rendering in router to ensure correct props per template

### When Working with Utilities (Phase 2 Pattern)
1. **Modular structure** - Utilities are organized by domain (blog, projects, experiences, etc.)
2. **Single responsibility** - Each utility file has a focused purpose
3. **Central exports** - Import from `~/lib/utils` (barrel export pattern via `index.ts`)
4. **Type safety** - All utilities have proper TypeScript types
5. **Deleted files** - `utils.ts`, `blogHelpers.ts`, `contentHelpers.ts`, `experienceHelpers.ts` consolidated into modular structure
6. **Adding new utilities**:
   - Create domain-specific file (e.g., `analytics.ts`)
   - Export functions with JSDoc comments
   - Add to `index.ts` barrel export
   - Follow naming: camelCase for functions, PascalCase for types

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

**Last Updated:** 2026-01-27

**Key Updates:**
- 🚧 **Phase 2 In Progress:** Component Architecture (~50% complete)
  - Template system operational (3 templates)
  - Utility refactoring complete (15 modular files)
  - Common components added (6 new reusable components)
  - Site config centralized
  - Footer updated with tech stack logos
  - ✅ **Navigation Plugin Integration** (2026-01-27)
    - CMS-driven navigation via `strapi-plugin-navigation` v3.2.4
    - WRAPPER architecture: Single `footer-navigation` container with nested sections
    - Custom fields: `label` (display override), `icon`, `buttonStyle` (primary/secondary/outline), `description`, `cssClass`
    - Dynamic CTA buttons in Navbar (configurable from CMS)
    - Flattened `additionalFields` in transformer for component ergonomics
    - API calls reduced 3→2 (33% performance improvement)
    - Files: `lib/api/navigation.ts`, `lib/validators/navigation.ts`, `lib/transformers/navigation.ts`
- ✅ **Phase 0.5 Completed:** Portfolio Pages Implementation (2026-01-17)
  - 15 pages implemented: Homepage, Projects (list + detail), Experiences (list + detail), About, Journey, Skills, Blog (list + detail), Legal pages (privacy, terms, contact via catch-all), Contact, 404, 500, Maintenance
  - Footer component with CMS-driven social links (platform-based rendering)
  - RSS feed for blog posts (filters external posts)
  - Sitemap integration with auto-generation
  - 500 error page with SSR (real-time status checks, error logging)
  - Rich text rendering fixes (MarkdownRenderer for `richtext`, BlocksRenderer for `blocks`)
  - Unified seed script for legal pages (`seed-pages.js`)
  - Key decisions: Removed dedicated Awards/Testimonials pages (homepage sections), Footer in PageLayout only, generic catch-all with 3 templates
- ✅ **Phase 0 Completed:** Infrastructure & Architecture (2026-01-17)
  - All sub-phases finished (0.1 → 0.5)
  - CMS, deployment, content migration, and pages fully implemented
- ✅ **Project Schema Enhanced:** (2026-01-07)
  - Added `unlisted` to display enum (hidden, unlisted, standard, featured, home)
  - Expanded projectStatus enum: Planned, In Progress, Released, Maintenance, On Hold, Completed, Archived
- ✅ **Phase 0.3 Completed:** Deployment Strategy (2025-12-29)
  - Railway: Strapi CMS deployed at admin.aazucena.com
  - Vercel: Production portfolio deployed and connected
  - Integration: Frontend successfully connects to Railway CMS
  - APIs: All 19 endpoints accessible from production
- ✅ **Phase 0.2.4 Completed:** Frontend API Integration (2025-12-19)
  - Modular API architecture: 24 specialized clients (journey, skill-showcase, experience-showcase, project-showcase, contact-form added in 0.5)
  - Type safety: 20+ Zod validators + 20+ transformers
  - DataContext system for CMS data access (no prop drilling)
  - New components: HomepageContent (replaces SectionContent ❌), SectionLayout
  - New hooks: useSectionRegistry, useHandlebars, useDataContext
- ✅ **Phase 1.5 Completed:** Code Quality & Security Fixes (2025-12-03)
  - Fixed critical CVEs, memory leaks, type safety
  - Code quality: 7.5/10 → 8.5-9.0/10
- ✅ **Phase 1 Completed:** Animations refactoring (324 → 174 lines, 46% reduction)
- ✅ **Phase 0 100% Complete:** Strapi v5.31.0, Docker Compose, 20 content types, 9 components, deployed to Railway + Vercel, content migrated, 15 pages implemented, 24 API clients
- 🔥 **Current Priority:** Phase 2 - Component Architecture (further optimization)
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

**Strapi CMS Components (Implemented - 10 total):**
- `shared.seo` - SEO metadata with nested Open Graph
- `shared.open-graph` - Open Graph meta tags (used by SEO)
- `shared.social-links` - Social media URLs
- `media.audio-metadata` - Music track metadata with enharmonic keys, BPM, time signatures, scales
- `ui.cta-button` - Call-to-action buttons with icon picker (@mynaui/icons integration)
- `content.stats` - Statistics display component
- `content.achievement` - Achievement/award display
- `content.education` - Education history
- `ui.image-element` - Image component with alt text
- `content.working-style-item` - Working style item for About section

**Strapi CMS Status:**
- 20 total content types implemented (10 collection + 10 single)
- 9 components implemented
- Simplified blog architecture (Post collection + Blog configuration single type, no Blog Series)
- AI Forms consolidated into single Form Submission collection type with formType enumeration (instead of 8 separate collection types)
