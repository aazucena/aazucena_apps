/**
 * Hubble Space Telescope Easter Egg
 * Iconic LEO scientific observatory (Thermosphere)
 */

import type { JSX } from 'react';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import { applyAnimation } from '@aazucena/utils';

interface HubbleProps {
  opacity: number;
}

export function Hubble({ opacity }: HubbleProps): JSX.Element {
  const hubbleRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    
    // Majestic slow tumbling
    applyAnimation(hubbleRef, time, {
      rotationOscillation: { 
        y: { frequency: 0.02, amplitude: Math.PI },
        x: { frequency: 0.01, amplitude: 0.2 }
      },
      positionWave: {
        base: { x: 0, y: 0, z: 0 },
        y: { frequency: 0.05, amplitude: 0.5 },
      },
    });
  });

  return (
    <group ref={hubbleRef}>
      {/* Main telescope body */}
      <mesh castShadow>
        <cylinderGeometry args={[0.5, 0.5, 3, 16]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color="#cbd5e1" transparent opacity={opacity} metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Aperture cover (open) */}
      <mesh position={[0, 0.45, 1.5]} rotation={[-0.5, 0, 0]} castShadow>
        <cylinderGeometry args={[0.52, 0.52, 0.05, 16]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color="#94a3b8" transparent opacity={opacity} />
      </mesh>

      {/* Solar arrays (Wings) */}
      {[1, -1].map((side) => (
        <group key={side} position={[side * 1.2, 0, 0]}>
          <mesh castShadow>
            <boxGeometry args={[1.5, 0.02, 2.5]} />
            <meshStandardMaterial color="#fbbf24" emissive="#d97706" emissiveIntensity={0.2} transparent opacity={opacity} />
          </mesh>
          {/* Support struts */}
          <mesh position={[side * -0.35, 0, 0]} castShadow>
            <boxGeometry args={[0.8, 0.05, 0.05]} />
            <meshStandardMaterial color="#475569" transparent opacity={opacity} />
          </mesh>
        </group>
      ))}

      {/* Communication antennae */}
      <mesh position={[0, -0.4, -1.2]} rotation={[0.5, 0, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 1, 4]} />
        <meshStandardMaterial color="#94a3b8" transparent opacity={opacity} />
      </mesh>
    </group>
  );
}
