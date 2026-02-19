/**
 * Space Invader Easter Egg
 * Retro gaming voxel icon (Mesosphere)
 */

import type { JSX } from 'react';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';

interface SpaceInvaderProps {
  opacity: number;
}

export function SpaceInvader({ opacity }: SpaceInvaderProps): JSX.Element {
  const invaderRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (invaderRef.current) {
      // Step movement like the game
      const step = Math.floor(time * 2);
      invaderRef.current.position.x = (step % 20) * 0.5 - 5;
      // Wiggle up and down
      invaderRef.current.position.y = Math.sin(time * 10) * 0.1;
    }
  });

  // 11x8 Pixel Art Grid for the Invader
  const pixels = [
    [2,0], [8,0],
    [3,1], [7,1],
    [2,2], [3,2], [4,2], [5,2], [6,2], [7,2], [8,2],
    [1,3], [2,3], [4,3], [5,3], [6,3], [8,3], [9,3],
    [0,4], [1,4], [2,4], [3,4], [4,4], [5,4], [6,4], [7,4], [8,4], [9,4], [10,4],
    [0,5], [2,5], [3,5], [4,5], [5,5], [6,5], [7,5], [8,5], [10,5],
    [0,6], [2,6], [8,6], [10,6],
    [3,7], [4,7], [6,7], [7,7]
  ];

  return (
    <group ref={invaderRef} scale={[0.2, 0.2, 0.2]}>
      {pixels.map((pos, i) => (
        <mesh key={i} position={[pos[0] - 5, 4 - pos[1], 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial 
            color="#22c55e" 
            emissive="#22c55e" 
            emissiveIntensity={0.5} 
            transparent 
            opacity={opacity} 
          />
        </mesh>
      ))}
    </group>
  );
}
