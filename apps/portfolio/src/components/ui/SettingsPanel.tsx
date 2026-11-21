/**
 * SettingsPanel Component
 * Settings panel for performance and animation toggles
 */

import type { JSX } from "react";
import type { DeviceCapabilities } from "@aazucena/types";
import { Button, Switch } from "@aazucena/ui";
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
        <h3 className="micro-label text-foreground">Settings</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          aria-label="Close settings panel"
          data-testid="settings-panel-close"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="space-y-4">
        {/* Animations Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-foreground text-sm font-medium">
              Heavy Animations
            </div>
            <div className="text-muted-foreground text-xs">
              Enable 3D effects and particles
            </div>
          </div>
          <Switch
            aria-label="Heavy animations"
            checked={capabilities.canUseHeavyAnimations}
            onCheckedChange={(checked) =>
              onUpdateCapabilities({ canUseHeavyAnimations: checked })
            }
          />
        </div>

        {/* Performance Tier */}
        <div>
          <div className="text-foreground mb-2 text-sm font-medium">
            Performance Tier
          </div>
          <div className="flex gap-2">
            {(["low", "medium", "high"] as const).map((tier) => (
              <Button
                key={tier}
                variant={
                  capabilities.performanceTier === tier ? "default" : "outline"
                }
                size="sm"
                aria-pressed={capabilities.performanceTier === tier}
                onClick={() => onUpdateCapabilities({ performanceTier: tier })}
                data-testid={`perf-tier-${tier}`}
                className="flex-1"
              >
                {tier.charAt(0).toUpperCase() + tier.slice(1)}
              </Button>
            ))}
          </div>
          <div className="text-muted-foreground mt-2 text-xs">
            {capabilities.performanceTier === "low" &&
              "Optimized for lower-end devices"}
            {capabilities.performanceTier === "medium" &&
              "Balanced performance and quality"}
            {capabilities.performanceTier === "high" &&
              "Maximum visual quality"}
          </div>
        </div>

        {/* Device Info */}
        <div className="border-rule border-t pt-4">
          <div className="text-foreground mb-2 text-sm font-medium">
            Device Info
          </div>
          <div className="text-muted-foreground space-y-1 text-xs">
            <div className="flex justify-between">
              <span>Device Type:</span>
              <span className="text-foreground">
                {capabilities.isMobile ? "Mobile" : "Desktop"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Performance Tier:</span>
              <span className="text-foreground capitalize">
                {capabilities.performanceTier}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
