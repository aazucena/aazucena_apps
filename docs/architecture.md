# Architecture Reference

Detailed architecture documentation extracted from CLAUDE.md / GEMINI.md to keep those files lean.
For high-level roadmap context see `ROADMAP.md`. For per-phase specifics see `docs/phase-*.md`.

---

## Portfolio App — Animation System

Located in `apps/portfolio/src/components/animations/`. Refactored in Phase 1 (2025-01-13).

```
src/components/animations/
├── Section.tsx              # Main orchestrator (174 lines)
├── HomepageContent.tsx      # Section content renderer
├── ThreeJSScene.tsx         # Three.js scene
├── PixiJSParticles.tsx      # PixiJS particle system
├── contexts/                # PortfolioContext, AnimationContext, DataContext
├── canvas/                  # AnimationCanvas.tsx
├── overlays/                # UIOverlays.tsx
├── hooks/                   # 13 custom hooks (see below)
├── particles/               # Particle system internals
├── scene/                   # Three.js scene components (depth 2 after Phase 2)
├── sections/                # 8 portfolio sections + layouts/
└── ui/                      # Modals, toolbar, panels
```

### Custom Hooks (13 total)
- `useDeviceCapabilities` — detects performance tier (high/medium/low)
- `useSectionTransition` — section navigation state
- `useAtmosphericLayer` — current atmospheric layer (troposphere→exosphere)
- `useGSAPEntrance`, `useSectionTransitions` — GSAP animations
- `useFlipText` — text flipping animation
- `useModal` — modal state management
- `useSectionRefs` — refs for 8 sections
- `useSectionRegistry` — component mapping (Phase 0.2.4)
- `useHandlebars` — template rendering (Phase 0.2.4)
- `useDataContext` — CMS data access (Phase 0.2.4)

### State Flow
```
Section.tsx (orchestrator)
├─ DataContext → CMS data (homepage, portfolio, sections registry)
├─ PortfolioContext → scroll position, current section (0-7)
├─ AnimationContext → layers, effects, atmospheric state
└─ Renders: DynamicBackground → AtmosphericOverlays → AnimationCanvas → HomepageContent → UIOverlays
```

### Key Concepts
- **Atmospheric Layers:** troposphere→stratosphere→mesosphere→exosphere — transition based on scroll
- **Section Navigation:** 8 distinct sections (0-7), each with dedicated content components
- **Performance Tiers:** `capabilities.canUseHeavyAnimations` gates Three.js/PixiJS rendering
- **Client directives:** Use `client:only="react"` for lazy-loaded components (not `client:load`)
- **frameloop="demand"** on Three.js canvas — call `invalidate()` to request frames

---

## Portfolio App — CMS Data Architecture

**Data Flow:**
```
Strapi CMS (PostgreSQL + pgVector)
  → /lib/api/homepage-data.ts (parallel fetch, 15+ endpoints)
  → /lib/validators/* (Zod runtime validation)
  → /lib/transformers/* (clean data structures)
  → DataContext (React Context)
  → useDataContext() / useSectionData() / usePortfolioData() / useHomepageData() / useRegistry()
```

**API Clients** (`apps/portfolio/src/lib/api/` — 25 files):
- Core: `hero`, `about`, `projects`, `experiences`, `education`
- Content: `posts`, `testimonials`, `awards`, `skills`, `pages`
- Config: `animation`, `theme`, `maintenance`, `website-config`, `blog-config`, `portfolio`, `homepage`, `preloader`, `skill-categories`
- Showcase: `journey`, `skill-showcase`, `experience-showcase`, `project-showcase`, `contact-form`
- Navigation: `navigation` (Phase 2)

**Context Integration:**
```tsx
<DataProvider data={data} content={homepage} portfolio={portfolio}>
  <PortfolioProvider>
    <AnimationProvider>
      {/* All components access CMS data via hooks — no prop drilling */}
    </AnimationProvider>
  </PortfolioProvider>
</DataProvider>
```

---

## Portfolio App — Page Template System (Phase 2)

**Pattern:** Router handles SEO/breadcrumbs/JSON-LD, delegates rendering to templates.

```
src/
├── pages/[slug].astro         # Router (~73 lines)
└── templates/
    ├── index.ts               # Type definitions & TEMPLATE_MAP
    ├── EditorialTemplate.astro  # Default: prose content, optional TOC
    ├── LegalTemplate.astro    # Legal: revision badge, print styles
    └── LandingTemplate.astro  # Marketing: hero header, CTA button (stub)
```

**Adding a new template:**
1. Add to `PageTemplateEnum` in `src/lib/validators/enums.ts`
2. Create `[Name]Template.astro` in `src/templates/`
3. Define props interface in `src/templates/index.ts`
4. Update router conditional rendering

---

## Portfolio App — Journey Visualizations (Phase 0.5)

Located in `src/components/journey/visualizations/`:
- `ForceDirectedGraph` — interactive skill dependency graph
- `InteractiveTimeline` — scroll-synced career progression
- `SpiderChart` — multi-dimensional skill profiling
- `SankeyDiagram` — career flow visualization
- `StreamGraph` — skill evolution over time
- `Heatmap` — activity and contribution tracking

---

## AZUCENA_LYTICS Architecture

