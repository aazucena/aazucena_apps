# Best Practices Guide

## SUMMARY

Strategic guide to using @aazucena/utils effectively: performance optimization, tree-shaking strategies, when to use utilities vs hooks, and SSR considerations.

---

## 🎯 UTILS_VS_HOOKS

### When to Use Utilities

✅ **Pure Functions** - No React state or lifecycle needed:

```typescript
// ✅ GOOD: Pure utility
import { slugify, formatDate } from '@aazucena/utils';

const slug = slugify(title);
const date = formatDate(publishedAt, 'MMM dd, yyyy');
```

✅ **One-Time Computations** - Calculate once, no reactivity:

```typescript
// ✅ GOOD: One-time calculation
import { calculateReadingTime } from '@aazucena/utils';

function BlogPost({ content }) {
  const readingTime = calculateReadingTime(content); // Only computed once
  return <p>{readingTime}</p>;
}
```

✅ **Server-Side Rendering** - Works in Node.js environment:

```typescript
// ✅ GOOD: SSR-safe
import { formatCurrency } from '@aazucena/utils';

export async function getStaticProps() {
  const price = formatCurrency(product.price);
  return { props: { price } };
}
```

---

### When to Use Hooks

❌ **Reactive State** - Needs to update when dependencies change:

```typescript
// ❌ WRONG: Using utility for reactive state
import { getScrollProgress } from '@aazucena/utils';

function Component() {
  const progress = getScrollProgress(); // Only computed once, never updates
  return <div>{progress}</div>;
}

// ✅ CORRECT: Use hook for reactive state
import { useScrollProgress } from '@aazucena/hooks';

function Component() {
  const progress = useScrollProgress(); // Updates on scroll
  return <div>{progress}</div>;
}
```

❌ **Browser APIs** - Requires window/document access:

```typescript
// ❌ WRONG: Direct browser API access
import { isMobile } from '@aazucena/utils';

function Component() {
  if (isMobile()) {
    // SSR will fail - window not available
  }
}

// ✅ CORRECT: Use hook with SSR safety
import { useMediaQuery } from '@aazucena/hooks';

function Component() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  // ...
}
```

❌ **Lifecycle Integration** - Needs useEffect, useState:

```typescript
// ❌ WRONG: Trying to use utility for side effects
import { debounce } from '@aazucena/utils';

function SearchInput() {
  const handleSearch = debounce((query) => {
    fetchResults(query);
  }, 500);

  return <input onChange={(e) => handleSearch(e.target.value)} />;
  // Problem: debounce function recreated on every render
}

// ✅ CORRECT: Use hook for proper lifecycle
import { useDebounce } from '@aazucena/hooks';

function SearchInput() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    if (debouncedQuery) {
      fetchResults(debouncedQuery);
    }
  }, [debouncedQuery]);

  return <input onChange={(e) => setQuery(e.target.value)} />;
}
```

---

## 🌲 TREE_SHAKING

### Named Exports Only

The utils package uses **named exports** for optimal tree-shaking:

```typescript
// ✅ GOOD: Named imports (tree-shakeable)
import { slugify, formatDate, cn } from '@aazucena/utils';

// ❌ BAD: Default import (imports everything)
import utils from '@aazucena/utils'; // Don't do this
```

---

### Import What You Need

```typescript
// ✅ GOOD: Import only used utilities
import { formatDate } from '@aazucena/utils';

const date = formatDate(new Date(), 'MMM dd');

// ❌ BAD: Importing unused utilities
import { formatDate, formatCurrency, abbreviateNumber } from '@aazucena/utils';
// Only formatDate is used, but all are bundled
```

---

### Bundle Size Impact

```typescript
// Import only cn: +3 KB (clsx + tailwind-merge)
import { cn } from '@aazucena/utils';

// Import only formatDate: +50 KB (Luxon)
import { formatDate } from '@aazucena/utils';

// Import both: +53 KB total
import { cn, formatDate } from '@aazucena/utils';
```

**Strategy:** Be mindful of heavy dependencies (Luxon, ua-parser-js). Consider alternatives for client-side bundles.

---

## ⚡ PERFORMANCE_OPTIMIZATION

### Memoize Expensive Computations

```typescript
import { useMemo } from 'react';
import { generateTOC } from '@aazucena/utils';

function Article({ content }) {
  // ❌ BAD: Recomputes TOC on every render
  const toc = generateTOC(content);

  // ✅ GOOD: Memoize expensive computation
  const toc = useMemo(() => generateTOC(content), [content]);

  return <TableOfContents items={toc} />;
}
```

