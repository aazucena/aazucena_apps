/**
 * Airplane Easter Egg
 * Commercial airplane with cruising flight path (Troposphere)
 */

import type { JSX } from 'react';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import { applyAnimation } from '@aazucena/utils';
import type { SceneObjectConfig } from '@aazucena/types';

interface AirplaneProps {
  opacity: number;
  config?: SceneObjectConfig;
}

export function Airplane({ opacity }: AirplaneProps): JSX.Element {
  const airplaneRef = useRef<Group>(null);

  // Animate airplane with cruising flight path and gentle banking
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    applyAnimation(airplaneRef, time, {
      rotationOscillation: { z: { frequency: 0.2, amplitude: 0.1 } },
      positionWave: {
        base: { x: 0, y: 0, z: 0 },
        x: { frequency: 0.2, amplitude: 3 },
        y: { frequency: 0.15, amplitude: 0.3 },
      },
    });
  });

  return (
    <group ref={airplaneRef}>
      {/* Fuselage */}
      <mesh>
        <cylinderGeometry args={[0.3, 0.3, 4, 16]} />
        <meshStandardMaterial
          color="#f1f5f9"
          metalness={0.6}
          roughness={0.3}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Nose */}
      <mesh position={[0, 2.3, 0]}>
        <coneGeometry args={[0.3, 0.6, 16]} />
        <meshStandardMaterial
          color="#e2e8f0"
          metalness={0.7}
          roughness={0.2}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Wings */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.15, 0.5, 4.5]} />
        <meshStandardMaterial
          color="#cbd5e1"
          metalness={0.6}
          roughness={0.3}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Tail wing */}
      <mesh position={[0, -1.8, 0]}>
        <boxGeometry args={[0.15, 0.3, 1.5]} />
        <meshStandardMaterial
          color="#94a3b8"
          metalness={0.5}
          roughness={0.4}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Vertical stabilizer */}
      <mesh position={[0.5, -1.8, 0]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.15, 1, 0.8]} />
        <meshStandardMaterial
          color="#64748b"
          metalness={0.5}
          roughness={0.4}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Engines */}
      <mesh position={[0, 0.3, -1.5]}>
        <cylinderGeometry args={[0.2, 0.25, 0.6, 16]} />
        <meshStandardMaterial
          color="#475569"
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={opacity}
        />
      </mesh>
      <mesh position={[0, 0.3, 1.5]}>
        <cylinderGeometry args={[0.2, 0.25, 0.6, 16]} />
        <meshStandardMaterial
          color="#475569"
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Windows */}
      {[0, 0.5, 1, 1.5].map((pos, i) => (
        <mesh key={i} position={[0, pos, 0.31]}>
          <circleGeometry args={[0.08, 8]} />
          <meshStandardMaterial
            color="#3b82f6"
            emissive="#1e40af"
            emissiveIntensity={0.3}
            transparent
            opacity={opacity}
          />
        </mesh>
      ))}
    </group>
  );
}
