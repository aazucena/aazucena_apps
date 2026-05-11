# @aazucena/hooks : Reactive_Intelligence_Library

## SUMMARY

Comprehensive collection of 40+ production-ready React hooks organized by domain. Provides device detection, state management, animation orchestration, data fetching, and telemetry hooks with full TypeScript support and zero external UI dependencies.

---

## 🛠️ TOOLKIT_MANIFEST

| System               | Protocol         | Description                                                        |
| :------------------- | :--------------- | :----------------------------------------------------------------- |
| **Device_Hooks**     | Capability_Sense | useDeviceCapabilities, useMediaQuery, useViewport, useOrientation. |
| **State_Management** | Local_Persist    | useLocalStorage, useSessionStorage, useDebounce, useThrottle.      |
| **Animation_Hooks**  | Motion_Control   | useGSAPAnimation, useScrollProgress, useIntersectionObserver.      |
| **Data_Hooks**       | Fetch_Subscribe  | useFetch, useAsync, usePaginatedQuery, useInfiniteScroll.          |
| **Telemetry_Hooks**  | Intelligence_Log | useAnalytics, useTelemetry, usePerformanceMonitor.                 |
| **Preloader_Hooks**  | Load_Orchestrate | useLoadingProgress, usePreloaderTheme, useAssetLoader.             |
| **DOM_Hooks**        | Element_Track    | useElementSize, useClickOutside, useFocusTrap, useScrollLock.      |

---

## 🏗️ SYSTEM_FACTORIES

### [Device Hooks] : The_Sensors

- **Location:** `src/device/`
- **Logic:** Device capability detection, media queries, viewport tracking, orientation changes.
- **Exports:** `useDeviceCapabilities`, `useMediaQuery`, `useViewport`, `useOrientation`.

### [State Hooks] : The_Persistors

- **Location:** `src/state/`
- **Logic:** LocalStorage/SessionStorage state management, debouncing, throttling.
- **Exports:** `useLocalStorage`, `useSessionStorage`, `useDebounce`, `useThrottle`.

### [Animation Hooks] : The_Orchestrators

- **Location:** `src/animations/`
- **Logic:** GSAP animation setup, scroll progress tracking, intersection observers.
- **Exports:** `useGSAPAnimation`, `useScrollProgress`, `useIntersectionObserver`.

### [Data Hooks] : The_Fetchers

- **Location:** `src/data/`
- **Logic:** Async data fetching, caching, pagination, infinite scroll.
- **Exports:** `useFetch`, `useAsync`, `usePaginatedQuery`, `useInfiniteScroll`.

### [Telemetry Hooks] : The_Trackers

- **Location:** `src/telemetry/`
- **Logic:** Analytics tracking, performance monitoring, user behavior logging.
- **Exports:** `useAnalytics`, `useTelemetry`, `usePerformanceMonitor`.

### [Preloader Hooks] : The_Initializers

- **Location:** `src/preloader/`
- **Logic:** Loading progress tracking, theme management, asset loading orchestration.
- **Exports:** `useLoadingProgress`, `usePreloaderTheme`, `useAssetLoader`.

### [DOM Hooks] : The_Observers

- **Location:** `src/dom/`
- **Logic:** Element size tracking, click-outside detection, focus trapping, scroll locking.
- **Exports:** `useElementSize`, `useClickOutside`, `useFocusTrap`, `useScrollLock`.

---

## 🚦 USAGE_PROTOCOLS

### Device Capability Detection

```typescript
import { useDeviceCapabilities } from '@aazucena/hooks/device';

function AdaptiveComponent() {
  const capabilities = useDeviceCapabilities();

  if (!capabilities.canUseHeavyAnimations) {
    return <LightweightVersion />;
  }

  return (
    <div>
      <h1>Device Info</h1>
      <p>GPU: {capabilities.gpu ? 'Yes' : 'No'}</p>
      <p>Performance Tier: {capabilities.performanceTier}</p>
      <p>Touch Support: {capabilities.touch ? 'Yes' : 'No'}</p>
    </div>
  );
}
```

### Media Query Hook

```typescript
import { useMediaQuery } from '@aazucena/hooks/device';

function ResponsiveLayout() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
  const isDesktop = useMediaQuery('(min-width: 1025px)');

  return (
    <div>
      {isMobile && <MobileLayout />}
      {isTablet && <TabletLayout />}
      {isDesktop && <DesktopLayout />}
    </div>
  );
}
```

### Local Storage State

```typescript
import { useLocalStorage } from '@aazucena/hooks/state';

function ThemeToggle() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <button onClick={toggleTheme}>
      Current: {theme}
    </button>
  );
}
```

### Debounced Search

```typescript
import { useDebounce } from '@aazucena/hooks/state';
import { useState, useEffect } from 'react';

function SearchInput() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    if (debouncedSearch) {
      // Fetch search results
      fetchResults(debouncedSearch);
    }
  }, [debouncedSearch]);

  return (
    <input
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Search..."
    />
  );
}
```

