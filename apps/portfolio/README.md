# Aldrin Azucena Portfolio

An Astro-based portfolio application with React integration, featuring advanced animations (GSAP, Three.js, PixiJS), AI-powered forms, and a sophisticated content management system.

**Framework:** Astro 5.15+ with React 19.2
**Package Manager:** pnpm v10.21.0 (required)
**Node Version:** >=18

---

## 🎯 Quick Start

### Development
```bash
# Install dependencies (from root)
pnpm install

# Start development server
pnpm dev

# Or from portfolio directory
cd apps/portfolio
pnpm dev
```

The app will be available at `http://localhost:4321`

### Build & Preview
```bash
# Build for production
pnpm build

# Preview production build
pnpm preview
```

### Testing
```bash
# Run E2E tests with Playwright
pnpm dlx playwright test

# Run in headed mode
pnpm dlx playwright test --headed

# View test report
pnpm dlx playwright show-report
```

---

## 📚 Documentation

Complete documentation is available in the [`/docs`](./docs/) folder:

### Essential Reading
- **[ROADMAP.md](./ROADMAP.md)** - Complete development roadmap 🔥
- **[Documentation Hub](./docs/README.md)** - All implementation guides
- **[Phase 1 (Current Priority)](./docs/phase-1-animations-refactoring.md)** - Animations refactoring

### Phase Documentation
- [Phase 0: Infrastructure](./docs/phase-0-infrastructure.md) - Monorepo, Strapi v5, deployment
- [Phase 1: Animations Refactoring](./docs/phase-1-animations-refactoring.md) ⚡ **START HERE**
- [Phase 2: Component Architecture](./docs/phase-2-component-architecture.md)
- [Phase 3: Performance](./docs/phase-3-performance.md)
- [Phase 4: Developer Experience](./docs/phase-4-developer-experience.md)
- [Phase 5: Testing](./docs/phase-5-testing.md)

### Feature Documentation
- [Music Player & Compositions](./docs/features/music-player.md) - Howler.js + waveform
- [Strudel.cc Live Coding](./docs/features/strudel-integration.md) - TidalCycles integration
- [AI-Powered Forms](./docs/features/ai-forms.md) - LangChain + Claude with vector search
- [Machine Learning Features](./docs/features/machine-learning.md) - PyTorch/TensorFlow
- [Logging & Monitoring](./docs/features/logging-monitoring.md) - Sentry, Vercel Analytics
- [Payment Integration](./docs/features/payments.md) - Stripe + Ko-fi

---

## 🛠️ Tech Stack

### Core Framework
- **Astro 5.15+** - Meta-framework with React integration
- **React 19.2** - Interactive components
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS 4** - Styling with @tailwindcss/vite plugin

### Animation System
- **GSAP** - Advanced animations and scroll triggers
- **Three.js** - 3D graphics and scenes
- **PixiJS** - 2D particle systems
- **Framer Motion** - Declarative React animations

The portfolio features a sophisticated animation architecture located in `src/components/animations/` with:
- **Atmospheric Layers** - Visual metaphor for scrolling (troposphere, stratosphere, mesosphere, exosphere)
- **8 Portfolio Sections** - Hero, About, Projects, Music, Experience, Skills, Contact, Social
- **Performance Tiers** - Adaptive animations based on device capabilities
- **State Management** - Custom hooks and contexts (Phase 1 refactoring priority)

### UI & Forms
- **ShadCN UI** - Headless UI component library
- **@mynaui/icons-react** - Icon system
- **react-hook-form** + **Zod** - Form validation
- **TanStack Query** - Server state management
- **TanStack Table** - Data tables

### Audio & Music
- **Howler.js** - Audio playback
- **wavesurfer.js** - Waveform visualization
- **Strudel.cc** - Live coding patterns (planned)

