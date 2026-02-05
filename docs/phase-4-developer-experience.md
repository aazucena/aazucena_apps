# Phase 4: Developer Experience & Design System

📍 **Full Documentation:** [ROADMAP.md Phase 4](../ROADMAP.md#phase-4-developer-experience-priority-high)

## ✅ STATUS: ⏳ PENDING (Ready to Start)

**Estimated Duration:** 19-20 days (adjusted from 21 days due to existing work)
**Phase 4 Readiness Score:** 8.0/10 ⭐⭐⭐⭐⭐⭐⭐⭐ (upgraded due to existing packages)

**Dependencies:**
- ✅ Phase 0: Infrastructure (Complete)
- ✅ Phase 1: Animations Refactoring (Complete)
- ✅ Phase 2: Component Architecture (Complete)
- ✅ Phase 3: Performance Optimization (Complete)

---

## 🎯 Overview

Transform the monorepo into a production-grade design system with comprehensive developer tooling. This phase restructures `packages/` into 13 specialized packages with clear separation of concerns, establishes a true design system, and creates a professional design-to-code workflow.

### Key Deliverables

- **13 specialized packages** with single responsibilities
- **@aazucena/design-system** - Design tokens + comprehensive documentation
- **Figma design library** - 40+ components with design-to-code sync
- **Storybook** - Component playground with 50+ stories
- **Chromatic** - Automated visual regression testing
- **TypeScript strict mode** - Type safety across entire monorepo
- **Git hooks** - Automated quality checks (Husky + lint-staged)
- **Zero code duplication** - 565 lines eliminated (52% reduction)

---

## 📋 Existing Work Inventory (Pre-Phase 4)

Before starting Phase 4, significant groundwork has already been completed:

### ✅ Completed Work

**1. Package Scaffolding (Partial)**
- ✅ `packages/ui/` - Component library with **20+ ShadCN components**
  - Button, Card, Dialog, Form, Input, Tabs, Tooltip, Accordion, Sheet, Avatar, Badge, Alert, Progress, Separator, Skeleton, Label, Textarea, Aspect Ratio, Hover Card, Scroll Area
  - Configured with React 19.2, Tailwind CSS 4, Framer Motion 11
  - Dependencies: Radix UI primitives, react-hook-form, Zod, lucide-react
  - **Status:** Scaffolded but NOT yet imported/used in portfolio or analytics apps

- ✅ `packages/shared/` - Build configuration package
  - ESLint config (TypeScript, Astro, JSX a11y plugins)
  - Prettier config (with Astro plugin)
  - TypeScript config (tsconfig bases)
  - Tailwind config (with typography, animate plugins)
  - **Action Required:** Rename to `packages/config/` per Phase 4 plan

**2. Storybook & Chromatic (Configured)**
- ✅ Storybook 9.1.8 installed and configured in `packages/ui/`
  - `.storybook/main.ts` and `.storybook/preview.ts` present
  - Vite builder configured
  - React integration ready
  - **Status:** Only 4 example stories exist (Preloader, Header, Page, Button)
  - **Gap:** Need **46+ additional component stories** (50 total target)

- ✅ Chromatic 4.1.1 integrated
  - `@chromatic-com/storybook` addon installed
  - `chromatic` script in package.json
  - **Gap:** No project ID configured, baselines not captured, PR workflow not set up

**3. Workspace Dependencies**
- ✅ Portfolio app (`apps/portfolio/package.json`):
  - Declares `@aazucena/shared: "workspace:*"`
  - Declares `@aazucena/ui: "workspace:*"`
  - **Gap:** Zero actual imports in portfolio codebase (declared but unused)

- ❌ Analytics app (`apps/analytics/package.json`):
  - Does NOT use any `@aazucena/*` packages yet
  - **Gap:** Needs integration (especially Command Palette could use shared UI)

### ❌ Missing Work

**Packages (11 of 13 needed)**
```
❌ design-system/    # Design tokens + comprehensive docs
✅ ui/               # EXISTS (needs integration)
❌ hooks/            # React hooks library (categorized)
❌ utils/            # Pure utility functions
❌ types/            # TypeScript type definitions
❌ constants/        # Global constants
❌ animations/       # GSAP, Three.js, PixiJS utilities
❌ api/              # API clients, validators, transformers
❌ forms/            # Form system (react-hook-form + Zod)
❌ layouts/          # Layout components
❌ icons/            # Icon system (@mynaui/icons)
❌ analytics/        # Tracking & telemetry
⚠️  config/          # EXISTS as "shared/" - needs rename
```

**Core Phase 4 Work**
- ❌ TypeScript strict mode (Portfolio + CMS apps)
- ❌ Git hooks (Husky + lint-staged)
- ❌ Figma Design System (40+ components, design-to-code sync)
- ❌ 46+ Storybook stories (4 exist, need 46 more for 50 total)
- ❌ Chromatic visual regression setup (project, baselines, PR workflow)
- ❌ Package migration (extract code from apps → packages)
- ❌ Integration work (import packages in portfolio/analytics)
- ❌ @aazucena/design-system package (design tokens)

### 💡 Impact on Timeline

**Time Savings:**
- Storybook setup: -1 day (already configured)
- Chromatic installation: -0.5 day (already integrated)
- UI package scaffolding: -0.5 day (20+ components exist)
- **Total savings:** ~2 days

**New Work Added:**
- Integration phase: +2 days (critical for value realization)
- Package rename: +0.5 day (shared → config, update imports)
- **Total additions:** ~2.5 days

**Net Change:** 21 days → **19-20 days** (conservative estimate)

---

## 📦 Complete Package Architecture (13 Packages)

### Package Overview

```
packages/
├── design-system/       🎨 Design tokens + documentation
├── ui/                  🧩 Component library (ShadCN + composed)
├── hooks/               🪝 React hooks library (categorized)
├── utils/               🛠️ Pure utility functions
├── types/               📘 TypeScript type definitions
├── constants/           📋 Global constants
├── animations/          ✨ Animation utilities (GSAP, Three.js, PixiJS)
├── api/                 💾 API clients, validators, transformers
├── forms/               📝 Form system (react-hook-form + Zod)
├── layouts/             📐 Layout components
├── icons/               🎯 Icon system (@mynaui/icons)
├── analytics/           📊 Tracking & telemetry
└── config/              ⚙️ Build configurations (ESLint, TS, Tailwind)
```

### Package Responsibility Matrix

| Package | Purpose | Used By | Priority | Est. Size |
|---------|---------|---------|----------|-----------|
| **design-system** | Design tokens + docs | All apps, ui | 🔴 Critical | 15 KB |
| **ui** | Component library | All apps | 🔴 Critical | 45 KB |
| **hooks** | React hooks library | All apps, ui | 🔴 Critical | 20 KB |
| **utils** | Pure utility functions | All packages | 🔴 Critical | 25 KB |
| **types** | TypeScript types | All packages | 🔴 Critical | 0 KB |
| **constants** | Global constants | All apps | 🟡 High | 5 KB |
| **animations** | Animation utilities | Portfolio, ui | 🟡 High | 35 KB |
| **api** | API clients, validators, transformers | All apps | 🟡 High | 40 KB |
| **forms** | Form system | Portfolio, analytics | 🟡 High | 30 KB |
| **layouts** | Layout components | All apps | 🟢 Medium | 15 KB |
| **icons** | Icon system | All apps, ui | 🟢 Medium | 10 KB |
| **analytics** | Tracking | All apps | 🟢 Medium | 15 KB |
| **config** | Build configs | All apps (dev) | 🔴 Critical | 0 KB |

---

## 🗓️ 19-20 Day Execution Plan (Adjusted)

### Week 1: Foundation + Core Packages (5 days)

#### Day 1 (8 hours) - Critical Fixes + Infrastructure

**Morning (4 hours): Critical Fixes**
- [ ] Set up Husky git hooks (1 hour)
  - Install: `pnpm add -D husky lint-staged`
  - Initialize: `npx husky init`
  - Create `.husky/pre-commit` hook
  - Configure lint-staged in `package.json`
- [ ] Enable CMS `strict: true` (2 hours)
  - Update `apps/cms/tsconfig.json`
  - Fix immediate type errors
  - Test CMS builds successfully
- [ ] Enhance ESLint configuration (1 hour)
  - Add `eslint-plugin-react-hooks`
  - Add `eslint-plugin-jsx-a11y`
  - Add TypeScript-specific rules

**Afternoon (4 hours): Package Setup & Existing Work Integration**
- [x] ~~Create `packages/ui/` directory~~ ✅ Already exists (20+ components)
- [x] ~~Create `packages/config/` directory~~ ⚠️ Exists as `packages/shared/` (needs rename)
- [ ] **Rename `packages/shared/` → `packages/config/`** (0.5 hour)
  - Update `packages/shared/package.json` → `"name": "@aazucena/config"`
  - Update imports in `apps/portfolio/package.json`
  - Run `pnpm install` to update workspace links
  - Test portfolio build: `pnpm build --filter portfolio`
- [ ] Create remaining **11 package directories** (1.5 hours)
  - design-system/, hooks/, utils/, types/, constants/, animations/, api/, forms/, layouts/, icons/, analytics/
- [ ] Set up package.json for each new package (1.5 hours)
- [ ] Configure package exports for new packages (0.5 hour)
- [ ] Verify pnpm workspace recognizes all 13 packages

**Deliverables:**
- ✅ Git hooks preventing bad commits
- ✅ CMS TypeScript strict mode enabled
- ✅ `packages/config/` (renamed from shared/)
- ✅ 11 new package directories with package.json
- ✅ 13 total packages operational
- ✅ Enhanced ESLint configuration

---

#### Day 2 (8 hours) - Design System Foundation

**Morning (4 hours): Token Extraction**
- [ ] Create `@aazucena/design-system/tokens/colors.ts`
  - Extract OKLCH colors from portfolio Tailwind
  - Create color object with hex + oklch values
  - Add helper functions (`getColorHex`, `getColorOklch`)
- [ ] Create `@aazucena/design-system/tokens/typography.ts`
  - Extract font scales (xs → 6xl)
  - Define font families (sans, mono)
  - Font weights (300 → 800)
- [ ] Create `@aazucena/design-system/tokens/spacing.ts`
  - Define 4px baseline grid
  - Create spacing scale (0 → 32)

**Afternoon (4 hours): Additional Tokens + Exports**
- [ ] Create `@aazucena/design-system/tokens/shadows.ts`
  - Define elevation system
  - Create shadow presets (sm, md, lg, xl)
- [ ] Create `@aazucena/design-system/tokens/z-index.ts`
  - Define layering scale (base → max)
  - Document z-index hierarchy
- [ ] Create `@aazucena/design-system/exports/tailwind.ts`
  - Generate Tailwind preset from tokens
  - Test integration with portfolio app
- [ ] Create `@aazucena/design-system/exports/figma.json`
  - Generate Figma Tokens plugin format

**Deliverables:**
- ✅ Complete design token library (7 token files)
- ✅ Tailwind preset functional
- ✅ Figma tokens ready for export

---

#### Day 3 (8 hours) - Types + Constants + Utilities

**Morning (4 hours): Types Package**
- [ ] Create `@aazucena/types/api/`
  - strapi.ts - Strapi API types
  - clickhouse.ts - ClickHouse types
  - responses.ts - API response types
- [ ] Create `@aazucena/types/components/`
  - props.ts - Component prop types
  - events.ts - Event handler types
- [ ] Create `@aazucena/types/data/`
  - content.ts, user.ts, analytics.ts

**Afternoon (4 hours): Constants + Utilities**
- [ ] Create `@aazucena/constants/`
  - routes.ts, meta.ts, api.ts, storage.ts
- [ ] Create `@aazucena/utils/`
  - string/ (truncate, slugify, capitalize)
  - date/ (format, relative, parse)
  - number/ (format, currency, percentage)
  - dom/ (cn, scroll)

**Deliverables:**
- ✅ Centralized type definitions
- ✅ Global constants organized
- ✅ Utility functions consolidated

---

#### Day 4 (8 hours) - Component Migration

**Morning (4 hours): Extract Components**
- [ ] Extract StatusBadge → `@aazucena/ui/composed`
  - Add size prop (sm, md, lg)
  - Add pulse animation prop
  - Use design-system colors
- [ ] Extract ThemeToggle → `@aazucena/ui/composed`
- [ ] Extract IntegrityBadge → `@aazucena/ui/composed`

**Afternoon (4 hours): Update Imports + Test**
- [ ] Update portfolio imports
- [ ] Update analytics imports
- [ ] Remove old duplicate files
- [ ] Test both apps build
- [ ] Verify no regressions

**Deliverables:**
- ✅ 3 components migrated
- ✅ Both apps using shared components
- ✅ Zero duplication

---

#### Day 5 (8 hours) - API Layer + Hooks

**Morning (4 hours): API Package**
- [ ] Create `@aazucena/api/api/client.ts`
  - Base fetch client with timeout
  - Error handling
- [ ] Create `@aazucena/api/validators/common.ts`
  - email, url, phone, slug schemas
- [ ] Create `@aazucena/api/transformers/`

**Afternoon (4 hours): Hooks + TypeScript Cleanup**
- [ ] Create `@aazucena/hooks/device/`
  - useMediaQuery, useBreakpoint, useDeviceCapabilities
- [ ] Create `@aazucena/hooks/state/`
  - useLocalStorage, useDebounce, useThrottle
- [ ] Audit and reduce `any` types (137 → 70)

**Deliverables:**
- ✅ API layer established
- ✅ Core hooks library started
- ✅ 50% reduction in `any` types

---

### Week 2: Specialized Packages (5 days)

#### Day 6 (8 hours) - Animations Package

**Morning (4 hours): GSAP Utilities**
- [ ] Create `@aazucena/animations/gsap/presets.ts`
  - fadeIn, slideIn, staggerFadeIn presets
- [ ] Create `@aazucena/animations/gsap/scrollTrigger.ts`
- [ ] Create `@aazucena/animations/gsap/timeline.ts`

**Afternoon (4 hours): Three.js + PixiJS**
- [ ] Create `@aazucena/animations/three/geometries.ts`
  - Extract createBasicGeometries
- [ ] Create `@aazucena/animations/three/materials.ts`
- [ ] Create `@aazucena/animations/pixi/particles.ts`

**Deliverables:**
- ✅ Animation utilities consolidated

---

#### Day 7 (8 hours) - Advanced Hooks

**Morning (4 hours): Animation Hooks**
- [ ] Create `@aazucena/hooks/animation/`
  - useGSAPAnimation, useScrollTrigger, useParallax

**Afternoon (4 hours): Data + DOM Hooks**
- [ ] Create `@aazucena/hooks/data/`
  - useFetch, useInfiniteScroll, usePagination
- [ ] Create `@aazucena/hooks/dom/`
  - useClickOutside, useKeyPress, useIntersectionObserver

**Deliverables:**
- ✅ 10+ reusable hooks

---

#### Day 8 (8 hours) - Forms Package

**Morning (4 hours): Form Components**
- [ ] Create `@aazucena/forms/components/`
  - Form, FormField, FormError
- [ ] Create `@aazucena/forms/fields/`
  - TextField, TextArea, SelectField

**Afternoon (4 hours): More Fields**
- [ ] CheckboxField, RadioField, DateField
- [ ] Create validators and hooks

**Deliverables:**
- ✅ Complete form system

---

#### Day 9 (8 hours) - Layouts + Icons + Analytics

**Morning (4 hours): Layouts + Icons**
- [ ] Create `@aazucena/layouts/`
  - PageLayout, DashboardLayout, SectionLayout
- [ ] Create `@aazucena/icons/`
  - Icon, IconButton, registry

**Afternoon (4 hours): Analytics**
- [ ] Create `@aazucena/analytics/providers/`
- [ ] Create `@aazucena/analytics/events/`
- [ ] Create `@aazucena/analytics/hooks/`

**Deliverables:**
- ✅ Layout components
- ✅ Icon system
- ✅ Analytics utilities

---

#### Day 10 (8 hours) - Testing + Documentation

**Morning (4 hours): Playwright Tests**
- [ ] Write 10 smoke tests:
  1. Homepage loads
  2. Navigation works
  3. Modals function
  4. Dark mode toggle
  5. Mobile responsive
  6. Forms submit
  7. 3D animations render
  8. API endpoints respond
  9. Error pages load
  10. Analytics dashboard loads

**Afternoon (4 hours): Documentation**
- [ ] Write README for each package (13 total)
- [ ] Write design-system/docs/ (5 markdown files)
- [ ] Add JSDoc comments

**Deliverables:**
- ✅ 10 smoke tests passing
- ✅ All packages documented

---

### Week 3-4: Design System Workflow (11 days)

#### Days 11-15 (5 days) - Figma Design System

**Day 11: Figma Setup**
- [ ] Create Figma workspace
- [ ] Install Figma Tokens plugin
- [ ] Import `design-system/exports/figma.json`
- [ ] Set up color & text styles

**Days 12-13: Component Library**
- [ ] Build 40+ components in Figma
  - Buttons, cards, forms, modals
  - Navigation, badges, typography
  - Layout templates

**Day 14: Responsive Documentation**
- [ ] Document breakpoints
- [ ] Create spacing examples
- [ ] Show grid system

**Day 15: Variants + Dark Mode**
- [ ] Create component variants
- [ ] Dark mode for all components
- [ ] Export Figma library

**Deliverables:**
- ✅ Complete Figma design system
- ✅ 40+ components documented
- ✅ Light + dark mode

---

#### Days 16-20 (5 days) - Storybook Stories

**Day 16: Storybook Story Writing (UI Components)**
- [x] ~~Set up Storybook~~ ✅ Already configured in `packages/ui/` (Storybook 9.1.8)
- [x] ~~Configure addons~~ ✅ a11y, docs, themes addons present in `.storybook/main.ts`
- [ ] **Write 20+ stories for existing ShadCN primitives** (replaces setup work)
  - Button, Card, Dialog, Form, Input, Tabs, Tooltip, etc.
  - Start with high-priority components

**Day 17: Composed Components & Form Stories**
- [ ] Complete remaining UI component stories (~10 more)
- [ ] Write 10+ stories for composed components (if any extracted)
- [ ] Write 10+ stories for form components

**Day 18: Layouts, Sections & Design Token Documentation**
- [ ] Write 10+ stories for layout components
- [ ] Write 10+ stories for homepage sections (representative samples)
- [ ] Create 7 design token stories (MDX)
  - Colors, Typography, Spacing, Shadows, Radii, Animation, Breakpoints
- [ ] Add MDX docs for all components
- [ ] Add interaction tests for key components

**Deliverables:**
- ✅ 50+ total Storybook stories (20 Day 16, 20 Day 17, 10+ Day 18)
- ✅ MDX documentation for design tokens
- ✅ Interaction tests

---

#### Day 19 (1 day) - Package Integration (Portfolio)

**CRITICAL: This day ensures packages provide actual value (not just scaffolds)**

**Morning (4 hours): Portfolio App Integration**
- [ ] Import `@aazucena/ui` components in portfolio
  - Replace local Button/Card/etc. with `@aazucena/ui/*` imports
  - Update 8 homepage sections to use shared components
- [ ] Import `@aazucena/config` for shared configs
  - Use shared ESLint/Prettier/TS configs
- [ ] Import other packages as applicable (utils, types, hooks, etc.)

**Afternoon (4 hours): Testing & Debugging**
- [ ] Test all portfolio pages render correctly
- [ ] Fix any type mismatches or import errors
- [ ] Verify animations still work with shared components
- [ ] Test production build: `pnpm build --filter portfolio`
- [ ] Lighthouse score check (ensure no performance regression)

**Deliverables:**
- ✅ Portfolio app using `@aazucena/*` packages
- ✅ All pages render correctly
- ✅ Production build successful
- ✅ No performance regression

---

#### Day 20 (1 day) - Package Integration (Analytics) + Chromatic Setup

**Morning (4 hours): Analytics App Integration**
- [ ] Add `@aazucena/ui` and `@aazucena/config` to analytics dependencies
- [ ] Import shared components in analytics dashboard
  - Command Palette could use shared Dialog/Button
  - Header could use shared components
- [ ] Test analytics app builds successfully
- [ ] Verify no regressions in AI Terminal, Music Intelligence, etc.

**Afternoon (4 hours): Chromatic Visual Regression**
- [x] ~~Install Chromatic~~ ✅ Already installed (@chromatic-com/storybook@4.1.1)
- [ ] **Create Chromatic project** (get project token)
- [ ] Configure `chromatic` script with project token
- [ ] **Run initial baseline** (50+ snapshots)
  - `pnpm chromatic --project-token=<token>`
- [ ] **Set up GitHub Actions workflow**
  - `.github/workflows/chromatic.yml`
  - Trigger on PR to main
  - Configure TurboSnap for faster builds
- [ ] **Test PR integration** (open test PR, verify Chromatic checks)

**Deliverables:**
- ✅ Analytics app using `@aazucena/*` packages
- ✅ Chromatic project configured
- ✅ Initial visual regression baselines captured
- ✅ GitHub Actions workflow automated

---

## 🚀 Execution Strategy: Hybrid Approach (Recommended)

**Philosophy:** Immediate start + Weekly checkpoints + Course correction = Controlled velocity

### Overview

The hybrid approach combines:
- **Velocity** (Option 1): Start immediately, work daily, finish in 19-20 days
- **Control** (Option 2): Weekly checkpoints, early issue detection, flexible scope

**Result:** Best of both worlds - momentum with safety nets.

### Pre-Phase 4 Prep (1-2 hours, do first)

Complete before Day 1:

```bash
# 1. Rename shared → config (30 min)
mv packages/shared packages/config
# Update package.json: @aazucena/shared → @aazucena/config
# Update apps/portfolio/package.json imports
pnpm install && pnpm build --filter portfolio  # Verify

# 2. Document baseline metrics (15 min)
pnpm build --filter portfolio  # Note gzip bundle size
pnpm build --filter analytics  # Note gzip bundle size

# 3. Create Phase 4 branch (5 min)
git checkout -b phase-4/developer-experience
git commit -m "🔧 chore: Phase 4 prep (rename config, baselines)"

# 4. Test Storybook (15 min)
cd packages/ui && pnpm dev  # Verify 4 stories load

# 5. Set up checkpoint calendar (5 min)
# Friday 4:30 PM (Week 1), Saturday 4:30 PM (Week 2),
# Sunday 4:30 PM (Week 3), Tuesday 5:00 PM (Week 4 Final)
```

### Weekly Checkpoint Structure

**Every Friday/Saturday/Sunday at 4:30 PM (30 minutes):**

#### Checkpoint Template

```markdown
## Week [N] Review (30 min)

**Timeline Health:**
- ✅ Green: On schedule or ahead → Proceed as planned
- ⚠️ Yellow: 1 day behind → Recoverable, minor adjustments
- 🚨 Red: 2+ days behind → Major adjustments needed

**Completed This Week:**
- Day X: [Status] (✅ Complete | ⚠️ Partial | ❌ Blocked)
- Day Y: [Status]
- Day Z: [Status]

**Issues Encountered:**
1. [Issue description] → [Resolution/Deferred]
2. [Issue description] → [Resolution/Deferred]

**Decisions for Next Week:**
- [ ] Continue as planned
- [ ] Adjust Figma timeline (4 → 2 days)
- [ ] Defer [specific scope]
- [ ] Add buffer day if needed

**Confidence Level for Next Week:**
- High / Medium / Low
```

### Week-by-Week Execution

#### **Week 1: Days 1-5 (Mon-Fri) - Foundation Sprint**
**Goal:** Core infrastructure + 5 packages operational

**Daily:** Work 8 focused hours, commit EOD

**Friday 4:30 PM Checkpoint:**
- Review Days 1-5 actual vs planned
- Assess TypeScript strict mode effort (planned 2hr, actual?)
- Validate 13 packages created successfully
- **Decision:** Proceed to Week 2 or adjust Figma timeline?

---

#### **Week 2: Days 6-11 (Mon-Sat) - Packages + Figma Start**
**Goal:** Complete 8 packages, start Figma

**Note:** 6-day week to maintain momentum if Week 1 was Green

**Saturday 4:30 PM Checkpoint:**
- Review package completion (Forms, Layouts, Icons, Analytics, UI)
- Test integration preview: `import { Button } from '@aazucena/ui'` in portfolio
- **Figma Go/No-Go Decision:**
  - ✅ Continue 4-day Figma (Days 12-15)
  - ⚠️ Compress to 2-day Figma (Days 12-13)
  - 🚨 Defer Figma post-Phase 4

---

#### **Week 3: Days 12-18 (Mon-Sun) - Figma + Stories Sprint**
**Goal:** Figma Design System + 40-50 Storybook stories

**Note:** 7-day week for story sprint if needed

**Sunday 4:30 PM Checkpoint:**
- Figma completion status (can defer if needed)
- Story count: Day 16 (15-20), Day 17 (10-15), Day 18 (10)
- **Total stories:** Adjust target 40-50 based on quality
- **Integration readiness:** All packages built? Types exported?
- **Risk assessment:** 2-day integration sufficient or need buffer?

---

#### **Week 4: Days 19-20 (Mon-Tue) - Integration + Chromatic**
**Goal:** Portfolio/Analytics integration, Chromatic setup

**CRITICAL WEEK:** Value materializes here

**Monday (Day 19):**
- 8:00 AM: Start portfolio integration
- 12:00 PM: Mid-day checkpoint (stuck >4hrs? Escalate)
- 4:00 PM: Basic integration complete
- 5:00 PM: EOD commit

**Tuesday (Day 20):**
- Morning: Analytics integration + Chromatic project
- Afternoon: Baselines (50+ snapshots) + GitHub Actions
- 5:00 PM: **Phase 4 Complete** 🎉

**Tuesday 5:00 PM Final Review (1 hour):**
- All deliverables complete?
- Actual vs planned days?
- Deferred items documented?
- Lessons learned for Phase 5

### Red Flags (Escalate Immediately)

🚨 **Stop and reassess if:**
- Single task takes 2x estimated time
- Blocked >4 hours on one issue
- Timeline slips >2 days in one week
- Integration reveals fundamental architecture problem

**Response:**
1. Document the blocker
2. Assess impact (critical vs nice-to-have)
3. Decide: Fix now, defer, or abandon
4. Adjust remaining timeline

### Scope Flexibility Guidelines

**Can Defer If Needed:**
- Figma Design System (Days 12-15) → Post-Phase 4
- Story count: 50 → 40 stories (prioritize quality)
- Chromatic GitHub Actions → Manual runs acceptable

**Cannot Defer (Core Deliverables):**
- 13 packages created ✅
- TypeScript strict mode ✅
- Git hooks ✅
- Integration (Days 19-20) ✅
- Minimum 30 Storybook stories ✅

### Advantages of Hybrid Approach

| Feature | Option 1 (Immediate) | Option 2 (Staged) | Hybrid ⭐ |
|---------|---------------------|-------------------|---------|
| Start delay | None | ~1 week | None |
| Momentum | High | Medium | High |
| Course correction | None (Day 20) | Every week | Every week |
| Context switching | None | High | Low |
| Burnout risk | High | Low | Medium-Low |
| Early issue detection | No | Yes | Yes |
| Incremental value | Day 20 | Every week | Every week |
| Timeline flexibility | None | High | High |

**Confidence Level:** 95%
**Recommended For:** Most projects (balanced risk/reward)

---

## 🎨 Design System Package (`@aazucena/design-system`)

### Why "Design System" vs "Design Tokens"?

**Design Tokens** = Raw primitive values (colors, spacing)
**Design System** = Tokens + Components + Guidelines + Documentation

We chose `@aazucena/design-system` because it includes:
- ✅ Design tokens (primitives)
- ✅ Usage guidelines (when to use primary vs secondary)
- ✅ Accessibility standards (WCAG AA/AAA)
- ✅ Design principles (content-first, progressive enhancement)
- ✅ Figma integration (design-to-code sync)

### Package Structure

```
packages/design-system/
├── src/
│   └── tokens/
│       ├── colors.ts         # OKLCH color scales (50-950)
│       ├── typography.ts     # Font scales & families
│       ├── spacing.ts        # 4px baseline grid
│       ├── shadows.ts        # Elevation system
│       ├── z-index.ts        # Layering scale (1-9999)
│       ├── animations.ts     # Transition presets
│       ├── breakpoints.ts    # Responsive breakpoints
│       └── index.ts
├── exports/
│   ├── figma.json            # Figma Tokens plugin format
│   ├── tailwind.ts           # Tailwind preset (auto-generated)
│   └── css-vars.css          # CSS custom properties
├── docs/
│   ├── color-system.md       # Color usage guidelines
│   ├── typography.md         # Type scale guidelines
│   ├── spacing.md            # Spacing system
│   ├── accessibility.md      # WCAG AA/AAA standards
│   └── principles.md         # Design principles
├── scripts/
│   ├── generate-figma-tokens.js
│   ├── generate-css-vars.js
│   └── generate-token-docs.js
├── package.json
└── README.md
```

### Color System (OKLCH)

**Why OKLCH over HSL/RGB?**
- **Perceptually uniform** - 50% lighter looks 50% lighter to humans
- **Consistent lightness** - Same lightness value across all hues
- **Better accessibility** - Easier to maintain WCAG contrast ratios
- **Future-proof** - Modern CSS color space

**Example:**
```typescript
export const colors = {
  primary: {
    50: { oklch: "97% 0.01 250", hex: "#f0f4ff" },
    500: { oklch: "58% 0.15 250", hex: "#3b5fff" }, // Brand primary
    950: { oklch: "25% 0.08 250", hex: "#0f1a4d" }
  }
};
```

### Package Exports

```typescript
// Import all tokens
import { colors, spacing, typography } from '@aazucena/design-system/tokens';

// Import specific tokens
import { colors } from '@aazucena/design-system/tokens/colors';

// Tailwind integration
import designSystem from '@aazucena/design-system/exports/tailwind';

// Figma integration
import figmaTokens from '@aazucena/design-system/exports/figma';
```

---

## 📝 Import Patterns (After Phase 4)

### Design System

```typescript
import { colors, spacing, typography } from '@aazucena/design-system/tokens';
const primaryColor = colors.primary[500].hex;
```

### UI Components

```typescript
// Primitives (ShadCN)
import { Button, Card, Dialog } from '@aazucena/ui/primitives';

// Composed (Business components)
import { StatusBadge, ThemeToggle } from '@aazucena/ui/composed';
```

### Hooks

```typescript
import { useDeviceCapabilities } from '@aazucena/hooks/device';
import { useGSAPAnimation } from '@aazucena/hooks/animation';
import { useLocalStorage } from '@aazucena/hooks/state';
```

### Utilities

```typescript
import { formatDate } from '@aazucena/utils/date';
import { slugify } from '@aazucena/utils/string';
import { cn } from '@aazucena/utils/dom';
```

### Animations

```typescript
import { fadeIn, slideInFromLeft } from '@aazucena/animations/gsap';
import { createBasicGeometries } from '@aazucena/animations/three';
```

### API Layer

```typescript
import { ApiClient } from '@aazucena/api/api';
import { emailSchema } from '@aazucena/api/validators';
```

### Forms

```typescript
import { Form, TextField, TextArea } from '@aazucena/forms';
```

---

## 📊 Success Metrics

### Quantitative Goals

- ✅ **13 specialized packages** - Clear separation of concerns
- ✅ **@aazucena/design-system** - True design system with docs
- ✅ **50+ Storybook stories** - Component playground
- ✅ **Figma design library** - 40+ components
- ✅ **Chromatic integration** - Visual regression testing
- ✅ **Git hooks** - Pre-commit quality checks
- ✅ **TypeScript strict** - All apps in strict mode
- ✅ **Zero duplication** - 565 lines eliminated (52%)
- ✅ **10 smoke tests** - Critical path coverage
- ✅ **Bundle size maintained** - 105 KB gzipped (no bloat)

### Code Duplication Eliminated

| Component | Before | After | Savings |
|-----------|--------|-------|---------|
| StatusBadge | 150 lines (2 copies) | 85 lines (1 copy) | **-65 lines (43%)** |
| ThemeToggle | 240 lines (2 copies) | 120 lines (1 copy) | **-120 lines (50%)** |
| Design Tokens | 300 lines (2 configs) | 120 lines (1 source) | **-180 lines (60%)** |
| Utilities | 400 lines (scattered) | 200 lines (organized) | **-200 lines (50%)** |
| **Total** | **1,090 lines** | **525 lines** | **-565 lines (52%)** |

---

## 🔄 Migration Guide

### Tailwind Config Migration

**BEFORE:**
```typescript
// apps/portfolio/tailwind.config.ts (150 lines)
export default {
  theme: {
    extend: {
      colors: {
        primary: { /* 11 shades */ },
        secondary: { /* 11 shades */ }
      }
    }
  }
};
```

**AFTER:**
```typescript
// apps/portfolio/tailwind.config.ts (30 lines)
import designSystem from '@aazucena/design-system/exports/tailwind';

export default {
  content: ['./src/**/*.{astro,html,tsx}'],
  presets: [designSystem], // All tokens imported!
  theme: {
    extend: {
      // Only portfolio-specific overrides
    }
  }
};
```

### Component Import Migration

**BEFORE:**
```typescript
import { StatusBadge } from '~/components/common/StatusBadge';
import { ThemeToggle } from '~/components/common/ThemeToggle';
```

**AFTER:**
```typescript
import { StatusBadge, ThemeToggle } from '@aazucena/ui/composed';
```

---

## 🛡️ Quality Assurance

### Git Hooks (Husky + lint-staged)

```bash
# .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

pnpm lint-staged
```

```json
// package.json
{
  "lint-staged": {
    "*.{ts,tsx,js,jsx}": ["eslint --fix", "prettier --write"],
    "*.{astro,md,json,css}": ["prettier --write"]
  }
}
```

### TypeScript Strict Mode

All `tsconfig.json` files:
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noUncheckedIndexedAccess": true
  }
}
```

---

## 🚧 Potential Challenges & Mitigations

### Challenge 1: CMS TypeScript Migration
**Risk:** Enabling strict mode may reveal 50-100 errors
**Mitigation:** Allocate 2-3 hours, use `@ts-expect-error` pragmatically

### Challenge 2: Import Path Updates
**Risk:** 100+ import statements to update
**Mitigation:** VS Code regex search/replace, update one package at a time

### Challenge 3: Figma Learning Curve
**Risk:** Unfamiliarity with Figma Tokens plugin
**Mitigation:** Follow official docs, allocate 1 day buffer

### Challenge 4: Storybook Performance
**Risk:** Large component count may slow Storybook
**Mitigation:** Lazy loading, component filtering, Vite builds

### Challenge 5: Chromatic Build Time
**Risk:** 50+ stories = long builds
**Mitigation:** TurboSnap (only snapshot changed stories)

---

## ✅ Definition of Done

Phase 4 is complete when:

- [ ] All 13 packages created and functional
- [ ] All package READMEs written
- [ ] Portfolio and analytics using shared packages
- [ ] Zero component duplication
- [ ] All apps building (zero TypeScript errors)
- [ ] Bundle size maintained (105 KB gzipped)
- [ ] Design system docs complete (5 markdown files)
- [ ] Figma library complete (40+ components)
- [ ] 50+ Storybook stories written
- [ ] Chromatic integrated with CI/CD
- [ ] Git hooks enforcing quality
- [ ] TypeScript strict in all apps
- [ ] 10 smoke tests passing
- [ ] ROADMAP.md updated
- [ ] CLAUDE.md updated
- [ ] README.md updated

---

## 🎉 Phase 4 Completion Benefits

When Phase 4 is complete, you'll have:

✅ **Production-grade design system** - Tokens, components, docs
✅ **Zero technical debt** - No duplication, strict types
✅ **Instant new project setup** - Import packages, ready in 30 min
✅ **Design-code sync** - Figma → Storybook → Production
✅ **Automated quality** - Git hooks, visual regression
✅ **Developer happiness** - Fast imports, autocomplete, docs

**This is world-class infrastructure.** 🏆

---

## 📚 Related Documentation

- [ROADMAP.md - Full Phase 4](../ROADMAP.md#phase-4-developer-experience-priority-high)
- [Phase 3: Performance Optimization](./phase-3-performance.md) ✅ Complete
- [Phase 5: Testing & Quality](./phase-5-testing.md) ⏳ Next

---

**Last Updated:** 2026-02-05 (Added Hybrid Execution Strategy)
**Status:** ⏳ PENDING (Ready to Start - Adjusted for Existing Work)
**Timeline:** 19-20 days (reduced from 21 days due to existing packages/ui and Storybook setup)
**Execution Strategy:** Hybrid Approach (immediate start + weekly checkpoints) - See section above
**Existing Work:** packages/ui/ (20+ components), packages/shared/ (configs), Storybook 9.1.8, Chromatic 4.1.1
**Phase 3 Completion:** 2026-02-04 (74.3% bundle reduction)
**Next Phase:** Phase 5 - Testing (Vitest + Playwright E2E)
