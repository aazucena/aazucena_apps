# 🔧 TOOLING_GUIDE

**DEVELOPER_GUIDE** • **INTELLIGENCE_THEME** • **Phase_4_Developer_Experience**

Complete guide to **Prettier, PostCSS, Sentry, and Vercel** configurations in @aazucena/config.

---

## 📋 TABLE_OF_CONTENTS

- [💅 PRETTIER](#-prettier)
- [🎨 POSTCSS](#-postcss)
- [🔒 SENTRY](#-sentry)
- [☁️ VERCEL](#️-vercel)

---

## 💅 PRETTIER

### Astro Configuration

```typescript
// prettier/astro.ts
{
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5',
  printWidth: 100,
  plugins: ['prettier-plugin-astro'],
  overrides: [
    {
      files: '*.astro',
      options: { parser: 'astro' },
    },
  ],
}
```

**Usage:**

```typescript
// prettier.config.ts
import astroPreset from '@aazucena/config/prettier/astro';
export default astroPreset;
```

### Base Configuration

```typescript
// prettier/base.ts
{
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  printWidth: 100,
  trailingComma: 'es5',
}
```

---

## 🎨 POSTCSS

### Tailwind CSS Configuration

```javascript
// postcss/base.js
{
  plugins: {
    '@tailwindcss/vite': {},
    autoprefixer: {},
  },
}
```

**Usage:**

```javascript
// postcss.config.js
import postcssConfig from '@aazucena/config/postcss/base';
export default postcssConfig;
```

---

## 🔒 SENTRY

### Client Configuration

```typescript
// sentry/client.ts
import * as Sentry from '@sentry/astro';

Sentry.init({
  dsn: process.env.PUBLIC_SENTRY_DSN,
  environment: import.meta.env.MODE,
  integrations: [new Sentry.BrowserTracing(), new Sentry.Replay()],
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
```

### Server Configuration

```typescript
// sentry/server.ts
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
});
```

---

## ☁️ VERCEL

### Base Configuration

```json
// vercel/base.json
{
  "buildCommand": "pnpm build",
  "outputDirectory": "dist",
  "installCommand": "pnpm install",
  "framework": null
}
```

**Environment Variables:**

```bash
# .env.production
PUBLIC_SENTRY_DSN=https://...
SENTRY_AUTH_TOKEN=...
```

---

**DOCUMENTATION_METADATA:**

- **Version:** 1.0.0
- **Last Updated:** 2026-02-11
- **Lines:** ~150

**INTELLIGENCE_THEME** • **TOOLING_SETUP** 🔧
