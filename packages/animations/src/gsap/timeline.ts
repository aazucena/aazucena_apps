/**
 * GSAP Timeline Utilities
 * Helpers for complex animation sequences
 */

import { gsap } from 'gsap';

/**
 * Create a reusable timeline with default settings
 */
export function createTimeline(
  vars?: gsap.TimelineVars,
  defaultVars?: gsap.TweenVars,
): gsap.core.Timeline {
  return gsap.timeline({
    defaults: {
      duration: 1,
      ease: 'power2.out',
      ...defaultVars,
    },
    ...vars,
  });
}

/**
 * Create an entrance timeline for a section
 */
export function createEntranceTimeline(
  title: gsap.TweenTarget,
  content: gsap.TweenTarget,
  cta?: gsap.TweenTarget,
): gsap.core.Timeline {
  const tl = createTimeline();

  tl.from(title, { y: 30, opacity: 0 }).from(content, { y: 20, opacity: 0 }, '-=0.5');

  if (cta) {
    tl.from(cta, { y: 10, opacity: 0, scale: 0.9 }, '-=0.3');
  }

  return tl;
}
