# Animation Performance Guide

## SUMMARY

60fps optimization strategies, device-adaptive quality tiers, and performance best practices.

---

## PERFORMANCE_TIERS

### Device Capability Detection

```typescript
import { useAnimation } from '@aazucena/context';

function AdaptiveScene() {
  const { capabilities, performanceTier } = useAnimation();

  const particleCount = performanceTier === 'high' ? 200 : performanceTier === 'medium' ? 100 : 50;
  const antialias = performanceTier === 'high';

  return (
    <>
      {capabilities.canUseHeavyAnimations ? (
        <ThreeScene antialias={antialias} />
      ) : (
        <CSSAnimation />
      )}
      <ParticleSystem count={particleCount} />
    </>
  );
}
```

---

## OPTIMIZATION_TECHNIQUES

### 1. Use Transforms (GPU-Accelerated)

```typescript
// ❌ Bad: CPU-bound
gsap.to('.element', { left: 100, top: 100 });

// ✅ Good: GPU-accelerated
gsap.to('.element', { x: 100, y: 100 });
```

### 2. Will-Change Hint

```css
.animated-element {
  will-change: transform, opacity;
}

/* Remove after animation */
.animated-element.done {
  will-change: auto;
}
```

### 3. Debounce Scroll Handlers

```typescript
import { useThrottle } from '@aazucena/hooks';

function ScrollListener() {
  const handleScroll = useThrottle(() => {
    // Expensive operation
  }, 16); // 60fps = ~16ms

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
}
```

---

## PERFORMANCE_MONITORING

```typescript
import { usePerformanceMonitor } from '@aazucena/hooks';

function App() {
  const metrics = usePerformanceMonitor({
    sampleRate: 1.0,
    reportInterval: 5000,
    onReport: (metrics) => {
      if (metrics.fps < 50) {
        console.warn('FPS dropped below 50');
      }
    },
  });

  return <div>FPS: {metrics.fps}</div>;
}
```

---

**AUTHOR:** aazucena_performance_lab