---

### Cache Utility Results

```typescript
import { memoize, readingTime } from '@aazucena/utils';

// Create memoized version once
const cachedReadingTime = memoize(readingTime);

function BlogCard({ content }) {
  const time = cachedReadingTime(content); // Cached for same content
  return <p>{time}</p>;
}
```

---

### Avoid Premature Optimization

```typescript
// ❌ OVER-OPTIMIZATION: Caching simple operations
const cachedCapitalize = memoize(capitalize);
const title = cachedCapitalize('hello'); // capitalize() is already fast

// ✅ CORRECT: Cache only expensive operations
const cachedTOC = memoize(generateTOC);
const toc = cachedTOC(htmlContent); // TOC generation is expensive
```

---

## 🖥️ SSR_CONSIDERATIONS

### Browser-Only Utilities

Some utilities require browser APIs and must be used carefully with SSR:

```typescript
import { getScrollProgress, isInViewport } from '@aazucena/utils';

// ❌ BAD: SSR will fail
function Component() {
  const progress = getScrollProgress(); // window not available
  return <div>{progress}</div>;
}

// ✅ GOOD: Guard with browser check
function Component() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setProgress(getScrollProgress());
    }
  }, []);

  return <div>{progress}</div>;
}
```

---

### SSR-Safe Utilities

These utilities work in both Node.js and browser:

```typescript
import {
  slugify,
  formatDate,
  capitalize,
  truncate,
  formatCurrency,
  markdownToHtml,
} from '@aazucena/utils';

// ✅ SSR-SAFE: Can be used in getStaticProps, getServerSideProps
export async function getStaticProps() {
  const slug = slugify(post.title);
  const date = formatDate(post.publishedAt, 'MMM dd');
  const excerpt = truncate(post.content, 200);

  return { props: { slug, date, excerpt } };
}
```

---

### Browser Detection During SSR

```typescript
import { isMobile, getDeviceInfo } from '@aazucena/utils';

// ❌ BAD: SSR will use server's user agent
function Component() {
  const mobile = isMobile(); // Always false on server
  return mobile ? <MobileView /> : <DesktopView />;
}

// ✅ GOOD: Hydration-safe approach
function Component() {
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  useEffect(() => {
    setIsMobileDevice(isMobile());
  }, []);

  if (!isMobileDevice && typeof window === 'undefined') {
    return <DesktopView />; // Default SSR render
  }

  return isMobileDevice ? <MobileView /> : <DesktopView />;
}
```

---

## 🎨 STYLING_UTILITIES

### cn() Best Practices

```typescript
import { cn } from '@aazucena/utils';

// ✅ GOOD: Conditional classes
<button className={cn('btn', isActive && 'btn-active', 'btn-primary')} />

// ✅ GOOD: Array syntax
<button className={cn(['btn', 'btn-primary', isActive && 'btn-active'])} />

// ✅ GOOD: Object syntax
<button className={cn({ btn: true, 'btn-active': isActive })} />

// ❌ BAD: Dynamic Tailwind classes (won't work with JIT)
const color = 'blue';
<button className={cn(`bg-${color}-500`)} /> // Tailwind won't generate this

// ✅ GOOD: Use variants or full class names
const colors = { blue: 'bg-blue-500', red: 'bg-red-500' };
<button className={cn(colors[color])} />
```

---

## 📝 DEBOUNCE_VS_THROTTLE

### Debounce Use Cases

```typescript
import { debounce } from '@aazucena/utils';

// ✅ GOOD: Search input (wait for user to stop typing)
const handleSearch = debounce((query) => {
  fetchResults(query);
}, 500);

// ✅ GOOD: Form validation (wait for user to finish input)
const validateEmail = debounce((email) => {
  checkEmailAvailability(email);
}, 1000);

// ✅ GOOD: Window resize (wait for resize to finish)
const handleResize = debounce(() => {
  updateLayout();
}, 300);
```

**When to use:** Wait for activity to stop before executing.

---

### Throttle Use Cases

```typescript
import { throttle } from '@aazucena/utils';

// ✅ GOOD: Scroll handler (execute regularly while scrolling)
const handleScroll = throttle(() => {
  updateScrollPosition();
}, 100);

// ✅ GOOD: Mouse move (track position at regular intervals)
const handleMouseMove = throttle((e) => {
  trackCursor(e.clientX, e.clientY);
}, 50);

// ✅ GOOD: API rate limiting (max 1 request per second)
const makeRequest = throttle((data) => {
  fetch('/api/track', { method: 'POST', body: data });
}, 1000);
```

