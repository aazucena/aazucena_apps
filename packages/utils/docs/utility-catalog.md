# Utility Catalog

## SUMMARY

Complete reference for all 33 utility modules in @aazucena/utils, organized by category with usage examples, type signatures, and performance characteristics.

---

## 📝 STRING_UTILITIES

### slugify

Converts text to URL-friendly slug format.

```typescript
import { slugify } from '@aazucena/utils';

slugify('Hello World! 123'); // 'hello-world-123'
slugify('My Blog Post'); // 'my-blog-post'
slugify('React & TypeScript'); // 'react-and-typescript'
```

**Signature:** `slugify(text: string): string`

**Performance:** O(n) - Single pass transformation

---

### truncate

Truncates text to specified length with ellipsis.

```typescript
import { truncate } from '@aazucena/utils';

truncate('This is a long sentence', 10); // 'This is a...'
truncate('Short', 20); // 'Short' (no truncation needed)
```

**Signature:** `truncate(text: string, length: number, suffix?: string): string`

---

### capitalize

Capitalizes first letter of each word.

```typescript
import { capitalize } from '@aazucena/utils';

capitalize('hello world'); // 'Hello World'
capitalize('react hooks'); // 'React Hooks'
```

**Signature:** `capitalize(text: string): string`

---

### pluralize

Returns pluralized form based on count.

```typescript
import { pluralize } from '@aazucena/utils';

pluralize(1, 'item'); // '1 item'
pluralize(5, 'item'); // '5 items'
pluralize(3, 'person', 'people'); // '3 people'
```

**Signature:** `pluralize(count: number, singular: string, plural?: string): string`

---

### camelToKebab

Converts camelCase to kebab-case.

```typescript
import { camelToKebab } from '@aazucena/utils';

camelToKebab('backgroundColor'); // 'background-color'
camelToKebab('fontSize'); // 'font-size'
```

**Signature:** `camelToKebab(text: string): string`

---

## 📅 DATE_UTILITIES

### formatDate

Formats date using Luxon patterns.

```typescript
import { formatDate } from '@aazucena/utils';

formatDate(new Date(), 'MMM dd, yyyy'); // 'Feb 11, 2026'
formatDate(new Date(), 'yyyy-MM-dd'); // '2026-02-11'
formatDate(new Date(), 'MMMM dd, yyyy'); // 'February 11, 2026'
```

**Signature:** `formatDate(date: Date, format: string): string`

**Patterns:** Uses Luxon formatting tokens

---

### formatDateTime

Formats date and time in readable format.

```typescript
import { formatDateTime } from '@aazucena/utils';

formatDateTime(new Date()); // 'February 11, 2026 at 3:45 PM'
```

**Signature:** `formatDateTime(date: Date): string`

---

### relativeTime

Returns relative time string.

```typescript
import { relativeTime } from '@aazucena/utils';

relativeTime(new Date(Date.now() - 3600000)); // '1 hour ago'
relativeTime(new Date(Date.now() + 7200000)); // 'in 2 hours'
relativeTime(new Date(Date.now() - 86400000)); // 'yesterday'
```

**Signature:** `relativeTime(date: Date): string`

---

### isToday

Checks if date is today.

```typescript
import { isToday } from '@aazucena/utils';

isToday(new Date()); // true
isToday(new Date('2025-01-01')); // false
```

**Signature:** `isToday(date: Date): boolean`

---

### daysBetween

Calculates days between two dates.

```typescript
import { daysBetween } from '@aazucena/utils';

const start = new Date('2026-01-01');
const end = new Date('2026-01-08');
daysBetween(start, end); // 7
```

**Signature:** `daysBetween(start: Date, end: Date): number`

---

## 🌐 DOM_UTILITIES

### cn (Class Name Merger)

Merges class names with clsx + tailwind-merge.

```typescript
import { cn } from '@aazucena/utils';

// Basic usage
cn('text-base', 'font-bold'); // 'text-base font-bold'

// Conditional classes
cn('text-base', isActive && 'text-primary'); // 'text-base text-primary' (if active)

// Tailwind conflicts resolved
cn('px-4', 'px-6'); // 'px-6' (later value wins)
```

