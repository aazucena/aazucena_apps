# 🔢 @aazucena/constants

**MONOREPO_PACKAGE** • **INTELLIGENCE_THEME** • **Phase_4_Developer_Experience**

Centralized repository of application-wide constants, configuration values, and reference data across the AAZUCENA portfolio monorepo. **Single source of truth** for static values.

---

## 📋 TABLE_OF_CONTENTS

- [🎯 OVERVIEW](#-overview)
- [⚡ QUICK_START](#-quick_start)
- [📦 INSTALLATION](#-installation)
- [🏗️ ARCHITECTURE](#️-architecture)
- [📚 MODULE_REFERENCE](#-module_reference)
- [🔧 API_PATTERNS](#-api_patterns)
- [🎯 USAGE_EXAMPLES](#-usage_examples)
- [📝 BEST_PRACTICES](#-best_practices)
- [📚 RELATED_DOCUMENTATION](#-related_documentation)

---

## 🎯 OVERVIEW

### Purpose

The **@aazucena/constants** package provides **type-safe, immutable constants** for all applications in the monorepo:

- ✅ **12 Domain Modules** (animations, routes, storage, AI, colors, domain, finance, meta, preloader, sentinel, commands, site)
- ✅ **Zero Runtime Overhead** (pure data exports, no side effects)
- ✅ **Type-Safe** (TypeScript const assertions with literal types)
- ✅ **Tree-Shakeable** (ES modules, only import what you use)
- ✅ **Immutable** (all exports are readonly, deeply frozen)
- ✅ **Single Source of Truth** (no duplicate values across codebase)

### Key Features

| Feature                 | Description                                                | Status    |
| ----------------------- | ---------------------------------------------------------- | --------- |
| **Animation Constants** | Particle systems, scene config, atmospheric phases, timing | ✅ Active |
| **Route Management**    | Portfolio routes, analytics routes, external links         | ✅ Active |
| **Storage Keys**        | LocalStorage, SessionStorage, Cookie identifiers           | ✅ Active |
| **AI/ML Config**        | Model registry, pricing (per 1M tokens), neural map        | ✅ Active |
| **Color Palettes**      | Atmospheric gradients (HSL/Hex), phase-specific colors     | ✅ Active |
| **Domain URLs**         | API endpoints, CMS routes, service URLs                    | ✅ Active |
| **Finance Data**        | Currency codes, payment providers, pricing tiers           | ✅ Active |
| **Meta Defaults**       | SEO values, Open Graph templates, JSON-LD schemas          | ✅ Active |
| **Preloader Config**    | Loading states, progress thresholds, animation sequences   | ✅ Active |
| **Sentinel Thresholds** | Health monitoring (AI cost, latency, Core Web Vitals)      | ✅ Active |
| **Command Definitions** | CLI commands, keyboard shortcuts, action constants         | ✅ Active |
| **Site Configuration**  | Site metadata, navigation structure, social links          | ✅ Active |

### Package Info

```json
{
  "name": "@aazucena/constants",
  "version": "0.1.0",
  "type": "module",
  "exports": {
    ".": {
      "import": "./src/index.ts"
    }
  },
  "devDependencies": {
    "@aazucena/types": "workspace:*"
  }
}
```

---

## ⚡ QUICK_START

### Basic Usage

```typescript
import { ROUTES, STORAGE_KEYS, ANIMATION_TIMING } from '@aazucena/constants';

// Use routes
const projectsUrl = ROUTES.PORTFOLIO.PROJECTS; // "/projects"

// Access storage keys
const themeKey = STORAGE_KEYS.THEME; // "aazucena-theme"
localStorage.setItem(themeKey, 'dark');

// Get animation timing
const transitionDuration = ANIMATION_TIMING.SECTION_TRANSITION; // 1000ms
```

### Advanced Usage

```typescript
import {
  DEFAULT_CHAT_MODEL,
  priceFor,
  SENTINEL_THRESHOLDS,
  ATMOSPHERIC_COLORS,
  PARTICLE_PRESETS,
} from '@aazucena/constants';

// Configure AI model
const model = DEFAULT_CHAT_MODEL; // "anthropic/claude-sonnet-5.5"
const pricing = priceFor(model); // { in: 2.0, out: 10.0 }
console.log(`Model: ${model} | Input: $${pricing.in}/1M | Output: $${pricing.out}/1M`);

// Check health thresholds
const aiCost = 4.2; // USD
if (aiCost > SENTINEL_THRESHOLDS.AI_COST_DAILY.WARNING) {
  console.warn(`⚠️ AI cost: $${aiCost} (threshold: $${SENTINEL_THRESHOLDS.AI_COST_DAILY.WARNING})`);
}

// Use atmospheric colors
const exosphereGradient = ATMOSPHERIC_COLORS.exosphere; // { from, via, to, light }
const cssGradient = `linear-gradient(to bottom, ${exosphereGradient.from}, ${exosphereGradient.via}, ${exosphereGradient.to})`;

// Configure particle system
const spaceParticles = PARTICLE_PRESETS.space; // { count: 150, size: 2, speed: 0.3, ... }
```

---

## 📦 INSTALLATION

### From Workspace (Monorepo)

```bash
# In your app's package.json
{
  "dependencies": {
    "@aazucena/constants": "workspace:*"
  }
}
```

```bash
pnpm install
```

### Standalone Installation (External)

```bash
pnpm add @aazucena/constants
# or
npm install @aazucena/constants
# or
yarn add @aazucena/constants
```

**Note:** Zero external dependencies (only dev dependency on @aazucena/types).

---

## 🏗️ ARCHITECTURE

### Directory Structure

```
packages/constants/
├── src/
│   ├── index.ts           # Barrel export (all modules)
│   ├── animations.ts      # Animation constants (362 lines)
│   ├── routes.ts          # Route definitions (38 lines)
│   ├── storage.ts         # Storage keys (13 lines)
│   ├── ai.ts              # AI/ML configuration (45 lines)
│   ├── colors.ts          # Color palettes (38 lines)
│   ├── domain.ts          # Domain/API endpoints
│   ├── commands.ts        # Command definitions
│   ├── finance.ts         # Financial constants
│   ├── meta.ts            # Metadata/SEO defaults
│   ├── preloader.ts       # Preloader configuration
│   ├── sentinel.ts        # Health monitoring (54 lines)
│   └── site.ts            # Site configuration
├── docs/
│   ├── constants-catalog.md  # Complete module reference
│   └── usage-patterns.md     # Best practices guide
├── package.json
└── tsconfig.json
```

### Data Flow

```
┌──────────────────────────────────────────┐
│      @aazucena/constants Package         │
└──────────────────────────────────────────┘
                    │
        ┌───────────┴────────────┐
        │                        │
┌───────▼────────┐    ┌──────────▼──────────┐
│  12 Modules    │    │  Type Definitions   │
│  (Pure Data)   │    │  (const assertions) │
└───────┬────────┘    └──────────┬──────────┘
        │                        │
        └───────────┬────────────┘
                    │
        ┌───────────▼───────────┐
        │   ES Module Exports   │
        │   (Tree-Shakeable)    │
        └───────────┬───────────┘
                    │
        ┌───────────▼───────────┐
        │   Consumer Apps       │
        │  (Portfolio, CMS,     │
        │   Analytics)          │
        └───────────────────────┘
```

### Design Principles

#### 1. Immutability

```typescript
// ✅ All exports use 'as const' for literal types
export const ROUTES = {
  PORTFOLIO: {
    HOME: '/',
    PROJECTS: '/projects',
  },
} as const;

// Result: TypeScript infers literal types
type HomeRoute = typeof ROUTES.PORTFOLIO.HOME; // Type: "/"
```

#### 2. Tree-Shaking

```typescript
// ✅ Named exports (not default exports)
export const ANIMATION_TIMING = { ... };
export const PARTICLE_COUNTS = { ... };

// Consumer imports only what's needed
import { ANIMATION_TIMING } from '@aazucena/constants'; // Only imports used module
```

#### 3. Zero Runtime

```typescript
// ✅ Pure data (no functions, no side effects)
export const STORAGE_KEYS = {
  THEME: 'aazucena-theme',
  SESSION_ID: 'aazucena-session-id',
} as const;

// ❌ Avoid runtime logic
// export const getStorageKey = (key: string) => `aazucena-${key}`; // Don't do this
```

---

## 📚 MODULE_REFERENCE

### 1. animations.ts (362 lines)

**Purpose:** Animation constants for GSAP, Three.js, PixiJS, and scroll effects.

**Key Exports:**

```typescript
// Particle System
export const PARTICLE_COUNTS = {
  HIGH: 200,
  MEDIUM: 100,
  LOW: 50,
} as const;

export const PARTICLE_PRESETS = {
  space: { count: 150, size: 2, speed: 0.3, colors: [...], twinkling: true },
  snow: { count: 200, size: 3, speed: 1.5, colors: [...], drift: true },
  rain: { count: 300, size: 1, speed: 8.0, colors: [...], streaks: true },
  floating: { count: 80, size: 4, speed: 0.5, colors: [...], sineWave: true },
} as const;

// Scene Configuration
export const SCENE_ELEMENT_COUNTS = {
  particles: 3000,
  mainShapes: 150,
  clouds: 12,
  houses: 8,
  trees: 15,
  bushes: 25,
  rocks: 20,
  flowers: 35,
} as const;

// Atmospheric Phases
export const ATMOSPHERIC_PHASES = [
  'exosphere',
  'thermosphere',
  'mesosphere',
  'stratosphere',
  'troposphere',
] as const;

// Animation Timing (milliseconds)
export const ANIMATION_TIMING = {
  FLIP_TEXT_INTERVAL: 3000,
  SCROLL_DEBOUNCE: 1000,
  MODAL_ANIMATION: 300,
  SECTION_TRANSITION: 1000,
} as const;

// HSL Color Ranges per Phase
export const HSL_RANGES = {
  exosphere: { hueMin: 200, hueMax: 300, saturationMin: 60, saturationMax: 80 },
  thermosphere: { hueMin: 120, hueMax: 340, saturationMin: 70, saturationMax: 90 },
  // ... more phases
} as const;
```

**Use Cases:**

- Configure particle systems (PixiJS)
- Set Three.js scene element counts
- Define scroll-triggered animation timing
- Generate atmospheric layer colors

---

### 2. routes.ts (38 lines)

**Purpose:** Application routing structure and navigation paths.

**Key Exports:**

```typescript
export const ROUTES = {
  PORTFOLIO: {
    HOME: '/',
    ABOUT: '/about',
    PROJECTS: '/projects',
    EXPERIENCES: '/experiences',
    BLOG: '/blog',
    JOURNEY: '/journey',
    CONTACT: '/contact',
    PRIVACY: '/privacy',
    TERMS: '/terms',
  },
  ANALYTICS: {
    DASHBOARD: '/',
    TRAFFIC: '/traffic',
    JOURNEYS: '/journey',
    LOGS: '/logs',
    PERFORMANCE: '/performance',
    AI_TERMINAL: '/ai',
    PROMPT_IDE: '/ai/prompts',
    TRAJECTORIES: '/ai/trajectories',
    MUSIC: '/music',
    COSTS: '/ai/costs',
    FINANCE: '/finance',
  },
  EXTERNAL: {
    GITHUB: 'https://github.com/aazucena',
    LINKEDIN: 'https://linkedin.com/in/aazucena',
    TWITTER: 'https://x.com/azucena',
    CALCOM: 'https://cal.com/aazucena',
  },
} as const;
```

**Use Cases:**

- Define navigation menu items
- Build link components
- Configure API endpoints
- External link references

---

### 3. storage.ts (13 lines)

**Purpose:** LocalStorage, SessionStorage, and Cookie key identifiers.

**Key Exports:**

```typescript
export const STORAGE_KEYS = {
  THEME: 'aazucena-theme',
  SESSION_ID: 'aazucena-session-id',
  AUTH_TOKEN: 'aazucena-auth-token',
  USER_PREFERENCES: 'aazucena-prefs',
  COOKIE_CONSENT: 'aazucena-cookie-consent',
  TERMINAL_HISTORY: 'aazucena-terminal-history',
} as const;
```

**Use Cases:**

- Persist user theme preference
- Store authentication tokens
- Save terminal command history
- Manage cookie consent state

**Example:**

```typescript
import { STORAGE_KEYS } from '@aazucena/constants';

// Save theme
localStorage.setItem(STORAGE_KEYS.THEME, 'dark');

// Retrieve theme
const theme = localStorage.getItem(STORAGE_KEYS.THEME);

// Clear terminal history
localStorage.removeItem(STORAGE_KEYS.TERMINAL_HISTORY);
```

---

### 4. ai.ts and ai-models.ts

**Purpose:** the Claude model catalogue (the chat models the apps offer), the price table every AI
cost is computed from, and neural map configuration. Prices are USD per 1,000,000 tokens, checked
against the Vercel AI Gateway model list (`https://ai-gateway.vercel.sh/v1/models`).

**Chat models (`CLAUDE_MODELS`):**

| ID                            | Name              | Role    | Input | Output |
| ----------------------------- | ----------------- | ------- | ----- | ------ |
| `anthropic/claude-opus-5.5`   | Claude Opus 5.5   | deep    | 4.00  | 20.00  |
| `anthropic/claude-sonnet-5.5` | Claude Sonnet 5.5 | default | 2.00  | 10.00  |
| `anthropic/claude-haiku-5.5`  | Claude Haiku 5.5  | fast    | 0.10  | 0.50   |

**Key Exports:**

- `CLAUDE_MODELS`, `ChatModelId`, `ModelRole`, `ModelPrice`
- `DEFAULT_CHAT_MODEL` (`anthropic/claude-sonnet-5.5`)
- `SAVINGS_BASELINE_MODEL` (`anthropic/claude-opus-5.5`): savings are measured against the deep tier
- `MODEL_PRICES`: the catalogue plus retired models (Claude 4.x and 3.x, OpenAI, Google, Voyage
  embeddings), so history still gets a cost. Retired models are priced, never offered.
- `isChatModel(id)`, `priceFor(model)` (case-insensitive; unknown ids cost 0), `isPriced(model)`
- `NEURAL_MAP_FALLBACK_NODES`

Cost maths lives in `@aazucena/utils`: `calculateAiCost(model, inputTokens, outputTokens)` and
`calculateAiSavings(...)`. The analytics chat route accepts only catalogue ids (`resolveChatModel`
in `@aazucena/utils`).

**Adding a model:** add it to `CLAUDE_MODELS` in `src/ai-models.ts` with its gateway id and the
price from the gateway list. The catalogue test (`packages/utils/src/__tests__/ai-models.test.ts`)
checks that every catalogue model is priced. `services/intel-engine` (Python) sets its own model
(`claude-haiku-4-5-20251001`) outside this catalogue.

**Example:**

```typescript
import { CLAUDE_MODELS, DEFAULT_CHAT_MODEL } from '@aazucena/constants';
import { calculateAiCost } from '@aazucena/utils';

const cost = calculateAiCost(DEFAULT_CHAT_MODEL, 500_000, 250_000);
console.log(`Cost: $${cost.toFixed(4)}`); // Cost: $3.5000
const options = CLAUDE_MODELS.map((m) => `${m.name} · ${m.role}`);
```

---

### 5. colors.ts (38 lines)

**Purpose:** Atmospheric gradient colors (HSL/Hex) for portfolio animations.

**Key Exports:**

```typescript
export const ATMOSPHERIC_COLORS = {
  exosphere: {
    from: '#000000',
    via: '#0a0a1a',
    to: '#1a1a2e',
    light: '#ffffff',
  },
  thermosphere: {
    from: '#1a1a2e',
    via: '#2d1b4e',
    to: '#1e3a8a',
    light: '#9D4EDD',
  },
  mesosphere: {
    from: '#1e3a8a',
    via: '#1e40af',
    to: '#1d4ed8',
    light: '#3A86FF',
  },
  stratosphere: {
    from: '#1d4ed8',
    via: '#2563eb',
    to: '#3b82f6',
    light: '#87CEEB',
  },
  troposphere: {
    from: '#38bdf8',
    via: '#7dd3fc',
    to: '#bae6fd',
    light: '#FFA07A',
  },
} as const;
```

**Use Cases:**

- Generate CSS gradients for atmospheric layers
- Configure Three.js background colors
- Set light colors for each phase
- Theme transitions based on scroll position

**Example:**

```typescript
import { ATMOSPHERIC_COLORS } from '@aazucena/constants';

function getLayerGradient(phase: keyof typeof ATMOSPHERIC_COLORS): string {
  const colors = ATMOSPHERIC_COLORS[phase];
  return `linear-gradient(to bottom, ${colors.from}, ${colors.via}, ${colors.to})`;
}

const exosphereCSS = getLayerGradient('exosphere');
// Result: "linear-gradient(to bottom, #000000, #0a0a1a, #1a1a2e)"
```

---

### 6. sentinel.ts (54 lines)

**Purpose:** Health monitoring thresholds for AZUCENA_LYTICS dashboard.

**Key Exports:**

```typescript
export const SENTINEL_THRESHOLDS = {
  // AI INFRASTRUCTURE
  AI_COST_DAILY: {
    WARNING: 2.5, // USD
    CRITICAL: 5.0, // USD
    LABEL: 'AI_COST_EXPOSURE',
  },
  AI_LATENCY_AVG: {
    WARNING: 2000, // ms
    CRITICAL: 5000, // ms
    LABEL: 'AI_RESPONSE_LATENCY',
  },

  // PERFORMANCE (Core Web Vitals)
  LCP_P75: {
    WARNING: 1500, // ms
    CRITICAL: 2500, // ms
    LABEL: 'EXPERIENCE_LATENCY_LCP',
  },
  CLS_AVG: {
    WARNING: 0.1,
    CRITICAL: 0.25,
    LABEL: 'VISUAL_STABILITY_CLS',
  },

  // SYSTEM INTEGRITY
  ERROR_RATE_HOURLY: {
    WARNING: 5,
    CRITICAL: 20,
    LABEL: 'EXCEPTION_VELOCITY',
  },
  FATAL_INCIDENTS_24H: {
    WARNING: 1,
    CRITICAL: 3,
    LABEL: 'FATAL_CORE_INTERRUPT',
  },
};

export type SentinelAlertLevel = 'NOMINAL' | 'WARNING' | 'CRITICAL';

export interface SentinelAlert {
  id: string;
  metric: string;
  value: number | string;
  threshold: number;
  level: SentinelAlertLevel;
  timestamp: string;
}
```

**Use Cases:**

- Monitor AI spending (daily budget alerts)
- Track Core Web Vitals (LCP, CLS)
- Detect system degradation (latency, errors)
- Trigger automated alerts

**Example:**

```typescript
import { SENTINEL_THRESHOLDS, type SentinelAlertLevel } from '@aazucena/constants';

function checkAICost(dailyCost: number): SentinelAlertLevel {
  if (dailyCost >= SENTINEL_THRESHOLDS.AI_COST_DAILY.CRITICAL) return 'CRITICAL';
  if (dailyCost >= SENTINEL_THRESHOLDS.AI_COST_DAILY.WARNING) return 'WARNING';
  return 'NOMINAL';
}

const status = checkAICost(3.2); // 'WARNING'
console.log(`Alert: ${status} ($3.20 > $${SENTINEL_THRESHOLDS.AI_COST_DAILY.WARNING} threshold)`);
```

---

## 🔧 API_PATTERNS

### Pattern 1: Constant Lookup

```typescript
import { ROUTES, DEFAULT_CHAT_MODEL, STORAGE_KEYS } from '@aazucena/constants';

// Direct property access
const homeUrl = ROUTES.PORTFOLIO.HOME; // "/"
const model = DEFAULT_CHAT_MODEL; // "anthropic/claude-sonnet-5.5"
const themeKey = STORAGE_KEYS.THEME; // "aazucena-theme"
```

**Pros:**

- ✅ Type-safe (autocomplete works)
- ✅ No runtime lookup cost
- ✅ Tree-shakeable

---

### Pattern 2: Dynamic Lookup with Type Safety

```typescript
import { ATMOSPHERIC_COLORS, PARTICLE_PRESETS } from '@aazucena/constants';

type AtmosphericPhase = keyof typeof ATMOSPHERIC_COLORS;
type ParticlePreset = keyof typeof PARTICLE_PRESETS;

function getPhaseColors(phase: AtmosphericPhase) {
  return ATMOSPHERIC_COLORS[phase];
}

function getParticleConfig(preset: ParticlePreset) {
  return PARTICLE_PRESETS[preset];
}

// Usage
const colors = getPhaseColors('exosphere'); // ✅ Type-safe
const particles = getParticleConfig('snow'); // ✅ Type-safe

// getPhaseColors('invalid'); // ❌ TypeScript error
```

---

### Pattern 3: Threshold Checks

```typescript
import { SENTINEL_THRESHOLDS } from '@aazucena/constants';

function evaluateMetric(
  metric: keyof typeof SENTINEL_THRESHOLDS,
  value: number,
): 'NOMINAL' | 'WARNING' | 'CRITICAL' {
  const thresholds = SENTINEL_THRESHOLDS[metric];

  if (value >= thresholds.CRITICAL) return 'CRITICAL';
  if (value >= thresholds.WARNING) return 'WARNING';
  return 'NOMINAL';
}

// Usage
const aiCostStatus = evaluateMetric('AI_COST_DAILY', 3.5); // 'WARNING'
const lcpStatus = evaluateMetric('LCP_P75', 1200); // 'NOMINAL'
```

---

## 🎯 USAGE_EXAMPLES

### Example 1: Navigation Menu

```typescript
import { ROUTES } from '@aazucena/constants';

const portfolioNav = [
  { label: 'Home', path: ROUTES.PORTFOLIO.HOME },
  { label: 'About', path: ROUTES.PORTFOLIO.ABOUT },
  { label: 'Projects', path: ROUTES.PORTFOLIO.PROJECTS },
  { label: 'Blog', path: ROUTES.PORTFOLIO.BLOG },
  { label: 'Contact', path: ROUTES.PORTFOLIO.CONTACT },
];

function Navigation() {
  return (
    <nav>
      {portfolioNav.map(({ label, path }) => (
        <a key={path} href={path}>{label}</a>
      ))}
    </nav>
  );
}
```

---

### Example 2: AI Cost Calculator

```typescript
import { calculateAiCost, calculateAiSavings } from '@aazucena/utils';

interface UsageRecord {
  model: string;
  inputTokens: number;
  outputTokens: number;
}

const usage: UsageRecord[] = [
  { model: 'anthropic/claude-haiku-5.5', inputTokens: 500_000, outputTokens: 200_000 },
  { model: 'anthropic/claude-sonnet-5.5', inputTokens: 1_000_000, outputTokens: 500_000 },
];

const total = usage.reduce(
  (sum, r) => sum + calculateAiCost(r.model, r.inputTokens, r.outputTokens),
  0,
);
// Savings are measured against SAVINGS_BASELINE_MODEL (Claude Opus 5.5) and never go below 0
const savings = usage.reduce(
  (sum, r) => sum + calculateAiSavings(r.model, r.inputTokens, r.outputTokens),
  0,
);

console.log(`Total cost: $${total.toFixed(4)}`);
console.log(`Savings vs Opus 5.5: $${savings.toFixed(4)}`);
```

---

### Example 3: Theme Persistence

```typescript
import { STORAGE_KEYS } from '@aazucena/constants';

type Theme = 'light' | 'dark' | 'auto';

class ThemeManager {
  private static KEY = STORAGE_KEYS.THEME;

  static get(): Theme {
    const saved = localStorage.getItem(ThemeManager.KEY);
    return (saved as Theme) || 'auto';
  }

  static set(theme: Theme): void {
    localStorage.setItem(ThemeManager.KEY, theme);
    document.documentElement.setAttribute('data-theme', theme);
  }

  static clear(): void {
    localStorage.removeItem(ThemeManager.KEY);
  }
}

// Usage
ThemeManager.set('dark');
const currentTheme = ThemeManager.get(); // 'dark'
```

---

### Example 4: Particle System Configuration

```typescript
import { PARTICLE_PRESETS, type ParticleConfig } from '@aazucena/constants';

function initializeParticleSystem(preset: keyof typeof PARTICLE_PRESETS) {
  const config = PARTICLE_PRESETS[preset];

  // PixiJS particle initialization
  const particles = new PIXI.ParticleContainer(config.count, {
    scale: true,
    position: true,
    rotation: false,
    alpha: true,
  });

  for (let i = 0; i < config.count; i++) {
    const particle = new PIXI.Sprite(texture);
    particle.scale.set(config.size);
    particle.alpha = config.opacity;
    particles.addChild(particle);
  }

  return particles;
}

// Usage
const spaceParticles = initializeParticleSystem('space');
const snowParticles = initializeParticleSystem('snow');
```

---

## 📝 BEST_PRACTICES

### 1. Always Import Named Exports

```typescript
// ✅ GOOD - Named imports (tree-shakeable)
import { ROUTES, STORAGE_KEYS, CLAUDE_MODELS } from '@aazucena/constants';

// ❌ BAD - Namespace import (includes entire module)
import * as Constants from '@aazucena/constants';
```

---

### 2. Use Type Inference

```typescript
// ✅ GOOD - Let TypeScript infer literal types
const route = ROUTES.PORTFOLIO.HOME; // Type: "/"

// ❌ BAD - Explicit type annotation loses literal type
const route: string = ROUTES.PORTFOLIO.HOME; // Type: string (too broad)
```

---

### 3. Leverage keyof for Type-Safe Lookups

```typescript
import { ATMOSPHERIC_COLORS } from '@aazucena/constants';

// ✅ GOOD - Type-safe phase parameter
function getColors(phase: keyof typeof ATMOSPHERIC_COLORS) {
  return ATMOSPHERIC_COLORS[phase];
}

// ❌ BAD - String parameter (no type safety)
function getColors(phase: string) {
  return ATMOSPHERIC_COLORS[phase]; // TypeScript error
}
```

---

### 4. Don't Modify Constants

```typescript
import { ROUTES } from '@aazucena/constants';

// ❌ BAD - Attempting to modify (will error with strict mode)
ROUTES.PORTFOLIO.HOME = '/new-home'; // Error: Cannot assign to read-only property

// ✅ GOOD - Create derived values instead
const customRoutes = {
  ...ROUTES.PORTFOLIO,
  CUSTOM: '/custom',
};
```

---

### 5. Use Constants for All Static Values

```typescript
// ❌ BAD - Magic strings/numbers scattered in code
if (localStorage.getItem('aazucena-theme') === 'dark') { ... }
if (cost > 2.5) { alert('Warning!'); }

// ✅ GOOD - Use constants
import { STORAGE_KEYS, SENTINEL_THRESHOLDS } from '@aazucena/constants';

if (localStorage.getItem(STORAGE_KEYS.THEME) === 'dark') { ... }
if (cost > SENTINEL_THRESHOLDS.AI_COST_DAILY.WARNING) { alert('Warning!'); }
```

**Benefits:**

- ✅ Single source of truth (update once, applies everywhere)
- ✅ Type-safe (autocomplete, refactoring support)
- ✅ Searchable (find all usages)
- ✅ Documented (constants have clear names)

---

## 📚 RELATED_DOCUMENTATION

### Package Documentation

- [📖 Constants Catalog](./docs/constants-catalog.md) - Complete module reference
- [🎯 Usage Patterns](./docs/usage-patterns.md) - Best practices guide

### Related Packages

- [@aazucena/types](../types/README.md) - TypeScript type definitions
- [@aazucena/config](../config/README.md) - Build configurations
- [@aazucena/design-system](../design-system/README.md) - Design tokens

---

## 🔗 REFERENCES

### Dependencies

- **None** - Zero runtime dependencies
- **@aazucena/types** workspace:\* - Dev dependency only (type checking)

### Used By

- **apps/portfolio** - Main portfolio application
- **apps/analytics** - AZUCENA_LYTICS dashboard
- **apps/cms** - Strapi CMS configuration
- **packages/ui** - Component library
- **packages/hooks** - React hooks library
- **packages/animations** - Animation utilities

### Version History

- **0.1.0** (2026-02-11) - Initial release with 12 domain modules

---

## 📝 NOTES

### Performance Considerations

1. **Bundle Size:**
   - Total size: ~15KB uncompressed
   - After tree-shaking: ~1-3KB (depends on usage)
   - Zero runtime overhead (pure data)

2. **Tree-Shaking Tips:**
   - Only import what you use
   - Avoid `import *` namespace imports
   - Use named imports for best results

3. **Type Safety:**
   - All exports use `as const` for literal types
   - TypeScript infers exact values, not broad types
   - Autocomplete works perfectly with modern editors

### Browser Support

- ✅ All modern browsers (ES modules required)
- ✅ Node.js 18+
- ✅ Edge runtimes (Vercel, Cloudflare Workers)

### Maintenance

- ✅ **Add new constants:** Create new file in `src/`, export from `index.ts`
- ✅ **Update values:** Edit source file, all consumers update automatically
- ✅ **Deprecate constants:** Mark with JSDoc `@deprecated`, provide migration path

---

**DOCUMENTATION_METADATA:**

- **Version:** 1.0.0
- **Last Updated:** 2026-02-11
- **Author:** AAZUCENA Development Team
- **Status:** ✅ Complete
- **Phase:** Phase 4 - Developer Experience
- **Lines:** ~1,200

**INTELLIGENCE_THEME** • **SINGLE_SOURCE_OF_TRUTH** 🔢
