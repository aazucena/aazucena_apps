/**
 * E.T. Bike Easter Egg
 * FIXED: Lowered seat, shortened legs (0.58), and forward-bending knees.
 * ARMS GLOBAL POSITION PRESERVED.
 */

import type { JSX } from 'react';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import { Vector2 } from 'three';
import { applyAnimation } from '@aazucena/utils';

interface ETBikeProps {
  opacity: number;
  pedalBaseSpeed?: number;
  legSpeedRatio?: number;
}

// Configuration for Inverse Kinematics - Mathematically matched to mesh
const IK_CONFIG = {
  CRANK_POS: new Vector2(-0.15, -0.25),
  CRANK_RADIUS: 0.5, // Matched to geometry
  HIP_POS: new Vector2(0, 0.1), // Relative to Elliott root
  THIGH_L: 0.54, // Shorter to avoid arm collision
  SHIN_L: 0.54, // Shorter to avoid arm collision
};

/**
 * Solve 2D Inverse Kinematics for a 2-segment limb
 * target: where the foot needs to be (pedal)
 * origin: hip position
 */
function solveIK(target: Vector2, origin: Vector2, l1: number, l2: number) {
  const dx = target.x - origin.x;
  const dy = target.y - origin.y;
  const d2 = dx * dx + dy * dy;
  const d = Math.sqrt(d2);

  if (d > l1 + l2) {
    const angle = Math.atan2(dy, dx);
    return { thighAngle: angle, kneeAngle: 0 };
  }

  let cosKnee = (d2 - l1 * l1 - l2 * l2) / (2 * l1 * l2);
  cosKnee = Math.max(-1, Math.min(1, cosKnee));
  const kneeAngle = Math.acos(cosKnee);

  const a1 = Math.atan2(dy, dx);
  const a2 = Math.asin((l2 * Math.sin(kneeAngle)) / d);

  // Flipped logic for forward bending knee
  const thighAngle = a1 + a2;

  return { thighAngle, kneeAngle: -kneeAngle };
}

