/**
 * International Space Station (ISS) Easter Egg
 * REVAMPED: 16-Panel Solar Array, Centralized Modular Hull, Integrated Truss.
 * FIXED: Cupola (half-sphere) properly fused to the bottom of the hub.
 * (Thermosphere)
 */

import type { JSX } from 'react';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import { applyAnimation } from '@aazucena/utils';

interface ISSProps {
  opacity: number;
}

export function ISS({ opacity }: ISSProps): JSX.Element {
  const stationRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    // Slow, majestic orbital rotation
    applyAnimation(stationRef, time, {
      rotationOscillation: {
        y: { frequency: 0.05, amplitude: 0.2 },
        z: { frequency: 0.03, amplitude: 0.1 },
      },
      positionWave: {
        base: { x: 0, y: 0, z: 0 },
        y: { frequency: 0.1, amplitude: 0.3 },
      },
    });
  });

  const HULL_SILVER = '#cbd5e1';
  const HULL_WHITE = '#f8fafc';
  const SOLAR_GOLD = '#b45309'; // Darker gold for solar cells
  const TRUSS_DARK = '#334155';

  // Reusable Solar Array Component (8 panels per side)
  const SolarWing = ({ side }: { side: number }) => (
    <group position={[side * 2.5, 0, 0]}>
      {/* Main Structural Truss for this wing */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.05, 3, 8]} />
        <meshStandardMaterial color={TRUSS_DARK} transparent opacity={opacity} />
      </mesh>

      {/* 8 Panels (4 Forward, 4 Aft) */}
      {[-1.2, -0.4, 0.4, 1.2].map((xOffset) => (
        <group key={xOffset} position={[xOffset, 0, 0]}>
          {/* Top Panel */}
          <mesh position={[0, 0.8, 0]}>
            <boxGeometry args={[0.6, 1.5, 0.02]} />
            <meshStandardMaterial
              color={SOLAR_GOLD}
              metalness={0.8}
              roughness={0.2}
              transparent
              opacity={opacity}
            />
          </mesh>
          {/* Bottom Panel */}
          <mesh position={[0, -0.8, 0]}>
            <boxGeometry args={[0.6, 1.5, 0.02]} />
            <meshStandardMaterial
              color={SOLAR_GOLD}
              metalness={0.8}
              roughness={0.2}
              transparent
              opacity={opacity}
            />
          </mesh>
          {/* Connecting Strut */}
          <mesh>
            <cylinderGeometry args={[0.02, 0.02, 1.6, 4]} />
            <meshStandardMaterial color={TRUSS_DARK} transparent opacity={opacity} />
          </mesh>
        </group>
      ))}
    </group>
  );

  return (
    <group ref={stationRef} scale={[1.2, 1.2, 1.2]}>
      {/* 1. CENTRAL HABITATION SPINE (Main Hull) */}
      {/* Unity / Destiny / Zarya stack oriented along Z-axis */}
      <group rotation={[Math.PI / 2, 0, 0]}>
        {/* Zvezda / Zarya Modules */}
        <mesh position={[0, 0.8, 0]}>
          <cylinderGeometry args={[0.25, 0.25, 1.2, 12]} />
          <meshStandardMaterial color={HULL_SILVER} metalness={0.6} transparent opacity={opacity} />
        </mesh>
        {/* Unity / Destiny Modules */}
        <mesh position={[0, -0.2, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 1.0, 12]} />
          <meshStandardMaterial color={HULL_WHITE} transparent opacity={opacity} />
        </mesh>
        {/* Kibo / Columbus Lab Modules (Lateral) */}
        <mesh position={[0.4, -0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.2, 0.2, 0.8, 8]} />
          <meshStandardMaterial color={HULL_SILVER} metalness={0.5} transparent opacity={opacity} />
        </mesh>

        {/* 5. CUPOLA (The observer window - Fused to Unity bottom) */}
        {/* Located at the end of the habitation spine stack */}
        <mesh position={[0, -0.7, 0]} rotation={[Math.PI, 0, 0]}>
          <sphereGeometry args={[0.15, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#0f172a" metalness={1} transparent opacity={opacity} />
        </mesh>
      </group>

      {/* 2. TRANSVERSE TRUSS (The skeleton for solar wings) */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.15, 6, 0.15]} />
        <meshStandardMaterial color={TRUSS_DARK} transparent opacity={opacity} />
      </mesh>

      {/* 3. 16-PANEL ARRAY SYSTEM (8 Left, 8 Right) */}
      <SolarWing side={1} />
      <SolarWing side={-1} />

      {/* 4. THERMAL RADIATORS (The white vertical panels) */}
      <group position={[0, 0, -0.8]}>
        {[-0.8, 0, 0.8].map((x) => (
          <mesh key={x} position={[x, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <boxGeometry args={[0.4, 1.2, 0.03]} />
            <meshStandardMaterial color={HULL_WHITE} transparent opacity={opacity * 0.8} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