**Signature:** `cn(...classes: ClassValue[]): string`

**Performance:** Optimized for Tailwind CSS class deduplication

---

### getScrollProgress

Returns scroll progress (0-1).

```typescript
import { getScrollProgress } from '@aazucena/utils';

const progress = getScrollProgress(); // 0.0 (top) to 1.0 (bottom)

// Use for scroll-based effects
const opacity = getScrollProgress() * 100; // 0% to 100%
```

**Signature:** `getScrollProgress(): number`

---

### isInViewport

Checks if element is in viewport.

```typescript
import { isInViewport } from '@aazucena/utils';

const element = document.querySelector('.hero');
if (isInViewport(element)) {
  // Element is visible, trigger animation
}
```

**Signature:** `isInViewport(element: Element): boolean`

---

### getElementDimensions

Returns element dimensions.

```typescript
import { getElementDimensions } from '@aazucena/utils';

const { width, height } = getElementDimensions(element);
console.log(`Size: ${width}x${height}`);
```

**Signature:** `getElementDimensions(element: Element): { width: number; height: number }`

---

## 📱 DEVICE_UTILITIES

### getDeviceInfo

Parses user agent for device details.

```typescript
import { getDeviceInfo } from '@aazucena/utils';

const device = getDeviceInfo();
console.log(device.browser); // 'Chrome'
console.log(device.os); // 'Windows'
console.log(device.type); // 'desktop' | 'mobile' | 'tablet'
```

**Signature:** `getDeviceInfo(): DeviceInfo`

**Uses:** ua-parser-js for reliable detection

---

### isMobile

Detects mobile devices.

```typescript
import { isMobile } from '@aazucena/utils';

if (isMobile()) {
  // Show mobile-optimized UI
}
```

**Signature:** `isMobile(): boolean`

---

### isTouch

Detects touch support.

```typescript
import { isTouch } from '@aazucena/utils';

if (isTouch()) {
  // Enable touch-specific interactions
}
```

**Signature:** `isTouch(): boolean`

---

### getScreenSize

Returns screen dimensions.

```typescript
import { getScreenSize } from '@aazucena/utils';

const { width, height } = getScreenSize();
console.log(`Screen: ${width}x${height}`);
```

**Signature:** `getScreenSize(): { width: number; height: number }`

---

## 📄 CONTENT_UTILITIES

### markdownToHtml

Converts markdown to HTML.

```typescript
import { markdownToHtml } from '@aazucena/utils';

const markdown = '# Hello\n\nThis is **bold** text.';
const html = markdownToHtml(markdown);
// '<h1>Hello</h1><p>This is <strong>bold</strong> text.</p>'
```

**Signature:** `markdownToHtml(markdown: string): string`

---

### generateTOC

Generates table of contents from headings.

```typescript
import { generateTOC } from '@aazucena/utils';

const html = '<h2 id="intro">Introduction</h2><h3 id="setup">Setup</h3>';
const toc = generateTOC(html);
// [
//   { id: 'intro', text: 'Introduction', level: 2 },
//   { id: 'setup', text: 'Setup', level: 3 }
// ]
```

**Signature:** `generateTOC(html: string): TOCItem[]`

---

### extractHeadings

Extracts heading elements from HTML.

```typescript
import { extractHeadings } from '@aazucena/utils';

const headings = extractHeadings(htmlContent);
headings.forEach(({ id, text, level }) => {
  console.log(`${level}: ${text}`);
});
```

**Signature:** `extractHeadings(html: string): Heading[]`

---

### readingTime

Estimates reading time for content.

```typescript
import { readingTime } from '@aazucena/utils';

const content = 'Lorem ipsum...'; // 500 words
readingTime(content); // '2 min read'
```

**Signature:** `readingTime(content: string, wordsPerMinute?: number): string`

**Default:** 200 words per minute

---

## 🎨 STRAPI_UTILITIES

### getStrapiMediaUrl

Returns Cloudinary URL for Strapi media.

