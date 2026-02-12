/**
 * Flower Ground Object
 * Simple flower with stem and petals
 */

import type { JSX } from 'react';
import type { SceneObjectConfig } from '@aazucena/types';

interface FlowerProps {
  opacity: number;
  config?: SceneObjectConfig;
}

/**
 * Flower Component
 * Renders a flower with green stem and colored petals
 */
export function Flower({ opacity, config }: FlowerProps): JSX.Element {
  // Use color from config or default colors
  const color = (config?.custom?.color as string) || '#FF69B4';

  return (
    <group>
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
