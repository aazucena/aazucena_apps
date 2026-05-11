/**
 * Flying Cow Easter Egg
 * Classic tornado/UFO trope (Stratosphere)
 */

import type { JSX } from 'react';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import { applyAnimation } from '@aazucena/utils';

interface FlyingCowProps {
  opacity: number;
}

export function FlyingCow({ opacity }: FlyingCowProps): JSX.Element {
  const cowRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    // Slow, helpless tumbling
    applyAnimation(cowRef, time, {
      rotationOscillation: {
        x: { frequency: 0.1, amplitude: Math.PI },
        z: { frequency: 0.05, amplitude: Math.PI },
      },
      positionWave: {
        base: { x: 0, y: 0, z: 0 },
        y: { frequency: 0.2, amplitude: 0.5 },
      },
    });
  });

  return (
    <group ref={cowRef}>
      {/* Cow Body (Boxy low poly) */}
      <mesh castShadow>
        <boxGeometry args={[1.2, 0.8, 0.6]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={opacity} />
      </mesh>

      {/* Spots (Flat boxes) */}
      {[
        [0.2, 0.4, 0.31],
        [-0.3, -0.2, 0.31],
        [0.4, 0, -0.31],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <boxGeometry args={[0.3, 0.3, 0.01]} />
          <meshStandardMaterial color="#000000" transparent opacity={opacity} />
        </mesh>
      ))}

      {/* Head */}
      <mesh position={[0.8, 0.3, 0]} castShadow>
        <boxGeometry args={[0.5, 0.5, 0.4]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={opacity} />
      </mesh>

      {/* Legs (Dangling) */}
      {(
        [
          [0.4, 0.2],
          [0.4, -0.2],
          [-0.4, 0.2],
          [-0.4, -0.2],
        ] as const
      ).map((pos, i) => (
        <mesh key={i} position={[pos[0], -0.6, pos[1]]} rotation={[0.2, 0, 0]} castShadow>
          <boxGeometry args={[0.1, 0.6, 0.1]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={opacity} />
        </mesh>
      ))}

      {/* Moo (Visual representation: tiny tail) */}
      <mesh position={[-0.6, 0.2, 0]} rotation={[0, 0, -0.5]}>
        <boxGeometry args={[0.4, 0.05, 0.05]} />
        <meshStandardMaterial color="#000000" transparent opacity={opacity} />
      </mesh>
    </group>
  );
}
