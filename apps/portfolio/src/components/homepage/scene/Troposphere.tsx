/**
 * Troposphere Layer (INTEGRATED with Scene Objects System)
 * Ground scene with land, houses, trees, bushes, rocks, flowers and flying easter eggs
 *
 * BEFORE: 288 lines with inline easter egg definitions
 * AFTER: ~115 lines using SceneObjectManager
 * REDUCTION: 173 lines removed (60% smaller!)
 */

import type { JSX } from "react";
import { memo } from "react";
import { Ground, House, Tree, Bush, Rock, Flower } from "./objects/ground";
import type {
  HouseData,
  TreeData,
  BushData,
  RockData,
  FlowerData,
} from "~/config/animations";
import { SceneObjectManager } from "./objects";
import { troposphereObjects } from "~/data/scene/objects";

export interface TroposphereProps {
  houses: HouseData[];
  trees: TreeData[];
  bushes: BushData[];
  rocks: RockData[];
  flowers: FlowerData[];
  opacity: number;
}

function TroposphereComponent({
  houses,
  trees,
  bushes,
  rocks,
  flowers,
  opacity,
}: TroposphereProps): JSX.Element {
  return (
    <group>
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
        categoryFilter={["easter-egg"]}
      />
    </group>
  );
}

/**
 * Memoized Troposphere component
 * Only re-renders when ground object data or opacity change
 */
export const Troposphere = memo(
  TroposphereComponent,
  (prevProps, nextProps) => {
    // Return true if props are equal (skip re-render)
    return (
      prevProps.houses === nextProps.houses &&
      prevProps.trees === nextProps.trees &&
      prevProps.bushes === nextProps.bushes &&
      prevProps.rocks === nextProps.rocks &&
      prevProps.flowers === nextProps.flowers &&
      Math.abs(prevProps.opacity - nextProps.opacity) < 0.01
    );
  },
);

Troposphere.displayName = "Troposphere";
