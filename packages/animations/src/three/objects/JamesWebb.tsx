/**
 * James Webb Space Telescope (JWST) Easter Egg
 * Deep space infrared observatory (Exosphere)
 */

import type { JSX } from 'react';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import { applyAnimation } from '@aazucena/utils';

interface JamesWebbProps {
  opacity: number;
}

export function JamesWebb({ opacity }: JamesWebbProps): JSX.Element {
  const jwstRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    
    // Extremely slow drift and orientation change
    applyAnimation(jwstRef, time, {
      rotationOscillation: { y: { frequency: 0.01, amplitude: 0.1 } },
      positionWave: {
        base: { x: 0, y: 0, z: 0 },
        y: { frequency: 0.02, amplitude: 0.3 },
      },
    });
  });

  return (
    <group ref={jwstRef}>
      {/* Sunshield (Multi-layered diamond shape) */}
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <boxGeometry args={[4, 6, 0.05]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.1} transparent opacity={opacity} />
      </mesh>

      {/* Primary Mirror (Hexagonal array) */}
      <group position={[0, 1.5, 0.5]} rotation={[-0.2, 0, 0]}>
        {/* Central mirrors */}
        <mesh castShadow>
          <cylinderGeometry args={[1.2, 1.2, 0.1, 6]} rotation={[Math.PI / 2, Math.PI / 6, 0]} />
          <meshStandardMaterial color="#fbbf24" emissive="#d97706" emissiveIntensity={0.5} metalness={1} roughness={0} transparent opacity={opacity} />
        </mesh>
        
        {/* Secondary mirror support struts */}
        {[0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].map((angle, i) => (
          <mesh key={i} position={[Math.cos(angle) * 0.8, Math.sin(angle) * 0.8, 0.8]} rotation={[angle, 0, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 2, 4]} rotation={[0.5, 0, 0]} />
            <meshStandardMaterial color="#475569" transparent opacity={opacity} />
          </mesh>
        ))}
        
        {/* Secondary Mirror */}
        <mesh position={[0, 0, 1.8]}>
          <cylinderGeometry args={[0.15, 0.15, 0.05, 6]} rotation={[Math.PI / 2, Math.PI / 6, 0]} />
          <meshStandardMaterial color="#fbbf24" transparent opacity={opacity} />
        </mesh>
      </group>

      {/* Spacecraft Bus (Bottom part) */}
      <mesh position={[0, -0.5, -0.5]} castShadow>
        <boxGeometry args={[1, 0.8, 1]} />
        <meshStandardMaterial color="#94a3b8" transparent opacity={opacity} />
      </mesh>
    </group>
  );
}
