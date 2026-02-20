/**
 * Santa's Sleigh Easter Egg
 * FIXED: Connected rails (front/back), Sleigh back panel, Santa, and Gift Bag (Troposphere)
 */

import type { JSX } from 'react';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import { applyAnimation } from '@aazucena/utils';

interface SantaSleighProps {
  opacity: number;
}

export function SantaSleigh({ opacity }: SantaSleighProps): JSX.Element {
  const sleighRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    applyAnimation(sleighRef, time, {
      rotationOscillation: { z: { frequency: 0.2, amplitude: 0.05 } },
      positionWave: {
        base: { x: 0, y: 0, z: 0 },
        y: { frequency: 0.3, amplitude: 0.2 },
      },
    });
  });

  return (
    <group ref={sleighRef}>
      {/* 1. THE SLEIGH BODY ASSEMBLY */}
      <group position={[0, 0, 0]}>
        {/* Runners (Rails) */}
        {[0.55, -0.55].map((z, i) => (
          <group key={i} position={[0, -0.3, z]}>
            {/* Main horizontal runner */}
            <mesh castShadow>
              <boxGeometry args={[2.8, 0.05, 0.1]} />
              <meshStandardMaterial color="#f1f5f9" metalness={0.9} transparent opacity={opacity} />
            </mesh>
            {/* Front high curl - repositioned to connect perfectly */}
            <mesh position={[1.4, 0.45, 0]} rotation={[0, 0, -0.8]} castShadow>
              <boxGeometry args={[0.8, 0.05, 0.1]} />
              <meshStandardMaterial color="#f1f5f9" metalness={0.9} transparent opacity={opacity} />
            </mesh>
            {/* Back curl - added for symmetry and realism */}
            <mesh position={[-1.4, 0.25, 0]} rotation={[0, 0, 0.8]} castShadow>
              <boxGeometry args={[0.4, 0.05, 0.1]} />
              <meshStandardMaterial color="#f1f5f9" metalness={0.9} transparent opacity={opacity} />
            </mesh>
            {/* Vertical struts connecting body to runner */}
            {([-0.8, -0.2, 0.4, 1] as const).map((x, j) => (
              <mesh key={j} position={[x, 0.15, 0]} castShadow>
                <boxGeometry args={[0.05, 0.3, 0.05]} />
                <meshStandardMaterial
                  color="#f1f5f9"
                  metalness={0.9}
                  transparent
                  opacity={opacity}
                />
              </mesh>
            ))}
          </group>
        ))}

        {/* Body Floor */}
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[2.2, 0.2, 1.4]} />
          <meshStandardMaterial color="#b91c1c" transparent opacity={opacity} />
        </mesh>

        {/* Side Walls */}
        {[0.65, -0.65].map((z, i) => (
          <mesh key={i} position={[0, 0.4, z]} castShadow>
            <boxGeometry args={[2.2, 0.8, 0.1]} />
            <meshStandardMaterial color="#991b1b" transparent opacity={opacity} />
          </mesh>
        ))}

        {/* BACK PANEL (Prevents gifts from dropping) */}
        <mesh position={[-1.1, 0.6, 0]} castShadow>
          <boxGeometry args={[0.1, 1.2, 1.4]} />
          <meshStandardMaterial color="#b91c1c" transparent opacity={opacity} />
        </mesh>

        {/* SANTA CLAUS (Driver) */}
        <group position={[0.4, 0.6, 0]} scale={[1.4, 1.4, 1.4]}>
          <mesh castShadow>
            <capsuleGeometry args={[0.2, 0.4, 4, 8]} />
            <meshStandardMaterial color="#dc2626" transparent opacity={opacity} />
          </mesh>
          <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.21, 0.04, 8, 12]} />
            <meshStandardMaterial color="#000000" transparent opacity={opacity} />
          </mesh>
          <group position={[0, 0.35, 0]}>
            <mesh>
              <sphereGeometry args={[0.15, 8, 8]} />
              <meshStandardMaterial color="#fecaca" transparent opacity={opacity} />
            </mesh>
            <mesh position={[0.1, -0.1, 0]} scale={[1, 1.5, 1]}>
              <sphereGeometry args={[0.12, 8, 8]} />
              <meshStandardMaterial color="#ffffff" transparent opacity={opacity} />
            </mesh>
            <group position={[0, 0.1, 0]}>
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.15, 0.03, 8, 12]} />
                <meshStandardMaterial color="#ffffff" transparent opacity={opacity} />
              </mesh>
              <mesh position={[0, 0.2, 0]} castShadow>
                <coneGeometry args={[0.15, 0.4, 8]} />
                <meshStandardMaterial color="#dc2626" transparent opacity={opacity} />
              </mesh>
              <mesh position={[0, 0.4, 0]}>
                <sphereGeometry args={[0.05, 8, 8]} />
                <meshStandardMaterial color="#ffffff" transparent opacity={opacity} />
              </mesh>
            </group>
          </group>
        </group>

        {/* GIFT BAG (Seated securely in back) */}
        <group position={[-0.5, 0.6, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.7, 12, 12]} scale={[1, 1.3, 1]} />
            <meshStandardMaterial color="#166534" transparent opacity={opacity} />
          </mesh>
          <mesh position={[0.2, 0.6, 0.2]} rotation={[0.4, 0.4, 0.4]}>
            <boxGeometry args={[0.3, 0.3, 0.3]} />
            <meshStandardMaterial color="#3b82f6" transparent opacity={opacity} />
          </mesh>
          <mesh position={[-0.2, 0.7, -0.1]} rotation={[-0.2, 0.1, 0.5]}>
            <boxGeometry args={[0.25, 0.25, 0.25]} />
            <meshStandardMaterial color="#fbbf24" transparent opacity={opacity} />
          </mesh>
        </group>
      </group>

      {/* 2. REINDEER TEAM */}
      {(
        [
          [4, 0.4],
          [4, -0.4],
        ] as const
      ).map((pos, i) => (
        <group key={i} position={[pos[0], -0.2, pos[1]]}>
          <mesh castShadow>
            <boxGeometry args={[0.8, 0.45, 0.3]} />
            <meshStandardMaterial color="#78350f" transparent opacity={opacity} />
          </mesh>
          <mesh position={[-0.45, 0.15, 0]} rotation={[0, 0, 0.5]}>
            <boxGeometry args={[0.1, 0.2, 0.05]} />
            <meshStandardMaterial color="#78350f" transparent opacity={opacity} />
          </mesh>
          {(
            [
              [0.25, 0.1],
              [0.25, -0.1],
              [-0.25, 0.1],
              [-0.25, -0.1],
            ] as const
          ).map((lp, j) => (
            <mesh key={j} position={[lp[0], -0.4, lp[1]]} castShadow>
              <cylinderGeometry args={[0.04, 0.03, 0.6, 4]} />
              <meshStandardMaterial color="#78350f" transparent opacity={opacity} />
            </mesh>
          ))}
          <mesh position={[0.4, 0.15, 0]} rotation={[0, 0, -0.6]} castShadow>
            <cylinderGeometry args={[0.08, 0.12, 0.6, 8]} />
            <meshStandardMaterial color="#78350f" transparent opacity={opacity} />
          </mesh>
          <group position={[0.65, 0.5, 0]} rotation={[0, 0, 0.4]}>
            <mesh castShadow>
              <sphereGeometry args={[0.18, 8, 8]} />
              <meshStandardMaterial color="#78350f" transparent opacity={opacity} />
            </mesh>
            <group position={[0, 0.2, 0]}>
              <mesh rotation={[0, 0, 0.5]} position={[0, 0.2, 0]}>
                <boxGeometry args={[0.02, 0.4, 0.02]} />
                <meshStandardMaterial color="#451a03" transparent opacity={opacity} />
              </mesh>
              <mesh rotation={[0, 0, 1.2]} position={[0.1, 0.3, 0]}>
                <boxGeometry args={[0.02, 0.2, 0.02]} />
                <meshStandardMaterial color="#451a03" transparent opacity={opacity} />
              </mesh>
            </group>
            {i === 0 && (
              <mesh position={[0.18, 0, 0]}>
                <sphereGeometry args={[0.07, 12, 12]} />
                <meshStandardMaterial
                  color="#ff0000"
                  emissive="#ff0000"
                  emissiveIntensity={5}
                  transparent
                  opacity={opacity}
                />
                <pointLight color="#ff0000" intensity={2} distance={2} />
              </mesh>
            )}
          </group>
          <mesh position={[-1.6, 0.55, 0]} castShadow>
            <boxGeometry args={[3.2, 0.015, 0.015]} />
            <meshStandardMaterial
              color="#fcd34d"
              metalness={0.8}
              transparent
              opacity={opacity * 0.8}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}
