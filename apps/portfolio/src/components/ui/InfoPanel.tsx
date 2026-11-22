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

const compactRange = (altitude: string): string =>
  altitude.replace(/^(\S+) km - (\S+) km$/, "$1\u2013$2 km");

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
      className="focus-visible:outline-signal max-h-[calc(100vh-14rem)] overflow-y-auto focus-visible:outline-1 focus-visible:-outline-offset-2 sm:max-h-[85vh]"
    >
      <div className="border-rule flex items-center justify-between gap-3 border-b px-4 py-2">
        <h3 className="text-foreground text-sm font-semibold">
          Journey Through Earth's Atmosphere
        </h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          aria-label="Close info panel"
          data-testid="info-panel-close"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4 p-4">
        <div className="micro-label text-muted-foreground">Current Layer</div>
        <div className="border-signal bg-signal-faint rounded-control -mt-2 border p-3">
          <div className="flex items-baseline justify-between gap-3">
            <div className="text-foreground text-sm font-semibold">
              {info.title}
            </div>
            <div className="text-signal font-mono text-[11px] tracking-wider uppercase">
              {info.altitude.replace(" - ", " \u2013 ")}
            </div>
          </div>
          <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
            {info.description}
          </p>
        </div>

        <div>
          <div className="micro-label text-muted-foreground mb-2">
            All Atmospheric Layers
          </div>
          <ul className="divide-rule divide-y">
            {Object.entries(phaseInfo).map(([phase, data]) => (
              <li
                key={phase}
                aria-current={phase === currentPhase ? "true" : undefined}
                className="flex items-center gap-2 py-2 text-sm"
              >
                <span
                  aria-hidden="true"
                  className={`size-1.5 shrink-0 rounded-full ${
                    phase === currentPhase ? "bg-signal" : "bg-muted-foreground"
                  }`}
                />
                <span
                  className={
                    phase === currentPhase
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }
                >
                  {data.title}
                </span>
                <span className="text-muted-foreground ml-auto font-mono text-[11px]">
                  {compactRange(data.altitude)}
                </span>
              </li>
            ))}
          </ul>
        </div>

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
