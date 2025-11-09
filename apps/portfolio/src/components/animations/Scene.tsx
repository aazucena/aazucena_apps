/**
 * ThreeJS Scene Component
 * Orchestrates atmospheric layers and ground objects using modular components
 */

import { useRef, useMemo, type JSX } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import type { Group } from 'three';
import type { AtmosphericPhase } from './config';
import {
  calculateLayerOpacities,
  getAmbientIntensity,
  getPointLightColor,
  getSecondaryLightColor,
  generateParticleData,
  createBasicGeometries,
  generateShapeData,
  generateCloudData,
  generateHouseData,
  generateTreeData,
  generateBushData,
  generateRockData,
  generateFlowerData,
  Exosphere,
  Thermosphere,
  Mesosphere,
  Stratosphere,
  Troposphere
} from './scene';

interface ThreeJSSceneProps {
  intensity?: number;
  phase?: AtmosphericPhase;
  currentSection?: number;
  scrollProgress?: number;
}

export default function ThreeJSScene({
  intensity = 1,
  phase = 'exosphere',
  currentSection = 0,
  scrollProgress = 0
}: ThreeJSSceneProps): JSX.Element {
  const groupRef = useRef<Group>(null);
  const shapeRefs = useRef<THREE.Mesh[]>([]);
  const sunLightRef = useRef<THREE.DirectionalLight>(null);

  const progress = currentSection + scrollProgress;
  const opacities = calculateLayerOpacities(progress);

  // Generate data for all scene elements (memoized for performance)
  const particleCount = 3000;
  const particles = useMemo(() => generateParticleData(particleCount, phase), [particleCount, phase]);
  const shapes = useMemo(() => createBasicGeometries(), []);
  const mainShapes = useMemo(() => generateShapeData(150, shapes, phase), [shapes]);
  const clouds = useMemo(() => generateCloudData(12), []);
  const houses = useMemo(() => generateHouseData(8), []);
  const trees = useMemo(() => generateTreeData(15), []);
  const bushes = useMemo(() => generateBushData(25), []);
  const rocks = useMemo(() => generateRockData(20), []);
  const flowers = useMemo(() => generateFlowerData(35), []);

  // Continuous animation loop
  useFrame((state, delta: number) => {
    const time = state.clock.elapsedTime;
    const safeDelta = delta || 0.016;

    // Rotate main group continuously (except in troposphere)
    if (groupRef.current && phase !== 'troposphere') {
      groupRef.current.rotation.y += safeDelta * 0.05 * intensity;
      groupRef.current.rotation.y %= Math.PI * 2;
    }

    // Rotate individual shapes
    shapeRefs.current.forEach((mesh, index) => {
      if (mesh) {
        const baseSpeed = intensity * safeDelta;
        mesh.rotation.x += baseSpeed * (0.2 + (index % 3) * 0.1);
        mesh.rotation.y += baseSpeed * (0.3 + (index % 5) * 0.05);
        mesh.rotation.z += baseSpeed * (0.15 + (index % 4) * 0.08);

        mesh.rotation.x %= Math.PI * 2;
        mesh.rotation.y %= Math.PI * 2;
        mesh.rotation.z %= Math.PI * 2;
      }
    });

    // Move sun light in troposphere
    if (sunLightRef.current && phase === 'troposphere') {
      const sunSpeed = time * 0.05;
      const radius = 10;
      sunLightRef.current.position.x = Math.cos(sunSpeed) * radius;
      sunLightRef.current.position.z = Math.sin(sunSpeed) * radius;
      sunLightRef.current.position.y = 8 + Math.sin(sunSpeed * 0.5) * 2;
    }
  });

  return (
    <>
      <OrbitControls
        enableZoom={true}
        enablePan={true}
        maxPolarAngle={Math.PI}
        enableDamping
        dampingFactor={0.05}
      />

      {/* Lighting */}
      <ambientLight intensity={getAmbientIntensity(phase, intensity)} />
      <pointLight
        position={[10, 10, 10]}
        intensity={0.5 * intensity}
        color={getPointLightColor(phase)}
      />
      <pointLight
        position={[-10, -10, -10]}
        intensity={0.3 * intensity}
        color={getSecondaryLightColor(phase)}
      />

      {/* Directional light for troposphere (sun) */}
      {phase === 'troposphere' && (
        <directionalLight
          ref={sunLightRef}
          position={[5, 10, 5]}
          intensity={0.8 * intensity}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
          color="#FFD700"
        />
      )}

      <group ref={groupRef}>
        {/* Exosphere Layer */}
        {opacities.exosphere > 0 && (
          <Exosphere
            particles={particles}
            particleCount={particleCount}
            opacity={opacities.exosphere}
            intensity={intensity}
          />
        )}

        {/* Thermosphere Layer */}
        {opacities.thermosphere > 0 && (
          <Thermosphere opacity={opacities.thermosphere} />
        )}

        {/* Main floating shapes (Exosphere & Thermosphere) */}
        {(opacities.exosphere > 0 || opacities.thermosphere > 0) && mainShapes.map((shape, i) => (
          <Float
            key={i}
            speed={1.5 + (i % 10) * 0.3}
            rotationIntensity={0.8}
            floatIntensity={0.8}
            floatingRange={[-0.5, 0.5]}
          >
            <mesh
              ref={(el) => {
                if (el) shapeRefs.current[i] = el;
              }}
              position={shape.position}
              rotation={shape.rotation}
              scale={shape.scale}
              geometry={shape.geometry}
              castShadow
            >
              <meshStandardMaterial
                color={shape.color}
                emissive={shape.color}
                emissiveIntensity={opacities.thermosphere > 0 ? 0.4 : 0.2}
                transparent
                opacity={0.85 * Math.max(opacities.exosphere, opacities.thermosphere)}
                roughness={0.3}
                metalness={0.1}
              />
            </mesh>
          </Float>
        ))}

        {/* Mesosphere Layer */}
        {opacities.mesosphere > 0 && (
          <Mesosphere opacity={opacities.mesosphere} />
        )}

        {/* Stratosphere Layer (Clouds) */}
        {opacities.stratosphere > 0 && (
          <Stratosphere clouds={clouds} opacity={opacities.stratosphere} />
        )}

        {/* Troposphere Layer (Ground Scene) */}
        {progress >= 5.5 && (
          <Troposphere
            houses={houses}
            trees={trees}
            bushes={bushes}
            rocks={rocks}
            flowers={flowers}
            opacity={opacities.troposphere}
          />
        )}
      </group>
    </>
  );
}
