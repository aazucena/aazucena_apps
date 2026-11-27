/**
 * Animation Constants
 * Central configuration for particle counts, timing, and atmospheric phases
 */

import { readTokenColor } from "~/lib/utils/token-color";

// Particle System
export const PARTICLE_COUNTS = {
  HIGH: 200,
  MEDIUM: 100,
  LOW: 50,
} as const;

export const PARTICLE_DEFAULTS = {
  SIZE: 2,
  SPEED: 1,
  OPACITY: 0.6,
} as const;

// Particle Presets
// Each colour is [token, fallback]: the scene reads the token once at start through
// readTokenColor and uses the fallback (the old hex) only when the token can't be read.
type ParticleColor = readonly [token: string, fallback: number];

export const PARTICLE_PRESETS = {
  space: {
    count: 150,
    size: 2,
    speed: 0.3,
    opacity: 0.8,
    // Stars are white again: one foreground token, read from the dark homepage wrapper
    colors: [["--foreground", 0xffffff]] as readonly ParticleColor[],
    twinkling: true,
    twinkleSpeed: { min: 0.5, max: 2.0 },
  },
  snow: {
    count: 200,
    size: 3,
    speed: 1.5,
    opacity: 0.9,
    colors: [
      ["--signal", 0xffffff], // Pure white
      ["--series-1", 0xf0f8ff], // Alice blue
      ["--series-2", 0xe6f2ff], // Very pale blue
    ] as readonly ParticleColor[],
    twinkling: false,
    drift: true, // Sideways movement
    driftSpeed: 0.5,
  },
  rain: {
    count: 300,
    size: 1,
    speed: 8.0,
    opacity: 0.6,
    colors: [
      ["--signal", 0x88ccff], // Light blue
      ["--series-1", 0x99ddff], // Pale cyan
      ["--series-2", 0xaaeeff], // Very pale cyan
    ] as readonly ParticleColor[],
    twinkling: false,
    streaks: true, // Elongated particles
    streakLength: 8,
  },
  floating: {
    count: 80,
    size: 4,
    speed: 0.5,
    opacity: 0.4,
    colors: [
      ["--series-1", 0xffd700], // Gold
      ["--series-2", 0xffa500], // Orange
      ["--series-3", 0xff69b4], // Hot pink
      ["--signal", 0x00ffff], // Cyan
      ["--series-4", 0x9370db], // Medium purple
    ] as readonly ParticleColor[],
    twinkling: true,
    twinkleSpeed: { min: 1.0, max: 3.0 },
    sineWave: true, // Wave motion
    waveAmplitude: 2,
    waveFrequency: 0.5,
  },
} as const;

/** A preset's colours as 0xRRGGBB, read from the tokens. Call once when the scene starts. */
export function resolveParticleColors(
  preset: keyof typeof PARTICLE_PRESETS,
): number[] {
  return PARTICLE_PRESETS[preset].colors.map(([token, fallback]) =>
    readTokenColor(token, fallback),
  );
}

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
  FLOWERS: 35,
} as const;

// Atmospheric Phases
export const ATMOSPHERIC_PHASES = [
  "exosphere",
  "thermosphere",
  "mesosphere",
  "stratosphere",
  "troposphere",
] as const;

// Animation Timing (in milliseconds)
export const ANIMATION_TIMING = {
  FLIP_TEXT_INTERVAL: 3000,
  SCROLL_DEBOUNCE: 1000,
  MODAL_ANIMATION: 300,
  SECTION_TRANSITION: 1000,
} as const;

// CTA Button Animation
export const CTA_CLICK_SCALE = 0.95;
export const CTA_CLICK_DURATION = 0.1;
export const CTA_CLICK_REPEAT = 1;

// Resume Button Animation
export const RESUME_BUTTON_SCALE = 1.1;
export const RESUME_BUTTON_DURATION = 0.2;
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

// Performance Features
/**
 * Enable lazy loading for atmospheric layers
 * When true: Layers code-split and load on-demand (~375-750KB initial bundle reduction)
 * When false: All layers loaded upfront (simpler, no loading delays)
 *
 * UPDATED (2026-02-04 - Phase 3): ✅ ENABLED after removing conflicting static exports
 * from scene/index.ts. The lazy loading infrastructure now works correctly because
 * layers are ONLY exported via index.lazy.ts, allowing Vite to code-split properly.
 *
 * Expected Impact: 40-83% reduction in HomepageSection bundle (411KB → ~150-250KB gzipped)
 */
export const ENABLE_LAYER_LAZY_LOADING = true;
