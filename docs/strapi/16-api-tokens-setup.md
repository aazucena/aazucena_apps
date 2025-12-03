# API Tokens Setup - Security-First Strategy

**[← Back to Implementation Timeline](./15-implementation-timeline.md)** | **[Next: Testing →](./12-testing.md)**

---

## Overview

This guide implements a **security-first API token strategy** using a single Build/SSR token for all backend operations, with form submissions routed through a backend proxy.

**Architecture:**
```
Frontend (Public) → Your API Routes → Strapi (Build/SSR Token)
```

**Benefits:**
- ✅ Single token to manage and rotate
- ✅ No client-side token exposure
- ✅ Custom validation and rate limiting
- ✅ AI processing before Strapi storage
- ✅ Easy audit trail

---

## Token Strategy

### Build/SSR Token (Single Token for Everything)

**Purpose:** All server-side operations (build-time, SSR, forms proxy)

**Permissions:**
- ✅ `find` + `findOne` on ALL content types (Hero, About, Skills, Posts, etc.)
- ✅ `find` on ALL configuration types (Portfolio, Website Configuration, Theme, etc.)
- ✅ `create` on Form Submissions, Easter Egg Completions

**Storage:** Environment variable (never exposed to client)

**Why This Works:**
- Astro SSR/build process fetches content and configuration server-side
- Forms go through your API routes (not directly to Strapi)
- Token never reaches the browser

---

## Step 1: Create the Build/SSR Token

### 1.1 Navigate to API Tokens

1. Go to **Settings** → **API Tokens** (left sidebar)
2. Click **+ Create new API Token**

### 1.2 Configure Token

**Basic Settings:**
```
Name: Build/SSR Token
Description: Server-side read access + forms write (build, SSR, API routes)
Token duration: Unlimited
Token type: Full access
```

**Why "Full access"?**
- Simplest to manage for backend operations
- Token is never exposed to client
- Can be scoped down later if needed

**Alternative (Custom Permissions):**
If you prefer granular control, use "Custom" token type and configure:

#### Content Types - Read Permissions

**Single Types:**
- `hero` → ✅ `find`
- `about` → ✅ `find`
- `portfolio` → ✅ `find`
- `website-configuration` → ✅ `find`
- `theme` → ✅ `find`
- `homepage` → ✅ `find`
- `animation` → ✅ `find`
- `maintenance` → ✅ `find`
- `analytic` → ✅ `find`
- `blog` → ✅ `find`

**Collection Types:**
- `skills` → ✅ `find`, ✅ `findOne`
- `music-genres` → ✅ `find`, ✅ `findOne`
- `posts` → ✅ `find`, ✅ `findOne`
- `projects` → ✅ `find`, ✅ `findOne`
- `experience` → ✅ `find`, ✅ `findOne`
- `testimonials` → ✅ `find`, ✅ `findOne`
- `awards` → ✅ `find`, ✅ `findOne`
- `compositions` → ✅ `find`, ✅ `findOne`

#### Forms - Write Permissions

- `form-submissions` → ✅ `create`
- `easter-egg-completions` → ✅ `create`

### 1.3 Save and Copy Token

