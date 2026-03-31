'use client';

import * as React from 'react';
import { Badge, Status, StatusDot } from '@aazucena/ui';
import { useObjectViewer } from './context';
import { ANIMATION_OBJECT_REGISTRY } from '../objects/registry';

/**
 * ObjectViewerHUD - Top-left metadata and bottom-left status info
 */
export function ObjectViewerHUD() {
  const { objectKey, autoRotate, actionStatus, isSlowMo } = useObjectViewer();
  const registryEntry = ANIMATION_OBJECT_REGISTRY[objectKey];

  if (!registryEntry) return null;

  return (
    <>
      {/* Top Left: Metadata */}
      <div className="absolute top-6 left-6 z-10 pointer-events-none">
        <div className="flex flex-col gap-3">
          <h2 className="text-left text-zinc-900 dark:text-zinc-100 font-bold text-3xl uppercase tracking-tighter drop-shadow-lg">
            {objectKey.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
          </h2>
          <div className="flex gap-2">
            <Badge variant="cyber" size="sm" className="bg-blue-500/10">
              COST_TIER_{registryEntry.cost}
            </Badge>
            <Badge variant="cyber" size="sm" className="bg-zinc-500/10">
              LAYER: {registryEntry.layer.toUpperCase()}
            </Badge>
          </div>
        </div>
      </div>

      {/* Bottom Left: Interaction Status */}
      <div className="absolute bottom-6 left-6 z-10 pointer-events-none">
        <Status variant="cyber" className="bg-transparent border-none p-0 gap-3">
          <div className="flex items-center gap-2">
            <StatusDot
              state={actionStatus ? 'loading' : autoRotate ? 'intel' : 'neutral'}
              size="xs"
              animated={!!actionStatus || autoRotate}
              pulse={!!actionStatus || autoRotate}
            />
            <span className="text-zinc-500 text-[10px] font-mono uppercase tracking-widest">
              System_Status: {actionStatus || (autoRotate ? 'Orbiting' : 'Manual_Inspect')}
              {isSlowMo && ' • SLOW_MO_ACTIVE'}
            </span>
          </div>
          <p className="text-zinc-400 dark:text-zinc-600 text-[9px] font-mono uppercase tracking-widest ml-4 opacity-60">
            [Scroll]: Zoom • [Drag]: Rotate • [R-Click]: Pan
          </p>
        </Status>
      </div>
    </>
  );
}
