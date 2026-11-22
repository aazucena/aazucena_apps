# Changelog

All notable changes to this project are documented here, grouped by phase milestone.

---

## 2026-11-22

### ♻️ Refactor

- _(portfolio)_ Replace negative-margin spacing with real spacing
- _(portfolio)_ Scope the quote style to the markdown renderer
- _(portfolio)_ Logo plates use one variable, no guard exemptions
- _(portfolio)_ One availability marker helper
- _(analytics,api)_ Price ai calls from the shared catalogue
- _(analytics)_ One state note for empty and failed panels
- _(ui)_ Animate with tw-animate-css instead of the tailwindcss-animate plugin
- _(portfolio)_ Use the shared RinCharacter and Rin constants
- _(ui)_ Move RinCharacter into @aazucena/ui
- _(storybook)_ Keep the interaction-test story list in one module
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

- _(portfolio)_ Reserve About's overlay space wherever Chat or the FAB overlaps
- _(portfolio)_ Reserve About's overlay space on short screens only
- _(portfolio)_ Tolerate a missing watermark text
- _(ui)_ Stop a skipped preloader from capturing Enter and Space
- _(portfolio)_ Stop the Rin greeting from taking focus or closing on focus moves
- _(portfolio)_ Add footer bottom space so the last links clear the Chat button
- _(portfolio)_ Let the list filter header grow when its count wraps
- _(portfolio)_ Keep the About card text and scroll the section clear of the overlays
- _(portfolio)_ Fit the home About section on short laptop screens
- _(portfolio)_ Switch the navbar to a menu below 1024px and add the frame's close button
- _(portfolio)_ Touch storage only in the top frame in visual-check
- _(portfolio)_ Put the Rin popover on the fixed z tier
- _(portfolio)_ Resolve the font variables so Fira Sans and Fira Code render
- _(portfolio)_ Rin announces only the finished reply
- _(portfolio)_ Homepage text and body follow the dark tokens
- _(portfolio)_ Blocks code renderer type-checks
- _(ui)_ Preloaders follow the resolved theme and release the body background
- _(portfolio)_ Inner pages paint the theme background under the navbar
- _(portfolio)_ Hero subtitle readable after the palette removal
- _(portfolio)_ Homepage wrapper scopes dark tokens without hiding the scene
- _(analytics)_ Sidebar mode follows the current route
- _(constants)_ Prototype names are unknown models, not priced
- _(analytics)_ Chat route accepts only catalogue models
- _(storybook)_ Stories use radix data-state selectors; guard scans stories
- _(analytics)_ Kpi value keeps its colour, glyph carries the trend
- _(analytics)_ Drop legacy cyber badges; live badges follow query state
- _(analytics)_ Login overlay stays modal over the command palette
- _(analytics)_ Overview kpis show only real values
- _(analytics)_ Notification icons use avra tokens; guard walks .ts
- _(analytics)_ Honest failure states and status colours
- _(analytics)_ No peak line when every column is zero
- _(analytics)_ Finance weeks zero-filled, current week to date
- _(analytics)_ Chart values readable without hover
- _(analytics)_ Prompt lab labels say what they are
- _(analytics)_ Trajectory rewards read neutral, scroll regions focusable
- _(analytics)_ Budget meter shows the projected burn
- _(analytics)_ Model picker at every width and an honest live region
- _(visualizations)_ Name the choropleth map
- _(analytics)_ Status top bar counts down and degraded apart
- _(analytics)_ Label web vitals by the statistic they show
- _(analytics)_ Cover the shell until the login overlay mounts
- _(analytics)_ Login overlay keeps focus inside
- _(analytics)_ Kpi trend always shows its glyph
- _(visualizations)_ Heatmap honours its height prop
- _(ui)_ Navigation menu indicator animates on data-state
- _(ui)_ Text-foreground0 typo leaves secondary text unstyled
- _(ui)_ Style Radix states with data-[state=…] so they apply
- _(analytics)_ Coral only with ▲ in the settings menu and integrity badge
- _(analytics)_ Respect reduced motion in framer-motion
- _(ui)_ Declare zod as an optional peer for the re-exported zodValidator
- _(ui)_ Declare the packages ui imports and drop the unused ones
- _(design-system)_ Panel-colored labels reach AA on every chart series
- _(storybook)_ Name the remaining icon buttons and fields, and add image alt text
- _(visualizations)_ Name the chart range sliders
- _(forms)_ Solid role fills use their role foreground text
- _(ui)_ No button inside the chat thread button; list group buttons sit in list items
- _(ui)_ Empty meter labels fall back to a name; chat image named by its visible text
- _(storybook)_ One main region and ordered headings in layout stories, with a skip link test
- _(ui)_ Dashboard title is an h2 under the page h1
- _(storybook)_ Placeholders, alt text and labels in stories
- _(forms)_ Status colours use role tokens, not stock palette classes
- _(ui)_ Disabled wrappers say so, the editor and otp field are named, lists hold list items
- _(design-system)_ Every vibe passes aa for text on its own tint
- _(storybook)_ Interaction-test stories pass axe
- _(ui)_ Disabled tags input says so, and a sortable handle can keep its own text as its name
- _(storybook)_ Signal fills in stories use signal foreground text
- _(ui)_ Contrast second pass after re-measuring
- _(ui)_ Name the speech, token copy, colour and pagination dot controls and the qr code
- _(ui)_ Resolve lint errors from the accessibility fixes
- _(storybook)_ Story markup passes contrast and names its icon buttons
- _(ui)_ Text contrast: no dimmed text, lighter tints, readable code blocks
- _(ui)_ Accessible names for icon-only controls, inputs and progress
- _(ui)_ Visible focus on every control that hid its outline
- _(ui)_ Scroll regions are reachable by keyboard
- _(ui)_ Targets of at least 24px, or spaced to match
- _(ui)_ Announce status changes to screen readers
- _(forms)_ Link validation errors to their fields
- _(ui)_ Listbox, tree, radio group and dialog keyboard patterns
- _(design-system)_ Light role colours pass aa as text on their own tint
- _(ui)_ Mega menu moves focus into its panel without an animation frame
- _(ui)_ Keyboard access for fourteen pointer-only components
- _(portfolio)_ Load the ui structural tokens
- _(storybook)_ Show the three.js scene stories in dark mode only
- _(animations)_ Object viewer loads without a removeChild error
- _(storybook)_ Story canvas takes the vibe's background
- _(storybook)_ Show the particles stories in dark mode only
- _(animations)_ Particles survive unmounting during pixi init
- _(ui)_ Put page-level layers on the z-index tiers
- _(design-system)_ Emit z-index tokens with kebab-case names
- _(design-system)_ Stop shifting tailwind's type scale
- _(ui)_ Framer motion, loops and rive respect reduced motion
- _(ui)_ Stop css animations and transitions under reduced motion
- _(storybook)_ Docs container no longer breaks the test run
- _(storybook)_ Docs table stripes use the panel tone so links stay AA
- _(storybook)_ Docs links, code and tables meet AA and fit phones
- _(storybook)_ Docs pages follow the light/dark and vibe toolbar
- _(portfolio)_ Rin's greeting asks what brings the visitor here
- _(portfolio)_ Align Rin's lore and transparency copy with the canon
- _(ui)_ Keep hexagon card labels inside the shape's wide band
- _(ui)_ Meter label gap, hexagon text inset, avatar rings, one-line mic error
- _(ui)_ Quiet static panels, marked destructive badges, select item radius
- _(design-system)_ Per-vibe signal and alert contrast
- _(portfolio)_ Read the AI Gateway key through astro:env in the chat route
- _(ui)_ Read Rive's CommonJS exports so Astro SSR can load RinCharacter
- _(ui)_ Restore fills the sweep emptied in progress, timeline and friends
- _(ui)_ Use the panel surface where the sweep put a translucent scrim
- _(design-system)_ Distinct dark state tone and AA light status colors
- _(design-system)_ Clear the previous vibe's tokens before applying the next
- _(design-system)_ Raise light-mode muted text contrast in 9 vibes
- _(design-system)_ Define the shadcn aliases the ui theme references
- _(storybook)_ Bring React into scope for the toolbar version badge
- _(storybook)_ Label form controls and icon-only triggers in stories
- _(ui)_ Give icon buttons, slider thumbs, and inner inputs accessible names
- _(sentry)_ Set explicit data collection to keep chat and form data out
- _(forms)_ Show validation messages instead of [object Object]
- _(assistant)_ Read finished tool calls by AI SDK 5+ output-available state
- _(cms)_ Restore standalone overrides and regenerate cms lockfile
- _(portfolio)_ Unwrap react-countup default export under Vite 8
- _(deps)_ Restore Apollo Server 5 override for Strapi GraphQL
- _(deps)_ Prune and refresh security overrides
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
- _(intel-engine)_ Fix _glob_to_regex to match zero-segment ** case
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

