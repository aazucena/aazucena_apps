/**
 * Skyscraper Ground Object
 * Urban anchor (Troposphere Ground)
 */

import type { JSX } from 'react';

interface SkyscraperProps {
  opacity: number;
}

export function Skyscraper({ opacity }: SkyscraperProps): JSX.Element {
  return (
    <group>
      {/* Main Building Body */}
      <mesh position={[0, 4, 0]} castShadow>
        <boxGeometry args={[2, 8, 2]} />
        <meshStandardMaterial
          color="#1e293b"
          transparent
          opacity={opacity}
          metalness={0.5}
          roughness={0.2}
        />
      </mesh>

      {/* Spire */}
      <mesh position={[0, 8.5, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.1, 1, 8]} />
        <meshStandardMaterial color="#94a3b8" transparent opacity={opacity} />
      </mesh>

      {/* Windows (Grid of small emissive boxes) */}
      {[1, 2, 3, 4, 5, 6, 7].map((y) =>
        [-0.6, 0, 0.6].map((x) => (
          <mesh key={`${x}-${y}`} position={[x, y + 0.5, 1.01]}>
            <planeGeometry args={[0.3, 0.4]} />
            <meshStandardMaterial
              color="#38bdf8"
              emissive="#0ea5e9"
              emissiveIntensity={0.5}
              transparent
              opacity={opacity * 0.8}
            />
          </mesh>
        )),
      )}
    </group>
  );
}
