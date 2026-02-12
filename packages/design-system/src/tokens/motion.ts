/**
 * Motion Tokens
 * Standard spring and timing configurations for consistent animation feel.
 * Optimized for Framer Motion and CSS transitions.
 */

export const transitions = {
  // Standard durations
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
    'ultra-slow': '1000ms',
  },
  // Standard easings
  timing: {
    base: 'cubic-bezier(0.4, 0, 0.2, 1)',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
    authentic: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const;

/**
 * Spring configurations for Framer Motion
 */
export const springs = {
  /** High energy, bouncy feel */
  bouncy: {
    type: 'spring',
    stiffness: 400,
    damping: 10,
    mass: 1,
  },
  /** Standard, smooth responsive feel */
  smooth: {
    type: 'spring',
    stiffness: 260,
    damping: 20,
    mass: 1,
  },
  /** Heavier, stable feel */
  snappy: {
    type: 'spring',
    stiffness: 300,
    damping: 30,
    mass: 1,
  },
  /** Very soft, subtle arrival */
  gentle: {
    type: 'spring',
    stiffness: 100,
    damping: 15,
    mass: 1,
  },
} as const;
