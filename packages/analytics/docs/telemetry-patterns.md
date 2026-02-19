# Telemetry Patterns

## SUMMARY

Comprehensive guide to event tracking patterns, batching strategies, offline queue management, Web Vitals integration, and privacy-first telemetry design using @aazucena/analytics.

---

## 🚀 CONFIGURATION

### Basic Setup

```typescript
import { setTelemetryConfig } from '@aazucena/analytics';

// Initialize telemetry at app startup
setTelemetryConfig({
  endpoint: '/api/ingest',
  enabled: process.env.NODE_ENV === 'production',
  batchSize: 10,
  flushInterval: 5000, // 5 seconds
  debug: false,
});
```

---

### Environment-Specific Configuration

```typescript
import { setTelemetryConfig } from '@aazucena/analytics';

const config = {
  development: {
    endpoint: 'http://localhost:3001/api/ingest',
    enabled: true,
    batchSize: 1, // Immediate sends for debugging
    flushInterval: 1000,
    debug: true,
  },
  production: {
    endpoint: 'https://analytics.example.com/api/ingest',
    enabled: true,
    batchSize: 20,
    flushInterval: 10000,
    debug: false,
  },
};

setTelemetryConfig(config[process.env.NODE_ENV]);
```

---

## 📊 EVENT_TRACKING

### Page View Tracking

```typescript
import { trackPageView } from '@aazucena/analytics';

// Basic page view
trackPageView('/projects');

// With metadata
trackPageView('/projects', {
  referrer: document.referrer,
  loadTime: 1250,
  userAgent: navigator.userAgent,
});
```

---

### Automatic Page View Tracking (React)

```typescript
import { PageViewTracker } from '@aazucena/analytics';

function App() {
  return (
    <Router>
      <PageViewTracker />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<Blog />} />
      </Routes>
    </Router>
  );
}
```

---

### Interaction Tracking

```typescript
import { trackEvent } from '@aazucena/analytics';

// Button click
trackEvent({
  category: 'interaction',
  action: 'button_click',
  label: 'contact_form_submit',
  metadata: {
    buttonId: 'submit',
    formType: 'contact',
  },
});

// Link click
trackEvent({
  category: 'interaction',
  action: 'link_click',
  label: 'external_project_link',
  metadata: {
    href: 'https://github.com/user/project',
    openedInNewTab: true,
  },
});

// Scroll milestone
trackEvent({
  category: 'engagement',
  action: 'scroll_depth',
  value: 75, // 75% of page
  metadata: {
    page: '/blog/post-123',
  },
});
```

---

### Error Tracking

```typescript
import { trackEvent } from '@aazucena/analytics';

try {
  await fetchData();
} catch (error) {
  trackEvent({
    category: 'error',
    action: 'api_error',
    label: error.message,
    metadata: {
      endpoint: '/api/projects',
      statusCode: error.response?.status,
      stack: error.stack,
    },
  });
}
```

---

## 🎣 REACT_HOOKS

### useTracking Hook

```typescript
import { useTracking } from '@aazucena/analytics';

function ContactForm() {
  const { trackInteraction, trackError, trackTiming } = useTracking();

  const handleSubmit = async (data) => {
    const startTime = Date.now();

    trackInteraction('form_submit_start', {
      formType: 'contact',
      fields: Object.keys(data),
    });

    try {
      await submitForm(data);

      const duration = Date.now() - startTime;
      trackTiming('form_submit_duration', duration);

      trackInteraction('form_submit_success', {
        formType: 'contact',
      });
    } catch (error) {
      trackError(error, {
        formType: 'contact',
        fields: Object.keys(data),
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

---

### Custom Tracking Hook

```typescript
import { useEffect } from 'react';
import { trackEvent } from '@aazucena/analytics';

function usePageTracking(pageName: string) {
  useEffect(() => {
    const startTime = Date.now();

    trackEvent({
      category: 'navigation',
      action: 'page_enter',
      label: pageName,
    });

    return () => {
      const timeOnPage = Date.now() - startTime;

      trackEvent({
        category: 'navigation',
        action: 'page_leave',
        label: pageName,
        value: timeOnPage,
      });
    };
  }, [pageName]);
}

// Usage
function BlogPost({ post }) {
  usePageTracking(`blog_post_${post.slug}`);

  return <article>{/* Content */}</article>;
}
```

---

## 📦 BATCHING_STRATEGIES

### How Batching Works

Events are collected in memory and sent in batches to reduce network overhead:

```typescript
// Configuration
setTelemetryConfig({
  batchSize: 10, // Send after 10 events
  flushInterval: 5000, // Or send after 5 seconds
});

// Events are batched automatically
trackEvent({ category: 'navigation', action: 'page_view' }); // Event 1
trackEvent({ category: 'interaction', action: 'click' }); // Event 2
trackEvent({ category: 'interaction', action: 'click' }); // Event 3
// ... 7 more events ...
trackEvent({ category: 'interaction', action: 'submit' }); // Event 10

