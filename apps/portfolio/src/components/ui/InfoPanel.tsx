/**
 * InfoPanel Component
 * Information panel about atmospheric layers
 */

import type { JSX } from 'react';
import type { AtmosphericPhase } from '~/config/animations';

export interface InfoPanelProps {
  onClose: () => void;
  currentPhase: AtmosphericPhase;
}

const phaseInfo: Record<AtmosphericPhase, { title: string; description: string; altitude: string }> = {
  exosphere: {
    title: 'Exosphere',
    description: 'The outermost layer of Earth\'s atmosphere, extending into space. Where satellites orbit and the atmosphere merges with the vacuum of space.',
    altitude: '700 km - 10,000 km'
  },
  thermosphere: {
    title: 'Thermosphere',
    description: 'Home to the aurora borealis and aurora australis. The International Space Station orbits in this layer where temperatures can reach 2,500°C.',
    altitude: '80 km - 700 km'
  },
  mesosphere: {
    title: 'Mesosphere',
    description: 'The coldest layer of the atmosphere where meteors burn up. This is where we see shooting stars streak across the night sky.',
    altitude: '50 km - 80 km'
  },
  stratosphere: {
    title: 'Stratosphere',
    description: 'Contains the ozone layer that protects us from harmful UV radiation. Commercial airplanes fly in the lower stratosphere.',
    altitude: '12 km - 50 km'
  },
  troposphere: {
    title: 'Troposphere',
    description: 'The layer we live in! Where all weather occurs and where we find mountains, clouds, and most of Earth\'s air.',
    altitude: '0 km - 12 km'
  }
};

export function InfoPanel({ onClose, currentPhase }: InfoPanelProps): JSX.Element {
  const info = phaseInfo[currentPhase];

  return (
    <div className="p-6 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">Journey Through Earth's Atmosphere</h3>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
            aria-label="Close info panel"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

      <div className="space-y-4">
        {/* Current Layer */}
        <div className="p-4 bg-cyan-500/20 border border-cyan-400/30 rounded-xl">
          <div className="text-sm font-semibold text-cyan-400 mb-1">Current Layer</div>
          <div className="text-lg font-bold text-white">{info.title}</div>
          <div className="text-xs text-white/60 mt-1">{info.altitude}</div>
        </div>

        {/* Description */}
        <div>
          <div className="text-sm text-white/80 leading-relaxed">{info.description}</div>
        </div>

        {/* All Layers */}
        <div className="pt-4 border-t border-white/10">
          <div className="text-sm font-semibold text-white mb-3">All Atmospheric Layers</div>
          <div className="space-y-2">
            {Object.entries(phaseInfo).map(([phase, data]) => (
              <div
                key={phase}
                className={`p-2 rounded-lg transition-all ${
                  phase === currentPhase
                    ? 'bg-cyan-500/20 border border-cyan-400/30'
                    : 'bg-white/5 border border-white/10'
                }`}
              >
                <div className={`text-sm font-medium ${
                  phase === currentPhase ? 'text-cyan-400' : 'text-white'
                }`}>
                  {data.title}
                </div>
                <div className="text-xs text-white/60">{data.altitude}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Tip */}
        <div className="p-3 bg-white/5 rounded-lg border border-white/10">
          <div className="text-xs text-white/60 text-center">
            Scroll to journey through Earth's atmosphere from space to the surface!
          </div>
        </div>
      </div>
    </div>
  );
}
