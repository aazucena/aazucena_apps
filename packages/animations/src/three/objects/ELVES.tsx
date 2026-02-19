/**
 * ELVES Easter Egg
 * Emissions of Light and Very Low Frequency perturbations due to Electromagnetic Pulse Sources (Mesosphere)
 * Rapidly expanding rings of light
 */

import type { JSX } from 'react';
import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';

interface ELVESProps {
  opacity: number;
}

export function ELVES({ opacity }: ELVESProps): JSX.Element {
  const elvesRef = useRef<Group>(null);
  const [active, setActive] = useState(false);
  const [scale, setScale] = useState(1);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    
    // Periodically trigger (every 10-15 seconds)
    const cycle = time % 12;
    if (cycle < 0.3) {
      setActive(true);
      setScale(cycle * 100 + 1); // Extremely rapid lateral expansion
    } else {
      setActive(false);
      setScale(1);
    }
  });

  if (!active) return <group />;

  return (
    <group ref={elvesRef} rotation={[Math.PI / 2, 0, 0]} scale={[scale, scale, 1]}>
      {/* Expanding ring of light */}
      <mesh>
        <torusGeometry args={[1, 0.01, 8, 32]} />
        <meshStandardMaterial 
          color="#fca5a5" 
          emissive="#ef4444" 
          emissiveIntensity={10} 
          transparent 
          opacity={opacity * (1 - scale / 31)} 
        />
      </mesh>
    </group>
  );
}
