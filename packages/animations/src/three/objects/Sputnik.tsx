/**
 * Sputnik Easter Egg
 * The first artificial satellite (Exosphere)
 */

import type { JSX } from 'react';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import { applyAnimation } from '@aazucena/utils';

interface SputnikProps {
  opacity: number;
}

export function Sputnik({ opacity }: SputnikProps): JSX.Element {
  const sputnikRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    
    // Slow tumbling
    applyAnimation(sputnikRef, time, {
      rotationOscillation: { 
        y: { frequency: 0.1, amplitude: Math.PI },
        x: { frequency: 0.05, amplitude: 0.5 }
      },
      positionWave: {
        base: { x: 0, y: 0, z: 0 },
        y: { frequency: 0.2, amplitude: 0.5 },
      },
    });
  });

  return (
    <group ref={sputnikRef}>
      {/* Main polished sphere */}
      <mesh castShadow>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial color="#cbd5e1" metalness={1} roughness={0.1} transparent opacity={opacity} />
      </mesh>

      {/* 4 Long trailing antennae */}
      {[ [0.2, 0.2], [0.2, -0.2], [-0.2, 0.2], [-0.2, -0.2] ].map((pos, i) => (
        <mesh 
          key={i} 
          position={[pos[0], -0.2, pos[1]]} 
          rotation={[Math.PI / 4, 0, (i % 2 === 0 ? 1 : -1) * Math.PI / 4]}
          castShadow
        >
          <cylinderGeometry args={[0.01, 0.01, 3, 4]} position={[0, -1.5, 0]} />
          <meshStandardMaterial color="#94a3b8" transparent opacity={opacity} />
        </mesh>
      ))}
    </group>
  );
}
