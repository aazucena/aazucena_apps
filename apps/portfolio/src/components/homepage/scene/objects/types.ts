/**
 * Scene Objects - Type Definitions
 * Unified type system for all 3D scene objects (easter eggs + ground objects)
 */

import type { RefObject } from 'react';
import type { Group } from 'three';
import type { AnimationConfig } from '~/lib/utils/scene';

/**
 * Object Categories
 */
export type ObjectCategory = 'easter-egg' | 'ground' | 'decoration';

/**
 * Easter Egg Types
 */
export type EasterEggType =
  // Troposphere
  | 'airplane'
  | 'bird'
  | 'drone'
  // Stratosphere
  | 'weather-balloon'
  | 'spy-plane'
  | 'blimp'
  // Mesosphere
  | 'comet'
  | 'meteor'
  | 'space-debris'
  // Thermosphere
  | 'space-shuttle'
  | 'astronaut'
  | 'iss'
  // Exosphere
  | 'satellite'
  | 'ufo'
  | 'rocket';

/**
 * Ground Object Types
 */
export type GroundObjectType =
  | 'house'
  | 'tree'
  | 'bush'
  | 'rock'
  | 'flower'
  | 'ground';

/**
 * All Scene Object Types
 */
export type SceneObjectType = EasterEggType | GroundObjectType;

/**
 * Base Scene Object Configuration
 */
export interface SceneObjectConfig {
  /** Unique identifier for the object */
  id?: string;
  /** Object type */
  type: SceneObjectType;
  /** Object category */
  category: ObjectCategory;
  /** Position [x, y, z] */
  position: [number, number, number];
  /** Rotation [x, y, z] (radians) */
  rotation?: [number, number, z: number];
  /** Scale (uniform or [x, y, z]) */
  scale?: number | [number, number, number];
  /** Opacity multiplier (0-1) */
  opacity?: number;
  /** Animation configuration */
  animation?: AnimationConfig | 'custom';
  /** Custom animation preset name */
  animationPreset?: string;
  /** Additional custom properties */
  custom?: Record<string, unknown>;
}

/**
 * Easter Egg Specific Configuration
 */
export interface EasterEggConfig extends SceneObjectConfig {
  type: EasterEggType;
  category: 'easter-egg';
  /** Whether the easter egg is currently visible */
  visible?: boolean;
  /** Enable click interaction */
  interactive?: boolean;
  /** Tooltip text on hover */
  tooltip?: string;
}

/**
 * Ground Object Specific Configuration
 */
export interface GroundObjectConfig extends SceneObjectConfig {
  type: GroundObjectType;
  category: 'ground';
  /** Object color (for procedural objects) */
  color?: string;
  /** Object variant (for objects with multiple designs) */
  variant?: number;
}

/**
 * Scene Object Component Props
 */
export interface SceneObjectProps {
  /** Object configuration */
  config: SceneObjectConfig;
  /** Global opacity multiplier */
  opacity: number;
  /** Ref to the object's Group */
  objectRef?: RefObject<Group | null>;
  /** Custom render function (override default) */
  children?: React.ReactNode;
}

/**
 * Scene Object Manager Props
 */
export interface SceneObjectManagerProps {
  /** Array of objects to render */
  objects: SceneObjectConfig[];
  /** Global opacity multiplier */
  opacity: number;
  /** Category filter (render only specific categories) */
  categoryFilter?: ObjectCategory[];
  /** Type filter (render only specific types) */
  typeFilter?: SceneObjectType[];
  /** Enable lazy loading */
  lazy?: boolean;
}

/**
 * Object Registry Entry
 */
export interface ObjectRegistryEntry {
  /** Object type */
  type: SceneObjectType;
  /** Component to render */
  component: React.ComponentType<{ opacity: number; config?: SceneObjectConfig }>;
  /** Default configuration */
  defaults?: Partial<SceneObjectConfig>;
  /** Performance cost (1-5, higher = more expensive) */
  cost?: number;
}

/**
 * Layer Object Collection
 */
export interface LayerObjects {
  /** Easter eggs for this layer */
  easterEggs: EasterEggConfig[];
  /** Ground objects (Troposphere only) */
  ground?: GroundObjectConfig[];
}
