/**
 * Supersonic Transport Easter Egg
 * Concorde-style needle-nose jet (Stratosphere)
 */

import type { JSX } from 'react';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import { applyAnimation } from '@aazucena/utils';

interface SupersonicTransportProps {
  opacity: number;
}

export function SupersonicTransport({ opacity }: SupersonicTransportProps): JSX.Element {
  const jetRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    // Fast, stable flight
    applyAnimation(jetRef, time, {
      rotationOscillation: { z: { frequency: 0.1, amplitude: 0.02 } },
      positionWave: {
        base: { x: 0, y: 0, z: 0 },
        y: { frequency: 0.2, amplitude: 0.05 },
      },
    });
  });

  return (
    <group ref={jetRef}>
      {/* Long needle fuselage */}
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.25, 6, 12]} />
        <meshStandardMaterial color="#f8fafc" transparent opacity={opacity} metalness={0.6} />
      </mesh>

      {/* Droop nose */}
      <mesh position={[0, -0.05, 3.2]} rotation={[Math.PI / 2 + 0.1, 0, 0]} castShadow>
        <coneGeometry args={[0.15, 1, 12]} />
        <meshStandardMaterial color="#e2e8f0" transparent opacity={opacity} />
      </mesh>

      {/* Delta Wing */}
      <mesh position={[0, -0.1, -0.5]} rotation={[0, 0, 0]} castShadow>
        <boxGeometry args={[3, 0.05, 3.5]} />
        {/* Note: This is a simplified box delta wing, in real low-poly we could use a custom buffer geometry but box works for primitive style */}
        <meshStandardMaterial color="#f1f5f9" transparent opacity={opacity} />
      </mesh>

      {/* Vertical Stabilizer */}
      <mesh position={[0, 0.6, -2.5]} castShadow>
        <boxGeometry args={[0.02, 1.2, 1]} />
        <meshStandardMaterial color="#cbd5e1" transparent opacity={opacity} />
      </mesh>

      {/* 4 Engines under wings */}
      {([
        [-0.6, -0.3],
        [-0.3, -0.3],
        [0.3, -0.3],
        [0.6, -0.3],
      ] as const).map((pos, i) => (
        <mesh key={i} position={[pos[0], pos[1], -1.5]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.12, 0.15, 0.8, 8]} />
          <meshStandardMaterial color="#475569" transparent opacity={opacity} />
        </mesh>
      ))}
    </group>
  );
}
