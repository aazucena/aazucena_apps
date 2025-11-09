/**
 * Animation Constants
 * Central configuration for particle counts, timing, and atmospheric phases
 */

// Particle System
export const PARTICLE_COUNTS = {
  HIGH: 200,
  MEDIUM: 100,
  LOW: 50
} as const;

export const PARTICLE_DEFAULTS = {
  SIZE: 2,
  SPEED: 1,
  OPACITY: 0.6
} as const;

// Scene Configuration
export const SCENE_PARTICLE_COUNT = 3000;
export const SCENE_SHAPE_COUNT = 150;
export const SCENE_CLOUD_COUNT = 12;

// Ground Objects
export const GROUND_OBJECT_COUNTS = {
  HOUSES: 8,
  TREES: 15,
  BUSHES: 25,
  ROCKS: 20,
  FLOWERS: 35
} as const;

// Atmospheric Phases
export const ATMOSPHERIC_PHASES = [
  'exosphere',
  'thermosphere',
  'mesosphere',
  'stratosphere',
  'troposphere'
] as const;

// Animation Timing (in milliseconds)
export const ANIMATION_TIMING = {
  FLIP_TEXT_INTERVAL: 3000,
  SCROLL_DEBOUNCE: 1000,
  MODAL_ANIMATION: 300,
  SECTION_TRANSITION: 1000
} as const;