1. Click **Save**
2. **IMPORTANT:** Copy the token immediately (you can't view it again)
3. Store in your password manager

---

## Step 2: Configure Environment Variables

### 2.1 Update `.env` (Portfolio App)

```bash
# apps/portfolio/.env

# Strapi Configuration
STRAPI_URL=http://localhost:1337
STRAPI_TOKEN=your-build-ssr-token-here

# reCAPTCHA v3 (for forms validation)
PUBLIC_RECAPTCHA_SITE_KEY=your-site-key
RECAPTCHA_SECRET_KEY=your-secret-key
```

**Security Notes:**
- ✅ `STRAPI_URL` is safe to be public (it's just a URL)
- ❌ `STRAPI_TOKEN` must NEVER be prefixed with `PUBLIC_` (Astro exposes `PUBLIC_*` to client)
- ✅ `PUBLIC_RECAPTCHA_SITE_KEY` is safe (meant for client-side)
- ❌ `RECAPTCHA_SECRET_KEY` is server-only

### 2.2 Update `.env.example`

```bash
# apps/portfolio/.env.example

# Strapi CMS
STRAPI_URL=http://localhost:1337
STRAPI_TOKEN=

# reCAPTCHA v3 (get keys from https://www.google.com/recaptcha/admin)
PUBLIC_RECAPTCHA_SITE_KEY=
RECAPTCHA_SECRET_KEY=
```

### 2.3 Verify `.gitignore`

Ensure `.env` is in `.gitignore`:

```bash
# apps/portfolio/.gitignore
.env
.env.local
.env.*.local
```

---

## Step 3: Create Strapi Client Utility

### 3.1 Create Strapi Helper

```typescript
// apps/portfolio/src/lib/strapi.ts

const STRAPI_URL = import.meta.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_TOKEN = import.meta.env.STRAPI_TOKEN;

if (!STRAPI_TOKEN) {
  throw new Error('STRAPI_TOKEN is not defined in environment variables');
}

interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

/**
 * Fetch data from Strapi API (server-side only)
 * @param endpoint - API endpoint (e.g., 'hero', 'posts', 'skills')
 * @param options - Fetch options (query params, etc.)
 */
export async function fetchStrapi<T>(
  endpoint: string,
  options?: {
    query?: Record<string, any>;
    cache?: RequestCache;
  }
): Promise<StrapiResponse<T>> {
  const url = new URL(`${STRAPI_URL}/api/${endpoint}`);

  // Add query parameters if provided
  if (options?.query) {
    Object.entries(options.query).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });
  }

  const res = await fetch(url.toString(), {
    headers: {
      'Authorization': `Bearer ${STRAPI_TOKEN}`,
    },
    cache: options?.cache || 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Strapi API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

/**
 * Create an entry in Strapi (server-side only)
 * @param endpoint - API endpoint (e.g., 'form-submissions')
 * @param data - Data to create
 */
export async function createStrapiEntry<T>(
  endpoint: string,
  data: Record<string, any>
): Promise<StrapiResponse<T>> {
  const res = await fetch(`${STRAPI_URL}/api/${endpoint}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${STRAPI_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data }),
  });

  if (!res.ok) {
    throw new Error(`Strapi API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}
```

---

## Step 4: Implement Forms Backend Proxy

### 4.1 Create Forms API Route

```typescript
// apps/portfolio/src/pages/api/forms/submit.ts

import type { APIRoute } from 'astro';
import { createStrapiEntry } from '../../../lib/strapi';

const RECAPTCHA_SECRET_KEY = import.meta.env.RECAPTCHA_SECRET_KEY;

/**
 * Verify reCAPTCHA v3 token
 */
async function verifyRecaptcha(token: string, remoteip?: string): Promise<boolean> {
  const params = new URLSearchParams({
    secret: RECAPTCHA_SECRET_KEY,
    response: token,
    ...(remoteip && { remoteip }),
  });

  const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    body: params,
  });

  const data = await res.json();
  return data.success && data.score >= 0.5; // Adjust threshold as needed
}

/**
 * Rate limiting helper (simple in-memory cache)
 * TODO: Replace with Redis in production
 */
const rateLimitCache = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string, maxRequests = 5, windowMs = 60000): boolean {
  const now = Date.now();
  const record = rateLimitCache.get(ip);

  if (!record || now > record.resetAt) {
    rateLimitCache.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (record.count >= maxRequests) {
    return false;
  }

  record.count++;
  return true;
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  try {
    // 1. Parse request body
    const body = await request.json();
    const { recaptchaToken, formType, ...formData } = body;

    // 2. Validate required fields
    if (!formType || !recaptchaToken) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 3. Verify reCAPTCHA
    const isHuman = await verifyRecaptcha(recaptchaToken, clientAddress);
    if (!isHuman) {
      return new Response(
        JSON.stringify({ error: 'reCAPTCHA verification failed' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 4. Rate limiting (5 requests per minute per IP)
    if (!checkRateLimit(clientAddress, 5, 60000)) {
      return new Response(
        JSON.stringify({ error: 'Too many requests. Please try again later.' }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 5. Submit to Strapi
    const submission = await createStrapiEntry('form-submissions', {
      formType,
      ...formData,
      submittedAt: new Date().toISOString(),
      ipAddress: clientAddress,
    });

    // 6. Return success
    return new Response(
      JSON.stringify({ success: true, data: submission.data }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Form submission error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
```

### 4.2 Create Easter Egg API Route

```typescript
// apps/portfolio/src/pages/api/easter-eggs/complete.ts

import type { APIRoute } from 'astro';
import { createStrapiEntry } from '../../../lib/strapi';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { easterEggId, username } = body;

    // Validate required fields
    if (!easterEggId || !username) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Submit to Strapi
    const completion = await createStrapiEntry('easter-egg-completions', {
      easterEggId,
      username,
      completedAt: new Date().toISOString(),
    });

    return new Response(
      JSON.stringify({ success: true, data: completion.data }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Easter egg completion error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
```

---

## Step 5: Usage Examples

### 5.1 Fetch Content in Astro Pages

```astro
---
// apps/portfolio/src/pages/index.astro
import { fetchStrapi } from '../lib/strapi';

// Fetch hero content (server-side at build time)
const hero = await fetchStrapi('hero', {
  query: { populate: '*' },
  cache: 'force-cache', // Cache for static builds
});

// Fetch configuration
const config = await fetchStrapi('website-configuration');

// Fetch skills
const skills = await fetchStrapi('skills', {
  query: {
    populate: '*',
    sort: 'proficiency:desc',
  },
});
---

<html>
  <head>
    <title>{config.data.siteName}</title>
  </head>
  <body>
    <h1>{hero.data.title}</h1>
    <!-- Rest of your page -->
  </body>
</html>
```

### 5.2 Client-Side Form Submission

```typescript
// apps/portfolio/src/components/ContactForm.tsx

import { useState } from 'react';

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');

    const formData = new FormData(e.currentTarget);

    // Get reCAPTCHA token
    const recaptchaToken = await window.grecaptcha.execute(
      import.meta.env.PUBLIC_RECAPTCHA_SITE_KEY,
      { action: 'submit' }
    );

    try {
      const res = await fetch('/api/forms/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formType: 'Contact',
          recaptchaToken,
          rawMessage: formData.get('message'),
          email: formData.get('email'),
          name: formData.get('name'),
        }),
      });

      if (res.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" required />
      <input name="email" type="email" required />
      <textarea name="message" required />
      <button type="submit" disabled={status === 'loading'}>
        {status === 'loading' ? 'Sending...' : 'Send'}
      </button>
      {status === 'success' && <p>Message sent!</p>}
      {status === 'error' && <p>Error sending message.</p>}
    </form>
  );
}
```

---

## Step 6: Public Role Configuration

### Keep Public Role Minimal

Even with the Build/SSR token, you may want to enable the Public role for:
- Client-side dynamic filtering/search
- Real-time leaderboard updates

**Recommended Public Permissions:**
- `hero` → ✅ `find` (if needed for client-side hydration)
- `about` → ✅ `find` (if needed for client-side hydration)
- `easter-egg-completions` → ✅ `find` (for leaderboard)

**Do NOT enable:**
- ❌ Any `create`, `update`, `delete` permissions
- ❌ Configuration types (Portfolio, Website Configuration, etc.)
- ❌ Form Submissions (use backend proxy instead)

---

## Security Checklist

### ✅ Token Security

- [ ] Build/SSR token stored in `.env` (NOT `.env.example`)
- [ ] `.env` in `.gitignore`
- [ ] Token NOT prefixed with `PUBLIC_`
- [ ] Token has appropriate permissions (not over-privileged)
- [ ] Token stored in password manager
- [ ] Token rotation plan documented (e.g., every 90 days)

### ✅ API Route Security

- [ ] reCAPTCHA v3 verification implemented
- [ ] Rate limiting implemented (consider Redis for production)
- [ ] Input validation on all form fields
- [ ] IP address logging for audit trail
- [ ] Error messages don't leak sensitive info
- [ ] CORS configured properly (if needed)

### ✅ Public Role Security

- [ ] Public role has minimal permissions
- [ ] No `create`/`update`/`delete` on Public role
- [ ] Configuration types NOT accessible publicly
- [ ] Sensitive fields excluded from responses

---

## Production Considerations

### 1. Redis Rate Limiting

Replace in-memory rate limiting with Redis:

```typescript
// apps/portfolio/src/lib/rateLimit.ts
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export async function checkRateLimit(
  key: string,
  maxRequests = 5,
  windowSeconds = 60
): Promise<boolean> {
  const current = await redis.incr(key);

  if (current === 1) {
    await redis.expire(key, windowSeconds);
  }

  return current <= maxRequests;
}
```

### 2. Token Rotation

Set up a reminder to rotate the Build/SSR token every 90 days:

1. Create new token in Strapi
2. Update `.env` in all environments (local, staging, production)
3. Redeploy applications
4. Verify all endpoints work
5. Delete old token from Strapi

### 3. Monitoring

Add logging for security events:

```typescript
// Log failed reCAPTCHA attempts
// Log rate limit violations
// Log suspicious form submissions
```

### 4. Environment-Specific Tokens

Use different tokens for different environments:

```bash
# .env.development
STRAPI_URL=http://localhost:1337
STRAPI_TOKEN=dev-token

# .env.production
STRAPI_URL=https://cms.yourdomain.com
STRAPI_TOKEN=prod-token
```

---

## Verification

### Test Build/SSR Token

```bash
# Test read access (should work)
curl http://localhost:1337/api/hero \
  -H "Authorization: Bearer YOUR_TOKEN"

curl http://localhost:1337/api/website-configuration \
  -H "Authorization: Bearer YOUR_TOKEN"

# Test form submission (should work)
curl -X POST http://localhost:1337/api/form-submissions \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"data": {"formType": "Contact", "rawMessage": "Test"}}'
```

### Test API Routes

```bash
# Test forms proxy (with reCAPTCHA - will fail without valid token)
curl -X POST http://localhost:4321/api/forms/submit \
  -H "Content-Type: application/json" \
  -d '{
    "formType": "Contact",
    "recaptchaToken": "test",
    "rawMessage": "Test message",
    "email": "test@example.com"
  }'

# Test easter egg completion
curl -X POST http://localhost:4321/api/easter-eggs/complete \
  -H "Content-Type: application/json" \
  -d '{
    "easterEggId": "hidden-step-1",
    "username": "testuser"
  }'
```

---

## Next Steps

1. **[→ Configure Security & Deployment](./10-security-deployment.md)**
2. **[→ Test All Endpoints](./12-testing.md)**

---

**Last Updated:** 2025-12-02
**Security Level:** Production-Ready ✅

**[← Implementation Timeline](./15-implementation-timeline.md)** | **[Next: Testing →](./12-testing.md)**
