/**
 * Blue Jet Easter Egg
 * Upward-moving lightning discharge (Stratosphere)
 */

import type { JSX } from 'react';
import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';

interface BlueJetProps {
  opacity: number;
}

export function BlueJet({ opacity }: BlueJetProps): JSX.Element {
  const jetRef = useRef<Group>(null);
  const [active, setActive] = useState(false);
  const [scale, setScale] = useState(0.1);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    
    // Periodically trigger the jet (every 5-8 seconds)
    const cycle = time % 7;
    if (cycle < 0.5) {
      setActive(true);
      setScale(cycle * 10 + 0.1); // Rapid upward growth
    } else {
      setActive(false);
      setScale(0.1);
    }
  });

  if (!active) return <group />;

  return (
    <group ref={jetRef} position={[0, 0, 0]} scale={[scale, scale, scale]}>
      {/* Main upward blue cone */}
      <mesh position={[0, 1, 0]}>
        <coneGeometry args={[0.5, 2, 8]} />
        <meshStandardMaterial 
          color="#3b82f6" 
          emissive="#2563eb" 
          emissiveIntensity={5} 
          transparent 
          opacity={opacity * 0.8} 
        />
      </mesh>

      {/* Inner bright core */}
      <mesh position={[0, 0.8, 0]}>
        <coneGeometry args={[0.2, 1.8, 8]} />
        <meshStandardMaterial 
          color="#60a5fa" 
          emissive="#ffffff" 
          emissiveIntensity={10} 
          transparent 
          opacity={opacity} 
        />
      </mesh>
    </group>
  );
}
