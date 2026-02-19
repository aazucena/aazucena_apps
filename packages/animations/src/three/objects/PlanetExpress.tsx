/**
 * Planet Express Ship Easter Egg
 * ULTIMATE CANON MASTER: Distinct Hull/Fin colors, Overbite, Racing Stripe, LX Ornament.
 * FIXED: Metal color set to correct CANON #d3c8a4.
 * Futurama iconic delivery ship (Exosphere)
 */

import type { JSX } from 'react';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import { applyAnimation } from '@aazucena/utils';

interface PlanetExpressProps {
  opacity: number;
}

export function PlanetExpress({ opacity }: PlanetExpressProps): JSX.Element {
  const shipRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    
    // Stable, heavy cargo ship flight path
    applyAnimation(shipRef, time, {
      rotationOscillation: { 
        z: { frequency: 0.1, amplitude: 0.02 },
        y: { frequency: 0.05, amplitude: 0.04 } 
      },
      positionWave: {
        base: { x: 0, y: 0, z: 0 },
        y: { frequency: 0.15, amplitude: 0.1 },
        x: { frequency: 0.05, amplitude: 0.3 },
      },
    });
  });

  // --- CANON COLOR PALETTE (DEFINITIVE) ---
  const HULL_COLOR = "#78d9a0";   // "Electric Mucus" Mint Green
  const FIN_COLOR = "#30af92";    // Dark Contrasting Green for Fins
  const STRIPE_COLOR = "#BC1915"; // Signature Red for Stripe & Nose
  const METAL_COLOR = "#d3c8a4";  // CANON Tan/Beige Metal
  const GLASS_COLOR = "#edf1ed";  // CANON Glass color
  const GOLD_COLOR = "#fbbf24";   // LX Hood Ornament

  return (
    <group ref={shipRef}>
      <group rotation={[0, -Math.PI / 2, 0]} scale={[0.8, 0.8, 0.8]}>
        
        {/* 1. MAIN HULL (The 'Cigar' Capsule) */}
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
          <capsuleGeometry args={[0.8, 2.5, 32, 32]} />
          <meshStandardMaterial 
            color={HULL_COLOR} 
            transparent 
            opacity={opacity} 
            metalness={0.2} 
            roughness={0.4} 
          />
        </mesh>

        {/* 2. THE NOSE SYSTEM & OVERBITE */}
        {/* The Red Nose Tip */}
        <mesh position={[2.1, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <coneGeometry args={[0.2, 0.4, 16]} />
          <meshStandardMaterial color={STRIPE_COLOR} transparent opacity={opacity} />
        </mesh>

        {/* LX Hood Ornament (Gold Ship) */}
        <mesh position={[2.0, 0.22, 0]}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshStandardMaterial color={GOLD_COLOR} emissive={GOLD_COLOR} emissiveIntensity={0.5} />
        </mesh>

        {/* Panoramic Wrap-around Cockpit */}
        <mesh position={[1.35, 0.12, 0]}>
          <sphereGeometry args={[0.75, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2.5]} />
          <meshStandardMaterial color={GLASS_COLOR} transparent opacity={opacity} metalness={0.9} roughness={0.1} />
        </mesh>

        {/* 3. THE ICONIC RACING STRIPE */}
        <mesh rotation={[0, 0, Math.PI / 2]} scale={[0.15, 1.01, 1.015]}>
          <capsuleGeometry args={[0.8, 2.5, 32, 32]} />
          <meshStandardMaterial color={STRIPE_COLOR} transparent opacity={opacity} />
        </mesh>

        {/* 4. VENTRAL WEAPONS (Torpedo Tubes) */}
        {[0.25, -0.25].map((z) => (
          <mesh key={z} position={[1.5, -0.6, z]} rotation={[0, 0, -Math.PI / 2.2]}>
            <cylinderGeometry args={[0.06, 0.06, 0.4, 8]} />
            <meshStandardMaterial color={METAL_COLOR} transparent opacity={opacity} />
          </mesh>
        ))}

        {/* 5. BUBBLE TURRET (Top Center) */}
        <group position={[0, 0.75, 0]}>
          <mesh>
            <sphereGeometry args={[0.3, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color={GLASS_COLOR} transparent opacity={opacity * 0.4} metalness={1} />
          </mesh>
          <group position={[0.1, 0.1, 0]} rotation={[0, 0, -Math.PI / 3]}>
            {/* Turret Base / Barrels in METAL_COLOR */}
            <mesh position={[0, 0, 0.04]}><cylinderGeometry args={[0.015, 0.015, 0.4]} /><meshStandardMaterial color={METAL_COLOR} /></mesh>
            <mesh position={[0, 0, -0.04]}><cylinderGeometry args={[0.015, 0.015, 0.4]} /><meshStandardMaterial color={METAL_COLOR} /></mesh>
          </group>
        </group>

        {/* 6. REAR ENGINE ASSEMBLY (Telescopic) */}
        <group position={[-2.1, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.8, 0.4, 1.0, 16]} />
            <meshStandardMaterial color={METAL_COLOR} transparent opacity={opacity} />
          </mesh>
          {/* Blue Dark Matter Engine Glow */}
          <mesh position={[0, -0.51, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.5, 16]} />
            <meshBasicMaterial color="#38bdf8" transparent opacity={opacity} />
          </mesh>
        </group>

        {/* 7. TRI-FIN SYSTEM */}
        {/* Dorsal Fin (Top) */}
        <mesh position={[-1.2, 0.85, 0]} rotation={[0, 0, 0.6]} castShadow>
          <boxGeometry args={[1.5, 1.5, 0.05]} />
          <meshStandardMaterial color={FIN_COLOR} transparent opacity={opacity} />
        </mesh>

        {/* Ventral Fins (Bottom stabilizers with Red Tips) */}
        {[1, -1].map((side) => (
          <group key={side} position={[-1.0, -0.6, side * 0.8]} rotation={[side * 0.8, 0, -0.4]}>
            <mesh castShadow>
              <boxGeometry args={[1.8, 0.05, 1.2]} />
              <meshStandardMaterial color={FIN_COLOR} transparent opacity={opacity} />
            </mesh>
            <mesh position={[-0.7, 0, side * 0.5]} rotation={[0, side * 0.2, 0]}>
              <boxGeometry args={[0.4, 0.06, 0.25]} />
              <meshStandardMaterial color={STRIPE_COLOR} transparent opacity={opacity} />
            </mesh>
          </group>
        ))}

        {/* 8. AIRLOCK DOOR */}
        <mesh position={[-0.2, 0, 0.82]} rotation={[0, 0, 0]}>
          <boxGeometry args={[0.5, 0.7, 0.02]} />
          <meshStandardMaterial color={HULL_COLOR} emissive={HULL_COLOR} emissiveIntensity={0.1} />
        </mesh>
      </group>
    </group>
  );
}
