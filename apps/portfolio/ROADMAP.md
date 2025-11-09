# Refactor Plan for Portfolio Animations

## ⚡ PRIORITY: Animations Folder Refactoring First

**Decision:** Refactor the existing `apps/portfolio/src/components/animations` folder **BEFORE** infrastructure changes. This ensures a clean, maintainable codebase before adding monorepo complexity.

**Current State:**
```
src/components/animations/
├── config/          # Configuration and types
├── hooks/           # Custom React hooks (9 hooks)
├── particles/       # Particle system
├── Particles.tsx    # PixiJS particles component
├── scene/           # Three.js scene components
├── Scene.tsx        # Main Three.js scene
├── sections/        # Portfolio sections (8 sections)
├── Section.tsx      # Main orchestrator (324 lines - TOO LARGE)
├── ui/              # UI components (modals, toolbar, etc.)
└── utilities/       # Helper functions
```

**Tech Stack:**
- **Framework:** Astro (with React integration)
- **Build Tool:** Vite
- **UI Library:** React 18+ with TypeScript
- **Styling:** Tailwind CSS 4
- **UI Components:** ShadCN UI
- **Animations:** GSAP (GreenSock), Three.js, PixiJS
- **Audio:**
  - Howler.js (Audio playback engine, playlist management)
  - wavesurfer.js (Waveform visualization)
- **Icons:** @mynaui/icons-react v0.3.9
- **Data Management:**
  - TanStack Query (React Query) - Server state, caching, data fetching
  - TanStack Table - Headless tables for admin & data pages
- **Forms:** react-hook-form + Zod (via ShadCN UI)
- **Payments:** Stripe (Consultations, digital products, subscriptions)
- **API Integrations:**
  - YouTube API (Channel stats, video embeds)
  - LinkedIn API (Profile sync, posts feed)
  - Spotify/SoundCloud API (Music platform integration)
  - Weather API (Dynamic atmospheric effects)
  - SendGrid/Resend (Transactional emails)
  - Twilio (SMS notifications)
  - WakaTime API (Coding activity stats)
- **Testing:**
  - Vitest (Unit testing)
  - Playwright (E2E testing)
  - Chromatic (Visual regression testing)
- **Design & Development:**
  - Figma (Design system, mockups, prototypes)
  - Storybook (Component development & documentation)
  - Chromatic (Visual testing & review)
- **Package Manager:** pnpm with Turborepo (monorepo)
- **State Management:** React Context API + Custom Hooks
- **Type Safety & Validation:**
  - TypeScript with strict mode
  - Zod (Runtime schema validation)

---

## 📋 Table of Contents

