/**
 * AtmosphericOverlays Component
 * Renders atmospheric overlays based on the current atmospheric layer
 */

import type { JSX } from "react";
import type { AtmosphericPhase } from '~/config/animations';

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

    case "thermosphere":
      return (
        <>
          {/* Subtle dark base for contrast with aurora */}
          <div className="fixed inset-0 bg-black/5 z-10 transition-opacity duration-1000" />

          {/* Aurora-inspired gradient overlay (green/purple tints) */}
          <div
            className="fixed inset-0 z-30 transition-opacity duration-1000 ease-in-out"
            style={{
              background:
                "radial-gradient(ellipse at top, rgba(6, 255, 165, 0.03) 0%, rgba(157, 78, 221, 0.02) 50%, transparent 100%)",
            }}
          />
        </>
      );

    case "exosphere":
      // Deep space - minimal overlay to let Milky Way and stars shine
      return (
        <div className="fixed inset-0 bg-black/5 z-10 transition-opacity duration-1000" />
      );

    default:
      return null;
  }
}