```typescript
import { getStrapiMediaUrl } from '@aazucena/utils';

const imageUrl = getStrapiMediaUrl(media, 'large');
// 'https://res.cloudinary.com/.../image.jpg?w=1000'

const thumbnail = getStrapiMediaUrl(media, 'thumbnail');
// 'https://res.cloudinary.com/.../image.jpg?w=200'
```

**Signature:** `getStrapiMediaUrl(media: StrapiMedia, format?: string): string`

**Formats:** `thumbnail`, `small`, `medium`, `large`

---

### transformStrapiResponse

Transforms Strapi API response to array.

```typescript
import { transformStrapiResponse } from '@aazucena/utils';

const response = {
  data: [
    { id: 1, attributes: { title: 'Post 1' } },
    { id: 2, attributes: { title: 'Post 2' } },
  ],
  meta: { pagination: { total: 2 } },
};

const posts = transformStrapiResponse(response);
// [
//   { id: 1, title: 'Post 1' },
//   { id: 2, title: 'Post 2' }
// ]
```

**Signature:** `transformStrapiResponse<T>(response: StrapiResponse<T>): T[]`

---

### formatStrapiData

Flattens Strapi entity structure.

```typescript
import { formatStrapiData } from '@aazucena/utils';

const entity = {
  id: 1,
  attributes: { title: 'My Post', slug: 'my-post' },
};

const flat = formatStrapiData(entity);
// { id: 1, title: 'My Post', slug: 'my-post' }
```

**Signature:** `formatStrapiData<T>(entity: StrapiEntity): T`

---

## 🔢 NUMBER_UTILITIES

### formatCurrency

Formats currency values.

```typescript
import { formatCurrency } from '@aazucena/utils';

formatCurrency(1234.56); // '$1,234.56'
formatCurrency(1000000); // '$1,000,000.00'
formatCurrency(99.5, 'EUR'); // '€99.50'
```

**Signature:** `formatCurrency(amount: number, currency?: string): string`

---

### formatPercent

Formats percentage values.

```typescript
import { formatPercent } from '@aazucena/utils';

formatPercent(0.856); // '85.6%'
formatPercent(0.5); // '50.0%'
formatPercent(1.234, 1); // '123.4%'
```

**Signature:** `formatPercent(value: number, decimals?: number): string`

---

### abbreviateNumber

Abbreviates large numbers.

```typescript
import { abbreviateNumber } from '@aazucena/utils';

abbreviateNumber(1234); // '1.2K'
abbreviateNumber(1234567); // '1.2M'
abbreviateNumber(1234567890); // '1.2B'
```

**Signature:** `abbreviateNumber(num: number): string`

---

### formatBytes

Formats byte sizes.

```typescript
import { formatBytes } from '@aazucena/utils';

formatBytes(1024); // '1.0 KB'
formatBytes(1024 * 1024); // '1.0 MB'
formatBytes(1024 * 1024 * 1024); // '1.0 GB'
```

**Signature:** `formatBytes(bytes: number): string`

---

## 🧮 MATH_UTILITIES

### clamp

Clamps value between min and max.

```typescript
import { clamp } from '@aazucena/utils';

clamp(5, 0, 10); // 5
clamp(-5, 0, 10); // 0
clamp(15, 0, 10); // 10
```

**Signature:** `clamp(value: number, min: number, max: number): number`

---

### lerp

Linear interpolation between two values.

```typescript
import { lerp } from '@aazucena/utils';

lerp(0, 100, 0.5); // 50
lerp(0, 100, 0.25); // 25
lerp(10, 20, 0.75); // 17.5
```

**Signature:** `lerp(start: number, end: number, t: number): number`

**Use Case:** Smooth animations, easing functions

---

## ⚙️ FUNCTION_UTILITIES

### debounce

Debounces function calls.

```typescript
import { debounce } from '@aazucena/utils';

const handleSearch = debounce((query: string) => {
  fetchResults(query);
}, 500);

// Call multiple times rapidly
handleSearch('react'); // Ignored
handleSearch('react hooks'); // Ignored
handleSearch('react hooks tutorial'); // Executes after 500ms
```

