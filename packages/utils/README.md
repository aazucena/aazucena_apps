# @aazucena/utils

## Summary

Pure utility functions with zero UI framework dependencies. Provides 24 specialized modules for string manipulation, date formatting, DOM operations, device detection, and content processing across the monorepo.

---

## Features

| Feature | Description |
|:--------|:------------|
| **String Utilities** | Slugify, truncate, capitalize, pluralize functions |
| **Date/Time Formatting** | Relative time, date formatting with Luxon |
| **DOM Helpers** | Class name merging (cn), element measurements |
| **Device Detection** | User agent parsing, capability detection |
| **Content Processing** | Markdown to HTML, table of contents generation |
| **Strapi Helpers** | Media URL formatting, response transformers |
| **Number Formatting** | Currency, percentages, abbreviations (1.2K, 3.4M) |
| **URL Utilities** | Query string parsing, URL validation |
| **Function Utilities** | Debounce, throttle, memoization |
| **Environment Helpers** | Type-safe env variable access with devLog utility |

---

## Installation

```bash
# This package is part of the @aazucena monorepo
# Internal workspace dependency - no separate installation needed
```

---

## Usage

### Basic Example

```typescript
import { cn, formatDate, slugify } from '@aazucena/utils';

// Class name merging
const className = cn('base-class', isActive && 'active', 'additional-class');

// Date formatting
const formattedDate = formatDate(new Date(), 'MMMM dd, yyyy');

// Slugify text
const slug = slugify('Hello World! 123'); // 'hello-world-123'
```

### String Utilities

```typescript
import {
  slugify,
  truncate,
  capitalize,
  pluralize,
  camelToKebab
} from '@aazucena/utils';

slugify('My Blog Post!'); // 'my-blog-post'
truncate('Long text...', 50); // 'Long text...'
capitalize('hello world'); // 'Hello World'
pluralize(5, 'item'); // '5 items'
camelToKebab('backgroundColor'); // 'background-color'
```

### Date/Time Utilities

```typescript
import {
  formatDate,
  formatDateTime,
  relativeTime,
  isToday,
  daysBetween
} from '@aazucena/utils';

// Format dates
formatDate(new Date(), 'MMM dd, yyyy'); // 'Jan 15, 2026'
formatDateTime(new Date()); // 'January 15, 2026 at 3:45 PM'

// Relative time
relativeTime(new Date(Date.now() - 3600000)); // '1 hour ago'

// Date comparisons
isToday(new Date()); // true
daysBetween(startDate, endDate); // 7
```

### DOM Utilities

```typescript
import { cn, getScrollProgress, isInViewport } from '@aazucena/utils';

// Class name merging (clsx + tailwind-merge)
const className = cn(
  'text-base',
  isActive && 'text-primary',
  'hover:text-secondary'
);

// Scroll progress
const progress = getScrollProgress(); // 0-1

// Viewport detection
if (isInViewport(element)) {
  // Element is visible
}
```

### Device Detection

```typescript
import { getDeviceInfo, isMobile, isTouch } from '@aazucena/utils';

const device = getDeviceInfo();
console.log(device.browser); // 'Chrome'
console.log(device.os); // 'Windows'
console.log(device.type); // 'desktop'

if (isMobile()) {
  // Mobile-specific logic
}

if (isTouch()) {
  // Touch-enabled device
}
```

### Content Processing

```typescript
import {
  markdownToHtml,
  generateTOC,
  extractHeadings,
  readingTime
} from '@aazucena/utils';

// Markdown to HTML
const html = markdownToHtml('# Hello\nThis is **bold**');

// Generate table of contents
const toc = generateTOC(htmlContent);

// Extract headings
const headings = extractHeadings(htmlContent);

// Calculate reading time
const minutes = readingTime(content); // '5 min read'
```

### Strapi Helpers

```typescript
import {
  getStrapiMediaUrl,
  transformStrapiResponse,
  formatStrapiData
} from '@aazucena/utils';

// Get media URL
const imageUrl = getStrapiMediaUrl(media, 'large');

// Transform response
const projects = transformStrapiResponse(response);

// Format single entity
const project = formatStrapiData(strapiEntity);
```

### Number Formatting

```typescript
import {
  formatCurrency,
  formatPercent,
  abbreviateNumber,
  formatBytes
} from '@aazucena/utils';

formatCurrency(1234.56); // '$1,234.56'
formatPercent(0.856); // '85.6%'
abbreviateNumber(12345); // '12.3K'
formatBytes(1024 * 1024); // '1.0 MB'
```

### Environment Utilities (NEW)

```typescript
import { devLog } from '@aazucena/utils';

// Type-safe development logging (no-op in production)
devLog('User action:', userEvent); // Only logs in NODE_ENV=development
devLog.warn('Performance warning:', metrics);
devLog.error('Validation failed:', errors);
```

---

## API Reference

### String Utilities (`string.ts`, `text.ts`)

**`slugify(text: string): string`**
- Converts text to URL-friendly slug

**`truncate(text: string, length: number): string`**
- Truncates text with ellipsis

**`capitalize(text: string): string`**
- Capitalizes first letter of each word

**`pluralize(count: number, singular: string, plural?: string): string`**
- Returns pluralized form based on count

**`camelToKebab(text: string): string`**
- Converts camelCase to kebab-case

### Date Utilities (`date.ts`, `datetime.ts`)

**`formatDate(date: Date, format: string): string`**
- Formats date with Luxon patterns