### Scroll Progress Tracking

```typescript
import { useScrollProgress } from '@aazucena/hooks/animations';

function ReadingProgressBar() {
  const progress = useScrollProgress();

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-gray-200">
      <div
        className="h-full bg-primary-500 transition-all"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  );
}
```

### Intersection Observer

```typescript
import { useIntersectionObserver } from '@aazucena/hooks/animations';
import { useRef } from 'react';

function LazyImage({ src, alt }) {
  const imgRef = useRef<HTMLImageElement>(null);
  const isVisible = useIntersectionObserver(imgRef, {
    threshold: 0.1,
    rootMargin: '50px',
  });

  return (
    <img
      ref={imgRef}
      src={isVisible ? src : '/placeholder.jpg'}
      alt={alt}
      loading="lazy"
    />
  );
}
```

---

## ✅ VERIFICATION_SUITE

- **Type Safety:** Full TypeScript support with strict mode enabled.
- **Tree Shakeable:** Named exports for optimal bundling.
- **Zero UI Dependencies:** Works with any React-based framework.
- **SSR Compatible:** All hooks handle server-side rendering gracefully.
- **Performance:** Memoized values, cleanup on unmount, no memory leaks.

---

## 🔗 DEPENDENCY_GRAPH

**Internal:** @aazucena/utils, @aazucena/constants, @aazucena/types, @aazucena/design-system (for preloader)
**External:** react (peer dependency)

**Compatible:** ✅ Next.js | ✅ Astro | ✅ Remix | ✅ Vite

---

## 📚 TUTORIAL_GUIDE

### Quick Start

```bash
# 1. Install dependencies (handled by monorepo)
pnpm install

# 2. Import hooks by category
import { useDeviceCapabilities } from '@aazucena/hooks/device';
import { useLocalStorage } from '@aazucena/hooks/state';
import { useScrollProgress } from '@aazucena/hooks/animations';
```

### Common Patterns

#### Responsive Design with Media Queries

```typescript
import { useMediaQuery } from '@aazucena/hooks/device';

function ResponsiveGrid() {
  const isMobile = useMediaQuery('(max-width: 640px)');
  const isTablet = useMediaQuery('(min-width: 641px) and (max-width: 1024px)');
  const isDesktop = useMediaQuery('(min-width: 1025px)');

  const columns = isMobile ? 1 : isTablet ? 2 : 3;

  return (
    <div className={`grid grid-cols-${columns} gap-4`}>
      {/* Grid items */}
    </div>
  );
}
```

#### Persistent Form State

```typescript
import { useLocalStorage } from '@aazucena/hooks/state';
import { useState, useEffect } from 'react';

function ContactForm() {
  const [formData, setFormData] = useLocalStorage('contactForm', {
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitForm(formData);
    setFormData({ name: '', email: '', message: '' }); // Clear after submit
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="Name"
      />
      <input
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        placeholder="Email"
      />
      <textarea
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        placeholder="Message"
      />
      <button type="submit">Send</button>
    </form>
  );
}
```

#### Async Data Fetching

```typescript
import { useFetch } from '@aazucena/hooks/data';

function ProjectList() {
  const { data: projects, loading, error, refetch } = useFetch<Project[]>('/api/projects');

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <button onClick={refetch}>Refresh</button>
      {projects?.map((project) => (
        <ProjectCard key={project.id} {...project} />
      ))}
    </div>
  );
}
```

#### Infinite Scroll Pagination

```typescript
import { useInfiniteScroll } from '@aazucena/hooks/data';
import { useRef } from 'react';

function InfiniteList() {
  const loaderRef = useRef<HTMLDivElement>(null);
  const { data, loading, hasMore, loadMore } = useInfiniteScroll<Post>({
    fetchFn: (page) => fetch(`/api/posts?page=${page}`).then((r) => r.json()),
    initialPage: 1,
  });

  useIntersectionObserver(loaderRef, {
    onIntersect: () => {
      if (hasMore && !loading) {
        loadMore();
      }
    },
  });

  return (
    <div>
      {data.map((post) => (
        <PostCard key={post.id} {...post} />
      ))}
      <div ref={loaderRef}>{loading && 'Loading more...'}</div>
    </div>
  );
}
```

#### Click Outside Detection

```typescript
import { useClickOutside } from '@aazucena/hooks/dom';
import { useRef, useState } from 'react';

function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => {
    setIsOpen(false);
  });

  return (
    <div ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)}>Toggle</button>
      {isOpen && (
        <div className="dropdown-menu">
          <a href="/profile">Profile</a>
          <a href="/settings">Settings</a>
          <a href="/logout">Logout</a>
        </div>
      )}
    </div>
  );
}
```

#### Element Size Tracking