**Stack:** Next.js 15 (App Router) + React 19.2 + Tailwind 4 + D3.js + Redux Toolkit + TanStack Query v5 + Vercel AI SDK + ClickHouse

**Dashboards:**
- `/` — Node Overview: Summary KPIs, system integrity
- `/music` — Audio Intelligence: Live playback telemetry
- `/logs` — Telemetry Stream: Raw searchable event logs
- `/performance` — System Integrity: Real-time heartbeat monitoring
- `/ai` — AI Terminal: model-agnostic chat (Vercel AI Gateway)
- `/ai/costs` — AI Cost Center: spend and model efficiency
- `/ai/trajectories` — Trajectory Labs: RL agent decision playback

**Key files:**
- `src/app/api/ingest/route.ts` — Edge Runtime ingestion (<50ms, native Vercel geo headers)
- `src/app/api/stats/{summary,trends,logs}/route.ts` — dashboard data endpoints
- `src/hooks/useTelemetry.ts` — TanStack Query polling hooks
- `src/components/visualizations/{Heatmap,StreamGraph}.tsx` — D3.js charts
- `src/store/slices/dashboard.ts` — Redux slice

**Intelligence Infrastructure (Docker microservices):**
- **WebSocket Bridge** (`aazucena-websocket`) — broadcasts ClickHouse signals to dashboard UI
- **Intel Bridge** (FastAPI) — async telemetry gateway for Python agents
- **Intel Engine** — LangChain + LangGraph + pgVector processing core
- All services expose `/health` (machine) and `/status` (HTML) endpoints
- Inter-service: Docker hostnames on `aazucena-network`; host apps use LAN IP / `host.docker.internal`

---

## Package System (Phase 4 — `packages/`)

16 packages in `packages/`:

| Package | Content |
|---------|---------|
| `design-system` | 7 token files, 18 seasonal/branded themes, 35 platform integrations, Tailwind preset |
| `ui` | 284 component files (75+ composed components), CVA + 3 variants pattern |
| `forms` | 94 form templates + 48 Zod schemas across 13 categories |
| `hooks` | Categorized: animations/, data/, device/, dom/ |
| `utils` | Domain modules: about, animations, blog, contact, content, ... |
| `types` | api/, components/, data/ type definitions |
| `constants` | ai, animations, colors, commands, domain |
| `animations` | gsap/, pixi/, three/ utilities |
| `api` | controllers, modules, services, transformers |
| `layouts` | AutoGrid, DashboardLayout, Grid, MainContainer |
| `icons` | registry, custom icons, types |
| `analytics` | components, providers, schemas, services |
| `config` | eslint, playwright, postcss, prettier, sentry configs |
| `context` | AnimationContext, DataContext, FormContext, PortfolioContext |
| `stores` | Redux: interactions, journey slices + providers |
| `visualizations` | d3/, intelligence/, common/ visualization components |

**Storybook** (`apps/storybook/`): 373+ stories/docs
- 260 component stories, 94 form stories, 5 animation, 6 chart, 2 layout, 6 recipe
- Design token MDX (9 docs + 17 theme pages), Documentation MDX (9 pages)
- Chromatic token: `apps/storybook/.env` — first baseline run pending

**Forms pattern:**
```tsx
const form = useForm({ ... } as any)  // validatorAdapter not in FormOptions type
onSubmit: async ({ value }: { value: any }) => { ... }
```

**`@aazucena/forms` import path:** `import { LoginForm } from '@aazucena/forms/templates'`

**Storybook build:** `NODE_OPTIONS="--max-old-space-size=8192" pnpm --filter storybook build:storybook`
Use `pnpm tsc --noEmit` as the primary quality gate (Storybook OOM is a machine constraint).

---

## AI-Powered Forms (Planned Feature)

**Stack:** LangChain + LangGraph + Claude 3.5 Sonnet + pgVector + Zod
**Full docs:** `docs/features/ai-forms.md`

8 form types: Contact, Feedback, Testimonial, Bug Report, Feature Request, Collaboration, Referral, Music Feedback. Each has an Easter Egg hidden step required before submission.

**AI Pipeline:**
```
Frontend → reCAPTCHA v3 + Rate Limit
  → LangGraph State Machine
    ├─ IntentClassifierAgent
    ├─ EasterEggDetectorAgent
    ├─ FieldExtractionAgent
    ├─ ValidationAgent
    ├─ SummarizationAgent
    └─ AutoResponseAgent
  → LangSmith (tracing)
  → Strapi v5 (storage)
  → [Async] Embedding → pgVector (semantic search, RAG, deduplication)
```

---

## Strapi CMS — 16 Active Plugins

strapi-plugin-icons-field v1.1.5, @strapi/plugin-graphql, @strapi/plugin-documentation, @strapi/plugin-sentry, @strapi/plugin-seo, @_sh/strapi-plugin-ckeditor, strapi-plugin-multi-select, strapi-advanced-uuid, @strapi/plugin-color-picker, strapi-plugin-preview-button, strapi-plugin-navigation, strapi-plugin-duplicate-button, strapi-plugin-config-sync, strapi-plugin-publisher, @strapi-community/plugin-rest-cache, @strapi-community/plugin-redis
