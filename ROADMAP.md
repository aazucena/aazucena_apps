# Portfolio Development Roadmap

## ⚡ CURRENT PRIORITY: Phase 3 - Performance Optimization

**Recent Completions:**
- ✅ **AZUCENA_LYTICS v1** (2026-02-04) - Engineering Intelligence Terminal (100% Complete). **ALL 5 PHASES FINISHED** (Ingestion, AI Observability, External Data, Advanced Features, Production Hardening).
- ✅ **Data Integrity & Security** (2026-02-04) - Tiered ClickHouse TTL (14d-2y), Native Backups (backup.sh), and RBAC Security Controls.
- ✅ **Edge Intelligence Optimization** (2026-02-04) - Vercel Edge Runtime ingestion with native geo-header enrichment.
- ✅ **Prompt IDE & Intelligence Sync** (2026-02-03) - Bi-directional Strapi <-> LangSmith sync with Force_Reset capability.
- ✅ **Phase 2 - Component Architecture** (2026-02-02) - 100% Complete
- ✅ **Phase 0.4** - Content Migration (2026-01-14)
- ✅ **Phase 1.5** - Code quality & security fixes
- ✅ **Phase 1** - Animations refactoring (324 → 174 lines, 46% reduction)
- ✅ **Phase 0.5** - Portfolio Pages Implementation (15 pages + Footer, RSS, Sitemap, 500)
- ✅ **Phase 0** - Infrastructure & Architecture (2026-01-17)

**Phase 2 Completed:** ✅ Component Architecture & Animations Restructuring - 100% Complete (2026-02-02)
- ✅ Template system (3 templates: Editorial, Legal, Landing)
- ✅ Utility refactoring (monolithic → modular: 15 specialized utilities)
- ✅ Common components (6 new: StatusBadge, ThemeToggle, Breadcrumbs, GradientAccent, WatermarkBackground, DetailNavigation)
- ✅ Site config centralization (config/site.ts)
- ✅ Navigation Plugin Integration (2026-01-27) - CMS-driven header/footer navigation
- ✅ Footer CMS Integration (2026-01-27) - Dynamic tech stack and brand content
- ✅ AZUCENA_LYTICS_v1 (2026-01-28) - Engineering Intelligence Terminal (Next.js 15 + ClickHouse + D3.js)
- ✅ Intelligence Infrastructure (2026-01-29) - Real-time ClickHouse telemetry for AI & Integrity
- ✅ Prompt IDE & Sync (2026-02-03) - Strapi v5 prompt management with bi-directional LangSmith Hub sync
- ✅ Homepage restructuring (animations → homepage, type-first organization)
- ✅ Journey restructuring (type-first: ui/journey, visualizations/journey)
- ✅ Scene directory flattening (depth 3 → 2)
- ✅ Component extraction (all 8 sections <120 lines)
- ✅ Architectural cleanup (~70 files moved/reorganized, ~24 legacy files deleted)

---

## 🎯 Quick Navigation

