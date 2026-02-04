/**
 * Bush Ground Object
 * Simple spherical bush with customizable color
 */

import type { JSX } from 'react';
import type { SceneObjectConfig } from '../types';

interface BushProps {
  opacity: number;
  config?: SceneObjectConfig;
}

/**
 * Bush Component
 * Renders a spherical bush
 */
export function Bush({ opacity, config }: BushProps): JSX.Element {
  // Use color from config or default green
  const color = (config?.custom?.color as string) || '#22AA22';

  return (
    <mesh castShadow>
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