1. [Phase 1: Animations Refactoring (Priority: IMMEDIATE)](#phase-1-animations-refactoring-priority-immediate-)
   - [1.1 Create Centralized State Management](#11-create-centralized-state-management)
   - [1.2 Refactor Custom Hooks](#12-refactor-custom-hooks)
   - [1.3 Break Down Section.tsx](#13-break-down-sectiontsx-324-lines--150-lines)
   - [1.4 File Renaming & Cleanup](#14-file-renaming--cleanup)
   - [1.5 Testing & Validation](#15-testing--validation)

2. [Phase 0: Infrastructure & Architecture Foundation (After Phase 1)](#phase-0-infrastructure--architecture-foundation-after-phase-1-)
   - [0.1 Monorepo Restructuring](#01-monorepo-restructuring)
   - [0.2 Strapi CMS Integration](#02-strapi-cms-integration)
   - [0.3 Deployment Strategy](#03-deployment-strategy)
   - [0.4 Content Migration & API Integration](#04-content-migration--api-integration)

3. [Phase 2: Component Architecture Improvements](#phase-2-component-architecture-improvements-priority-high)
   - [2.1 Break Down Section.tsx](#21-break-down-sectiontsx-324-lines--150-lines)
   - [2.2 Scene Component Optimization](#22-scene-component-optimization)
   - [2.3 Section Components Standardization](#23-section-components-standardization)

4. [Phase 3: Performance Optimization](#phase-3-performance-optimization-priority-medium)
   - [3.1 Code Splitting & Lazy Loading](#31-code-splitting--lazy-loading)
   - [3.2 Animation Performance](#32-animation-performance)
   - [3.3 Bundle Size Reduction](#33-bundle-size-reduction)

5. [Phase 4: Type Safety & Developer Experience](#phase-4-type-safety--developer-experience-priority-medium)
   - [4.1 TypeScript Improvements](#41-typescript-improvements)
   - [4.2 Configuration Management](#42-configuration-management)
   - [4.3 Design System & Component Development Workflow](#43-design-system--component-development-workflow)
   - [4.4 Additional Developer Tooling](#44-additional-developer-tooling)

6. [Phase 5: Testing & Quality](#phase-5-testing--quality-priority-low)
   - [5.1 Unit Testing](#51-unit-testing)
   - [5.2 Integration Testing](#52-integration-testing)

7. [Next Steps After Refactoring](#next-steps-after-refactoring)
   - [1. New Pages Development](#1-new-pages-development)
   - [2. Content Enhancements](#2-content-enhancements)
   - [3. Interactive Features](#3-interactive-features)
   - [4. SEO & Accessibility](#4-seo--accessibility)
   - [5. DevOps & Deployment](#5-devops--deployment)

8. [Recommended Execution Order](#recommended-execution-order)

9. [Success Metrics](#success-metrics)

10. [Current Progress Tracking](#current-progress-tracking)

---

**Problems to Address:**
1. **Section.tsx is too large** (324 lines) - needs to be broken down
2. **Too many responsibilities** - mixing orchestration, rendering, state management
3. **Prop drilling** - passing too many props through component tree
4. **No centralized state** - state scattered across components
5. **Difficult to test** - tightly coupled components
6. **Hard to maintain** - changes require touching multiple files

---

## Phase 1: Animations Refactoring (Priority: IMMEDIATE) 🎨

### 1.1 Create Centralized State Management

#### 1.1.1 PortfolioContext (Priority: High)
**File:** `src/components/animations/contexts/PortfolioContext.tsx`

**Goal:** Centralize portfolio-wide state (navigation, modals, panels)

**State to Move:**
- `currentSection` - Active section index
- `scrollProgress` - Scroll progress within section
- `showInfoPanel` - Info panel visibility
- `showSettingsPanel` - Settings panel visibility
- `showSocialMenu` - Social menu visibility
- `selectedExperienceIndex` - Experience modal state
- `selectedAward` - Award modal state

**Benefits:**
- Eliminates prop drilling
- Single source of truth
- Easier debugging with React DevTools
- Cleaner component interfaces

**Implementation:**
```typescript
// contexts/PortfolioContext.tsx
interface PortfolioState {
  currentSection: number;
  scrollProgress: number;
  modals: {
    experience: { isOpen: boolean; data: number | null };
    award: { isOpen: boolean; data: Award | null };
  };
  panels: {
    info: boolean;
    settings: boolean;
    social: boolean;
  };
}

export const PortfolioProvider: React.FC<{ children: React.ReactNode }>;
export const usePortfolio: () => PortfolioState & PortfolioActions;
```

**Estimated Effort:** 1 day

---

#### 1.1.2 AnimationContext (Priority: High)
**File:** `src/components/animations/contexts/AnimationContext.tsx`

**Goal:** Manage animation-specific settings and capabilities

**State to Move:**
- `capabilities` - Device performance capabilities
- `isSoundMuted` - Sound preference
- `mounted` - Component mount state
- Animation performance settings

**Implementation:**
```typescript
// contexts/AnimationContext.tsx
interface AnimationState {
  capabilities: DeviceCapabilities;
  isSoundMuted: boolean;
  mounted: boolean;
  performanceMode: 'low' | 'medium' | 'high';
}

export const AnimationProvider: React.FC<{ children: React.ReactNode }>;
export const useAnimation: () => AnimationState & AnimationActions;
```

**Estimated Effort:** 0.5 days

---

### 1.2 Refactor Custom Hooks

#### 1.2.1 useToolbarState Hook
**File:** `src/components/animations/hooks/useToolbarState.ts`

**Goal:** Consolidate toolbar panel management logic

**Current Problem:** Panel state scattered in Section.tsx

**Solution:**
```typescript
// hooks/useToolbarState.ts
export function useToolbarState() {
  const [openPanel, setOpenPanel] = useState<'info' | 'settings' | 'social' | null>(null);

  const togglePanel = (panel: 'info' | 'settings' | 'social') => {
    setOpenPanel(current => current === panel ? null : panel);
  };

  const closeAllPanels = () => setOpenPanel(null);

  return {
    isInfoOpen: openPanel === 'info',
    isSettingsOpen: openPanel === 'settings',
    isSocialOpen: openPanel === 'social',
    toggleInfo: () => togglePanel('info'),
    toggleSettings: () => togglePanel('settings'),
    toggleSocial: () => togglePanel('social'),
    closeAll: closeAllPanels
  };
}
```

**Estimated Effort:** 0.5 days

---

#### 1.2.2 useModalManager Hook
**File:** `src/components/animations/hooks/useModalManager.ts`

**Goal:** Unified modal management for all modal types

**Current Problem:** Using separate `useModal` instances

**Solution:**
```typescript
// hooks/useModalManager.ts
export function useModalManager() {
  const [modals, setModals] = useState<{
    experience: { isOpen: boolean; data: number | null };
    award: { isOpen: boolean; data: Award | null };
  }>({
    experience: { isOpen: false, data: null },
    award: { isOpen: false, data: null }
  });

  const openExperience = (index: number) => { /* ... */ };
  const openAward = (award: Award) => { /* ... */ };
  const closeAll = () => { /* ... */ };

  return { modals, openExperience, openAward, closeAll };
}
```

**Estimated Effort:** 0.5 days

---

### 1.3 Break Down Section.tsx (324 lines → ~150 lines)

#### 1.3.1 Extract AtmosphericOverlays Component
**File:** `src/components/animations/overlays/AtmosphericOverlays.tsx`

**Goal:** Move all atmospheric overlay rendering logic

**What to Extract:**
```typescript
// Current: Lines 150-200+ in Section.tsx
{/* Troposphere overlay */}
{currentSection === 0 && ...}
{/* Skills Section Overlay */}
{currentSection === 4 && ...}
```

**New Component:**
```typescript
// overlays/AtmosphericOverlays.tsx
export function AtmosphericOverlays({
  currentSection,
  atmosphericLayer
}: AtmosphericOverlaysProps) {
  return (
    <>
      {/* Troposphere */}
      {currentSection === 0 && <TroposphereOverlay />}

      {/* Skills Stratosphere */}
      {currentSection === 4 && <StratosphereOverlay />}

      {/* Other overlays... */}
    </>
  );
}
```

**Estimated Effort:** 1 day

---

#### 1.3.2 Extract DynamicBackground Component
**File:** `src/components/animations/background/DynamicBackground.tsx`

**Goal:** Encapsulate background styling logic

**What to Extract:**
```typescript
// Current: Inline background style in Section.tsx
<section style={backgroundStyle}>
```

**New Component:**
```typescript
// background/DynamicBackground.tsx
export function DynamicBackground({
  atmosphericLayer,
  children
}: DynamicBackgroundProps) {
  const backgroundStyle = useAtmosphericBackground(atmosphericLayer);

  return (
    <div className="fixed inset-0 -z-10" style={backgroundStyle}>
      {children}
    </div>
  );
}
```

**Estimated Effort:** 0.5 days

---

#### 1.3.3 Extract AnimationCanvas Component
**File:** `src/components/animations/canvas/AnimationCanvas.tsx`

**Goal:** Encapsulate Three.js and PixiJS rendering

**What to Extract:**
```typescript
// Current: Canvas/Scene/Particles rendering in Section.tsx
{mounted && capabilities.canUseHeavyAnimations && (
  <>
    <Canvas>
      <Scene ... />
    </Canvas>
    <PixiJSParticles ... />
  </>
)}
```

**New Component:**
```typescript
// canvas/AnimationCanvas.tsx
export function AnimationCanvas({
  currentSection,
  scrollProgress,
  capabilities,
  isSoundMuted
}: AnimationCanvasProps) {
  const { mounted } = useAnimation();

  if (!mounted || !capabilities.canUseHeavyAnimations) return null;

  return (
    <>
      <Canvas className="fixed inset-0 -z-20" gl={{ alpha: true }}>
        <ThreeJSScene
          currentSection={currentSection}
          scrollProgress={scrollProgress}
        />
      </Canvas>
      <PixiJSParticles
        currentSection={currentSection}
        isSoundMuted={isSoundMuted}
      />
    </>
  );
}
```

**Estimated Effort:** 1 day

---

#### 1.3.4 Extract SectionContent Component
**File:** `src/components/animations/sections/SectionContent.tsx`

**Goal:** Encapsulate all section rendering logic

**What to Extract:**
All section components rendering (HeroSection, AboutSection, etc.)

**New Component:**
```typescript
// sections/SectionContent.tsx
export function SectionContent({ currentSection }: SectionContentProps) {
  const { capabilities, isSoundMuted } = useAnimation();
  const { modals, panels } = usePortfolio();

  return (
    <>
      {/* Hero Section */}
      <div className={getSectionClasses(0, currentSection)}>
        {currentSection === 0 && (
          <HeroSection {...heroProps} />
        )}
      </div>

      {/* About Section */}
      <div className={getSectionClasses(1, currentSection)}>
        {currentSection === 1 && (
          <AboutSection {...aboutProps} />
        )}
      </div>

      {/* ... other sections */}
    </>
  );
}
```

**Estimated Effort:** 1 day

---

#### 1.3.5 Extract UIOverlays Component
**File:** `src/components/animations/overlays/UIOverlays.tsx`

**Goal:** Consolidate all UI overlay components (toolbar, modals, indicators)

**What to Extract:**
```typescript
// All UI overlays: Toolbar, Modals, ScrollIndicators, etc.
```

**New Component:**
```typescript
// overlays/UIOverlays.tsx
export function UIOverlays() {
  const { modals, panels } = usePortfolio();
  const { capabilities, isSoundMuted, toggleSound } = useAnimation();

  return (
    <>
      <Toolbar {...toolbarProps} />

      {panels.social && <SocialMenu {...socialProps} />}
      {panels.settings && <SettingsPanel {...settingsProps} />}
      {panels.info && <InfoPanel {...infoProps} />}

      {modals.experience.isOpen && <ExperienceModal {...experienceProps} />}
      {modals.award.isOpen && <AwardModal {...awardProps} />}

      <ScrollIndicators {...scrollProps} />
      <ScrollDownIndicator {...scrollDownProps} />
    </>
  );
}
```

**Estimated Effort:** 1 day

---

#### 1.3.6 Refactored Section.tsx
**File:** `src/components/animations/Section.tsx`

**Goal:** Pure orchestration component (~150 lines)

**New Structure:**
```typescript
// Section.tsx (after refactoring)
export default function PortfolioSection(): JSX.Element {
  return (
    <AnimationProvider>
      <PortfolioProvider>
        <PortfolioSectionContent />
      </PortfolioProvider>
    </AnimationProvider>
  );
}

function PortfolioSectionContent(): JSX.Element {
  const { currentSection, scrollProgress } = usePortfolio();
  const { atmosphericLayer } = useAtmosphericLayer(currentSection, scrollProgress);

  // Apply GSAP transitions
  useSectionTransitions(currentSection, refs);

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <DynamicBackground atmosphericLayer={atmosphericLayer} />

      {/* Atmospheric Overlays */}
      <AtmosphericOverlays
        currentSection={currentSection}
        atmosphericLayer={atmosphericLayer}
      />

      {/* 3D Canvas & Particles */}
      <AnimationCanvas
        currentSection={currentSection}
        scrollProgress={scrollProgress}
      />

      {/* Section Content */}
      <SectionContent currentSection={currentSection} />

      {/* UI Overlays (Toolbar, Modals, Indicators) */}
      <UIOverlays />
    </section>
  );
}
```

**Estimated Effort:** 1 day

---

### 1.4 File Renaming & Cleanup

**Goal:** Replace vague file names with descriptive, specific names

**Current Problems:**
- `Particles.tsx` - Too generic, unclear it uses PixiJS
- `Scene.tsx` - Too generic, unclear it uses Three.js
- `Section.tsx` - Too generic, unclear it's the main portfolio orchestrator

**Renaming Plan:**

1. **`Particles.tsx` → `PixiJSParticles.tsx`**
   - Makes it clear this is the PixiJS particle system
   - Distinguishes from potential future particle systems
   - Better for search/navigation in IDE

2. **`Scene.tsx` → `ThreeJSScene.tsx`**
   - Explicitly indicates Three.js usage
   - Clear distinction from PixiJS components
   - More discoverable in codebase

3. **`Section.tsx` → `PortfolioSection.tsx`**
   - Clearly indicates this is the main portfolio orchestrator
   - Avoids confusion with section sub-components
   - Better semantic meaning

**Update Import Statements:**
```typescript
// Before:
import ThreeJSScene from './Scene.tsx';
import PixiJSParticles from './Particles.tsx';

// After:
import { ThreeJSScene } from './ThreeJSScene';
import { PixiJSParticles } from './PixiJSParticles';
```

**Files to Update:**
- `src/pages/index.astro` - Update PortfolioSection import
- All components importing these files
- Update exports in `index.ts` files
- Update any dynamic imports

**Estimated Effort:** 0.5 days

---

### 1.5 Testing & Validation

**Tasks:**
- Verify all sections render correctly
- Test all modal interactions
- Test toolbar panel toggling
- Verify atmospheric transitions
- Test GSAP animations
- Check performance (no regressions)
- Validate TypeScript types
- Run linting and formatting
- Verify all renamed imports work correctly
- Test build process

**Estimated Effort:** 1 day

---

**Total Phase 1 Estimated Effort:** 9-11 days

---

## Phase 0: Infrastructure & Architecture Foundation (After Phase 1) 🏗️

### 0.1 Monorepo Restructuring
**Goal:** Convert to a well-organized monorepo structure with proper separation of concerns

**Current Structure:**
```
apps/portfolio/
├── src/
├── public/
└── package.json
```

**New Monorepo Structure:**
```
aazucena_apps/
├── apps/
│   ├── portfolio/              # Frontend (Astro + React)
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   ├── layouts/
│   │   │   └── lib/
│   │   ├── public/
│   │   └── package.json
│   │
│   └── cms/              # Backend (Strapi)
│       ├── src/
│       │   ├── api/                # API endpoints
│       │   ├── components/         # Strapi components
│       │   └── extensions/         # Custom plugins
│       ├── config/
│       ├── database/
│       ├── public/
│       └── package.json
│
├── packages/
│   ├── shared/               # Shared TypeScript types
│   │   ├── src/
│   │   │   ├── content.ts         # Content models
│   │   │   ├── api.ts             # API response types
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── ui/              # Shared UI components
│   │   ├── src/
│   │   │   ├── Button/
│   │   │   ├── Card/
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   └── utils/                      # Shared utilities
│       ├── src/
│       │   ├── colors.ts
│       │   ├── dates.ts
│       │   └── index.ts
│       └── package.json
│
├── .circleci/
│   └── config.yml                  # CircleCI pipeline config
│
├── pnpm-workspace.yaml
├── turbo.json                      # Turborepo config
├── package.json                    # Root package.json
└── tsconfig.json                   # Base TypeScript config
```

**Tasks:**
- Set up pnpm workspace configuration
- Install and configure Turborepo for build orchestration
- Create `packages/shared` (types), `packages/ui` (components), `packages/utils` (utilities)
- Update import paths to use workspace protocol (`workspace:*`)
- Configure path aliases for each app
- Set up unified linting/formatting across monorepo

**Benefits:**
- Code sharing between frontend and CMS
- Consistent TypeScript types across stack
- Unified build system with Turborepo
- Easier dependency management
- Better scalability for future apps/services

**Estimated Effort:** 2-3 days

---

### 0.2 Strapi CMS Integration
**Goal:** Replace hardcoded content with dynamic CMS-managed content

**Strapi Setup:**
- Install Strapi v4 in `apps/cms`
- Configure PostgreSQL database (Railway)
- Set up admin panel authentication
- Configure media uploads (Cloudinary or S3)

**Content Types to Create:**

1. **About** (Single Type)
   - Name, title, bio (rich text)
   - Profile image
   - Flip words (repeatable component)
   - Tech stack badges
   - Social links (repeatable component)

2. **Experience** (Collection)
   - Company, position, duration
   - Logo (media)
   - Description (rich text)
   - Highlights (repeatable)
   - Skills (relation to Skills)
   - Order/priority

3. **Projects** (Collection)
   - Title, description (rich text)
   - Images (media, multiple)
   - Technologies (relation to Skills)
   - Live URL, GitHub URL
   - Featured (boolean)
   - Category
   - Order/priority

4. **Skills** (Collection)
   - Name, category
   - Icon (text/enum)
   - Proficiency level
   - Order

5. **Testimonials** (Collection)
   - Author name, role, company
   - Content (text)
   - Avatar (media)
   - Date
   - Rating (optional)
   - Order

6. **Blog Posts** (Collection)
   - Title, slug
   - Content (rich text with Markdown)
   - Excerpt
   - Featured image (media)
   - Tags (relation)
   - Published date
   - Author (relation to Authors)
   - Status (draft/published)

7. **Awards & Certifications** (Collection)
   - Title, short title
   - Organization, year
   - Type (certification/award)
   - Description
   - Icon/logo (media)
   - Details (repeatable)
   - Skills (relation)
   - Verification URL

8. **Settings** (Single Type)
   - Site title, description
   - SEO defaults
   - Contact email
   - Analytics IDs

9. **Compositions** (Collection)
   - Title, slug
   - Artist (default: your name)
   - Genre (enumeration or tags)
   - Duration (number in seconds)
   - Composition date
   - Description (rich text - inspiration/story)
   - Album art (media - Cloudinary)
   - Audio file (media - Cloudinary MP3/WAV)
   - Waveform data (JSON text)
   - Lyrics (rich text, optional)
   - Featured (boolean)
   - Order/priority (for playlist)
   - Download enabled (boolean)
   - Metadata (component):
     - BPM (number)
     - Key (text)
     - Instruments (repeatable text)
     - Software/DAW used (repeatable text)
   - Play count (number, auto-increment)
   - Published status (draft/published)

**Strapi API Features:**
- REST API + GraphQL support
- Role-based access control (RBAC)
- Media library management
- Draft/Publish workflow
- Internationalization (future)
- Webhooks for cache invalidation

**Frontend Integration Tasks:**
- Create API client in `apps/portfolio/src/lib/strapi.ts`
- Implement data fetching utilities
- Add ISR (Incremental Static Regeneration) for Astro
- Create TypeScript types from Strapi schemas (using shared-types package)
- Replace all static data imports with API calls
- Add loading states and error handling
- Implement image optimization for Strapi media

**Data Migration:**
- Export existing data from `sections/data/*` files
- Create Strapi import script
- Bulk import content via Strapi API
- Verify data integrity
- Update image references to use Cloudinary/S3

**Estimated Effort:** 5-7 days

---

### 0.3 Deployment Strategy
**Goal:** Set up production-ready deployment pipeline

#### Frontend Deployment (Vercel)

**Vercel GitHub Integration (Automatic):**
Vercel provides built-in CI/CD through GitHub integration - **no CircleCI needed for frontend!**

**Setup Steps:**
1. Connect GitHub repository to Vercel
2. Vercel automatically detects Astro framework
3. Configure project settings:
   - **Framework Preset**: Astro
   - **Root Directory**: `apps/portfolio`
   - **Build Command**: `cd ../.. && pnpm turbo run build --filter=portfolio`
   - **Output Directory**: `apps/portfolio/dist`
   - **Install Command**: `pnpm install`

**Automatic Features:**
- ✅ Builds on every push to `main`
- ✅ Preview deployments for all PRs
- ✅ Automatic SSL certificates
- ✅ Edge caching and CDN
- ✅ Image optimization
- ✅ Environment variable management
- ✅ Deployment rollbacks

**Environment Variables (Vercel Dashboard):**
- `STRAPI_API_URL` - Strapi backend URL (e.g., https://cms.yoursite.com)
- `STRAPI_API_TOKEN` - Strapi API token for authenticated requests

**Performance Optimizations:**
- Edge caching for static assets
- Image optimization with Vercel Image Optimization
- ISR (Incremental Static Regeneration) for CMS content
- Prerender static pages at build time
- Custom cache headers

**Optional Vercel Config (`vercel.json`):**
```json
{
  "headers": [
    {
      "source": "/fonts/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://cms.yoursite.com/api/:path*"
    }
  ]
}
```

**Estimated Effort:** 0.5 days (just configuration, no CI/CD needed)

---

#### Backend Deployment (Railway)

**Railway Setup:**
- Deploy `apps/cms` to Railway
- Provision PostgreSQL database
- Configure environment variables
- Set up automatic deployments from `main` branch
- Configure health checks

**Database Setup:**
- PostgreSQL 14+ on Railway
- Automated backups (daily)
- Connection pooling (PgBouncer)
- SSL connections enabled

**Environment Variables:**
```env
# Strapi Configuration
NODE_ENV=production
APP_KEYS=<generated>
API_TOKEN_SALT=<generated>
ADMIN_JWT_SECRET=<generated>
JWT_SECRET=<generated>

# Database
DATABASE_CLIENT=postgres
DATABASE_HOST=${PGHOST}
DATABASE_PORT=${PGPORT}
DATABASE_NAME=${PGDATABASE}
DATABASE_USERNAME=${PGUSER}
DATABASE_PASSWORD=${PGPASSWORD}
DATABASE_SSL=true

# Media Storage (Cloudinary)
CLOUDINARY_NAME=<your-cloud-name>
CLOUDINARY_KEY=<api-key>
CLOUDINARY_SECRET=<api-secret>

# CORS (Allow Vercel domains)
ALLOWED_ORIGINS=https://yoursite.com,https://www.yoursite.com

# Admin Panel URL
ADMIN_URL=/admin
```

**Railway Config (`railway.json`):**
```json
{
  "build": {
    "builder": "nixpacks",
    "buildCommand": "pnpm install && pnpm run build"
  },
  "deploy": {
    "startCommand": "pnpm run start",
    "healthcheckPath": "/_health",
    "healthcheckTimeout": 100,
    "restartPolicyType": "on-failure",
    "restartPolicyMaxRetries": 10
  }
}
```

**CircleCI Workflow (CMS):**
```yaml
# Part of .circleci/config.yml
deploy-cms:
  docker:
    - image: cimg/node:20.11
  steps:
    - checkout
    - run:
        name: Install pnpm
        command: npm install -g pnpm
    - restore_cache:
        keys:
          - pnpm-packages-{{ checksum "pnpm-lock.yaml" }}
    - run:
        name: Install dependencies
        command: pnpm install --frozen-lockfile
    - save_cache:
        key: pnpm-packages-{{ checksum "pnpm-lock.yaml" }}
        paths:
          - node_modules
    - run:
        name: Build cms
        command: pnpm turbo run build --filter=cms
    - run:
        name: Deploy to Railway
        command: |
          npm install -g @railway/cli
          railway up --service cms
        environment:
          RAILWAY_TOKEN: $RAILWAY_TOKEN
```

**Strapi Production Optimizations:**
- Enable content versioning
- Configure CDN for media (Cloudinary)
- Set up Redis for caching (optional)
- Enable response compression
- Configure rate limiting
- Set up logging (Winston + CloudWatch/Datadog)
- Enable database query optimization

**Monitoring & Observability:**
- Railway metrics dashboard
- Uptime monitoring (UptimeRobot, BetterStack)
- Error tracking with Sentry
- Performance monitoring
- Database query analysis

**CircleCI Configuration (CMS Only):**
```yaml
# .circleci/config.yml
# Note: Frontend deployment handled automatically by Vercel via GitHub integration
version: 2.1

orbs:
  node: circleci/node@5.1.0

executors:
  node-executor:
    docker:
      - image: cimg/node:20.11
    working_directory: ~/repo

jobs:
  install-dependencies:
    executor: node-executor
    steps:
      - checkout
      - run:
          name: Install pnpm
          command: npm install -g pnpm
      - restore_cache:
          keys:
            - pnpm-{{ checksum "pnpm-lock.yaml" }}
      - run:
          name: Install dependencies
          command: pnpm install --frozen-lockfile
      - save_cache:
          key: pnpm-{{ checksum "pnpm-lock.yaml" }}
          paths:
            - node_modules
            - ~/.pnpm-store
      - persist_to_workspace:
          root: .
          paths:
            - node_modules
            - apps/*/node_modules
            - packages/*/node_modules

  lint-and-test:
    executor: node-executor
    steps:
      - checkout
      - attach_workspace:
          at: .
      - run:
          name: Lint all packages
          command: pnpm turbo run lint
      - run:
          name: Type check all packages
          command: pnpm turbo run type-check
      - run:
          name: Run tests
          command: pnpm turbo run test

  build-cms:
    executor: node-executor
    steps:
      - checkout
      - attach_workspace:
          at: .
      - run:
          name: Build CMS
          command: pnpm turbo run build --filter=cms
      - persist_to_workspace:
          root: .
          paths:
            - apps/cms/build
            - apps/cms/dist

  deploy-cms:
    executor: node-executor
    steps:
      - checkout
      - attach_workspace:
          at: .
      - run:
          name: Deploy CMS to Railway
          command: |
            npm install -g @railway/cli
            cd apps/cms
            railway up --service cms
        environment:
          RAILWAY_TOKEN: $RAILWAY_TOKEN

workflows:
  version: 2
  cms-pipeline:
    jobs:
      - install-dependencies

      - lint-and-test:
          requires:
            - install-dependencies

      # CMS deployment workflow
      - build-cms:
          requires:
            - lint-and-test
          filters:
            branches:
              only:
                - main
                - develop

      - deploy-cms:
          requires:
            - build-cms
          filters:
            branches:
              only: main

  # Optional: Nightly health checks
  nightly:
    triggers:
      - schedule:
          cron: "0 0 * * *"
          filters:
            branches:
              only: main
    jobs:
      - install-dependencies
      - lint-and-test:
          requires:
            - install-dependencies
      - build-cms:
          requires:
            - lint-and-test
```

**CircleCI Environment Variables (Project Settings):**
- `RAILWAY_TOKEN` - Railway API token for CMS deployment
- `STRAPI_API_URL` - Strapi backend URL (for testing)
- `STRAPI_API_TOKEN` - Strapi API token (for testing)

**Why CircleCI for CMS only?**
- ✅ Vercel handles frontend CI/CD automatically via GitHub integration
- ✅ CircleCI focuses solely on CMS deployment to Railway
- ✅ Centralized testing and linting for entire monorepo
- ✅ Faster CI/CD cycles with focused pipeline
- ✅ Less build minutes consumed

**Estimated Effort:** 1.5 days (reduced since Vercel handles frontend automatically)

---

### 0.4 Content Migration & API Integration
**Goal:** Seamlessly migrate from static to CMS-driven content

**Migration Strategy:**

**Step 1: Create Migration Scripts**
```typescript
// scripts/migrate-to-strapi.ts
import { about } from '../src/data/about';
import { experiences } from '../src/data/experiences';
import { projects } from '../src/data/projects';
// ... import all data

async function migrateContent() {
  // Upload to Strapi API
  await createAbout(about);
  await createExperiences(experiences);
  await createProjects(projects);
  // ...
}
```

**Step 2: Build API Client**
```typescript
// apps/portfolio/src/lib/strapi.ts
import type { AboutData, Experience, Project } from '@aazucena/shared';

export class StrapiClient {
  constructor(private apiUrl: string, private apiToken: string) {}

  async getAbout(): Promise<AboutData> {
    const res = await fetch(`${this.apiUrl}/api/about?populate=*`);
    return this.transform(await res.json());
  }

  async getExperiences(): Promise<Experience[]> {
    const res = await fetch(`${this.apiUrl}/api/experiences?populate=*&sort=order:asc`);
    return this.transform(await res.json());
  }

  // ... more methods
}
```

**Step 3: Update Components**
```astro
---
// Before
import { aboutData } from '@/data/about';

// After
import { strapiClient } from '@/lib/strapi';
const aboutData = await strapiClient.getAbout();
---
```

**Step 4: Caching Strategy**
- Use Astro's built-in caching
- Implement ISR with revalidation time (e.g., 60 seconds)
- Add Strapi webhooks to trigger Vercel rebuilds
- Optional: Add Redis cache layer for frequently accessed data

**Estimated Effort:** 3 days

---

**Total Phase 0 Estimated Effort:** 12-16 days

**Breakdown:**
- 0.1 Monorepo: 2-3 days
- 0.2 Strapi CMS: 5-7 days
- 0.3 Deployment: 1.5 days (Vercel auto-deploys, CircleCI for CMS only)
- 0.4 Migration: 3 days

---

## Phase 1: State Management Consolidation (Priority: High)

### 1.1 Create Central State Context
**Goal:** Reduce prop drilling and centralize portfolio state

**Tasks:**
- Create `contexts/PortfolioContext.tsx` for global state (currentSection, scrollProgress, modals, panels)
- Create `contexts/AnimationContext.tsx` for animation-specific state (capabilities, sound settings)
- Migrate state from `Section.tsx` to contexts
- Update all child components to use context hooks instead of props

**Benefits:**
- Cleaner component props
- Easier state access across components
- Better separation of concerns
- Reduced re-renders with proper context splitting

### 1.2 Custom Hooks Refinement
**Goal:** Simplify hook dependencies and improve reusability

**Tasks:**
- Refactor `useSectionTransition` to consume PortfolioContext
- Create `useToolbarState` hook to manage all toolbar panel states
- Extract modal logic into `useModalManager` for managing multiple modals
- Consolidate animation hooks into `useAnimations` composite hook

---

## Phase 2: Component Architecture Improvements (Priority: High)

### 2.1 Break Down Section.tsx (324 lines → ~150 lines)
**Current Issues:** Too many responsibilities, hard to maintain

**Refactor Strategy:**
- Extract atmospheric overlay logic → `components/AtmosphericOverlays.tsx`
- Extract background logic → `components/DynamicBackground.tsx`
- Extract canvas/particles logic → `components/AnimationCanvas.tsx`
- Extract section content rendering → `components/SectionContent.tsx`
- Keep only orchestration logic in `Section.tsx`

**New Structure:**
```
Section.tsx (orchestration only)
├── DynamicBackground.tsx
├── AtmosphericOverlays.tsx
├── AnimationCanvas.tsx (wraps Three.js + PixiJS)
├── SectionContent.tsx (wraps all section components)
└── UIOverlays.tsx (toolbar, modals, indicators)
```

### 2.2 Scene Component Optimization
**Tasks:**
- Split `Scene.tsx` into smaller layer-specific renderers
- Create `SceneManager.tsx` to handle layer switching logic
- Optimize re-renders with React.memo for static layers
- Implement lazy loading for heavy 3D components

### 2.3 Section Components Standardization
**Goal:** Consistent patterns across all section components

**Tasks:**
- Create base `SectionWrapper` component for common layout
- Standardize section heading styles into `SectionHeading` component
- Extract common animation patterns into shared utilities
- Ensure all sections follow same prop interface pattern

---

## Phase 3: Performance Optimization (Priority: Medium)

### 3.1 Code Splitting & Lazy Loading
**Tasks:**
- Lazy load `Scene.tsx` and `Particles.tsx` (heavy 3D libraries)
- Dynamic imports for section modals (ExperienceModal, AwardModal)
- Lazy load sections that aren't visible initially
- Implement suspense boundaries with loading states

### 3.2 Animation Performance
**Tasks:**
- Audit GSAP timeline usage, reduce duplicate timelines
- Implement animation throttling for low-end devices
- Add `will-change` CSS hints for animated elements
- Optimize Three.js render loop (only render when needed)

### 3.3 Bundle Size Reduction
**Tasks:**
- Analyze and tree-shake unused @mynaui/icons-react icons
- Consider replacing heavy dependencies with lighter alternatives
- Implement dynamic imports for atmospheric layer components
- Code-split routes (/about, /journey when created)

---

## Phase 4: Type Safety & Developer Experience (Priority: Medium)

### 4.1 TypeScript Improvements
**Tasks:**
- Create centralized `types/` directory for shared types
- Consolidate all data interfaces into `types/data.ts`
- Add stricter type checking for GSAP animations
- Create utility types for common patterns (ModalProps, SectionProps)

### 4.2 Configuration Management
**Tasks:**
- Move all magic numbers to `config/constants.ts`
- Centralize z-index values in `config/zIndex.ts`
- Create theme configuration for colors/gradients
- Document atmospheric layer configuration

### 4.3 Design System & Component Development Workflow
**Goal:** Establish a professional design-to-code pipeline with Figma, Storybook, and Chromatic

#### 4.3.1 Figma Design System Setup
**Goal:** Create a centralized design system for consistent UI/UX

**Figma Organization:**
- **Design Tokens File**
  - Colors (atmospheric layers, brand colors, semantic colors)
  - Typography scale (font families, sizes, weights, line heights)
  - Spacing system (4px, 8px, 16px, 24px, 32px, etc.)
  - Border radius values
  - Shadow definitions
  - Animation timing functions
  - Z-index scale

- **Component Library**
  - Buttons (primary, secondary, ghost, icon-only)
  - Input fields (text, textarea, select, checkbox, radio)
  - Cards (project cards, testimonial cards, hexagon cards)
  - Modals (experience modal, award modal)
  - Navigation (toolbar, scroll indicators, dropdown menu)
  - Badges (skill tags, tech stack badges)
  - Typography components (headings, body text, code blocks)
  - Icons (from @mynaui/icons-react)

- **Section Templates**
  - Hero section variants
  - About section layouts
  - Projects grid/list views
  - Experience timeline
  - Skills matrix
  - Blog post cards
  - Awards gallery

- **Responsive Breakpoints**
  - Mobile: 375px, 414px
  - Tablet: 768px, 1024px
  - Desktop: 1280px, 1440px, 1920px
  - Document responsive behavior for each component

- **States & Variations**
  - Default, hover, active, disabled, loading, error
  - Dark mode variants (future)
  - Atmospheric layer variations

**Figma Plugins to Use:**
- **Figma Tokens** - Sync design tokens with code
- **Anima** - Export to React components (optional)
- **Contrast** - Check accessibility (WCAG compliance)
- **Iconify** - Access to icon libraries
- **Content Reel** - Realistic content population

**Handoff Process:**
- Use Figma Dev Mode for developer handoff
- Export assets at 1x, 2x, 3x for retina displays
- Document interaction patterns and micro-animations
- Create animation specs (duration, easing, delays)
- Link to Storybook stories from Figma frames (via URLs)

**Estimated Effort:** 5-7 days

---

#### 4.3.2 Storybook Setup & Integration
**Goal:** Component development environment and living documentation

**Storybook Configuration:**
- **Installation & Setup**
  ```bash
  pnpm add -D @storybook/react-vite @storybook/addon-essentials @storybook/addon-interactions @storybook/addon-a11y @storybook/addon-themes
  ```
  - Configure for Vite + React + TypeScript
  - Set up Tailwind CSS in Storybook
  - Configure path aliases to match main app
  - Set up global decorators for contexts

- **Essential Addons**
  - `@storybook/addon-essentials` - Controls, viewport, backgrounds, etc.
  - `@storybook/addon-a11y` - Accessibility testing
  - `@storybook/addon-interactions` - Interaction testing
  - `@storybook/addon-themes` - Theme switching
  - `@storybook/addon-links` - Navigate between stories
  - `storybook-addon-pseudo-states` - Hover, focus, active states
  - `@chromatic-com/storybook` - Chromatic integration

**Component Stories to Create:**

1. **UI Components** (`src/components/animations/ui/`)
   - Toolbar.stories.tsx
   - SocialMenu.stories.tsx
   - SettingsPanel.stories.tsx
   - InfoPanel.stories.tsx
   - ScrollIndicators.stories.tsx
   - ScrollDownIndicator.stories.tsx
   - ExperienceModal.stories.tsx
   - NavigationDropdown.stories.tsx

2. **Section Components** (`src/components/animations/sections/`)
   - HeroSection.stories.tsx
   - AboutSection.stories.tsx
   - ProjectsSection.stories.tsx
   - ExperienceSection.stories.tsx
   - SkillsSection.stories.tsx
   - TestimonialsSection.stories.tsx
   - BlogSection.stories.tsx
   - AwardsSection.stories.tsx

3. **Shared Components**
   - Button.stories.tsx
   - Card.stories.tsx
   - Badge.stories.tsx
   - Input.stories.tsx (ShadCN components)

4. **Animation Showcases**
   - AtmosphericOverlays.stories.tsx
   - ThreeJSScene.stories.tsx (simplified)
   - PixiJSParticles.stories.tsx (simplified)

**Story Patterns:**

```typescript
// Example: Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#0a0a0a' },
        { name: 'light', value: '#ffffff' },
      ],
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Click me',
  },
};

export const WithIcon: Story = {
  args: {
    variant: 'primary',
    children: (
      <>
        <Download className="w-4 h-4" />
        Download Resume
      </>
    ),
  },
};
```

**Storybook Features:**
- **Docs Page** - Auto-generated documentation from JSDoc comments
- **Controls** - Interactive prop editing
- **Actions** - Log event handlers
- **Viewport** - Test responsive breakpoints
- **Accessibility** - WCAG compliance checks
- **Interactions** - Simulate user interactions
- **Themes** - Switch between light/dark (future)

**Estimated Effort:** 4-5 days

---

#### 4.3.3 Chromatic Visual Testing Integration
**Goal:** Automated visual regression testing and UI review

**Chromatic Setup:**
- **Project Configuration**
  ```bash
  pnpm add -D chromatic
  ```
  - Link Chromatic project to GitHub repository
  - Set up Chromatic token in environment variables
  - Configure in package.json:
    ```json
    {
      "scripts": {
        "chromatic": "chromatic --project-token=<token>"
      }
    }
    ```

**CI/CD Integration (CircleCI):**
```yaml
# .circleci/config.yml
visual-tests:
  docker:
    - image: cimg/node:20.11
  steps:
    - checkout
    - run:
        name: Install pnpm
        command: npm install -g pnpm
    - restore_cache:
        keys:
          - pnpm-{{ checksum "pnpm-lock.yaml" }}
    - run:
        name: Install dependencies
        command: pnpm install --frozen-lockfile
    - run:
        name: Run Chromatic
        command: pnpm chromatic --project-token=${CHROMATIC_PROJECT_TOKEN} --exit-zero-on-changes
```

**Chromatic Features:**
- **Visual Regression Testing**
  - Captures snapshots of all Storybook stories
  - Detects visual changes automatically
  - Highlights pixel differences
  - Requires manual approval for intentional changes

- **UI Review Workflow**
  - Reviewers can approve/reject changes in Chromatic UI
  - Comment on specific visual changes
  - Compare side-by-side (before/after)
  - Track history of component evolution

- **Component Library Publishing**
  - Published Storybook hosted on Chromatic
  - Shareable links for design reviews
  - Public component library URL
  - Embed stories in documentation

- **TurboSnap Optimization**
  - Only tests components that changed
  - Faster CI/CD pipelines
  - Reduces snapshot credits usage

**Visual Testing Strategy:**
- Run Chromatic on every PR
- Require approval for visual changes before merge
- Set up baseline for main branch
- Test across multiple browsers (Chrome, Firefox, Safari via Chromatic)
- Test responsive breakpoints automatically

**Chromatic Branching:**
- `main` branch = production baseline
- Feature branches = compare against main
- Auto-accept on merge to main (after approval)

**Estimated Effort:** 2-3 days

---

#### 4.3.4 Design-to-Code Workflow

**Complete Pipeline:**

1. **Design Phase (Figma)**
   - Designer creates component in Figma
   - Apply design tokens from token system
   - Document states, interactions, responsive behavior
   - Share Figma link for developer review

2. **Development Phase (Storybook)**
   - Developer builds component in isolation
   - Create stories for all states and variants
   - Use Figma Dev Mode for accurate specs
   - Implement responsive behavior per Figma breakpoints
   - Add accessibility attributes (ARIA labels, keyboard nav)

3. **Documentation Phase (Storybook)**
   - Write JSDoc comments for props
   - Add usage examples in MDX docs
   - Document edge cases and gotchas
   - Link back to Figma design

4. **Visual Testing (Chromatic)**
   - Push branch to GitHub
   - CircleCI triggers Chromatic build
   - Chromatic captures snapshots
   - Visual changes appear in Chromatic UI
   - Designer/reviewer approves changes

5. **Review & Approval**
   - Code review in GitHub PR
   - Visual review in Chromatic
   - Accessibility review in Storybook (a11y addon)
   - Approve and merge

6. **Integration Phase**
   - Import component into main app
   - Integrate with portfolio sections
   - Test in context with real data
   - Deploy to Vercel preview

**Benefits:**
- ✅ Single source of truth (Figma)
- ✅ Components tested in isolation
- ✅ Visual regression prevention
- ✅ Living documentation
- ✅ Faster iteration cycles
- ✅ Better designer-developer collaboration
- ✅ Consistent component API
- ✅ Easier onboarding for contributors

**Estimated Total Effort (4.3.1 - 4.3.4):** 12-16 days

---

### 4.4 Additional Developer Tooling
**Tasks:**
- Add PropTypes/JSDoc for complex components
- Create component usage examples in comments
- Add performance monitoring utilities
- Set up ESLint + Prettier with strict rules
- Configure Husky for pre-commit hooks

**Estimated Effort:** 1-2 days

---

## Phase 5: Testing & Quality (Priority: Low)

### 5.1 Unit Testing
**Tasks:**
- Test custom hooks (useFlipText, useSectionTransition, etc.)
- Test utility functions (color utilities, opacity calculations)
- Test data transformations and business logic

### 5.2 Integration Testing
**Tasks:**
- Test section navigation flow
- Test modal open/close interactions
- Test toolbar panel mutual exclusivity
- Test responsive behavior

---

## Next Steps After Refactoring

### 1. New Pages Development

#### 1.1 About Me Page (`/about`)
**Features:**
- Personal interests and hobbies
- Fun facts section
- Personal philosophy/values
- Photo gallery or timeline
- Similar atmospheric animations (lighter version)

**Estimated Effort:** 2-3 days

#### 1.2 Career Journey Page (`/journey`)
**Features:**
- Interactive timeline visualization
- Career milestones with animations
- Skills progression chart
- Education timeline
- Certifications timeline
- Visual journey map with Three.js

**Estimated Effort:** 4-5 days

### 2. Content Enhancements

#### 2.1 Blog Integration
**Tasks:**
- Connect BlogSection to actual blog posts (CMS or markdown)
- Implement blog post detail pages
- Add filtering/categorization
- Add search functionality

#### 2.2 Projects Enhancement
**Tasks:**
- Add project detail pages with case studies
- Include project screenshots/videos
- Add GitHub integration for live stats
- Implement project filtering by technology

#### 2.3 Testimonials Enhancement
**Tasks:**
- Add video testimonials
- Integrate LinkedIn recommendations API
- Add company logos
- Make testimonials scrollable/carousel

### 3. Interactive Features

#### 3.1 AI-Powered Contact & Forms System
**Goal:** Intelligent form handling with conversational AI using LangChain + LangGraph with Claude

**Phase A: Basic Contact Form**
**Tasks:**
- Design contact section/page
- Implement form validation
- Add email service integration (EmailJS, SendGrid)
- Add success/error animations

**Estimated Effort:** 2 days

**Phase B: LangChain + LangGraph Integration** ⭐
**Goal:** Transform static forms into intelligent, conversational experiences powered by Claude

**Architecture:**
- **LangChain Setup:** Initialize Claude-3.5 Sonnet model via Anthropic API
- **LangGraph State Machine:** Create multi-turn conversation flow for form filling
- **Agent System:** Build specialized agents for different form types

**Use Cases:**

1. **Intelligent Contact Form**
   - Natural language message processing
   - Intent classification (general inquiry, project proposal, collaboration, support)
   - Smart field extraction from conversational input
   - Context-aware follow-up questions
   - Sentiment analysis for priority routing

2. **Project Inquiry Assistant**
   - Multi-step conversation for gathering project requirements
   - Budget and timeline discussion
   - Technology stack recommendations
   - Automatic proposal generation
   - Integration with calendar for scheduling

3. **Career Collaboration Form**
   - Resume/CV parsing and analysis
   - Skill matching against current tech stack
   - Interview scheduling assistant
   - Automated response based on fit score

4. **General Inquiry Chatbot**
   - FAQ handling with RAG (Retrieval-Augmented Generation)
   - Portfolio navigation assistance
   - Project deep-dives with Q&A
   - Automated email drafting for responses

**Technical Implementation:**
```typescript
// LangGraph State Machine Example
interface FormState {
  intent: 'contact' | 'project' | 'career' | 'general';
  extractedFields: Record<string, any>;
  conversationHistory: Message[];
  currentStep: string;
  completionStatus: 'gathering' | 'confirming' | 'complete';
}

// Agents
- MessageClassifierAgent (routes to appropriate handler)
- FieldExtractionAgent (pulls structured data from messages)
- FollowUpAgent (asks clarifying questions)
- ValidationAgent (ensures all required fields collected)
- SummaryAgent (confirms details with user)
- SubmissionAgent (sends email/stores in DB)
```

**LangGraph Flow:**
```
User Input → Classifier → Field Extractor → Validator
                ↓                              ↓
          Intent Router                   Missing Fields?
                ↓                              ↓
         [Specialized Agents]           Follow-Up Agent
                ↓                              ↓
          Summary Agent ← ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘
                ↓
         User Confirmation
                ↓
        Submission Agent → Email/Database
```

**Features:**
- Real-time streaming responses (Claude streaming API)
- Multi-turn conversation memory
- Context preservation across sessions
- Fallback to traditional form if user prefers
- Admin dashboard to review AI-processed submissions
- A/B testing: AI chat vs traditional forms

**Data Storage:**
- Store conversation logs for training/improvement
- Track conversion rates (chat vs traditional)
- Monitor intent classification accuracy
- Gather feedback on AI responses

**Security & Privacy:**
- Rate limiting to prevent abuse
- PII detection and handling
- Conversation encryption
- GDPR compliance for EU visitors
- Option to delete conversation data

**Estimated Effort:** 5-7 days

**Dependencies:**
- `@langchain/anthropic` - Claude integration
- `@langchain/core` - Core LangChain functionality
- `langgraph` - State machine orchestration
- `zod` - Schema validation for extracted fields
- API keys: Anthropic API

**Future Enhancements:**
- Voice input integration (Web Speech API)
- Multi-language support with translation
- Integration with CRM (HubSpot, Salesforce)
- Automated meeting scheduling (Cal.com, Calendly)
- Smart calendar availability checking
- File upload analysis (resumes, design briefs)

#### 3.2 Theme Customization & User Preferences 🎨
**Goal:** Allow visitors to personalize their experience

**Features:**
- **Dark/Light Mode Toggle**
  - System preference detection
  - Manual override with persistence
  - Smooth transition animations
  - Update atmospheric layers and colors dynamically

- **Theme Variants**
  - Multiple color schemes (Cyberpunk, Minimal, Classic, Neon)
  - Custom accent color picker
  - Font size adjustments (accessibility)
  - Reduced motion option (respect prefers-reduced-motion)

- **Preferences Persistence**
  - LocalStorage for quick access
  - Optional user accounts (future) with cloud sync
  - Cookie consent banner with granular controls

**Technical Stack:**
- `next-themes` or custom Context API
- CSS variables for dynamic theming
- Tailwind dark mode utilities
- LocalStorage API

**Estimated Effort:** 3-4 days

---

#### 3.3 Interactive Code Playgrounds ⚡
**Goal:** Showcase technical skills with live, editable code examples

**Features:**
- **Embedded Code Editors**
  - Monaco Editor (VS Code) or CodeMirror
  - Syntax highlighting for multiple languages
  - Live preview pane
  - Auto-formatting and linting

- **Code Sandboxes**
  - React/Vue/Svelte component demos
  - WebContainer API for Node.js execution
  - Shareable links for code snippets
  - Fork and download functionality

- **Use Cases:**
  - Blog posts with interactive examples
  - Project demos with editable code
  - Tutorial walkthroughs
  - Algorithm visualizations

**Technical Stack:**
- `@monaco-editor/react` or `@codemirror/next`
- `@webcontainer/api` for Node.js in browser
- Sandpack (by CodeSandbox) for React components
- Prism.js for static code highlighting

**Estimated Effort:** 4-5 days

---

#### 3.4 Resume/CV Management 📄
**Goal:** Professional resume generation and management

**Features:**
- **Dynamic Resume Builder**
  - Pull data from Strapi (experiences, skills, projects, education)
  - Real-time preview
  - Multiple templates (Modern, Classic, ATS-friendly)
  - Customizable sections

- **Export Options**
  - PDF generation (high-quality)
  - Word document (.docx)
  - JSON/Markdown for developers
  - Print-optimized view

- **Version Control**
  - Save multiple resume versions (Frontend-focused, Full-stack, etc.)
  - Tailored resumes for different job types
  - Track which version sent to whom

**Technical Stack:**
- `react-pdf` or `@react-pdf/renderer` for PDF generation
- `jsPDF` or `puppeteer` for advanced PDF features
- `docx` library for Word exports
- Strapi custom content type for resume versions

**Estimated Effort:** 3-4 days

---

#### 3.5 Real-Time GitHub Integration 📊
**Goal:** Showcase live development activity and open-source contributions

**Features:**
- **GitHub Stats Dashboard**
  - Total repositories, stars, forks
  - Contribution graph (heatmap)
  - Most popular repositories
  - Languages breakdown
  - Recent activity feed

- **Live Metrics**
  - Real-time commit activity
  - Pull requests and issues
  - Code review statistics
  - Contribution streaks

- **Repository Showcases**
  - Auto-sync featured projects from GitHub
  - Live README previews
  - Technology badges from repo topics
  - GitHub Actions status badges

**Technical Stack:**
- GitHub REST API v3 / GraphQL API v4
- Octokit.js for API client
- SWR or React Query for caching
- GitHub webhooks for real-time updates

**Estimated Effort:** 2-3 days

---

#### 3.6 Newsletter & Email Capture 📧
**Goal:** Build audience and maintain engagement

**Features:**
- **Email Subscription**
  - Inline forms throughout site
  - Exit-intent popup (non-intrusive)
  - Newsletter signup incentives
  - Double opt-in confirmation

- **Content Delivery**
  - Weekly/monthly newsletter
  - New blog post notifications
  - Project launch announcements
  - Exclusive content for subscribers

- **Segmentation**
  - Tag subscribers by interests (Frontend, Backend, AI/ML)
  - Personalized content recommendations
  - A/B testing for subject lines
  - Engagement analytics

**Technical Stack:**
- Mailchimp, ConvertKit, or Buttondown
- EmailOctopus (affordable, developer-friendly)
- Resend (modern, great API)
- Custom webhook for Strapi → Email service

**Estimated Effort:** 2-3 days

---

#### 3.7 Meeting Scheduler Integration 📅
**Goal:** Streamline booking for consultations, collaborations, interviews

**Features:**
- **Calendar Booking**
  - Embedded calendar widget
  - Multiple meeting types (15min intro, 30min consult, 1hr interview)
  - Timezone detection and conversion
  - Calendar integrations (Google, Outlook, Apple)

- **Smart Scheduling**
  - Availability based on working hours
  - Buffer time between meetings
  - Automatic reminders (email/SMS)
  - Reschedule and cancellation handling

- **Meeting Preparation**
  - Pre-meeting questionnaire
  - Automatic Zoom/Google Meet link generation
  - Calendar invites with attachments
  - Follow-up email automation

**Technical Stack:**
- Cal.com (open-source, self-hostable)
- Calendly API
- Google Calendar API
- Stripe for paid consultations (optional)

**Estimated Effort:** 2-3 days

---

#### 3.8 Advanced Search Functionality 🔍
**Goal:** Help visitors find relevant content quickly

**Features:**
- **Full-Text Search**
  - Search across all content types (blog, projects, experiences)
  - Real-time search suggestions
  - Fuzzy matching for typos
  - Keyboard shortcuts (Cmd+K / Ctrl+K)

- **Filters & Facets**
  - Filter by content type, date, tags, technologies
  - Sort by relevance, date, popularity
  - Advanced search operators
  - Search history and saved searches

- **Search Analytics**
  - Track popular search queries
  - Identify content gaps
  - Optimize based on search patterns

**Technical Stack:**
- Algolia (fast, comprehensive)
- MeiliSearch (open-source, self-hostable)
- Fuse.js (lightweight, client-side)
- Strapi search plugin

**Estimated Effort:** 3-4 days

---

#### 3.9 Analytics & Tracking 📈
**Goal:** Privacy-friendly analytics with actionable insights

**Plausible Analytics Integration:**
- **Privacy-First Tracking**
  - No cookies, GDPR compliant
  - Lightweight script (<1KB)
  - No personal data collection
  - EU-hosted option available

- **Key Metrics**
  - Page views and unique visitors
  - Traffic sources and referrers
  - Top pages and entry/exit pages
  - Device, browser, OS breakdown
  - Country and region data

- **Custom Events**
  - Section navigation tracking
  - CTA button clicks
  - Resume download tracking
  - Contact form submissions
  - Outbound link clicks
  - Video/demo interactions

- **Goal Tracking**
  - Contact form completions
  - Newsletter signups
  - Meeting bookings
  - Resume downloads
  - Project link clicks

**Additional Analytics:**
- **Core Web Vitals Monitoring**
  - LCP (Largest Contentful Paint)
  - FID (First Input Delay)
  - CLS (Cumulative Layout Shift)
  - Real User Monitoring (RUM)

- **Heatmaps & Session Replay** (optional)
  - Microsoft Clarity (free, privacy-friendly)
  - Hotjar (comprehensive but paid)
  - Session recordings for UX insights

**Technical Stack:**
- Plausible Analytics (self-hosted or cloud)
- `plausible-tracker` npm package
- Web Vitals API
- Microsoft Clarity or Hotjar

**Estimated Effort:** 1-2 days

---

#### 3.10 Progressive Web App (PWA) 📱
**Goal:** Make portfolio installable and work offline

**Features:**
- **Installability**
  - Add to home screen
  - Standalone app experience
  - Custom app icon and splash screen
  - iOS and Android support

- **Offline Support**
  - Service worker for caching
  - Offline page with cached content
  - Background sync for form submissions
  - Cache-first strategy for assets

- **Push Notifications** (optional)
  - New blog post alerts
  - Portfolio updates
  - Announcement broadcasts
  - Opt-in only, respects preferences

- **App Manifest**
  - Name, icons, theme colors
  - Display mode (standalone, fullscreen)
  - Orientation preferences
  - Related applications

**Technical Stack:**
- Astro PWA plugin or manual service worker
- Workbox for caching strategies
- Web Push API for notifications
- `manifest.json` configuration

**Estimated Effort:** 2-3 days

---

#### 3.11 Content Recommendations & Related Posts 🔗
**Goal:** Keep visitors engaged with personalized content

**Features:**
- **Smart Recommendations**
  - Related blog posts based on tags/categories
  - Similar projects based on technology stack
  - "You might also like" sections
  - Recently viewed content

- **Recommendation Algorithm**
  - Content-based filtering (tags, technologies, topics)
  - Collaborative filtering (popular with similar visitors)
  - Hybrid approach combining both
  - ML-based recommendations (future)

- **Engagement Metrics**
  - Track recommendation click-through rates
  - A/B test recommendation algorithms
  - Optimize based on user behavior

**Technical Stack:**
- Custom recommendation engine
- TensorFlow.js for ML (future)
- Graph database for content relationships (Neo4j - optional)
- Redis for caching recommendations

**Estimated Effort:** 3-4 days

---

#### 3.12 RSS Feed & Sitemap Generation 📡
**Goal:** Improve discoverability and reach

**Features:**
- **RSS/Atom Feeds**
  - Full blog post feed
  - Category-specific feeds
  - Project updates feed
  - Podcast feed (if applicable)
  - JSON Feed format

- **XML Sitemap**
  - Automatic generation from Strapi content
  - Priority and change frequency hints
  - Image sitemaps for gallery content
  - Video sitemaps for demos
  - Submit to search engines

- **Robots.txt**
  - Proper crawl rules
  - Sitemap location
  - Disallow admin/private areas

**Technical Stack:**
- Astro RSS plugin or custom generation
- `astro-sitemap` plugin
- Strapi webhooks to regenerate on content changes
- `xml2js` for custom sitemap generation

**Estimated Effort:** 1 day

---

#### 3.13 Social Media Integration 🌐
**Goal:** Extend reach and showcase social proof

**Features:**
- **Social Sharing**
  - Share buttons for blog posts and projects
  - Pre-populated text with hashtags
  - Open Graph meta tags for rich previews
  - Twitter Card support
  - LinkedIn share optimization

- **Social Feeds**
  - Embedded Twitter timeline
  - GitHub activity widget
  - Dev.to/Hashnode blog cross-posting
  - YouTube channel integration
  - LinkedIn posts feed

- **Social Proof**
  - Twitter follower count
  - GitHub stars/followers
  - Dev.to reactions
  - Stack Overflow reputation
  - Social media badges

**Technical Stack:**
- Twitter Embed API
- GitHub Social Cards
- Open Graph meta tags
- Twitter Cards meta tags
- Social share API (`navigator.share`)

**Estimated Effort:** 2-3 days

---

#### 3.14 Internationalization (i18n) 🌍
**Goal:** Reach global audience with multi-language support

**Features:**
- **Language Support**
  - English (default)
  - Spanish, French, German (priority languages)
  - Language switcher in navigation
  - URL-based language detection (/es/, /fr/)
  - Browser language detection

- **Content Translation**
  - Strapi internationalization plugin
  - Separate content versions per language
  - Fallback to default language
  - Translation management interface

- **Localization**
  - Date and time formatting
  - Number formatting
  - Currency localization (for pricing)
  - RTL language support (Arabic, Hebrew - future)

**Technical Stack:**
- `astro-i18n` or `i18next`
- Strapi i18n plugin
  - Intl API for formatting
- `react-i18next` for React components

**Estimated Effort:** 4-5 days

---

#### 3.15 Admin Dashboard 📊
**Goal:** Custom analytics and content management interface

**Features:**
- **Portfolio Analytics Dashboard**
  - Visitor statistics (from Plausible API)
  - Popular content reports
  - Traffic source breakdown
  - Conversion metrics
  - Custom date range filtering

- **Content Management**
  - Quick publish/unpublish
  - Bulk operations
  - Content calendar view
  - Draft management
  - Version history

- **Lead Management**
  - Contact form submissions
  - Newsletter subscribers
  - Meeting requests
  - AI chat conversations
  - Lead scoring and qualification

- **System Health**
  - Build status monitoring
  - API health checks
  - Error logs and alerts
  - Performance metrics
  - Database backup status

**Technical Stack:**
- Next.js admin app (separate from portfolio)
- Strapi Admin Panel (extended)
- Recharts or Chart.js for visualizations
- Plausible API for analytics data
- Tailwind Admin UI components

**Estimated Effort:** 5-7 days

---

#### 3.16 Music Player & Compositions Showcase 🎵
**Goal:** Background music player throughout portfolio + dedicated music showcase page

**Background Music Player:**
- **Persistent Playback**
  - Plays your composed music playlist throughout entire portfolio
  - Continues seamlessly when navigating between pages/sections
  - Uses Astro View Transitions API to prevent audio interruption
  - Auto-advances to next track when current track ends

- **Playback Controls**
  - Controlled by existing toolbar audio button (play/pause/mute)
  - Additional controls in Settings Panel:
    - Enable/disable background music
    - Volume slider
    - Shuffle mode toggle
    - Repeat mode (off/one/all)
  - Keyboard shortcuts (Space = play/pause, Arrow keys = skip)

- **Mini Player Widget**
  - Always-visible compact player (bottom-right corner)
  - Shows: Current track title, artist, album art
  - Controls: Play/pause, previous, next, volume
  - Progress bar with seek functionality
  - Click to expand or navigate to `/music` page
  - Minimize/collapse option

**Dedicated `/music` Page:**
- **Full Music Showcase**
  - Complete playlist/discography view
  - Track cards with:
    - Album art/cover image
    - Title, genre, duration, composition date
    - Description/inspiration story
    - Play/pause button
    - Waveform visualization (wavesurfer.js)
    - Download option (optional)
    - Share buttons (Twitter, Facebook, copy link)

- **Advanced Player**
  - Large waveform with seek/scrub
  - Equalizer visualization (optional)
  - Lyrics display (if applicable)
  - Related tracks/recommendations
  - "Add to Queue" functionality

- **Playlist Management**
  - Filter by genre, year, mood
  - Sort by date, duration, title
  - Search functionality
  - Featured/pinned tracks at top
  - Total playtime counter

**Strapi CMS Content Type: "Compositions"**
```typescript
interface Composition {
  id: string;
  title: string;
  slug: string;
  artist: string; // Your name
  genre: string[];
  duration: number; // in seconds
  compositionDate: Date;
  description: string; // Inspiration, story behind the piece
  albumArt: Media; // Cloudinary image
  audioFile: Media; // Cloudinary audio file (MP3/WAV)
  waveformData?: string; // Pre-generated waveform JSON
  lyrics?: string; // Optional
  isFeatured: boolean;
  order: number; // Playlist order
  downloadEnabled: boolean;
  metadata: {
    bpm?: number;
    key?: string;
    instruments?: string[];
    software?: string[]; // DAW used
  };
}
```

**Technical Stack:**
- **Audio Engine:** Howler.js (robust playlist, cross-fade, buffering)
- **Waveform:** wavesurfer.js or react-wavesurfer
- **State Management:**
  - Extend AnimationContext → MusicContext
  - Persist playlist state in localStorage
  - TanStack Query for fetching compositions from Strapi
- **View Transitions:** Astro View Transitions API for seamless navigation
- **Audio Hosting:** Cloudinary (with audio optimization)
- **UI Components:** ShadCN UI (Slider, Progress, Dialog)

**Integration with Existing Systems:**
- **Toolbar Audio Button:**
  - Currently controls: `isSoundMuted` (UI sound effects)
  - Will now control: Background music + UI sounds
  - Options:
    1. Single toggle (mutes everything)
    2. Separate toggles (music vs. sound effects) - *Recommended*

- **Settings Panel:**
  - Add "Music" section:
    - Enable/Disable background music
    - Volume control (0-100%)
    - Shuffle toggle
    - Repeat mode dropdown
    - "Open Music Player" button

- **AnimationContext Extension:**
  ```typescript
  interface MusicState {
    isPlaying: boolean;
    currentTrack: Composition | null;
    playlist: Composition[];
    volume: number;
    shuffle: boolean;
    repeat: 'off' | 'one' | 'all';
    queue: Composition[];
  }
  ```

**User Experience Flow:**
1. **First Visit:**
   - Music is paused by default
   - Show tooltip on audio button: "Enable background music"
   - Or show one-time modal: "Would you like to listen to my compositions while browsing?"

2. **During Navigation:**
   - Music continues playing seamlessly between pages
   - Mini player visible at all times (unless minimized)
   - Track changes shown with subtle notification

3. **On `/music` Page:**
   - Full player takes center stage
   - Can browse tracks while current track plays
   - Click track to play immediately
   - Can add to queue or play next

**Accessibility Considerations:**
- ARIA labels for all player controls
- Keyboard navigation support
- Screen reader announcements for track changes
- Respect `prefers-reduced-motion` (disable visualizations)
- Option to disable autoplay
- Captions/transcripts for any spoken content

**Performance Optimizations:**
- Lazy load audio files (only load current + next track)
- Pre-generate waveform data (don't compute client-side)
- Compress audio files (320kbps MP3 or AAC)
- Use audio sprites for short UI sounds
- Service Worker for offline playback (PWA)

**Analytics Tracking (Plausible Events):**
- `music_play` - Track played
- `music_pause` - Track paused
- `music_skip` - Track skipped
- `music_download` - Track downloaded
- `music_share` - Track shared
- Track play duration (engagement metric)

**Estimated Effort:** 4-6 days
- Day 1: Strapi content type + Howler.js integration
- Day 2: Mini player widget + Astro View Transitions setup
- Day 3: `/music` page layout + track cards
- Day 4: Waveform visualization + advanced player
- Day 5: Settings Panel integration + keyboard shortcuts
- Day 6: Testing, accessibility, performance optimization

---

#### 3.16.1 Strudel.cc Live Coding Integration 🎹⚡
**Goal:** Interactive TidalCycles/Strudel patterns showcase - Unique differentiator combining code + music

**Why This is Brilliant:**
- ✅ **Unique Differentiator** - Very few portfolios combine live coding + music
- ✅ **Technical Showcase** - Demonstrates algorithmic composition + advanced programming
- ✅ **Interactive Learning** - Educational for visitors
- ✅ **High Engagement** - Visitors can modify and hear patterns instantly
- ✅ **Dual Expertise** - Shows mastery of both music and code

**Implementation Phases:**

**Phase 1: Pattern Code Display (Essential - 1-2 days)**

*Goal: Show TidalCycles code behind each composition*

- **Strapi Content Type Extension:**
  ```typescript
  interface Composition {
    // ... existing fields

    // TidalCycles/Strudel specific:
    strudelPattern?: string;        // The TidalCycles code
    isLiveCoded: boolean;            // Was this live coded?
    patternComplexity: 'beginner' | 'intermediate' | 'advanced';
    allowRemix: boolean;             // Can visitors modify?
    strudelVersion: string;          // Version compatibility
    patternDescription?: string;     // Explain the pattern
    patternTags: string[];           // e.g., ['percussion', 'polyrhythm', 'ambient']
  }
  ```

- **Track Card Enhancement:**
  ```tsx
  // Each track shows:
  - [▶️ Play Audio] (Howler.js player)
  - [🎹 View Pattern Code] (New button)

  // When clicked → Modal/Expandable section:
  ┌─────────────────────────────────────────┐
  │ TidalCycles Pattern                     │
  ├─────────────────────────────────────────┤
  │ s "bd*4 sd*2 hh*8"                      │
  │ # gain "0.8"                            │
  │ # speed (slow 4 $ range 0.5 2 $ sine)   │
  │ # room 0.3                              │
  ├─────────────────────────────────────────┤
  │ [▶️ Run Live] [📋 Copy Code]            │
  └─────────────────────────────────────────┘
  ```

- **Features:**
  - Syntax-highlighted code display (CodeMirror or Prism)
  - Read-only pattern viewer
  - Copy to clipboard functionality
  - Pattern complexity badge
  - "What does this do?" explanation tooltip

**Phase 2: Interactive Strudel Player (High Value - 3-4 days)**

*Goal: Let visitors run and modify patterns in browser*

- **Strudel SDK Integration:**
  ```bash
  pnpm add @strudel/core @strudel/webaudio @strudel/react @strudel/codemirror
  ```

- **StrudelPlayer Component:**
  ```typescript
  // components/music/StrudelPlayer.tsx
  import { evaluate } from '@strudel/core';
  import { getAudioContext, webaudioOutput } from '@strudel/webaudio';
  import { StrudelMirror } from '@strudel/codemirror';

  interface StrudelPlayerProps {
    pattern: string;
    editable?: boolean;
    autoplay?: boolean;
    showControls?: boolean;
  }

  export function StrudelPlayer({
    pattern,
    editable = false,
    autoplay = false,
    showControls = true
  }: StrudelPlayerProps) {
    const [code, setCode] = useState(pattern);
    const [isPlaying, setIsPlaying] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const playPattern = async () => {
      try {
        const ctx = getAudioContext();
        const { pattern: parsedPattern } = await evaluate(code);

        parsedPattern
          .pipe(webaudioOutput)
          .start();

        setIsPlaying(true);
        setError(null);
      } catch (err) {
        setError(err.message);
      }
    };

    return (
      <div className="strudel-player bg-black/20 backdrop-blur-lg rounded-xl p-6">
        {editable ? (
          <StrudelMirror
            value={code}
            onChange={setCode}
            theme="dark"
            height="200px"
          />
        ) : (
          <pre className="text-emerald-400 font-mono text-sm">
            <code>{code}</code>
          </pre>
        )}

        {error && (
          <div className="mt-2 text-red-400 text-sm">{error}</div>
        )}

        {showControls && (
          <div className="mt-4 flex gap-4">
            <button
              onClick={playPattern}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg"
            >
              {isPlaying ? '⏸️ Stop' : '▶️ Run Pattern'}
            </button>

            {editable && (
              <>
                <button
                  onClick={() => setCode(pattern)}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg"
                >
                  🔄 Reset
                </button>

                <button
                  onClick={() => navigator.clipboard.writeText(code)}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg"
                >
                  📋 Copy
                </button>
              </>
            )}
          </div>
        )}
      </div>
    );
  }
  ```

- **Dual Playback Mode:**
  ```tsx
  // Toggle between pre-rendered audio and live pattern
  const [playbackMode, setPlaybackMode] = useState<'audio' | 'pattern'>('audio');

  return (
    <>
      {playbackMode === 'audio' ? (
        <HowlerPlayer src={composition.audioFile} />
      ) : (
        <StrudelPlayer
          pattern={composition.strudelPattern}
          editable={composition.allowRemix}
        />
      )}

      {composition.strudelPattern && (
        <div className="mt-4">
          <button
            onClick={() => setPlaybackMode(
              playbackMode === 'audio' ? 'pattern' : 'audio'
            )}
            className="text-emerald-400 hover:text-emerald-300"
          >
            {playbackMode === 'audio'
              ? '🎹 Run Live Pattern'
              : '🎵 Play Recording'}
          </button>
        </div>
      )}
    </>
  );
  ```

**Phase 3: Dedicated Playground Page (Advanced - 2-3 days)**

*Goal: Full interactive TidalCycles REPL for experimentation*

- **New Route: `/music/playground`**

- **Features:**
  - **Full Strudel Editor** - Multi-line code editor with syntax highlighting
  - **Pattern Library** - Pre-made starter patterns
    - "Minimal Kick Drum"
    - "Polyrhythmic Percussion"
    - "Ambient Drone"
    - "Your Signature Patterns"

  - **Interactive Tutorial Mode**
    ```markdown
    Step 1: Try this basic pattern
    → s "bd sd"

    Step 2: Add some hi-hats
    → s "bd sd hh*4"

    Step 3: Modulate the speed
    → s "bd sd hh*4" # speed (range 0.5 2 $ slow 4 $ sine)
    ```

  - **Save & Share**
    - Generate shareable URLs
    - localStorage persistence
    - Export pattern as .tidal file

  - **Audio Controls**
    - BPM slider
    - Volume control
    - Cycle length adjustment
    - Pattern scheduling/queue

  - **Visual Feedback**
    - Mini pianoroll visualization
    - Waveform preview
    - Cycle timeline

**Phase 4: Advanced Features (Optional - 3-4 days)**

- **`/music/live-coding` Page**
  - Video recordings of live coding sessions
  - Synchronized code display
  - Interactive timeline (jump to specific patterns)
  - Download patterns from videos

- **`/tutorials/tidal-cycles` Page**
  - "Getting Started with TidalCycles"
  - Pattern breakdown with annotations
  - Interactive exercises
  - Advanced techniques showcase

- **Atmospheric Integration** 🤯
  ```javascript
  // Pattern controls atmospheric layers!
  s("bd sd hh sd")
    .gain(0.8)
    .onTrigger((time, value) => {
      // Emit event to change atmospheric layer
      if (value.note === 'bd') updateAtmosphere('troposphere');
      if (value.note === 'hh') updateAtmosphere('exosphere');
    });
  ```

  - Music literally changes the visual atmosphere
  - Real-time sync between audio and Three.js scene
  - Different instruments → different atmospheric effects
  - Pattern complexity → particle density

- **Pattern Sharing & Remix**
  - Community pattern submissions
  - Remix existing patterns
  - Pattern voting/favorites
  - Pattern versioning

**Technical Stack:**
- **Strudel Core**: `@strudel/core` - Pattern evaluation engine
- **Strudel Web Audio**: `@strudel/webaudio` - Browser audio output
- **Strudel React**: `@strudel/react` - React components
- **Strudel CodeMirror**: `@strudel/codemirror` - Code editor integration
- **Strudel Mini**: `@strudel/mini` - Mini notation parser
- **Tone.js** - Additional audio synthesis (if needed)

**User Experience Flows:**

1. **Discovery Flow:**
   ```
   User visits /music → Clicks track → Sees "View Pattern Code"
   → Mind blown: "This is code?!" → Clicks "Run Live"
   → Modifies pattern → Hears result → Downloads music + follows
   ```

2. **Educational Flow:**
   ```
   User finds /music/playground → Tries example patterns
   → Reads tutorials → Experiments with own patterns
   → Appreciates expertise → Contacts for collaboration
   ```

3. **Developer Appeal:**
   ```
   Developer visits portfolio → Sees "Algorithmic Composition"
   → "Code-generated music!" → Tries interactive patterns
   → Impressed by unique skill combo → Hires/follows
   ```

**Competitive Advantages:**

| Feature | Your Portfolio | Typical Music Portfolio |
|---------|----------------|-------------------------|
| Music Player | ✅ Yes | ✅ Yes |
| Live Coding | ✅ **Strudel/TidalCycles** | ❌ No |
| Interactive Patterns | ✅ **Editable in browser** | ❌ No |
| Code + Audio | ✅ **Side-by-side** | ❌ No |
| Educational | ✅ **Tutorials + Playground** | ❌ No |
| Visual Sync | ✅ **Atmospheric integration** | ❌ No |
| Unique Factor | 🔥 **10/10** | 3/10 |

**Analytics Tracking (Additional):**
- `strudel_pattern_view` - Pattern code viewed
- `strudel_pattern_run` - Pattern executed live
- `strudel_pattern_edit` - Pattern modified by user
- `strudel_pattern_copy` - Pattern code copied
- `strudel_playground_visit` - Playground page visited
- `strudel_tutorial_complete` - Tutorial completed
- Track most popular patterns

**Accessibility Considerations:**
- Screen reader descriptions for pattern code
- Keyboard shortcuts for playback (Space = play/pause)
- Visual indicators for audio playback
- Option to disable auto-play
- Pattern complexity warnings

**Performance Optimizations:**
- Lazy load Strudel SDK (only on /music pages)
- Web Worker for pattern compilation
- Audio buffering for smooth playback
- Throttle pattern evaluation
- Cache compiled patterns

**SEO Benefits:**
- "TidalCycles portfolio"
- "Live coding music portfolio"
- "Algorithmic composition showcase"
- "Interactive music patterns"
- Unique content = better ranking

**Estimated Total Effort:**
- **Phase 1** (Essential): 1-2 days
- **Phase 2** (High Value): 3-4 days
- **Phase 3** (Playground): 2-3 days
- **Phase 4** (Advanced): 3-4 days
- **Total**: 9-13 days for complete implementation

**Recommended Approach:**
1. Start with Phase 1 (pattern display) - Quick win
2. Add Phase 2 (interactive player) - High engagement
3. Phase 3 & 4 can be added incrementally based on user feedback

---

#### 3.17 Payment Processing & Monetization 💳
**Goal:** Enable paid services, digital products, and premium content

**Stripe Integration:**
- **Setup & Configuration**
  - Create Stripe account
  - Install Stripe SDK (`@stripe/stripe-js`, `stripe` for backend)
  - Set up webhook endpoints for payment events
  - Configure products and pricing in Stripe Dashboard
  - Set up payment intents for secure checkout

**Use Cases:**

1. **Paid Consultations**
   - Hourly consulting ($100-300/hour)
   - Code review services ($50-150 per review)
   - Technical mentoring packages
   - Integration with Cal.com for paid bookings
   - Automatic calendar invites after payment

2. **Digital Product Sales**
   - **Music Downloads**
     - Individual track purchases ($0.99-$2.99)
     - Album/collection bundles ($9.99-$19.99)
     - Lossless audio format options (FLAC, WAV)
     - Automatic download link after payment
     - Integration with `/music` page

   - **Developer Resources**
     - Resume templates ($19-$49)
     - Code starter kits ($29-$99)
     - Component libraries
     - Video tutorial series
     - Premium blog content access

3. **Subscription/Membership (Optional)**
   - Monthly membership for exclusive content
   - Early access to new blog posts
   - Private Discord community
   - Monthly Q&A sessions
   - Exclusive music releases

**Technical Implementation:**

```typescript
// Stripe checkout flow
interface CheckoutItem {
  type: 'consultation' | 'music' | 'product' | 'subscription';
  productId: string;
  priceId: string;
  quantity: number;
}

// Example: Music purchase
const handleMusicPurchase = async (compositionId: string) => {
  const session = await createCheckoutSession({
    line_items: [{
      price: composition.stripePriceId,
      quantity: 1,
    }],
    mode: 'payment',
    success_url: `${origin}/music/download?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/music/${composition.slug}`,
    metadata: {
      compositionId,
      type: 'music_download',
    },
  });

  // Redirect to Stripe checkout
  window.location.href = session.url;
};
```

**Webhook Handling:**
- `checkout.session.completed` - Send download links, update database
- `payment_intent.succeeded` - Confirm payment, trigger fulfillment
- `customer.subscription.created` - Grant membership access
- `customer.subscription.deleted` - Revoke membership access

**Security:**
- Server-side price verification (never trust client)
- Webhook signature verification
- Idempotency keys for payment retries
- PCI compliance (handled by Stripe)
- Secure download link generation with expiration

**Strapi Integration:**
- Add Stripe product/price IDs to content types
- Store purchase history in Strapi
- Track revenue analytics
- Customer management

**UI Components:**
- **Pricing Cards** - Display products with prices
- **Checkout Button** - Initiate Stripe checkout
- **Payment Status** - Success/error pages
- **Order History** - User dashboard with past purchases
- **Download Manager** - Secure file downloads

**Analytics Tracking:**
- Purchase completion rate
- Revenue per product
- Cart abandonment rate
- Customer lifetime value
- Popular products

**Estimated Effort:** 3-4 days

---

#### 3.18 Extended Social Media & Platform Integration 🌐
**Goal:** Expand social presence and cross-platform content syndication

**YouTube Integration:**
- **Channel Stats Widget**
  - Subscriber count (live)
  - Total video views
  - Latest uploads grid
  - Featured playlist

- **Video Embeds**
  - Embedded videos in blog posts
  - Coding tutorials showcase
  - Music composition videos
  - Portfolio walkthroughs
  - Behind-the-scenes content

- **Implementation:**
  ```typescript
  // YouTube Data API v3
  const fetchChannelStats = async () => {
    const response = await fetch(
      `https://youtube.googleapis.com/youtube/v3/channels?part=statistics&id=${CHANNEL_ID}&key=${API_KEY}`
    );
    return response.json();
  };
  ```

**LinkedIn Integration:**
- **Profile Data Sync**
  - Automatic experience updates from LinkedIn
  - Skills endorsements display
  - Recommendations import
  - Company logos from LinkedIn

- **LinkedIn Posts Feed**
  - Embed recent posts
  - Share blog posts automatically to LinkedIn
  - Show engagement metrics (likes, comments)

- **Implementation:**
  - OAuth 2.0 authentication
  - LinkedIn API v2
  - Webhook for profile changes

**Dev.to & Hashnode Integration:**
- **Cross-Posting**
  - Automatically publish blog posts to Dev.to
  - Canonical URL pointing back to portfolio
  - Sync article updates
  - Import reactions/comments

- **Activity Feed**
  - Show latest articles
  - Display reaction counts
  - Follower count badges

**Spotify Integration (for Music):**
- **Artist Profile**
  - Link to Spotify artist page
  - Show follower count
  - Monthly listeners stat
  - Top tracks widget

- **Embed Spotify Player**
  - Featured playlist
  - Latest releases
  - Integration with `/music` page

**SoundCloud Integration:**
- **Track Embeds**
  - Alternative to Howler.js player
  - Show play counts, likes, reposts
  - Comment integration

- **Playlist Widget**
  - Showcase full discography
  - Auto-sync new uploads

**Twitter/X Integration:**
- **Timeline Widget**
  - Embedded timeline
  - Latest tweets
  - Filter by topic/hashtag

- **Tweet Cards**
  - Rich previews for shared blog posts
  - Optimized images
  - Twitter Cards meta tags

**GitHub Integration (Enhanced):**
- Already planned in 3.5, but add:
  - **GitHub Sponsors** - Show sponsor tiers and backers
  - **Gists** - Embed code snippets
  - **Discussions** - Community Q&A
  - **GitHub Actions** - Build status badges

**Instagram Integration (Optional):**
- **Photo Grid**
  - Portfolio screenshots
  - Behind-the-scenes
  - Music production process
  - Workspace photos

**Platform Priority:**
| Platform | Priority | Reason |
|----------|----------|--------|
| YouTube | High | Video tutorials, music, demos |
| LinkedIn | High | Professional network, job opportunities |
| GitHub | High | Code portfolio (already planned) |
| Dev.to | Medium | Developer community reach |
| Spotify/SoundCloud | Medium | Music distribution |
| Twitter/X | Medium | Quick updates, engagement |
| Instagram | Low | Visual content (if applicable) |

**Cross-Platform Analytics:**
- Unified dashboard showing metrics from all platforms
- Total reach and engagement
- Best performing content
- Audience demographics

**Estimated Effort:** 4-5 days

---

#### 3.19 Additional API Integrations & Creative Features 🔌
**Goal:** Unique integrations that differentiate the portfolio

**Weather-Based Atmospheric Effects:**
- **Weather API Integration**
  - OpenWeatherMap or WeatherAPI
  - Detect user's location (with permission)
  - Fetch current weather conditions

- **Dynamic Atmospheric Layers**
  ```typescript
  // Map weather to atmospheric effects
  const weatherToAtmosphere = {
    'Clear': 'exosphere',      // Clear skies
    'Clouds': 'stratosphere',   // Cloudy
    'Rain': 'troposphere',      // Rainy/stormy
    'Snow': 'mesosphere',       // Snow
    'Thunderstorm': 'special_storm_layer'
  };
  ```

- **Visual Effects:**
  - Rain particles for rainy weather
  - Snow particles for snow
  - Lightning flashes for thunderstorms
  - Sunset gradient for evening
  - Star field for night time

**Spotify "Now Playing":**
- Show what you're currently listening to
- Updates in real-time (WebSocket or polling)
- Display album art, track name, artist
- Optional playback controls
- Privacy toggle

**WakaTime Integration:**
- **Coding Activity Stats**
  - Total coding time this week
  - Most used languages
  - Most productive day
  - Current coding streak
  - Projects worked on

- **Live Coding Indicator**
  - "Currently coding in: TypeScript"
  - Real-time activity badge
  - GitHub-style contribution graph

**Geolocation Features:**
- **Personalized Greeting**
  - "Good morning from San Francisco!" → "Hello from [User's City]!"
  - Local time display
  - Timezone-aware scheduling

- **Location-Based Content**
  - Show projects relevant to user's region
  - Language preference by country
  - Currency localization for Stripe

**RSS Feed Aggregation:**
- **Multi-Source Content**
  - Aggregate blog posts from Medium, Dev.to, personal blog
  - Show latest across all platforms
  - Unified content timeline
  - Auto-deduplicate cross-posts

**Notion Integration (Alternative CMS):**
- **Content Management**
  - Use Notion as lightweight CMS
  - Fetch blog posts from Notion database
  - Sync projects and experiences
  - Simpler than Strapi for solo developer

- **Benefits:**
  - Familiar interface
  - Easy collaboration
  - Version history
  - Mobile editing

**Airtable Integration:**
- **Flexible Database**
  - Testimonials database
  - Project tracker
  - Contact form submissions
  - Analytics dashboard

**Twilio Integration:**
- **SMS Notifications**
  - Meeting reminders
  - New contact form submission alerts
  - Important portfolio updates
  - Two-factor authentication (if needed)

**Email Service (SendGrid/Resend):**
- **Transactional Emails**
  - Contact form auto-replies
  - Newsletter delivery
  - Purchase confirmations (Stripe)
  - Meeting confirmations
  - Download links for digital products

**Calendar Sync (Google Calendar):**
- **Availability Display**
  - Show real-time availability on `/contact` page
  - "Next available slot: Tomorrow at 2pm"
  - Automatic booking updates

**Ko-fi Integration (You already have an account!):**
- **Why Ko-fi + Stripe Together:**
  - **Ko-fi:** Tips, donations, general support, music appreciation
  - **Stripe:** Music downloads, consultation bookings, digital products
  - Ko-fi is simpler (no backend needed), Stripe gives more control

- **Integration Methods:**
  1. **Floating Widget** - Bottom-right corner on all pages
  2. **Button Component** - Strategic placement (footer, music page, blog posts)
  3. **Goal Widget** - Show funding goals for projects/albums
  4. **Donation Panel** - Dedicated `/support` page

- **Strategic Placement:**
  - **Music Page** - "Enjoyed this track? Buy me a coffee!"
  - **Blog/Articles** - End of each post
  - **Footer** - Persistent support link
  - **Project Pages** - Support specific projects
  - **About Page** - General support section

- **Implementation:**
  ```tsx
  // components/KofiButton.tsx
  import { Coffee } from '@mynaui/icons-react';

  interface KofiButtonProps {
    variant?: 'widget' | 'button' | 'minimal';
    trackName?: string; // For music page tips
    color?: string;
  }

  export function KofiButton({
    variant = 'button',
    trackName,
    color = '#FF5E5B'
  }: KofiButtonProps) {
    const kofiUrl = trackName
      ? `https://ko-fi.com/yourusername?message=${encodeURIComponent(`Loved "${trackName}"!`)}`
      : 'https://ko-fi.com/yourusername';

    if (variant === 'widget') {
      // Ko-fi floating widget script
      return (
        <script
          src='https://storage.ko-fi.com/cdn/scripts/overlay-widget.js'
          data-kofi-username="yourusername"
          data-kofi-color={color}
          data-kofi-text="Support Me"
        />
      );
    }

    if (variant === 'minimal') {
      return (
        <a
          href={kofiUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm hover:text-primary transition"
        >
          <Coffee className="w-4 h-4" />
          Buy me a coffee
        </a>
      );
    }

    return (
      <a
        href={kofiUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FF5E5B] hover:bg-[#e54d4a] text-white font-medium transition"
      >
        <Coffee className="w-5 h-5" />
        Buy me a coffee
      </a>
    );
  }
  ```

  ```tsx
  // Usage in Music Page
  <div className="composition-card">
    <h3>{composition.title}</h3>
    <audio src={composition.audioUrl} />

    <div className="flex gap-2 mt-4">
      {composition.downloadEnabled && (
        <StripeDownloadButton
          compositionId={composition.id}
          price={0.99}
        />
      )}
      <KofiButton
        variant="button"
        trackName={composition.title}
      />
    </div>
  </div>
  ```

- **Ko-fi Features to Use:**
  - **Membership Tiers** - Alternative to Patreon (exclusive content, early access)
  - **Goal Widgets** - "Help me buy new music equipment!"
  - **Shop Integration** - Sell digital sheet music, project files
  - **Commissions** - Offer custom composition services

- **Analytics Tracking:**
  ```tsx
  const trackKofiClick = (trackName?: string) => {
    // Analytics event
    window.plausible?.('Ko-fi Click', {
      props: {
        location: window.location.pathname,
        track: trackName || 'general'
      }
    });
  };
  ```

**GitHub Sponsors:**
- **Open Source Support**
  - Show sponsor tiers
  - Display current sponsors
  - One-time or monthly sponsorship
  - Integration with GitHub profile

**Creative/Unique APIs:**
- **Quotes API** - Inspirational tech quotes on page load
- **NASA API** - Astronomy Picture of the Day in background
- **Unsplash API** - Dynamic hero images
- **Cat API / Dog API** - Easter egg for fun interactions
- **Chuck Norris Jokes API** - Developer humor in 404 page

**Integration Priority:**
| Integration | Priority | Effort | Value |
|-------------|----------|--------|-------|
| **Ko-fi** | **High** | **0.25 day** | **High (you already have account!)** |
| Weather API | High | 1 day | High (unique UX) |
| WakaTime | Medium | 0.5 day | Medium (developer credibility) |
| SendGrid/Resend | High | 1 day | High (essential for forms) |
| YouTube API | Medium | 1 day | Medium (content showcase) |
| LinkedIn API | Medium | 1 day | Medium (professional presence) |
| Spotify Now Playing | Low | 0.5 day | Low (nice-to-have) |
| Notion API | Medium | 2 days | Medium (CMS alternative) |
| Geolocation | Low | 0.5 day | Low (personalization) |

**Estimated Effort:** 5-7 days (for high-priority integrations)

**Quick Wins (Implement First):**
1. **Ko-fi** (15-30 minutes) - Since you already have an account, just add the widget/button
2. **SendGrid/Resend** (1 day) - Essential for contact forms
3. **Weather API** (1 day) - Unique atmospheric effects

---

### 4. SEO & Accessibility

#### 4.1 SEO Optimization
**Tasks:**
- Add meta tags for all pages
- Generate sitemap.xml
- Implement structured data (JSON-LD)
- Add Open Graph tags for social sharing
- Optimize images (lazy loading, WebP format)

#### 4.2 Accessibility Audit
**Tasks:**
- WCAG 2.1 AA compliance check
- Keyboard navigation testing
- Screen reader testing
- Color contrast improvements
- ARIA labels audit

### 5. DevOps & Deployment

#### 5.1 CI/CD Pipeline
**Tasks:**
- Automated testing on PR
- Automated builds
- Preview deployments for PRs
- Production deployment automation

#### 5.2 Performance Monitoring
**Tasks:**
- Set up Lighthouse CI
- Core Web Vitals monitoring
- Error tracking (Sentry)
- Performance budgets

---

## Recommended Execution Order

### ⭐ Animations-First Approach (CURRENT DECISION)

**Start with clean code, THEN build infrastructure on solid foundation**

1. **Week 1-2:** **Phase 1 - Animations Refactoring** (8-10 days)
   - Create PortfolioContext & AnimationContext
   - Build useToolbarState & useModalManager hooks
   - Extract components from Section.tsx
   - Reduce Section.tsx from 324 → ~150 lines
   - Comprehensive testing

2. **Week 2-3:** Phase 0.1 (Monorepo restructuring)
3. **Week 3-4:** Phase 0.2 (Strapi CMS setup and content types)
4. **Week 4:** Phase 0.3 (Deployment configuration - Vercel + Railway)
5. **Week 4-5:** Phase 0.4 (Content migration and API integration)
6. **Week 6:** Phase 2 (Component Architecture) - Scene optimization
7. **Week 7:** Phase 3 (Performance optimization)
8. **Week 8:** Phase 4.1-4.2 (TypeScript improvements + Configuration)
9. **Week 9-10:** Phase 4.3 (Design System - Figma, Storybook, Chromatic)
10. **Week 11+:** Next Steps (New pages, LangChain integration, features, SEO)

---

### Alternative: Infrastructure-First Approach

If you prefer to build infrastructure before code refactoring:

1. **Week 1-2:** Phase 0.1 (Monorepo restructuring)
2. **Week 2-3:** Phase 0.2 (Strapi CMS setup and content types)
3. **Week 3:** Phase 0.3 (Deployment configuration - Vercel + Railway)
4. **Week 3-4:** Phase 0.4 (Content migration and API integration)
5. **Week 5-6:** Phase 1 (Animations Refactoring)
6. **Week 6-7:** Phase 2.2-2.3 (Scene optimization + Section standardization)
7. **Week 7-8:** Phase 3 (Performance optimization)
8. **Week 8:** Phase 4 (TypeScript improvements)
9. **Week 9+:** Next Steps (New pages, LangChain integration, features, SEO)

---

### 🎯 Why Animations-First? (RECOMMENDED)

**Benefits of Refactoring First:**
1. **Cleaner foundation** - Well-structured code before infrastructure complexity
2. **Easier to migrate** - Clean code is simpler to move into monorepo
3. **Immediate value** - Improved maintainability and performance now
4. **Better understanding** - Learn the codebase deeply before restructuring
5. **Lower risk** - Smaller, focused changes vs. large infrastructure shifts
6. **Faster iterations** - Test and validate refactoring quickly
7. **Team alignment** - Everyone works with clean code from day one

**Specific Advantages:**
- Section.tsx refactoring makes future changes easier
- Context providers work the same in monorepo
- Hooks are portable to packages without modification
- Components already modular for potential package extraction
- Testing suite validates refactoring before infrastructure changes

**When Infrastructure-First Makes Sense:**
- Multiple team members need to work in parallel
- Content team is ready to populate CMS immediately
- Deployment urgency for production site
- External dependencies on CMS API

---

## Success Metrics

**Code Quality:**
- Reduce average component size by 30%
- Achieve 80%+ type coverage
- Zero ESLint errors

**Performance:**
- Lighthouse score: 90+ (Performance, Accessibility, Best Practices, SEO)
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
- Bundle size reduction: 20%

**Developer Experience:**
- Reduce PR review time by 40%
- Faster feature development
- Easier onboarding for new contributors

---

## Current Progress Tracking

### Completed Tasks (Recent Session)
- ✅ Icons switched to @mynaui/icons-react for dropdown menu
- ✅ Scroll down indicator with delay and fade transition
- ✅ Toolbar panels with backdrop and mutual exclusivity (click outside to close)
- ✅ Resume button improved with gradient, download icon, and shine effect
- ✅ Comprehensive refactor plan created with detailed phases
- ✅ **Prioritized Phase 1 (Animations Refactoring) as FIRST step**

---

### 🎯 NEXT: Phase 1 - Animations Refactoring (PRIORITY)

**Goal:** Refactor `src/components/animations` folder before infrastructure work

**Timeline:** 8-10 days

#### 1.1 State Management (2 days)
- ⏳ Create `contexts/PortfolioContext.tsx`
  - Centralize currentSection, scrollProgress, modals, panels
  - Export usePortfolio hook

- ⏳ Create `contexts/AnimationContext.tsx`
  - Manage capabilities, isSoundMuted, mounted state
  - Export useAnimation hook

- ⏳ Create `hooks/useToolbarState.ts`
  - Consolidate panel management (info, settings, social)
  - Mutual exclusivity logic

- ⏳ Create `hooks/useModalManager.ts`
  - Unified modal management for experience/award modals
  - Single source of modal state

#### 1.2 Component Extraction (5-6 days)
- ⏳ Extract `overlays/AtmosphericOverlays.tsx`
  - Move all atmospheric overlay rendering
  - Troposphere, Stratosphere overlays

- ⏳ Extract `background/DynamicBackground.tsx`
  - Encapsulate background styling logic
  - Use atmospheric layer for dynamic styles

- ⏳ Extract `canvas/AnimationCanvas.tsx`
  - Three.js Canvas component
  - PixiJS Particles integration
  - Performance-based rendering

- ⏳ Extract `sections/SectionContent.tsx`
  - All 8 section components rendering
  - Section visibility logic

- ⏳ Extract `overlays/UIOverlays.tsx`
  - Toolbar, modals, scroll indicators
  - Consolidated UI overlay management

- ⏳ Refactor `Section.tsx`
  - **Reduce from 324 → ~150 lines**
  - Pure orchestration component
  - Wrap with context providers

#### 1.3 File Renaming (0.5 days)
- ⏳ Rename `Particles.tsx` → `PixiJSParticles.tsx`
- ⏳ Rename `Scene.tsx` → `ThreeJSScene.tsx`
- ⏳ Rename `Section.tsx` → `PortfolioSection.tsx`
- ⏳ Update all import statements
- ⏳ Update index.astro
- ⏳ Update exports in index.ts files

#### 1.4 Testing & Validation (1 day)
- ⏳ Test all section navigation
- ⏳ Verify modal interactions work
- ⏳ Test toolbar panel toggling
- ⏳ Confirm atmospheric transitions
- ⏳ Validate GSAP animations
- ⏳ Check performance (no regressions)
- ⏳ TypeScript validation
- ⏳ Linting and formatting

---

### After Phase 1: Infrastructure & Features

**Phase 0** - Infrastructure (12-16 days)
- Monorepo restructuring
- Strapi CMS integration
- Vercel + Railway deployment
- Content migration

**Phase 2** - Further Optimizations
- Scene.tsx optimization
- Component standardization

**Phase 3** - Performance
- Code splitting & lazy loading
- Bundle size reduction

**Next Steps** - Features
- `/about` and `/journey` pages
- LangChain + LangGraph AI forms
- Blog integration
- SEO & Analytics
- 15 advanced features (PWA, i18n, etc.)