**Signature:** `debounce<T>(fn: T, delay: number): T`

**Use Case:** Search inputs, form validation, API calls

---

### throttle

Throttles function calls.

```typescript
import { throttle } from '@aazucena/utils';

const handleScroll = throttle(() => {
  updateScrollPosition();
}, 100);

window.addEventListener('scroll', handleScroll);
// Executes at most once every 100ms
```

**Signature:** `throttle<T>(fn: T, limit: number): T`

**Use Case:** Scroll handlers, resize handlers, rate limiting

---

### memoize

Memoizes function results.

```typescript
import { memoize } from '@aazucena/utils';

const expensiveCalculation = memoize((n: number) => {
  // Complex computation
  return n * n;
});

expensiveCalculation(5); // Computes: 25
expensiveCalculation(5); // Cached: 25 (instant)
```

**Signature:** `memoize<T>(fn: T): T`

**Use Case:** Expensive computations, recursive functions

---

## 🔐 ENVIRONMENT_UTILITIES

### devLog

Development-only logging (no-op in production).

```typescript
import { devLog } from '@aazucena/utils';

devLog('User clicked button:', buttonId); // Only logs in development
devLog.warn('Performance warning:', metrics);
devLog.error('Validation failed:', errors);
```

**Signature:**

- `devLog(...args: any[]): void`
- `devLog.warn(...args: any[]): void`
- `devLog.error(...args: any[]): void`

**Behavior:** Checks `NODE_ENV === 'development'` and `typeof window !== 'undefined'`

---

### isDevelopment

Checks if running in development environment.

```typescript
import { isDevelopment } from '@aazucena/utils';

if (isDevelopment()) {
  // Enable debugging tools
}
```

**Signature:** `isDevelopment(): boolean`

---

## 🔗 URL_UTILITIES

### parseQueryString

Parses URL query string.

```typescript
import { parseQueryString } from '@aazucena/utils';

const params = parseQueryString('?page=2&sort=name');
// { page: '2', sort: 'name' }
```

**Signature:** `parseQueryString(query: string): Record<string, string>`

---

### buildQueryString

Builds URL query string.

```typescript
import { buildQueryString } from '@aazucena/utils';

const params = { page: 2, sort: 'name', filter: 'active' };
buildQueryString(params); // 'page=2&sort=name&filter=active'
```

**Signature:** `buildQueryString(params: Record<string, any>): string`

---

### isValidUrl

Validates URL format.

```typescript
import { isValidUrl } from '@aazucena/utils';

isValidUrl('https://example.com'); // true
isValidUrl('not a url'); // false
```

**Signature:** `isValidUrl(url: string): boolean`

---

## 🎯 SPECIALIZED_UTILITIES

### Blog Utilities (`blog.ts`)

```typescript
import {
  calculateReadingTime,
  extractExcerpt,
  generateSlugFromTitle,
  sortPostsByDate,
} from '@aazucena/utils';

const time = calculateReadingTime(content); // '5 min read'
const excerpt = extractExcerpt(content, 200); // First 200 chars
const slug = generateSlugFromTitle('My Blog Post'); // 'my-blog-post'
const sorted = sortPostsByDate(posts, 'desc'); // Latest first
```

---

### Journey Utilities (`journey/`)

```typescript
import {
  calculateJourneyStats,
  generateTimeline,
  groupSkillsByCategory,
  calculateSkillProgress,
} from '@aazucena/utils';

const stats = calculateJourneyStats(experiences);
const timeline = generateTimeline(milestones);
const skills = groupSkillsByCategory(allSkills);
const progress = calculateSkillProgress(skill, startDate, endDate);
```

---

### Preloader Utilities (`preloader.ts`)

```typescript
import { calculateProgress, determinePreloaderTheme, formatLoadingMessage } from '@aazucena/utils';

const progress = calculateProgress(loaded, total); // 0-100
const theme = determinePreloaderTheme('cyber'); // Theme config
const message = formatLoadingMessage('assets', 75); // 'Loading assets... 75%'
```

---

**AUTHOR:** aazucena_utility_intelligence
