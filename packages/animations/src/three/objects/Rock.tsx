/**
 * Rock Ground Object
 * Simple rock using dodecahedron geometry
 */

import type { JSX } from 'react';
import type { SceneObjectConfig } from '@aazucena/types';

interface RockProps {
  position?: [number, number, number];
  scale?: number;
  rotation?: [number, number, number];
  opacity: number;
  config?: SceneObjectConfig;
}

/**
 * Rock Component
 * Renders an irregular rock shape
 */
export function Rock({
  position = [0, 0, 0],
  scale = 1,
  rotation = [0, 0, 0],
  opacity,
}: RockProps): JSX.Element {
  return (
    <mesh position={position} scale={scale} rotation={rotation} castShadow receiveShadow>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color="#808080"
        transparent
        opacity={opacity}
        roughness={0.9}
        metalness={0.1}
      />
    </mesh>
  );
}
