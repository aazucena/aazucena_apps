'use client';

import * as React from 'react';
import { useProgress } from '@react-three/drei';
import { Skeleton } from '@aazucena/ui';

/**
 * ObjectViewerLoading - skeleton shown over the canvas while scene assets load.
 *
 * Render it as a sibling of `<Canvas>`, not inside it. As a drei `<Html>` Suspense
 * fallback it owned a second React root that was unmounted while the canvas was
 * still rendering, which threw `removeChild` on every load.
 */
export function ObjectViewerLoading() {
  const { active } = useProgress();
  if (!active) return null;

  return (
    <div
      role="status"
      aria-label="Loading 3D scene"
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
    >
      <Skeleton variant="cyber" className="h-[40%] w-[40%] rounded-full opacity-20" />
    </div>
  );
}
