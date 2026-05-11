/**
 * Red Sprite Easter Egg
 * Rare large-scale electrical discharge (Stratosphere)
 */

import type { JSX } from 'react';
import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';

interface RedSpriteProps {
  opacity: number;
}

export function RedSprite({ opacity }: RedSpriteProps): JSX.Element {
  const spriteRef = useRef<Group>(null);
  const [flicker, setFlicker] = useState(1);

  useFrame(({ clock }) => {
    // Fast electrical flickering
    if (clock.getElapsedTime() % 0.2 < 0.05) {
      setFlicker(Math.random() * 0.5 + 0.5);
    } else {
      setFlicker(1);
    }
  });

  return (
    <group ref={spriteRef}>
      {/* Central "Jellyfish" body */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.5, 8, 8]} />
        <meshStandardMaterial
          color="#ef4444"
          emissive="#b91c1c"
          emissiveIntensity={2}
          transparent
          opacity={opacity * flicker}
        />
      </mesh>

      {/* Tendrils pointing down */}
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const x = Math.cos(angle) * 0.4;
        const z = Math.sin(angle) * 0.4;
        return (
          <mesh key={i} position={[x, -1.5, z]} rotation={[0, 0, 0]}>
            <coneGeometry args={[0.05, 3, 4]} />
            <meshStandardMaterial
              color="#ef4444"
              emissive="#f87171"
              emissiveIntensity={1.5}
              transparent
              opacity={opacity * 0.6 * flicker}
            />
          </mesh>
        );
      })}

      {/* Upward "Carrot" bursts */}
      <mesh position={[0, 1, 0]}>
        <coneGeometry args={[0.3, 1.5, 8]} />
        <meshStandardMaterial
          color="#ef4444"
          emissive="#ef4444"
          emissiveIntensity={3}
          transparent
          opacity={opacity * 0.8 * flicker}
        />
      </mesh>
    </group>
  );
}
