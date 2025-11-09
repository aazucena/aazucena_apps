/**
 * Animation Types
 * Shared TypeScript interfaces and types
 */

import type { ATMOSPHERIC_PHASES } from './constants';
import * as THREE from 'three';

// Atmospheric Phase Type
export type AtmosphericPhase = typeof ATMOSPHERIC_PHASES[number];

// Device Capabilities
export interface DeviceCapabilities {
  isMobile: boolean;
  performanceTier: 'low' | 'medium' | 'high';
  canUseHeavyAnimations: boolean;
}

// Layer Opacities
export interface LayerOpacities {
  exosphere: number;
  thermosphere: number;
  mesosphere: number;
  stratosphere: number;
  troposphere: number;
}

// Shape Data
export interface ShapeData {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  color: string;
  geometry: THREE.BufferGeometry;
}

// Cloud Data
export interface CloudData {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  speed: number;
  opacity: number;
  color: string;
  emissiveIntensity: number;
}

// Ground Object Data
export interface HouseData {
  position: [number, number, number];
  rotation: number;
  scale: number;
  color: string;
}

export interface TreeData {
  position: [number, number, number];
  scale: number;
}

export interface BushData {
  position: [number, number, number];
  scale: number;
  color: string;
}

export interface RockData {
  position: [number, number, number];
  scale: number;
  rotation: [number, number, number];
}

export interface FlowerData {
  position: [number, number, number];
  scale: number;
  color: string;
}

// Particle System
export interface ParticleConfig {
  count: number;
  size: number;
  speed: number;
  opacity: number;
  color?: string;
}

export interface ParticlesProps {
  count?: number;
  phase?: AtmosphericPhase;
  speed?: number;
  isPlaying?: boolean;
}
