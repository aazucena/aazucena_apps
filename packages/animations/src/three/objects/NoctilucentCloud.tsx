/**
 * Noctilucent Cloud Easter Egg
 * High-altitude ice crystal clouds (Mesosphere)
 */

import type { JSX } from 'react';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';

interface NoctilucentCloudProps {
  opacity: number;
}

export function NoctilucentCloud({ opacity }: NoctilucentCloudProps): JSX.Element {
  const cloudRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (cloudRef.current) {
      // Slow drifting movement
      cloudRef.current.position.x += 0.002;
      if (cloudRef.current.position.x > 20) cloudRef.current.position.x = -20;
      
      // Gentle waving/pulsing
      cloudRef.current.children.forEach((child, i) => {
        child.position.y += Math.sin(time + i) * 0.001;
      });
    }
  });

  return (
    <group ref={cloudRef}>
      {/* Fragmented wispy planes */}
      {[...Array(5)].map((_, i) => (
        <mesh key={i} position={[i * 1.5 - 3, Math.sin(i) * 0.5, i * 0.2]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2 + Math.random(), 1 + Math.random()]} />
          <meshStandardMaterial 
            color="#bae6fd" 
            emissive="#7dd3fc" 
            emissiveIntensity={0.5} 
            transparent 
            opacity={opacity * 0.2} 
          />
        </mesh>
      ))}
    </group>
  );
}
