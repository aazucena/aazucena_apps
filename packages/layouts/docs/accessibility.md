# Accessibility Guide

## SUMMARY

Semantic HTML patterns, ARIA landmarks, keyboard navigation, and screen reader optimization for inclusive layouts.

---

## ♿ ACCESSIBILITY_FUNDAMENTALS

### Why Accessibility Matters

**Statistics:**

- 15% of world population has some form of disability
- 1 in 4 adults in the US has a disability
- Screen readers used by ~2% of web users
- Keyboard-only navigation common among power users

**Benefits:**

1. **Legal Compliance:** WCAG 2.1, ADA, Section 508
2. **SEO:** Semantic HTML improves search rankings
3. **User Experience:** Better UX for all users, not just disabled
4. **Business:** Larger audience, better conversion rates

**WCAG 2.1 Levels:**

- **Level A:** Minimum accessibility (must meet)
- **Level AA:** Recommended target (should meet)
- **Level AAA:** Enhanced accessibility (optional)

---

## 🏷️ SEMANTIC_HTML

### Using Correct Elements

```typescript
// ❌ BAD: Non-semantic divs
<div className="header">
  <div className="nav">
    <div className="nav-link">Home</div>
    <div className="nav-link">About</div>
  </div>
</div>

<div className="main-content">
  <div className="article">
    <div className="title">Article Title</div>
    <div className="text">Article content...</div>
  </div>
</div>

<div className="footer">
  <div className="copyright">© 2026</div>
</div>

// ✅ GOOD: Semantic HTML5
<header>
  <nav>
    <a href="/">Home</a>
    <a href="/about">About</a>
  </nav>
</header>

<main>
  <article>
    <h1>Article Title</h1>
    <p>Article content...</p>
  </article>
</main>

<footer>
  <p>© 2026</p>
</footer>
```

**Benefits:**

- Screen readers understand page structure
- Search engines better index content
- Keyboard navigation works properly
- Browser reader modes work correctly

---

### Semantic Elements Reference

**Sectioning:**

- `<header>` - Page or section header
- `<nav>` - Navigation links
- `<main>` - Main content (one per page)
- `<article>` - Self-contained content
- `<section>` - Thematic grouping
- `<aside>` - Tangential content
- `<footer>` - Page or section footer

**Text:**

- `<h1>` to `<h6>` - Headings (hierarchical)
- `<p>` - Paragraphs
- `<ul>`, `<ol>`, `<li>` - Lists
- `<blockquote>` - Quoted text
- `<cite>` - Citation
- `<time>` - Dates/times

**Interactive:**

- `<button>` - Clickable buttons
- `<a>` - Links to other pages/anchors
- `<input>` - Form inputs
- `<select>` - Dropdowns
- `<textarea>` - Multi-line text input

---

## 🗺️ ARIA_LANDMARKS

### What are ARIA Landmarks?

**ARIA (Accessible Rich Internet Applications)** attributes help screen readers understand page structure.

**Landmark Roles:**

- `role="banner"` - Site header (auto on `<header>` in body)
- `role="navigation"` - Navigation (auto on `<nav>`)
- `role="main"` - Main content (auto on `<main>`)
- `role="complementary"` - Supporting content (auto on `<aside>`)
- `role="contentinfo"` - Site footer (auto on `<footer>` in body)
- `role="search"` - Search functionality
- `role="form"` - Form (when named)
- `role="region"` - Generic landmark (when named)

---

### Landmark Example

```typescript
function AccessibleLayout({ children }) {
  return (
    <>
      {/* Banner landmark */}
      <header role="banner">
        <h1>Site Title</h1>

        {/* Navigation landmark */}
        <nav aria-label="Primary">
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/blog">Blog</a></li>
          </ul>
        </nav>
      </header>

      {/* Main landmark */}
      <main id="main-content">
        {children}
      </main>

      {/* Complementary landmark */}
      <aside aria-label="Sidebar">
        <h2>Related Links</h2>
        <ul>
          <li><a href="/link1">Link 1</a></li>
          <li><a href="/link2">Link 2</a></li>
        </ul>
      </aside>

      {/* Contentinfo landmark */}
      <footer role="contentinfo">
        <p>© 2026 Company Name</p>
      </footer>
    </>
  );
}
```

**Screen Reader Benefits:**

