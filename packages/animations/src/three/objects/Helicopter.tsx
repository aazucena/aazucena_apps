/**
 * Helicopter Easter Egg
 * Low-altitude agile craft (Troposphere)
 */

import type { JSX } from 'react';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group, Mesh } from 'three';
import { applyAnimation } from '@aazucena/utils';

interface HelicopterProps {
  opacity: number;
}

export function Helicopter({ opacity }: HelicopterProps): JSX.Element {
  const helicopterRef = useRef<Group>(null);
  const mainRotorRef = useRef<Mesh>(null);
  const tailRotorRef = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    // Rotate rotors at high speed
    if (mainRotorRef.current) mainRotorRef.current.rotation.y = time * 20;
    if (tailRotorRef.current) tailRotorRef.current.rotation.z = time * 20;

    // Agile movement wave
    applyAnimation(helicopterRef, time, {
      rotationOscillation: { 
        x: { frequency: 0.5, amplitude: 0.1 }, // Pitch
        z: { frequency: 0.3, amplitude: 0.15 } // Roll
      },
      positionWave: {
        base: { x: 0, y: 0, z: 0 },
        y: { frequency: 0.4, amplitude: 0.2 },
      },
    });
  });

  return (
    <group ref={helicopterRef}>
      {/* Fuselage */}
      <mesh castShadow>
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshStandardMaterial color="#334155" transparent opacity={opacity} metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Tail boom */}
      <mesh position={[0, 0, -0.8]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 1.2, 8]} />
        <meshStandardMaterial color="#475569" transparent opacity={opacity} />
      </mesh>

      {/* Main Rotor Mast */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.3, 8]} />
        <meshStandardMaterial color="#1e293b" transparent opacity={opacity} />
      </mesh>

      {/* Main Rotor Blades */}
      <mesh ref={mainRotorRef} position={[0, 0.75, 0]} castShadow>
        <boxGeometry args={[3, 0.02, 0.15]} />
        <meshStandardMaterial color="#0f172a" transparent opacity={opacity} />
      </mesh>

      {/* Tail Rotor */}
      <mesh ref={tailRotorRef} position={[0.15, 0, -1.4]} castShadow>
        <boxGeometry args={[0.02, 0.6, 0.1]} />
        <meshStandardMaterial color="#0f172a" transparent opacity={opacity} />
      </mesh>

      {/* Skids */}
      <group position={[0, -0.6, 0]}>
        <mesh position={[0.4, 0, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 1.2, 8]} />
          <meshStandardMaterial color="#1e293b" transparent opacity={opacity} />
        </mesh>
        <mesh position={[-0.4, 0, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 1.2, 8]} />
          <meshStandardMaterial color="#1e293b" transparent opacity={opacity} />
        </mesh>
      </group>
    </group>
  );
}
