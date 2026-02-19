/**
 * Starlink Train Easter Egg
 * Synchronized string of satellites (Exosphere)
 */

import type { JSX } from 'react';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';

interface StarlinkTrainProps {
  opacity: number;
}

export function StarlinkTrain({ opacity }: StarlinkTrainProps): JSX.Element {
  const trainRef = useRef<Group>(null);

  useFrame(() => {
    if (trainRef.current) {
      // Linear movement across the sky
      trainRef.current.position.x += 0.05;
      if (trainRef.current.position.x > 50) trainRef.current.position.x = -50;
    }
  });

  return (
    <group ref={trainRef}>
      {/* 8 tiny identical satellites in a perfect line */}
      {[...Array(8)].map((_, i) => (
        <mesh key={i} position={[i * -3, 0, 0]}>
          <boxGeometry args={[0.2, 0.05, 0.1]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={2} transparent opacity={opacity} />
        </mesh>
      ))}
    </group>
  );
}
