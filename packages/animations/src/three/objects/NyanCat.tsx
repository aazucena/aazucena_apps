/**
 * Nyan Cat Easter Egg
 * Internet meme icon (Mesosphere)
 */

import type { JSX } from 'react';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';

interface NyanCatProps {
  opacity: number;
}

export function NyanCat({ opacity }: NyanCatProps): JSX.Element {
  const catRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (catRef.current) {
      // Bobbing movement
      catRef.current.position.y = Math.sin(time * 5) * 0.2;
      // Constant forward movement
      catRef.current.position.x += 0.05;
      if (catRef.current.position.x > 30) catRef.current.position.x = -30;
    }
  });

  const rainbowColors = ['#ff0000', '#ff9900', '#ffff00', '#33ff00', '#0099ff', '#6633ff'];

  return (
    <group ref={catRef}>
      {/* Pop-tart Body */}
      <mesh castShadow>
        <boxGeometry args={[1.2, 0.8, 0.2]} />
        <meshStandardMaterial color="#ffccff" transparent opacity={opacity} />
      </mesh>
      {/* Inner Pink Part */}
      <mesh position={[0, 0, 0.01]}>
        <boxGeometry args={[1, 0.6, 0.2]} />
        <meshStandardMaterial color="#ff3399" transparent opacity={opacity} />
      </mesh>

      {/* Cat Head */}
      <mesh position={[0.7, 0.1, 0.05]} castShadow>
        <boxGeometry args={[0.5, 0.5, 0.2]} />
        <meshStandardMaterial color="#999999" transparent opacity={opacity} />
      </mesh>
      {/* Ears */}
      <mesh position={[0.6, 0.4, 0.05]}>
        <boxGeometry args={[0.1, 0.1, 0.1]} />
        <meshStandardMaterial color="#999999" transparent opacity={opacity} />
      </mesh>
      <mesh position={[0.8, 0.4, 0.05]}>
        <boxGeometry args={[0.1, 0.1, 0.1]} />
        <meshStandardMaterial color="#999999" transparent opacity={opacity} />
      </mesh>

      {/* Feet */}
      {([
        [-0.4, -0.4],
        [0.4, -0.4],
        [-0.4, 0.4],
        [0.4, 0.4],
      ] as const).map((pos, i) => (
        <mesh key={i} position={[pos[0], -0.45, 0.05]}>
          <boxGeometry args={[0.2, 0.2, 0.1]} />
          <meshStandardMaterial color="#999999" transparent opacity={opacity} />
        </mesh>
      ))}

      {/* Rainbow Trail */}
      <group position={[-3.6, 0, 0]}>
        {rainbowColors.map((color, i) => (
          <mesh key={i} position={[0, 0.25 - i * 0.1, -0.1]}>
            <boxGeometry args={[6, 0.1, 0.01]} />
            <meshStandardMaterial color={color} transparent opacity={opacity * 0.7} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
