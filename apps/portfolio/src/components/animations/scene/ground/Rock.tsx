/**
 * Rock Component
 * Renders a simple rock using dodecahedron geometry
 */

import type { JSX } from 'react';
import type { RockData } from '../../config';

interface RockProps extends RockData {
  opacity: number;
}

export function Rock({ position, rotation, scale, opacity }: RockProps): JSX.Element {
  return (
    <mesh
      position={position}
      rotation={rotation}
      scale={scale}
      castShadow
      receiveShadow
    >
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
