/**
 * Soyuz Capsule Easter Egg
 * Human transport blunt-body vehicle (Thermosphere)
 */

import type { JSX } from 'react';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import { applyAnimation } from '@aazucena/utils';

interface SoyuzCapsuleProps {
  opacity: number;
}

export function SoyuzCapsule({ opacity }: SoyuzCapsuleProps): JSX.Element {
  const capsuleRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    
    // Stable drift
    applyAnimation(capsuleRef, time, {
      rotationOscillation: { z: { frequency: 0.05, amplitude: 0.1 } },
      positionWave: {
        base: { x: 0, y: 0, z: 0 },
        y: { frequency: 0.1, amplitude: 0.3 },
      },
    });
  });

  return (
    <group ref={capsuleRef}>
      {/* Orbital Module (Sphere) */}
      <mesh position={[0, 0, 0.8]} castShadow>
        <sphereGeometry args={[0.4, 12, 12]} />
        <meshStandardMaterial color="#94a3b8" transparent opacity={opacity} metalness={0.5} />
      </mesh>

      {/* Descent Module (Blunt cone) */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.5, 0.6, 12]} />
        <meshStandardMaterial color="#cbd5e1" transparent opacity={opacity} metalness={0.6} />
      </mesh>

      {/* Instrumentation Module (Cylinder) */}
      <mesh position={[0, 0, -0.6]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.5, 0.5, 0.6, 12]} />
        <meshStandardMaterial color="#94a3b8" transparent opacity={opacity} />
      </mesh>

      {/* Solar Wings */}
      {[1, -1].map((side) => (
        <mesh key={side} position={[side * 1.2, 0, -0.6]} castShadow>
          <boxGeometry args={[1.5, 0.02, 0.5]} />
          <meshStandardMaterial color="#1d4ed8" transparent opacity={opacity} />
        </mesh>
      ))}
    </group>
  );
}
