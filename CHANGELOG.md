# Changelog

All notable changes to this project are documented here, grouped by phase milestone.

---

## 2026-05-24

### ♻️ Refactor

- _(ecosystem)_ Split IDEATION_PLAN into per-node specs
- _(intel-engine)_ Replace disk-based GitHub fetch with in-memory indexing
- _(intel-engine)_ Fetch docs from GitHub at startup instead of baking into image
- _(intel-engine)_ Migrate retriever from Ollama to Voyage AI + add GET search endpoint
- _(intel-engine)_ Replace Ollama with Voyage AI + Claude for Railway
- _(intel-bridge)_ Prepare service for Railway deployment
- _(websocket)_ Prepare service for Railway deployment

### ⚡ Performance

- _(retriever)_ Blend recency into vector similarity ranking

### 🐛 Bug Fixes

- _(analytics)_ Guard vacuous-truth OPERATIONAL on empty system_integrity data
- _(visualizations)_ Use fitExtent to prevent choropleth map cutoff
- _(analytics)_ Source geo distribution from telemetry_events not log drain
- _(analytics)_ Align log drain schema and ingestion with Vercel docs
- _(analytics)_ Correct visitor counting and filter non-page requests in traffic stats
- _(analytics)_ Align Ko-fi webhook schema and handler with API docs
- _(analytics)_ Accept null fields in Ko-fi webhook schema
- _(icons)_ Accept forwardRef components in registry resolver
- _(storybook)_ Replace unsupported cpp snippet in typography demo
- _(ui)_ Deduplicate heading IDs in TableOfContents
- _(changelog)_ Run git-cliff before lint-staged in pre-commit hook
- _(portfolio)_ Replace impure Date.now() in useRef initializer
- _(analytics)_ Resolve lint errors flagged in CI
- _(types)_ Add FormSubmission and EasterEgg payload types to IngestionPayload
- _(portfolio)_ Tighten About section spacing and text size on desktop
- _(analytics)_ Allow /api/brain and /api/stats through auth middleware
- _(api)_ Strip trailing slash from STRAPI_URL in setStrapiConfig
- _(analytics)_ Strip trailing slash from STRAPI_URL + log request path
- _(analytics)_ Use ingestClickhouseClient in all webhook routes
- _(analytics)_ Allow webhook routes through auth middleware
- _(analytics)_ Return 200 no-op for unsigned vercel drain setup probe
- _(analytics)_ Lazy-init Resend client to fix build crash
- _(analytics)_ Resolve type-check, lint, and format errors
- _(analytics)_ Remove unsupported placeholder prop from ControlledTextarea
- _(clickhouse)_ Fix verification queries and rename admin RBAC config
- _(clickhouse)_ Production hardening — RBAC, missing tables, env docs
- _(mobile)_ Chatbot input text size responsive scaling
- _(mobile)_ Toolbar info panel sizing and collapse behaviour
- _(mobile)_ Skills section make +N more badge functional
- _(mobile)_ Blog section reduce gap to view all button
- _(mobile)_ Hero section button and dropdown sizing
- _(mobile)_ Experience card text and size scaling
- _(mobile)_ About section responsive text and card sizing
- _(mobile)_ Services section responsive layout
- _(lint)_ Resolve no-empty catch block errors in homepage components
- _(sound)_ Resolve no-empty lint errors in catch blocks
- _(sound)_ Reduce ambient volume ~30% across all atmospheric layers
- _(sound)_ Resume AudioContext on first interaction after page refresh
- _(homepage)_ Replace white noise with brown noise for ambient sound
- _(toolbar)_ Separate fixed and relative into distinct elements
- _(homepage)_ Honour canUseHeavyAnimations on mobile
- _(assistant)_ Prevent iOS Safari zoom on chat input focus
- _(blog)_ Reduce newspaper card size on mobile
- _(indexer)_ Add embedding column migration for Strapi-owned table
- _(indexer)_ Remove token prefix log from startup output
- _(intel-engine)_ Surface GitHub API message when content key is missing
- _(intel-engine)_ Use GitHub Contents API instead of raw.githubusercontent.com
- _(intel-engine)_ Fix \_glob_to_regex to match zero-segment \*\* case
- _(intel-engine)_ Write GitHub-fetched docs to /tmp to avoid read-only volume error
- _(intel-engine)_ Use intel.config.json patterns for GitHub doc fetch
- _(intel-engine)_ Remove root-file COPY that breaks Railway build
- _(security)_ Lock CORS and add inbound auth to intel-bridge and websocket
- _(security)_ Add API key guard to intel-engine + wire portfolio client
- _(ui)_ Left-align user message text in ChatContent
- _(portfolio)_ Extract lastUserMessage from AI SDK v6 parts format
- _(compose)_ Pin intel-engine PORT to 3003
- _(intel-engine)_ Use TRUNCATE CASCADE for dimension migration
- _(intel-engine)_ Auto-migrate embedding dimension on startup
- _(intel-bridge)_ Pass Redis password from env to client
- _(clickhouse)_ Resolve admin user config conflict on Railway
- _(analytics)_ Use standard self-hosted Plausible script path
- _(utils)_ Declare three as explicit dependency
- Resolve SSR 500s, about title duplicate, and Three.js dual-instance warning
- _(animations)_ Gate Three.js canvas on live WebGL availability check
- _(seo)_ Prevent duplicate site name in homepage tab title

