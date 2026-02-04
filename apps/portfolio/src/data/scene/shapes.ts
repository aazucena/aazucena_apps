/**
 * Shape Data Generation
 * Generates geometric shapes for space scenes
 */

import * as THREE from 'three';
import { generatePhaseColor } from '~/lib/utils/scene/phaseColors';
import type { ShapeData } from '~/config/animations';
import type { AtmosphericPhase } from '~/config/animations';

/**
 * Create basic geometric shapes for reuse
 */
export function createBasicGeometries(): THREE.BufferGeometry[] {
  return [
    new THREE.SphereGeometry(0.1, 6, 6),
    new THREE.BoxGeometry(0.15, 0.15, 0.15),
    new THREE.ConeGeometry(0.1, 0.2, 5),
    new THREE.TetrahedronGeometry(0.12),
    new THREE.OctahedronGeometry(0.1),
    new THREE.DodecahedronGeometry(0.08, 0),
    new THREE.TorusGeometry(0.08, 0.03, 8, 6),
    new THREE.CylinderGeometry(0.08, 0.08, 0.2, 8),
    new THREE.RingGeometry(0.05, 0.1, 8)
  ];
}

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
  phase: AtmosphericPhase
): ShapeData[] {
  return Array.from({ length: count }, () => {
    const arm = Math.floor(Math.random() * 4);
    const radius = Math.random() * 12 + 6;
    const angle = (arm * Math.PI / 2) + (Math.random() * 0.6 - 0.3);
    const height = (Math.random() - 0.5) * 2;

    const spiralOffset = Math.sin(radius * 0.3) * 1.5;

    return {
      position: [
        Math.cos(angle) * (radius + spiralOffset) + (Math.random() - 0.5) * 1.5,
        height,
        Math.sin(angle) * (radius + spiralOffset) + (Math.random() - 0.5) * 1.5
      ] as [number, number, number],
      rotation: [
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      ] as [number, number, number],
      scale: Math.random() * 0.4 + 0.2,
      color: generatePhaseColor(phase),
      geometry: geometries[Math.floor(Math.random() * geometries.length)]
    };
  });
}
