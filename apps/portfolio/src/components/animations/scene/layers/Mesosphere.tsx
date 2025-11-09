/**
 * Mesosphere Layer
 * Meteor effects and icy sparkles with space debris easter eggs
 */

import type { JSX } from 'react';
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import type { Group } from 'three';

interface MesosphereProps {
  opacity: number;
}

export function Mesosphere({ opacity }: MesosphereProps): JSX.Element {
  // Easter egg refs
  const cometRef = useRef<Group>(null);
  const meteorRef = useRef<Group>(null);
  const debris1Ref = useRef<Group>(null);
  const debris2Ref = useRef<Group>(null);
  const debris3Ref = useRef<Group>(null);
  const debris4Ref = useRef<Group>(null);

  // Positions for easter eggs - closer to center and more visible
  const easterEggPositions = useMemo(() => ({
    comet: {
      x: -3 + Math.random() * 1,
      y: 2 + Math.random() * 1,
      z: -12 + Math.random() * 2
    },
    meteor: {
      x: 3 + Math.random() * 1,
      y: -1 + Math.random() * 1,
      z: -10 + Math.random() * 2
    },
    debris1: {
      x: -2 + Math.random() * 1,
      y: 1 + Math.random() * 1,
      z: -9 + Math.random() * 1
    },
    debris2: {
      x: 1 + Math.random() * 1,
      y: -2 + Math.random() * 1,
      z: -11 + Math.random() * 1
    },
    debris3: {
      x: -1 + Math.random() * 1,
      y: 0 + Math.random() * 1,
      z: -10 + Math.random() * 1
    },
    debris4: {
      x: 2 + Math.random() * 1,
      y: 1.5 + Math.random() * 1,
      z: -8 + Math.random() * 1
    }
  }), []);

  // Create curved tail path for comet - starts at nucleus and flows upward
  const cometTailCurve = useMemo(() => {
    const points = [];
    for (let i = 0; i <= 30; i++) {
      const t = i / 30;
      const curve = Math.pow(t, 0.7); // Natural curve falloff
      points.push(new THREE.Vector3(
        -curve * 0.8 - t * 0.2, // Drift left and back
        curve * 5, // Flow upward
        0
      ));
    }
    return new THREE.CatmullRomCurve3(points);
  }, []);

  // Animate easter eggs
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    // Comet: moving with glowing tail
    if (cometRef.current) {
      cometRef.current.rotation.z = time * 0.05;
      cometRef.current.position.x = easterEggPositions.comet.x + Math.sin(time * 0.2) * 2;
      cometRef.current.position.y = easterEggPositions.comet.y - time * 0.5 % 10;
    }

    // Meteor: fast spinning and moving diagonally
    if (meteorRef.current) {
      meteorRef.current.rotation.x = time * 0.8;
      meteorRef.current.rotation.y = time * 0.6;
      meteorRef.current.position.x = easterEggPositions.meteor.x - time * 0.3 % 12;
      meteorRef.current.position.y = easterEggPositions.meteor.y - time * 0.4 % 10;
    }

    // Space debris pieces: slow tumbling and drifting
    if (debris1Ref.current) {
      debris1Ref.current.rotation.x = time * 0.15;
      debris1Ref.current.rotation.y = time * 0.25;
      debris1Ref.current.rotation.z = time * 0.2;
      debris1Ref.current.position.x = easterEggPositions.debris1.x + Math.sin(time * 0.3) * 0.5;
      debris1Ref.current.position.y = easterEggPositions.debris1.y + Math.cos(time * 0.2) * 0.3;
    }

    if (debris2Ref.current) {
      debris2Ref.current.rotation.x = time * 0.18;
      debris2Ref.current.rotation.y = time * 0.22;
      debris2Ref.current.rotation.z = time * 0.15;
      debris2Ref.current.position.x = easterEggPositions.debris2.x + Math.sin(time * 0.25) * 0.4;
      debris2Ref.current.position.y = easterEggPositions.debris2.y + Math.cos(time * 0.3) * 0.5;
    }

    if (debris3Ref.current) {
      debris3Ref.current.rotation.x = time * 0.2;
      debris3Ref.current.rotation.y = time * 0.15;
      debris3Ref.current.rotation.z = time * 0.25;
      debris3Ref.current.position.x = easterEggPositions.debris3.x + Math.sin(time * 0.28) * 0.6;
      debris3Ref.current.position.y = easterEggPositions.debris3.y + Math.cos(time * 0.25) * 0.4;
    }

    if (debris4Ref.current) {
      debris4Ref.current.rotation.x = time * 0.12;
      debris4Ref.current.rotation.y = time * 0.28;
      debris4Ref.current.rotation.z = time * 0.18;
      debris4Ref.current.position.x = easterEggPositions.debris4.x + Math.sin(time * 0.22) * 0.35;
      debris4Ref.current.position.y = easterEggPositions.debris4.y + Math.cos(time * 0.35) * 0.45;
    }
  });

  return (
    <>
      {/* Icy blue sparkles for cold atmosphere */}
      <Sparkles
        count={120}
        scale={[30, 10, 30]}
        size={1}
        speed={0.1}
        opacity={0.4 * opacity}
        color="#3A86FF"
      />

      {/* Noctilucent Clouds - rare silvery-blue clouds at edge of space */}
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh
          key={`cloud-${i}`}
          position={[
            -10 + i * 5,
            -2 + Math.sin(i) * 2,
            -15 + i * 3
          ]}
          rotation={[0, i * 0.3, 0]}
        >
          <planeGeometry args={[4, 2, 1, 1]} />
          <meshStandardMaterial
            color="#a5f3fc"
            emissive="#67e8f9"
            emissiveIntensity={0.3}
            transparent
            opacity={0.15 * opacity}
            side={2}
          />
        </mesh>
      ))}

      {/* Atmospheric haze layers - coldest layer of atmosphere */}
      {Array.from({ length: 3 }).map((_, i) => (
        <mesh
          key={`haze-${i}`}
          position={[0, -3 + i * 2, -20 + i * 2]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[8 + i * 3, 15 + i * 4, 32]} />
          <meshStandardMaterial
            color="#0ea5e9"
            transparent
            opacity={0.08 * opacity}
            side={2}
          />
        </mesh>
      ))}

      {/* Ice crystals floating - mesosphere is the coldest layer */}
      <Sparkles
        count={80}
        scale={[25, 8, 25]}
        size={0.5}
        speed={0.05}
        opacity={0.3 * opacity}
        color="#e0f2fe"
      />

      {/* Shooting stars/meteors - this is where meteors burn up */}
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh
          key={`meteor-${i}`}
          position={[
            (i - 2) * 12,
            6 - i * 2,
            10 - i * 6
          ]}
          rotation={[Math.PI / 6, i * 0.5, 0]}
        >
          <cylinderGeometry args={[0.05, 0.15, 3, 8]} />
          <meshStandardMaterial
            color="#FFFFFF"
            emissive="#87CEEB"
            emissiveIntensity={0.8}
            transparent
            opacity={0.6 * opacity}
          />
        </mesh>
      ))}

      {/* Easter Egg 1: Comet with Glowing Tail */}
      <group
        ref={cometRef}
        position={[easterEggPositions.comet.x, easterEggPositions.comet.y, easterEggPositions.comet.z]}
        scale={0.5}
        rotation={[0, 0, Math.PI / 6]}
      >
        {/* Comet nucleus */}
        <mesh>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshStandardMaterial color="#d1d5db" roughness={0.8} metalness={0.2} />
        </mesh>
        {/* Icy surface detail */}
        <mesh scale={1.05}>
          <sphereGeometry args={[0.4, 8, 8]} />
          <meshStandardMaterial color="#60a5fa" transparent opacity={0.3} emissive="#3b82f6" emissiveIntensity={0.2} />
        </mesh>
        {/* Curved tail - flowing naturally from nucleus with tapering */}
        {[0, 1, 2, 3, 4].map((i) => {
          const radius = 0.3 - i * 0.05; // Taper from thick to thin
          const segmentOpacity = 0.7 - i * 0.12; // Fade as it extends

          return (
            <mesh key={i}>
              <tubeGeometry
                args={[
                  new THREE.CatmullRomCurve3(
                    cometTailCurve.getPoints(30).slice(i * 6, (i + 1) * 6 + 1)
                  ),
                  12,
                  radius,
                  8,
                  false
                ]}
              />
              <meshStandardMaterial
                color="#60a5fa"
                emissive="#3b82f6"
                emissiveIntensity={0.8 - i * 0.15}
                transparent
                opacity={segmentOpacity}
              />
            </mesh>
          );
        })}
      </group>

      {/* Easter Egg 2: Rocky Meteor */}
      <group
        ref={meteorRef}
        position={[easterEggPositions.meteor.x, easterEggPositions.meteor.y, easterEggPositions.meteor.z]}
        scale={0.55}
        rotation={[0, 0, Math.PI / 4]}
      >
        {/* Irregular rocky shape */}
        <mesh>
          <dodecahedronGeometry args={[0.5, 0]} />
          <meshStandardMaterial color="#78716c" roughness={0.9} metalness={0.1} />
        </mesh>
        <mesh scale={[1.2, 0.8, 0.9]} position={[0.1, 0, 0]}>
          <dodecahedronGeometry args={[0.4, 0]} />
          <meshStandardMaterial color="#57534e" roughness={0.9} metalness={0.1} />
        </mesh>
        {/* Hot spots from atmospheric entry */}
        <mesh scale={0.3} position={[0.3, 0.2, 0.3]}>
          <sphereGeometry args={[0.2, 8, 8]} />
          <meshStandardMaterial color="#f97316" emissive="#f97316" emissiveIntensity={1.2} />
        </mesh>
        <mesh scale={0.25} position={[-0.2, -0.3, 0.2]}>
          <sphereGeometry args={[0.2, 8, 8]} />
          <meshStandardMaterial color="#fb923c" emissive="#fb923c" emissiveIntensity={1} />
        </mesh>

        {/* Fiery tail trailing behind - moving diagonally up-right since meteor moves down-left */}
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} position={[0.3 + i * 0.6, 0.3 + i * 0.7, 0]} rotation={[0, 0, -Math.PI / 4]}>
            <coneGeometry args={[0.25 - i * 0.05, 0.8, 8]} />
            <meshStandardMaterial
              color={i < 2 ? "#f97316" : "#fb923c"}
              emissive={i < 2 ? "#f97316" : "#fb923c"}
              emissiveIntensity={0.8 - i * 0.15}
              transparent
              opacity={0.6 - i * 0.12}
            />
          </mesh>
        ))}
      </group>

      {/* Easter Egg 3: Space Debris - Broken solar panel */}
      <group
        ref={debris1Ref}
        position={[easterEggPositions.debris1.x, easterEggPositions.debris1.y, easterEggPositions.debris1.z]}
        scale={0.45}
      >
        <mesh rotation={[0.3, 0.5, 0]}>
          <boxGeometry args={[1.5, 0.05, 0.8]} />
          <meshStandardMaterial color="#1e40af" emissive="#1e40af" emissiveIntensity={0.1} metalness={0.7} roughness={0.4} />
        </mesh>
      </group>

      {/* Space Debris - Damaged panel piece */}
      <group
        ref={debris2Ref}
        position={[easterEggPositions.debris2.x, easterEggPositions.debris2.y, easterEggPositions.debris2.z]}
        scale={0.45}
      >
        <mesh rotation={[0, 0, 0.5]}>
          <boxGeometry args={[0.6, 0.05, 0.8]} />
          <meshStandardMaterial color="#374151" metalness={0.8} roughness={0.3} />
        </mesh>
      </group>

      {/* Space Debris - Central body piece */}
      <group
        ref={debris3Ref}
        position={[easterEggPositions.debris3.x, easterEggPositions.debris3.y, easterEggPositions.debris3.z]}
        scale={0.45}
      >
        <mesh>
          <boxGeometry args={[0.4, 0.4, 0.4]} />
          <meshStandardMaterial color="#6b7280" metalness={0.6} roughness={0.5} />
        </mesh>
      </group>

      {/* Space Debris - Antenna fragment */}
      <group
        ref={debris4Ref}
        position={[easterEggPositions.debris4.x, easterEggPositions.debris4.y, easterEggPositions.debris4.z]}
        scale={0.45}
      >
        <mesh rotation={[0.3, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.6, 8]} />
          <meshStandardMaterial color="#9ca3af" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>
    </>
  );
}
