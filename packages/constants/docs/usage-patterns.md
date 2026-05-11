# 🎯 USAGE_PATTERNS

**DEVELOPER_GUIDE** • **INTELLIGENCE_THEME** • **Phase_4_Developer_Experience**

Comprehensive guide for using constants effectively across the AAZUCENA monorepo. **Best practices, patterns, and anti-patterns** for type-safe, maintainable code.

---

## 📋 TABLE_OF_CONTENTS

- [🎯 CORE_PRINCIPLES](#-core_principles)
- [📦 IMPORT_PATTERNS](#-import_patterns)
- [🔒 TYPE_SAFETY](#-type_safety)
- [🎨 PATTERN_CATALOG](#-pattern_catalog)
- [⚠️ ANTI_PATTERNS](#️-anti_patterns)
- [🔧 ADVANCED_TECHNIQUES](#-advanced_techniques)
- [✅ TESTING_CONSTANTS](#-testing_constants)

---

## 🎯 CORE_PRINCIPLES

### Principle 1: Single Source of Truth

**Rule:** Never duplicate constant values across the codebase.

```typescript
// ❌ BAD - Duplicate values
// In component A
const TRANSITION_DURATION = 1000;

// In component B
const SECTION_TRANSITION = 1000;

// ✅ GOOD - Import from constants
import { ANIMATION_TIMING } from '@aazucena/constants';

const duration = ANIMATION_TIMING.SECTION_TRANSITION; // 1000ms
```

**Why:** Changes to the value propagate automatically to all consumers.

---

### Principle 2: Type Safety Over Runtime Checks

**Rule:** Let TypeScript prevent errors at compile time.

```typescript
import { ROUTES } from '@aazucena/constants';

// ❌ BAD - String validation at runtime
function navigate(route: string) {
  if (!Object.values(ROUTES.PORTFOLIO).includes(route)) {
    throw new Error('Invalid route');
  }
  // ... navigate
}

// ✅ GOOD - TypeScript validates at compile time
type PortfolioRoute = (typeof ROUTES.PORTFOLIO)[keyof typeof ROUTES.PORTFOLIO];

function navigate(route: PortfolioRoute) {
  // ... navigate (guaranteed valid)
}

navigate(ROUTES.PORTFOLIO.HOME); // ✅ Type-safe
navigate('/invalid'); // ❌ TypeScript error
```

---

### Principle 3: Immutability

**Rule:** Never modify constants.

```typescript
import { PARTICLE_COUNTS } from '@aazucena/constants';

// ❌ BAD - Attempting to modify (will error with strict mode)
PARTICLE_COUNTS.HIGH = 300; // Error: Cannot assign to read-only property

// ✅ GOOD - Create derived values
const customCounts = {
  ...PARTICLE_COUNTS,
  ULTRA_HIGH: 400,
};
```

---

### Principle 4: Tree-Shaking

**Rule:** Use named imports for optimal bundle size.

```typescript
// ❌ BAD - Imports entire module
import * as Constants from '@aazucena/constants';
const route = Constants.ROUTES.PORTFOLIO.HOME;

// ✅ GOOD - Only imports ROUTES
import { ROUTES } from '@aazucena/constants';
const route = ROUTES.PORTFOLIO.HOME;
```

**Impact:**

- Bad: ~15KB in bundle
- Good: ~0.5KB in bundle (97% reduction)

---

## 📦 IMPORT_PATTERNS

### Pattern 1: Direct Import

**Best for:** Known constants at compile time.

```typescript
import { ROUTES, STORAGE_KEYS, ANIMATION_TIMING } from '@aazucena/constants';

// Direct usage
const homeUrl = ROUTES.PORTFOLIO.HOME;
const themeKey = STORAGE_KEYS.THEME;
const duration = ANIMATION_TIMING.SECTION_TRANSITION;
```

**Pros:**

- ✅ Maximum type safety
- ✅ Best tree-shaking
- ✅ Autocomplete works perfectly

---

### Pattern 2: Grouped Import

**Best for:** Related constants from same module.

```typescript
import { AI_MODELS, AI_PRICING, SAVINGS_BASELINE_MODEL } from '@aazucena/constants';

function calculateAICost(model: string, inputTokens: number, outputTokens: number) {
  const pricing = AI_PRICING[model] || AI_PRICING.default;
  return (inputTokens / 1_000_000) * pricing.in + (outputTokens / 1_000_000) * pricing.out;
}
```

**Pros:**

- ✅ Logical grouping
- ✅ Clear dependencies
- ✅ Easy to refactor

---

### Pattern 3: Selective Import

**Best for:** Large modules where you only need a few values.

```typescript
import { PARTICLE_PRESETS, ATMOSPHERIC_PHASES } from '@aazucena/constants';

// Only imports what's used
const spaceConfig = PARTICLE_PRESETS.space;
const phases = ATMOSPHERIC_PHASES;
```

**Pros:**

- ✅ Minimal bundle impact
- ✅ Clear intent
- ✅ Fast build times

---

## 🔒 TYPE_SAFETY

### Technique 1: Literal Type Inference

**Leverage `as const` for literal types.**

```typescript
import { ATMOSPHERIC_PHASES } from '@aazucena/constants';

// Type is inferred as literal union
type Phase = (typeof ATMOSPHERIC_PHASES)[number];
// Type: "exosphere" | "thermosphere" | "mesosphere" | "stratosphere" | "troposphere"

function getPhaseIndex(phase: Phase): number {
  return ATMOSPHERIC_PHASES.indexOf(phase);
}

getPhaseIndex('exosphere'); // ✅ Valid
getPhaseIndex('invalid'); // ❌ TypeScript error
```

---

### Technique 2: keyof for Object Keys

**Use `keyof typeof` for type-safe object key access.**

```typescript
import { ATMOSPHERIC_COLORS } from '@aazucena/constants';

type ColorPhase = keyof typeof ATMOSPHERIC_COLORS;
// Type: "exosphere" | "thermosphere" | "mesosphere" | "stratosphere" | "troposphere"

function getPhaseColors(phase: ColorPhase) {
  return ATMOSPHERIC_COLORS[phase];
}

getPhaseColors('exosphere'); // ✅ Returns { from, via, to, light }
getPhaseColors('invalid'); // ❌ TypeScript error
```

---

### Technique 3: Mapped Types

**Create derived types from constants.**

```typescript
import { STORAGE_KEYS } from '@aazucena/constants';

type StorageValue<K extends keyof typeof STORAGE_KEYS> = K extends 'THEME'
  ? 'light' | 'dark' | 'auto'
  : K extends 'COOKIE_CONSENT'
    ? boolean
    : string;

function setStorage<K extends keyof typeof STORAGE_KEYS>(key: K, value: StorageValue<K>): void {
  localStorage.setItem(STORAGE_KEYS[key], String(value));
}

setStorage('THEME', 'dark'); // ✅ Accepts 'light' | 'dark' | 'auto'
setStorage('THEME', 'invalid'); // ❌ TypeScript error
```

---

## 🎨 PATTERN_CATALOG

### Pattern 1: Configuration Objects

**Use Case:** Configure components/services with constants.

```typescript
import { PARTICLE_PRESETS, ATMOSPHERIC_COLORS, SCENE_ELEMENT_COUNTS } from '@aazucena/constants';

const sceneConfig = {
  particles: {
    ...PARTICLE_PRESETS.space,
    count: SCENE_ELEMENT_COUNTS.particles,
  },
  background: ATMOSPHERIC_COLORS.exosphere,
  shapes: {
    count: SCENE_ELEMENT_COUNTS.mainShapes,
  },
};

// Use in Three.js setup
initializeScene(sceneConfig);
```

**Benefits:**

- ✅ Centralized configuration
- ✅ Easy to override specific values
- ✅ Type-safe merging

---

### Pattern 2: Enum-Like Constants

**Use Case:** Fixed set of values with associated data.

```typescript
import { SENTINEL_THRESHOLDS } from '@aazucena/constants';

type MetricKey = keyof typeof SENTINEL_THRESHOLDS;

const METRIC_CONFIGS: Record<
  MetricKey,
  {
    unit: string;
    format: (value: number) => string;
  }
> = {
  AI_COST_DAILY: {
    unit: 'USD',
    format: (v) => `$${v.toFixed(2)}`,
  },
  AI_LATENCY_AVG: {
    unit: 'ms',
    format: (v) => `${v.toFixed(0)}ms`,
  },
  LCP_P75: {
    unit: 'ms',
    format: (v) => `${v.toFixed(0)}ms`,
  },
  CLS_AVG: {
    unit: '',
    format: (v) => v.toFixed(3),
  },
  ERROR_RATE_HOURLY: {
    unit: 'errors/hr',
    format: (v) => `${v} errors`,
  },
  FATAL_INCIDENTS_24H: {
    unit: 'incidents/24h',
    format: (v) => `${v} incidents`,
  },
};

function formatMetric(metric: MetricKey, value: number): string {
  const config = METRIC_CONFIGS[metric];
  return `${config.format(value)} ${config.unit}`.trim();
}
```

---

### Pattern 3: Computed Constants

**Use Case:** Derive values from base constants.

```typescript
import { AI_MODELS, AI_PRICING } from '@aazucena/constants';

// Compute model efficiency (tokens per dollar)
const MODEL_EFFICIENCY = Object.entries(AI_PRICING).reduce(
  (acc, [model, pricing]) => {
    if (model === 'default') return acc;

    const avgCostPer1M = (pricing.in + pricing.out) / 2;
    const tokensPerDollar = 1_000_000 / avgCostPer1M;

    acc[model] = {
      tokensPerDollar,
      costPer1KTokens: avgCostPer1M / 1000,
    };

    return acc;
  },
  {} as Record<string, { tokensPerDollar: number; costPer1KTokens: number }>,
);

// Usage
const efficiency = MODEL_EFFICIENCY[AI_MODELS.GEMINI_FLASH];
console.log(`Gemini Flash: ${efficiency.tokensPerDollar.toLocaleString()} tokens/$`);
```

---

### Pattern 4: Theme System Integration

**Use Case:** Integrate constants with CSS-in-JS or Tailwind.

```typescript
import { ATMOSPHERIC_COLORS } from '@aazucena/constants';

// Generate Tailwind config from constants
const tailwindColors = Object.entries(ATMOSPHERIC_COLORS).reduce((acc, [phase, colors]) => {
  acc[`phase-${phase}`] = {
    from: colors.from,
    via: colors.via,
    to: colors.to,
    light: colors.light,
  };
  return acc;
}, {} as Record<string, any>);

// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: tailwindColors,
    },
  },
};

// Usage in components
<div className="bg-phase-exosphere-from" />
```

---

### Pattern 5: Validation Helpers

**Use Case:** Validate user input against constants.

```typescript
import { ROUTES } from '@aazucena/constants';

function isValidPortfolioRoute(
  path: string,
): path is (typeof ROUTES.PORTFOLIO)[keyof typeof ROUTES.PORTFOLIO] {
  return Object.values(ROUTES.PORTFOLIO).includes(path as any);
}

function isValidAnalyticsRoute(
  path: string,
): path is (typeof ROUTES.ANALYTICS)[keyof typeof ROUTES.ANALYTICS] {
  return Object.values(ROUTES.ANALYTICS).includes(path as any);
}

// Usage
const userPath = '/projects';

if (isValidPortfolioRoute(userPath)) {
  console.log('Valid portfolio route');
  // TypeScript now knows userPath is a portfolio route
}
```

---

## ⚠️ ANTI_PATTERNS

### Anti-Pattern 1: Magic Strings

**Problem:** Hardcoded values scattered in code.

```typescript
// ❌ BAD - Magic strings everywhere
localStorage.setItem('aazucena-theme', 'dark');
navigate('/projects');
setTimeout(() => {}, 1000);

// ✅ GOOD - Use constants
import { STORAGE_KEYS, ROUTES, ANIMATION_TIMING } from '@aazucena/constants';

localStorage.setItem(STORAGE_KEYS.THEME, 'dark');
navigate(ROUTES.PORTFOLIO.PROJECTS);
setTimeout(() => {}, ANIMATION_TIMING.SECTION_TRANSITION);
```

**Why It's Bad:**

- ❌ No autocomplete
- ❌ Typos not caught at compile time
- ❌ Hard to find all usages
- ❌ Difficult to refactor

---

### Anti-Pattern 2: Inline Enumerations

**Problem:** Recreating constant arrays/objects locally.

```typescript
// ❌ BAD - Duplicate enumeration
const phases = ['exosphere', 'thermosphere', 'mesosphere', 'stratosphere', 'troposphere'];

function getPhaseIndex(phase: string): number {
  return phases.indexOf(phase);
}

// ✅ GOOD - Use constant
import { ATMOSPHERIC_PHASES } from '@aazucena/constants';

function getPhaseIndex(phase: (typeof ATMOSPHERIC_PHASES)[number]): number {
  return ATMOSPHERIC_PHASES.indexOf(phase);
}
```

---

### Anti-Pattern 3: String Concatenation for Keys

**Problem:** Building storage keys with string concatenation.

```typescript
// ❌ BAD - Manual key construction
const themeKey = `aazucena-${usernamespace}-theme`; // Inconsistent prefix

// ✅ GOOD - Use predefined keys
import { STORAGE_KEYS } from '@aazucena/constants';

const themeKey = STORAGE_KEYS.THEME; // "aazucena-theme"
```

---

### Anti-Pattern 4: Reimplementing Logic

**Problem:** Recalculating derived values instead of using constants.

```typescript
// ❌ BAD - Recalculate every time
function calculateTokenCost(model: string, tokens: number): number {
  let pricePerMillion: number;

  if (model === 'openai/gpt-4o') {
    pricePerMillion = 5.0;
  } else if (model === 'anthropic/claude-3-5-sonnet') {
    pricePerMillion = 3.0;
  }
  // ... more conditions

  return (tokens / 1_000_000) * pricePerMillion;
}

// ✅ GOOD - Use pricing constant
import { AI_PRICING } from '@aazucena/constants';

function calculateTokenCost(model: string, tokens: number): number {
  const pricing = AI_PRICING[model] || AI_PRICING.default;
  return (tokens / 1_000_000) * pricing.in; // Input tokens
}
```

---

### Anti-Pattern 5: Modifying Constants

**Problem:** Attempting to mutate constant values.

```typescript
import { PARTICLE_COUNTS } from '@aazucena/constants';

// ❌ BAD - Trying to modify (will error with strict TypeScript)
PARTICLE_COUNTS.HIGH = 300; // Error!

// ✅ GOOD - Create new object with overrides
const customCounts = {
  ...PARTICLE_COUNTS,
  HIGH: 300,
  ULTRA_HIGH: 500,
};
```

---

## 🔧 ADVANCED_TECHNIQUES

### Technique 1: Constant-Driven Factories

**Pattern:** Use constants to generate complex objects.

```typescript
import { AI_MODELS, AI_PRICING } from '@aazucena/constants';

interface ModelMetadata {
  provider: string;
  model: string;
  inputCost: number;
  outputCost: number;
  efficiency: number;
}

function createModelMetadata(modelKey: string): ModelMetadata {
  const pricing = AI_PRICING[modelKey];
  const [provider, model] = modelKey.split('/');

  return {
    provider,
    model,
    inputCost: pricing.in,
    outputCost: pricing.out,
    efficiency: 2_000_000 / (pricing.in + pricing.out), // Tokens per $1
  };
}

// Generate metadata for all models
const allModels = Object.keys(AI_MODELS).map((key) =>
  createModelMetadata(AI_MODELS[key as keyof typeof AI_MODELS]),
);
```

---

### Technique 2: Type Guards with Constants

**Pattern:** Create type-safe guards using constant values.

```typescript
import { ROUTES } from '@aazucena/constants';

type PortfolioRoute = (typeof ROUTES.PORTFOLIO)[keyof typeof ROUTES.PORTFOLIO];
type AnalyticsRoute = (typeof ROUTES.ANALYTICS)[keyof typeof ROUTES.ANALYTICS];
type ExternalRoute = (typeof ROUTES.EXTERNAL)[keyof typeof ROUTES.EXTERNAL];

function isPortfolioRoute(path: string): path is PortfolioRoute {
  return Object.values(ROUTES.PORTFOLIO).includes(path as any);
}

function isAnalyticsRoute(path: string): path is AnalyticsRoute {
  return Object.values(ROUTES.ANALYTICS).includes(path as any);
}

function isExternalRoute(url: string): url is ExternalRoute {
  return Object.values(ROUTES.EXTERNAL).includes(url as any);
}

// Usage with type narrowing
function handleNavigation(path: string) {
  if (isPortfolioRoute(path)) {
    // TypeScript knows path is PortfolioRoute
    console.log('Navigating to portfolio:', path);
  } else if (isAnalyticsRoute(path)) {
    // TypeScript knows path is AnalyticsRoute
    console.log('Navigating to analytics:', path);
  }
}
```

---

### Technique 3: Constant-Based Reducers

**Pattern:** Use constants to drive Redux/state reducers.

```typescript
import { STORAGE_KEYS } from '@aazucena/constants';

type StorageAction =
  | { type: 'SET_THEME'; theme: 'light' | 'dark' | 'auto' }
  | { type: 'SET_SESSION_ID'; sessionId: string }
  | { type: 'CLEAR_ALL' };

interface StorageState {
  theme: string | null;
  sessionId: string | null;
}

function storageReducer(state: StorageState, action: StorageAction): StorageState {
  switch (action.type) {
    case 'SET_THEME':
      localStorage.setItem(STORAGE_KEYS.THEME, action.theme);
      return { ...state, theme: action.theme };

    case 'SET_SESSION_ID':
      localStorage.setItem(STORAGE_KEYS.SESSION_ID, action.sessionId);
      return { ...state, sessionId: action.sessionId };

    case 'CLEAR_ALL':
      Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
      return { theme: null, sessionId: null };

    default:
      return state;
  }
}
```

---

### Technique 4: Constant-Powered Middleware

**Pattern:** Use constants in API middleware.

```typescript
import { SENTINEL_THRESHOLDS } from '@aazucena/constants';

interface RequestMetrics {
  latency: number;
  errorRate: number;
  cost: number;
}

function createHealthCheckMiddleware() {
  return async (req: Request, res: Response, next: NextFunction) => {
    const metrics = await getMetrics();

    // Check AI cost
    if (metrics.cost > SENTINEL_THRESHOLDS.AI_COST_DAILY.CRITICAL) {
      return res.status(503).json({
        error: 'Service temporarily unavailable',
        reason: 'AI_COST_CRITICAL',
        threshold: SENTINEL_THRESHOLDS.AI_COST_DAILY.CRITICAL,
      });
    }

    // Check latency
    if (metrics.latency > SENTINEL_THRESHOLDS.AI_LATENCY_AVG.WARNING) {
      res.setHeader('X-Service-Health', 'DEGRADED');
    }

    next();
  };
}
```

---

## ✅ TESTING_CONSTANTS

### Test Pattern 1: Constant Value Tests

```typescript
import { ROUTES, STORAGE_KEYS, AI_MODELS } from '@aazucena/constants';

describe('Constants Integrity', () => {
  test('ROUTES should have unique values', () => {
    const allRoutes = [...Object.values(ROUTES.PORTFOLIO), ...Object.values(ROUTES.ANALYTICS)];
    const uniqueRoutes = new Set(allRoutes);

    expect(allRoutes.length).toBe(uniqueRoutes.size);
  });

  test('STORAGE_KEYS should be prefixed with "aazucena-"', () => {
    Object.values(STORAGE_KEYS).forEach((key) => {
      expect(key).toMatch(/^aazucena-/);
    });
  });

  test('AI_MODELS should follow provider/model format', () => {
    Object.values(AI_MODELS).forEach((model) => {
      if (model !== AI_MODELS.BRAIN) {
        expect(model).toMatch(/^\w+\/[\w-]+$/);
      }
    });
  });
});
```

---

### Test Pattern 2: Type Safety Tests

```typescript
import { ATMOSPHERIC_PHASES } from '@aazucena/constants';

describe('Type Safety', () => {
  test('ATMOSPHERIC_PHASES should be readonly', () => {
    expect(() => {
      // @ts-expect-error - Should not be able to modify
      ATMOSPHERIC_PHASES.push('invalid');
    }).toThrow();
  });

  test('Phase type should be literal union', () => {
    type Phase = (typeof ATMOSPHERIC_PHASES)[number];

    const validPhase: Phase = 'exosphere';
    expect(ATMOSPHERIC_PHASES).toContain(validPhase);

    // @ts-expect-error - Invalid phase should fail TypeScript
    const invalidPhase: Phase = 'invalid';
  });
});
```

---

### Test Pattern 3: Integration Tests

```typescript
import { AI_MODELS, AI_PRICING } from '@aazucena/constants';

describe('AI Cost Calculator Integration', () => {
  function calculateCost(model: string, inputTokens: number, outputTokens: number): number {
    const pricing = AI_PRICING[model] || AI_PRICING.default;
    return (inputTokens / 1_000_000) * pricing.in + (outputTokens / 1_000_000) * pricing.out;
  }

  test('should calculate Claude 3.5 Sonnet cost correctly', () => {
    const cost = calculateCost(AI_MODELS.CLAUDE_3_SONNET, 500_000, 250_000);
    expect(cost).toBeCloseTo(5.25, 2); // (0.5M * $3) + (0.25M * $15) = $5.25
  });

  test('should handle unknown model with default pricing', () => {
    const cost = calculateCost('unknown/model', 1_000_000, 1_000_000);
    expect(cost).toBe(0); // default pricing is { in: 0, out: 0 }
  });
});
```

---

## 📚 BEST_PRACTICES_CHECKLIST

### For Consumers

- ✅ **Always use named imports** (not namespace imports)
- ✅ **Leverage TypeScript's type inference** (let types flow from constants)
- ✅ **Use `keyof typeof` for dynamic lookups**
- ✅ **Create type guards for validation**
- ✅ **Never modify constants** (create derived values instead)
- ✅ **Prefer constants over magic strings/numbers**
- ✅ **Document why you're using each constant** (if not obvious)

### For Maintainers

- ✅ **Add new constants to appropriate module** (not monolithic file)
- ✅ **Use `as const` for literal type inference**
- ✅ **Document constants with JSDoc comments**
- ✅ **Provide usage examples in comments**
- ✅ **Mark deprecated constants with `@deprecated`**
- ✅ **Maintain backward compatibility** (don't remove, deprecate first)
- ✅ **Update type definitions** when adding new constants

---

## 🔗 RELATED_DOCUMENTATION

- [Main README](../README.md) - Package overview and API reference
- [Constants Catalog](./constants-catalog.md) - Complete module reference

---

**DOCUMENTATION_METADATA:**

- **Version:** 1.0.0
- **Last Updated:** 2026-02-11
- **Author:** AAZUCENA Development Team
- **Status:** ✅ Complete
- **Phase:** Phase 4 - Developer Experience
- **Lines:** ~1,100

**INTELLIGENCE_THEME** • **PATTERN_MASTERY** 🎯
