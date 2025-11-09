/**
 * House Component
 * Renders a simple house with roof, door, and windows
 */

import type { JSX } from 'react';
import type { HouseData } from '../../config';

interface HouseProps extends HouseData {
  opacity: number;
}

export function House({ position, rotation, scale, color, opacity }: HouseProps): JSX.Element {
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      {/* House Base */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={color} transparent opacity={opacity} />
      </mesh>

      {/* Roof - rotated 45 degrees to align with box edges */}
      <mesh position={[0, 1.3, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[0.8, 0.6, 4]} />
        <meshStandardMaterial color="#8B4513" transparent opacity={opacity} />
      </mesh>

      {/* Door */}
      <mesh position={[0, 0.3, 0.51]} castShadow>
        <boxGeometry args={[0.3, 0.6, 0.05]} />
        <meshStandardMaterial color="#654321" transparent opacity={opacity} />
      </mesh>

      {/* Window 1 */}
      <mesh position={[-0.3, 0.6, 0.51]} castShadow>
        <boxGeometry args={[0.2, 0.2, 0.05]} />
        <meshStandardMaterial
          color="#87CEEB"
          emissive="#FFFF99"
          emissiveIntensity={0.3}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Window 2 */}
      <mesh position={[0.3, 0.6, 0.51]} castShadow>
        <boxGeometry args={[0.2, 0.2, 0.05]} />
        <meshStandardMaterial
          color="#87CEEB"
          emissive="#FFFF99"
          emissiveIntensity={0.3}
          transparent
          opacity={opacity}
        />
      </mesh>
    </group>
  );
}
