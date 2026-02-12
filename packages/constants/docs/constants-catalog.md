# 📖 CONSTANTS_CATALOG

**REFERENCE_DOCUMENTATION** • **INTELLIGENCE_THEME** • **Phase_4_Developer_Experience**

Complete reference for all **12 constant modules** in the @aazucena/constants package. Each module provides domain-specific static values with **type-safe, immutable** exports.

---

## 📋 TABLE_OF_CONTENTS

- [🎬 ANIMATIONS](#-animations)
- [🗺️ ROUTES](#️-routes)
- [💾 STORAGE](#-storage)
- [🤖 AI](#-ai)
- [🎨 COLORS](#-colors)
- [🌐 DOMAIN](#-domain)
- [💰 FINANCE](#-finance)
- [📄 META](#-meta)
- [⏳ PRELOADER](#-preloader)
- [🔒 SENTINEL](#-sentinel)
- [⌨️ COMMANDS](#️-commands)
- [🏠 SITE](#-site)

---

## 🎬 ANIMATIONS

**File:** `animations.ts` (362 lines)
**Purpose:** Animation constants for GSAP, Three.js, PixiJS, scroll effects

### Particle System

#### PARTICLE_COUNTS
```typescript
export const PARTICLE_COUNTS = {
  HIGH: 200,
  MEDIUM: 100,
  LOW: 50,
} as const;
```

**Use Case:** Configure particle density based on device performance tier.

---

#### PARTICLE_DEFAULTS
```typescript
export const PARTICLE_DEFAULTS = {
  SIZE: 2,
  SPEED: 1,
  OPACITY: 0.6,
} as const;
```

**Use Case:** Fallback values for custom particle systems.

---

#### PARTICLE_PRESETS
```typescript
export const PARTICLE_PRESETS = {
  space: {
    count: 150,
    size: 2,
    speed: 0.3,
    opacity: 0.8,
    colors: [0xffffff, 0xe0f0ff, 0x88ffff, 0xfffacd, 0xddeeff],
    twinkling: true,
    twinkleSpeed: { min: 0.5, max: 2.0 },
  },
  snow: {
    count: 200,
    size: 3,
    speed: 1.5,
    opacity: 0.9,
    colors: [0xffffff, 0xf0f8ff, 0xe6f2ff],
    twinkling: false,
    drift: true,
    driftSpeed: 0.5,
  },
  rain: {
    count: 300,
    size: 1,
    speed: 8.0,
    opacity: 0.6,
    colors: [0x88ccff, 0x99ddff, 0xaaeeff],
    twinkling: false,
    streaks: true,
    streakLength: 8,
  },
  floating: {
    count: 80,
    size: 4,
    speed: 0.5,
    opacity: 0.4,
    colors: [0xffd700, 0xffa500, 0xff69b4, 0x00ffff, 0x9370db],
    twinkling: true,
    twinkleSpeed: { min: 1.0, max: 3.0 },
    sineWave: true,
    waveAmplitude: 2,
    waveFrequency: 0.5,
  },
} as const;
```

**Preset Types:**
- `space` - Star field with twinkling effect
- `snow` - Falling snow with drift
- `rain` - Fast rain with streaks
- `floating` - Colorful floating particles with wave motion

**Example:**
```typescript
import { PARTICLE_PRESETS } from '@aazucena/constants';

const config = PARTICLE_PRESETS.space;
console.log(`Creating ${config.count} particles at ${config.speed} speed`);
```

---

### Scene Configuration

#### SCENE_ELEMENT_COUNTS
```typescript
export const SCENE_ELEMENT_COUNTS = {
  particles: 3000,   // Background particles in exosphere
  mainShapes: 150,   // Main floating shapes
  clouds: 12,        // Clouds in stratosphere
  houses: 8,         // Houses on ground
  trees: 15,         // Trees on ground
  bushes: 25,        // Bushes on ground
  rocks: 20,         // Rocks on ground
  flowers: 35,       // Flowers on ground
} as const;
```

**Use Case:** Configure Three.js scene population.

---

#### SCENE_ANIMATION_SPEEDS
```typescript
export const SCENE_ANIMATION_SPEEDS = {
  groupRotation: 0.05,   // Base rotation speed (radians/sec)
  sunRotation: 0.05,     // Sun movement speed
  orbitDamping: 0.05,    // OrbitControls damping factor
} as const;
```

**Use Case:** Control animation velocities in Three.js scene.

---

### Animation Timing

#### ANIMATION_TIMING
```typescript
export const ANIMATION_TIMING = {
  FLIP_TEXT_INTERVAL: 3000,      // ms between text flips
  SCROLL_DEBOUNCE: 1000,         // ms scroll debounce
  MODAL_ANIMATION: 300,          // ms modal transition
  SECTION_TRANSITION: 1000,      // ms section transition
} as const;
```

**Example:**
```typescript
import { ANIMATION_TIMING } from '@aazucena/constants';

setTimeout(() => {
  flipText();
}, ANIMATION_TIMING.FLIP_TEXT_INTERVAL);
```

---

### Atmospheric Phases

#### ATMOSPHERIC_PHASES
```typescript
export const ATMOSPHERIC_PHASES = [
  'exosphere',
  'thermosphere',
  'mesosphere',
  'stratosphere',
  'troposphere',
] as const;
```

**Use Case:** Define scroll-triggered atmospheric layer transitions.

**Type Inference:**
```typescript
type Phase = typeof ATMOSPHERIC_PHASES[number];
// Type: "exosphere" | "thermosphere" | "mesosphere" | "stratosphere" | "troposphere"
```

---

### HSL Color Ranges

#### HSL_RANGES
```typescript
export const HSL_RANGES = {
  exosphere: {
    hueMin: 200,
    hueMax: 300,
    saturationMin: 60,
    saturationMax: 80,
    lightnessMin: 70,
    lightnessMax: 85,
  },
  thermosphere: {
    hueMin: 120,
    hueMax: 340,
    saturationMin: 70,
    saturationMax: 90,
    lightnessMin: 65,
    lightnessMax: 80,
  },
  // ... more phases
} as const;
```

**Use Case:** Generate random colors within phase-specific HSL ranges.

**Example:**
```typescript
import { HSL_RANGES } from '@aazucena/constants';

function getRandomColor(phase: keyof typeof HSL_RANGES): string {
  const range = HSL_RANGES[phase];
  const h = Math.random() * (range.hueMax - range.hueMin) + range.hueMin;
  const s = Math.random() * (range.saturationMax - range.saturationMin) + range.saturationMin;
  const l = Math.random() * (range.lightnessMax - range.lightnessMin) + range.lightnessMin;
  return `hsl(${h}, ${s}%, ${l}%)`;
}
```

---

### Background Colors

#### BACKGROUND_COLORS
```typescript
export const BACKGROUND_COLORS = {
  exosphere: '#0a0e27',
  thermosphere: '#1a1a2e',
  mesosphere: '#16213e',
  stratosphere: '#0f3460',
  troposphere: '#533483',
} as const;
```

**Use Case:** Set Three.js scene background color per phase.

---

### Scroll Navigation

#### Scroll Constants
```typescript
export const SCROLL_PROGRESS_MAX = 0.8;
export const SCROLL_PROGRESS_THRESHOLD = 0.7;
export const SCROLL_PROGRESS_RETURN = 0.7;
export const SCROLL_PROGRESS_MIN = 0.1;
export const TOTAL_SECTIONS = 8;
export const SCROLL_SENSITIVITY = 0.002;
export const SCROLL_DEBOUNCE_TIME = 1000; // ms
```

**Use Case:** Control scroll-triggered section navigation.

---

### Performance Features

#### ENABLE_LAYER_LAZY_LOADING
```typescript
export const ENABLE_LAYER_LAZY_LOADING = true;
```

**Use Case:** Feature flag for lazy loading atmospheric layers.

---

## 🗺️ ROUTES

**File:** `routes.ts` (38 lines)
**Purpose:** Application routing structure and navigation paths

### ROUTES

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

**Categories:**
- **PORTFOLIO** - Main portfolio application routes
- **ANALYTICS** - AZUCENA_LYTICS dashboard routes
- **EXTERNAL** - Third-party service URLs

**Example:**
```typescript
import { ROUTES } from '@aazucena/constants';

const navItems = [
  { label: 'Home', path: ROUTES.PORTFOLIO.HOME },
  { label: 'Projects', path: ROUTES.PORTFOLIO.PROJECTS },
  { label: 'Blog', path: ROUTES.PORTFOLIO.BLOG },
];

// External link
<a href={ROUTES.EXTERNAL.GITHUB} target="_blank">GitHub</a>
```

---

## 💾 STORAGE

**File:** `storage.ts` (13 lines)
**Purpose:** LocalStorage, SessionStorage, and Cookie key identifiers

### STORAGE_KEYS

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

**Keys:**
- `THEME` - User theme preference (light/dark/auto)
- `SESSION_ID` - Anonymous session identifier
- `AUTH_TOKEN` - JWT authentication token
- `USER_PREFERENCES` - JSON-serialized user preferences
- `COOKIE_CONSENT` - Cookie consent status
- `TERMINAL_HISTORY` - Command history for AI terminal

**Example:**
```typescript
import { STORAGE_KEYS } from '@aazucena/constants';

// Save theme
localStorage.setItem(STORAGE_KEYS.THEME, 'dark');

// Retrieve theme
const theme = localStorage.getItem(STORAGE_KEYS.THEME);

// Clear auth token
localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
```

**Best Practices:**
- ✅ Always use constants (not hardcoded strings)
- ✅ Prefix all keys with `aazucena-` to avoid collisions
- ✅ Validate/parse values after retrieval (localStorage returns strings)
- ✅ Handle null values (key might not exist)

---

## 🤖 AI

**File:** `ai.ts` (45 lines)
**Purpose:** AI/ML model registry, pricing (per 1M tokens), neural map configuration

### AI_MODELS

```typescript
export const AI_MODELS = {
  BRAIN: 'local/brain',
  GPT_4O: 'openai/gpt-4o',
  GPT_4O_MINI: 'openai/gpt-4o-mini',
  GPT_4_TURBO: 'openai/gpt-4-turbo',
  CLAUDE_3_SONNET: 'anthropic/claude-3-5-sonnet',
  CLAUDE_3_OPUS: 'anthropic/claude-3-opus',
  CLAUDE_3_HAIKU: 'anthropic/claude-3-haiku',
  GEMINI_PRO: 'google/gemini-1.5-pro',
  GEMINI_FLASH: 'google/gemini-1.5-flash',
} as const;
```

**Model Categories:**
- **Local:** BRAIN (on-device inference)
- **OpenAI:** GPT-4o, GPT-4o Mini, GPT-4 Turbo
- **Anthropic:** Claude 3.5 Sonnet, Claude 3 Opus, Claude 3 Haiku
- **Google:** Gemini 1.5 Pro, Gemini 1.5 Flash

---

### AI_PRICING

```typescript
export const AI_PRICING = {
  [AI_MODELS.GPT_4O]: { in: 5.0, out: 15.0 },
  [AI_MODELS.GPT_4O_MINI]: { in: 0.15, out: 0.6 },
  [AI_MODELS.GPT_4_TURBO]: { in: 10.0, out: 30.0 },
  [AI_MODELS.CLAUDE_3_SONNET]: { in: 3.0, out: 15.0 },
  [AI_MODELS.CLAUDE_3_OPUS]: { in: 15.0, out: 75.0 },
  [AI_MODELS.CLAUDE_3_HAIKU]: { in: 0.25, out: 1.25 },
  [AI_MODELS.GEMINI_PRO]: { in: 3.5, out: 10.5 },
  [AI_MODELS.GEMINI_FLASH]: { in: 0.075, out: 0.3 },
  default: { in: 0, out: 0 },
} as const;
```

**Pricing per 1,000,000 (1M) tokens in USD:**
- `in` - Input tokens cost
- `out` - Output tokens cost

**Cost Comparison:**
- **Most Expensive:** Claude 3 Opus ($15/$75 per 1M)
- **Mid-Tier:** GPT-4o ($5/$15), Claude 3.5 Sonnet ($3/$15), Gemini Pro ($3.5/$10.5)
- **Budget:** GPT-4o Mini ($0.15/$0.6), Claude 3 Haiku ($0.25/$1.25), Gemini Flash ($0.075/$0.3)

**Example:**
```typescript
import { AI_MODELS, AI_PRICING } from '@aazucena/constants';

function calculateCost(model: string, inputTokens: number, outputTokens: number): number {
  const pricing = AI_PRICING[model] || AI_PRICING.default;
  return (inputTokens / 1_000_000) * pricing.in + (outputTokens / 1_000_000) * pricing.out;
}

const cost = calculateCost(AI_MODELS.CLAUDE_3_SONNET, 500_000, 250_000);
console.log(`Cost: $${cost.toFixed(4)}`); // Cost: $5.2500
```

---

### SAVINGS_BASELINE_MODEL

```typescript
export const SAVINGS_BASELINE_MODEL = AI_MODELS.GPT_4O;
```

**Use Case:** Calculate savings by comparing actual usage against GPT-4o baseline.

---

### NEURAL_MAP_FALLBACK_NODES

```typescript
export const NEURAL_MAP_FALLBACK_NODES = [
  { id: 'analyze_intent', label: 'Intent_Analysis' },
  { id: 'expert_dispatcher', label: 'Expert_Dispatcher' },
  { id: 'retrieve_knowledge', label: 'Knowledge_RAG' },
  { id: 'generate_response', label: 'Cognitive_Gen' },
  { id: 'validate_response', label: 'Truth_Validator' },
] as const;
```

**Use Case:** Default cognitive flow nodes for Trajectory Labs neural map visualization.

---

## 🎨 COLORS

**File:** `colors.ts` (38 lines)
**Purpose:** Atmospheric gradient colors (HSL/Hex) for portfolio animations

### ATMOSPHERIC_COLORS

```typescript
export const ATMOSPHERIC_COLORS = {
  exosphere: {
    from: '#000000',  // Pure black
    via: '#0a0a1a',   // Very dark gray
    to: '#1a1a2e',    // Dark navy
    light: '#ffffff', // White light
  },
  thermosphere: {
    from: '#1a1a2e',  // Dark navy
    via: '#2d1b4e',   // Dark purple
    to: '#1e3a8a',    // Deep blue
    light: '#9D4EDD', // Purple light
  },
  mesosphere: {
    from: '#1e3a8a',  // Deep blue
    via: '#1e40af',   // Medium blue
    to: '#1d4ed8',    // Bright blue
    light: '#3A86FF', // Cyan light
  },
  stratosphere: {
    from: '#1d4ed8',  // Bright blue
    via: '#2563eb',   // Sky blue
    to: '#3b82f6',    // Light blue
    light: '#87CEEB', // Sky blue light
  },
  troposphere: {
    from: '#38bdf8',  // Cyan
    via: '#7dd3fc',   // Light cyan
    to: '#bae6fd',    // Pale cyan
    light: '#FFA07A', // Light salmon
  },
} as const;
```

**Color Structure:**
- `from` - Gradient start color
- `via` - Gradient middle color
- `to` - Gradient end color
- `light` - Directional light color for the phase

**Example:**
```typescript
import { ATMOSPHERIC_COLORS } from '@aazucena/constants';

function getPhaseGradient(phase: keyof typeof ATMOSPHERIC_COLORS): string {
  const colors = ATMOSPHERIC_COLORS[phase];
  return `linear-gradient(to bottom, ${colors.from}, ${colors.via}, ${colors.to})`;
}

const exosphereCSS = getPhaseGradient('exosphere');
// Result: "linear-gradient(to bottom, #000000, #0a0a1a, #1a1a2e)"
```

**Use Cases:**
- CSS background gradients
- Three.js scene background colors
- PointLight colors per phase
- Transition animations between phases

---

## 🌐 DOMAIN

**File:** `domain.ts`
**Purpose:** API endpoints, CMS routes, and service URLs

### Domain Constants

```typescript
export const API_ENDPOINTS = {
  PORTFOLIO: process.env.NEXT_PUBLIC_PORTFOLIO_URL || 'http://localhost:3000',
  ANALYTICS: process.env.NEXT_PUBLIC_ANALYTICS_URL || 'http://localhost:3001',
  CMS: process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:1337',
  CLICKHOUSE: process.env.CLICKHOUSE_URL || 'http://localhost:8123',
} as const;

export const CMS_ROUTES = {
  HERO: '/api/hero',
  ABOUT: '/api/about',
  PROJECTS: '/api/projects',
  EXPERIENCES: '/api/experiences',
  POSTS: '/api/posts',
} as const;
```

**Use Case:** Configure API clients and service connections.

---

## 💰 FINANCE

**File:** `finance.ts`
**Purpose:** Currency codes, payment providers, pricing tiers

### Finance Constants

```typescript
export const CURRENCY_CODES = {
  USD: 'USD',
  EUR: 'EUR',
  GBP: 'GBP',
} as const;

export const PAYMENT_PROVIDERS = {
  STRIPE: {
    publicKey: process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY,
    secretKey: process.env.STRIPE_SECRET_KEY,
  },
  KOFI: {
    username: 'aazucena',
    url: 'https://ko-fi.com/aazucena',
  },
} as const;

export const PRICING_TIERS = {
  FREE: { price: 0, features: ['Basic access'] },
  PRO: { price: 10, features: ['All features', 'Priority support'] },
} as const;
```

**Use Case:** Configure payment integrations and subscription pricing.

---

## 📄 META

**File:** `meta.ts`
**Purpose:** SEO defaults, Open Graph templates, JSON-LD schemas

### Meta Constants

```typescript
export const META_DEFAULTS = {
  title: 'Aldrin Azucena | Full-Stack Developer',
  description: 'Full-stack developer specializing in React, TypeScript, and AI.',
  siteUrl: 'https://aldrinazucena.com',
  author: 'Aldrin Azucena',
  image: '/og-image.png',
} as const;

export const OPEN_GRAPH_DEFAULTS = {
  type: 'website',
  locale: 'en_US',
  siteName: 'Aldrin Azucena Portfolio',
} as const;

export const JSON_LD_SCHEMAS = {
  person: {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Aldrin Azucena',
    jobTitle: 'Full-Stack Developer',
  },
} as const;
```

**Use Case:** Generate SEO meta tags and structured data.

---

## ⏳ PRELOADER

**File:** `preloader.ts`
**Purpose:** Loading states, progress thresholds, animation sequences

### Preloader Constants

```typescript
export const PRELOADER_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  LOADED: 'loaded',
  ERROR: 'error',
} as const;

export const PROGRESS_THRESHOLDS = {
  READY: 100,
  WARNING: 75,
  SLOW: 50,
} as const;

export const ANIMATION_SEQUENCES = {
  FADE_IN: { duration: 500, easing: 'ease-in' },
  FADE_OUT: { duration: 300, easing: 'ease-out' },
} as const;
```

**Use Case:** Configure preloader behavior and animations.

---

## 🔒 SENTINEL

**File:** `sentinel.ts` (54 lines)
**Purpose:** Health monitoring thresholds for AZUCENA_LYTICS dashboard

### SENTINEL_THRESHOLDS

```typescript
export const SENTINEL_THRESHOLDS = {
  // AI INFRASTRUCTURE
  AI_COST_DAILY: {
    WARNING: 2.5,  // USD
    CRITICAL: 5.0, // USD
    LABEL: 'AI_COST_EXPOSURE',
  },
  AI_LATENCY_AVG: {
    WARNING: 2000,  // ms
    CRITICAL: 5000, // ms
    LABEL: 'AI_RESPONSE_LATENCY',
  },

  // PERFORMANCE (Core Web Vitals)
  LCP_P75: {
    WARNING: 1500,  // ms
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
```

**Threshold Categories:**
1. **AI Infrastructure** - Cost and latency monitoring
2. **Performance** - Core Web Vitals (LCP, CLS)
3. **System Integrity** - Error rates and incidents

**Threshold Levels:**
- `WARNING` - Elevated metric, investigate
- `CRITICAL` - Severe issue, immediate action required

**Example:**
```typescript
import { SENTINEL_THRESHOLDS, type SentinelAlertLevel } from '@aazucena/constants';

function evaluateHealth(metric: keyof typeof SENTINEL_THRESHOLDS, value: number): SentinelAlertLevel {
  const threshold = SENTINEL_THRESHOLDS[metric];

  if (value >= threshold.CRITICAL) return 'CRITICAL';
  if (value >= threshold.WARNING) return 'WARNING';
  return 'NOMINAL';
}

const aiCostStatus = evaluateHealth('AI_COST_DAILY', 3.5); // 'WARNING'
console.log(`Alert: ${aiCostStatus} - Daily AI cost: $3.50`);
```

---

### Type Definitions

```typescript
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

**Use Case:** Type-safe alert objects for monitoring system.

---

## ⌨️ COMMANDS

**File:** `commands.ts`
**Purpose:** CLI commands, keyboard shortcuts, action constants

### Command Constants

```typescript
export const CLI_COMMANDS = {
  HELP: '/help',
  CLEAR: '/clear',
  THEME: '/theme',
  EXIT: '/exit',
} as const;

export const KEYBOARD_SHORTCUTS = {
  SUBMIT: 'Enter',
  CANCEL: 'Escape',
  SEARCH: 'Control+K',
  THEME_TOGGLE: 'Control+T',
} as const;

export const ACTION_CONSTANTS = {
  SET_THEME: 'SET_THEME',
  TOGGLE_SIDEBAR: 'TOGGLE_SIDEBAR',
  UPDATE_USER: 'UPDATE_USER',
} as const;
```

**Use Case:** Define command palette, keyboard bindings, Redux actions.

---

## 🏠 SITE

**File:** `site.ts`
**Purpose:** Site metadata, navigation structure, social links

### Site Constants

```typescript
export const SITE_CONFIG = {
  name: 'Aldrin Azucena',
  title: 'Aldrin Azucena | Full-Stack Developer',
  description: 'Full-stack developer specializing in React, TypeScript, and AI.',
  url: 'https://aldrinazucena.com',
  author: 'Aldrin Azucena',
} as const;

export const NAVIGATION_ITEMS = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Projects', path: '/projects' },
  { label: 'Blog', path: '/blog' },
  { label: 'Contact', path: '/contact' },
] as const;

export const SOCIAL_LINKS = {
  github: 'https://github.com/aazucena',
  linkedin: 'https://linkedin.com/in/aazucena',
  twitter: 'https://x.com/azucena',
} as const;
```

**Use Case:** Configure site metadata and navigation menus.

---

## 📊 USAGE_STATISTICS

### Module Sizes

| Module | Lines | Exports | Use Cases |
|--------|-------|---------|-----------|
| animations.ts | 362 | 20+ | Particle systems, scene config, timing |
| sentinel.ts | 54 | 3 | Health monitoring thresholds |
| ai.ts | 45 | 4 | AI model registry, pricing, neural map |
| colors.ts | 38 | 1 | Atmospheric gradient colors |
| routes.ts | 38 | 1 | Application routing |
| storage.ts | 13 | 1 | LocalStorage keys |
| domain.ts | ~30 | 2 | API endpoints, CMS routes |
| finance.ts | ~40 | 3 | Currency, payments, pricing |
| meta.ts | ~50 | 3 | SEO defaults, Open Graph, JSON-LD |
| preloader.ts | ~30 | 3 | Loading states, thresholds |
| commands.ts | ~25 | 3 | CLI commands, shortcuts, actions |
| site.ts | ~40 | 3 | Site metadata, navigation, social |

**Total:** ~765 lines of pure data constants

---

## 🔗 RELATED_DOCUMENTATION

- [Main README](../README.md) - Package overview and API reference
- [Usage Patterns](./usage-patterns.md) - Best practices guide

---

**DOCUMENTATION_METADATA:**
- **Version:** 1.0.0
- **Last Updated:** 2026-02-11
- **Total Modules:** 12
- **Total Exports:** 40+
- **Author:** AAZUCENA Development Team
- **Status:** ✅ Complete
- **Phase:** Phase 4 - Developer Experience
- **Lines:** ~1,200

**INTELLIGENCE_THEME** • **COMPLETE_MODULE_REFERENCE** 📖
