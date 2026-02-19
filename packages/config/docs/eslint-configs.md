# 📖 ESLINT_CONFIGURATIONS

**DEVELOPER_GUIDE** • **INTELLIGENCE_THEME** • **Phase_4_Developer_Experience**

Complete guide to **ESLint Flat Config** presets in @aazucena/config. Modern ESLint v9+ with TypeScript, React, Security, and framework-specific rules.

---

## 📋 TABLE_OF_CONTENTS

- [🎯 OVERVIEW](#-overview)
- [🔧 CONFIGURATION_PRESETS](#-configuration_presets)
- [📝 RULES_REFERENCE](#-rules_reference)
- [🎯 USAGE_PATTERNS](#-usage_patterns)
- [🔒 SECURITY_RULES](#-security_rules)
- [✅ BEST_PRACTICES](#-best_practices)

---

## 🎯 OVERVIEW

### ESLint Flat Config

**Modern ESLint v9+** uses JavaScript-based flat config (not JSON `.eslintrc`).

**Key Benefits:**

- ✅ **JavaScript-based** - Dynamic configuration, imports, composition
- ✅ **No string extends** - Direct array spreading
- ✅ **Explicit imports** - No hidden configs
- ✅ **Better TypeScript support** - Type-safe configuration
- ✅ **Simpler mental model** - Flat array of config objects

**Migration:**

```javascript
// ❌ OLD (.eslintrc.json)
{
  "extends": ["next/core-web-vitals", "prettier"],
  "rules": { "no-console": "warn" }
}

// ✅ NEW (eslint.config.js)
import nextjsConfig from '@aazucena/config/eslint/nextjs.js';
export default nextjsConfig;
```

---

## 🔧 CONFIGURATION_PRESETS

### 1. eslint/astro.js

**Purpose:** ESLint for Astro projects with React support

**Includes:**

- `@eslint/js` recommended
- `typescript-eslint` recommended + strict
- `eslint-plugin-astro` recommended
- `eslint-plugin-react` + `eslint-plugin-react-hooks`
- `eslint-plugin-jsx-a11y` (accessibility)
- `eslint-plugin-security`

**Usage:**

```javascript
// eslint.config.js
import astroConfig from '@aazucena/config/eslint/astro.js';

export default astroConfig;
```

**Custom Rules:**

```javascript
{
  rules: {
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'warn',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'prefer-const': 'warn',
  }
}
```

**File Patterns:**

```javascript
{
  files: ['**/*.astro', '**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
  ignores: ['dist/', 'node_modules/', '.astro/', '.turbo/'],
}
```

---

### 2. eslint/nextjs.js

**Purpose:** ESLint for Next.js applications

**Includes:**

- `@eslint/js` recommended
- `typescript-eslint` recommended
- `@next/eslint-plugin-next`
- `eslint-plugin-react` + `eslint-plugin-react-hooks`
- `eslint-plugin-security`

**Usage:**

```javascript
// eslint.config.js
import nextjsConfig from '@aazucena/config/eslint/nextjs.js';

export default nextjsConfig;
```

**Next.js-Specific Rules:**

```javascript
{
  rules: {
    '@next/next/no-html-link-for-pages': 'error',
    '@next/next/no-img-element': 'warn',
    '@next/next/no-sync-scripts': 'error',
    'react/react-in-jsx-scope': 'off', // Not needed in Next.js
  }
}
```

---

### 3. eslint/react.js

**Purpose:** ESLint for React libraries

**Includes:**

- `@eslint/js` recommended
- `typescript-eslint` recommended
- `eslint-plugin-react` recommended
- `eslint-plugin-react-hooks`
- `eslint-plugin-jsx-a11y`
- `eslint-plugin-security`

**Usage:**

```javascript
// eslint.config.js
import reactConfig from '@aazucena/config/eslint/react.js';

export default reactConfig;
```

**React-Specific Rules:**

```javascript
{
  rules: {
    'react/react-in-jsx-scope': 'off', // Not needed with new JSX transform
    'react/prop-types': 'off', // Using TypeScript instead
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  }
}
```

---

### 4. eslint/library.js

**Purpose:** ESLint for pure TypeScript libraries

**Includes:**

- `@eslint/js` recommended
- `typescript-eslint` recommended
- `eslint-plugin-security`

**Usage:**

```javascript
// eslint.config.js
import { createLibraryConfig } from '@aazucena/config/eslint/library.js';

// Standard library
export default createLibraryConfig();

// Visualization library (D3, Three.js)
export default createLibraryConfig({ isVisualization: true });
```

**Options:**

```typescript
interface LibraryConfigOptions {
  isVisualization?: boolean; // Relaxes no-explicit-any for D3/Zod logic
}
```

**Standard Rules:**

```javascript
{
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-non-null-assertion': 'off',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'prefer-const': 'warn',
    'security/detect-object-injection': 'off', // Too noisy for D3/mapping
  }
}
```

**Visualization Mode:**

```javascript
// When isVisualization: true
{
  rules: {
    '@typescript-eslint/no-explicit-any': 'off', // D3 typing flexibility
    '@typescript-eslint/no-non-null-assertion': 'off', // D3 selections
  }
}
```

---

## 📝 RULES_REFERENCE

### TypeScript Rules

#### @typescript-eslint/no-unused-vars

**Level:** warn
**Config:** `{ argsIgnorePattern: '^_' }`

```typescript
// ✅ GOOD - Unused arg with _ prefix
function handleClick(_event: MouseEvent) {
  // Not using event
}

// ❌ BAD - Unused arg without _ prefix
function handleClick(event: MouseEvent) {
  // Not using event - ESLint warns
}
```

---

#### @typescript-eslint/no-explicit-any

**Level:** warn (off in library config)

```typescript
// ⚠️ WARN - Avoid any
function processData(data: any) {
  return data;
}

// ✅ GOOD - Use generic
function processData<T>(data: T): T {
  return data;
}

// ✅ GOOD - Use unknown
function processData(data: unknown) {
  if (typeof data === 'string') {
    return data.toUpperCase();
  }
}
```

---

#### @typescript-eslint/no-non-null-assertion

**Level:** off

```typescript
// ✅ ALLOWED - Non-null assertion
const element = document.getElementById('root')!;

// ✅ BETTER - Type guard
const element = document.getElementById('root');
if (!element) throw new Error('Root element not found');
```

---

### React Rules

#### react-hooks/rules-of-hooks

**Level:** error

```typescript
// ❌ BAD - Hook in conditional
function Component({ condition }: { condition: boolean }) {
  if (condition) {
    useState(0); // Error!
  }
}

// ✅ GOOD - Hook at top level
function Component({ condition }: { condition: boolean }) {
  const [count, setCount] = useState(0);

  if (condition) {
    setCount(count + 1);
  }
}
```

---

#### react-hooks/exhaustive-deps

**Level:** warn

```typescript
// ⚠️ WARN - Missing dependency
useEffect(() => {
  console.log(count); // count not in deps
}, []);

// ✅ GOOD - All dependencies listed
useEffect(() => {
  console.log(count);
}, [count]);

// ✅ GOOD - Empty deps when appropriate
useEffect(() => {
  // Setup that only runs once
  const timer = setInterval(() => {}, 1000);
  return () => clearInterval(timer);
}, []);
```

---

### Accessibility Rules

#### jsx-a11y/alt-text

**Level:** error

```typescript
// ❌ BAD - Missing alt text
<img src="logo.png" />

// ✅ GOOD - Descriptive alt text
<img src="logo.png" alt="Company logo" />

// ✅ GOOD - Decorative image
<img src="decoration.png" alt="" role="presentation" />
```

---

#### jsx-a11y/click-events-have-key-events

**Level:** error

```typescript
// ❌ BAD - Click without keyboard support
<div onClick={handleClick}>Click me</div>

// ✅ GOOD - Button element (built-in keyboard support)
<button onClick={handleClick}>Click me</button>

// ✅ GOOD - Add keyboard event
<div onClick={handleClick} onKeyDown={handleKeyDown} role="button" tabIndex={0}>
  Click me
</div>
```

---

### Security Rules

#### security/detect-object-injection

**Level:** off (too noisy)

```typescript
// Would warn but disabled in config
const obj: Record<string, number> = {};
const key = 'dynamicKey';
const value = obj[key]; // Dynamic property access
```

---

## 🎯 USAGE_PATTERNS

### Pattern 1: Standard Setup

```javascript
// eslint.config.js
import astroConfig from '@aazucena/config/eslint/astro.js';

export default astroConfig;
```

---

### Pattern 2: Override Rules

```javascript
// eslint.config.js
import astroConfig from '@aazucena/config/eslint/astro.js';

export default [
  ...astroConfig,
  {
    rules: {
      'no-console': 'off', // Allow console logs
      '@typescript-eslint/no-unused-vars': 'error', // Stricter
    },
  },
];
```

---

### Pattern 3: File-Specific Rules

```javascript
// eslint.config.js
import astroConfig from '@aazucena/config/eslint/astro.js';

export default [
  ...astroConfig,
  {
    files: ['**/*.test.ts', '**/*.spec.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off', // Allow any in tests
    },
  },
];
```

---

### Pattern 4: Ignore Patterns

```javascript
// eslint.config.js
import astroConfig from '@aazucena/config/eslint/astro.js';

export default [
  ...astroConfig,
  {
    ignores: [
      'dist/',
      'node_modules/',
      '.turbo/',
      '**/*.config.js', // Ignore config files
    ],
  },
];
```

---

## 🔒 SECURITY_RULES

### Enabled by eslint-plugin-security

#### detect-non-literal-regexp

```typescript
// ⚠️ WARN - Dynamic regex
const userInput = getUserInput();
const regex = new RegExp(userInput); // Potential ReDoS

// ✅ GOOD - Static regex
const regex = /^[a-z]+$/;
```

#### detect-unsafe-regex

```typescript
// ⚠️ WARN - Catastrophic backtracking
const regex = /(a+)+b/;

// ✅ GOOD - Efficient regex
const regex = /a+b/;
```

---

## ✅ BEST_PRACTICES

### 1. Run ESLint in CI/CD

```yaml
# .github/workflows/lint.yml
- name: Lint
  run: pnpm lint
```

### 2. Auto-fix on Save

```json
// .vscode/settings.json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

### 3. Gradual Migration

```javascript
// Start with warnings, upgrade to errors
export default [
  ...baseConfig,
  {
    rules: {
      'no-console': 'warn', // Warn first
      // Later: 'no-console': 'error',
    },
  },
];
```

---

**DOCUMENTATION_METADATA:**

- **Version:** 1.0.0
- **Last Updated:** 2026-02-11
- **Author:** AAZUCENA Development Team
- **Status:** ✅ Complete
- **Phase:** Phase 4 - Developer Experience
- **Lines:** ~600

**INTELLIGENCE_THEME** • **MODERN_ESLINT** 📖
