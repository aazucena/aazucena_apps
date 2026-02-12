# Theming Guide

## SUMMARY

Comprehensive guide to customizing the visual appearance of @aazucena/ui components using the OKLCH color system, CSS variables, and Tailwind CSS integration.

---

## 🎨 OKLCH_COLOR_SYSTEM

The design system uses OKLCH (Oklab) color space for perceptually uniform color scales.

### Why OKLCH?

**Advantages over HSL:**
- **Perceptual Uniformity**: Equal steps in OKLCH = equal perceived differences
- **Predictable Lightness**: L channel directly maps to perceived lightness
- **Wide Gamut**: Access to colors outside sRGB space
- **Better Interpolation**: Smooth gradients without muddy mid-tones

```typescript
// HSL (uneven perception)
hsl(210, 100%, 50%) → hsl(210, 100%, 60%) // Large perceived jump

// OKLCH (even perception)
oklch(50% 0.2 250) → oklch(60% 0.2 250) // Consistent perceived step
```

---

## 🏗️ COLOR_ARCHITECTURE

### Base Color Scales

The system provides 12-step color scales for primary, secondary, and neutral colors.

**Primary Scale (Cyan Blue):**
```css
--primary-50: oklch(98% 0.01 250);   /* Lightest */
--primary-100: oklch(95% 0.02 250);
--primary-200: oklch(90% 0.05 250);
--primary-300: oklch(80% 0.10 250);
--primary-400: oklch(70% 0.15 250);
--primary-500: oklch(60% 0.20 250);  /* Base */
--primary-600: oklch(50% 0.20 250);
--primary-700: oklch(40% 0.18 250);
--primary-800: oklch(30% 0.15 250);
--primary-900: oklch(20% 0.10 250);
--primary-950: oklch(10% 0.05 250);
--primary-1000: oklch(5% 0.02 250);  /* Darkest */
```

**Secondary Scale (Coral Orange):**
```css
--secondary-500: oklch(65% 0.18 45);  /* Base coral orange */
```

**Neutral Scale (Zinc):**
```css
--neutral-50: oklch(98% 0.00 0);
--neutral-500: oklch(50% 0.00 0);
--neutral-950: oklch(10% 0.00 0);
```

---

## 🌓 DARK_MODE_IMPLEMENTATION

### Automatic Dark Mode

The system automatically adapts to user's OS preference:

```typescript
// globals.css
@media (prefers-color-scheme: dark) {
  :root {
    --background: oklch(10% 0.00 0);
    --foreground: oklch(95% 0.00 0);
    --primary-500: oklch(70% 0.20 250);  /* Lighter in dark mode */
  }
}
```

---

### Manual Dark Mode Toggle

Control dark mode programmatically:

```typescript
import { ThemeToggle } from '@aazucena/ui';

// Component usage
<ThemeToggle />

// Programmatic toggle
function toggleTheme() {
  document.documentElement.classList.toggle('dark');
}

// Check current theme
const isDark = document.documentElement.classList.contains('dark');
```

---

### Dark Mode Best Practices

**1. Increase Lightness for Dark Backgrounds:**
```css
/* Light mode */
.button-primary {
  background: oklch(60% 0.20 250);  /* primary-500 */
}

/* Dark mode */
.dark .button-primary {
  background: oklch(70% 0.20 250);  /* Lighter, more visible */
}
```

**2. Reduce Chroma for Large Areas:**
```css
/* Light mode background */
.hero-background {
  background: oklch(50% 0.20 250);  /* Full chroma */
}

/* Dark mode background */
.dark .hero-background {
  background: oklch(20% 0.10 250);  /* Reduced chroma, less eye strain */
}
```

**3. Invert Neutral Scales:**
```css
/* Light mode */
.text-primary {
  color: oklch(10% 0.00 0);  /* neutral-950 */
}

/* Dark mode */
.dark .text-primary {
  color: oklch(95% 0.00 0);  /* neutral-50 */
}
```

---

## 🎨 CUSTOM_THEMING

### Creating a Custom Theme

**Step 1: Define Your Colors**

```typescript
// theme.ts
export const customTheme = {
  primary: {
    50: 'oklch(98% 0.01 150)',   // Green hue (150°)
    500: 'oklch(60% 0.20 150)',
    950: 'oklch(10% 0.05 150)',
  },
  secondary: {
    500: 'oklch(65% 0.18 280)',  // Purple hue (280°)
  },
};
```

**Step 2: Apply to CSS Variables**

```css
/* custom-theme.css */
:root {
  --primary-50: oklch(98% 0.01 150);
  --primary-500: oklch(60% 0.20 150);
  --primary-950: oklch(10% 0.05 150);

  --secondary-500: oklch(65% 0.18 280);
}

.dark {
  --primary-500: oklch(70% 0.20 150);
  --secondary-500: oklch(75% 0.18 280);
}
```

**Step 3: Import Custom Theme**

```typescript
// App.tsx or layout file
import './custom-theme.css';
import { Button } from '@aazucena/ui';

function App() {
  return <Button variant="primary">Custom Themed Button</Button>;
}
```

