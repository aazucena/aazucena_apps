/**
 * Bush Ground Object
 * Simple spherical bush with customizable color
 */

import type { JSX } from 'react';
import type { SceneObjectConfig } from '@aazucena/types';

interface BushProps {
  position?: [number, number, number];
  scale?: number;
  color?: string;
  opacity: number;
  config?: SceneObjectConfig;
}

/**
 * Bush Component
 * Renders a spherical bush
 */
export function Bush({
  position = [0, 0, 0],
  scale = 1,
  color,
  opacity,
  config,
}: BushProps): JSX.Element {
  const bushColor = color || (config?.custom?.color as string) || '#22AA22';

  return (
    <mesh position={position} scale={scale} castShadow>
      <sphereGeometry args={[1, 8, 8]} />
      <meshStandardMaterial color={bushColor} transparent opacity={opacity} roughness={0.8} />
    </mesh>
  );
}
