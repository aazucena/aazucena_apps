/**
 * Troposphere Layer
 * Ground scene with land, houses, trees, bushes, rocks, flowers and flying easter eggs
 */

import type { JSX } from 'react';
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Ground, House, Tree, Bush, Rock, Flower } from '../ground';
import type { Group } from 'three';
import type { HouseData, TreeData, BushData, RockData, FlowerData } from '../../config';

interface TroposphereProps {
  houses: HouseData[];
  trees: TreeData[];
  bushes: BushData[];
  rocks: RockData[];
  flowers: FlowerData[];
  opacity: number;
}

export function Troposphere({ houses, trees, bushes, rocks, flowers, opacity }: TroposphereProps): JSX.Element {
  // Easter egg refs
  const airplaneRef = useRef<Group>(null);
  const birdRef = useRef<Group>(null);
  const droneRef = useRef<Group>(null);

  // Random positions for easter eggs
  const easterEggPositions = useMemo(() => ({
    airplane: {
      x: -5 + Math.random() * 2,
      y: 4 + Math.random() * 2,
      z: -6 + Math.random() * 2
    },
    bird: {
      x: 4 + Math.random() * 2,
      y: 3 + Math.random() * 1,
      z: -5 + Math.random() * 2
    },
    drone: {
      x: -3 + Math.random() * 2,
      y: 2 + Math.random() * 1,
      z: 5 + Math.random() * 2
    }
  }), []);

  // Animate easter eggs
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    // Airplane: cruising flight path
    if (airplaneRef.current) {
      airplaneRef.current.position.x = easterEggPositions.airplane.x + Math.sin(time * 0.2) * 3;
      airplaneRef.current.rotation.z = Math.sin(time * 0.2) * 0.1;
      airplaneRef.current.position.y = easterEggPositions.airplane.y + Math.sin(time * 0.15) * 0.3;
    }

    // Bird: flapping and gliding
    if (birdRef.current) {
      birdRef.current.position.y = easterEggPositions.bird.y + Math.sin(time * 2) * 0.3;
      birdRef.current.position.x = easterEggPositions.bird.x + Math.cos(time * 0.3) * 2;
      birdRef.current.rotation.z = Math.sin(time * 0.3) * 0.2;
      // Wing flapping
      const wing1 = birdRef.current.children[1];
      const wing2 = birdRef.current.children[2];
      if (wing1 && wing2) {
        wing1.rotation.z = Math.sin(time * 8) * 0.3;
        wing2.rotation.z = -Math.sin(time * 8) * 0.3;
      }
    }

    // Drone: hovering and maneuvering
    if (droneRef.current) {
      droneRef.current.position.y = easterEggPositions.drone.y + Math.sin(time * 1.5) * 0.2;
      droneRef.current.position.x = easterEggPositions.drone.x + Math.sin(time * 0.4) * 1;
      droneRef.current.rotation.y = time * 0.5;
      // Propeller spinning
      for (let i = 3; i < 7; i++) {
        const propeller = droneRef.current.children[i];
        if (propeller) {
          propeller.rotation.y = time * 20;
        }
      }
    }
  });

  return (
    <group>
      <Ground opacity={opacity} />

      {houses.map((house, i) => (
        <House key={`house-${i}`} {...house} opacity={opacity} />
      ))}

      {trees.map((tree, i) => (
        <Tree key={`tree-${i}`} {...tree} opacity={opacity} />
      ))}

      {bushes.map((bush, i) => (
        <Bush key={`bush-${i}`} {...bush} opacity={opacity} />
      ))}

      {rocks.map((rock, i) => (
        <Rock key={`rock-${i}`} {...rock} opacity={opacity} />
      ))}

      {flowers.map((flower, i) => (
        <Flower key={`flower-${i}`} {...flower} opacity={opacity} />
      ))}

      {/* Easter Egg 1: Commercial Airplane */}
      <group
        ref={airplaneRef}
        position={[easterEggPositions.airplane.x, easterEggPositions.airplane.y, easterEggPositions.airplane.z]}
        scale={0.3}
        rotation={[0, Math.PI / 2, 0]}
      >
        {/* Fuselage */}
        <mesh>
          <cylinderGeometry args={[0.3, 0.3, 4, 16]} />
          <meshStandardMaterial color="#f1f5f9" metalness={0.6} roughness={0.3} />
        </mesh>
        {/* Nose */}
        <mesh position={[0, 2.3, 0]}>
          <coneGeometry args={[0.3, 0.6, 16]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.7} roughness={0.2} />
        </mesh>
        {/* Wings */}
        <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
          <boxGeometry args={[0.15, 0.5, 4.5]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.6} roughness={0.3} />
        </mesh>
        {/* Tail wing */}
        <mesh position={[0, -1.8, 0]}>
          <boxGeometry args={[0.15, 0.3, 1.5]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.5} roughness={0.4} />
        </mesh>
        {/* Vertical stabilizer */}
        <mesh position={[0.5, -1.8, 0]} rotation={[0, 0, Math.PI / 2]}>
          <boxGeometry args={[0.15, 1, 0.8]} />
          <meshStandardMaterial color="#64748b" metalness={0.5} roughness={0.4} />
        </mesh>
        {/* Engines */}
        <mesh position={[0, 0.3, -1.5]}>
          <cylinderGeometry args={[0.2, 0.25, 0.6, 16]} />
          <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.3, 1.5]}>
          <cylinderGeometry args={[0.2, 0.25, 0.6, 16]} />
          <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Windows */}
        {[0, 0.5, 1, 1.5].map((pos, i) => (
          <mesh key={i} position={[0, pos, 0.31]}>
            <circleGeometry args={[0.08, 8]} />
            <meshStandardMaterial color="#3b82f6" emissive="#1e40af" emissiveIntensity={0.3} />
          </mesh>
        ))}
      </group>

      {/* Easter Egg 2: Bird */}
      <group
        ref={birdRef}
        position={[easterEggPositions.bird.x, easterEggPositions.bird.y, easterEggPositions.bird.z]}
        scale={0.15}
      >
        {/* Body */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <capsuleGeometry args={[0.2, 0.6, 8, 16]} />
          <meshStandardMaterial color="#78716c" roughness={0.8} metalness={0.1} />
        </mesh>
        {/* Left wing */}
        <mesh position={[-0.4, 0, -0.3]} rotation={[0, -0.3, 0.5]}>
          <boxGeometry args={[0.05, 1.2, 0.6]} />
          <meshStandardMaterial color="#57534e" roughness={0.7} metalness={0.1} />
        </mesh>
        {/* Right wing */}
        <mesh position={[-0.4, 0, 0.3]} rotation={[0, 0.3, -0.5]}>
          <boxGeometry args={[0.05, 1.2, 0.6]} />
          <meshStandardMaterial color="#57534e" roughness={0.7} metalness={0.1} />
        </mesh>
        {/* Head */}
        <mesh position={[-0.45, 0, 0]}>
          <sphereGeometry args={[0.15, 12, 12]} />
          <meshStandardMaterial color="#292524" roughness={0.6} metalness={0.1} />
        </mesh>
        {/* Beak */}
        <mesh position={[-0.55, -0.05, 0]} rotation={[0, 0, -Math.PI / 6]}>
          <coneGeometry args={[0.05, 0.15, 8]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.5} metalness={0.2} />
        </mesh>
        {/* Tail */}
        <mesh position={[0.4, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <coneGeometry args={[0.15, 0.4, 3]} />
          <meshStandardMaterial color="#44403c" roughness={0.7} metalness={0.1} />
        </mesh>
      </group>

      {/* Easter Egg 3: Drone */}
      <group
        ref={droneRef}
        position={[easterEggPositions.drone.x, easterEggPositions.drone.y, easterEggPositions.drone.z]}
        scale={0.2}
      >
        {/* Central body */}
        <mesh>
          <boxGeometry args={[0.6, 0.2, 0.6]} />
          <meshStandardMaterial color="#1f2937" metalness={0.6} roughness={0.4} />
        </mesh>
        {/* Camera */}
        <mesh position={[0, -0.15, 0]}>
          <sphereGeometry args={[0.1, 12, 12]} />
          <meshStandardMaterial color="#374151" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Lens */}
        <mesh position={[0, -0.2, 0.1]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial color="#1e40af" transparent opacity={0.7} emissive="#3b82f6" emissiveIntensity={0.4} />
        </mesh>
        {/* Propeller arms */}
        {[[0.8, 0.8], [0.8, -0.8], [-0.8, 0.8], [-0.8, -0.8]].map((pos, i) => (
          <group key={i}>
            {/* Arm */}
            <mesh position={[pos[0] / 2, 0, pos[1] / 2]} rotation={[0, Math.atan2(pos[1], pos[0]), 0]}>
              <cylinderGeometry args={[0.03, 0.03, 0.9, 8]} />
              <meshStandardMaterial color="#4b5563" metalness={0.7} roughness={0.3} />
            </mesh>
            {/* Motor */}
            <mesh position={[pos[0], 0.15, pos[1]]}>
              <cylinderGeometry args={[0.08, 0.08, 0.1, 12]} />
              <meshStandardMaterial color="#6b7280" metalness={0.8} roughness={0.2} />
            </mesh>
            {/* Propeller (will spin in animation) */}
            <mesh position={[pos[0], 0.22, pos[1]]} rotation={[0, 0, 0]}>
              <boxGeometry args={[0.6, 0.02, 0.08]} />
              <meshStandardMaterial color="#9ca3af" metalness={0.5} roughness={0.4} transparent opacity={0.6} />
            </mesh>
          </group>
        ))}
        {/* LED lights */}
        <mesh position={[0.25, 0.12, 0.25]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={1.5} />
        </mesh>
        <mesh position={[-0.25, 0.12, -0.25]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1.5} />
        </mesh>
      </group>
    </group>
  );
}
