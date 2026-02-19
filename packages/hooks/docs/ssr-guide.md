# SSR Compatibility Guide

## SUMMARY

Server-side rendering patterns, hydration strategies, and browser-safe implementations for @aazucena/hooks in Astro and Next.js environments.

---

## 🌐 SSR_FUNDAMENTALS

### What is SSR?

**Server-Side Rendering (SSR)** generates HTML on the server before sending to the client.

**Flow:**

1. **Server:** Render React components to HTML string
2. **Client:** Receive HTML, display immediately (fast initial paint)
3. **Hydration:** React attaches event listeners to existing HTML

**Frameworks:**

- **Astro:** Hybrid SSR/SSG with Islands architecture
- **Next.js:** Full SSR with App Router / Pages Router
- **Remix:** Server-first with nested routes

---

### Why Hooks Break SSR

**Problem:** Browser APIs don't exist on the server.

```typescript
// ❌ BREAKS SSR: window is undefined on server
function useBrokenHook() {
  const width = window.innerWidth; // ReferenceError: window is not defined
  return width;
}
```

**Common SSR Errors:**

- `ReferenceError: window is not defined`
- `ReferenceError: document is not defined`
- `ReferenceError: localStorage is not defined`
- `ReferenceError: navigator is not defined`

**Solution:** Use `useEffect` to access browser APIs (runs only on client).

---

## ✅ SSR_SAFE_PATTERNS

### Pattern 1: useEffect for Browser APIs

```typescript
import { useState, useEffect } from 'react';

// ✅ SSR-SAFE: Browser APIs accessed in useEffect
function useWindowSize() {
  const [size, setSize] = useState({
    width: 0, // Safe default
    height: 0,
  });

  useEffect(() => {
    // Only runs on client
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize(); // Initial size
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}
```

**Key Points:**

- `useEffect` only runs on the client (never on server)
- Use safe default values (0, null, undefined, false)
- Server renders with defaults, client hydrates with real values

---

### Pattern 2: Mounted Flag

```typescript
import { useState, useEffect } from 'react';

// ✅ SSR-SAFE: Mounted flag prevents hydration mismatch
function useLocalStorage<T>(key: string, defaultValue: T) {
  const [mounted, setMounted] = useState(false);
  const [value, setValue] = useState<T>(defaultValue);

  useEffect(() => {
    setMounted(true);

    try {
      const saved = localStorage.getItem(key);
      if (saved !== null) {
        setValue(JSON.parse(saved));
      }
    } catch (error) {
      console.error(`Failed to load ${key}:`, error);
    }
  }, [key]);

  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error(`Failed to save ${key}:`, error);
      }
    }
  }, [key, value, mounted]);

  return [value, setValue, mounted] as const;
}

// Usage
function Component() {
  const [theme, setTheme, mounted] = useLocalStorage('theme', 'dark');

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return <div>Loading...</div>;
  }

  return <div className={theme}>Content</div>;
}
```

**Why Mounted Flag?**

- **Server:** Renders with defaultValue
- **Client (initial render):** Still uses defaultValue (mounted = false)
- **Client (after mount):** Loads from localStorage (mounted = true)
- **Result:** Server and client HTML match, no hydration error

---

### Pattern 3: typeof window Check

```typescript
// ✅ SSR-SAFE: Check if browser environment
function useBrowserOnly() {
  const isBrowser = typeof window !== 'undefined';

  if (!isBrowser) {
    return null; // Return safe value on server
  }

  // Browser-only logic
  const width = window.innerWidth;
  return width;
}
```

**Use Cases:**

- One-time checks (not reactive)
- Conditional imports (dynamic imports)
- Feature detection

