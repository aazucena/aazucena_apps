# GSAP Animation Patterns

## SUMMARY

Common GSAP animation patterns for entrance effects, scroll-driven animations, and timeline orchestration.

---

## ENTRANCE_ANIMATIONS

### Fade In

```typescript
import { fadeIn } from '@aazucena/animations/gsap';

fadeIn('.hero-title', {
  duration: 1.2,
  delay: 0.3,
  ease: 'power2.out',
});
```

### Slide Up with Stagger

```typescript
import { slideUp } from '@aazucena/animations/gsap';

slideUp('.card', {
  stagger: 0.1,
  duration: 0.8,
  y: 50,
});
```

---

## SCROLL_TRIGGERS

### Basic ScrollTrigger

```typescript
import { createScrollTrigger } from '@aazucena/animations/gsap';
import gsap from 'gsap';

gsap.registerPlugin(ScrollTrigger);

createScrollTrigger({
  trigger: '.section',
  start: 'top 80%',
  end: 'bottom 20%',
  onEnter: () => fadeIn('.content'),
  onLeave: () => fadeOut('.content'),
});
```

### Atmospheric Layer Transitions

```typescript
import { atmosphericTransition } from '@aazucena/animations/gsap';

atmosphericTransition({
  layerName: 'STRATOSPHERE',
  scrollProgress: 0.3,
  onTransition: (layer) => {
    console.log(`Transitioned to ${layer}`);
    // Update background, particles, etc.
  },
});
```

---

## TIMELINE_SEQUENCING

```typescript
import { createTimeline, sequenceAnimations } from '@aazucena/animations/gsap';

const tl = createTimeline({ repeat: -1, yoyo: true });

tl.add('start')
  .to('.box', { x: 100, duration: 1 })
  .add('middle')
  .to('.box', { y: 100, duration: 1 })
  .add('end')
  .to('.box', { rotation: 360, duration: 1 });
```

---

**AUTHOR:** aazucena_gsap_library