### 🚀 Features

- _(ecosystem)_ Add tiered build sequence with prerequisites
- _(ecosystem)_ Lock DIO frontend to Vite + React SPA
- _(ecosystem)_ Complete 12-node ideation — GAGE, CAST, SCOPE, INTRO
- _(design-system)_ Expand Figma token generator to 20 token groups
- _(portfolio/assistant)_ Add LangGraph brain API endpoint and routing switch
- _(analytics)_ Map clickhouse and clickhouse-olap to display names
- _(analytics)_ Add display name mapping for status page services
- _(portfolio)_ Add changelog page auto-generated from git history
- _(portfolio)_ Enable IntegrityBadge in footer
- _(portfolio)_ Wire analytics telemetry to AZUCENA_LYTICS
- _(analytics)_ Add toast notifications and notification center
- _(analytics)_ Easter eggs & forms dashboards, Ollama removal, telemetry hardening
- _(blog)_ Add paper sound effect on newspaper card interaction
- _(homepage)_ Add Web Audio API atmospheric ambient sound
- _(toolbar)_ Add first-visit ambient sound hint
- _(navbar)_ Add swipe-to-close gesture for mobile offcanvas
- _(intel-engine)_ Index root-level markdown files in knowledge base
- _(rin)_ Implement Phase 2 persona — three-layer prompt stack
- _(portfolio)_ Wire intel-engine RAG context into Rin chat pipeline

### 🧪 Tests

- _(portfolio)_ Add data-testid attributes for Playwright E2E
- _(phase-5)_ Scaffold Vitest for hooks and utils packages
- _(intel-engine)_ Add Voyage AI + Claude Haiku integration smoke tests

## phase-4 — 2026-05-11

### 🚀 Features

