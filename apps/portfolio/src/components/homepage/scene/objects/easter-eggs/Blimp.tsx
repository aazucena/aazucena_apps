/**
 * Blimp Easter Egg
 * Zeppelin-style blimp (Stratosphere)
 */

import type { JSX } from 'react';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import { applyAnimation } from '~/lib/utils/scene';
import type { SceneObjectConfig } from '../types';

interface BlimpProps {
  opacity: number;
  config?: SceneObjectConfig;
}

export function Blimp({ opacity }: BlimpProps): JSX.Element {
  const blimpRef = useRef<Group>(null);

  // Animate blimp with slow cruise and gentle drift
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    applyAnimation(blimpRef, time, {
      rotation: { y: 0.05 },
      positionWave: {
        base: { x: 0, y: 0, z: 0 },
        x: { frequency: 0.15, amplitude: 2 }
      }
    });
  });

  return (
    <group ref={blimpRef}>
      {/* Main envelope */}
      <mesh scale={[1, 0.5, 0.5]}>
        <sphereGeometry args={[2, 16, 16]} />
        <meshStandardMaterial
          color="#ef4444"
          metalness={0.3}
          roughness={0.6}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Stripe */}
      <mesh scale={[2.05, 0.3, 0.52]} position={[0, -0.1, 0]}>
        <sphereGeometry args={[1, 16, 8, 0, Math.PI * 2, 0, Math.PI]} />
        <meshStandardMaterial
          color="#fbbf24"
          metalness={0.3}
          roughness={0.6}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Gondola */}
      <mesh position={[0, -0.7, 0]}>
        <boxGeometry args={[0.8, 0.3, 0.3]} />
        <meshStandardMaterial
          color="#cbd5e1"
          metalness={0.5}
          roughness={0.5}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Fins */}
      <mesh position={[-1.8, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <coneGeometry args={[0.3, 0.5, 3]} />
        <meshStandardMaterial
          color="#b91c1c"
          metalness={0.4}
          roughness={0.6}
          transparent
          opacity={opacity}
        />
      </mesh>
      <mesh position={[-1.8, 0.3, 0]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.05, 0.4, 0.3]} />
        <meshStandardMaterial
          color="#991b1b"
          metalness={0.4}
          roughness={0.6}
          transparent
          opacity={opacity}
        />
      </mesh>
    </group>
  );
}
