/**
 * Lawn Chair Balloon Easter Egg
 * Reference to Larry Walters "Lawn Chair Larry" (Troposphere)
 */

import type { JSX } from 'react';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import { applyAnimation } from '@aazucena/utils';

interface LawnChairBalloonProps {
  opacity: number;
}

export function LawnChairBalloon({ opacity }: LawnChairBalloonProps): JSX.Element {
  const groupRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    applyAnimation(groupRef, time, {
      rotationOscillation: { y: { frequency: 0.1, amplitude: 0.2 } },
      positionWave: {
        base: { x: 0, y: 0, z: 0 },
        y: { frequency: 0.2, amplitude: 0.4 },
        x: { frequency: 0.1, amplitude: 0.2 },
      },
    });
  });

  const colors = ['#ef4444', '#3b82f6', '#fbbf24', '#22c55e', '#a855f7'];

  return (
    <group ref={groupRef}>
      {/* The Lawn Chair */}
      <group position={[0, -1, 0]}>
        {/* Seat & Back */}
        <mesh castShadow>
          <boxGeometry args={[0.6, 0.05, 0.6]} />
          <meshStandardMaterial color="#cbd5e1" transparent opacity={opacity} />
        </mesh>
        <mesh position={[0, 0.3, -0.3]} rotation={[0.2, 0, 0]} castShadow>
          <boxGeometry args={[0.6, 0.6, 0.05]} />
          <meshStandardMaterial color="#cbd5e1" transparent opacity={opacity} />
        </mesh>
        {/* Legs */}
        {[[-0.25, -0.3], [0.25, -0.3], [-0.25, 0.3], [0.25, 0.3]].map((pos, i) => (
          <mesh key={i} position={[pos[0], -0.2, pos[1]]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 0.4, 4]} />
            <meshStandardMaterial color="#94a3b8" transparent opacity={opacity} />
          </mesh>
        ))}
      </group>

      {/* Balloon Cluster */}
      <group position={[0, 1, 0]}>
        {[...Array(15)].map((_, i) => {
          const angle = (i / 15) * Math.PI * 2;
          const radius = 0.4 + Math.random() * 0.3;
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;
          const y = Math.random() * 0.8;
          return (
            <group key={i} position={[x, y, z]}>
              <mesh castShadow>
                <sphereGeometry args={[0.25, 12, 12]} />
                <meshStandardMaterial color={colors[i % colors.length]} transparent opacity={opacity} />
              </mesh>
              {/* String */}
              <mesh position={[0, -0.8, 0]}>
                <cylinderGeometry args={[0.002, 0.002, 1.5, 4]} />
                <meshStandardMaterial color="#ffffff" transparent opacity={opacity * 0.5} />
              </mesh>
            </group>
          );
        })}
      </group>
    </group>
  );
}
