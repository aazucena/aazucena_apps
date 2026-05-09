/**
 * Flower Ground Object
 * Simple flower with stem and petals
 */

import type { JSX } from 'react';
import type { SceneObjectConfig } from '@aazucena/types';

interface FlowerProps {
  position?: [number, number, number];
  scale?: number;
  color?: string;
  opacity: number;
  config?: SceneObjectConfig;
}

/**
 * Flower Component
 * Renders a flower with green stem and colored petals
 */
export function Flower({
  position = [0, 0, 0],
  scale = 1,
  color,
  opacity,
  config,
}: FlowerProps): JSX.Element {
  const petalColor = color || (config?.custom?.color as string) || '#FF69B4';

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
          color={petalColor}
          emissive={petalColor}
          emissiveIntensity={0.3}
          transparent
          opacity={opacity}
        />
      </mesh>
    </group>
  );
}
