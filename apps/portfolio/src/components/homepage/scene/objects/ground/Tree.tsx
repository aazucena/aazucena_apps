/**
 * Tree Ground Object
 * Simple tree with trunk and foliage
 */

import type { JSX } from 'react';
import type { SceneObjectConfig } from '../types';

interface TreeProps {
  opacity: number;
  config?: SceneObjectConfig;
}

/**
 * Tree Component
 * Renders a simple tree with brown trunk and green foliage
 */
export function Tree({ opacity }: TreeProps): JSX.Element {
  return (
    <group>
      {/* Tree trunk */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.15, 1, 8]} />
        <meshStandardMaterial color="#654321" transparent opacity={opacity} />
      </mesh>

      {/* Tree foliage */}
      <mesh position={[0, 1.3, 0]} castShadow>
        <coneGeometry args={[0.5, 1, 8]} />
        <meshStandardMaterial color="#228B22" transparent opacity={opacity} />
      </mesh>
    </group>
  );
}
