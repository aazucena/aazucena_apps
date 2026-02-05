# Phase 4: Developer Experience & Design System

📍 **Full Documentation:** [ROADMAP.md Phase 4](../ROADMAP.md#phase-4-developer-experience-priority-high)

## ✅ STATUS: ⏳ PENDING (Ready to Start)

**Estimated Duration:** 21 days (3 weeks)
**Phase 4 Readiness Score:** 7.5/10 ⭐⭐⭐⭐⭐⭐⭐⭐

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

## 🗓️ 21-Day Execution Plan

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

**Afternoon (4 hours): Package Setup**
- [ ] Create all 13 package directories
- [ ] Set up package.json for each package
- [ ] Configure package exports
- [ ] Set up pnpm workspace references

**Deliverables:**
- ✅ Git hooks preventing bad commits
- ✅ CMS TypeScript strict mode enabled
- ✅ 13 package directories with package.json
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

**Day 16: Portfolio Storybook Setup**
- [ ] Set up Storybook in `apps/portfolio`
- [ ] Configure addons (a11y, docs, themes)
- [ ] Test builds successfully

**Day 17: UI Component Stories**
- [ ] Write 20+ stories for ShadCN primitives
- [ ] Write stories for composed components

**Day 18: Forms + Layouts Stories**
- [ ] Write 15+ stories for form components
- [ ] Write stories for layouts

**Day 19: Homepage Sections Stories**
- [ ] Write stories for 8 homepage sections
- [ ] Add interaction tests

**Day 20: Design Token Documentation**
- [ ] Create 7 design token stories (MDX)
  - Colors, Typography, Spacing, Shadows, etc.
- [ ] Add MDX docs for all components

**Deliverables:**
- ✅ 50+ Storybook stories
- ✅ MDX documentation

---

#### Day 21 (1 day) - Chromatic Integration

**Morning (4 hours): Chromatic Setup**
- [ ] Create Chromatic account
- [ ] Configure project
- [ ] Run initial baseline (50+ snapshots)

**Afternoon (4 hours): CI/CD**
- [ ] Set up GitHub Actions workflow
- [ ] Configure TurboSnap
- [ ] Set up PR integration
- [ ] Test workflow

**Deliverables:**
- ✅ Chromatic integrated
- ✅ Visual regression testing automated

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

**Last Updated:** 2026-02-04
**Status:** ⏳ PENDING (Ready to Start)
**Phase 3 Completion:** 2026-02-04 (74.3% bundle reduction)
**Next Phase:** Phase 5 - Testing (Vitest + Playwright E2E)
