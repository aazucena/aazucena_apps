# [Animation Tokens] : Motion_Intelligence

## SUMMARY

Standardized timing values, easing functions, and scroll thresholds for consistent animation behavior across the aazucena ecosystem. Designed for 60fps performance with device-adaptive quality tiers.

---

## TIMING_CONSTANTS

### Base Durations (milliseconds)

```typescript
export const ANIMATION_TIMINGS = {
  // Micro-interactions (< 300ms)
  instant: 100, // Hover states, tooltips
  snappy: 200, // Button clicks, toggles
  quick: 300, // Modal entrances, dropdowns

  // Standard transitions (300-700ms)
  normal: 500, // Section transitions, fades
  relaxed: 700, // Page transitions, major UI shifts

  // Cinematic (> 700ms)
  slow: 1000, // Hero animations, reveals
  cinematic: 1500, // Atmospheric layer transitions
  epic: 2500, // Full-screen takeovers
} as const;
```

### Phase-Specific Timings (MG/EG)

```typescript
export const PHASE_TIMINGS = {
  midgame: {
    thinking: 300, // Pulsing "Reasoning" indicator
    trace: 150, // Thought trace animation speed
    loop: 2000, // Continuous pulse cycle
  },
  endgame: {
    synthesis: 700, // Final output reveal
    success: 500, // Success state transition
    static: 0, // No animation (terminal state)
  },
} as const;
```

---

## EASING_FUNCTIONS

### GSAP Easing Presets

```typescript
export const EASING = {
  // Natural motion
  ease: 'power2.out', // Default easing
  easeIn: 'power2.in', // Accelerating
  easeOut: 'power2.out', // Decelerating
  easeInOut: 'power2.inOut', // Smooth S-curve

  // Elastic (overshoots)
  elastic: 'elastic.out(1, 0.3)',
  elasticIn: 'elastic.in(1, 0.3)',
  elasticOut: 'elastic.out(1, 0.3)',

  // Bounce (physics-based)
  bounce: 'bounce.out',
  bounceIn: 'bounce.in',
  bounceOut: 'bounce.out',

  // Back (anticipation)
  back: 'back.out(1.7)',
  backIn: 'back.in(1.7)',
  backOut: 'back.out(1.7)',

  // Linear (constant speed)
  linear: 'none',

  // Circ (circular motion)
  circ: 'circ.out',
  circIn: 'circ.in',
  circOut: 'circ.out',
} as const;
```

### Framer Motion Variants

```typescript
export const MOTION_VARIANTS = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slideUp: {
    initial: { y: 50, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -50, opacity: 0 },
  },
  scaleIn: {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.8, opacity: 0 },
  },
} as const;
```

---

## SCROLL_THRESHOLDS

### Atmospheric Layer Transitions

Based on scroll progress (0-1 scale):

```typescript
export const ATMOSPHERIC_LAYERS = {
  troposphere: {
    start: 0.0,
    end: 0.25,
    background: 'linear-gradient(to bottom, #1e3a8a, #3b82f6)',
    particles: 100,
  },
  stratosphere: {
    start: 0.25,
    end: 0.5,
    background: 'linear-gradient(to bottom, #7c3aed, #a855f7)',
    particles: 150,
  },
  mesosphere: {
    start: 0.5,
    end: 0.75,
    background: 'linear-gradient(to bottom, #dc2626, #f97316)',
    particles: 80,
  },
  exosphere: {
    start: 0.75,
    end: 1.0,
    background: 'linear-gradient(to bottom, #000000, #1e293b)',
    particles: 50,
  },
} as const;
```

### ScrollTrigger Breakpoints

```typescript
export const SCROLL_BREAKPOINTS = {
  // Start/end positions
  start: {
    top: 'top 80%', // When element top hits 80% of viewport
    center: 'center center', // When element center is in viewport center
    bottom: 'bottom 20%', // When element bottom hits 20% of viewport
  },
  end: {
    top: 'top top',
    center: 'center top',
    bottom: 'bottom bottom',
  },

  // Scrub values (scroll-linked animation)
  scrub: {
    smooth: 1, // 1 second scrub delay (smoothest)
    moderate: 0.5, // 0.5 second scrub
    immediate: 0.1, // Near-instant scrub
    direct: true, // Direct 1:1 scroll binding
  },
} as const;
```

---

## PERFORMANCE_TIERS

Device-adaptive animation quality:

```typescript
export const PERFORMANCE_CONFIG = {
  high: {
    particleCount: 200,
    textureQuality: 2048,
    shadowQuality: 'high',
    postProcessing: true,
    fps: 60,
  },
  medium: {
    particleCount: 100,
    textureQuality: 1024,
    shadowQuality: 'medium',
    postProcessing: false,
    fps: 60,
  },
  low: {
    particleCount: 50,
    textureQuality: 512,
    shadowQuality: 'off',
    postProcessing: false,
    fps: 30,
  },
} as const;
```

---

## USAGE_EXAMPLES

### GSAP with Timing Constants

```typescript
import { ANIMATION_TIMINGS, EASING } from '@aazucena/design-system';
import gsap from 'gsap';

gsap.to('.element', {
  opacity: 1,
  y: 0,
  duration: ANIMATION_TIMINGS.normal / 1000, // Convert ms to seconds
  ease: EASING.easeOut,
});
```

### Atmospheric Transition

```typescript
import { ATMOSPHERIC_LAYERS } from '@aazucena/design-system';

function getAtmosphericLayer(scrollProgress: number) {
  return Object.entries(ATMOSPHERIC_LAYERS).find(
    ([_, layer]) => scrollProgress >= layer.start && scrollProgress < layer.end,
  );
}

// Usage
const [layerName, layerConfig] = getAtmosphericLayer(0.3); // 'stratosphere'
```

### Performance-Tiered Rendering

```typescript
import { PERFORMANCE_CONFIG } from '@aazucena/design-system';
import { useDeviceCapabilities } from '@aazucena/hooks';

function ThreeScene() {
  const { performanceTier } = useDeviceCapabilities();
  const config = PERFORMANCE_CONFIG[performanceTier];

  return (
    <Canvas>
      <ParticleSystem count={config.particleCount} />
      <Lighting quality={config.shadowQuality} />
      {config.postProcessing && <EffectsComposer />}
    </Canvas>
  );
}
```

---

## BEST_PRACTICES

1. **Always use tokens** - Never hardcode timing values
2. **Respect performance tiers** - Adapt animation complexity based on device capabilities
3. **60fps target** - Keep animations under 16.67ms per frame
4. **Prefer transforms** - Use `transform` (GPU) over `top/left` (CPU)
5. **Reduce motion** - Respect `prefers-reduced-motion` media query

---

**STATUS:** 🎬 PRODUCTION_READY
**AUTHOR:** aazucena_motion_engine
