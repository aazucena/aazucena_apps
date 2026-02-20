/**
 * House Ground Object
 * Simple house structure for Troposphere ground scene
 */

import type { JSX } from "react";
import type { SceneObjectConfig } from "../types";

interface HouseProps {
  opacity: number;
  config?: SceneObjectConfig;
}

/**
 * House Component
 * Simple house with walls, roof, door, and windows
 */
export function House({ opacity, config }: HouseProps): JSX.Element {
  // Use color from config or default
  const color = (config?.custom?.color as string) || "#8B4513";
  const roofColor = (config?.custom?.roofColor as string) || "#654321";

  return (
    <group>
      {/* Walls */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color={color}
          roughness={0.8}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Roof */}
      <mesh position={[0, 1.2, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[0.85, 0.6, 4]} />
        <meshStandardMaterial
          color={roofColor}
          roughness={0.7}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Door */}
      <mesh position={[0, 0.35, 0.51]}>
        <boxGeometry args={[0.3, 0.6, 0.02]} />
        <meshStandardMaterial
          color="#654321"
          roughness={0.9}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Windows */}
      <mesh position={[-0.3, 0.6, 0.51]}>
        <boxGeometry args={[0.2, 0.2, 0.02]} />
        <meshStandardMaterial
          color="#87CEEB"
          transparent
          opacity={0.7 * opacity}
          emissive="#87CEEB"
          emissiveIntensity={0.2}
        />
      </mesh>
      <mesh position={[0.3, 0.6, 0.51]}>
        <boxGeometry args={[0.2, 0.2, 0.02]} />
        <meshStandardMaterial
          color="#87CEEB"
          transparent
          opacity={0.7 * opacity}
          emissive="#87CEEB"
          emissiveIntensity={0.2}
        />
      </mesh>
    </group>
  );
}
