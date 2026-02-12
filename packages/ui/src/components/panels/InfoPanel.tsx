/**
 * InfoPanel Component
 * Information panel about atmospheric layers
 */

import type { JSX } from 'react';
import type { AtmosphericPhase } from '@aazucena/types';
import { cn } from '@aazucena/utils';
import { X } from '@aazucena/icons';
import { ATMOSPHERIC_LAYERS } from '@aazucena/constants';

export interface InfoPanelProps {
  onClose: () => void;
  currentPhase: AtmosphericPhase;
  className?: string;
}

export function InfoPanel({ onClose, currentPhase, className }: InfoPanelProps): JSX.Element {
  const info = ATMOSPHERIC_LAYERS[currentPhase] || ATMOSPHERIC_LAYERS.exosphere;

  return (
    <div className={cn('max-h-[85vh] overflow-y-auto p-6', className)}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">Journey Through Earth's Atmosphere</h3>
        <button
          onClick={onClose}
          className="text-white/60 transition-colors hover:text-white"
          aria-label="Close info panel"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-4">
        {/* Current Layer */}
        <div className="rounded-xl border border-cyan-400/30 bg-cyan-500/20 p-4">
          <div className="mb-1 text-sm font-semibold text-cyan-400">Current Layer</div>
          <div className="text-lg font-bold text-white">{info.title}</div>
          <div className="mt-1 text-xs text-white/60">{info.altitude}</div>
        </div>

        {/* Description */}
        <div>
          <div className="text-sm leading-relaxed text-white/80">{info.description}</div>
        </div>

        {/* All Layers */}
        <div className="border-t border-white/10 pt-4">
          <div className="mb-3 text-sm font-semibold text-white">All Atmospheric Layers</div>
          <div className="space-y-2">
            {Object.entries(ATMOSPHERIC_LAYERS).map(([phase, data]) => (
              <div
                key={phase}
                className={cn(
                  'rounded-lg p-2 transition-all',
                  phase === currentPhase
                    ? 'border border-cyan-400/30 bg-cyan-500/20'
                    : 'border border-white/10 bg-white/5',
                )}
              >
                <div
                  className={cn(
                    'text-sm font-medium',
                    phase === currentPhase ? 'text-cyan-400' : 'text-white',
                  )}
                >
                  {data.title}
                </div>
                <div className="text-xs text-white/60">{data.altitude}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Tip */}
        <div className="rounded-lg border border-white/10 bg-white/5 p-3">
          <div className="text-center text-xs text-white/60">
            Scroll to journey through Earth's atmosphere from space to the surface!
          </div>
        </div>
      </div>
    </div>
  );
}