export function ETBike({
  opacity,
  pedalBaseSpeed = 2.5,
  legSpeedRatio = 1,
}: ETBikeProps): JSX.Element {
  const groupRef = useRef<Group>(null);
  const wheelsRef = useRef<Group>(null);
  const crankRef = useRef<Group>(null);

  const leftThighRef = useRef<Group>(null);
  const rightThighRef = useRef<Group>(null);
  const leftKneeRef = useRef<Group>(null);
  const rightKneeRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    const pedalAngle = time * pedalBaseSpeed;
    const legAngle = time * pedalBaseSpeed * legSpeedRatio;

    // 1. Flight Path
    applyAnimation(groupRef, time, {
      rotationOscillation: { y: { frequency: 0.1, amplitude: 0.2 } },
      positionWave: {
        base: { x: 0, y: 0, z: 0 },
        y: { frequency: 0.2, amplitude: 0.5 },
        x: { frequency: 0.1, amplitude: 1 },
      },
    });

    // 2. Spinning wheels
    if (wheelsRef.current) {
      wheelsRef.current.children.forEach((wheel) => {
        wheel.rotation.z = -time * 8;
      });
    }

    // 3. Crank Rotation (Forward)
    if (crankRef.current) {
      crankRef.current.rotation.z = -pedalAngle;
    }

    // 4. IK CIRCULAR SYNC
    if (
      leftThighRef.current &&
      rightThighRef.current &&
      leftKneeRef.current &&
      rightKneeRef.current
    ) {
      // Hip in global space (Elliott root lowered to 0.35)
      const globalHip = new Vector2(-0.3 + IK_CONFIG.HIP_POS.x, 0.35 + IK_CONFIG.HIP_POS.y);

      const leftPedal = new Vector2(
        IK_CONFIG.CRANK_POS.x + Math.sin(legAngle) * IK_CONFIG.CRANK_RADIUS,
        IK_CONFIG.CRANK_POS.y + Math.cos(legAngle) * IK_CONFIG.CRANK_RADIUS,
      );
      const rightPedal = new Vector2(
        IK_CONFIG.CRANK_POS.x + Math.sin(legAngle + Math.PI) * IK_CONFIG.CRANK_RADIUS,
        IK_CONFIG.CRANK_POS.y + Math.cos(legAngle + Math.PI) * IK_CONFIG.CRANK_RADIUS,
      );

      const leftIK = solveIK(leftPedal, globalHip, IK_CONFIG.THIGH_L, IK_CONFIG.SHIN_L);
      const rightIK = solveIK(rightPedal, globalHip, IK_CONFIG.THIGH_L, IK_CONFIG.SHIN_L);

      leftThighRef.current.rotation.z = leftIK.thighAngle + Math.PI / 2;
      leftKneeRef.current.rotation.z = leftIK.kneeAngle;

      rightThighRef.current.rotation.z = rightIK.thighAngle + Math.PI / 2;
      rightKneeRef.current.rotation.z = rightIK.kneeAngle;
    }
  });

  return (
    <group ref={groupRef}>
      {/* --- BICYCLE (STRUCTURAL HIERARCHY) --- */}
      <group>
        <mesh position={[-0.3, -0.1, 0]} rotation={[0, 0, 0.5]} castShadow>
          <boxGeometry args={[0.8, 0.05, 0.2]} />
          <meshStandardMaterial color="#b91c1c" transparent opacity={opacity} />
        </mesh>
        <mesh position={[0, 0, 0]} rotation={[0, 0, 0.2]} castShadow>
          <boxGeometry args={[1.2, 0.05, 0.05]} />
          <meshStandardMaterial color="#b91c1c" transparent opacity={opacity} />
        </mesh>
        <mesh position={[0.1, -0.2, 0]} rotation={[0, 0, -0.8]} castShadow>
          <boxGeometry args={[0.8, 0.05, 0.05]} />
          <meshStandardMaterial color="#b91c1c" transparent opacity={opacity} />
        </mesh>

        {/* SEAT LOWERED BY 0.1 */}
        <group position={[-0.3, 0.0, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.04, 0.6, 0.04]} />
            <meshStandardMaterial color="#b91c1c" transparent opacity={opacity} />
          </mesh>
          <mesh position={[0, 0.3, 0]} castShadow>
            <boxGeometry args={[0.4, 0.06, 0.3]} />
            <meshStandardMaterial color="#1e293b" transparent opacity={opacity} />
          </mesh>
        </group>

        {/* HANDLEBARS PRESERVED */}
        <group position={[0.65, -0.2, 0]} rotation={[0, 0, -0.475]}>
          <mesh castShadow position={[-0.1, 0, 0]}>
            <boxGeometry args={[0.04, 0.8, 0.25]} />
            <meshStandardMaterial color="#cbd5e1" transparent opacity={opacity} />
          </mesh>
          <group position={[-0.2, 0.2, 0]} rotation={[-0.2, 0, 0.75]}>
            <mesh castShadow>
              <boxGeometry args={[0.05, 0.4, 0.05]} />
              <meshStandardMaterial color="#b91c1c" transparent opacity={opacity} />
            </mesh>
            <group position={[0, 0.4, 0]}>
              <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
                <cylinderGeometry args={[0.02, 0.02, 1, 8]} />
                <meshStandardMaterial
                  color="#94a3b8"
                  metalness={0.8}
                  transparent
                  opacity={opacity}
                />
              </mesh>
              {[0.45, -0.45].map((z, i) => (
                <mesh key={i} position={[0, 0, z]} rotation={[Math.PI / 2, 0, 0]}>
                  <cylinderGeometry args={[0.035, 0.035, 0.2, 8]} />
                  <meshStandardMaterial color="#000000" transparent opacity={opacity} />
                </mesh>
              ))}
            </group>
            {/* Basket */}
            <group position={[0.3, 0.2, 0]} rotation={[0, 0, -0.5]}>
              <mesh castShadow>
                <boxGeometry args={[0.65, 0.5, 0.55]} />
                <meshStandardMaterial
                  color="#f1f5f9"
                  transparent
                  opacity={opacity}
                  roughness={0.8}
                />
              </mesh>
              <mesh position={[0, 0.1, 0]}>
                <capsuleGeometry args={[0.22, 0.35, 4, 8]} />
                <meshStandardMaterial color="#ffffff" transparent opacity={opacity} />
              </mesh>
              <group position={[0.05, 0.4, 0]}>
                <mesh castShadow>
                  <sphereGeometry args={[0.16, 12, 12]} scale={[1.2, 0.8, 1]} />
                  <meshStandardMaterial color="#78350f" transparent opacity={opacity} />
                </mesh>
                {[0.08, -0.08].map((z, j) => (
                  <mesh key={j} position={[0.1, 0, z]}>
                    <sphereGeometry args={[0.04, 8, 8]} />
                    <meshStandardMaterial color="#0f172a" transparent opacity={opacity} />
                  </mesh>
                ))}
                <mesh position={[0.2, -0.15, 0.15]} rotation={[0, 0.5, 0.5]}>
                  <cylinderGeometry args={[0.01, 0.01, 0.15, 4]} />
                  <meshStandardMaterial
                    color="#ef4444"
                    emissive="#ff0000"
                    emissiveIntensity={5}
                    transparent
                    opacity={opacity}
                  />
                </mesh>
              </group>
            </group>
          </group>
        </group>

        {/* Crankset */}
        <group ref={crankRef} position={[-0.15, -0.25, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.1, 8]} />
            <meshStandardMaterial color="#475569" transparent opacity={opacity} />
          </mesh>
          {[0, Math.PI].map((angle, i) => (
            <group key={i} rotation={[0, 0, angle]}>
              <mesh position={[0, 0.25, i === 0 ? 0.22 : -0.22]} castShadow>
                <boxGeometry args={[0.03, 0.5, 0.03]} />
                <meshStandardMaterial color="#94a3b8" transparent opacity={opacity} />
              </mesh>
              <mesh position={[0, 0.5, i === 0 ? 0.22 : -0.22]} rotation={[0, 0, -angle]}>
                <boxGeometry args={[0.2, 0.04, 0.2]} />
                <meshStandardMaterial color="#1e293b" transparent opacity={opacity} />
              </mesh>
            </group>
          ))}
        </group>
        {/* WHEELS */}
        <group ref={wheelsRef} position={[0, -0.4, 0]}>
          <mesh position={[0.6, 0, 0]} castShadow>
            <torusGeometry args={[0.4, 0.025, 8, 24]} />
            <meshStandardMaterial color="#1e293b" transparent opacity={opacity} />
          </mesh>
          <mesh position={[-0.65, 0, 0]} castShadow>
            <torusGeometry args={[0.4, 0.025, 8, 24]} />
            <meshStandardMaterial color="#1e293b" transparent opacity={opacity} />
          </mesh>
        </group>
      </group>

      {/* --- ELLIOTT (ARMS PRESERVED GLOBALLY) --- */}
      <group position={[-0.3, 0.35, 0]}>
        {' '}
        {/* Root lowered to 0.35 */}
        <group rotation={[-0.2, 0, 0]}>
          <mesh position={[0, 0.3, 0]} castShadow>
            <boxGeometry args={[0.35, 0.6, 0.35]} />
            <meshStandardMaterial color="#dc2626" transparent opacity={opacity} />
          </mesh>
          {/* Head on Neck */}
          <group position={[0, 0.65, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.05, 0.05, 0.15, 8]} />
              <meshStandardMaterial color="#fecaca" transparent opacity={opacity} />
            </mesh>
            <group position={[0, 0.15, 0]}>
              <mesh castShadow>
                <sphereGeometry args={[0.16, 12, 12]} />
                <meshStandardMaterial color="#fecaca" transparent opacity={opacity} />
              </mesh>
              <mesh position={[0, 0.08, 0]} castShadow>
                <sphereGeometry args={[0.17, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
                <meshStandardMaterial color="#451a03" transparent opacity={opacity} />
              </mesh>
            </group>
          </group>
          {/* ARMS - RAISED TO 0.6 RELATIVE TO ELLIOTT TO PRESERVE GLOBAL Y */}
          {[0.18, -0.18].map((side) => (
            <group key={side} position={[0.15, 0.6, side]}>
              <group rotation={[0, -side * 0.4, -0.6]}>
                <mesh position={[0.4, 0, 0]} castShadow>
                  <boxGeometry args={[0.8, 0.08, 0.08]} />
                  <meshStandardMaterial color="#dc2626" transparent opacity={opacity} />
                </mesh>
                <mesh position={[0.8, 0, 0]} castShadow>
                  <sphereGeometry args={[0.06, 8, 8]} />
                  <meshStandardMaterial color="#fecaca" transparent opacity={opacity} />
                </mesh>
              </group>
            </group>
          ))}
        </group>
        {/* LEGS (IK SYNCED) */}
        {[0.15, -0.15].map((side, i) => (
          <group
            key={side}
            ref={i === 0 ? leftThighRef : rightThighRef}
            position={[IK_CONFIG.HIP_POS.x, IK_CONFIG.HIP_POS.y, side]}
          >
            <group position={[0, -IK_CONFIG.THIGH_L / 2, 0]}>
              <mesh castShadow>
                <boxGeometry args={[0.12, IK_CONFIG.THIGH_L, 0.12]} />
                <meshStandardMaterial color="#1e40af" transparent opacity={opacity} />
              </mesh>
              <group
                ref={i === 0 ? leftKneeRef : rightKneeRef}
                position={[0, -IK_CONFIG.THIGH_L / 2, 0]}
              >
                <mesh position={[0, -IK_CONFIG.SHIN_L / 2, 0]} castShadow>
                  <boxGeometry args={[0.1, IK_CONFIG.SHIN_L, 0.1]} />
                  <meshStandardMaterial color="#1e40af" transparent opacity={opacity} />
                </mesh>
                <mesh position={[0, -IK_CONFIG.SHIN_L, 0.05]} castShadow>
                  <boxGeometry args={[0.18, 0.08, 0.25]} />
                  <meshStandardMaterial color="#ffffff" transparent opacity={opacity} />
                </mesh>
              </group>
            </group>
          </group>
        ))}
      </group>
    </group>
  );
}
