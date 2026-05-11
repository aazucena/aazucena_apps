/**
 * GPS Satellite Easter Egg
 * Medium Earth Orbit navigational satellite (Exosphere)
 */

import type { JSX } from 'react';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import { applyAnimation } from '@aazucena/utils';

interface GPSSatelliteProps {
  opacity: number;
}

export function GPSSatellite({ opacity }: GPSSatelliteProps): JSX.Element {
  const satRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    // Stable orbital orientation
    applyAnimation(satRef, time, {
      rotationOscillation: { x: { frequency: 0.05, amplitude: 0.1 } },
      positionWave: {
        base: { x: 0, y: 0, z: 0 },
        y: { frequency: 0.1, amplitude: 0.5 },
      },
    });
  });

  return (
    <group ref={satRef}>
      {/* Central Box body */}
      <mesh castShadow>
        <boxGeometry args={[1, 1.2, 1]} />
        <meshStandardMaterial color="#cbd5e1" transparent opacity={opacity} metalness={0.7} />
      </mesh>

      {/* Solar Wings (Very long) */}
      {[1, -1].map((side) => (
        <mesh key={side} position={[side * 3, 0, 0]} castShadow>
          <boxGeometry args={[4, 0.8, 0.05]} />
          <meshStandardMaterial
            color="#1d4ed8"
            emissive="#1e40af"
            emissiveIntensity={0.2}
            transparent
            opacity={opacity}
          />
        </mesh>
      ))}

      {/* Earth-facing antenna array */}
      <group position={[0, -0.6, 0]}>
        {(
          [
            [-0.2, -0.2],
            [0.2, -0.2],
            [-0.2, 0.2],
            [0.2, 0.2],
            [0, 0],
          ] as const
        ).map((pos, i) => (
          <mesh key={i} position={[pos[0], -0.2, pos[1]]} castShadow>
            <cylinderGeometry args={[0.1, 0.1, 0.4, 8]} />
            <meshStandardMaterial color="#94a3b8" transparent opacity={opacity} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
