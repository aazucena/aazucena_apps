# Persona Selection System - Implementation Plan

**Status:** 📋 Planning Complete - Ready for Implementation
**Implementation Phase:** 🎯 **Phase 4** (Task 4.5 - Developer Experience)
**Alternative Phase:** Phase 5 (if Phase 4 timeline requires adjustment)
**Estimated Time:** ~3 hours (0.5 days)
**Last Updated:** 2026-02-03

> ⚠️ **CRITICAL:** This feature is scheduled for **Phase 4 or Phase 5 ONLY**.
>
> **Current Phase:** Phase 3 (Performance Optimization)
> **DO NOT implement this feature during Phase 3.**
>
> Rationale: Adding ~11KB to bundle conflicts with Phase 3's bundle reduction goals.
>
> Implementation should begin only after Phase 3 completion.

## Architectural Decision Log

### State Management Choice (2026-02-03)

**Decision:** Use **React Context API** (extend PortfolioContext)

**Context:**
- User raised concerns about consistency between Analytics (Redux Toolkit) and Portfolio
- Considered three options: React Context, Redux Toolkit, Zustand

**Decision Rationale:**

1. **Per-app consistency > monorepo consistency**
   - Analytics (Next.js) has complex state → Redux appropriate
   - Portfolio (Astro+React) has simple state → Context appropriate
   - Different frameworks justify different tools

2. **Zero bundle impact**
   - No new dependencies required
   - Existing `useLocalStorage` hook handles persistence

3. **Simplicity wins**
   - Persona state is trivial (single string value)
   - Redux features (time-travel, middleware, normalization) not needed
   - Don't introduce 8KB dependency for simple state

4. **Established pattern**
   - Portfolio already uses 3 contexts (Portfolio, Animation, Data)
   - Team familiar with Context API pattern

**Alternatives Rejected:**
- ❌ Redux Toolkit: 8KB overhead, overkill for simple state
- ❌ Zustand: 1KB overhead, introduces new pattern to monorepo

---

## Implementation Steps

### Step 1: Type Definitions (15 min)

**Create:** `/apps/portfolio/src/types/persona.ts`

```typescript
export type PersonaType = 'professional' | 'technical' | 'creative' | 'general';

export interface PersonaOption {
  id: PersonaType;
  label: string;
  emoji: string;
  description: string;
  color: string; // Tailwind gradient classes
}

export interface PersonaConfig {
  navigationOrder: Record<string, number>; // section name → priority
  highlightSections?: string[]; // Optional: sections to emphasize
  taglineOverride?: string; // Optional: custom hero tagline
}

export interface PersonaData {
  options: PersonaOption[];
  configs: Record<PersonaType, PersonaConfig>;
}
```

### Step 2: Default Persona Configuration (20 min)

**Create:** `/apps/portfolio/src/data/personas.ts`

Define the 4 persona options with their navigation priorities:

```typescript
import type { PersonaData } from '~/types/persona';

export const PERSONA_DATA: PersonaData = {
  options: [
    {
      id: 'professional',
      label: 'Hire me',
      emoji: '💼',
      description: 'Recruiters, clients, partners',
      color: 'from-cyan-500 to-blue-600',
    },
    {
      id: 'technical',
      label: 'Learn & Collaborate',
      emoji: '💻',
      description: 'Developers, students, AI/ML',
      color: 'from-emerald-500 to-teal-600',
    },
    {
      id: 'creative',
      label: 'Hear my music',
      emoji: '🎵',
      description: 'Music enthusiasts, creatives',
      color: 'from-purple-500 to-pink-600',
    },
    {
      id: 'general',
      label: 'Just browsing',
      emoji: '👀',
      description: 'Show me everything',
      color: 'from-gray-500 to-slate-600',
    },
  ],
  configs: {
    professional: {
      navigationOrder: {
        experiences: 1,
        projects: 2,
        skills: 3,
        about: 4,
        blog: 5,
        testimonials: 6,
        awards: 7,
      },
    },
    technical: {
      navigationOrder: {
        blog: 1,
        projects: 2,
        skills: 3,
        experiences: 4,
        about: 5,
        testimonials: 6,
        awards: 7,
      },
    },
    creative: {
      navigationOrder: {
        projects: 1,
        about: 2,
        blog: 3,
        experiences: 4,
        skills: 5,
        testimonials: 6,
        awards: 7,
      },
    },
    general: {
      navigationOrder: {
        projects: 1,
        experiences: 2,
        skills: 3,
        about: 4,
        blog: 5,
        testimonials: 6,
        awards: 7,
      },
    },
  },
};
```

