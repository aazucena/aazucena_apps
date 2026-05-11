/**
 * Utility Pylon Ground Object
 * Electrical infrastructure (Troposphere Ground)
 */

import type { JSX } from 'react';

interface UtilityPylonProps {
  opacity: number;
}

export function UtilityPylon({ opacity }: UtilityPylonProps): JSX.Element {
  return (
    <group>
      {/* 4 Main Legs */}
      {(
        [
          [0.5, 0.5],
          [0.5, -0.5],
          [-0.5, 0.5],
          [-0.5, -0.5],
        ] as const
      ).map((pos, i) => (
        <mesh
          key={i}
          position={[pos[0] * 0.5, 2, pos[1] * 0.5]}
          rotation={[pos[1] * 0.1, 0, -pos[0] * 0.1]}
          castShadow
        >
          <boxGeometry args={[0.05, 4, 0.05]} />
          <meshStandardMaterial color="#64748b" transparent opacity={opacity} metalness={0.8} />
        </mesh>
      ))}

      {/* Cross beams - Lower */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <boxGeometry args={[1.2, 0.05, 0.05]} />
        <meshStandardMaterial color="#475569" transparent opacity={opacity} />
      </mesh>

      {/* Cross beams - Upper */}
      <mesh position={[0, 3, 0]} castShadow>
        <boxGeometry args={[1.8, 0.05, 0.05]} />
        <meshStandardMaterial color="#475569" transparent opacity={opacity} />
      </mesh>

      {/* Vertical Tip */}
      <mesh position={[0, 4.2, 0]} castShadow>
        <boxGeometry args={[0.05, 0.5, 0.05]} />
        <meshStandardMaterial color="#64748b" transparent opacity={opacity} />
      </mesh>

      {/* Insulators (Small hanging cylinders) */}
      {([-0.8, 0, 0.8, -0.5, 0.5] as const).map((x, i) => (
        <mesh key={i} position={[x, i < 3 ? 3 : 1.5, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.3, 6]} />
          <meshStandardMaterial color="#94a3b8" transparent opacity={opacity} />
        </mesh>
      ))}
    </group>
  );
}
