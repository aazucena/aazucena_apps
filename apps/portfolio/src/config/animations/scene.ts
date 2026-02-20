/**
 * ThreeJS Scene Configuration
 * Centralized configuration for scene elements, counts, and animation parameters
 */

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
  color: "#FFD700",
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