### Step 3: Utility Functions (20 min)

**Create:** `/apps/portfolio/src/lib/utils/persona.ts`

Navigation reordering logic:

```typescript
import type { NavigationDropdownOption } from '~/components/ui/hero/NavigationButton';
import type { PersonaType, PersonaConfig } from '~/types/persona';
import { PERSONA_DATA } from '~/data/personas';

/**
 * Reorder navigation items based on persona configuration
 * @param items - Array of navigation items to reorder
 * @param persona - Selected persona type
 * @returns Reordered array of navigation items
 */
export function reorderNavigationByPersona(
  items: NavigationDropdownOption[],
  persona: PersonaType
): NavigationDropdownOption[] {
  const config = PERSONA_DATA.configs[persona];
  if (!config) return items;

  return [...items].sort((a, b) => {
    // Normalize labels to match config keys (lowercase, no spaces)
    const labelA = a.label.toLowerCase().replace(/\s+/g, '');
    const labelB = b.label.toLowerCase().replace(/\s+/g, '');

    // Get priority from config (default 999 if not found)
    const orderA = config.navigationOrder[labelA] ?? 999;
    const orderB = config.navigationOrder[labelB] ?? 999;

    return orderA - orderB;
  });
}

/**
 * Get persona configuration by type
 * @param persona - Persona type
 * @returns Persona configuration
 */
export function getPersonaConfig(persona: PersonaType): PersonaConfig {
  return PERSONA_DATA.configs[persona] || PERSONA_DATA.configs.general;
}
```

### Step 4: Extend PortfolioContext (30 min)

**Modify:** `/apps/portfolio/src/contexts/animations/PortfolioContext.tsx`

Add persona state to the existing context:

```typescript
// Add to imports (after line 14)
import { useLocalStorage } from '~/hooks/animations';
import type { PersonaType } from '~/types/persona';

// Extend PortfolioState interface (after line 25, before line 49)
export interface PortfolioState {
  // Section Navigation
  currentSection: number;
  scrollProgress: number;
  setCurrentSection: Dispatch<SetStateAction<number>>;
  setScrollProgress: Dispatch<SetStateAction<number>>;

  // Modal State
  isExperienceModalOpen: boolean;
  selectedExperienceIndex: number | null;
  openExperienceModal: (index: number) => void;
  closeExperienceModal: () => void;

  // Panel State
  showInfoPanel: boolean;
  showSettingsPanel: boolean;
  showSocialMenu: boolean;
  setShowInfoPanel: Dispatch<SetStateAction<boolean>>;
  setShowSettingsPanel: Dispatch<SetStateAction<boolean>>;
  setShowSocialMenu: Dispatch<SetStateAction<boolean>>;

  // Persona State (NEW)
  selectedPersona: PersonaType;
  setSelectedPersona: (persona: PersonaType) => void;
  personaMounted: boolean; // Track if localStorage loaded

  // Utility functions
  navigateToSection: (index: number) => void;
  togglePanel: (panelType: "info" | "settings" | "social") => void;
}

// In PortfolioProvider component (after line 84, before Modal State)
  // Persona State (NEW)
  const [selectedPersona, setSelectedPersona, personaMounted] =
    useLocalStorage<PersonaType>('az_active_persona', 'general');

// Add to value object (after line 187, before closing brace)
  const value: PortfolioState = {
    // Section Navigation
    currentSection,
    scrollProgress,
    setCurrentSection,
    setScrollProgress,

    // Modal State
    isExperienceModalOpen,
    selectedExperienceIndex,
    openExperienceModal,
    closeExperienceModal,

    // Panel State
    showInfoPanel,
    showSettingsPanel,
    showSocialMenu,
    setShowInfoPanel,
    setShowSettingsPanel,
    setShowSocialMenu,

    // Persona State (NEW)
    selectedPersona,
    setSelectedPersona,
    personaMounted,

    // Utility Functions
    navigateToSection,
    togglePanel,
  };
```

