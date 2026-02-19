/**
 * Aurora Ribbon Easter Egg
 * Shimmering atmospheric curtains (Thermosphere)
 */

import type { JSX } from 'react';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';

interface AuroraRibbonProps {
  opacity: number;
}

export function AuroraRibbon({ opacity }: AuroraRibbonProps): JSX.Element {
  const auroraRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (auroraRef.current) {
      // Waving movement for each vertical segment
      auroraRef.current.children.forEach((child, i) => {
        child.position.z = Math.sin(time * 0.5 + i * 0.5) * 0.5;
        child.rotation.y = Math.cos(time * 0.3 + i * 0.3) * 0.1;
      });
    }
  });

  return (
    <group ref={auroraRef}>
      {/* Series of vertical translucent curtains */}
      {[...Array(10)].map((_, i) => (
        <mesh key={i} position={[i * 0.8 - 4, 0, 0]}>
          <planeGeometry args={[1, 6]} />
          <meshStandardMaterial 
            color="#4ade80" 
            emissive="#22c55e" 
            emissiveIntensity={2} 
            transparent 
            opacity={opacity * 0.15 * (1 - Math.abs(i - 5) / 6)} 
          />
        </mesh>
      ))}
    </group>
  );
}
