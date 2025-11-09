/**
 * SettingsPanel Component
 * Settings panel for performance and animation toggles
 */

import type { JSX } from 'react';
import type { DeviceCapabilities } from '../config';

export interface SettingsPanelProps {
  onClose: () => void;
  capabilities: DeviceCapabilities;
  onUpdateCapabilities: (capabilities: Partial<DeviceCapabilities>) => void;
}

export function SettingsPanel({ onClose, capabilities, onUpdateCapabilities }: SettingsPanelProps): JSX.Element {
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/20"
        onClick={onClose}
        aria-label="Close settings panel"
      />

      {/* Settings Panel */}
      <div className="fixed top-24 right-8 z-50 w-80 bg-black/40 backdrop-blur-lg border border-white/20 rounded-2xl p-6 animate-in fade-in slide-in-from-top-4 duration-300">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">Settings</h3>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
            aria-label="Close settings panel"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

      <div className="space-y-4">
        {/* Animations Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-white">Heavy Animations</div>
            <div className="text-xs text-white/60">Enable 3D effects and particles</div>
          </div>
          <button
            onClick={() => onUpdateCapabilities({
              canUseHeavyAnimations: !capabilities.canUseHeavyAnimations
            })}
            className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
              capabilities.canUseHeavyAnimations ? 'bg-cyan-500' : 'bg-white/20'
            }`}
          >
            <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
              capabilities.canUseHeavyAnimations ? 'translate-x-6' : 'translate-x-0'
            }`} />
          </button>
        </div>

        {/* Performance Tier */}
        <div>
          <div className="text-sm font-semibold text-white mb-2">Performance Tier</div>
          <div className="flex gap-2">
            {(['low', 'medium', 'high'] as const).map((tier) => (
              <button
                key={tier}
                onClick={() => onUpdateCapabilities({ performanceTier: tier })}
                className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 ${
                  capabilities.performanceTier === tier
                    ? 'bg-cyan-500 text-white'
                    : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
                }`}
              >
                {tier.charAt(0).toUpperCase() + tier.slice(1)}
              </button>
            ))}
          </div>
          <div className="mt-2 text-xs text-white/60">
            {capabilities.performanceTier === 'low' && 'Optimized for lower-end devices'}
            {capabilities.performanceTier === 'medium' && 'Balanced performance and quality'}
            {capabilities.performanceTier === 'high' && 'Maximum visual quality'}
          </div>
        </div>

        {/* Device Info */}
        <div className="pt-4 border-t border-white/10">
          <div className="text-sm font-semibold text-white mb-2">Device Info</div>
          <div className="space-y-1 text-xs text-white/60">
            <div className="flex justify-between">
              <span>Device Type:</span>
              <span className="text-white">{capabilities.isMobile ? 'Mobile' : 'Desktop'}</span>
            </div>
            <div className="flex justify-between">
              <span>Performance Tier:</span>
              <span className="text-white capitalize">{capabilities.performanceTier}</span>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
