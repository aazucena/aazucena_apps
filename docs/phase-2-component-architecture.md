# Phase 2: Component Architecture Improvements

📍 **Full Documentation:** [ROADMAP.md Phase 2](../ROADMAP.md#phase-2-component-architecture-improvements-priority-high)

## Priority Status: High - 🚧 IN PROGRESS (~50% Complete)

**Estimated Effort:** 6-8 days
**Progress:** ~4.0 days equivalent work completed

## Overview

Further optimize component structure, standardize patterns across sections, and improve Scene.tsx organization.

## Current Status (2026-01-27)

### ✅ Completed Tasks
1. **Template System** - 3 operational templates (Editorial, Legal, Landing)
2. **Utility Refactoring** - Split monolithic files into 15 specialized modules
3. **Common Components** - 6 new reusable components
4. **Site Configuration** - Centralized config with types and helpers
5. **Footer Enhancement** - Tech stack logos (Astro, React, Tailwind, Vite)
6. **About Section - Working Style Integration:**
   - Implemented `content.working-style-item` json component.
   - Updated About schema, transformer, and validator.
   - Created `WorkingStyleSection.tsx` component.
   - Added `getWorkingStyleColor` utility.
   - Integrated into `about.astro` page.
7. **Navigation Plugin Integration (2026-01-27):**
   - Integrated `strapi-plugin-navigation` v3.2.4 for CMS-driven navigation
   - WRAPPER architecture for footer sections (reduced 3 containers → 2)
   - Custom fields: `label`, `icon`, `buttonStyle`, `description`, `cssClass`
   - Dynamic CTA buttons with 3 styles (primary, secondary, outline)
   - Label override system (admin titles vs display text)
   - Flattened `additionalFields` for component ergonomics
   - Performance: API calls reduced 3→2 (33% improvement)
8. **Footer CMS Integration (2026-01-27):**
   - website-config extension with tech stack component
   - Footer content moved to CMS with zero API overhead
   - Clean separation: siteConfig (theme) vs websiteConfig (content)

### 🚧 In Progress
- Scene.tsx optimization (next priority)
- Section components standardization

## Implementation Plan

### 2.0 Infrastructure & Foundation (COMPLETED ✅)

**Completed Tasks:**
- ✅ **Template System** - Created 3 operational templates
  - `EditorialTemplate.astro` - Default content pages
  - `LegalTemplate.astro` - Legal documents with revision badge & print styles
  - `LandingTemplate.astro` - Marketing pages (stub)
- ✅ **Utility Refactoring** - Modularized helper functions (15 files)
  - Split `utils.ts` → `about.ts`, `blog.ts`, `contact-form.ts`, `projects.ts`
  - Split `blogHelpers.ts`, `contentHelpers.ts`, `experienceHelpers.ts` → specialized modules
  - Added: `availability.ts`, `base.ts`, `strapi.ts`, `text.ts`, `url.ts`, `icons.ts`, `tagColors.ts`, `toc.ts`, `debounce.ts`
- ✅ **Common Components** - Created 6 reusable components
  - `StatusBadge.tsx` - Status indicators with variants (green/blue/gray/yellow/red)
  - `ThemeToggle.tsx` - Dark/light mode switcher with smooth transitions
  - `Breadcrumbs.astro` - Navigation breadcrumbs
  - `GradientAccent.astro` - Gradient decorative elements
  - `WatermarkBackground.astro` - Branded watermarks
  - `DetailNavigation.astro` - Back/forward navigation
- ✅ **Site Configuration** - Centralized config at `config/site.ts`
  - Type-safe configuration with `SiteConfig`, `SiteMetadata`, `ThemeConfig`
  - Helper functions: `formatPageTitle()`, `getAbsoluteUrl()`
- ✅ **Footer Enhancement** - Added tech stack visual indicators
  - Inline SVG logos: Astro, React, Tailwind CSS, Vite
  - Platform-based social icon rendering with `getPlatformIcon()`

**Status:** Foundation complete (~40% of Phase 2)

---

### 2.0.1 Navigation Plugin Integration (COMPLETED ✅ - 2026-01-27)

**Goal:** Replace hardcoded navigation with CMS-driven navigation via Strapi plugin

**Implementation:**
- **Plugin:** `strapi-plugin-navigation` v3.2.4
- **Architecture:** WRAPPER-based footer sections (2 containers vs 3)
- **Custom Fields:**
  - `label` - Display text override (separate admin title from user-facing text)
  - `icon` - MynaUI icon name for navigation items
  - `buttonStyle` - Render as CTA button (primary/secondary/outline)
  - `description` - Accessibility descriptions
  - `cssClass` - Custom styling classes
- **Files Created:**
  - `lib/api/navigation.ts` - API client with parallel fetching (32 lines)
  - `lib/validators/navigation.ts` - Zod schemas with `additionalFields` (66 lines)
  - `lib/transformers/navigation.ts` - Flattens `additionalFields`, fallback navigation (88 lines)
- **Files Modified:**
  - `cms/config/plugins.ts` - Added 5 custom fields to navigation plugin
  - `lib/utils/icons.ts` - Added `navigationIcons` mapping and `getNavigationIcon()` helper
  - `layouts/PageLayout.astro` - Fetches navigation data and passes to components
  - `components/ui/Navbar.tsx` - Dynamic navigation rendering with CTA button support
  - `components/Footer.astro` - WRAPPER section rendering with dynamic links

**Key Features:**
- **WRAPPER Architecture:**
  - Top-level WRAPPERs = section groupings (Explore, Resources)
  - Nested WRAPPERs = static files (RSS, Sitemap) - not CMS content types
- **Dynamic CTA Buttons:** Navigation items with `buttonStyle` render as prominent buttons
- **Label Override System:** `label` field overrides `title` for display (A/B testing ready)
- **Flattened Fields:** Transformer extracts `additionalFields` to top level for component convenience
- **Type Safety:** Full Zod validation with TypeScript types
- **Graceful Fallbacks:** Default navigation if CMS unavailable

**Performance:**
- Reduced API calls from 3 → 2 (33% improvement)
- Parallel fetching with `Promise.all()`
- SSG caching with `force-cache`

**Navigation Containers:**
1. `main-navigation` - Header navigation (5 items + optional CTA buttons)
2. `footer-navigation` - Single footer container with WRAPPER sections

**Benefits:**
- ✅ No hardcoded navigation arrays in components
- ✅ CMS control over all navigation (header + footer)
- ✅ A/B testing ready (change labels/CTAs without deployment)
- ✅ Button styling configurable from CMS
- ✅ Icon support for all navigation items
- ✅ Unlimited footer sections supported
- ✅ Ready for future enhancements (audience filtering, i18n)

**Effort:** 1 day (~0.5 days implementation + documentation)

---

#### Footer CMS Integration (2026-01-27) ✅

**Objective:** Move hardcoded Footer content to Strapi CMS while maintaining zero API overhead.

**Implementation:**
- Extended `website-configuration` single type with 4 footer fields
- Created `ui.tech-stack-item` repeatable component
- Renamed `order` → `sort` for clarity
- Zero additional API calls (reuses existing website-config fetch)

**Architecture Decision:**
- `siteConfig` (from `config/site.ts`) → Static theme (colors, fonts)
- `websiteConfig` (from Strapi API) → Dynamic content (footer, SEO, branding)
- Both configs used in `BaseLayout` and `PageLayout`

**Files Modified (9 total):**
Frontend (5):
- `src/lib/validators/website-config.ts` - Added TechStackSchema
- `src/lib/transformers/website-config.ts` - Transform logic + defaults
- `src/lib/api/website-config.ts` - Populate query update
- `src/components/Footer.astro` - Dynamic rendering
- `src/layouts/PageLayout.astro` - Props wiring

Backend (2):
- `src/layouts/BaseLayout.astro` - Uses websiteConfig
- `src/lib/services/layout.ts` - Returns both configs

CMS Schemas (2):
- `apps/cms/src/api/website-configuration/.../schema.json` - Footer fields
- `apps/cms/src/components/ui/tech-stack-item.json` - New component

**Benefits:**
- ✅ Content editors can update footer without code changes
- ✅ Type-safe with Zod validation
- ✅ Graceful fallbacks to defaults
- ✅ No performance impact (zero additional API calls)

**CMS Configuration Required:**
1. Restart Strapi to load new schemas
2. Populate Website Configuration with footer fields
3. Add tech stack items (Astro, React, Tailwind CSS, Vite)

---

### 2.1 Break Down Section.tsx (324 lines → ~150 lines) - 🔥 NEXT

**Current Issues:**
- Section.tsx already reduced to 174 lines in Phase 1
- Still some opportunities for extraction

**Refactor Strategy:**
- Further optimize Scene.tsx component organization
- Standardize section component patterns
- Extract remaining reusable patterns

**Already Extracted (Phase 1):**
```
Section.tsx (174 lines - orchestration)
├── DynamicBackground.tsx ✅
├── AtmosphericOverlays.tsx ✅
├── AnimationCanvas.tsx ✅ (wraps Three.js + PixiJS)
├── HomepageContent.tsx ✅ (section content renderer)
└── UIOverlays.tsx ✅ (toolbar, modals, indicators)
```

**Effort:** 2-3 days (revised from 3-4 days)

---

### 2.2 Scene Component Optimization (2-3 days)

**Goal:** Optimize Three.js scene rendering and organization

**Tasks:**
- Split `Scene.tsx` into smaller layer-specific renderers
- Create `SceneManager.tsx` to handle layer switching logic
- Optimize re-renders with `React.memo` for static layers
- Implement lazy loading for heavy 3D components

**Benefits:**
- Better performance
- Easier to understand
- Modular 3D layers
- Reduced unnecessary re-renders

---

### 2.3 Section Components Standardization (1-2 days)

**Goal:** Consistent patterns across all 8 section components

**Sections:**
1. HeroSection
2. AboutSection
3. ProjectsSection
4. ExperienceSection
5. SkillsSection
6. TestimonialsSection
7. BlogSection
8. AwardsSection

**Tasks:**
- Create base `SectionWrapper` component for common layout
- Standardize section heading styles into `SectionHeading` component
- Extract common animation patterns into shared utilities
- Ensure all sections follow same prop interface pattern

**Example Pattern:**
```typescript
interface SectionProps {
  isActive: boolean;
  atmosphericLayer: AtmosphericLayer;
  capabilities: DeviceCapabilities;
}

export function AboutSection({ isActive, atmosphericLayer, capabilities }: SectionProps) {
  return (
    <SectionWrapper isActive={isActive} atmosphericLayer={atmosphericLayer}>
      <SectionHeading>About Me</SectionHeading>
      {/* Section content */}
    </SectionWrapper>
  );
}
```

---

### 2.4 Page Template Component System ✅ COMPLETED (2026-01-25)

**Goal:** Extract page template logic from monolithic `[slug].astro` router into reusable, type-safe template components.

**Implementation:** 2 days (14 hours planned, completed in ~4 hours)

**Problem Solved:**
- `[slug].astro` was 113 lines with embedded template logic scattered throughout slots
- Template-specific features (legal revision badge, back button) mixed with routing logic
- Difficult to add new page templates without modifying router
- No type safety for template-specific props

**Solution Architecture:**
```
src/
├── pages/
│   └── [slug].astro              # Router (73 lines of logic, 35% reduction)
└── templates/
    ├── index.ts                  # Type definitions & registry
    ├── EditorialTemplate.astro   # Default content pages
    ├── LegalTemplate.astro       # Legal documents
    └── LandingTemplate.astro     # Marketing pages (stub)
```

**Template Features:**

1. **Legal Template** (`template: 'legal'`):
   - Revision badge with formatted date + animated pulse indicator
   - Back-to-home navigation button with SVG icon
   - Print-optimized styles (`@media print` for clean printing)
   - Used for: Privacy Policy, Terms of Service

2. **Editorial Template** (`template: 'default'`):
   - Clean, minimal layout with centered title
   - Prose-styled content area with optimal reading width
   - Optional table of contents support
   - Used for: General content pages, articles, documentation

3. **Landing Template** (`template: 'landing'`):
   - Hero-style header with larger typography (text-9xl)
   - Optional CTA button support
   - Wider layout (7xl vs 4xl) for marketing content
   - Stub implementation ready for future enhancement

**Router Pattern:**
```typescript
// Router computes shared concerns (SEO, breadcrumbs, JSON-LD)
const sharedProps = {
  title, content, seoTitle, seoDescription,
  jsonLd, breadcrumbs, watermarkText, ...
};

// Conditional rendering ensures type safety per template
{templateType === 'legal' ? (
  <LegalTemplate {...sharedProps} lastUpdated={page.lastUpdated} />
) : templateType === 'landing' ? (
  <LandingTemplate {...sharedProps} />
) : (
  <EditorialTemplate {...sharedProps} />
)}
```

**Adding New Templates:**
1. Add template name to `PageTemplateEnum` in `src/lib/validators/enums.ts`
2. Create `[TemplateName]Template.astro` in `src/templates/`
3. Define props interface extending `BaseTemplateProps` in `src/templates/index.ts`
4. Add to `TEMPLATE_MAP` constant for documentation
5. Update router conditional rendering in `[slug].astro`

**Results:**
- ✅ **35% code reduction**: Router logic reduced from 113 → 73 lines
- ✅ **Type safety**: Explicit props contracts per template (no union type errors)
- ✅ **Maintainability**: Self-contained, testable template components
- ✅ **Extensibility**: New templates don't require router modification
- ✅ **Separation of concerns**: Router handles routing, templates handle presentation
- ✅ **100% backward compatibility**: All pages render identically
- ✅ **Production verified**: Build succeeds, legal pages render correctly with all features

**Files Created:**
- `src/templates/index.ts` (150 lines - types, registry, documentation)
- `src/templates/EditorialTemplate.astro` (70 lines)
- `src/templates/LegalTemplate.astro` (140 lines with print styles)
- `src/templates/LandingTemplate.astro` (100 lines with TODO stubs)

**Files Modified:**
- `src/pages/[slug].astro` (refactored from 113 → 114 total lines, 73 logic lines)

---

## 2.5 About Section Enhancements - Working Style Integration ✅ COMPLETED (2026-01-26)

**Goal:** Integrate a dynamic "Working Style" component into the About section, driven by Strapi CMS. This enhances content flexibility and allows for easy updates to the display of work preferences and methodologies.

**Implementation:** 0.5 days

**Problem Solved:**
- Static content for "Working Style" section.
- Lack of CMS-driven flexibility for personal attributes.
- Inability to easily update or extend working style items without code changes.

**Solution Architecture:**
- **Strapi Component:** `content.working-style-item` JSON schema defined to capture title, description, and an icon for each working style entry.
- **Strapi Single Type Schema:** The `About` single type schema (`apps/cms/src/api/about/content-types/about/schema.json`) was updated to include a repeatable component field for `workingStyle`, linking to the new `content.working-style-item`.
- **Frontend Validator:** `WorkingStyleItemSchema` (Zod) created in `apps/portfolio/src/lib/validators/components.ts` for runtime type validation of CMS data.
- **Frontend Transformer:** The About transformer (`apps/portfolio/src/lib/transformers/about.ts`) was extended to correctly process and transform the `workingStyle` data from Strapi into a format consumable by the frontend.
- **Utility Function:** `getWorkingStyleColor` (in `apps/portfolio/src/lib/utils/about.ts`) was implemented to provide dynamic color styling based on item attributes or index, ensuring visual variety and consistency.
- **React Component:** `WorkingStyleSection.tsx` (`apps/portfolio/src/components/ui/WorkingStyleSection.tsx`) was developed to render the working style items, consuming data from the CMS via props. It leverages the utility function for styling and integrates icons.
- **Astro Page Integration:** The `about.astro` page (`apps/portfolio/src/pages/about.astro`) was updated to fetch the About data, including the new `workingStyle` field, and pass it as props to the `WorkingStyleSection` React component.

**Results:**
- ✅ **CMS-driven content:** Working style items are now fully manageable through Strapi.
- ✅ **Enhanced flexibility:** Easy to add, remove, or modify working style entries without code deployments.
- ✅ **Type safety:** End-to-end type safety from Strapi to frontend components via Zod and TypeScript.
- ✅ **Modular structure:** Clear separation of concerns with dedicated component, schema, validator, transformer, and utility.
- ✅ **Dynamic styling:** Utility function enables flexible and consistent visual presentation.
- ✅ **Improved DX:** Developers can quickly understand and extend the working style feature.

**Files Created/Modified:**
- `apps/cms/src/components/content/working-style-item.json` (New Strapi component schema)
- `apps/cms/src/api/about/content-types/about/schema.json` (Modified About schema)
- `apps/portfolio/src/lib/validators/components.ts` (Modified with `WorkingStyleItemSchema`)
- `apps/portfolio/src/lib/transformers/about.ts` (Modified to transform `workingStyle` field)
- `apps/portfolio/src/lib/utils/about.ts` (Modified with `getWorkingStyleColor` utility)
- `apps/portfolio/src/components/ui/WorkingStyleSection.tsx` (New React component)
- `apps/portfolio/src/pages/about.astro` (Modified to pass `workingStyle` prop)


---

## Timeline Summary

| Task | Duration | Status |
|------|----------|--------|
| 2.4 Page Template Component System | 2 days | ✅ Completed (2026-01-25) |
| 2.1 Break Down Section.tsx | 3-4 days | 🔄 Pending |
| 2.2 Scene Component Optimization | 2-3 days | 🔄 Pending |
| 2.3 Section Components Standardization | 1-2 days | 🔄 Pending |

**Total Planned:** 8-11 days
**Completed:** 2 days (18% complete)

---

## Success Metrics

**Before:**
- `[slug].astro`: 113 lines with embedded template logic
- Section.tsx: 324 lines
- Scene.tsx: Complex, monolithic
- Sections: Inconsistent patterns

**After Phase 2 (In Progress):**
- ✅ `[slug].astro`: 73 lines of logic (35% reduction) - **COMPLETED**
- ✅ Template components: Self-contained, type-safe - **COMPLETED**
- ✅ 3 reusable templates implemented - **COMPLETED**
- 🔄 Section.tsx: ~150 lines (target)
- 🔄 Scene components: Modular, optimized
- 🔄 Sections: Standardized pattern
- ✅ Better maintainability
- ✅ Improved type safety

---

## Next Steps

1. **Phase 3:** Performance Optimization
2. **Phase 4:** Developer Experience
3. **Phase 5:** Testing & Quality

---

**Related Documentation:**
- [ROADMAP.md - Full Phase 2 Details](../ROADMAP.md#phase-2-component-architecture-improvements-priority-high)
- [Phase 1: Animations Refactoring](./phase-1-animations-refactoring.md)
- [Phase 3: Performance Optimization](./phase-3-performance.md)