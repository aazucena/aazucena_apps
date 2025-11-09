/**
 * Flower Component
 * Renders a simple flower with stem and petals
 */

import type { JSX } from 'react';
import type { FlowerData } from '../../config';

interface FlowerProps extends FlowerData {
  opacity: number;
}

export function Flower({ position, scale, color, opacity }: FlowerProps): JSX.Element {
  return (
    <group position={position} scale={scale}>
      {/* Flower stem */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.3, 4]} />
        <meshStandardMaterial color="#228B22" transparent opacity={opacity} />
      </mesh>

      {/* Flower petals */}
      <mesh position={[0, 0.3, 0]}>
        <sphereGeometry args={[0.15, 6, 6]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
          transparent
          opacity={opacity}
        />
      </mesh>
    </group>
  );
}
