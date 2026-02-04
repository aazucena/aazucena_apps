# Phase 4: Type Safety & Developer Experience

📍 **Full Documentation:** [ROADMAP.md Phase 4](../ROADMAP.md#phase-4-type-safety--developer-experience-priority-medium)

## Priority Status: Medium

**Estimated Effort:** 16-22 days (includes Figma/Storybook/Chromatic)

## Overview

Improve TypeScript usage, centralize configuration, and establish professional design-to-code workflow with Figma, Storybook, and Chromatic.

## Implementation Plan

### 4.1 TypeScript Improvements (2-3 days)

**Goal:** Stricter type checking and better organization

**Tasks:**
- Create centralized `types/` directory for shared types
- Consolidate all data interfaces into `types/data.ts`
- Add stricter type checking for GSAP animations
- Create utility types for common patterns (ModalProps, SectionProps)

**Structure:**
```
src/types/
├── data.ts           # Content models (About, Experience, Project, etc.)
├── api.ts            # API response types
├── components.ts     # Component prop types
├── animations.ts     # GSAP, Three.js types
└── index.ts          # Re-exports
```

**Benefits:**
- Better IDE autocomplete
- Catch errors at compile time
- Easier refactoring
- Self-documenting code

---

### 4.2 Configuration Management (1-2 days)

**Goal:** Centralize magic numbers and configuration

**Tasks:**
- Move all magic numbers to `config/constants.ts`
- Centralize z-index values in `config/zIndex.ts`
- Create theme configuration for colors/gradients
- Document atmospheric layer configuration

**Example:**
```typescript
// config/constants.ts
export const ANIMATION_DURATION = 1000;
export const SCROLL_THRESHOLD = 0.5;
export const MAX_SECTIONS = 8;

// config/zIndex.ts
export const Z_INDEX = {
  background: -20,
  canvas: -10,
  content: 0,
  overlay: 10,
  modal: 100,
  toolbar: 1000,
} as const;

// config/theme.ts
export const ATMOSPHERIC_COLORS = {
  troposphere: '#1a1a2e',
  stratosphere: '#16213e',
  // ...
};
```

---

### 4.3 Design System & Component Development Workflow (12-16 days) ⭐

**Goal:** Professional design-to-code pipeline

#### 4.3.1 Figma Design System Setup (5-7 days)

**Figma Organization:**

1. **Design Tokens File**
   - Colors (atmospheric layers, brand, semantic)
   - Typography scale
   - Spacing system (4px, 8px, 16px, 24px, 32px)
   - Border radius values
   - Shadow definitions
   - Animation timing functions
   - Z-index scale

2. **Component Library**
   - Buttons (primary, secondary, ghost, icon-only)
   - Input fields (text, textarea, select, checkbox, radio)
   - Cards (project, testimonial, hexagon)
   - Modals (experience, award)
   - Navigation (toolbar, scroll indicators, dropdown)
   - Badges (skill tags, tech stack badges)
   - Typography components
   - Icons (@mynaui/icons-react)

3. **Section Templates**
   - Hero section variants
   - About section layouts
   - Projects grid/list views
   - Experience timeline
   - Skills matrix
   - Blog post cards
   - Awards gallery

4. **Responsive Breakpoints**
   - Mobile: 375px, 414px
   - Tablet: 768px, 1024px
   - Desktop: 1280px, 1440px, 1920px

**Figma Plugins:**
- **Figma Tokens** - Sync design tokens with code
- **Anima** - Export to React components (optional)
- **Contrast** - WCAG accessibility checks
- **Iconify** - Icon libraries
- **Content Reel** - Realistic content

---

#### 4.3.2 Storybook Setup & Integration (4-5 days)

**Goal:** Component development environment and living documentation

**Installation:**
```bash
pnpm add -D @storybook/react-vite @storybook/addon-essentials \
  @storybook/addon-interactions @storybook/addon-a11y @storybook/addon-themes
```

**Essential Addons:**
- `@storybook/addon-essentials` - Controls, viewport, backgrounds
- `@storybook/addon-a11y` - Accessibility testing
- `@storybook/addon-interactions` - Interaction testing
- `@storybook/addon-themes` - Theme switching
- `storybook-addon-pseudo-states` - Hover, focus, active states
- `@chromatic-com/storybook` - Chromatic integration

**Component Stories to Create:**

1. **UI Components** (`src/components/animations/ui/`)
   - Toolbar.stories.tsx
   - SocialMenu.stories.tsx
   - SettingsPanel.stories.tsx
   - InfoPanel.stories.tsx
   - ScrollIndicators.stories.tsx
   - ExperienceModal.stories.tsx
   - NavigationDropdown.stories.tsx

2. **Section Components**
   - HeroSection.stories.tsx
   - AboutSection.stories.tsx
   - ProjectsSection.stories.tsx
   - ExperienceSection.stories.tsx
   - SkillsSection.stories.tsx
   - (and all other sections)

**Example Story:**
```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta = {
  title: 'UI/Button',
  component: Button,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost'],
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
```

---

#### 4.3.3 Chromatic Visual Testing Integration (2-3 days)

**Goal:** Automated visual regression testing and UI review

**Setup:**
```bash
pnpm add -D chromatic
```

**Configuration:**
```json
{
  "scripts": {
    "chromatic": "chromatic --project-token=<token>"
  }
}
```

**CI/CD Integration (CircleCI):**
```yaml
visual-tests:
  docker:
    - image: cimg/node:20.11
  steps:
    - checkout
    - run: pnpm install
    - run: pnpm chromatic --project-token=${CHROMATIC_PROJECT_TOKEN} --exit-zero-on-changes
```

**Chromatic Features:**
- Visual regression testing (captures snapshots of all stories)
- UI review workflow (approve/reject changes)
- Component library publishing (hosted Storybook)
- TurboSnap optimization (only test changed components)

**Visual Testing Strategy:**
- Run Chromatic on every PR
- Require approval for visual changes before merge
- Test across browsers (Chrome, Firefox, Safari)
- Test responsive breakpoints automatically

---

#### 4.3.4 Design-to-Code Workflow

**Complete Pipeline:**

1. **Design Phase (Figma)**
   - Designer creates component
   - Apply design tokens
   - Document states, interactions, responsive behavior
   - Share Figma link for developer review

2. **Development Phase (Storybook)**
   - Developer builds component in isolation
   - Create stories for all states and variants
   - Use Figma Dev Mode for accurate specs
   - Add accessibility attributes

3. **Documentation Phase**
   - Write JSDoc comments for props
   - Add usage examples in MDX docs
   - Document edge cases
   - Link back to Figma design

4. **Visual Testing (Chromatic)**
   - Push branch to GitHub
   - CircleCI triggers Chromatic build
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

---

### 4.4 Additional Developer Tooling (1-2 days)

**Tasks:**
- Add PropTypes/JSDoc for complex components
- Create component usage examples in comments
- Add performance monitoring utilities
- Set up ESLint + Prettier with strict rules
- Configure Husky for pre-commit hooks

---

### 4.5 Persona Selection System (0.5 days / 3 hours) 🎯

**📍 Full Documentation:** [Persona Selection Implementation Plan](/docs/features/persona-selection-implementation-plan.md)

**Goal:** Add persona-based navigation customization for improved UX

**Overview:**
Implement a persona selection system that allows visitors to select their intent (Hire me, Learn & Collaborate, Hear my music, or General) and dynamically reorder navigation based on their goals.

**Key Features:**
- 4 persona options with distinct navigation priorities
- localStorage persistence (key: `az_active_persona`)
- Non-blocking UI (shows only on first visit)
- Analytics tracking for persona selection
- Graceful degradation without CMS/analytics

**State Management:** React Context (extends PortfolioContext)
- **Decision:** Use existing Context pattern (not Redux/Zustand)
- **Rationale:** Zero bundle impact, simple state, consistent with Portfolio architecture
- **Bundle Impact:** ~11KB total

**Implementation Tasks:**
1. Create type definitions (`types/persona.ts`)
2. Define persona configurations (`data/personas.ts`)
3. Add navigation reordering utility (`lib/utils/persona.ts`)
4. Extend PortfolioContext with persona state
5. Create `usePersona` hook
6. Build PersonaSelector UI component
7. Integrate into HeroSection with reordering logic
8. Add analytics tracking

**Files Created:** 5 new files
**Files Modified:** 5 existing files

**Timeline:** ~3 hours total
- Types & Data: 35 min
- State Management: 50 min
- UI Component: 45 min
- Integration & Testing: 50 min

**Success Criteria:**
- ✅ PersonaSelector renders on first visit only
- ✅ Selection persists across sessions
- ✅ Navigation reorders based on persona
- ✅ Bundle size increase < 15KB
- ✅ No performance regression
- ✅ Fully accessible (keyboard, screen reader)

**Documentation:**
- Feature Overview: `/docs/features/persona-selection.md`
- Implementation Plan: `/docs/features/persona-selection-implementation-plan.md`
- Architectural Decision Log: Documented in both files (2026-02-03)

---

## Timeline Summary

| Task | Duration |
|------|----------|
| 4.1 TypeScript Improvements | 2-3 days |
| 4.2 Configuration Management | 1-2 days |
| 4.3.1 Figma Design System | 5-7 days |
| 4.3.2 Storybook Setup | 4-5 days |
| 4.3.3 Chromatic Integration | 2-3 days |
| 4.4 Additional Tooling | 1-2 days |
| 4.5 Persona Selection System | 0.5 days (3 hours) |

**Total:** 16.5-22.5 days

**Phase 4.3 Total (Figma/Storybook/Chromatic):** 12-16 days

---

## Success Metrics

**Before:**
- Loose type checking
- Magic numbers scattered
- No design system
- Manual visual QA

**After:**
- ✅ Strict TypeScript
- ✅ Centralized configuration
- ✅ Professional Figma design system
- ✅ Living component documentation (Storybook)
- ✅ Automated visual regression testing (Chromatic)
- ✅ Designer-developer workflow established

---

## Next Steps

1. **Phase 5:** Testing & Quality
2. **Features:** Implement features using design system

---

**Related Documentation:**
- [ROADMAP.md - Full Phase 4 Details](../ROADMAP.md#phase-4-type-safety--developer-experience-priority-medium)
- [ROADMAP.md - Design System Workflow (4.3)](../ROADMAP.md#43-design-system--component-development-workflow)
- [Phase 3: Performance Optimization](./phase-3-performance.md)
- [Phase 5: Testing & Quality](./phase-5-testing.md)
