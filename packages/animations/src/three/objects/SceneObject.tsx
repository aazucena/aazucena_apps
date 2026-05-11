import React, { useRef, useEffect, useState } from 'react';
import type { JSX } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import { Float } from '@react-three/drei';
import { applyAnimation } from '@aazucena/utils';
import type { SceneObjectProps } from '@aazucena/types';

/**
 * SceneObject - Universal wrapper for all scene objects
 */
export function SceneObject({
  config,
  opacity = 1,
  objectRef,
  children,
}: SceneObjectProps): JSX.Element {
  const internalRef = useRef<Group>(null);
  const ref = (objectRef || internalRef) as any;
  const [hovered, setHovered] = useState(false);

  // Mock store logic if not available yet in packages/stores
  const isTarget = false;

  const { position, rotation = [0, 0, 0], scale = 1, animation } = config;

  const scaleArray: [number, number, number] =
    typeof scale === 'number' ? [scale, scale, scale] : (scale as [number, number, number]);

  useEffect(() => {
    if (ref.current) {
      ref.current.position.set(position[0], position[1], position[2]);
      ref.current.rotation.set(rotation[0], rotation[1], rotation[2]);
      ref.current.scale.set(scaleArray[0], scaleArray[1], scaleArray[2]);
    }
  }, [ref, position, rotation, scaleArray]);

  useFrame(({ clock }) => {
    if (animation && animation !== 'custom' && ref.current) {
      const time = clock.getElapsedTime();
      applyAnimation(ref, time, animation);
    }
  });

  const handleInteraction = () => {
    // trackInteraction(id);
  };

  return (
    <Float enabled={isTarget} speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group
        ref={ref}
        name={config.id || config.type}
        onClick={(e) => {
          e.stopPropagation();
          handleInteraction();
        }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {(hovered || isTarget) && (
          <pointLight
            position={[0, 0, 0]}
            intensity={isTarget ? 2 : 0.5}
            color={isTarget ? '#ffd42a' : '#ffffff'}
            distance={3}
          />
        )}

        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement<any>, {
              opacity,
            });
          }
          return child;
        })}
      </group>
    </Float>
  );
}
