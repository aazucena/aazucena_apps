/**
 * Bird Flock Easter Egg
 * A group of birds flying in formation (Troposphere)
 */

import type { JSX } from 'react';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import { Bird } from './Bird.js';

interface BirdFlockProps {
  opacity: number;
}

export function BirdFlock({ opacity }: BirdFlockProps): JSX.Element {
  const flockRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (flockRef.current) {
      // Linear forward movement
      flockRef.current.position.x += 0.03;
      if (flockRef.current.position.x > 30) flockRef.current.position.x = -30;
      
      // Gentle flock-wide swaying
      flockRef.current.position.y = Math.sin(time * 0.5) * 0.5;
    }
  });

  // V-Formation offsets
  const formation = [
    [0, 0, 0],
    [-1.5, 0.5, 1],
    [-1.5, 0.5, -1],
    [-3, 1, 2],
    [-3, 1, -2],
  ];

  return (
    <group ref={flockRef}>
      {formation.map((pos, i) => (
        <group key={i} position={pos as [number, number, number]}>
          <Bird opacity={opacity} />
        </group>
      ))}
    </group>
  );
}