- Users can jump between landmarks (Cmd+Ctrl+N in VoiceOver)
- Navigate page structure without reading all content
- Quickly find main content or navigation

---

## 🎯 SKIP_LINKS

### Skip to Main Content

```typescript
import { Section } from '@aazucena/layouts';

function AccessiblePage() {
  return (
    <>
      {/* Skip link (visually hidden until focused) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground"
      >
        Skip to main content
      </a>

      <header>
        <nav>
          {/* 50+ navigation links */}
        </nav>
      </header>

      <main id="main-content" tabIndex={-1}>
        <Section>
          <h1>Page Title</h1>
          <p>Main content starts here</p>
        </Section>
      </main>
    </>
  );
}
```

**How it works:**

1. Link is visually hidden (`.sr-only`)
2. When tabbed to, becomes visible
3. Clicking jumps to `#main-content`
4. Keyboard users skip navigation

**Tailwind SR-Only:**

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
```

---

## ⌨️ KEYBOARD_NAVIGATION

### Focus Management

```typescript
function KeyboardAccessibleComponent() {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleKeyDown = (e: KeyboardEvent) => {
    // Escape key closes modal
    if (e.key === 'Escape') {
      closeModal();
    }

    // Arrow keys navigate
    if (e.key === 'ArrowDown') {
      focusNextItem();
    }
    if (e.key === 'ArrowUp') {
      focusPreviousItem();
    }
  };

  return (
    <div onKeyDown={handleKeyDown}>
      <button ref={buttonRef}>Focusable Button</button>
    </div>
  );
}
```

**Keyboard Shortcuts:**

- `Tab` - Next focusable element
- `Shift+Tab` - Previous focusable element
- `Enter` - Activate button/link
- `Space` - Activate button, toggle checkbox
- `Escape` - Close modal/dropdown
- `Arrow Keys` - Navigate lists/menus

---

### Focus Trap (Modal)

```typescript
import { useEffect, useRef } from 'react';

function Modal({ isOpen, onClose, children }) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Store previously focused element
      previousFocusRef.current = document.activeElement as HTMLElement;

      // Focus first focusable element in modal
      const firstFocusable = modalRef.current?.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as HTMLElement;
      firstFocusable?.focus();
    } else {
      // Restore focus on close
      previousFocusRef.current?.focus();
    }
  }, [isOpen]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }

    // Trap focus within modal
    if (e.key === 'Tab') {
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (!focusableElements || focusableElements.length === 0) return;

      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      // Shift+Tab on first element: focus last
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
      // Tab on last element: focus first
      else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onKeyDown={handleKeyDown}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <div className="bg-background p-6 rounded-lg max-w-md">
        <h2 id="modal-title">Modal Title</h2>
        {children}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
```

**Focus Trap Features:**

1. Focus first element on open
2. Trap Tab/Shift+Tab within modal
3. Escape key closes modal
4. Restore focus on close

---

## 🏗️ ACCESSIBLE_LAYOUT_PATTERNS

### Page Layout with Landmarks

```typescript
import { Section, MainContainer } from '@aazucena/layouts';

function AccessiblePageLayout() {
  return (
    <>
      {/* Skip Link */}
      <a href="#main-content" className="sr-only focus:not-sr-only">
        Skip to main content
      </a>

      {/* Header Landmark */}
      <header className="border-b">
        <MainContainer>
          <div className="flex items-center justify-between py-4">
            <h1 className="text-2xl font-bold">Site Title</h1>

            {/* Primary Navigation */}
            <nav aria-label="Primary navigation">
              <ul className="flex gap-6">
                <li><a href="/">Home</a></li>
                <li><a href="/about">About</a></li>
                <li><a href="/blog">Blog</a></li>
                <li><a href="/contact">Contact</a></li>
              </ul>
            </nav>
          </div>
        </MainContainer>
      </header>

      {/* Main Content Landmark */}
      <main id="main-content">
        <Section>
          <MainContainer>
            <h1>Page Heading</h1>

            {/* Article */}
            <article>
              <h2>Article Title</h2>
              <p>Article content...</p>
            </article>
          </MainContainer>
        </Section>
      </main>

      {/* Complementary Content */}
      <aside aria-label="Related content">
        <MainContainer>
          <Section>
            <h2>Related Articles</h2>
            <ul>
              <li><a href="/article1">Article 1</a></li>
              <li><a href="/article2">Article 2</a></li>
            </ul>
          </Section>
        </MainContainer>
      </aside>

      {/* Footer Landmark */}
      <footer className="border-t mt-12">
        <MainContainer>
          <Section>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Footer Navigation */}
              <nav aria-label="Footer navigation">
                <h3>Quick Links</h3>
                <ul>
                  <li><a href="/privacy">Privacy</a></li>
                  <li><a href="/terms">Terms</a></li>
                </ul>
              </nav>

              {/* Social Links */}
              <nav aria-label="Social media">
                <h3>Follow Us</h3>
                <ul>
                  <li><a href="https://twitter.com">Twitter</a></li>
                  <li><a href="https://github.com">GitHub</a></li>
                </ul>
              </nav>

              {/* Copyright */}
              <div>
                <p>© 2026 Company Name</p>
              </div>
            </div>
          </Section>
        </MainContainer>
      </footer>
    </>
  );
}
```

---

## 🎨 ARIA_LABELS

### Labeling Interactive Elements

```typescript
// ❌ BAD: No label
<button onClick={toggleMenu}>
  <MenuIcon />