### Step 5: Custom Hook (10 min)

**Create:** `/apps/portfolio/src/hooks/animations/usePersona.ts`

Convenience hook for accessing persona:

```typescript
import { useContext } from 'react';
import { PortfolioContext } from '~/contexts/animations';
import type { PersonaType } from '~/types/persona';

export function usePersona() {
  const context = useContext(PortfolioContext);

  if (!context) {
    throw new Error('usePersona must be used within PortfolioProvider');
  }

  const { selectedPersona, setSelectedPersona, personaMounted } = context;

  return {
    persona: selectedPersona,
    setPersona: setSelectedPersona,
    isMounted: personaMounted,
  };
}
```

**Update:** `/apps/portfolio/src/hooks/animations/index.ts`

Add export:
```typescript
export { usePersona } from './usePersona';
```

### Step 6: PersonaSelector UI Component (45 min)

**Create:** `/apps/portfolio/src/components/ui/hero/PersonaSelector.tsx`

Main UI component (uses ShadCN button patterns from existing codebase):

```typescript
import { useState, useEffect } from 'react';
import type { JSX } from 'react';
import { usePersona } from '~/hooks/animations';
import { PERSONA_DATA } from '~/data/personas';
import type { PersonaType } from '~/types/persona';
import { sendInteractionTelemetry } from '~/lib/services/telemetry';

export function PersonaSelector(): JSX.Element | null {
  const { persona, setPersona, isMounted } = usePersona();
  const [hasSelected, setHasSelected] = useState(false);

  // Only show on first visit (no persona set)
  useEffect(() => {
    if (isMounted && persona !== 'general') {
      setHasSelected(true);
    }
  }, [isMounted, persona]);

  // Don't render until mounted or if already selected
  if (!isMounted || hasSelected) return null;

  const handleSelect = (selectedPersona: PersonaType) => {
    setPersona(selectedPersona);
    setHasSelected(true);

    // Track selection event
    sendInteractionTelemetry('persona-selector', 'select', {
      persona: selectedPersona,
      timestamp: new Date().toISOString(),
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-8 px-4">
      <p className="text-sm text-gray-400 text-center mb-4">
        I'm here to...
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {PERSONA_DATA.options.map((option) => (
          <button
            key={option.id}
            onClick={() => handleSelect(option.id)}
            className={`
              group relative overflow-hidden rounded-lg p-4
              bg-gradient-to-br ${option.color}
              transition-all duration-300 ease-out
              hover:scale-105 hover:shadow-lg
              focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900
              active:scale-95
            `}
            aria-label={`Select ${option.label} persona`}
            data-track-id="persona-card"
            data-track-action="click"
            data-track-persona={option.id}
          >
            <div className="relative z-10 flex flex-col items-center gap-2">
              <span className="text-3xl" role="img" aria-label={option.emoji}>
                {option.emoji}
              </span>
              <span className="text-white font-semibold text-sm text-center">
                {option.label}
              </span>
            </div>
          </button>
        ))}
      </div>
      <p className="text-xs text-gray-500 text-center mt-3">
        You can change this anytime in settings
      </p>
    </div>
  );
}
```

**Update:** `/apps/portfolio/src/components/ui/index.ts`

Add export:
```typescript
export { PersonaSelector } from './hero/PersonaSelector';
```

### Step 7: Integrate into HeroSection (10 min)

**Modify:** `/apps/portfolio/src/components/homepage/sections/HeroSection.tsx`

1. Add imports (line 19):
```typescript
import { FlipWordsTagline, NavigationButton, ResumeButton, PersonaSelector } from '~/components/ui';
import { usePersona } from '~/hooks/animations';
import { reorderNavigationByPersona } from '~/lib/utils/persona';
```

2. Get persona state (after line 36):
```typescript
const { persona } = usePersona();
```

