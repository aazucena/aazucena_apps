import { useRef, useMemo, type JSX } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, OrbitControls, Sparkles, Cloud } from '@react-three/drei';
import * as THREE from 'three';
import type { Group, Points, BufferGeometry, Material, Mesh } from 'three';

interface ThreeJSSceneProps {
  intensity?: number;
  phase?: 'exosphere' | 'thermosphere' | 'mesosphere' | 'stratosphere' | 'troposphere';
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

interface BushData {
  position: [number, number, number];
  scale: number;
  color: string;
}

interface RockData {
  position: [number, number, number];
  scale: number;
  rotation: [number, number, number];
}

interface FlowerData {
  position: [number, number, number];
  scale: number;
  color: string;
}

export default function ThreeJSScene({
  intensity = 1,
  phase = 'exosphere',
  currentSection = 0,
  scrollProgress = 0
}: ThreeJSSceneProps): JSX.Element {
  const groupRef = useRef<Group>(null);
  const particlesRef = useRef<Points<BufferGeometry, Material | Material[]>>(null);
  const sparklesRef = useRef<Points<BufferGeometry, Material | Material[]>>(null);
  const shapeRefs = useRef<THREE.Mesh[]>([]);
  const sunLightRef = useRef<THREE.DirectionalLight>(null);

  // Calculate opacity for each atmospheric layer based on scroll progress
  const progress = currentSection + scrollProgress;

  // Exosphere (section 0): full opacity until 0.5, fade out 0.5-1.0
  const exosphereOpacity = progress <= 0.5 ? 1 : progress >= 1.0 ? 0 : 1 - ((progress - 0.5) * 2);

  // Thermosphere (section 1): fade in 0.5-1.0, full until 1.5, fade out 1.5-2.0
  const thermosphereOpacity = progress < 0.5 ? 0
    : progress <= 1.0 ? (progress - 0.5) * 2
    : progress <= 1.5 ? 1
    : progress >= 2.0 ? 0
    : 1 - ((progress - 1.5) * 2);

  // Mesosphere (sections 2-3): fade in 1.5-2.0, full until 3.5, fade out 3.5-4.0
  const mesosphereOpacity = progress < 1.5 ? 0
    : progress <= 2.0 ? (progress - 1.5) * 2
    : progress <= 3.5 ? 1
    : progress >= 4.0 ? 0
    : 1 - ((progress - 3.5) * 2);

  // Stratosphere (sections 4-5): fade in 3.5-4.0, full until 5.5, fade out 5.5-6.0
  const stratosphereOpacity = progress < 3.5 ? 0
    : progress <= 4.0 ? (progress - 3.5) * 2
    : progress <= 5.5 ? 1
    : progress >= 6.0 ? 0
    : 1 - ((progress - 5.5) * 2);

  // Troposphere (sections 6-7): fade in 5.5-6.0, then full opacity
  const troposphereOpacity = progress < 5.5 ? 0 : progress >= 6.0 ? 1 : (progress - 5.5) * 2;

  // Generate colors based on atmospheric layer
  const generatePhaseColor = (): string => {
    switch (phase) {
      case 'exosphere':
        // Deep space colors (purples, blues, pinks)
        const exosphereHue = Math.random() * 100 + 200; // 200-300 (blues to purples)
        return `hsl(${exosphereHue}, ${60 + Math.random() * 20}%, ${70 + Math.random() * 15}%)`;
      case 'thermosphere':
        // Aurora colors (greens, purples, pinks)
        const thermosphereHue = Math.random() > 0.5 ? Math.random() * 60 + 120 : Math.random() * 60 + 280; // Green or purple/pink
        return `hsl(${thermosphereHue}, ${70 + Math.random() * 20}%, ${65 + Math.random() * 15}%)`;
      case 'mesosphere':
        // Deep blue colors
        const mesosphereHue = Math.random() * 40 + 200; // 200-240 (deep blues)
        return `hsl(${mesosphereHue}, ${60 + Math.random() * 20}%, ${60 + Math.random() * 15}%)`;
      case 'stratosphere':
        // Sky blue colors (blues, cyans)
        const stratosphereHue = Math.random() * 60 + 180; // 180-240 (cyans to blues)
        return `hsl(${stratosphereHue}, ${50 + Math.random() * 30}%, ${75 + Math.random() * 15}%)`;
      case 'troposphere':
        // Earth tones and cloud colors (greens, blues, whites)
        const troposphereHue = Math.random() * 120 + 90; // 90-210 (greens to blues)
        return `hsl(${troposphereHue}, ${40 + Math.random() * 30}%, ${60 + Math.random() * 20}%)`;
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
      const radius = 6 + Math.random() * 2; // Further out to be visible but not overwhelming

      return {
        position: [
          Math.cos(angle) * radius,
          -0.5, // Align with ground level
          Math.sin(angle) * radius
        ],
        rotation: Math.random() * Math.PI * 2,
        scale: 0.7 + Math.random() * 0.3,
        color: houseColors[Math.floor(Math.random() * houseColors.length)]
      } as HouseData;
    });
  }, []);

  // Tree data for ground phase
  const trees = useMemo((): TreeData[] => {
    return Array.from({ length: 15 }, (_, i) => {
      const angle = (i / 15) * Math.PI * 2;
      const radius = 4.5 + Math.random() * 2.5; // Between houses and center

      return {
        position: [
          Math.cos(angle) * radius,
          -0.5, // Align with ground level
          Math.sin(angle) * radius
        ],
        scale: 0.6 + Math.random() * 0.3
      } as TreeData;
    });
  }, []);

  // Bush data for ground phase
  const bushes = useMemo((): BushData[] => {
    const bushColors = ['#228B22', '#2E8B57', '#3CB371', '#90EE90'];
    return Array.from({ length: 25 }, (_) => {
      const angle = Math.random() * Math.PI * 2;
      const radius = 2.5 + Math.random() * 4; // Spread between center and trees

      return {
        position: [
          Math.cos(angle) * radius,
          -0.5,
          Math.sin(angle) * radius
        ],
        scale: 0.25 + Math.random() * 0.2,
        color: bushColors[Math.floor(Math.random() * bushColors.length)]
      } as BushData;
    });
  }, []);

  // Rock data for ground phase
  const rocks = useMemo((): RockData[] => {
    return Array.from({ length: 20 }, (_) => {
      const angle = Math.random() * Math.PI * 2;
      const radius = 3 + Math.random() * 4.5; // Scattered throughout

      return {
        position: [
          Math.cos(angle) * radius,
          -0.5,
          Math.sin(angle) * radius
        ],
        scale: 0.2 + Math.random() * 0.2,
        rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI]
      } as RockData;
    });
  }, []);

  // Flower data for ground phase
  const flowers = useMemo((): FlowerData[] => {
    const flowerColors = ['#FF69B4', '#FFD700', '#FF6347', '#FF4500', '#FFA500', '#FFFF00'];
    return Array.from({ length: 35 }, (_) => {
      const angle = Math.random() * Math.PI * 2;
      const radius = 2 + Math.random() * 5; // Scattered nicely

      return {
        position: [
          Math.cos(angle) * radius,
          -0.48, // Slightly above ground
          Math.sin(angle) * radius
        ],
        scale: 0.1 + Math.random() * 0.1,
        color: flowerColors[Math.floor(Math.random() * flowerColors.length)]
      } as FlowerData;
    });
  }, []);

  // INFINITE CONTINUOUS ANIMATION - runs every frame forever without any pause
  useFrame((state, delta: number) => {
    // Use elapsed time as backup if delta is ever 0 or undefined
    const time = state.clock.elapsedTime;
    const safeDelta = delta || 0.016; // Fallback to ~60fps if delta is 0

    // Rotate main group continuously - STOPS in Troposphere (ground level)
    if (groupRef.current && phase !== 'troposphere') {
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

    // Slowly move directional light (sun) for realistic shadow movement
    if (sunLightRef.current && phase === 'troposphere') {
      // Very slow circular movement to simulate sun moving across the sky
      const sunSpeed = time * 0.05; // Very slow speed for believable sun movement
      const radius = 10;
      sunLightRef.current.position.x = Math.cos(sunSpeed) * radius;
      sunLightRef.current.position.z = Math.sin(sunSpeed) * radius;
      sunLightRef.current.position.y = 8 + Math.sin(sunSpeed * 0.5) * 2; // Vary height slightly
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

      <ambientLight intensity={phase === 'troposphere' ? 0.5 * intensity : 0.3 * intensity} />
      <pointLight
        position={[10, 10, 10]}
        intensity={0.5 * intensity}
        color={
          phase === 'exosphere' ? '#ffffff' :
          phase === 'thermosphere' ? '#9D4EDD' :
          phase === 'mesosphere' ? '#3A86FF' :
          phase === 'stratosphere' ? '#87CEEB' :
          '#FFA07A'
        }
      />
      <pointLight
        position={[-10, -10, -10]}
        intensity={0.3 * intensity}
        color={
          phase === 'exosphere' ? '#aaaaff' :
          phase === 'thermosphere' ? '#06FFA5' :
          phase === 'mesosphere' ? '#1E40AF' :
          phase === 'stratosphere' ? '#B0E0E6' :
          '#D2691E'
        }
      />
      {/* Directional light for Troposphere (ground) scene shadows */}
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
        {/* Background particles - Exosphere (deep space) */}
        {(phase === 'exosphere' || phase === 'thermosphere' || exosphereOpacity > 0) && (
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
              opacity={0.7 * exosphereOpacity}
              sizeAttenuation
              blending={THREE.AdditiveBlending}
            />
          </points>
        )}

        {/* Aurora effects - Thermosphere */}
        {(phase === 'thermosphere' || phase === 'exosphere' || phase === 'mesosphere' || thermosphereOpacity > 0) && (
          <>
            {/* Aurora ribbons */}
            {Array.from({ length: 5 }).map((_, i) => {
              const angle = (i / 5) * Math.PI * 2;
              const radius = 10 + i * 2;
              return (
                <mesh
                  key={`aurora-${i}`}
                  position={[Math.cos(angle) * radius, 2 + i * 0.5, Math.sin(angle) * radius]}
                  rotation={[Math.PI / 4, angle, 0]}
                >
                  <planeGeometry args={[15, 3, 32, 8]} />
                  <meshStandardMaterial
                    color={i % 2 === 0 ? '#06FFA5' : '#9D4EDD'}
                    emissive={i % 2 === 0 ? '#06FFA5' : '#9D4EDD'}
                    emissiveIntensity={0.6}
                    transparent
                    opacity={0.3 * thermosphereOpacity}
                    side={THREE.DoubleSide}
                    blending={THREE.AdditiveBlending}
                  />
                </mesh>
              );
            })}

            {/* Aurora particles for extra glow */}
            <Sparkles
              count={80}
              scale={[25, 12, 25]}
              size={2}
              speed={0.3}
              opacity={0.5 * thermosphereOpacity}
              color="#06FFA5"
            />
            <Sparkles
              count={80}
              scale={[25, 12, 25]}
              size={2}
              speed={0.2}
              opacity={0.4 * thermosphereOpacity}
              color="#9D4EDD"
            />
          </>
        )}

        {/* Main floating shapes - Exosphere & Thermosphere */}
        {(exosphereOpacity > 0 || thermosphereOpacity > 0) && mainShapes.map((shape, i) => (
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
                emissiveIntensity={thermosphereOpacity > 0 ? 0.4 : 0.2}
                transparent
                opacity={0.85 * Math.max(exosphereOpacity, thermosphereOpacity)}
                roughness={0.3}
                metalness={0.1}
              />
            </mesh>
          </Float>
        ))}

        {/* Meteor effects - Mesosphere (coldest layer where meteors burn up) */}
        {(phase === 'mesosphere' || phase === 'thermosphere' || phase === 'stratosphere' || mesosphereOpacity > 0) && (
          <>
            {/* Icy blue sparkles for cold atmosphere */}
            <Sparkles
              count={120}
              scale={[30, 10, 30]}
              size={1}
              speed={0.1}
              opacity={0.4 * mesosphereOpacity}
              color="#3A86FF"
            />
            {/* Shooting stars/meteors */}
            {Array.from({ length: 3 }).map((_, i) => (
              <mesh
                key={`meteor-${i}`}
                position={[
                  (i - 1) * 15,
                  5 - i * 2,
                  10 - i * 8
                ]}
                rotation={[Math.PI / 6, i * 0.5, 0]}
              >
                <cylinderGeometry args={[0.05, 0.15, 3, 8]} />
                <meshStandardMaterial
                  color="#FFFFFF"
                  emissive="#87CEEB"
                  emissiveIntensity={0.8}
                  transparent
                  opacity={0.6 * mesosphereOpacity}
                />
              </mesh>
            ))}
          </>
        )}

        {/* Clouds for Stratosphere Phase */}
        {(phase === 'stratosphere' || phase === 'mesosphere' || phase === 'troposphere' || stratosphereOpacity > 0) && clouds.map((cloud, i) => (
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
              opacity={cloud.opacity * stratosphereOpacity}
              speed={0.1}
            />
          </Float>
        ))}

        {/* Ground Scene - Troposphere (Land and Houses) */}
        {(progress >= 5.5) && (
          <group>
            {/* Ground/Land */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
              <circleGeometry args={[15, 64]} />
              <meshStandardMaterial
                color="#228B22"
                roughness={0.9}
                metalness={0.1}
                transparent
                opacity={troposphereOpacity}
              />
            </mesh>

            {/* Houses */}
            {houses.map((house, i) => (
              <group key={`house-${i}`} position={house.position} rotation={[0, house.rotation, 0]} scale={house.scale}>
                {/* House Base */}
                <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
                  <boxGeometry args={[1, 1, 1]} />
                  <meshStandardMaterial color={house.color} transparent opacity={troposphereOpacity} />
                </mesh>

                {/* Roof - rotated 45 degrees to align with box edges */}
                <mesh position={[0, 1.3, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
                  <coneGeometry args={[0.8, 0.6, 4]} />
                  <meshStandardMaterial color="#8B4513" transparent opacity={troposphereOpacity} />
                </mesh>

                {/* Door */}
                <mesh position={[0, 0.3, 0.51]} castShadow>
                  <boxGeometry args={[0.3, 0.6, 0.05]} />
                  <meshStandardMaterial color="#654321" transparent opacity={troposphereOpacity} />
                </mesh>

                {/* Window 1 */}
                <mesh position={[-0.3, 0.6, 0.51]} castShadow>
                  <boxGeometry args={[0.2, 0.2, 0.05]} />
                  <meshStandardMaterial color="#87CEEB" emissive="#FFFF99" emissiveIntensity={0.3} transparent opacity={troposphereOpacity} />
                </mesh>

                {/* Window 2 */}
                <mesh position={[0.3, 0.6, 0.51]} castShadow>
                  <boxGeometry args={[0.2, 0.2, 0.05]} />
                  <meshStandardMaterial color="#87CEEB" emissive="#FFFF99" emissiveIntensity={0.3} transparent opacity={troposphereOpacity} />
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
                  <meshStandardMaterial color="#654321" transparent opacity={troposphereOpacity} />
                </mesh>
                {/* Tree foliage */}
                <mesh position={[0, 1.3, 0]} castShadow>
                  <coneGeometry args={[0.5, 1, 8]} />
                  <meshStandardMaterial color="#228B22" transparent opacity={troposphereOpacity} />
                </mesh>
              </group>
            ))}

            {/* Bushes scattered around */}
            {bushes.map((bush, i) => (
              <mesh
                key={`bush-${i}`}
                position={bush.position}
                scale={bush.scale}
                castShadow
              >
                <sphereGeometry args={[1, 8, 8]} />
                <meshStandardMaterial
                  color={bush.color}
                  transparent
                  opacity={troposphereOpacity}
                  roughness={0.8}
                />
              </mesh>
            ))}

            {/* Rocks scattered around */}
            {rocks.map((rock, i) => (
              <mesh
                key={`rock-${i}`}
                position={rock.position}
                rotation={rock.rotation}
                scale={rock.scale}
                castShadow
                receiveShadow
              >
                <dodecahedronGeometry args={[1, 0]} />
                <meshStandardMaterial
                  color="#808080"
                  transparent
                  opacity={troposphereOpacity}
                  roughness={0.9}
                  metalness={0.1}
                />
              </mesh>
            ))}

            {/* Flowers scattered around */}
            {flowers.map((flower, i) => (
              <group
                key={`flower-${i}`}
                position={flower.position}
                scale={flower.scale}
              >
                {/* Flower stem */}
                <mesh position={[0, 0.15, 0]}>
                  <cylinderGeometry args={[0.02, 0.02, 0.3, 4]} />
                  <meshStandardMaterial color="#228B22" transparent opacity={troposphereOpacity} />
                </mesh>
                {/* Flower petals */}
                <mesh position={[0, 0.3, 0]}>
                  <sphereGeometry args={[0.15, 6, 6]} />
                  <meshStandardMaterial
                    color={flower.color}
                    emissive={flower.color}
                    emissiveIntensity={0.3}
                    transparent
                    opacity={troposphereOpacity}
                  />
                </mesh>
              </group>
            ))}
          </group>
        )}
      </group>

      {/* Additional sparkles for magical effect - Exosphere phase */}
      {(phase === 'exosphere' || phase === 'thermosphere' || exosphereOpacity > 0) && (
        <Sparkles
          ref={sparklesRef}
          count={100}
          scale={[20, 8, 20]}
          size={1.5 * intensity}
          speed={0.2 * intensity}
          opacity={0.4 * exosphereOpacity}
          color="#ffffff"
        />
      )}
    </>
  );
}
