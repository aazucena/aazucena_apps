/**
 * Three.js Material Utilities
 * Reusable materials and shaders for 3D scenes
 */

import * as THREE from 'three';
import { createAuroraMaterial, updateShaderTime } from '@aazucena/utils';

export { createAuroraMaterial, updateShaderTime };
export type { AuroraShaderConfig } from '@aazucena/types';

/**
 * Creates a standard glowing material
 */
export function createGlowMaterial(
  color: string | THREE.Color,
  opacity: number = 0.5,
): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: typeof color === 'string' ? new THREE.Color(color) : color,
    transparent: true,
    opacity,
    emissive: typeof color === 'string' ? new THREE.Color(color) : color,
    emissiveIntensity: 0.5,
  });
}
