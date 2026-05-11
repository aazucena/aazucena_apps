# Hook Performance Guide

## SUMMARY

Optimization strategies, memoization techniques, and performance profiling for custom hooks in @aazucena/hooks.

---

## 🚀 OPTIMIZATION_FUNDAMENTALS

### Why Hook Performance Matters

Custom hooks can inadvertently cause performance issues:

**Common Problems:**

1. **Unnecessary Re-renders** - Hook returns new object/function references every render
2. **Expensive Calculations** - Hook recomputes values on every render
3. **Memory Leaks** - Effect cleanup not properly implemented
4. **Event Listener Bloat** - Multiple listeners for same event
5. **Stale Closures** - Captured values in callbacks become outdated

**Impact:**

- Slow interactions (>100ms delay perceived as sluggish)
- High memory usage (garbage collection pauses)
- Battery drain on mobile devices
- Poor user experience

---

## 🎯 MEMOIZATION_PATTERNS

### useMemo for Expensive Calculations

**Problem:** Recomputing expensive values on every render.

```typescript
// ❌ BAD: Expensive calculation on every render
function useFilteredProjects(projects, query) {
  const filtered = projects.filter((p) => p.title.toLowerCase().includes(query.toLowerCase()));

  return filtered; // New array reference every render
}

// ✅ GOOD: Memoize expensive calculation
import { useMemo } from 'react';

function useFilteredProjects(projects, query) {
  const filtered = useMemo(() => {
    return projects.filter((p) => p.title.toLowerCase().includes(query.toLowerCase()));
  }, [projects, query]); // Only recompute when dependencies change

  return filtered;
}
```

**When to use useMemo:**

- Filtering/sorting large arrays (>100 items)
- Complex transformations (nested maps/filters)
- Heavy string operations (regex, parsing)
- Mathematical calculations (>10ms to compute)

**When NOT to use useMemo:**

- Simple operations (<1ms)
- Primitive values (numbers, strings, booleans)
- Values already memoized by parent

**Benchmark:**

```typescript
function useHeavyComputation(data) {
  // Measure computation time
  console.time('computation');

  const result = useMemo(() => {
    // Heavy computation
    return data.map(...).filter(...).reduce(...);
  }, [data]);

  console.timeEnd('computation'); // Log time

  return result;
}
```

---

### useCallback for Stable Function References

**Problem:** New function reference on every render causes child re-renders.

```typescript
// ❌ BAD: New function every render
function useProjectActions() {
  const deleteProject = (id) => {
    fetch(`/api/projects/${id}`, { method: 'DELETE' });
  };

  return { deleteProject }; // New reference every render
}

// Child component re-renders unnecessarily
function ProjectCard({ project, onDelete }) {
  // onDelete changes every render, so ProjectCard re-renders
}

// ✅ GOOD: Memoize function with useCallback
import { useCallback } from 'react';

function useProjectActions() {
  const deleteProject = useCallback((id) => {
    fetch(`/api/projects/${id}`, { method: 'DELETE' });
  }, []); // Empty deps = stable reference

  return { deleteProject };
}
```

**When to use useCallback:**

- Function passed as prop to memoized child
- Function used in dependency array of useEffect/useMemo
- Event handlers attached to DOM elements
- Callbacks passed to third-party libraries

**When NOT to use useCallback:**

- Function used only inside component
- Function not passed as prop
- Over-optimization (adds complexity for no gain)

---

### Memoizing Object Returns

**Problem:** Returning new object literals causes re-renders.

```typescript
// ❌ BAD: New object reference every render
function useTheme() {
  const [theme, setTheme] = useState('dark');

  return {
    theme,
    isDark: theme === 'dark',
    toggle: () => setTheme(theme === 'dark' ? 'light' : 'dark'),
  }; // New object every render
}

// ✅ GOOD: Memoize object return
import { useMemo, useCallback } from 'react';

function useTheme() {
  const [theme, setTheme] = useState('dark');

  const toggle = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  return useMemo(
    () => ({
      theme,
      isDark: theme === 'dark',
      toggle,
    }),
    [theme, toggle],
  );
}
```

**Pattern for Complex Returns:**