- **[Comprehensive Documentation](/docs/README.md)** - Full project documentation
- **[Current Priority: Phase 3](/docs/phase-3-performance.md)** - Performance Optimization
- **[Phase 2 Complete](/docs/phase-2-component-architecture.md)** - Component Architecture ✅
- **[Tech Stack](#tech-stack)** - Complete technology overview
- **[Execution Timeline](#execution-timeline)** - Recommended order

---

## Tech Stack

### Frontend
- **Framework:** Astro v5.16.0 (with React integration)
- **Build Tool:** Vite
- **UI Library:** React 19.2 with TypeScript
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
- **CMS:** Strapi v5 with 15+ plugins
  - Core: `strapi-plugin-icons-field` v1.1.5, GraphQL, Documentation, Sentry, SEO
  - Editor: CKEditor, Multi-select, Color picker
  - Workflow: Preview button, Navigation, Duplicate button, Config sync, Publisher
  - Performance: REST cache, Redis integration
- **Database:** PostgreSQL 16+ with pgVector extension
- **Storage:** Cloudinary (via @strapi/provider-upload-cloudinary)
- **Local Development:** Docker Compose (CMS + PostgreSQL + pgVector)
- **Monorepo:** pnpm v10.22.0 + Turborepo
- **Frontend Deploy:** Vercel (auto via GitHub)
- **Backend Deploy:** Railway
- **CI/CD:** CircleCI (future - prechecks only, currently stashed)

### Monitoring & Logging
- **Frontend:** Sentry, Vercel Analytics, Vercel Speed Insights, Plausible (self-hosted)
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

## 📋 Development Phases

### 🔥 Phase 1: Animations Refactoring (9-11 days) - **COMPLETED** ✅
**[Full Documentation →](/docs/phase-1-animations-refactoring.md)**

Refactor the animations folder to improve maintainability and reduce complexity.

**Key Tasks:**
- ✅ Create centralized state management (PortfolioContext, AnimationContext)
- ✅ Break down Section.tsx from 324 → 174 lines (46% reduction)
- ✅ Extract components (AtmosphericOverlays, DynamicBackground, AnimationCanvas, SectionContent, UIOverlays)
- ✅ File renaming (Particles.tsx → PixiJSParticles.tsx, Scene.tsx → ThreeJSScene.tsx)
- ✅ Testing & validation (dev server: HTTP 200)

**Status:** ✅ Completed (2025-01-13)
**Achievement:** Reduced Section.tsx from 324 lines to 174 lines (46% reduction)

---

### Phase 1.5: Code Quality & Security Fixes (0.5-1 day) - **COMPLETED** ✅
**[Full Documentation →](/docs/phase-1.5-code-quality-security.md)**

Address critical security vulnerabilities and code quality issues identified in post-Phase 1 code review.

**Key Tasks:**
- ✅ Fix critical dependency vulnerability (happy-dom CVEs)
- ✅ Fix memory leak in scroll handler (PortfolioContext timeout)
- ✅ Add missing hook dependencies (useDeviceCapabilities, AnimationContext)
- ✅ Improve type safety (AwardsSection any types)
- ✅ Add GSAP cleanup (useFlipText tween management)

**Status:** ✅ Completed
**Achievement:** Code quality improved from 7.5/10 → 8.5-9.0/10

**Completed Fixes:**
- ✅ Upgraded happy-dom to >=20.0.2 (eliminated 2 critical CVEs)
- ✅ Added timeout cleanup to PortfolioContext (prevented memory leak)
- ✅ Typed AwardsSection award prop (improved type safety)
- ✅ Fixed hook dependencies (resolved exhaustive-deps violations)
- ✅ Added GSAP cleanup (prevented animation memory leaks)

---

### Phase 0: Infrastructure & Architecture (16-20 days) - **COMPLETED** ✅
**[Full Documentation →](/docs/phase-0-infrastructure.md)**

Set up Docker Compose for local development, integrate Strapi CMS v5, and establish deployment pipeline.

**Sub-phases Progress:**
- ✅ 0.1: Monorepo verification (complete)
- ✅ 0.2.1: Docker Compose setup (Strapi v5.31.0 + PostgreSQL 16 + pgVector configured)
- ✅ 0.2.2: Strapi configuration (admin panel, Cloudinary)
- ✅ 0.2.3: Content types creation (10 collection types + 10 single types + 9 components)
- ✅ 0.2.4: Frontend API integration (Strapi SDK) - **COMPLETED** (2025-12-19)
- ✅ 0.3: Deployment (Vercel + Railway) - **COMPLETED** (2025-12-29)
- ✅ 0.4: Content migration via Transfer Token workflow - **COMPLETED** (2026-01-14)
- ✅ 0.5: Portfolio pages implementation - **COMPLETED** (2026-01-17)

**Phase 0.5 Deliverables:**
- 15 pages implemented: Homepage, Projects (list + detail), Experiences (list + detail), About, Journey, Skills, Blog (list + detail), Legal pages (privacy, terms, contact via catch-all), Contact, 404, 500, Maintenance
- Footer component with CMS-driven social links (platform-based rendering)
- RSS feed for blog posts (filters external posts)
- Sitemap integration with auto-generation
- 500 error page with real-time status checks (SSR)
- Rich text rendering fixes (MarkdownRenderer + BlocksRenderer)
- Unified seed script for legal pages

**Status:** ✅ 100% Complete - All infrastructure and pages implemented (2026-01-17)

**Note:** Documentation updated (2025-12-02) to reflect actual implementation - simplified blog architecture (Post collection instead of Blog Series)

---

### Phase 2: Component Architecture (6-8 days) - ✅ **COMPLETED (2026-02-02)**
**[Full Documentation →](/docs/phase-2-component-architecture.md)**

Further component optimization and standardization.

**Completed Tasks:** (100% complete)
- ✅ Template system (Editorial, Legal, Landing)
- ✅ Utility refactoring (15 specialized modules)
- ✅ Common components (6 new reusable components)
- ✅ Site config centralization
- ✅ Working Style component to About schema
- ✅ `content.working-style-item.json` component created
- ✅ Working Style Item schema validator implemented
- ✅ About transformer updated with `workingStyle`
- ✅ `WorkingStyleSection` component enhanced with CMS integration
- ✅ `getWorkingStyleColor` utility function added
- ✅ `about.astro` page updated to pass `workingStyle` prop
- ✅ **Navigation Plugin Integration (2026-01-27)**
  - CMS-driven navigation (header + footer) via `strapi-plugin-navigation`
  - WRAPPER architecture for footer sections (2 containers vs 3)
  - Custom fields: `label`, `icon`, `buttonStyle`, `description`, `cssClass`
  - Dynamic CTA buttons with 3 styles (primary, secondary, outline)
  - Label override system (admin titles separate from display text)
  - Flattened `additionalFields` for component ergonomics
  - API calls reduced from 3 → 2 (33% performance improvement)
- ✅ **Footer CMS Integration (2026-01-27)**
  - Footer content moved to CMS with zero API overhead
  - Clean separation: siteConfig (theme) vs websiteConfig (content)
  - Added dynamic tech stack component (`ui.tech-stack-item`)

**In Progress:**
- 🚧 Scene.tsx optimization
- 🚧 Section components standardization
- 🚧 Create reusable patterns

**Key Accomplishments:**
- Footer content moved to CMS with zero API overhead
- Clean separation: siteConfig (theme) vs websiteConfig (content)

**Key Deliverables:**
- **Utilities:** `about.ts`, `blog.ts`, `contact-form.ts`, `projects.ts`, `base.ts`, `strapi.ts`, `availability.ts`, `text.ts`, `url.ts`, `icons.ts`, `tagColors.ts`, `toc.ts`, `debounce.ts`, `content.ts`, `experiences.ts`
- **Common Components:** `StatusBadge`, `ThemeToggle`, `Breadcrumbs`, `GradientAccent`, `WatermarkBackground`, `DetailNavigation`
- **Config:** Centralized site configuration with types and helpers

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

### Phase 4: Developer Experience (16.5-22.5 days)
**[Full Documentation →](/docs/phase-4-developer-experience.md)**

TypeScript improvements and professional design workflow.

**Key Tasks:**
- TypeScript strict mode & centralized types
- **Figma Design System** (5-7 days)
- **Storybook Setup** (4-5 days)
- **Chromatic Visual Testing** (2-3 days)
- Configuration management
- **Persona Selection System** (3 hours) - UX enhancement with context-based navigation

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

### Engineering Intelligence

#### AZUCENA_LYTICS // Core_Terminal (V1 Production Hardened)
**[Full Documentation →](/docs/features/azucena-lytics-plan.md)**

A high-fidelity telemetry dashboard and engineering intelligence terminal built with Next.js 15, ClickHouse, and D3.js. **100% Roadmap Complete.**

**Key Features:**
- 📊 **Predictive Sentinel:** Real-time health watchdog with automated threshold alerts and anomaly detection.
- 🕵️ **Identity Stitching:** Session Journey Explorer for full-funnel behavioral mapping.
- 🗺️ **Geospatial Intelligence:** Zoomable D3 world map for regional engagement density.
- 🧠 **Internal RAG:** Automated knowledge indexing of monorepo MD files into pgVector.
- 🗄️ **OLAP Storage:** ClickHouse integration with tiered TTL retention and native backups.
- 🔒 **RBAC Security:** Granular access controls for restricted ingestion and viewer identities.

### Music & Compositions
- **[Music Player](/docs/features/music-player.md)** (4-6 days) - Howler.js, waveform visualization
- **[Strudel.cc Live Coding](/docs/features/strudel-integration.md)** (9-13 days) - Interactive TidalCycles patterns

### AI & Intelligence

#### AI-Powered Forms (16-20 days comprehensive, 7-9 days basic)
**[Full Documentation →](/docs/features/ai-forms.md)**

Transform static forms into intelligent, conversational experiences using LangChain + LangGraph + Claude.

**Form Types:**
- **Contact** - General inquiries
- **Feedback** - Portfolio feedback collection
- **Testimonial** - Client reviews with approval workflow
- **Bug Report** - Issue tracking with GitHub integration
- **Feature Request** - Ideas with voting system
- **Collaboration** - Speaking/partnership opportunities
- **Referral** - Client referrals
- **Music Feedback** - Track-specific reviews

**Key Features:**
- ✨ **Easter Egg Step** - Hidden step required before submission (fun engagement)
- 🤖 **AI Intent Classification** - Routes inquiries automatically
- 🔍 **Smart Field Extraction** - Pulls structured data from casual messages
- 💬 **Follow-up Questions** - Context-aware clarifications
- 📊 **Sentiment Analysis** - Analyzes emotional tone
- 🧠 **AI Summarization** - Generates concise summaries
- 🔒 **reCAPTCHA v3** - Spam protection
- ✅ **Auto-Response** - Optional personalized replies

**Vector Database & Semantic Search:**
- **pgVector** - PostgreSQL extension for vector similarity search
- **Embeddings Storage** - Store embeddings of `rawMessage`, `rawFeedback`, `testimonialText`, `rawDescription`, and `aiSummary`
- **Metadata Indexing** - `formType`, `sentiment`, `tags`, `submissionDate`, `langSmithId`
- **Retrieval Use Cases:**
  - Semantic search for similar feedback/bug reports
  - RAG (Retrieval-Augmented Generation) for AI responses
  - Analytics clustering and pattern detection
  - Duplicate detection for bug reports/feature requests

**Embeddings Models:**
- OpenAI (text-embedding-3-small: 1536 dims, fast, cheap)
- Cohere (embed-english-v3.0: 1024 dims, multilingual)
- Voyage AI (voyage-2: 1024 dims, Claude-optimized)
- Gemini (textembedding-gecko: 768 dims, free tier)
- Local Models (all-MiniLM-L6-v2: 384 dims, offline)

**Retrieval & Ranking:**
- LangChain Retrievers for semantic search
- Cohere Rerank API (rerank-english-v3.0)
- Cross-encoder models (local)
- ContextualCompressionRetriever for result refinement

**AI Pipeline Flow:**
```
Frontend (Astro/React)
   ↓
reCAPTCHA v3 + Rate Limit Check
   ↓
LangGraph State Machine
   ├─ IntentClassifierAgent → Classify form type
   ├─ EasterEggDetectorAgent → Detect hidden keywords
   ├─ FieldExtractionAgent → Extract structured data
   ├─ ValidationAgent → Check required fields
   ├─ SummarizationAgent → Generate AI summary + sentiment
   └─ AutoResponseAgent → Optional personalized reply
   ↓
LangSmith (tracing/logging)
   ↓
Strapi v5 (structured data storage)
   ↓
[Async Job] Embedding Generation
   ├─ Generate embeddings for message/summary/context
   ├─ Choose embedding provider (OpenAI/Cohere/Gemini/local)
   └─ Store in pgVector with metadata
   ↓
Retrieval & Ranking (Query Time)
   ├─ Generate query embedding
   ├─ pgVector similarity search (cosine distance)
   ├─ Apply metadata filters
   ├─ Fetch top K candidates (k=20-50)
   ├─ Rerank with Cohere/cross-encoders
   └─ Return top N results (n=5-10)
```

#### Vercel AI SDK Integration

This section details the integration of the **Vercel AI SDK** to provide a robust, streaming user interface for the AI Portfolio Assistant, Case Study Explorer, Code Insight Layer, and Resume Alignment Tool. It acts as the high-performance bridge between the React frontend and the backend LangGraph orchestration, ensuring low-latency responses and a modern chat experience.

**Benefits:**
- **Perceived Latency:** Streaming text reduces "Time to First Token" (TTFT), making the AI feel instant even during complex LangGraph reasoning steps.
- **Edge Friendliness:** Designed for Vercel's edge and serverless functions, preventing timeout issues common with long-running LLM chains.
- **Client SDK Primitives:** The `ai/react` library provides ready-to-use hooks (`useChat`) that handle message state, optimistic updates, and error handling automatically.
- **Simpler Bridging:** Built-in adapters easily bridge LangChain streams to the client without manual WebSocket management.

**Integration Points:**
- **AI Portfolio Assistant (Global Chat):** Uses `useChat` with global scope to answer general questions.
- **AI Case Study Explorer:** Uses `useChat` with `scope: 'case_study'`, passing the current project ID in the body to restrict vector retrieval.
- **AI Code Insight Layer:** Uses `useChat` with `scope: 'code_insight'`, accepting repository links or file snippets as context.
- **AI Resume Alignment Tool:** Uses `useChat` with `scope: 'resume_alignment'`, allowing users to paste Job Descriptions (JDs) to receive tailored content strategy suggestions.

**Security & Privacy:**
- **API Keys:** Store `ANTHROPIC_API_KEY` only in server-side environment variables (`.env.local`).
- **PII Redaction:** Use a PII scrubbing layer (middleware or LangChain runnable) before sending user input to vector storage or LLMs.
- **Rate Limiting:** Implement rate limiting (e.g., Upstash Redis) on the `/api/chat` route (e.g., 10 requests/minute/IP).

**Embeddings & Retrieval Reminder:**
This integration relies on the existing **Strapi → Chunking → Embed → pgVector** pipeline. The Vercel AI SDK layer is purely for *transport and UI*. Ensure `pgVector` queries strictly respect the `scope` passed from the frontend to prevent "hallucinating" features from one project into another.

**Timeline:**
- Phase A (Basic Forms): 3-4 days
- Phase B (AI Integration): 12-16 days
  - LangGraph state machine (3 days)
  - Multi-intent classifier (1-2 days)
  - Field extractors per form (3-4 days)
  - Conversational UI (2 days)
  - API routes & integrations (2 days)
  - Admin dashboard (2-3 days)
- **Vercel AI SDK Integration:** 3-4 days

**Updated Total (Phase 3.1):** 10-13 Days (core) / 19-24 Days (comprehensive)

**Success Metrics (Vercel Specific):**
- **Time-to-First-Token (TTFT):** < 800ms on 4G networks.
- **Streaming Reliability:** < 1% connection drop rate.
- **Chat Engagement:** Average session duration > 2 minutes.

**Acceptance Criteria:**
- [ ] `PortfolioAssistant` component renders and accepts user input.
- [ ] Messages stream character-by-character in the UI.
- [ ] `scope` parameter correctly alters the backend retrieval strategy (verified via logs).
- [ ] Attachments (JDs, Code) are accepted and processed.
- [ ] Fallback to non-streaming behavior handles errors gracefully.
- [ ] No API keys are exposed in the client-side bundle.

---

#### Machine Learning Features (10-40 days)
**[Full Documentation →](/docs/features/machine-learning.md)**

- Content analysis and recommendation
- Image enhancement and optimization
- RAG chatbot with semantic search
- PyTorch/TensorFlow integration

---

#### Strapi Plugin Icons Field v2.0 (35-48 days)
**[Full Documentation →](/docs/features/strapi-plugin-icons-field/README.md)**

Transform the `strapi-plugin-icons-field` from a basic icon selector into a production-grade, enterprise-ready Strapi v5 plugin.

**Current State (v1.1.5):**
- Basic icon selection from `/public/icons` folder
- Simple SVG rendering in Strapi admin
- Subfolder organization support
- Manual configuration via `config/plugins.js`

**Target State (v2.0.0):**
- Production-grade icon management system
- Advanced search and filtering
- Comprehensive testing suite
- Enterprise features (versioning, analytics, CDN)
- Best-in-class developer experience

**Implementation Phases:**

**Phase A: Critical Fixes & Performance (5-7 days)**
- Icon caching system with manifest generation (<500ms for 1000 icons)
- SVG sanitization & security (DOMPurify, XSS protection)
- TypeScript strict mode with Zod schemas
- Performance testing & benchmarking

**Phase B: Advanced Features (8-10 days)**
- Fuzzy search with Fuse.js, category filtering, favorites
- Batch operations (bulk upload via ZIP, auto-categorization)
- Icon analytics & usage tracking across content types
- Accessibility enhancements (WCAG AA, keyboard navigation, ARIA labels)
- Internationalization (en, fr, es, de, ja)

**Phase C: Developer Experience (6-8 days)**
- Comprehensive testing suite (85%+ coverage)
  - Unit tests (Vitest)
  - Integration tests
  - E2E tests (Playwright)
- Storybook component library
- Developer documentation & API reference

**Phase D: Enterprise Features (5-7 days)**
- Icon versioning & history tracking
- CDN integration (Cloudinary) with automatic optimization
- Advanced permissions & RBAC
- Icon presets & templates

**Phase E: Documentation & Distribution (3-5 days)**
- Complete documentation (README, API reference, migration guides)
- npm package publishing (v2.0.0)
- Community & marketing (Strapi marketplace, blog post)

**Key Improvements:**
- ✅ **Performance:** 95%+ faster icon loading with caching
- ✅ **Security:** XSS protection, SVG sanitization, file size limits
- ✅ **Type Safety:** Strict TypeScript, Zod validation, runtime checks
- ✅ **Testing:** 85%+ unit coverage, E2E tests for critical flows
- ✅ **Accessibility:** WCAG AA compliance, full keyboard navigation
- ✅ **DX:** Storybook, comprehensive docs, migration scripts

**Success Metrics:**
- GitHub Stars: 500+ in first 3 months
- npm Downloads: 10,000+ in first year
- Code Coverage: 85%+ (unit), 70%+ (integration)
- Lighthouse Accessibility: 95+
- Zero Critical Security Vulnerabilities

**Migration Path:**
- Backward compatibility layer for v1 icon format
- Automated migration script provided
- Zero downtime migration strategy
- Comprehensive migration guide

**Strategic Value:**
- Showcase advanced Strapi plugin development expertise
- Create reusable architecture for future plugins
- Demonstrate open source contribution commitment
- Enhance portfolio differentiation with custom tooling

---

### Infrastructure
- **[Logging & Monitoring](/docs/features/logging-monitoring.md)** (3-4 days) - Sentry, Vercel Analytics, Pino, Redis
- **[Plausible Analytics](/docs/features/plausible-analytics.md)** (2-3 days) - Self-hosted privacy-friendly traffic analytics

### Monetization
- **[Payments](/docs/features/payments.md)** (3-4 days) - Stripe + Ko-fi integration

---

## ⏱️ Execution Timeline

### Recommended Order

```
Phase 1 (Animations) → 9-11 days ✅ COMPLETED
    ↓
Phase 1.5 (Code Quality & Security) → 0.5-1 day ✅ COMPLETED
    ↓
Phase 0 (Infrastructure) → 16-20 days ✅ COMPLETED
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

**Total Core Phases:** 56.5-76 days (~2.5-3.5 months)

### Weekly Breakdown

| Week | Phase | Focus |
|------|-------|-------|
| 1-2 | Phase 1 | Animations refactoring ✅ |
| 2 | Phase 1.5 | Code quality & security fixes ✅ |
| 3-5 | Phase 0 | Infrastructure & CMS ✅ |
| 6-7 | Phase 2-3 | Components & performance 🔥 CURRENT |
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

### AI Forms & Intelligence
- **Conversion Rate:** AI chat vs traditional form (+30% target)
- **Field Completion:** Fully completed forms (>85% target)
- **Intent Classification Accuracy:** AI classifier performance (>95% target)
- **User Satisfaction:** Average feedback rating (>8/10 target)
- **Easter Egg Discovery Rate:** Percentage of users finding hidden steps
- **Semantic Search Relevance:** Vector similarity match quality
- **Response Time:** AI agent response latency (<2s target)

### Form-Specific Metrics
- **Testimonials:** Approval rate, average rating, publication rate
- **Feedback:** Response rate, implementation rate of suggestions
- **Bug Reports:** Time to resolution, severity distribution, GitHub sync rate
- **Feature Requests:** Voting participation, implementation rate, deduplication accuracy
- **Music Feedback:** Average track ratings, improvement trends over releases

---

## 🚀 Current Status

### Completed ✅
- Icons switched to @mynaui/icons-react v0.3.9
- Scroll indicators with animations
- Toolbar panels with backdrop
- Resume button improvements
- Comprehensive ROADMAP & documentation
- **Phase 1: Animations Refactoring** ✅ (2025-01-13)
- **Phase 1.5: Code Quality & Security Fixes** ✅ (2025-12-03)
- **Phase 0: Infrastructure & Architecture** ✅ (2026-01-17)
  - 100% Complete (Sub-phases 0.1 → 0.5)
  - 15 pages implemented, CMS production-ready, content migrated
  - 24 modular API clients, Footer, RSS, Sitemap, 500 error page

### In Progress 🚧
- **Phase 2: Component Architecture** (6-8 days) 🔥 CURRENT PRIORITY
  - Further component optimization and standardization
  - Scene.tsx refactoring
  - Reusable pattern extraction

### Up Next ⏳
- **Phase 3:** Performance Optimization (4-6 days)

---

## 📚 Documentation

All detailed implementation guides, code examples, and specifications are in the **[`/docs`](/docs/)** folder:

### Phase Documentation
- [Phase 0: Infrastructure](/docs/phase-0-infrastructure.md)
  - [Strapi Content Types Guide (v2.0 - Enhanced)](/docs/strapi-content-types-guide.md) - 14 production-ready content types with pgVector, semantic search, AI forms support
- [Phase 1: Animations Refactoring](/docs/phase-1-animations-refactoring.md) ⚡ ✅
- [Phase 1.5: Code Quality & Security Fixes](/docs/phase-1.5-code-quality-security.md) 🔥
- [Phase 2: Component Architecture](/docs/phase-2-component-architecture.md)
- [Phase 3: Performance](/docs/phase-3-performance.md)
- [Phase 4: Developer Experience](/docs/phase-4-developer-experience.md)
- [Phase 5: Testing](/docs/phase-5-testing.md)

### Feature Documentation
- [Music Player & Compositions](/docs/features/music-player.md)
- [Strudel.cc Live Coding](/docs/features/strudel-integration.md)
- [AI-Powered Forms](/docs/features/ai-forms.md)
- [Machine Learning Features](/docs/features/machine-learning.md)
- [Strapi Plugin Icons Field v2.0](/docs/features/strapi-plugin-icons-field/README.md)
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

### Phase 1.5 Before Infrastructure (Code Quality & Security)
- ✅ Fix critical security vulnerabilities (happy-dom CVEs)
- ✅ Eliminate memory leaks before complexity increases
- ✅ Quick wins (0.5-1 day) with high impact
- ✅ Clean, secure codebase before Docker/CMS integration
- ✅ Prevents cascading issues in infrastructure setup

### Infrastructure After Quality Fixes
- ✅ CMS integration with clean, secure components
- ✅ Easier content migration without bugs
- ✅ Better monorepo package extraction
- ✅ Confidence in codebase stability

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
- **Docker Compose:** Local development uses Docker Compose for consistent environment (one-command setup: `docker compose up`)
- **Ko-fi Already Set Up:** Quick win for monetization (15-30 min to integrate)
- **ML Features Optional:** Only implement if showcasing AI/ML skills
- **Vercel Auto-Deploys:** No CircleCI needed for frontend (Vercel handles it)
- **AI Forms with Vector Search:** Comprehensive implementation includes pgVector for semantic search, embeddings from multiple providers, and RAG capabilities
- **Strapi v5:** Upgraded from v4 to v5 for better PostgreSQL integration and pgVector support
- **PostgreSQL 16 + pgVector:** Docker image provides PostgreSQL 16 with pgVector extension pre-installed
- **LangGraph State Machine:** Multi-agent workflow for intelligent form processing with LangSmith observability
- **Plugin Enhancement Strategy:** strapi-plugin-icons-field v2.0 planned as future enhancement (35-48 days) to showcase advanced Strapi plugin development and create reusable architecture for portfolio differentiation
- **Railway Handles Docker Builds:** CircleCI is stashed for future implementation - will only handle prechecks (linting, tests, security audits) when test suite matures (Phase 5+). Railway handles Docker image building and deployment to avoid duplication. See [Deployment Strategy](./docs/deployment-strategy.md) for full rationale.

---

**Last Updated:** 2026-02-04

**Current Priority:** Phase 3 - Performance Optimization 🔥

**Phase 2 Completed:** ✅ Component Architecture - 100% Complete (2026-02-02)

**Current Focus:** Begin Phase 3 - Performance Optimization (code splitting, lazy loading, bundle optimization)

**Next Milestone:** Complete Phase 3 (Performance) → Begin Phase 4 (Developer Experience) → **Ecosystem Expansion (The 6 Nodes)**

---

## 🏛️ Ecosystem Expansion: The Utilitarian Nodes
**[Ecosystem Overview & Documentation →](/docs/ecosystem/README.md)**

A suite of high-utility applications and microsites designed to extend the "aazucena" digital identity beyond the main portfolio. **Note:** Implementation is contingent upon 100% polish of the core stack.

- 💼 **AAZUCENA_SONA (`cv.aazucena.com`):** High-speed recruitment re-ranking and dossier generation.
- 🗃️ **AAZUCENA_LEDGE (`wiki.aazucena.com`):** Public engineering wiki and technical blueprint repository.
- 📡 **AAZUCENA_DAR (`radar.aazucena.com`):** GitHub-integrated roadmap, issue tracker, and voting hub.
- 🎹 **AAZUCENA_DIO (`studio.aazucena.com`):** Interactive live-coding studio and data-modulated radio.
- 🎮 **AAZUCENA_SIM (`play.aazucena.com`):** Playable technical mission with agentic NPC companions.
- 🔮 **AAZUCENA_CLE (`cli.aazucena.com`):** CLI-first RAG interaction terminal for the digital twin.

---



**Recent Completions (Updated 2026-02-04):**
- **IntegrityBadge Component** ✅ (2026-02-04) - Real-time system health indicator in Footer, connects to `/api/health/public`
- **Edge Runtime Ingestion** ✅ (2026-02-04) - Vercel Edge with native geo-headers (x-vercel-ip-country/city/lat/lon)
- **Phase 2 - Component Architecture** ✅ (2026-02-02) - 100% Complete - Scene flattening (depth 3→2), Homepage/Journey restructuring, all sections <120 lines, ~70 files reorganized, ~24 legacy files deleted
- **Footer CMS Integration** ✅ (2026-01-27) - website-config extension with tech stack component
- **Navigation Plugin Integration** ✅ (2026-01-27) - CMS-driven header/footer navigation
- **Phase 0.5 - Portfolio Pages** ✅ (2026-01-17) - 15 pages implemented, Footer, RSS, Sitemap, 500 error page
- **Phase 0 - Infrastructure & Architecture** ✅ (2026-01-17) - 100% Complete - All sub-phases finished
- Phase 0.4 - Content Migration ✅ (2026-01-14) - Transfer Token workflow successful, all content migrated to Railway production (URL fix: use /admin suffix)
- Documentation Synchronization ✅ (2026-01-13) - All docs updated to reflect Phase 0.3 completion and 0.4 progress
- CMS Seed Scripts ✅ (2026-01-11+) - Bug fixes and regeneration of API documentation
- Project Schema Enhancement ✅ (2026-01-07) - Added unlisted display option and expanded projectStatus enum (7 statuses)
- Phase 0.3 - Deployment Strategy ✅ (2025-12-29) - Railway and Vercel deployed, all 19 APIs accessible from production
- Phase 0.2.4 - Frontend API Integration ✅ (2025-12-19) - All 8 configuration APIs implemented and tested, build passing with CMS data
- Phase 1.5 - Code Quality & Security Fixes ✅ (2025-12-03) - Fixed happy-dom CVEs, memory leaks, type safety, hook dependencies, GSAP cleanup (7.5/10 → 8.5-9.0/10)
- Documentation Reconciliation ✅ (2025-12-02) - Fixed Strapi docs, reconciled ROADMAP/CLAUDE phase states
- Phase 0.2.1-0.2.3 Infrastructure ✅ (2025-12-02) - Strapi v5.31.0, Docker Compose, PostgreSQL 16 + pgVector, 20 content types, 9 components
- Phase 1 - Animations Refactoring ✅ (2025-01-13) - 324 → 174 lines, 46% reduction
- Code Review Completed ✅ (2025-11-28) - 7.5/10 quality assessment, 5 critical issues identified
- Phase 1.5 Documentation Created ✅ (2025-11-28) - Comprehensive fix instructions
- Astro v5.16.0 Upgrade ✅ (2025-11-25) - From v5.15
- Strapi Audio Metadata & CTA Button Components ✅ (2025-11-25)
- strapi-plugin-icons-field Integration ✅ (2025-11-25) - v1.1.5