**`formatDateTime(date: Date): string`**
- Formats date and time in readable format

**`relativeTime(date: Date): string`**
- Returns relative time ('2 hours ago')

**`isToday(date: Date): boolean`**
- Checks if date is today

**`daysBetween(start: Date, end: Date): number`**
- Calculates days between two dates

### DOM Utilities (`dom.ts`)

**`cn(...classes: ClassValue[]): string`**
- Merges class names with clsx + tailwind-merge

**`getScrollProgress(): number`**
- Returns scroll progress (0-1)

**`isInViewport(element: Element): boolean`**
- Checks if element is in viewport

**`getElementDimensions(element: Element): { width: number; height: number }`**
- Returns element dimensions

### Device Utilities (`device.ts`)

**`getDeviceInfo(): DeviceInfo`**
- Parses user agent for device details

**`isMobile(): boolean`**
- Detects mobile devices

**`isTouch(): boolean`**
- Detects touch support

**`getScreenSize(): { width: number; height: number }`**
- Returns screen dimensions

### Content Utilities (`content.ts`, `blog.ts`)

**`markdownToHtml(markdown: string): string`**
- Converts markdown to HTML

**`generateTOC(html: string): TOCItem[]`**
- Generates table of contents from headings

**`extractHeadings(html: string): Heading[]`**
- Extracts heading elements

**`readingTime(content: string): string`**
- Estimates reading time

### Strapi Utilities (`strapi.ts`)

**`getStrapiMediaUrl(media: StrapiMedia, format?: string): string`**
- Returns Cloudinary URL for media

**`transformStrapiResponse<T>(response: StrapiResponse<T>): T[]`**
- Transforms Strapi API response

**`formatStrapiData<T>(entity: StrapiEntity): T`**
- Flattens Strapi entity structure

### Number Utilities (`number.ts`, `math.ts`)

**`formatCurrency(amount: number, currency?: string): string`**
- Formats currency values

**`formatPercent(value: number, decimals?: number): string`**
- Formats percentage values

**`abbreviateNumber(num: number): string`**
- Abbreviates large numbers (1.2K, 3.4M)

**`formatBytes(bytes: number): string`**
- Formats byte sizes (KB, MB, GB)

**`clamp(value: number, min: number, max: number): number`**
- Clamps value between min and max

**`lerp(start: number, end: number, t: number): number`**
- Linear interpolation

### Function Utilities (`function.ts`)

**`debounce<T>(fn: T, delay: number): T`**
- Debounces function calls

**`throttle<T>(fn: T, limit: number): T`**
- Throttles function calls

**`memoize<T>(fn: T): T`**
- Memoizes function results

### Environment Utilities (`env.ts`)

**`devLog(...args: any[]): void`**
- Development-only logging (no-op in production)

**`devLog.warn(...args: any[]): void`**
- Development-only warnings

**`devLog.error(...args: any[]): void`**
- Development-only errors

### URL Utilities (`url.ts`)

**`parseQueryString(query: string): Record<string, string>`**
- Parses URL query string

**`buildQueryString(params: Record<string, any>): string`**
- Builds URL query string

**`isValidUrl(url: string): boolean`**
- Validates URL format

---

## Architecture

This package is organized by **function category**:

```
src/
├── index.ts              # Barrel export
├── string.ts             # String manipulation
├── text.ts               # Text processing
├── date.ts               # Date utilities
├── datetime.ts           # DateTime formatting
├── dom.ts                # DOM operations
├── device.ts             # Device detection
├── content.ts            # Content processing
├── blog.ts               # Blog-specific utilities
├── strapi.ts             # Strapi helpers
├── number.ts             # Number formatting
├── math.ts               # Math operations
├── function.ts           # Function utilities
├── env.ts                # Environment helpers (NEW: devLog)
├── url.ts                # URL utilities
├── about.ts              # About page utilities
├── contact.ts            # Contact form utilities
├── experiences.ts        # Experience utilities
├── projects.ts           # Project utilities
├── tags.ts               # Tag utilities
├── preloader.ts          # Preloader utilities
├── visuals.ts            # Visual utilities
├── animations.ts         # Animation helpers
├── scene.ts              # Scene utilities
├── export.ts             # Export utilities
├── toc.ts                # Table of contents
└── journey/
    └── index.ts          # Journey page utilities
```

**Design Principles**:
- **Pure Functions**: No side effects, deterministic outputs
- **Tree Shakeable**: Named exports for optimal bundling
- **Type Safe**: Full TypeScript support with strict mode
- **Zero UI Dependencies**: Works in any environment
- **Tested**: Unit tests for all utilities (planned Phase 5)

---

## Meta-Framework Compatibility

✅ Next.js | ✅ Astro | ✅ Remix | ✅ Vite | ✅ Universal

Pure JavaScript functions work in any environment (Node.js, browser, edge runtimes).

---

## Dependencies

**Internal**:
- @aazucena/constants - For constant values
- @aazucena/types - For type definitions

**External**:
- clsx - Class name utility
- tailwind-merge - Tailwind class merging
- luxon - Date/time formatting
- ua-parser-js - User agent parsing
- flexsearch - Search indexing
- make-plural - Pluralization rules

---

## Related Packages

- [@aazucena/ui](../ui) - Uses these utilities for component logic
- [@aazucena/hooks](../hooks) - Wraps utilities in React hooks
- [@aazucena/api](../api) - Uses Strapi utilities for data transformation

---

**Version**: 0.0.0
**Status**: Development
**Maintainer**: @aazucena