```typescript
function useComplexHook(props) {
  const stableCallback1 = useCallback(
    () => {},
    [
      /* deps */
    ],
  );
  const stableCallback2 = useCallback(
    () => {},
    [
      /* deps */
    ],
  );

  const computedValue = useMemo(
    () => {
      // Expensive computation
    },
    [
      /* deps */
    ],
  );

  // Return memoized object
  return useMemo(
    () => ({
      value: computedValue,
      action1: stableCallback1,
      action2: stableCallback2,
    }),
    [computedValue, stableCallback1, stableCallback2],
  );
}
```

---

## ⚡ EFFECT_OPTIMIZATION

### Minimize Effect Dependencies

**Problem:** Effect runs too frequently due to unnecessary dependencies.

```typescript
// ❌ BAD: Effect runs on every render
function useFetchProject(id, options) {
  const [project, setProject] = useState(null);

  useEffect(() => {
    fetch(`/api/projects/${id}`, options).then((res) => setProject(res));
  }, [id, options]); // options is new object every render!

  return project;
}

// ✅ GOOD: Stable dependencies
function useFetchProject(id, optionsParam) {
  const [project, setProject] = useState(null);

  // Extract only needed values
  const { method, headers } = optionsParam;

  // Memoize complex options
  const options = useMemo(() => ({ method, headers }), [method, headers]);

  useEffect(() => {
    fetch(`/api/projects/${id}`, options).then((res) => setProject(res));
  }, [id, options]); // Stable dependencies

  return project;
}
```

**Strategies:**

1. Extract primitive values from objects
2. Use refs for values that don't need re-renders
3. Memoize object/array dependencies
4. Use functional setState to avoid state dependency

---

### Debouncing Effects

**Problem:** Effect fires too frequently (e.g., on every keystroke).

```typescript
// ❌ BAD: API call on every keystroke
function useSearch(query) {
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetch(`/api/search?q=${query}`)
      .then((res) => res.json())
      .then(setResults);
  }, [query]); // Fires on every character typed!

  return results;
}

// ✅ GOOD: Debounce API calls
function useSearch(query) {
  const [results, setResults] = useState([]);
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  // Debounce query changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  // Fetch with debounced query
  useEffect(() => {
    if (!debouncedQuery) return;

    fetch(`/api/search?q=${debouncedQuery}`)
      .then((res) => res.json())
      .then(setResults);
  }, [debouncedQuery]);

  return results;
}
```

**Reusable Debounce Hook:**

```typescript
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// Usage
function useSearch(query) {
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    // Fetch with debouncedQuery
  }, [debouncedQuery]);
}
```

---

### Cleanup to Prevent Memory Leaks

**Problem:** Event listeners, timers, or subscriptions not cleaned up.

```typescript
// ❌ BAD: Memory leak - no cleanup
function useWindowSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', handleResize);
    // Missing cleanup!
  }, []);

  return size;
}

// ✅ GOOD: Proper cleanup
function useWindowSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call

    return () => {
      window.removeEventListener('resize', handleResize); // Cleanup
    };
  }, []);

  return size;
}
```

**Common Cleanup Patterns:**

```typescript
// Timer cleanup
useEffect(() => {
  const timer = setTimeout(() => {}, 1000);
  return () => clearTimeout(timer);
}, []);

// Interval cleanup
useEffect(() => {
  const interval = setInterval(() => {}, 1000);
  return () => clearInterval(interval);
}, []);

// Event listener cleanup
useEffect(() => {
  const handler = () => {};
  window.addEventListener('event', handler);
  return () => window.removeEventListener('event', handler);
}, []);

// AbortController for fetch cleanup
useEffect(() => {
  const controller = new AbortController();

  fetch('/api/data', { signal: controller.signal })
    .then((res) => res.json())
    .then(setData);

  return () => controller.abort(); // Cancel fetch on unmount
}, []);

// Subscription cleanup
useEffect(() => {
  const subscription = observable.subscribe((value) => {
    setState(value);
  });

  return () => subscription.unsubscribe();
}, [observable]);
```

---

## 🔍 REF_OPTIMIZATION

### useRef for Mutable Values

**Problem:** Using state for values that don't need re-renders.

