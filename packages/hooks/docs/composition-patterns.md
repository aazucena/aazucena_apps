# Hook Composition Patterns

## SUMMARY

Strategies for composing custom hooks to create powerful, reusable abstractions.

---

## BASIC_COMPOSITION

### Combining Multiple Hooks

```typescript
import { useLocalStorage } from '@aazucena/hooks/state';
import { useMediaQuery } from '@aazucena/hooks/device';
import { useMemo } from 'react';

function useTheme() {
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  const [theme, setTheme] = useLocalStorage('theme', prefersDark ? 'dark' : 'light');

  const themeValue = useMemo(
    () => ({
      theme,
      isDark: theme === 'dark',
      toggle: () => setTheme(theme === 'dark' ? 'light' : 'dark'),
    }),
    [theme, setTheme]
  );

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

---

## CONDITIONAL_HOOKS

### Hook with Conditional Logic

```typescript
import { useDeviceCapabilities } from '@aazucena/hooks/device';
import { useScrollProgress } from '@aazucena/hooks/animations';

function useAdaptiveScroll() {
  const { performanceTier } = useDeviceCapabilities();

  // Only track scroll on high-performance devices
  const scrollProgress = useScrollProgress(performanceTier === 'high');

  return {
    scrollProgress: performanceTier === 'high' ? scrollProgress : 0,
    isTracking: performanceTier === 'high',
  };
}
```

---

## DEPENDENT_HOOKS

### Chaining Hook Dependencies

```typescript
import { useFetch } from '@aazucena/hooks/data';
import { useDebounce } from '@aazucena/hooks/state';
import { useState, useEffect } from 'react';

function useSearchResults(query: string) {
  const debouncedQuery = useDebounce(query, 500);

  const { data, loading, error } = useFetch<SearchResult[]>(
    debouncedQuery ? `/api/search?q=${debouncedQuery}` : null
  );

  return {
    results: data || [],
    loading: loading && !!debouncedQuery,
    error,
  };
}

// Usage
function SearchBar() {
  const [query, setQuery] = useState('');
  const { results, loading } = useSearchResults(query);

  return (
    <>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      {loading && <Spinner />}
      {results.map((result) => (
        <SearchResult key={result.id} {...result} />
      ))}
    </>
  );
}
```

---

## FACTORY_PATTERN

### Creating Hook Factories

```typescript
function createStorageHook(storage: Storage) {
  return function useStorage<T>(key: string, initialValue: T) {
    const [value, setValue] = useState<T>(() => {
      try {
        const item = storage.getItem(key);
        return item ? JSON.parse(item) : initialValue;
      } catch {
        return initialValue;
      }
    });

    useEffect(() => {
      storage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue] as const;
  };
}

// Create specialized hooks
const useLocalStorage = createStorageHook(localStorage);
const useSessionStorage = createStorageHook(sessionStorage);

// Usage
const [theme, setTheme] = useLocalStorage('theme', 'light');
const [token, setToken] = useSessionStorage('token', '');
```

---

**AUTHOR:** aazucena_hooks_patterns
