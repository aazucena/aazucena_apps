/**
 * Astronaut Easter Egg
 * Astronaut on spacewalk with floating/tumbling animation (Thermosphere)
 */

import type { JSX } from 'react';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import { applyAnimation, applyCircularMotion } from '~/lib/utils/scene';
import type { SceneObjectConfig } from '../types';

interface AstronautProps {
  opacity: number;
  config?: SceneObjectConfig;
}

export function Astronaut({ opacity }: AstronautProps): JSX.Element {
  const astronautRef = useRef<Group>(null);

  // Animate astronaut with floating/tumbling motion
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    applyAnimation(astronautRef, time, {
      rotation: { x: 0.2, z: 0.15 }
    });

    applyCircularMotion(astronautRef, time, {
      base: { x: 0, y: 0, z: 0 },
      x: { frequency: 0.3, amplitude: 0.2 },
      y: { frequency: 0.5, amplitude: 0.4 }
    });
  });

  return (
    <group ref={astronautRef}>
      {/* Helmet */}
      <mesh position={[0, 0.6, 0]}>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshStandardMaterial
          color="#e0f2fe"
          transparent
          opacity={0.8 * opacity}
          metalness={0.3}
          roughness={0.1}
        />
      </mesh>

      {/* Head/face */}
      <mesh position={[0, 0.6, 0.1]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial
          color="#fcd34d"
          emissive="#fbbf24"
          emissiveIntensity={0.3}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Body */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.35, 0.4, 1, 16]} />
        <meshStandardMaterial
          color="#f1f5f9"
          metalness={0.4}
          roughness={0.5}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Backpack */}
      <mesh position={[0, 0, -0.5]}>
        <boxGeometry args={[0.7, 0.8, 0.3]} />
        <meshStandardMaterial
          color="#64748b"
          metalness={0.6}
          roughness={0.4}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Arms */}
      <mesh position={[-0.5, 0, 0]} rotation={[0, 0, Math.PI / 6]}>
        <cylinderGeometry args={[0.12, 0.12, 0.8, 8]} />
        <meshStandardMaterial
          color="#e2e8f0"
          metalness={0.4}
          roughness={0.5}
          transparent
          opacity={opacity}
        />
      </mesh>
      <mesh position={[0.5, 0, 0]} rotation={[0, 0, -Math.PI / 6]}>
        <cylinderGeometry args={[0.12, 0.12, 0.8, 8]} />
        <meshStandardMaterial
          color="#e2e8f0"
          metalness={0.4}
          roughness={0.5}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Legs */}
      <mesh position={[-0.2, -0.8, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.8, 8]} />
        <meshStandardMaterial
          color="#cbd5e1"
          metalness={0.4}
          roughness={0.5}
          transparent
          opacity={opacity}
        />
      </mesh>
      <mesh position={[0.2, -0.8, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.8, 8]} />
        <meshStandardMaterial
          color="#cbd5e1"
          metalness={0.4}
          roughness={0.5}
          transparent
          opacity={opacity}
        />
      </mesh>
    </group>
  );
}
