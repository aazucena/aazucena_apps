/**
 * Starlink Satellite Easter Egg
 * Modern flat-panel LEO satellite (Thermosphere)
 */

import type { JSX } from 'react';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import { applyAnimation } from '@aazucena/utils';

interface StarlinkSatelliteProps {
  opacity: number;
}

export function StarlinkSatellite({ opacity }: StarlinkSatelliteProps): JSX.Element {
  const satRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    // Stable orbital orientation
    applyAnimation(satRef, time, {
      rotationOscillation: { x: { frequency: 0.05, amplitude: 0.05 } },
      positionWave: {
        base: { x: 0, y: 0, z: 0 },
        z: { frequency: 0.1, amplitude: 0.1 },
      },
    });
  });

  return (
    <group ref={satRef}>
      {/* Main flat panel body */}
      <mesh castShadow>
        <boxGeometry args={[1.2, 0.05, 0.8]} />
        <meshStandardMaterial color="#cbd5e1" transparent opacity={opacity} metalness={0.8} />
      </mesh>

      {/* Folded solar array (Single vertical panel) */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <boxGeometry args={[1.1, 2.4, 0.02]} />
        <meshStandardMaterial
          color="#1d4ed8"
          emissive="#1e40af"
          emissiveIntensity={0.3}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Support boom for array */}
      <mesh position={[0, 0.1, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.2, 4]} />
        <meshStandardMaterial color="#475569" transparent opacity={opacity} />
      </mesh>

      {/* Bottom antennae detail */}
      <mesh position={[0, -0.05, 0]}>
        <boxGeometry args={[0.8, 0.05, 0.6]} />
        <meshStandardMaterial color="#f1f5f9" transparent opacity={opacity * 0.8} />
      </mesh>
    </group>
  );
}
