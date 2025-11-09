/**
 * Bush Component
 * Renders a simple spherical bush
 */

import type { JSX } from 'react';
import type { BushData } from '../../config';

interface BushProps extends BushData {
  opacity: number;
}

export function Bush({ position, scale, color, opacity }: BushProps): JSX.Element {
  return (
    <mesh position={position} scale={scale} castShadow>
      <sphereGeometry args={[1, 8, 8]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={opacity}
        roughness={0.8}
      />
    </mesh>
  );
}