// Batch of 10 events sent to /api/ingest
```

---

### Manual Flush

```typescript
import { flushTelemetry } from '@aazucena/analytics';

// Force immediate send of queued events
flushTelemetry();

// Use case: Before page unload
window.addEventListener('beforeunload', () => {
  flushTelemetry();
});
```

---

### Batch Priority

```typescript
// Critical events bypass batching
trackEvent({
  category: 'error',
  action: 'critical_failure',
  label: 'payment_failed',
  priority: 'immediate', // Send immediately, don't batch
});
```

---

## 💾 OFFLINE_QUEUE

### Automatic Offline Detection

```typescript
// Events are automatically queued when offline
window.addEventListener('online', () => {
  console.log('Connection restored, sending queued events...');
  // Automatically flushes queue
});

window.addEventListener('offline', () => {
  console.log('Connection lost, events will be queued');
});

// Track events as normal - they'll be queued if offline
trackEvent({
  category: 'interaction',
  action: 'button_click',
  label: 'offline_action',
});
```

---

### Persistent Queue

```typescript
import { setTelemetryConfig } from '@aazucena/analytics';

setTelemetryConfig({
  endpoint: '/api/ingest',
  enabled: true,
  persistQueue: true, // Save queue to localStorage
  maxQueueSize: 100, // Maximum queued events
});

// Events persist across page reloads
trackEvent({ category: 'interaction', action: 'click' });
// Page reloads
// Event is restored from localStorage and sent when online
```

---

## 🎯 WEB_VITALS

### Automatic Tracking

```typescript
import { trackWebVitals } from '@aazucena/analytics';

// Track all Web Vitals automatically
trackWebVitals((metric) => {
  console.log(`${metric.name}: ${metric.value}ms`);

  // Events automatically sent to telemetry endpoint
  // {
  //   category: 'performance',
  //   action: 'web_vital',
  //   label: metric.name, // 'CLS', 'FID', 'LCP', 'FCP', 'TTFB'
  //   value: metric.value,
  //   metadata: {
  //     rating: metric.rating, // 'good', 'needs-improvement', 'poor'
  //     delta: metric.delta,
  //     id: metric.id,
  //   }
  // }
});
```

---

### Web Vitals Thresholds

| Metric                             | Good    | Needs Improvement | Poor     |
| :--------------------------------- | :------ | :---------------- | :------- |
| **CLS** (Cumulative Layout Shift)  | ≤ 0.1   | 0.1 - 0.25        | > 0.25   |
| **FID** (First Input Delay)        | ≤ 100ms | 100 - 300ms       | > 300ms  |
| **LCP** (Largest Contentful Paint) | ≤ 2.5s  | 2.5 - 4.0s        | > 4.0s   |
| **FCP** (First Contentful Paint)   | ≤ 1.8s  | 1.8 - 3.0s        | > 3.0s   |
| **TTFB** (Time to First Byte)      | ≤ 800ms | 800 - 1800ms      | > 1800ms |

---

### Custom Web Vitals Handler

```typescript
import { trackWebVitals } from '@aazucena/analytics';

trackWebVitals((metric) => {
  // Alert on poor performance
  if (metric.rating === 'poor') {
    console.warn(`⚠️ Poor ${metric.name}: ${metric.value}ms`);

    // Send to error tracking
    trackEvent({
      category: 'performance',
      action: 'poor_web_vital',
      label: metric.name,
      value: metric.value,
      metadata: {
        threshold: metric.threshold,
        page: window.location.pathname,
      },
    });
  }
});
```

---

## 🔒 PRIVACY_PATTERNS

### No PII Collection

```typescript
// ❌ BAD: Collecting PII
trackEvent({
  category: 'interaction',
  action: 'form_submit',
  metadata: {
    email: 'user@example.com', // PII
    name: 'John Doe', // PII
  },
});

// ✅ GOOD: Hash or anonymize
import { hashData } from '@aazucena/utils';

trackEvent({
  category: 'interaction',
  action: 'form_submit',
  metadata: {
    emailHash: hashData('user@example.com'), // Hashed
    formType: 'contact',
  },
});
```

---

### User Consent

```typescript
import { setTelemetryConfig } from '@aazucena/analytics';

// Check user consent before enabling
const hasConsent = localStorage.getItem('analytics-consent') === 'true';

setTelemetryConfig({
  endpoint: '/api/ingest',
  enabled: hasConsent,
});

// Allow user to opt-out
function disableTracking() {
  localStorage.setItem('analytics-consent', 'false');
  setTelemetryConfig({ enabled: false });
}

