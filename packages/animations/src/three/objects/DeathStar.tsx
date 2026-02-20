/**
 * Death Star Easter Egg
 * Spherical station with distinctive dish (Thermosphere)
 */

import type { JSX } from 'react';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Mesh } from "three";

interface DeathStarProps {
  opacity: number;
}

export function DeathStar({ opacity }: DeathStarProps): JSX.Element {
  const meshRef = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    // Very slow majestic rotation
    if (meshRef.current) {
      meshRef.current.rotation.y = time * 0.05;
    }
  });

  return (
    <group scale={[2, 2, 2]}>
      {/* Main Sphere */}
      <mesh ref={meshRef} castShadow>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color="#94a3b8"
          transparent
          opacity={opacity}
          metalness={0.5}
          roughness={0.8}
        />

        {/* Trench Line (Visual detail) */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.01, 0.01, 8, 64]} />
          <meshStandardMaterial color="#475569" transparent opacity={opacity} />
        </mesh>

        {/* Superlaser Dish indentation */}
        <mesh position={[0.5, 0.5, 0.7]} rotation={[Math.PI + 0.5, 0.5, 0]}>
          <coneGeometry args={[0.3, 0.1, 16, 1, true]} />
          <meshStandardMaterial color="#64748b" transparent opacity={opacity} />
        </mesh>
      </mesh>
    </group>
  );
}
