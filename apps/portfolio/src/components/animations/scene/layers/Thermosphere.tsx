/**
 * Thermosphere Layer
 * Aurora effects and ribbons with space-themed easter eggs
 */

import type { JSX } from 'react';
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import type { Group, ShaderMaterial } from 'three';

interface ThermosphereProps {
  opacity: number;
}

// Aurora shader material creation (outside component for stability)
const createAuroraMaterial = (color: string, baseOpacity: number) => {
  return new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: baseOpacity },
      uTime: { value: 0 }
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vPosition;

      void main() {
        vUv = uv;
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      uniform float uOpacity;
      uniform float uTime;
      varying vec2 vUv;
      varying vec3 vPosition;

      void main() {
        // Vertical gradient - fade from top to bottom (feathered effect)
        float verticalGradient = smoothstep(0.0, 0.4, vUv.y);

        // Blur/soften left and right edges
        float edgeSoftnessX = smoothstep(0.0, 0.15, vUv.x) * smoothstep(1.0, 0.85, vUv.x);

        // Blur/soften top edge
        float topEdgeSoftness = smoothstep(1.0, 0.75, vUv.y);

        // Add some horizontal variation for more natural look
        float horizontalVariation = sin(vUv.x * 3.14159 * 4.0) * 0.15 + 0.85;

        // Combine all edge blurring and gradients
        float finalAlpha = verticalGradient * edgeSoftnessX * topEdgeSoftness * horizontalVariation * uOpacity;

        // Add subtle flickering
        float flicker = sin(uTime * 2.0 + vUv.y * 10.0) * 0.05 + 0.95;
        finalAlpha *= flicker;

        gl_FragColor = vec4(uColor, finalAlpha);
      }
    `,
    transparent: true,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
};

export function Thermosphere({ opacity }: ThermosphereProps): JSX.Element {
  // Easter egg refs
  const shuttleRef = useRef<Group>(null);
  const issRef = useRef<Group>(null);
  const astronautRef = useRef<Group>(null);

  // Aurora mesh refs
  const auroraMeshRefs = useRef<THREE.Mesh[]>([]);

  // Create materials for green and purple auroras
  const auroraMaterials = useMemo(() => ({
    green: createAuroraMaterial('#06FFA5', 0.3 * opacity),
    purple: createAuroraMaterial('#9D4EDD', 0.3 * opacity)
  }), [opacity]);

  // Random positions for easter eggs
  const easterEggPositions = useMemo(() => ({
    shuttle: {
      x: -7 + Math.random() * 3,
      y: 3 + Math.random() * 2,
      z: -9 + Math.random() * 3
    },
    iss: {
      x: 6 + Math.random() * 3,
      y: -1 + Math.random() * 2,
      z: -7 + Math.random() * 3
    },
    astronaut: {
      x: -4 + Math.random() * 2,
      y: -2 + Math.random() * 2,
      z: 6 + Math.random() * 3
    }
  }), []);

  // Animate aurora and easter eggs
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    // Update shader uniforms and animate aurora curtains
    auroraMeshRefs.current.forEach((mesh, i) => {
      if (mesh && mesh.geometry && mesh.geometry.attributes.position) {
        // Update shader time uniform for flickering
        const material = mesh.material as ShaderMaterial;
        if (material.uniforms?.uTime) {
          material.uniforms.uTime.value = time;
        }

        // Animate aurora curtains with flowing waves
        const positions = mesh.geometry.attributes.position;
        const array = positions.array as Float32Array;

        for (let j = 0; j < positions.count; j++) {
          const x = array[j * 3];
          const y = array[j * 3 + 1];

          if (x !== undefined && y !== undefined) {
            // Create wavy flowing motion
            const wave1 = Math.sin(x * 0.3 + time * 0.5 + i) * 0.5;
            const wave2 = Math.sin(y * 0.2 + time * 0.3 + i * 0.5) * 0.3;
            const wave3 = Math.cos(x * 0.15 + y * 0.15 + time * 0.4) * 0.2;

            array[j * 3 + 2] = wave1 + wave2 + wave3;
          }
        }

        positions.needsUpdate = true;
        mesh.geometry.computeVertexNormals();
      }
    });

    // Space Shuttle: slow orbital motion
    if (shuttleRef.current) {
      shuttleRef.current.rotation.y = time * 0.15;
      shuttleRef.current.rotation.x = Math.sin(time * 0.3) * 0.1;
      shuttleRef.current.position.y = easterEggPositions.shuttle.y + Math.sin(time * 0.25) * 0.3;
    }

    // ISS: slow rotation
    if (issRef.current) {
      issRef.current.rotation.y = time * 0.1;
      issRef.current.rotation.z = Math.sin(time * 0.2) * 0.05;
    }

    // Astronaut: floating/tumbling
    if (astronautRef.current) {
      astronautRef.current.rotation.x = time * 0.2;
      astronautRef.current.rotation.z = time * 0.15;
      astronautRef.current.position.y = easterEggPositions.astronaut.y + Math.sin(time * 0.5) * 0.4;
      astronautRef.current.position.x = easterEggPositions.astronaut.x + Math.cos(time * 0.3) * 0.2;
    }
  });

  return (
    <>
      {/* Aurora curtains - flowing vertical sheets with feathered effect */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const radius = 12 + Math.sin(i * 0.5) * 3;
        const isGreen = i % 3 !== 0;
        const heightVariation = Math.sin(i * 1.2) * 2;

        return (
          <mesh
            key={`aurora-${i}`}
            ref={(el) => {
              if (el) auroraMeshRefs.current[i] = el;
            }}
            position={[
              Math.cos(angle) * radius,
              1 + heightVariation,
              Math.sin(angle) * radius
            ]}
            rotation={[0, angle + Math.PI / 2, 0]}
            material={isGreen ? auroraMaterials.green : auroraMaterials.purple}
          >
            <planeGeometry args={[20, 10, 64, 32]} />
          </mesh>
        );
      })}

      {/* Aurora particles for extra glow */}
      <Sparkles
        count={80}
        scale={[25, 12, 25]}
        size={2}
        speed={0.3}
        opacity={0.5 * opacity}
        color="#06FFA5"
      />
      <Sparkles
        count={80}
        scale={[25, 12, 25]}
        size={2}
        speed={0.2}
        opacity={0.4 * opacity}
        color="#9D4EDD"
      />

      {/* Easter Egg 1: Space Shuttle */}
      <group
        ref={shuttleRef}
        position={[easterEggPositions.shuttle.x, easterEggPositions.shuttle.y, easterEggPositions.shuttle.z]}
        scale={0.5}
        rotation={[0, Math.PI / 2, 0]}
      >
        {/* Main fuselage - front section */}
        <mesh position={[0.8, 0, 0]}>
          <cylinderGeometry args={[0.35, 0.35, 1.6, 16]} />
          <meshStandardMaterial color="#f3f4f6" metalness={0.4} roughness={0.5} />
        </mesh>

        {/* Nose cone - pointed front */}
        <mesh position={[1.8, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <coneGeometry args={[0.35, 0.8, 16]} />
          <meshStandardMaterial color="#e5e7eb" metalness={0.5} roughness={0.4} />
        </mesh>

        {/* Cargo bay section - slightly wider */}
        <mesh position={[-0.3, 0, 0]}>
          <cylinderGeometry args={[0.4, 0.38, 1.4, 16]} />
          <meshStandardMaterial color="#d1d5db" metalness={0.4} roughness={0.5} />
        </mesh>

        {/* Rear section - tapering down */}
        <mesh position={[-1.1, 0, 0]}>
          <cylinderGeometry args={[0.38, 0.3, 0.6, 16]} />
          <meshStandardMaterial color="#e5e7eb" metalness={0.4} roughness={0.5} />
        </mesh>

        {/* Heat shield tiles on belly (black tiles) */}
        <mesh position={[0, -0.36, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.41, 0.41, 3.5, 16, 1, false, 0, Math.PI]} />
          <meshStandardMaterial color="#1f2937" metalness={0.2} roughness={0.8} />
        </mesh>

        {/* Delta wing - left */}
        <mesh position={[-0.6, 0.05, 0.7]} rotation={[0.1, -0.3, 0]}>
          <boxGeometry args={[1.2, 0.08, 1.4]} />
          <meshStandardMaterial color="#9ca3af" metalness={0.4} roughness={0.5} />
        </mesh>

        {/* Delta wing - right */}
        <mesh position={[-0.6, 0.05, -0.7]} rotation={[-0.1, 0.3, 0]}>
          <boxGeometry args={[1.2, 0.08, 1.4]} />
          <meshStandardMaterial color="#9ca3af" metalness={0.4} roughness={0.5} />
        </mesh>

        {/* Vertical tail fin */}
        <mesh position={[-1.2, 0.5, 0]}>
          <boxGeometry args={[0.6, 1, 0.08]} />
          <meshStandardMaterial color="#6b7280" metalness={0.4} roughness={0.5} />
        </mesh>

        {/* Engine nozzles - left */}
        <mesh position={[-1.5, -0.1, 0.15]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.12, 0.1, 0.3, 12]} />
          <meshStandardMaterial color="#374151" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Engine nozzles - center */}
        <mesh position={[-1.5, -0.1, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.12, 0.1, 0.3, 12]} />
          <meshStandardMaterial color="#374151" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Engine nozzles - right */}
        <mesh position={[-1.5, -0.1, -0.15]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.12, 0.1, 0.3, 12]} />
          <meshStandardMaterial color="#374151" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Engine glow */}
        <pointLight position={[-1.6, -0.1, 0]} color="#ff9500" intensity={0.5} distance={1} />

        {/* Cockpit windows - row 1 */}
        <mesh position={[1.35, 0.25, 0]}>
          <circleGeometry args={[0.08, 16]} />
          <meshStandardMaterial color="#1e3a8a" emissive="#3b82f6" emissiveIntensity={0.4} transparent opacity={0.8} />
        </mesh>
        <mesh position={[1.25, 0.3, 0.12]}>
          <circleGeometry args={[0.06, 16]} />
          <meshStandardMaterial color="#1e3a8a" emissive="#3b82f6" emissiveIntensity={0.3} transparent opacity={0.8} />
        </mesh>
        <mesh position={[1.25, 0.3, -0.12]}>
          <circleGeometry args={[0.06, 16]} />
          <meshStandardMaterial color="#1e3a8a" emissive="#3b82f6" emissiveIntensity={0.3} transparent opacity={0.8} />
        </mesh>

        {/* Cockpit windows - row 2 */}
        <mesh position={[1.1, 0.32, 0.08]}>
          <circleGeometry args={[0.05, 16]} />
          <meshStandardMaterial color="#1e3a8a" emissive="#3b82f6" emissiveIntensity={0.3} transparent opacity={0.8} />
        </mesh>
        <mesh position={[1.1, 0.32, -0.08]}>
          <circleGeometry args={[0.05, 16]} />
          <meshStandardMaterial color="#1e3a8a" emissive="#3b82f6" emissiveIntensity={0.3} transparent opacity={0.8} />
        </mesh>

        {/* NASA logo area (red stripe on tail) */}
        <mesh position={[-1.2, 0.45, 0.041]}>
          <planeGeometry args={[0.3, 0.15]} />
          <meshStandardMaterial color="#dc2626" emissive="#dc2626" emissiveIntensity={0.2} />
        </mesh>
      </group>

      {/* Easter Egg 2: ISS (International Space Station) */}
      <group
        ref={issRef}
        position={[easterEggPositions.iss.x, easterEggPositions.iss.y, easterEggPositions.iss.z]}
        scale={0.3}
      >
        {/* Central module */}
        <mesh>
          <cylinderGeometry args={[0.3, 0.3, 3, 16]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Solar panels (left) */}
        <mesh position={[-2, 0, 0]}>
          <boxGeometry args={[0.05, 3, 1.5]} />
          <meshStandardMaterial color="#1e40af" emissive="#3b82f6" emissiveIntensity={0.4} metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[-2.5, 0, 0]}>
          <boxGeometry args={[0.05, 3, 1.5]} />
          <meshStandardMaterial color="#1e40af" emissive="#3b82f6" emissiveIntensity={0.4} metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Solar panels (right) */}
        <mesh position={[2, 0, 0]}>
          <boxGeometry args={[0.05, 3, 1.5]} />
          <meshStandardMaterial color="#1e40af" emissive="#3b82f6" emissiveIntensity={0.4} metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[2.5, 0, 0]}>
          <boxGeometry args={[0.05, 3, 1.5]} />
          <meshStandardMaterial color="#1e40af" emissive="#3b82f6" emissiveIntensity={0.4} metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Modules */}
        <mesh position={[0, 0.6, 0]} rotation={[0, Math.PI / 2, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 1, 16]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh position={[0, -0.6, 0]} rotation={[0, Math.PI / 2, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 1, 16]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.6} roughness={0.3} />
        </mesh>
      </group>

      {/* Easter Egg 3: Astronaut on Spacewalk */}
      <group
        ref={astronautRef}
        position={[easterEggPositions.astronaut.x, easterEggPositions.astronaut.y, easterEggPositions.astronaut.z]}
        scale={0.25}
      >
        {/* Helmet */}
        <mesh position={[0, 0.6, 0]}>
          <sphereGeometry args={[0.35, 16, 16]} />
          <meshStandardMaterial color="#e0f2fe" transparent opacity={0.8} metalness={0.3} roughness={0.1} />
        </mesh>
        {/* Head/face */}
        <mesh position={[0, 0.6, 0.1]}>
          <sphereGeometry args={[0.25, 16, 16]} />
          <meshStandardMaterial color="#fcd34d" emissive="#fbbf24" emissiveIntensity={0.3} />
        </mesh>
        {/* Body */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.35, 0.4, 1, 16]} />
          <meshStandardMaterial color="#f1f5f9" metalness={0.4} roughness={0.5} />
        </mesh>
        {/* Backpack */}
        <mesh position={[0, 0, -0.5]}>
          <boxGeometry args={[0.7, 0.8, 0.3]} />
          <meshStandardMaterial color="#64748b" metalness={0.6} roughness={0.4} />
        </mesh>
        {/* Arms */}
        <mesh position={[-0.5, 0, 0]} rotation={[0, 0, Math.PI / 6]}>
          <cylinderGeometry args={[0.12, 0.12, 0.8, 8]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.4} roughness={0.5} />
        </mesh>
        <mesh position={[0.5, 0, 0]} rotation={[0, 0, -Math.PI / 6]}>
          <cylinderGeometry args={[0.12, 0.12, 0.8, 8]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.4} roughness={0.5} />
        </mesh>
        {/* Legs */}
        <mesh position={[-0.2, -0.8, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.8, 8]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.4} roughness={0.5} />
        </mesh>
        <mesh position={[0.2, -0.8, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.8, 8]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.4} roughness={0.5} />
        </mesh>
      </group>
    </>
  );
}
