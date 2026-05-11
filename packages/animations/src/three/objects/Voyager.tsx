/**
 * Voyager Probe Easter Egg
 * Deep space explorer (Exosphere)
 */

import type { JSX } from 'react';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import { applyAnimation } from '@aazucena/utils';

interface VoyagerProps {
  opacity: number;
}

export function Voyager({ opacity }: VoyagerProps): JSX.Element {
  const voyagerRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    // Slow drifting away
    applyAnimation(voyagerRef, time, {
      rotationOscillation: {
        y: { frequency: 0.05, amplitude: 0.2 },
        z: { frequency: 0.02, amplitude: 0.1 },
      },
      positionWave: {
        base: { x: 0, y: 0, z: 0 },
        z: { frequency: 0.01, amplitude: 5 }, // Moving away/towards on deep Z
      },
    });
  });

  return (
    <group ref={voyagerRef}>
      {/* High-gain antenna (Big white dish) */}
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <coneGeometry args={[1.8, 0.4, 32, 1, true]} />
        <meshStandardMaterial color="#f8fafc" transparent opacity={opacity} />
      </mesh>

      {/* Main spacecraft bus (Cylinder under dish) */}
      <mesh position={[0, -0.5, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.8, 0.8, 0.6, 10]} />
        <meshStandardMaterial color="#475569" transparent opacity={opacity} metalness={0.5} />
      </mesh>

      {/* RTG Booms (Nuclear power source) */}
      <mesh position={[-2, -0.5, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 3, 4]} />
        <meshStandardMaterial color="#1e293b" transparent opacity={opacity} />
      </mesh>
      {/* RTG canisters */}
      <mesh position={[-3.2, -0.5, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.8, 8]} />
        <meshStandardMaterial color="#0f172a" transparent opacity={opacity} />
      </mesh>

      {/* Magnetometer boom (The long one) */}
      <mesh position={[0, -0.5, -4]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 8, 4]} />
        <meshStandardMaterial color="#475569" transparent opacity={opacity} />
      </mesh>

      {/* Science instrument boom */}
      <mesh position={[1.5, 0.5, 0]} rotation={[0, 0, -0.5]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 2, 4]} />
        <meshStandardMaterial color="#1e293b" transparent opacity={opacity} />
      </mesh>
    </group>
  );
}
