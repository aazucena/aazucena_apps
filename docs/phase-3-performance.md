# Phase 3: Performance Optimization

📍 **Full Documentation:** [ROADMAP.md Phase 3](../ROADMAP.md#phase-3-performance-optimization-priority-medium)

## Priority Status: Medium

**Estimated Effort:** 4-6 days

## Overview

Optimize bundle size, implement code splitting, and improve animation performance for better user experience.

## Implementation Plan

### 3.1 Code Splitting & Lazy Loading (2-3 days)

**Goal:** Reduce initial bundle size and improve load times

**Tasks:**
- Lazy load `Scene.tsx` and `Particles.tsx` (heavy 3D libraries)
- Dynamic imports for section modals (ExperienceModal, AwardModal)
- Lazy load sections that aren't visible initially
- Implement Suspense boundaries with loading states

**Implementation:**
```typescript
// Lazy load heavy components
const ThreeJSScene = lazy(() => import('./ThreeJSScene'));
const PixiJSParticles = lazy(() => import('./PixiJSParticles'));
const ExperienceModal = lazy(() => import('./ui/ExperienceModal'));

// Use with Suspense
<Suspense fallback={<LoadingSpinner />}>
  <ThreeJSScene {...props} />
</Suspense>
```

**Expected Impact:**
- 30-40% reduction in initial bundle size
- Faster Time to Interactive (TTI)
- Better Lighthouse scores

---

### 3.2 Animation Performance (1-2 days)

**Goal:** Ensure smooth 60fps animations on all devices

**Tasks:**
- Audit GSAP timeline usage, reduce duplicate timelines
- Implement animation throttling for low-end devices
- Add `will-change` CSS hints for animated elements
- Optimize Three.js render loop (only render when needed)

**Optimizations:**
```typescript
// Only render Three.js when scene changes
const shouldRender = useMemo(() => {
  return currentSection !== prevSection || scrollProgress !== prevScrollProgress;
}, [currentSection, prevSection, scrollProgress, prevScrollProgress]);

if (shouldRender) {
  renderer.render(scene, camera);
}
```

```css
/* Add will-change for animated elements */
.atmospheric-overlay {
  will-change: opacity, transform;
}
```

**Expected Impact:**
- Consistent 60fps on mid-range devices
- Reduced CPU usage
- Better battery life on mobile

---

### 3.3 Bundle Size Reduction (1-2 days)

**Goal:** Minimize JavaScript payload

**Tasks:**
- Analyze and tree-shake unused `@mynaui/icons-react` icons
- Consider replacing heavy dependencies with lighter alternatives
- Implement dynamic imports for atmospheric layer components
- Code-split routes (`/about`, `/journey` when created)

**Tools:**
```bash
# Analyze bundle size
pnpm run build
pnpm dlx vite-bundle-visualizer

# Check what's in the bundle
pnpm dlx source-map-explorer dist/**/*.js
```

**Target Bundle Sizes:**
- Main bundle: < 200KB (gzipped)
- Vendor bundle: < 150KB (gzipped)
- Total initial load: < 350KB (gzipped)

**Expected Impact:**
- Faster initial load
- Better mobile experience
- Improved Lighthouse performance score

---

## Timeline Summary

| Task | Duration |
|------|----------|
| 3.1 Code Splitting & Lazy Loading | 2-3 days |
| 3.2 Animation Performance | 1-2 days |
| 3.3 Bundle Size Reduction | 1-2 days |

**Total:** 4-6 days

---

## Success Metrics

### Performance Targets

| Metric | Before | Target | Priority |
|--------|--------|--------|----------|
| **Lighthouse Performance** | 70-80 | 90+ | High |
| **First Contentful Paint** | 2.5s | < 1.5s | High |
| **Time to Interactive** | 5s | < 3.5s | High |
| **Total Bundle Size** | 500KB | < 350KB | Medium |
| **Animation FPS** | 45-50 | 60 | Medium |

### Before vs After

**Before:**
- Large initial bundle
- All animations loaded upfront
- Heavy re-renders
- Sluggish on mobile

**After:**
- ✅ Code-split bundles
- ✅ Lazy-loaded heavy components
- ✅ Optimized render cycles
- ✅ Smooth 60fps animations
- ✅ Fast mobile experience

---

## Testing Strategy

1. **Lighthouse Audits** - Run on every PR
2. **WebPageTest** - Test on 3G/4G networks
3. **Chrome DevTools Performance** - Profile frame rates
4. **Real Device Testing** - Test on low-end Android devices

---

## Next Steps

1. **Phase 4:** Developer Experience (TypeScript, Figma/Storybook)
2. **Phase 5:** Testing & Quality
3. **Features:** Implement new features with performance in mind

---

**Related Documentation:**
- [ROADMAP.md - Full Phase 3 Details](../ROADMAP.md#phase-3-performance-optimization-priority-medium)
- [Phase 2: Component Architecture](./phase-2-component-architecture.md)
- [Phase 4: Developer Experience](./phase-4-developer-experience.md)
