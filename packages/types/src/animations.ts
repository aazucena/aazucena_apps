/**
 * [Types] : Animation_System_Interfaces
 */

import type { ReactNode, RefObject, ComponentType } from 'react';

/**
 * Atmospheric Phases
 */
export type AtmosphericPhase =
  | 'exosphere'
  | 'thermosphere'
  | 'mesosphere'
  | 'stratosphere'
  | 'troposphere';

/**
 * Device & Performance
 */
export interface DeviceCapabilities {
  isMobile: boolean;
  performanceTier: 'low' | 'medium' | 'high';
  canUseHeavyAnimations: boolean;
}

/**
 * Layer Opacity State
 */
export interface LayerOpacities {
  exosphere: number;
  thermosphere: number;
  mesosphere: number;
  stratosphere: number;
  troposphere: number;
}

/**
 * Scene Data Structures
 */
export interface ShapeData {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  color: string;
  geometry: import('three').BufferGeometry;
}

export interface CloudData {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  speed: number;
  opacity: number;
  color: string;
  emissiveIntensity: number;
}

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

/**
 * Interaction State
 */
export interface MousePosition {
  x: number;
  y: number;
}

/**
 * Particle Primitive
 */
export interface ParticleData {
  vx: number;
  vy: number;
  vr: number;
}

/**
 * GSAP Animation Config
 */
export type EntranceAnimation = 'fade' | 'slide' | 'elastic' | 'scale' | 'blur' | 'none';
export type ScrollAnimation = 'parallax' | 'fade' | 'scale' | 'reveal' | 'none';

export interface AnimationConfig {
  entrance?: {
    type: EntranceAnimation;
    duration?: number;
    delay?: number;
    stagger?: number;
    ease?: string;
  };
  scroll?: {
    type: ScrollAnimation;
    intensity?: number;
    start?: string;
    end?: string;
    scrub?: number | boolean;
  };
  effects?: {
    useParticles?: boolean;
    use3DScene?: boolean;
    sceneIntensity?: number;
    particleCount?: number;
  };
}

export interface AnimatedSectionProps {
  id?: string;
  children: ReactNode;
  animationConfig?: AnimationConfig;
  className?: string;
  as?: 'section' | 'div' | 'article';
}

/**
 * Animation Presets
 */
export type AnimationPreset = 'hero' | 'feature' | 'minimal' | 'immersive' | 'none';

/**
 * ScrollTrigger Configuration
 */
export interface ScrollTriggerConfig {
  trigger?: Element | string;
  start?: string;
  end?: string;
  scrub?: number | boolean;
  pin?: boolean;
  markers?: boolean;
  toggleActions?: string;
}

/**
 * 3D Scene Animation Configuration
 */
export interface RotationConfig {
  x?: number;
  y?: number;
  z?: number;
}

export interface OscillationConfig {
  frequency: number;
  amplitude: number;
  phase?: number;
}

export interface RotationOscillationConfig {
  x?: OscillationConfig;
  y?: OscillationConfig;
  z?: OscillationConfig;
}

export interface PositionWaveConfig {
  base: { x: number; y: number; z: number };
  x?: OscillationConfig;
  y?: OscillationConfig;
  z?: OscillationConfig;
}

export interface SceneAnimationConfig {
  rotation?: RotationConfig;
  rotationOscillation?: RotationOscillationConfig;
  positionWave?: PositionWaveConfig;
}

/**
 * 3D Scene Objects
 */
export type ObjectCategory = 'easter-egg' | 'ground' | 'decoration';

export type EasterEggType =
  | 'airplane'
  | 'bird'
  | 'drone'
  | 'weather-balloon'
  | 'spy-plane'
  | 'blimp'
  | 'comet'
  | 'meteor'
  | 'space-debris'
  | 'space-shuttle'
  | 'astronaut'
  | 'iss'
  | 'satellite'
  | 'ufo'
  | 'rocket';

export type GroundObjectType = 'house' | 'tree' | 'bush' | 'rock' | 'flower' | 'ground';

export type SceneObjectType = EasterEggType | GroundObjectType;

/**
 * Three.js Reference Utility (Workaround for Three.js types)
 */
export type ThreeGroupRef = unknown; // Avoid strict Three dependency in types if possible, or use 'Group' from three

export interface SceneObjectConfig {
  id?: string;
  type: SceneObjectType;
  category: ObjectCategory;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
  opacity?: number;
  animation?: unknown | 'custom'; // Reference AnimationConfig from utils/scene
  animationPreset?: string;
  custom?: Record<string, unknown>;
}

export interface EasterEggConfig extends SceneObjectConfig {
  type: EasterEggType;
  category: 'easter-egg';
  visible?: boolean;
  interactive?: boolean;
  tooltip?: string;
}

export interface GroundObjectConfig extends SceneObjectConfig {
  type: GroundObjectType;
  category: 'ground';
  color?: string;
  variant?: number;
}

export interface SceneObjectProps {
  config: SceneObjectConfig;
  opacity: number;
  objectRef?: RefObject<unknown>;
  children?: ReactNode;
}

export interface SceneObjectManagerProps {
  objects: SceneObjectConfig[];
  opacity: number;
  categoryFilter?: ObjectCategory[];
  typeFilter?: SceneObjectType[];
  lazy?: boolean;
}

export interface ObjectRegistryEntry {
  type: SceneObjectType;
  component: ComponentType<{ opacity: number; config?: SceneObjectConfig }>;
  defaults?: Partial<SceneObjectConfig>;
  cost?: number;
}

export interface LayerObjects {
  easterEggs: EasterEggConfig[];
  ground?: GroundObjectConfig[];
}

/**
 * PixiJS Particles
 */
export interface ParticleSystemConfig {
  count: number;
  size: number;
  speed: number;
  opacity: number;
  color?: string;
  phase?: AtmosphericPhase;
  preset?: 'space' | 'snow' | 'rain' | 'floating';
}

export interface PixiParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: number;
  alpha: number;
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
  blendMode: unknown;
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

/**
 * Shader Configuration
 */
export interface AuroraShaderConfig {
  color: string | unknown;
  baseOpacity: number;
  verticalFadeRange?: number;
  edgeSoftness?: number;
  flickerIntensity?: number;
}
