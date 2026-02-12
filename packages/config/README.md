# ⚙️ @aazucena/config

**MONOREPO_PACKAGE** • **INTELLIGENCE_THEME** • **Phase_4_Developer_Experience**

Shared build configurations for **ESLint, Prettier, TypeScript, Playwright, PostCSS, Sentry, and Vercel**. Zero-config setup ensuring consistency across all workspace applications and packages.

---

## 📋 TABLE_OF_CONTENTS

- [🎯 OVERVIEW](#-overview)
- [⚡ QUICK_START](#-quick_start)
- [📦 INSTALLATION](#-installation)
- [🏗️ ARCHITECTURE](#️-architecture)
- [🔧 CONFIGURATION_MODULES](#-configuration_modules)
- [🎯 USAGE_EXAMPLES](#-usage_examples)
- [📚 RELATED_DOCUMENTATION](#-related_documentation)

---

## 🎯 OVERVIEW

### Purpose

The **@aazucena/config** package provides **battle-tested, zero-config presets** for all build tools and development infrastructure:

- ✅ **ESLint Configs** - 5 presets (Astro, Next.js, React, Library, Next)
- ✅ **Prettier Presets** - 2 configs (Astro, Base)
- ✅ **TypeScript Configs** - 4 presets (Astro, Next.js, React, Base)
- ✅ **Playwright Testing** - E2E test configuration with cross-browser support
- ✅ **PostCSS Setup** - Tailwind CSS + Autoprefixer integration
- ✅ **Sentry Integration** - Error tracking for client/server/Next.js
- ✅ **Vercel Deployment** - Production deployment configuration
- ✅ **Convention over Configuration** - Sensible defaults, minimal overrides

### Key Features

| Feature | Description | Status |
|---------|-------------|--------|
| **ESLint (Flat Config)** | Modern ESLint v9+ with TypeScript, React, Security plugins | ✅ Active |
| **Prettier** | Code formatting with Astro plugin support | ✅ Active |
| **TypeScript** | Strict mode configs with framework-specific JSX handling | ✅ Active |
| **Playwright** | E2E testing with Chromium, Firefox, WebKit | ✅ Active |
| **PostCSS** | Tailwind CSS v4 + Autoprefixer | ✅ Active |
| **Sentry** | Error tracking with source maps and release tracking | ✅ Active |
| **Vercel** | Deployment with environment variables and routing | ✅ Active |

### Package Info

```json
{
  "name": "@aazucena/config",
  "version": "0.1.0",
  "type": "module",
  "exports": {
    "./eslint/*": "./src/eslint/*.js",
    "./prettier/*": "./src/prettier/*.ts",
    "./tsconfig/*": "./src/tsconfig/*.json",
    "./playwright/*": "./src/playwright/*.ts",
    "./postcss/*": "./src/postcss/*.js",
    "./sentry/*": "./src/sentry/*.ts",
    "./vercel/*": "./src/vercel/*.json"
  },
  "devDependencies": {
    "@playwright/test": "^1.40.0",
    "@sentry/astro": "^7.90.0",
    "eslint": "^9.0.0",
    "prettier": "^3.1.0",
    "typescript": "^5.3.0"
  }
}
```

---

## ⚡ QUICK_START

### ESLint Configuration

```javascript
// eslint.config.js
import astroConfig from '@aazucena/config/eslint/astro.js';

export default astroConfig;
```

### Prettier Configuration

```typescript
// prettier.config.ts
import astroPreset from '@aazucena/config/prettier/astro';

export default astroPreset;
```

### TypeScript Configuration

```json
// tsconfig.json
{
  "extends": "@aazucena/config/tsconfig/astro.json",
  "compilerOptions": {
    "outDir": "dist"
  }
}
```

### Playwright Testing

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';
import baseConfig from '@aazucena/config/playwright/base';

export default defineConfig({
  ...baseConfig,
  webServer: {
    command: 'pnpm dev',
    port: 4321,
  },
});
```

---

## 📦 INSTALLATION

### From Workspace (Monorepo)

```bash
# In your app's package.json
{
  "dependencies": {
    "@aazucena/config": "workspace:*"
  }
}
```

```bash
pnpm install
```

### Standalone Installation (External)

```bash
pnpm add -D @aazucena/config
# or
npm install --save-dev @aazucena/config
# or
yarn add -D @aazucena/config
```

**Note:** Requires peer dependencies (ESLint, Prettier, TypeScript, Playwright).

---

## 🏗️ ARCHITECTURE

### Directory Structure

```
packages/config/
├── src/
│   ├── eslint/
│   │   ├── astro.js          # Astro projects (with React support)
│   │   ├── nextjs.js         # Next.js applications
│   │   ├── react.js          # React libraries
│   │   ├── library.js        # TypeScript libraries
│   │   └── next.js           # Next.js-specific rules
│   ├── prettier/
│   │   ├── astro.ts          # Astro + Prettier plugin
│   │   └── base.ts           # Base formatting rules
│   ├── tsconfig/
│   │   ├── astro.json        # Astro TypeScript config
│   │   ├── nextjs.json       # Next.js TypeScript config
│   │   ├── react.json        # React TypeScript config
│   │   └── base.json         # Base TypeScript config
│   ├── playwright/
│   │   ├── base.ts           # Base test configuration
│   │   └── factory.ts        # Test factory utilities
│   ├── postcss/
│   │   └── base.js           # Tailwind CSS + Autoprefixer
│   ├── sentry/
│   │   ├── client.ts         # Browser error tracking
│   │   ├── server.ts         # Server error tracking
│   │   └── nextjs.ts         # Next.js integration
│   └── vercel/
│       └── base.json         # Vercel deployment config
├── docs/
│   ├── eslint-configs.md     # ESLint configuration guide
│   ├── testing-configs.md    # Playwright testing guide
│   └── tooling-guide.md      # Prettier, PostCSS, Sentry, Vercel
├── package.json
└── tsconfig.json
```

### Design Principles

#### 1. Convention over Configuration
```typescript
// ✅ GOOD - Zero config
import astroConfig from '@aazucena/config/eslint/astro.js';
export default astroConfig;

// ❌ BAD - Manual configuration
export default {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'astro', 'jsx-a11y'],
  // ... 100+ lines of rules
};
```

#### 2. Composable Configs
```typescript
// ✅ GOOD - Extend and override
import baseConfig from '@aazucena/config/playwright/base';

export default {
  ...baseConfig,
  testDir: './e2e', // Override specific property
};
```

#### 3. Framework-Specific Presets
```
eslint/
├── astro.js     → Astro-specific rules (JSX in .astro files)
├── nextjs.js    → Next.js-specific rules (App Router, Image optimization)
├── react.js     → React-specific rules (Hooks, JSX)
└── library.js   → Pure TypeScript (no JSX)
```

---

## 🔧 CONFIGURATION_MODULES

### 1. ESLint Configurations

#### eslint/astro.js
**Purpose:** ESLint for Astro projects with React support

**Key Features:**
- ✅ Astro parser (`eslint-plugin-astro`)
- ✅ TypeScript support (`typescript-eslint`)
- ✅ React rules for embedded components
- ✅ JSX accessibility (`eslint-plugin-jsx-a11y`)
- ✅ Security plugin (`eslint-plugin-security`)

**Usage:**
```javascript
// eslint.config.js
import astroConfig from '@aazucena/config/eslint/astro.js';

export default astroConfig;
```

**Includes:**
- `@eslint/js` recommended rules
- `typescript-eslint` recommended + strict
- `eslint-plugin-astro` recommended
- `eslint-plugin-security` recommended
- React hooks rules
- JSX accessibility rules

---

#### eslint/nextjs.js
**Purpose:** ESLint for Next.js applications

**Key Features:**
- ✅ Next.js-specific rules (`@next/eslint-plugin-next`)
- ✅ React 19 hooks enforcement
- ✅ TypeScript strict mode
- ✅ Import/export validation
- ✅ Security scanning

**Usage:**
```javascript
// eslint.config.js
import nextjsConfig from '@aazucena/config/eslint/nextjs.js';

export default nextjsConfig;
```

---

#### eslint/react.js
**Purpose:** ESLint for React libraries

**Key Features:**
- ✅ React best practices
- ✅ Hooks rules (`eslint-plugin-react-hooks`)
- ✅ TypeScript integration
- ✅ Accessibility rules
- ✅ No console statements (warn)

**Usage:**
```javascript
// eslint.config.js
import reactConfig from '@aazucena/config/eslint/react.js';

export default reactConfig;
```

---

#### eslint/library.js
**Purpose:** ESLint for pure TypeScript libraries

**Key Features:**
- ✅ TypeScript strict rules
- ✅ No JSX (pure TS)
- ✅ D3/visualization-friendly (optional)
- ✅ Security scanning
- ✅ Import/export validation

**Usage:**
```javascript
// eslint.config.js
import { createLibraryConfig } from '@aazucena/config/eslint/library.js';

// Standard library
export default createLibraryConfig();

// Visualization library (relaxed rules for D3/Three.js)
export default createLibraryConfig({ isVisualization: true });
```

**Special Options:**
```typescript
createLibraryConfig({
  isVisualization: true, // Disables no-explicit-any for D3/Zod logic
});
```

---

### 2. Prettier Configurations

#### prettier/astro.ts
**Purpose:** Prettier formatting for Astro projects

**Configuration:**
```typescript
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
      options: {
        parser: 'astro',
      },
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

---

#### prettier/base.ts
**Purpose:** Base Prettier formatting (no plugins)

**Configuration:**
```typescript
{
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  printWidth: 100,
  trailingComma: 'es5',
}
```

**Usage:**
```typescript
// prettier.config.ts
import basePreset from '@aazucena/config/prettier/base';

export default basePreset;
```

---

### 3. TypeScript Configurations

#### tsconfig/astro.json
**Purpose:** TypeScript for Astro projects

**Key Settings:**
```json
{
  "extends": "./base.json",
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react",
    "strictNullChecks": true,
    "types": ["astro/client"]
  }
}
```

---

#### tsconfig/nextjs.json
**Purpose:** TypeScript for Next.js applications

**Key Settings:**
```json
{
  "extends": "./base.json",
  "compilerOptions": {
    "jsx": "preserve",
    "incremental": true,
    "esModuleInterop": true,
    "lib": ["dom", "dom.iterable", "esnext"]
  }
}
```

---

#### tsconfig/react.json
**Purpose:** TypeScript for React libraries

**Key Settings:**
```json
{
  "extends": "./base.json",
  "compilerOptions": {
    "jsx": "react-jsx",
    "declaration": true,
    "declarationMap": true
  }
}
```

---

#### tsconfig/base.json
**Purpose:** Base TypeScript configuration

**Key Settings:**
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "skipLibCheck": true,
    "resolveJsonModule": true
  }
}
```

---

### 4. Playwright Configuration

#### playwright/base.ts
**Purpose:** E2E testing configuration

**Configuration:**
```typescript
{
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:4321',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
}
```

**Usage:**
```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';
import baseConfig from '@aazucena/config/playwright/base';

export default defineConfig({
  ...baseConfig,
  webServer: {
    command: 'pnpm dev',
    port: 4321,
  },
});
```

---

### 5. PostCSS Configuration

#### postcss/base.js
**Purpose:** PostCSS with Tailwind CSS v4

**Configuration:**
```javascript
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

### 6. Sentry Configuration

#### sentry/client.ts
**Purpose:** Browser error tracking

**Usage:**
```typescript
import * as Sentry from '@sentry/astro';

Sentry.init({
  dsn: process.env.PUBLIC_SENTRY_DSN,
  environment: import.meta.env.MODE,
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay(),
  ],
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
```

---

#### sentry/server.ts
**Purpose:** Server-side error tracking

**Usage:**
```typescript
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
});
```

---

### 7. Vercel Configuration

#### vercel/base.json
**Purpose:** Vercel deployment settings

**Configuration:**
```json
{
  "buildCommand": "pnpm build",
  "outputDirectory": "dist",
  "installCommand": "pnpm install",
  "framework": null
}
```

---

## 🎯 USAGE_EXAMPLES

### Example 1: New Astro Project

```bash
# Create new Astro project
pnpm create astro@latest my-app

cd my-app

# Add config package
pnpm add -D @aazucena/config
```

```javascript
// eslint.config.js
import astroConfig from '@aazucena/config/eslint/astro.js';
export default astroConfig;
```

```typescript
// prettier.config.ts
import astroPreset from '@aazucena/config/prettier/astro';
export default astroPreset;
```

```json
// tsconfig.json
{
  "extends": "@aazucena/config/tsconfig/astro.json"
}
```

---

### Example 2: Override ESLint Rules

```javascript
// eslint.config.js
import astroConfig from '@aazucena/config/eslint/astro.js';

export default [
  ...astroConfig,
  {
    rules: {
      'no-console': 'off', // Allow console in this project
      '@typescript-eslint/no-unused-vars': 'warn',
    },
  },
];
```

---

### Example 3: Extend Playwright Config

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';
import baseConfig from '@aazucena/config/playwright/base';

export default defineConfig({
  ...baseConfig,
  testDir: './e2e',
  use: {
    ...baseConfig.use,
    baseURL: 'http://localhost:3000',
  },
  projects: [
    ...baseConfig.projects!,
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 13'] },
    },
  ],
});
```

---

## 📚 RELATED_DOCUMENTATION

### Package Documentation
- [📖 ESLint Configs](./docs/eslint-configs.md) - Complete ESLint guide
- [🧪 Testing Configs](./docs/testing-configs.md) - Playwright testing guide
- [🔧 Tooling Guide](./docs/tooling-guide.md) - Prettier, PostCSS, Sentry, Vercel

### Related Packages
- [@aazucena/types](../types/README.md) - TypeScript type definitions
- [@aazucena/constants](../constants/README.md) - Application constants

---

## 🔗 REFERENCES

### Dependencies
- **ESLint** v9+ (Flat Config)
- **Prettier** v3+
- **TypeScript** v5+
- **Playwright** v1.40+
- **Tailwind CSS** v4+
- **Sentry** v7+

### Used By
- **apps/portfolio** - Astro configuration
- **apps/analytics** - Next.js configuration
- **packages/ui** - React configuration
- **packages/hooks** - Library configuration
- **packages/utils** - Library configuration

### Version History
- **0.1.0** (2026-02-11) - Initial release with 7 config modules

---

## 📝 NOTES

### Migration from ESLint v8

**Old (eslintrc.json):**
```json
{
  "extends": ["next/core-web-vitals", "prettier"],
  "rules": {
    "no-console": "warn"
  }
}
```

**New (Flat Config):**
```javascript
import nextjsConfig from '@aazucena/config/eslint/nextjs.js';

export default nextjsConfig;
```

**Benefits:**
- ✅ JavaScript-based (dynamic configuration)
- ✅ Better TypeScript support
- ✅ Composable (spread arrays instead of string extends)
- ✅ No hidden configs (explicit imports)

---

**DOCUMENTATION_METADATA:**
- **Version:** 1.0.0
- **Last Updated:** 2026-02-11
- **Author:** AAZUCENA Development Team
- **Status:** ✅ Complete
- **Phase:** Phase 4 - Developer Experience
- **Lines:** ~1,100

**INTELLIGENCE_THEME** • **ZERO_CONFIG_SETUP** ⚙️
