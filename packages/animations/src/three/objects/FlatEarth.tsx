/**
 * Flat Earth Easter Egg
 * Fixed: Added continents, oceans, and synchronized sun/moon orbital rotation.
 * The ultimate wacky theory (Exosphere).
 */

import type { JSX } from 'react';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';

interface FlatEarthProps {
  opacity: number;
}

export function FlatEarth({ opacity }: FlatEarthProps): JSX.Element {
  const earthRef = useRef<Group>(null);
  const sunMoonRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    // Majestic tumbling of the whole system
    if (earthRef.current) {
      earthRef.current.rotation.x = Math.sin(time * 0.2) * 0.2;
      earthRef.current.rotation.z = Math.cos(time * 0.1) * 0.1;
    }

    // Circular orbit for Sun and Moon inside the dome
    if (sunMoonRef.current) {
      sunMoonRef.current.rotation.y = time * 0.5;
    }
  });

  // Continents: Simplified low-poly islands on the disc
  const Continent = ({
    pos,
    scale,
    color,
  }: {
    pos: [number, number, number];
    scale: [number, number, number];
    color: string;
  }) => (
    <mesh position={pos} scale={scale}>
      <boxGeometry args={[1, 0.05, 1]} />
      <meshStandardMaterial color={color} transparent opacity={opacity} />
    </mesh>
  );

  return (
    <group ref={earthRef} scale={[2.5, 2.5, 2.5]}>
      {/* The Disc (The Ocean Base) */}
      <mesh rotation={[0, 0, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[1, 1, 0.1, 32]} />
        <meshStandardMaterial color="#1e3a8a" transparent opacity={opacity} roughness={0.3} />
      </mesh>

      {/* Continents (The "Land") */}
      <group position={[0, 0.06, 0]}>
        <Continent pos={[0, 0, 0]} scale={[0.4, 1, 0.4]} color="#166534" />{' '}
        {/* Pangea-ish center */}
        <Continent pos={[0.3, 0, 0.4]} scale={[0.2, 1, 0.3]} color="#15803d" />
        <Continent pos={[-0.4, 0, -0.2]} scale={[0.3, 1, 0.25]} color="#14532d" />
        <Continent pos={[0.5, 0, -0.3]} scale={[0.25, 1, 0.2]} color="#16a34a" />
        <Continent pos={[-0.2, 0, 0.5]} scale={[0.2, 1, 0.2]} color="#166534" />
      </group>

      {/* The Ice Wall (Antarctic Rim) */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <torusGeometry args={[1.02, 0.08, 8, 48]} />
        <meshStandardMaterial
          color="#f1f5f9"
          transparent
          opacity={opacity}
          metalness={0.1}
          roughness={0.1}
        />
      </mesh>

      {/* The Dome (Transparent half-sphere) */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1.05, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color="#7dd3fc"
          transparent
          opacity={opacity * 0.2}
          metalness={0.5}
          roughness={0}
        />
      </mesh>

      {/* Orbital Sun & Moon */}
      <group ref={sunMoonRef} position={[0, 0.4, 0]}>
        {/* Sun */}
        <group position={[0.6, 0, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.08, 12, 12]} />
            <meshBasicMaterial color="#fbbf24" transparent opacity={opacity} />
          </mesh>
          <pointLight color="#fbbf24" intensity={2} distance={3} />
        </group>

        {/* Moon */}
        <mesh position={[-0.6, 0, 0]}>
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshStandardMaterial
            color="#cbd5e1"
            transparent
            opacity={opacity}
            emissive="#475569"
            emissiveIntensity={0.5}
          />
        </mesh>
      </group>

      {/* Atmosphere/Haze inside dome */}
      <mesh position={[0, 0.1, 0]} scale={[0.9, 0.2, 0.9]}>
        <cylinderGeometry args={[1, 1, 1, 32]} />
        <meshStandardMaterial color="#38bdf8" transparent opacity={opacity * 0.05} />
      </mesh>
    </group>
  );
}
