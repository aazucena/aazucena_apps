/**
 * Floating Teapot Easter Egg
 * Reference to Russell's Teapot / Utah Teapot (Mesosphere)
 */

import type { JSX } from 'react';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import { applyAnimation } from '@aazucena/utils';

interface FloatingTeapotProps {
  opacity: number;
}

export function FloatingTeapot({ opacity }: FloatingTeapotProps): JSX.Element {
  const teapotRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    // Smooth slow rotation
    applyAnimation(teapotRef, time, {
      rotationOscillation: { y: { frequency: 0.1, amplitude: Math.PI } },
      positionWave: {
        base: { x: 0, y: 0, z: 0 },
        y: { frequency: 0.2, amplitude: 0.5 },
      },
    });
  });

  return (
    <group ref={teapotRef} scale={[0.8, 0.8, 0.8]}>
      {/* Teapot Body (Simplified) */}
      <mesh castShadow>
        <sphereGeometry args={[0.6, 16, 16]} scale={[1.2, 0.8, 1.2]} />
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={opacity}
          metalness={0.2}
          roughness={0.1}
        />
      </mesh>

      {/* Lid */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <sphereGeometry args={[0.3, 12, 12]} scale={[1, 0.4, 1]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={opacity} />
      </mesh>
      {/* Lid Knob */}
      <mesh position={[0, 0.55, 0]} castShadow>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={opacity} />
      </mesh>

      {/* Spout */}
      <mesh position={[0.8, 0.1, 0]} rotation={[0, 0, -0.8]} castShadow>
        <cylinderGeometry args={[0.05, 0.15, 0.8, 8]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={opacity} />
      </mesh>

      {/* Handle */}
      <mesh position={[-0.7, 0.2, 0]} rotation={[0, 0, 0.5]} castShadow>
        <torusGeometry args={[0.3, 0.05, 8, 16]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={opacity} />
      </mesh>
    </group>
  );
}
