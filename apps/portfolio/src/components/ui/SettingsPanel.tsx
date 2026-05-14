/**
 * SettingsPanel Component
 * Settings panel for performance and animation toggles
 */

import type { JSX } from "react";
import type { DeviceCapabilities } from "@aazucena/types";
import { Switch } from "@aazucena/ui";
import { X } from "@aazucena/icons";

export interface SettingsPanelProps {
  onClose: () => void;
  capabilities: DeviceCapabilities;
  onUpdateCapabilities: (_capabilities: Partial<DeviceCapabilities>) => void;
}

export function SettingsPanel({
  onClose,
  capabilities,
  onUpdateCapabilities,
}: SettingsPanelProps): JSX.Element {
  return (
    <div
      data-testid="settings-panel"
      className="max-h-[85vh] overflow-y-auto p-6"
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">Settings</h3>
        <button
          onClick={onClose}
          className="text-white/60 transition-colors hover:text-white"
          aria-label="Close settings panel"
          data-testid="settings-panel-close"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-4">
        {/* Animations Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-white">
              Heavy Animations
            </div>
            <div className="text-xs text-white/60">
              Enable 3D effects and particles
            </div>
          </div>
          <Switch
            variant="cyber"
            checked={capabilities.canUseHeavyAnimations}
            onCheckedChange={(checked) =>
              onUpdateCapabilities({ canUseHeavyAnimations: checked })
            }
          />
        </div>

        {/* Performance Tier */}
        <div>
          <div className="mb-2 text-sm font-semibold text-white">
            Performance Tier
          </div>
          <div className="flex gap-2">
            {(["low", "medium", "high"] as const).map((tier) => (
              <button
                key={tier}
                onClick={() => onUpdateCapabilities({ performanceTier: tier })}
                data-testid={`perf-tier-${tier}`}
                className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium transition-all duration-300 ${
                  capabilities.performanceTier === tier
                    ? "bg-cyan-500 text-white"
                    : "bg-white/10 text-white/60 hover:bg-white/20 hover:text-white"
                }`}
              >
                {tier.charAt(0).toUpperCase() + tier.slice(1)}
              </button>
            ))}
          </div>
          <div className="mt-2 text-xs text-white/60">
            {capabilities.performanceTier === "low" &&
              "Optimized for lower-end devices"}
            {capabilities.performanceTier === "medium" &&
              "Balanced performance and quality"}
            {capabilities.performanceTier === "high" &&
              "Maximum visual quality"}
          </div>
        </div>

        {/* Device Info */}
        <div className="border-t border-white/10 pt-4">
          <div className="mb-2 text-sm font-semibold text-white">
            Device Info
          </div>
          <div className="space-y-1 text-xs text-white/60">
            <div className="flex justify-between">
              <span>Device Type:</span>
              <span className="text-white">
                {capabilities.isMobile ? "Mobile" : "Desktop"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Performance Tier:</span>
              <span className="text-white capitalize">
                {capabilities.performanceTier}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
