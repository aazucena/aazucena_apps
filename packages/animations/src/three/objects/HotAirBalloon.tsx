/**
 * Hot Air Balloon Easter Egg
 * Slow-moving iconic atmospheric object (Troposphere)
 */

import type { JSX } from 'react';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import { applyAnimation } from '@aazucena/utils';

interface HotAirBalloonProps {
  opacity: number;
}

export function HotAirBalloon({ opacity }: HotAirBalloonProps): JSX.Element {
  const balloonRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    // Slow, majestic floating movement
    applyAnimation(balloonRef, time, {
      rotationOscillation: { y: { frequency: 0.1, amplitude: 0.2 } },
      positionWave: {
        base: { x: 0, y: 0, z: 0 },
        y: { frequency: 0.2, amplitude: 0.5 },
        x: { frequency: 0.1, amplitude: 0.3 },
      },
    });
  });

  return (
    <group ref={balloonRef}>
      {/* Balloon Envelope */}
      <mesh position={[0, 2.5, 0]} castShadow>
        <sphereGeometry args={[1.5, 20, 20]} />
        <meshStandardMaterial color="#f43f5e" transparent opacity={opacity} roughness={0.6} />
      </mesh>

      {/* Tapered bottom of envelope */}
      <mesh position={[0, 1.4, 0]} rotation={[Math.PI, 0, 0]} castShadow>
        <coneGeometry args={[1.5, 1.2, 20, 1, true]} />
        <meshStandardMaterial color="#fb7185" transparent opacity={opacity} />
      </mesh>

      {/* Basket */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[0.6, 0.5, 0.6]} />
        <meshStandardMaterial color="#78350f" transparent opacity={opacity} />
      </mesh>

      {/* Burner frame (Cylinders as wires) */}
      {[ [0.25, 0.25], [0.25, -0.25], [-0.25, 0.25], [-0.25, -0.25] ].map((pos, i) => (
        <mesh key={i} position={[pos[0], 0.5, pos[1]]} castShadow>
          <cylinderGeometry args={[0.01, 0.01, 0.6, 4]} />
          <meshStandardMaterial color="#451a03" transparent opacity={opacity} />
        </mesh>
      ))}
    </group>
  );
}
