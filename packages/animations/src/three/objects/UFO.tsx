/**
 * UFO Easter Egg
 * Flying saucer with lights and wobbling motion (Exosphere)
 */

import type { JSX } from 'react';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import { applyAnimation, applyCircularMotion } from '@aazucena/utils';
import type { SceneObjectConfig } from '@aazucena/types';

interface UFOProps {
  opacity: number;
  config?: SceneObjectConfig;
}

export function UFO({ opacity }: UFOProps): JSX.Element {
  const ufoRef = useRef<Group>(null);

  // Animate UFO with wobbling motion and circular path
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    applyAnimation(ufoRef, time, {
      rotation: { y: 0.5 },
      rotationOscillation: { x: { frequency: 0.8, amplitude: 0.15 } },
    });

    applyCircularMotion(ufoRef, time, {
      base: { x: 0, y: 0, z: 0 },
      x: { frequency: 0.4, amplitude: 0.2 },
      y: { frequency: 0.6, amplitude: 0.3 },
    });
  });

  return (
    <group ref={ufoRef}>
      {/* Bottom saucer */}
      <mesh>
        <cylinderGeometry args={[0.8, 1, 0.2, 32]} />
        <meshStandardMaterial
          color="#6366f1"
          metalness={0.8}
          roughness={0.2}
          emissive="#4f46e5"
          emissiveIntensity={0.3}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Middle ring to connect dome and saucer */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.5, 0.8, 0.05, 32]} />
        <meshStandardMaterial
          color="#5b21b6"
          metalness={0.85}
          roughness={0.15}
          emissive="#7c3aed"
          emissiveIntensity={0.4}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Top dome - sits flush on the ring */}
      <mesh position={[0, 0.125, 0]}>
        <sphereGeometry args={[0.5, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color="#22d3ee"
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={0.7 * opacity}
          emissive="#06b6d4"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Lights around the edge */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const angle = (i / 8) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(angle) * 0.9, -0.1, Math.sin(angle) * 0.9]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? '#fbbf24' : '#22c55e'}
              emissive={i % 2 === 0 ? '#fbbf24' : '#22c55e'}
              emissiveIntensity={1.5}
              transparent
              opacity={opacity}
            />
          </mesh>
        );
      })}
    </group>
  );
}
