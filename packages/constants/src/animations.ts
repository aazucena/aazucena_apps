/**
 * Animation Constants
 * Central configuration for particle counts, timing, and atmospheric phases
 */

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
export const PARTICLE_PRESETS = {
  space: {
    count: 150,
    size: 2,
    speed: 0.3,
    opacity: 0.8,
    colors: [
      0xffffff, // White
      0xe0f0ff, // Blue-white
      0x88ffff, // Cyan
      0xfffacd, // Pale yellow
      0xddeeff, // Icy blue
    ],
    twinkling: true,
    twinkleSpeed: { min: 0.5, max: 2.0 },
  },
  snow: {
    count: 200,
    size: 3,
    speed: 1.5,
    opacity: 0.9,
    colors: [
      0xffffff, // Pure white
      0xf0f8ff, // Alice blue
      0xe6f2ff, // Very pale blue
    ],
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
      0x88ccff, // Light blue
      0x99ddff, // Pale cyan
      0xaaeeff, // Very pale cyan
    ],
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
      0xffd700, // Gold
      0xffa500, // Orange
      0xff69b4, // Hot pink
      0x00ffff, // Cyan
      0x9370db, // Medium purple
    ],
    twinkling: true,
    twinkleSpeed: { min: 1.0, max: 3.0 },
    sineWave: true, // Wave motion
    waveAmplitude: 2,
    waveFrequency: 0.5,
  },
} as const;

// Scene Configuration
export const SCENE_PARTICLE_COUNT = 3000;
export const SCENE_SHAPE_COUNT = 150;
export const SCENE_CLOUD_COUNT = 12;

/**
 * Scene Element Counts
 * Controls the number of generated objects in the scene
 */
export const SCENE_ELEMENT_COUNTS = {
  /** Number of background particles in exosphere */
  particles: 3000,
  /** Number of main floating shapes */
  mainShapes: 150,
  /** Number of clouds in stratosphere */
  clouds: 12,
  /** Number of houses on ground */
  houses: 8,
  /** Number of trees on ground */
  trees: 15,
  /** Number of bushes on ground */
  bushes: 25,
  /** Number of rocks on ground */
  rocks: 20,
  /** Number of flowers on ground */
  flowers: 35,
} as const;

/**
 * Animation Speeds
 * Controls rotation and movement speeds throughout the scene
 */
export const SCENE_ANIMATION_SPEEDS = {
  /** Base rotation speed for main group (radians per second) */
  groupRotation: 0.05,
  /** Sun movement speed in troposphere */
  sunRotation: 0.05,
  /** OrbitControls damping factor */
  orbitDamping: 0.05,
} as const;

/**
 * Shape Rotation Multipliers
 * Controls individual shape rotation speeds on each axis
 */
export const SHAPE_ROTATION = {
  /** Base rotation speeds for each axis */
  base: {
    x: 0.2,
    y: 0.3,
    z: 0.15,
  },
  /** Variation multipliers added based on shape index */
  variation: {
    x: 0.1, // (index % 3) * 0.1
    y: 0.05, // (index % 5) * 0.05
    z: 0.08, // (index % 4) * 0.08
  },
  /** Modulo divisors for variation calculation */
  modulo: {
    x: 3,
    y: 5,
    z: 4,
  },
} as const;

/**
 * Float Component Configuration
 * Controls the Float animation parameters for main shapes
 */
export const FLOAT_CONFIG = {
  /** Base float speed */
  baseSpeed: 1.5,
  /** Speed variation per shape (index % 10) * speedVariation */
  speedVariation: 0.3,
  /** Speed variation modulo */
  speedModulo: 10,
  /** Rotation intensity during floating */
  rotationIntensity: 0.8,
  /** Vertical movement intensity */
  floatIntensity: 0.8,
  /** Vertical floating range [min, max] */
  floatingRange: [-0.5, 0.5] as [number, number],
} as const;

