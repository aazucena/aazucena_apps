/**
 * GSAP ScrollTrigger Utilities
 * Helpers for scroll-based animations
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Initialize ScrollTrigger for an element
 */
export function createScrollTrigger(
  target: gsap.TweenTarget,
  vars: gsap.TweenVars,
  triggerOptions?: Partial<ScrollTrigger.Vars>,
): gsap.core.Tween {
  return gsap.to(target, {
    ...vars,
    scrollTrigger: {
      trigger: typeof target === 'string' ? target : (target as any),
      start: 'top 80%',
      toggleActions: 'play none none reverse',
      ...triggerOptions,
    },
  });
}

/**
 * Register a scroll-triggered parallax effect
 */
export function createParallax(
  target: gsap.TweenTarget,
  yPercent: number = 20,
  triggerOptions?: Partial<ScrollTrigger.Vars>,
): gsap.core.Tween {
  return gsap.to(target, {
    yPercent,
    ease: 'none',
    scrollTrigger: {
      trigger: typeof target === 'string' ? target : (target as any),
      scrub: true,
      ...triggerOptions,
    },
  });
}

/**
 * Batch ScrollTrigger for multiple elements
 */
export function createBatchTrigger(
  targets: gsap.TweenTarget,
  vars: gsap.TweenVars,
  batchOptions?: Partial<ScrollTrigger.BatchVars>,
): ScrollTrigger[] {
  return ScrollTrigger.batch(targets as any, {
    onEnter: (batch) =>
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        overwrite: true,
        ...vars,
      }),
    onLeave: (batch) => gsap.to(batch, { opacity: 0, y: -20, overwrite: true }),
    onEnterBack: (batch) =>
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        overwrite: true,
        ...vars,
      }),
    onLeaveBack: (batch) => gsap.to(batch, { opacity: 0, y: 20, overwrite: true }),
    ...batchOptions,
  });
}
