/**
 * Sprite Ghost Easter Egg
 * Greenish lingering glow often associated with Sprites (Mesosphere)
 */

import type { JSX } from 'react';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Mesh } from 'three';

interface SpriteGhostProps {
  opacity: number;
}

export function SpriteGhost({ opacity }: SpriteGhostProps): JSX.Element {
  const meshRef = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (meshRef.current) {
      // Slow pulse
      const pulse = Math.sin(time * 0.5) * 0.2 + 0.8;
      meshRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <mesh ref={meshRef}>
      {/* Diffuse glowing blob */}
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial
        color="#4ade80"
        emissive="#22c55e"
        emissiveIntensity={1}
        transparent
        opacity={opacity * 0.15}
      />
    </mesh>
  );
}
