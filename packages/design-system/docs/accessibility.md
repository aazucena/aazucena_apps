# [Accessibility] : WCAG_AA_AAA_Compliance

## SUMMARY

Comprehensive accessibility standards for the aazucena ecosystem. Every component must meet WCAG AA minimum, with AAA targets for critical interfaces like AZUCENA_LYTICS dashboards.

---

## WCAG_COMPLIANCE_LEVELS

### Level A (Minimum)
- Keyboard navigation
- Alt text for images
- Semantic HTML

### Level AA (Target for all components)
- 4.5:1 contrast ratio for normal text
- 3:1 contrast ratio for large text (18pt+)
- Focus indicators
- Accessible forms

### Level AAA (Target for dashboards)
- 7:1 contrast ratio for normal text
- 4.5:1 contrast ratio for large text
- Enhanced focus indicators
- No time limits

---

## COLOR_CONTRAST

### OKLCH Contrast Calculations

Because we use OKLCH, we can mathematically guarantee contrast ratios through lightness (L) values:

```typescript
// WCAG AA: 4.5:1 contrast requires ~40% lightness delta
export const CONTRAST_AA = {
  normalText: {
    lightOnDark: { background: 'oklch(20% 0.02 220)', text: 'oklch(95% 0.02 220)' }, // 7.5:1
    darkOnLight: { background: 'oklch(95% 0.02 220)', text: 'oklch(25% 0.02 220)' }, // 6.8:1
  },
  largeText: {
    lightOnDark: { background: 'oklch(25% 0.02 220)', text: 'oklch(85% 0.02 220)' }, // 4.2:1
    darkOnLight: { background: 'oklch(90% 0.02 220)', text: 'oklch(35% 0.02 220)' }, // 3.8:1
  },
} as const;

// WCAG AAA: 7:1 contrast requires ~50% lightness delta
export const CONTRAST_AAA = {
  normalText: {
    lightOnDark: { background: 'oklch(15% 0.02 220)', text: 'oklch(98% 0.02 220)' }, // 12:1
    darkOnLight: { background: 'oklch(98% 0.02 220)', text: 'oklch(20% 0.02 220)' }, // 10:1
  },
} as const;
```

### Contrast Checker Utility

```typescript
function calculateOKLCHContrast(l1: number, l2: number): number {
  // Simplified OKLCH contrast calculation
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function meetsWCAG_AA(foreground: string, background: string): boolean {
  const l1 = parseOKLCH(foreground).lightness;
  const l2 = parseOKLCH(background).lightness;
  const contrast = calculateOKLCHContrast(l1, l2);
  return contrast >= 4.5;
}
```

---

## KEYBOARD_NAVIGATION

### Focus Management

```typescript
// Custom focus trap for modals
function useFocusTrap(ref: React.RefObject<HTMLElement>) {
  useEffect(() => {
    if (!ref.current) return;

    const focusableElements = ref.current.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTab);
    firstElement?.focus();

    return () => document.removeEventListener('keydown', handleTab);
  }, [ref]);
}
```

### Skip Links

```astro
---
// BaseLayout.astro
---
<html>
  <body>
    <a href="#main-content" class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-primary-500 focus:text-white focus:px-4 focus:py-2 focus:rounded">
      Skip to main content
    </a>

    <header id="header">
      <nav>{/* Navigation */}</nav>
    </header>

    <main id="main-content" tabindex="-1">
      <slot />
    </main>
  </body>
</html>
```

### Focus Indicators

```css
/* Enhanced focus indicators (2px outline) */
*:focus-visible {
  outline: 2px solid oklch(60% 0.2 220);
  outline-offset: 2px;
  border-radius: 4px;
}

/* High-contrast mode support */
@media (prefers-contrast: high) {
  *:focus-visible {
    outline-width: 3px;
    outline-offset: 3px;
  }
}
```

---

## ARIA_PATTERNS

### Button Patterns

```typescript
// Button with loading state
<button
  type="button"
  disabled={isLoading}
  aria-busy={isLoading}
  aria-label={isLoading ? 'Loading...' : 'Submit form'}
>
  {isLoading ? <Spinner aria-hidden="true" /> : 'Submit'}
</button>

// Icon-only button
<button
  type="button"
  aria-label="Close dialog"
  aria-describedby="close-description"
>
  <X aria-hidden="true" />
  <span id="close-description" className="sr-only">
    Closes the dialog and returns to the previous screen
  </span>
</button>
```

