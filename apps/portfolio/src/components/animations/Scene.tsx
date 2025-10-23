import { useRef, useMemo, type JSX } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, OrbitControls, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import type { Group, Points, BufferGeometry, Material } from 'three';

interface ThreeJSSceneProps {
  intensity?: number;
}

interface ShapeData {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  color: string;
  geometry: BufferGeometry;
}

export default function ThreeJSScene({ intensity = 1 }: ThreeJSSceneProps): JSX.Element {
  const groupRef = useRef<Group>(null);
  const particlesRef = useRef<Points<BufferGeometry, Material | Material[]>>(null);
  const sparklesRef = useRef<Points<BufferGeometry, Material | Material[]>>(null);
  const shapeRefs = useRef<THREE.Mesh[]>([]);

  // Generate random pastel colors
  const generatePastelColor = (): string => {
    const hue = Math.random() * 360;
    const saturation = 60 + Math.random() * 20;
    const lightness = 70 + Math.random() * 15;
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  // Create random shapes
  const shapes = useMemo((): BufferGeometry[] => {
    return [
      new THREE.SphereGeometry(0.1, 6, 6),
      new THREE.BoxGeometry(0.15, 0.15, 0.15),
      new THREE.ConeGeometry(0.1, 0.2, 5),
      new THREE.TetrahedronGeometry(0.12),
      new THREE.OctahedronGeometry(0.1),
      new THREE.DodecahedronGeometry(0.08, 0),
      new THREE.TorusGeometry(0.08, 0.03, 8, 6),
      new THREE.CylinderGeometry(0.08, 0.08, 0.2, 8),
      new THREE.RingGeometry(0.05, 0.1, 8)
    ];
  }, []);

  // Particle system for background stars
  const particleCount = 3000;
  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const arm = Math.floor(Math.random() * 4);
      const radius = Math.random() * 15 + 8;
      const angle = (arm * Math.PI / 2) + (Math.random() * 0.8 - 0.4);
      const height = (Math.random() - 0.5) * 3;

      const spiralOffset = Math.sin(radius * 0.3) * 2;

      positions[i * 3] = Math.cos(angle) * (radius + spiralOffset) + (Math.random() - 0.5) * 2;
      positions[i * 3 + 1] = height;
      positions[i * 3 + 2] = Math.sin(angle) * (radius + spiralOffset) + (Math.random() - 0.5) * 2;

      const color = new THREE.Color(generatePastelColor());
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    return { positions, colors };
  }, [particleCount]);

  // Main shapes data
  const mainShapes = useMemo((): ShapeData[] => {
    return Array.from({ length: 150 }, (_) => {
      const arm = Math.floor(Math.random() * 4);
      const radius = Math.random() * 12 + 6;
      const angle = (arm * Math.PI / 2) + (Math.random() * 0.6 - 0.3);
      const height = (Math.random() - 0.5) * 2;

      const spiralOffset = Math.sin(radius * 0.3) * 1.5;

      return {
        position: [
          Math.cos(angle) * (radius + spiralOffset) + (Math.random() - 0.5) * 1.5,
          height,
          Math.sin(angle) * (radius + spiralOffset) + (Math.random() - 0.5) * 1.5
        ],
        rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
        scale: Math.random() * 0.4 + 0.2,
        color: generatePastelColor(),
        geometry: shapes[Math.floor(Math.random() * shapes.length)]
      } as ShapeData;
    });
  }, [shapes]);

  // INFINITE CONTINUOUS ANIMATION - runs every frame forever without any pause
  useFrame((state, delta: number) => {
    // Use elapsed time as backup if delta is ever 0 or undefined
    const time = state.clock.elapsedTime;
    const safeDelta = delta || 0.016; // Fallback to ~60fps if delta is 0

    // Rotate main group continuously - NEVER stops
    if (groupRef.current) {
      groupRef.current.rotation.y += safeDelta * 0.05 * intensity;
      // Ensure rotation never reaches infinity by using modulo
      groupRef.current.rotation.y %= Math.PI * 2;
    }

    // Rotate background particles in opposite direction - CONTINUOUS
    if (particlesRef.current) {
      particlesRef.current.rotation.y -= safeDelta * 0.02 * intensity;
      particlesRef.current.rotation.x += safeDelta * 0.01 * intensity;
      // Keep rotations within bounds to prevent overflow
      particlesRef.current.rotation.y %= Math.PI * 2;
      particlesRef.current.rotation.x %= Math.PI * 2;
    }

    // Individual rotation for EVERY shape - each shape ALWAYS rotating
    shapeRefs.current.forEach((mesh, index) => {
      if (mesh) {
        // Each shape rotates on ALL axes at different speeds - PERPETUAL MOTION
        const baseSpeed = intensity * safeDelta;
        mesh.rotation.x += baseSpeed * (0.2 + (index % 3) * 0.1);
        mesh.rotation.y += baseSpeed * (0.3 + (index % 5) * 0.05);
        mesh.rotation.z += baseSpeed * (0.15 + (index % 4) * 0.08);

        // Normalize rotations to prevent numerical overflow over time
        mesh.rotation.x %= Math.PI * 2;
        mesh.rotation.y %= Math.PI * 2;
        mesh.rotation.z %= Math.PI * 2;
      }
    });

    // Add subtle sparkles rotation using time-based animation as backup
    if (sparklesRef.current) {
      sparklesRef.current.rotation.y = Math.sin(time * 0.1) * 0.1;
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

      <ambientLight intensity={0.3 * intensity} />
      <pointLight position={[10, 10, 10]} intensity={0.5 * intensity} color="#ffffff" />
      <pointLight position={[-10, -10, -10]} intensity={0.3 * intensity} color="#aaaaff" />

      <group ref={groupRef}>
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
            opacity={0.7}
            sizeAttenuation
            blending={THREE.AdditiveBlending}
          />
        </points>

        {/* Main floating shapes - INFINITE FLOAT ANIMATION */}
        {mainShapes.map((shape, i) => (
          <Float
            key={i}
            speed={1.5 + (i % 10) * 0.3} // Varied speeds ensure perpetual motion
            rotationIntensity={0.8} // Higher rotation intensity
            floatIntensity={0.8} // Higher float intensity
            floatingRange={[-0.5, 0.5]} // Defined range for continuous bobbing
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
                emissiveIntensity={0.2}
                transparent
                opacity={0.85}
                roughness={0.3}
                metalness={0.1}
              />
            </mesh>
          </Float>
        ))}
      </group>

      {/* Additional sparkles for magical effect */}
      <Sparkles
        ref={sparklesRef}
        count={100}
        scale={[20, 8, 20]}
        size={1.5 * intensity}
        speed={0.2 * intensity}
        opacity={0.4}
        color="#ffffff"
      />
    </>
  );
}