**When to use:** Execute at regular intervals while activity continues.

---

## 🔢 NUMBER_FORMATTING

### Locale-Aware Formatting

```typescript
import { formatCurrency, formatPercent } from '@aazucena/utils';

// Default: US format
formatCurrency(1234.56); // '$1,234.56'

// Custom locale (if needed, extend utility):
const formatEuro = (amount: number) => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
};
```

---

### Abbreviation Thresholds

```typescript
import { abbreviateNumber } from '@aazucena/utils';

// Automatic abbreviation
abbreviateNumber(999); // '999' (no abbreviation)
abbreviateNumber(1000); // '1.0K'
abbreviateNumber(1500); // '1.5K'
abbreviateNumber(1000000); // '1.0M'

// Consider context: don't abbreviate small numbers
// ❌ BAD: Over-abbreviating
const likes = abbreviateNumber(42); // '42' (pointless)

// ✅ GOOD: Abbreviate only large numbers
const followers = count > 999 ? abbreviateNumber(count) : count;
```

---

## 🗓️ DATE_FORMATTING

### Consistent Formatting

```typescript
import { formatDate } from '@aazucena/utils';

// ✅ GOOD: Consistent format across app
const DATE_FORMAT = 'MMM dd, yyyy';

function PostCard({ post }) {
  return <p>{formatDate(post.publishedAt, DATE_FORMAT)}</p>;
}

function Comment({ comment }) {
  return <p>{formatDate(comment.createdAt, DATE_FORMAT)}</p>;
}
```

---

### Relative vs Absolute Time

```typescript
import { relativeTime, formatDate } from '@aazucena/utils';

// ✅ GOOD: Relative time for recent content
const isRecent = Date.now() - date.getTime() < 7 * 24 * 60 * 60 * 1000; // 7 days

const displayDate = isRecent
  ? relativeTime(date) // '2 hours ago'
  : formatDate(date, 'MMM dd, yyyy'); // 'Feb 05, 2026'
```

---

## 🚫 ANTI_PATTERNS

### Don't Recreate Utilities

```typescript
// ❌ BAD: Recreating utility on every render
function Component() {
  const slugify = (text: string) => text.toLowerCase().replace(/\s+/g, '-');
  const slug = slugify(title);
}

// ✅ GOOD: Use existing utility
import { slugify } from '@aazucena/utils';

function Component() {
  const slug = slugify(title);
}
```

---

### Don't Mix Concerns

```typescript
// ❌ BAD: Mixing utility logic with component logic
function BlogPost({ post }) {
  const slug = post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const excerpt = post.content.slice(0, 200) + '...';
  const time = Math.ceil(post.content.split(' ').length / 200) + ' min read';

  return <article>...</article>;
}

// ✅ GOOD: Use utilities for pure transformations
import { slugify, truncate, readingTime } from '@aazucena/utils';

function BlogPost({ post }) {
  const slug = slugify(post.title);
  const excerpt = truncate(post.content, 200);
  const time = readingTime(post.content);

  return <article>...</article>;
}
```

---

### Don't Over-Optimize

```typescript
// ❌ BAD: Over-optimizing simple operations
const memoizedCapitalize = useMemo(() => capitalize(name), [name]);
const memoizedSlugify = useMemo(() => slugify(title), [title]);

// ✅ GOOD: Only optimize expensive operations
const toc = useMemo(() => generateTOC(content), [content]); // Expensive
const slug = slugify(title); // Fast, no memoization needed
```

---

## 📊 PERFORMANCE_BENCHMARKS

Approximate execution times for common utilities:

| Utility            | Time    | Classification             |
| :----------------- | :------ | :------------------------- |
| `slugify()`        | ~0.1ms  | Fast                       |
| `capitalize()`     | ~0.05ms | Fast                       |
| `truncate()`       | ~0.08ms | Fast                       |
| `formatDate()`     | ~0.5ms  | Medium (Luxon)             |
| `cn()`             | ~0.2ms  | Fast                       |
| `markdownToHtml()` | ~5-20ms | Slow (varies by content)   |
| `generateTOC()`    | ~2-10ms | Medium (varies by content) |
| `getDeviceInfo()`  | ~1-2ms  | Medium (ua-parser-js)      |

**Optimization Strategy:**

- **Fast utilities** (<1ms): Use freely
- **Medium utilities** (1-5ms): Memoize if called frequently
- **Slow utilities** (>5ms): Always memoize or cache

---

**AUTHOR:** aazucena_optimization_intelligence
