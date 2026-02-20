/**
 * Atmospheric Colors Utilities
 * Dynamic background colors and phase calculations for atmospheric layers
 */

import type { AtmosphericPhase } from "~/config/animations";

interface AtmosphericColors {
  from: string;
  via: string;
  to: string;
}

export const atmosphericColors: Record<AtmosphericPhase, AtmosphericColors> = {
  exosphere: {
    from: "#000000",
    via: "#0a0a1a",
    to: "#1a1a2e",
  },
  thermosphere: {
    from: "#1a1a2e",
    via: "#2d1b4e",
    to: "#1e3a8a",
  },
  mesosphere: {
    from: "#1e3a8a",
    via: "#1e40af",
    to: "#1d4ed8",
  },
  stratosphere: {
    from: "#1d4ed8",
    via: "#2563eb",
    to: "#3b82f6",
  },
  troposphere: {
    from: "#38bdf8",
    via: "#7dd3fc",
    to: "#bae6fd",
  },
};

/**
 * Maps section progress to atmospheric phase
 */
export function getAtmosphericPhase(progress: number): AtmosphericPhase {
  if (progress < 0.5) return "exosphere";
  if (progress < 1.5) return "thermosphere";
  if (progress < 3.5) return "mesosphere";
  if (progress < 5.5) return "stratosphere";
  return "troposphere";
}

/**
 * Interpolates between two hex colors
 */
export function interpolateColor(
  color1: string,
  color2: string,
  factor: number,
): string {
  const hex1 = color1.replace("#", "");
  const hex2 = color2.replace("#", "");

  const r1 = parseInt(hex1.substring(0, 2), 16);
  const g1 = parseInt(hex1.substring(2, 4), 16);
  const b1 = parseInt(hex1.substring(4, 6), 16);

  const r2 = parseInt(hex2.substring(0, 2), 16);
  const g2 = parseInt(hex2.substring(2, 4), 16);
  const b2 = parseInt(hex2.substring(4, 6), 16);

  const r = Math.round(r1 + (r2 - r1) * factor);
  const g = Math.round(g1 + (g2 - g1) * factor);
  const b = Math.round(b1 + (b2 - b1) * factor);

  return `rgb(${r}, ${g}, ${b})`;
}

/**
 * Gets dynamic background gradient style based on section progress
 */
export function getBackgroundGradient(
  currentSection: number,
  scrollProgress: number,
): string {
  const progress = currentSection + scrollProgress;

  let fromColor: string, viaColor: string, toColor: string;

  if (progress < 0.5) {
    // Pure Exosphere
    fromColor = atmosphericColors.exosphere.from;
    viaColor = atmosphericColors.exosphere.via;
    toColor = atmosphericColors.exosphere.to;
  } else if (progress < 1) {
    // Transitioning Exosphere → Thermosphere
    const factor = (progress - 0.5) * 2;
    fromColor = interpolateColor(
      atmosphericColors.exosphere.from,
      atmosphericColors.thermosphere.from,
      factor,
    );
    viaColor = interpolateColor(
      atmosphericColors.exosphere.via,
      atmosphericColors.thermosphere.via,
      factor,
    );
    toColor = interpolateColor(
      atmosphericColors.exosphere.to,
      atmosphericColors.thermosphere.to,
      factor,
    );
  } else if (progress < 1.5) {
    // Pure Thermosphere
    fromColor = atmosphericColors.thermosphere.from;
    viaColor = atmosphericColors.thermosphere.via;
    toColor = atmosphericColors.thermosphere.to;
  } else if (progress < 2) {
    // Transitioning Thermosphere → Mesosphere
    const factor = (progress - 1.5) * 2;
    fromColor = interpolateColor(
      atmosphericColors.thermosphere.from,
      atmosphericColors.mesosphere.from,
      factor,
    );
    viaColor = interpolateColor(
      atmosphericColors.thermosphere.via,
      atmosphericColors.mesosphere.via,
      factor,
    );
    toColor = interpolateColor(
      atmosphericColors.thermosphere.to,
      atmosphericColors.mesosphere.to,
      factor,
    );
  } else if (progress < 3.5) {
    // Pure Mesosphere
    fromColor = atmosphericColors.mesosphere.from;
    viaColor = atmosphericColors.mesosphere.via;
    toColor = atmosphericColors.mesosphere.to;
  } else if (progress < 4) {
    // Transitioning Mesosphere → Stratosphere
    const factor = (progress - 3.5) * 2;
    fromColor = interpolateColor(
      atmosphericColors.mesosphere.from,
      atmosphericColors.stratosphere.from,
      factor,
    );
    viaColor = interpolateColor(
      atmosphericColors.mesosphere.via,
      atmosphericColors.stratosphere.via,
      factor,
    );
    toColor = interpolateColor(
      atmosphericColors.mesosphere.to,
      atmosphericColors.stratosphere.to,
      factor,
    );
  } else if (progress < 5.5) {
    // Pure Stratosphere
    fromColor = atmosphericColors.stratosphere.from;
    viaColor = atmosphericColors.stratosphere.via;
    toColor = atmosphericColors.stratosphere.to;
  } else if (progress < 6) {
    // Transitioning Stratosphere → Troposphere
    const factor = (progress - 5.5) * 2;
    fromColor = interpolateColor(
      atmosphericColors.stratosphere.from,
      atmosphericColors.troposphere.from,
      factor,
    );
    viaColor = interpolateColor(
      atmosphericColors.stratosphere.via,
      atmosphericColors.troposphere.via,
      factor,
    );
    toColor = interpolateColor(
      atmosphericColors.stratosphere.to,
      atmosphericColors.troposphere.to,
      factor,
    );
  } else {
    // Pure Troposphere
    fromColor = atmosphericColors.troposphere.from;
    viaColor = atmosphericColors.troposphere.via;
    toColor = atmosphericColors.troposphere.to;
  }

  return `linear-gradient(to bottom right, ${fromColor}, ${viaColor}, ${toColor})`;
}