</button>

// ✅ GOOD: aria-label
<button onClick={toggleMenu} aria-label="Toggle menu">
  <MenuIcon />
</button>

// ✅ GOOD: aria-labelledby (references existing element)
<button onClick={toggleMenu} aria-labelledby="menu-text">
  <MenuIcon />
  <span id="menu-text" className="sr-only">Menu</span>
</button>

// ✅ GOOD: aria-describedby (additional context)
<button
  onClick={deleteAccount}
  aria-label="Delete account"
  aria-describedby="delete-warning"
>
  Delete
</button>
<span id="delete-warning" className="sr-only">
  This action cannot be undone
</span>
```

---

### Navigation Labels

```typescript
<nav aria-label="Primary navigation">
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/about">About</a></li>
  </ul>
</nav>

<nav aria-label="Footer navigation">
  <ul>
    <li><a href="/privacy">Privacy</a></li>
    <li><a href="/terms">Terms</a></li>
  </ul>
</nav>

<nav aria-label="Breadcrumb" aria-current="page">
  <ol>
    <li><a href="/">Home</a></li>
    <li><a href="/blog">Blog</a></li>
    <li aria-current="page">Article Title</li>
  </ol>
</nav>
```

**Why Label Navigations?**

- Multiple `<nav>` elements on page need differentiation
- Screen readers announce: "Primary navigation" vs "Footer navigation"

---

## 📝 FORM_ACCESSIBILITY

### Accessible Form

```typescript
function AccessibleForm() {
  return (
    <form aria-labelledby="contact-heading">
      <h2 id="contact-heading">Contact Form</h2>

      {/* Name Field */}
      <div>
        <label htmlFor="name">
          Name <span aria-label="required">*</span>
        </label>
        <input
          id="name"
          type="text"
          required
          aria-required="true"
          aria-describedby="name-error"
        />
        <span id="name-error" role="alert" className="text-red-500">
          {/* Error message appears here */}
        </span>
      </div>

      {/* Email Field */}
      <div>
        <label htmlFor="email">Email *</label>
        <input
          id="email"
          type="email"
          required
          aria-required="true"
          aria-invalid={hasError}
          aria-describedby="email-hint email-error"
        />
        <span id="email-hint" className="text-sm text-muted-foreground">
          We'll never share your email
        </span>
        <span id="email-error" role="alert" className="text-red-500">
          {/* Error message */}
        </span>
      </div>

      {/* Checkbox */}
      <div>
        <input
          id="subscribe"
          type="checkbox"
          aria-describedby="subscribe-description"
        />
        <label htmlFor="subscribe">Subscribe to newsletter</label>
        <span id="subscribe-description" className="text-sm">
          Get weekly updates about new content
        </span>
      </div>

      <button type="submit">Submit</button>
    </form>
  );
}
```

**Key Patterns:**

- Every `<input>` has associated `<label>` via `htmlFor`/`id`
- Required fields marked with `aria-required="true"`
- Errors announced with `role="alert"`
- Hints provided with `aria-describedby`

---

## 🎭 LIVE_REGIONS

### Announcing Dynamic Content

```typescript
function LiveRegionExample() {
  const [status, setStatus] = useState('');

  const handleSave = async () => {
    setStatus('Saving...');

    try {
      await saveData();
      setStatus('Saved successfully');
    } catch (error) {
      setStatus('Error: Could not save');
    }
  };

  return (
    <div>
      <button onClick={handleSave}>Save</button>

      {/* Screen reader announces changes */}
      <div role="status" aria-live="polite" aria-atomic="true">
        {status}
      </div>
    </div>
  );
}
```

**ARIA Live Attributes:**

- `aria-live="polite"` - Announce after current speech
- `aria-live="assertive"` - Interrupt current speech
- `aria-atomic="true"` - Read entire region, not just changes
- `role="status"` - Non-critical status update
- `role="alert"` - Important alert (implicit `aria-live="assertive"`)

---

## 🧪 TESTING_ACCESSIBILITY

### Automated Testing

```typescript
import { axe, toHaveNoViolations } from 'jest-axe';
import { render } from '@testing-library/react';

