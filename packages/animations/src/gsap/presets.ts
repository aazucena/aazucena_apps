/**
 * GSAP Animation Presets
 * Reusable animation configurations for GSAP
 */

import { gsap } from 'gsap';

export const ANIMATION_PRESETS = {
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1, duration: 1, ease: 'power2.out' },
  },
  fadeOut: {
    from: { opacity: 1 },
    to: { opacity: 0, duration: 1, ease: 'power2.in' },
  },
  slideInUp: {
    from: { y: 50, opacity: 0 },
    to: { y: 0, opacity: 1, duration: 1, ease: 'power3.out' },
  },
  slideInDown: {
    from: { y: -50, opacity: 0 },
    to: { y: 0, opacity: 1, duration: 1, ease: 'power3.out' },
  },
  slideInLeft: {
    from: { x: -50, opacity: 0 },
    to: { x: 0, opacity: 1, duration: 1, ease: 'power3.out' },
  },
  slideInRight: {
    from: { x: 50, opacity: 0 },
    to: { x: 0, opacity: 1, duration: 1, ease: 'power3.out' },
  },
  scaleIn: {
    from: { scale: 0.8, opacity: 0 },
    to: { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.7)' },
  },
} as const;

/**
 * Apply a preset to an element
 */
export function applyPreset(
  element: gsap.TweenTarget,
  preset: keyof typeof ANIMATION_PRESETS,
  vars?: gsap.TweenVars,
): gsap.core.Tween {
  const { from, to } = ANIMATION_PRESETS[preset];
  return gsap.fromTo(element, from, { ...to, ...vars });
}

/**
 * Create a stagger animation for multiple elements
 */
export function staggerFadeIn(
  elements: gsap.TweenTarget,
  stagger: number = 0.1,
  vars?: gsap.TweenVars,
): gsap.core.Tween {
  return gsap.fromTo(
    elements,
    { opacity: 0, y: 20 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger,
      ease: 'power2.out',
      ...vars,
    },
  );
}