**Limitation:** Not reactive (doesn't update on window resize)

---

## 🚨 HYDRATION_MISMATCHES

### What is a Hydration Mismatch?

**Definition:** Server-rendered HTML doesn't match client-rendered HTML.

**Error Message:**

```
Warning: Text content did not match. Server: "..." Client: "..."
Warning: Expected server HTML to contain a matching <div> in <div>.
```

**Causes:**

1. Using browser APIs on initial render
2. Conditional rendering based on client-only state
3. Date.now() or Math.random() in render
4. Third-party scripts that modify DOM

---

### Example: Hydration Mismatch

```typescript
// ❌ HYDRATION MISMATCH
function BadComponent() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Server renders "false", client renders "true"
  return <div>Mounted: {mounted ? 'Yes' : 'No'}</div>;
}
```

**What Happens:**

1. Server: `<div>Mounted: No</div>`
2. Client (initial): `<div>Mounted: No</div>` (matches, good!)
3. Client (after useEffect): `<div>Mounted: Yes</div>` (updates, no error)

**If you forget the initial match:**

```typescript
// ❌ HYDRATION MISMATCH
function BadComponent() {
  const isBrowser = typeof window !== 'undefined';

  // Server: false, Client: true (immediate mismatch!)
  return <div>Browser: {isBrowser ? 'Yes' : 'No'}</div>;
}
```

---

### Fixing Hydration Mismatches

**Solution 1: Suppress Hydration Warning (Use Sparingly)**

```typescript
function Component() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div suppressHydrationWarning>
      {mounted ? 'Client Only' : 'Loading...'}
    </div>
  );
}
```

**Solution 2: Consistent Defaults**

```typescript
// ✅ NO HYDRATION MISMATCH
function Component() {
  const [theme, setTheme] = useState('dark'); // Same default on server and client

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved) {
      setTheme(saved); // Update after hydration
    }
  }, []);

  return <div className={theme}>Content</div>;
}
```

**Solution 3: Client-Only Rendering**

```typescript
import dynamic from 'next/dynamic';

// Next.js: Disable SSR for component
const ClientOnlyComponent = dynamic(() => import('./ClientOnly'), {
  ssr: false,
});

// Astro: Use client:only directive
<Component client:only="react" />
```

---

## 🎭 ASTRO_SPECIFIC_PATTERNS

### Islands Architecture

Astro uses **Islands** - interactive components in a sea of static HTML.

**Client Directives:**

- `client:load` - Hydrate immediately on page load
- `client:idle` - Hydrate when browser idle (recommended)
- `client:visible` - Hydrate when component visible
- `client:media` - Hydrate when media query matches
- `client:only` - No SSR, client-only

---

### Example: SSR-Safe Hook in Astro

```typescript
// useWindowSize.ts
import { useState, useEffect } from 'react';

export function useWindowSize() {
  const [size, setSize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}
```

```astro
---
// Component.astro
import ResponsiveComponent from './ResponsiveComponent';
---

<!-- Use client:idle for best performance -->
<ResponsiveComponent client:idle />
```

```tsx
// ResponsiveComponent.tsx
import { useWindowSize } from './useWindowSize';

export default function ResponsiveComponent() {
  const { width } = useWindowSize();

  // Safe: Only rendered on client due to client:idle
  return <div>Width: {width}px</div>;
}
```

---

### Astro SSR Mode

```typescript
// astro.config.mjs
export default {
  output: 'server', // Enable SSR
  adapter: vercel(), // Vercel adapter
};
```

**SSR Pages:**

```astro
---
// src/pages/dynamic.astro
export const prerender = false; // Enable SSR for this page

const data = await fetch('https://api.example.com/data');
---

<html>
  <body>
    <div>{data.title}</div>
  </body>
</html>
```

---

## ⚛️ NEXTJS_SPECIFIC_PATTERNS

### App Router (React Server Components)

**Server Components (default):**

- Render on server only
- Cannot use hooks
- Cannot access browser APIs

**Client Components:**

- Use `'use client'` directive
- Can use hooks
- Can access browser APIs

---

### Example: Client Component with Hooks

```tsx
'use client'; // Mark as client component

import { useWindowSize } from '@aazucena/hooks/dom';

export default function ClientComponent() {
  const { width, height } = useWindowSize();

  return (
    <div>
      Window: {width}x{height}
    </div>
  );
}
```

---

### Pages Router (Legacy)

```tsx
// pages/index.tsx
import { useEffect, useState } from 'react';

export default function Page() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div>Loading...</div>;
  }

  return <div>Client content</div>;
}
```

---

## 📚 HOOK_COMPATIBILITY_TABLE

| Hook                        | SSR Safe   | Notes                                     |
| :-------------------------- | :--------- | :---------------------------------------- |
| **useDeviceCapabilities**   | ✅ Yes     | Uses mounted flag + useEffect             |
| **useLocalStorage**         | ✅ Yes     | Returns mounted flag for safety           |
| **useWindowSize**           | ✅ Yes     | Safe defaults (width: 0, height: 0)       |
| **useIntersectionObserver** | ✅ Yes     | useEffect-based, no SSR issues            |
| **useScrollToTop**          | ✅ Yes     | Returns function (no immediate execution) |
| **useTheme**                | ✅ Yes     | Safe default + useEffect sync             |
| **useModal**                | ✅ Yes     | Pure state management                     |
| **useGSAPEntrance**         | ✅ Yes     | GSAP animations in useEffect              |
| **useFlipText**             | ✅ Yes     | Returns ref (safe)                        |
| **useSectionRefs**          | ✅ Yes     | Returns refs (safe)                       |
| **useHandlebars**           | ✅ Yes     | Pure function, no browser APIs            |
| **useCommandSearch**        | ✅ Yes     | State-based, no browser dependencies      |
| **useLoadingProgress**      | ✅ Yes     | Pure state management                     |
| **usePreloaderTheme**       | ⚠️ Caution | Check mounted before using colors         |
| **useSystemStats**          | ✅ Yes     | TanStack Query handles SSR                |
| **useSentinel**             | ✅ Yes     | TanStack Query handles SSR                |

---

## 🛠️ TESTING_SSR_COMPATIBILITY

### Test 1: Node.js Environment

```typescript
/**
 * @jest-environment node
 */

import { renderHook } from '@testing-library/react';
import { useWindowSize } from '@aazucena/hooks/dom';

describe('useWindowSize SSR', () => {
  it('should not throw in Node.js environment', () => {
    expect(() => {
      renderHook(() => useWindowSize());
    }).not.toThrow();
  });

  it('should return safe defaults on server', () => {
    const { result } = renderHook(() => useWindowSize());

    expect(result.current).toEqual({
      width: 0,
      height: 0,
    });
  });
});
```

---

### Test 2: Hydration Consistency

```typescript
import { renderToString } from 'react-dom/server';
import { render } from '@testing-library/react';

function TestComponent() {
  const [value, , mounted] = useLocalStorage('key', 'default');

  if (!mounted) {
    return <div>Loading...</div>;
  }

  return <div>{value}</div>;
}

describe('useLocalStorage hydration', () => {
  it('should match server and client HTML', () => {
    // Server render
    const serverHTML = renderToString(<TestComponent />);

    // Client render (first render before useEffect)
    const { container } = render(<TestComponent />);
    const clientHTML = container.innerHTML;

    expect(serverHTML).toBe(clientHTML);
  });
});
```

---

## 📋 SSR_CHECKLIST

### Before Releasing SSR-Safe Hook

- [ ] **No direct browser API access** (window, document, localStorage, navigator)
- [ ] **useEffect for side effects** (all browser interactions in useEffect)
- [ ] **Safe default values** (0, null, undefined, false for initial state)
- [ ] **Mounted flag** (for localStorage, theme, or stateful browser APIs)
- [ ] **Hydration test** (server and client HTML match on initial render)
- [ ] **Node.js test** (hook doesn't throw in @jest-environment node)
- [ ] **Documentation** (SSR compatibility clearly stated in docs)
- [ ] **typeof checks** (if using browser APIs conditionally)
- [ ] **Cleanup** (removeEventListener, clearTimeout, etc.)
- [ ] **Dynamic imports** (for heavy browser-only dependencies)

---

## 🎯 REAL_WORLD_EXAMPLES

### useDeviceCapabilities (SSR-Safe)

```typescript
import { useState, useEffect } from 'react';
import type { DeviceCapabilities } from '@aazucena/types';
import { detectDeviceCapabilities } from '@aazucena/utils';

const STORAGE_KEY = 'portfolioSettings';

export function useDeviceCapabilities() {
  const [mounted, setMounted] = useState(false);
  const [capabilities, setCapabilities] = useState<DeviceCapabilities>({
    isMobile: false,
    performanceTier: 'medium',
    canUseHeavyAnimations: true,
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    setMounted(true);

    const loadSettings = (): DeviceCapabilities => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && typeof parsed === 'object') {
            return {
              isMobile: parsed.isMobile ?? false,
              performanceTier: ['low', 'medium', 'high'].includes(parsed.performanceTier)
                ? parsed.performanceTier
                : 'medium',
              canUseHeavyAnimations: parsed.canUseHeavyAnimations ?? true,
            };
          }
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      }

      // Detect device capabilities as fallback
      return detectDeviceCapabilities();
    };

    setCapabilities(loadSettings());
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(capabilities));
      } catch (error) {
        console.error('Failed to save settings:', error);
      }
    }
  }, [capabilities, mounted]);

  const updateCapabilities = (updates: Partial<DeviceCapabilities>) => {
    setCapabilities((prev) => ({ ...prev, ...updates }));
  };

  return { capabilities, updateCapabilities, mounted };
}
```

**SSR-Safe Features:**

1. ✅ Safe defaults: `{ isMobile: false, performanceTier: 'medium', ... }`
2. ✅ Mounted flag: Prevents hydration mismatch
3. ✅ useEffect: Browser APIs accessed only on client
4. ✅ Try-catch: Handles localStorage errors gracefully
5. ✅ Fallback: Uses detectDeviceCapabilities if localStorage empty

**Usage:**

```tsx
function Component() {
  const { capabilities, mounted } = useDeviceCapabilities();

  // Prevent hydration mismatch
  if (!mounted) {
    return <div>Loading...</div>;
  }

  return <div>Mobile: {capabilities.isMobile ? 'Yes' : 'No'}</div>;
}
```

---

### useTheme (SSR-Safe with System Preference)

```typescript
import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

type Theme = 'light' | 'dark' | 'system';

export function useTheme() {
  const [theme, setTheme, mounted] = useLocalStorage<Theme>('theme', 'system');
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('dark');

  // Detect system theme preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const updateSystemTheme = () => {
      setSystemTheme(mediaQuery.matches ? 'dark' : 'light');
    };

    updateSystemTheme();
    mediaQuery.addEventListener('change', updateSystemTheme);

    return () => mediaQuery.removeEventListener('change', updateSystemTheme);
  }, []);

  const isDark = theme === 'dark' || (theme === 'system' && systemTheme === 'dark');

  return { theme, setTheme, systemTheme, isDark, mounted };
}
```

**Usage:**

```tsx
function ThemeProvider({ children }) {
  const { isDark, mounted } = useTheme();

  // Prevent flash of wrong theme
  if (!mounted) {
    return <div className="theme-loading">{children}</div>;
  }

  return <div className={isDark ? 'dark' : 'light'}>{children}</div>;
}
```

---

## 🔥 COMMON_PITFALLS

### Pitfall 1: Direct Browser API Access

```typescript
// ❌ BREAKS SSR
function useBadHook() {
  const width = window.innerWidth; // ReferenceError on server
  return width;
}

// ✅ FIX: Use useEffect
function useGoodHook() {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    setWidth(window.innerWidth);
  }, []);

  return width;
}
```

---

### Pitfall 2: Missing Mounted Flag

```typescript
// ❌ HYDRATION MISMATCH
function useBadLocalStorage(key: string, defaultValue: string) {
  const [value, setValue] = useState(() => {
    // localStorage accessed on server (breaks)
    const saved = localStorage.getItem(key);
    return saved ?? defaultValue;
  });

  return [value, setValue];
}

// ✅ FIX: Use mounted flag
function useGoodLocalStorage(key: string, defaultValue: string) {
  const [mounted, setMounted] = useState(false);
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem(key);
    if (saved) setValue(saved);
  }, [key]);

  return [value, setValue, mounted];
}
```

---

### Pitfall 3: Conditional typeof Checks in Render

```typescript
// ❌ HYDRATION MISMATCH
function BadComponent() {
  const isBrowser = typeof window !== 'undefined';

  // Server: "No", Client: "Yes" (mismatch!)
  return <div>Browser: {isBrowser ? 'Yes' : 'No'}</div>;
}

// ✅ FIX: Use mounted flag
function GoodComponent() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return <div>Browser: {mounted ? 'Yes' : 'No'}</div>;
}
```

---

**AUTHOR:** aazucena_ssr_intelligence
