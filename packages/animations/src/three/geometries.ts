/**
 * Three.js Geometry Utilities
 * Reusable geometric shapes for 3D scenes
 */

import * as THREE from 'three';

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
    new THREE.RingGeometry(0.05, 0.1, 8),
  ];
}

/**
 * Create a specific geometry by type
 */
export function createGeometry(type: string, ...args: unknown[]): THREE.BufferGeometry {
  switch (type.toLowerCase()) {
    case 'sphere':
      return new THREE.SphereGeometry(...(args as [number, number, number]));
    case 'box':
      return new THREE.BoxGeometry(...(args as [number, number, number]));
    case 'cone':
      return new THREE.ConeGeometry(...(args as [number, number, number]));
    case 'torus':
      return new THREE.TorusGeometry(...(args as [number, number, number, number]));
    default:
      return new THREE.BoxGeometry(1, 1, 1);
  }
}