### AI & Intelligence
- **LangChain** + **LangGraph** - LLM orchestration
- **LangSmith** - Observability and tracing
- **Anthropic Claude 3.5 Sonnet** - Primary LLM
- **pgVector** - Vector database for semantic search
- **Embeddings Models:**
  - OpenAI (text-embedding-3-small, text-embedding-3-large)
  - Cohere (embed-english-v3.0, embed-multilingual-v3.0)
  - Voyage AI (voyage-2, Claude-optimized)
  - Gemini (textembedding-gecko)
  - Local Models (all-MiniLM-L6-v2)
- **Retrieval & Ranking:** LangChain Retrievers, Cohere Rerank, Cross-encoders

### Backend & CMS (Planned)
- **Strapi v5** - Headless CMS
- **PostgreSQL 16+** - Database with pgVector extension
- **Cloudinary** - Media storage
- **Railway** - Backend hosting

### Monitoring & Analytics
- **Sentry** - Error tracking
- **Vercel Analytics** - Web analytics
- **Vercel Speed Insights** - Performance monitoring
- **Pino** - Logging (backend)
- **Redis** - Caching

### Testing & Development
- **Playwright** - E2E testing (configured)
- **Vitest** - Unit testing (installed, not configured)
- **Storybook** - Component development (planned)
- **Chromatic** - Visual regression testing (planned)
- **Figma** - Design system (planned)

### Payments & Monetization
- **Stripe** - Payment processing
- **Ko-fi** - Tips and donations

---

## 📁 Project Structure

```
apps/portfolio/
├── src/
│   ├── components/
│   │   ├── animations/              # Animation system (324 lines → refactoring to ~150)
│   │   │   ├── Section.tsx          # Main orchestrator
│   │   │   ├── Scene.tsx            # Three.js scene
│   │   │   ├── Particles.tsx        # PixiJS particles
│   │   │   ├── config/              # Configuration
│   │   │   ├── hooks/               # 9 custom React hooks
│   │   │   ├── sections/            # 8 section components
│   │   │   ├── ui/                  # UI components
│   │   │   └── utilities/           # Helper functions
│   │   ├── preloader/               # Loading system
│   │   └── ...
│   ├── pages/
│   │   └── index.astro              # Main entry point
│   ├── layouts/
│   └── styles/
├── docs/                            # Documentation
│   ├── README.md                    # Documentation hub
│   ├── phase-*.md                   # Phase documentation
│   └── features/                    # Feature documentation
├── tests/                           # Playwright E2E tests
├── public/                          # Static assets
├── ROADMAP.md                       # Complete development roadmap
├── astro.config.mjs                 # Astro configuration
├── tailwind.config.mjs              # Tailwind configuration
├── playwright.config.ts             # Playwright configuration
└── package.json
```

---

## 🎨 Animation Architecture

The portfolio uses a complex animation system with **Phase 1 (Current Priority)** focusing on refactoring:

### Current Structure
- **Section.tsx** - 324 lines, main orchestrator (needs reduction to ~150 lines)
- **9 Custom Hooks** - Device capabilities, section transitions, atmospheric layers, modals, etc.
- **8 Sections** - Hero, About, Projects, Music, Experience, Skills, Contact, Social
- **Atmospheric Layers** - Troposphere, Stratosphere, Mesosphere, Exosphere (visual metaphor)
- **Performance Tiers** - High, Medium, Low (adaptive based on device)

### Phase 1 Refactoring Goals
1. Create **PortfolioContext** and **AnimationContext** for centralized state
2. Extract components: **AtmosphericOverlays**, **DynamicBackground**, **AnimationCanvas**, **SectionContent**, **UIOverlays**
3. Eliminate prop drilling
4. File renaming for clarity (Particles.tsx → PixiJSParticles.tsx, Scene.tsx → ThreeJSScene.tsx)

See **[Phase 1 Documentation](./docs/phase-1-animations-refactoring.md)** for details.

---

## 🤖 AI-Powered Forms

Comprehensive form system with LangChain + LangGraph + Claude (16-20 days implementation):

