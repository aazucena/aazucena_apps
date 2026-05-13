# Changelog

All notable changes to this project are documented here, grouped by phase milestone.

---
## [unreleased] — 2026-05-13

### ♻️ Refactor

- *(intel-engine)* Replace disk-based GitHub fetch with in-memory indexing
- *(intel-engine)* Fetch docs from GitHub at startup instead of baking into image
- *(intel-engine)* Migrate retriever from Ollama to Voyage AI + add GET search endpoint
- *(intel-engine)* Replace Ollama with Voyage AI + Claude for Railway
- *(intel-bridge)* Prepare service for Railway deployment
- *(websocket)* Prepare service for Railway deployment
- Update PixiJSParticles component
- Consolidate ClickHouse client and update config
- Update existing analytics routes and components
- Update particles, components, and transformers
- Restructure journey components (Phase 2)
- Flatten scene directory structure (Phase 2)
- Remove old animations structure (Phase 2 cleanup)
- *(portfolio)* Flatten project showcase data structure
- *(portfolio)* Enhance type definitions and environment types
- *(portfolio)* Update API clients and services with utilities
- *(portfolio)* Update journey components with new utilities
- *(portfolio)* Update animation components with new utilities
- *(portfolio)* Streamline dynamic page router with templates
- *(portfolio)* Update project and experience pages
- *(portfolio)* Update blog pages with new utilities
- *(portfolio)* Update main pages with new utility imports
- *(portfolio)* Enhance layout components with shared utilities
- *(portfolio)* Reorganize utilities into specialized modules
- Update content type schemas
- Update CMS component schemas
- Integrate Strapi CMS data into section components
- Simplify Strapi client and fix API field mappings
- Improve Docker configuration and structure
- Remove local Strapi type definitions
- *(types)* Replace any with Award type in AwardsSection
- *(hooks)* Add GSAP tween cleanup in useFlipText
- Extract magic numbers and add JSDoc (Iteration 4)
- Improve TypeScript type safety (Iteration 2)

### ⚡ Performance

- *(retriever)* Blend recency into vector similarity ranking
- Complete Phase 3 with 74.3% bundle reduction
- *(deps)* Upgrade to React 19 for Phase 3 optimization
- Move gradient and color palettes to module scope
- Add DOM validation to GSAP animations (Iteration 3)

### 🐛 Bug Fixes

- *(portfolio)* Replace impure Date.now() in useRef initializer
- *(analytics)* Resolve lint errors flagged in CI
- *(types)* Add FormSubmission and EasterEgg payload types to IngestionPayload
- *(portfolio)* Tighten About section spacing and text size on desktop
- *(analytics)* Allow /api/brain and /api/stats through auth middleware
- *(api)* Strip trailing slash from STRAPI_URL in setStrapiConfig
- *(analytics)* Strip trailing slash from STRAPI_URL + log request path
- *(analytics)* Use ingestClickhouseClient in all webhook routes
- *(analytics)* Allow webhook routes through auth middleware
- *(analytics)* Return 200 no-op for unsigned vercel drain setup probe
- *(analytics)* Lazy-init Resend client to fix build crash
- *(analytics)* Resolve type-check, lint, and format errors
- *(analytics)* Remove unsupported placeholder prop from ControlledTextarea
- *(clickhouse)* Fix verification queries and rename admin RBAC config
- *(clickhouse)* Production hardening — RBAC, missing tables, env docs
- *(mobile)* Chatbot input text size responsive scaling
- *(mobile)* Toolbar info panel sizing and collapse behaviour
- *(mobile)* Skills section make +N more badge functional
- *(mobile)* Blog section reduce gap to view all button
- *(mobile)* Hero section button and dropdown sizing
- *(mobile)* Experience card text and size scaling
- *(mobile)* About section responsive text and card sizing
- *(mobile)* Services section responsive layout
- *(lint)* Resolve no-empty catch block errors in homepage components
- *(sound)* Resolve no-empty lint errors in catch blocks
- *(sound)* Reduce ambient volume ~30% across all atmospheric layers
- *(sound)* Resume AudioContext on first interaction after page refresh
- *(homepage)* Replace white noise with brown noise for ambient sound
- *(toolbar)* Separate fixed and relative into distinct elements
- *(homepage)* Honour canUseHeavyAnimations on mobile
- *(assistant)* Prevent iOS Safari zoom on chat input focus
- *(blog)* Reduce newspaper card size on mobile
- *(indexer)* Add embedding column migration for Strapi-owned table
- *(indexer)* Remove token prefix log from startup output
- *(intel-engine)* Surface GitHub API message when content key is missing
- *(intel-engine)* Use GitHub Contents API instead of raw.githubusercontent.com
- *(intel-engine)* Fix _glob_to_regex to match zero-segment ** case
- *(intel-engine)* Write GitHub-fetched docs to /tmp to avoid read-only volume error
- *(intel-engine)* Use intel.config.json patterns for GitHub doc fetch
- *(intel-engine)* Remove root-file COPY that breaks Railway build
- *(security)* Lock CORS and add inbound auth to intel-bridge and websocket
- *(security)* Add API key guard to intel-engine + wire portfolio client
- *(ui)* Left-align user message text in ChatContent
- *(portfolio)* Extract lastUserMessage from AI SDK v6 parts format
- *(compose)* Pin intel-engine PORT to 3003
- *(intel-engine)* Use TRUNCATE CASCADE for dimension migration
- *(intel-engine)* Auto-migrate embedding dimension on startup
- *(intel-bridge)* Pass Redis password from env to client
- *(clickhouse)* Resolve admin user config conflict on Railway
- *(analytics)* Use standard self-hosted Plausible script path
- *(utils)* Declare three as explicit dependency
- Resolve SSR 500s, about title duplicate, and Three.js dual-instance warning
- *(animations)* Gate Three.js canvas on live WebGL availability check
- *(seo)* Prevent duplicate site name in homepage tab title
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
- *(context)* Prevent memory leak in scroll handler
- Fix: resolve critical security vulnerabilities and restore
  scroll navigation

  Security Fixes (Iteration 1):
  - Prevent tabnabbing attacks on window.open (Section.tsx:105-108)
    * Set window.opener to null to block malicious redirects
    * CVE risk mitigation for resume download feature

  - Add SSR guard for window object access (AnimationCanvas.tsx:36)
    * Prevents 'window is not defined' build crash
    * Enables successful Astro SSR compilation

  - Validate localStorage data to prevent injection (AnimationContext.tsx:62-95)
    * Explicit type validation for all fields
    * Array and null value rejection
    * Prototype pollution attack prevention
    * Applied to both capabilities and sound preference storage

  Bug Fixes:
  - Restore scroll navigation in refactored context architecture
    * Added wheel event listener to PortfolioContext (lines 80-119)
    * Maintains scroll progress state across 8 sections
    * Proper debouncing to prevent rapid transitions

  Code Cleanup:
  - Remove orphaned useSectionTransition.ts hook
    * Logic migrated to PortfolioContext during refactoring
    * Dead code elimination improves maintainability
  - Clean up old Scene.tsx and Particles.tsx files
    * Replaced by modular ThreeJSScene and PixiJSParticles components

  Testing:
  ✅ All manual tests passed:
    - Resume download secure (tabnabbing blocked)
    - PixiJS particles render correctly (SSR safe)
    - localStorage injection attacks blocked
    - Scroll navigation works through all 8 sections
    - No console errors
