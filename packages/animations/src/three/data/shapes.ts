/**
 * Shape Data Generation
 * Generates geometric shapes for space scenes
 */

import * as THREE from 'three';
import { generatePhaseColor } from '@aazucena/utils';
import type { ShapeData } from '@aazucena/types';
import type { AtmosphericPhase } from '@aazucena/types';

/**
 * Generate shape data for floating objects
 * @param count Number of shapes to generate
 * @param geometries Array of geometries to use
 * @param phase Current atmospheric phase
 * @returns Array of shape data
 */
export function generateShapeData(
  count: number,
  geometries: THREE.BufferGeometry[],
  phase: AtmosphericPhase,
): ShapeData[] {
  return Array.from({ length: count }, () => {
    const arm = Math.floor(Math.random() * 4);
    const radius = Math.random() * 12 + 6;
    const angle = (arm * Math.PI) / 2 + (Math.random() * 0.6 - 0.3);
    const height = (Math.random() - 0.5) * 2;

    const spiralOffset = Math.sin(radius * 0.3) * 1.5;

    return {
      position: [
        Math.cos(angle) * (radius + spiralOffset) + (Math.random() - 0.5) * 1.5,
        height,
        Math.sin(angle) * (radius + spiralOffset) + (Math.random() - 0.5) * 1.5,
      ] as [number, number, number],
      rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI] as [
        number,
        number,
        number,
      ],
      scale: Math.random() * 0.4 + 0.2,
      color: generatePhaseColor(phase),
      geometry: geometries[Math.floor(Math.random() * geometries.length)]!,
    };
  });
}