/**
 * Sun Light Configuration (Troposphere)
 * Controls the animated sun directional light
 */
export const SUN_CONFIG = {
  /** Orbital radius around scene */
  radius: 10,
  /** Base Y position */
  baseY: 8,
  /** Y position variation amplitude */
  yVariation: 2,
  /** Light intensity multiplier */
  intensity: 0.8,
  /** Light color */
  color: '#FFD700',
} as const;

/**
 * Shadow Map Configuration
 * Controls shadow quality and camera frustum
 */
export const SHADOW_CONFIG = {
  /** Shadow map width (pixels) */
  width: 1024,
  /** Shadow map height (pixels) */
  height: 1024,
  /** Shadow camera far plane */
  far: 50,
  /** Shadow camera frustum bounds */
  frustum: {
    left: -10,
    right: 10,
    top: 10,
    bottom: -10,
  },
} as const;

/**
 * Point Light Positions
 * Fixed positions for the two main point lights
 */
export const POINT_LIGHT_POSITIONS = {
  /** Primary point light position */
  primary: [10, 10, 10] as const,
  /** Secondary point light position */
  secondary: [-10, -10, -10] as const,
} as const;

/**
 * Light Intensity Multipliers
 * Controls base intensity for different light types
 */
export const LIGHT_INTENSITIES = {
  /** Primary point light */
  primaryPoint: 0.5,
  /** Secondary point light */
  secondaryPoint: 0.3,
} as const;

/**
 * Material Configuration
 * Controls material properties for main shapes
 */
export const SHAPE_MATERIAL = {
  /** Emissive intensity in exosphere */
  emissiveExosphere: 0.2,
  /** Emissive intensity in thermosphere */
  emissiveThermosphere: 0.4,
  /** Base opacity multiplier */
  opacity: 0.85,
  /** Material roughness */
  roughness: 0.3,
  /** Material metalness */
  metalness: 0.1,
} as const;

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
  'exosphere',
  'thermosphere',
  'mesosphere',
  'stratosphere',
  'troposphere',
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
export const RESUME_BUTTON_COLOR = '#059669'; // Tailwind emerald-600
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
export const ENABLE_LAYER_LAZY_LOADING = true;

export const HSL_RANGES = {
  exosphere: {
    hueMin: 200,
    hueMax: 300,
    saturationMin: 60,
    saturationMax: 80,
    lightnessMin: 70,
    lightnessMax: 85,
  },
  thermosphere: {
    hueMin: 120,
    hueMax: 340,
    saturationMin: 70,
    saturationMax: 90,
    lightnessMin: 65,
    lightnessMax: 80,
  },
  mesosphere: {
    hueMin: 200,
    hueMax: 240,
    saturationMin: 60,
    saturationMax: 80,
    lightnessMin: 60,
    lightnessMax: 75,
  },
  stratosphere: {
    hueMin: 180,
    hueMax: 240,
    saturationMin: 50,
    saturationMax: 80,
    lightnessMin: 75,
    lightnessMax: 90,
  },
  troposphere: {
    hueMin: 90,
    hueMax: 210,
    saturationMin: 40,
    saturationMax: 70,
    lightnessMin: 60,
    lightnessMax: 80,
  },
} as const;

export const BACKGROUND_COLORS = {
  exosphere: '#0a0e27',
  thermosphere: '#1a1a2e',
  mesosphere: '#16213e',
  stratosphere: '#0f3460',
  troposphere: '#533483',
} as const;

export const POINT_LIGHT_COLORS = {
  exosphere: '#ffffff',
  thermosphere: '#9D4EDD',
  mesosphere: '#3A86FF',
  stratosphere: '#87CEEB',
  troposphere: '#FFA07A',
} as const;

export const SECONDARY_LIGHT_COLORS = {
  exosphere: '#aaaaff',
  thermosphere: '#06FFA5',
  mesosphere: '#1E40AF',
  stratosphere: '#B0E0E6',
  troposphere: '#D2691E',
} as const;