### Form Types
- **Contact** - General inquiries
- **Feedback** - Portfolio feedback
- **Testimonial** - Client reviews with approval workflow
- **Bug Report** - Issue tracking with GitHub integration
- **Feature Request** - Ideas with voting system
- **Collaboration** - Speaking/partnership opportunities
- **Referral** - Client referrals
- **Music Feedback** - Track-specific reviews

### Key Features
- ✨ **Easter Egg Step** - Hidden engagement step before submission
- 🤖 **AI Intent Classification** - Automatic routing
- 🔍 **Smart Field Extraction** - Structured data from casual messages
- 💬 **Follow-up Questions** - Context-aware clarifications
- 📊 **Sentiment Analysis** - Emotional tone detection
- 🧠 **AI Summarization** - Concise summaries
- 🔒 **reCAPTCHA v3** - Spam protection

### Vector Database & Semantic Search
- **pgVector** - PostgreSQL extension for similarity search
- **Embeddings Storage** - Store embeddings of messages, feedback, summaries
- **Metadata Indexing** - formType, sentiment, tags, timestamps
- **Retrieval Use Cases:**
  - Semantic search for similar submissions
  - RAG for AI responses
  - Analytics clustering
  - Duplicate detection

### AI Pipeline
```
Frontend (Astro/React)
   ↓
reCAPTCHA v3 + Rate Limiting
   ↓
LangGraph State Machine
   ├─ IntentClassifierAgent
   ├─ EasterEggDetectorAgent
   ├─ FieldExtractionAgent
   ├─ ValidationAgent
   ├─ SummarizationAgent
   └─ AutoResponseAgent
   ↓
LangSmith (tracing/logging)
   ↓
Strapi v5 (structured data)
   ↓
[Async] Embedding Generation
   ↓
pgVector (vector storage)
   ↓
Retrieval & Ranking (query time)
```

See **[AI Forms Documentation](./docs/features/ai-forms.md)** for comprehensive details.

---

## ⏱️ Development Roadmap

### Execution Order (Recommended)

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

See **[ROADMAP.md](./ROADMAP.md)** for complete timeline and feature details.

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

## 📊 Success Metrics

### Performance Targets
- **Lighthouse Score:** 90+
- **First Contentful Paint:** <1.5s
- **Time to Interactive:** <3.5s
- **Bundle Size:** <350KB (gzipped)

### AI Forms Targets
- **Conversion Rate:** +30% vs traditional forms
- **Field Completion:** >85%
- **Intent Classification:** >95% accuracy
- **User Satisfaction:** >8/10 average rating
- **Response Time:** <2s AI agent latency

### Code Quality
- **Type Coverage:** 80%+
- **Component Size:** -30% average
- **ESLint Errors:** 0

---

## 🔧 Configuration Files

- `astro.config.mjs` - Astro configuration
- `tailwind.config.mjs` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration
- `playwright.config.ts` - Playwright test configuration
- `package.json` - Dependencies and scripts

---

## 📝 Important Notes

- **Phase 1 Priority:** Refactor animations folder before any infrastructure changes
- **pnpm Required:** Always use pnpm (never npm or yarn)
- **Animation Performance:** Heavy animations gated by device detection
- **AI Forms:** Comprehensive implementation with vector search and RAG capabilities
- **Strapi v5:** Upgraded from v4 for better PostgreSQL and pgVector support
- **Testing:** Playwright configured, Vitest installed but not configured yet

---

## 🤝 Contributing

This is a personal portfolio project. For suggestions:

1. Check the [ROADMAP](./ROADMAP.md)
2. Review [documentation](./docs/)
3. Follow established patterns

---

**Last Updated:** 2025-11-12

**Current Priority:** Phase 1 - Animations Refactoring 🔥

---

## 🔗 Learn More

- [Astro Documentation](https://docs.astro.build)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [GSAP](https://gsap.com)
- [Three.js](https://threejs.org)
- [LangChain](https://langchain.com)
- [Turborepo](https://turbo.build/repo)