```typescript
// ❌ BAD: Unnecessary re-renders
function useHover() {
  const [isHovering, setIsHovering] = useState(false);
  const [hoverCount, setHoverCount] = useState(0);

  const handleMouseEnter = () => {
    setIsHovering(true);
    setHoverCount((c) => c + 1); // Causes re-render for counter
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  return { isHovering, hoverCount, handleMouseEnter, handleMouseLeave };
}

// ✅ GOOD: Use ref for count (no re-render needed)
function useHover() {
  const [isHovering, setIsHovering] = useState(false);
  const hoverCountRef = useRef(0);

  const handleMouseEnter = () => {
    setIsHovering(true);
    hoverCountRef.current += 1; // No re-render
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const getHoverCount = () => hoverCountRef.current;

  return { isHovering, getHoverCount, handleMouseEnter, handleMouseLeave };
}
```

**Use refs for:**

- Timers and intervals
- Animation frame IDs
- DOM element references
- Previous values (usePrevious pattern)
- Counters that don't affect UI

---

### usePrevious Pattern

```typescript
function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

// Usage
function Component({ count }) {
  const prevCount = usePrevious(count);

  useEffect(() => {
    console.log(`Count changed from ${prevCount} to ${count}`);
  }, [count, prevCount]);
}
```

---

## 📊 PROFILING_HOOKS

### React DevTools Profiler

**Identify Slow Hooks:**

1. Open React DevTools → Profiler tab
2. Click "Start profiling"
3. Interact with UI
4. Click "Stop profiling"
5. Analyze flame graph:
   - Look for long bars (slow components)
   - Check "Ranked" view for slowest components
   - Identify components using slow hooks

**Metrics to Watch:**

- **Render Duration:** Time to render component (should be <16ms for 60fps)
- **Commit Phase:** Time to update DOM (should be <10ms)
- **Why Did This Render:** Shows which prop/state changed

---

### Performance Measurement

**Measure Hook Execution Time:**

```typescript
function useMeasuredHook(props) {
  const startTime = performance.now();

  // Hook logic
  const result = useSomeExpensiveOperation(props);

  const endTime = performance.now();
  const duration = endTime - startTime;

  // Log slow operations
  if (duration > 5) {
    console.warn(`Hook took ${duration.toFixed(2)}ms`, { props });
  }

  return result;
}
```

**Production Monitoring:**

```typescript
import { trackEvent } from '@aazucena/analytics';

function useMonitoredHook(props) {
  const startTime = useRef(performance.now());

  useEffect(() => {
    const duration = performance.now() - startTime.current;

    if (duration > 10) {
      trackEvent({
        category: 'performance',
        action: 'slow_hook',
        label: 'useMonitoredHook',
        value: duration,
        metadata: { props },
      });
    }
  }, [props]);

  // Hook logic
}
```

---

## 🎨 RENDER_OPTIMIZATION

### React.memo for Components Using Hooks

```typescript
// Component using custom hook
function ProjectCard({ project, onDelete }) {
  const { isHovering, hoverProps } = useHover();

  return (
    <div {...hoverProps}>
      <h3>{project.title}</h3>
      {isHovering && <button onClick={() => onDelete(project.id)}>Delete</button>}
    </div>
  );
}

// ✅ Memoize to prevent re-renders when props unchanged
export default React.memo(ProjectCard, (prevProps, nextProps) => {
  // Custom comparison
  return (
    prevProps.project.id === nextProps.project.id &&
    prevProps.onDelete === nextProps.onDelete
  );
});
```

---

### Lazy State Initialization

**Problem:** Expensive initial state calculation on every render.

```typescript
// ❌ BAD: Expensive calculation on every render
function useExpensiveState() {
  const [data, setData] = useState(expensiveComputation());
  // expensiveComputation() runs on every render!
}

// ✅ GOOD: Lazy initialization
function useExpensiveState() {
  const [data, setData] = useState(() => expensiveComputation());
  // Function only called once during initialization
}
```

---

## 🧪 TESTING_PERFORMANCE

### Benchmarking Hooks

```typescript
import { renderHook } from '@testing-library/react';
import { performance } from 'perf_hooks';

describe('useFilteredProjects performance', () => {
  it('should complete within 10ms for 1000 items', () => {
    const projects = Array.from({ length: 1000 }, (_, i) => ({
      id: i,
      title: `Project ${i}`,
    }));

    const start = performance.now();

    renderHook(() => useFilteredProjects(projects, 'Project 5'));

    const duration = performance.now() - start;

    expect(duration).toBeLessThan(10);
  });
});
```

---

## 📋 PERFORMANCE_CHECKLIST

### Before Releasing a Hook

