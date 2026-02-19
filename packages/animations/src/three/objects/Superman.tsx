/**
 * Superman Easter Egg
 * FIXED: Correct arm positions (no unicorn) and horizontal alignment (Troposphere)
 */

import type { JSX } from 'react';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group, Mesh } from 'three';
import { applyAnimation } from '@aazucena/utils';

interface SupermanProps {
  opacity: number;
}

export function Superman({ opacity }: SupermanProps): JSX.Element {
  const groupRef = useRef<Group>(null);
  const capeRef = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    // Fast forward flight (along X axis)
    if (groupRef.current) {
      groupRef.current.position.x += 0.15;
      if (groupRef.current.position.x > 40) groupRef.current.position.x = -40;
    }

    // Dynamic cape flutter
    if (capeRef.current) {
      capeRef.current.rotation.x = Math.sin(time * 25) * 0.15;
      capeRef.current.position.z = -0.3 + Math.sin(time * 20) * 0.05;
    }

    applyAnimation(groupRef, time, {
      rotationOscillation: { z: { frequency: 0.5, amplitude: 0.05 } },
      positionWave: {
        base: { x: 0, y: 0, z: 0 },
        y: { frequency: 0.8, amplitude: 0.15 },
      },
    });
  });

  return (
    <group ref={groupRef} rotation={[0, Math.PI / 2, 0]}>
      {/* 
        BODY CONSTRUCTION 
        Aligned perfectly along the Z-axis (which becomes the forward direction)
      */}

      {/* UPPER TORSO / CHEST */}
      <mesh position={[0, 0, 0.3]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <capsuleGeometry args={[0.2, 0.4, 4, 8]} />
        <meshStandardMaterial color="#1e40af" transparent opacity={opacity} />
      </mesh>

      {/* ABDOMEN / WAIST */}
      <mesh position={[0, 0, -0.1]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <capsuleGeometry args={[0.16, 0.3, 4, 8]} />
        <meshStandardMaterial color="#1e40af" transparent opacity={opacity} />
      </mesh>

      {/* YELLOW BELT */}
      <mesh position={[0, 0, -0.2]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.17, 0.04, 8, 16]} />
        <meshStandardMaterial color="#fbbf24" transparent opacity={opacity} />
      </mesh>

      {/* THE "S" SHIELD */}
      <group position={[0, 0.14, 0.4]} rotation={[0.2, 0, 0]}>
        <mesh rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.2, 0.2, 0.02]} />
          <meshStandardMaterial color="#fbbf24" transparent opacity={opacity} />
        </mesh>
        <mesh position={[0, 0, 0.01]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.12, 0.12, 0.02]} />
          <meshStandardMaterial color="#dc2626" transparent opacity={opacity} />
        </mesh>
      </group>

      {/* HEAD */}
      <group position={[0, 0, 0.7]}>
        <mesh castShadow>
          <sphereGeometry args={[0.14, 12, 12]} />
          <meshStandardMaterial color="#fecaca" transparent opacity={opacity} />
        </mesh>
        {/* Hair with Curl */}
        <mesh position={[0, 0.08, 0]} rotation={[-0.5, 0, 0]} castShadow>
          <sphereGeometry
            args={[0.15, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2]}
          />
          <meshStandardMaterial color="#000000" transparent opacity={opacity} />
        </mesh>
        <mesh position={[0.05, 0.05, 0.12]} rotation={[0, 0.5, 0]}>
          <boxGeometry args={[0.02, 0.05, 0.05]} />
          <meshStandardMaterial color="#000000" transparent opacity={opacity} />
        </mesh>
      </group>

      {/* ARMS - Corrected Position (Shoulders, not Head) */}
      {/* Right Arm (Forward - Lead) */}
      <mesh position={[0.18, 0, 0.7]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.05, 0.7, 4]} />
        <meshStandardMaterial color="#1e40af" transparent opacity={opacity} />
      </mesh>

      {/* Left Arm (Tucked/Forward) */}
      <mesh position={[-0.18, 0, 0.7]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.05, 0.7, 4]} />
        <meshStandardMaterial color="#1e40af" transparent opacity={opacity} />
      </mesh>

      {/* CAPE */}
      <group ref={capeRef} position={[0, 0.1, -0.1]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <group position={[0, -0.9, 0]}>
            <mesh>
              <cylinderGeometry args={[0.25, 0.8, 1.8, 4]} />
              <meshStandardMaterial color="#dc2626" transparent opacity={opacity} side={2} />
            </mesh>
          </group>
        </mesh>
      </group>

      {/* RED BOOTS */}
      {([0.08, -0.08] as const).map((x, i) => (
        <mesh key={i} position={[x, 0, -0.5]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <boxGeometry args={[0.1, 0.6, 0.1]} />
          <meshStandardMaterial color="#dc2626" transparent opacity={opacity} />
        </mesh>
      ))}
    </group>
  );
}