expect.extend(toHaveNoViolations);

describe('Accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<MyComponent />);

    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });
});
```

**Tools:**

- **jest-axe** - Automated accessibility testing
- **@axe-core/react** - Runtime accessibility checks
- **eslint-plugin-jsx-a11y** - Lint rules for accessibility
- **Lighthouse** - Accessibility audits in Chrome DevTools

---

### Manual Testing Checklist

- [ ] **Keyboard Navigation:** Can you navigate entire site with Tab/Enter/Escape?
- [ ] **Screen Reader:** Test with VoiceOver (macOS), NVDA (Windows), or JAWS
- [ ] **Skip Links:** Can keyboard users skip to main content?
- [ ] **Focus Indicators:** Are focus states visible and clear?
- [ ] **Alt Text:** Do images have descriptive alt attributes?
- [ ] **Form Labels:** Do all inputs have associated labels?
- [ ] **Color Contrast:** Does text meet WCAG AA (4.5:1 for normal, 3:1 for large)?
- [ ] **Headings:** Is heading hierarchy correct (h1 → h2 → h3)?
- [ ] **ARIA:** Are ARIA landmarks and labels used appropriately?
- [ ] **Responsive:** Does layout work on mobile, tablet, desktop?

---

## 📊 WCAG_GUIDELINES

### Level AA Compliance (Target)

**Perceivable:**

1. Text alternatives for non-text content
2. Captions and alternatives for multimedia
3. Adaptable content structure
4. Distinguishable content (contrast, resize)

**Operable:**

1. Keyboard accessible
2. Sufficient time to read/interact
3. Seizure-free (no flashing > 3 times/sec)
4. Navigable (skip links, page titles, focus order)

**Understandable:**

1. Readable text
2. Predictable behavior
3. Input assistance (labels, errors, suggestions)

**Robust:**

1. Compatible with assistive technologies
2. Valid HTML
3. Correct ARIA usage

---

## 🎯 BEST_PRACTICES

### Do's ✅

1. **Use Semantic HTML:** `<button>`, `<nav>`, `<main>`, `<article>`
2. **Label Everything:** Forms, buttons, icons, navigation
3. **Test with Keyboard:** Full navigation without mouse
4. **Test with Screen Reader:** VoiceOver, NVDA, JAWS
5. **Color Contrast:** Meet WCAG AA (4.5:1)
6. **Focus States:** Visible focus indicators
7. **Skip Links:** Allow skipping navigation
8. **ARIA Landmarks:** Structure page for screen readers
9. **Responsive:** Mobile, tablet, desktop support
10. **Automate Testing:** Use jest-axe, Lighthouse

### Don'ts ❌

1. **Don't Use Divs for Buttons:** Use `<button>`
2. **Don't Rely on Color Alone:** Use icons/text too
3. **Don't Remove Focus Outlines:** Replace with visible alternative
4. **Don't Use `tabindex` > 0:** Disrupts natural tab order
5. **Don't Auto-Play Media:** Give user control
6. **Don't Use Placeholder as Label:** Disappears on focus
7. **Don't Nest Headings Wrong:** Follow h1 → h2 → h3 hierarchy
8. **Don't Ignore ARIA Errors:** Fix validation issues

---

**AUTHOR:** aazucena_accessibility_intelligence
