/**
 * Exosphere Layer
 * Background particles and sparkles for deep space with Milky Way effect
 */

import type { JSX } from 'react';
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import type { Points, BufferGeometry, Material, Group } from 'three';
import type { ParticleData } from '../data/particles';

interface ExosphereProps {
  particles: ParticleData;
  particleCount: number;
  opacity: number;
  intensity: number;
}

export function Exosphere({ particles, particleCount, opacity, intensity }: ExosphereProps): JSX.Element {
  const particlesRef = useRef<Points<BufferGeometry, Material | Material[]>>(null);
  const milkyWayRef = useRef<Points<BufferGeometry, Material | Material[]>>(null);
  const sparklesRef = useRef<Points<BufferGeometry, Material | Material[]>>(null);

  // Easter egg refs
  const satelliteRef = useRef<Group>(null);
  const ufoRef = useRef<Group>(null);
  const rocketRef = useRef<Group>(null);

  // Generate Milky Way band particles
  const milkyWayData = useMemo(() => {
    const count = 2000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    // Milky Way colors: white, blue-white, yellow-white
    const milkyWayColors = [
      new THREE.Color(0xffffff), // White
      new THREE.Color(0xe0f0ff), // Blue-white
      new THREE.Color(0xfff8dc), // Yellow-white
      new THREE.Color(0xddeeff), // Icy blue
      new THREE.Color(0xffeedd), // Warm white
    ];

    for (let i = 0; i < count; i++) {
      // Create a band that wraps around the scene
      const angle = Math.random() * Math.PI * 2;
      const bandWidth = 4; // Width of the milky way band
      const radius = 12 + Math.random() * 3; // Distance from center

      // Add vertical variation for band thickness
      const bandOffset = (Math.random() - 0.5) * bandWidth;

      // More particles in the center of the band (gaussian distribution)
      const gaussianOffset = (Math.random() + Math.random() + Math.random() + Math.random() - 2) * bandWidth * 0.5;

      // Position along the band
      positions[i * 3] = Math.cos(angle) * radius + (Math.random() - 0.5) * 2;
      positions[i * 3 + 1] = bandOffset + gaussianOffset; // Height creates the band
      positions[i * 3 + 2] = Math.sin(angle) * radius + (Math.random() - 0.5) * 2;

      // Color variation
      const color = milkyWayColors[Math.floor(Math.random() * milkyWayColors.length)];
      colors[i * 3] = color!.r;
      colors[i * 3 + 1] = color!.g;
      colors[i * 3 + 2] = color!.b;

      // Size variation - smaller particles for more density appearance
      sizes[i] = 0.015 + Math.random() * 0.025;
    }

    return { positions, colors, sizes, count };
  }, []);

  // Random positions for easter eggs
  const easterEggPositions = useMemo(() => ({
    satellite: {
      x: -8 + Math.random() * 4,
      y: 2 + Math.random() * 3,
      z: -10 + Math.random() * 4
    },
    ufo: {
      x: 5 + Math.random() * 4,
      y: -2 + Math.random() * 3,
      z: -8 + Math.random() * 4
    },
    rocket: {
      x: -6 + Math.random() * 4,
      y: -3 + Math.random() * 3,
      z: 8 + Math.random() * 4
    }
  }), []);

  // Animate easter eggs
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    // Satellite: slow rotation and gentle bobbing
    if (satelliteRef.current) {
      satelliteRef.current.rotation.y = time * 0.3;
      satelliteRef.current.rotation.z = Math.sin(time * 0.5) * 0.1;
      satelliteRef.current.position.y = easterEggPositions.satellite.y + Math.sin(time * 0.4) * 0.2;
    }

    // UFO: wobbling motion
    if (ufoRef.current) {
      ufoRef.current.rotation.y = time * 0.5;
      ufoRef.current.rotation.x = Math.sin(time * 0.8) * 0.15;
      ufoRef.current.position.y = easterEggPositions.ufo.y + Math.sin(time * 0.6) * 0.3;
      ufoRef.current.position.x = easterEggPositions.ufo.x + Math.cos(time * 0.4) * 0.2;
    }

    // Rocket: slow tumble
    if (rocketRef.current) {
      rocketRef.current.rotation.z = time * 0.4;
      rocketRef.current.rotation.x = Math.sin(time * 0.3) * 0.2;
    }
  });

  return (
    <>
      {/* Background particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            args={[particles.positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            count={particleCount}
            args={[particles.colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.03}
          vertexColors
          transparent
          opacity={0.7 * opacity}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Milky Way band */}
      <points ref={milkyWayRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={milkyWayData.count}
            args={[milkyWayData.positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            count={milkyWayData.count}
            args={[milkyWayData.colors, 3]}
          />
          <bufferAttribute
            attach="attributes-size"
            count={milkyWayData.count}
            args={[milkyWayData.sizes, 1]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.02}
          vertexColors
          transparent
          opacity={0.8 * opacity}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Sparkles for magical effect */}
      <Sparkles
        ref={sparklesRef}
        count={100}
        scale={[20, 8, 20]}
        size={1.5 * intensity}
        speed={0.2 * intensity}
        opacity={0.4 * opacity}
        color="#ffffff"
      />

      {/* Easter Egg 1: Satellite */}
      <group
        ref={satelliteRef}
        position={[easterEggPositions.satellite.x, easterEggPositions.satellite.y, easterEggPositions.satellite.z]}
        scale={0.3}
      >
        {/* Main body */}
        <mesh>
          <boxGeometry args={[0.8, 0.8, 0.8]} />
          <meshStandardMaterial color="#4a5568" metalness={0.8} roughness={0.2} emissive="#1e3a8a" emissiveIntensity={0.2} />
        </mesh>

        {/* Connecting arms for solar panels - left */}
        <mesh position={[-0.7, 0, 0]}>
          <boxGeometry args={[0.6, 0.15, 0.15]} />
          <meshStandardMaterial color="#6b7280" metalness={0.7} roughness={0.3} emissive="#475569" emissiveIntensity={0.2} />
        </mesh>

        {/* Connecting arms for solar panels - right */}
        <mesh position={[0.7, 0, 0]}>
          <boxGeometry args={[0.6, 0.15, 0.15]} />
          <meshStandardMaterial color="#6b7280" metalness={0.7} roughness={0.3} emissive="#475569" emissiveIntensity={0.2} />
        </mesh>

        {/* Solar panels - left */}
        <mesh position={[-1.2, 0, 0]}>
          <boxGeometry args={[0.8, 1.5, 0.05]} />
          <meshStandardMaterial color="#1e40af" metalness={0.6} roughness={0.3} emissive="#3b82f6" emissiveIntensity={0.3} />
        </mesh>

        {/* Solar panels - right */}
        <mesh position={[1.2, 0, 0]}>
          <boxGeometry args={[0.8, 1.5, 0.05]} />
          <meshStandardMaterial color="#1e40af" metalness={0.6} roughness={0.3} emissive="#3b82f6" emissiveIntensity={0.3} />
        </mesh>

        {/* Antenna */}
        <mesh position={[0, 0.6, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.5]} />
          <meshStandardMaterial color="#9ca3af" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Red light */}
        <mesh position={[0, 0.85, 0]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1} />
        </mesh>
      </group>

      {/* Easter Egg 2: UFO */}
      <group
        ref={ufoRef}
        position={[easterEggPositions.ufo.x, easterEggPositions.ufo.y, easterEggPositions.ufo.z]}
        scale={0.4}
      >
        {/* Bottom saucer */}
        <mesh>
          <cylinderGeometry args={[0.8, 1, 0.2, 32]} />
          <meshStandardMaterial
            color="#6366f1"
            metalness={0.8}
            roughness={0.2}
            emissive="#4f46e5"
            emissiveIntensity={0.3}
          />
        </mesh>
        {/* Middle ring to connect dome and saucer */}
        <mesh position={[0, 0.1, 0]}>
          <cylinderGeometry args={[0.5, 0.8, 0.05, 32]} />
          <meshStandardMaterial
            color="#5b21b6"
            metalness={0.85}
            roughness={0.15}
            emissive="#7c3aed"
            emissiveIntensity={0.4}
          />
        </mesh>
        {/* Top dome - sits flush on the ring */}
        <mesh position={[0, 0.125, 0]}>
          <sphereGeometry args={[0.5, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial
            color="#22d3ee"
            metalness={0.9}
            roughness={0.1}
            transparent
            opacity={0.7}
            emissive="#06b6d4"
            emissiveIntensity={0.5}
          />
        </mesh>
        {/* Lights around the edge */}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
          const angle = (i / 8) * Math.PI * 2;
          return (
            <mesh
              key={i}
              position={[Math.cos(angle) * 0.9, -0.1, Math.sin(angle) * 0.9]}
            >
              <sphereGeometry args={[0.08, 8, 8]} />
              <meshStandardMaterial
                color={i % 2 === 0 ? "#fbbf24" : "#22c55e"}
                emissive={i % 2 === 0 ? "#fbbf24" : "#22c55e"}
                emissiveIntensity={1.5}
              />
            </mesh>
          );
        })}
      </group>

      {/* Easter Egg 3: Rocket */}
      <group
        ref={rocketRef}
        position={[easterEggPositions.rocket.x, easterEggPositions.rocket.y, easterEggPositions.rocket.z]}
        scale={0.35}
      >
        {/* Rocket body */}
        <mesh>
          <cylinderGeometry args={[0.3, 0.3, 2, 16]} />
          <meshStandardMaterial color="#dc2626" metalness={0.6} roughness={0.3} />
        </mesh>
        {/* Nose cone */}
        <mesh position={[0, 1.3, 0]}>
          <coneGeometry args={[0.3, 0.6, 16]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.7} roughness={0.2} />
        </mesh>
        {/* Fins */}
        {[0, 1, 2, 3].map((i) => {
          const angle = (i / 4) * Math.PI * 2;
          return (
            <mesh
              key={i}
              position={[Math.cos(angle) * 0.35, -0.8, Math.sin(angle) * 0.35]}
              rotation={[0, angle, 0]}
            >
              <boxGeometry args={[0.05, 0.6, 0.4]} />
              <meshStandardMaterial color="#374151" metalness={0.5} roughness={0.4} />
            </mesh>
          );
        })}
        {/* Engine glow */}
        <mesh position={[0, -1.2, 0]}>
          <coneGeometry args={[0.25, 0.4, 16]} />
          <meshStandardMaterial
            color="#f97316"
            emissive="#f97316"
            emissiveIntensity={1.5}
            transparent
            opacity={0.8}
          />
        </mesh>
        {/* Window */}
        <mesh position={[0, 0.5, 0.31]}>
          <circleGeometry args={[0.15, 16]} />
          <meshStandardMaterial
            color="#60a5fa"
            emissive="#3b82f6"
            emissiveIntensity={0.5}
            transparent
            opacity={0.8}
          />
        </mesh>
      </group>
    </>
  );
}
