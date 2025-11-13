/**
 * AtmosphericOverlays Component
 * Renders atmospheric overlays based on the current atmospheric layer
 */

import type { JSX } from "react";
import type { AtmosphericPhase } from "../config";

interface AtmosphericOverlaysProps {
  atmosphericLayer: AtmosphericPhase;
}

export default function AtmosphericOverlays({
  atmosphericLayer,
}: AtmosphericOverlaysProps): JSX.Element | null {
  switch (atmosphericLayer) {
    case "troposphere":
      return (
        <div className="fixed inset-0 bg-black/40 z-10 transition-opacity duration-1000" />
      );

    case "stratosphere":
      return (
        <>
          <div className="fixed inset-0 bg-black/25 z-10 transition-opacity duration-1000" />
          <div
            className="fixed inset-0 z-30 transition-opacity duration-1000 ease-in-out"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(0, 0, 0, 0.45) 0%, rgba(0, 0, 0, 0.15) 95%, transparent 100%)",
            }}
          />
        </>
      );

    case "mesosphere":
      return (
        <div className="fixed inset-0 bg-black/10 z-10 transition-opacity duration-1000" />
      );

    default:
      return null;
  }
}
