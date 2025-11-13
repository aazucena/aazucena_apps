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

// CTA Button Animation
export const CTA_CLICK_SCALE = 0.95;
export const CTA_CLICK_DURATION = 0.1;
export const CTA_CLICK_REPEAT = 1;

// Resume Button Animation
export const RESUME_BUTTON_SCALE = 1.1;
export const RESUME_BUTTON_DURATION = 0.2;
export const RESUME_BUTTON_COLOR = "#059669"; // Tailwind emerald-600
export const RESUME_OPEN_DELAY = 400; // ms delay before opening resume

// Scroll Navigation
export const SCROLL_PROGRESS_MAX = 0.8;
export const SCROLL_PROGRESS_THRESHOLD = 0.7;
export const SCROLL_PROGRESS_RETURN = 0.7; // Starting progress when going back
export const SCROLL_PROGRESS_MIN = 0.1;

// Section Navigation
export const TOTAL_SECTIONS = 8;
export const SCROLL_SENSITIVITY = 0.002;
export const SCROLL_DEBOUNCE_TIME = 1000; // ms
