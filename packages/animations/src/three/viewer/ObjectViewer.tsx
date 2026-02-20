/**
 * ObjectViewer Component
 * A reusable 3D inspector for registry objects.
 * Refactored into modular components following ShadCN UI patterns.
 */

import type { JSX } from 'react';
import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stats } from '@react-three/drei';

// Import internal design system
import { TooltipProvider, Section } from '@aazucena/ui';

// Import modular components
import { ObjectViewerProvider, useObjectViewer } from './context.js';
import { ObjectViewerHUD } from './ObjectViewerHUD.js';
import { ObjectViewerControls } from './ObjectViewerControls.js';
import { ObjectViewerStage } from './ObjectViewerStage.js';
import { ObjectViewerLoading } from './ObjectViewerLoading.js';

import type { SceneObjectType } from '@aazucena/types';

export interface ObjectViewerProps {
  /** The registry key of the object to view */
  objectKey: SceneObjectType;
  /** Whether to show the floor grid by default */
  showGrid?: boolean;
  /** Whether the camera should auto-rotate by default */
  autoRotate?: boolean;
  /** Custom background class for the container */
  className?: string;
}

/**
 * Internal View Orchestrator (Accesses context)
 */
function ObjectViewInternal({
  showGrid: _initialShowGrid,
}: {
  showGrid: boolean;
}) {
  const { showGrid, autoRotate, showStats, controlsRef, isCapturing } = useObjectViewer();

  return (
    <Section
      contentWidth="full"
      variant="default"
      className="relative flex flex-col group h-full overflow-hidden"
    >
      {/* Shutter Flash Effect */}
      <div
        className={`absolute inset-0 z-50 bg-white pointer-events-none transition-opacity duration-300 ${isCapturing ? 'opacity-40' : 'opacity-0'}`}
      />

      {/* Layer 1: HUD & Metadata */}
      <ObjectViewerHUD />

      {/* Layer 2: Interactive Controls */}
      <ObjectViewerControls />

      {/* Layer 3: The 3D Engine */}
      <Canvas shadows gl={{ antialias: true, preserveDrawingBuffer: true }}>
        <PerspectiveCamera makeDefault position={[5, 3, 5]} fov={50} />

        <Suspense fallback={<ObjectViewerLoading />}>
          <ObjectViewerStage />
        </Suspense>

        {showGrid && <gridHelper args={[20, 20, 0x444444, 0x222222]} />}

        {showStats && <Stats className="!left-auto !right-0 !top-auto !bottom-0" />}

        <OrbitControls
          ref={controlsRef}
          makeDefault
          autoRotate={autoRotate}
          autoRotateSpeed={0.5}
          minDistance={2}
          maxDistance={15}
          enableDamping
        />
      </Canvas>
    </Section>
  );
}

/**
 * Main ObjectViewer Export
 */
export function ObjectViewer(props: ObjectViewerProps): JSX.Element {
  return (
    <TooltipProvider>
      <ObjectViewerProvider
        objectKey={props.objectKey}
        initialShowGrid={props.showGrid}
        initialAutoRotate={props.autoRotate}
      >
        <div className={`w-full h-full ${props.className || 'bg-zinc-100 dark:bg-zinc-950'}`}>
          <ObjectViewInternal showGrid={props.showGrid ?? true} />
        </div>
      </ObjectViewerProvider>
    </TooltipProvider>
  );
}
