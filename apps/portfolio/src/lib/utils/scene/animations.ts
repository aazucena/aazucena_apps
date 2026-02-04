/**
 * Scene Animation Utilities
 * Reusable animation helpers for atmospheric layers and easter eggs
 */

import type { Group } from 'three';
import type { RefObject } from 'react';

/**
 * Rotation Animation Configuration
 */
export interface RotationConfig {
  /** Constant rotation speed (radians per second) */
  x?: number;
  /** Constant rotation speed (radians per second) */
  y?: number;
  /** Constant rotation speed (radians per second) */
  z?: number;
}

/**
 * Oscillation Animation Configuration
 */
export interface OscillationConfig {
  /** Oscillation frequency (higher = faster) */
  frequency: number;
  /** Oscillation amplitude (distance from center) */
  amplitude: number;
  /** Phase offset (for staggered animations) */
  phase?: number;
}

/**
 * Rotation Oscillation Configuration
 */
export interface RotationOscillationConfig {
  /** X-axis oscillation */
  x?: OscillationConfig;
  /** Y-axis oscillation */
  y?: OscillationConfig;
  /** Z-axis oscillation */
  z?: OscillationConfig;
}

/**
 * Position Wave Configuration
 */
export interface PositionWaveConfig {
  /** Base position (center point) */
  base: { x: number; y: number; z: number };
  /** X-axis oscillation */
  x?: OscillationConfig;
  /** Y-axis oscillation */
  y?: OscillationConfig;
  /** Z-axis oscillation */
  z?: OscillationConfig;
}

/**
 * Complete Animation Configuration
 */
export interface AnimationConfig {
  /** Constant rotation speeds */
  rotation?: RotationConfig;
  /** Oscillating rotations */
  rotationOscillation?: RotationOscillationConfig;
  /** Position wave animations */
  positionWave?: PositionWaveConfig;
}

/**
 * Applies constant rotation animation
 *
 * @param ref - Reference to the 3D object
 * @param time - Current elapsed time
 * @param config - Rotation configuration
 *
 * @example
 * ```tsx
 * useFrame(({ clock }) => {
 *   applyRotation(shuttleRef, clock.getElapsedTime(), { y: 0.15 });
 * });
 * ```
 */
export function applyRotation(
  ref: RefObject<Group | null>,
  time: number,
  config: RotationConfig
): void {
  if (!ref.current) return;

  if (config.x !== undefined) {
    ref.current.rotation.x = time * config.x;
  }
  if (config.y !== undefined) {
    ref.current.rotation.y = time * config.y;
  }
  if (config.z !== undefined) {
    ref.current.rotation.z = time * config.z;
  }
}

/**
 * Applies oscillating rotation animation
 *
 * @param ref - Reference to the 3D object
 * @param time - Current elapsed time
 * @param config - Rotation oscillation configuration
 *
 * @example
 * ```tsx
 * useFrame(({ clock }) => {
 *   applyRotationOscillation(shuttleRef, clock.getElapsedTime(), {
 *     x: { frequency: 0.3, amplitude: 0.1 }
 *   });
 * });
 * ```
 */
export function applyRotationOscillation(
  ref: RefObject<Group | null>,
  time: number,
  config: RotationOscillationConfig
): void {
  if (!ref.current) return;

  if (config.x) {
    const { frequency, amplitude, phase = 0 } = config.x;
    ref.current.rotation.x = Math.sin(time * frequency + phase) * amplitude;
  }
  if (config.y) {
    const { frequency, amplitude, phase = 0 } = config.y;
    ref.current.rotation.y = Math.sin(time * frequency + phase) * amplitude;
  }
  if (config.z) {
    const { frequency, amplitude, phase = 0 } = config.z;
    ref.current.rotation.z = Math.sin(time * frequency + phase) * amplitude;
  }
}

/**
 * Applies position wave animation (floating/bobbing effect)
 *
 * @param ref - Reference to the 3D object
 * @param time - Current elapsed time
 * @param config - Position wave configuration
 *
 * @example
 * ```tsx
 * useFrame(({ clock }) => {
 *   applyPositionWave(shuttleRef, clock.getElapsedTime(), {
 *     base: { x: 0, y: 3, z: -9 },
 *     y: { frequency: 0.25, amplitude: 0.3 }
 *   });
 * });
 * ```
 */
export function applyPositionWave(
  ref: RefObject<Group | null>,
  time: number,
  config: PositionWaveConfig
): void {
  if (!ref.current) return;

  const { base, x, y, z } = config;

  // Set base position
  ref.current.position.x = base.x;
  ref.current.position.y = base.y;
  ref.current.position.z = base.z;

  // Apply wave oscillations
  if (x) {
    const { frequency, amplitude, phase = 0 } = x;
    ref.current.position.x += Math.sin(time * frequency + phase) * amplitude;
  }
  if (y) {
    const { frequency, amplitude, phase = 0 } = y;
    ref.current.position.y += Math.sin(time * frequency + phase) * amplitude;
  }
  if (z) {
    const { frequency, amplitude, phase = 0 } = z;
    ref.current.position.z += Math.sin(time * frequency + phase) * amplitude;
  }
}

