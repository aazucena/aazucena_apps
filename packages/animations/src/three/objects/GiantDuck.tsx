/**
 * Giant Rubber Duck Easter Egg
 * Enhanced iconic bath toy silhouette (Troposphere)
 */

import type { JSX } from 'react';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import { applyAnimation } from '@aazucena/utils';

interface GiantDuckProps {
  opacity: number;
}

export function GiantDuck({ opacity }: GiantDuckProps): JSX.Element {
  const duckRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    applyAnimation(duckRef, time, {
      rotationOscillation: {
        z: { frequency: 0.4, amplitude: 0.15 }, // Playful waddle
        y: { frequency: 0.1, amplitude: 0.3 },
      },
      positionWave: {
        base: { x: 0, y: 0, z: 0 },
        y: { frequency: 0.3, amplitude: 0.4 },
      },
    });
  });

  return (
    <group ref={duckRef}>
      {/* MAIN BODY (Squashed sphere) */}
      <mesh castShadow>
        <sphereGeometry args={[1, 32, 32]} scale={[1.3, 0.9, 1.1]} />
        <meshStandardMaterial color="#fcd34d" transparent opacity={opacity} roughness={0.3} />
      </mesh>

      {/* WINGS (On sides) */}
      {[1, -1].map((side) => (
        <mesh key={side} position={[0, 0, side * 0.55]} rotation={[0.2 * side, 0, 0]} castShadow>
          <sphereGeometry args={[0.5, 16, 16]} scale={[1, 0.6, 0.2]} />
          <meshStandardMaterial color="#fbbf24" transparent opacity={opacity} />
        </mesh>
      ))}

      {/* NECK */}
      <mesh position={[0.7, 0.5, 0]} rotation={[0, 0, -0.4]} castShadow>
        <cylinderGeometry args={[0.3, 0.4, 0.8, 16]} />
        <meshStandardMaterial color="#fcd34d" transparent opacity={opacity} />
      </mesh>

      {/* HEAD */}
      <group position={[1, 1.2, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.55, 20, 20]} />
          <meshStandardMaterial color="#fcd34d" transparent opacity={opacity} />
        </mesh>

        {/* EYES (Properly positioned on the exterior) */}
        {[0.35, -0.35].map((z, i) => (
          <group key={i} position={[0.3, 0.1, z]}>
            <mesh>
              <sphereGeometry args={[0.1, 12, 12]} />
              <meshStandardMaterial color="#0f172a" transparent opacity={opacity} />
            </mesh>
            {/* Eye Shine */}
            <mesh position={[0.06, 0.04, 0.02]}>
              <sphereGeometry args={[0.03, 8, 8]} />
              <meshStandardMaterial color="#ffffff" transparent opacity={opacity} />
            </mesh>
          </group>
        ))}

        {/* BEAK */}
        <group position={[0.45, -0.1, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.5, 0.15, 0.4]} />
            <meshStandardMaterial color="#f97316" transparent opacity={opacity} />
          </mesh>
          <mesh position={[0, -0.1, 0]} castShadow>
            <boxGeometry args={[0.45, 0.1, 0.35]} />
            <meshStandardMaterial color="#ea580c" transparent opacity={opacity} />
          </mesh>
        </group>
      </group>

      {/* TAIL */}
      <mesh position={[-1.1, 0.2, 0]} rotation={[0, 0, -0.6]} castShadow>
        <sphereGeometry args={[0.4, 12, 12]} scale={[1, 0.5, 0.8]} />
        <meshStandardMaterial color="#fcd34d" transparent opacity={opacity} />
      </mesh>
    </group>
  );
}
