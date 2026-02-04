# Persona Selection System

**Status:** 📋 Planning Complete - Ready for Implementation
**Implementation Phase:** 🎯 **Phase 4** (Task 4.5 - Developer Experience)
**Alternative Phase:** Phase 5 (if Phase 4 timeline requires adjustment)
**Estimated Time:** ~3 hours (0.5 days)
**Last Updated:** 2026-02-03

> ⚠️ **IMPORTANT:** This feature is scheduled for Phase 4 or Phase 5.
> **Current Phase:** Phase 3 (Performance Optimization) - DO NOT implement yet.
>
> Implementation should begin only after Phase 3 completion.

## Overview

A persona-based customization system that allows portfolio visitors to select their intent and dynamically adjusts navigation order and content prioritization accordingly.

## User-Facing Feature

### Persona Options (4 Total)

1. **💼 "Hire me" (Professional)**
   - Target: Recruiters, clients, business partners
   - Navigation priority: Experiences → Projects → Skills
   - Emphasizes: Professional achievements, work history, testimonials

2. **💻 "Learn & Collaborate" (Technical)**
   - Target: Developers, students, AI/ML enthusiasts
   - Navigation priority: Blog → Projects → Skills
   - Emphasizes: Technical content, open-source contributions, learning resources

3. **🎵 "Hear my music" (Creative)**
   - Target: Music enthusiasts, creative technologists
   - Navigation priority: Projects (music) → About → Blog
   - Emphasizes: Musical compositions, creative work, artistic journey

4. **👀 "Just browsing" (General)**
   - Target: Casual visitors, explorers
   - Navigation priority: Default order (Projects → Experiences → Skills)
   - Emphasizes: Balanced overview of all content

### UX Flow

1. **First Visit:**
   - PersonaSelector appears between tagline and CTA buttons
   - User selects one of 4 personas
   - Selection is saved to localStorage
   - PersonaSelector disappears after selection

2. **Return Visits:**
   - PersonaSelector does not appear (already selected)
   - Navigation reflects chosen persona
   - User can change persona via Settings panel (future enhancement)

3. **Analytics Tracking:**
   - Persona selection events tracked
   - Used to optimize content strategy
   - Privacy-respecting (local-first)

## Architectural Decisions

### State Management: React Context (DECISION MADE: 2026-02-03)

**Decision:** Use React Context (PortfolioContext) instead of Redux Toolkit or Zustand.

**Rationale:**

1. **Consistency per-app > consistency per-monorepo**
   - Analytics (Next.js) uses Redux Toolkit → Complex state (filters, dashboards, telemetry)
   - Portfolio (Astro+React) uses Context API → Simple, focused state

2. **Zero bundle impact**
   - No new dependencies (Redux = +8KB, Zustand = +1KB)
   - Existing `useLocalStorage` hook already handles persistence

3. **Right tool for right job**
   - Persona state is simple (single value: `PersonaType`)
   - Redux/Zustand features not needed (time-travel, middleware, normalized state)

4. **Existing patterns**
   - Portfolio already has 3 contexts (Portfolio, Animation, Data)
   - Context API is the established pattern

**Alternatives Considered:**

| Approach | Pros | Cons | Decision |
|----------|------|------|----------|
| **React Context** | ✅ 0KB overhead<br>✅ Existing pattern<br>✅ Simple API | ⚠️ Manual localStorage | ✅ **SELECTED** |
| **Redux Toolkit** | ✅ Consistent with Analytics<br>✅ DevTools | ❌ 8KB overhead<br>❌ Overkill for simple state | ❌ Rejected |
| **Zustand** | ✅ 1KB lightweight<br>✅ Built-in persistence | ❌ New pattern in monorepo<br>❌ Inconsistent with Analytics | ❌ Rejected |

### localStorage Key Convention

**Key:** `az_active_persona`
**Type:** `'professional' | 'technical' | 'creative' | 'general'`
**Follows existing pattern:** `az_analytics_session_id`

### UI Placement

**Location:** HeroSection.tsx
**Position:** Between FlipWordsTagline and CTA buttons

```
FlipWordsTagline (hero.taglineTemplate)
    ↓
PersonaSelector (NEW - only shows on first visit)
    ↓
CTA Buttons (NavigationButton, ResumeButton)
```

### Navigation Customization

**Mechanism:** Transform navigation items dynamically based on persona configuration.

**Implementation:** Apply persona-based reordering in HeroSection where navigation options are built (line 38-44).

## Implementation Plan

### File Structure

#### New Files (5 total)

1. `/apps/portfolio/src/types/persona.ts` - Type definitions
2. `/apps/portfolio/src/data/personas.ts` - Default persona configuration
3. `/apps/portfolio/src/lib/utils/persona.ts` - Navigation reordering logic
4. `/apps/portfolio/src/hooks/animations/usePersona.ts` - Convenience hook
5. `/apps/portfolio/src/components/ui/hero/PersonaSelector.tsx` - Main UI component

#### Modified Files (5 total)

1. `/apps/portfolio/src/contexts/animations/PortfolioContext.tsx` - Add persona state
2. `/apps/portfolio/src/components/homepage/sections/HeroSection.tsx` - Integrate PersonaSelector + apply reordering
3. `/apps/portfolio/src/components/ui/index.ts` - Export PersonaSelector
4. `/apps/portfolio/src/hooks/animations/index.ts` - Export usePersona
5. `/apps/portfolio/src/lib/services/telemetry.ts` - Add persona tracking helper (optional)

### Bundle Size Impact

**Estimated total:** ~11KB (minified + gzipped)
- PersonaSelector.tsx: ~3KB
- persona.ts types: ~0.5KB
- personas.ts data: ~1.5KB
- persona.ts utils: ~2KB
- PortfolioContext additions: ~1KB
- usePersona hook: ~0.5KB
- Telemetry additions: ~1KB

**Well within the 30KB budget** ✅

### Implementation Steps

See `/docs/features/persona-selection-implementation-plan.md` for detailed step-by-step guide.

## Success Criteria

- ✅ PersonaSelector renders on first visit only
- ✅ Selection persists across sessions
- ✅ Navigation reorders based on persona
- ✅ Analytics events tracked correctly
- ✅ Bundle size increase < 15KB
- ✅ No performance regression (FCP, LCP)
- ✅ Accessible (keyboard, screen reader)
- ✅ Responsive (mobile, tablet, desktop)

## Future Enhancements (Phase 5+)

1. **Persona Switcher in Settings Panel**
   - Add button to SettingsPanel.tsx to change persona
   - Show current persona with option to switch

2. **Auto-Detection from Referrer**
   - LinkedIn referral → "professional"
   - GitHub referral → "technical"
   - Show confirmation toast

3. **CMS Integration**
   - Create `persona-config` content type in Strapi
   - Fetch persona data from CMS
   - Fall back to local data if CMS unavailable

4. **Persona-Specific Taglines**
   - Override FlipWordsTagline based on persona
   - "Professional" → "Building Production Systems"
   - "Technical" → "Open Source Contributor"

5. **A/B Testing**
   - Feature flag to enable/disable
   - Track conversion metrics per persona

## References

- **Implementation Plan:** `/docs/features/persona-selection-implementation-plan.md`
- **Related Context:** PortfolioContext (`/apps/portfolio/src/contexts/animations/PortfolioContext.tsx`)
- **Analytics:** Telemetry service (`/apps/portfolio/src/lib/services/telemetry.ts`)
