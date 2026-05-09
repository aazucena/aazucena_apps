/**
 * Troposphere Layer (INTEGRATED with Scene Objects System)
 * Ground scene with land, houses, trees, bushes, rocks, flowers and flying easter eggs
 *
 * BEFORE: 288 lines with inline easter egg definitions
 * AFTER: ~115 lines using SceneObjectManager
 * REDUCTION: 173 lines removed (60% smaller!)
 */

import type { JSX } from 'react';
import { memo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import { Ground, House, Tree, Bush, Rock, Flower } from '../objects/index';
import type { HouseData, TreeData, BushData, RockData, FlowerData } from '@aazucena/types';
import { SceneObjectManager } from '../objects/index';
import { troposphereObjects } from '../data/objects';

export interface TroposphereProps {
  houses: HouseData[];
  trees: TreeData[];
  bushes: BushData[];
  rocks: RockData[];
  flowers: FlowerData[];
  opacity: number;
}

const DRIFT_SPEED = 0.007;

function TroposphereComponent({
  houses,
  trees,
  bushes,
  rocks,
  flowers,
  opacity,
}: TroposphereProps): JSX.Element {
  const sceneRef = useRef<Group>(null);

  useFrame((_, delta) => {
    if (!sceneRef.current) return;
    sceneRef.current.rotation.y += delta * DRIFT_SPEED;
    sceneRef.current.rotation.y %= Math.PI * 2;
  });

  return (
    <group ref={sceneRef}>
      {/* Ground plane */}
      <Ground opacity={opacity} />

      {/* Ground objects (procedurally generated) */}
      {houses.map((house, i) => (
        <House key={`house-${i}`} {...house} opacity={opacity} />
      ))}

      {trees.map((tree, i) => (
        <Tree key={`tree-${i}`} {...tree} opacity={opacity} />
      ))}

      {bushes.map((bush, i) => (
        <Bush key={`bush-${i}`} {...bush} opacity={opacity} />
      ))}

      {rocks.map((rock, i) => (
        <Rock key={`rock-${i}`} {...rock} opacity={opacity} />
      ))}

      {flowers.map((flower, i) => (
        <Flower key={`flower-${i}`} {...flower} opacity={opacity} />
      ))}

      {/* Easter Eggs via SceneObjectManager */}
      <SceneObjectManager
        objects={troposphereObjects.easterEggs}
        opacity={opacity}
        categoryFilter={['easter-egg']}
      />
    </group>
  );
}

/**
 * Memoized Troposphere component
 * Only re-renders when ground object data or opacity change
 */
export const Troposphere = memo(TroposphereComponent, (prevProps, nextProps) => {
  // Return true if props are equal (skip re-render)
  return (
    prevProps.houses === nextProps.houses &&
    prevProps.trees === nextProps.trees &&
    prevProps.bushes === nextProps.bushes &&
    prevProps.rocks === nextProps.rocks &&
    prevProps.flowers === nextProps.flowers &&
    Math.abs(prevProps.opacity - nextProps.opacity) < 0.01
  );
});

Troposphere.displayName = 'Troposphere';
