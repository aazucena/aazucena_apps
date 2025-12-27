# Phase 0.2.4 Fix Plan - Proper API Integration

**Date:** 2025-12-19
**Issue:** Configuration APIs are fetched but not properly consumed by components

---

## Problems Identified

### 1. Section Component (MainContent)

**Current State:**
```typescript
// index.astro - Props are passed but not received
<MainContent
  client:visible
  portfolioData={portfolioData}
  heroConfig={hero}                    // ❌ NOT in component signature
  homepageSections={homepage.sections}  // ❌ NOT in component signature
/>

// Section.tsx - Only accepts portfolioData
export default function PortfolioSection({
  portfolioData
}: {
  portfolioData: PortfolioData
})
```

**Issues:**
- ❌ Hero flipWords are hardcoded from `portfolioData.about.flipWords` (line 75)
- ❌ Hero button configuration ignored (primaryButtonText, showDropdown, etc.)
- ❌ Homepage sections configuration ignored (which sections to show, titles, subtitles)
- ❌ Animation config not passed to component (should control performance, particles, timing)

### 2. Preloader Component

**Current State:** ✅ **WORKING CORRECTLY**
```astro
<Preloader {...preloaderConfig} client:only="react" />
```

The preloader properly receives and uses all configuration from Strapi.

---

## Solution Plan

### Step 1: Update Section Component Props

**File:** `apps/portfolio/src/components/animations/Section.tsx`

```typescript
import type { HeroData } from '~/lib/transformers/hero';
import type { HomepageSection } from '~/lib/transformers/homepage';
import type { AnimationConfigData } from '~/lib/transformers/animation';

// Update component signature
export interface PortfolioSectionProps {
  portfolioData: PortfolioData;
  heroConfig: HeroData;
  homepageSections: HomepageSection[];
  animationConfig?: AnimationConfigData; // Optional with defaults
}

export default function PortfolioSection(props: PortfolioSectionProps): JSX.Element {
  return (
    <AnimationProvider initialConfig={props.animationConfig}>
      <PortfolioProvider>
        <PortfolioSectionInner {...props} />
      </PortfolioProvider>
    </AnimationProvider>
  );
}
```

### Step 2: Use Hero Config for Flip Words

**Current (Line 75):**
```typescript
const { currentWord: currentFlipWord, elementRef: flipTextRef } = useFlipText({
  words: portfolioData.about.flipWords, // ❌ Wrong source
  interval: 3000, // ❌ Hardcoded
});
```

**Fixed:**
```typescript
const { currentWord: currentFlipWord, elementRef: flipTextRef } = useFlipText({
  words: heroConfig.flipWords, // ✅ From hero API
  interval: animationConfig?.timing.flipText || 3000, // ✅ From animation API
});
```

### Step 3: Use Hero Config for Buttons

**Locations to Update:**
- Primary CTA button text: Use `heroConfig.primaryButtonText`
- Secondary button (Resume): Use `heroConfig.secondaryButtonText` and `heroConfig.showSecondaryButton`
- Dropdown menu: Use `heroConfig.showDropdown`

### Step 4: Use Homepage Sections Config

**Purpose:** Control which sections are visible and their display properties

**Implementation:**
```typescript
// Filter sections based on homepage configuration
const visibleSections = homepageSections.filter(section => section.enabled);

// Map section numbers to configuration
const getSectionConfig = (sectionIndex: number) => {
  const sectionNames = ['hero', 'about', 'projects', 'skills', 'experience', 'testimonials', 'blog', 'contact'];
  return homepageSections.find(s => s.name === sectionNames[sectionIndex]);
};

// Use in rendering
const sectionConfig = getSectionConfig(currentSection);
if (sectionConfig) {
  // Use sectionConfig.title, sectionConfig.subtitle, sectionConfig.icon
}
```

### Step 5: Use Animation Config

**Locations to Update:**
- Particle counts: `animationConfig.particleCounts[performanceTier]`
- Flip text timing: `animationConfig.timing.flipText`
- Section transition timing: `animationConfig.timing.sectionTransition`
- Master toggle: `animationConfig.enabled`
- Heavy animations toggle: `animationConfig.heavyAnimations`

---

## Files to Modify

### 1. Section.tsx
```
apps/portfolio/src/components/animations/Section.tsx
```

**Changes:**
- Add new props to component signature (lines 42, 202)
- Use `heroConfig.flipWords` instead of `portfolioData.about.flipWords` (line 75)
- Use `animationConfig.timing.flipText` instead of hardcoded `3000` (line 76)
- Pass hero button config to SectionContent component
- Filter/map sections based on homepage configuration

### 2. SectionContent.tsx (if needed)
```
apps/portfolio/src/components/animations/sections/SectionContent.tsx
```

**Changes:**
- Accept hero config props
- Use hero button configuration for rendering

### 3. AnimationContext.tsx (if needed)
```
apps/portfolio/src/components/animations/contexts/AnimationContext.tsx
```

**Changes:**
- Accept initial animation config
- Merge with device capabilities

---

## Testing Checklist

After implementation:

- [ ] Change hero flipWords in Strapi → Verify words change on frontend
- [ ] Change hero button text in Strapi → Verify button text updates
- [ ] Disable a section in homepage config → Verify section is hidden
- [ ] Change section title/subtitle → Verify changes appear
- [ ] Change animation timing → Verify flip text speed changes
- [ ] Disable heavy animations → Verify Three.js/PixiJS don't render
- [ ] Change particle counts → Verify particle density changes
- [ ] Build passes without TypeScript errors
- [ ] No console errors in browser

---

## Migration Path

1. Update component signatures
2. Update component internals to use new props
3. Test with existing CMS data
4. Update default fallbacks to match
5. Document breaking changes (if any)

---

## Expected Outcome

After this fix:
- ✅ All configuration APIs fully functional
- ✅ Changes in Strapi CMS immediately reflected on rebuild
- ✅ Proper separation of concerns (CMS controls UI, components consume)
- ✅ No hardcoded values in components
- ✅ Full type safety maintained

---

## Time Estimate

- Component updates: 2-3 hours
- Testing: 1 hour
- Documentation: 30 minutes

**Total:** 3.5-4.5 hours
