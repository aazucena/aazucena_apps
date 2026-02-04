/**
 * Rock Ground Object
 * Simple rock using dodecahedron geometry
 */

import type { JSX } from 'react';
import type { SceneObjectConfig } from '../types';

interface RockProps {
  opacity: number;
  config?: SceneObjectConfig;
}

/**
 * Rock Component
 * Renders an irregular rock shape
 */
export function Rock({ opacity }: RockProps): JSX.Element {
  return (
    <mesh castShadow receiveShadow>
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
