/**
 * Sounding Rocket Easter Egg
 * Research rocket for sub-orbital study (Mesosphere)
 */

import type { JSX } from 'react';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';

interface SoundingRocketProps {
  opacity: number;
}

export function SoundingRocket({ opacity }: SoundingRocketProps): JSX.Element {
  const rocketRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (rocketRef.current) {
      // Rapid vertical ascent with slight jitter
      rocketRef.current.position.y += 0.1;
      rocketRef.current.position.x += Math.sin(time * 50) * 0.01;

      // Reset position for loop
      if (rocketRef.current.position.y > 50) rocketRef.current.position.y = -50;
    }
  });

  return (
    <group ref={rocketRef}>
      {/* Long needle fuselage */}
      <mesh castShadow>
        <cylinderGeometry args={[0.05, 0.08, 4, 8]} />
        <meshStandardMaterial color="#f1f5f9" transparent opacity={opacity} metalness={0.8} />
      </mesh>

      {/* Nose cone */}
      <mesh position={[0, 2.3, 0]} castShadow>
        <coneGeometry args={[0.05, 0.6, 8]} />
        <meshStandardMaterial color="#ef4444" transparent opacity={opacity} />
      </mesh>

      {/* Fins */}
      {[0, Math.PI / 2, Math.PI, (Math.PI * 3) / 2].map((angle, i) => (
        <mesh key={i} position={[0, -1.8, 0]} rotation={[0, angle, 0]} castShadow>
          <group position={[0.15, 0, 0]}>
            <boxGeometry args={[0.3, 0.4, 0.02]} />
            <meshStandardMaterial color="#ef4444" transparent opacity={opacity} />
          </group>
        </mesh>
      ))}

      {/* Exhaust plume (Static visual) */}
      <mesh position={[0, -2.5, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.1, 1, 8]} />
        <meshStandardMaterial
          color="#fbbf24"
          emissive="#f59e0b"
          emissiveIntensity={2}
          transparent
          opacity={opacity * 0.6}
        />
      </mesh>
    </group>
  );
}
