/**
 * InfoPanel Component
 * Information panel about atmospheric layers
 */

import type { JSX } from "react";
import type { AtmosphericPhase } from "@aazucena/types";
import { X } from "@aazucena/icons";
import { Button } from "@aazucena/ui";

export interface InfoPanelProps {
  onClose: () => void;
  currentPhase: AtmosphericPhase;
}

const phaseInfo: Record<
  AtmosphericPhase,
  { title: string; description: string; altitude: string }
> = {
  exosphere: {
    title: "Exosphere",
    description:
      "The outermost layer of Earth's atmosphere, extending into space. Where satellites orbit and the atmosphere merges with the vacuum of space.",
    altitude: "700 km - 10,000 km",
  },
  thermosphere: {
    title: "Thermosphere",
    description:
      "Home to the aurora borealis and aurora australis. The International Space Station orbits in this layer where temperatures can reach 2,500°C.",
    altitude: "80 km - 700 km",
  },
  mesosphere: {
    title: "Mesosphere",
    description:
      "The coldest layer of the atmosphere where meteors burn up. This is where we see shooting stars streak across the night sky.",
    altitude: "50 km - 80 km",
  },
  stratosphere: {
    title: "Stratosphere",
    description:
      "Contains the ozone layer that protects us from harmful UV radiation. Commercial airplanes fly in the lower stratosphere.",
    altitude: "12 km - 50 km",
  },
  troposphere: {
    title: "Troposphere",
    description:
      "The layer we live in! Where all weather occurs and where we find mountains, clouds, and most of Earth's air.",
    altitude: "0 km - 12 km",
  },
};

export function InfoPanel({
  onClose,
  currentPhase,
}: InfoPanelProps): JSX.Element {
  const info = phaseInfo[currentPhase];

  return (
    <div
      data-testid="info-panel"
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- scrollable pane must be keyboard-focusable
      tabIndex={0}
      role="region"
      aria-label="Atmospheric layers"
      className="focus-visible:outline-signal max-h-[calc(100vh-14rem)] overflow-y-auto p-4 focus-visible:outline-1 focus-visible:-outline-offset-2 sm:max-h-[85vh] sm:p-6"
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-foreground text-lg font-semibold">
          Journey Through Earth's Atmosphere
        </h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          aria-label="Close info panel"
          data-testid="info-panel-close"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="space-y-4">
        {/* Current Layer */}
        <div className="border-signal bg-signal-faint rounded-control border p-4">
          <div className="micro-label text-signal mb-1">Current Layer</div>
          <div className="text-foreground text-lg font-semibold">
            {info.title}
          </div>
          <div className="text-muted-foreground mt-1 text-xs">
            {info.altitude}
          </div>
        </div>

        {/* Description */}
        <div className="text-muted-foreground text-sm leading-relaxed">
          {info.description}
        </div>

        {/* All Layers */}
        <div className="border-rule border-t pt-4">
          <div className="micro-label text-muted-foreground mb-3">
            All Atmospheric Layers
          </div>
          <div className="space-y-2">
            {Object.entries(phaseInfo).map(([phase, data]) => (
              <div
                key={phase}
                aria-current={phase === currentPhase ? "true" : undefined}
                className={`rounded-control border p-2 transition-[border-color] ${
                  phase === currentPhase
                    ? "border-signal bg-signal-faint"
                    : "border-rule bg-state"
                }`}
              >
                <div
                  className={`text-sm font-medium ${
                    phase === currentPhase ? "text-signal" : "text-foreground"
                  }`}
                >
                  {data.title}
                </div>
                <div className="text-muted-foreground text-xs">
                  {data.altitude}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Tip */}
        <div className="border-rule bg-state rounded-control border p-3">
          <div className="text-muted-foreground text-center text-xs">
            <span className="sm:hidden">
              Swipe up/down to journey through Earth's atmosphere from space to
              the surface!
            </span>
            <span className="hidden sm:inline">
              Scroll to journey through Earth's atmosphere from space to the
              surface!
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
