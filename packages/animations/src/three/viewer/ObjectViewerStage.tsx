'use client';

import * as React from 'react';
import * as THREE from 'three';
import { 
  Center, 
  Environment, 
  ContactShadows, 
  useHelper,
} from '@react-three/drei';
import { ANIMATION_OBJECT_REGISTRY } from '../objects/registry.js';
import { useObjectViewer } from './context.js';

/**
 * ObjectViewerStage - The 3D scene content
 */
export function ObjectViewerStage() {
  const { 
    objectKey, 
    showBBox, 
    showAxes, 
    isSlowMo, 
    intensity, 
    envPreset 
  } = useObjectViewer();

  const groupRef = React.useRef<THREE.Object3D>(new THREE.Object3D());
  
  const obj3D = showBBox ? groupRef : null;
  // Correctly use the helper with a ref
  useHelper(obj3D, THREE.BoxHelper, '#ffffff');

  const registryEntry = ANIMATION_OBJECT_REGISTRY[objectKey];
  if (!registryEntry) return null;
  const SelectedObject = registryEntry.component;

  return (
    <>
      <Environment preset={envPreset} />
      <ambientLight intensity={0.5 * intensity} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2 * intensity} castShadow />
      
      <Center top>
        <group ref={groupRef}>
          {/* 
            Note: Wireframe mode is simulated here. 
            In a real production environment, we would inject a wireframe material or property.
          */}
          <SelectedObject 
            opacity={1} 
            // Passing custom time factor for slow-motion effect
            config={{ custom: { timeScale: isSlowMo ? 0.25 : 1 } } as any}
          />
        </group>
      </Center>

      <ContactShadows 
        position={[0, 0, 0]} 
        opacity={0.4} 
        scale={10} 
        blur={2.5} 
        far={4} 
      />

      {showAxes && <axesHelper args={[5]} />}
    </>
  );
}
