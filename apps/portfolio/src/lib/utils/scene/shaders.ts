/**
 * Scene Shader Utilities
 * Reusable shader material creation and management for atmospheric layers
 */

import * as THREE from 'three';
import type { ShaderMaterial } from 'three';

/**
 * Aurora Shader Configuration
 */
export interface AuroraShaderConfig {
  /** Base color of the aurora (hex string or THREE.Color) */
  color: string | THREE.Color;
  /** Base opacity multiplier (0-1) */
  baseOpacity: number;
  /** Vertical gradient fade range (0-1) */
  verticalFadeRange?: number;
  /** Edge softness amount (0-1) */
  edgeSoftness?: number;
  /** Flicker intensity (0-1) */
  flickerIntensity?: number;
}

/**
 * Creates an aurora shader material with gradient fading and flickering effects
 *
 * Features:
 * - Vertical gradient (fades from top to bottom)
 * - Edge softening (blurred edges on all sides)
 * - Horizontal variation (natural wave-like appearance)
 * - Subtle flickering animation (controlled by uTime uniform)
 *
 * @param config - Aurora shader configuration
 * @returns THREE.ShaderMaterial configured for aurora effects
 *
 * @example
 * ```tsx
 * const greenAurora = createAuroraMaterial({
 *   color: '#06FFA5',
 *   baseOpacity: 0.3
 * });
 * ```
 */
export function createAuroraMaterial(config: AuroraShaderConfig): THREE.ShaderMaterial {
  const {
    color,
    baseOpacity,
    verticalFadeRange = 0.4,
    edgeSoftness = 0.15,
    flickerIntensity = 0.05
  } = config;

  return new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: typeof color === 'string' ? new THREE.Color(color) : color },
      uOpacity: { value: baseOpacity },
      uTime: { value: 0 }
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vPosition;

      void main() {
        vUv = uv;
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      uniform float uOpacity;
      uniform float uTime;
      varying vec2 vUv;
      varying vec3 vPosition;

      void main() {
        // Vertical gradient - fade from top to bottom (feathered effect)
        float verticalGradient = smoothstep(0.0, ${verticalFadeRange.toFixed(2)}, vUv.y);

        // Blur/soften left and right edges
        float edgeSoftnessX = smoothstep(0.0, ${edgeSoftness.toFixed(2)}, vUv.x) * smoothstep(1.0, ${(1.0 - edgeSoftness).toFixed(2)}, vUv.x);

        // Blur/soften top edge
        float topEdgeSoftness = smoothstep(1.0, 0.75, vUv.y);

        // Add some horizontal variation for more natural look
        float horizontalVariation = sin(vUv.x * 3.14159 * 4.0) * 0.15 + 0.85;

        // Combine all edge blurring and gradients
        float finalAlpha = verticalGradient * edgeSoftnessX * topEdgeSoftness * horizontalVariation * uOpacity;

        // Add subtle flickering
        float flicker = sin(uTime * 2.0 + vUv.y * 10.0) * ${flickerIntensity.toFixed(2)} + ${(1.0 - flickerIntensity).toFixed(2)};
        finalAlpha *= flicker;

        gl_FragColor = vec4(uColor, finalAlpha);
      }
    `,
    transparent: true,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
}

/**
 * Updates shader time uniform for animation
 * Typically called in useFrame loop
 *
 * @param material - Shader material to update
 * @param time - Current elapsed time from clock
 *
 * @example
 * ```tsx
 * useFrame(({ clock }) => {
 *   updateShaderTime(auroraMaterial, clock.getElapsedTime());
 * });
 * ```
 */
export function updateShaderTime(material: ShaderMaterial, time: number): void {
  if (material.uniforms?.uTime) {
    material.uniforms.uTime.value = time;
  }
}

/**
 * Updates shader time uniform for multiple materials
 *
 * @param materials - Array of shader materials to update
 * @param time - Current elapsed time from clock
 *
 * @example
 * ```tsx
 * useFrame(({ clock }) => {
 *   updateShadersTime([greenAurora, purpleAurora], clock.getElapsedTime());
 * });
 * ```
 */
export function updateShadersTime(materials: ShaderMaterial[], time: number): void {
  materials.forEach(material => updateShaderTime(material, time));
}

/**
 * Updates shader opacity uniform
 * Useful for fading effects based on atmospheric layer visibility
 *
 * @param material - Shader material to update
 * @param opacity - New opacity value (0-1)
 */
export function updateShaderOpacity(material: ShaderMaterial, opacity: number): void {
  if (material.uniforms?.uOpacity) {
    material.uniforms.uOpacity.value = opacity;
  }
}

/**
 * Common shader blending modes
 */
export const SHADER_BLENDING = {
  ADDITIVE: THREE.AdditiveBlending,
  NORMAL: THREE.NormalBlending,
  MULTIPLY: THREE.MultiplyBlending,
  SUBTRACTIVE: THREE.SubtractiveBlending,
} as const;

/**
 * Common shader side configurations
 */
export const SHADER_SIDE = {
  FRONT: THREE.FrontSide,
  BACK: THREE.BackSide,
  DOUBLE: THREE.DoubleSide,
} as const;
