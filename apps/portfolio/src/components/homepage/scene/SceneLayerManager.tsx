/**
 * SceneLayerManager Component
 * Manages rendering of all 5 atmospheric layers based on scroll progress
 * Optimizes by only rendering visible layers (opacity > 0)
 */

import { memo, type JSX } from 'react';
import type {
  AtmosphericPhase,
  LayerOpacities,
  CloudData,
  HouseData,
  TreeData,
  BushData,
  RockData,
  FlowerData
} from '~/config/animations';
import type { ParticleData } from '~/data/scene/particles';
import {
  Exosphere,
  Thermosphere,
  Mesosphere,
  Stratosphere,
  Troposphere
} from './index';

export interface SceneLayerManagerProps {
  /** Current atmospheric phase */
  phase: AtmosphericPhase;

  /** Layer opacities calculated from scroll progress */
  opacities: LayerOpacities;

  /** Overall scene intensity multiplier */
  intensity: number;

  /** Current scroll progress (0-7 for 8 sections) */
  progress: number;

  /** Particle data for Exosphere (Float32Arrays for positions & colors) */
  particles: ParticleData;

  /** Total particle count */
  particleCount: number;

  /** Cloud data for Stratosphere */
  clouds: CloudData[];

  /** Ground object data for Troposphere */
  houses: HouseData[];
  trees: TreeData[];
  bushes: BushData[];
  rocks: RockData[];
  flowers: FlowerData[];
}

/**
 * SceneLayerManager
 *
 * Renders atmospheric layers conditionally based on their visibility (opacity > 0).
 * This optimization prevents rendering layers that aren't currently visible,
 * improving performance especially on lower-end devices.
 */
function SceneLayerManagerComponent({
  phase: _phase, // Included in props for future extensibility
  opacities,
  intensity,
  progress,
  particles,
  particleCount,
  clouds,
  houses,
  trees,
  bushes,
  rocks,
  flowers
}: SceneLayerManagerProps): JSX.Element {
  return (
    <>
      {/* Exosphere Layer - Outermost space layer with particles */}
      {opacities.exosphere > 0 && (
        <Exosphere
          particles={particles}
          particleCount={particleCount}
          opacity={opacities.exosphere}
          intensity={intensity}
        />
      )}

      {/* Thermosphere Layer - Aurora and high-altitude effects */}
      {opacities.thermosphere > 0 && (
        <Thermosphere opacity={opacities.thermosphere} />
      )}

      {/* Mesosphere Layer - Meteors and middle atmosphere */}
      {opacities.mesosphere > 0 && (
        <Mesosphere opacity={opacities.mesosphere} />
      )}

      {/* Stratosphere Layer - Cloud formations */}
      {opacities.stratosphere > 0 && (
        <Stratosphere clouds={clouds} opacity={opacities.stratosphere} />
      )}

      {/* Troposphere Layer - Ground scene with buildings, trees, etc. */}
      {/* Only render when user has scrolled past section 5.5 */}
      {progress >= 5.5 && (
        <Troposphere
          houses={houses}
          trees={trees}
          bushes={bushes}
          rocks={rocks}
          flowers={flowers}
          opacity={opacities.troposphere}
        />
      )}
    </>
  );
}

/**
 * Memoization Strategy:
 * - Only re-render when data arrays or opacity values change significantly
 * - Opacity changes of < 0.01 are ignored to reduce re-renders
 * - Data arrays use reference equality (handled by useMemo in parent)
 */
export const SceneLayerManager = memo(
  SceneLayerManagerComponent,
  (prevProps, nextProps) => {
    // Check if data arrays changed (reference equality from useMemo)
    const dataUnchanged = (
      prevProps.particles === nextProps.particles &&
      prevProps.clouds === nextProps.clouds &&
      prevProps.houses === nextProps.houses &&
      prevProps.trees === nextProps.trees &&
      prevProps.bushes === nextProps.bushes &&
      prevProps.rocks === nextProps.rocks &&
      prevProps.flowers === nextProps.flowers
    );

    // Check if opacity values changed significantly (> 0.01)
    const opacitiesUnchanged = (
      Math.abs(prevProps.opacities.exosphere - nextProps.opacities.exosphere) < 0.01 &&
      Math.abs(prevProps.opacities.thermosphere - nextProps.opacities.thermosphere) < 0.01 &&
      Math.abs(prevProps.opacities.mesosphere - nextProps.opacities.mesosphere) < 0.01 &&
      Math.abs(prevProps.opacities.stratosphere - nextProps.opacities.stratosphere) < 0.01 &&
      Math.abs(prevProps.opacities.troposphere - nextProps.opacities.troposphere) < 0.01
    );

    // Check other values
    const otherValuesUnchanged = (
      prevProps.phase === nextProps.phase &&
      Math.abs(prevProps.intensity - nextProps.intensity) < 0.01 &&
      Math.abs(prevProps.progress - nextProps.progress) < 0.01 &&
      prevProps.particleCount === nextProps.particleCount
    );

    return dataUnchanged && opacitiesUnchanged && otherValuesUnchanged;
  }
);

SceneLayerManager.displayName = 'SceneLayerManager';