---

## 🔧 TAILWIND_INTEGRATION

### Extending Tailwind Config

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'oklch(var(--primary-50))',
          100: 'oklch(var(--primary-100))',
          200: 'oklch(var(--primary-200))',
          300: 'oklch(var(--primary-300))',
          400: 'oklch(var(--primary-400))',
          500: 'oklch(var(--primary-500))',
          600: 'oklch(var(--primary-600))',
          700: 'oklch(var(--primary-700))',
          800: 'oklch(var(--primary-800))',
          900: 'oklch(var(--primary-900))',
          950: 'oklch(var(--primary-950))',
        },
        secondary: {
          500: 'oklch(var(--secondary-500))',
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

---

### Using Theme Colors in Components

```typescript
import { Card } from '@aazucena/ui';

<Card className="bg-primary-50 dark:bg-primary-950">
  <h2 className="text-primary-900 dark:text-primary-100">
    Theme-Aware Card
  </h2>
  <p className="text-neutral-700 dark:text-neutral-300">
    This card adapts to light/dark mode.
  </p>
</Card>
```

---

## 🎭 SEMANTIC_TOKENS

### Semantic Color Assignments

Map color scales to semantic meanings:

```css
:root {
  /* Status colors */
  --color-success: oklch(60% 0.20 150);  /* Green */
  --color-warning: oklch(70% 0.18 80);   /* Yellow */
  --color-error: oklch(55% 0.22 30);     /* Red */
  --color-info: oklch(60% 0.20 250);     /* Blue */

  /* UI element colors */
  --color-background: oklch(100% 0.00 0);
  --color-foreground: oklch(10% 0.00 0);
  --color-border: oklch(85% 0.00 0);
  --color-input: oklch(95% 0.00 0);
  --color-ring: oklch(60% 0.20 250);
}

.dark {
  --color-background: oklch(10% 0.00 0);
  --color-foreground: oklch(95% 0.00 0);
  --color-border: oklch(25% 0.00 0);
  --color-input: oklch(15% 0.00 0);
}
```

---

### Using Semantic Tokens

```typescript
import { Alert } from '@aazucena/ui';

<Alert className="bg-success/10 border-success text-success-foreground">
  <AlertTitle>Success!</AlertTitle>
  <AlertDescription>Operation completed successfully.</AlertDescription>
</Alert>

<Alert className="bg-error/10 border-error text-error-foreground">
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>Something went wrong.</AlertDescription>
</Alert>
```

---

## 🖌️ COMPONENT_VARIANTS

### Button Variants with Theme Colors

```typescript
import { cva } from 'class-variance-authority';

const buttonVariants = cva('px-4 py-2 rounded transition-colors', {
  variants: {
    variant: {
      primary: 'bg-primary-500 text-white hover:bg-primary-600',
      secondary: 'bg-secondary-500 text-white hover:bg-secondary-600',
      outline: 'border-2 border-primary-500 text-primary-500 hover:bg-primary-50',
      ghost: 'text-primary-500 hover:bg-primary-50',
      success: 'bg-success text-white hover:bg-success/90',
      error: 'bg-error text-white hover:bg-error/90',
    },
    size: {
      sm: 'text-sm px-3 py-1',
      md: 'text-base px-4 py-2',
      lg: 'text-lg px-6 py-3',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});

// Usage
import { Button } from '@aazucena/ui';

<Button className={buttonVariants({ variant: 'primary', size: 'lg' })}>
  Custom Button
</Button>
```

---

## 🌈 GRADIENT_UTILITIES

### Creating Theme-Aware Gradients

```typescript
import { GradientAccent } from '@aazucena/ui';

// Radial gradient with theme colors
<GradientAccent
  variant="radial"
  intensity="high"
  className="from-primary-500/20 via-secondary-500/10 to-transparent"
/>

// Linear gradient
<div className="bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500">
  <h1 className="text-white">Gradient Background</h1>
</div>
```

---

### Custom Gradient Classes

```css
/* globals.css */
.gradient-primary-radial {
  background: radial-gradient(
    circle at 50% 50%,
    oklch(60% 0.20 250 / 0.2) 0%,
    oklch(60% 0.20 250 / 0.0) 70%
  );
}

.gradient-hero {
  background: linear-gradient(
    135deg,
    oklch(60% 0.20 250) 0%,
    oklch(65% 0.18 45) 100%
  );
}
```

---

## 🔍 ACCESSIBILITY_CONTRAST

### WCAG AA Compliance

Ensure sufficient contrast ratios for text readability:

**Minimum Contrast Ratios:**
- **Normal Text (< 18pt):** 4.5:1
- **Large Text (≥ 18pt):** 3:1
- **UI Components:** 3:1

**Example: Primary Text on Primary Background**

```typescript
// ❌ Insufficient contrast (2.5:1)
<div className="bg-primary-500 text-primary-700">Low contrast text</div>

// ✅ Sufficient contrast (7.2:1)
<div className="bg-primary-500 text-white">High contrast text</div>
```

---

### Testing Contrast Ratios

```typescript
// Utility function to test contrast
function testContrast(foreground: string, background: string): number {
  // Convert OKLCH to relative luminance
  // Calculate contrast ratio
  // Return ratio (e.g., 7.2)
}

// Usage
const ratio = testContrast('oklch(95% 0.00 0)', 'oklch(60% 0.20 250)');
console.log(ratio); // 7.2:1 (WCAG AAA compliant)
```

---

## 📦 PRESET_THEMES

### Built-in Theme Presets

```typescript
import { applyTheme } from '@aazucena/ui/themes';

// Cyber theme (default)
applyTheme('cyber');

// Minimal theme (low chroma)
applyTheme('minimal');

// Elegant theme (serif typography)
applyTheme('elegant');
```

---

### Cyber Theme

```css
/* Cyber preset */
:root[data-theme='cyber'] {
  --primary-500: oklch(60% 0.20 250);    /* High chroma cyan */
  --secondary-500: oklch(65% 0.18 45);   /* Coral orange */
  --font-family: 'Fira Sans', sans-serif;
}
```

---

### Minimal Theme

```css
/* Minimal preset */
:root[data-theme='minimal'] {
  --primary-500: oklch(60% 0.05 250);    /* Low chroma gray-blue */
  --secondary-500: oklch(65% 0.05 0);    /* Low chroma gray */
  --font-family: 'Inter', sans-serif;
}
```

---

### Elegant Theme

```css
/* Elegant preset */
:root[data-theme='elegant'] {
  --primary-500: oklch(40% 0.15 280);    /* Deep purple */
  --secondary-500: oklch(55% 0.15 60);   /* Gold */
  --font-family: 'Crimson Pro', serif;
}
```

---

## 🛠️ ADVANCED_CUSTOMIZATION

### Dynamic Theme Switching

```typescript
import { useState } from 'react';

function ThemeSwitcher() {
  const [theme, setTheme] = useState<'cyber' | 'minimal' | 'elegant'>('cyber');

  const applyTheme = (newTheme: typeof theme) => {
    document.documentElement.setAttribute('data-theme', newTheme);
    setTheme(newTheme);
  };

  return (
    <div>
      <button onClick={() => applyTheme('cyber')}>Cyber</button>
      <button onClick={() => applyTheme('minimal')}>Minimal</button>
      <button onClick={() => applyTheme('elegant')}>Elegant</button>
    </div>
  );
}
```

---

### User-Defined Custom Colors

```typescript
import { useEffect } from 'react';

function CustomColorPicker() {
  const [hue, setHue] = useState(250);
  const [chroma, setChroma] = useState(0.20);
  const [lightness, setLightness] = useState(60);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--primary-500', `oklch(${lightness}% ${chroma} ${hue})`);
  }, [hue, chroma, lightness]);

  return (
    <div>
      <label>
        Hue (0-360): <input type="range" min="0" max="360" value={hue} onChange={(e) => setHue(+e.target.value)} />
      </label>
      <label>
        Chroma (0-0.4): <input type="range" min="0" max="0.4" step="0.01" value={chroma} onChange={(e) => setChroma(+e.target.value)} />
      </label>
      <label>
        Lightness (0-100): <input type="range" min="0" max="100" value={lightness} onChange={(e) => setLightness(+e.target.value)} />
      </label>
    </div>
  );
}
```

---

## 📐 TYPOGRAPHY_THEMING

### Font Family Customization

```css
/* globals.css */
@import url('https://fonts.googleapis.com/css2?family=Fira+Sans:wght@300;400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500&display=swap');

:root {
  --font-sans: 'Fira Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono: 'Fira Code', 'Courier New', monospace;
  --font-serif: 'Georgia', 'Times New Roman', serif;
}

body {
  font-family: var(--font-sans);
}

code, pre {
  font-family: var(--font-mono);
}
```

---

### Type Scale

```css
:root {
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 1.875rem;  /* 30px */
  --text-4xl: 2.25rem;   /* 36px */
  --text-5xl: 3rem;      /* 48px */
}
```

---

## 🚀 PERFORMANCE_OPTIMIZATION

### CSS Variable Scoping

Scope theme variables to specific components for better performance:

```css
/* Global scope (loaded once) */
:root {
  --primary-500: oklch(60% 0.20 250);
}

/* Component scope (only when component is used) */
.button-primary {
  --button-bg: var(--primary-500);
  background: var(--button-bg);
}
```

---

### Lazy Loading Themes

```typescript
import { lazy, Suspense } from 'react';

// Lazy load theme CSS
const CyberTheme = lazy(() => import('./themes/cyber.css'));
const MinimalTheme = lazy(() => import('./themes/minimal.css'));

function ThemeProvider({ theme, children }) {
  return (
    <Suspense fallback={<div>Loading theme...</div>}>
      {theme === 'cyber' && <CyberTheme />}
      {theme === 'minimal' && <MinimalTheme />}
      {children}
    </Suspense>
  );
}
```

---

**AUTHOR:** aazucena_theming_intelligence
