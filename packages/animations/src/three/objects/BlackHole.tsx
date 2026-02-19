/**
 * Black Hole Easter Egg
 * Event horizon and accretion disk (Exosphere)
 */

import type { JSX } from 'react';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group, Mesh } from 'three';

interface BlackHoleProps {
  opacity: number;
}

export function BlackHole({ opacity }: BlackHoleProps): JSX.Element {
  const diskRef = useRef<Mesh>(null);
  const groupRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (diskRef.current) {
      diskRef.current.rotation.z = time * 2;
    }
    if (groupRef.current) {
      groupRef.current.rotation.x = Math.sin(time * 0.2) * 0.2;
    }
  });

  return (
    <group ref={groupRef} scale={[2, 2, 2]}>
      {/* Event Horizon (Pure Black Sphere) */}
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color="#000000" transparent opacity={opacity} />
      </mesh>

      {/* Accretion Disk */}
      <mesh ref={diskRef} rotation={[Math.PI / 2.5, 0, 0]}>
        <torusGeometry args={[2, 0.4, 2, 64]} />
        <meshStandardMaterial 
          color="#fbbf24" 
          emissive="#f59e0b" 
          emissiveIntensity={5} 
          transparent 
          opacity={opacity * 0.8} 
        />
      </mesh>

      {/* Secondary warped light ring (Visual effect) */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.8, 0.05, 8, 64]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={opacity * 0.5} />
      </mesh>
    </group>
  );
}
