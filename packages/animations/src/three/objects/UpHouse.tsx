/**
 * "Up" House Easter Egg
 * Small house lifted by thousands of balloons (Stratosphere)
 */

import type { JSX } from 'react';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import { applyAnimation } from '@aazucena/utils';

interface UpHouseProps {
  opacity: number;
}

export function UpHouse({ opacity }: UpHouseProps): JSX.Element {
  const groupRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    applyAnimation(groupRef, time, {
      rotationOscillation: { y: { frequency: 0.05, amplitude: 0.3 } },
      positionWave: {
        base: { x: 0, y: 0, z: 0 },
        y: { frequency: 0.1, amplitude: 0.5 },
      },
    });
  });

  const colors = ['#ef4444', '#3b82f6', '#fbbf24', '#22c55e', '#a855f7', '#f97316', '#ec4899'];

  return (
    <group ref={groupRef}>
      {/* The Small House */}
      <group scale={[0.5, 0.5, 0.5]}>
        {/* House Body */}
        <mesh castShadow>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#fcd34d" transparent opacity={opacity} />
        </mesh>
        {/* Roof */}
        <mesh position={[0, 0.75, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <coneGeometry args={[0.8, 0.6, 4]} />
          <meshStandardMaterial color="#b91c1c" transparent opacity={opacity} />
        </mesh>
        {/* Chimney where balloons erupt */}
        <mesh position={[0.3, 0.6, 0]} castShadow>
          <boxGeometry args={[0.15, 0.4, 0.15]} />
          <meshStandardMaterial color="#92400e" transparent opacity={opacity} />
        </mesh>
      </group>

      {/* Massive Balloon Cloud */}
      <group position={[0, 1.5, 0]}>
        {[...Array(40)].map((_, i) => {
          const radius = 0.8 + Math.random() * 0.7;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.random() * Math.PI;

          const x = radius * Math.sin(phi) * Math.cos(theta);
          const y = radius * Math.sin(phi) * Math.sin(theta) + 0.5;
          const z = radius * Math.cos(phi);

          return (
            <mesh key={i} position={[x, y, z]} castShadow>
              <sphereGeometry args={[0.2, 8, 8]} />
              <meshStandardMaterial
                color={colors[i % colors.length]}
                transparent
                opacity={opacity}
              />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}
