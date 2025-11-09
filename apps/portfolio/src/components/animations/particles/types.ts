/**
 * Particles Types
 * TypeScript interfaces for the particle system
 */

import type { AtmosphericPhase } from '../config';

export interface ParticleSystemConfig {
  count: number;
  size: number;
  speed: number;
  opacity: number;
  color?: string;
  phase?: AtmosphericPhase;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: number;
  alpha: number;
  // Twinkling properties
  twinkleSpeed: number;
  twinklePhase: number;
  baseColor: number;
  targetColor: number;
  baseAlpha: number;
}

export interface ParticleEmitterConfig {
  emissionRate: number;
  lifetime: number;
  initialVelocity: { x: number; y: number };
  velocityVariance: number;
  sizeRange: [number, number];
}

export interface ParticleRendererConfig {
  blendMode: number;
  tint: number;
  texture?: string;
}

export interface PixiParticlesProps {
  count?: number;
  phase?: AtmosphericPhase;
  speed?: number;
  isPlaying?: boolean;
  width?: number;
  height?: number;
  preset?: 'space' | 'snow' | 'rain' | 'floating';
}
