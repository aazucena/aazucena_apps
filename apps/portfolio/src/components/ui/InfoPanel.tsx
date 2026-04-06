/**
 * InfoPanel Component
 * Information panel about atmospheric layers
 */

import type { JSX } from "react";
import type { AtmosphericPhase } from "@aazucena/types";
import { X } from "@aazucena/icons";

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
    <div className="max-h-[85vh] overflow-y-auto p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">
          Journey Through Earth's Atmosphere
        </h3>
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
          <div className="mb-1 text-sm font-semibold text-cyan-400">
            Current Layer
          </div>
          <div className="text-lg font-bold text-white">{info.title}</div>
          <div className="mt-1 text-xs text-white/60">{info.altitude}</div>
        </div>

        {/* Description */}
        <div>
          <div className="text-sm leading-relaxed text-white/80">
            {info.description}
          </div>
        </div>

        {/* All Layers */}
        <div className="border-t border-white/10 pt-4">
          <div className="mb-3 text-sm font-semibold text-white">
            All Atmospheric Layers
          </div>
          <div className="space-y-2">
            {Object.entries(phaseInfo).map(([phase, data]) => (
              <div
                key={phase}
                className={`rounded-lg p-2 transition-all ${
                  phase === currentPhase
                    ? "border border-cyan-400/30 bg-cyan-500/20"
                    : "border border-white/10 bg-white/5"
                }`}
              >
                <div
                  className={`text-sm font-medium ${
                    phase === currentPhase ? "text-cyan-400" : "text-white"
                  }`}
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
            Scroll to journey through Earth's atmosphere from space to the
            surface!
          </div>
        </div>
      </div>
    </div>
  );
}
