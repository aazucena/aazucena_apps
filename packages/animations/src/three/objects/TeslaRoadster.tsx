/**
 * Tesla Roadster Easter Egg
 * Starman in the red car (Thermosphere)
 */

import type { JSX } from 'react';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import { applyAnimation } from '@aazucena/utils';

interface TeslaRoadsterProps {
  opacity: number;
}

export function TeslaRoadster({ opacity }: TeslaRoadsterProps): JSX.Element {
  const carRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    // Tumbling drift
    applyAnimation(carRef, time, {
      rotationOscillation: {
        y: { frequency: 0.05, amplitude: Math.PI * 2 },
        z: { frequency: 0.02, amplitude: 0.5 },
      },
      positionWave: {
        base: { x: 0, y: 0, z: 0 },
        y: { frequency: 0.1, amplitude: 0.5 },
      },
    });
  });

  return (
    <group ref={carRef}>
      {/* Car Body (Simplified) */}
      <mesh castShadow>
        <boxGeometry args={[1.5, 0.4, 0.8]} />
        <meshStandardMaterial
          color="#991b1b"
          transparent
          opacity={opacity}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Cockpit area */}
      <mesh position={[-0.1, 0.3, 0]} castShadow>
        <boxGeometry args={[0.8, 0.3, 0.7]} />
        <meshStandardMaterial color="#0f172a" transparent opacity={opacity * 0.5} />
      </mesh>

      {/* Wheels */}
      {([
        [0.5, 0.4],
        [0.5, -0.4],
        [-0.5, 0.4],
        [-0.5, -0.4],
      ] as const).map((pos, i) => (
        <mesh key={i} position={[pos[0], -0.1, pos[1]]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.2, 0.2, 0.1, 8]} />
          <meshStandardMaterial color="#1e293b" transparent opacity={opacity} />
        </mesh>
      ))}

      {/* Starman (White capsule figure) */}
      <group position={[0, 0.4, 0]} scale={[0.3, 0.3, 0.3]}>
        {/* Helmet */}
        <mesh position={[0, 0.8, 0]}>
          <sphereGeometry args={[0.5, 8, 8]} />
          <meshStandardMaterial color="#f1f5f9" transparent opacity={opacity} />
        </mesh>
        {/* Body */}
        <mesh position={[0, 0, 0]}>
          <capsuleGeometry args={[0.4, 1, 4, 8]} />
          <meshStandardMaterial color="#f1f5f9" transparent opacity={opacity} />
        </mesh>
      </group>
    </group>
  );
}
