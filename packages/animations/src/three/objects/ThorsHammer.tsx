/**
 * Thor's Hammer (Mjölnir) Easter Egg
 * Mythical artifact tumbling in space (Mesosphere)
 */

import type { JSX } from 'react';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import { applyAnimation } from '@aazucena/utils';

interface ThorsHammerProps {
  opacity: number;
}

export function ThorsHammer({ opacity }: ThorsHammerProps): JSX.Element {
  const hammerRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    
    // Chaotic tumbling
    applyAnimation(hammerRef, time, {
      rotationOscillation: { 
        x: { frequency: 0.1, amplitude: Math.PI * 2 },
        y: { frequency: 0.05, amplitude: Math.PI * 2 }
      },
      positionWave: {
        base: { x: 0, y: 0, z: 0 },
        y: { frequency: 0.2, amplitude: 1 },
      },
    });
  });

  return (
    <group ref={hammerRef}>
      {/* Hammer Head */}
      <mesh castShadow>
        <boxGeometry args={[1.5, 1, 1]} />
        <meshStandardMaterial color="#94a3b8" transparent opacity={opacity} metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Beveled edges (Visual detail) */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.6, 0.8, 0.8]} />
        <meshStandardMaterial color="#64748b" transparent opacity={opacity} />
      </mesh>

      {/* Handle */}
      <mesh position={[0, -1.2, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 1.5, 8]} />
        <meshStandardMaterial color="#451a03" transparent opacity={opacity} />
      </mesh>

      {/* Handle Base Cap */}
      <mesh position={[0, -2, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 0.2, 8]} />
        <meshStandardMaterial color="#94a3b8" transparent opacity={opacity} metalness={0.8} />
      </mesh>

      {/* Occasional Lightning Spark (Visual) */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.1, 4, 4]} />
        <meshStandardMaterial color="#38bdf8" emissive="#ffffff" emissiveIntensity={5} transparent opacity={opacity * 0.2} />
      </mesh>
    </group>
  );
}
