# Phase 5: Testing & Quality

📍 **Full Documentation:** [ROADMAP.md Phase 5](../ROADMAP.md#phase-5-testing--quality-priority-low)

## Priority Status: Low (Implement gradually)

**Estimated Effort:** 5-8 days

## Overview

Establish comprehensive testing strategy with unit tests, integration tests, and E2E tests.

## Testing Stack

- **Vitest** - Unit testing (already in tech stack)
- **Playwright** - E2E testing (already in tech stack)
- **Chromatic** - Visual regression testing (from Phase 4)
- **@testing-library/react** - Component testing utilities

## Implementation Plan

### 5.1 Unit Testing (2-3 days)

**Goal:** Test custom hooks, utilities, and business logic

**What to Test:**

1. **Custom Hooks**
   - `useFlipText` - Text animation hook
   - `useSectionTransition` - Section transition logic
   - `useAtmosphericLayer` - Atmospheric layer calculations
   - `useToolbarState` - Toolbar panel management
   - `useModalManager` - Modal state management
   - `useDeviceCapabilities` - Device detection

2. **Utility Functions**
   - Color utilities (opacity calculations, color blending)
   - Animation helpers (easing functions, duration calculations)
   - Data transformations
   - Date formatting
   - String manipulation

3. **Business Logic**
   - Atmospheric layer transitions
   - Scroll progress calculations
   - Section navigation logic
   - Sound mute/unmute logic

**Example Test:**
```typescript
// hooks/__tests__/useToolbarState.test.ts
import { renderHook, act } from '@testing-library/react';
import { useToolbarState } from '../useToolbarState';

describe('useToolbarState', () => {
  it('should toggle panels correctly', () => {
    const { result } = renderHook(() => useToolbarState());

    expect(result.current.isInfoOpen).toBe(false);

    act(() => {
      result.current.toggleInfo();
    });

    expect(result.current.isInfoOpen).toBe(true);
  });

  it('should enforce mutual exclusivity', () => {
    const { result } = renderHook(() => useToolbarState());

    act(() => {
      result.current.toggleInfo();
    });

    expect(result.current.isInfoOpen).toBe(true);

    act(() => {
      result.current.toggleSettings();
    });

    // Info should be closed when settings opens
    expect(result.current.isInfoOpen).toBe(false);
    expect(result.current.isSettingsOpen).toBe(true);
  });
});
```

**Coverage Target:** 70-80% for hooks and utilities

---

### 5.2 Integration Testing (3-5 days)

**Goal:** Test component interactions and user flows

**What to Test:**

1. **Section Navigation Flow**
   - Navigate between sections using scroll
   - Verify section transitions work
   - Check atmospheric layer changes
   - Verify GSAP animations trigger

2. **Modal Open/Close Interactions**
   - Open experience modal
   - Close modal with X button
   - Close modal by clicking outside
   - Verify modal state resets

3. **Toolbar Panel Mutual Exclusivity**
   - Open info panel
   - Open settings panel (info should close)
   - Open social menu (settings should close)
   - Close all panels

4. **Responsive Behavior**
   - Test mobile breakpoints
   - Test tablet breakpoints
   - Test desktop breakpoints
   - Verify layout adjusts correctly

**Example Integration Test:**
```typescript
// __tests__/integration/section-navigation.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { PortfolioSection } from '../PortfolioSection';

describe('Section Navigation', () => {
  it('should navigate between sections on scroll', async () => {
    render(<PortfolioSection />);

    const section = screen.getByTestId('portfolio-section');

    // Simulate scroll
    fireEvent.scroll(window, { target: { scrollY: 1000 } });

    // Wait for transition
    await waitFor(() => {
      expect(screen.getByText('About Me')).toBeVisible();
    });
  });

  it('should update atmospheric layer on section change', async () => {
    const { container } = render(<PortfolioSection />);

    fireEvent.scroll(window, { target: { scrollY: 2000 } });

    await waitFor(() => {
      const background = container.querySelector('.atmospheric-background');
      expect(background).toHaveStyle({
        backgroundColor: expect.stringContaining('stratosphere'),
      });
    });
  });
});
```

---

## Testing Strategy by Phase

### Phase 1: Animations Refactoring
**Tests to Add:**
- `usePortfolio` hook tests
- `useAnimation` hook tests
- `useToolbarState` tests
- `useModalManager` tests
- Component rendering tests

### Phase 2: Component Architecture
**Tests to Add:**
- `SectionWrapper` component tests
- `SectionHeading` component tests
- Scene component rendering tests
- Atmospheric overlay tests

### Phase 3: Performance
**Tests to Add:**
- Lazy loading tests
- Bundle size checks (automated)
- Performance benchmarks

### Phase 4: Developer Experience
**Tests to Add:**
- Storybook interaction tests
- Chromatic visual regression tests
- Type checking in CI/CD

### Phase 5: Full Test Suite
**Complete Coverage:**
- All hooks tested
- All utilities tested
- Critical user flows tested
- Accessibility tests
- Performance regression tests

---

## E2E Testing with Playwright

**Critical User Flows:**

1. **Homepage → Navigate All Sections**
   ```typescript
   test('should navigate through all portfolio sections', async ({ page }) => {
     await page.goto('/');

     // Scroll through each section
     for (let i = 0; i < 8; i++) {
       await page.mouse.wheel(0, 1000);
       await page.waitForTimeout(1000);

       // Verify section is visible
       await expect(page.locator(`[data-section="${i}"]`)).toBeVisible();
     }
   });
   ```

2. **Open Experience Modal → Close**
   ```typescript
   test('should open and close experience modal', async ({ page }) => {
     await page.goto('/');

     // Navigate to experience section
     await page.locator('[data-section="3"]').scrollIntoViewIfNeeded();

     // Click experience card
     await page.click('[data-testid="experience-card-0"]');

     // Verify modal opens
     await expect(page.locator('[data-testid="experience-modal"]')).toBeVisible();

     // Close modal
     await page.click('[data-testid="modal-close"]');

     // Verify modal closes
     await expect(page.locator('[data-testid="experience-modal"]')).not.toBeVisible();
   });
   ```

3. **Toolbar Panel Interactions**
   ```typescript
   test('should enforce panel mutual exclusivity', async ({ page }) => {
     await page.goto('/');

     // Open info panel
     await page.click('[data-testid="toolbar-info"]');
     await expect(page.locator('[data-testid="info-panel"]')).toBeVisible();

     // Open settings panel
     await page.click('[data-testid="toolbar-settings"]');

     // Info panel should be closed
     await expect(page.locator('[data-testid="info-panel"]')).not.toBeVisible();
     // Settings panel should be open
     await expect(page.locator('[data-testid="settings-panel"]')).toBeVisible();
   });
   ```

4. **Responsive Design**
   ```typescript
   test('should adapt to mobile viewport', async ({ page }) => {
     await page.setViewportSize({ width: 375, height: 667 });
     await page.goto('/');

     // Verify mobile layout
     await expect(page.locator('.mobile-nav')).toBeVisible();
     await expect(page.locator('.desktop-nav')).not.toBeVisible();
   });
   ```

---

## CI/CD Integration

### Automated Testing Pipeline

```yaml
# .circleci/config.yml (add to existing workflow)

test-unit:
  docker:
    - image: cimg/node:20.11
  steps:
    - checkout
    - run: pnpm install
    - run: pnpm test:unit --coverage
    - store_artifacts:
        path: coverage

test-integration:
  docker:
    - image: cimg/node:20.11
  steps:
    - checkout
    - run: pnpm install
    - run: pnpm test:integration

test-e2e:
  docker:
    - image: mcr.microsoft.com/playwright:latest
  steps:
    - checkout
    - run: pnpm install
    - run: pnpm playwright install
    - run: pnpm test:e2e
    - store_artifacts:
        path: test-results

visual-tests:
  # Chromatic (from Phase 4)
  docker:
    - image: cimg/node:20.11
  steps:
    - checkout
    - run: pnpm install
    - run: pnpm chromatic --project-token=${CHROMATIC_PROJECT_TOKEN}
```

---

## Timeline Summary

| Task | Duration |
|------|----------|
| 5.1 Unit Testing | 2-3 days |
| 5.2 Integration Testing | 3-5 days |

**Total:** 5-8 days

---

## Success Metrics

**Coverage Targets:**
- **Unit Tests:** 70-80% coverage for hooks and utilities
- **Integration Tests:** All critical user flows covered
- **E2E Tests:** 5-10 critical scenarios
- **Visual Tests:** All Storybook stories (automated via Chromatic)

**Quality Gates:**
- All tests must pass before merge
- No decrease in coverage
- Performance budget checks pass
- Accessibility tests pass

---

## Testing Best Practices

1. **Test Behavior, Not Implementation**
   - Focus on what the user sees
   - Avoid testing internal state
   - Test outcomes, not implementation details

2. **Use Data Test IDs**
   - Add `data-testid` attributes
   - Makes tests more resilient to UI changes

3. **Mock External Dependencies**
   - Mock API calls
   - Mock Three.js/PixiJS (heavy libraries)
   - Use fake timers for animations

4. **Test Accessibility**
   - Use `@testing-library/jest-dom` matchers
   - Test keyboard navigation
   - Verify ARIA attributes

---

## Next Steps

After Phase 5, the portfolio codebase will be:
- ✅ Well-tested
- ✅ Maintainable
- ✅ Documented
- ✅ Production-ready

**Ready for:**
- New feature development
- Music player implementation
- AI-powered forms
- ML features
- And more!

---

**Related Documentation:**
- [ROADMAP.md - Full Phase 5 Details](../ROADMAP.md#phase-5-testing--quality-priority-low)
- [Phase 4: Developer Experience](./phase-4-developer-experience.md)
- [Features Documentation](./features/)
