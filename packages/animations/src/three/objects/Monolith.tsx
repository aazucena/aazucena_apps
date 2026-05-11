/**
 * Monolith Easter Egg
 * 1:4:9 black slab from 2001: A Space Odyssey (Exosphere)
 */

import type { JSX } from 'react';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Mesh } from 'three';

interface MonolithProps {
  opacity: number;
}

export function Monolith({ opacity }: MonolithProps): JSX.Element {
  const meshRef = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (meshRef.current) {
      // Extremely slow rotation
      meshRef.current.rotation.y = time * 0.1;
      // Slight vertical drift
      meshRef.current.position.y = Math.sin(time * 0.2) * 0.5;
    }
  });

  return (
    <mesh ref={meshRef} castShadow>
      {/* Exact 1:4:9 dimensions */}
      <boxGeometry args={[1, 9, 4]} />
      <meshStandardMaterial
        color="#000000"
        transparent
        opacity={opacity}
        metalness={1}
        roughness={0}
      />
    </mesh>
  );
}