/**
 * Applies circular motion animation (orbit effect)
 * Uses sin for one axis and cos for another to create circular motion
 *
 * @param ref - Reference to the 3D object
 * @param time - Current elapsed time
 * @param config - Position wave configuration with x and another axis
 *
 * @example
 * ```tsx
 * useFrame(({ clock }) => {
 *   applyCircularMotion(astronautRef, clock.getElapsedTime(), {
 *     base: { x: -4, y: 2, z: -8 },
 *     x: { frequency: 0.3, amplitude: 0.2 },
 *     y: { frequency: 0.5, amplitude: 0.4 }
 *   });
 * });
 * ```
 */
export function applyCircularMotion(
  ref: RefObject<Group | null>,
  time: number,
  config: PositionWaveConfig
): void {
  if (!ref.current) return;

  const { base, x, y, z } = config;

  // Set base position
  ref.current.position.set(base.x, base.y, base.z);

  // Apply circular motion (use cos for one axis to create circle)
  if (x && y) {
    const { frequency: xFreq, amplitude: xAmp, phase: xPhase = 0 } = x;
    const { frequency: yFreq, amplitude: yAmp, phase: yPhase = 0 } = y;
    ref.current.position.x += Math.cos(time * xFreq + xPhase) * xAmp;
    ref.current.position.y += Math.sin(time * yFreq + yPhase) * yAmp;
  } else if (x && z) {
    const { frequency: xFreq, amplitude: xAmp, phase: xPhase = 0 } = x;
    const { frequency: zFreq, amplitude: zAmp, phase: zPhase = 0 } = z;
    ref.current.position.x += Math.cos(time * xFreq + xPhase) * xAmp;
    ref.current.position.z += Math.sin(time * zFreq + zPhase) * zAmp;
  } else if (y && z) {
    const { frequency: yFreq, amplitude: yAmp, phase: yPhase = 0 } = y;
    const { frequency: zFreq, amplitude: zAmp, phase: zPhase = 0 } = z;
    ref.current.position.y += Math.cos(time * yFreq + yPhase) * yAmp;
    ref.current.position.z += Math.sin(time * zFreq + zPhase) * zAmp;
  }
}

/**
 * Applies complete animation configuration (combination of rotation, oscillation, and position)
 *
 * @param ref - Reference to the 3D object
 * @param time - Current elapsed time
 * @param config - Complete animation configuration
 *
 * @example
 * ```tsx
 * useFrame(({ clock }) => {
 *   applyAnimation(shuttleRef, clock.getElapsedTime(), {
 *     rotation: { y: 0.15 },
 *     rotationOscillation: { x: { frequency: 0.3, amplitude: 0.1 } },
 *     positionWave: {
 *       base: { x: -7, y: 3, z: -9 },
 *       y: { frequency: 0.25, amplitude: 0.3 }
 *     }
 *   });
 * });
 * ```
 */
export function applyAnimation(
  ref: RefObject<Group | null>,
  time: number,
  config: AnimationConfig
): void {
  if (!ref.current) return;

  // Apply constant rotation
  if (config.rotation) {
    applyRotation(ref, time, config.rotation);
  }

  // Apply oscillating rotation
  if (config.rotationOscillation) {
    applyRotationOscillation(ref, time, config.rotationOscillation);
  }

  // Apply position waves
  if (config.positionWave) {
    applyPositionWave(ref, time, config.positionWave);
  }
}

/**
 * Common animation presets for easter eggs
 */
export const ANIMATION_PRESETS = {
  /** Slow orbital rotation (satellites, space stations) */
  ORBITAL: {
    rotation: { y: 0.1 },
    rotationOscillation: { z: { frequency: 0.2, amplitude: 0.05 } }
  },

  /** Floating/bobbing motion (astronauts, balloons) */
  FLOATING: {
    positionWave: {
      base: { x: 0, y: 0, z: 0 }, // Override with actual position
      y: { frequency: 0.5, amplitude: 0.4 },
      x: { frequency: 0.3, amplitude: 0.2 }
    }
  },

  /** Flying motion (planes, birds) */
  FLYING: {
    rotation: { y: 0.15 },
    rotationOscillation: { x: { frequency: 0.3, amplitude: 0.1 } },
    positionWave: {
      base: { x: 0, y: 0, z: 0 }, // Override with actual position
      y: { frequency: 0.25, amplitude: 0.3 }
    }
  },

  /** Wobbling motion (UFOs) */
  WOBBLING: {
    rotation: { y: 0.5 },
    rotationOscillation: { x: { frequency: 0.8, amplitude: 0.15 } },
    positionWave: {
      base: { x: 0, y: 0, z: 0 }, // Override with actual position
      y: { frequency: 0.6, amplitude: 0.3 },
      x: { frequency: 0.4, amplitude: 0.2 }
    }
  },

  /** Tumbling motion (space debris, meteors) */
  TUMBLING: {
    rotation: { y: 0.6, x: 0.4, z: 0.3 }
  }
} as const;
