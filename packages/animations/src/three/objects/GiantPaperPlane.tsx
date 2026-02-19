/**
 * Giant Paper Plane Easter Egg
 * Scaled up childhood nostalgia (Troposphere)
 */

import type { JSX } from 'react';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import { applyAnimation } from '@aazucena/utils';

interface GiantPaperPlaneProps {
  opacity: number;
}

export function GiantPaperPlane({ opacity }: GiantPaperPlaneProps): JSX.Element {
  const planeRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    applyAnimation(planeRef, time, {
      rotationOscillation: {
        z: { frequency: 0.5, amplitude: 0.2 }, // Gliding roll
        x: { frequency: 0.2, amplitude: 0.1 }, // Pitch
      },
      positionWave: {
        base: { x: 0, y: 0, z: 0 },
        y: { frequency: 0.4, amplitude: 0.2 },
      },
    });
  });

  return (
    <group ref={planeRef}>
      {/* Central Fold */}
      <mesh castShadow>
        <boxGeometry args={[0.02, 0.4, 3]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={opacity} />
      </mesh>

      {/* Wings (Left) */}
      <mesh position={[-0.8, 0.1, 0]} rotation={[0, 0, -0.2]} castShadow>
        <boxGeometry args={[1.6, 0.01, 2.5]} />
        <meshStandardMaterial color="#f8fafc" transparent opacity={opacity} />
      </mesh>

      {/* Wings (Right) */}
      <mesh position={[0.8, 0.1, 0]} rotation={[0, 0, 0.2]} castShadow>
        <boxGeometry args={[1.6, 0.01, 2.5]} />
        <meshStandardMaterial color="#f8fafc" transparent opacity={opacity} />
      </mesh>

      {/* Pointed Nose */}
      <mesh position={[0, 0, 1.8]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <coneGeometry args={[0.1, 0.6, 4]} />
        <meshStandardMaterial color="#e2e8f0" transparent opacity={opacity} />
      </mesh>
    </group>
  );
}
