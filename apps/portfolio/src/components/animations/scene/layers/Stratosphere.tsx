/**
 * Stratosphere Layer
 * Clouds for sky phase with high-altitude easter eggs
 */

import type { JSX } from 'react';
import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Cloud } from '@react-three/drei';
import * as THREE from 'three';
import type { Group } from 'three';
import type { CloudData } from '../../config';

interface StratosphereProps {
  clouds: CloudData[];
  opacity: number;
}

export function Stratosphere({ clouds, opacity }: StratosphereProps): JSX.Element {
  // Easter egg refs
  const balloonRef = useRef<Group>(null);
  const spyPlaneRef = useRef<Group>(null);
  const blimpRef = useRef<Group>(null);

  // Cloud refs for smooth animation
  const cloudRefs = useRef<(Group | null)[]>([]);

  // Random positions for easter eggs
  const easterEggPositions = useMemo(() => ({
    balloon: {
      x: -5 + Math.random() * 3,
      y: 3 + Math.random() * 2,
      z: -7 + Math.random() * 3
    },
    spyPlane: {
      x: 4 + Math.random() * 3,
      y: -1 + Math.random() * 2,
      z: -6 + Math.random() * 3
    },
    blimp: {
      x: -4 + Math.random() * 2,
      y: -2 + Math.random() * 2,
      z: 6 + Math.random() * 3
    }
  }), []);

  // Cloud animation offsets (random phase for each cloud)
  const cloudOffsets = useMemo(() =>
    clouds.map(() => Math.random() * Math.PI * 2)
  , [clouds]);

  // Initialize cloud positions and materials
  useEffect(() => {
    cloudRefs.current.forEach((cloudRef, i) => {
      if (cloudRef && clouds[i]) {
        const cloud = clouds[i]!;
        cloudRef.position.set(cloud.position[0], cloud.position[1], cloud.position[2]);
        cloudRef.rotation.set(cloud.rotation[0], cloud.rotation[1], cloud.rotation[2]);

        // Make clouds bright and white with varying shadow amounts
        cloudRef.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = false;
            mesh.receiveShadow = false;

            // Make material bright with varying shadow definition (0.3 to 0.8)
            if (mesh.material) {
              const material = mesh.material as THREE.MeshStandardMaterial;
              material.color.setHex(0xffffff);
              material.emissive.setHex(0xffffff);
              material.emissiveIntensity = cloud.emissiveIntensity;
              material.roughness = 1;
              material.metalness = 0;
            }
          }
        });
      }
    });
  }, [clouds]);

  // Animate clouds and easter eggs
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    // Animate clouds with smooth gentle movement
    cloudRefs.current.forEach((cloudRef, i) => {
      if (cloudRef && clouds[i]) {
        const cloud = clouds[i]!;
        const offset = cloudOffsets[i]!;

        // Smooth horizontal drift - subtract initial offset so animation starts from base position
        const initialDriftX = Math.sin(offset) * 1.5;
        const driftX = Math.sin(time * cloud.speed + offset) * 1.5 - initialDriftX;
        cloudRef.position.x = cloud.position[0] + driftX;

        // Gentle vertical bobbing - subtract initial offset so animation starts from base position
        const initialBobY = Math.sin(offset) * 0.3;
        const bobY = Math.sin(time * cloud.speed * 0.5 + offset) * 0.3 - initialBobY;
        cloudRef.position.y = cloud.position[1] + bobY;

        // Keep original z position (no animation)
        cloudRef.position.z = cloud.position[2];

        // Subtle continuous rotation - starts from base rotation
        cloudRef.rotation.y = cloud.rotation[1] + time * cloud.speed * 0.1;
      }
    });

    // Weather Balloon: gentle floating and swaying
    if (balloonRef.current) {
      balloonRef.current.rotation.y = time * 0.1;
      balloonRef.current.position.y = easterEggPositions.balloon.y + Math.sin(time * 0.3) * 0.5;
      balloonRef.current.position.x = easterEggPositions.balloon.x + Math.cos(time * 0.2) * 0.3;
    }

    // Spy Plane: fast horizontal flight path
    if (spyPlaneRef.current) {
      // Fast horizontal flight in a wide arc
      spyPlaneRef.current.position.x = easterEggPositions.spyPlane.x + Math.sin(time * 0.25) * 5;
      // Slight altitude variation
      spyPlaneRef.current.position.y = easterEggPositions.spyPlane.y + Math.sin(time * 0.15) * 0.3;
      // Banking turns (rotation around forward axis)
      spyPlaneRef.current.rotation.z = Math.sin(time * 0.25) * 0.2;
      // Slight pitch variation
      spyPlaneRef.current.rotation.y = Math.cos(time * 0.25) * 0.1;
    }

    // Blimp: slow cruise
    if (blimpRef.current) {
      blimpRef.current.position.x = easterEggPositions.blimp.x + Math.sin(time * 0.15) * 2;
      blimpRef.current.rotation.y = time * 0.05;
    }
  });

  return (
    <>
      {clouds.map((cloud, i) => (
        <group
          key={`cloud-${i}`}
          scale={cloud.scale}
          ref={(el) => {
            cloudRefs.current[i] = el;
          }}
        >
          <Cloud
            opacity={opacity}
            speed={0}
            color="#ffffff"
            segments={20}
            bounds={[6, 2, 2]}
            volume={6}
          />
        </group>
      ))}

      {/* Easter Egg 1: Weather Balloon */}
      <group
        ref={balloonRef}
        position={[easterEggPositions.balloon.x, easterEggPositions.balloon.y, easterEggPositions.balloon.z]}
        scale={0.3}
      >
        {/* Balloon */}
        <mesh position={[0, 1, 0]}>
          <sphereGeometry args={[0.8, 16, 16]} />
          <meshStandardMaterial color="#f87171" transparent opacity={0.7} roughness={0.3} metalness={0.1} />
        </mesh>
        {/* Shine/highlight */}
        <mesh position={[0.2, 1.3, 0.2]} scale={0.3}>
          <sphereGeometry args={[0.3, 8, 8]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0.5} emissive="#ffffff" emissiveIntensity={0.3} />
        </mesh>
        {/* Rope */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 2, 8]} />
          <meshStandardMaterial color="#78716c" />
        </mesh>
        {/* Instrument box */}
        <mesh position={[0, -1.2, 0]}>
          <boxGeometry args={[0.4, 0.3, 0.3]} />
          <meshStandardMaterial color="#e5e7eb" metalness={0.5} roughness={0.5} />
        </mesh>
        {/* Antenna */}
        <mesh position={[0, -1.5, 0]}>
          <cylinderGeometry args={[0.01, 0.01, 0.3, 8]} />
          <meshStandardMaterial color="#9ca3af" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>

      {/* Easter Egg 2: SR-71 Blackbird Spy Plane */}
      <group
        ref={spyPlaneRef}
        position={[easterEggPositions.spyPlane.x, easterEggPositions.spyPlane.y, easterEggPositions.spyPlane.z]}
        scale={0.35}
      >
        {/* Fuselage - horizontal orientation */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.2, 0.15, 3, 16]} />
          <meshStandardMaterial color="#1f2937" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Nose - pointed forward */}
        <mesh position={[1.7, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <coneGeometry args={[0.2, 0.5, 16]} />
          <meshStandardMaterial color="#111827" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Delta wings - wide triangular shape */}
        <mesh position={[-0.3, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <boxGeometry args={[1.5, 3, 0.08]} />
          <meshStandardMaterial color="#1f2937" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Twin tail fins - distinctive SR-71 feature */}
        <mesh position={[-1.2, 0.3, 0.5]} rotation={[0, 0, Math.PI / 6]}>
          <boxGeometry args={[0.4, 0.6, 0.05]} />
          <meshStandardMaterial color="#374151" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[-1.2, 0.3, -0.5]} rotation={[0, 0, Math.PI / 6]}>
          <boxGeometry args={[0.4, 0.6, 0.05]} />
          <meshStandardMaterial color="#374151" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Cockpit - front of fuselage */}
        <mesh position={[0.8, 0.15, 0]}>
          <sphereGeometry args={[0.12, 8, 8]} />
          <meshStandardMaterial color="#1e40af" transparent opacity={0.6} emissive="#1e40af" emissiveIntensity={0.2} />
        </mesh>
        {/* Twin engines at rear */}
        <mesh position={[-1.6, 0, 0.4]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.15, 0.18, 0.5, 12]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[-1.6, 0, -0.4]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.15, 0.18, 0.5, 12]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Engine glow */}
        <mesh position={[-1.85, 0, 0.4]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial color="#ff6b35" emissive="#ff6b35" emissiveIntensity={1.2} transparent opacity={0.7} />
        </mesh>
        <mesh position={[-1.85, 0, -0.4]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial color="#ff6b35" emissive="#ff6b35" emissiveIntensity={1.2} transparent opacity={0.7} />
        </mesh>
      </group>

      {/* Easter Egg 3: Blimp/Zeppelin */}
      <group
        ref={blimpRef}
        position={[easterEggPositions.blimp.x, easterEggPositions.blimp.y, easterEggPositions.blimp.z]}
        scale={0.4}
      >
        {/* Main envelope */}
        <mesh scale={[1, 0.5, 0.5]}>
          <sphereGeometry args={[2, 16, 16]} />
          <meshStandardMaterial color="#ef4444" metalness={0.3} roughness={0.6} />
        </mesh>
        {/* Stripe */}
        <mesh scale={[2.05, 0.3, 0.52]} position={[0, -0.1, 0]}>
          <sphereGeometry args={[1, 16, 8, 0, Math.PI * 2, 0, Math.PI]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.3} roughness={0.6} />
        </mesh>
        {/* Gondola */}
        <mesh position={[0, -0.7, 0]}>
          <boxGeometry args={[0.8, 0.3, 0.3]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.5} roughness={0.5} />
        </mesh>
        {/* Fins */}
        <mesh position={[-1.8, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <coneGeometry args={[0.3, 0.5, 3]} />
          <meshStandardMaterial color="#b91c1c" metalness={0.4} roughness={0.6} />
        </mesh>
        <mesh position={[-1.8, 0.3, 0]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.05, 0.4, 0.3]} />
          <meshStandardMaterial color="#991b1b" metalness={0.4} roughness={0.6} />
        </mesh>
      </group>
    </>
  );
}