// Allow user to opt-in
function enableTracking() {
  localStorage.setItem('analytics-consent', 'true');
  setTelemetryConfig({ enabled: true });
}
```

---

### IP Anonymization

```typescript
// Server-side: Anonymize IP before storing
function anonymizeIP(ip: string): string {
  const parts = ip.split('.');
  return `${parts[0]}.${parts[1]}.0.0`; // Remove last 2 octets
}

// Telemetry ingestion endpoint
app.post('/api/ingest', (req, res) => {
  const events = req.body;
  const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  events.forEach((event) => {
    event.ip = anonymizeIP(clientIP); // Store anonymized IP
  });

  // Store events in ClickHouse
  await storeEvents(events);

  res.json({ success: true });
});
```

---

## 🎨 CUSTOM_SCHEMAS

### Define Custom Event Schema

```typescript
import { createEventSchema } from '@aazucena/analytics';
import { z } from 'zod';

// Music playback event schema
const MusicPlaybackSchema = createEventSchema({
  category: 'music',
  action: z.enum(['play', 'pause', 'skip', 'seek']),
  metadata: z.object({
    trackId: z.string().uuid(),
    trackTitle: z.string(),
    duration: z.number().positive(),
    position: z.number().min(0),
    volume: z.number().min(0).max(100),
  }),
});

// Track with validation
trackEvent(MusicPlaybackSchema, {
  category: 'music',
  action: 'play',
  metadata: {
    trackId: 'track-uuid-123',
    trackTitle: 'Song Name',
    duration: 180000,
    position: 0,
    volume: 75,
  },
});
```

---

### E-commerce Tracking Schema

```typescript
const PurchaseSchema = createEventSchema({
  category: 'ecommerce',
  action: z.enum(['add_to_cart', 'remove_from_cart', 'purchase', 'refund']),
  value: z.number().positive(), // Total value in USD
  metadata: z.object({
    transactionId: z.string().optional(),
    items: z.array(
      z.object({
        productId: z.string(),
        name: z.string(),
        price: z.number().positive(),
        quantity: z.number().int().positive(),
      }),
    ),
    currency: z.string().length(3).default('USD'),
    paymentMethod: z.enum(['card', 'paypal', 'crypto']).optional(),
  }),
});

// Track purchase
trackEvent(PurchaseSchema, {
  category: 'ecommerce',
  action: 'purchase',
  value: 149.99,
  metadata: {
    transactionId: 'txn_abc123',
    items: [
      { productId: 'prod_1', name: 'Product 1', price: 99.99, quantity: 1 },
      { productId: 'prod_2', name: 'Product 2', price: 50.0, quantity: 1 },
    ],
    currency: 'USD',
    paymentMethod: 'card',
  },
});
```

---

## 🧪 TESTING_PATTERNS

### Mock Telemetry in Tests

```typescript
import { setTelemetryConfig, trackEvent } from '@aazucena/analytics';
import { vi } from 'vitest';

describe('Component with tracking', () => {
  beforeEach(() => {
    // Disable telemetry in tests
    setTelemetryConfig({
      endpoint: '/api/ingest',
      enabled: false, // No actual sends
    });
  });

  test('tracks button click', () => {
    const spy = vi.spyOn(console, 'log');

    trackEvent({
      category: 'interaction',
      action: 'button_click',
    });

    expect(spy).toHaveBeenCalledWith(expect.stringContaining('button_click'));
  });
});
```

---

### Debug Mode

```typescript
import { setTelemetryConfig } from '@aazucena/analytics';

setTelemetryConfig({
  endpoint: '/api/ingest',
  enabled: true,
  debug: true, // Log all events to console
});

// All tracked events will be logged:
// [Telemetry] Tracking event: { category: 'interaction', action: 'click', ... }
```

---

## 📈 PERFORMANCE_OPTIMIZATION

### Debounced Tracking

```typescript
import { debounce } from '@aazucena/utils';
import { trackEvent } from '@aazucena/analytics';

// Debounce rapid scroll events
const trackScroll = debounce(() => {
  const scrollDepth = (window.scrollY / document.body.scrollHeight) * 100;

  trackEvent({
    category: 'engagement',
    action: 'scroll_depth',
    value: Math.round(scrollDepth),
  });
}, 500);

window.addEventListener('scroll', trackScroll);
```

---

### Sampling for High-Frequency Events

```typescript
import { trackEvent } from '@aazucena/analytics';

let eventCount = 0;
const SAMPLE_RATE = 0.1; // Track 10% of events

function trackMouseMove(e: MouseEvent) {
  eventCount++;

  // Sample 10% of mouse move events
  if (Math.random() < SAMPLE_RATE) {
    trackEvent({
      category: 'interaction',
      action: 'mouse_move',
      metadata: {
        x: e.clientX,
        y: e.clientY,
        sample: eventCount,
      },
    });
  }
}
```

---

**AUTHOR:** aazucena_telemetry_intelligence