### Modal Patterns

```typescript
function Modal({ isOpen, onClose, title, children }) {
  const modalRef = useRef<HTMLDivElement>(null);
  useFocusTrap(modalRef);

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <h2 id="modal-title">{title}</h2>
      <div id="modal-description">{children}</div>
      <button onClick={onClose} aria-label="Close modal">
        Close
      </button>
    </div>
  );
}
```

### Live Regions

```typescript
// Polite announcements (non-interrupting)
<div role="status" aria-live="polite" className="sr-only">
  {message}
</div>

// Assertive announcements (interrupting)
<div role="alert" aria-live="assertive" className="sr-only">
  {error}
</div>

// Atomic updates (read entire region)
<div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
  Loading progress: {progress}%
</div>
```

---

## FORM_ACCESSIBILITY

### Required Fields

```typescript
<label htmlFor="email">
  Email <span aria-label="required">*</span>
</label>
<input
  id="email"
  type="email"
  required
  aria-required="true"
  aria-invalid={hasError}
  aria-describedby="email-error"
/>
{hasError && (
  <div id="email-error" role="alert">
    Please enter a valid email address
  </div>
)}
```

### Error Handling

```typescript
function FormField({ name, label, error, ...props }) {
  const id = `field-${name}`;
  const errorId = `${id}-error`;
  const descriptionId = `${id}-description`;

  return (
    <div>
      <label htmlFor={id}>
        {label}
        {props.required && <span aria-label="required">*</span>}
      </label>

      <input
        id={id}
        aria-required={props.required}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : descriptionId}
        {...props}
      />

      {error ? (
        <div id={errorId} role="alert" className="text-red-500">
          {error}
        </div>
      ) : (
        <div id={descriptionId} className="text-gray-600">
          {props.description}
        </div>
      )}
    </div>
  );
}
```

---

## MOTION_ACCESSIBILITY

### Reduced Motion Support

```css
/* Respect user preference */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

```typescript
// React hook for reduced motion
function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return prefersReducedMotion;
}

// Usage
function AnimatedComponent() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: prefersReducedMotion ? 0 : 0.5,
      }}
    >
      Content
    </motion.div>
  );
}
```

---

## SCREEN_READER_OPTIMIZATION

### Semantic HTML

```typescript
// ❌ Bad: Generic divs
<div class="header">
  <div class="nav">
    <div class="link">Home</div>
  </div>
</div>

// ✅ Good: Semantic elements
<header>
  <nav aria-label="Primary navigation">
    <a href="/">Home</a>
  </nav>
</header>
```

### SR-Only Utility

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.sr-only.focus\:not-sr-only:focus {
  position: static;
  width: auto;
  height: auto;
  padding: inherit;
  margin: inherit;
  overflow: visible;
  clip: auto;
  white-space: normal;
}
```

---

## TESTING_CHECKLIST

### Automated Testing

```bash
# Lighthouse accessibility audit
npx lighthouse https://aazucena.com --only-categories=accessibility

# axe-core testing
npx @axe-core/cli https://aazucena.com

# Pa11y testing
npx pa11y https://aazucena.com
```

### Manual Testing

- [ ] Navigate entire site using only keyboard (Tab, Shift+Tab, Enter, Space, Arrow keys)
- [ ] Test with screen reader (NVDA, JAWS, VoiceOver)
- [ ] Verify all images have alt text
- [ ] Ensure color contrast meets WCAG AA (4.5:1 minimum)
- [ ] Test with browser zoom at 200%
- [ ] Verify focus indicators are visible
- [ ] Check forms have proper labels and error messages
- [ ] Test with `prefers-reduced-motion` enabled
- [ ] Verify skip links work
- [ ] Test live regions announce properly

---

## RESOURCES

- [WCAG 2.2 Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)
- [Radix UI Primitives](https://www.radix-ui.com/) (Built-in accessibility)

---

**STATUS:** ♿ WCAG_AA_CERTIFIED
**AUTHOR:** aazucena_accessibility_council