- Fixed errors in components and updated to mynaui icons

### 🚀 Features

- *(portfolio)* Enable IntegrityBadge in footer
- *(portfolio)* Wire analytics telemetry to AZUCENA_LYTICS
- *(analytics)* Add toast notifications and notification center
- *(analytics)* Easter eggs & forms dashboards, Ollama removal, telemetry hardening
- *(blog)* Add paper sound effect on newspaper card interaction
- *(homepage)* Add Web Audio API atmospheric ambient sound
- *(toolbar)* Add first-visit ambient sound hint
- *(navbar)* Add swipe-to-close gesture for mobile offcanvas
- *(intel-engine)* Index root-level markdown files in knowledge base
- *(rin)* Implement Phase 2 persona — three-layer prompt stack
- *(portfolio)* Wire intel-engine RAG context into Rin chat pipeline
- *(phase-4)* Developer Experience — 16 packages, Storybook, design system, Services, Rin (#3)
- Implement Command Palette and intelligence feature documentation
- *(analytics)* Add Command Palette with fuzzy search
- Add IntegrityBadge real-time system health component
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
- *(cms)* Implement dynamic Footer CMS architecture
- *(cms)* Implement dynamic navigation system with Strapi integration
- *(about)* Update About validator for working style integration
- *(about)* Integrate Working Style component and CMS data
- *(cms)* Integrate working style component into About schema
- *(portfolio)* Update Footer with accurate tech stack logos
- *(portfolio)* Add StatusBadge and ThemeToggle UI components
- *(portfolio)* Add core infrastructure for Phase 2 refactoring
- *(cms)* Update About schema and regenerate TypeScript types
- *(portfolio)* Update portfolio application components, api, and pages
- *(cms)* Update content types, seed scripts, and extensions
- Implement 500 error page and fix rich text rendering
- Implement portfolio pages, animation refactoring, and CMS integration
- *(cms)* Add Education & Page content types with navigation support
- Update Experience schema with responsibilities and LinkedIn
- Add new CMS components
- Add testimonial hybrid workflow with lifecycle hooks
- Add preloader content type with seed script
- Implement local data fallbacks for Strapi CMS
- Connect portfolio homepage to Strapi CMS
- Add dynamic block rendering system for Strapi content
- Add portfolio type definitions and Strapi transformers
- *(portfolio)* Add dependencies and env types for deployment
- *(portfolio)* Integrate Vercel adapter for deployment
- Add Sentry integration to portfolio app
- Add Railway deployment configuration
- Add Strapi content type definitions
- Add Strapi component type definitions
- Add Strapi base type definitions
- Add Strapi CMS frontend integration
- *(cms)* Add 4 new Strapi collection types
- *(cms)* Add Game collection type and slug generator middleware
- *(cms)* Add Testimonials collection type with AI support
- *(cms)* Add Experience collection type with relations and components
- *(cms)* Add Projects collection type with relations and components
- *(cms)* Add Post collection type with draft/publish
- *(cms)* Add Music Genres collection type
- *(cms)* Add Skills collection type with relations
- *(cms)* Add comprehensive Strapi plugin configuration
- *(cms)* Implement comprehensive Strapi CMS with 10 single types and 9 components
- Enhance Education component with critical fixes for production readiness
- Add Portfolio single type to Strapi CMS with Education and Image Element components
- Add Hero Banner single type to Strapi CMS
- Add Achievement component to Strapi CMS with icon picker and badge support
- Add Stats component to Strapi CMS with icon picker integration
- Add essential plugins for Strapi CMS
- Phase 0 infrastructure setup with Docker Compose and Strapi CMS

### 🧪 Tests

- *(intel-engine)* Add Voyage AI + Claude Haiku integration smoke tests