- _(portfolio)_ Header bands and watermarks back on list, detail and journey pages
- _(portfolio)_ One watermark component sized to fit, used by the footer
- _(utils)_ ParseCssColor for reading tokens into three.js colours
- _(portfolio)_ Skills section shows its tool count
- _(portfolio)_ Blog posts get copy link and rss share controls
- _(ui)_ Perspective-1000 utility for flip words
- _(analytics)_ Ai terminal offers opus, sonnet and haiku 5.5
- _(constants)_ One claude model catalogue with prices
- _(utils)_ Cn merges avra token classes
- _(visualizations)_ Choropleth hover tooltip and hideHeader
- _(storybook)_ Show where the apps use each component
- _(design-system)_ Chart color roles as a CSS subset for apps without css-vars
- _(analytics)_ Warn five minutes before the session ends and let the admin renew it
- _(analytics)_ Expiry cookie and a renew endpoint for the admin session
- _(layouts)_ Skip link, a focusable main region and focus on route change
- _(config)_ Accessibility lint rules for ui, forms and layouts
- _(ui)_ Ship the structural tokens as structure.css
- _(design-system)_ Give minimal and nature their own palettes
- _(storybook)_ Docs pages honour a story file's locked theme
- _(hooks)_ Add usePrefersReducedMotion and use it in text effects
- _(design-system)_ Add chartTheme and back d3Scales with it
- _(design-system)_ Derive signal and surfaces from each vibe's own roles
- _(design-system)_ Keep the instrument shape across every vibe
- _(ui)_ Add Panel, PanelHeader and PanelBody
- _(ui)_ Expose instrument tokens as Tailwind utilities
- _(design-system)_ Instrument default vibe on ink neutrals
- _(types)_ Add instrument theme roles to SystemThemeColors
- _(constants)_ Add Rin emotion and behavior lists
- _(storybook)_ Show new, beta, and deprecated badges in the sidebar
- _(storybook)_ Add a version switcher
- _(storybook)_ Show the package version in the toolbar
- _(assistant)_ Add animated Rive character for Rin
- _(homepage)_ Improve touch target size on hero page navigation links
- _(homepage)_ Add visible page navigation links to hero section
- _(homepage)_ Add Blog to exit section with responsive card sizing
- _(portfolio)_ Add dedicated exit section to homepage journey
- _(analytics)_ Add Bronze layer to ClickHouse ingestion pipeline
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