- [ ] **Memoization:** All object/function returns memoized
- [ ] **Dependencies:** Effect dependencies minimized and stable
- [ ] **Cleanup:** All event listeners, timers, subscriptions cleaned up
- [ ] **Refs:** Mutable values use refs instead of state
- [ ] **Debouncing:** Frequent updates debounced/throttled
- [ ] **Lazy Init:** Expensive initial state uses lazy initialization
- [ ] **Profiling:** Tested with React DevTools Profiler
- [ ] **Benchmarking:** Performance tests for edge cases
- [ ] **Documentation:** Performance characteristics documented
- [ ] **SSR Safe:** Works without window/document access

---

## 🚨 ANTI_PATTERNS

### Over-Optimization

```typescript
// ❌ BAD: Over-optimized for no benefit
function useSimpleCounter() {
  const [count, setCount] = useState(0);

  // Unnecessary memoization for simple value
  const increment = useCallback(() => {
    setCount((c) => c + 1);
  }, []);

  // Unnecessary memoization for primitive
  const doubleCount = useMemo(() => count * 2, [count]);

  return useMemo(() => ({ count, increment, doubleCount }), [count, increment, doubleCount]);
}

// ✅ GOOD: Simple and clear
function useSimpleCounter() {
  const [count, setCount] = useState(0);

  const increment = () => setCount((c) => c + 1);
  const doubleCount = count * 2;

  return { count, increment, doubleCount };
}
```

**Rule of Thumb:** Only optimize when:

1. Profiling shows a performance issue
2. Hook used in hot path (renders >60fps)
3. Processing large data sets (>100 items)
4. Function passed to memoized child component

---

### Premature Ref Usage

```typescript
// ❌ BAD: Using ref when state is needed
function useToggle() {
  const isOpenRef = useRef(false);

  const toggle = () => {
    isOpenRef.current = !isOpenRef.current;
    // Component won't re-render!
  };

  return { isOpen: isOpenRef.current, toggle };
}

// ✅ GOOD: Use state for values that affect UI
function useToggle() {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen((prev) => !prev);

  return { isOpen, toggle };
}
```

---

## 📖 REAL_WORLD_EXAMPLES

### Optimized useDeviceCapabilities

```typescript
import { useState, useEffect, useMemo, useCallback } from 'react';
import { detectDeviceCapabilities } from '@aazucena/utils';

const STORAGE_KEY = 'portfolioSettings';

export function useDeviceCapabilities() {
  const [mounted, setMounted] = useState(false);
  const [capabilities, setCapabilities] = useState(() => ({
    isMobile: false,
    performanceTier: 'medium' as const,
    canUseHeavyAnimations: true,
  }));

  // Load settings on mount
  useEffect(() => {
    setMounted(true);

    const loadSettings = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : detectDeviceCapabilities();
      } catch {
        return detectDeviceCapabilities();
      }
    };

    setCapabilities(loadSettings());
  }, []);

  // Save settings when changed
  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(capabilities));
      } catch (error) {
        console.error('Failed to save settings:', error);
      }
    }
  }, [capabilities, mounted]);

  // Memoized update function
  const updateCapabilities = useCallback((updates) => {
    setCapabilities((prev) => ({ ...prev, ...updates }));
  }, []);

  // Memoized return object
  return useMemo(
    () => ({ capabilities, updateCapabilities, mounted }),
    [capabilities, updateCapabilities, mounted],
  );
}
```

**Optimizations:**

1. Lazy state initialization for capabilities
2. Memoized updateCapabilities with useCallback
3. Memoized return object to prevent re-renders
4. Cleanup handled by React (no manual cleanup needed)

---

### Optimized useFetch with Abort

```typescript
import { useState, useEffect, useRef, useMemo } from 'react';

export function useFetch<T>(url: string | null) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Use ref to avoid re-creating AbortController
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!url) return;

    // Create new controller for this fetch
    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    setLoading(true);
    setError(null);

    fetch(url, { signal })
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setError(err);
          setLoading(false);
        }
      });

    // Cleanup: abort fetch on unmount or URL change
    return () => {
      abortControllerRef.current?.abort();
    };
  }, [url]);

  // Memoize return object
  return useMemo(() => ({ data, loading, error }), [data, loading, error]);
}
```

**Optimizations:**

1. AbortController ref prevents re-creation
2. Proper cleanup with abort on unmount
3. Memoized return object
4. Handles abort errors gracefully

---

**AUTHOR:** aazucena_performance_intelligence
