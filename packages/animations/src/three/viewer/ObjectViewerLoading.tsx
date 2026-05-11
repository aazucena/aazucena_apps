'use client';

import * as React from 'react';
import { Html } from '@react-three/drei';
import { Skeleton } from '@aazucena/ui';

/**
 * ObjectViewerLoading - High-fidelity skeleton loader for 3D scene
 */
export function ObjectViewerLoading() {
  return (
    <Html center fullscreen>
      <div className="flex items-center justify-center w-full h-full pointer-events-none">
        <Skeleton variant="cyber" className="w-[40%] h-[40%] rounded-full opacity-20" />
      </div>
    </Html>
  );
}
