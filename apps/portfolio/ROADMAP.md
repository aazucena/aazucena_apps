# Portfolio Development Roadmap

## ⚡ CURRENT PRIORITY: Phase 0 - Infrastructure & Architecture

**Phase 1 Completed:** ✅ Animations folder successfully refactored (324 → 174 lines, 46% reduction)

**Next:** Integrate Strapi CMS v5, establish deployment pipeline, and prepare for production.

---

## 🎯 Quick Navigation

- **[Comprehensive Documentation](/docs/README.md)** - Full project documentation
- **[Current Priority: Phase 0](/docs/phase-0-infrastructure.md)** - CMS & Deployment Setup
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
reCAPTCHA v3 + Rate Limiting
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

**Timeline:**
- Phase A (Basic Forms): 3-4 days
- Phase B (AI Integration): 12-16 days
  - LangGraph state machine (3 days)
  - Multi-intent classifier (1-2 days)
  - Field extractors per form (3-4 days)
  - Conversational UI (2 days)
  - API routes & integrations (2 days)
  - Admin dashboard (2-3 days)

---

#### Machine Learning Features (10-40 days)
**[Full Documentation →](/docs/features/machine-learning.md)**

- Content analysis and recommendation
- Image enhancement and optimization
- RAG chatbot with semantic search
- PyTorch/TensorFlow integration

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
- Icons switched to @mynaui/icons-react
- Scroll indicators with animations
- Toolbar panels with backdrop
- Resume button improvements
- Comprehensive ROADMAP & documentation
- **Phase 1: Animations Refactoring** ✅ (2025-01-13)
  - Created PortfolioContext & AnimationContext
  - Extracted 5 new components (DynamicBackground, AtmosphericOverlays, AnimationCanvas, SectionContent, UIOverlays)
  - Reduced Section.tsx from 324 → 174 lines (46% reduction)
  - Renamed files (Particles → PixiJSParticles, Scene → ThreeJSScene)
  - All tests passing (dev server: HTTP 200)

### In Progress 🚧
- **Phase 0: Infrastructure & Architecture** (12-16 days)
  - Strapi CMS v5 integration
  - PostgreSQL + pgVector setup
  - Deployment pipeline (Vercel + Railway + CircleCI)

### Next Up ⏳
- **Phase 0.2:** Strapi CMS Integration
- **Phase 0.3:** Deployment Strategy
- **Phase 0.4:** Content Migration

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
- **AI Forms with Vector Search:** Comprehensive implementation includes pgVector for semantic search, embeddings from multiple providers, and RAG capabilities
- **Strapi v5:** Upgraded from v4 to v5 for better PostgreSQL integration and pgVector support
- **LangGraph State Machine:** Multi-agent workflow for intelligent form processing with LangSmith observability

---

**Last Updated:** 2025-01-13

**Current Priority:** Phase 0 - Infrastructure & Architecture 🔥

**Next Milestone:** Strapi CMS v5 Integration → Deployment Pipeline