3. Apply persona-based reordering to options (replace lines 38-44):
```typescript
const baseOptions: NavigationDropdownOption[] = sections
  .filter((section) => section.name !== 'hero')
  .map((section, index) => ({
    label: section?.buttonLabel ?? section.title,
    index: section?.sort ?? index,
    icon: section.icon,
  }));

// Apply persona-based reordering
const options = reorderNavigationByPersona(baseOptions, persona);
```

4. Add PersonaSelector in return statement (after line 85, before CTA buttons):
```typescript
<FlipWordsTagline words={hero.flipWords} ref={subtitleRef} content={hero.taglineTemplate} />

{/* NEW: Persona Selector - shows only on first visit */}
<PersonaSelector />

<div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
  {/* existing buttons */}
</div>
```

### Step 8: Analytics Tracking Enhancement (10 min)

**Modify:** `/apps/portfolio/src/lib/services/telemetry.ts`

Add persona-specific helper (optional, but recommended):

```typescript
import type { PersonaType } from '~/types/persona';

export function sendPersonaSelectionTelemetry(params: {
  persona: PersonaType;
  previousPersona?: PersonaType;
}): void {
  sendInteractionTelemetry('persona-selector', 'change', {
    newPersona: params.persona,
    previousPersona: params.previousPersona || 'none',
    timestamp: new Date().toISOString(),
  });
}
```

---

## Verification Steps

### Manual Testing

1. **First Visit Flow:**
   - Clear localStorage (`az_active_persona`)
   - Reload homepage
   - Verify PersonaSelector appears
   - Click each persona option
   - Verify selector disappears after selection

2. **Persistence:**
   - Select "Technical" persona
   - Reload page
   - Verify PersonaSelector does NOT appear
   - Check localStorage: `az_active_persona` should be `"technical"`

3. **Navigation Reordering:**
   - Select "Professional" persona
   - Verify navigation order: Experiences → Projects → Skills → ...
   - Select "Technical" persona
   - Verify navigation order: Blog → Projects → Skills → ...

4. **Responsive Design:**
   - Test on mobile (grid becomes 2 columns)
   - Test on tablet (grid becomes 4 columns)
   - Verify touch targets are adequate (>44px)

5. **Accessibility:**
   - Tab through persona cards
   - Verify focus indicators visible
   - Test with screen reader (aria-labels present)

### Analytics Verification

1. Open AZUCENA_LYTICS dashboard (`http://localhost:8080`)
2. Select a persona on portfolio
3. Check telemetry logs for event:
   ```json
   {
     "event": "Interaction",
     "data": {
       "elementName": "persona-selector",
       "action": "select",
       "persona": "technical"
     }
   }
   ```

### Performance Testing

1. **Bundle Size:**
   ```bash
   pnpm build
   # Check build output for persona-related chunks
   ```

2. **Lighthouse Audit:**
   - Run Lighthouse on homepage
   - Verify FCP < 1.5s
   - Verify LCP < 2.5s
   - Verify no layout shift (CLS < 0.1)

### Edge Cases

1. **localStorage Disabled:**
   - Disable cookies/storage in browser
   - Verify PersonaSelector still renders
   - Verify no console errors

2. **Invalid Persona Value:**
   - Manually set localStorage `az_active_persona` to `"invalid"`
   - Reload page
   - Verify fallback to "general" persona

3. **Rapid Switching:**
   - Clear localStorage
   - Quickly click multiple personas
   - Verify only one selection persists

---

## Success Criteria

- ✅ PersonaSelector renders on first visit only
- ✅ Selection persists across sessions
- ✅ Navigation reorders based on persona
- ✅ Analytics events tracked correctly
- ✅ Bundle size increase < 15KB
- ✅ No performance regression (FCP, LCP)
- ✅ Accessible (keyboard, screen reader)
- ✅ Responsive (mobile, tablet, desktop)

---

## Implementation Timeline

**Total Estimated Time:** ~3 hours

- Types & Data: 35 min
- State Management: 50 min
- UI Component: 45 min
- Integration & Testing: 50 min

**Recommended Schedule:**
- Day 1: Steps 1-5 (types, data, state, hooks)
- Day 2: Steps 6-7 (UI component, integration)
- Day 3: Step 8 + testing (analytics, verification)
