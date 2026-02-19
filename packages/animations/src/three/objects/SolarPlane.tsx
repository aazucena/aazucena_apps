/**
 * Solar Plane (HALE UAV) Easter Egg
 * High Altitude Long Endurance solar drone (Stratosphere)
 */

import type { JSX } from 'react';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import { applyAnimation } from '@aazucena/utils';

interface SolarPlaneProps {
  opacity: number;
}

export function SolarPlane({ opacity }: SolarPlaneProps): JSX.Element {
  const planeRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    
    // Extremely slow, stable banking
    applyAnimation(planeRef, time, {
      rotationOscillation: { z: { frequency: 0.05, amplitude: 0.05 } },
      positionWave: {
        base: { x: 0, y: 0, z: 0 },
        y: { frequency: 0.1, amplitude: 0.1 },
      },
    });
  });

  return (
    <group ref={planeRef}>
      {/* High-aspect ratio wing */}
      <mesh castShadow>
        <boxGeometry args={[10, 0.05, 0.4]} />
        <meshStandardMaterial color="#1e293b" transparent opacity={opacity} metalness={0.8} />
      </mesh>

      {/* Solar panel texture detail (visual) */}
      <mesh position={[0, 0.03, 0]}>
        <boxGeometry args={[9.8, 0.01, 0.35]} />
        <meshStandardMaterial color="#3b82f6" emissive="#1d4ed8" emissiveIntensity={0.2} transparent opacity={opacity * 0.5} />
      </mesh>

      {/* Tiny fuselage */}
      <mesh position={[0, -0.1, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 1.2, 8]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color="#cbd5e1" transparent opacity={opacity} />
      </mesh>

      {/* Tail stabilizers */}
      <group position={[0, -0.1, -0.6]}>
        <mesh castShadow>
          <boxGeometry args={[1.5, 0.02, 0.2]} />
          <meshStandardMaterial color="#1e293b" transparent opacity={opacity} />
        </mesh>
        <mesh position={[0, 0.15, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <boxGeometry args={[0.3, 0.02, 0.2]} />
          <meshStandardMaterial color="#1e293b" transparent opacity={opacity} />
        </mesh>
      </group>
    </group>
  );
}
