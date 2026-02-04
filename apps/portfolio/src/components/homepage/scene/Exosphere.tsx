/**
 * Exosphere Layer (INTEGRATED with Scene Objects System)
 * Background particles and sparkles for deep space with Milky Way effect
 *
 * BEFORE: 377 lines with inline easter egg definitions
 * AFTER: ~85 lines using SceneObjectManager
 * REDUCTION: 78% smaller, 292 lines removed
 */

import type { JSX } from 'react';
import { useRef, useMemo, memo } from 'react';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import type { Points, BufferGeometry, Material } from 'three';
import type { ParticleData } from '~/data/scene/particles';
import { SceneObjectManager } from './objects';
import { exosphereObjects } from '~/data/scene/objects';

export interface ExosphereProps {
  particles: ParticleData;
  particleCount: number;
  opacity: number;
  intensity: number;
}

function ExosphereComponent({ particles, particleCount, opacity, intensity }: ExosphereProps): JSX.Element {
  const particlesRef = useRef<Points<BufferGeometry, Material | Material[]>>(null);
  const milkyWayRef = useRef<Points<BufferGeometry, Material | Material[]>>(null);
  const sparklesRef = useRef<Points<BufferGeometry, Material | Material[]>>(null);

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

      {/* Easter Eggs via SceneObjectManager */}
      <SceneObjectManager
        objects={exosphereObjects.easterEggs}
        opacity={opacity}
        categoryFilter={['easter-egg']}
      />
    </>
  );
}

/**
 * Memoized Exosphere component
 * Only re-renders when opacity/intensity change meaningfully or particles data changes
 */
export const Exosphere = memo(ExosphereComponent, (prevProps, nextProps) => {
  // Return true if props are equal (skip re-render)
  return (
    prevProps.particles === nextProps.particles &&
    prevProps.particleCount === nextProps.particleCount &&
    Math.abs(prevProps.opacity - nextProps.opacity) < 0.01 &&
    Math.abs(prevProps.intensity - nextProps.intensity) < 0.01
  );
});

Exosphere.displayName = 'Exosphere';