- _(design-system)_ Guard the body and heading rules that consume the font variables
- _(design-system)_ The portfolio guard covers every file
- _(design-system)_ Portfolio token-layer guards
- _(design-system)_ Ratcheting avra token guard for the portfolio
- _(design-system)_ The analytics guard covers every file
- _(design-system)_ Analytics gets tw-animate-css through ui globals
- _(design-system)_ Radix state styles use data-[state=…]
- _(design-system)_ The analytics guard catches the removed app palette
- _(design-system)_ Analytics token-layer guards
- _(design-system)_ Catch short hex, drop false drop-shadow hits in the analytics guard
- _(design-system)_ Ratcheting Avra token guard for the analytics app
- _(design-system)_ Parse ui imports with TypeScript and pin the animate import order
- _(storybook)_ The vibe matrix checks contrast again
- _(storybook)_ Accessibility violations fail the interaction tests
- _(storybook)_ Keyboard tests for combobox, autocomplete, tree and segmented control
- _(design-system)_ Guard dimmed text, tint strength, accent text and focus styles in ui
- _(storybook)_ Keyboard tests for the components that were pointer-only
- _(design-system)_ Guard motion durations and transition-all in ui
- _(design-system)_ Apps load the tokens ui components read
- _(design-system)_ Minimal and nature bring their own palette
- _(design-system)_ Guard the z-index tiers and their css names
- _(design-system)_ Pin the type scale to figma's text styles
- _(design-system)_ Guard reduced motion in ui and the animation hooks
- _(design-system)_ Guard pill controls and cover all ui components
- _(storybook)_ Panel status, badge marker and select item radius
- _(design-system)_ Guard accent hovers, translucent signal text, gradient stops and stock cyan
- _(design-system)_ Chart theme references emitted tokens
- _(storybook)_ Vibe matrix checks each vibe's own signal
- _(design-system)_ Every vibe emits its own AA signal
- _(storybook)_ Vibe matrix measures the panel surface and status text
- _(design-system)_ Guard fill variants against empty values
- _(design-system)_ Guard against scrim used as a component surface
- _(storybook)_ Vibe switching leaves no stale tokens
- _(storybook)_ Assert vibes keep the instrument radii
- _(storybook)_ Vibe matrix with AA contrast checks
- _(storybook)_ Assert keyboard focus outlines on core controls
- _(storybook)_ Assert instrument tokens reach the page
- _(storybook)_ Capture component and recipe stories for Argos
- _(storybook)_ Use fixed sample data in stories that rendered random IDs
- _(storybook)_ Capture stories with Argos
- _(storybook)_ Wait for Select exit animation before asserting trigger
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
