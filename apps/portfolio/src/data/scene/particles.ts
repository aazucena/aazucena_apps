/**
 * Particle Data Generation
 * Generates particle system data for background stars
 */

import * as THREE from 'three';
import { generatePhaseColor } from '~/lib/utils/scene/phaseColors';
import type { AtmosphericPhase } from '~/config/animations';

export interface ParticleData {
  positions: Float32Array;
  colors: Float32Array;
}

/**
 * Generate particle data for background stars
 * @param count Number of particles to generate
 * @param phase Current atmospheric phase for color generation
 * @returns Particle positions and colors
 */
export function generateParticleData(count: number, phase: AtmosphericPhase): ParticleData {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const arm = Math.floor(Math.random() * 4);
    const radius = Math.random() * 15 + 8;
    const angle = (arm * Math.PI / 2) + (Math.random() * 0.8 - 0.4);
    const height = (Math.random() - 0.5) * 3;

    const spiralOffset = Math.sin(radius * 0.3) * 2;

    positions[i * 3] = Math.cos(angle) * (radius + spiralOffset) + (Math.random() - 0.5) * 2;
    positions[i * 3 + 1] = height;
    positions[i * 3 + 2] = Math.sin(angle) * (radius + spiralOffset) + (Math.random() - 0.5) * 2;

    const color = new THREE.Color(generatePhaseColor(phase));
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }

  return { positions, colors };
}
