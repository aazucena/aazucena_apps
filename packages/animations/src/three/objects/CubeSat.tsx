/**
 * CubeSat Easter Egg
 * Miniature research satellite (Thermosphere)
 */

import type { JSX } from 'react';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import { applyAnimation } from '@aazucena/utils';

interface CubeSatProps {
  opacity: number;
}

export function CubeSat({ opacity }: CubeSatProps): JSX.Element {
  const satRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    
    // Quick tumbling rotation
    applyAnimation(satRef, time, {
      rotationOscillation: { 
        y: { frequency: 0.2, amplitude: Math.PI },
        z: { frequency: 0.15, amplitude: Math.PI }
      },
      positionWave: {
        base: { x: 0, y: 0, z: 0 },
        y: { frequency: 0.3, amplitude: 0.2 },
      },
    });
  });

  return (
    <group ref={satRef}>
      {/* 1U Cube body */}
      <mesh castShadow>
        <boxGeometry args={[0.4, 0.4, 0.4]} />
        <meshStandardMaterial color="#1e293b" transparent opacity={opacity} metalness={0.8} />
      </mesh>

      {/* Solar cell details */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <mesh key={i} position={[0, 0, 0]}>
          {/* Visual detail on cube faces */}
          <boxGeometry args={[0.3, 0.3, 0.41]} />
          <meshStandardMaterial color="#1d4ed8" emissive="#1e40af" emissiveIntensity={0.3} transparent opacity={opacity * 0.5} />
        </mesh>
      ))}

      {/* Deployable antennae */}
      <mesh position={[0, 0.2, 0.2]} rotation={[Math.PI / 4, 0, 0]} castShadow>
        <cylinderGeometry args={[0.005, 0.005, 0.8, 4]} />
        <meshStandardMaterial color="#cbd5e1" transparent opacity={opacity} />
      </mesh>
    </group>
  );
}