```typescript
import { useElementSize } from '@aazucena/hooks/dom';
import { useRef } from 'react';

function ResponsiveCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width, height } = useElementSize(containerRef);

  return (
    <div ref={containerRef} className="w-full h-full">
      <canvas width={width} height={height}>
        {/* Canvas content */}
      </canvas>
      <p>Container: {width}x{height}</p>
    </div>
  );
}
```

#### Performance Monitoring

```typescript
import { usePerformanceMonitor } from '@aazucena/hooks/telemetry';

function MonitoredApp({ children }) {
  const metrics = usePerformanceMonitor({
    sampleRate: 1.0,
    reportInterval: 5000,
    onReport: (metrics) => {
      console.log('Performance:', metrics);
      // Send to analytics
      fetch('/api/telemetry', {
        method: 'POST',
        body: JSON.stringify(metrics),
      });
    },
  });

  return (
    <>
      {children}
      <div className="fixed bottom-0 right-0 p-2 text-xs">
        <p>FPS: {metrics.fps}</p>
        <p>Memory: {Math.round(metrics.memory / 1024 / 1024)}MB</p>
      </div>
    </>
  );
}
```

### Advanced Usage

#### Custom Hook Composition

```typescript
import { useLocalStorage } from '@aazucena/hooks/state';
import { useMediaQuery } from '@aazucena/hooks/device';
import { useMemo } from 'react';

function useTheme() {
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  const [theme, setTheme] = useLocalStorage('theme', prefersDark ? 'dark' : 'light');

  const themeValue = useMemo(() => {
    return {
      theme,
      isDark: theme === 'dark',
      toggle: () => setTheme(theme === 'dark' ? 'light' : 'dark'),
    };
  }, [theme, setTheme]);

  return themeValue;
}

// Usage
function App() {
  const { theme, isDark, toggle } = useTheme();

  return (
    <div className={isDark ? 'dark' : ''}>
      <button onClick={toggle}>Toggle Theme</button>
    </div>
  );
}
```

#### Scroll Locking for Modals

```typescript
import { useScrollLock } from '@aazucena/hooks/dom';
import { useEffect } from 'react';

function Modal({ isOpen, onClose, children }) {
  const { lock, unlock } = useScrollLock();

  useEffect(() => {
    if (isOpen) {
      lock();
    } else {
      unlock();
    }
    return () => unlock(); // Cleanup on unmount
  }, [isOpen, lock, unlock]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button onClick={onClose}>Close</button>
        {children}
      </div>
    </div>
  );
}
```

#### Focus Trap for Accessibility

```typescript
import { useFocusTrap } from '@aazucena/hooks/dom';
import { useRef, useEffect } from 'react';

function AccessibleDialog({ isOpen, onClose }) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const { activate, deactivate } = useFocusTrap(dialogRef);

  useEffect(() => {
    if (isOpen) {
      activate();
    } else {
      deactivate();
    }
  }, [isOpen, activate, deactivate]);

  if (!isOpen) return null;

  return (
    <div ref={dialogRef} role="dialog" aria-modal="true">
      <h2>Dialog Title</h2>
      <p>Dialog content...</p>
      <button onClick={onClose}>Close</button>
    </div>
  );
}
```

### Troubleshooting

#### Hook Called Outside React Component

```typescript
// ❌ Wrong: Calling hook at module level
const capabilities = useDeviceCapabilities(); // Error

// ✅ Correct: Call inside component
function MyComponent() {
  const capabilities = useDeviceCapabilities();
  return <div>{capabilities.performanceTier}</div>;
}
```

#### useEffect Infinite Loop

```typescript
// ❌ Wrong: Missing dependency array or incorrect dependencies
useEffect(() => {
  fetchData(); // Runs on every render
});

// ✅ Correct: Add dependency array
useEffect(() => {
  fetchData();
}, []); // Runs once on mount

// ✅ Or include dependencies
useEffect(() => {
  fetchData(id);
}, [id]); // Runs when id changes
```

#### LocalStorage SSR Error

```typescript
// ❌ Wrong: Accessing localStorage during SSR
const [theme, setTheme] = useLocalStorage('theme', 'light');

// ✅ Correct: useLocalStorage hook handles SSR
// It checks if window is defined before accessing localStorage
// No changes needed - hook is already SSR-safe
```

#### Memory Leaks from Listeners

```typescript
// ❌ Wrong: Not cleaning up event listeners
useEffect(() => {
  window.addEventListener('scroll', handleScroll);
  // Missing cleanup
}, []);

// ✅ Correct: Return cleanup function
useEffect(() => {
  window.addEventListener('scroll', handleScroll);
  return () => {
    window.removeEventListener('scroll', handleScroll);
  };
}, []);
```

---

**VERSION:** 0.0.0
**STATUS:** Development
**PROVIDER:** aazucena_intelligence_engine
