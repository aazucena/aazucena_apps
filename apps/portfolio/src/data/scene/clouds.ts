/**
 * Cloud Data Generation
 * Generates cloud data for stratosphere phase
 */

import type { CloudData } from '~/config/animations';

/**
 * Generate cloud data for sky phase
 * @param count Number of clouds to generate
 * @returns Array of cloud data
 */
export function generateCloudData(count: number): CloudData[] {
  return Array.from({ length: count }, () => {
    const radius = Math.random() * 20 + 8;
    const angle = Math.random() * Math.PI * 2;

    return {
      position: [
        Math.cos(angle) * radius,
        Math.random() * 6 - 2,
        Math.sin(angle) * radius
      ] as [number, number, number],
      rotation: [0, Math.random() * Math.PI * 2, 0] as [number, number, number],
      scale: Math.random() * 0.8 + 0.5,
      speed: Math.random() * 0.15 + 0.05, // Slower, smoother movement
      opacity: 1.0, // Maximum brightness
      color: '#ffffff', // Pure white
      emissiveIntensity: Math.random() * 0.5 + 0.3 // Range from 0.3 to 0.8
    };
  });
}