- _(phase-4)_ Developer Experience — 16 packages, Storybook, design system, Services, Rin (#3)
- Implement Command Palette and intelligence feature documentation
- _(analytics)_ Add Command Palette with fuzzy search

## phase-3 — 2026-02-04

### ♻️ Refactor

- Update PixiJSParticles component

### ⚡ Performance

- Complete Phase 3 with 74.3% bundle reduction
- _(deps)_ Upgrade to React 19 for Phase 3 optimization

### 🚀 Features

- Add IntegrityBadge real-time system health component

## phase-2 — 2026-02-04

### ♻️ Refactor

- Consolidate ClickHouse client and update config
- Update existing analytics routes and components
- Update particles, components, and transformers
- Restructure journey components (Phase 2)
- Flatten scene directory structure (Phase 2)
- Remove old animations structure (Phase 2 cleanup)
- _(portfolio)_ Flatten project showcase data structure
- _(portfolio)_ Enhance type definitions and environment types
- _(portfolio)_ Update API clients and services with utilities
- _(portfolio)_ Update journey components with new utilities
- _(portfolio)_ Update animation components with new utilities
- _(portfolio)_ Streamline dynamic page router with templates
- _(portfolio)_ Update project and experience pages
- _(portfolio)_ Update blog pages with new utilities
- _(portfolio)_ Update main pages with new utility imports
- _(portfolio)_ Enhance layout components with shared utilities
- _(portfolio)_ Reorganize utilities into specialized modules

### 🚀 Features

- Add CMS knowledge base and prompt management
- Add AZUCENA_LYTICS infrastructure layer
- Add AZUCENA_LYTICS visualization components
- Add analytics stats API routes
- Add AZUCENA_LYTICS core dashboards and APIs
- Add telemetry, prompts API, and page updates
- Add new Phase 2 component architecture
- Introduce AZUCENA_LYTICS Engineering Intelligence Terminal
- Add analytics app scripts and update dependencies
- Integrate ClickHouse into CMS environment
- _(cms)_ Implement dynamic Footer CMS architecture
- _(cms)_ Implement dynamic navigation system with Strapi integration
- _(about)_ Update About validator for working style integration
- _(about)_ Integrate Working Style component and CMS data
- _(cms)_ Integrate working style component into About schema
- _(portfolio)_ Update Footer with accurate tech stack logos
- _(portfolio)_ Add StatusBadge and ThemeToggle UI components
- _(portfolio)_ Add core infrastructure for Phase 2 refactoring
- _(cms)_ Update About schema and regenerate TypeScript types
- _(portfolio)_ Update portfolio application components, api, and pages
- _(cms)_ Update content types, seed scripts, and extensions
- Implement 500 error page and fix rich text rendering

## phase-1 — 2026-01-22

### 🚀 Features

- Implement portfolio pages, animation refactoring, and CMS integration

## phase-0 — 2026-01-19

### ♻️ Refactor

- Update content type schemas
- Update CMS component schemas
- Integrate Strapi CMS data into section components
- Simplify Strapi client and fix API field mappings
- Improve Docker configuration and structure
- Remove local Strapi type definitions
- _(types)_ Replace any with Award type in AwardsSection
- _(hooks)_ Add GSAP tween cleanup in useFlipText
- Extract magic numbers and add JSDoc (Iteration 4)
- Improve TypeScript type safety (Iteration 2)

### ⚡ Performance

- Move gradient and color palettes to module scope
- Add DOM validation to GSAP animations (Iteration 3)

### 🐛 Bug Fixes

- Remove console.log from strapi.ts
- Reset scroll lock on cleanup in PortfolioContext
- Add URL sanitization to prevent XSS attacks in block renderers
- Resolve postgres ssl issue for Strapi v5
- Resolve redis issue for Strapi v5
- Copy compiled JS files instead of TS source in production
- Resolve Dockerfile.prod build issues for Strapi v5
- Improve Strapi plugin configuration
- Correct Railway builder configuration
- Use environment variables for Docker Compose credentials
- Remove hardcoded Sentry DSN and optimize sample rates
- Correct Dockerfile COPY paths for proper build context
- Correct PixiJS blend mode types in particle renderer
- _(context)_ Prevent memory leak in scroll handler
- Fix: resolve critical security vulnerabilities and restore
  scroll navigation

  Security Fixes (Iteration 1):
  - Prevent tabnabbing attacks on window.open (Section.tsx:105-108)
    - Set window.opener to null to block malicious redirects
    - CVE risk mitigation for resume download feature

  - Add SSR guard for window object access (AnimationCanvas.tsx:36)
    - Prevents 'window is not defined' build crash
    - Enables successful Astro SSR compilation

  - Validate localStorage data to prevent injection (AnimationContext.tsx:62-95)
    - Explicit type validation for all fields
    - Array and null value rejection
    - Prototype pollution attack prevention
    - Applied to both capabilities and sound preference storage

  Bug Fixes:
  - Restore scroll navigation in refactored context architecture
    - Added wheel event listener to PortfolioContext (lines 80-119)
    - Maintains scroll progress state across 8 sections
    - Proper debouncing to prevent rapid transitions

  Code Cleanup:
  - Remove orphaned useSectionTransition.ts hook
    - Logic migrated to PortfolioContext during refactoring
    - Dead code elimination improves maintainability
  - Clean up old Scene.tsx and Particles.tsx files
    - Replaced by modular ThreeJSScene and PixiJSParticles components

  Testing:
  ✅ All manual tests passed:
  - Resume download secure (tabnabbing blocked)
  - PixiJS particles render correctly (SSR safe)
  - localStorage injection attacks blocked
  - Scroll navigation works through all 8 sections
  - No console errors

- Fixed errors in components and updated to mynaui icons

### 🚀 Features

- _(cms)_ Add Education & Page content types with navigation support
- Update Experience schema with responsibilities and LinkedIn
- Add new CMS components
- Add testimonial hybrid workflow with lifecycle hooks
- Add preloader content type with seed script
- Implement local data fallbacks for Strapi CMS
- Connect portfolio homepage to Strapi CMS
- Add dynamic block rendering system for Strapi content
- Add portfolio type definitions and Strapi transformers
- _(portfolio)_ Add dependencies and env types for deployment
- _(portfolio)_ Integrate Vercel adapter for deployment
- Add Sentry integration to portfolio app
- Add Railway deployment configuration
- Add Strapi content type definitions
- Add Strapi component type definitions
- Add Strapi base type definitions
- Add Strapi CMS frontend integration
- _(cms)_ Add 4 new Strapi collection types
- _(cms)_ Add Game collection type and slug generator middleware
- _(cms)_ Add Testimonials collection type with AI support
- _(cms)_ Add Experience collection type with relations and components
- _(cms)_ Add Projects collection type with relations and components
- _(cms)_ Add Post collection type with draft/publish
- _(cms)_ Add Music Genres collection type
- _(cms)_ Add Skills collection type with relations
- _(cms)_ Add comprehensive Strapi plugin configuration
- _(cms)_ Implement comprehensive Strapi CMS with 10 single types and 9 components
- Enhance Education component with critical fixes for production readiness
- Add Portfolio single type to Strapi CMS with Education and Image Element components
- Add Hero Banner single type to Strapi CMS
- Add Achievement component to Strapi CMS with icon picker and badge support
- Add Stats component to Strapi CMS with icon picker integration
- Add essential plugins for Strapi CMS
- Phase 0 infrastructure setup with Docker Compose and Strapi CMS
