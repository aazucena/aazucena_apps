import { useRef, useMemo, type JSX } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, OrbitControls, Sparkles, Cloud } from '@react-three/drei';
import * as THREE from 'three';
import type { Group, Points, BufferGeometry, Material, Mesh } from 'three';

interface ThreeJSSceneProps {
  intensity?: number;
  phase?: 'space' | 'sky' | 'ground';
  currentSection?: number;
  scrollProgress?: number;
}

interface ShapeData {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  color: string;
  geometry: BufferGeometry;
}

interface CloudData {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  speed: number;
  opacity: number;
}

interface HouseData {
  position: [number, number, number];
  rotation: number;
  scale: number;
  color: string;
}

interface TreeData {
  position: [number, number, number];
  scale: number;
}

// Simple House Component
function House({ position, rotation, scale, color }: HouseData) {
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      {/* House Base */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Roof */}
      <mesh position={[0, 1.3, 0]} castShadow>
        <coneGeometry args={[0.8, 0.6, 4]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>

      {/* Door */}
      <mesh position={[0, 0.3, 0.51]} castShadow>
        <boxGeometry args={[0.3, 0.6, 0.05]} />
        <meshStandardMaterial color="#654321" />
      </mesh>

      {/* Window 1 */}
      <mesh position={[-0.3, 0.6, 0.51]} castShadow>
        <boxGeometry args={[0.2, 0.2, 0.05]} />
        <meshStandardMaterial color="#87CEEB" emissive="#FFFF99" emissiveIntensity={0.3} />
      </mesh>

      {/* Window 2 */}
      <mesh position={[0.3, 0.6, 0.51]} castShadow>
        <boxGeometry args={[0.2, 0.2, 0.05]} />
        <meshStandardMaterial color="#87CEEB" emissive="#FFFF99" emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
}

export default function ThreeJSScene({
  intensity = 1,
  phase = 'space',
  currentSection = 0,
  scrollProgress = 0
}: ThreeJSSceneProps): JSX.Element {
  const groupRef = useRef<Group>(null);
  const particlesRef = useRef<Points<BufferGeometry, Material | Material[]>>(null);
  const sparklesRef = useRef<Points<BufferGeometry, Material | Material[]>>(null);
  const shapeRefs = useRef<THREE.Mesh[]>([]);
  const waterRef = useRef<Mesh>(null);

  // Calculate opacity for each phase based on scroll progress
  const progress = currentSection + scrollProgress;

  // Space phase: full opacity until 2.5, fade out 2.5-3.0
  const spaceOpacity = progress <= 2.5 ? 1 : progress >= 3.0 ? 0 : 1 - ((progress - 2.5) * 2);

  // Sky phase: fade in 2.5-3.0, full until 4.5, fade out 4.5-5.0
  const skyOpacity = progress < 2.5 ? 0
    : progress <= 3.0 ? (progress - 2.5) * 2
    : progress <= 4.5 ? 1
    : progress >= 5.0 ? 0
    : 1 - ((progress - 4.5) * 2);

  // Ground phase: fade in 4.5-5.0, then full opacity
  const groundOpacity = progress < 4.5 ? 0 : progress >= 5.0 ? 1 : (progress - 4.5) * 2;

  // Generate colors based on phase
  const generatePhaseColor = (): string => {
    switch (phase) {
      case 'space':
        // Pastel space colors (purples, blues, pinks)
        const spaceHue = Math.random() * 100 + 200; // 200-300 (blues to purples)
        return `hsl(${spaceHue}, ${60 + Math.random() * 20}%, ${70 + Math.random() * 15}%)`;
      case 'sky':
        // Sky colors (blues, cyans, whites)
        const skyHue = Math.random() * 60 + 180; // 180-240 (cyans to blues)
        return `hsl(${skyHue}, ${50 + Math.random() * 30}%, ${75 + Math.random() * 15}%)`;
      case 'ground':
        // Earth tones (browns, oranges, greens)
        const groundHue = Math.random() * 80 + 20; // 20-100 (oranges, yellows, greens)
        return `hsl(${groundHue}, ${40 + Math.random() * 30}%, ${50 + Math.random() * 20}%)`;
      default:
        return `hsl(${Math.random() * 360}, 60%, 70%)`;
    }
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

      const color = new THREE.Color(generatePhaseColor());
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    return { positions, colors };
  }, [particleCount, phase]);

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
        color: generatePhaseColor(),
        geometry: shapes[Math.floor(Math.random() * shapes.length)]
      } as ShapeData;
    });
  }, [shapes]); // Keep shape sizes stable

  // Cloud data for sky phase
  const clouds = useMemo((): CloudData[] => {
    return Array.from({ length: 12 }, (_) => {
      const radius = Math.random() * 20 + 8;
      const angle = Math.random() * Math.PI * 2;

      return {
        position: [
          Math.cos(angle) * radius,
          Math.random() * 6 - 2,
          Math.sin(angle) * radius
        ],
        rotation: [0, Math.random() * Math.PI * 2, 0],
        scale: Math.random() * 0.8 + 0.5,
        speed: Math.random() * 0.2 + 0.1,
        opacity: Math.random() * 0.2 + 0.8
      } as CloudData;
    });
  }, []); // Keep cloud sizes stable

  // House data for ground phase
  const houses = useMemo((): HouseData[] => {
    const houseColors = ['#D4AF37', '#CD853F', '#DEB887', '#F4A460', '#E6BE8A'];
    return Array.from({ length: 8 }, (_, i) => {
      const angle = (i / 8) * Math.PI * 2;
      const radius = 8 + Math.random() * 4;

      return {
        position: [
          Math.cos(angle) * radius,
          -0.5, // Align with ground level
          Math.sin(angle) * radius
        ],
        rotation: Math.random() * Math.PI * 2,
        scale: 0.8 + Math.random() * 0.4,
        color: houseColors[Math.floor(Math.random() * houseColors.length)]
      } as HouseData;
    });
  }, []); // Remove phase dependency to keep sizes stable

  // Tree data for ground phase
  const trees = useMemo((): TreeData[] => {
    return Array.from({ length: 12 }, (_, i) => {
      const angle = (i / 12) * Math.PI * 2;
      const radius = 6 + Math.random() * 6;

      return {
        position: [
          Math.cos(angle) * radius,
          -0.5, // Align with ground level
          Math.sin(angle) * radius
        ],
        scale: 0.8 + Math.random() * 0.4
      } as TreeData;
    });
  }, []); // Keep tree sizes stable

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

    // Animate water waves for ground phase
    if (waterRef.current && phase === 'ground') {
      const geometry = waterRef.current.geometry as THREE.PlaneGeometry;
      const position = geometry.attributes.position;

      for (let i = 0; i < position.count; i++) {
        const x = position.getX(i);
        const y = position.getY(i);
        const wave1 = Math.sin(x * 0.5 + time * 0.5) * 0.1;
        const wave2 = Math.sin(y * 0.3 + time * 0.3) * 0.1;
        position.setZ(i, wave1 + wave2);
      }
      position.needsUpdate = true;
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

      <ambientLight intensity={phase === 'ground' ? 0.5 * intensity : 0.3 * intensity} />
      <pointLight
        position={[10, 10, 10]}
        intensity={0.5 * intensity}
        color={phase === 'space' ? '#ffffff' : phase === 'sky' ? '#87CEEB' : '#FFA07A'}
      />
      <pointLight
        position={[-10, -10, -10]}
        intensity={0.3 * intensity}
        color={phase === 'space' ? '#aaaaff' : phase === 'sky' ? '#B0E0E6' : '#D2691E'}
      />
      {/* Directional light for ground scene shadows */}
      {phase === 'ground' && (
        <directionalLight
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
        {/* Background particles - Space phase */}
        {spaceOpacity > 0 && (
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
              opacity={0.7 * spaceOpacity}
              sizeAttenuation
              blending={THREE.AdditiveBlending}
            />
          </points>
        )}

        {/* Clouds for Sky Phase */}
        {skyOpacity > 0 && clouds.map((cloud, i) => (
          <Float
            key={`cloud-${i}`}
            speed={cloud.speed}
            rotationIntensity={0.05}
            floatIntensity={0.3}
            floatingRange={[-0.2, 0.2]}
          >
            <Cloud
              position={cloud.position}
              rotation={cloud.rotation}
              opacity={cloud.opacity * skyOpacity}
              speed={0.1}
              width={cloud.scale * 2}
              depth={cloud.scale * 1}
              segments={15}
              color="#FFFFFF"
              fade={30}
            />
          </Float>
        ))}

        {/* Main floating shapes - Space phase */}
        {spaceOpacity > 0 && mainShapes.map((shape, i) => (
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
                opacity={0.85 * spaceOpacity}
                roughness={0.3}
                metalness={0.1}
              />
            </mesh>
          </Float>
        ))}

        {/* Ground Scene - Land, Sea, and Houses */}
        {groundOpacity > 0 && (
          <group opacity={groundOpacity}>
            {/* Ground/Land */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
              <circleGeometry args={[15, 64]} />
              <meshStandardMaterial
                color="#228B22"
                roughness={0.9}
                metalness={0.1}
                transparent
                opacity={groundOpacity}
              />
            </mesh>

            {/* Water/Sea */}
            <mesh
              ref={waterRef}
              rotation={[-Math.PI / 2, 0, 0]}
              position={[0, -0.48, 0]}
              receiveShadow
            >
              <planeGeometry args={[30, 30, 64, 64]} />
              <meshStandardMaterial
                color="#1E90FF"
                transparent
                opacity={0.7 * groundOpacity}
                roughness={0.1}
                metalness={0.8}
              />
            </mesh>

            {/* Houses */}
            {houses.map((house, i) => (
              <group key={`house-${i}`} position={house.position} rotation={[0, house.rotation, 0]} scale={house.scale}>
                {/* House Base */}
                <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
                  <boxGeometry args={[1, 1, 1]} />
                  <meshStandardMaterial color={house.color} transparent opacity={groundOpacity} />
                </mesh>

                {/* Roof */}
                <mesh position={[0, 1.3, 0]} castShadow>
                  <coneGeometry args={[0.8, 0.6, 4]} />
                  <meshStandardMaterial color="#8B4513" transparent opacity={groundOpacity} />
                </mesh>

                {/* Door */}
                <mesh position={[0, 0.3, 0.51]} castShadow>
                  <boxGeometry args={[0.3, 0.6, 0.05]} />
                  <meshStandardMaterial color="#654321" transparent opacity={groundOpacity} />
                </mesh>

                {/* Window 1 */}
                <mesh position={[-0.3, 0.6, 0.51]} castShadow>
                  <boxGeometry args={[0.2, 0.2, 0.05]} />
                  <meshStandardMaterial color="#87CEEB" emissive="#FFFF99" emissiveIntensity={0.3} transparent opacity={groundOpacity} />
                </mesh>

                {/* Window 2 */}
                <mesh position={[0.3, 0.6, 0.51]} castShadow>
                  <boxGeometry args={[0.2, 0.2, 0.05]} />
                  <meshStandardMaterial color="#87CEEB" emissive="#FFFF99" emissiveIntensity={0.3} transparent opacity={groundOpacity} />
                </mesh>
              </group>
            ))}

            {/* Trees scattered around */}
            {trees.map((tree, i) => (
              <group
                key={`tree-${i}`}
                position={tree.position}
                scale={tree.scale}
              >
                {/* Tree trunk */}
                <mesh position={[0, 0.5, 0]} castShadow>
                  <cylinderGeometry args={[0.1, 0.15, 1, 8]} />
                  <meshStandardMaterial color="#654321" transparent opacity={groundOpacity} />
                </mesh>
                {/* Tree foliage */}
                <mesh position={[0, 1.3, 0]} castShadow>
                  <coneGeometry args={[0.5, 1, 8]} />
                  <meshStandardMaterial color="#228B22" transparent opacity={groundOpacity} />
                </mesh>
              </group>
            ))}
          </group>
        )}
      </group>

      {/* Additional sparkles for magical effect - Space phase */}
      {spaceOpacity > 0 && (
        <Sparkles
          ref={sparklesRef}
          count={100}
          scale={[20, 8, 20]}
          size={1.5 * intensity}
          speed={0.2 * intensity}
          opacity={0.4 * spaceOpacity}
          color="#ffffff"
        />
      )}
    </>
  );
}
